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
import { BEHAVIOURAL_MIN_WORKSPACES } from "./suppression";
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
  if (covered === 0) return unavailable(emptyReason);
  if (eligible < BEHAVIOURAL_MIN_WORKSPACES) return withheld();
  if (covered < expected) {
    return { state: "lower_bound", value, denominator: expected };
  }
  return { state: "exact", value, denominator: expected };
}

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
  if (rows.length === 0) {
    return unavailable("No sponsored-use rollup for this period");
  }
  if (eligible < BEHAVIOURAL_MIN_WORKSPACES) return withheld();

  if (window.trailing) {
    const value = lifecycle.filter(
      (row) => row.lastActionLocalDate >= window.start,
    ).length;
    return present(value, rows, window, eligible, "No sponsored-use rollup for this period");
  }
  const value = rows.reduce((max, row) => Math.max(max, row.activeWorkspaces), 0);
  return { state: "lower_bound", value, denominator: daysExpected(window) };
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
  if (sealed.length === 0) {
    return unavailable("No closed day-30 cohort for this period");
  }
  if (sealed.length < 5) return withheld();
  const returned = sealed.filter((row) => row.day30State === "returned").length;
  return { state: "exact", value: returned, denominator: sealed.length };
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
    if (rows.length === 0) {
      return {
        product: label,
        workspacesReached: unavailable("No sponsored-use rollup for this period"),
        supportingDetail: detail,
      };
    }
    if (eligible < BEHAVIOURAL_MIN_WORKSPACES) {
      return { product: label, workspacesReached: withheld(), supportingDetail: detail };
    }

    if (window.trailing) {
      const value = lifecycle.filter((row) => {
        const last = row.productLastActionLocalDate[product];
        return last != null && last >= window.start;
      }).length;
      return {
        product: label,
        workspacesReached: present(
          value,
          rows,
          window,
          eligible,
          "No sponsored-use rollup for this period",
        ),
        supportingDetail: detail,
      };
    }
    const value = rows.reduce(
      (max, row) => Math.max(max, row.perProduct[product]?.workspaces ?? 0),
      0,
    );
    return {
      product: label,
      workspacesReached: { state: "lower_bound", value, denominator: daysExpected(window) },
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
  const modulesExpected = ALL_PRODUCTS.filter(
    (p) => (expectedMask & PRODUCT_BITS[p]) !== 0,
  ).length;
  const modulesCovered = ALL_PRODUCTS.filter(
    (p) => (coveredMask & PRODUCT_BITS[p]) !== 0,
  ).length;
  const eligible = eligibleForWindow(rows);

  let state: CoverageSummary["state"];
  if (covered === 0) state = "unavailable";
  else if (eligible < BEHAVIOURAL_MIN_WORKSPACES) state = "suppressed";
  else if (covered < expected || modulesCovered < modulesExpected) state = "partial";
  else state = "complete";

  return {
    state,
    daysCovered: covered,
    daysExpected: expected,
    modulesCovered,
    modulesExpected: modulesExpected || ALL_PRODUCTS.length,
  };
}
