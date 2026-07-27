import assert from "node:assert/strict";
import { test } from "node:test";

import {
  BEHAVIOURAL_MIN_WORKSPACES,
  RATE_MIN_WORKSPACES,
  assertNoZeroForAbsent,
  presentBehavioural,
  presentRate,
  resolveCoverage,
} from "./suppression";

test("a behavioural count is withheld below three eligible workspaces", () => {
  assert.deepEqual(presentBehavioural(9, 2), { state: "withheld" });
  assert.deepEqual(presentBehavioural(9, BEHAVIOURAL_MIN_WORKSPACES), { state: "value", value: 9 });
});

test("a rate is withheld below five eligible workspaces", () => {
  assert.deepEqual(presentRate(0.4, 4), { state: "withheld" });
  assert.deepEqual(presentRate(0.4, RATE_MIN_WORKSPACES), { state: "value", value: 0.4 });
});

test("an absent value is unavailable at every cohort size, never zero", () => {
  for (const eligible of [0, 1, 3, 5, 50]) {
    assert.deepEqual(presentBehavioural(null, eligible), { state: "unavailable" });
    assert.deepEqual(presentRate(null, eligible), { state: "unavailable" });
  }
});

test("a real zero is still reportable once the cohort is large enough", () => {
  // Zero is only honest when it is measured. This is the one case it may show.
  assert.deepEqual(presentBehavioural(0, 10), { state: "value", value: 0 });
});

test("coverage is unavailable when no day produced a rollup", () => {
  assert.equal(
    resolveCoverage({ eligibleWorkspaces: 40, daysCovered: 0, daysExpected: 30, missingProducts: [] }),
    "unavailable",
  );
});

test("coverage is suppressed for a small cohort even with full days", () => {
  assert.equal(
    resolveCoverage({ eligibleWorkspaces: 2, daysCovered: 30, daysExpected: 30, missingProducts: [] }),
    "suppressed",
  );
});

test("a missing day or a missing product makes coverage partial", () => {
  assert.equal(
    resolveCoverage({ eligibleWorkspaces: 40, daysCovered: 29, daysExpected: 30, missingProducts: [] }),
    "partial",
  );
  assert.equal(
    resolveCoverage({
      eligibleWorkspaces: 40,
      daysCovered: 30,
      daysExpected: 30,
      missingProducts: ["timeline"],
    }),
    "partial",
  );
});

test("coverage is complete only with every day and every product", () => {
  assert.equal(
    resolveCoverage({ eligibleWorkspaces: 40, daysCovered: 30, daysExpected: 30, missingProducts: [] }),
    "complete",
  );
});

test("the guard catches an absent metric dressed up as a value", () => {
  assert.throws(() => assertNoZeroForAbsent({ state: "value", value: 0 }, null), /absent metric/);
  assert.doesNotThrow(() => assertNoZeroForAbsent({ state: "unavailable" }, null));
  assert.doesNotThrow(() => assertNoZeroForAbsent({ state: "value", value: 0 }, 0));
});

test("the thresholds are the ones the privacy contract names", () => {
  assert.equal(BEHAVIOURAL_MIN_WORKSPACES, 3);
  assert.equal(RATE_MIN_WORKSPACES, 5);
});
