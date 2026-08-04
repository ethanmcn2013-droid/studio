import assert from "node:assert/strict";
import { test } from "node:test";
import {
  EMPTY_VENUE_PROPOSAL_SLOTS,
  LAUNCH_SCOPE_SENTENCE,
  VENUE_PROPOSAL_SLOT_IDS,
  buildVenueProposal,
  venueProposalProse,
  type VenueProposalSlots,
} from "./venue-proposal";

const FILLED: VenueProposalSlots = {
  venueName: "Glenmara Estate",
  firstName: "Aoife",
  walkthroughDate: "3 August 2026",
  holdEndDate: "17 August 2026",
  paidCount: "Four",
  nextFreeNumber: "05/25",
};

const prose = () => venueProposalProse(buildVenueProposal(FILLED)).join("\n");

/* ── Slots ────────────────────────────────────────────────────────────── */

test("an empty proposal names every unfilled slot and refuses to be sendable", () => {
  const proposal = buildVenueProposal(EMPTY_VENUE_PROPOSAL_SLOTS);
  assert.equal(proposal.sendable, false);
  assert.deepEqual(proposal.unfilledSlots, [...VENUE_PROPOSAL_SLOT_IDS]);
});

test("a fully filled proposal is sendable and leaves no slot marker behind", () => {
  const proposal = buildVenueProposal(FILLED);
  assert.equal(proposal.sendable, true);
  assert.deepEqual(proposal.unfilledSlots, []);
  assert.doesNotMatch(prose(), /\{\w+\}|\[venueName\]|\[firstName\]/);
});

test("whitespace is not a filled slot", () => {
  const proposal = buildVenueProposal({ ...FILLED, holdEndDate: "   " });
  assert.equal(proposal.sendable, false);
  assert.deepEqual(proposal.unfilledSlots, ["holdEndDate"]);
});

test("the venue name reaches every place it belongs and no other name appears", () => {
  const text = prose();
  assert.match(text, /Venue Edition for Glenmara Estate/);
  assert.match(text, /Glenmara Estate is named on it, quietly, in one line/);
  assert.match(text, /Prepared for Aoife, 3 August 2026\./);
});

/* ── The ratified commercial position ─────────────────────────────────── */

test("both prices appear and both are stated inclusive of VAT (D-021)", () => {
  const text = prose();
  assert.match(text, /€1,000 a year, prepaid, including VAT at the prevailing rate\./);
  assert.match(text, /The standard rate is €1,500\./);
  assert.match(text, /€500 a year less, for as long as you stay/);
});

test("the founding lock is conditional on continuous renewal (D-009.3)", () => {
  assert.match(
    prose(),
    /holds for as long as it renews continuously without lapse/,
  );
});

test("the number is assigned on cleared payment, and the hold is stated once (D-009.6, D-009.7)", () => {
  const text = prose();
  assert.match(text, /01\/25 through 25\/25, assigned when your payment clears/);
  assert.match(text, /Held until 17 August 2026\./);
  assert.match(text, /Numbers follow cleared payment/);
});

test("the couple term always carries the grace rule (D-010.2, D-022)", () => {
  const text = prose();
  assert.match(
    text,
    /18 months from when they open it, or 3 months past the wedding, whichever is later/,
  );
  // Never a bare term: every "18 months" in the copy is followed by the rule.
  for (const line of venueProposalProse(buildVenueProposal(FILLED))) {
    if (/\b(?:18|eighteen)[- ]months?\b/i.test(line)) {
      assert.match(line, /whichever is later/, `bare term in: ${line}`);
    }
  }
});

test("the survival sentence is stated unprompted (D-020.2)", () => {
  assert.match(
    prose(),
    /keeps its full term whatever happens to your agreement\. Only new invitations stop\./,
  );
});

test("the launch-scope sentence is carried verbatim (D-032 R4)", () => {
  assert.ok(
    venueProposalProse(buildVenueProposal(FILLED)).includes(
      LAUNCH_SCOPE_SENTENCE,
    ),
    "the launch-scope sentence must appear as its own paragraph, unaltered",
  );
  assert.equal(
    LAUNCH_SCOPE_SENTENCE,
    "At launch you see your invitations and who opened them. Adoption figures follow later in the year.",
  );
});

test("the negative half travels with the positive half, in the same block", () => {
  const proposal = buildVenueProposal(FILLED);
  const ids = proposal.blocks.map((block) => block.id);
  const see = ids.indexOf("what-you-see");
  const never = ids.indexOf("what-you-never-see");
  const launch = ids.indexOf("at-launch");
  assert.ok(see >= 0 && never === see + 1 && launch === never + 1);
});

/* ── The refusal sets ─────────────────────────────────────────────────── */

const REFUSED: Array<[RegExp, string]> = [
  [/\bfor life\b/i, "P1 permanence"],
  [/\bforever\b/i, "P1 permanence"],
  [/\blifetime\b/i, "P1 permanence"],
  [/\bin perpetuity\b/i, "P1 permanence"],
  [/\bperpetual\b/i, "P1 permanence"],
  [/\bnever expires?\b/i, "P1 permanence"],
  [/\bguaranteed\b/i, "P1 permanence"],
  [/\bsolicitor\b/i, "P2 · D-016"],
  [/\baccountant\b/i, "P2 · D-016"],
  [/\blegally (?:approved|reviewed)\b/i, "P2 · D-016"],
  [/\bGDPR\b/i, "P3"],
  [/\bfully compliant\b/i, "P3"],
  [/\bbank[- ]grade\b/i, "P3"],
  [/\ballotment\b/i, "P5"],
  [/\bseat count\b/i, "P5"],
  [/\bper[- ]seat\b/i, "P5"],
  [/\bno seats\b/i, "P6"],
  [/\bdietary\b/i, "P8"],
  [/\ballerg/i, "P8"],
  [/\+\s*VAT\b/i, "P12"],
  [/\bex(?:cl)?\.?\s*VAT\b/i, "P12"],
  [/\bact now\b/i, "P13 urgency"],
  [/\blimited time\b/i, "P13 urgency"],
  [/\bwhile places last\b/i, "P13 urgency"],
  [/\bonly \d+ places? left\b/i, "P13 urgency"],
  [/\bco[- ]branded\b/i, "D-027.3"],
  [/\byour logo\b/i, "D-027.3"],
  [/\bwelcome message\b/i, "D-027.3"],
  [/\bcouple separately consents\b/i, "D-001.4"],
  [/\bseamless(?:ly)?\b/i, "SaaS fluff"],
  [/\beffortless(?:ly)?\b/i, "SaaS fluff"],
  [/\bwhite[- ]label\b/i, "SaaS fluff"],
  [/\bpartner\b/i, "banned programme term"],
  [/\binvestor\b/i, "banned programme term"],
  [/\bexclusive\b/i, "banned programme term"],
  [/\bcertified\b/i, "banned programme term"],
  [/—/, "em dash, BRAND.md §3"],
  [/!/, "exclamation mark, BRAND.md §3"],
];

test("no prohibited claim, banned term or banned punctuation reaches the page", () => {
  const lines = venueProposalProse(buildVenueProposal(FILLED));
  for (const [pattern, rule] of REFUSED) {
    for (const line of lines) {
      assert.doesNotMatch(line, pattern, `${rule} matched in: ${line}`);
    }
  }
});

test("an unfilled proposal is still swept, so a placeholder cannot smuggle a claim", () => {
  const lines = venueProposalProse(
    buildVenueProposal(EMPTY_VENUE_PROPOSAL_SLOTS),
  );
  for (const [pattern, rule] of REFUSED) {
    for (const line of lines) {
      assert.doesNotMatch(line, pattern, `${rule} matched in: ${line}`);
    }
  }
});

test("the proposal names no product and carries exactly one ask (E11.11 §2.2)", () => {
  const text = prose();
  for (const product of [
    "Signal Tasks",
    "Signal Timeline",
    "Signal Notes",
    "Signal Studio account",
  ]) {
    assert.ok(!text.includes(product), `${product} must not appear`);
  }
  assert.match(text, /Complete the order form and send it back\./);
  assert.equal(
    (text.match(/order form/gi) ?? []).length,
    1,
    "one ask, stated once",
  );
});

test("the proposal never states a numeric entitlement (D-020, P5)", () => {
  const text = prose();
  assert.doesNotMatch(text, /\b\d+\s+(?:couples|workspaces|seats|licen[cs]es)\b/i);
  assert.match(text, /Every couple who books their wedding with you/);
});

test("the per-wedding arithmetic keeps its scale-only qualifier (E09.11 §4.3)", () => {
  const text = prose();
  assert.match(text, /For scale only: across 20 weddings a year that is €50 a wedding/);
  assert.match(text, /The price does not change with the number of weddings you run/);
});
