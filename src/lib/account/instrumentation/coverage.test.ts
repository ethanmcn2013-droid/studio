import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCoverageEnvelope,
  detectSaltRotation,
  kindCoverage,
  INSTRUMENTED_PRODUCTS,
  SALT_ROTATION_NOTICE,
} from "./coverage";
import { MEANINGFUL_ACTION_KINDS, UNWIRED_ACTION_KINDS } from "./event-schema";
import { maskFor } from "./rollup";

const ALL = maskFor(["notes", "tasks", "timeline", "signal"]);

function envelope(overrides: Partial<Parameters<typeof buildCoverageEnvelope>[0]> = {}) {
  return buildCoverageEnvelope({
    windowStart: "2026-07-01",
    windowEnd: "2026-07-30",
    dataThrough: "2026-07-30",
    coveredDays: 30,
    expectedDays: 30,
    coveredMask: ALL,
    expectedMask: ALL,
    eligibleWorkspaces: 8,
    saltEpochs: Array(30).fill("epoch001"),
    ...overrides,
  });
}

test("the envelope carries all ten contracted fields", () => {
  // E09.01 §7: no usage metric may render without this envelope. The three that
  // were missing entirely are the version pins and data_through, and the
  // module lists were counts rather than names.
  const e = envelope();
  for (const field of [
    "metric_dictionary_version",
    "instrumentation_version",
    "window_start",
    "window_end",
    "data_through",
    "coverage_state",
    "covered_modules",
    "missing_modules",
    "covered_days",
    "expected_days",
    "suppression_reason",
  ]) {
    assert.ok(field in e, `${field} must be on the envelope`);
  }
  assert.equal(e.metric_dictionary_version, "account-metrics.v2");
  assert.equal(e.instrumentation_version, "instrumentation.v1");
  assert.equal(e.window_start, "2026-07-01");
  assert.equal(e.window_end, "2026-07-30");
  assert.equal(e.data_through, "2026-07-30");
});

test("the retired dictionary name never appears", () => {
  assert.ok(!JSON.stringify(envelope()).includes("venue-metrics.v1"));
});

/**
 * `suppression_reason` carries four values, not three. `not_instrumented` is
 * the state where a metric was never wired, as distinct from
 * `incomplete_telemetry`, where it was wired and the data has a gap. Conflating
 * them tells a venue that something broke when in fact it was never built.
 * Every one of the four is reachable, and this test walks all four.
 */
test("every suppression reason the envelope declares is reachable", () => {
  const seen = new Set<string>();
  // none: every day, every expected product, every kind wired.
  seen.add(
    envelope({ expectedMask: 1 | 2, coveredMask: 1 | 2 }).suppression_reason,
  );
  // small_group: the cohort is under the behavioural floor.
  seen.add(envelope({ eligibleWorkspaces: 2 }).suppression_reason);
  // incomplete_telemetry: it was wired and a day is missing.
  seen.add(envelope({ coveredDays: 20 }).suppression_reason);
  // not_instrumented: nothing was measured at all.
  seen.add(envelope({ coveredDays: 0 }).suppression_reason);
  assert.deepEqual(
    [...seen].sort(),
    ["incomplete_telemetry", "none", "not_instrumented", "small_group"],
  );
});

test("Signal reports one of two kinds instrumented, not complete", () => {
  // E09.01 §3.5. `briefing_acknowledged` is allowlisted and has no caller
  // anywhere. Reporting Signal as covered would understate Signal reach by an
  // unknown amount while the mask looked healthy. E09.02 §9.8 recommends
  // removing the kind from the allowlist; that is an open founder call, so it
  // stays and the coverage says so instead.
  const signal = kindCoverage().find((k) => k.product === "signal");
  assert.ok(signal);
  assert.equal(signal.kindsInstrumented, 1);
  assert.equal(signal.kindsAllowlisted, 2);
  assert.equal(signal.complete, false);
  assert.deepEqual(signal.unwiredKinds, ["briefing_acknowledged"]);
  assert.deepEqual(UNWIRED_ACTION_KINDS, ["briefing_acknowledged"]);
});

test("the other three products report every allowlisted kind wired", () => {
  for (const product of ["notes", "tasks", "timeline"] as const) {
    const entry = kindCoverage().find((k) => k.product === product);
    assert.ok(entry?.complete, `${product} should be complete`);
    assert.equal(entry.kindsAllowlisted, MEANINGFUL_ACTION_KINDS[product].length);
  }
});

test("an unwired kind makes the window partial rather than complete", () => {
  // Every day present, every product present, and it is still not complete,
  // because Signal is reporting through one of its two kinds. That absence
  // shows as coverage instead of as a zero, which is the whole rule.
  const e = envelope();
  assert.equal(e.coverage_state, "partial");
  assert.equal(e.suppression_reason, "not_instrumented");
  assert.deepEqual(e.missing_modules, []);
});

test("a salt rotation is a coverage break, not a changed number", () => {
  // E09.02 acceptance criterion 9. Two epochs in one window means two identity
  // spaces were counted together: the same couple hashes to a different value
  // on each side, so the pair cannot be compared and neither is wrong.
  const e = envelope({
    saltEpochs: [...Array(15).fill("epoch001"), ...Array(15).fill("epoch002")],
  });
  assert.equal(e.salt_rotation.detected, true);
  assert.deepEqual(e.salt_rotation.epochs, ["epoch001", "epoch002"]);
  assert.equal(e.coverage_state, "partial");
  assert.equal(e.suppression_reason, "incomplete_telemetry");
});

test("one epoch across the window is not a rotation", () => {
  assert.equal(detectSaltRotation(["a", "a", "a"]).detected, false);
  assert.equal(detectSaltRotation([]).detected, false);
  assert.equal(detectSaltRotation([null, undefined, "a"]).detected, false);
});

test("the rotation notice says a measurement changed, never that usage fell", () => {
  assert.match(SALT_ROTATION_NOTICE, /measured changed/);
  assert.ok(!/down|fell|drop|decrease/i.test(SALT_ROTATION_NOTICE));
});

test("a small cohort is suppressed, and that outranks every other reason", () => {
  const e = envelope({
    eligibleWorkspaces: 2,
    coveredDays: 10,
    saltEpochs: ["epoch001", "epoch002"],
  });
  assert.equal(e.coverage_state, "suppressed");
  assert.equal(e.suppression_reason, "small_group");
});

test("no rollup at all is unavailable, never zero", () => {
  const e = envelope({ coveredDays: 0, dataThrough: null });
  assert.equal(e.coverage_state, "unavailable");
  assert.equal(e.suppression_reason, "not_instrumented");
  assert.equal(e.data_through, null);
});

test("a missing module is named, not counted away", () => {
  const e = envelope({ coveredMask: maskFor(["notes", "tasks", "timeline"]) });
  assert.deepEqual(e.covered_modules, ["notes", "tasks", "timeline"]);
  assert.deepEqual(e.missing_modules, ["signal"]);
  assert.equal(e.coverage_state, "partial");
});

test("missing days are visible as a shortfall against the window", () => {
  const e = envelope({ coveredDays: 27 });
  assert.equal(e.covered_days, 27);
  assert.equal(e.expected_days, 30);
  assert.equal(e.coverage_state, "partial");
  assert.equal(e.suppression_reason, "incomplete_telemetry");
});

test("instrumented products are declared, so a quiet product is still covered", () => {
  // Derived from the taxonomy, never from event volume. A product with no
  // events on a given day must read as instrumented and quiet, which is a zero,
  // rather than as not instrumented, which is a null.
  assert.deepEqual([...INSTRUMENTED_PRODUCTS], [
    "notes",
    "tasks",
    "timeline",
    "signal",
  ]);
});
