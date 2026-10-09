import type { AccountSnapshot } from "../types";
import {
  activeRecently,
  continuedAfter30Days,
  daysWithSponsoredUse,
  firstUsefulAction,
  productReach,
  summariseCoverage,
  type MetricWindow,
  type StoredDailyRow,
  type StoredLifecycleRow,
} from "../instrumentation/daily-metrics";

/**
 * Compose real sponsored-use onto a live access snapshot.
 *
 * Access and usage answer different questions and fail independently. Access is
 * exact whenever the ledger is readable; usage is only as good as its coverage.
 * Overlaying them keeps a venue's access totals trustworthy on a day when the
 * rollup has a hole, instead of dragging the whole surface to `unavailable`.
 */

export const LIVE_USAGE_DEFINITION = "account-metrics.v2";

export type LiveUsageInput = {
  window: MetricWindow;
  rows: readonly StoredDailyRow[];
  lifecycle: readonly StoredLifecycleRow[];
  /** The instant the projection is authoritative through. */
  dataThrough: string;
};

const COVERAGE_COPY: Record<
  ReturnType<typeof summariseCoverage>["state"],
  { label: string; detail: string }
> = {
  complete: {
    label: "Reporting complete",
    detail: "Every day and every product in this period reported.",
  },
  partial: {
    label: "Reporting partial",
    detail:
      "Some days or products did not report. Counted values are lower bounds, never totals.",
  },
  suppressed: {
    label: "Small-group privacy protection",
    detail: "Too few sponsored workspaces to describe behaviour without exposing it.",
  },
  unavailable: {
    label: "Reporting unavailable",
    detail:
      "No reliable sponsored-use coverage for this window. Access totals remain exact.",
  },
};

/**
 * Overlay usage onto an access snapshot.
 *
 * The access half is never recomputed here, so a usage fault cannot make an
 * exact allotment look uncertain.
 */
export function projectVenueUsageSnapshot(
  accessSnapshot: AccountSnapshot,
  usage: LiveUsageInput,
): AccountSnapshot {
  const inputs = {
    window: usage.window,
    rows: usage.rows,
    lifecycle: usage.lifecycle,
  };
  const coverage = summariseCoverage(inputs);
  const copy = COVERAGE_COPY[coverage.state];

  return {
    ...accessSnapshot,
    definitionVersion: LIVE_USAGE_DEFINITION,
    sampleLabel: "LIVE ACCESS AND USAGE.",
    coverage: {
      state: coverage.state,
      label: copy.label,
      detail: copy.detail,
      dataThrough: usage.dataThrough,
      periodStart: usage.window.start,
      periodEnd: usage.window.end,
      periodLabel: accessSnapshot.coverage.periodLabel,
      definitionVersion: LIVE_USAGE_DEFINITION,
      modulesExpected: coverage.modulesExpected,
      daysExpected: coverage.daysExpected,
      // Rows exist only on observed days. These counts are behavioural too:
      // never copy them (including a stale access-overlay value) into a
      // suppressed action response, export, or rendered snapshot.
      ...(coverage.state === "suppressed" ? {} : {
        modulesCovered: coverage.modulesCovered,
        daysCovered: coverage.daysCovered,
      }),
    },
    adoption: {
      // Access-derived figures stay exactly as the ledger reported them.
      allotted: accessSnapshot.adoption.allotted,
      issued: accessSnapshot.adoption.issued,
      redeemed: accessSnapshot.adoption.redeemed,
      firstUsefulAction: firstUsefulAction(inputs),
      activeRecently: activeRecently(inputs),
      continuedAfter30Days: continuedAfter30Days(inputs),
      daysWithSponsoredUse: daysWithSponsoredUse(inputs),
    },
    productReach: productReach(inputs),
  };
}
