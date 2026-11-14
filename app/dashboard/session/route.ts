import { isIP } from "node:net";
import { NextRequest, NextResponse } from "next/server";
import { setInquiryArchived } from "../../inquiry-store";
import { messageId } from "../inbox-view";
import {
  checkCredentials, clearLoginAttempts, createSession, loginConfigured, reserveLoginAttempt,
  revokeSession, sessionCookie, sessionSeconds, signedIn,
} from "../session";

export const runtime = "nodejs";
const formLimit = 4096;

function seeOther(destination: string) {
  return new NextResponse(null, { status: 303, headers: { Location: destination } });
}

function sameOrigin(request: NextRequest) {
  const host = request.headers.get("host");
  const origin = request.headers.get("origin");
  if (!host || !origin) return false;
  if (origin === `https://${host}`) return true;
  return /^(?:localhost|127\.0\.0\.1)(?::\d+)?$/.test(host) && origin === `http://${host}`;
}

async function readForm(request: NextRequest) {
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/x-www-form-urlencoded") {
    return null;
  }
  const reader = request.body?.getReader();
  if (!reader) return null;
  const bytes = new Uint8Array(formLimit);
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) return new URLSearchParams(new TextDecoder().decode(bytes.subarray(0, size)));
      if (size + value.length > formLimit) {
        await reader.cancel();
        return null;
      }
      bytes.set(value, size);
      size += value.length;
    }
  } catch {
    return null;
  }
}

function setSession(response: NextResponse, value: string, maxAge: number) {
  response.cookies.set(sessionCookie, value, { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge });
  return response;
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return new NextResponse("Forbidden", { status: 403 });
  const form = await readForm(request);
  if (!form) return new NextResponse("Invalid form", { status: 400 });

  const previous = request.cookies.get(sessionCookie)?.value;
  const action = form.get("action");
  if (action === "logout") {
    revokeSession(previous);
    return setSession(seeOther("/dashboard/login"), "", 0);
  }
  if (action === "archive" || action === "restore") {
    if (!await signedIn()) return seeOther("/dashboard/login");
    const id = messageId(form.get("id"));
    if (!id) return new NextResponse("Invalid inquiry", { status: 400 });
    try {
      if (!setInquiryArchived(id, action === "archive")) return new NextResponse("Inquiry not found", { status: 404 });
    } catch {
      return new NextResponse("Could not update the inquiry. Please try again.", { status: 503 });
    }
    return seeOther(action === "archive" ? "/dashboard?status=archived" : "/dashboard?view=archived&status=restored");
  }
  if (action !== "login") return new NextResponse("Invalid form", { status: 400 });
  if (!loginConfigured()) return seeOther("/dashboard/login?status=disabled");

  // The loopback application trusts only the final hop set by its public edge.
  const lastHop = request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ?? "";
  const source = isIP(lastHop) ? lastHop : "unknown";
  if (!reserveLoginAttempt(source)) return seeOther("/dashboard/login?status=limited");
  if (!checkCredentials(form.get("username") ?? "", form.get("password") ?? "")) {
    return seeOther("/dashboard/login?status=invalid");
  }

  clearLoginAttempts(source);
  revokeSession(previous);
  return setSession(seeOther("/dashboard"), createSession(), sessionSeconds);
}
