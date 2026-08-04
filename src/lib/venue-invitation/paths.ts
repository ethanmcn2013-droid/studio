/**
 * The one place that knows which paths are Venue Edition commercial surfaces.
 *
 * `E13.16-link-and-destination-contract.md` section 7 requirement 1 is
 * explicit: whatever mechanism carves these routes out of third-party
 * analytics, **the predicate must be imported from one place**. The `app`
 * repository already carries the same predicate by hand in two files
 * (`bare-artifact-path.ts` and `instrumentation-client.ts`) and E09.04 section
 * 5.1 recorded that defect so studio would not copy it.
 *
 * Every consumer:
 *   - `src/proxy.ts` sets the header on a matching path
 *   - `src/app/layout.tsx` reads it and renders no third-party tag
 *   - `src/app/robots.ts` disallows the private prefix
 *   - `src/app/sitemap.ts` filters the private prefix out
 *   - `paths.test.ts` holds all four to the same predicate
 *
 * Nothing else may re-derive these strings.
 */

/** The private per-venue invitation and proposal route. E13.16 section 1. */
export const VENUE_INVITATION_PATH_PREFIX = "/v";

/**
 * D-032 R8: "GA4 comes off /venues, /v/* and every Venue Edition commercial
 * page; those surfaces are measured server-side, first-party, no cookie, no
 * third party."
 *
 * Add a path here and every consumer follows in the same change. This list is
 * the reason there is one predicate rather than four.
 */
export const VENUE_EDITION_COMMERCIAL_PREFIXES = [
  VENUE_INVITATION_PATH_PREFIX,
  "/venues",
] as const;

/**
 * The request header the proxy sets and the root layout reads. A header rather
 * than a pathname because a server layout has no pathname in the App Router,
 * and a header carrying the path of a private per-venue page would be one more
 * place that path gets logged.
 */
export const NO_THIRD_PARTY_HEADER = "x-signal-no-third-party";

/**
 * Set on the private route only, and read by the root layout to suppress the
 * marketing navigation.
 *
 * E13.16 section 3.1 allows the private page **one action**. The marketing nav
 * is nine, and one of them is the consumer pricing page, which carries a
 * different set of numbers from the one a venue is reading. A separate header
 * from `NO_THIRD_PARTY_HEADER` because `/venues` is public, keeps its
 * navigation, and only shares the analytics carve-out.
 */
export const PRIVATE_INVITATION_HEADER = "x-signal-private-invitation";

/** Strip a query string, a hash and a trailing slash before matching. */
function normalisePath(pathname: string): string {
  const raw = pathname.split("?")[0]?.split("#")[0] ?? "";
  if (raw.length > 1 && raw.endsWith("/")) return raw.slice(0, -1);
  return raw;
}

function matchesPrefix(pathname: string, prefix: string): boolean {
  const path = normalisePath(pathname);
  return path === prefix || path.startsWith(`${prefix}/`);
}

/** True for `/v` and everything under it. Private, never indexed. */
export function isVenueInvitationPath(pathname: string): boolean {
  return matchesPrefix(pathname, VENUE_INVITATION_PATH_PREFIX);
}

/**
 * True for every surface D-032 R8 removes third-party measurement from. A page
 * whose subject is that nobody is watching the venue's couples cannot ship
 * with an unconsented third-party tag on it.
 */
export function isVenueEditionCommercialPath(pathname: string): boolean {
  return VENUE_EDITION_COMMERCIAL_PREFIXES.some((prefix) =>
    matchesPrefix(pathname, prefix),
  );
}

/** The robots disallow entry for the private route, in the form robots.ts wants. */
export const VENUE_INVITATION_ROBOTS_DISALLOW = `${VENUE_INVITATION_PATH_PREFIX}/`;
