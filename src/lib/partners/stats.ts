// Intentionally no `import "server-only"`, this module is consumed
// by both the /hq/partners server component AND scripts/partner-digest.ts
// (run via tsx). The server-only guard would crash the CLI invocation.
import { eq } from "drizzle-orm";
import { entitlementsDb } from "@/lib/entitlements-db/client-core";
import {
  sponsors,
  licenseCodes,
  type Sponsor,
} from "@/lib/entitlements-db/schema";
import { TASKS_URL } from "@/lib/product-urls";

export type PartnerStat = {
  sponsor: Sponsor;
  codesIssued: number;
  codesRedeemed: number;
  redeemed30d: number;
  /** Couples who actually reached the wedding board after redeeming
   *  (the redemption funnel's exit signal). Read from Tasks's
   *  entitlements.reached_board_at, set idempotently on first
   *  /app/board?welcome=venue render. The "did the next person
   *  finish?" answer. */
  reachedBoard: number;
  /** Most recent redemption time across this sponsor's codes (ms epoch),
   *  or null when no couple has redeemed yet. */
  mostRecentRedemptionAt: number | null;
};

type TasksPartnerStats = {
  codesRedeemed: number;
  redeemed30d: number;
  reachedBoard: number;
  mostRecentRedemptionAt: number | null;
};

const EMPTY_TASKS_STATS: TasksPartnerStats = {
  codesRedeemed: 0,
  redeemed30d: 0,
  reachedBoard: 0,
  mostRecentRedemptionAt: null,
};

/**
 * Partner roll-up. Studio's audit (license_codes) is authoritative for
 * issued counts; Tasks's comp_codes + entitlements are authoritative
 * for redeemed counts. `redeemed30d` is honest about what it measures:
 * redemptions started in the last 30 days, NOT actual product
 * engagement.
 *
 * The Tasks-side numbers now come over HTTP from Tasks's
 * `/api/internal/partner-stats?sponsor=<slug>` endpoint, authed with
 * `PARTNER_STATS_SECRET` (must match the same env var on Tasks).
 * Direct libSQL reads of Tasks's tables retired 2026-05-13, the API
 * is a versioned contract, schema changes on Tasks no longer silently
 * break /hq/partners.
 */
export async function getPartnerStats(): Promise<PartnerStat[]> {
  // E-8 follow-up (2026-05-14): reads moved from Studio's local DB
  // to shared signal-entitlements so any future writer (not only
  // issue-codes.ts) propagates here. The issue-codes pipeline now
  // dual-writes; this read closes the loop.
  const db = entitlementsDb();
  const rows = await db.select().from(sponsors).orderBy(sponsors.createdAt);
  if (rows.length === 0) return [];

  return Promise.all(
    rows.map(async (s) => {
      const codesIssued = await countIssued(s.id);
      const tasksStats = await fetchTasksStats(s.slug);
      return {
        sponsor: s,
        codesIssued,
        ...tasksStats,
      };
    }),
  );
}

async function countIssued(sponsorId: string): Promise<number> {
  const db = entitlementsDb();
  const result = await db
    .select({ id: licenseCodes.id })
    .from(licenseCodes)
    .where(eq(licenseCodes.sponsorId, sponsorId));
  return result.length;
}

/**
 * Fetch the Tasks-side roll-up for one sponsor. On any failure
 * (Tasks down, secret unset, network error, non-OK response) returns
 * the empty shape and logs, /hq/partners still renders, the issued-
 * vs-redeemed funnel just shows 0s for this sponsor. Failure-mode
 * matches the original try/catch around the entitlements query.
 */
async function fetchTasksStats(sponsorSlug: string): Promise<TasksPartnerStats> {
  const secret = process.env.PARTNER_STATS_SECRET;
  if (!secret) {
    console.warn(
      "[partners/stats] PARTNER_STATS_SECRET is not set, Tasks roll-up unavailable. Set it on Studio AND Tasks (same value).",
    );
    return EMPTY_TASKS_STATS;
  }

  const url = `${TASKS_URL}/api/internal/partner-stats?sponsor=${encodeURIComponent(sponsorSlug)}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${secret}` },
      // Don't let Next cache this, partner counts change throughout
      // the day and /hq/partners is operator-facing.
      cache: "no-store",
      // Hard cap so a hung Tasks doesn't stall the page.
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.warn(
        `[partners/stats] Tasks /api/internal/partner-stats responded ${res.status} for sponsor=${sponsorSlug}`,
      );
      return EMPTY_TASKS_STATS;
    }
    const json = (await res.json()) as TasksPartnerStats;
    return {
      codesRedeemed: Number(json.codesRedeemed ?? 0),
      redeemed30d: Number(json.redeemed30d ?? 0),
      reachedBoard: Number(json.reachedBoard ?? 0),
      mostRecentRedemptionAt:
        json.mostRecentRedemptionAt == null
          ? null
          : Number(json.mostRecentRedemptionAt),
    };
  } catch (err) {
    console.warn(
      `[partners/stats] Tasks /api/internal/partner-stats fetch failed for sponsor=${sponsorSlug}:`,
      String(err),
    );
    return EMPTY_TASKS_STATS;
  }
}
