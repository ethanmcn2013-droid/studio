import assert from "node:assert/strict";
import { test } from "node:test";

import { assertSnapshotPrivacy } from "../privacy";
import { ALL_PRODUCTS, maskFor } from "../instrumentation/rollup";
import type {
  StoredDailyRow,
  StoredLifecycleRow,
} from "../instrumentation/daily-metrics";
import { projectVenueAccessSnapshot } from "./project-venue-access";
import { projectVenueUsageSnapshot } from "./project-venue-usage";

const FULL = maskFor(ALL_PRODUCTS);
const WINDOW = { start: "2026-06-01", end: "2026-06-05", trailing: true };

const accessSnapshot = projectVenueAccessSnapshot({
  nowMs: Date.parse("2026-06-05T18:00:00.000Z"),
  sponsor: {
    id: "sp_1",
    slug: "glenmara-house",
    name: "Glenmara House",
    venuePlan: "paid",
    paid: true,
    termStartsAt: Date.parse("2026-01-01T00:00:00.000Z"),
    termEndsAt: Date.parse("2026-12-31T00:00:00.000Z"),
    codeAllotment: 40,
    codesIssued: 12,
  },
  codes: [
    {
      id: "c1",
      code: "GH-ALPHA-21",
      status: "redeemed",
      createdAt: Date.parse("2026-05-01T00:00:00.000Z"),
      redeemedAt: Date.parse("2026-05-02T00:00:00.000Z"),
    },
  ],
});

function row(overrides: Partial<StoredDailyRow> = {}): StoredDailyRow {
  return {
    localDate: "2026-06-01",
    activeWorkspaces: 6,
    activeSubjects: 6,
    firstActionWorkspaces: 1,
    eligibleWorkspaces: 12,
    meaningfulActions: 20,
    coverageMask: FULL,
    expectedMask: FULL,
    perProduct: {
      notes: { actions: 4, workspaces: 3 },
      tasks: { actions: 10, workspaces: 6 },
      timeline: { actions: 4, workspaces: 3 },
      signal: { actions: 2, workspaces: 2 },
    },
    ...overrides,
  };
}

const fullRows = ["2026-06-01", "2026-06-02", "2026-06-03", "2026-06-04", "2026-06-05"].map(
  (localDate) => row({ localDate }),
);

const lifecycle: StoredLifecycleRow[] = Array.from({ length: 6 }, (_, i) => ({
  workspaceIdHash: `w${i}`,
  firstActionLocalDate: "2026-06-01",
  lastActionLocalDate: "2026-06-04",
  productLastActionLocalDate: { tasks: "2026-06-04", notes: "2026-06-02" },
  day30State: null,
  day30SealedAt: null,
}));

test("usage overlays access without disturbing the ledger figures", () => {
  const snapshot = projectVenueUsageSnapshot(accessSnapshot, {
    window: WINDOW,
    rows: fullRows,
    lifecycle,
    dataThrough: "2026-06-05",
  });
  assert.deepEqual(snapshot.access, accessSnapshot.access);
  assert.deepEqual(snapshot.adoption.allotted, accessSnapshot.adoption.allotted);
  assert.deepEqual(snapshot.adoption.redeemed, accessSnapshot.adoption.redeemed);
});

test("complete coverage reports real behaviour", () => {
  const snapshot = projectVenueUsageSnapshot(accessSnapshot, {
    window: WINDOW,
    rows: fullRows,
    lifecycle,
    dataThrough: "2026-06-05",
  });
  assert.equal(snapshot.coverage.state, "complete");
  assert.equal(snapshot.adoption.daysWithSponsoredUse.state, "exact");
  assert.equal(snapshot.adoption.activeRecently.state, "exact");
  assert.equal(snapshot.sampleLabel, "LIVE ACCESS AND USAGE.");
});

test("a hole in the rollup leaves access exact and usage a lower bound", () => {
  const snapshot = projectVenueUsageSnapshot(accessSnapshot, {
    window: WINDOW,
    rows: fullRows.slice(0, 3),
    lifecycle,
    dataThrough: "2026-06-05",
  });
  assert.equal(snapshot.coverage.state, "partial");
  assert.equal(snapshot.adoption.daysWithSponsoredUse.state, "lower_bound");
  assert.equal(snapshot.access.allotted.state, "exact", "access must not be dragged down");
});

test("no rollup at all keeps every behavioural metric unavailable, never zero", () => {
  const snapshot = projectVenueUsageSnapshot(accessSnapshot, {
    window: WINDOW,
    rows: [],
    lifecycle: [],
    dataThrough: "2026-06-05",
  });
  assert.equal(snapshot.coverage.state, "unavailable");
  for (const metric of [
    snapshot.adoption.firstUsefulAction,
    snapshot.adoption.activeRecently,
    snapshot.adoption.continuedAfter30Days,
    snapshot.adoption.daysWithSponsoredUse,
  ]) {
    assert.equal(metric.state, "unavailable");
  }
  for (const reach of snapshot.productReach) {
    assert.equal(reach.workspacesReached.state, "unavailable");
  }
});

test("a small venue is suppressed rather than described", () => {
  const snapshot = projectVenueUsageSnapshot(accessSnapshot, {
    window: WINDOW,
    rows: fullRows.map((r) => ({ ...r, eligibleWorkspaces: 2 })),
    lifecycle,
    dataThrough: "2026-06-05",
  });
  assert.equal(snapshot.coverage.state, "suppressed");
  assert.equal(snapshot.adoption.activeRecently.state, "withheld");
  for (const reach of snapshot.productReach) {
    assert.equal(reach.workspacesReached.state, "withheld");
  }
});

test("an uninstrumented product stays unavailable while the others report", () => {
  const rows = fullRows.map((r) => ({
    ...r,
    coverageMask: maskFor(["notes", "tasks"]),
    expectedMask: FULL,
  }));
  const snapshot = projectVenueUsageSnapshot(accessSnapshot, {
    window: WINDOW,
    rows,
    lifecycle,
    dataThrough: "2026-06-05",
  });
  const byProduct = Object.fromEntries(
    snapshot.productReach.map((r) => [r.product, r.workspacesReached.state]),
  );
  assert.equal(byProduct.Timeline, "unavailable");
  assert.equal(byProduct.Signal, "unavailable");
  assert.notEqual(byProduct.Tasks, "unavailable");
});

test("the composed snapshot leaks no identity", () => {
  const snapshot = projectVenueUsageSnapshot(accessSnapshot, {
    window: WINDOW,
    rows: fullRows,
    lifecycle,
    dataThrough: "2026-06-05",
  });
  assertSnapshotPrivacy(snapshot);
  const dump = JSON.stringify(snapshot);
  for (const hash of lifecycle.map((l) => l.workspaceIdHash)) {
    assert.ok(!dump.includes(hash), "a workspace hash must never reach the snapshot");
  }
});

test("no absent metric is ever rendered as an exact zero", () => {
  const snapshot = projectVenueUsageSnapshot(accessSnapshot, {
    window: WINDOW,
    rows: [],
    lifecycle: [],
    dataThrough: "2026-06-05",
  });
  const dump = JSON.stringify(snapshot.adoption) + JSON.stringify(snapshot.productReach);
  assert.ok(!dump.includes('"state":"exact","value":0'));
});
