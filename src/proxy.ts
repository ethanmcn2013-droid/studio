import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  createHqAccessToken,
  getHqPassword,
  HQ_ACCESS_COOKIE,
} from "@/lib/hq/auth";

// ── Layer 0: /hq password gate ────────────────────────────────────────────
// This gate is NOT Clerk, it is a simple shared-password gate for the
// operator-only /hq surface. Do not touch this behaviour.

const PUBLIC_HQ_PATHS = ["/hq/access", "/hq/logout"];

const CONFIDENTIAL_BRAND_PATHS = new Set([
  "/brand/business-loan-pack-2026.html",
]);

async function confidentialBrandGate(
  request: NextRequest,
): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl;
  if (!CONFIDENTIAL_BRAND_PATHS.has(pathname)) return null;

  const password = getHqPassword();
  const accessCookie = request.cookies.get(HQ_ACCESS_COOKIE)?.value;

  if (password && accessCookie === (await createHqAccessToken(password))) {
    return NextResponse.next();
  }

  const accessUrl = request.nextUrl.clone();
  accessUrl.pathname = "/hq/access";
  accessUrl.searchParams.set("from", "/hq/loan-pack");
  return NextResponse.redirect(accessUrl);
}

async function hqGate(request: NextRequest): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/hq")) return null;

  if (PUBLIC_HQ_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const password = getHqPassword();
  const accessCookie = request.cookies.get(HQ_ACCESS_COOKIE)?.value;

  if (password && accessCookie === (await createHqAccessToken(password))) {
    return NextResponse.next();
  }

  const accessUrl = request.nextUrl.clone();
  accessUrl.pathname = "/hq/access";
  accessUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(accessUrl);
}

// ── Layer 2: M→suite-launcher redirect (DESIGN.md §14) ──────────────────
// Authed users on marketing routes are redirected to / (the suite launcher).
// / itself is rewritten to the internal /launcher route, so the URL stays /
// and there is no redirect loop. The public home page at / reads nothing
// from the request and is served from cache (round 3, 2026-10-02); before
// that, page.tsx and the root layout read an x-signal-authed header set
// here and every visit was rendered fresh.
//
// Categories (this Set and the matcher below ARE the allowlist — the
// review2/LAYER0_ROUTE_ALLOWLIST.md this once cited has never existed in
// the repo; corrected 2026-08-12 so nobody hunts for it again):
//   M = Marketing  → authed: redirect to suite launcher at /
//   C = Content    → never redirected (/brand and assets)
//   X = Excluded   → never touched (/hq, /api, og, sitemap, robots)

// Trimmed with the 2026-09-11 estate cut: /dispatch, /notes, /tasks,
// /timeline and /signal are archived, so listing them here only described
// routes that no longer exist.
const MARKETING_PATHS = new Set([
  "/",
  "/about",
  "/waitlist",
  "/principles",
  "/press",
]);

// Pricing is deliberately absent from MARKETING_PATHS. Signed-in people still
// need the public comparison when they are choosing or changing access.

// Clerk's shared-session cookie name (set by the shared prod Clerk instance
// across *.signalstudio.ie). Studio has no Clerk SDK, we read the raw cookie.
// This is the same cookie the browser sends on every subdomain request.
const CLERK_SESSION_COOKIE = "__session";

// Escape hatch: operator sets this cookie (via "View public site" in the
// account menu) to suppress the M→launcher redirect for that tab session.
// See DESIGN.md §14 for the full escape-hatch contract.
const PREVIEW_COOKIE = "signal_preview_public";

// Where the signed-in variant of / lives. Never an address anyone visits:
// a direct request for it goes back to /.
const LAUNCHER_PATH = "/launcher";

// The marker the old two-variant page read. The proxy still sets it on the
// rewritten response, and still honours it on a request for /, so anything
// that asked for the launcher that way gets the launcher.
const AUTHED_HEADER = "x-signal-authed";

function suiteRedirect(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;

  // The launcher's own route is internal. Asked for by name, it is /.
  // The one exception carries the marker: where a server is bound to
  // 127.0.0.1 (local runs and the browser spec), Next resolves the rewrite
  // below against `localhost`, takes it for another origin and fetches it
  // over HTTP, with the marker the rewrite set copied onto that request.
  // That second request is let through, or it would redirect for ever.
  if (pathname === LAUNCHER_PATH) {
    if (request.headers.get(AUTHED_HEADER) === "1") return null;
    return NextResponse.redirect(new URL("/", request.url), 307);
  }

  // C routes, always pass through
  if (pathname.startsWith("/brand")) return null;
  // X routes, always pass through (hq handled above; api / infra below)
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/hq") ||
    pathname.startsWith("/redeem")
  ) {
    return null;
  }

  if (!MARKETING_PATHS.has(pathname)) return null;

  const isAuthed = Boolean(
    request.cookies.get(CLERK_SESSION_COOKIE)?.value,
  );
  const isPreview =
    request.cookies.get(PREVIEW_COOKIE)?.value === "1" ||
    request.nextUrl.searchParams.get("preview") === "public";

  if (pathname === "/") {
    const asksForLauncher = request.headers.get(AUTHED_HEADER) === "1";
    if (!asksForLauncher && (!isAuthed || isPreview)) return null;
    // Rewrite in place to the launcher's route. A redirect would loop; a
    // rewrite keeps the URL. The destination is built from the request's own
    // address so it is always the same origin, an internal rewrite.
    const destination = request.nextUrl.clone();
    destination.pathname = LAUNCHER_PATH;
    const rewritten = NextResponse.rewrite(destination);
    rewritten.headers.set(AUTHED_HEADER, "1");
    return rewritten;
  }

  if (!isAuthed || isPreview) return null;

  // All other M routes → redirect to the suite launcher at /
  return NextResponse.redirect(new URL("/", request.url), 307);
}

// ── Composed proxy ────────────────────────────────────────────────────────

export async function proxy(request: NextRequest): Promise<NextResponse> {
  // 0. Confidential static brand assets (lender pack, HQ password required)
  const brandResult = await confidentialBrandGate(request);
  if (brandResult) return brandResult;

  // 1. HQ gate (must run first, /hq is excluded from suite redirect logic)
  const hqResult = await hqGate(request);
  if (hqResult) return hqResult;

  // 2. Suite launcher redirect (M routes, authed, no escape hatch)
  const suiteResult = suiteRedirect(request);
  if (suiteResult) return suiteResult;

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/brand/business-loan-pack-2026.html",
    // /hq subtree (existing HQ gate)
    "/hq/:path*",
    // Marketing routes (M) that trigger the suite redirect
    "/",
    "/about",
    "/pricing",
    "/waitlist",
    "/principles",
    "/press",
    // Exclude _next internals and static assets
    "/((?!_next|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?|ttf|eot|ico|css|js)$).*)",
  ],
};
