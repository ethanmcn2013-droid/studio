/**
 * The HQ room registry — the single source of truth for what exists.
 *
 * Every room in Signal HQ has exactly one entry here. The shell nav, the
 * group landing pages, the Today group cards, the command palette, the
 * search index, and the registry contract test all render from this file.
 * A room exists iff it is listed here — `rooms.test.ts` fails CI when a
 * route directory and this registry disagree in either direction.
 *
 * Rules (docs/HQ_ARCHITECTURE.md §7, §11):
 *   - `route` is permanent. Rename `name` freely; never move URLs.
 *   - Every room belongs to exactly one group.
 *   - Lifecycle is metadata, not location: `decided` rooms collapse into
 *     the shelf on their landing page, `archived` rooms leave landings.
 *   - Branded names require plain-language `aliases` for the palette.
 *   - This file is client-safe pure data. No imports, no fs, no server.
 */

export type HqGroupKey = "sell" | "make" | "money" | "company" | "board";

export type HqRoomKind =
  | "console" // live operating surface over real data (CRM, access)
  | "room" // working room (marketing engine, experimentation room)
  | "artifact" // composed editorial surface (org, decks, review galleries)
  | "library" // document/reference index (vault, atlas)
  | "deck"; // embedded full-bleed deck

export type HqRoomLifecycle = "active" | "decided" | "archived";

export type HqRoom = {
  /** Route segment under /hq — equals the directory name, kebab-case. */
  slug: string;
  route: `/hq/${string}`;
  /** Display name. Renames are free; routes are not. */
  name: string;
  group: HqGroupKey;
  kind: HqRoomKind;
  lifecycle: HqRoomLifecycle;
  /** One plain sentence: the founder question this room answers. */
  summary: string;
  /** Plain-language palette synonyms ("customers" → CRM). */
  aliases?: string[];
  /** Rendered in the board register nav alongside Founders Circle. */
  boardVisible?: boolean;
  /** Slug of the room this one is subordinate to (atlas-map → atlas). */
  parent?: string;
};

export type HqGroup = {
  key: HqGroupKey;
  /** Nav label, lowercase, one plain word. */
  label: string;
  name: string;
  /** One-line gloss shown on Today and the landing page. */
  gloss: string;
  route: `/hq/${string}`;
};

export const HQ_GROUPS: HqGroup[] = [
  {
    key: "sell",
    label: "sell",
    name: "Sell",
    gloss: "Pipeline, venues, campaigns, and demand.",
    route: "/hq/sell",
  },
  {
    key: "make",
    label: "make",
    name: "Make",
    gloss: "Design rooms, assets, film, and the labs.",
    route: "/hq/make",
  },
  {
    key: "money",
    label: "money",
    name: "Money",
    gloss: "Numbers, capital, decks, and diligence.",
    route: "/hq/money",
  },
  {
    key: "company",
    label: "company",
    name: "Company",
    gloss: "The company itself: records, org, systems, access.",
    route: "/hq/company",
  },
  {
    key: "board",
    label: "board",
    name: "Board",
    gloss: "The shareholder-safe room.",
    route: "/hq/founders-circle",
  },
];

export const HQ_ROOMS: HqRoom[] = [
  // ── Sell ────────────────────────────────────────────────────────────
  {
    slug: "crm",
    route: "/hq/crm",
    name: "CRM",
    group: "sell",
    kind: "console",
    lifecycle: "active",
    summary:
      "Four lead books — venues, students, schools, small business — who to contact next and what is locked down.",
    aliases: [
      "customers",
      "pipeline",
      "prospects",
      "outreach",
      "follow up",
      "lead books",
      "leads",
      "students",
      "schools",
    ],
  },
  {
    slug: "venues",
    route: "/hq/venues",
    name: "Wave 1 venues",
    group: "sell",
    kind: "room",
    lifecycle: "active",
    summary: "Outreach prep for the first venue wave: batches, gates, drafts.",
    aliases: ["wave one", "venue command", "outreach gates"],
  },
  {
    slug: "venue-kit",
    route: "/hq/venue-kit",
    name: "Venue kit",
    group: "sell",
    kind: "artifact",
    lifecycle: "active",
    summary: "The revenue spine: deck, pricing, script, and permission form.",
    aliases: ["sales kit", "demo script", "pricing"],
  },
  {
    slug: "marketing",
    route: "/hq/marketing",
    name: "Marketing engine",
    group: "sell",
    kind: "room",
    lifecycle: "active",
    summary: "The six-month plan as a working hub of cleared approaches.",
    aliases: ["growth", "campaigns", "engine"],
  },
  {
    slug: "socials",
    route: "/hq/socials",
    name: "Posting queue",
    group: "sell",
    kind: "room",
    lifecycle: "active",
    summary: "Pre-approved social posts, two per week, deck-locked images.",
    aliases: ["social", "twitter", "posts"],
  },
  {
    slug: "market-entry",
    route: "/hq/market-entry",
    name: "Market entry deck",
    group: "sell",
    kind: "deck",
    lifecycle: "active",
    summary: "The 70-slide go-to-market plan.",
    aliases: ["gtm", "go to market"],
  },
  {
    slug: "waitlist",
    route: "/hq/waitlist",
    name: "Waitlist ledger",
    group: "sell",
    kind: "console",
    lifecycle: "active",
    summary: "Who signed up, from where, and for what use case.",
    aliases: ["signups", "leads"],
  },

  // ── Make ────────────────────────────────────────────────────────────
  {
    slug: "design-rooms",
    route: "/hq/design-rooms",
    name: "Design rooms",
    group: "make",
    kind: "room",
    lifecycle: "active",
    summary: "Every design decision room and gallery, with its verdict state.",
    aliases: ["design", "reviews", "galleries"],
  },
  {
    slug: "assets",
    route: "/hq/assets",
    name: "Asset library",
    group: "make",
    kind: "library",
    lifecycle: "active",
    summary: "The material library: brand, sales, proof, and export assets.",
    aliases: ["materials", "files"],
  },
  {
    slug: "slide-30-review",
    route: "/hq/slide-30-review",
    name: "Market-entry Slide 30",
    group: "make",
    kind: "artifact",
    lifecycle: "decided",
    summary: "Four retained market-entry directions, with the working deck selection marked.",
    aliases: ["slide 30", "market entry slide", "proof mark", "founding partners"],
    parent: "assets",
  },
  {
    slug: "asset-command",
    route: "/hq/asset-command",
    name: "Asset pipeline",
    group: "make",
    kind: "room",
    lifecycle: "active",
    summary: "Ranked asset priorities, the quality gate, and prompt framework.",
    aliases: ["asset command", "taxonomy", "quality gate"],
  },
  {
    slug: "experience-quality",
    route: "/hq/experience-quality",
    name: "Experience quality",
    group: "make",
    kind: "console",
    lifecycle: "active",
    summary: "The private founder-operator control plane for suite experience quality.",
    aliases: ["quality", "ux assurance", "accessibility", "visual baselines"],
  },
  {
    slug: "one-pagers",
    route: "/hq/one-pagers",
    name: "One-pagers",
    group: "make",
    kind: "artifact",
    lifecycle: "active",
    summary: "Print-ready A4 product and brand documents.",
    aliases: ["print", "a4", "pdf"],
  },
  {
    slug: "demo-film",
    route: "/hq/demo-film",
    name: "Demo film",
    group: "make",
    kind: "room",
    lifecycle: "active",
    summary: "The 30-second hero film: storyboard, motion grammar, production.",
    aliases: ["film", "video", "remotion"],
  },
  {
    slug: "product-hero-design-motion",
    route: "/hq/product-hero-design-motion",
    name: "Hero room",
    group: "make",
    kind: "artifact",
    lifecycle: "active",
    summary: "Product landing-page heroes in motion: picks and candidates.",
    aliases: ["heroes", "landing pages", "motion lab"],
  },
  {
    slug: "experimentation-room",
    route: "/hq/experimentation-room",
    name: "Experimentation room",
    group: "make",
    kind: "room",
    lifecycle: "active",
    summary: "Where every direction is kept: shipped, parked, and in review.",
    aliases: ["lab", "experiments", "directions"],
  },
  {
    slug: "loading-review",
    route: "/hq/loading-review",
    name: "Loading review",
    group: "make",
    kind: "artifact",
    lifecycle: "decided",
    summary: "Ten loading moments, one system — the loading canon board.",
    aliases: ["loading canon", "skeletons"],
  },
  {
    slug: "cards",
    route: "/hq/cards",
    name: "Founder cards",
    group: "make",
    kind: "artifact",
    lifecycle: "decided",
    summary: "Business card directions; the Ink, Indigo, Duo trio was chosen.",
    aliases: ["business cards"],
  },
  {
    slug: "poster",
    route: "/hq/poster",
    name: "Campaign poster",
    group: "make",
    kind: "artifact",
    lifecycle: "decided",
    summary: "A2 poster directions; Ink was chosen.",
  },
  {
    slug: "cafe-card",
    route: "/hq/cafe-card",
    name: "Café card",
    group: "make",
    kind: "artifact",
    lifecycle: "decided",
    summary: "A6 permission-placed card; Campaign was chosen.",
    aliases: ["cafe"],
  },
  {
    slug: "partner-card",
    route: "/hq/partner-card",
    name: "Partner card",
    group: "make",
    kind: "artifact",
    lifecycle: "decided",
    summary: "Founding partner card; Indigo and Numeral shortlisted.",
  },
  {
    slug: "email-lab",
    route: "/hq/email-lab",
    name: "Email Lab",
    group: "make",
    kind: "room",
    lifecycle: "active",
    summary:
      "Which email system should Signal Studio send from: three directions, eight emails, side by side.",
    aliases: ["emails", "email design", "templates", "lifecycle mail"],
  },

  // ── Money ───────────────────────────────────────────────────────────
  {
    slug: "reporting",
    route: "/hq/reporting",
    name: "Reporting",
    group: "money",
    kind: "console",
    lifecycle: "active",
    summary: "Five key metrics, the operator queue, and the watchlist.",
    aliases: ["metrics", "numbers", "report"],
    boardVisible: true,
  },
  {
    slug: "financial-model",
    route: "/hq/financial-model",
    name: "Financial model",
    group: "money",
    kind: "console",
    lifecycle: "active",
    summary: "Cash-basis projection with plan-vs-actual, runway, and unit economics.",
    aliases: ["runway", "cash", "projections", "mrr"],
  },
  {
    slug: "cap-table",
    route: "/hq/cap-table",
    name: "Cap table",
    group: "money",
    kind: "console",
    lifecycle: "active",
    summary: "Ownership: Class A voting and Class B Founder Circle.",
    aliases: ["ownership", "shares", "equity"],
  },
  {
    slug: "deck",
    route: "/hq/deck",
    name: "Pitch deck",
    group: "money",
    kind: "deck",
    lifecycle: "active",
    summary: "The 12-month business plan for a seed conversation.",
    aliases: ["investor deck", "pitch"],
  },
  {
    slug: "loan-pack",
    route: "/hq/loan-pack",
    name: "Loan pack",
    group: "money",
    kind: "deck",
    lifecycle: "active",
    summary: "The lender-grade business plan for the €40k facility.",
    aliases: ["lender", "facility", "business plan"],
  },
  {
    slug: "decks",
    route: "/hq/decks",
    name: "Deck library",
    group: "money",
    kind: "library",
    lifecycle: "active",
    summary: "Every board, sales, and diligence deck in one place, each with a live thumbnail.",
    aliases: ["decks", "presentations", "slides", "pitch", "one-pagers", "market entry"],
  },
  {
    slug: "data-room",
    route: "/hq/data-room",
    name: "Data room",
    group: "money",
    kind: "library",
    lifecycle: "active",
    summary: "The one curated link for lenders and investors, honestly stated.",
    aliases: ["diligence", "due diligence"],
  },
  {
    slug: "plan",
    route: "/hq/plan",
    name: "Marketing plan deck",
    group: "money",
    kind: "deck",
    lifecycle: "decided",
    summary: "The ratified six-month marketing plan as an interactive deck.",
    aliases: ["six month plan"],
  },

  // ── Company ─────────────────────────────────────────────────────────
  {
    slug: "vault",
    route: "/hq/vault",
    name: "Vault",
    group: "company",
    kind: "library",
    lifecycle: "active",
    summary: "Every document the business runs on, indexed by domain.",
    aliases: ["documents", "docs", "legal", "records"],
  },
  {
    slug: "decisions",
    route: "/hq/decisions",
    name: "Decisions",
    group: "company",
    kind: "library",
    lifecycle: "active",
    summary: "The append-only ledger of every strategic choice and its status.",
    aliases: ["decision log", "choices", "why", "ledger"],
  },
  {
    slug: "org",
    route: "/hq/org",
    name: "Org",
    group: "company",
    kind: "artifact",
    lifecycle: "active",
    summary: "One founder, seventeen directors, five councils — the command deck.",
    aliases: ["directors", "advisors", "team", "org chart"],
  },
  {
    slug: "blueprint",
    route: "/hq/blueprint",
    name: "Blueprint",
    group: "company",
    kind: "artifact",
    lifecycle: "active",
    summary: "The zoomable map of how the whole operation fits together.",
    aliases: ["operating system map", "north star"],
  },
  {
    slug: "atlas",
    route: "/hq/atlas",
    name: "Atlas",
    group: "company",
    kind: "library",
    lifecycle: "active",
    summary: "Documented systems — crons, databases, cross-repo writers — with drift tracking.",
    aliases: ["systems", "infrastructure", "documentation"],
  },
  {
    slug: "atlas-map",
    route: "/hq/atlas-map",
    name: "Atlas map",
    group: "company",
    kind: "artifact",
    lifecycle: "active",
    summary: "The Atlas as a live visual map.",
    parent: "atlas",
    aliases: ["system map"],
  },
  {
    slug: "incorporation",
    route: "/hq/incorporation",
    name: "Incorporation",
    group: "company",
    kind: "room",
    lifecycle: "active",
    summary: "The CRO runbook as a live checklist.",
    aliases: ["cro", "limited company", "registration"],
  },
  {
    slug: "entitlements",
    route: "/hq/entitlements",
    name: "Access console",
    group: "company",
    kind: "console",
    lifecycle: "active",
    summary: "Grants, codes, venues, and subscriptions — the access ledger.",
    aliases: ["entitlements", "licenses", "grants", "codes"],
  },
  {
    slug: "health",
    route: "/hq/health",
    name: "Cron health",
    group: "company",
    kind: "console",
    lifecycle: "active",
    summary: "Scheduled jobs and whether they ran.",
    aliases: ["jobs", "crons", "status"],
  },
  {
    slug: "platform-readiness",
    route: "/hq/platform-readiness",
    name: "Platform remediation",
    group: "company",
    kind: "console",
    lifecycle: "active",
    summary: "Evidence-backed progress through the production-readiness program.",
    aliases: ["remediation", "readiness", "p0 gates", "hardening"],
  },

  // ── Board ───────────────────────────────────────────────────────────
  {
    slug: "founders-circle",
    route: "/hq/founders-circle",
    name: "Founders Circle",
    group: "board",
    kind: "artifact",
    lifecycle: "active",
    summary: "The shareholder-safe room: headline, five metrics, board packs.",
    aliases: ["board", "shareholders", "circle"],
    boardVisible: true,
  },
];

/**
 * Route directories under src/app/hq that are deliberately NOT rooms:
 * system plumbing and legacy redirects. The contract test allowlists
 * these; anything else without a registry entry fails CI.
 */
export const HQ_SYSTEM_ROUTES = [
  "access", // password gate
  "logout", // cookie clear
  "status", // JSON verdict endpoint for the nav dot
  "partners", // legacy redirect → /hq/entitlements?tab=venues
  "api", // guarded HQ endpoints (search index)
  "action-center", // cross-cutting "needs me" queue (redesign)
] as const;

/** Group landing route segments (all served by src/app/hq/[group]). */
export const HQ_GROUP_SEGMENTS = ["sell", "make", "money", "company"] as const;

export function roomsInGroup(group: HqGroupKey): HqRoom[] {
  return HQ_ROOMS.filter((room) => room.group === group);
}

export function activeRooms(group: HqGroupKey): HqRoom[] {
  return roomsInGroup(group).filter((r) => r.lifecycle === "active" && !r.parent);
}

export function shelvedRooms(group: HqGroupKey): HqRoom[] {
  return roomsInGroup(group).filter((r) => r.lifecycle !== "active");
}

export function findRoom(slug: string): HqRoom | undefined {
  return HQ_ROOMS.find((room) => room.slug === slug);
}

export function findGroup(key: string): HqGroup | undefined {
  return HQ_GROUPS.find((group) => group.key === key);
}
