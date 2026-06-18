/**
 * Launch readiness — the countdown to the hard launch and the gates that
 * stand between here and there.
 *
 * Pure + client-safe (no server-only import): the page passes in the one
 * live input it has (paid venues, for Gate 0) and everything else is
 * deterministic from the date or honestly marked pending. The gates mirror
 * RISK_LOG.launchBlockers in blueprint.ts — keep them in step.
 *
 * Honesty contract (same as the rest of HQ): a gate is only "clear" when a
 * real signal says so. Gate 0 (first paid venue) reads the ledger; the
 * operator-owned gates (CSP enforce, capture DNS) stay "pending" until
 * there's a signal to flip them, never optimistically green.
 */

export const LAUNCH_DATE = "2026-09-01";
export const LAUNCH_LABEL = "September 1, 2026";

export type GateState = "clear" | "pending";

export type LaunchGate = {
  key: string;
  label: string;
  detail: string;
  state: GateState;
  /** true when the state is read from a live source, not assumed. */
  live: boolean;
  href?: string;
};

export type LaunchReadiness = {
  launchDate: string;
  launchLabel: string;
  /** Whole days from today (UTC) to the launch date; 0 once reached. */
  daysRemaining: number;
  weeksRemaining: number;
  gates: LaunchGate[];
  cleared: number;
  total: number;
  /** True once the date has passed. */
  launched: boolean;
};

function daysUntil(target: string, now: number): number {
  const end = new Date(`${target}T00:00:00Z`).getTime();
  const DAY = 86_400_000;
  const startOfToday = Math.floor(now / DAY) * DAY;
  return Math.max(0, Math.round((end - startOfToday) / DAY));
}

/**
 * @param paidVenues live paid-venue count, or null when the ledger is unread.
 */
export function getLaunchReadiness(
  paidVenues: number | null,
  now: number = Date.now(),
): LaunchReadiness {
  const daysRemaining = daysUntil(LAUNCH_DATE, now);

  const gate0Clear = (paidVenues ?? 0) > 0;
  const gates: LaunchGate[] = [
    {
      key: "first-paid-venue",
      label: "First paid venue",
      detail: gate0Clear
        ? "the gate has moved — first cash venue in the door"
        : "Gate 0 — the single number the plan depends on",
      state: gate0Clear ? "clear" : "pending",
      live: paidVenues != null,
      href: "/hq/crm",
    },
    {
      key: "csp-enforce",
      label: "CSP enforce-mode",
      detail: "promote from report-only across all four products",
      state: "pending",
      live: false,
      href: "/hq/health",
    },
    {
      key: "capture-dns",
      label: "Inbound capture DNS",
      detail: "capture@notes needs the secret + DNS to go live",
      state: "pending",
      live: false,
      href: "/hq/atlas",
    },
  ];

  const cleared = gates.filter((g) => g.state === "clear").length;

  return {
    launchDate: LAUNCH_DATE,
    launchLabel: LAUNCH_LABEL,
    daysRemaining,
    weeksRemaining: Math.ceil(daysRemaining / 7),
    gates,
    cleared,
    total: gates.length,
    launched: daysRemaining === 0,
  };
}
