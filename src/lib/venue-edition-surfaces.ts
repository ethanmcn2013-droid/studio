/**
 * The Venue Edition commercial surfaces, named in one place.
 *
 * D-032 R8 (Option B) took Google Analytics off these pages. They are measured
 * server-side, first-party, with no cookie and no third-party request. Every
 * consumer of that rule reads this module. Nothing re-states the paths inline.
 *
 * That last sentence is the whole point of the file. The app repo carries the
 * same rule twice by hand — `app/src/lib/bare-artifact-path.ts` holds the
 * predicate and `app/src/instrumentation-client.ts` re-implements it in a
 * string comparison — so a change to one leaves the other watching a page it
 * was told to leave alone. Studio does not copy that.
 *
 * Client-safe on purpose: the Google tag gate runs in the browser and the
 * page-view record runs on the server, and both must agree on the same list.
 * Nothing here may import `server-only`, a database, or `next/headers`.
 */

export const VENUE_EDITION_SURFACE_KEYS = [
  "venues",
  "venues_demo",
  "private_venue_page",
  "redeem",
] as const;

export type VenueEditionSurfaceKey = (typeof VENUE_EDITION_SURFACE_KEYS)[number];

type SurfaceRule = {
  key: VenueEditionSurfaceKey;
  /** Plain-English name, for an operator reading a count. Never shown to a venue. */
  label: string;
  matches: (pathname: string) => boolean;
};

/** `/x` itself, or anything beneath it. Never `/xy`. */
function pathOrBelow(root: string): (pathname: string) => boolean {
  return (pathname) => pathname === root || pathname.startsWith(`${root}/`);
}

/**
 * Order matters: the first rule that matches wins, so the more specific page
 * is listed before the section that contains it.
 */
const SURFACE_RULES: readonly SurfaceRule[] = [
  {
    key: "venues_demo",
    label: "The venue demonstration",
    matches: pathOrBelow("/venues/demo"),
  },
  {
    key: "venues",
    label: "The Founding 25 page",
    matches: pathOrBelow("/venues"),
  },
  {
    // Not built yet. E13.16 and E11.05-07 place the private film link at
    // `/v/<token>`, and the tag must already be off the route on the day it
    // ships rather than the day somebody remembers. A page whose subject is
    // that the venue's couples are not watched cannot load a tracker.
    key: "private_venue_page",
    label: "The private venue page",
    matches: pathOrBelow("/v"),
  },
  {
    key: "redeem",
    label: "Sponsored access redemption",
    matches: pathOrBelow("/redeem"),
  },
];

/**
 * Reduce anything a router or a link may hand us to a bare path.
 *
 * Accepts a pathname, a pathname with a query or a fragment, or an absolute
 * URL. Trailing slashes are dropped so `/venues/` and `/venues` are one page.
 * Matching is case-insensitive; the input is never stored or returned.
 */
export function normalisePathname(input: string): string {
  let path = (input ?? "").trim();
  if (!path) return "/";

  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(path)) {
    try {
      path = new URL(path).pathname;
    } catch {
      return "/";
    }
  }

  const cut = path.search(/[?#]/);
  if (cut !== -1) path = path.slice(0, cut);
  if (!path.startsWith("/")) path = `/${path}`;
  while (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);

  return path.toLowerCase();
}

/**
 * The surface key for a path, or null when the path is not a Venue Edition
 * commercial surface. The key is a fixed word from a closed list, never the
 * path itself: `/v/<token>` is a private film link and the token must not end
 * up in a counter, a log line or a report.
 */
export function venueEditionSurface(
  pathname: string,
): VenueEditionSurfaceKey | null {
  const path = normalisePathname(pathname);
  for (const rule of SURFACE_RULES) {
    if (rule.matches(path)) return rule.key;
  }
  return null;
}

export function isVenueEditionSurface(pathname: string): boolean {
  return venueEditionSurface(pathname) !== null;
}

/**
 * The gate the Google tag reads. Third-party analytics is permitted on the rest
 * of the site and refused on the Venue Edition commercial surfaces.
 */
export function allowsThirdPartyAnalytics(pathname: string): boolean {
  return !isVenueEditionSurface(pathname);
}

/** Operator-facing name for a surface key. */
export function venueEditionSurfaceLabel(key: VenueEditionSurfaceKey): string {
  const rule = SURFACE_RULES.find((candidate) => candidate.key === key);
  return rule ? rule.label : key;
}
