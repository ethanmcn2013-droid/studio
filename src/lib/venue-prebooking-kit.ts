/**
 * E12.12 — the pre-booking venue sales kit, as data.
 *
 * ── What this is, and who says it ────────────────────────────────────────
 * Everything in this file is said by a VENUE to a COUPLE WHO HAS NOT BOOKED
 * YET. It goes in the venue's brochure, on the venue's website, into the
 * venue's own written proposal or quote, and out of a coordinator's mouth on a
 * show-around. Signal Studio writes none of these surfaces and owns none of
 * them, which is exactly the problem.
 *
 * ── Why it exists ────────────────────────────────────────────────────────
 * R-020. Twenty-five venues will describe this product to couples with no
 * obligation attached. A venue telling a couple "a free wedding planner, yours
 * forever" is a commercial practice under the Consumer Protection Act 2007,
 * enforceable by the CCPC, and it folds into the venue's own contract with the
 * couple. A Signal Studio discontinuation then becomes the venue's consumer
 * problem, and then the venue's claim against Signal Studio.
 *
 * The automated sweep polices Signal Studio's strings. It cannot reach a
 * venue's brochure. So the mitigation is to make the correct sentence the
 * easiest one to reach for, per channel, in the words a venue would actually
 * use, before the first couple is on a show-around.
 *
 * ── Pre-booking is a different promise from post-booking ─────────────────
 * `E09.11-venue-copy-pack.md` is the post-booking pack: a couple has booked
 * and is asking what the thing is. Pre-booking is conditional. The couple has
 * not booked, so every sentence is about what happens IF they book, and the
 * copy has to be conditional without becoming an inducement the venue cannot
 * honour if Signal Studio is not there in two years.
 *
 * That is why every block below is short, factual and free of adjectives. An
 * adjective in a brochure is a representation.
 *
 * ── The Keepsake correction, stated here because it is the sharpest edge ─
 * `E09.11-venue-copy-pack.md` section 1 tells a venue to say, today, "After the
 * wedding it stays open, read-only, and they can download everything in one
 * click." E09.11 section 7 sets the rule that contradicts it: the Keepsake is
 * described in the future tense on any surface that describes the product as
 * it is today. Verified 2026-08-03: there is no Keepsake mode, state, route or
 * component in `app/src`, and no read-only state a workspace enters at the end
 * of its term. The only export that exists is an account-level machine-readable
 * file at `app/src/app/api/account/export/route.ts`, not a wedding workspace a
 * couple would recognise. The exact greps and one correction to them are in
 * `evidence/E12.10-E12.13-verification-run.txt` section 7.
 *
 * So no block in this kit makes an after-the-wedding claim beyond one that is
 * true today: the workspace does not switch off the day after the wedding,
 * because the term runs at least three months past it (D-010.2, D-022).
 *
 * Recorded as defect C-2 in `evidence/E12.10-E12.13-venue-artefacts.md`. The
 * approved pack is not edited here; it is another task's artefact.
 *
 * ── What ratified each fact ──────────────────────────────────────────────
 *   Every couple with a booking, no number in the terms                D-020
 *   18 months from opening or 3 months past the wedding, later  D-010.2 D-022
 *   The couple never sees a price                                      D-001
 *   Branding is the venue's name only, no logo, no venue words       D-027.3
 *   Launch scope is invitation administration only                   D-027.4
 *   Nothing may imply legal approval or GDPR compliance                D-016
 *   Programme term is Founding 25                                      D-033
 *
 * Pure and client-safe.
 */

/* ── Shape ──────────────────────────────────────────────────────────────── */

export type KitBlockLength = "one-line" | "short" | "full";

export type KitBlock = {
  length: KitBlockLength;
  /** The words. Used as written or said in the venue's own voice. */
  text: string;
};

export type KitChannel = {
  id: string;
  /** The channel, named as a venue would name it. */
  name: string;
  /** Where it lands and who is reading. */
  moment: string;
  /** The one thing that makes this channel different from the others. */
  rule: string;
  blocks: KitBlock[];
  /** Written specifically for this channel, not the general ban list. */
  neverHere: string[];
};

/* ── The conditional sentence every channel is built on ─────────────────── */

/**
 * The pre-booking form of the offer. Conditional, because the couple has not
 * booked, and free of any adjective that would become a representation.
 *
 * "Part of booking with us" rather than "free" or "included": E09.11's pack
 * section 4 forbids the price words to a couple, and D-001 keeps the couple
 * away from a figure entirely.
 */
export const PREBOOKING_CORE_SENTENCE =
  "Book with us and you get a private place to plan the wedding. It is part of booking with us and there is nothing to pay for it.";

/**
 * The privacy sentence, and it travels with the offer in every channel. A
 * couple's first thought on hearing that a venue has given them a planning tool
 * is that the venue can read it.
 */
export const PREBOOKING_PRIVACY_SENTENCE =
  "We can see that you opened it. We cannot see what is in it.";

/**
 * The one true after-the-wedding sentence for a pre-booking surface. It says
 * what is built, and it stops. See the Keepsake note in the file header.
 */
export const PREBOOKING_AFTER_SENTENCE =
  "It does not switch off the day after the wedding. You keep it for at least three months past the day.";

/* ── The channels ───────────────────────────────────────────────────────── */

export const KIT_CHANNELS: KitChannel[] = [
  {
    id: "brochure",
    name: "The brochure",
    moment:
      "Printed, handed over on a show-around or posted out. Read at home, weeks later, by two people deciding between venues.",
    rule: "A brochure is read without you in the room, so every sentence has to survive being read literally. Keep it to three sentences and no adjectives.",
    blocks: [
      {
        length: "one-line",
        text: "Every couple who books with us gets a private place to plan the wedding.",
      },
      {
        length: "short",
        text: "Every couple who books with us gets a private place to plan the wedding. Somewhere to write things down, the work laid out so nothing sits in one person's head, and a plan you can share with family and suppliers. We can see that you opened it. We cannot see what is in it.",
      },
      {
        length: "full",
        text: "Every couple who books with us gets a private place to plan the wedding. Somewhere to write things down, the work laid out so nothing sits in one person's head, a plan you can share with family and suppliers, and a short note in the morning when something needs attention. It is part of booking with us and there is nothing to pay for it. We can see that you opened it. We cannot see what is in it. It does not switch off the day after the wedding.",
      },
    ],
    neverHere: [
      "A screenshot. The interface is not fixed and a picture in print goes stale on the first change.",
      "The Signal Studio logo. The agreement asks for your name in the programme, not for you to carry our mark.",
      "A euro figure, a normal price, or the word free. A couple who reads a value has been told what your package is worth.",
      "Anything about what happens after the wedding beyond the sentence above.",
    ],
  },
  {
    id: "website",
    name: "The website",
    moment:
      "On a what is included page, or in the weddings section. Read by a couple comparing four venues in one sitting.",
    rule: "A website page is edited by someone who was not in this conversation, so the block has to make sense on its own and carry its own boundary.",
    blocks: [
      {
        length: "one-line",
        text: "Book with us and you get a private place to plan the wedding.",
      },
      {
        length: "short",
        text: "Book with us and you get a private place to plan the wedding, at no cost to you. Notes, the work laid out, and a plan you can share with family and suppliers. It is yours. We can see that you opened it, and we cannot see what is in it.",
      },
      {
        length: "full",
        text: "Book with us and you get a private place to plan the wedding, at no cost to you. Somewhere to write things down, the work laid out so nothing sits in one person's head, a plan you can share with family and suppliers, and a short note in the morning when something needs attention. It is yours, not ours. We can see that you opened it, and we cannot see what is in it. If you want us to see something, you send it to us the same way you would send it to anyone else.",
      },
    ],
    neverHere: [
      "A claim about data protection, security or where anything is held. If a couple asks, put them in touch with Signal Studio.",
      "A link that promises access before a couple has booked. There is nothing for them to open yet.",
      "A comparison with anything. A brochure claim about another product is a claim you are answerable for.",
      "The words seats, licences or codes. A couple should never learn that this has an administrative side.",
    ],
  },
  {
    id: "proposal",
    name: "Your written proposal or quote",
    moment:
      "The document you send after a show-around, with the date, the room and the price on it. This is the one that folds into the contract.",
    rule: "This is the highest-risk surface in the kit. Whatever appears here becomes part of what you promised, so it states the thing plainly and makes no claim about how long anything lasts.",
    blocks: [
      {
        length: "one-line",
        text: "Included when you book: a private place to plan the wedding, at no cost to you.",
      },
      {
        length: "short",
        text: "Included when you book: a private place to plan the wedding, at no cost to you. It is provided through Signal Studio. We can see that you opened it and we cannot see what is in it.",
      },
      {
        length: "full",
        text: "Included when you book: a private place to plan the wedding, at no cost to you. It is provided through Signal Studio, an independent company, and it is subject to their terms, which you get before you use it. We can see that you opened it and we cannot see what is in it. It does not switch off the day after the wedding. If it ever stops being available, nothing else about your booking changes.",
      },
    ],
    neverHere: [
      "A duration. A term written into your quote is a term you have promised, and the term is set by Signal Studio, not by you.",
      "A monetary value, even as an aside. It converts a gift into a discount and a discount into a consumer entitlement.",
      "The word guaranteed, in any sentence, about anything on this page.",
      "A feature list. Every named feature is a feature you have promised will exist on the wedding day.",
    ],
  },
  {
    id: "show-around",
    name: "The show-around conversation",
    moment:
      "Spoken, standing in a room, by a coordinator answering a question they were not expecting.",
    rule: "Nobody should have a script. Two sentences, said in your own words, and one answer for everything else.",
    blocks: [
      {
        length: "one-line",
        text: "If you book with us you get a private place to plan the whole thing, and it costs you nothing.",
      },
      {
        length: "short",
        text: "If you book with us you get a private place to plan the whole thing, and it costs you nothing. We can see that you opened it. We cannot see what is in it.",
      },
      {
        length: "full",
        text: "If you book with us you get a private place to plan the whole thing, and it costs you nothing. You write things down, the work is laid out, and you can share a plan with your family and your suppliers. We can see that you opened it. We cannot see what is in it. If you ask me something about it I do not know, I would rather find out and tell you than guess.",
      },
    ],
    neverHere: [
      "A promise about how long they will have it. Say that it is set out in writing and that you will send it.",
      "Any answer about data protection, insurance or legal review. Those are answered by Signal Studio, by a person, and never on a page.",
      "An offer to look at their plan for them later. There is no setting on anyone's side that does that.",
      "A dietary, allergy or accessibility example. That information is about guests who have agreed to nothing, and it does not travel through this.",
    ],
  },
  {
    id: "wedding-fair",
    name: "A wedding fair or an open day",
    moment:
      "Across a table, in noise, in ninety seconds, to somebody who will not remember your name.",
    rule: "One sentence, and it is the same one every time. Anything longer is not heard.",
    blocks: [
      {
        length: "one-line",
        text: "Book with us and you get a private place to plan the wedding, at no cost to you.",
      },
      {
        length: "short",
        text: "Book with us and you get a private place to plan the wedding, at no cost to you. It is yours and we cannot see inside it.",
      },
      {
        length: "full",
        text: "Book with us and you get a private place to plan the wedding, at no cost to you. It is yours and we cannot see inside it. The detail is in what we send you.",
      },
    ],
    neverHere: [
      "A leaflet with any of this printed on it that we have not seen. Ask us and you get a print-ready file.",
      "A demonstration on a phone. There is nothing to show a couple who has not booked.",
      "Any comparison with what another venue includes.",
    ],
  },
];

/* ── For the venue's own team, never said to a couple ───────────────────── */

/**
 * The launch-scope sentence. D-032 R4 makes it required in writing on any
 * surface that tells a venue what it sees, and this kit is such a surface
 * because a coordinator reading it will form a belief about it.
 */
export const KIT_TEAM_NOTES = [
  "At launch you see your invitations and who opened them. Adoption figures follow later in the year.",
  "There is no per-couple row, no ranking and no list of who is behind, and there is no setting anyone can turn on that changes that.",
  "If a couple asks your coordinator to look at something inside their plan, the honest answer is that nobody at your venue can see it, and neither can Signal Studio.",
  "Your name appears on the couple's side as a name, in one line. Not a logo, not a colour, and not a message you write.",
];

/* ── The prohibited-claims sheet: one list, not a second one ────────────── */

/**
 * The kit does not restate the prohibited claims. Two lists is how a term
 * survives on one surface after being retired on another, which is R-042 in
 * one sentence.
 *
 * The list is `E09.11-venue-copy-pack.md` section 4, generated from
 * `evidence/copy/prohibited-claims.v1.json`, which is the same list the
 * repository sweep enforces. This kit ships with that pack rather than
 * beside a copy of it.
 */
export const PROHIBITED_SHEET = {
  title: "Never say these",
  source: "E09.11-venue-copy-pack.md section 4",
  machineSource:
    "docs/execution/venue-edition-and-films/evidence/copy/prohibited-claims.v1.json",
  note: "The kit ships with that sheet. It is not reprinted here, because a second copy of a ban list is how a banned word survives on one surface after being removed from another.",
} as const;

/**
 * What the agreement asks of a venue, stated so a coordinator meets it here
 * rather than in a clause. R-020's marketing-controls mitigation, in plain
 * words. This is a description of a required clause, not the clause.
 */
export const MARKETING_UNDERTAKING = [
  "Describe the planning workspace using the wording in this kit, or your own words that keep the same facts.",
  "Do not make a claim from the prohibited sheet, in any medium, including a conversation.",
  "If we ask you to correct something, correct it within ten working days.",
  "Send us anything new you write about it before it is printed. We will read it the same day.",
];

/* ── Prose extraction, for the sweep ────────────────────────────────────── */

/**
 * Everything in the kit that is a USE of language rather than a NAMING of it.
 *
 * `neverHere` is excluded, and that exclusion is the same one E09.10 section 2
 * relies on: a ban list contains the banned words, so sweeping it fails on the
 * list existing. The exclusion is narrow and structural rather than a
 * heuristic over the text, because a heuristic that decides "this looks like a
 * citation" once suppressed two real defects on the live venues page
 * (E09.11 section 12.5). `venuePrebookingProhibitionProse` sweeps those lines
 * separately against the rules that still bind them.
 */
export function venuePrebookingKitProse(): string[] {
  const lines: string[] = [
    PREBOOKING_CORE_SENTENCE,
    PREBOOKING_PRIVACY_SENTENCE,
    PREBOOKING_AFTER_SENTENCE,
    ...KIT_TEAM_NOTES,
    ...MARKETING_UNDERTAKING,
    PROHIBITED_SHEET.title,
    PROHIBITED_SHEET.note,
  ];
  for (const channel of KIT_CHANNELS) {
    lines.push(channel.name, channel.moment, channel.rule);
    for (const block of channel.blocks) lines.push(block.text);
  }
  return lines;
}

/** The per-channel never-lists. These name banned language, so they use it. */
export function venuePrebookingProhibitionProse(): string[] {
  return KIT_CHANNELS.flatMap((channel) => channel.neverHere);
}

/** Only the words a couple could ever read or hear. The strictest set. */
export function venuePrebookingCoupleFacingProse(): string[] {
  const lines: string[] = [
    PREBOOKING_CORE_SENTENCE,
    PREBOOKING_PRIVACY_SENTENCE,
    PREBOOKING_AFTER_SENTENCE,
  ];
  for (const channel of KIT_CHANNELS) {
    for (const block of channel.blocks) lines.push(block.text);
  }
  return lines;
}
