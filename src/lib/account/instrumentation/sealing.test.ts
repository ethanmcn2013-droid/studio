import assert from "node:assert/strict";
import { test } from "node:test";

import { addLocalDays } from "./local-date";
import { EVENT_RETENTION_DAYS } from "./retention-window";
import {
  DAY30_BAND,
  MAX_SEALING_GAP_DAYS,
  assessCadence,
  bandFor,
  isBandClosed,
  isEvidenceIntact,
  sealCandidate,
  type SealCandidate,
} from "./sealing";

const FIRST = "2026-06-01";
const DAY = 86_400_000;
/** Local midday well past the band's end, so day 35 has closed. */
const AFTER_BAND = Date.UTC(2026, 6, 10, 12);

function candidate(overrides: Partial<SealCandidate> = {}): SealCandidate {
  return {
    sponsorId: "sp_1",
    workspaceIdHash: "w1",
    hashSaltEpoch: "abcd1234",
    firstActionLocalDate: FIRST,
    actionLocalDates: [FIRST],
    ...overrides,
  };
}

test("the band is days 25 through 35 after the first action", () => {
  assert.deepEqual(DAY30_BAND, { earliest: 25, latest: 35 });
  assert.deepEqual(bandFor(FIRST), { start: "2026-06-26", end: "2026-07-06" });
});

test("a band cannot be judged before its last day closes", () => {
  assert.equal(isBandClosed(FIRST, Date.UTC(2026, 6, 5, 12)), false);
  assert.equal(isBandClosed(FIRST, AFTER_BAND), true);
});

test("an open band yields no verdict at all", () => {
  assert.equal(sealCandidate(candidate(), Date.UTC(2026, 6, 1, 12), "2026-07-01"), null);
});

test("a return inside the band seals as returned", () => {
  const verdict = sealCandidate(
    candidate({ actionLocalDates: [FIRST, "2026-06-30"] }),
    AFTER_BAND,
    "2026-07-10",
  );
  assert.equal(verdict?.state, "returned");
});

test("activity outside the band does not count as a return", () => {
  const verdict = sealCandidate(
    candidate({ actionLocalDates: [FIRST, "2026-06-20", "2026-07-20"] }),
    AFTER_BAND,
    "2026-07-10",
  );
  assert.equal(verdict?.state, "not_returned");
});

test("both band edges are inclusive", () => {
  for (const day of ["2026-06-26", "2026-07-06"]) {
    const verdict = sealCandidate(
      candidate({ actionLocalDates: [FIRST, day] }),
      AFTER_BAND,
      "2026-07-10",
    );
    assert.equal(verdict?.state, "returned", `${day} is inside the band`);
  }
});

test("evidence is intact while the band's earliest day is inside retention", () => {
  const { start } = bandFor(FIRST);
  const lastGoodDay = addLocalDays(start, EVENT_RETENTION_DAYS);
  assert.equal(isEvidenceIntact(FIRST, lastGoodDay), true);
  assert.equal(isEvidenceIntact(FIRST, addLocalDays(lastGoodDay, 1)), false);
});

test("a band sealed after its evidence was swept is indeterminate, never a zero", () => {
  const verdict = sealCandidate(
    candidate({ actionLocalDates: [FIRST] }),
    Date.UTC(2026, 8, 1, 12),
    "2026-09-01",
  );
  assert.equal(verdict?.state, "indeterminate");
  assert.equal(verdict?.reason, "events-swept-before-sealing");
});

test("indeterminate is chosen even when the stored dates would say not returned", () => {
  // The distinction matters: we do not know, which is not the same as no.
  const verdict = sealCandidate(
    candidate({ actionLocalDates: [] }),
    Date.UTC(2026, 8, 1, 12),
    "2026-09-01",
  );
  assert.equal(verdict?.state, "indeterminate");
});

test("a healthy cadence reports ok", () => {
  const health = assessCadence(
    Date.UTC(2026, 6, 9, 6),
    Date.UTC(2026, 6, 10, 6),
    [candidate()],
    "2026-07-10",
  );
  assert.equal(health.ok, true);
  assert.equal(health.gapDays, 1);
  assert.equal(health.atRisk, 0);
});

test("a cadence past the safe gap is not ok", () => {
  const now = Date.UTC(2026, 6, 10, 6);
  const health = assessCadence(
    now - (MAX_SEALING_GAP_DAYS + 1) * DAY,
    now,
    [candidate()],
    "2026-07-10",
  );
  assert.equal(health.ok, false);
  assert.ok(health.gapDays > MAX_SEALING_GAP_DAYS);
});

test("candidates whose evidence is already gone are counted as at risk", () => {
  const health = assessCadence(
    Date.UTC(2026, 7, 31, 6),
    Date.UTC(2026, 8, 1, 6),
    [candidate()],
    "2026-09-01",
  );
  assert.equal(health.atRisk, 1);
  assert.equal(health.ok, false, "a recent run does not excuse a lost cohort");
});

test("never having sealed is reported rather than treated as fine", () => {
  const health = assessCadence(null, Date.UTC(2026, 6, 10, 6), [], "2026-07-10");
  assert.equal(health.ok, false);
  assert.equal(health.gapDays, -1);
});

test("the safe gap leaves real slack against retention", () => {
  // The band closes 10 days after its earliest day, so the job may miss
  // MAX_SEALING_GAP_DAYS and still be inside the 35-day window.
  assert.ok(MAX_SEALING_GAP_DAYS + 10 < EVENT_RETENTION_DAYS);
});
