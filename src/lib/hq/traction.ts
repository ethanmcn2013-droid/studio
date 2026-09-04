import "server-only";
import { and, count, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { entitlementsDb } from "@/lib/entitlements-db/client";
import { sponsors as sharedSponsors, entitlementEvents } from "@/lib/entitlements-db/schema";
import { matchesCurrentVenuePayment } from "@/lib/entitlements-db/venue-payment-proof";
import { getCommercialClock } from "./commercial-clock";
import {
  entitlements,
  licenseCodes,
  redemptions,
  sponsors,
} from "@/lib/db/schema";

/** Historical May cash target, retained for context, not ratified for January. */
export const GOAL_EUR_6MO = 250_000;
const WORKSPACE_YR = 12 * 12;
export type Burndown = ReturnType<typeof getCommercialClock>;

/** The old May pace is retired. Cash, a target date and CRM contacts cannot start a clock. */
export function computeBurndown(_cashCollectedEur: number, _goalEur: number, now = Date.now()): Burndown {
  return getCommercialClock(now);
}

export type TractionState =
  | { available: false; reason: string }
  | {
      available: true;
      /** Current annual amounts matched to canonical operator payment receipts. */
      cashCollectedEur: number;
      /** Shared venues with a matching current venue_payment receipt, counted once. */
      paidVenues: number;
      /** Of those, the Founding 25 (€1,000, held on continuous renewal). */
      foundingVenues: number;
      /** Founding|paid selection with null paid_at; neither signature nor cash evidence. */
      selectedUnpaidVenues: number;
      /** Legacy or mismatched paid claims, excluded from cash and paid proof. */
      unverifiedPaidVenues: number;
      /** Free in-flight pilots (e.g. Lamb's Hill pre-conversion). */
      pilotVenues: number;
      /** Couple-side venue_edition entitlements, distribution, not revenue. */
      couplesSeeded: number;
      /** Active student_edu grants, the second-wedge signup count. */
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
      /** Inert until an authorised actual first-send source is connected. */
      burndown: Burndown;
    };

async function countWhere(
  store: typeof db,
  table: typeof entitlements | typeof redemptions | typeof sponsors,
): Promise<number> {
  const rows = await store.select({ n: count() }).from(table);
  return rows[0]?.n ?? 0;
}

export async function getTraction(
  stores?: { studio: typeof db; shared: ReturnType<typeof entitlementsDb> },
  now = Date.now(),
): Promise<TractionState> {
  try {
    const studio = stores?.studio ?? db;
    const shared = stores?.shared ?? entitlementsDb();
    const [
      activeRows,
      paidRows,
      tierRows,
      sourceRows,
      redemptionsTotal,
      codeRows,
      sponsorCount,
      venueRows,
      mirrorRows,
    ] = await Promise.all([
      studio
        .select({ n: count() })
        .from(entitlements)
        .where(eq(entitlements.status, "active")),
      studio
        .select({ n: count() })
        .from(entitlements)
        .where(
          sql`${entitlements.status} = 'active' and ${entitlements.tier} <> 'free'`,
        ),
      studio
        .select({ tier: entitlements.tier, n: count() })
        .from(entitlements)
        .where(eq(entitlements.status, "active"))
        .groupBy(entitlements.tier),
      studio
        .select({ source: entitlements.source, n: count() })
        .from(entitlements)
        .where(eq(entitlements.status, "active"))
        .groupBy(entitlements.source),
      countWhere(studio, redemptions),
      studio
        .select({ status: licenseCodes.status, n: count() })
        .from(licenseCodes)
        .groupBy(licenseCodes.status),
      countWhere(studio, sponsors),
      // One shared SQL snapshot pairs the current ledger with its receipts.
      shared.select({ venue: sharedSponsors, event: entitlementEvents })
        .from(sharedSponsors)
        .leftJoin(entitlementEvents, and(
          eq(entitlementEvents.sponsorId, sharedSponsors.id),
          eq(entitlementEvents.action, "venue_payment"),
        )),
      studio
        .select({
          slug: sponsors.slug,
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

    const venues = new Map(venueRows.filter(({ venue }) => venue.kind === "venue")
      .map(({ venue }) => [venue.id, venue]));
    const verified = new Set(venueRows.filter(({ venue, event }) =>
      matchesCurrentVenuePayment(venue, event, now)).map(({ venue }) => venue.id));
    const verifiedSlugs = new Set([...venues.values()].filter(v => verified.has(v.id)).map(v => v.slug));
    const unverifiedSlugs = new Set<string>();
    let foundingVenues = 0;
    let selectedUnpaidVenues = 0;
    let pilotVenues = 0;
    let cashCents = 0;
    for (const v of venues.values()) {
      const isPaidPlan = v.venuePlan === "founding" || v.venuePlan === "paid";
      if (v.venuePlan === "pilot") pilotVenues += 1;
      if (verified.has(v.id)) {
        if (v.venuePlan === "founding") foundingVenues += 1;
        cashCents += v.annualAmountCents!;
      } else if (isPaidPlan && v.paidAt == null) {
        selectedUnpaidVenues += 1;
      } else if (v.paidAt != null) {
        unverifiedSlugs.add(v.slug);
      }
    }
    // Studio is a mirror, never positive proof. Preserve legacy-only claims
    // for reconciliation without counting a mirrored venue twice.
    for (const v of mirrorRows) {
      if (v.paidAt != null && !verifiedSlugs.has(v.slug)) unverifiedSlugs.add(v.slug);
    }
    const paidVenues = verified.size;
    const unverifiedPaidVenues = unverifiedSlugs.size;
    const cashCollectedEur = cashCents / 100;
    const workspaceAnnualisedEur = workspaceSubs * WORKSPACE_YR;

    return {
      available: true,
      cashCollectedEur,
      paidVenues,
      foundingVenues,
      selectedUnpaidVenues,
      unverifiedPaidVenues,
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
      burndown: computeBurndown(cashCollectedEur, GOAL_EUR_6MO, now),
    };
  } catch (err) {
    return {
      available: false,
      reason:
        err instanceof Error && /(?:STUDIO|ENTITLEMENTS)_DATABASE_URL/.test(err.message)
          ? "Studio or shared entitlements database is not configured on this host."
          : "Studio or shared payment evidence is unavailable; traction cannot be verified.",
    };
  }
}

/** Exact display: a €1,500 receipt must never round up to €2k. */
export function formatEur(n: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 2,
  }).format(n);
}
