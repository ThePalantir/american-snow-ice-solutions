import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const sessionCookie = "__Host-asis_owner";
export const sessionSeconds = 8 * 60 * 60;
const attemptWindowMs = 15 * 60 * 1000;

type Attempts = { count: number; resetAt: number };
type DashboardState = {
  sessions: Map<string, number>;
  attempts: Map<string, Attempts>;
};

// Next can load the login handler and the pages in different bundles of the same
// standalone process. Share state across those bundles, including revocations.
const runtime = globalThis as typeof globalThis & { asisDashboardState?: DashboardState };
const state = runtime.asisDashboardState ??= { sessions: new Map(), attempts: new Map() };

const hash = (value: string) => createHash("sha256").update(value).digest();

function credentials() {
  const username = process.env.DASHBOARD_USERNAME;
  const password = process.env.DASHBOARD_PASSWORD;
  return username && password && password.length >= 16 && password.length <= 256 ? { username, password } : null;
}

export function loginConfigured() {
  return Boolean(credentials());
}

export function checkCredentials(username: string, password: string) {
  const configured = credentials();
  if (!configured) return false;
  const usernameMatches = timingSafeEqual(hash(username), hash(configured.username));
  const passwordMatches = timingSafeEqual(hash(password), hash(configured.password));
  return usernameMatches && passwordMatches;
}

export function reserveLoginAttempt(source: string) {
  const now = Date.now();
  for (const [key, attempts] of state.attempts) {
    if (attempts.resetAt <= now) state.attempts.delete(key);
  }
  const all = state.attempts.get("all") ?? { count: 0, resetAt: now + attemptWindowMs };
  const key = `source:${source}`;
  const client = state.attempts.get(key) ?? { count: 0, resetAt: now + attemptWindowMs };
  if (all.count >= 100 || client.count >= 8) return false;
  all.count++;
  client.count++;
  state.attempts.set("all", all);
  state.attempts.set(key, client);
  return true;
}

export function clearLoginAttempts(source: string) {
  state.attempts.delete(`source:${source}`);
}

export function createSession() {
  const now = Date.now();
  for (const [key, expiresAt] of state.sessions) {
    if (expiresAt <= now) state.sessions.delete(key);
  }
  if (state.sessions.size >= 128) {
    const oldest = state.sessions.keys().next().value;
    if (oldest) state.sessions.delete(oldest);
  }
  const token = randomBytes(32).toString("base64url");
  state.sessions.set(hash(token).toString("hex"), now + sessionSeconds * 1000);
  return token;
}

export function revokeSession(token?: string) {
  if (token) state.sessions.delete(hash(token).toString("hex"));
}

export async function signedIn() {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!loginConfigured() || !token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return false;
  const key = hash(token).toString("hex");
  const expiresAt = state.sessions.get(key) ?? 0;
  if (expiresAt > Date.now()) return true;
  state.sessions.delete(key);
  return false;
}

export async function requireOwner() {
  if (!await signedIn()) redirect("/dashboard/login");
}
