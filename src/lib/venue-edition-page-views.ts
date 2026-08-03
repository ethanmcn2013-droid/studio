/**
 * Server-side, first-party page views for the Venue Edition commercial
 * surfaces. D-032 R8, Option B.
 *
 * This is the pure half: the day key, the decision to record, and the read
 * that turns stored rows into a number a person can trust. The store is passed
 * in, so every rule below is testable without a database. The Drizzle store
 * and the `next/headers` glue live in `venue-edition-page-views-server.ts`.
 *
 * ## What this is, and what it is not
 *
 * It is a count of page views on four pages. It is not an analytics product,
 * and it must not grow into one. There is no visitor, no session, no journey,
 * no referrer, no device. A view is a request the server handled for one of
 * the named surfaces on one UTC day, and the only thing kept is how many.
 *
 * ## The honesty rule, which is the reason the read is not a SUM
 *
 * A missing figure is never a zero. There is no daily heartbeat here, so a day
 * with no stored row is genuinely ambiguous: nobody visited, or the recorder
 * could not write. Those two cannot be told apart, so the read refuses to
 * choose. Days with rows are counted; days without are declared.
 *
 *   every day in the window has a row  → exact
 *   some days have rows                → lower_bound
 *   no day has a row                   → unavailable, "no-record"
 *   the store is missing or throws     → unavailable, with the reason
 *
 * `lower_bound` and `unavailable` are the vocabulary the account snapshot
 * already speaks (`@/lib/account/types`), so an operator reading this figure
 * reads it the same way they read every other figure in the product.
 */

import type { MetricValue } from "@/lib/account/types";
import type { VenueEditionSurfaceKey } from "@/lib/venue-edition-surfaces";

/** One stored row: a surface, a UTC day, and a count. Nothing else exists. */
export type VenueSurfaceViewRow = {
  day: string;
  views: number;
};

/**
 * The persistence seam. `null` from `venueSurfaceViewStore()` means the store
 * is not configured, which is a coverage answer and never a zero.
 */
export type VenueSurfaceViewStore = {
  increment(surface: VenueEditionSurfaceKey, day: string): Promise<void>;
  read(
    surface: VenueEditionSurfaceKey,
    days: readonly string[],
  ): Promise<VenueSurfaceViewRow[]>;
};

export type RecordPageViewOutcome =
  | { recorded: true; surface: VenueEditionSurfaceKey; day: string }
  | {
      recorded: false;
      reason: "prefetch" | "store-not-configured" | "write-failed";
    };

/** The subset of a Headers object this module reads. Nothing is stored. */
export type ReadableHeaders = { get(name: string): string | null };

/** UTC calendar day, `YYYY-MM-DD`. UTC because a count must not shift on a clock change. */
export function utcDayKey(atMs: number): string {
  return new Date(atMs).toISOString().slice(0, 10);
}

/**
 * The `count` most recent UTC days ending at `endMs`, oldest first. This is the
 * window the read declares coverage against, so it is generated rather than
 * inferred from whatever rows happen to exist.
 */
export function utcDayWindow(endMs: number, count: number): string[] {
  const days: string[] = [];
  const span = Math.max(1, Math.floor(count));
  for (let back = span - 1; back >= 0; back -= 1) {
    days.push(utcDayKey(endMs - back * 86_400_000));
  }
  return days;
}

/**
 * A prefetch is the router warming a page, not a person opening it.
 *
 * Next prefetches linked routes, and a prefetch executes the server component
 * exactly as a visit does. Counting them would inflate every figure by however
 * many links point at `/venues`. `Next-Router-Prefetch` covers the router;
 * `Sec-Purpose` and `Purpose` cover browser speculation rules. The header is
 * read and discarded — no header value is stored anywhere.
 */
export function isPrefetchRequest(headers: ReadableHeaders): boolean {
  if (headers.get("next-router-prefetch")) return true;
  const secPurpose = headers.get("sec-purpose") ?? "";
  if (secPurpose.toLowerCase().includes("prefetch")) return true;
  const purpose = headers.get("purpose") ?? "";
  return purpose.toLowerCase() === "prefetch";
}

/**
 * Record one page view. Never throws: a measurement fault must not take a
 * commercial page down, and the caller gets an outcome it can log instead.
 */
export async function recordPageView(
  surface: VenueEditionSurfaceKey,
  deps: {
    store: VenueSurfaceViewStore | null;
    headers: ReadableHeaders;
    now?: number;
  },
): Promise<RecordPageViewOutcome> {
  if (isPrefetchRequest(deps.headers)) {
    return { recorded: false, reason: "prefetch" };
  }
  if (!deps.store) {
    return { recorded: false, reason: "store-not-configured" };
  }

  const day = utcDayKey(deps.now ?? Date.now());
  try {
    await deps.store.increment(surface, day);
    return { recorded: true, surface, day };
  } catch {
    return { recorded: false, reason: "write-failed" };
  }
}

/**
 * Fold stored rows into one figure over a declared window.
 *
 * Rows outside the window are ignored. A row whose count is not a
 * non-negative integer is treated as absent rather than as a number, because a
 * corrupt cell is a coverage break and reading it would launder the corruption
 * into a total.
 */
export function summarisePageViews(
  days: readonly string[],
  rows: readonly VenueSurfaceViewRow[],
): MetricValue {
  const window = new Set(days);
  const counted = new Map<string, number>();

  for (const row of rows) {
    if (!window.has(row.day)) continue;
    if (!Number.isInteger(row.views) || row.views < 0) continue;
    counted.set(row.day, row.views);
  }

  if (counted.size === 0) {
    return { state: "unavailable", reason: "no-record" };
  }

  let total = 0;
  for (const value of counted.values()) total += value;

  if (counted.size === window.size) {
    return { state: "exact", value: total };
  }
  return { state: "lower_bound", value: total };
}

/**
 * Read the page-view figure for one surface over a window of UTC days.
 * Never throws, and never returns a number it cannot stand behind.
 */
export async function readPageViews(
  surface: VenueEditionSurfaceKey,
  deps: {
    store: VenueSurfaceViewStore | null;
    days: readonly string[];
  },
): Promise<MetricValue> {
  if (!deps.store) {
    return { state: "unavailable", reason: "store-not-configured" };
  }
  if (deps.days.length === 0) {
    return { state: "unavailable", reason: "no-period" };
  }

  try {
    const rows = await deps.store.read(surface, deps.days);
    return summarisePageViews(deps.days, rows);
  } catch {
    return { state: "unavailable", reason: "read-failed" };
  }
}
