import assert from "node:assert/strict";
import { test } from "node:test";

import {
  RETENTION_WINDOWS,
  computeRetention,
  didReturnInWindow,
  isCohortClosed,
  type ActivationUsage,
} from "./retention";

const DAY = 86_400_000;
const FIRST = Date.UTC(2026, 0, 1, 12);

function activation(id: string, offsets: number[]): ActivationUsage {
  return {
    activationId: id,
    firstActionAt: FIRST,
    actionDays: [FIRST, ...offsets.map((o) => FIRST + o * DAY)],
  };
}

/** Far enough past every window that all cohorts are closed. */
const LONG_AFTER = FIRST + 200 * DAY;

test("the windows are the ones the metric dictionary names", () => {
  assert.deepEqual(RETENTION_WINDOWS.day7, { earliest: 5, latest: 9 });
  assert.deepEqual(RETENTION_WINDOWS.day30, { earliest: 25, latest: 35 });
  assert.deepEqual(RETENTION_WINDOWS.day90, { earliest: 80, latest: 100 });
});

test("a return inside the window counts", () => {
  assert.equal(didReturnInWindow(activation("a", [30]), "day30"), true);
  assert.equal(didReturnInWindow(activation("a", [25]), "day30"), true);
  assert.equal(didReturnInWindow(activation("a", [35]), "day30"), true);
});

test("a return outside the window does not count", () => {
  assert.equal(didReturnInWindow(activation("a", [24]), "day30"), false);
  assert.equal(didReturnInWindow(activation("a", [36]), "day30"), false);
});

test("continuous use still counts once, not per action", () => {
  const busy = activation("a", [26, 27, 28, 29, 30]);
  assert.equal(didReturnInWindow(busy, "day30"), true);
});

test("a cohort is not closed until its last day has passed", () => {
  const a = activation("a", []);
  assert.equal(isCohortClosed(a, "day30", FIRST + 34 * DAY), false);
  assert.equal(isCohortClosed(a, "day30", FIRST + 35 * DAY), true);
});

test("an open cohort reports unavailable, never a rate", () => {
  const cohort = Array.from({ length: 20 }, (_, i) => activation(`a${i}`, [30]));
  const result = computeRetention(cohort, "day30", FIRST + 10 * DAY);
  assert.equal(result.state, "unavailable");
  if (result.state === "unavailable") assert.match(result.reason, /day 35/);
});

test("a closed cohort under five is withheld, not shown", () => {
  const cohort = Array.from({ length: 4 }, (_, i) => activation(`a${i}`, [30]));
  const result = computeRetention(cohort, "day30", LONG_AFTER);
  assert.equal(result.state, "withheld");
  if (result.state === "withheld") assert.equal(result.eligible, 4);
});

test("five closed activations produce a rate with its denominator", () => {
  const cohort = [
    activation("a1", [30]),
    activation("a2", [30]),
    activation("a3", [30]),
    activation("a4", []),
    activation("a5", []),
  ];
  const result = computeRetention(cohort, "day30", LONG_AFTER);
  assert.equal(result.state, "value");
  if (result.state === "value") {
    assert.equal(result.returned, 3);
    assert.equal(result.eligible, 5);
    assert.equal(result.rate, 0.6);
  }
});

test("only closed activations enter the denominator", () => {
  const recent = {
    activationId: "recent",
    firstActionAt: LONG_AFTER - 5 * DAY,
    actionDays: [LONG_AFTER - 5 * DAY],
  };
  const cohort = [
    activation("a1", [30]),
    activation("a2", [30]),
    activation("a3", [30]),
    activation("a4", [30]),
    activation("a5", [30]),
    recent,
  ];
  const result = computeRetention(cohort, "day30", LONG_AFTER);
  assert.equal(result.state, "value");
  // The recent activation has not had its chance yet, so it must not dilute the rate.
  if (result.state === "value") {
    assert.equal(result.eligible, 5);
    assert.equal(result.rate, 1);
  }
});

test("nobody returning is a real zero rate, not a withheld one", () => {
  const cohort = Array.from({ length: 6 }, (_, i) => activation(`a${i}`, []));
  const result = computeRetention(cohort, "day30", LONG_AFTER);
  assert.equal(result.state, "value");
  if (result.state === "value") {
    assert.equal(result.returned, 0);
    assert.equal(result.rate, 0);
    assert.equal(result.eligible, 6);
  }
});

test("an empty cohort is unavailable", () => {
  assert.equal(computeRetention([], "day30", LONG_AFTER).state, "unavailable");
});

test("the horizons are independent", () => {
  const a = activation("a", [7]);
  assert.equal(didReturnInWindow(a, "day7"), true);
  assert.equal(didReturnInWindow(a, "day30"), false);
  assert.equal(didReturnInWindow(a, "day90"), false);
});
