import assert from "node:assert/strict";
import { test } from "node:test";

import type { SponsoredProduct } from "./event-schema";
import { localDatesBetween } from "./local-date";
import {
  ALL_PRODUCTS,
  mergeLifecycle,
  rollupDaily,
  type RollupEvent,
  type RollupInput,
} from "./rollup";

const SPONSOR = "sp_1";
const EPOCH = "abcd1234";
const DAY = 86_400_000;
const D1 = Date.UTC(2026, 5, 1, 10);

function event(overrides: Partial<RollupEvent> = {}): RollupEvent {
  const occurredAt = overrides.occurredAt ?? D1;
  return {
    eventId: `evt_${Math.abs(occurredAt)}_${overrides.workspaceIdHash ?? "w1"}_${overrides.product ?? "tasks"}`,
    sponsorId: SPONSOR,
    product: "tasks",
    kind: "task_completed",
    occurredAt,
    subjectIdHash: "s1",
    workspaceIdHash: "w1",
    hashSaltEpoch: EPOCH,
    localDate: new Date(occurredAt).toISOString().slice(0, 10),
    ...overrides,
  };
}

function input(events: RollupEvent[], overrides: Partial<RollupInput> = {}): RollupInput {
  const dates = localDatesBetween(D1, D1 + 2 * DAY);
  return {
    sponsorId: SPONSOR,
    hashSaltEpoch: EPOCH,
    dates,
    events,
    coveredProducts: ALL_PRODUCTS,
    eligibleByDate: Object.fromEntries(dates.map((d) => [d, 10])),
    ...overrides,
  };
}

test("one workspace acting ten times counts once as active", () => {
  const events = Array.from({ length: 10 }, (_, i) =>
    event({ eventId: `evt_${i}`, occurredAt: D1 + i * 60_000 }),
  );
  const { daily } = rollupDaily(input(events));
  const day = daily.find((d) => d.localDate === "2026-06-01");
  assert.equal(day?.activeWorkspaces, 1);
  assert.equal(day?.meaningfulActions, 10);
});

test("a replayed event id is dropped rather than summed", () => {
  const one = event({ eventId: "evt_same" });
  const { daily, rejected } = rollupDaily(input([one, { ...one }, { ...one }]));
  assert.equal(daily[0].meaningfulActions, 1);
  assert.equal(rejected.filter((r) => r.reason === "duplicate-event-id").length, 2);
});

test("a quiet day inside the window still gets a row", () => {
  const { daily } = rollupDaily(input([event()]));
  assert.equal(daily.length, 3);
  const quiet = daily.find((d) => d.localDate === "2026-06-02");
  assert.equal(quiet?.activeWorkspaces, 0);
  assert.equal(quiet?.meaningfulActions, 0);
});

test("an uninstrumented product is null, never zero", () => {
  const { daily } = rollupDaily(
    input([event()], { coveredProducts: ["tasks"], expectedProducts: ALL_PRODUCTS }),
  );
  const day = daily[0];
  assert.notEqual(day.perProduct.tasks, null);
  assert.equal(day.perProduct.notes, null, "notes was not instrumented, so it is unknown");
  assert.equal(day.perProduct.timeline, null);
  assert.equal(day.perProduct.signal, null);
});

test("an instrumented product with no activity is a measured zero", () => {
  const { daily } = rollupDaily(input([event({ product: "tasks" })]));
  assert.deepEqual(daily[0].perProduct.notes, { actions: 0, workspaces: 0 });
});

test("the coverage mask records what was instrumented against what was expected", () => {
  const { daily } = rollupDaily(
    input([event()], { coveredProducts: ["notes", "tasks"], expectedProducts: ALL_PRODUCTS }),
  );
  assert.equal(daily[0].coverageMask, 1 | 2);
  assert.equal(daily[0].expectedMask, 1 | 2 | 4 | 8);
});

test("events from another sponsor never join this venue", () => {
  const { daily, rejected } = rollupDaily(
    input([event(), event({ eventId: "other", sponsorId: "sp_2" })]),
  );
  assert.equal(daily[0].activeWorkspaces, 1);
  assert.ok(rejected.some((r) => r.reason === "sponsor-mismatch"));
});

test("hashes from a different salt epoch are refused", () => {
  const { daily, rejected } = rollupDaily(
    input([event(), event({ eventId: "rotated", hashSaltEpoch: "ffff0000" })]),
  );
  assert.equal(daily[0].activeWorkspaces, 1);
  assert.ok(rejected.some((r) => r.reason === "salt-epoch-mismatch"));
});

test("an event outside the window is rejected rather than folded in", () => {
  const { rejected } = rollupDaily(
    input([event({ eventId: "old", occurredAt: D1 - 30 * DAY })]),
  );
  assert.ok(rejected.some((r) => r.reason === "outside-window"));
});

test("first action counts only the first time a workspace appears", () => {
  const { daily } = rollupDaily(
    input([
      event({ eventId: "a", workspaceIdHash: "w1", occurredAt: D1 }),
      event({ eventId: "b", workspaceIdHash: "w1", occurredAt: D1 + DAY }),
      event({ eventId: "c", workspaceIdHash: "w2", occurredAt: D1 + DAY }),
    ]),
  );
  assert.equal(daily[0].firstActionWorkspaces, 1);
  assert.equal(daily[1].firstActionWorkspaces, 1);
});

test("a workspace already known from an earlier window is not a first action", () => {
  const { daily } = rollupDaily(
    input([event({ workspaceIdHash: "w1" })], {
      knownWorkspaces: new Set(["w1"]),
    }),
  );
  assert.equal(daily[0].firstActionWorkspaces, 0);
  assert.equal(daily[0].activeWorkspaces, 1);
});

/**
 * D-032 R10. An unpublish is a couple withdrawing a share. E09.02 §2 accepted
 * any qualifying Tier 1 event of any kind, which made taking a Timeline down
 * the moment the venue's gift landed. These four tests fail if that ever
 * becomes true again.
 */
function unpublish(overrides: Partial<RollupEvent> = {}): RollupEvent {
  return event({
    eventId: "unpub",
    product: "timeline",
    kind: "timeline_unpublished",
    ...overrides,
  });
}

test("an unpublish is never a first useful action", () => {
  const { daily, lifecycle } = rollupDaily(input([unpublish()]));
  assert.equal(
    daily[0].firstActionWorkspaces,
    0,
    "taking a Timeline down is not the couple starting",
  );
  assert.equal(
    daily[0].activeWorkspaces,
    1,
    "it is still a meaningful action, and the day still measured it",
  );
  assert.equal(lifecycle[0].firstActionLocalDate, null);
  assert.equal(lifecycle[0].lastActionLocalDate, "2026-06-01");
});

test("an unpublish first does not stop a later action being the first one", () => {
  const { daily, lifecycle } = rollupDaily(
    input([unpublish({ occurredAt: D1 }), event({ eventId: "real", occurredAt: D1 + DAY })]),
  );
  assert.equal(daily[0].firstActionWorkspaces, 0);
  assert.equal(daily[1].firstActionWorkspaces, 1);
  assert.equal(lifecycle[0].firstActionLocalDate, "2026-06-02");
});

test("a workspace that only unpublished has no lifecycle row to store", () => {
  const { lifecycle } = rollupDaily(input([unpublish()]));
  assert.equal(
    mergeLifecycle(undefined, lifecycle[0]),
    null,
    "no start happened, so nothing may be written into the column the day-30 band is measured from",
  );
});

test("an unpublish never moves a stored first-action date", () => {
  const stored = {
    workspaceIdHash: "w1",
    hashSaltEpoch: EPOCH,
    firstActionLocalDate: "2026-05-10",
    lastActionLocalDate: "2026-05-10",
    productLastActionLocalDate: {} as Partial<Record<SponsoredProduct, string>>,
  };
  const { lifecycle } = rollupDaily(
    input([unpublish()], { knownWorkspaces: new Set(["w1"]) }),
  );
  const merged = mergeLifecycle(stored, lifecycle[0]);
  assert.ok(merged, "a workspace with a stored start keeps its row");
  assert.equal(merged.firstActionLocalDate, "2026-05-10");
  assert.equal(merged.lastActionLocalDate, "2026-06-01", "it is still recent use");
});

test("lifecycle records the earliest and latest day a workspace acted", () => {
  const { lifecycle } = rollupDaily(
    input([
      event({ eventId: "a", occurredAt: D1 }),
      event({ eventId: "b", occurredAt: D1 + 2 * DAY }),
    ]),
  );
  assert.equal(lifecycle.length, 1);
  assert.equal(lifecycle[0].firstActionLocalDate, "2026-06-01");
  assert.equal(lifecycle[0].lastActionLocalDate, "2026-06-03");
});

test("lifecycle tracks the last day per product", () => {
  const { lifecycle } = rollupDaily(
    input([
      event({ eventId: "a", product: "notes", kind: "note_created", occurredAt: D1 }),
      event({ eventId: "b", product: "tasks", occurredAt: D1 + 2 * DAY }),
    ]),
  );
  assert.equal(lifecycle[0].productLastActionLocalDate.notes, "2026-06-01");
  assert.equal(lifecycle[0].productLastActionLocalDate.tasks, "2026-06-03");
});

test("merging lifecycle only ever widens the span", () => {
  const stored = {
    workspaceIdHash: "w1",
    hashSaltEpoch: EPOCH,
    firstActionLocalDate: "2026-05-10",
    lastActionLocalDate: "2026-05-20",
    productLastActionLocalDate: { tasks: "2026-05-20" } as Partial<
      Record<SponsoredProduct, string>
    >,
  };
  const merged = mergeLifecycle(stored, {
    workspaceIdHash: "w1",
    hashSaltEpoch: EPOCH,
    firstActionLocalDate: "2026-06-01",
    lastActionLocalDate: "2026-06-03",
    productLastActionLocalDate: { notes: "2026-06-02" },
  });
  assert.ok(merged, "a stored row plus a delta always merges to a row");
  assert.equal(merged.firstActionLocalDate, "2026-05-10", "the earliest first action wins");
  assert.equal(merged.lastActionLocalDate, "2026-06-03", "the latest last action wins");
  assert.equal(merged.productLastActionLocalDate.tasks, "2026-05-20");
  assert.equal(merged.productLastActionLocalDate.notes, "2026-06-02");
});

test("merging a delta into nothing yields the delta", () => {
  const delta = {
    workspaceIdHash: "w1",
    hashSaltEpoch: EPOCH,
    firstActionLocalDate: "2026-06-01",
    lastActionLocalDate: "2026-06-01",
    productLastActionLocalDate: { tasks: "2026-06-01" },
  };
  assert.deepEqual(mergeLifecycle(undefined, delta), delta);
});

test("no raw content or identity can reach a daily row", () => {
  const { daily, lifecycle } = rollupDaily(input([event()]));
  const dump = JSON.stringify({ daily, lifecycle });
  for (const forbidden of ["task_completed", "title", "email", "@"]) {
    if (forbidden === "task_completed") {
      // The kind is an allowlisted verb, not content, but it must not be stored
      // on the aggregate row either.
      assert.ok(!JSON.stringify(daily).includes(forbidden));
      continue;
    }
    assert.ok(!dump.includes(forbidden), `${forbidden} must not appear`);
  }
});
