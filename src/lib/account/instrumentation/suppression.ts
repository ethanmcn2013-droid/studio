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
 *
 * Two rules follow from the fact that a venue knows exactly which couples it
 * invited.
 *
 * 1. **The behavioural floor is two-sided** (R-027). A count of 1 in a
 *    population of 40 is a statement about one identifiable couple. So is 39 of
 *    40, which names the one who did not. A count is publishable only when both
 *    the count and its complement clear the floor.
 * 2. **A rate is one value, not two** (R-028). Numerator and denominator travel
 *    together inside `RateValue`, so the five-workspace floor is a property of
 *    the value rather than a discipline someone has to remember at the call
 *    site. Nothing outside this module can construct a rate.
 *
 * The withheld state carries no reason code that distinguishes "too low" from
 * "too high", and no surface may render one. A message that says "fewer than
 * three" is itself the disclosure the floor exists to prevent.
 */

import type { RateValue } from "../types";

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

/**
 * The two-sided small-cell test.
 *
 * `value` counts members of `population`. Both the cell and its complement must
 * clear the floor: publishing "3 of 5" also publishes "2 of 5 did not", and the
 * second sentence is the one that identifies people.
 *
 * A negative complement (a value larger than the population it is drawn from)
 * is a broken input, and a broken input is never published.
 */
export function isSmallCell(value: number, population: number): boolean {
  if (value < BEHAVIOURAL_MIN_WORKSPACES) return true;
  return population - value < BEHAVIOURAL_MIN_WORKSPACES;
}

/**
 * A behavioural count — the unit is the sponsored workspace, and the value is a
 * subset of the eligible population.
 *
 * Withheld when the population is too small to describe at all, and withheld
 * again when the count or its complement lands in a small cell.
 */
export function presentBehavioural(
  value: number | null,
  eligibleWorkspaces: number,
): MetricPresentation {
  if (value === null) return { state: "unavailable" };
  if (eligibleWorkspaces < BEHAVIOURAL_MIN_WORKSPACES) return { state: "withheld" };
  if (isSmallCell(value, eligibleWorkspaces)) return { state: "withheld" };
  return { state: "value", value };
}

/**
 * A count whose unit is not the sponsored workspace — days in a window, for
 * example.
 *
 * The population floor still applies, because a small cohort should not be
 * described at all. The complement rule does not: "four of thirty days" says
 * nothing about any identifiable couple, and applying a subject-level rule to a
 * calendar would suppress honest reporting for no privacy gain.
 */
export function presentWindowMetric(
  value: number | null,
  eligibleWorkspaces: number,
): MetricPresentation {
  if (value === null) return { state: "unavailable" };
  if (eligibleWorkspaces < BEHAVIOURAL_MIN_WORKSPACES) return { state: "withheld" };
  return { state: "value", value };
}

/**
 * The only way to make a rate.
 *
 * `denominator` is the eligible cohort, and it carries the five-workspace floor
 * ratified in D-011. The returned value keeps both numbers together, so no
 * caller can pair a numerator from one metric with a denominator from another.
 *
 * The cast is the brand. `RateValue`'s published variant carries a symbol this
 * module owns and nothing else can name, which is what makes an object literal
 * elsewhere fail to compile.
 */
export function presentRate(
  numerator: number | null,
  denominator: number | null,
  absentReason: string,
): RateValue {
  if (numerator === null || denominator === null) {
    return { state: "unavailable", reason: absentReason };
  }
  if (denominator <= 0) return { state: "unavailable", reason: absentReason };
  if (denominator < RATE_MIN_WORKSPACES) return { state: "withheld", reason: "small_group" };
  if (numerator < 0 || numerator > denominator) {
    return { state: "unavailable", reason: absentReason };
  }
  return { state: "rate", numerator, denominator } as RateValue;
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
