import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { randomUUID } from "node:crypto";
import { quoteInboxAddress, quoteSubjectPrefix } from "../../quote-email";
import { saveInquiry } from "../../inquiry-store";

export const runtime = "nodejs";

const recipient = "Piechotagrpinc@gmail.com";
const rateLimitWindowMs = 15 * 60 * 1000;
const rateLimitMaxRequests = 5;
const requestLog = new Map<string, number[]>();

type QuoteRequest = {
  company: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  propertyType?: string;
  service?: string;
  details?: string;
  _honey?: string;
};

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

function clientIp(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const recentRequests = (requestLog.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < rateLimitWindowMs,
  );

  if (recentRequests.length >= rateLimitMaxRequests) {
    requestLog.set(ip, recentRequests);
    return true;
  }

  recentRequests.push(now);
  requestLog.set(ip, recentRequests);
  return false;
}

export async function POST(request: NextRequest) {
  if (isRateLimited(clientIp(request))) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let raw: Partial<QuoteRequest>;

  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (clean(raw._honey, 200)) {
    return NextResponse.json({ success: true });
  }

  const submission: QuoteRequest = {
    company: clean(raw.company, 150),
    name: clean(raw.name, 150),
    email: clean(raw.email, 254),
    phone: clean(raw.phone, 50),
    location: clean(raw.location, 300),
    propertyType: clean(raw.propertyType, 100),
    service: clean(raw.service, 100),
    details: clean(raw.details, 3000),
  };

  const requiredValues = [
    submission.company,
    submission.name,
    submission.email,
    submission.phone,
    submission.location,
  ];
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email);

  if (requiredValues.some((value) => !value) || !validEmail) {
    return NextResponse.json(
      { error: "Please complete all required fields." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.error("Quote email is not configured: RESEND_API_KEY or RESEND_FROM_EMAIL is missing.");
    return NextResponse.json(
      { error: "Email delivery is temporarily unavailable." },
      { status: 503 },
    );
  }

  const rows = [
    ["Company", submission.company],
    ["Primary contact", submission.name],
    ["Work email", submission.email],
    ["Phone", submission.phone],
    ["Property address or portfolio area", submission.location],
    ["Property type", submission.propertyType || "Not provided"],
    ["Services needed", submission.service || "Not provided"],
    ["Property details", submission.details || "Not provided"],
  ];
  const htmlRows = rows.map(([label, value]) => (
    `<tr><th style="padding:10px 14px;text-align:left;vertical-align:top;border-bottom:1px solid #d7e0e5">${escapeHtml(label)}</th>`
    + `<td style="padding:10px 14px;border-bottom:1px solid #d7e0e5;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`
  )).join("");
  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n\n");

  const resend = new Resend(apiKey);
  const message = {
    from,
    replyTo: submission.email,
    subject: `${quoteSubjectPrefix}${submission.company}`,
    html: `<h1>New risk consultation request</h1><table style="border-collapse:collapse">${htmlRows}</table>`,
    text,
  };
  const { data, error } = await resend.emails.send({ ...message, to: [recipient] });

  if (error) {
    console.error("Resend rejected a quote submission:", error);
    return NextResponse.json(
      { error: "The request could not be delivered." },
      { status: 502 },
    );
  }

  try {
    saveInquiry({ id: randomUUID(), contact: submission.email, subject: message.subject, receivedAt: new Date().toISOString(), text });
  } catch {
    console.error("Could not archive the website inquiry in SQLite.");
  }

  const inboxAddress = quoteInboxAddress(process.env.RESEND_QUOTE_INBOX_ADDRESS);
  if (inboxAddress) {
    // Keep the owner's main mailbox independent of the dashboard copy. The
    // copy has its own To header for Resend Receiving's recipient filter.
    try {
      const copyOptions = {
        idempotencyKey: data?.id ? `website-quote-copy/${data.id}` : undefined,
        signal: AbortSignal.timeout(5_000),
      };
      const copy = await resend.emails.send({ ...message, to: [inboxAddress] }, copyOptions);
      if (copy.error) console.error("Resend did not accept the website inquiry copy:", copy.error.name);
    } catch {
      console.error("The website inquiry copy could not reach Resend.");
    }
  }

  return NextResponse.json({ success: true, providerAccepted: true });
}
