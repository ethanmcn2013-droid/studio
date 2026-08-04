/**
 * E12.09 — the one-page Venue Edition proposal, as data.
 *
 * THIS FILE IS THE ONLY COPY OF THE PROPOSAL WORDS IN THE REPOSITORY.
 * Two surfaces render it and neither may restate it:
 *   1. `/hq/venue-proposal` — the founder tool that fills the slots and prints
 *      the page a venue is sent (E12.09).
 *   2. The proposal state of the private venue page (E12.03), when that route
 *      is built. It imports `buildVenueProposal` rather than repeating a word.
 *
 * A second copy of a price is how two prices happen (E09.11 §4). If a third
 * surface needs the proposal, it imports this module.
 *
 * ── Where the words come from ────────────────────────────────────────────
 * `E11.11-12-proposal-and-objections.md` §2, which is the finalised long-form
 * offer. Every block below is that document verbatim, with ONE deliberate
 * correction recorded in full at `[LAUNCH-SCOPE]` below.
 *
 * ── The commercial facts, and what ratified each one ──────────────────────
 *   €1,000 founding · €1,500 standard · both prepaid annually     D-009.1
 *   "€500 a year less, for as long as you stay"                   D-009.2
 *   The lock holds on continuous renewal without lapse            D-009.3
 *   The rate follows the property, not the company                D-009.4
 *   One 30-minute call a year plus a named email route            D-009.5
 *   "Founding 25"; the number is assigned on cleared payment      D-009.6
 *   Places held 14 days                                           D-009.7
 *   Every booked couple, no number in the commercial terms        D-020
 *   Redeemed workspaces survive the agreement ending              D-020.2
 *   18 months from opening or 3 months past the wedding, later    D-010.2 · D-022
 *   Keepsake: read-only, one-click export, while the service runs D-010.3
 *   Both prices are inclusive of VAT at the prevailing rate       D-021
 *   Branding is the venue's name only                             D-027.3
 *   Launch scope is invitation administration only                D-027.4
 *   The launch-scope sentence is required in writing              D-032 R4
 *
 * ── What must never appear here ──────────────────────────────────────────
 * The refusal sets are not restated in this comment, deliberately: every
 * banned string written here would be a hit in the commercial gate that
 * sweeps this file, and a ban list that has to exempt itself is a ban list
 * that stops being read.
 *
 * They live as executable assertions in `venue-proposal.test.ts`, under
 * `REFUSED`, one regular expression per rule, each labelled by its rule id
 * alone: P1, P2, P3, P5, P6, P8, P12, P13, D-027.3, D-001.4, the four banned
 * programme terms, and BRAND.md §3 punctuation.
 *
 * Rule ids rather than descriptions, and this is not fussiness. The E12.14
 * sweep ran `prohibited-claims.v1.json` against this file and found two hits
 * in this very comment: a P5 term and a D-027.3 term, used to describe the
 * rules that forbid them. `prohibited-claims.v1.json` has no heuristic for
 * "naming, not using" — every exemption is an explicit citation entry, by
 * design, because the heuristic version once suppressed two real defects on
 * the live venues page. Carrying a description here would mean asking WP-06
 * for two citations to cover a comment. An id costs nothing and reads the
 * same. `prohibited-claims.v1.json` is the description.
 *
 * That test runs against the filled proposal AND the empty one, so a
 * placeholder cannot smuggle in what a paragraph may not say.
 */

/* ── Slots ──────────────────────────────────────────────────────────────── */

/**
 * The six slots E11.11 §2 defines. Every one is filled before sending.
 * "A slot left unfilled is a send defect" — E11.11 §2, and the renderer
 * makes that defect impossible to miss rather than merely documented.
 */
export const VENUE_PROPOSAL_SLOT_IDS = [
  "venueName",
  "firstName",
  "walkthroughDate",
  "holdEndDate",
  "paidCount",
  "nextFreeNumber",
] as const;

export type VenueProposalSlotId = (typeof VENUE_PROPOSAL_SLOT_IDS)[number];

export type VenueProposalSlots = Record<VenueProposalSlotId, string>;

export const VENUE_PROPOSAL_SLOT_LABELS: Record<
  VenueProposalSlotId,
  { label: string; hint: string; placeholder: string }
> = {
  venueName: {
    label: "Venue name",
    hint: "The trading name, as the owner writes it. Never a couple's name.",
    placeholder: "Glenmara Estate",
  },
  firstName: {
    label: "First name",
    hint: "The person the walkthrough was with.",
    placeholder: "Aoife",
  },
  walkthroughDate: {
    label: "Walkthrough date",
    hint: "The day of the walkthrough this proposal follows.",
    placeholder: "3 August 2026",
  },
  holdEndDate: {
    label: "Hold end date",
    hint: "Fourteen days from the date this proposal is sent (D-009.7).",
    placeholder: "17 August 2026",
  },
  paidCount: {
    label: "Places taken",
    hint: "Verified against the register at the moment of sending, never carried over from the last proposal.",
    placeholder: "0",
  },
  nextFreeNumber: {
    label: "Next free number",
    hint: "The number that would be assigned if this venue paid next.",
    placeholder: "01/25",
  },
};

export const EMPTY_VENUE_PROPOSAL_SLOTS: VenueProposalSlots = {
  venueName: "",
  firstName: "",
  walkthroughDate: "",
  holdEndDate: "",
  paidCount: "",
  nextFreeNumber: "",
};

/* ── The proposal ───────────────────────────────────────────────────────── */

export type VenueProposalBlock = {
  /** Stable id, so a surface can style or reorder without retyping a word. */
  id: string;
  /** The heading a venue reads. Null for the opening and the signature. */
  heading: string | null;
  /** One or more paragraphs, in order. */
  paragraphs: string[];
};

export type VenueProposal = {
  title: string;
  preparedFor: string;
  blocks: VenueProposalBlock[];
  signature: string[];
  /** Slots the caller left empty. A non-empty list means do not send. */
  unfilledSlots: VenueProposalSlotId[];
  sendable: boolean;
};

/**
 * `[LAUNCH-SCOPE]` — the one deliberate correction to E11.11 §2.
 *
 * E11.11 §2's "What you see" block reads, in a single paragraph, "Which
 * invitations you sent, which couples opened them, and adoption figures
 * across your couples as a group." D-027 point 4 narrowed the launch portal
 * to invitation administration only: adoption figures follow after
 * 1 September. So that sentence is true at renewal and untrue on the day a
 * venue starts.
 *
 * D-032 R4 makes the correction mandatory rather than optional, and
 * `E09.11-copy-system.md` §5.1a fixes the wording and names this proposal, by
 * document and line, as a surface that does not yet carry it. §5.1a's exact
 * words: "A surface that takes this block verbatim takes all three parts."
 *
 * So this module renders E09.11 §5.1's three-part block verbatim in place of
 * E11.11 §2's two-part one. The positive half and the negative half are
 * unchanged; the third part is added.
 *
 * This is a boundary request applied, not a rewrite taken unilaterally:
 * E11.11 §2 still needs the same amendment in its own document, and that is
 * E11.11's to make. Recorded in `evidence/E12.09-one-page-proposal.md` §4.
 */
const LAUNCH_SCOPE_SENTENCE =
  "At launch you see your invitations and who opened them. Adoption figures follow later in the year.";

export { LAUNCH_SCOPE_SENTENCE };

function fill(template: string, slots: VenueProposalSlots): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const id = key as VenueProposalSlotId;
    const value = slots[id];
    if (value === undefined) return match;
    const trimmed = value.trim();
    return trimmed.length ? trimmed : `[${id}]`;
  });
}

/**
 * Build the proposal for one venue. Pure: no dates, no clock, no network, so
 * the same slots always produce the same page and a test can pin it.
 */
export function buildVenueProposal(slots: VenueProposalSlots): VenueProposal {
  const unfilledSlots = VENUE_PROPOSAL_SLOT_IDS.filter(
    (id) => !slots[id] || !slots[id].trim().length,
  );
  const f = (template: string) => fill(template, slots);

  const blocks: VenueProposalBlock[] = [
    {
      id: "what-your-couples-get",
      heading: "What your couples get",
      paragraphs: [
        "Every couple who books their wedding with you gets a private place to plan it. Notes, the actual work, a plan they can share with family and suppliers, and a short note in the morning when something needs attention. Nothing to learn. It opens ready to use.",
        "They get it for 18 months from when they open it, or 3 months past the wedding, whichever is later. If they postpone, that moves with them.",
      ],
    },
    {
      id: "whose-it-is",
      heading: "Whose it is",
      paragraphs: [
        f(
          "Theirs. {venueName} is named on it, quietly, in one line. The couple never sees a price and never pays anything.",
        ),
      ],
    },
    {
      id: "what-you-see",
      heading: "What you see",
      paragraphs: [
        "Which invitations you sent, and which couples opened them. Adoption figures across your couples as a group. Small numbers are held back so a figure can never point at one couple.",
      ],
    },
    {
      id: "what-you-never-see",
      heading: "What you never see",
      paragraphs: [
        "What any couple is planning. There is no per-couple row, no ranking and no list of who is behind. If a couple changes their wedding date, that does not appear anywhere. A postponement is their news to share.",
      ],
    },
    {
      id: "at-launch",
      heading: "At launch",
      paragraphs: [LAUNCH_SCOPE_SENTENCE],
    },
    {
      id: "what-it-asks-of-your-team",
      heading: "What it asks of your team",
      paragraphs: [
        "One action. Invite the couple after they book. There is nothing to run, nothing to set up, and no training day.",
      ],
    },
    {
      id: "what-it-costs",
      heading: "What it costs",
      paragraphs: [
        "€1,000 a year, prepaid, including VAT at the prevailing rate.",
        "The standard rate is €1,500. As one of the Founding 25 you pay €500 a year less, for as long as you stay. That rate covers the base annual Venue Edition agreement and holds for as long as it renews continuously without lapse. It follows the property, so it survives a sale or a rebrand. It does not travel to other venues a new owner brings.",
        "The price does not change with the number of weddings you run. For scale only: across 20 weddings a year that is €50 a wedding, across 40 it is €25, across 80 it is €12.50.",
      ],
    },
    {
      id: "what-happens-at-the-end",
      heading: "What happens at the end",
      paragraphs: [
        "When a couple's planning term ends, their workspace stays open in Keepsake mode, read to keep, and they can export everything in one click, for as long as the service exists. Any workspace a couple has already opened keeps its full term whatever happens to your agreement. Only new invitations stop.",
      ],
    },
    {
      id: "what-being-one-of-the-25-means",
      heading: "What being one of the 25 means",
      paragraphs: [
        "A number, 01/25 through 25/25, assigned when your payment clears. One 30-minute call with me a year and a named email route. Your requests are logged and they shape what gets built. Nothing is built for one venue, and I would rather say that now than explain it later.",
      ],
    },
    {
      id: "the-number",
      heading: "The number",
      paragraphs: [
        f(
          "{paidCount} places are taken. The next free number is {nextFreeNumber}. Numbers follow cleared payment, and other venues have proposals open at the same time, so I cannot hold a specific number for you.",
        ),
      ],
    },
    {
      id: "your-place",
      heading: "Your place",
      paragraphs: [
        f(
          "Held until {holdEndDate}. If that date is awkward, tell me and I will move it.",
        ),
      ],
    },
    {
      id: "to-take-it",
      heading: "To take it",
      paragraphs: [
        "Complete the order form and send it back. I will invoice you, and the place stays yours while the invoice is with you.",
      ],
    },
  ];

  return {
    title: f("Venue Edition for {venueName}"),
    preparedFor: f("Prepared for {firstName}, {walkthroughDate}."),
    blocks,
    signature: ["Ethan McNamara", "Signal Studio", "hello@signalstudio.ie"],
    unfilledSlots,
    sendable: unfilledSlots.length === 0,
  };
}

/**
 * Every line of prose the proposal renders, flattened. Used by the module's
 * own test to assert the refusal sets, and available to any check that wants
 * to sweep the copy without parsing JSX.
 */
export function venueProposalProse(proposal: VenueProposal): string[] {
  return [
    proposal.title,
    proposal.preparedFor,
    ...proposal.blocks.flatMap((block) => [
      block.heading ?? "",
      ...block.paragraphs,
    ]),
    ...proposal.signature,
  ].filter((line) => line.length > 0);
}
