/**
 * E12.13 — the post-booking couple welcome kit, as data.
 *
 * ── Who reads this ──────────────────────────────────────────────────────
 * A couple who has just booked a wedding. Not a venue. That single fact sets
 * every rule below.
 *
 *  - **The couple never sees a price** (D-001). No figure, no currency, no
 *    value, no "normally", no "free". "Free" states that a price exists and
 *    that somebody paid it, which puts the couple inside a commercial
 *    arrangement they were not part of.
 *  - **The venue's name is the only venue thing, and it appears once.** No
 *    logo, no colour, no venue-written message (D-027 point 3). The wording is
 *    `Compliments of <venue>`, which is the string the product itself already
 *    shows on first open, verified in
 *    `src/app/venues/couple-preview/page.tsx` and recorded in
 *    `evidence/E12.05-couple-experience-preview.md`. The printed object and the
 *    product say the same four words, so nothing a couple reads on paper is
 *    contradicted by the screen.
 *  - **Nothing is promised that is not built** (D-016).
 *
 * ── The Keepsake, stated plainly because this is where it would slip ─────
 * VERIFIED 2026-08-03: there is no Keepsake mode, state, route or component in
 * `app/src`, and no read-only state a workspace enters at the end of its term.
 * So there is no read-only mode, no Keepsake surface and no one-click export of
 * a wedding workspace. The greps, and a correction to the first one I ran, are
 * in `evidence/E12.10-E12.13-verification-run.txt` section 7.
 *
 * The only export that exists is `app/src/app/api/account/export/route.ts`, an account-level machine-readable
 * file covering the whole suite for a signed-in person. That is a data
 * portability route, not a keepsake a couple would recognise.
 *
 * So this kit says one true thing about the end and stops: the workspace does
 * not switch off the day after the wedding, because the term runs at least
 * three months past it (D-010.2, D-022). It does not describe what happens
 * afterwards, because what happens afterwards is not built.
 *
 * ── D-018: Signal Studio prints nothing ─────────────────────────────────
 * The welcome object ships as a print-ready file. The venue prints it, at its
 * own cost, or does not. Nothing here assumes a printed object exists, which
 * is why the email carries the whole message on its own.
 *
 * ── The onboarding sequence is described from the running code ──────────
 * `ONBOARDING_STEPS` below is a description of what actually happens, read out
 * of the two repositories on 2026-08-03, with each step marked built or not
 * built. It is not a plan. Where a step is administered by hand today, it says
 * so, because R-043 is open and there is no venue login.
 *
 * Pure and client-safe.
 */

/* ── Slots ──────────────────────────────────────────────────────────────── */

export const COUPLE_WELCOME_SLOT_IDS = [
  "venueName",
  "coupleGreeting",
  "code",
  "senderName",
] as const;

export type CoupleWelcomeSlotId = (typeof COUPLE_WELCOME_SLOT_IDS)[number];

export type CoupleWelcomeSlots = Record<CoupleWelcomeSlotId, string>;

export const COUPLE_WELCOME_SLOT_LABELS: Record<
  CoupleWelcomeSlotId,
  { label: string; hint: string; placeholder: string }
> = {
  venueName: {
    label: "Venue name",
    hint: "The trading name. It appears once on the card and once in the email, and nowhere else.",
    placeholder: "Glenmara House",
  },
  coupleGreeting: {
    label: "How the email opens",
    hint: "First names, as the venue writes to them. Left out of the printed card, which is handed over in person.",
    placeholder: "Mara and Finn",
  },
  code: {
    label: "Their code",
    hint: "Issued by Signal Studio for this couple. One code, one couple, never reused.",
    placeholder: "GLEN-4K2P-9XQD",
  },
  senderName: {
    label: "Who the email is from",
    hint: "The coordinator's own name. A couple should hear from a person they have met.",
    placeholder: "Aoife",
  },
};

export const EMPTY_COUPLE_WELCOME_SLOTS: CoupleWelcomeSlots = {
  venueName: "",
  coupleGreeting: "",
  code: "",
  senderName: "",
};

const UNFILLED = {
  venueName: "[venue name]",
  coupleGreeting: "[first names]",
  code: "[code]",
  senderName: "[your name]",
} as const;

function fill(slots: CoupleWelcomeSlots) {
  const trimmed = {
    venueName: slots.venueName.trim(),
    coupleGreeting: slots.coupleGreeting.trim(),
    code: slots.code.trim(),
    senderName: slots.senderName.trim(),
  };
  return {
    values: {
      venueName: trimmed.venueName || UNFILLED.venueName,
      coupleGreeting: trimmed.coupleGreeting || UNFILLED.coupleGreeting,
      code: trimmed.code || UNFILLED.code,
      senderName: trimmed.senderName || UNFILLED.senderName,
    },
    filled: Object.values(trimmed).every((v) => v.length > 0),
    missing: (Object.keys(trimmed) as CoupleWelcomeSlotId[]).filter(
      (k) => trimmed[k].length === 0,
    ),
  };
}

/** Where a couple goes. The one address on every surface in this kit. */
export const REDEEM_ORIGIN = "signalstudio.ie/redeem";

/* ── 1 · The printed welcome object ─────────────────────────────────────── */

export type WelcomeCard = {
  /** `Compliments of <venue>`. The only place the venue name appears. */
  attribution: string;
  headline: string;
  body: string[];
  /** The two steps, in order. */
  steps: string[];
  codeLabel: string;
  code: string;
  /** The single closing line. Names no company beyond the destination. */
  footer: string;
};

/**
 * A5, one side. The venue prints it or does not (D-018). It is handed over,
 * so it does not greet anybody by name and does not repeat what the
 * coordinator has just said.
 */
export function buildWelcomeCard(slots: CoupleWelcomeSlots): WelcomeCard {
  const { values } = fill(slots);
  return {
    attribution: `Compliments of ${values.venueName}`,
    headline: "A private place to plan the wedding.",
    body: [
      "Somewhere to write things down as you think of them, the work laid out so nothing sits in one person's head, and a plan you can share with your family and your suppliers.",
      "It is yours. We can see that you opened it. We cannot see what is in it.",
      "It does not switch off the day after the wedding.",
    ],
    steps: [
      `Go to ${REDEEM_ORIGIN}`,
      "Enter the code below. It opens ready to use.",
    ],
    codeLabel: "Your code",
    code: values.code,
    footer: "Signal Studio · signalstudio.ie",
  };
}

/* ── 2 · The approved email wording ─────────────────────────────────────── */

export type WelcomeEmail = {
  subject: string;
  /** Paragraphs, in order. Sent from the venue's own mail, as plain text. */
  body: string[];
  /** The sign-off line the coordinator edits into their own. */
  signOff: string;
  /** What a coordinator may and may not change. */
  editingRules: string[];
};

/**
 * The email a venue sends after a booking is confirmed. It is written to be
 * pasted into a venue's own mail client, so it carries no image, no button and
 * no tracked link. A tracked link in a venue's email would measure a couple on
 * a venue's behalf, and nothing in this programme grants that.
 *
 * One ask. E09.11 section 8: "Open your planning workspace", never "claim your
 * seat" or "redeem your code".
 */
export function buildWelcomeEmail(slots: CoupleWelcomeSlots): WelcomeEmail {
  const { values } = fill(slots);
  return {
    subject: "Something to help you plan",
    body: [
      `${values.coupleGreeting},`,
      "Now that the date is in the diary, here is something that comes with booking with us. It is a private place to plan the wedding: somewhere to write things down as you think of them, the work laid out so nothing sits in one person's head, and a plan you can share with your family and your suppliers.",
      `Go to ${REDEEM_ORIGIN} and enter this code: ${values.code}`,
      "It opens ready to use. There is nothing to set up and nothing to pay.",
      "One thing to say plainly. We can see that you opened it. We cannot see what is in it, and neither does anyone here. If you want us to see something, send it to us the same way you would send it to anyone else.",
      "It is run by Signal Studio rather than by us, so anything that goes wrong with it is theirs to fix, and there is a contact link inside it.",
    ],
    signOff: `${values.senderName}, ${values.venueName}`,
    editingRules: [
      "Say it in your own words. Keep the facts.",
      "Do not add how long they have it. That is set out in writing and it is not a number to say from memory.",
      "Do not add what it is worth, what it normally costs, or that it is free.",
      "Do not add anything about what happens after the wedding beyond what is written above.",
      "Do not attach a leaflet or a screenshot we have not seen.",
    ],
  };
}

/* ── 3 · The onboarding sequence ────────────────────────────────────────── */

export type OnboardingStep = {
  order: number;
  /** Who acts. */
  actor: "venue" | "couple" | "signal-studio";
  title: string;
  detail: string;
  /**
   * `built` means it runs today. `manual` means it happens, by hand, at Signal
   * Studio. `not-built` means it does not happen at all yet.
   */
  state: "built" | "manual" | "not-built";
  /** Where the state was read from. Never a plan, always a file or a route. */
  evidence: string;
};

/**
 * Read out of the running code on 2026-08-03. Each `evidence` field is the
 * place the claim came from, and the trace is in
 * `evidence/E12.10-E12.13-venue-artefacts.md` section 6.
 */
export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    order: 1,
    actor: "venue",
    title: "The booking is confirmed, and you ask us for a code",
    detail:
      "Today you email us. There is no login for your team and no self-service issuing, and that is a stated launch scope rather than a gap we have not noticed.",
    state: "manual",
    evidence: "R-043; Signal HQ administers issuing at launch (D-027 point 4)",
  },
  {
    order: 2,
    actor: "signal-studio",
    title: "We issue one code for that couple",
    detail:
      "One code, one couple, never reused. It is issued against your account so the couple's workspace is attributed to you without your name reaching anything the couple publishes.",
    state: "built",
    evidence: "src/lib/entitlements-db/codes.ts; src/app/hq/entitlements",
  },
  {
    order: 3,
    actor: "venue",
    title: "You send the email, or hand over the card",
    detail:
      "The wording is in this kit. The printed card is a file you print at your own cost if you want it, and the email says the whole thing on its own if you do not.",
    state: "built",
    evidence: "D-018; this module",
  },
  {
    order: 4,
    actor: "couple",
    title: "They open the code page and see your name",
    detail:
      "Your name is the first line on the page and it is the headline as well. This is the first of the four places your name appears on the couple's side.",
    state: "built",
    evidence: "src/app/redeem/[code]/page.tsx; E12.05 section on the four moments",
  },
  {
    order: 5,
    actor: "couple",
    title: "They create an account and the workspace opens",
    detail:
      "Your name sits above the form while they do it, with the code printed underneath. On first open they see one card saying who it came from, once, and it does not come back.",
    state: "built",
    evidence: "E12.05-couple-experience-preview.md, moments two and three",
  },
  {
    order: 6,
    actor: "couple",
    title: "They tell the product the wedding date, and the term widens",
    detail:
      "The date is asked for in the first run-through inside the product, not at the code page. Once it is set, access is recomputed to run at least three months past the day. It only ever moves later.",
    state: "built",
    evidence:
      "app/src/server/actions/planning.ts recomputeSponsoredAccessTermQuietly; app/src/server/db/sponsored-access-term.ts",
  },
  {
    order: 7,
    actor: "venue",
    title: "You see that the invitation was opened",
    detail:
      "That is the whole of what you see at this stage. Adoption figures follow later in the year.",
    state: "manual",
    evidence: "D-027 point 4; R-043, no venue-authenticated route exists",
  },
  {
    order: 8,
    actor: "couple",
    title: "After the wedding",
    detail:
      "The workspace does not switch off the day after. What happens at the end of the term is decided and not built, so nothing in this kit describes it to a couple.",
    state: "not-built",
    evidence:
      "no Keepsake mode, state or route in app/src, and no end-of-term read-only state; E11.09-10 finding F-5",
  },
];

/* ── Prose extraction, for the sweep ────────────────────────────────────── */

export function welcomeCardProse(card: WelcomeCard): string[] {
  return [
    card.attribution,
    card.headline,
    ...card.body,
    ...card.steps,
    card.codeLabel,
    card.footer,
  ];
}

export function welcomeEmailProse(email: WelcomeEmail): string[] {
  return [email.subject, ...email.body, email.signOff];
}

/** Everything a couple could read. The strictest set. */
export function coupleFacingProse(slots: CoupleWelcomeSlots): string[] {
  return [
    ...welcomeCardProse(buildWelcomeCard(slots)),
    ...welcomeEmailProse(buildWelcomeEmail(slots)),
  ];
}

/** The venue-facing half: the editing rules and the sequence. */
export function coupleWelcomeKitVenueProse(slots: CoupleWelcomeSlots): string[] {
  return [
    ...buildWelcomeEmail(slots).editingRules,
    ...ONBOARDING_STEPS.flatMap((step) => [step.title, step.detail]),
  ];
}

export function welcomeSlotsState(slots: CoupleWelcomeSlots) {
  const { filled, missing } = fill(slots);
  return { filled, missing };
}
