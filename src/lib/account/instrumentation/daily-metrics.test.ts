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
  // Four active out of an eligible ten: clear of both edges, so it publishes.
  const value = activeRecently(
    inputs({
      lifecycle: [
        life({ workspaceIdHash: "w1", lastActionLocalDate: "2026-06-04" }),
        life({ workspaceIdHash: "w2", lastActionLocalDate: "2026-06-05" }),
        life({ workspaceIdHash: "w3", lastActionLocalDate: "2026-06-03" }),
        life({ workspaceIdHash: "w4", lastActionLocalDate: "2026-06-02" }),
        life({ workspaceIdHash: "w5", lastActionLocalDate: "2026-05-20" }),
      ],
    }),
  );
  assert.equal(value.state, "exact");
  if (value.state === "exact") assert.equal(value.value, 4);
});

test("R-027: two active workspaces in a cohort of ten are withheld", () => {
  // This is the shipped defect. It returned { state: "exact", value: 2 }.
  const value = activeRecently(
    inputs({
      lifecycle: [
        life({ workspaceIdHash: "w1", lastActionLocalDate: "2026-06-04" }),
        life({ workspaceIdHash: "w2", lastActionLocalDate: "2026-06-05" }),
      ],
    }),
  );
  assert.equal(value.state, "withheld");
});

test("R-027: nine active workspaces in a cohort of ten are withheld too", () => {
  const value = activeRecently(
    inputs({
      lifecycle: Array.from({ length: 9 }, (_, i) =>
        life({ workspaceIdHash: "w" + i, lastActionLocalDate: "2026-06-04" }),
      ),
    }),
  );
  assert.equal(value.state, "withheld", "the one who did not act is identifiable");
});

test("R-027: a closed historical lower bound runs the same two-sided test", () => {
  // This path never touched a threshold at all before the fix.
  const small = activeRecently(
    inputs({
      window: { ...WINDOW, trailing: false },
      rows: fullWindowRows({ activeWorkspaces: 2 }),
    }),
  );
  assert.equal(small.state, "withheld");
  const high = activeRecently(
    inputs({
      window: { ...WINDOW, trailing: false },
      rows: fullWindowRows({ activeWorkspaces: 9 }),
    }),
  );
  assert.equal(high.state, "withheld", "at least 9 of 10 names the tenth");
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
        life({ workspaceIdHash: "w2", firstActionLocalDate: "2026-06-03" }),
        life({ workspaceIdHash: "w3", firstActionLocalDate: "2026-06-04" }),
        life({ workspaceIdHash: "w4", firstActionLocalDate: "2026-05-30" }),
      ],
    }),
  );
  assert.equal(value.state, "exact");
  if (value.state === "exact") assert.equal(value.value, 3);
});

test("R-027: a single first useful action in a cohort of ten is withheld", () => {
  const value = firstUsefulAction(
    inputs({
      lifecycle: [
        life({ workspaceIdHash: "w1", firstActionLocalDate: "2026-06-02" }),
        life({ workspaceIdHash: "w2", firstActionLocalDate: "2026-05-30" }),
      ],
    }),
  );
  assert.equal(value.state, "withheld");
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
  assert.equal(value.state, "rate", "continuation is a rate, not a count");
  if (value.state === "rate") {
    assert.equal(value.numerator, 3);
    assert.equal(value.denominator, 5);
  }
});

test("R-028: continuation is a rate type, so it cannot be read as a count", () => {
  const lifecycle = Array.from({ length: 6 }, (_, i) =>
    life({
      workspaceIdHash: "r" + i,
      day30State: i < 4 ? "returned" : "not_returned",
      day30SealedAt: 1,
    }),
  );
  const value = continuedAfter30Days(inputs({ lifecycle }));
  assert.equal(value.state, "rate");
  // There is no `value` field to pick up and divide by something else.
  assert.deepEqual(Object.keys(value).sort(), [
    "denominator",
    "numerator",
    "state",
  ]);
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
  assert.equal(value.state, "rate");
  if (value.state === "rate") assert.equal(value.denominator, 5);
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
        life({ workspaceIdHash: "w3", productLastActionLocalDate: { tasks: "2026-06-02" } }),
        life({ workspaceIdHash: "w4", productLastActionLocalDate: { tasks: "2026-06-01" } }),
        life({ workspaceIdHash: "w5", productLastActionLocalDate: { notes: "2026-06-03" } }),
      ],
    }),
  );
  const tasks = reach.find((r) => r.product === "Tasks");
  assert.equal(tasks?.workspacesReached.state, "exact");
  if (tasks?.workspacesReached.state === "exact") assert.equal(tasks.workspacesReached.value, 4);
});

test("R-027: a product reached by two workspaces out of ten is withheld", () => {
  const reach = productReach(
    inputs({
      lifecycle: [
        life({ workspaceIdHash: "w1", productLastActionLocalDate: { tasks: "2026-06-04" } }),
        life({ workspaceIdHash: "w2", productLastActionLocalDate: { tasks: "2026-06-02" } }),
      ],
    }),
  );
  for (const entry of reach) {
    assert.equal(
      entry.workspacesReached.state,
      "withheld",
      entry.product + " reached too few workspaces to describe",
    );
  }
});

test("R-027: a historical product lower bound runs the two-sided test", () => {
  const rows = fullWindowRows({
    perProduct: {
      notes: { actions: 3, workspaces: 2 },
      tasks: { actions: 6, workspaces: 4 },
      timeline: { actions: 2, workspaces: 9 },
      signal: { actions: 1, workspaces: 1 },
    },
  });
  const reach = productReach(
    inputs({ rows, window: { ...WINDOW, trailing: false } }),
  );
  const byProduct = Object.fromEntries(
    reach.map((r) => [r.product, r.workspacesReached.state]),
  );
  assert.equal(byProduct.Notes, "withheld", "2 of 10");
  assert.equal(byProduct.Signal, "withheld", "1 of 10");
  assert.equal(byProduct.Timeline, "withheld", "9 of 10 names the tenth");
  assert.equal(byProduct.Tasks, "lower_bound", "4 of 10 is clear of both edges");
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
    assert.notEqual(value.state, "rate", "absent data must never present as a rate");
    assert.equal(value.state, "unavailable");
  }
});
