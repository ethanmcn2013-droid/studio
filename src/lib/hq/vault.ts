import fs from "node:fs/promises";
import path from "node:path";

/**
 * The Vault · Signal HQ's single index of everything the operator needs to
 * run the business: ownership and legal instruments, the Founder Circle
 * system, brand and motion, marketing, sales, and the company numbers.
 *
 * Items resolve four ways:
 *   - "doc"    → a markdown source rendered at /hq/vault/<slug> (gated).
 *                The markdown lives at content/vault/<slug>.md.
 *   - "route"  → an existing HQ or site surface (already live).
 *   - "asset"  → a static file served from /public (no sensitive data).
 *   - "source" → a repo path shown for reference; not rendered or served
 *                (used for documents that carry private data and must not
 *                be exposed on a public URL).
 *
 * Why "doc" markdown is safe: /hq/vault/* sits behind the HQ access cookie,
 * checked server-side before any file is read. "source" items deliberately
 * stay un-served because they live behind a client-only privacy gate or
 * carry personal data that must never reach a public /public URL.
 */

export type VaultKind = "doc" | "route" | "asset" | "source";

export type VaultState =
  | "live"
  | "ready"
  | "draft"
  | "private"
  | "parked"
  | "source";

export type VaultItem = {
  id: string;
  title: string;
  note: string;
  kind: VaultKind;
  state: VaultState;
  /** doc slug → content/vault/<slug>.md, rendered at /hq/vault/<slug> */
  slug?: string;
  /** route/asset destination */
  href?: string;
  /** repo path of the underlying source (shown on doc pages + source items) */
  source: string;
  /** short right-aligned descriptor, e.g. a date or status */
  meta?: string;
};

export type VaultDomain = {
  id: string;
  label: string;
  kicker: string;
  blurb: string;
  items: VaultItem[];
};

export const VAULT: VaultDomain[] = [
  {
    id: "ownership",
    label: "Ownership & Legal",
    kicker: "01",
    blurb:
      "The instruments that constitute the company and the Founder Circle. Drafts prepared ahead of a solicitor-executed agreement.",
    items: [
      {
        id: "legal-agreement",
        title: "Shareholders' agreement",
        note: "Class A / Class B instrument constituting Founder Circle ownership.",
        kind: "doc",
        state: "draft",
        slug: "legal-agreement",
        source: "founder-circle/legal-framework/AGREEMENT.md",
        meta: "solicitor gate",
      },
      {
        id: "legal-constitution-shares",
        title: "Constitution & share structure",
        note: "Company constitution and the A/B class split.",
        kind: "doc",
        state: "draft",
        slug: "legal-constitution-shares",
        source: "founder-circle/legal-framework/CONSTITUTION-AND-SHARE-STRUCTURE.md",
      },
      {
        id: "legal-constitution-clauses",
        title: "Constitution, clauses",
        note: "Clause-by-clause draft for the constitution.",
        kind: "doc",
        state: "draft",
        slug: "legal-constitution-clauses",
        source: "founder-circle/legal-framework/CONSTITUTION-CLAUSES.md",
      },
      {
        id: "legal-cro-incorporation",
        title: "CRO incorporation checklist",
        note: "Steps to incorporate the entity with the Companies Registration Office.",
        kind: "doc",
        state: "ready",
        slug: "legal-cro-incorporation",
        source: "founder-circle/legal-framework/CRO-INCORPORATION-CHECKLIST.md",
      },
      {
        id: "legal-founder-remuneration",
        title: "Founder remuneration memo",
        note: "How founder pay is treated alongside Class A holding.",
        kind: "doc",
        state: "draft",
        slug: "legal-founder-remuneration",
        source: "founder-circle/legal-framework/FOUNDER-REMUNERATION-MEMO.md",
      },
      {
        id: "legal-tax-valuation",
        title: "Tax & valuation memo",
        note: "Tax treatment and the valuation basis for the share gift.",
        kind: "doc",
        state: "draft",
        slug: "legal-tax-valuation",
        source: "founder-circle/legal-framework/TAX-AND-VALUATION-MEMO.md",
      },
      {
        id: "legal-gift-valuation",
        title: "Gift valuation note",
        note: "Valuation note supporting the Class B gift.",
        kind: "doc",
        state: "draft",
        slug: "legal-gift-valuation",
        source: "founder-circle/legal-framework/GIFT-VALUATION-NOTE.md",
      },
      {
        id: "legal-freelancer-equity",
        title: "Motion freelancer equity memo",
        note: "Position on equity for a contracted motion designer.",
        kind: "doc",
        state: "draft",
        slug: "legal-freelancer-equity",
        source: "founder-circle/legal-framework/MOTION-FREELANCER-EQUITY-MEMO.md",
      },
      {
        id: "fc-panel-review-legal",
        title: "Legal panel review",
        note: "Cross-discipline review of the legal framework.",
        kind: "doc",
        state: "ready",
        slug: "fc-panel-review-legal",
        source: "founder-circle/artifacts/PANEL-REVIEW-LEGAL-2026-06-01.md",
        meta: "2026-06-01",
      },
    ],
  },
  {
    id: "circle",
    label: "Founder Circle",
    kicker: "02",
    blurb:
      "The recognition programme: its brand system, the letters, the physical artifacts, and the member portal. Built to feel like recognition, not reward.",
    items: [
      {
        id: "fc-brand-system",
        title: "Brand system",
        note: "Phase-0 lock: north star, type, colour, voice, and structure.",
        kind: "doc",
        state: "ready",
        slug: "fc-brand-system",
        source: "founder-circle/brand/SYSTEM.md",
      },
      {
        id: "fc-letter-mam",
        title: "Letter, founding member",
        note: "The private letter to the founding member.",
        kind: "doc",
        state: "private",
        slug: "fc-letter-mam",
        source: "founder-circle/letters/MAM.md",
      },
      {
        id: "fc-letter-friends",
        title: "Letter, circle members",
        note: "Parked letter for the four-member friend grants.",
        kind: "doc",
        state: "parked",
        slug: "fc-letter-friends",
        source: "founder-circle/letters/FRIENDS.md",
      },
      {
        id: "fc-letters-master",
        title: "Letters, master",
        note: "The canonical letter copy.",
        kind: "doc",
        state: "ready",
        slug: "fc-letters-master",
        source: "founder-circle/letters/MASTER.md",
      },
      {
        id: "fc-letters-framework",
        title: "Letters, framework",
        note: "Voice and structure rules for every letter.",
        kind: "doc",
        state: "ready",
        slug: "fc-letters-framework",
        source: "founder-circle/letters/FRAMEWORK.md",
      },
      {
        id: "fc-certificate-design",
        title: "Certificate design",
        note: "Specification for the printed share certificate.",
        kind: "doc",
        state: "ready",
        slug: "fc-certificate-design",
        source: "founder-circle/certificates/DESIGN.md",
      },
      {
        id: "fc-handbook",
        title: "Member handbook",
        note: "The handbook content given to members.",
        kind: "doc",
        state: "ready",
        slug: "fc-handbook",
        source: "founder-circle/booklet/HANDBOOK.md",
      },
      {
        id: "fc-booklet-layout",
        title: "Booklet layout",
        note: "Print layout direction for the handbook.",
        kind: "doc",
        state: "ready",
        slug: "fc-booklet-layout",
        source: "founder-circle/booklet/LAYOUT.md",
      },
      {
        id: "fc-packaging",
        title: "Packaging",
        note: "Box, envelope, and finishing direction.",
        kind: "doc",
        state: "ready",
        slug: "fc-packaging",
        source: "founder-circle/packaging/PACKAGING.md",
      },
      {
        id: "fc-portal-start-here",
        title: "Portal, start here",
        note: "Operator guide to configuring and deploying the member portal.",
        kind: "doc",
        state: "ready",
        slug: "fc-portal-start-here",
        source: "founder-circle/founder-portal/START-HERE.md",
      },
      {
        id: "fc-portal-spec",
        title: "Portal, spec",
        note: "Build specification for the member portal site.",
        kind: "doc",
        state: "ready",
        slug: "fc-portal-spec",
        source: "founder-circle/founder-portal/SPEC.md",
      },
      {
        id: "fc-member-comms",
        title: "Member communications",
        note: "What members receive, and when.",
        kind: "doc",
        state: "ready",
        slug: "fc-member-comms",
        source: "founder-circle/artifacts/MEMBER-COMMUNICATIONS.md",
      },
      {
        id: "fc-launch-sequence",
        title: "Launch sequence",
        note: "The order of operations toward the send date.",
        kind: "doc",
        state: "ready",
        slug: "fc-launch-sequence",
        source: "founder-circle/artifacts/LAUNCH-SEQUENCE.md",
      },
      {
        id: "fc-panel-review",
        title: "Phase panel review",
        note: "Earlier cross-discipline review of the programme.",
        kind: "doc",
        state: "ready",
        slug: "fc-panel-review",
        source: "founder-circle/artifacts/review-2026-05-31/PANEL-REVIEW.md",
      },
      {
        id: "fc-portal-site",
        title: "Member portal (live site)",
        note: "Password-gated gift portal, handbook, letter, contract, certificate. Carries personal data, so it is not served on a public URL. Preview locally via founder-circle/start.sh.",
        kind: "source",
        state: "source",
        source: "founder-circle/founder-portal/site/",
      },
      {
        id: "fc-review-tool",
        title: "Artifact review tool",
        note: "The full review surface that frames every artifact in context.",
        kind: "source",
        state: "source",
        source: "founder-circle/REVIEW.html",
      },
      {
        id: "fc-prototypes",
        title: "Print & packaging prototypes",
        note: "HTML prototypes: cover, unboxing, launch day, dashboard, quarterly report, certificate.",
        kind: "source",
        state: "source",
        source: "founder-circle/*/prototype-*.html",
      },
    ],
  },
  {
    id: "economics",
    label: "Dividends & Reporting",
    kicker: "03",
    blurb:
      "How value flows to members: the distribution philosophy, the formulas, and the quarterly report members receive.",
    items: [
      {
        id: "fc-dividend-philosophy",
        title: "Dividend philosophy",
        note: "The principle behind distributions to Class B.",
        kind: "doc",
        state: "ready",
        slug: "fc-dividend-philosophy",
        source: "founder-circle/print-assets/DIVIDEND-PHILOSOPHY.md",
      },
      {
        id: "fc-formula",
        title: "Distribution formula",
        note: "How a distribution is calculated.",
        kind: "doc",
        state: "ready",
        slug: "fc-formula",
        source: "founder-circle/print-assets/FORMULA.md",
      },
      {
        id: "fc-valuation-formula",
        title: "Valuation formula",
        note: "The basis used to value the holding over time.",
        kind: "doc",
        state: "ready",
        slug: "fc-valuation-formula",
        source: "founder-circle/print-assets/VALUATION-FORMULA.md",
      },
      {
        id: "fc-quarterly-report-template",
        title: "Quarterly report template",
        note: "The template for the member-facing quarterly update.",
        kind: "doc",
        state: "ready",
        slug: "fc-quarterly-report-template",
        source: "founder-circle/print-assets/QUARTERLY-REPORT-TEMPLATE.md",
      },
    ],
  },
  {
    id: "brand",
    label: "Brand & Motion",
    kicker: "04",
    blurb:
      "The Signal Studio identity and the motion language, the canon every external surface inherits from.",
    items: [
      {
        id: "brand-hub",
        title: "Brand hub",
        note: "Wordmarks, the dot, lockups, app icons, palette, and motion canon.",
        kind: "route",
        state: "live",
        href: "/brand",
        source: "src/app/brand/page.tsx",
      },
      {
        id: "brand-kit-zip",
        title: "Brand kit (download)",
        note: "Packaged SVG and PNG assets for handoff.",
        kind: "asset",
        state: "ready",
        href: "/brand/signal-studio-brand-kit.zip",
        source: "public/brand/signal-studio-brand-kit.zip",
      },
      {
        id: "motion-brief",
        title: "The Film System, motion brief",
        note: "Strategy, the motion language, a phased plan, and 30 film specs.",
        kind: "asset",
        state: "ready",
        href: "/brand/motion-brief.html",
        source: "public/brand/motion-brief.html",
      },
      {
        id: "brand-handbook",
        title: "Brand handbook",
        note: "The written brand thesis, voice, and refusals.",
        kind: "source",
        state: "source",
        source: "studio/BRAND.md",
      },
      {
        id: "design-system",
        title: "Design system",
        note: "Agent-readable tokens, motion, and banned patterns.",
        kind: "source",
        state: "source",
        source: "studio/DESIGN.md",
      },
    ],
  },
  {
    id: "marketing",
    label: "Marketing & Growth",
    kicker: "05",
    blurb:
      "The plan, the print artifacts, and the proof material that the commercial motion runs on.",
    items: [
      {
        id: "marketing-engine",
        title: "Six-month engine",
        note: "The venue-first plan, ranked by leverage.",
        kind: "route",
        state: "live",
        href: "/hq/marketing",
        source: "src/lib/hq/marketing.ts",
      },
      {
        id: "six-month-plan",
        title: "Six-month plan (print)",
        note: "The growth plan as a print-fidelity board artifact.",
        kind: "route",
        state: "ready",
        href: "/hq/plan/print",
        source: "docs/MARKETING_PLAN_6MO.md",
      },
      {
        id: "one-pagers",
        title: "Product one-pagers",
        note: "A4 exports for Tasks, Timeline, Signal, Notes, and Studio.",
        kind: "route",
        state: "ready",
        href: "/hq/one-pagers",
        source: "src/lib/hq/one-pagers.ts",
      },
      {
        id: "video-brief",
        title: "Venue edition video brief",
        note: "Proof-video script, scenes, and distribution notes.",
        kind: "source",
        state: "source",
        source: "docs/strategy/VENUE_EDITION_VIDEO_BRIEF.md",
      },
    ],
  },
  {
    id: "sales",
    label: "Sales & CRM",
    kicker: "06",
    blurb:
      "The venue pipeline and the assets that feed it. Founder-signed outreach stays gated behind the asset review.",
    items: [
      {
        id: "crm",
        title: "Venue pipeline",
        note: "Prospects, follow-ups, replies, demos, and pilots in one ledger.",
        kind: "route",
        state: "live",
        href: "/hq/crm",
        source: "src/app/hq/crm/page.tsx",
      },
      {
        id: "venue-sales-pack",
        title: "Venue sales pack",
        note: "Core sales copy and founder narrative for the venue wedge.",
        kind: "source",
        state: "source",
        source: "docs/strategy/VENUE_SALES_PACK.md",
      },
      {
        id: "outreach-sequence",
        title: "Venue outreach sequence",
        note: "Held founder-signed emails. Do not send until the asset gate clears.",
        kind: "source",
        state: "source",
        source: "docs/strategy/VENUE_OUTREACH_SEQUENCE.md",
      },
      {
        id: "founder-review-pack",
        title: "Founder review pack",
        note: "The asset gate before any founder-signed outreach goes out.",
        kind: "source",
        state: "source",
        source: "docs/strategy/VENUE_FOUNDER_REVIEW_PACK.md",
      },
    ],
  },
  {
    id: "numbers",
    label: "Company Numbers",
    kicker: "07",
    blurb:
      "The honest read: five company numbers and the board-safe shareholder room.",
    items: [
      {
        id: "reporting",
        title: "Simple metrics",
        note: "Five company numbers, their source, and the watchlist.",
        kind: "route",
        state: "live",
        href: "/hq/reporting",
        source: "src/app/hq/reporting/page.tsx",
      },
      {
        id: "founders-circle-room",
        title: "Founders Circle (board room)",
        note: "Shareholder-safe story, numbers, and board pack.",
        kind: "route",
        state: "live",
        href: "/hq/founders-circle",
        source: "src/app/hq/founders-circle/page.tsx",
      },
    ],
  },
];

export type VaultDocLocation = {
  item: VaultItem;
  domain: VaultDomain;
};

export function findVaultDoc(slug: string): VaultDocLocation | null {
  for (const domain of VAULT) {
    const item = domain.items.find((i) => i.kind === "doc" && i.slug === slug);
    if (item) return { item, domain };
  }
  return null;
}

export function allVaultDocSlugs(): string[] {
  return VAULT.flatMap((d) =>
    d.items.filter((i) => i.kind === "doc" && i.slug).map((i) => i.slug as string),
  );
}

export async function readVaultDocBody(slug: string): Promise<string | null> {
  // Guard against traversal, slugs are flat, alphanumeric + dashes only.
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const file = path.join(process.cwd(), "content", "vault", `${slug}.md`);
  try {
    return await fs.readFile(file, "utf-8");
  } catch {
    return null;
  }
}

export type VaultStat = {
  docs: number;
  routes: number;
  sources: number;
  domains: number;
};

export function vaultStats(): VaultStat {
  const items = VAULT.flatMap((d) => d.items);
  return {
    docs: items.filter((i) => i.kind === "doc").length,
    routes: items.filter((i) => i.kind === "route" || i.kind === "asset").length,
    sources: items.filter((i) => i.kind === "source").length,
    domains: VAULT.length,
  };
}
