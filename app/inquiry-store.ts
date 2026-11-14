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
  attachments?: string[];
  truncated?: boolean;
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
      CREATE TABLE IF NOT EXISTS inquiries (
        id TEXT PRIMARY KEY,
        subject TEXT NOT NULL,
        contact TEXT NOT NULL,
        receivedAt TEXT NOT NULL,
        text TEXT NOT NULL,
        attachments TEXT NOT NULL,
        truncated INTEGER NOT NULL
      ) STRICT;
      CREATE INDEX IF NOT EXISTS inquiries_recent ON inquiries (receivedAt DESC, id DESC);
      CREATE TABLE IF NOT EXISTS inquiry_imports (
        address TEXT PRIMARY KEY,
        cursor TEXT
      ) STRICT;
    `);
    database = connection;
    return connection;
  } catch (error) {
    connection.close();
    throw error;
  }
}

export function saveInquiry(inquiry: Inquiry) {
  return db().prepare(`
    INSERT INTO inquiries (id, subject, contact, receivedAt, text, attachments, truncated) VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO NOTHING
  `).run(inquiry.id, inquiry.subject, inquiry.contact, inquiry.receivedAt, inquiry.text,
    JSON.stringify(inquiry.attachments ?? []), Number(inquiry.truncated ?? false));
}

export function findInquiry(id: string) {
  const row = db().prepare("SELECT * FROM inquiries WHERE id = ?").get(id) as (Omit<Inquiry, "attachments" | "truncated"> & { attachments: string; truncated: number }) | undefined;
  return row && { ...row, attachments: JSON.parse(row.attachments) as string[], truncated: row.truncated === 1 };
}

export function inquiryPage(after?: string, now = Date.now()) {
  const connection = db();
  const cursor = after ? connection.prepare("SELECT id, receivedAt FROM inquiries WHERE id = ?").get(after) : undefined;
  const summary = cursor
    ? connection.prepare(`SELECT id, subject, contact, receivedAt FROM inquiries
      WHERE (receivedAt, id) < (?, ?) ORDER BY receivedAt DESC, id DESC LIMIT ?`).all(cursor.receivedAt, cursor.id, pageSize + 1)
    : connection.prepare(`SELECT id, subject, contact, receivedAt FROM inquiries
      ORDER BY receivedAt DESC, id DESC LIMIT ?`).all(pageSize + 1);
  const messages = summary.slice(0, pageSize) as Pick<Inquiry, "id" | "subject" | "contact" | "receivedAt">[];
  const counts = connection.prepare(`SELECT
    COUNT(CASE WHEN receivedAt >= ? THEN 1 END) AS week,
    COUNT(*) AS month FROM inquiries WHERE receivedAt >= ?`).get(
    new Date(now - 7 * day).toISOString(), new Date(now - 30 * day).toISOString(),
  ) as { week: number; month: number };
  return { messages, counts, next: summary.length > pageSize ? messages.at(-1)?.id : undefined };
}

export function importCursor(address: string) {
  const row = db().prepare("SELECT cursor FROM inquiry_imports WHERE address = ?").get(address);
  return row?.cursor as string | null | undefined;
}

export function saveImportCursor(address: string, cursor: string | null) {
  db().prepare(`INSERT INTO inquiry_imports (address, cursor) VALUES (?, ?)
    ON CONFLICT(address) DO UPDATE SET cursor = excluded.cursor`).run(address, cursor);
}
