/**
 * The ratified Venue Edition copy, in one place.
 *
 * **Every string below is quoted from an approved source and is not reworded
 * here.** Where a claim already has approved words, those words are used. A
 * claim written in new words is a drift, and roughly 140 files carrying the
 * retired commercial position (I-002) is what that costs.
 *
 * Sources, and each block names its own:
 *   - `E09.11-copy-system.md` sections 3, 3.1, 4.1, 4.3, 5.1, 5.1a, 7.2, 8
 *   - `E11.11-12-proposal-and-objections.md` sections 2 and 3
 *   - `E13.16-link-and-destination-contract.md` sections 3.1, 4.4, 12.4
 *   - `DECISIONS.md` D-009, D-010, D-020, D-021, D-022, D-027, D-032
 *
 * The prohibited list is `evidence/copy/prohibited-claims.v1.json`. Nothing in
 * this file may reintroduce a pattern from it.
 */

export const VENUE_CONTACT_EMAIL = "hello@signalstudio.ie";

/* ── Block 1 · the offer (E09.11 section 3) ──────────────────────────── */

/** The one-line form. Subject lines, card leads, a CTA lead. */
export const OFFER_ONE_LINE =
  "A private place to plan, for every couple who books with you.";

/** The one-paragraph form. A hero, an email body, a card. */
export const OFFER_PARAGRAPH =
  "Every couple who books their wedding with you gets a private place to plan it. Notes, the actual work, a plan they can share with family and suppliers, and a short note in the morning when something needs attention. Your name is on it, quietly. Nothing for your team to run.";

/** D-020's venue-facing entitlement line, ratified, verbatim. */
export const ENTITLEMENT_SENTENCE =
  "Every couple who books their wedding with you gets a workspace, for as long as your licence is current.";

/** E09.11 section 3.1. Stated unprompted, never held back for the objection. */
export const SURVIVAL_SENTENCE =
  "Any workspace a couple has already opened keeps its full term, and its Keepsake, whatever happens to your agreement. Only new invitations stop.";

/** E11.11 section 2. D-010 point 2 and D-022. Never a bare eighteen months. */
export const COUPLE_TERM_SENTENCE =
  "They get it for 18 months from when they open it, or 3 months past the wedding, whichever is later. If they postpone, that moves with them.";

/** E11.11 section 2, "What it asks of your team". */
export const TEAM_ASK_SENTENCE =
  "One action. Invite the couple after they book. There is nothing to run, nothing to set up, and no training day.";

/** E11.11 section 2, "Whose it is". D-027 point 3: the name, never a logo. */
export function whoseItIsSentence(venueName: string): string {
  return `Theirs. ${venueName} is named on it, quietly, in one line. The couple never sees a price and never pays anything.`;
}

/* ── Block 2 · the founding rate (E09.11 section 4.1) ────────────────── */

/**
 * The four permitted forms. Any of these may be used. Nothing else may.
 * D-009 point 3 and D-021 forbid every permanence wording, and the list of the
 * words themselves lives in `copy/prohibited-claims.v1.json` rule P1 rather
 * than here, so that this file can be swept without a citation exemption.
 */
export const PRICE_FORMS = {
  founding: "€1,000 a year, prepaid, including VAT at the prevailing rate.",
  difference: "€500 a year less than the standard rate, for as long as you stay.",
  lock:
    "The founding rate holds for as long as the agreement renews continuously without lapse.",
  property:
    "It follows the property. It survives a sale, an operator change and a rebrand. It does not travel to other venues a new owner brings.",
} as const;

export const STANDARD_RATE_SENTENCE =
  "The standard rate is €1,500 a year, prepaid, including VAT at the prevailing rate.";

/**
 * E09.11 section 4.3. "For scale only" is load-bearing: without it the
 * sentence reads as a per-wedding price, which is the model D-020 abolished.
 */
export const SCALE_SENTENCE =
  "The price does not change with the number of weddings you run. For scale only: across 20 weddings a year that is €50 a wedding, across 40 it is €25, across 80 it is €12.50.";

/* ── Block 3 · privacy (E09.11 sections 5.1 and 5.1a) ────────────────── */

/**
 * Three parts, and a surface that takes this block takes all three. Taking the
 * first two and dropping the third describes the product at renewal and calls
 * it the product on day one, which is the concealment section 5.1a exists to
 * prevent. D-032 R4 makes the third part required rather than optional.
 */
export const PRIVACY_BLOCK = {
  seeHeading: "What you see",
  see: "Which invitations you sent, and which couples opened them. Adoption figures across your couples as a group. Small numbers are held back so a figure can never point at one couple.",
  neverHeading: "What you never see",
  never:
    "What any couple is planning. There is no per-couple row, no ranking and no list of who is behind. If a couple changes their wedding date, that does not appear anywhere. A postponement is their news to share.",
  launchHeading: "At launch",
  /** D-032 R4. Verbatim. No variant, no paraphrase, no date, no feature name. */
  launch:
    "At launch you see your invitations and who opened them. Adoption figures follow later in the year.",
} as const;

/* ── Block 5 · Keepsake (E09.11 section 7.2) ─────────────────────────── */

export const KEEPSAKE_VENUE_FACING =
  "When a couple’s planning term ends, their workspace stays open in Keepsake mode. Read-only, for as long as the service exists, with a one-click export they own.";

/* ── The founding programme (D-009, E11.11 section 2) ────────────────── */

export const FOUNDING_MEANING =
  "A number, 01/25 through 25/25, assigned when your payment clears. One 30-minute call with me a year and a named email route. Your requests are logged and they shape what gets built. Nothing is built for one venue, and I would rather say that now than explain it later.";

/** D-009 point 7. Stated once, plainly. Never a countdown. */
export const HOLD_SENTENCE =
  "Your place is held for 14 days from the date of this proposal. If that date is awkward, tell me and I will move it.";

/* ── The click disclosure (E13.16 section 4.4) ───────────────────────── */

export const CLICK_DISCLOSURE =
  "Signal Studio records that this page was opened, and the date. Nothing else. Ask us to stop and the record is deleted.";

/* ── The commercial summary (E11.11 section 3) ───────────────────────── */

/**
 * Reusable verbatim, and it is the version that goes anywhere a price appears
 * without the full proposal around it. The rule it exists to enforce: a price
 * never travels without its conditions. If a surface can carry the number, it
 * can carry this block. If it cannot carry this block, it does not carry the
 * number.
 */
export const COMMERCIAL_SUMMARY_ROWS: ReadonlyArray<readonly [string, string]> = [
  ["Price", "€1,000 a year, prepaid, including VAT at the prevailing rate"],
  ["Standard rate", "€1,500 a year, prepaid, including VAT at the prevailing rate"],
  ["The founding difference", "€500 a year less, for as long as you stay"],
  ["What the rate covers", "The base annual Venue Edition agreement"],
  ["What holds it", "Continuous renewal without lapse"],
  [
    "If the venue is sold",
    "The rate follows the property. It survives a sale, an operator change and a rebrand",
  ],
  [
    "If a new owner brings other venues",
    "Those do not get the founding rate. One place, one property",
  ],
  [
    "If a renewal is missed",
    "The founding rate does not come back. The standard rate applies",
  ],
  [
    "Who gets a workspace",
    "Every couple with a signed booking at your venue, while your licence is current",
  ],
  [
    "How long a couple has it",
    "18 months from when they open it, or 3 months past the wedding, whichever is later",
  ],
  ["If a couple postpones", "The term moves later with them. It never moves earlier"],
  [
    "After that",
    "Keepsake mode: read-only, with a one-click export they own, for as long as the service exists",
  ],
  [
    "If your agreement ends",
    "Any workspace already opened keeps its full term and its Keepsake. Only new invitations stop",
  ],
  [
    "If a couple cancels or moves venue",
    "You release the workspace. The couple keeps their content. Your name comes off within 24 hours",
  ],
  ["Your place", "Held 14 days from the date of the proposal. Extendable by me, personally"],
  [
    "Your number",
    "01/25 through 25/25, assigned when your payment clears, not on signature",
  ],
  ["The couple", "Never pays and never sees a price"],
];

/* ── The replacement page (E13.16 section 12.4) ──────────────────────── */

/**
 * Verbatim. The heading states the fact without accusing anybody: whoever is
 * reading may be the venue, may be a colleague it was forwarded to, and may be
 * a stranger. It names no venue, carries no film, carries no offer detail and
 * links to no other token.
 */
export const REPLACED_PAGE = {
  heading: "This link is no longer in use",
  body: "The address you opened has been replaced. If it was sent to you, write to hello@signalstudio.ie and we will send you the current one.",
  disclosure: CLICK_DISCLOSURE,
  signature: "signalstudio.ie",
} as const;

/* ── The unknown-token page (E13.16 section 6) ───────────────────────── */

/**
 * Names nothing. No venue, no cohort, no "this invitation has expired", no
 * count of anything. It says the link is not valid and offers the public page.
 */
export const UNKNOWN_LINK_PAGE = {
  heading: "This link is not valid",
  body: "Check the address, or read about the Venue Edition on the public page.",
  linkLabel: "Read about the Venue Edition",
  linkHref: "/venues",
} as const;
