/**
 * Window metrics: stored daily rows and lifecycle facts in, `MetricValue` out.
 *
 * Three states carry almost all of the honesty here, and the difference between
 * them is the whole point:
 *
 *   exact        every day in the window was measured.
 *   lower_bound  some days were never measured, so the true number can only be
 *                higher. Shown with its denominator so the gap is visible.
 *   unavailable  nothing was measured. Not a zero.
 *
 * A fourth, `withheld`, is the small-group rule, and it outranks all of them:
 * a number that would describe fewer than three workspaces is not shown at any
 * confidence.
 */

import type { MetricValue, ProductReach } from "../types";
import type { SponsoredProduct } from "./event-schema";
import { diffLocalDays } from "./local-date";
import {
  assertNoZeroForAbsent,
  presentBehavioural,
  presentRate,
  resolveCoverage,
  type MetricPresentation,
} from "./suppression";
import { ALL_PRODUCTS, PRODUCT_BITS } from "./rollup";

export type StoredDailyRow = {
  localDate: string;
  activeWorkspaces: number;
  activeSubjects: number;
  firstActionWorkspaces: number;
  eligibleWorkspaces: number;
  meaningfulActions: number;
  coverageMask: number;
  expectedMask: number;
  perProduct: Record<SponsoredProduct, { actions: number; workspaces: number } | null>;
};

export type StoredLifecycleRow = {
  workspaceIdHash: string;
  firstActionLocalDate: string;
  lastActionLocalDate: string;
  productLastActionLocalDate: Partial<Record<SponsoredProduct, string>>;
  day30State: "returned" | "not_returned" | "indeterminate" | null;
  day30SealedAt: number | null;
};

export type MetricWindow = {
  start: string;
  end: string;
  /** True when the window runs up to now, which lets lifecycle answer exactly. */
  trailing: boolean;
};

export type WindowInputs = {
  window: MetricWindow;
  rows: readonly StoredDailyRow[];
  lifecycle: readonly StoredLifecycleRow[];
};

const PRODUCT_LABELS: Record<SponsoredProduct, ProductReach["product"]> = {
  notes: "Notes",
  tasks: "Tasks",
  timeline: "Timeline",
  signal: "Signal",
};

function withheld(): MetricValue {
  return { state: "withheld", reason: "small_group" };
}

function unavailable(reason: string): MetricValue {
  return { state: "unavailable", reason };
}

export function daysExpected(window: MetricWindow): number {
  return diffLocalDays(window.start, window.end) + 1;
}

/** The largest group that could be re-identified, not the average one. */
export function eligibleForWindow(rows: readonly StoredDailyRow[]): number {
  return rows.reduce((max, row) => Math.max(max, row.eligibleWorkspaces), 0);
}

/**
 * Turn a suppression decision into the snapshot's own metric shape.
 *
 * The decision itself is never taken here. `suppression.ts` owns the thresholds
 * and the order they apply in, and this module now asks it rather than
 * restating it — a second implementation of a ratified privacy rule is how the
 * declared threshold and the enforced one drift apart.
 */
function fromPresentation(
  presentation: MetricPresentation,
  raw: number | null,
  emptyReason: string,
  onValue: (value: number) => MetricValue,
): MetricValue {
  assertNoZeroForAbsent(presentation, raw);
  if (presentation.state === "unavailable") return unavailable(emptyReason);
  if (presentation.state === "withheld") return withheld();
  return onValue(presentation.value);
}

/**
 * Present a counted value against the coverage of the window.
 *
 * Partial coverage can only understate a count, so it becomes a lower bound
 * rather than a number presented as complete.
 */
function present(
  value: number,
  rows: readonly StoredDailyRow[],
  window: MetricWindow,
  eligible: number,
  emptyReason: string,
): MetricValue {
  const expected = daysExpected(window);
  const covered = rows.length;
  // No measured day means no answer, whatever the counter says.
  const raw = covered === 0 ? null : value;
  return fromPresentation(
    presentBehavioural(raw, eligible),
    raw,
    emptyReason,
    (measured) =>
      covered < expected
        ? { state: "lower_bound", value: measured, denominator: expected }
        : { state: "exact", value: measured, denominator: expected },
  );
}

/**
 * Days with sponsored use: `account-metrics.v2` §7A, ratified by D-032 R11.
 *
 * Distinct venue-local dates in the window on which at least one sponsored
 * workspace recorded at least one meaningful action. **The unit is days.** A
 * date on which nine workspaces acted four hundred times is one day.
 *
 * It shipped on screen and in the PDF before it was defined anywhere. R11
 * adopted it rather than removing it, and recorded why it is not founder-only:
 * it is an aggregate over dates, bounded by the length of the window rather
 * than by the size of the cohort, so no arrangement of it resolves toward an
 * individual couple. E09.02 §2's founder-only bar does not reach it.
 *
 * It is still withheld below three eligible workspaces. That is not because the
 * number is unsafe on its own reasoning, but because it sits beside the
 * behavioural counts, and a figure that appears while its neighbours are
 * withheld invites a reader to reason about the withheld ones. Sharing
 * `present()` with the others is what keeps that true without a second rule to
 * maintain.
 */
export function daysWithSponsoredUse(inputs: WindowInputs): MetricValue {
  const { rows, window } = inputs;
  const eligible = eligibleForWindow(rows);
  const value = rows.filter((row) => row.activeWorkspaces >= 1).length;
  return present(
    value,
    rows,
    window,
    eligible,
    "No sponsored-use rollup for this period",
  );
}

export function firstUsefulAction(inputs: WindowInputs): MetricValue {
  const { rows, lifecycle, window } = inputs;
  const eligible = eligibleForWindow(rows);
  const value = lifecycle.filter(
    (row) =>
      row.firstActionLocalDate >= window.start && row.firstActionLocalDate <= window.end,
  ).length;
  return present(value, rows, window, eligible, "No sponsored-use rollup for this period");
}

/**
 * Distinct workspaces active in the window.
 *
 * For a trailing window the lifecycle answers exactly and survives the event
 * sweep. For a closed historical period it cannot prove a workspace acted
 * *inside* the period, so the best honest answer is the largest single day,
 * marked as a lower bound.
 */
export function activeRecently(inputs: WindowInputs): MetricValue {
  const { rows, lifecycle, window } = inputs;
  const eligible = eligibleForWindow(rows);
  const emptyReason = "No sponsored-use rollup for this period";

  if (window.trailing) {
    const value = lifecycle.filter(
      (row) => row.lastActionLocalDate >= window.start,
    ).length;
    return present(value, rows, window, eligible, emptyReason);
  }
  const raw =
    rows.length === 0
      ? null
      : rows.reduce((max, row) => Math.max(max, row.activeWorkspaces), 0);
  return fromPresentation(
    presentBehavioural(raw, eligible),
    raw,
    emptyReason,
    (measured) => ({
      state: "lower_bound",
      value: measured,
      denominator: daysExpected(window),
    }),
  );
}

/**
 * Day-30 continuation over the closed part of the cohort.
 *
 * A rate, so the threshold is five rather than three, and the denominator
 * travels with it. Workspaces whose band has not closed are excluded from both
 * sides: dividing by people who have not had the chance to return yet reads as
 * churn when it is only impatience.
 */
export function continuedAfter30Days(inputs: WindowInputs): MetricValue {
  const { lifecycle, window } = inputs;
  const inWindow = lifecycle.filter(
    (row) =>
      row.firstActionLocalDate >= window.start && row.firstActionLocalDate <= window.end,
  );
  const sealed = inWindow.filter(
    (row) =>
      row.day30SealedAt != null &&
      (row.day30State === "returned" || row.day30State === "not_returned"),
  );
  const raw =
    sealed.length === 0
      ? null
      : sealed.filter((row) => row.day30State === "returned").length;
  // The cohort itself is the population at risk of re-identification here, so
  // it is what the rate threshold is measured against.
  return fromPresentation(
    presentRate(raw, sealed.length),
    raw,
    "No closed day-30 cohort for this period",
    (returned) => ({
      state: "exact",
      value: returned,
      denominator: sealed.length,
    }),
  );
}

export function productReach(inputs: WindowInputs): ProductReach[] {
  const { rows, lifecycle, window } = inputs;
  const eligible = eligibleForWindow(rows);
  const expectedMask = rows.reduce((mask, row) => mask | row.expectedMask, 0);
  const coveredMask = rows.reduce((mask, row) => mask | row.coverageMask, 0);

  return ALL_PRODUCTS.map((product) => {
    const label = PRODUCT_LABELS[product];
    const detail = REACH_DETAIL[product];
    const isExpected = (expectedMask & PRODUCT_BITS[product]) !== 0;
    const isCovered = (coveredMask & PRODUCT_BITS[product]) !== 0;

    if (!isCovered) {
      return {
        product: label,
        workspacesReached: unavailable(
          isExpected
            ? `${label} is not instrumented for this period`
            : `${label} is not part of this reporting period`,
        ),
        supportingDetail: detail,
      };
    }
    const emptyReason = "No sponsored-use rollup for this period";
    if (window.trailing) {
      const value = lifecycle.filter((row) => {
        const last = row.productLastActionLocalDate[product];
        return last != null && last >= window.start;
      }).length;
      return {
        product: label,
        workspacesReached: present(value, rows, window, eligible, emptyReason),
        supportingDetail: detail,
      };
    }
    const raw =
      rows.length === 0
        ? null
        : rows.reduce(
            (max, row) => Math.max(max, row.perProduct[product]?.workspaces ?? 0),
            0,
          );
    return {
      product: label,
      workspacesReached: fromPresentation(
        presentBehavioural(raw, eligible),
        raw,
        emptyReason,
        (measured) => ({
          state: "lower_bound",
          value: measured,
          denominator: daysExpected(window),
        }),
      ),
      supportingDetail: detail,
    };
  });
}

const REACH_DETAIL: Record<SponsoredProduct, string> = {
  notes: "Reached through committed note work",
  tasks: "Reached through committed task work",
  timeline: "Reached through curated timeline work",
  signal: "Reached through deliberately opened briefings",
};

export type CoverageSummary = {
  state: "complete" | "partial" | "suppressed" | "unavailable";
  daysCovered: number;
  daysExpected: number;
  modulesCovered: number;
  modulesExpected: number;
};

export function summariseCoverage(inputs: WindowInputs): CoverageSummary {
  const { rows, window } = inputs;
  const expected = daysExpected(window);
  const covered = rows.length;
  const expectedMask = rows.reduce((mask, row) => mask | row.expectedMask, 0);
  const coveredMask = rows.reduce((mask, row) => mask | row.coverageMask, 0);
  const expectedProducts = ALL_PRODUCTS.filter(
    (p) => (expectedMask & PRODUCT_BITS[p]) !== 0,
  );
  const modulesExpected = expectedProducts.length;
  const modulesCovered = ALL_PRODUCTS.filter(
    (p) => (coveredMask & PRODUCT_BITS[p]) !== 0,
  ).length;
  const missingProducts = expectedProducts.filter(
    (p) => (coveredMask & PRODUCT_BITS[p]) === 0,
  );
  const eligible = eligibleForWindow(rows);

  // The ordering of unavailable over suppressed over partial is a privacy
  // rule, not a presentation choice, so it is asked for rather than repeated.
  const state: CoverageSummary["state"] = resolveCoverage({
    eligibleWorkspaces: eligible,
    daysCovered: covered,
    daysExpected: expected,
    missingProducts,
  });

  return {
    state,
    daysCovered: covered,
    daysExpected: expected,
    modulesCovered,
    modulesExpected: modulesExpected || ALL_PRODUCTS.length,
  };
}
