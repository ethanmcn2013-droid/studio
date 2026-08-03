import assert from "node:assert/strict";
import test from "node:test";

import { runNightlyMaintenance, sealingAlert, type NightlyStore } from "./nightly";
import { MAX_SEALING_GAP_DAYS } from "./sealing";
import type { RollupEvent } from "./rollup";

/**
 * The ordering these tests exist to protect.
 *
 * `sweepExpiredEvents` deletes raw events past 35 days and there is no second
 * copy. Running it before the rollup deletes the evidence for a day nobody
 * counted, and the loss is silent: the daily projection simply never gets a row
 * for that day, and months later a venue's report has a hole in it that nothing
 * can fill. The handler that ran the sweep on its own carried a comment saying
 * it was safe "because no closed-day rollup still needs" those events, which
 * was true only while the table was empty.
 *
 * So the ordering is asserted here rather than described anywhere. Every test
 * below reads the call log the fake store records, not the return value, so a
 * refactor that returns the right summary while calling the steps in the wrong
 * order still fails.
 */

const DAY = 86_400_000;
const NOW = Date.UTC(2026, 7, 3, 9, 0, 0);
const TODAY = "2026-08-03";

function event(overrides: Partial<RollupEvent> = {}): RollupEvent {
  return {
    eventId: "e1",
    sponsorId: "sp_1",
    product: "tasks",
    kind: "task_created",
    occurredAt: NOW - 2 * DAY,
    subjectIdHash: "a".repeat(32),
    workspaceIdHash: "b".repeat(32),
    hashSaltEpoch: "epoch001",
    localDate: "2026-08-01",
    ...overrides,
  };
}

type FakeOptions = {
  calls: string[];
  failOn?: "repair" | "rollup" | "seal" | "sweep";
  lastSealedAtMs?: number | null;
  sealCandidates?: NightlyStore extends { sealCandidates: (n: number) => Promise<infer R> }
    ? R
    : never;
  withPending?: boolean;
};

function fakeStore(options: FakeOptions): NightlyStore {
  const { calls } = options;
  const boom = (step: string) => {
    throw new Error(`${step} exploded`);
  };
  return {
    repairUnattributed: async () => {
      calls.push("repair");
      if (options.failOn === "repair") boom("repair");
      return 2;
    },
    pendingRollups: async () => {
      calls.push("rollup:read");
      if (options.failOn === "rollup") boom("rollup");
      if (options.withPending === false) return [];
      return [
        {
          sponsorId: "sp_1",
          hashSaltEpoch: "epoch001",
          dates: ["2026-08-01"],
          coveredProducts: ["notes", "tasks", "timeline", "signal"] as const,
          expectedProducts: ["notes", "tasks", "timeline", "signal"] as const,
          knownWorkspaces: new Set<string>(),
          eligibleByDate: { "2026-08-01": 4 },
          events: [event()],
          storedLifecycle: new Map(),
        },
      ];
    },
    writeDaily: async () => {
      calls.push("rollup:writeDaily");
    },
    writeLifecycle: async () => {
      calls.push("rollup:writeLifecycle");
    },
    sealCandidates: async () => {
      calls.push("seal:read");
      if (options.failOn === "seal") boom("seal");
      return options.sealCandidates ?? [];
    },
    writeSealVerdicts: async () => {
      calls.push("seal:write");
    },
    // `?? ` would swallow a deliberate null, which is the case that matters.
    lastSealedAt: async () =>
      "lastSealedAtMs" in options ? options.lastSealedAtMs! : NOW - DAY,
    sweepExpiredEvents: async (nowMs, opts) => {
      calls.push("sweep");
      if (options.failOn === "sweep") boom("sweep");
      return { deleted: 7, cutoff: nowMs - 35 * DAY, dryRun: opts.dryRun };
    },
  };
}

test("the sweep runs last, and the call log proves it", async () => {
  const calls: string[] = [];
  const outcome = await runNightlyMaintenance(fakeStore({ calls }), {
    now: NOW,
    todayLocalDate: TODAY,
  });

  assert.deepEqual(outcome.order, ["repair", "rollup", "seal", "sweep"]);

  // The assertion that matters. Not "sweep was called" — where it was called.
  const sweepAt = calls.indexOf("sweep");
  assert.ok(sweepAt >= 0, "the sweep must have run");
  assert.ok(
    calls.indexOf("rollup:writeDaily") < sweepAt,
    "the rollup must have written before anything was deleted",
  );
  assert.ok(
    calls.indexOf("rollup:writeLifecycle") < sweepAt,
    "lifecycle facts must outlive the events they came from",
  );
  assert.ok(
    calls.indexOf("seal:read") < sweepAt,
    "bands must be judged while their evidence still exists",
  );
  assert.equal(sweepAt, calls.length - 1, "nothing may run after the sweep");
  assert.equal(outcome.ok, true);
  assert.equal(outcome.sweep?.deleted, 7);
});

test("a failed rollup means nothing is deleted at all", async () => {
  const calls: string[] = [];
  const outcome = await runNightlyMaintenance(
    fakeStore({ calls, failOn: "rollup" }),
    { now: NOW, todayLocalDate: TODAY },
  );

  assert.ok(!calls.includes("sweep"), "the sweep must not have been called");
  assert.equal(outcome.sweep, null);
  assert.equal(outcome.sweepSkipped, "rollup-failed");
  assert.equal(outcome.ok, false);
  assert.equal(outcome.failure?.step, "rollup");
  assert.deepEqual(outcome.order, ["repair", "rollup"]);
  // Holding events past retention is recoverable. Deleting uncounted days is
  // not. The alert says which way the handler erred and why.
  assert.match(outcome.alert ?? "", /did not run/);
});

test("a failed sealing step also stops the sweep", async () => {
  const calls: string[] = [];
  const outcome = await runNightlyMaintenance(
    fakeStore({ calls, failOn: "seal" }),
    { now: NOW, todayLocalDate: TODAY },
  );
  assert.ok(!calls.includes("sweep"));
  assert.equal(outcome.sweepSkipped, "seal-failed");
  assert.equal(outcome.failure?.step, "seal");
});

test("a failed repair stops everything, because the rollup would undercount", async () => {
  const calls: string[] = [];
  const outcome = await runNightlyMaintenance(
    fakeStore({ calls, failOn: "repair" }),
    { now: NOW, todayLocalDate: TODAY },
  );
  assert.deepEqual(calls, ["repair"]);
  assert.equal(outcome.sweepSkipped, "repair-failed");
  assert.equal(outcome.rollup, null);
});

test("a dry run reads everything and writes nothing", async () => {
  const calls: string[] = [];
  const outcome = await runNightlyMaintenance(fakeStore({ calls }), {
    now: NOW,
    todayLocalDate: TODAY,
    dryRun: true,
  });
  assert.ok(calls.includes("rollup:read"));
  assert.ok(!calls.includes("rollup:writeDaily"));
  assert.ok(!calls.includes("rollup:writeLifecycle"));
  assert.equal(outcome.sweep?.dryRun, true);
  assert.equal(outcome.dryRun, true);
});

test("an empty night is a healthy night, not a failure", async () => {
  const calls: string[] = [];
  const outcome = await runNightlyMaintenance(
    fakeStore({ calls, withPending: false }),
    { now: NOW, todayLocalDate: TODAY },
  );
  assert.equal(outcome.ok, true);
  assert.equal(outcome.rollup?.sponsors, 0);
  assert.deepEqual(outcome.order, ["repair", "rollup", "seal", "sweep"]);
});

test("a sealing job that has fallen behind turns the run red", async () => {
  const calls: string[] = [];
  const outcome = await runNightlyMaintenance(
    fakeStore({ calls, lastSealedAtMs: NOW - (MAX_SEALING_GAP_DAYS + 5) * DAY }),
    { now: NOW, todayLocalDate: TODAY },
  );

  // The sweep still runs: the events it deletes are past retention either way,
  // and refusing to sweep recovers nothing. What changes is that the run is not
  // ok, so the platform's cron alerting fires.
  assert.ok(calls.includes("sweep"));
  assert.equal(outcome.ok, false);
  assert.equal(outcome.sealing?.cadence.ok, false);
  assert.match(outcome.alert ?? "", new RegExp(`${MAX_SEALING_GAP_DAYS}`));
  assert.match(outcome.alert ?? "", /Raw events are deleted at 35/);
});

test("day one is not a breach, so the alarm still means something later", async () => {
  // Nothing has ever sealed and there is nothing to seal. `assessCadence`
  // reports an infinite gap, correctly, but turning that into a nightly 500 on
  // an empty database would make this cron red from the day it is scheduled
  // until the first couple acts. A cron that is always red is a cron nobody
  // reads, and this is the alarm standing in front of data that cannot be
  // rebuilt.
  const calls: string[] = [];
  const outcome = await runNightlyMaintenance(
    fakeStore({ calls, lastSealedAtMs: null }),
    { now: NOW, todayLocalDate: TODAY },
  );
  assert.equal(outcome.sealing?.cadence.ok, false, "the assessment is unchanged");
  assert.equal(outcome.ok, true, "but day one is not an operator problem");
  assert.equal(outcome.alert, null);
});

test("a sealing job that has never run turns red the moment work exists", async () => {
  const calls: string[] = [];
  const outcome = await runNightlyMaintenance(
    fakeStore({
      calls,
      lastSealedAtMs: null,
      sealCandidates: [
        {
          sponsorId: "sp_1",
          workspaceIdHash: "b".repeat(32),
          hashSaltEpoch: "epoch001",
          // Still open: the band has not closed, so nothing seals tonight. The
          // candidate existing is what makes never-having-sealed a problem.
          firstActionLocalDate: "2026-08-01",
          actionLocalDates: ["2026-08-01"],
        },
      ],
    }),
    { now: NOW, todayLocalDate: TODAY },
  );
  assert.equal(outcome.ok, false);
  assert.match(outcome.alert ?? "", /never run/);
});

test("a band whose evidence was already swept seals indeterminate and alerts", async () => {
  const calls: string[] = [];
  const outcome = await runNightlyMaintenance(
    fakeStore({
      calls,
      // First action 70 days ago: the band ran days 25 to 35 after it, so its
      // earliest day is 45 days old and the events are long gone.
      sealCandidates: [
        {
          sponsorId: "sp_1",
          workspaceIdHash: "b".repeat(32),
          hashSaltEpoch: "epoch001",
          firstActionLocalDate: "2026-05-25",
          actionLocalDates: [],
        },
      ],
    }),
    { now: NOW, todayLocalDate: TODAY },
  );

  assert.equal(outcome.sealing?.sealed, 1);
  assert.equal(outcome.sealing?.indeterminate, 1);
  assert.equal(outcome.ok, false);
  assert.match(outcome.alert ?? "", /cannot be rebuilt/);
  assert.ok(calls.includes("seal:write"));
});

test("the alert names the number an operator has to act on", () => {
  const message = sealingAlert({
    sealed: 3,
    indeterminate: 1,
    cadence: { ok: false, gapDays: 26, atRisk: 2 },
    maxGapDays: MAX_SEALING_GAP_DAYS,
  });
  assert.match(message, /26 days ago/);
  assert.match(message, /2 continuation bands/);
  assert.match(message, /1 band sealed indeterminate/);
  assert.match(message, /at least every 20 days/);
});
