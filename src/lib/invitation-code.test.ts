import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  CODE_ALPHABET,
  CODE_BODY_LENGTH,
  MINIMUM_CODE_ENTROPY_BITS,
  codeEntropyBits,
  codePrefix,
  generateInvitationCode,
  isCurrentInvitationCodeShape,
} from "./invitation-code";

/**
 * E08.06 — the couple invitation code is the credential a stranger would
 * guess. These tests are written so that weakening it fails the build rather
 * than passing review.
 */

describe("invitation code entropy", () => {
  it("carries at least the stated entropy floor, computed not asserted", () => {
    // 31 symbols, 10 characters. log2(31) = 4.954..., x10 = 49.54 bits.
    assert.equal(CODE_ALPHABET.length, 31);
    const bits = codeEntropyBits();
    assert.ok(
      bits >= MINIMUM_CODE_ENTROPY_BITS,
      `code entropy is ${bits.toFixed(2)} bits, floor is ${MINIMUM_CODE_ENTROPY_BITS}`,
    );
    // The keyspace, spelled out, so the number in the module doc is checkable.
    assert.equal(CODE_ALPHABET.length ** CODE_BODY_LENGTH, 819628286980801);
  });

  it("is a real improvement on the five-character generation it replaces", () => {
    // The generation that shipped: 31^5 = 28,629,151. Guarding the ratio
    // rather than the absolute number so this still means something if the
    // alphabet ever changes.
    const previous = CODE_ALPHABET.length ** 5;
    assert.equal(previous, 28629151);
    const current = CODE_ALPHABET.length ** CODE_BODY_LENGTH;
    assert.ok(current / previous > 28_000_000);
  });

  it("uses no ambiguous glyphs, because the code is read aloud", () => {
    for (const banned of ["0", "O", "1", "I", "L"]) {
      assert.ok(
        !CODE_ALPHABET.includes(banned),
        `${banned} is ambiguous when dictated`,
      );
    }
  });
});

describe("invitation code generation", () => {
  it("mints the documented shape", () => {
    const code = generateInvitationCode("lambs-hill-house");
    assert.ok(isCurrentInvitationCodeShape(code), code);
    assert.match(code, /^LAMBSHIL-[A-Z2-9]{5}-[A-Z2-9]{5}$/);
  });

  it("never emits a character outside the alphabet", () => {
    for (let i = 0; i < 500; i++) {
      const body = generateInvitationCode("x").split("-").slice(1).join("");
      for (const character of body) {
        assert.ok(CODE_ALPHABET.includes(character), `stray glyph ${character}`);
      }
    }
  });

  it("does not repeat across a large run", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 5000; i++) seen.add(generateInvitationCode("v"));
    assert.equal(seen.size, 5000);
  });

  it("draws uniformly, with no modulo bias toward the first eight letters", () => {
    // The generators this replaces did `randomBytes(n)[i] % 31`. 256 = 8*31 + 8,
    // so A-H were drawn 9/256 of the time against 8/256 for the rest: 12.5%
    // more often.
    //
    // The sample size and the bound are chosen so this test is decisive in both
    // directions rather than a coin flip. 620,000 draws puts 20,000 on each
    // symbol, with sd = sqrt(620000 * (1/31) * (30/31)) ≈ 140. The biased
    // generator's mean for A-H is 9/256 * 620000 ≈ 21,797. A bound of 4.5%
    // (20,900) sits ~6.4 sd above fair and ~6.4 sd below biased: a fair
    // generator effectively never trips it, and a biased one effectively always
    // does. Verified by running the old `% 31` draw against this bound.
    const draws = 620_000;
    const counts = new Map<string, number>();
    for (let i = 0; i < draws / CODE_BODY_LENGTH; i++) {
      for (const character of generateInvitationCode("v").split("-").slice(1).join("")) {
        counts.set(character, (counts.get(character) ?? 0) + 1);
      }
    }
    const expected = draws / CODE_ALPHABET.length;
    const biased = CODE_ALPHABET.slice(0, 8);
    for (const character of biased) {
      const seen = counts.get(character) ?? 0;
      assert.ok(
        seen < expected * 1.045,
        `${character} drawn ${seen} times against ${expected} expected — modulo bias is back`,
      );
    }
  });

  it("treats the prefix as public, never as entropy", () => {
    assert.equal(codePrefix("The Orchard"), "THEORCHA");
    assert.equal(codePrefix("!!!"), "SIG");
    // Same prefix, different bodies. The prefix is a label, not a secret.
    const a = generateInvitationCode("the-orchard");
    const b = generateInvitationCode("the-orchard");
    assert.equal(a.split("-")[0], b.split("-")[0]);
    assert.notEqual(a, b);
  });

  it("recognises a legacy five-character code as NOT current, without rejecting it", () => {
    // Codes already in a couple's hands stay valid. The predicate only tells
    // issuance and reporting which generation a code came from.
    assert.ok(!isCurrentInvitationCodeShape("LAMBSHIL-MP93X"));
    assert.ok(isCurrentInvitationCodeShape(generateInvitationCode("lambshill")));
  });
});

describe("source contract: one generator, no local re-implementations", () => {
  const issueCodes = readFileSync(
    new URL("../../scripts/issue-codes.ts", import.meta.url),
    "utf8",
  );
  const hqActions = readFileSync(
    new URL("../app/hq/entitlements/actions.ts", import.meta.url),
    "utf8",
  );

  it("the live couple-issuance script mints through this module", () => {
    assert.match(issueCodes, /generateInvitationCode/);
    // The old local generator and its biased draw must be gone, not unused.
    assert.doesNotMatch(issueCodes, /function generateCode\(/);
    assert.doesNotMatch(issueCodes, /% CODE_ALPHABET\.length/);
  });

  it("the HQ mint action mints through this module", () => {
    assert.match(hqActions, /generateInvitationCode/);
    assert.doesNotMatch(hqActions, /function genLicenseCode\(/);
  });
});
