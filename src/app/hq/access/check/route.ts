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

/**
 * Validate and sanitise a user-supplied redirect target.
 *
 * Defences applied:
 *   - Parsed against the request origin via `new URL()` so that `//evil.com`,
 *     `\\evil.com`, encoded slashes, and `../` traversal all normalise before
 *     the host/pathname checks run.
 *   - Host must exactly equal the request origin's host (same-origin only).
 *   - Pathname must be `/hq` or start with `/hq/` (no `/hqfoo` side-steps).
 *   - Returns only the pathname — no query string, no hash — so an attacker
 *     cannot smuggle parameters or fragment identifiers through a valid path.
 *   - Falls back to `/hq` on any validation failure.
 */
function sanitizeHqRedirect(from: string, origin: string): string {
  const SAFE_DEFAULT = "/hq";
  try {
    const target = new URL(from, origin);
    const requestOrigin = new URL(origin);
    // Same-origin check — catches //evil.com, http://evil.com, etc.
    if (target.host !== requestOrigin.host) return SAFE_DEFAULT;
    // Pathname must be exactly /hq or start with /hq/ (prevents /hqescape)
    const p = target.pathname;
    if (p !== "/hq" && !p.startsWith("/hq/")) return SAFE_DEFAULT;
    // Return pathname only — strip query string and hash
    return p;
  } catch {
    return SAFE_DEFAULT;
  }
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

  // Success: sanitise the user-supplied `from` to a clean same-origin /hq path.
  // Guard-trip: fixed access page with a hardcoded `?error=1` (no user input
  // reaches this literal) so the access page can render its error state.
  const safePath = isValid
    ? sanitizeHqRedirect(from, request.url)
    : "/hq/access?error=1";
  const redirectUrl = new URL(safePath, request.url);

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
