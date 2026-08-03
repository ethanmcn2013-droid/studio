import {
  VENUE_EDITION_ANNUAL_PRICE_EUR,
  VENUE_EDITION_FOUNDING_ANNUAL_PRICE_EUR,
} from "@/lib/venue-edition";

/**
 * Financial model, the projection behind the ask.
 *
 * A hand-curated, fully-transparent model: every figure below is an
 * ASSUMPTION the founder owns and edits here. It is cash-basis (venue
 * editions are annual prepay, so cash = ACV in the month signed, what
 * matters for runway). Live actuals (cash collected, paid venues) are
 * overlaid by the page so plan and reality sit side by side; the model
 * never overwrites an assumption with a hope.
 *
 * Honesty contract (same as traction.ts): this is a projection, labelled
 * as one everywhere it renders. Nothing here is presented as actuals. The
 * one place the model touches live data is the plan-vs-actual overlay and
 * the runway read, both clearly marked "modeled".
 *
 * Pure + client-safe (no server-only import) so the blueprint page can pull
 * the runway summary without dragging the DB layer into anything.
 *
 * ── HOW THIS IS ACTUALLY FUNDED (founder, 2026-08-03) ────────────────────
 *
 * The company is mid-registration and has no bank account yet, so its opening
 * balance is **zero and that is correct, not a gap**. The founder pays the
 * running costs personally until the company earns enough to pay its own way,
 * and from that point the company funds itself.
 *
 * That is a real inflow, and the model used to have no way to say so. A zero
 * opening balance read as "no money exists", which produced a phantom €1,530
 * shortfall and a `defaultAlive: false` that described a modelling hole rather
 * than the business.
 *
 * So founder funding is now modelled explicitly: any month the company cannot
 * cover from its own cash, the founder tops up to zero, and the top-up is
 * recorded. Two things follow that are worth more than the old runway number:
 *
 *   `founderCapitalEur`      what the founder is personally out of pocket
 *   `founderFundingEndsAt`   the month the company stops needing him
 *
 * `defaultAlive` now means what it should: the company covers itself from its
 * own revenue and never comes back for more.
 *
 * The €15,000 facility is an ask, not a fact. It is excluded from cash until it
 * is granted, so every figure here stands on revenue and founder capital alone.
 * That is the point: the plan should be true whether or not the loan lands.
 */

export const FIN_META = {
  startMonth: "2026-06", // index 0
  horizonMonths: 18, // through 2027-11
  launchMonth: "2026-09", // index 3, the hard launch
  basis: "cash" as const,
  // LIVE DATA. Confirmed by the founder 2026-08-03: zero, and correctly so.
  // The company is mid-registration with no bank account yet. Costs before it
  // earns are met by the founder personally, modelled as founder funding below.
  startingCashEur: 0,
  /**
   * MFI facility ask. €15,000 at 6% over 48 months (≈ €352.28/mo), matching the
   * loan pack. This read 40,000 until 2026-08-03, with a comment claiming it
   * matched the pack. It did not, and the pack was right.
   */
  facilityEur: 15_000,
  /**
   * **Not obtained.** The founder is building the presentation and may not get
   * the funding. Unsecured money is not counted as cash: while this is false the
   * model runs entirely on revenue plus founder capital, which is the only
   * funding that certainly exists.
   *
   * Flip to true the day it lands. The facility is worth having and it is not
   * what makes the plan work: with it the founder puts in €1,530 and is done by
   * August 2026; without it, €1,698 and done by September. It is a buffer, not
   * a lifeline, and the plan should never be presented as depending on it.
   */
  facilitySecured: false,
  /** Drawn at incorporation, modelled at launch. Only applies once secured. */
  facilityDrawIndex: 3,
  revisedOn: "2026-07-11",
};

/**
 * Pricing, from the ratified Venue Edition model + workspace tier.
 *
 * Both venue numbers are VAT-INCLUSIVE (venue-edition-founding-25-2026-08-03).
 * If Signal Studio is or becomes an accountable person, €1,000 inclusive nets
 * about €813 at the 23% standard rate and the model is roughly 19% optimistic
 * on venue revenue. That is a known, accepted exposure (VEF-2026 R-022) and it
 * is not modelled here, because the answer is a written Revenue position that
 * has not been obtained yet. Rebuild on net figures the moment it arrives.
 */
export const FIN_PRICING = {
  // Founding 25: held for as long as the agreement renews without lapse.
  foundingVenueEur: VENUE_EDITION_FOUNDING_ANNUAL_PRICE_EUR,
  paidVenueAcvEur: VENUE_EDITION_ANNUAL_PRICE_EUR, // fixed price, no size or volume band
  workspaceMonthlyEur: 12,
  // Student edition is distribution, not revenue (per traction.ts) → €0.
};

/**
 * Monthly new-venue schedule (editable). Length must equal horizonMonths.
 *
 * Founding is exactly 25 places and they close (founder decision, 2026-08-03).
 * Two things follow, and both were wrong before:
 *
 * 1. **Founding cannot start before launch.** "Release on 1 September" means
 *    ready to contact Cohort 1 (D-015 Q1), so the first founding cash lands at
 *    index 3, not index 1. The old ramp booked founding revenue in July.
 * 2. **Standard-rate venues cannot close while founding places remain.** A venue
 *    that says yes during the founding window takes a founding place, by
 *    definition, until all 25 are gone. Running both streams in parallel from
 *    launch modelled venues paying €1,500 while €1,000 places were still open.
 *    Paid now begins once the 25 are filled.
 *
 * Both arrays are assumptions the founder owns. The shape is deliberately
 * unflattering: 25 founding places over seven months from a standing start.
 */
export const FIN_RAMP = {
  // 25 founding places over Sep '26 to Apr '27. One in September: Cohort 1 goes
  // out on launch day, and a venue still has to reply, take a call, get a
  // proposal, sit the 14-day hold and clear a payment. October is the realistic
  // first full month, and the tail is slow because the last few places go to
  // venues who said "not now" the first time.
  newFounding: [0, 0, 0, 1, 3, 4, 5, 4, 4, 3, 1, 0, 0, 0, 0, 0, 0, 0], // 25
  // Standard rate, once the founding places are gone. Deliberately SLOWER per
  // month than founding was: no €500 saving, no numbered place, no scarcity, and
  // the 45-minute ring is already spent. A ramp that accelerates after the
  // discount ends is a hockey stick with no mechanism under it.
  //
  // The honest counter-argument, named so it stays visible: by month 11 there
  // are 25 live venues, real case studies and referrals, which is exactly what
  // the founding cohort was bought for. If those convert, this line is too low.
  // It stays low until there is evidence, because a forecast that assumes its
  // own proof is the thing this model exists to avoid.
  newPaid:     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3, 3, 3, 4, 4], // 21
  /** Workspace subs that accrue per venue in the funnel (negative-CAC tail). */
  workspaceSubsPerVenue: 0.5,
};

/** Monthly operating costs (editable). Solo founder, €0 salary. */
export const FIN_COSTS = {
  infraBaseEur: 150, // Vercel + Turso + email + domains
  infraGrowthPerMonthEur: 10, // scales gently with usage
  toolsEur: 200, // the agent factory, design, misc SaaS
  marketingPreLaunchEur: 150,
  /**
   * Switched up once the message is proven. This was described as
   * facility-funded; the facility is not secured, so it comes out of revenue.
   * €800/mo across the post-launch horizon is roughly €12,000, and the model
   * shows it is affordable from revenue alone. It is still the first line to
   * cut if the venue ramp runs behind.
   */
  marketingPostLaunchEur: 800,
};

export const FIN_UNIT = {
  grossMarginPct: 90, // software economics
  venueLifetimeYears: 3, // annual editions, high retention
};

export type FinMonth = {
  index: number;
  label: string; // "Jun '26"
  isLaunch: boolean;
  newFounding: number;
  newPaid: number;
  cumVenues: number;
  workspaceSubs: number;
  revenueEur: number;
  costsEur: number;
  netEur: number;
  /** Founder cash put in this month to keep the company at or above zero. */
  founderFundingEur: number;
  cashEndEur: number;
};

export type UnitEconomics = {
  blendedAcvEur: number;
  cacEur: number;
  ltvEur: number;
  ltvCacRatio: number;
  paybackMonths: number; // annual prepay → immediate
  grossMarginPct: number;
};

export type FinancialSummary = {
  months: FinMonth[];
  year1RevenueEur: number; // first 12 months
  horizonRevenueEur: number;
  totalVenuesHorizon: number;
  workspaceSubsAtHorizon: number;
  lowestCashEur: number;
  runwayMonths: number; // months of cash from now at trailing burn
  /** The company covers itself from its own revenue and never comes back. */
  defaultAlive: boolean;
  peakMonthlyBurnEur: number;
  /** Total founder cash into the company across the horizon. */
  founderCapitalEur: number;
  /** Label of the last month needing founder cash, or null if none ever does. */
  founderFundingEndsAt: string | null;
  unit: UnitEconomics;
};

function monthLabel(startMonth: string, offset: number): string {
  const [y, m] = startMonth.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + offset, 1));
  const mon = d.toLocaleString("en-IE", { month: "short", timeZone: "UTC" });
  const yy = String(d.getUTCFullYear()).slice(2);
  return `${mon} '${yy}`;
}

export function buildFinancialModel(): FinancialSummary {
  const n = FIN_META.horizonMonths;
  const launchIdx = FIN_RAMP.newPaid.findIndex((_, i) => monthLabelIsLaunch(i));
  const months: FinMonth[] = [];

  let cash = FIN_META.startingCashEur;
  let cumVenues = 0;

  for (let i = 0; i < n; i++) {
    const newFounding = FIN_RAMP.newFounding[i] ?? 0;
    const newPaid = FIN_RAMP.newPaid[i] ?? 0;
    cumVenues += newFounding + newPaid;

    const workspaceSubs = Math.round(cumVenues * FIN_RAMP.workspaceSubsPerVenue);

    const revenueEur =
      newFounding * FIN_PRICING.foundingVenueEur +
      newPaid * FIN_PRICING.paidVenueAcvEur +
      workspaceSubs * FIN_PRICING.workspaceMonthlyEur;

    const preLaunch = i < FIN_META.facilityDrawIndex;
    const costsEur =
      FIN_COSTS.infraBaseEur +
      FIN_COSTS.infraGrowthPerMonthEur * i +
      FIN_COSTS.toolsEur +
      (preLaunch ? FIN_COSTS.marketingPreLaunchEur : FIN_COSTS.marketingPostLaunchEur);

    // Unsecured funding is not cash. Until the facility is actually granted it
    // contributes nothing, so the model runs on revenue plus founder capital.
    const facilityDraw =
      FIN_META.facilitySecured && i === FIN_META.facilityDrawIndex
        ? FIN_META.facilityEur
        : 0;
    const netEur = revenueEur - costsEur;
    cash = cash + netEur + facilityDraw;

    // The founder covers whatever the company cannot, until it earns enough to
    // carry itself. He tops up to zero rather than to a buffer, because that is
    // what actually happens: a bill arrives and he pays it. The company holds no
    // float it has not earned.
    const founderFundingEur = cash < 0 ? Math.round(-cash) : 0;
    cash += founderFundingEur;

    months.push({
      index: i,
      label: monthLabel(FIN_META.startMonth, i),
      isLaunch: monthLabelIsLaunch(i),
      newFounding,
      newPaid,
      cumVenues,
      workspaceSubs,
      revenueEur,
      costsEur,
      netEur,
      founderFundingEur,
      cashEndEur: Math.round(cash),
    });
  }

  // ── Summary ──────────────────────────────────────────────────────────
  const year1RevenueEur = months.slice(0, 12).reduce((s, m) => s + m.revenueEur, 0);
  const horizonRevenueEur = months.reduce((s, m) => s + m.revenueEur, 0);
  const totalVenuesHorizon = months.reduce((s, m) => s + m.newFounding + m.newPaid, 0);
  const workspaceSubsAtHorizon = months[months.length - 1]?.workspaceSubs ?? 0;
  const lowestCashEur = Math.min(...months.map((m) => m.cashEndEur));
  const peakMonthlyBurnEur = Math.max(0, ...months.map((m) => -m.netEur));

  // Founder capital, and the month the company stops needing him. This replaces
  // "cash never hits zero" as the health question: with the founder covering
  // the shortfall, cash cannot go negative, so that test would always pass and
  // mean nothing. Default-alive is now the honest thing: the company carries
  // itself from its own revenue and does not come back for more.
  const fundedMonths = months.filter((m) => m.founderFundingEur > 0);
  const founderCapitalEur = fundedMonths.reduce((s, m) => s + m.founderFundingEur, 0);
  const lastFunded = fundedMonths[fundedMonths.length - 1] ?? null;
  const founderFundingEndsAt = lastFunded ? lastFunded.label : null;
  const defaultAlive =
    lastFunded === null || lastFunded.index < months.length - 1;

  // Runway, counted as months the company can carry itself. Founder top-ups
  // keep the balance at or above zero by construction, so a cash test would
  // always report the full horizon. The honest measure is how long it runs
  // without asking him again: the horizon, minus the months he had to fund.
  const runwayMonths = n - fundedMonths.length;

  // ── Unit economics ───────────────────────────────────────────────────
  const totalPaidish = months.reduce((s, m) => s + m.newFounding + m.newPaid, 0) || 1;
  const blendedAcvEur = Math.round(
    months.reduce(
      (s, m) =>
        s +
        m.newFounding * FIN_PRICING.foundingVenueEur +
        m.newPaid * FIN_PRICING.paidVenueAcvEur,
      0,
    ) / totalPaidish,
  );
  const totalMarketingEur = months.reduce(
    (s, m) =>
      s +
      (m.index < FIN_META.facilityDrawIndex
        ? FIN_COSTS.marketingPreLaunchEur
        : FIN_COSTS.marketingPostLaunchEur),
    0,
  );
  const cacEur = Math.round(totalMarketingEur / totalPaidish);
  const ltvEur = Math.round(
    (blendedAcvEur * FIN_UNIT.grossMarginPct) / 100 * FIN_UNIT.venueLifetimeYears,
  );
  const ltvCacRatio = cacEur > 0 ? Math.round((ltvEur / cacEur) * 10) / 10 : 0;

  return {
    months,
    year1RevenueEur: Math.round(year1RevenueEur),
    horizonRevenueEur: Math.round(horizonRevenueEur),
    totalVenuesHorizon,
    workspaceSubsAtHorizon,
    lowestCashEur,
    runwayMonths,
    defaultAlive,
    peakMonthlyBurnEur: Math.round(peakMonthlyBurnEur),
    founderCapitalEur,
    founderFundingEndsAt,
    unit: {
      blendedAcvEur,
      cacEur,
      ltvEur,
      ltvCacRatio,
      paybackMonths: 0, // annual prepay collected at signature
      grossMarginPct: FIN_UNIT.grossMarginPct,
    },
  };
}

function monthLabelIsLaunch(i: number): boolean {
  const [sy, sm] = FIN_META.startMonth.split("-").map(Number);
  const [ly, lm] = FIN_META.launchMonth.split("-").map(Number);
  return sy * 12 + (sm - 1) + i === ly * 12 + (lm - 1);
}

/** €1234567 → "€1.23m" / "€48k" / "€0". Local + pure (client-safe). */
export function finEur(n: number): string {
  const neg = n < 0;
  const a = Math.abs(n);
  let out: string;
  if (a >= 1_000_000) out = `€${(a / 1_000_000).toFixed(2)}m`;
  else if (a >= 1_000) out = `€${(a / 1_000).toFixed(a >= 10_000 ? 0 : 1)}k`;
  else out = `€${Math.round(a)}`;
  return neg ? `−${out}` : out;
}

/**
 * Runway for the blueprint metric. Modeled, but blends the one live input we
 * have, actual cash collected extends the modeled opening position.
 * Returns a capped month count + whether the plan is default-alive.
 */
export function getModeledRunway(cashCollectedActualEur: number | null): {
  months: number;
  defaultAlive: boolean;
} {
  const summary = buildFinancialModel();
  // A live cash inflow only ever helps runway; never let it shorten the plan.
  const defaultAlive = summary.defaultAlive || (cashCollectedActualEur ?? 0) > 0;
  return { months: summary.runwayMonths, defaultAlive };
}
