import type { HqIconName } from "@/components/hq/hq-icons";

/**
 * The HQ information architecture, as data. The rail, breadcrumbs, and the
 * command palette all read from here — one registry, no hand-encoded link
 * lists scattered across components. See docs/hq-redesign/information-architecture.md.
 */

export type HqNavItem = {
  href: string;
  label: string;
  icon: HqIconName;
  /** Extra routes that belong to this item for active-state + breadcrumb. */
  owns?: string[];
  /** One-line description surfaced in search / hover. */
  hint?: string;
};

export type HqNavGroup = {
  label: string;
  items: HqNavItem[];
};

export const HQ_NAV: HqNavGroup[] = [
  {
    label: "Today",
    items: [
      { href: "/hq", icon: "today", label: "Today", hint: "Mission control — the state of the business" },
      { href: "/hq/action-center", icon: "action", label: "Action Center", hint: "Everything that needs you, prioritized" },
    ],
  },
  {
    label: "Workspaces",
    items: [
      { href: "/hq/crm", icon: "sell", label: "Sell", hint: "Venue pipeline, marketing, outreach", owns: ["/hq/marketing", "/hq/market-entry", "/hq/plan", "/hq/venue-kit", "/hq/waitlist"] },
      { href: "/hq/design-rooms", icon: "make", label: "Lab", hint: "Every lab: product heroes, decision rooms, systems, parked work", owns: ["/hq/cards", "/hq/cafe-card", "/hq/partner-card", "/hq/poster", "/hq/slide-30-review", "/hq/product-hero-design-motion", "/hq/socials", "/hq/asset-command", "/hq/demo-film", "/hq/loading-review", "/hq/experimentation-room"] },
      { href: "/hq/reporting", icon: "money", label: "Money", hint: "The five numbers, model, cap table", owns: ["/hq/financial-model", "/hq/cap-table", "/hq/loan-pack"] },
      { href: "/hq/org", icon: "company", label: "Company", hint: "Org, operating map, incorporation", owns: ["/hq/blueprint", "/hq/incorporation", "/hq/one-pagers"] },
    ],
  },
  {
    label: "Knowledge",
    items: [
      { href: "/hq/assets", icon: "library", label: "Library", hint: "Brand + sales asset library" },
      { href: "/hq/vault", icon: "vault", label: "Vault", hint: "Every document the business runs on" },
      { href: "/hq/atlas", icon: "atlas", label: "Atlas", hint: "The systems map", owns: ["/hq/atlas-map"] },
      { href: "/hq/decks", icon: "decks", label: "Decks", hint: "Pitch, market entry, loan pack, plan, one-pagers", owns: ["/hq/deck", "/hq/market-entry", "/hq/loan-pack", "/hq/plan", "/hq/one-pagers"] },
    ],
  },
  {
    label: "Board",
    items: [
      { href: "/hq/founders-circle", icon: "board", label: "Founders Circle", hint: "The shareholder room" },
      { href: "/hq/data-room", icon: "dataroom", label: "Data Room", hint: "The one diligence link", owns: ["/hq/deck"] },
    ],
  },
  {
    label: "Systems",
    items: [
      { href: "/hq/entitlements", icon: "access", label: "Access", hint: "Grants, codes, venues, audit" },
      { href: "/hq/experience-quality", icon: "quality", label: "Quality", hint: "The experience quality gate" },
      { href: "/hq/platform-readiness", icon: "readiness", label: "Readiness", hint: "Remediation program + P0 gates" },
      { href: "/hq/health", icon: "health", label: "Health", hint: "Scheduled-job health" },
    ],
  },
];

export const HQ_BOARD_NAV: HqNavGroup[] = [
  {
    label: "Board",
    items: [
      { href: "/hq/founders-circle", icon: "board", label: "Founders Circle", hint: "The shareholder room" },
      { href: "/hq/reporting", icon: "money", label: "Reporting", hint: "The five numbers" },
      { href: "/hq/data-room", icon: "dataroom", label: "Data Room", hint: "The one diligence link" },
      { href: "/hq/assets", icon: "library", label: "Assets", hint: "Board-safe material" },
    ],
  },
];

/** Human labels for routes that aren't first-class rail items (for breadcrumbs). */
const PAGE_TITLES: Record<string, string> = {
  "/hq": "Today",
  "/hq/action-center": "Action Center",
  "/hq/crm": "Sell",
  "/hq/marketing": "Marketing engine",
  "/hq/market-entry": "Market entry",
  "/hq/plan": "Six-month plan",
  "/hq/venue-kit": "Venue kit",
  "/hq/waitlist": "Waitlist",
  "/hq/design-rooms": "Lab",
  "/hq/cards": "Card room",
  "/hq/cafe-card": "Café card",
  "/hq/partner-card": "Partner card",
  "/hq/poster": "Poster",
  "/hq/slide-30-review": "Slide 30",
  "/hq/product-hero-design-motion": "Product heroes",
  "/hq/socials": "Posting queue",
  "/hq/asset-command": "Asset command",
  "/hq/demo-film": "Demo film",
  "/hq/loading-review": "Loading review",
  "/hq/experimentation-room": "Lab",
  "/hq/reporting": "Money",
  "/hq/financial-model": "Financial model",
  "/hq/cap-table": "Cap table",
  "/hq/loan-pack": "Loan pack",
  "/hq/org": "Company",
  "/hq/blueprint": "Operating map",
  "/hq/incorporation": "Incorporation",
  "/hq/one-pagers": "One-pagers",
  "/hq/assets": "Library",
  "/hq/vault": "Vault",
  "/hq/atlas": "Atlas",
  "/hq/atlas-map": "Operating map",
  "/hq/decks": "Decks",
  "/hq/founders-circle": "Founders Circle",
  "/hq/data-room": "Data Room",
  "/hq/deck": "Pitch deck",
  "/hq/entitlements": "Access",
  "/hq/experience-quality": "Quality",
  "/hq/platform-readiness": "Readiness",
  "/hq/health": "Health",
};

export type HqCrumb = { group: string; page: string; href: string };

/** Resolve a pathname to its rail group + page label for breadcrumbs / active state. */
export function resolveHqLocation(pathname: string): HqCrumb {
  for (const group of HQ_NAV) {
    for (const item of group.items) {
      const owned = [item.href, ...(item.owns ?? [])];
      const isMatch =
        pathname === item.href ||
        owned.some((o) => pathname === o || pathname.startsWith(o + "/"));
      if (isMatch) {
        // Sub-page: show the leaf title if we have one, else the item label.
        const leaf =
          pathname === item.href
            ? item.label
            : PAGE_TITLES[pathname] ?? deriveLeaf(pathname);
        return { group: group.label, page: leaf, href: item.href };
      }
    }
  }
  return { group: "Signal HQ", page: PAGE_TITLES[pathname] ?? deriveLeaf(pathname), href: "/hq" };
}

/** The rail item whose href/owns contains the path (for active highlighting). */
export function activeHref(pathname: string): string | null {
  for (const group of HQ_NAV) {
    for (const item of group.items) {
      const owned = [item.href, ...(item.owns ?? [])];
      if (pathname === item.href) return item.href;
      if (owned.some((o) => pathname === o || pathname.startsWith(o + "/"))) return item.href;
    }
  }
  return null;
}

function deriveLeaf(pathname: string): string {
  const last = pathname.split("/").filter(Boolean).pop() ?? "";
  return last
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase()) || "Signal HQ";
}
