import { randomInt } from "node:crypto";

/**
 * The couple invitation code, in one place.
 *
 * E08.06. A venue hands a couple a code. The couple types it into
 * `/redeem/<code>` and receives a sponsored wedding workspace. That code is a
 * bearer credential worth a paid tier, and until this module existed it was
 * generated in three different places at three different strengths:
 *
 *   - `scripts/issue-codes.ts` — `<venue-slug>-XXXXX`, five characters.
 *     **This is the one couples actually redeem.** The script's own comment
 *     calls the Tasks row "runtime redemption" and the studio row "sponsor
 *     audit".
 *   - `src/app/hq/entitlements/actions.ts` — `SIG-XXXX-XXXX`, eight characters.
 *   - `app/src/server/actions/comp.ts` — a prefix plus seven hex characters
 *     taken off a UUID, which is 28 bits.
 *
 * The arithmetic that made this a defect rather than a preference, stated
 * rather than asserted:
 *
 *   - The alphabet below has 31 symbols, so each character carries
 *     log2(31) = 4.954 bits.
 *   - Five characters is 31^5 = 28,629,151 ≈ 2^24.8.
 *   - The prefix is the venue's own slug. A Founding 25 venue is named in
 *     public, on the map and in the film, so the prefix is not a secret and
 *     contributes nothing.
 *   - A venue issuing 40 codes has 40 live targets in that keyspace, so the
 *     expected number of guesses to hit *any* of them is 28,629,151 / 40 ≈
 *     716,000. At 50 requests a second that is about four hours.
 *
 * Four hours of ordinary HTTP traffic against a public route is not a
 * theoretical exposure. What a successful guess buys is also worse than a free
 * tier: the redeeming account is bound to a named venue's sponsorship, consumes
 * a code that a real couple was given, and appears in that venue's adoption
 * evidence.
 *
 * `CODE_BODY_LENGTH` below is set to 10, which is 31^10 = 819,628,286,980,801
 * ≈ 2^49.5. Against the same 40 live codes that is 2×10^13 expected guesses; at
 * the same 50 requests a second, roughly thirteen thousand years. Entropy is
 * therefore the control that holds, which is deliberate, because the rate
 * limiter that would otherwise carry the load fails open until Upstash is
 * provisioned (`app/src/lib/ratelimit.ts`, still on the HQ operator ledger).
 *
 * What this module does NOT do, recorded here so nobody assumes otherwise:
 * it does not lock a code to a recipient, and it does not make a code
 * revocable on the redemption path couples use. Both are real gaps and both
 * are founder questions rather than silent choices. See the E08.06 evidence.
 */

/**
 * Thirty-one symbols. No 0/O, no 1/I/L — a code is read aloud off a card and
 * typed by someone who has never seen it written down. Do not widen this to
 * gain entropy; lengthen the body instead, so a code stays dictatable.
 */
export const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/**
 * Characters of randomness in a code body. Ten, in two blocks of five, so it
 * still reads as two chunks over the phone.
 *
 * Changing this number changes the guessing surface. If it is ever lowered,
 * `invitation-code.test.ts` fails on the stated entropy floor rather than
 * quietly accepting a weaker code.
 */
export const CODE_BODY_LENGTH = 10;

/** Blocks the body is split into for readability. Cosmetic only. */
const BLOCK_LENGTH = 5;

/**
 * Minimum entropy any newly minted code must carry, in bits. This is the
 * number the acceptance criteria are written against; the test asserts the
 * generator meets it rather than trusting the constants above to stay put.
 */
export const MINIMUM_CODE_ENTROPY_BITS = 48;

/** Entropy of a freshly minted code body, in bits. Prefix contributes none. */
export function codeEntropyBits(
  bodyLength: number = CODE_BODY_LENGTH,
): number {
  return bodyLength * Math.log2(CODE_ALPHABET.length);
}

/**
 * One uniformly random character.
 *
 * `randomInt` is used rather than `randomBytes(n)[i] % 31`, which is what the
 * three previous generators did. 256 is not a multiple of 31 — it is 8×31 + 8 —
 * so the first eight letters of the alphabet came up about 12.5% more often
 * than the rest. `randomInt` rejects out-of-range draws instead, so every
 * symbol is equally likely and the stated entropy is the real entropy.
 */
function randomCharacter(): string {
  return CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
}

/**
 * Normalise a venue slug into a code prefix: uppercase, alphanumeric only,
 * capped at eight characters. The prefix exists so a venue can recognise its
 * own codes on a spreadsheet. It is public and carries no security weight.
 */
export function codePrefix(slug: string): string {
  const cleaned = slug.replace(/[^a-z0-9]/gi, "").slice(0, 8).toUpperCase();
  return cleaned.length > 0 ? cleaned : "SIG";
}

/**
 * Mint one invitation code: `<PREFIX>-XXXXX-XXXXX`.
 *
 * The prefix is not random and is not counted as entropy anywhere.
 */
export function generateInvitationCode(rawPrefix: string): string {
  const body = Array.from({ length: CODE_BODY_LENGTH }, randomCharacter).join("");
  const blocks: string[] = [];
  for (let at = 0; at < body.length; at += BLOCK_LENGTH) {
    blocks.push(body.slice(at, at + BLOCK_LENGTH));
  }
  return [codePrefix(rawPrefix), ...blocks].join("-");
}

/**
 * True when `value` is a code THIS module would mint today.
 *
 * Deliberately not used to gate redemption. Codes issued before this module
 * existed are five characters long and are still in circulation; refusing them
 * would break a live couple's link to punish the system's own past. Redemption
 * accepts any string and looks it up. This predicate exists so the issuance
 * side, and the tests, can tell a current code from a legacy one.
 */
export function isCurrentInvitationCodeShape(value: string): boolean {
  const pattern = new RegExp(
    `^[A-Z0-9]{1,8}(-[${CODE_ALPHABET}]{${BLOCK_LENGTH}}){${
      CODE_BODY_LENGTH / BLOCK_LENGTH
    }}$`,
  );
  return pattern.test(value);
}
