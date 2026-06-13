export type VenueBatch = "A" | "B" | "C";

export type VenueStatus =
  | "not-ready"
  | "ready-unsent"
  | "sent"
  | "warm-reply"
  | "meeting"
  | "paid"
  | "later"
  | "no";

export type VenueTarget = {
  rank: number;
  slug: string;
  name: string;
  county: string;
  batch: VenueBatch;
  targetRole: string;
  status: VenueStatus;
  readiness: string;
  sourceUrl: string;
  contactPath: string;
  fit: string;
  friction: string;
  openingObservation: string;
  firstLine: string;
  proofAsset: string;
  risk: string;
  nextAction: string;
  links: {
    source: string;
    venuePage: string;
    demo: string;
    contact: string;
  };
};

export type OutreachGate = {
  name: string;
  state: "open" | "blocked" | "ready";
  owner: string;
  detail: string;
};

export type CreativeProductionItem = {
  step: number;
  output: string;
  state: "open" | "blocked" | "ready";
  owner: string;
  nextAction: string;
  source: string;
};

export type BatchAEmailDraft = {
  venueSlug: string;
  venueName: string;
  batch?: VenueBatch;
  state: "held" | "ready-unsent";
  subject: string;
  firstLine: string;
  proofDependency: string;
  source: string;
};

export type VenueConversionLedgerRow = {
  venueSlug: string;
  venueName: string;
  batch: VenueBatch;
  status: "not-started" | "ready-unsent" | "sent" | "warm-reply" | "meeting" | "paid" | "later" | "no";
  contactPathState: string;
  email1SentAt: string;
  followup1SentAt: string;
  followup2SentAt: string;
  replyState: "none" | "warm" | "meeting" | "paid" | "later" | "no";
  callDate: string;
  signerPresent: "unknown" | "yes" | "no";
  priceDiscussed: "no" | "yes";
  nextAction: string;
};

export type VenueFulfilmentRehearsalStep = {
  step: number;
  name: string;
  state: "ready" | "blocked" | "manual";
  command: string;
  proof: string;
};

export type VenueFaqObjection = {
  objection: string;
  answer: string;
  useWhen: string;
};

export const VENUE_CAMPAIGN = "founding_venue_2026_q2";

const BASE_URL = "https://signalstudio.ie";

function trackedUrl(path: string, venue: string, artifact: string) {
  const params = new URLSearchParams({
    source: "founder_email",
    campaign: VENUE_CAMPAIGN,
    audience: "venue",
    artifact,
    touch: "email_1",
    venue,
  });

  return `${BASE_URL}${path}?${params.toString()}`;
}

function contactUrl(venue: string) {
  const params = new URLSearchParams({
    subject: "founding-venue",
    source: "founder_email",
    campaign: VENUE_CAMPAIGN,
    audience: "venue",
    artifact: "contact",
    touch: "email_1",
    venue,
  });

  return `${BASE_URL}/contact?${params.toString()}`;
}

function links(slug: string, source: string) {
  return {
    source,
    venuePage: trackedUrl("/venues", slug, "venue_page"),
    demo: trackedUrl("/venues/demo", slug, "venue_demo"),
    contact: contactUrl(slug),
  };
}

export const WAVE_ONE_OUTREACH_GATES: OutreachGate[] = [
  {
    name: "Founder assets",
    state: "blocked",
    owner: "founder",
    detail:
      "One-page PDF, 30 second proof video, 60 second venue walkthrough, and product capture frames approved.",
  },
  {
    name: "Demo dry run",
    state: "ready",
    owner: "operator",
    detail:
      "36/36 Wave 1 Signal-owned venue page, demo, and contact links returned HTTP 200 on 2026-05-27.",
  },
  {
    name: "Personalization pass",
    state: "open",
    owner: "operator",
    detail:
      "Opening observation and first line verified against the current official venue page before each send.",
  },
  {
    name: "Founder review",
    state: "open",
    owner: "founder",
    detail:
      "Batch A is read aloud once. Anything that sounds generic gets rewritten before email 1 exists.",
  },
];

export const VENUE_CREATIVE_PRODUCTION_CHECKLIST: CreativeProductionItem[] = [
  {
    step: 1,
    output: "Product capture frames",
    state: "open",
    owner: "founder/operator",
    nextAction:
      "Capture the eight proof frames: Notes, Tasks, Timeline, Signal, code redeem, venue eyebrow, and closing card.",
    source: "docs/strategy/VENUE_CREATIVE_PRODUCTION_PACK.md",
  },
  {
    step: 2,
    output: "30 second proof video",
    state: "blocked",
    owner: "founder",
    nextAction:
      "Edit the 30 second no-CTA proof cut from the exact timeline and approved product frames.",
    source: "docs/strategy/VENUE_CREATIVE_PRODUCTION_PACK.md",
  },
  {
    step: 3,
    output: "One-page PDF",
    state: "blocked",
    owner: "founder",
    nextAction:
      "Design the A4 one-pager using the venue eyebrow frame, four-layer product summary, mechanic, and plain pricing.",
    source: "docs/strategy/VENUE_CREATIVE_PRODUCTION_PACK.md",
  },
  {
    step: 4,
    output: "60 second walkthrough",
    state: "blocked",
    owner: "founder",
    nextAction:
      "Cut the extended venue walkthrough after the 30 second proof video is tight.",
    source: "docs/strategy/VENUE_CREATIVE_PRODUCTION_PACK.md",
  },
  {
    step: 5,
    output: "Batch A email drafts",
    state: "open",
    owner: "operator",
    nextAction:
      "Read the four held drafts aloud after the video and PDF exist; rewrite anything that sounds generic.",
    source: "docs/strategy/VENUE_BATCH_A_EMAIL_DRAFTS.md",
  },
  {
    step: 6,
    output: "Tracked link dry run",
    state: "ready",
    owner: "operator",
    nextAction:
      "Keep the dry-run note. Recheck official venue contact routes on the actual send day.",
    source: "docs/strategy/VENUE_LINK_DRY_RUN_2026_05_27.md",
  },
];

export const BATCH_A_EMAIL_DRAFTS: BatchAEmailDraft[] = [
  {
    venueSlug: "tankardstown",
    venueName: "Tankardstown House",
    batch: "A",
    state: "held",
    subject: "A planning layer for Tankardstown couples",
    firstLine:
      "I was looking at how Tankardstown frames the house, gardens, Orangery, and guest stay as one experience.",
    proofDependency: "30 second proof video and one-page PDF",
    source: "docs/strategy/VENUE_BATCH_A_EMAIL_DRAFTS.md",
  },
  {
    venueSlug: "ballymagarvey",
    venueName: "Ballymagarvey Village",
    batch: "A",
    state: "held",
    subject: "A planning layer for Ballymagarvey couples",
    firstLine:
      "Ballymagarvey already sells the feeling of a private, carefully held wedding.",
    proofDependency: "30 second proof video and one-page PDF",
    source: "docs/strategy/VENUE_BATCH_A_EMAIL_DRAFTS.md",
  },
  {
    venueSlug: "clonabreany",
    venueName: "Clonabreany House",
    batch: "A",
    state: "held",
    subject: "A planning layer for Clonabreany couples",
    firstLine:
      "Clonabreany feels like a venue where guests, rooms, suppliers, and final details all meet in one place.",
    proofDependency: "30 second proof video and one-page PDF",
    source: "docs/strategy/VENUE_BATCH_A_EMAIL_DRAFTS.md",
  },
  {
    venueSlug: "boyne-hill",
    venueName: "Boyne Hill House Estate",
    batch: "A",
    state: "held",
    subject: "A planning layer for Boyne Hill couples",
    firstLine:
      "Boyne Hill sells a private-estate experience; the couple-side planning should feel just as private and composed.",
    proofDependency: "30 second proof video and one-page PDF",
    source: "docs/strategy/VENUE_BATCH_A_EMAIL_DRAFTS.md",
  },
];

export const BATCH_BC_EMAIL_DRAFTS: BatchAEmailDraft[] = [
  {
    venueSlug: "the-millhouse",
    venueName: "The Millhouse",
    batch: "B",
    state: "held",
    subject: "A planning layer for The Millhouse couples",
    firstLine:
      "The Millhouse looks built for couples who care about detail; Signal gives that detail one calm home from booking to final handoff.",
    proofDependency: "30 second proof video and one-page PDF",
    source: "docs/strategy/VENUE_BATCH_BC_EMAIL_DRAFTS.md",
  },
  {
    venueSlug: "rathsallagh",
    venueName: "Rathsallagh House",
    batch: "B",
    state: "held",
    subject: "A planning layer for Rathsallagh couples",
    firstLine:
      "Because Rathsallagh is owner-managed and one-wedding-at-a-time, the planning handoff should feel just as singular.",
    proofDependency: "30 second proof video and one-page PDF",
    source: "docs/strategy/VENUE_BATCH_BC_EMAIL_DRAFTS.md",
  },
  {
    venueSlug: "bellingham-castle",
    venueName: "Bellingham Castle",
    batch: "B",
    state: "held",
    subject: "A planning layer for Bellingham Castle couples",
    firstLine:
      "Bellingham already gives couples a very personal castle handoff; Signal keeps the repeated planning questions organised without making the service feel less personal.",
    proofDependency: "30 second proof video and one-page PDF",
    source: "docs/strategy/VENUE_BATCH_BC_EMAIL_DRAFTS.md",
  },
  {
    venueSlug: "darver-castle",
    venueName: "Darver Castle",
    batch: "B",
    state: "held",
    subject: "A planning layer for Darver couples",
    firstLine:
      "Darver's one-wedding-per-day promise is exactly the kind of service Signal should sit behind: one current plan, one calm handoff.",
    proofDependency: "30 second proof video and one-page PDF",
    source: "docs/strategy/VENUE_BATCH_BC_EMAIL_DRAFTS.md",
  },
  {
    venueSlug: "markree-castle",
    venueName: "Markree Castle",
    batch: "C",
    state: "held",
    subject: "A planning layer for Markree Castle couples",
    firstLine:
      "Markree's destination-castle promise makes the planning layer matter early; Signal gives the couple and venue one current picture before the weekend begins.",
    proofDependency: "destination/castle proof asset",
    source: "docs/strategy/VENUE_BATCH_BC_EMAIL_DRAFTS.md",
  },
  {
    venueSlug: "castle-leslie",
    venueName: "Castle Leslie Estate",
    batch: "C",
    state: "held",
    subject: "A planning layer for Castle Leslie couples",
    firstLine:
      "Castle Leslie's estate scale makes planning calm part of the guest experience; Signal keeps the couple-side plan current without adding another admin burden.",
    proofDependency: "estate-scale proof asset",
    source: "docs/strategy/VENUE_BATCH_BC_EMAIL_DRAFTS.md",
  },
  {
    venueSlug: "cliff-at-lyons",
    venueName: "Cliff at Lyons",
    batch: "C",
    state: "held",
    subject: "A planning layer for Cliff at Lyons couples",
    firstLine:
      "Cliff at Lyons feels like a venue where the planning layer should flex with the event, from intimate wedding to fuller estate flow.",
    proofDependency: "split-scenario proof asset",
    source: "docs/strategy/VENUE_BATCH_BC_EMAIL_DRAFTS.md",
  },
  {
    venueSlug: "kilkea-castle",
    venueName: "Kilkea Castle",
    batch: "C",
    state: "held",
    subject: "A planning layer for Kilkea Castle couples",
    firstLine:
      "Kilkea already promises couples a guided planning experience; Signal gives that planner-led journey one calm workspace after booking.",
    proofDependency: "planner-led proof asset",
    source: "docs/strategy/VENUE_BATCH_BC_EMAIL_DRAFTS.md",
  },
];

export const VENUE_FULFILMENT_REHEARSAL: VenueFulfilmentRehearsalStep[] = [
  {
    step: 1,
    name: "Confirm signer, price, and venue eyebrow",
    state: "manual",
    command: "Founder confirms signer, annual amount, start date, and display name.",
    proof: "No code issuance before this is written in the ledger.",
  },
  {
    step: 2,
    name: "Payment lands",
    state: "blocked",
    command: "Invoice paid before sponsor is marked paid.",
    proof: "Cash in the door is the only revenue signal.",
  },
  {
    step: 3,
    name: "Create sponsor",
    state: "ready",
    command: "pnpm create:sponsor <slug> <name> <contact-email> [brand-meta-json]",
    proof: "Script validates slug, contact email, and optional JSON before insert.",
  },
  {
    step: 4,
    name: "Mark venue paid",
    state: "ready",
    command: "pnpm venue:paid <sponsor-slug> founding 1500 --founding",
    proof: "Writes annual amount, paid_at, term window, and founding lock.",
  },
  {
    step: 5,
    name: "Issue first code batch",
    state: "ready",
    command: "pnpm issue:codes <sponsor-slug> <count> venue_edition wedding 365",
    proof: "Dual-writes Studio audit and Tasks runtime comp codes.",
  },
  {
    step: 6,
    name: "Redeem one internal code",
    state: "manual",
    command: "Open /redeem/[CODE] in an incognito browser and reach the wedding workspace.",
    proof: "No self-serve price shown; venue eyebrow visible.",
  },
  {
    step: 7,
    name: "Partner digest",
    state: "ready",
    command: "pnpm partner:digest <sponsor-slug>",
    proof: "Summarises issued, redeemed, reached-board, and most recent redemption.",
  },
];

export const VENUE_FAQ_OBJECTIONS: VenueFaqObjection[] = [
  {
    objection: "Our couples already have planners.",
    answer:
      "Good planners benefit from one readable source of truth. Signal does not replace the planner; it gives the planner, couple, suppliers, and venue a calmer shared picture.",
    useWhen: "The venue hears this as overlap with planning services.",
  },
  {
    objection: "We do not want to run software.",
    answer:
      "You do not run it. The venue pays once, hands out codes, and Signal Studio supports the product. The venue is the sponsor, not the admin.",
    useWhen: "The buyer worries about operational lift.",
  },
  {
    objection: "What if couples do not use it?",
    answer:
      "Nothing breaks. The couples who use it get a materially calmer year; the venue loses nothing on couples who ignore the code. Usage is learned through the founding cohort.",
    useWhen: "The buyer wants adoption certainty before proof exists.",
  },
  {
    objection: "Can we see the couple workspace?",
    answer:
      "The couple workspace is private by default. The venue sees what the couple chooses to share: timeline, updates, and the artefacts that belong in the planning relationship.",
    useWhen: "The buyer asks about privacy and oversight.",
  },
  {
    objection: "Why annual instead of per couple?",
    answer:
      "The venue is not buying seats. It is backing the planning year for every couple it books. Annual prepay keeps the couple experience uninterrupted and keeps pricing away from the couple.",
    useWhen: "The buyer asks for per-couple pricing.",
  },
  {
    objection: "Who else uses it?",
    answer:
      "This is the founding cohort. The early venues are shaping the motion before there is a case study, which is why the first fifteen lock the founding price.",
    useWhen: "The buyer asks for social proof before it exists.",
  },
  {
    objection: "We are too busy right now.",
    answer:
      "That is fair. The right next step is not a demo; it is a calmer proof asset and one short conversation when planning bandwidth exists.",
    useWhen: "The venue has interest but no immediate time.",
  },
];

export const WAVE_ONE_VENUES: VenueTarget[] = [
  {
    rank: 1,
    slug: "tankardstown",
    name: "Tankardstown House",
    county: "Meath",
    batch: "A",
    targetRole: "Owner/operator or wedding manager",
    status: "not-ready",
    readiness: "Dossier ready; asset gated",
    sourceUrl: "https://www.tankardstown.ie/celebration-spaces.html",
    contactPath:
      "Official celebration or wedding enquiry route; use the venue form before any named contact.",
    fit:
      "Premium country-house venue with house, gardens, Orangery, accommodation, and a high-touch handoff after booking.",
    friction:
      "Multi-space guest flow, supplier detail, accommodation, and the final-month questions that tend to scatter across email.",
    openingObservation:
      "The Orangery and garden flow already read like a designed guest experience; the planning year should feel just as composed.",
    firstLine:
      "I was looking at how Tankardstown frames the house, gardens, Orangery, and guest stay as one experience; Signal is built for that same calm before the day.",
    proofAsset:
      "Venue demo plus 30 second proof video showing couple workspace, venue view, and supplier handoff.",
    risk:
      "Do not over-explain software. Lead with protecting the premium handoff the venue already sells.",
    nextAction:
      "Verify current Orangery and celebration-space language before Batch A review.",
    links: links(
      "tankardstown",
      "https://www.tankardstown.ie/celebration-spaces.html",
    ),
  },
  {
    rank: 2,
    slug: "ballymagarvey",
    name: "Ballymagarvey Village",
    county: "Meath",
    batch: "A",
    targetRole: "Owner/operator or wedding manager",
    status: "not-ready",
    readiness: "Dossier ready; asset gated",
    sourceUrl: "https://www.ballymagarvey.ie/your-wedding",
    contactPath:
      "Official wedding enquiry route; keep first touch to the public weddings path.",
    fit:
      "Wedding-led private estate positioning with a strong service promise and one couple experience to protect.",
    friction:
      "The promise of an uninterrupted day raises expectations for every planning touch before the wedding.",
    openingObservation:
      "A private, highly cared-for venue creates a lot of invisible planning traffic before the visible day.",
    firstLine:
      "Ballymagarvey already sells the feeling of a private, carefully held wedding; Signal is the planning layer that keeps that feeling intact after booking.",
    proofAsset:
      "Short proof video focused on stress-free planning, not feature volume.",
    risk:
      "Avoid sounding like a replacement for their team. Position Signal as the quiet workspace behind their service.",
    nextAction:
      "Verify current service and private-wedding language before Batch A review.",
    links: links("ballymagarvey", "https://www.ballymagarvey.ie/your-wedding"),
  },
  {
    rank: 3,
    slug: "clonabreany",
    name: "Clonabreany House",
    county: "Meath",
    batch: "A",
    targetRole: "Owner/operator or events lead",
    status: "not-ready",
    readiness: "Dossier ready; asset gated",
    sourceUrl: "https://clonabreanyhouse.ie/about/",
    contactPath:
      "Official venue enquiry or weddings contact path; confirm current public contact route before send.",
    fit:
      "Events-led country house with accommodation and a meaningful guest count, making planning logistics part of the product.",
    friction:
      "Accommodation, guest questions, supplier handoffs, and final headcount can become fragmented across multiple threads.",
    openingObservation:
      "Clonabreany has enough moving parts that one calm couple workspace could protect the handoff for both team and couple.",
    firstLine:
      "Clonabreany feels like a venue where the planning experience matters as much as the event itself because guests, rooms, suppliers, and details all meet in one place.",
    proofAsset:
      "Venue demo with a focus on timeline, guest notes, supplier tasks, and monthly planning rhythm.",
    risk:
      "Do not mention capacity unless it has been rechecked on the current official page.",
    nextAction:
      "Recheck accommodation and guest-count wording before Batch A review.",
    links: links("clonabreany", "https://clonabreanyhouse.ie/about/"),
  },
  {
    rank: 4,
    slug: "boyne-hill",
    name: "Boyne Hill House Estate",
    county: "Meath",
    batch: "A",
    targetRole: "Owner/operator or wedding coordinator",
    status: "not-ready",
    readiness: "Dossier ready; asset gated",
    sourceUrl: "https://www.boynehillhouse.ie/weddings/",
    contactPath:
      "Official weddings enquiry path; do not use any personal contact until independently verified.",
    fit:
      "Private estate positioning with multiple spaces and a high-emotion planning journey.",
    friction:
      "Estate-style weddings create options, guest movement, supplier dependencies, and repeated couple questions.",
    openingObservation:
      "A private estate wedding deserves a private planning layer rather than another scattered email thread.",
    firstLine:
      "Boyne Hill sells a private-estate experience; Signal is designed to keep the couple-side planning just as private, current, and composed.",
    proofAsset:
      "60 second venue walkthrough showing how a couple moves from timeline to task list to final-month signal.",
    risk:
      "Keep the note specific to the estate experience; generic wedding SaaS language will miss.",
    nextAction:
      "Verify current exclusive/private-estate wording before Batch A review.",
    links: links("boyne-hill", "https://www.boynehillhouse.ie/weddings/"),
  },
  {
    rank: 5,
    slug: "the-millhouse",
    name: "The Millhouse",
    county: "Meath",
    batch: "B",
    targetRole: "Owner/operator or wedding coordinator",
    status: "not-ready",
    readiness: "Dossier ready; asset gated",
    sourceUrl: "https://www.themillhouse.ie/",
    contactPath:
      "Official wedding enquiry route; confirm the correct form or inbox during pre-send review.",
    fit:
      "Exclusive-hire wedding venue with manor-house character, ceremony options, accommodation, and day-after potential.",
    friction:
      "Bespoke weddings and multi-day detail can sprawl unless the couple and venue share one live picture.",
    openingObservation:
      "The Millhouse feels strongest when couples are making the day their own; that is exactly when planning detail tends to sprawl.",
    firstLine:
      "The Millhouse looks built for couples who care about detail; Signal gives that detail one calm home from booking to final handoff.",
    proofAsset:
      "Venue demo using a bespoke wedding scenario with notes, tasks, timeline, and signal moving together.",
    risk:
      "Do not flatten the venue into a generic estate pitch. Keep the copy on detail, character, and handoff.",
    nextAction:
      "Capture current ceremony, accommodation, and day-after language for the Batch B draft.",
    links: links("the-millhouse", "https://www.themillhouse.ie/"),
  },
  {
    rank: 6,
    slug: "rathsallagh",
    name: "Rathsallagh House",
    county: "Wicklow",
    batch: "B",
    targetRole: "Owner/operator or wedding manager",
    status: "not-ready",
    readiness: "Dossier ready; asset gated",
    sourceUrl: "https://www.rathsallagh.com/weddings.html",
    contactPath:
      "Official wedding enquiry route; keep first touch to the public venue path.",
    fit:
      "Exclusive-use, owner-managed country-house venue with a one-wedding-at-a-time service promise.",
    friction:
      "A high-care promise can create a large volume of small questions that need one current answer.",
    openingObservation:
      "Because Rathsallagh is owner-managed and one-wedding-at-a-time, the planning handoff should feel just as singular.",
    firstLine:
      "Rathsallagh already makes the wedding feel privately held; Signal is the quiet planning workspace that helps keep that feeling intact before arrival.",
    proofAsset:
      "Proof video focused on reducing repeated questions while preserving personal service.",
    risk:
      "Never imply automation replaces the wedding manager. The value is fewer scattered updates.",
    nextAction:
      "Verify current exclusive-use and one-wedding-at-a-time wording before Batch B review.",
    links: links("rathsallagh", "https://www.rathsallagh.com/weddings.html"),
  },
  {
    rank: 7,
    slug: "bellingham-castle",
    name: "Bellingham Castle",
    county: "Louth",
    batch: "B",
    targetRole: "Owner/operator or wedding manager",
    status: "not-ready",
    readiness: "Dossier ready; asset gated",
    sourceUrl: "https://www.bellinghamcastle.ie/weddings/castle-weddings-venues",
    contactPath:
      "Official weddings enquiry route; public form first, named contact only if current and verified.",
    fit:
      "Exclusive-use castle venue with a visible coordinator promise and a likely high volume of planning questions.",
    friction:
      "Repeated planning emails, room questions, supplier dependencies, and castle-weekend detail can pile up on the team.",
    openingObservation:
      "Their public planning FAQ makes the planning-email load visible; Signal can make that service easier to sustain.",
    firstLine:
      "Bellingham already gives couples a very personal castle handoff; Signal is a way to keep the repeated planning questions organised without making the service feel less personal.",
    proofAsset:
      "30 second proof video showing repeated questions resolved inside a shared couple workspace.",
    risk:
      "Be careful with FAQ-specific claims unless rechecked the same day as the send.",
    nextAction:
      "Recheck public FAQ and coordinator wording before Batch B review.",
    links: links(
      "bellingham-castle",
      "https://www.bellinghamcastle.ie/weddings/castle-weddings-venues",
    ),
  },
  {
    rank: 8,
    slug: "darver-castle",
    name: "Darver Castle",
    county: "Louth",
    batch: "B",
    targetRole: "Owner/operator or wedding team lead",
    status: "not-ready",
    readiness: "Dossier ready; asset gated",
    sourceUrl: "https://darvercastle.ie/",
    contactPath:
      "Official wedding enquiry route; use generic venue path unless a current public team contact is confirmed.",
    fit:
      "Family-run, exclusive-use castle wedding venue with one-wedding-per-day positioning and strong on-site accommodation.",
    friction:
      "Large weddings need calm guest, room, supplier, menu, and final-detail coordination before the day.",
    openingObservation:
      "One wedding per day is a strong promise; Signal is about carrying that feeling into the months before.",
    firstLine:
      "Darver's one-wedding-per-day promise is exactly the kind of service Signal should sit behind: one current plan, one calm handoff, no scattered version of the truth.",
    proofAsset:
      "Venue demo framed around one wedding, one board, and one final-month handoff.",
    risk:
      "Avoid any claim that makes Darver sound high-volume or impersonal.",
    nextAction:
      "Verify current one-wedding-per-day, room, and coordinator language before Batch B review.",
    links: links("darver-castle", "https://darvercastle.ie/"),
  },
  {
    rank: 9,
    slug: "markree-castle",
    name: "Markree Castle",
    county: "Sligo",
    batch: "C",
    targetRole: "Owner/operator or wedding manager",
    status: "not-ready",
    readiness: "Dossier ready; asset gated",
    sourceUrl: "https://www.markreecastle.ie/weddings",
    contactPath:
      "Official weddings enquiry route; destination-wedding angle needs current page verification.",
    fit:
      "Castle and destination-wedding positioning where remote couples need a calm, shared planning picture.",
    friction:
      "Destination planning, accommodation, travel questions, and supplier dependencies can create stale information fast.",
    openingObservation:
      "Destination castle weddings need one current picture for couple, venue, suppliers, and guests.",
    firstLine:
      "Markree's destination-castle promise makes the planning layer matter early; Signal gives couples and the venue one current picture before the weekend begins.",
    proofAsset:
      "Destination-wedding version of the demo with travel notes, supplier tasks, guest questions, and planning health.",
    risk:
      "Do not lead with local Meath proof; this account needs a destination/castle-specific proof asset.",
    nextAction:
      "Hold until the destination proof video is stronger, then verify current wedding wording.",
    links: links("markree-castle", "https://www.markreecastle.ie/weddings"),
  },
  {
    rank: 10,
    slug: "castle-leslie",
    name: "Castle Leslie Estate",
    county: "Monaghan",
    batch: "C",
    targetRole: "Owner/operator or wedding director",
    status: "not-ready",
    readiness: "Dossier ready; asset gated",
    sourceUrl: "https://www.castleleslie.com/weddings/",
    contactPath:
      "Official weddings enquiry route; do not approach until estate-scale proof asset is ready.",
    fit:
      "Large estate venue with one-wedding-per-day positioning and a high-touch team across menus, suppliers, and banquet detail.",
    friction:
      "Estate-scale planning creates many dependencies that need to stay current across couple, venue, and suppliers.",
    openingObservation:
      "When the team is already holding menus, banquet rhythm, and supplier detail, a shared couple plan becomes a service asset.",
    firstLine:
      "Castle Leslie's estate scale makes planning calm a real part of the guest experience; Signal is built to keep the couple-side plan current without adding another admin burden.",
    proofAsset:
      "Estate-scale 60 second walkthrough showing supplier rhythm, guest questions, and final-month readiness.",
    risk:
      "This is a prestige account. Do not send until the visual proof feels premium.",
    nextAction:
      "Hold for founder-approved estate proof and verify current one-wedding wording.",
    links: links("castle-leslie", "https://www.castleleslie.com/weddings/"),
  },
  {
    rank: 11,
    slug: "cliff-at-lyons",
    name: "Cliff at Lyons",
    county: "Kildare",
    batch: "C",
    targetRole: "Events/wedding lead",
    status: "not-ready",
    readiness: "Dossier ready; asset gated",
    sourceUrl: "https://cliffatlyons.ie/weddings/your-wedding-venue",
    contactPath:
      "Official weddings enquiry route; choose intimate or exclusive-use angle after current page review.",
    fit:
      "Estate wedding venue near Dublin with intimate and broader estate-use paths.",
    friction:
      "Different wedding scales require different planning rhythms, which can make generic tools feel clumsy.",
    openingObservation:
      "Cliff has two planning modes: intimate and fuller estate use. Signal can keep the couple side calm in either case.",
    firstLine:
      "Cliff at Lyons feels like a venue where the planning layer should flex with the event, from intimate wedding to fuller estate flow.",
    proofAsset:
      "Split-scenario demo: intimate wedding board and fuller-estate wedding board using the same Signal structure.",
    risk:
      "Avoid over-claiming exclusive-use details without current verification.",
    nextAction:
      "Verify current intimate and exclusive-use wording before Batch C review.",
    links: links(
      "cliff-at-lyons",
      "https://cliffatlyons.ie/weddings/your-wedding-venue",
    ),
  },
  {
    rank: 12,
    slug: "kilkea-castle",
    name: "Kilkea Castle",
    county: "Kildare",
    batch: "C",
    targetRole: "Wedding manager",
    status: "not-ready",
    readiness: "Dossier ready; asset gated",
    sourceUrl: "https://www.kilkeacastle.ie/weddings/",
    contactPath:
      "Official weddings enquiry route; use public venue path until a current contact is verified.",
    fit:
      "Castle estate with dedicated planner positioning and a clear promise of guided planning.",
    friction:
      "Planner-led service still needs one current view across couple tasks, supplier progress, guest details, and final checks.",
    openingObservation:
      "Kilkea's dedicated planner promise is exactly the kind of service Signal should sit behind, quietly.",
    firstLine:
      "Kilkea already promises couples a guided planning experience; Signal gives that planner-led journey one calm workspace after booking.",
    proofAsset:
      "Planner-led walkthrough showing venue view, couple view, and the final-month readiness score.",
    risk:
      "Do not pitch a new portal. Pitch a calmer service layer behind an existing premium planner promise.",
    nextAction:
      "Verify current planner, estate, and wedding package language before Batch C review.",
    links: links("kilkea-castle", "https://www.kilkeacastle.ie/weddings/"),
  },
];

export const WAVE_ONE_CONVERSION_LEDGER: VenueConversionLedgerRow[] =
  WAVE_ONE_VENUES.map((venue) => ({
    venueSlug: venue.slug,
    venueName: venue.name,
    batch: venue.batch,
    status: "not-started",
    contactPathState: "official path known; recheck on send day",
    email1SentAt: "—",
    followup1SentAt: "—",
    followup2SentAt: "—",
    replyState: "none",
    callDate: "—",
    signerPresent: "unknown",
    priceDiscussed: "no",
    nextAction:
      venue.batch === "A"
        ? "Hold until proof video, PDF, and founder read-aloud are complete."
        : "Hold until Batch A produces signal or founder approves moving wider.",
  }));
