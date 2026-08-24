export type CuratorCategory =
  | "hundred"
  | "social"
  | "venue"
  | "identity"
  | "exploration"
  | "remotion-hooks"
  | "motion"
  | "press";

export type CuratorAsset = {
  id: string;
  category: CuratorCategory;
  title: string;
  src?: string;
  videoSrc?: string;
  source: string;
  sourceHref?: string;
  motionPreview?: {
    number: string;
    closing: string;
    collection: string;
  };
};

export const DEFAULT_PREFERRED_ASSET_IDS = [
  "H-001", "H-009", "H-013", "H-016", "H-017", "H-018", "H-019", "H-020", "H-024", "H-030",
  "H-031", "H-035", "H-036", "H-038", "H-040", "H-041", "H-042", "H-045", "H-046", "H-047",
  "H-048", "H-050", "H-051", "H-052", "H-053", "H-054", "H-057", "H-059", "H-060", "H-061",
  "H-062", "H-064", "H-065", "H-066", "H-067", "H-068", "H-069", "H-070", "H-071", "H-072",
  "H-074", "H-075", "H-076", "H-077", "H-079", "H-080", "H-081", "H-084", "H-085", "H-086",
  "H-088", "H-090", "H-091", "S-001", "S-002", "S-003", "S-005", "S-007", "S-008", "S-010",
  "S-011", "S-012", "S-013", "S-014", "S-015", "S-016", "S-017", "S-018", "S-019", "S-020",
  "S-021", "S-022", "S-023", "S-025", "S-026", "V-002", "V-003", "V-004", "V-005", "V-006",
  "V-007", "V-008", "V-015", "I-001", "I-002", "I-004", "I-005", "I-007", "I-008", "E-001",
  "E-005", "E-006", "E-007", "E-008", "E-010", "E-013", "E-014", "E-015", "E-016", "E-019",
  "E-020", "E-029", "E-031", "R-003", "R-006", "R-010", "R-016", "R-017", "R-018",
  "R-031", "P-001", "P-002", "P-003", "P-004",
] as const;

export const CURATOR_CATEGORIES: Array<{
  key: CuratorCategory;
  label: string;
  shortLabel: string;
  description: string;
}> = [
  {
    key: "hundred",
    label: "The Hundred",
    shortLabel: "Hundred",
    description: "One hundred launch-ad and hook directions from the funding-deck exploration.",
  },
  {
    key: "social",
    label: "Social system",
    shortLabel: "Social",
    description: "Numbers, beliefs, before-and-after stories, founder notes, partner proof, and end cards.",
  },
  {
    key: "venue",
    label: "Venue & outreach",
    shortLabel: "Venue",
    description: "Sales, venue, ambassador, and permission-based outreach material.",
  },
  {
    key: "identity",
    label: "Identity & print",
    shortLabel: "Identity",
    description: "Founder cards, stationery, campaign identity, and practical brand applications.",
  },
  {
    key: "exploration",
    label: "Design explorations",
    shortLabel: "Explorations",
    description: "Retained alternatives for posters, cards, certificates, and founding-partner material.",
  },
  {
    key: "remotion-hooks",
    label: "Remotion hooks",
    shortLabel: "Hooks",
    description: "Sixty numbered social hook compositions from the Signal Motion library.",
  },
  {
    key: "motion",
    label: "Product & motion",
    shortLabel: "Motion",
    description: "Product stills, film frames, email posters, and deck-cover directions.",
  },
  {
    key: "press",
    label: "Press",
    shortLabel: "Press",
    description: "Press-kit previews and founder-story editorial material.",
  },
];
function humanise(value: string) {
  return value
    .replace(/\.[^.]+$/, "")
    .replace(/-(preview|ig-square|li-landscape|ig-story|ig-portrait)$/, "")
    .replace(/^(s\d+)-/, "$1 · ")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function makeAssets(
  category: CuratorCategory,
  prefix: string,
  root: string,
  files: string[],
): CuratorAsset[] {
  return files.map((file, index) => ({
    id: `${prefix}-${String(index + 1).padStart(3, "0")}`,
    category,
    title: humanise(file),
    src: `${root}/${file}`,
    source: `${root.replace(/^\//, "")}/${file}`,
  }));
}

const hundred: CuratorAsset[] = Array.from({ length: 100 }, (_, index) => {
  const number = String(index + 1).padStart(3, "0");
  return {
    id: `H-${number}`,
    category: "hundred" as const,
    title: `Direction ${number}`,
    src: `/brand/assets/ads/w/ad-${number}.webp`,
    source: `brand/assets/ads/w/ad-${number}.webp`,
  };
});

const socialBases = [
  "s1-number-n01",
  "s1-number-n02",
  "s1-number-n03",
  "s2-belief-b00",
  "s2-belief-b01",
  "s2-belief-b02",
  "s2-belief-b03",
  "s2-belief-b04",
  "s2-belief-b05",
  "s2-belief-b06",
  "s2-belief-b07",
  "s2-belief-b08",
  "s2-belief-b09",
  "s3-beforeafter-owner",
  "s3-beforeafter-schedule",
  "s3-beforeafter-unread",
  "s4-partner-sp01",
  "s5-foundernote-quote01",
  "s6-endcard-notes",
  "s6-endcard-signal",
  "s6-endcard-suite",
  "s6-endcard-tasks",
  "s6-endcard-timeline",
].map((name) => `${name}-ig-square.png`);

const social = makeAssets(
  "social",
  "S",
  "/brand/collateral/social",
  [
    ...socialBases,
    "banner-default-li-company-banner.png",
    "banner-default-li-personal-banner.png",
    "banner-default-x-header.png",
  ],
);

const venue = makeAssets("venue", "V", "/brand/collateral", [
  "venue/demo-script-preview.png",
  "venue/permission-form-preview.png",
  "venue/pilot-card-preview.png",
  "venue/pricing-explainer-preview.png",
  "venue/venue-deck-preview.png",
  "venue/venue-leavebehind-preview.png",
  "venue/venue-onepager-prepared-preview.png",
  "venue/venue-onepager-preview.png",
  "ambassador/k0-welcome-preview.png",
  "ambassador/k1-onboarding-preview.png",
  "ambassador/k2-agm-preview.png",
  "ambassador/k2-ball-preview.png",
  "ambassador/k2-campaign-preview.png",
  "ambassador/k2-trip-preview.png",
  "ambassador/k3-qr-card-preview.png",
  "ambassador/k4-notebook-spec-preview.png",
]);

const identity = makeAssets("identity", "I", "/brand/collateral/identity", [
  "cafe-card-preview.png",
  "campaign-poster-preview.png",
  "email-signature-preview.png",
  "founder-card-back-preview.png",
  "founder-card-front-dark-preview.png",
  "founder-card-front-light-preview.png",
  "founder-card-front-preview.png",
  "fp-card-preview.png",
  "letterhead-preview.png",
]);

const explorationFiles = [
  "cards/cardx-broadcast-back-preview.png",
  "cards/cardx-broadcast-front-preview.png",
  "cards/cardx-dot-back-preview.png",
  "cards/cardx-dot-front-preview.png",
  "cards/cardx-duo-back-preview.png",
  "cards/cardx-duo-front-preview.png",
  "cards/cardx-indigo-back-preview.png",
  "cards/cardx-indigo-front-preview.png",
  "cards/cardx-ink-back-preview.png",
  "cards/cardx-ink-front-preview.png",
  "cards/cardx-paper-back-preview.png",
  "cards/cardx-paper-front-preview.png",
  "explorations/cafex-belief-preview.png",
  "explorations/cafex-campaign-preview.png",
  "explorations/cafex-indigo-preview.png",
  "explorations/cafex-ink-preview.png",
  "explorations/fpx-certificate-back-preview.png",
  "explorations/fpx-certificate-front-preview.png",
  "explorations/fpx-indigo-back-preview.png",
  "explorations/fpx-indigo-front-preview.png",
  "explorations/fpx-numeral-back-preview.png",
  "explorations/fpx-numeral-front-preview.png",
  "explorations/fpx-seal-back-preview.png",
  "explorations/fpx-seal-front-preview.png",
  "explorations/posterx-dot-preview.png",
  "explorations/posterx-indigo-preview.png",
  "explorations/posterx-ink-preview.png",
  "explorations/posterx-paper-preview.png",
  "explorations/slide-30/option-01-proof-mark.png",
  "explorations/slide-30/option-02-indigo-edition.png",
  "explorations/slide-30/option-03-proof-ledger.png",
  "explorations/slide-30/option-05-founders-circle.png",
];

const explorations = makeAssets(
  "exploration",
  "E",
  "/brand/collateral",
  explorationFiles,
);

const motion = [
  ...makeAssets("motion", "M", "/brand/assets/motion", [
    "analytics-demo.png",
    "analytics-thumb.png",
    "analytics.png",
    "notes-demo.png",
    "notes-thumb.png",
    "notes.png",
    "roadmap-demo.png",
    "roadmap-thumb.png",
    "roadmap.png",
    "signal-demo.png",
    "suite-thumb.png",
    "suite.png",
    "tasks-demo.png",
    "tasks-thumb.png",
    "tasks.png",
    "timeline-demo.png",
  ]),
  ...makeAssets("motion", "EM", "/email-assets", [
    "poster-schools.png",
    "poster-venues.png",
    "product-still.png",
  ]),
  ...makeAssets("motion", "D", "/hq/deck-thumbs", [
    "deck-loan.jpg",
    "deck-market-entry.jpg",
    "deck-motion-brief.jpg",
    "deck-one-pagers.jpg",
    "deck-pitch.jpg",
    "deck-plan.jpg",
  ]),
];

const remotionHookDefinitions = [
  ["01", "The Dashboard Collapse", "Three things worth knowing.", "01"],
  ["02", "Nothing To Flag", "Nothing to flag today.", "01"],
  ["03", "Thought To Signal", "From thought to signal.", "01"],
  ["04", "Catch The Thought", "Write it before it disappears.", "01"],
  ["05", "Only What You Choose", "Only what you choose moves.", "01"],
  ["06", "Work In Plain English", "Work, in plain English.", "01"],
  ["07", "The Missing Confetti", "Done should feel like done.", "01"],
  ["08", "Direction Is Saying No", "Direction is also saying no.", "01"],
  ["09", "Share The Plan", "Share the plan. Not the tool.", "01"],
  ["10", "Four Gestures One Studio", "One studio. Four clear moves.", "01"],
  ["11", "The Quiet Inbox", "What matters stays.", "03"],
  ["12", "The Deadline That Refused To Scream", "Urgent can still be clear.", "03"],
  ["13", "The Honest Progress Bar", "Progress should mean something.", "02"],
  ["14", "No One Has To Ask", "Clarity is a kindness.", "03"],
  ["15", "The Smallest Useful Number", "Not everything needs a metric.", "03"],
  ["16", "The Cursor Changes Its Mind", "Thinking is part of the work.", "02"],
  ["17", "The Empty State Works", "Empty is a valid state.", "03"],
  ["18", "The Red Dot Retires", "Attention should run out.", "02"],
  ["19", "The List Loses Weight", "Your list should get lighter.", "03"],
  ["20", "Read Without Opening", "Know enough. Keep moving.", "03"],
  ["21", "Change It Once", "Change it once.", "02"],
  ["22", "The Handoff Has Memory", "Context should travel too.", "03"],
  ["23", "A Thought Gains An Owner", "Ideas move when ownership appears.", "02"],
  ["24", "The Thread Ties Itself", "One piece of work. Kept together.", "03"],
  ["25", "The Comment Finds Its Work", "Context belongs with the work.", "03"],
  ["26", "The Meeting Leaves One Line", "The meeting can end now.", "04"],
  ["27", "A Note Becomes A Date", "Intent needs a place in time.", "04"],
  ["28", "The Plan Survives The Meeting", "Discussion ends. Direction stays.", "02"],
  ["29", "One Delay Doesn't Become Ten", "Only connected work moves.", "04"],
  ["30", "Four Products, No Seams", "Different views. Same work.", "04"],
  ["31", "The Week Folds", "The week, made clear.", "04"],
  ["32", "Move The Date, Not The World", "Move the date. Keep the plan.", "02"],
  ["33", "The Day Has An Edge", "Today is enough.", "04"],
  ["34", "The Future Gets Smaller", "Make the future actionable.", "04"],
  ["35", "The Last Loose End", "Nothing left hanging.", "04"],
  ["36", "The Decision Draws A Border", "A decision creates shape.", "04"],
  ["37", "The Quiet Yes", "Approved. Keep going.", "04"],
  ["38", "The Versions Become One", "Decide, then continue.", "05"],
  ["39", "The Moment It Became Done", "Done has a moment.", "05"],
  ["40", "Undo Leaves No Scar", "Change your mind safely.", "05"],
  ["41", "Private Means Private", "Private means private.", "02"],
  ["42", "Share Less. Say More.", "Give people what they need.", "05"],
  ["43", "The Link Explains Itself", "A link with context.", "05"],
  ["44", "Two People, One Answer", "Shared truth beats shared confusion.", "05"],
  ["45", "Permissions Without Theatre", "Access should be obvious.", "05"],
  ["46", "The Public Line", "The plan is public. The work is yours.", "05"],
  ["47", "The Edit Leaves A Trace", "Change without losing context.", "05"],
  ["48", "The Context Comes With It", "No naked tasks.", "05"],
  ["49", "The Plan Folds Into A Pocket", "The plan comes with you.", "06"],
  ["50", "No New Account Required", "No new account required.", "02"],
  ["51", "The Good Kind Of Boring", "Reliable is beautiful.", "06"],
  ["52", "The Interface Steps Back", "The work is the product.", "06"],
  ["53", "Not Another Status Meeting", "The update already exists.", "06"],
  ["54", "The Calm After Capture", "Captured. You can let go.", "06"],
  ["55", "The Briefing Blinks Once", "Attention when it matters.", "06"],
  ["56", "Put It Where Tomorrow Can Find It", "Future you will know.", "06"],
  ["57", "The Plan Breathes", "Clarity needs room.", "06"],
  ["58", "This Is Not A Notification", "Don't alert me. Tell me.", "06"],
  ["59", "The Dot Spends Itself", "The dot spends itself on clarity.", "02"],
  ["60", "The Work Leaves Quietly", "Finished work should get out of the way.", "06"],
] as const;

const remotionHooks: CuratorAsset[] = remotionHookDefinitions.map(
  ([number, title, closing, collection]) => {
    const branch = collection === "01"
      ? "feat/social-hooks-collection"
      : collection === "02"
        ? "feat/social-hooks-collection-02"
        : "feat/social-hooks-remaining-40";
    const folder = collection === "01"
      ? "social-hooks"
      : collection === "02"
        ? "social-hooks-collection-02"
        : "social-hooks-remaining";
    return {
      id: `R-${number.padStart(3, "0")}`,
      category: "remotion-hooks",
      title,
      src: `/brand/assets/remotion-hooks/r-${number.padStart(3, "0")}.png`,
      videoSrc: `/brand/assets/remotion-hooks/r-${number.padStart(3, "0")}.mp4`,
      source: `signal-motion/${folder} · ${branch}`,
      sourceHref: `https://github.com/ethanmcn2013-droid/signal-motion/tree/${branch}/src/compositions/${folder}`,
      motionPreview: { number, closing, collection },
    };
  },
);

const press = makeAssets("press", "P", "/brand/press", [
  "facts-sheet-preview.png",
  "founder-story-preview.png",
  "press-release-preview.png",
  "usage-notes-preview.png",
]);

export const CURATOR_ASSETS: CuratorAsset[] = [
  ...hundred,
  ...social,
  ...venue,
  ...identity,
  ...explorations,
  ...remotionHooks,
  ...motion,
  ...press,
];
