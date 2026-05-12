import { NextResponse } from "next/server";
import {
  createHqAccessToken,
  HQ_ACCESS_COOKIE,
  HQ_ACCESS_MAX_AGE,
  verifyHqPassword,
} from "@/lib/hq/auth";

// ── In-process rate limiter (operator-only surface; Map is sufficient) ──
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true; // allowed
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return false; // blocked
  }

  entry.count += 1;
  return true;
}

function getIp(request: Request): string {
  const forwarded = (request.headers as Headers).get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "dev-fallback";
}

export async function POST(request: Request) {
  const ip = getIp(request);

  if (!checkRateLimit(ip)) {
    return new NextResponse("Too many attempts. Try again later.", {
      status: 429,
      headers: { "Retry-After": String(Math.ceil(WINDOW_MS / 1000)) },
    });
  }

  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/hq");
  const isValid = await verifyHqPassword(password);
  const redirectUrl = new URL(isValid ? from : "/hq/access?error=1", request.url);

  if (!redirectUrl.pathname.startsWith("/hq")) {
    redirectUrl.pathname = "/hq";
    redirectUrl.search = "";
  }

  const response = NextResponse.redirect(redirectUrl, { status: 303 });

  if (isValid) {
    response.cookies.set({
      name: HQ_ACCESS_COOKIE,
      value: await createHqAccessToken(),
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/hq",
      maxAge: HQ_ACCESS_MAX_AGE,
    });
  }

  return response;
}
