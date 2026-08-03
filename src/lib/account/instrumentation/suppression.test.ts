import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

import type { RateValue } from "../types";
import {
  BEHAVIOURAL_MIN_WORKSPACES,
  RATE_MIN_WORKSPACES,
  assertNoZeroForAbsent,
  isSmallCell,
  presentBehavioural,
  presentRate,
  presentWindowMetric,
  resolveCoverage,
} from "./suppression";

const ABSENT = "No closed cohort for this period";

/* ------------------------------------------------------------------ R-027 */

test("a behavioural count is withheld below three eligible workspaces", () => {
  assert.deepEqual(presentBehavioural(9, 2), { state: "withheld" });
  assert.deepEqual(presentBehavioural(9, 12), { state: "value", value: 9 });
});

test("R-027: a count of one in a population of forty is withheld", () => {
  // The shipped behaviour returned { state: "value", value: 1 }. A venue knows
  // exactly which couples it invited, so that sentence described one of them.
  assert.deepEqual(presentBehavioural(1, 40), { state: "withheld" });
  assert.deepEqual(presentBehavioural(2, 40), { state: "withheld" });
});

test("R-027: the complement is withheld too", () => {
  // 39 of 40 names the one who did not.
  assert.deepEqual(presentBehavioural(39, 40), { state: "withheld" });
  assert.deepEqual(presentBehavioural(38, 40), { state: "withheld" });
  assert.deepEqual(presentBehavioural(40, 40), { state: "withheld" });
});

test("R-027: the floor is two-sided at every population size", () => {
  for (const population of [3, 6, 10, 40, 250]) {
    for (const value of [0, 1, 2]) {
      assert.deepEqual(
        presentBehavioural(value, population),
        { state: "withheld" },
        `${value} of ${population} must be withheld`,
      );
      assert.deepEqual(
        presentBehavioural(population - value, population),
        { state: "withheld" },
        `${population - value} of ${population} must be withheld`,
      );
    }
  }
});

test("R-027: a count clear of both edges is published", () => {
  assert.deepEqual(presentBehavioural(3, 6), { state: "value", value: 3 });
  assert.deepEqual(presentBehavioural(20, 40), { state: "value", value: 20 });
});

test("R-027: the withheld state cannot tell you which edge it hit", () => {
  // If "too low" and "too high" were distinguishable, the state would leak the
  // bound and the suppression would be self-defeating.
  assert.deepEqual(presentBehavioural(1, 40), presentBehavioural(39, 40));
  assert.deepEqual(
    Object.keys(presentBehavioural(1, 40)).sort(),
    ["state"],
    "a withheld presentation carries nothing but its state",
  );
});

test("the small-cell test refuses an impossible input", () => {
  // A value larger than the population it is drawn from is broken data, and
  // broken data is never published.
  assert.equal(isSmallCell(41, 40), true);
  assert.deepEqual(presentBehavioural(41, 40), { state: "withheld" });
});

test("a zero is withheld like any other small cell", () => {
  // This replaces "a real zero is still reportable". Under the two-sided rule a
  // measured zero is a statement about every identifiable couple in the cohort:
  // it says each one of them did nothing. Suppressing it is the point, not a
  // regression. `assertNoZeroForAbsent` still guards the different mistake of
  // an *absent* value dressed up as a zero.
  assert.deepEqual(presentBehavioural(0, 10), { state: "withheld" });
});

test("a day count keeps the population floor and drops the complement rule", () => {
  // Days are not people. "Four of thirty days" identifies nobody.
  assert.deepEqual(presentWindowMetric(1, 40), { state: "value", value: 1 });
  assert.deepEqual(presentWindowMetric(1, 2), { state: "withheld" });
  assert.deepEqual(presentWindowMetric(null, 40), { state: "unavailable" });
});

/* ------------------------------------------------------------------ R-028 */

test("a rate is withheld below five eligible workspaces", () => {
  assert.deepEqual(presentRate(2, 4, ABSENT), {
    state: "withheld",
    reason: "small_group",
  });
  const published = presentRate(2, RATE_MIN_WORKSPACES, ABSENT);
  assert.equal(published.state, "rate");
  if (published.state === "rate") {
    assert.equal(published.numerator, 2);
    assert.equal(published.denominator, 5);
  }
});

test("R-028: a rate carries its numerator and denominator as one value", () => {
  const rate = presentRate(9, 12, ABSENT);
  assert.equal(rate.state, "rate");
  if (rate.state === "rate") {
    assert.deepEqual(
      { numerator: rate.numerator, denominator: rate.denominator },
      { numerator: 9, denominator: 12 },
    );
  }
});

test("R-028: a rate cannot be constructed from two loose metrics", () => {
  // The compile-time half of the fix. If the brand is ever removed, the
  // suppression below becomes unused and the typecheck fails, which is exactly
  // the failure we want.
  // @ts-expect-error a rate is not constructible outside the projector
  const forged: RateValue = { state: "rate", numerator: 1, denominator: 40 };
  assert.equal(forged.state, "rate");
});

test("R-028: a withheld rate carries no numbers at all", () => {
  const withheld = presentRate(1, 4, ABSENT);
  assert.deepEqual(Object.keys(withheld).sort(), ["reason", "state"]);
});

test("a rate with no cohort is unavailable, never zero", () => {
  assert.deepEqual(presentRate(null, null, ABSENT), {
    state: "unavailable",
    reason: ABSENT,
  });
  assert.deepEqual(presentRate(0, 0, ABSENT), {
    state: "unavailable",
    reason: ABSENT,
  });
});

test("a rate refuses a numerator its denominator cannot contain", () => {
  assert.equal(presentRate(9, 5, ABSENT).state, "unavailable");
  assert.equal(presentRate(-1, 10, ABSENT).state, "unavailable");
});

/* ------------------------------------------------------------- unchanged */

test("an absent value is unavailable at every cohort size, never zero", () => {
  for (const eligible of [0, 1, 3, 5, 50]) {
    assert.deepEqual(presentBehavioural(null, eligible), { state: "unavailable" });
    assert.deepEqual(presentRate(null, eligible, ABSENT), {
      state: "unavailable",
      reason: ABSENT,
    });
  }
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

/* ------------------------------------------------- R-028 source contract */

function accountSourceFiles(): string[] {
  const roots = [
    path.join(process.cwd(), "src", "lib", "account"),
    path.join(process.cwd(), "src", "app", "hq", "account-review"),
  ];
  const found: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) {
        found.push(full);
      }
    }
  };
  roots.forEach(walk);
  return found;
}

test("R-028: only the rate formatter may turn numbers into a percentage", () => {
  const offenders = accountSourceFiles().filter(
    (file) =>
      /\*\s*100(?![0-9])/.test(readFileSync(file, "utf8")) &&
      path.basename(file) !== "format.ts",
  );
  assert.deepEqual(
    offenders.map((f) => path.relative(process.cwd(), f)),
    [],
    "a percentage may only be built inside formatRateValue",
  );
});

test("R-028: no formatter takes two metrics and divides them", () => {
  // This is the test that fails on the shipped code. `metricRateLabel(numerator:
  // MetricValue, denominator: MetricValue)` was the defect, and any replacement
  // with the same shape is the same defect under a new name.
  const source = readFileSync(
    path.join(process.cwd(), "src", "lib", "account", "format.ts"),
    "utf8",
  );
  const code = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  assert.equal(
    /metricRateLabel/.test(code),
    false,
    "metricRateLabel must not exist",
  );
  assert.equal(
    /:\s*MetricValue,[\s\S]{0,120}:\s*MetricValue/.test(code),
    false,
    "a formatter taking two MetricValue arguments can build a rate from loose numbers",
  );
});

test("R-028: only the projector may assert a value into the rate type", () => {
  const offenders = accountSourceFiles().filter(
    (file) =>
      /as RateValue/.test(readFileSync(file, "utf8")) &&
      path.basename(file) !== "suppression.ts",
  );
  assert.deepEqual(
    offenders.map((f) => path.relative(process.cwd(), f)),
    [],
    "the rate brand may only be applied by presentRate",
  );
});
