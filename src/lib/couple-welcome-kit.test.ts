import test from "node:test";
import assert from "node:assert/strict";
import {
  buildWelcomeCard,
  buildWelcomeEmail,
  coupleFacingProse,
  coupleWelcomeKitVenueProse,
  EMPTY_COUPLE_WELCOME_SLOTS,
  ONBOARDING_STEPS,
  REDEEM_ORIGIN,
  welcomeCardProse,
  welcomeEmailProse,
  welcomeSlotsState,
  type CoupleWelcomeSlots,
} from "./couple-welcome-kit";
import { sweepVenueCopy } from "./venue-copy-refusals";

const FILLED: CoupleWelcomeSlots = {
  venueName: "Glenmara House",
  coupleGreeting: "Mara and Finn",
  code: "GLEN-4K2P-9XQD",
  senderName: "Aoife",
};

const coupleText = (slots = FILLED) => coupleFacingProse(slots).join("\n");

/* ── The sweep, filled and unfilled ────────────────────────────────────── */

test("no prohibited claim, banned term or banned punctuation reaches the couple", () => {
  const found = sweepVenueCopy(coupleFacingProse(FILLED));
  assert.deepEqual(
    found,
    [],
    found.map((f) => `${f.rule}: ${f.line}`).join("\n"),
  );
});

test("an unfilled kit is swept too", () => {
  const found = sweepVenueCopy(coupleFacingProse(EMPTY_COUPLE_WELCOME_SLOTS));
  assert.deepEqual(
    found,
    [],
    found.map((f) => `${f.rule}: ${f.line}`).join("\n"),
  );
});

test("the venue-facing half of the kit is swept as well", () => {
  const found = sweepVenueCopy(coupleWelcomeKitVenueProse(FILLED));
  assert.deepEqual(
    found,
    [],
    found.map((f) => `${f.rule}: ${f.line}`).join("\n"),
  );
});

/* ── D-001 · the couple never sees a price ─────────────────────────────── */

test("no couple-facing string carries a figure, a currency or a value", () => {
  const text = coupleText();
  assert.doesNotMatch(text, /€|EUR\b|\beuro\b/i);
  assert.doesNotMatch(text, /\b\d+([.,]\d+)?\s*(?:per year|a year|annually)\b/i);
  for (const banned of [
    /\bfree\b/i,
    /\bcomplimentary\b/i,
    /\bworth\b/i,
    /\bnormally\b/i,
    /\bwe paid\b/i,
    /\bsponsored\b/i,
    /\bgift\b/i,
    /\bdiscount\b/i,
    /\bincluded in your package\b/i,
  ]) {
    assert.doesNotMatch(text, banned, "price language reached the couple");
  }
});

test("the only cost statement is that there is nothing to pay", () => {
  assert.match(coupleText(), /nothing to pay/);
});

/* ── D-027.3 · the venue name is the only venue thing, and it is once ──── */

test("the printed card names the venue exactly once", () => {
  const lines = welcomeCardProse(buildWelcomeCard(FILLED));
  const hits = lines.filter((line) => line.includes("Glenmara House"));
  assert.equal(hits.length, 1, `venue named ${hits.length} times: ${hits.join(" | ")}`);
  assert.equal(hits[0], "Compliments of Glenmara House");
});

test("the email names the venue exactly once, in the sign-off", () => {
  const email = buildWelcomeEmail(FILLED);
  const hits = welcomeEmailProse(email).filter((line) =>
    line.includes("Glenmara House"),
  );
  assert.equal(hits.length, 1);
  assert.equal(email.signOff, "Aoife, Glenmara House");
});

test("the attribution is the same four words the product shows on first open", () => {
  assert.equal(
    buildWelcomeCard(FILLED).attribution,
    "Compliments of Glenmara House",
  );
});

test("nothing carries a venue logo, colour, mark or venue-written message", () => {
  const text = coupleText();
  for (const banned of [/\blogo\b/i, /\bbranding\b/i, /\bcrest\b/i, /\bour colours\b/i]) {
    assert.doesNotMatch(text, banned);
  }
});

/* ── D-016 · nothing promised that is not built ────────────────────────── */

test("no couple-facing string promises a Keepsake, an export or a read-only mode", () => {
  const text = coupleText();
  assert.doesNotMatch(text, /\bkeepsake\b/i);
  assert.doesNotMatch(text, /one[- ]click/i);
  assert.doesNotMatch(text, /\bexport\b/i);
  assert.doesNotMatch(text, /\bdownload\b/i);
  assert.doesNotMatch(text, /\bread[- ]only\b/i);
  assert.doesNotMatch(text, /\barchive\b/i);
  assert.doesNotMatch(text, /\bbacked up\b/i);
});

test("the one after-the-wedding claim is the one that is true today", () => {
  const card = buildWelcomeCard(FILLED);
  assert.ok(card.body.includes("It does not switch off the day after the wedding."));
  // and it does not go on to say what happens next, because that is not built.
  assert.doesNotMatch(coupleText(), /after (?:the term|that) (?:ends|it)/i);
});

test("the sequence marks the after-the-wedding step not built", () => {
  const last = ONBOARDING_STEPS[ONBOARDING_STEPS.length - 1];
  assert.equal(last.title, "After the wedding");
  assert.equal(last.state, "not-built");
  assert.match(last.evidence, /keepsake/i);
});

test("the sequence marks issuing and evidence as administered by hand", () => {
  const manual = ONBOARDING_STEPS.filter((s) => s.state === "manual");
  assert.ok(manual.length >= 2, "R-043 means at least issuing and evidence are manual");
  assert.ok(manual.some((s) => /ask us for a code/i.test(s.title)));
  assert.match(
    ONBOARDING_STEPS.find((s) => s.order === 1)?.detail ?? "",
    /no login for your team/i,
  );
});

test("every onboarding step names an actor, a state and its evidence", () => {
  ONBOARDING_STEPS.forEach((step, i) => {
    assert.equal(step.order, i + 1);
    assert.ok(["venue", "couple", "signal-studio"].includes(step.actor));
    assert.ok(["built", "manual", "not-built"].includes(step.state));
    assert.ok(step.evidence.length > 0, `${step.title} traces to nothing`);
  });
});

/* ── The privacy half travels with the offer ───────────────────────────── */

test("both the card and the email carry the privacy sentence", () => {
  assert.ok(
    buildWelcomeCard(FILLED).body.some((line) =>
      line.includes("We can see that you opened it. We cannot see what is in it."),
    ),
  );
  assert.ok(
    buildWelcomeEmail(FILLED).body.some((line) =>
      line.includes("We cannot see what is in it"),
    ),
  );
});

test("nothing suggests the venue can be shown the plan through a setting", () => {
  const text = coupleText();
  assert.doesNotMatch(text, /share (?:it )?with (?:us|the venue) (?:through|inside)/i);
  assert.doesNotMatch(text, /we can check/i);
  assert.match(
    coupleText(),
    /send it to us the same way you would send it to anyone else/,
  );
});

/* ── One ask, and the approved verb (E09.11 section 8) ─────────────────── */

test("the kit uses the redemption address and no other destination", () => {
  const text = coupleText();
  assert.match(text, new RegExp(REDEEM_ORIGIN.replace(/\./g, "\\.")));
  for (const banned of [
    /claim your seat/i,
    /activate your licen[cs]e/i,
    /redeem your code/i,
    /get started/i,
    /sign up free/i,
    /start your free trial/i,
  ]) {
    assert.doesNotMatch(text, banned);
  }
});

test("the email has one subject and it does not sell", () => {
  const email = buildWelcomeEmail(FILLED);
  assert.equal(email.subject, "Something to help you plan");
  assert.ok(email.subject.length <= 60);
});

test("the email carries no tracked link, image or button", () => {
  const text = welcomeEmailProse(buildWelcomeEmail(FILLED)).join("\n");
  assert.doesNotMatch(text, /utm_/i);
  assert.doesNotMatch(text, /<img|<a href/i);
  assert.doesNotMatch(text, /click here/i);
});

/* ── The editing rules a coordinator is given ──────────────────────────── */

test("the editing rules forbid adding a term, a value or a leaflet", () => {
  const rules = buildWelcomeEmail(FILLED).editingRules.join(" ");
  assert.match(rules, /Do not add how long they have it/);
  assert.match(rules, /what it is worth/);
  assert.match(rules, /Do not attach a leaflet or a screenshot/);
  assert.match(rules, /Say it in your own words\. Keep the facts\./);
});

/* ── Slots ─────────────────────────────────────────────────────────────── */

test("an unfilled kit says which slots are missing rather than looking finished", () => {
  const state = welcomeSlotsState(EMPTY_COUPLE_WELCOME_SLOTS);
  assert.equal(state.filled, false);
  assert.deepEqual(state.missing.sort(), [
    "code",
    "coupleGreeting",
    "senderName",
    "venueName",
  ]);
  assert.match(coupleText(EMPTY_COUPLE_WELCOME_SLOTS), /\[venue name\]/);
  assert.match(coupleText(EMPTY_COUPLE_WELCOME_SLOTS), /\[code\]/);
});

test("whitespace is not a filled slot", () => {
  const state = welcomeSlotsState({
    venueName: " ",
    coupleGreeting: " ",
    code: " ",
    senderName: " ",
  });
  assert.equal(state.filled, false);
  assert.equal(state.missing.length, 4);
});

test("a fully filled kit reports itself filled", () => {
  assert.equal(welcomeSlotsState(FILLED).filled, true);
});
