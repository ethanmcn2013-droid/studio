import assert from "node:assert/strict";
import { test } from "node:test";

import {
  activeRecently,
  continuedAfter30Days,
  daysWithSponsoredUse,
  eligibleForWindow,
  firstUsefulAction,
  productReach,
  summariseCoverage,
  type MetricWindow,
  type StoredDailyRow,
  type StoredLifecycleRow,
  type WindowInputs,
} from "./daily-metrics";
import { ALL_PRODUCTS, maskFor } from "./rollup";

const WINDOW: MetricWindow = { start: "2026-06-01", end: "2026-06-05", trailing: true };
const FULL = maskFor(ALL_PRODUCTS);

function row(overrides: Partial<StoredDailyRow> = {}): StoredDailyRow {
  return {
    localDate: "2026-06-01",
    activeWorkspaces: 4,
    activeSubjects: 4,
    firstActionWorkspaces: 0,
    eligibleWorkspaces: 10,
    meaningfulActions: 12,
    coverageMask: FULL,
    expectedMask: FULL,
    perProduct: {
      notes: { actions: 3, workspaces: 2 },
      tasks: { actions: 6, workspaces: 4 },
      timeline: { actions: 2, workspaces: 2 },
      signal: { actions: 1, workspaces: 1 },
    },
    ...overrides,
  };
}

function fullWindowRows(overrides: Partial<StoredDailyRow> = {}): StoredDailyRow[] {
  return ["2026-06-01", "2026-06-02", "2026-06-03", "2026-06-04", "2026-06-05"].map(
    (localDate) => row({ localDate, ...overrides }),
  );
}

function life(overrides: Partial<StoredLifecycleRow> = {}): StoredLifecycleRow {
  return {
    workspaceIdHash: "w1",
    firstActionLocalDate: "2026-06-01",
    lastActionLocalDate: "2026-06-04",
    productLastActionLocalDate: { tasks: "2026-06-04" },
    day30State: null,
    day30SealedAt: null,
    ...overrides,
  };
}

function inputs(over: Partial<WindowInputs> = {}): WindowInputs {
  return { window: WINDOW, rows: fullWindowRows(), lifecycle: [life()], ...over };
}

test("full coverage yields an exact value with its denominator", () => {
  const value = daysWithSponsoredUse(inputs());
  assert.equal(value.state, "exact");
  if (value.state === "exact") {
    assert.equal(value.value, 5);
    assert.equal(value.denominator, 5);
  }
});

test("partial coverage can only understate, so it becomes a lower bound", () => {
  const value = daysWithSponsoredUse(inputs({ rows: fullWindowRows().slice(0, 3) }));
  assert.equal(value.state, "lower_bound");
  if (value.state === "lower_bound") {
    assert.equal(value.value, 3);
    assert.equal(value.denominator, 5);
  }
});

test("no rows at all is unavailable, never zero", () => {
  const value = daysWithSponsoredUse(inputs({ rows: [] }));
  assert.equal(value.state, "unavailable");
});

test("a measured quiet day counts as covered but not as used", () => {
  const rows = fullWindowRows();
  rows[2] = row({ localDate: "2026-06-03", activeWorkspaces: 0, meaningfulActions: 0 });
  const value = daysWithSponsoredUse(inputs({ rows }));
  assert.equal(value.state, "exact", "the day was measured, so coverage is complete");
  if (value.state === "exact") assert.equal(value.value, 4, "but it was not a day of use");
});

test("a small group is withheld regardless of coverage", () => {
  const value = daysWithSponsoredUse(
    inputs({ rows: fullWindowRows({ eligibleWorkspaces: 2 }) }),
  );
  assert.equal(value.state, "withheld");
  if (value.state === "withheld") assert.equal(value.reason, "small_group");
});

test("the eligible count takes the largest day, not the average", () => {
  const rows = [
    row({ localDate: "2026-06-01", eligibleWorkspaces: 2 }),
    row({ localDate: "2026-06-02", eligibleWorkspaces: 9 }),
  ];
  assert.equal(eligibleForWindow(rows), 9);
});

test("a trailing window counts active workspaces exactly from lifecycle", () => {
  const value = activeRecently(
    inputs({
      lifecycle: [
        life({ workspaceIdHash: "w1", lastActionLocalDate: "2026-06-04" }),
        life({ workspaceIdHash: "w2", lastActionLocalDate: "2026-06-05" }),
        life({ workspaceIdHash: "w3", lastActionLocalDate: "2026-05-20" }),
      ],
    }),
  );
  assert.equal(value.state, "exact");
  if (value.state === "exact") assert.equal(value.value, 2);
});

test("a closed historical period can only give a lower bound", () => {
  const value = activeRecently(
    inputs({ window: { ...WINDOW, trailing: false } }),
  );
  assert.equal(value.state, "lower_bound");
});

test("first useful action counts workspaces whose first day falls inside the window", () => {
  const value = firstUsefulAction(
    inputs({
      lifecycle: [
        life({ workspaceIdHash: "w1", firstActionLocalDate: "2026-06-02" }),
        life({ workspaceIdHash: "w2", firstActionLocalDate: "2026-05-30" }),
      ],
    }),
  );
  assert.equal(value.state, "exact");
  if (value.state === "exact") assert.equal(value.value, 1);
});

test("an open day-30 cohort is unavailable, not a rate", () => {
  const value = continuedAfter30Days(inputs());
  assert.equal(value.state, "unavailable");
  if (value.state === "unavailable") assert.match(value.reason, /day-30/);
});

test("a sealed cohort under five is withheld", () => {
  const lifecycle = Array.from({ length: 4 }, (_, i) =>
    life({ workspaceIdHash: `w${i}`, day30State: "returned", day30SealedAt: 1 }),
  );
  const value = continuedAfter30Days(inputs({ lifecycle }));
  assert.equal(value.state, "withheld");
});

test("a sealed cohort of five reports returned over eligible", () => {
  const lifecycle = [
    ...Array.from({ length: 3 }, (_, i) =>
      life({ workspaceIdHash: `r${i}`, day30State: "returned", day30SealedAt: 1 }),
    ),
    ...Array.from({ length: 2 }, (_, i) =>
      life({ workspaceIdHash: `n${i}`, day30State: "not_returned", day30SealedAt: 1 }),
    ),
  ];
  const value = continuedAfter30Days(inputs({ lifecycle }));
  assert.equal(value.state, "exact");
  if (value.state === "exact") {
    assert.equal(value.value, 3);
    assert.equal(value.denominator, 5);
  }
});

test("an unsealed or indeterminate row is excluded from both sides", () => {
  const lifecycle = [
    ...Array.from({ length: 5 }, (_, i) =>
      life({ workspaceIdHash: `r${i}`, day30State: "returned", day30SealedAt: 1 }),
    ),
    life({ workspaceIdHash: "open", day30State: null, day30SealedAt: null }),
    life({ workspaceIdHash: "lost", day30State: "indeterminate", day30SealedAt: 1 }),
  ];
  const value = continuedAfter30Days(inputs({ lifecycle }));
  assert.equal(value.state, "exact");
  if (value.state === "exact") assert.equal(value.denominator, 5);
});

test("an uninstrumented product is unavailable, never zero reach", () => {
  const rows = fullWindowRows({
    coverageMask: maskFor(["notes", "tasks"]),
    expectedMask: FULL,
  });
  const reach = productReach(inputs({ rows }));
  const timeline = reach.find((r) => r.product === "Timeline");
  assert.equal(timeline?.workspacesReached.state, "unavailable");
  if (timeline?.workspacesReached.state === "unavailable") {
    assert.match(timeline.workspacesReached.reason, /not instrumented/);
  }
});

test("a covered product reports reach from lifecycle on a trailing window", () => {
  const reach = productReach(
    inputs({
      lifecycle: [
        life({ workspaceIdHash: "w1", productLastActionLocalDate: { tasks: "2026-06-04" } }),
        life({ workspaceIdHash: "w2", productLastActionLocalDate: { tasks: "2026-06-02" } }),
        life({ workspaceIdHash: "w3", productLastActionLocalDate: { notes: "2026-06-03" } }),
      ],
    }),
  );
  const tasks = reach.find((r) => r.product === "Tasks");
  assert.equal(tasks?.workspacesReached.state, "exact");
  if (tasks?.workspacesReached.state === "exact") assert.equal(tasks.workspacesReached.value, 2);
});

test("every product reach is suppressed for a small group", () => {
  const reach = productReach(inputs({ rows: fullWindowRows({ eligibleWorkspaces: 2 }) }));
  for (const entry of reach) {
    assert.equal(entry.workspacesReached.state, "withheld", `${entry.product} must be withheld`);
  }
});

test("coverage is complete only with every day and every expected module", () => {
  assert.equal(summariseCoverage(inputs()).state, "complete");
  assert.equal(
    summariseCoverage(inputs({ rows: fullWindowRows().slice(0, 4) })).state,
    "partial",
  );
  const missingModule = inputs({
    rows: fullWindowRows({ coverageMask: maskFor(["tasks"]), expectedMask: FULL }),
  });
  assert.equal(summariseCoverage(missingModule).state, "partial");
  assert.equal(summariseCoverage(inputs({ rows: [] })).state, "unavailable");
  assert.equal(
    summariseCoverage(inputs({ rows: fullWindowRows({ eligibleWorkspaces: 1 }) })).state,
    "suppressed",
  );
});

test("no metric in any state ever renders as an exact zero for absent data", () => {
  const empty = inputs({ rows: [], lifecycle: [] });
  for (const value of [
    daysWithSponsoredUse(empty),
    firstUsefulAction(empty),
    activeRecently(empty),
    continuedAfter30Days(empty),
    ...productReach(empty).map((r) => r.workspacesReached),
  ]) {
    assert.notEqual(value.state, "exact", "absent data must never present as exact");
    assert.equal(value.state, "unavailable");
  }
});
