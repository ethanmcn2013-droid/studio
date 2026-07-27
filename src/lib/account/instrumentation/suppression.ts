/**
 * Suppression and coverage — the rules that decide what a venue may be told.
 *
 * These live in the projector rather than the interface on purpose. A threshold
 * enforced in a component is a threshold that leaks the first time someone adds
 * a second component, or an export, or a report.
 *
 * The one rule underneath all of this: a withheld or unknown value never
 * renders as `0`. Zero is a claim that nothing happened. These states say we do
 * not know, which is a different sentence.
 */

export const BEHAVIOURAL_MIN_WORKSPACES = 3;
export const RATE_MIN_WORKSPACES = 5;

export type CoverageState = "complete" | "partial" | "suppressed" | "unavailable";

export type MetricPresentation =
  | { state: "value"; value: number }
  | { state: "withheld" }
  | { state: "unavailable" };

export type CoverageInput = {
  /** Distinct sponsored workspaces eligible in the window. */
  eligibleWorkspaces: number;
  /** Days in the window that produced a completed rollup. */
  daysCovered: number;
  daysExpected: number;
  /** Products with no rollup at all; they cannot be reported as zero. */
  missingProducts: readonly string[];
};

/** A behavioural count: withheld under three eligible workspaces. */
export function presentBehavioural(
  value: number | null,
  eligibleWorkspaces: number,
): MetricPresentation {
  if (value === null) return { state: "unavailable" };
  if (eligibleWorkspaces < BEHAVIOURAL_MIN_WORKSPACES) return { state: "withheld" };
  return { state: "value", value };
}

/** A rate or cohort comparison: withheld under five eligible workspaces. */
export function presentRate(
  value: number | null,
  eligibleWorkspaces: number,
): MetricPresentation {
  if (value === null) return { state: "unavailable" };
  if (eligibleWorkspaces < RATE_MIN_WORKSPACES) return { state: "withheld" };
  return { state: "value", value };
}

export function resolveCoverage(input: CoverageInput): CoverageState {
  if (input.daysExpected <= 0 || input.daysCovered <= 0) return "unavailable";
  if (input.eligibleWorkspaces < BEHAVIOURAL_MIN_WORKSPACES) return "suppressed";
  if (input.daysCovered < input.daysExpected || input.missingProducts.length > 0)
    return "partial";
  return "complete";
}

/**
 * Guard for anything leaving the projector. Catches the one mistake this whole
 * module exists to prevent: an absent value dressed up as a zero.
 */
export function assertNoZeroForAbsent(
  presentation: MetricPresentation,
  rawValue: number | null,
): void {
  if (presentation.state === "value" && rawValue === null) {
    throw new Error("absent metric rendered as a value");
  }
}
