export type CuratorCategory =
  | "hundred"
  | "social"
  | "venue"
  | "identity"
  | "exploration"
  | "motion"
  | "press";

export type CuratorAsset = {
  id: string;
  category: CuratorCategory;
  title: string;
  src: string;
  source: string;
};

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
  ...motion,
  ...press,
];
