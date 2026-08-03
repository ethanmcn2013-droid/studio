import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  createHqAccessToken,
  getHqPassword,
  HQ_ACCESS_COOKIE,
} from "@/lib/hq/auth";
import {
  isVenueEditionCommercialPath,
  isVenueInvitationPath,
  NO_THIRD_PARTY_HEADER,
  PRIVATE_INVITATION_HEADER,
} from "@/lib/venue-invitation/paths";

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
  "/notes",
  "/tasks",
  "/timeline",
  "/signal",
]);

// Clerk's shared-session cookie name (set by the shared prod Clerk instance
// across *.signalstudio.ie). Studio has no Clerk SDK, we read the raw cookie.
// This is the same cookie the browser sends on every subdomain request.
const CLERK_SESSION_COOKIE = "__session";

// Escape hatch: operator sets this cookie (via "View public site" in the
// account menu) to suppress the M→launcher redirect for that tab session.
// See DESIGN.md §14 for the full escape-hatch contract.
const PREVIEW_COOKIE = "signal_preview_public";

function suiteRedirect(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;

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
  // 0. Confidential static brand assets (lender pack, HQ password required)
  const brandResult = await confidentialBrandGate(request);
  if (brandResult) return brandResult;

  // 1. HQ gate (must run first, /hq is excluded from suite redirect logic)
  const hqResult = await hqGate(request);
  if (hqResult) return hqResult;

  // 2. Suite launcher redirect (M routes, authed, no escape hatch)
  const suiteResult = suiteRedirect(request);
  if (suiteResult) return suiteResult;

  // 3. Third-party analytics carve-out (D-032 R8, E12.14).
  //
  // The root layout renders <GoogleTag /> in <head> on every route, and a
  // server layout cannot read the pathname in the App Router. So the decision
  // is made here, where the pathname exists, and travels as one boolean
  // header. The pathname itself is deliberately not forwarded: the layout does
  // not need it, and a header carrying the path of a private per-venue page is
  // one more place that path gets logged.
  //
  // Fail-open, and stated plainly rather than discovered later: if this header
  // is ever absent the layout renders the tag, which is today's behaviour on
  // every route. It is never the other way round, so a proxy change can never
  // silently take analytics off the whole site.
  if (isVenueEditionCommercialPath(request.nextUrl.pathname)) {
    const forwardedHeaders = new Headers(request.headers);
    forwardedHeaders.set(NO_THIRD_PARTY_HEADER, "1");
    // E13.16 section 3.1 (E12.02): the private per-venue page carries one
    // action. The marketing navigation is nine, and one of them is the
    // consumer pricing page, which carries a different set of numbers from the
    // one the venue is reading. `/venues` is public and keeps its navigation,
    // which is why this is a second header rather than the same one.
    if (isVenueInvitationPath(request.nextUrl.pathname)) {
      forwardedHeaders.set(PRIVATE_INVITATION_HEADER, "1");
    }
    return NextResponse.next({ request: { headers: forwardedHeaders } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/brand/business-loan-pack-2026.html",
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
    "/notes",
    "/tasks",
    "/timeline",
    "/signal",
    // Exclude _next internals and static assets
    "/((?!_next|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?|ttf|eot|ico|css|js)$).*)",
  ],
};
