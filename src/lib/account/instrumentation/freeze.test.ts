import assert from "node:assert/strict";
import { test } from "node:test";

import type { AccountSnapshot } from "../types";
import { projectVenueAccessSnapshot } from "../live/project-venue-access";
import {
  FROZEN_LABEL,
  canonicalJson,
  contentHashFor,
  freezeReport,
  isPeriodClosed,
  readFrozenReport,
  type FreezeCandidate,
} from "./freeze";
import { presentRate } from "./suppression";

/** Well past the grace hour on 2026-07-02, so June is closed. */
const NOW = Date.UTC(2026, 6, 2, 12);

/** Built from the real projector so the fixture cannot drift from the type. */
function snapshot(coverageState = "complete"): AccountSnapshot {
  const base = projectVenueAccessSnapshot({
    nowMs: Date.UTC(2026, 5, 30, 12),
    sponsor: {
      id: "sp_1",
      slug: "glenmara-house",
      name: "Glenmara House",
      venuePlan: "paid",
      paid: true,
      termStartsAt: Date.UTC(2026, 0, 1),
      termEndsAt: Date.UTC(2026, 11, 31),
      codeAllotment: 40,
      codesIssued: 12,
    },
    codes: [],
  });
  return {
    ...base,
    sampleLabel: "LIVE ACCESS AND USAGE.",
    coverage: {
      ...base.coverage,
      state: coverageState as AccountSnapshot["coverage"]["state"],
      periodStart: "2026-06-01",
      periodEnd: "2026-06-30",
      periodLabel: "June 2026",
      dataThrough: "2026-06-30",
    },
    adoption: {
      ...base.adoption,
      firstUsefulAction: { state: "exact", value: 7 },
      activeRecently: { state: "exact", value: 5 },
      // A test helper cannot hand-build a rate either. It goes through the
      // projector like every other caller.
      continuedAfter30Days: presentRate(4, 6, "No closed day-30 cohort"),
      daysWithSponsoredUse: { state: "exact", value: 21 },
    },
  };
}

function candidate(over: Partial<FreezeCandidate> = {}): FreezeCandidate {
  return {
    sponsorId: "sp_1",
    periodStart: "2026-06-01",
    periodEnd: "2026-06-30",
    periodLabel: "June 2026",
    snapshot: snapshot(),
    hashSaltEpoch: "abcd1234",
    eligibleWorkspaces: 12,
    dataThrough: Date.UTC(2026, 5, 30, 23, 59),
    ...over,
  };
}

test("a closed period freezes", () => {
  const outcome = freezeReport(candidate(), NOW);
  assert.equal(outcome.frozen, true);
});

test("a period still running refuses to freeze", () => {
  const outcome = freezeReport(candidate(), Date.UTC(2026, 5, 15, 12));
  assert.equal(outcome.frozen, false);
  if (!outcome.frozen) assert.equal(outcome.reason, "period-not-closed");
});

test("a period with no coverage is not frozen at all", () => {
  const outcome = freezeReport(
    candidate({ snapshot: snapshot("unavailable") }),
    NOW,
  );
  assert.equal(outcome.frozen, false);
  if (!outcome.frozen) assert.equal(outcome.reason, "coverage-unavailable");
});

test("an already frozen period is not frozen twice", () => {
  const outcome = freezeReport(candidate(), NOW, { existing: true });
  assert.equal(outcome.frozen, false);
  if (!outcome.frozen) assert.equal(outcome.reason, "already-frozen");
});

test("a frozen report drops the live label for the closed-period one", () => {
  const outcome = freezeReport(candidate(), NOW);
  assert.equal(outcome.frozen, true);
  if (outcome.frozen) {
    const read = readFrozenReport(outcome.report);
    assert.equal(read.intact, true);
    if (read.intact) assert.equal(read.snapshot.sampleLabel, FROZEN_LABEL);
    assert.ok(!outcome.report.payloadJson.includes("SAMPLE"));
    assert.ok(!outcome.report.payloadJson.includes("LIVE ACCESS AND USAGE"));
  }
});

test("a frozen report reads back byte-identically", () => {
  const outcome = freezeReport(candidate(), NOW);
  assert.equal(outcome.frozen, true);
  if (outcome.frozen) {
    const first = readFrozenReport(outcome.report);
    const second = readFrozenReport(outcome.report);
    assert.deepEqual(first, second);
  }
});

test("editing a stored payload is detected", () => {
  const outcome = freezeReport(candidate(), NOW);
  assert.equal(outcome.frozen, true);
  if (outcome.frozen) {
    const tampered = {
      ...outcome.report,
      payloadJson: outcome.report.payloadJson.replace('"value":21', '"value":210'),
    };
    const read = readFrozenReport(tampered);
    assert.equal(read.intact, false);
    if (!read.intact) assert.equal(read.reason, "content-hash-mismatch");
  }
});

test("an unreadable payload is refused rather than guessed at", () => {
  const payloadJson = "{not json";
  const read = readFrozenReport({ payloadJson, contentHash: contentHashFor(payloadJson) });
  assert.equal(read.intact, false);
  if (!read.intact) assert.equal(read.reason, "payload-unreadable");
});

test("the hash depends on content, not on key order", () => {
  const a = canonicalJson({ b: 1, a: { d: 2, c: 3 } });
  const b = canonicalJson({ a: { c: 3, d: 2 }, b: 1 });
  assert.equal(a, b);
  assert.equal(contentHashFor(a), contentHashFor(b));
});

test("a suppressed period still freezes, and records that it was suppressed", () => {
  const outcome = freezeReport(candidate({ snapshot: snapshot("suppressed") }), NOW);
  assert.equal(outcome.frozen, true);
  if (outcome.frozen) assert.equal(outcome.report.suppressionApplied, true);
});

test("a period end that has not closed locally is not closed", () => {
  // 01:00 Dublin on 1 July: the grace hour has not passed for 30 June.
  assert.equal(isPeriodClosed("2026-06-30", Date.UTC(2026, 6, 1, 1)), false);
  assert.equal(isPeriodClosed("2026-06-30", Date.UTC(2026, 6, 1, 12)), true);
});
