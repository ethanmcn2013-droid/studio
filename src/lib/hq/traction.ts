import "server-only";
import { count, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  entitlements,
  licenseCodes,
  redemptions,
  sponsors,
} from "@/lib/db/schema";

/**
 * Traction — "are we actually winning?".
 *
 * HQ historically showed zero of the one number that matters to a
 * founder: is the business converting. The ratified 6-month plan
 * (memory: marketing-plan-6mo-2026-05-16) targets €250k/6mo on a paid
 * Venue Edition (€1.5–4k/venue/yr). The proof of progress already
 * lives in Studio's OWN Turso DB — the same database `cron_runs` reads
 * from. No new wiring, no new credentials: just count what's there.
 *
 * Honesty contract: this never inflates. Zero is reported as zero.
 * The annualised figure is an explicit estimate band, labelled as
 * such — it is not invoiced revenue. If the DB is unreachable the
 * section says so rather than rendering a confident fiction.
 */

/** Ratified target — memory: marketing-plan-6mo-2026-05-16. */
export const GOAL_EUR_6MO = 250_000;
/** Venue Edition price band, €/venue/yr. */
const VENUE_LOW = 1_500;
const VENUE_HIGH = 4_000;
/** Workspace subscription, €12/mo → annualised. */
const WORKSPACE_YR = 12 * 12;

export type TractionState =
  | { available: false; reason: string }
  | {
      available: true;
      activeEntitlements: number;
      activePaid: number;
      byTier: Array<{ tier: string; n: number }>;
      venueEditions: number;
      workspaceSubs: number;
      redemptionsTotal: number;
      codesMinted: number;
      codesRedeemed: number;
      sponsors: number;
      arrLowEur: number;
      arrHighEur: number;
      goalEur: number;
      goalPctLow: number;
      goalPctHigh: number;
    };

async function countWhere(
  table: typeof entitlements | typeof redemptions | typeof sponsors,
): Promise<number> {
  const rows = await db.select({ n: count() }).from(table);
  return rows[0]?.n ?? 0;
}

export async function getTraction(): Promise<TractionState> {
  try {
    const [
      activeRows,
      paidRows,
      tierRows,
      sourceRows,
      redemptionsTotal,
      codeRows,
      sponsorCount,
    ] = await Promise.all([
      db
        .select({ n: count() })
        .from(entitlements)
        .where(eq(entitlements.status, "active")),
      db
        .select({ n: count() })
        .from(entitlements)
        .where(
          sql`${entitlements.status} = 'active' and ${entitlements.tier} <> 'free'`,
        ),
      db
        .select({ tier: entitlements.tier, n: count() })
        .from(entitlements)
        .where(eq(entitlements.status, "active"))
        .groupBy(entitlements.tier),
      db
        .select({ source: entitlements.source, n: count() })
        .from(entitlements)
        .where(eq(entitlements.status, "active"))
        .groupBy(entitlements.source),
      countWhere(redemptions),
      db
        .select({ status: licenseCodes.status, n: count() })
        .from(licenseCodes)
        .groupBy(licenseCodes.status),
      countWhere(sponsors),
    ]);

    const activeEntitlements = activeRows[0]?.n ?? 0;
    const activePaid = paidRows[0]?.n ?? 0;
    const byTier = tierRows
      .map((r) => ({ tier: String(r.tier), n: r.n }))
      .filter((r) => r.tier !== "free")
      .sort((a, b) => b.n - a.n);

    const bySource = new Map(sourceRows.map((r) => [String(r.source), r.n]));
    const venueEditions = bySource.get("venue_edition") ?? 0;
    const workspaceSubs = bySource.get("workspace_subscription") ?? 0;

    const codeMap = new Map(codeRows.map((r) => [String(r.status), r.n]));
    const codesMinted = codeMap.get("minted") ?? 0;
    const codesRedeemed = codeMap.get("redeemed") ?? 0;

    const baseYr = workspaceSubs * WORKSPACE_YR;
    const arrLowEur = venueEditions * VENUE_LOW + baseYr;
    const arrHighEur = venueEditions * VENUE_HIGH + baseYr;

    return {
      available: true,
      activeEntitlements,
      activePaid,
      byTier,
      venueEditions,
      workspaceSubs,
      redemptionsTotal,
      codesMinted,
      codesRedeemed,
      sponsors: sponsorCount,
      arrLowEur,
      arrHighEur,
      goalEur: GOAL_EUR_6MO,
      goalPctLow: Math.round((arrLowEur / 2 / GOAL_EUR_6MO) * 100),
      goalPctHigh: Math.round((arrHighEur / 2 / GOAL_EUR_6MO) * 100),
    };
  } catch (err) {
    return {
      available: false,
      reason:
        err instanceof Error && /TURSO_STUDIO/.test(err.message)
          ? "Studio Turso not configured on this host."
          : "Studio Turso unreachable — traction cannot be read.",
    };
  }
}

/** €1,234,567 → "€1.23m" / "€48k" / "€0". Honest, compact, no rounding-up. */
export function formatEur(n: number): string {
  if (n <= 0) return "€0";
  if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(2)}m`;
  if (n >= 1_000) return `€${Math.round(n / 1_000)}k`;
  return `€${n}`;
}
