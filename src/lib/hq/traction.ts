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
 * Rebuilt 2026-05-16 for the paid Venue Edition model
 * (venue-editions-paid-tier). The earlier version multiplied COUPLE-side
 * `venue_edition` entitlements by the €1.5–4k band — that counted
 * couples as if each were a paying venue, which over the paid model is
 * simply wrong. Revenue now comes from the sponsor ledger: a venue is
 * money only when its plan is founding|paid AND the prepay cash landed
 * (`paid_at`). Couples seeded are reported separately — they are
 * distribution, the thing the venue's money buys, never the revenue.
 *
 * Honesty contract (the plan's #1 success indicator is "zero brand-
 * integrity exceptions"): cash collected is exact, not a band — annual
 * prepay means the full year lands at signature. Signed-but-unpaid
 * venues are shown as pipeline, never as money. Workspace MRR is the
 * only annualised estimate and is labelled as one, kept out of the
 * headline goal %. If the DB is unreachable the section says so.
 */

/** Ratified target — memory: marketing-plan-6mo-2026-05-16. Cash, not ARR. */
export const GOAL_EUR_6MO = 250_000;
/** Workspace subscription, €12/mo → annualised (estimate only). */
const WORKSPACE_YR = 12 * 12;

/**
 * The 6-month clock. Source: content/hq/decisions/venue-editions-paid-tier.md
 * — ratified by the founder 2026-05-16, €250k over six months, M3 gate
 * (≥10 paid venues) on 2026-08-16. These are the contract dates, not
 * derived — change them only if the decision file changes.
 */
const CAMPAIGN_START = "2026-05-16";
const CAMPAIGN_END = "2026-11-16";
const CAMPAIGN_M3_GATE = "2026-08-16";

/**
 * Burndown — the one temporal element on the one question that matters.
 * Converts a static integer ("€0 collected") into a verdict ("week 3 of
 * 26, €X behind the slope you'd need to land €250k"). Linear required
 * pace, no smoothing: required-to-date is exactly goal × fraction of the
 * window elapsed; the gap is exact arithmetic, never a projection dressed
 * as one. With €0 in, the honest reading is "the slope hasn't started."
 */
export type Burndown = {
  campaignStart: string;
  campaignEnd: string;
  m3Gate: string;
  totalDays: number;
  daysElapsed: number;
  daysRemaining: number;
  weeksElapsed: number;
  totalWeeks: number;
  /** 0..1 — fraction of the six-month window spent. */
  fractionElapsed: number;
  /** goal × fractionElapsed — the cash you'd have if perfectly on pace. */
  requiredToDateEur: number;
  /** cashCollected − requiredToDate. Negative = behind the slope. */
  paceDeltaEur: number;
  /** (goal − cash) ÷ weeks left — the run-rate needed from here on. */
  requiredWeeklyFromHereEur: number;
  onPace: boolean;
  /** Before the clock starts ticking meaningfully (day 0). */
  notStarted: boolean;
};

function dayStartUtc(yyyymmdd: string): number {
  return new Date(`${yyyymmdd}T00:00:00Z`).getTime();
}

export function computeBurndown(
  cashCollectedEur: number,
  goalEur: number,
  now: number = Date.now(),
): Burndown {
  const startMs = dayStartUtc(CAMPAIGN_START);
  const endMs = dayStartUtc(CAMPAIGN_END);
  const DAY = 1000 * 60 * 60 * 24;
  const totalDays = Math.round((endMs - startMs) / DAY);
  const daysElapsed = Math.min(
    totalDays,
    Math.max(0, Math.floor((now - startMs) / DAY)),
  );
  const daysRemaining = Math.max(0, totalDays - daysElapsed);
  const fractionElapsed = totalDays > 0 ? daysElapsed / totalDays : 0;
  const requiredToDateEur = Math.round(goalEur * fractionElapsed);
  const paceDeltaEur = cashCollectedEur - requiredToDateEur;
  const weeksRemaining = Math.max(1, daysRemaining / 7);
  const requiredWeeklyFromHereEur = Math.max(
    0,
    Math.round((goalEur - cashCollectedEur) / weeksRemaining),
  );
  return {
    campaignStart: CAMPAIGN_START,
    campaignEnd: CAMPAIGN_END,
    m3Gate: CAMPAIGN_M3_GATE,
    totalDays,
    daysElapsed,
    daysRemaining,
    weeksElapsed: Math.floor(daysElapsed / 7),
    totalWeeks: Math.round(totalDays / 7),
    fractionElapsed,
    requiredToDateEur,
    paceDeltaEur,
    requiredWeeklyFromHereEur,
    onPace: paceDeltaEur >= 0,
    notStarted: daysElapsed === 0,
  };
}

export type TractionState =
  | { available: false; reason: string }
  | {
      available: true;
      /** Exact prepay cash that has actually landed (founding+paid venues). */
      cashCollectedEur: number;
      /** Paid venues with cash in the door. The plan's #1 leading metric. */
      paidVenues: number;
      /** Of those, founding cohort (€1,500 locked for life). */
      foundingVenues: number;
      /** Signed founding|paid but `paid_at` still null — pipeline, not money. */
      signedUnpaidVenues: number;
      /** Free in-flight pilots (e.g. Lamb's Hill pre-conversion). */
      pilotVenues: number;
      /** Couple-side venue_edition entitlements — distribution, not revenue. */
      couplesSeeded: number;
      /** Active student_edu grants — the second-wedge signup count. */
      studentSignups: number;
      workspaceSubs: number;
      workspaceAnnualisedEur: number;
      activeEntitlements: number;
      activePaid: number;
      byTier: Array<{ tier: string; n: number }>;
      redemptionsTotal: number;
      codesMinted: number;
      codesRedeemed: number;
      sponsors: number;
      goalEur: number;
      /** Cash collected ÷ €250k. The honest number, no inflation. */
      goalPct: number;
      /** The 6-month clock — required pace vs actual, days remaining. */
      burndown: Burndown;
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
      venueRows,
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
      db
        .select({
          venuePlan: sponsors.venuePlan,
          paidAt: sponsors.paidAt,
          foundingLocked: sponsors.foundingLocked,
          annualAmountCents: sponsors.annualAmountCents,
        })
        .from(sponsors),
    ]);

    const activeEntitlements = activeRows[0]?.n ?? 0;
    const activePaid = paidRows[0]?.n ?? 0;
    const byTier = tierRows
      .map((r) => ({ tier: String(r.tier), n: r.n }))
      .filter((r) => r.tier !== "free")
      .sort((a, b) => b.n - a.n);

    const bySource = new Map(sourceRows.map((r) => [String(r.source), r.n]));
    const couplesSeeded = bySource.get("venue_edition") ?? 0;
    const studentSignups = bySource.get("student_edu") ?? 0;
    const workspaceSubs = bySource.get("workspace_subscription") ?? 0;

    const codeMap = new Map(codeRows.map((r) => [String(r.status), r.n]));
    const codesMinted = codeMap.get("minted") ?? 0;
    const codesRedeemed = codeMap.get("redeemed") ?? 0;

    // The sponsor ledger is the only source that may become revenue.
    let paidVenues = 0;
    let foundingVenues = 0;
    let signedUnpaidVenues = 0;
    let pilotVenues = 0;
    let cashCents = 0;
    for (const v of venueRows) {
      const plan = String(v.venuePlan ?? "none");
      const isPaidPlan = plan === "founding" || plan === "paid";
      if (plan === "pilot") pilotVenues += 1;
      if (isPaidPlan && v.paidAt != null) {
        paidVenues += 1;
        if (v.foundingLocked) foundingVenues += 1;
        cashCents += v.annualAmountCents ?? 0;
      } else if (isPaidPlan && v.paidAt == null) {
        signedUnpaidVenues += 1;
      }
    }
    const cashCollectedEur = Math.round(cashCents / 100);
    const workspaceAnnualisedEur = workspaceSubs * WORKSPACE_YR;

    return {
      available: true,
      cashCollectedEur,
      paidVenues,
      foundingVenues,
      signedUnpaidVenues,
      pilotVenues,
      couplesSeeded,
      studentSignups,
      workspaceSubs,
      workspaceAnnualisedEur,
      activeEntitlements,
      activePaid,
      byTier,
      redemptionsTotal,
      codesMinted,
      codesRedeemed,
      sponsors: sponsorCount,
      goalEur: GOAL_EUR_6MO,
      goalPct: Math.round((cashCollectedEur / GOAL_EUR_6MO) * 100),
      burndown: computeBurndown(cashCollectedEur, GOAL_EUR_6MO),
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
