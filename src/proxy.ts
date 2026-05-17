import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  createHqAccessToken,
  getHqPassword,
  HQ_ACCESS_COOKIE,
} from "@/lib/hq/auth";

// ── Layer 0: /hq password gate ────────────────────────────────────────────
// This gate is NOT Clerk — it is a simple shared-password gate for the
// operator-only /hq surface. Do not touch this behaviour.

const PUBLIC_HQ_PATHS = ["/hq/access", "/hq/logout"];

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
// / itself is handled via a rewrite + x-signal-authed header so page.tsx
// can choose the launcher variant without a redirect loop.
//
// Categories (per Layer 0 allowlist in review2/LAYER0_ROUTE_ALLOWLIST.md):
//   M = Marketing  → authed: redirect to suite launcher at /
//   C = Content    → never redirected (/brand and assets)
//   X = Excluded   → never touched (/hq, /api, og, sitemap, robots)

const MARKETING_PATHS = new Set([
  "/",
  "/work",
  "/proof",
  "/about",
  "/pricing",
  "/contact",
  "/dispatch",
  "/method",
]);

// Clerk's shared-session cookie name (set by the shared prod Clerk instance
// across *.signalstudio.ie). Studio has no Clerk SDK — we read the raw cookie.
// This is the same cookie the browser sends on every subdomain request.
const CLERK_SESSION_COOKIE = "__session";

// Escape hatch: operator sets this cookie (via "View public site" in the
// account menu) to suppress the M→launcher redirect for that tab session.
// See DESIGN.md §14 for the full escape-hatch contract.
const PREVIEW_COOKIE = "signal_preview_public";

function suiteRedirect(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;

  // C routes — always pass through
  if (pathname.startsWith("/brand")) return null;
  // X routes — always pass through (hq handled above; api / infra below)
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

  if (!isAuthed || isPreview) return null;

  if (pathname === "/") {
    // Rewrite in place; set a header so page.tsx renders the launcher variant.
    // A redirect would loop; a rewrite preserves the URL and lets the RSC
    // read the header via next/headers.
    const rewritten = NextResponse.rewrite(request.nextUrl);
    rewritten.headers.set("x-signal-authed", "1");
    return rewritten;
  }

  // All other M routes → redirect to the suite launcher at /
  return NextResponse.redirect(new URL("/", request.url), 307);
}

// ── Composed proxy ────────────────────────────────────────────────────────

export async function proxy(request: NextRequest): Promise<NextResponse> {
  // 1. HQ gate (must run first — /hq is excluded from suite redirect logic)
  const hqResult = await hqGate(request);
  if (hqResult) return hqResult;

  // 2. Suite launcher redirect (M routes, authed, no escape hatch)
  const suiteResult = suiteRedirect(request);
  if (suiteResult) return suiteResult;

  return NextResponse.next();
}

export const config = {
  matcher: [
    // /hq subtree (existing HQ gate)
    "/hq/:path*",
    // Marketing routes (M) that trigger the suite redirect
    "/",
    "/work",
    "/proof",
    "/about",
    "/pricing",
    "/contact",
    "/dispatch",
    "/method",
    // Exclude _next internals and static assets
    "/((?!_next|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?|ttf|eot|ico|css|js)$).*)",
  ],
};
