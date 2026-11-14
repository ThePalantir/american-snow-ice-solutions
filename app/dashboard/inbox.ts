import "server-only";

import { compile } from "html-to-text";

type ReceivedEmail = {
  id: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string | null;
  created_at: string;
  attachments?: { id: string; filename: string | null; content_disposition?: string | null }[];
};

type ReceivedEmailDetail = ReceivedEmail & { text: string | null; html: string | null };
type ReceivedEmailList = { data: ReceivedEmail[]; has_more: boolean };

const receivingUrl = "https://api.resend.com/emails/receiving";
const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const emailAddress = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
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

export function inboxConfiguration() {
  const key = process.env.RESEND_RECEIVING_API_KEY?.trim();
  const recipients = (process.env.RESEND_INBOX_RECIPIENTS ?? "").split(",")
    .map((address) => address.trim().toLowerCase()).filter(Boolean);
  if (!key || !recipients.length || recipients.some((address) => !emailAddress.test(address))) return null;
  return { key, recipients: new Set(recipients) };
}

type Configuration = NonNullable<ReturnType<typeof inboxConfiguration>>;

async function receivingFetch<T>(key: string, url: string): Promise<T | null> {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${key}` },
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(8_000),
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
  return [...message.to, ...(message.cc ?? []), ...(message.bcc ?? [])].some((recipient) => {
    const address = /<([^<>]+)>\s*$/.exec(recipient)?.[1] ?? recipient;
    return config.recipients.has(address.trim().toLowerCase());
  });
}

function summarize(message: ReceivedEmail) {
  return {
    id: message.id,
    from: message.from,
    to: message.to,
    subject: message.subject?.trim() || "(No subject)",
    receivedAt: message.created_at,
    attachments: (message.attachments ?? []).filter((item) => item.content_disposition !== "inline")
      .map(({ id, filename }) => ({ id, filename })),
  };
}

export function messageId(value: unknown): string | undefined {
  return typeof value === "string" && uuid.test(value) ? value : undefined;
}

export async function listMessages(config: Configuration, after?: string) {
  const query = new URLSearchParams({ limit: "30" });
  if (after) query.set("after", after);
  const page = await receivingFetch<ReceivedEmailList>(config.key, `${receivingUrl}?${query}`);
  if (!page) throw new Error("Receiving API returned no list");
  return {
    messages: page.data.filter((email) => messageId(email.id) && belongsToInbox(email, config)).map(summarize),
    next: page.has_more ? messageId(page.data.at(-1)?.id) : undefined,
  };
}

export async function getMessage(config: Configuration, id: string) {
  const email = await receivingFetch<ReceivedEmailDetail>(config.key, `${receivingUrl}/${id}?html_format=cid`);
  if (!email || email.id !== id || !belongsToInbox(email, config)) return null;
  const plain = email.text?.trim();
  const text = plain || htmlToText((email.html ?? "").slice(0, bodyLimit));
  const truncated = text.length > bodyLimit || (!plain && (email.html?.length ?? 0) > bodyLimit);
  return { ...summarize(email), text: text.slice(0, bodyLimit), truncated };
}

const receivedDate = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium", timeStyle: "short", timeZone: "America/New_York",
});

export function formatReceivedAt(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : `${receivedDate.format(date)} ET`;
}
