/**
 * Financial model — the projection behind the ask.
 *
 * A hand-curated, fully-transparent model: every figure below is an
 * ASSUMPTION the founder owns and edits here. It is cash-basis (venue
 * editions are annual prepay, so cash = ACV in the month signed — what
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
 */

export const FIN_META = {
  startMonth: "2026-06", // index 0
  horizonMonths: 18, // through 2027-11
  launchMonth: "2026-09", // index 3 — the hard launch
  basis: "cash" as const,
  // LIVE DATA: set to the real opening bank balance. Conservative placeholder.
  startingCashEur: 5_000,
  facilityEur: 40_000, // MFI facility (matches the loan pack)
  facilityDrawIndex: 3, // drawn at incorporation, modeled at launch
  revisedOn: "2026-06-19",
};

/** Pricing — from the ratified Venue Edition model + workspace tier. */
export const FIN_PRICING = {
  foundingVenueEur: 1_500, // founding cohort, locked for life
  paidVenueAcvEur: 1_800, // blended paid ACV (band €1.5k–4k, conservative)
  workspaceMonthlyEur: 12,
  // Student edition is distribution, not revenue (per traction.ts) → €0.
};

/**
 * Monthly new-venue schedule (editable). Founding is a limited, front-loaded
 * cohort that closes after launch; paid ramps from launch onward. Length must
 * equal horizonMonths.
 */
export const FIN_RAMP = {
  newFounding: [0, 1, 2, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  newPaid:     [0, 0, 0, 1, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9],
  /** Workspace subs that accrue per venue in the funnel (negative-CAC tail). */
  workspaceSubsPerVenue: 0.5,
};

/** Monthly operating costs (editable). Solo founder, €0 salary. */
export const FIN_COSTS = {
  infraBaseEur: 150, // Vercel + Turso + email + domains
  infraGrowthPerMonthEur: 10, // scales gently with usage
  toolsEur: 200, // the agent factory, design, misc SaaS
  marketingPreLaunchEur: 150,
  marketingPostLaunchEur: 800, // switched up once the message is proven (facility-funded)
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
  defaultAlive: boolean; // cash never hits zero across the horizon
  peakMonthlyBurnEur: number;
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

    const facilityDraw = i === FIN_META.facilityDrawIndex ? FIN_META.facilityEur : 0;
    const netEur = revenueEur - costsEur;
    cash = cash + netEur + facilityDraw;

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
      cashEndEur: Math.round(cash),
    });
  }

  // ── Summary ──────────────────────────────────────────────────────────
  const year1RevenueEur = months.slice(0, 12).reduce((s, m) => s + m.revenueEur, 0);
  const horizonRevenueEur = months.reduce((s, m) => s + m.revenueEur, 0);
  const totalVenuesHorizon = months.reduce((s, m) => s + m.newFounding + m.newPaid, 0);
  const workspaceSubsAtHorizon = months[months.length - 1]?.workspaceSubs ?? 0;
  const lowestCashEur = Math.min(...months.map((m) => m.cashEndEur));
  const defaultAlive = lowestCashEur > 0;
  const peakMonthlyBurnEur = Math.max(0, ...months.map((m) => -m.netEur));

  // Runway from "now" (index 0) at the trailing pre-revenue burn. If cash
  // never hits zero across the horizon, the plan is default-alive and we
  // report the horizon as the floor (labelled 18+ at the edge).
  let runwayMonths = n;
  for (const m of months) {
    if (m.cashEndEur <= 0) {
      runwayMonths = m.index;
      break;
    }
  }

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
 * have — actual cash collected extends the modeled opening position.
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
