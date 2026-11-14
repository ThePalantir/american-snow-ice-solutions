import "server-only";

import { mkdirSync, openSync, closeSync } from "node:fs";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

export type Inquiry = {
  id: string;
  subject: string;
  contact: string;
  receivedAt: string;
  text: string;
  archived: number;
};

let database: DatabaseSync | undefined;
const pageSize = 30;
const day = 24 * 60 * 60 * 1000;

function db() {
  if (database) return database;
  const directory = process.env.ASIS_INQUIRY_DATA_DIR || join(process.cwd(), "data", "inquiries");
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const path = join(directory, "inquiries.sqlite");
  closeSync(openSync(path, "a", 0o600));
  const connection = new DatabaseSync(path, { timeout: 1_000 });
  try {
    connection.exec(`
      CREATE TABLE IF NOT EXISTS website_inquiries (
        id TEXT PRIMARY KEY,
        subject TEXT NOT NULL,
        contact TEXT NOT NULL,
        receivedAt TEXT NOT NULL,
        text TEXT NOT NULL,
        archived INTEGER NOT NULL DEFAULT 0 CHECK (archived IN (0, 1))
      ) STRICT;
      CREATE INDEX IF NOT EXISTS website_inquiries_inbox ON website_inquiries (archived, receivedAt DESC, id DESC);
      CREATE INDEX IF NOT EXISTS website_inquiries_recent ON website_inquiries (receivedAt DESC);
    `);
    database = connection;
    return connection;
  } catch (error) {
    connection.close();
    throw error;
  }
}

export function saveInquiry(inquiry: Omit<Inquiry, "archived">) {
  return db().prepare(`
    INSERT INTO website_inquiries (id, subject, contact, receivedAt, text) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO NOTHING
  `).run(inquiry.id, inquiry.subject, inquiry.contact, inquiry.receivedAt, inquiry.text);
}

export function findInquiry(id: string) {
  return db().prepare("SELECT id, subject, contact, receivedAt, text, archived FROM website_inquiries WHERE id = ?").get(id) as Inquiry | undefined;
}

export function inquiryPage(archived: boolean, after?: string, now = Date.now()) {
  const connection = db();
  const state = Number(archived);
  const cursor = after ? connection.prepare("SELECT id, receivedAt FROM website_inquiries WHERE id = ?").get(after) : undefined;
  const summary = cursor
    ? connection.prepare(`SELECT id, subject, contact, receivedAt FROM website_inquiries
      WHERE archived = ? AND (receivedAt, id) < (?, ?) ORDER BY receivedAt DESC, id DESC LIMIT ?`).all(state, cursor.receivedAt, cursor.id, pageSize + 1)
    : connection.prepare(`SELECT id, subject, contact, receivedAt FROM website_inquiries
      WHERE archived = ? ORDER BY receivedAt DESC, id DESC LIMIT ?`).all(state, pageSize + 1);
  const messages = summary.slice(0, pageSize) as Pick<Inquiry, "id" | "subject" | "contact" | "receivedAt">[];
  const counts = connection.prepare(`SELECT
    COUNT(CASE WHEN receivedAt >= ? THEN 1 END) AS week,
    COUNT(*) AS month FROM website_inquiries WHERE receivedAt >= ?`).get(
    new Date(now - 7 * day).toISOString(), new Date(now - 30 * day).toISOString(),
  ) as { week: number; month: number };
  return { messages, counts, next: summary.length > pageSize ? messages.at(-1)?.id : undefined };
}

export function setInquiryArchived(id: string, archived: boolean) {
  return db().prepare("UPDATE website_inquiries SET archived = ? WHERE id = ?").run(Number(archived), id).changes !== 0;
}
