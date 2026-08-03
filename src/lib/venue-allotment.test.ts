import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ALLOTMENT_MODES,
  DEFAULT_ALLOTMENT_MODE,
  FAIR_USE_CEILING_FLOOR,
  fairUseBreach,
  fairUseCeilingFor,
  isAllotmentMode,
  isUnlimitedSponsor,
  remainingAllotment,
} from "./venue-allotment";

test("the mode vocabulary is exactly two values and defaults to the safe one", () => {
  assert.deepEqual([...ALLOTMENT_MODES], ["limited", "unlimited"]);
  assert.equal(DEFAULT_ALLOTMENT_MODE, "limited");
  assert.equal(isAllotmentMode("limited"), true);
  assert.equal(isAllotmentMode("unlimited"), true);
  assert.equal(isAllotmentMode("Unlimited"), false);
  assert.equal(isAllotmentMode(null), false);
  assert.equal(isAllotmentMode(undefined), false);
});

test("a missing or unknown mode is never read as unlimited", () => {
  // The failure that must not happen: a legacy row silently becoming unlimited.
  assert.equal(isUnlimitedSponsor({}), false);
  assert.equal(isUnlimitedSponsor({ allotmentMode: null }), false);
  assert.equal(isUnlimitedSponsor({ allotmentMode: undefined }), false);
  assert.equal(isUnlimitedSponsor({ allotmentMode: "limited" }), false);
  assert.equal(isUnlimitedSponsor({ allotmentMode: "" }), false);
  assert.equal(isUnlimitedSponsor({ allotmentMode: "unlimited" }), true);
});

test("remaining headroom is null, never zero, when the question does not apply", () => {
  assert.equal(
    remainingAllotment({ allotmentMode: "unlimited", codeAllotment: 40, codesIssued: 4 }),
    null,
  );
  assert.equal(
    remainingAllotment({ allotmentMode: "limited", codeAllotment: null, codesIssued: 0 }),
    null,
  );
  assert.equal(
    remainingAllotment({ allotmentMode: "limited", codeAllotment: 40, codesIssued: 12 }),
    28,
  );
  // Over-issued past a cap floors at zero rather than reporting a negative.
  assert.equal(
    remainingAllotment({ allotmentMode: "limited", codeAllotment: 5, codesIssued: 9 }),
    0,
  );
});

test("the fair-use ceiling doubles the venue's own annual figure", () => {
  assert.equal(fairUseCeilingFor(60), 120);
  assert.equal(fairUseCeilingFor(250), 500);
});

test("the ceiling never drops below the floor", () => {
  // D-012 rules out venues under roughly 20 weddings a year, so 40 is the
  // number a qualifying venue would reach anyway.
  assert.equal(FAIR_USE_CEILING_FLOOR, 40);
  assert.equal(fairUseCeilingFor(5), 40);
  assert.equal(fairUseCeilingFor(20), 40);
  assert.equal(fairUseCeilingFor(0), 40);
  assert.equal(fairUseCeilingFor(null), 40);
  assert.equal(fairUseCeilingFor(undefined), 40);
  assert.equal(fairUseCeilingFor(-10), 40);
  assert.equal(fairUseCeilingFor(Number.NaN), 40);
});

test("a breach is reported at the crossing, not before", () => {
  assert.equal(fairUseBreach({ fairUseCeiling: 40, issuedInTerm: 39, requested: 1 })?.breached, false);
  assert.equal(fairUseBreach({ fairUseCeiling: 40, issuedInTerm: 40, requested: 1 })?.breached, true);
  assert.equal(fairUseBreach({ fairUseCeiling: 40, issuedInTerm: 0, requested: 41 })?.breached, true);
});

test("no ceiling means no signal, and never a refusal", () => {
  assert.equal(fairUseBreach({ fairUseCeiling: null, issuedInTerm: 999, requested: 999 }), null);
  assert.equal(fairUseBreach({ fairUseCeiling: 0, issuedInTerm: 999, requested: 1 }), null);
  assert.equal(fairUseBreach({ fairUseCeiling: undefined, issuedInTerm: 1, requested: 1 }), null);
});
