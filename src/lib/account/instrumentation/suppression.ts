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

/**
 * Access metrics carry no cohort floor. **Ratified in D-032 R12.**
 *
 * Covered, available, issued and redeemed are the direct contract record
 * between Signal Studio and the venue: the venue's own commercial facts, about
 * invitations Signal issued on its instruction. They are not behavioural
 * observation of couples, so the risk the floors of 3 and 5 exist to manage —
 * a number resolving toward one identifiable couple's conduct — is not present.
 * A venue with one redeemed invitation is told one, at any cohort size.
 *
 * This was an open question until D-032. It is now a rule, and the reasoning is
 * here rather than in a document so that raising this to 3 "for consistency"
 * has to argue with the sentence above first. The asymmetry is deliberate.
 *
 * The floors either side of it are ratified in D-011 point 3 and are not
 * editable here.
 */
export const ACCESS_METRIC_MIN_WORKSPACES = 0;

/**
 * Which floor a metric answers to, by class.
 *
 * One table rather than three scattered constants: a projector that has to pick
 * a threshold picks a class instead, and the classes are exhaustive.
 */
export const COHORT_FLOOR = {
  /** Counts of what couples did. */
  behavioural: BEHAVIOURAL_MIN_WORKSPACES,
  /** Rates, medians and cohort comparisons. */
  rate: RATE_MIN_WORKSPACES,
  /** Covered, available, issued, redeemed. The contract record. */
  access: ACCESS_METRIC_MIN_WORKSPACES,
} as const;

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

/**
 * An access count: emitted exactly, at any cohort size. D-032 R12.
 *
 * There is no `eligibleWorkspaces` argument, and that absence is the point. A
 * caller cannot accidentally apply a behavioural floor to a contract fact, and
 * a reader can see from the signature that no floor exists to apply. Absent is
 * still absent: `null` in, `unavailable` out, never a zero.
 */
export function presentAccess(value: number | null): MetricPresentation {
  if (value === null) return { state: "unavailable" };
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
