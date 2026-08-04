import test from "node:test";
import assert from "node:assert/strict";
import {
  buildVenueSalesDeck,
  EMPTY_DECK_SLOT,
  UNFILLED_VENUE_LABEL,
  VENUE_SALES_DECK_ASK,
  venueSalesDeckProse,
} from "./venue-sales-deck";
import { sweepVenueCopy } from "./venue-copy-refusals";

const FILLED = { venueName: "Glenmara House" };

const filledProse = () => venueSalesDeckProse(buildVenueSalesDeck(FILLED));
const emptyProse = () => venueSalesDeckProse(buildVenueSalesDeck(EMPTY_DECK_SLOT));
const filledText = () => filledProse().join("\n");

/* ── The sweep, run against the filled deck and the unfilled one ───────── */

test("no prohibited claim, banned term or banned punctuation reaches the deck", () => {
  const found = sweepVenueCopy(filledProse());
  assert.deepEqual(
    found,
    [],
    found.map((f) => `${f.rule}: ${f.line}`).join("\n"),
  );
});

test("an unfilled deck is swept too, so a placeholder cannot smuggle a claim", () => {
  const found = sweepVenueCopy(emptyProse());
  assert.deepEqual(
    found,
    [],
    found.map((f) => `${f.rule}: ${f.line}`).join("\n"),
  );
});

/* ── Structure ─────────────────────────────────────────────────────────── */

test("every slide is numbered in order and carries a source", () => {
  const deck = buildVenueSalesDeck(FILLED);
  deck.slides.forEach((slide, i) => {
    assert.equal(slide.number, String(i + 1).padStart(2, "0"), slide.id);
    assert.ok(slide.sources.length > 0, `${slide.id} traces to nothing`);
    assert.ok(slide.headline.length > 0, `${slide.id} has no headline`);
  });
});

test("slide ids are unique", () => {
  const ids = buildVenueSalesDeck(FILLED).slides.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
});

/* ── The ladder: trust before price (E09.10 section 3.1) ───────────────── */

test("price arrives after the privacy boundary and after the couple's term", () => {
  const ids = buildVenueSalesDeck(FILLED).slides.map((s) => s.id);
  const price = ids.indexOf("the-price");
  assert.ok(price > ids.indexOf("what-you-never-see"), "price before the boundary");
  assert.ok(price > ids.indexOf("how-long"), "price before the term");
  assert.ok(price > ids.indexOf("at-launch"), "price before the launch scope");
});

test("the negative half travels with the positive half, in adjacent slides", () => {
  const ids = buildVenueSalesDeck(FILLED).slides.map((s) => s.id);
  const see = ids.indexOf("what-you-see");
  assert.equal(ids.indexOf("what-you-never-see"), see + 1);
  assert.equal(ids.indexOf("at-launch"), see + 2);
});

/* ── The required sentences ────────────────────────────────────────────── */

test("the launch-scope sentence appears verbatim (D-032 R4)", () => {
  assert.ok(
    filledText().includes(
      "At launch you see your invitations and who opened them. Adoption figures follow later in the year.",
    ),
  );
});

test("the survival sentence is stated unprompted (D-020.2)", () => {
  assert.match(
    filledText(),
    /Any workspace a couple has already opened keeps its full term/,
  );
});

test("every price statement carries the VAT wording (D-021, P12)", () => {
  const priced = filledProse().filter((line) => /€1,000|€1,500/.test(line));
  assert.ok(priced.length >= 2, "the deck states both rates");
  for (const line of priced) {
    const carriesVat = /including VAT at the prevailing rate/.test(line);
    const isConditionOnly = /€500 a year less/.test(line);
    assert.ok(
      carriesVat || isConditionOnly,
      `a price travelled without its VAT wording: ${line}`,
    );
  }
});

test("the number is assigned on cleared payment, never on signature (D-009.6)", () => {
  const text = filledText();
  assert.match(text, /assigned when your payment clears/);
  assert.match(text, /assigned when your payment clears, not on signature/);
});

/* ── The honesty position (D-016) ──────────────────────────────────────── */

test("the Keepsake slide is marked not built, and states the future tense", () => {
  const slide = buildVenueSalesDeck(FILLED).slides.find(
    (s) => s.id === "after-the-wedding",
  );
  assert.ok(slide, "the Keepsake slide exists");
  assert.ok(slide.notBuilt, "the Keepsake slide must carry a not-built note");
  assert.match(slide.notBuilt, /not built/i);
});

test("the deck carries an explicit what-is-not-built-yet slide", () => {
  const slide = buildVenueSalesDeck(FILLED).slides.find(
    (s) => s.id === "what-is-not-built-yet",
  );
  assert.ok(slide, "D-016 requires it");
  const text = slide.body.join(" ");
  assert.match(text, /Keepsake is decided and not built/);
  assert.match(text, /Adoption figures are not built/);
  assert.match(text, /no venue login/i);
});

test("no slide claims a capability in the present tense that is not built", () => {
  const text = filledText();
  assert.doesNotMatch(text, /you can export .*in one click/i);
  assert.doesNotMatch(text, /read-only mode is available/i);
  assert.doesNotMatch(text, /log in to your (?:venue )?(?:portal|account)/i);
});

/* ── One ask, and it is the walkthrough (E09.11 section 8) ─────────────── */

test("the deck ends on one ask and the ask is the walkthrough", () => {
  const deck = buildVenueSalesDeck(FILLED);
  const last = deck.slides[deck.slides.length - 1];
  assert.equal(last.id, "the-ask");
  assert.equal(last.headline, VENUE_SALES_DECK_ASK);
  assert.equal(VENUE_SALES_DECK_ASK, "See it, on your own screen.");
});

test("the deck does not also ask for a signature or an order form", () => {
  const text = filledText();
  for (const banned of [
    "order form",
    "sign here",
    "book a demo",
    "get started",
    "claim your place",
  ]) {
    assert.ok(!text.toLowerCase().includes(banned), `second ask: ${banned}`);
  }
});

/* ── The four product names stay out of the offer (E09.11 section 3.2) ─── */

test("the deck names no product", () => {
  const text = filledText();
  for (const product of [
    "Signal Tasks",
    "Signal Timeline",
    "Signal Notes",
    "Signal Studio account",
  ]) {
    assert.ok(!text.includes(product), `${product} must not appear`);
  }
});

/* ── No entitlement number, in either direction (D-020, P5) ────────────── */

test("the deck states no numeric entitlement", () => {
  assert.doesNotMatch(
    filledText(),
    /\b\d+\s+(?:couples|workspaces|seats|licen[cs]es)\b/i,
  );
});

/* ── No scarcity figure printed (P13) ──────────────────────────────────── */

test("the deck prints no places-taken or places-left figure", () => {
  const text = filledText();
  assert.doesNotMatch(text, /\b\d+\s*(?:of|\/)\s*25\s+(?:taken|left|remaining)/i);
  assert.doesNotMatch(text, /\bplaces (?:left|remaining|gone)\b/i);
});

/* ── The slot ──────────────────────────────────────────────────────────── */

test("an unfilled deck says so rather than looking finished", () => {
  const deck = buildVenueSalesDeck(EMPTY_DECK_SLOT);
  assert.equal(deck.filled, false);
  assert.equal(deck.venueName, UNFILLED_VENUE_LABEL);
  assert.ok(venueSalesDeckProse(deck).join("\n").includes(UNFILLED_VENUE_LABEL));
});

test("a filled deck names the venue exactly once", () => {
  const occurrences = filledProse().filter((line) =>
    line.includes("Glenmara House"),
  );
  assert.equal(occurrences.length, 1, "the venue name is on the cover and nowhere else");
});

test("whitespace is not a venue name", () => {
  const deck = buildVenueSalesDeck({ venueName: "   " });
  assert.equal(deck.filled, false);
});
