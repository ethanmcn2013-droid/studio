/**
 * The Make gallery — every lab, room, gallery, and shipped hero in one place,
 * each with an active thumbnail so the surface is scannable, not a list.
 *
 * Sources unified here: the design decision rooms (/hq/*), the brand galleries
 * (/brand/*.html), the shipped product heroes (timeline / notes / tasks /
 * signal + the umbrella), and the parked branch explorations. Thumbnails are
 * captured by scripts/hq-redesign/lab-thumbs.mjs into public/hq/lab-thumbs/.
 */

export type LabCategory = "product" | "decision" | "brand" | "system" | "parked";

export type LabState =
  | "LIVE"
  | "SHIPPED"
  | "REVIEW"
  | "DECIDED"
  | "APPROVED"
  | "SHORTLIST"
  | "BUILDING"
  | "GALLERY"
  | "PARKED";

export type Lab = {
  id: string; // thumbnail filename stem
  name: string;
  category: LabCategory;
  state: LabState;
  href: string;
  external?: boolean;
  /** URL the thumbnail script visits (defaults to href when same-origin). */
  captureUrl?: string;
  /** Whether the capturer needs the HQ session cookie (internal /hq routes). */
  authed?: boolean;
  where?: string;
  note: string;
  /** Set true once a real screenshot exists; false → branded poster tile. */
  hasThumb: boolean;
};

export const MAKE_SECTIONS: Array<{ category: LabCategory; label: string; blurb: string }> = [
  { category: "product", label: "Product heroes, live", blurb: "The front pages that shipped. Each one graduated from a lab." },
  { category: "decision", label: "Decision rooms", blurb: "Every object explored in directions, chosen, and recorded." },
  { category: "brand", label: "Brand galleries", blurb: "Every final asset, at every size, with print notes." },
  { category: "system", label: "Systems & productions", blurb: "Cross-product systems and the films with their own room." },
  { category: "parked", label: "Parked in the lab", blurb: "Runners-up kept on their branch. Nothing is thrown away." },
];

export const MAKE_LABS: Lab[] = [
  // ── Product heroes (live, external homepages) ──────────────────────
  {
    id: "hero-signal",
    name: "Signal · The Brief",
    category: "product",
    state: "LIVE",
    href: "https://signal.signalstudio.ie",
    external: true,
    captureUrl: "https://signal.signalstudio.ie",
    where: "analytics · main",
    note: "The broadsheet opener. Noise resolves into one signal. Chosen from five directions.",
    hasThumb: true,
  },
  {
    id: "hero-timeline",
    name: "Timeline · The Line",
    category: "product",
    state: "LIVE",
    href: "https://timeline.signalstudio.ie",
    external: true,
    captureUrl: "https://timeline.signalstudio.ie",
    where: "roadmap · main",
    note: "The line that holds a plan together. Graduated to the front page as R·33.",
    hasThumb: true,
  },
  {
    id: "hero-notes",
    name: "Notes",
    category: "product",
    state: "LIVE",
    href: "https://notes.signalstudio.ie",
    external: true,
    captureUrl: "https://notes.signalstudio.ie",
    where: "notes · main",
    note: "The notebook that keeps the quiet record. Live Notes marketing hero.",
    hasThumb: true,
  },
  {
    id: "hero-tasks",
    name: "Tasks",
    category: "product",
    state: "LIVE",
    href: "https://tasks.signalstudio.ie",
    external: true,
    captureUrl: "https://tasks.signalstudio.ie",
    where: "tasks · main",
    note: "Execution clarity for the 80% not in tech. Live Tasks marketing hero.",
    hasThumb: true,
  },
  {
    id: "hero-studio",
    name: "Signal Studio · umbrella",
    category: "product",
    state: "LIVE",
    href: "https://signalstudio.ie",
    external: true,
    captureUrl: "https://signalstudio.ie",
    where: "studio · main",
    note: "The umbrella home. Four small tools that read as one system.",
    hasThumb: true,
  },
  {
    id: "design-page",
    name: "The design page & motion canon",
    category: "product",
    state: "LIVE",
    href: "/design",
    captureUrl: "/design",
    where: "studio · main",
    note: "The dot narrative, five gestures, print plates. The public face of the design system.",
    hasThumb: true,
  },

  // ── Decision rooms (internal /hq, need login) ──────────────────────
  {
    id: "room-product-hero",
    name: "The Product Hero Room",
    category: "decision",
    state: "REVIEW",
    href: "/hq/product-hero-design-motion",
    authed: true,
    where: "6 candidates",
    note: "Signal is the reference. Six Notes, Tasks and Timeline candidates built and waiting for the product picks.",
    hasThumb: true,
  },
  {
    id: "room-cards",
    name: "The Founder Card",
    category: "decision",
    state: "DECIDED",
    href: "/hq/cards",
    authed: true,
    where: "trio chosen",
    note: "Ink, Indigo and Duo chosen from six. One reverse, QR on the front. Proof order packaged.",
    hasThumb: true,
  },
  {
    id: "room-partner-card",
    name: "The Founding Partner Card",
    category: "decision",
    state: "SHORTLIST",
    href: "/hq/partner-card",
    authed: true,
    where: "2 shortlisted",
    note: "Indigo and Numeral shortlisted from four. Founder-contact reverse carries the direct line.",
    hasThumb: true,
  },
  {
    id: "room-cafe-card",
    name: "The Café Card",
    category: "decision",
    state: "DECIDED",
    href: "/hq/cafe-card",
    authed: true,
    where: "Campaign chosen",
    note: "Campaign chosen from four. The poster's line at counter scale.",
    hasThumb: true,
  },
  {
    id: "room-poster",
    name: "The Campaign Poster",
    category: "decision",
    state: "DECIDED",
    href: "/hq/poster",
    authed: true,
    where: "Ink chosen",
    note: "Ink chosen from four grounds. Alternates archived, choosable per wall.",
    hasThumb: true,
  },
  {
    id: "room-slide-30",
    name: "Market-entry · Slide 30",
    category: "decision",
    state: "REVIEW",
    href: "/hq/slide-30-review",
    authed: true,
    where: "4 retained",
    note: "Four retained directions for the market-entry proof slide. Option 01 is the working slide.",
    hasThumb: true,
  },
  {
    id: "room-venue-kit",
    name: "The Venue Kit",
    category: "decision",
    state: "APPROVED",
    href: "/hq/venue-kit",
    authed: true,
    where: "7 objects",
    note: "Deck, pricing, outreach, script, permission form, pilot card, personalisation.",
    hasThumb: true,
  },
  {
    id: "room-socials",
    name: "The Posting Queue",
    category: "decision",
    state: "APPROVED",
    href: "/hq/socials",
    authed: true,
    where: "12 posts",
    note: "Twelve posts over six weeks. Cleared to schedule as written.",
    hasThumb: true,
  },

  // ── Brand galleries (public /brand/*.html) ─────────────────────────
  {
    id: "gallery-identity",
    name: "Identity & the card system",
    category: "brand",
    state: "GALLERY",
    href: "/brand/collateral/identity/index.html",
    captureUrl: "/brand/collateral/identity/index.html",
    where: "print-ready",
    note: "Cards, letterhead, poster, signature. Every final, with print notes.",
    hasThumb: true,
  },
  {
    id: "gallery-social",
    name: "The social system",
    category: "brand",
    state: "GALLERY",
    href: "/brand/collateral/social/index.html",
    captureUrl: "/brand/collateral/social/index.html",
    where: "every size",
    note: "S·1 to S·6 in every size. Nine beliefs, three numbers, before/afters, end cards, banners.",
    hasThumb: true,
  },
  {
    id: "gallery-press",
    name: "The press kit",
    category: "brand",
    state: "GALLERY",
    href: "/brand/press/index.html",
    captureUrl: "/brand/press/index.html",
    where: "embargoed",
    note: "Release, fact sheet, founder story, usage notes. Photography and screenshots pending.",
    hasThumb: true,
  },
  {
    id: "gallery-ambassador",
    name: "The ambassador kit",
    category: "brand",
    state: "GALLERY",
    href: "/brand/collateral/ambassador/index.html",
    captureUrl: "/brand/collateral/ambassador/index.html",
    where: "9 kits",
    note: "The letter, the guide, four templates, the QR card, the notebook spec.",
    hasThumb: true,
  },
  {
    id: "gallery-venue",
    name: "The venue set",
    category: "brand",
    state: "GALLERY",
    href: "/brand/collateral/venue/index.html",
    captureUrl: "/brand/collateral/venue/index.html",
    where: "print-ready",
    note: "One-pager, leave-behind, deck, pricing, pilot card.",
    hasThumb: true,
  },

  // ── Systems & productions (internal) ───────────────────────────────
  {
    id: "system-loading",
    name: "The loading canon",
    category: "system",
    state: "SHIPPED",
    href: "/hq/loading-review",
    authed: true,
    where: "all products · main",
    note: "Ten loading moments, one system: the 10px boundary dot, sub-120ms handoff, honest long-wait escalation.",
    hasThumb: true,
  },
  {
    id: "system-demo-film",
    name: "The demo film",
    category: "system",
    state: "BUILDING",
    href: "/hq/demo-film",
    authed: true,
    where: "demo-film · master",
    note: "One Wedding, Four Views. The 30-second hero product film. Scaffold and motion grammar live in HQ.",
    hasThumb: true,
  },

  // ── Parked in the lab (external branch links, poster tiles) ────────
  {
    id: "parked-notes-hero",
    name: "Notes hero lab · four directions",
    category: "parked",
    state: "REVIEW",
    href: "https://github.com/ethanmcn2013-droid/notes/tree/feat/notes-hero-lab",
    external: true,
    where: "notes · feat/notes-hero-lab",
    note: "Notebook First, Before It Fades, Three Seconds, The Crossing. Review only, not cleared for deploy.",
    hasThumb: false,
  },
  {
    id: "parked-timeline-line",
    name: "Timeline · The Link & Open Line",
    category: "parked",
    state: "PARKED",
    href: "https://github.com/ethanmcn2013-droid/roadmap/tree/feat/timeline-hero-lab",
    external: true,
    where: "roadmap · feat/timeline-hero-lab",
    note: "The runners-up behind The Line. Kept on the branch as alternate directions for the Timeline hero.",
    hasThumb: false,
  },
  {
    id: "parked-signal-five",
    name: "Signal · the five directions",
    category: "parked",
    state: "PARKED",
    href: "https://github.com/ethanmcn2013-droid/analytics/tree/feat/signal-hero-the-brief",
    external: true,
    where: "analytics · feat/signal-hero-the-brief",
    note: "The full five-direction exploration that produced The Brief. The record of how the opener was found.",
    hasThumb: false,
  },
  {
    id: "parked-umbrella-daily",
    name: "Umbrella · the Daily Signal",
    category: "parked",
    state: "PARKED",
    href: "https://github.com/ethanmcn2013-droid/studio/tree/direction-c-daily-signal",
    external: true,
    where: "studio · direction-c-daily-signal",
    note: "An experiment where the umbrella site is itself a daily briefing. Parked as a Studio homepage direction.",
    hasThumb: false,
  },
];

/** Thumbnail public path for a lab (background-image; poster shows if absent). */
export function labThumb(lab: Lab): string | undefined {
  return lab.hasThumb ? `/hq/lab-thumbs/${lab.id}.jpg` : undefined;
}

/** Monogram for the poster fallback tile. */
export function labMonogram(name: string): string {
  const cleaned = name.replace(/^The\s+/i, "");
  const parts = cleaned.split(/[·\s]+/).filter(Boolean);
  return (parts[0]?.[0] ?? "S").toUpperCase() + (parts[1]?.[0] ?? "").toUpperCase();
}
