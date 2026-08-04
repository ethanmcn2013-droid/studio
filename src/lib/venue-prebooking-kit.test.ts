import test from "node:test";
import assert from "node:assert/strict";
import {
  KIT_CHANNELS,
  KIT_TEAM_NOTES,
  MARKETING_UNDERTAKING,
  PREBOOKING_AFTER_SENTENCE,
  PREBOOKING_CORE_SENTENCE,
  PREBOOKING_PRIVACY_SENTENCE,
  PROHIBITED_SHEET,
  venuePrebookingCoupleFacingProse,
  venuePrebookingKitProse,
  venuePrebookingProhibitionProse,
} from "./venue-prebooking-kit";
import { sweepVenueCopy, VENUE_COPY_REFUSALS } from "./venue-copy-refusals";

const kitText = () => venuePrebookingKitProse().join("\n");
const coupleText = () => venuePrebookingCoupleFacingProse().join("\n");

/* ── The sweep ─────────────────────────────────────────────────────────── */

test("no prohibited claim, banned term or banned punctuation reaches the kit", () => {
  const found = sweepVenueCopy(venuePrebookingKitProse());
  assert.deepEqual(
    found,
    [],
    found.map((f) => `${f.rule}: ${f.line}`).join("\n"),
  );
});

test("the never-lists still obey punctuation and the retired programme term", () => {
  // A never-list names banned language, so it uses it. What still binds it is
  // the rules that have no reason to appear in a prohibition: D-033's retired
  // term, and BRAND.md section 3 punctuation.
  const stillBinding = VENUE_COPY_REFUSALS.filter(([, rule]) =>
    ["banned-programme-term", "em-dash", "exclamation"].includes(rule),
  );
  for (const line of venuePrebookingProhibitionProse()) {
    for (const [pattern, rule] of stillBinding) {
      assert.doesNotMatch(line, pattern, `${rule} in: ${line}`);
    }
  }
});

/* ── The couple never sees a price (D-001) ─────────────────────────────── */

test("no couple-facing block carries a figure, a currency or a value word", () => {
  const text = coupleText();
  assert.doesNotMatch(text, /€|EUR\b|\beuro\b/i);
  for (const banned of [
    /\bfree\b/i,
    /\bcomplimentary\b/i,
    /\bworth\b/i,
    /\bnormally\b/i,
    /\bwe paid\b/i,
    /\bsponsored\b/i,
    /\bvalue of\b/i,
    /\bdiscount\b/i,
    /\bsaving\b/i,
  ]) {
    assert.doesNotMatch(text, banned, `price language in a couple-facing block`);
  }
});

test("the permitted price phrasing is at no cost, or part of booking with us", () => {
  assert.match(
    PREBOOKING_CORE_SENTENCE,
    /part of booking with us and there is nothing to pay for it/,
  );
  for (const channel of KIT_CHANNELS) {
    const text = channel.blocks.map((b) => b.text).join(" ");
    assert.match(
      text,
      /at no cost to you|costs you nothing|nothing to pay for it/,
      `${channel.id} does not say what it costs`,
    );
  }
});

/* ── The Keepsake is not promised as a working thing ───────────────────── */

test("no couple-facing block claims a one-click export or a read-only mode", () => {
  const text = coupleText();
  assert.doesNotMatch(text, /one[- ]click/i);
  assert.doesNotMatch(text, /\bexport\b/i);
  assert.doesNotMatch(text, /\bdownload\b/i);
  assert.doesNotMatch(text, /\bread[- ]only\b/i);
  assert.doesNotMatch(text, /\bkeepsake\b/i);
  assert.doesNotMatch(text, /\barchive\b/i);
});

test("the one permitted after-the-wedding sentence is true today", () => {
  assert.equal(
    PREBOOKING_AFTER_SENTENCE,
    "It does not switch off the day after the wedding. You keep it for at least three months past the day.",
  );
  // It states a floor the shipped term already meets (D-010.2, D-022) and
  // makes no claim about what happens at the end of the term.
  assert.doesNotMatch(PREBOOKING_AFTER_SENTENCE, /after (?:that|the term)/i);
});

/* ── The privacy sentence travels with every offer block ───────────────── */

test("the privacy sentence is in the short and full block of every channel", () => {
  for (const channel of KIT_CHANNELS) {
    for (const block of channel.blocks) {
      if (block.length === "one-line") continue;
      assert.match(
        block.text,
        /cannot see (?:what is in it|inside it)/,
        `${channel.id} ${block.length} drops the privacy half`,
      );
    }
  }
});

test("the canonical privacy sentence is the copy pack's, unchanged", () => {
  assert.equal(
    PREBOOKING_PRIVACY_SENTENCE,
    "We can see that you opened it. We cannot see what is in it.",
  );
});

/* ── No fourth visible thing, and no venue view of the plan (D-001.4) ──── */

test("no block says or implies a venue can see, receive or check a plan", () => {
  const text = kitText();
  for (const banned of [
    /we can see your plan/i,
    /we get a copy/i,
    /feeds through to us/i,
    /check on your progress/i,
    /shared with (?:us|your venue)/i,
    /venue dashboard/i,
  ]) {
    assert.doesNotMatch(text, banned);
  }
});

/* ── Branding is the name only (D-027.3) ───────────────────────────────── */

test("nothing implies a venue logo, colour or venue-written words reach a couple", () => {
  const text = kitText();
  assert.doesNotMatch(text, /your (?:logo|mark|colours?|branding) (?:appears|is shown)/i);
  assert.match(
    KIT_TEAM_NOTES.join(" "),
    /Not a logo, not a colour, and not a message you write/,
  );
});

/* ── The launch-scope sentence, verbatim (D-032 R4) ────────────────────── */

test("the team notes carry the launch-scope sentence unaltered", () => {
  assert.ok(
    KIT_TEAM_NOTES.includes(
      "At launch you see your invitations and who opened them. Adoption figures follow later in the year.",
    ),
  );
});

/* ── Structure ─────────────────────────────────────────────────────────── */

test("every channel names its moment, its rule, three lengths and a never-list", () => {
  assert.ok(KIT_CHANNELS.length >= 5, "brochure, website, proposal, conversation, fair");
  for (const channel of KIT_CHANNELS) {
    assert.ok(channel.moment.length > 0, `${channel.id} moment`);
    assert.ok(channel.rule.length > 0, `${channel.id} rule`);
    assert.deepEqual(
      channel.blocks.map((b) => b.length),
      ["one-line", "short", "full"],
      `${channel.id} lengths`,
    );
    assert.ok(channel.neverHere.length >= 3, `${channel.id} never-list`);
  }
});

test("channel ids are unique and cover the four named surfaces", () => {
  const ids = KIT_CHANNELS.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const required of ["brochure", "website", "proposal", "show-around"]) {
    assert.ok(ids.includes(required), `missing channel: ${required}`);
  }
});

test("the one-line form of every channel is one sentence a person can say", () => {
  for (const channel of KIT_CHANNELS) {
    const oneLine = channel.blocks.find((b) => b.length === "one-line");
    assert.ok(oneLine);
    assert.ok(oneLine.text.length <= 130, `${channel.id} one-liner is too long`);
  }
});

/* ── One ban list, not two ─────────────────────────────────────────────── */

test("the kit points at the prohibited sheet rather than reprinting it", () => {
  assert.equal(PROHIBITED_SHEET.source, "E09.11-venue-copy-pack.md section 4");
  assert.match(PROHIBITED_SHEET.machineSource, /prohibited-claims\.v1\.json$/);
  assert.match(PROHIBITED_SHEET.note, /not reprinted here/);
});

test("the marketing undertaking states a correction period rather than a promise", () => {
  const text = MARKETING_UNDERTAKING.join(" ");
  assert.match(text, /within ten working days/);
  assert.match(text, /prohibited sheet/);
});
