import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  FOUNDING_PLACES,
  compareFoundingClaim,
  formatFoundingNumber,
  foundingNumberRefusal,
  foundingPlacesRemaining,
  isFoundingProgrammeClosed,
  isValidFoundingNumber,
  needsManualTieBreak,
  nextFoundingNumber,
} from "./venue-founding-number";

describe("the number itself", () => {
  it("is always NN/25, zero-padded", () => {
    assert.equal(FOUNDING_PLACES, 25);
    assert.equal(formatFoundingNumber(1), "01/25");
    assert.equal(formatFoundingNumber(7), "07/25");
    assert.equal(formatFoundingNumber(25), "25/25");
  });

  it("refuses anything outside the programme", () => {
    for (const bad of [0, 26, -1, 1.5, null, undefined, "7", Number.NaN]) {
      assert.equal(formatFoundingNumber(bad as number), null, `expected null for ${bad}`);
      assert.equal(isValidFoundingNumber(bad), false);
    }
  });
});

describe("choosing the next place", () => {
  it("gives the lowest free number", () => {
    assert.equal(nextFoundingNumber([]), 1);
    assert.equal(nextFoundingNumber([1, 2, 3]), 4);
    assert.equal(nextFoundingNumber([1, 3, 4]), 2);
  });

  it("counts a lapsed venue's number as taken", () => {
    // "A number is never reused. If a venue lapses in year three, 07/25 stays
    // theirs historically." Treating it as free is how two businesses end up
    // holding the same place.
    const taken = [1, 2, 3, 4, 5, 6, 7];
    assert.equal(nextFoundingNumber(taken), 8);
    assert.notEqual(nextFoundingNumber(taken), 7);
  });

  it("returns null when the programme is full", () => {
    const all = Array.from({ length: 25 }, (_, i) => i + 1);
    assert.equal(nextFoundingNumber(all), null);
    assert.equal(isFoundingProgrammeClosed(all), true);
    assert.equal(foundingPlacesRemaining(all), 0);
  });

  it("ignores junk in the taken set rather than miscounting", () => {
    assert.equal(nextFoundingNumber([1, 0, 99, 2] as number[]), 3);
    assert.equal(foundingPlacesRemaining([1, 2, 999] as number[]), 23);
  });

  it("reports places left honestly", () => {
    assert.equal(foundingPlacesRemaining([]), 25);
    assert.equal(foundingPlacesRemaining([1, 2, 3]), 22);
    // Duplicates in the input must not double-count a single place.
    assert.equal(foundingPlacesRemaining([1, 1, 1]), 24);
  });
});

describe("assignment order", () => {
  const at = (iso: string) => Date.parse(iso);

  it("orders by the moment the payment clears", () => {
    const early = { sponsorId: "a", paidAt: at("2026-09-01T09:00:00Z") };
    const late = { sponsorId: "b", paidAt: at("2026-09-01T11:00:00Z") };
    assert.ok(compareFoundingClaim(early, late) < 0);
    assert.ok(compareFoundingClaim(late, early) > 0);
  });

  it("breaks a same-instant tie on the earlier signature", () => {
    const paidAt = at("2026-09-01T09:00:00Z");
    const signedFirst = { sponsorId: "a", paidAt, signedAt: at("2026-08-20T10:00:00Z") };
    const signedSecond = { sponsorId: "b", paidAt, signedAt: at("2026-08-25T10:00:00Z") };
    assert.ok(compareFoundingClaim(signedFirst, signedSecond) < 0);
    assert.equal(needsManualTieBreak(signedFirst, signedSecond), false);
  });

  it("asks for the founder when nothing separates two claims", () => {
    // The mechanics doc says Ethan assigns and records why. Inventing a winner
    // here would be a silent decision about who gets 01/25.
    const paidAt = at("2026-09-01T09:00:00Z");
    const signedAt = at("2026-08-20T10:00:00Z");
    const a = { sponsorId: "a", paidAt, signedAt };
    const b = { sponsorId: "b", paidAt, signedAt };
    assert.equal(compareFoundingClaim(a, b), 0);
    assert.equal(needsManualTieBreak(a, b), true);
  });

  it("puts a known signature date ahead of an unknown one", () => {
    const paidAt = at("2026-09-01T09:00:00Z");
    const known = { sponsorId: "a", paidAt, signedAt: at("2026-08-20T10:00:00Z") };
    const unknown = { sponsorId: "b", paidAt, signedAt: null };
    assert.ok(compareFoundingClaim(known, unknown) < 0);
  });
});

describe("who may hold a number", () => {
  it("refuses before the payment clears", () => {
    // Not at signature, not on invoice, not on a verbal yes.
    assert.match(
      String(
        foundingNumberRefusal({ paidAt: null, existingNumber: null, venuePlan: "founding" }),
      ),
      /payment has not cleared/,
    );
  });

  it("refuses a venue that is not on the founding plan", () => {
    assert.match(
      String(
        foundingNumberRefusal({ paidAt: 1, existingNumber: null, venuePlan: "paid" }),
      ),
      /only founding venues/,
    );
    assert.match(
      String(
        foundingNumberRefusal({ paidAt: 1, existingNumber: null, venuePlan: "pilot" }),
      ),
      /only founding venues/,
    );
  });

  it("refuses a second number to a venue that already holds one", () => {
    assert.match(
      String(foundingNumberRefusal({ paidAt: 1, existingNumber: 7, venuePlan: "founding" })),
      /already holds 07\/25/,
    );
  });

  it("allows a paid founding venue with no number", () => {
    assert.equal(
      foundingNumberRefusal({ paidAt: 1, existingNumber: null, venuePlan: "founding" }),
      null,
    );
  });
});
