/**
 * Ratified venue-facing copy. One source, imported by every venue surface.
 *
 * WHY THIS FILE EXISTS
 * The previous /venues page carried every string as a hand-written literal and
 * read no shared source. The reconciliation checker records that as UNWIRED:
 * "It will drift the moment the fixture changes, silently, with nothing failing."
 * Every string below traces to a ratified decision. Changing one is a commercial
 * change, not a copy edit.
 *
 * PROVENANCE
 *   D-009  founding rate and standard rate, the wording of the difference
 *   D-010  couple access term, Keepsake
 *   D-011  privacy, small-number suppression
 *   D-012  geography term
 *   D-014  founding requests shape the roadmap, nothing built for one venue
 *   D-020  entitlement model, the survival sentence
 *   D-021  VAT inclusive
 *   D-027  branding is the venue's name only, consent layer unwired at launch
 *   D-032  Option C venue identity, no venue login before 1 September
 *   E09.10 the copy ladder and prohibitions P1 to P15
 *   E09.11 the approved copy system, all eight blocks
 *   E11.11 the commercial summary and the objection library
 *
 * HARD RULES THAT BIND ANY SURFACE USING THIS FILE
 *   1. A price never travels without its conditions. If a surface carries the
 *      number, it carries COMMERCIAL_SUMMARY. If it cannot, it does not carry
 *      the number. (E11.11)
 *   2. PRIVACY is three parts and they travel together. AT_LAUNCH is verbatim
 *      with no variants, because the whole point is that a venue reads the same
 *      sentence everywhere. (D-027.4, D-032 R4)
 *   3. The access term is never the bare figure. Always the full sentence.
 *      (D-010.2, D-022, prohibition P7)
 *   4. One call to action per surface. A second is a defect, not an option.
 *      (E09.11)
 *   5. FOUNDING_RATE is a closed set. Any of those forms may be used. Nothing
 *      else may. (E09.11)
 */

/** The ladder. Fixed and ordered. A surface may drop a rung, never reorder. */
export const LADDER = [
  "What their couples get",
  "Whose it is",
  "What it costs",
  "What you see, and what you never see",
  "What it asks of your team",
  "What happens at the end",
  "What being one of twenty-five means",
] as const;

// ── Rung 1 · what their couples get ────────────────────────────────

/** One line. For meta description, OG, subject lines. */
export const OFFER_LINE =
  "A private place to plan, for every couple who books with you.";

/** One paragraph. The landing page hero. Named for this use in E09.11. */
export const OFFER_PARAGRAPH =
  "Every couple who books their wedding with you gets a private place to plan it. Notes, the actual work, a plan they can share with family and suppliers, and a short note in the morning when something needs attention. Your name is on it, quietly. Nothing for your team to run.";

/** D-020, verbatim. The entitlement model in one sentence. */
export const ENTITLEMENT =
  "Every couple who books their wedding with you gets a workspace, for as long as your licence is current.";

export const WHAT_COUPLES_GET =
  "A private place to plan their wedding. Notes for the things they think of, the actual work laid out, a plan they can share with family and suppliers, and a short note in the morning when something needs attention. It opens ready to use. There is nothing to learn.";

// ── Rung 2 · whose it is. Trust. This comes before price. ──────────

/** The three sentences a venue says to a couple. The plainest form of the product. */
export const PLAIN_THREE = [
  "They get a private place to plan the wedding. It is a gift from us, and it costs them nothing.",
  "We can see that they opened it. We cannot see what is in it.",
  "After the wedding it stays open, read-only, and they can download everything in one click.",
] as const;

/** D-027.3. Branding is the name, said once. */
export const BRANDING =
  "Your name does. One quiet line at the top of the couple's workspace. Not a logo, not a colour, and not a message you write. Your name, said once.";

/** Why the couple never pays. Objection A2. */
export const WHY_NOT_CHARGE_COUPLES =
  "Because the moment a couple sees a price, it stops being something you gave them and becomes something they were sold. That is the whole product.";

export const COLLABORATION =
  "A couple can share their plan with their family, their suppliers or their own planner. You do not see who they shared it with, and you do not see what is in it. If a couple wants you to have something, they send it to you the same way they send it to anyone else.";

// ── Rung 3 · what it costs ─────────────────────────────────────────

export const PRICE_FOUNDING = "€1,000";
export const PRICE_STANDARD = "€1,500";

/**
 * The closed set. Any of these may be used. Nothing else may.
 * Note the third: the lock is continuous renewal, never permanence. P1 bans
 * "for life", "forever", "lifetime", "in perpetuity", "guaranteed".
 */
export const FOUNDING_RATE = {
  price:
    "€1,000 a year, prepaid, including VAT at the prevailing rate.",
  difference:
    "€500 a year less than the standard rate, for as long as you stay.",
  lock: "The founding rate holds for as long as the agreement renews continuously without lapse.",
  property:
    "It follows the property. It survives a sale, an operator change and a rebrand. It does not travel to other venues a new owner brings.",
} as const;

/**
 * The one permitted arithmetic sentence. "For scale only" is load-bearing.
 * Without it the sentence reads as a per-wedding price, which is the model
 * D-020 abolished.
 */
export const PER_WEDDING_SCALE =
  "The price does not change with the number of weddings you run. For scale only: across 20 weddings a year that is €50 a wedding, across 40 it is €25, across 80 it is €12.50.";

/** Objection A7. VAT is inside the number, never on top. */
export const VAT_ANSWER =
  "No. €1,000 is what you pay. VAT at the prevailing rate comes out of it, not on top of it.";

/**
 * The commercial summary. Reusable verbatim, and named for the landing page.
 * A surface that carries the price carries this. Seventeen rows, no edits.
 */
export const COMMERCIAL_SUMMARY: ReadonlyArray<readonly [string, string]> = [
  ["Price", "€1,000 a year, prepaid, including VAT at the prevailing rate"],
  ["Standard rate", "€1,500 a year, prepaid, including VAT at the prevailing rate"],
  ["The founding difference", "€500 a year less, for as long as you stay"],
  ["What the rate covers", "The base annual Venue Edition agreement"],
  ["What holds it", "Continuous renewal without lapse"],
  ["If the venue is sold", "The rate follows the property. It survives a sale, an operator change and a rebrand"],
  ["If a new owner brings other venues", "Those do not get the founding rate. One place, one property"],
  ["If a renewal is missed", "The founding rate does not come back. The standard rate applies"],
  ["Who gets a workspace", "Every couple with a signed booking at your venue, while your licence is current"],
  ["How long a couple has it", "18 months from when they open it, or 3 months past the wedding, whichever is later"],
  ["If a couple postpones", "The term moves later with them. It never moves earlier"],
  ["After that", "Keepsake mode: read-only, with a one-click export they own, for as long as the service exists"],
  ["If your agreement ends", "Any workspace already opened keeps its full term and its Keepsake. Only new invitations stop"],
  ["If a couple cancels or moves venue", "You release the workspace. The couple keeps their content. Your name and branding come off within 24 hours"],
  ["Your place", "Held 14 days from the date of the proposal. Extendable by me, personally"],
  ["Your number", "01/25 through 25/25, assigned when your payment clears, not on signature"],
  ["The couple", "Never pays and never sees a price"],
];

// ── Rung 4 · what you see, and what you never see ──────────────────

/**
 * Three parts. They travel together. The third is required, not decorative.
 * AT_LAUNCH is verbatim with no variants: a venue must read the same sentence
 * on every surface. Banned inside it: "coming soon", "in the next release",
 * "we're working on", "phase two", any version number, any month, any feature
 * name, anything that invites the venue to ask when.
 */
export const PRIVACY = {
  seeLabel: "What you see.",
  see: "Which invitations you sent, and which couples opened them. Adoption figures across your couples as a group. Small numbers are held back so a figure can never point at one couple.",
  neverLabel: "What you never see.",
  never:
    "What any couple is planning. There is no per-couple row, no ranking and no list of who is behind. If a couple changes their wedding date, that does not appear anywhere. A postponement is their news to share.",
  launchLabel: "At launch.",
  launch:
    "At launch you see your invitations and who opened them. Adoption figures follow later in the year.",
} as const;

/** Objection C1. Not "you can but we ask you not to". You cannot. */
export const CAN_WE_SEE =
  "No. Not “you can, but we ask you not to”. You cannot, and neither can I in the ordinary course.";

/** Objection C11. The reason matters more than the answer. */
export const NO_NAMES =
  "No, and that one is deliberate. You get the total, not the names. If you could see who had not opened it, the next thing that happens is a coordinator chasing a couple about a gift, and then it is not a gift.";

/** Objection C12. */
export const POSTPONEMENT =
  "No. Wedding date changes are never surfaced anywhere.";

// ── Rung 5 · what it asks of your team ─────────────────────────────

export const TEAM_ASK =
  "One action. Invite the couple after they book. There is nothing to run, nothing to set up, and no training day.";

/** Objection B4. The coordinator is the one who can kill this. */
export const COORDINATOR =
  "That is the failure I am most trying to avoid. Support comes to me, not to your team. Your coordinator's whole job is one action.";

/** Objection B2. */
export const NOT_TECHNICAL =
  "Neither is the product. There is no setup, no configuration, nothing to name and nothing to learn before it is useful.";

/**
 * D-032, Option C. There is no venue login before 1 September. Say what
 * actually happens instead of naming a surface that does not exist.
 */
export const HOW_IT_REACHES_YOU =
  "Once the year is settled we send the codes and a short note you can pass to couples. You get a record of what was sent and what was opened. There is nothing to log into.";

// ── Rung 6 · what happens at the end ───────────────────────────────

/**
 * The access term. Never the bare figure. Prohibition P7 catches every bare
 * occurrence of "18 months" or "eighteen months".
 */
export const ACCESS_TERM =
  "18 months from when the couple opens it, or 3 months past the wedding, whichever is later.";

export const ACCESS_TERM_LONG =
  "18 months from when the couple opens it, or 3 months past the wedding, whichever is later. If they postpone, the term moves with them. It never moves earlier.";

/** D-010.3. "for as long as the service exists" is the permitted permanence. */
export const KEEPSAKE =
  "When a couple's planning term ends, their workspace stays open in Keepsake mode. Read-only, for as long as the service exists, with a one-click export they own.";

/** D-020.2. Stated unprompted, never held back for the objection. */
export const SURVIVAL =
  "Any workspace a couple has already opened keeps its full term, and its Keepsake, whatever happens to your agreement. Only new invitations stop.";

// ── Rung 7 · what being one of twenty-five means ───────────────────

export const FOUNDING_NUMBER =
  "01/25 through 25/25, assigned when your payment clears, not on signature. A number is not a licence. It is recognition.";

export const HOLD = "Your place is held for 14 days.";

export const ROADMAP =
  "Founding venues see new work before anyone else and can say what should change while it still can. Your requests are written down. Nothing is built for one venue.";

/** Objection F7. The honest answer. This is a strength, not a weakness. */
export const WHO_ELSE =
  "Nobody yet. I will tell you the true number every time you ask. There is no case study to send you and I am not going to dress that up.";

/** D-012.3. The front-facing geography term. Never the drive-time figure. */
export const GEOGRAPHY = "Limerick and the surrounding counties.";

// ── The ask. One per surface. ──────────────────────────────────────

/**
 * "Ask me a question." A second call to action is a defect, not an option.
 * Never "Get started", "Sign up", "Start your free trial".
 */
export const CTA = "Ask me a question";
/**
 * D5, estate consolidation 2026-08-12. Contact is an anchored section on
 * /about now. This href points at the destination directly and never at
 * the /contact 308: the Founding 25 conversion path does not ride a
 * redirect. Query params come before the fragment so the subject prefill
 * still reaches the server.
 */
export const CTA_HREF = "/about?subject=founding-venue#contact";
export const CTA_SUPPORT =
  "It goes to me, not a form. No deck, no demo gate.";

// ── The FAQ of record. Twelve questions, D-032 R3. ─────────────────

export const FAQ: ReadonlyArray<{ q: string; a: string }> = [
  { q: "What do our couples actually get?", a: WHAT_COUPLES_GET },
  { q: "How long do they have it?", a: ACCESS_TERM_LONG },
  {
    q: "How many couples does it cover?",
    a: "Every couple who books their wedding with you, for as long as your licence is current. The price does not change with the number of weddings you run.",
  },
  {
    q: "What does it cost?",
    a: "€1,000 a year, prepaid, including VAT at the prevailing rate. The standard rate is €1,500. As one of the Founding 25 you pay €500 a year less, for as long as you stay. That rate holds for as long as the agreement renews continuously without lapse. It follows the property, so it survives a sale or a rebrand.",
  },
  { q: "What does my team have to do?", a: TEAM_ASK },
  {
    q: "Can we see the couple's workspace?",
    a: "No. At launch you see your invitations and who opened them. Adoption figures follow later in the year. When they arrive they are across your couples as a group, with small numbers held back so a figure can never point at one couple. You never see what a couple is planning. There is no per-couple row, no ranking, and no list of who is behind. If a couple changes their wedding date, that does not appear anywhere. A postponement is their news to share.",
  },
  {
    q: "What if a couple wants to show us something?",
    a: "They send it to you, the same way they would send it to their florist. There is no setting on our side that opens a couple's workspace to a venue, and there is no request you can make that does it either.",
  },
  { q: "Does our branding go on it?", a: BRANDING },
  { q: "What happens after the wedding?", a: KEEPSAKE },
  { q: "What happens if we stop?", a: SURVIVAL },
  { q: "What if our couples just don't use it?", a: "Then you have spent €1,000 and learned something in one season. I am not going to give you an adoption percentage, because I do not have an honest one yet." },
  { q: "Who else is using it?", a: WHO_ELSE },
];

// ── The film slot. Placeholder until the film is rendered. ─────────

/**
 * No film file exists yet. signal-motion/out holds three half-resolution PNG
 * stills from a fixture, nothing more. The founder will supply the file later.
 *
 * The slot is built to the spec already ratified for the private film page:
 * poster first, click to play, never autoplay, captions as .vtt.
 * 16x9 at 1920x1080 is the rendered master format.
 */
export const FILM = {
  aspect: "16 / 9",
  label: "The film",
  placeholder: "The venue film goes here.",
  note: "Two minutes. What a couple opens, and what you see.",
  posterAlt: "Placeholder for the Venue Edition film.",
} as const;

// ── Self-check list. Run against any surface that imports this. ────

/**
 * Prohibited, non-exhaustive. The machine checker only runs punctuation rules
 * on blockquote-scope surfaces, so em dashes and exclamation marks on a .tsx
 * page are NOT caught automatically. Check by hand.
 *
 *   P1  for life, forever, lifetime, in perpetuity, never expires, guaranteed
 *   P2  solicitor-approved, legally approved, reviewed by our legal team
 *   P3  GDPR-compliant, fully compliant, bank-grade, 100% secure
 *   P5  allotment, allotted, seat count, per-seat, codes remaining
 *   P6  no seats, unlimited couples, unlimited workspaces  [BLOCKED, R-016 open]
 *   P7  any bare "18 months" or "eighteen months"
 *   P12 + VAT, ex VAT, plus VAT, from EUR 1,000
 *   P13 act now, limited time, while places last, only N places left
 *   D-027.3  co-branded, venue-branded, your logo, welcome message
 *   D-001.4  couple separately consents, engagement metrics, your couples' activity
 *   voice  seamless, effortless, turnkey, world-class, best-in-class, transform
 *   voice  em dashes anywhere, exclamation marks anywhere
 *
 * Terminology. Say: the venue, the venue owner, the coordinator, their wedding
 * workspace, an invitation, the Founding 25, the founding rate, release.
 * Never: client, customer, partner, member, user, seat, portal, dashboard,
 * platform, subscription, discount, deal, early adopters, beta, pilot.
 *
 * "Venue Portal" never reaches a venue. The surface is the Signal Studio
 * account, and at launch there is nothing to log into at all.
 */
export const PROHIBITED_MARKER = true;
