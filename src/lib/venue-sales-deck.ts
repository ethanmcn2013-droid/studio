/**
 * E12.10 — the detailed Venue Edition sales deck, as data.
 *
 * THIS FILE HOLDS NO SECOND COPY OF ANY RATIFIED SENTENCE. Every price, term,
 * promise and refusal is imported from `src/lib/venue-invitation/copy.ts`,
 * which is the ratified copy module. Where a slide needs a sentence that copy
 * module does not have, the sentence is written here once and named in the
 * source table in `evidence/E12.10-E12.13-venue-artefacts.md`.
 *
 * A second copy of a price is how two prices happen (E09.11 section 4). The
 * July 2026 venue deck at `public/brand/collateral/venue/venue-deck-screen.pdf`
 * is the proof: it carries EUR 1,500 as the founding price, the retired
 * programme term, and a pilot ask that the ratified offer does not contain.
 * It was correct when it was made and it is wrong now, because it was words in
 * a PDF rather than a render of the source.
 *
 * ── What this deck is ────────────────────────────────────────────────────
 * The seated conversation backbone. It is shown on a screen, in a room, with
 * the founder present. It is not sent unaccompanied: the artefact a venue is
 * sent is the one-page proposal (E12.09), which carries the commercial terms
 * with their conditions attached.
 *
 * It ends on one ask and the ask is the walkthrough, not the order form
 * (E09.11 section 8). The deck frames the demonstration; the proposal follows
 * the demonstration. A deck that asks for a signature is asking before the
 * venue has seen the thing.
 *
 * ── The ladder it runs ───────────────────────────────────────────────────
 * E09.10 section 3.1: trust before price. Slides 02 to 11 are the product and
 * the boundary. Price arrives at slide 12, after a venue knows what it never
 * sees and how long a couple has the thing. The ordering is enforced by test,
 * not left to the author.
 *
 * ── What ratified each fact ──────────────────────────────────────────────
 *   EUR 1,000 founding, EUR 1,500 standard, both prepaid annually    D-009.1
 *   "EUR 500 a year less, for as long as you stay"                   D-009.2
 *   The lock holds on continuous renewal without lapse               D-009.3
 *   The rate follows the property, not the company                   D-009.4
 *   One 30-minute call a year plus a named email route               D-009.5
 *   "Founding 25"; the number is assigned on cleared payment         D-009.6
 *   Places held 14 days                                             D-009.7
 *   Every booked couple, no number in the commercial terms            D-020
 *   Redeemed workspaces survive the agreement ending                D-020.2
 *   The release rule when a couple cancels or moves venue           D-020.3
 *   18 months from opening or 3 months past the wedding, later  D-010.2 D-022
 *   Keepsake, read-only, one-click export, while the service runs    D-010.3
 *   Both prices are inclusive of VAT at the prevailing rate            D-021
 *   Branding is the venue's name only                                D-027.3
 *   Launch scope is invitation administration only                   D-027.4
 *   The launch-scope sentence is required in writing                  D-032 R4
 *   The programme term is Founding 25, a venue in it is a founding venue D-033
 *
 * ── The honesty slide is not optional ────────────────────────────────────
 * Slide 18 states what is not built. D-016 requires that any capability not
 * yet built is stated as not yet built, and the Keepsake is the one that
 * matters: there is no Keepsake mode, state, route or component in `app/src`.
 * (The two `keepsake` hits there are code comments in the Timeline print
 * renderer using the ordinary English word. Recorded in the verification run,
 * because the first grep I ran returned nothing and was wrong.)
 *
 * A deck that shows a venue a finished product and lets it infer a finished Keepsake has made a
 * promise the product cannot keep, and the venue repeats it to a couple, which
 * is R-020 arriving through our own deck.
 *
 * Pure and client-safe. No server-only import.
 */

import {
  COMMERCIAL_SUMMARY_ROWS,
  COUPLE_TERM_SENTENCE,
  ENTITLEMENT_SENTENCE,
  FOUNDING_MEANING,
  OFFER_PARAGRAPH,
  PRICE_FORMS,
  PRIVACY_BLOCK,
  SCALE_SENTENCE,
  STANDARD_RATE_SENTENCE,
  SURVIVAL_SENTENCE,
  TEAM_ASK_SENTENCE,
  VENUE_CONTACT_EMAIL,
} from "./venue-invitation/copy";

/* ── The one slot ───────────────────────────────────────────────────────── */

/**
 * The deck takes exactly one slot, and it is the venue's trading name.
 *
 * One slot rather than the proposal's six, deliberately. The deck is shown in
 * the room, so the paid count and the next free number are spoken from the
 * register at that moment and never printed, because a printed count is a
 * scarcity claim that goes stale between the render and the meeting
 * (`FOUNDING_25_PROGRAMME_MECHANICS.md` section 1, P13).
 */
export type VenueSalesDeckSlot = { venueName: string };

export const EMPTY_DECK_SLOT: VenueSalesDeckSlot = { venueName: "" };

/** What the cover shows when no venue name has been supplied. */
export const UNFILLED_VENUE_LABEL = "[venue name]";

/* ── Slide shape ────────────────────────────────────────────────────────── */

export type SlideKind =
  /** A statement the venue reads. Body lines are paragraphs. */
  | "statement"
  /** A positive list and its negative half, which travel together. */
  | "paired"
  /** A two-column reference table. */
  | "table"
  /** The cover. */
  | "cover"
  /** The single ask. */
  | "ask";

export type Slide = {
  /** Stable id. Used by the test suite and by the print anchor. */
  id: string;
  /** `01` through `20`, zero padded, shown in the corner. */
  number: string;
  kind: SlideKind;
  /** Mono eyebrow. Sentence case, never a heading in disguise. */
  kicker: string;
  /** The one idea on the slide. */
  headline: string;
  /** Paragraphs. Every one is prose a venue reads, and every one is swept. */
  body: string[];
  /** Two-column rows, `table` slides only. Both cells are swept. */
  rows?: ReadonlyArray<readonly [string, string]>;
  /** The decisions this slide's content traces to. Never empty. */
  sources: string[];
  /**
   * Set when the slide describes something that does not exist in the product
   * today. The renderer is required to show it, and the test asserts that the
   * Keepsake slide carries one.
   */
  notBuilt?: string;
};

export type VenueSalesDeck = {
  venueName: string;
  filled: boolean;
  slides: Slide[];
};

/* ── Sentences written here, because no ratified module holds them ──────── */

/**
 * The couple-side slide. It describes outcomes and names no product, because
 * E09.11 section 3.2 holds that a venue owner is buying an outcome for their
 * couples and the four product names arrive in onboarding when they are
 * useful. The deck is a sales conversation, so the rule binds it.
 */
const COUPLE_SIDE_LINES = [
  "They open a link and the workspace is already there. No trial, no card, nothing to choose.",
  "Somewhere to write the thing they just thought of. The work laid out so nothing sits in one person's head. A plan they can send to family and suppliers. A short note in the morning when something needs attention.",
  "Your name is on it, in one line, and that is the whole of it.",
];

/**
 * D-027 point 3, stated positively so a venue does not have to infer the
 * absence. R-024's register is the source of the four moments; this is the
 * one-slide form of `src/app/venues/couple-preview/page.tsx`.
 */
const BRANDING_LINES = [
  "Your name, in one quiet line, in four places on the couple's side.",
  "Not a logo, not a colour, not a typeface of yours, and not a message you write. The name is the whole of the branding, and that is a decision rather than a gap.",
];

/** D-009 point 4, in the words the commercial summary already uses. */
const CHANGE_OF_CONTROL_LINES = [
  PRICE_FORMS.property,
  "If a renewal is missed, the founding rate does not come back and the standard rate applies.",
];

/** D-020 point 3, the release rule, stated before it is asked about. */
const RELEASE_LINES = [
  "You release the workspace. The couple keeps everything they wrote. Your name comes off it within 24 hours.",
  "Nothing is deleted on your say-so, because it was never yours to delete.",
];

/**
 * The honesty slide. D-016, and the sentence that makes the rest of the deck
 * credible rather than merely careful.
 *
 * Each line is a verified absence, not a hedge. The verification is recorded
 * claim by claim in `evidence/E12.10-E12.13-venue-artefacts.md` section 4.
 */
const NOT_BUILT_LINES = [
  "The Keepsake is decided and not built. There is no read-only mode in the product today, and no one-click export of a wedding workspace. What exists today is an account-level export of everything the suite holds for a signed-in person, as a machine-readable file.",
  "Adoption figures are not built. At launch you see your invitations and who opened them.",
  "There is no venue login. Signal Studio administers your invitations and sends you the evidence. A login for your team is decided as a later step and is not part of what you are buying today.",
  "I would rather you heard this from me now than found it in September.",
];

/** E09.11 section 8. The deck's one ask, and it is the walkthrough. */
const DECK_ASK = "See it, on your own screen.";

const ASK_LINES = [
  "Thirty minutes, at your desk, with a real workspace rather than a picture of one.",
  `Write to ${VENUE_CONTACT_EMAIL} and I will send a time. After that you get the proposal, on one page, with everything above written down.`,
];

/* ── The deck ───────────────────────────────────────────────────────────── */

export function buildVenueSalesDeck(slot: VenueSalesDeckSlot): VenueSalesDeck {
  const name = slot.venueName.trim();
  const venueName = name.length > 0 ? name : UNFILLED_VENUE_LABEL;
  const filled = name.length > 0;

  const slides: Slide[] = [
    {
      id: "cover",
      number: "01",
      kind: "cover",
      kicker: "Signal Studio · Venue Edition",
      headline: "A private place to plan, for every couple who books with you.",
      body: [`Prepared for ${venueName}.`],
      sources: ["E09.11 section 3"],
    },
    {
      id: "what-this-is",
      number: "02",
      kind: "statement",
      kicker: "What this is",
      headline: "One thing, given to every couple who books.",
      body: [OFFER_PARAGRAPH],
      sources: ["E09.11 section 3", "D-020"],
    },
    {
      id: "the-couples-side",
      number: "03",
      kind: "statement",
      kicker: "The couple's side",
      headline: "What a couple actually gets.",
      body: COUPLE_SIDE_LINES,
      sources: ["E09.11 section 3", "E09.11 section 3.2"],
    },
    {
      id: "who-it-covers",
      number: "04",
      kind: "statement",
      kicker: "Who it covers",
      headline: "Every couple with a booking.",
      body: [
        ENTITLEMENT_SENTENCE,
        "There is no number in your agreement, nothing for your coordinator to track, and no arithmetic anyone has to do.",
      ],
      sources: ["D-020"],
    },
    {
      id: "what-your-team-does",
      number: "05",
      kind: "statement",
      kicker: "What your team does",
      headline: "One action, after they book.",
      body: [TEAM_ASK_SENTENCE],
      sources: ["E11.11 section 2"],
    },
    {
      id: "your-name-on-it",
      number: "06",
      kind: "statement",
      kicker: "Your name on it",
      headline: "Named, quietly, and nothing more than that.",
      body: BRANDING_LINES,
      sources: ["D-027.3", "R-024"],
    },
    {
      id: "what-you-see",
      number: "07",
      kind: "paired",
      kicker: PRIVACY_BLOCK.seeHeading,
      headline: "Invitations, and who opened them.",
      body: [PRIVACY_BLOCK.see],
      sources: ["E09.11 section 5.1", "D-011.3"],
    },
    {
      id: "what-you-never-see",
      number: "08",
      kind: "paired",
      kicker: PRIVACY_BLOCK.neverHeading,
      headline: "What any couple is planning.",
      body: [PRIVACY_BLOCK.never],
      sources: ["E09.11 section 5.1", "D-011.1"],
    },
    {
      id: "at-launch",
      number: "09",
      kind: "statement",
      kicker: PRIVACY_BLOCK.launchHeading,
      headline: "What is there on day one.",
      body: [PRIVACY_BLOCK.launch],
      sources: ["D-027.4", "D-032 R4"],
    },
    {
      id: "how-long",
      number: "10",
      kind: "statement",
      kicker: "How long a couple has it",
      headline: "It never runs out before the day.",
      body: [
        COUPLE_TERM_SENTENCE,
        "A long engagement is the ordinary case here, so the term is built around it rather than around a calendar.",
      ],
      sources: ["D-010.2", "D-022"],
    },
    {
      id: "after-the-wedding",
      number: "11",
      kind: "statement",
      kicker: "After the wedding",
      headline: "It stays with them.",
      body: [
        "The plan is theirs to keep reading after the day, and theirs to take away in a file they own.",
        "For as long as the service exists. A software company does not get to promise permanence, and a couple who was promised permanence has been promised something nobody can deliver.",
      ],
      notBuilt:
        "Decided and not built. There is no read-only mode and no one-click export of a wedding workspace in the product today.",
      sources: ["D-010.3", "E09.11 section 7", "E11.09-10 F-5"],
    },
    {
      id: "the-price",
      number: "12",
      kind: "statement",
      kicker: "The price",
      headline: "One number, and it is the number you pay.",
      body: [
        PRICE_FORMS.founding,
        STANDARD_RATE_SENTENCE,
        PRICE_FORMS.difference,
        PRICE_FORMS.lock,
      ],
      sources: ["D-009.1", "D-009.2", "D-009.3", "D-021"],
    },
    {
      id: "for-scale-only",
      number: "13",
      kind: "statement",
      kicker: "For scale only",
      headline: "It does not move with your volume.",
      body: [SCALE_SENTENCE],
      sources: ["D-020", "E09.11 section 4.3"],
    },
    {
      id: "the-founding-25",
      number: "14",
      kind: "statement",
      kicker: "The Founding 25",
      headline: "Twenty-five places, 01/25 to 25/25.",
      body: [
        FOUNDING_MEANING,
        "Your place is held for 14 days from the date of the proposal. If that date is awkward, tell me and I will move it.",
      ],
      sources: ["D-009.6", "D-009.7", "D-033"],
    },
    {
      id: "if-your-venue-is-sold",
      number: "15",
      kind: "statement",
      kicker: "If your venue is sold",
      headline: "The rate follows the property.",
      body: CHANGE_OF_CONTROL_LINES,
      sources: ["D-009.4"],
    },
    {
      id: "if-a-couple-cancels",
      number: "16",
      kind: "statement",
      kicker: "If a couple cancels or moves venue",
      headline: "You release it. They keep it.",
      body: RELEASE_LINES,
      sources: ["D-020.3"],
    },
    {
      id: "if-you-stop",
      number: "17",
      kind: "statement",
      kicker: "If you stop",
      headline: "Nothing is taken back from a couple.",
      body: [SURVIVAL_SENTENCE],
      sources: ["D-020.2"],
    },
    {
      id: "what-is-not-built-yet",
      number: "18",
      kind: "statement",
      kicker: "What is not built yet",
      headline: "Three things, said out loud.",
      body: NOT_BUILT_LINES,
      notBuilt:
        "This slide is the honesty position. D-016 requires that any capability not yet built is stated as not yet built.",
      sources: ["D-016", "D-027.4", "R-043", "E11.09-10 F-5"],
    },
    {
      id: "the-summary",
      number: "19",
      kind: "table",
      kicker: "In writing",
      headline: "Everything above, on one page.",
      body: [
        "This table is the commercial summary and it is the same one the proposal carries. A price never travels without its conditions.",
      ],
      rows: COMMERCIAL_SUMMARY_ROWS,
      sources: ["E11.11 section 3"],
    },
    {
      id: "the-ask",
      number: "20",
      kind: "ask",
      kicker: "One ask",
      headline: DECK_ASK,
      body: ASK_LINES,
      sources: ["E09.11 section 8"],
    },
  ];

  return { venueName, filled, slides };
}

/** Every string on the deck that a venue reads, for the sweep. */
export function venueSalesDeckProse(deck: VenueSalesDeck): string[] {
  const lines: string[] = [];
  for (const slide of deck.slides) {
    lines.push(slide.kicker, slide.headline, ...slide.body);
    if (slide.notBuilt) lines.push(slide.notBuilt);
    for (const [label, value] of slide.rows ?? []) lines.push(label, value);
  }
  return lines;
}

export const VENUE_SALES_DECK_ASK = DECK_ASK;
