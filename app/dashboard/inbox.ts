import "server-only";

import { compile } from "html-to-text";
import { inquiryIdHeader, quoteInboxAddress, quoteSubjectPrefix } from "../quote-email";
import { findInquiry, importCursor, saveImportCursor, saveInquiry, type Inquiry } from "../inquiry-store";

type ReceivedEmail = {
  id: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string | null;
  created_at: string;
};

type ReceivedAttachment = { filename: string | null; content_disposition?: string | null };
type ReceivedEmailDetail = ReceivedEmail & {
  text: string | null;
  html: string | null;
  headers?: Record<string, string>;
  attachments?: ReceivedAttachment[];
};
type ReceivedEmailList = { data: ReceivedEmail[]; has_more: boolean };

const receivingUrl = "https://api.resend.com/emails/receiving";
const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const bodyLimit = 250_000;
const responseLimit = 8 * 1024 * 1024;
const htmlToText = compile({
  wordwrap: false,
  limits: { maxDepth: 80 },
  selectors: [
    { selector: "a", options: { ignoreHref: true } },
    ...["img", "head", "style", "script", "svg", "iframe", "object", "template"].map((selector) => ({
      selector, format: "skip",
    })),
  ],
});

function inboxConfiguration() {
  const key = process.env.RESEND_RECEIVING_API_KEY?.trim();
  const address = quoteInboxAddress(process.env.RESEND_QUOTE_INBOX_ADDRESS);
  return key && address ? { key, address } : null;
}

type Configuration = NonNullable<ReturnType<typeof inboxConfiguration>>;

async function receivingFetch<T>(key: string, url: string, signal: AbortSignal): Promise<T | null> {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${key}` },
    cache: "no-store",
    redirect: "error",
    signal,
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Receiving API unavailable (${response.status})`);
  const reader = response.body?.getReader();
  if (!reader) throw new Error("Receiving API returned no response body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > responseLimit) {
      await reader.cancel();
      throw new Error("Receiving API response exceeded the size limit");
    }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks, size).toString("utf8")) as T;
}

function belongsToInbox(message: ReceivedEmail, config: Configuration) {
  if (!message.subject?.startsWith(quoteSubjectPrefix)) return false;
  return [...message.to, ...(message.cc ?? []), ...(message.bcc ?? [])].some((recipient) => {
    const address = /<([^<>]+)>\s*$/.exec(recipient)?.[1] ?? recipient;
    return config.address === address.trim().toLowerCase();
  });
}

export function messageId(value: unknown): string | undefined {
  return typeof value === "string" && uuid.test(value) ? value : undefined;
}

async function importMessage(config: Configuration, id: string, signal: AbortSignal): Promise<Inquiry | null> {
  const email = await receivingFetch<ReceivedEmailDetail>(config.key, `${receivingUrl}/${id}?html_format=cid`, signal);
  if (!email || email.id !== id || !belongsToInbox(email, config)) return null;
  const receivedAt = new Date(email.created_at);
  if (Number.isNaN(receivedAt.getTime())) return null;
  const headers = Object.fromEntries(Object.entries(email.headers ?? {}).map(([key, value]) => [key.toLowerCase(), value]));
  const localId = messageId(headers[inquiryIdHeader.toLowerCase()]);
  const local = localId && findInquiry(localId);
  if (local) return local;
  const plain = email.text?.trim();
  const text = plain || htmlToText((email.html ?? "").slice(0, bodyLimit));
  const contact = headers["reply-to"] || /^Work email:\s*([^\s]+@[^\s]+)\s*$/m.exec(text)?.[1] || email.from;
  const inquiry = {
    id,
    subject: email.subject!.trim(),
    contact: contact.slice(0, 512),
    receivedAt: receivedAt.toISOString(),
    text: text.slice(0, bodyLimit),
    truncated: text.length > bodyLimit || (!plain && (email.html?.length ?? 0) > bodyLimit),
    attachments: (email.attachments ?? []).filter((item) => item.content_disposition !== "inline")
      .map((item) => item.filename || "Unnamed attachment"),
  };
  saveInquiry(inquiry);
  return inquiry;
}

let importing: Promise<boolean> | undefined;

export function importOlderInquiries() {
  if (!importing) importing = importNextBatch().finally(() => { importing = undefined; });
  return importing;
}

async function importNextBatch() {
  const config = inboxConfiguration();
  if (!config) return false;
  const cursor = importCursor(config.address);
  if (cursor === null) return false;
  const signal = AbortSignal.timeout(5_000);
  const query = new URLSearchParams({ limit: "4" });
  if (cursor) query.set("after", cursor);
  const page = await receivingFetch<ReceivedEmailList>(config.key, `${receivingUrl}?${query}`, signal);
  if (!page) throw new Error("Receiving API returned no list");
  for (const email of page.data) {
    const id = messageId(email.id);
    if (id && belongsToInbox(email, config) && !findInquiry(id)) await importMessage(config, id, signal);
    if (id) saveImportCursor(config.address, id);
  }
  if (page.has_more && !messageId(page.data.at(-1)?.id)) throw new Error("Resend returned an invalid inquiry cursor");
  if (!page.has_more) saveImportCursor(config.address, null);
  return page.has_more;
}

export async function getInquiry(id: string) {
  const saved = findInquiry(id);
  if (saved) return saved;
  const config = inboxConfiguration();
  return config ? await importMessage(config, id, AbortSignal.timeout(5_000)) : null;
}

const receivedDate = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium", timeStyle: "short", timeZone: "America/New_York",
});

export function formatReceivedAt(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : `${receivedDate.format(date)} ET`;
}
