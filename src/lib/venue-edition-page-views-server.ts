import "server-only";

import { after } from "next/server";
import { headers } from "next/headers";
import { and, eq, inArray, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { venueSurfaceViews } from "@/lib/db/schema";
import type { MetricValue } from "@/lib/account/types";
import type { VenueEditionSurfaceKey } from "@/lib/venue-edition-surfaces";
import {
  readPageViews,
  recordPageView,
  utcDayWindow,
  type RecordPageViewOutcome,
  type VenueSurfaceViewStore,
} from "@/lib/venue-edition-page-views";

/**
 * The server half of the Venue Edition page-view record. D-032 R8, Option B.
 *
 * Three properties this file is responsible for:
 *
 * **First-party and server-side.** The count is taken while the server renders
 * the page. No script runs in the browser, no beacon is sent, no cookie is set
 * and no request leaves our origin. There is nothing for a consent banner to
 * ask about because nothing is stored on the reader's device.
 *
 * **It costs the reader nothing.** The write is handed to `after()`, so it
 * runs once the response has been sent. A slow database delays a counter, not
 * a commercial page.
 *
 * **It cannot break the page.** `venueSurfaceViewStore()` returns null when the
 * database is not configured — Preview has no database by design — and
 * `recordPageView` swallows a write failure into an outcome. Neither path
 * throws, and neither path writes a zero.
 */

/**
 * The Drizzle-backed store, or null when there is no database to write to.
 *
 * The null is the honest answer to "is this configured", and it travels all
 * the way to the read as `unavailable`. It is never resolved to an empty
 * result set, which would render as a zero.
 */
export function venueSurfaceViewStore(): VenueSurfaceViewStore | null {
  if (!process.env.STUDIO_DATABASE_URL) return null;

  return {
    async increment(surface, day) {
      await db
        .insert(venueSurfaceViews)
        .values({ surface, day, views: 1 })
        .onConflictDoUpdate({
          target: [venueSurfaceViews.surface, venueSurfaceViews.day],
          set: {
            views: sql`${venueSurfaceViews.views} + 1`,
            updatedAt: sql`(unixepoch() * 1000)`,
          },
        });
    },

    async read(surface, days) {
      const rows = await db
        .select({
          day: venueSurfaceViews.day,
          views: venueSurfaceViews.views,
        })
        .from(venueSurfaceViews)
        .where(
          and(
            eq(venueSurfaceViews.surface, surface),
            inArray(venueSurfaceViews.day, [...days]),
          ),
        );
      return rows;
    },
  };
}

/**
 * Count one view of a Venue Edition commercial surface.
 *
 * Call it from the page's server component. Reading `headers()` opts the route
 * into dynamic rendering, which is what makes a per-request count possible at
 * all: a statically prerendered page is rendered once at build and would count
 * once, forever.
 *
 * The surface is passed as a key rather than derived from the URL, so nothing
 * in this path ever holds `/v/<token>`.
 */
export async function recordVenueEditionPageView(
  surface: VenueEditionSurfaceKey,
): Promise<void> {
  const requestHeaders = await headers();
  const store = venueSurfaceViewStore();

  after(async () => {
    const outcome: RecordPageViewOutcome = await recordPageView(surface, {
      store,
      headers: requestHeaders,
    });
    // A failed write is a coverage gap, not a zero. It is logged so the gap is
    // visible in the platform log, and the read declares it as `lower_bound`
    // or `unavailable` rather than counting the day as nothing happening.
    if (!outcome.recorded && outcome.reason === "write-failed") {
      console.warn(
        `[venue-edition] page-view write failed for surface ${surface}`,
      );
    }
  });
}

/** Views of one surface over the last `days` UTC days, ending today. */
export async function readVenueEditionPageViews(
  surface: VenueEditionSurfaceKey,
  days = 30,
): Promise<MetricValue> {
  return readPageViews(surface, {
    store: venueSurfaceViewStore(),
    days: utcDayWindow(Date.now(), days),
  });
}
