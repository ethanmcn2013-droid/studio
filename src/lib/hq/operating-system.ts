import type { DbProspect } from "@/lib/db/schema";
import { computeOutreachSummary, getDueToday } from "@/lib/hq/crm-utils";
import { MARKETING_BUCKETS, MARKETING_TOTAL } from "@/lib/hq/marketing";
import { DECK_EXPORT, ONE_PAGERS } from "@/lib/hq/one-pagers";
import { formatEur, type TractionState } from "@/lib/hq/traction";
import { vaultStats } from "@/lib/hq/vault";

export type HqAudience =
  | "founder"
  | "operator"
  | "marketing"
  | "shareholder"
  | "hire";

export type HqHub = {
  key: string;
  label: string;
  title: string;
  href: string;
  audience: HqAudience[];
  mode: "live" | "working" | "library" | "board";
  summary: string;
  primaryMetric: string;
  secondaryMetric: string;
  action: string;
};

export type HqMetric = {
  label: string;
  value: string;
  note: string;
  href: string;
  tone?: "accent" | "critical" | "quiet";
};

export type HqSnapshot = {
  generatedAt: string;
  leadAction: string;
  leadHref: string;
  leadContext: string;
  metrics: HqMetric[];
  dueToday: number;
  founderSends: number;
  qualifiedReplies: number;
  bookedCalls: number;
  paidVenues: number | null;
  cashCollected: string;
};

export type HqAsset = {
  id: string;
  title: string;
  group: "brand" | "sales" | "shareholder" | "proof" | "export";
  audience: HqAudience[];
  state: "ready" | "working" | "source" | "needs-review";
  owner: string;
  href?: string;
  source: string;
  action: string;
  note: string;
};

export type HqReportMetric = {
  label: string;
  value: string;
  target: string;
  source: string;
  status: "moving" | "flat" | "blocked" | "unread";
};

export type HqReport = {
  headline: string;
  metrics: HqReportMetric[];
  operationalMetrics: HqReportMetric[];
  watchlist: Array<{ label: string; detail: string; href: string }>;
  sources: Array<{ label: string; detail: string; href: string }>;
};

export type FounderCirclePack = {
  title: string;
  cadence: string;
  audience: "shareholders" | "founder" | "hires";
  href: string;
  source: string;
  status: "ready" | "working" | "draft";
  note: string;
};

export type HqAudiencePath = {
  audience: "Founder" | "Marketing intern" | "Potential hire" | "Shareholder";
  start: string;
  href: string;
  promise: string;
};

export type HqReviewPrinciple = {
  role: string;
  finding: string;
};

const engineApproaches = MARKETING_BUCKETS.flatMap((bucket) => bucket.approaches).filter(
  (approach) => approach.impact === "Engine",
).length;

const vault = vaultStats();

export const HQ_HUBS: HqHub[] = [
  {
    key: "vault",
    label: "Vault",
    title: "The Vault",
    href: "/hq/vault",
    audience: ["founder", "operator", "shareholder"],
    mode: "library",
    summary:
      "Every legal, founder, brand, and operating document the business runs on, in one indexed place.",
    primaryMetric: `${vault.docs} documents`,
    secondaryMetric: `${vault.domains} domains`,
    action: "open the index",
  },
  {
    key: "crm",
    label: "CRM",
    title: "Venue pipeline",
    href: "/hq/crm",
    audience: ["founder", "operator"],
    mode: "live",
    summary: "Prospects, follow-ups, replies, demos, and pilots in one ledger.",
    primaryMetric: "founder sends",
    secondaryMetric: "reply and demo stages",
    action: "clear the next follow-up",
  },
  {
    key: "marketing",
    label: "Marketing",
    title: "Six-month engine",
    href: "/hq/marketing",
    audience: ["founder", "marketing"],
    mode: "working",
    summary: "The venue-first plan, ranked by leverage and cleared by the panel.",
    primaryMetric: `${MARKETING_TOTAL} approaches`,
    secondaryMetric: `${engineApproaches} engine-impact`,
    action: "choose one asset to ship",
  },
  {
    key: "assets",
    label: "Assets",
    title: "Brand and sales library",
    href: "/hq/assets",
    audience: ["founder", "marketing", "shareholder"],
    mode: "library",
    summary: "Brand kit, one-pagers, pitch material, venue packs, and proof assets.",
    primaryMetric: `${ONE_PAGERS.length + 1} print exports`,
    secondaryMetric: "brand kit plus deck",
    action: "open the source asset",
  },
  {
    key: "asset-command",
    label: "Asset Command",
    title: "Asset Command System",
    href: "/hq/asset-command",
    audience: ["founder", "marketing", "shareholder"],
    mode: "working",
    summary:
      "The launch-asset operating layer: panel, taxonomy, ranked priorities, the first ten, the quality gate, and the Claude Design prompt framework.",
    primaryMetric: "the minimum complete bank",
    secondaryMetric: "one asset at a time",
    action: "open the first prompt",
  },
  {
    key: "reporting",
    label: "Reporting",
    title: "Simple metrics",
    href: "/hq/reporting",
    audience: ["founder", "operator", "shareholder"],
    mode: "live",
    summary: "Five company numbers, their source, and the watchlist.",
    primaryMetric: "cash, venues, replies",
    secondaryMetric: "no vanity layer",
    action: "read the metric source",
  },
  {
    key: "founders-circle",
    label: "Shareholders",
    title: "Founders Circle",
    href: "/hq/founders-circle",
    audience: ["founder", "shareholder", "hire"],
    mode: "board",
    summary: "A shareholder-safe room: story, numbers, board pack, and updates.",
    primaryMetric: "board-ready view",
    secondaryMetric: "operator detail withheld",
    action: "prepare the update",
  },
  {
    key: "org",
    label: "Org",
    title: "Executive Leadership Team",
    href: "/hq/org",
    audience: ["founder", "operator", "hire"],
    mode: "library",
    summary:
      "17 Directors and one Founder. Who owns what, at which autonomy layer, on which cadence.",
    primaryMetric: "17 directors",
    secondaryMetric: "5 clusters",
    action: "open the org",
  },
  {
    key: "blueprint",
    label: "Blueprint",
    title: "Founder Operating System",
    href: "/hq/blueprint",
    audience: ["founder", "operator", "hire", "shareholder"],
    mode: "library",
    summary:
      "The zoomable operating map: how the company works, grows, ships, thinks, and stays focused — in one place.",
    primaryMetric: "10 sections",
    secondaryMetric: "one map",
    action: "open the map",
  },
  {
    key: "data-room",
    label: "Data Room",
    title: "The one link",
    href: "/hq/data-room",
    audience: ["founder", "shareholder", "hire"],
    mode: "library",
    summary:
      "The curated diligence index for a lender, investor, or collaborator — narrative, ask, numbers, company, product, legal, proof.",
    primaryMetric: "7 sections",
    secondaryMetric: "launch countdown",
    action: "open the room",
  },
];

export const HQ_AUDIENCE_PATHS: HqAudiencePath[] = [
  {
    audience: "Founder",
    start: "Start at Reporting, then CRM",
    href: "/hq/reporting",
    promise: "Read the commercial truth first, then clear the next follow-up.",
  },
  {
    audience: "Marketing intern",
    start: "Start at Assets",
    href: "/hq/assets",
    promise: "Find the canonical material before making or sending anything.",
  },
  {
    audience: "Potential hire",
    start: "Start at Founders Circle",
    href: "/hq/founders-circle",
    promise: "Understand the company story, the quality bar, and the operating rhythm.",
  },
  {
    audience: "Shareholder",
    start: "Start at Founders Circle",
    href: "/hq/founders-circle",
    promise: "See the board-safe story and the five numbers without operator noise.",
  },
];

export const HQ_ASSETS: HqAsset[] = [
  {
    id: "collateral-identity",
    title: "Identity & stationery set",
    group: "brand",
    audience: ["founder", "marketing"],
    state: "ready",
    owner: "Brand",
    href: "/brand/collateral/identity/index.html",
    source: "public/brand/collateral/identity",
    action: "Open the set",
    note: "Founder card (85×55mm), café card (A6), letterhead, email signature — print PDFs with bleed and crop marks, previews, and print notes. Founder sign-off gates any print run.",
  },
  {
    id: "brand-kit",
    title: "Signal Studio brand kit",
    group: "brand",
    audience: ["marketing", "shareholder"],
    state: "ready",
    owner: "Brand",
    href: "/brand",
    source: "src/app/brand/page.tsx",
    action: "Open brand hub",
    note: "Wordmarks, dot, lockups, app icons, product marks, palette, and motion canon.",
  },
  {
    id: "brand-kit-zip",
    title: "Downloadable brand kit",
    group: "brand",
    audience: ["marketing"],
    state: "ready",
    owner: "Brand",
    href: "/brand/signal-studio-brand-kit.zip",
    source: "public/brand/signal-studio-brand-kit.zip",
    action: "Download kit",
    note: "Packaged SVG and PNG assets for handoff.",
  },
  {
    id: "motion-brief",
    title: "The Film System — motion brief",
    group: "brand",
    audience: ["founder", "marketing", "shareholder"],
    state: "ready",
    owner: "Creative",
    href: "/brand/motion-brief.html",
    source: "public/brand/motion-brief.html",
    action: "Open the brief",
    note: "Reference for every motion-graphic and advertising film: strategy, the motion language, a phased production plan, and 30 film specs.",
  },
  {
    id: "one-pagers",
    title: "Product one-pagers",
    group: "export",
    audience: ["marketing", "shareholder"],
    state: "ready",
    owner: "Product marketing",
    href: "/hq/one-pagers",
    source: "src/lib/hq/one-pagers.ts",
    action: "Open exports",
    note: "A4 print-ready documents for Tasks, Timeline, Signal, Notes, and Studio.",
  },
  {
    id: "six-month-plan",
    title: "Six-month marketing plan",
    group: "shareholder",
    audience: ["founder", "shareholder", "marketing"],
    state: "ready",
    owner: "Founder",
    href: DECK_EXPORT.href,
    source: "docs/MARKETING_PLAN_6MO.md",
    action: "Open print plan",
    note: "The growth plan as a print-fidelity board artifact.",
  },
  {
    id: "investor-deck",
    title: "Investor deck",
    group: "shareholder",
    audience: ["shareholder"],
    state: "source",
    owner: "Founder",
    href: "/brand/pitch-deck-2026.html",
    source: "public/brand/pitch-deck-2026.html",
    action: "Open deck",
    note: "Static HTML deck source for shareholder conversations.",
  },
  {
    id: "market-entry-deck",
    title: "Market entry & growth strategy deck",
    group: "shareholder",
    audience: ["founder", "shareholder", "marketing"],
    state: "ready",
    owner: "Founder",
    href: "/hq/market-entry",
    source: "public/brand/market-entry-deck-2026.html",
    action: "Open deck",
    note: "70 slides · the go-to-market companion to the business plan: where every euro of spend goes and exactly how the market is entered.",
  },
  {
    id: "financial-model",
    title: "Financial model",
    group: "shareholder",
    audience: ["founder", "shareholder"],
    state: "ready",
    owner: "Founder",
    href: "/hq/financial-model",
    source: "src/lib/hq/financial-model.ts",
    action: "Open model",
    note: "Cash-basis projection · revenue build, runway, and unit economics (LTV:CAC, payback). Modeled assumptions with live ledger overlaid.",
  },
  {
    id: "cap-table",
    title: "Cap table",
    group: "shareholder",
    audience: ["founder", "shareholder"],
    state: "ready",
    owner: "Founder",
    href: "/hq/cap-table",
    source: "content/vault/legal-constitution-shares.md",
    action: "Open cap table",
    note: "Signal Studio Limited · Class A voting 90% / Class B Founder Circle 10% · 1,000,000 shares. Pre-incorporation (defined, not yet issued).",
  },
  {
    id: "incorporation-pack",
    title: "Incorporation pack",
    group: "shareholder",
    audience: ["founder", "shareholder"],
    state: "ready",
    owner: "Founder",
    href: "/hq/incorporation",
    source: "content/vault/legal-cro-incorporation.md",
    action: "Open the runbook",
    note: "CRO runbook + timeline · decisions confirmed, filing targeted July 2026. The gate the €40k facility waits on.",
  },
  {
    id: "business-loan-pack",
    title: "Business loan pack",
    group: "shareholder",
    audience: ["founder", "shareholder"],
    state: "ready",
    owner: "Founder",
    href: "/hq/loan-pack",
    source: "public/brand/business-loan-pack-2026.html",
    action: "Open lender deck",
    note: "€40k facility · password-gated · Student Edition adjacent wedge included.",
  },
  {
    id: "asset-command-system",
    title: "Asset Command System",
    group: "sales",
    audience: ["founder", "marketing", "shareholder"],
    state: "working",
    owner: "Founder",
    href: "/hq/asset-command",
    source: "src/lib/hq/asset-command.ts",
    action: "Open the system",
    note: "The launch-asset operating layer: director panel, scored taxonomy, ranked priorities, the first ten assets, the quality gate, and the reusable Claude Design prompt framework. Governs which assets get made, in what order.",
  },
  {
    id: "venue-sales-pack",
    title: "Venue sales pack",
    group: "sales",
    audience: ["founder", "marketing"],
    state: "working",
    owner: "Founder",
    source: "docs/strategy/VENUE_SALES_PACK.md",
    action: "Review source",
    note: "Core sales copy and founder narrative for the venue wedge.",
  },
  {
    id: "founder-review-pack",
    title: "Founder review pack",
    group: "proof",
    audience: ["founder"],
    state: "needs-review",
    owner: "Founder",
    source: "docs/strategy/VENUE_FOUNDER_REVIEW_PACK.md",
    action: "Review gate",
    note: "Asset gate before any founder-signed venue outreach goes out.",
  },
  {
    id: "outreach-sequence",
    title: "Venue outreach sequence",
    group: "sales",
    audience: ["founder", "marketing"],
    state: "working",
    owner: "Founder",
    source: "docs/strategy/VENUE_OUTREACH_SEQUENCE.md",
    action: "Read drafts",
    note: "Held founder-signed emails. Do not send until the asset gate clears.",
  },
  {
    id: "video-brief",
    title: "Venue edition video brief",
    group: "proof",
    audience: ["founder", "marketing", "shareholder"],
    state: "working",
    owner: "Creative",
    source: "docs/strategy/VENUE_EDITION_VIDEO_BRIEF.md",
    action: "Open source",
    note: "Proof-video script, scenes, and distribution notes.",
  },
  {
    id: "demo-film",
    title: "Demo film — One Wedding, Four Views",
    group: "proof",
    audience: ["founder", "marketing", "shareholder"],
    state: "working",
    owner: "Creative",
    href: "/hq/demo-film",
    source: "src/lib/hq/demo-film.ts",
    action: "Open the scaffold",
    note: "Hero 30s product film · logline, spec, storyboard, motion grammar, build checklist. Scaffold ready; render pending the motion pipeline.",
  },
];

export const FOUNDER_CIRCLE_PACKS: FounderCirclePack[] = [
  {
    title: "Shareholder board pack",
    cadence: "monthly",
    audience: "shareholders",
    href: "/hq/founders-circle",
    source: "src/app/hq/founders-circle/page.tsx",
    status: "working",
    note: "One story, five numbers, material decisions, and the next ask.",
  },
  {
    title: "Investor deck",
    cadence: "as needed",
    audience: "shareholders",
    href: "/brand/pitch-deck-2026.html",
    source: "public/brand/pitch-deck-2026.html",
    status: "ready",
    note: "Use as the high-level narrative, then route to Reporting for live numbers.",
  },
  {
    title: "Six-month plan",
    cadence: "monthly",
    audience: "shareholders",
    href: "/hq/plan/print",
    source: "docs/MARKETING_PLAN_6MO.md",
    status: "ready",
    note: "Board-readable growth plan with the venue engine and hedge buckets.",
  },
  {
    title: "Brand one-pager",
    cadence: "evergreen",
    audience: "hires",
    href: "/hq/one-pagers/brand",
    source: "src/lib/hq/one-pagers.ts",
    status: "ready",
    note: "The compact handoff for hires and advisors who need the house rules fast.",
  },
];

export const HQ_REVIEW_PRINCIPLES: HqReviewPrinciple[] = [
  {
    role: "Product",
    finding: "Hubs are named by work mode, not internal history.",
  },
  {
    role: "Brand",
    finding: "White, ink, indigo, hairlines, and one dot grammar.",
  },
  {
    role: "Revenue",
    finding: "CRM and reporting point at the venue engine first.",
  },
  {
    role: "Shareholder",
    finding: "Founders Circle removes raw operator noise from the board view.",
  },
];

export function getHqSnapshot(
  prospects: DbProspect[],
  traction: TractionState,
): HqSnapshot {
  const dueToday = getDueToday(prospects);
  const outreach = computeOutreachSummary(prospects);
  const paidVenues = traction.available ? traction.paidVenues : null;
  const cashCollected = traction.available
    ? formatEur(traction.cashCollectedEur)
    : "unread";

  const leadAction =
    dueToday.length > 0
      ? `${dueToday.length} follow-up${dueToday.length === 1 ? "" : "s"} due or stale`
      : outreach.sent === 0
        ? "send the first founder letters"
        : outreach.bookedCalls === 0
          ? "turn replies into booked calls"
          : "keep the paid-venue gate moving";

  const leadHref =
    dueToday.length > 0 || outreach.sent === 0 ? "/hq/crm" : "/hq/reporting";

  const leadContext =
    dueToday.length > 0
      ? "The CRM is the front door today."
      : outreach.sent === 0
        ? "The system has no founder sends recorded yet."
        : "The reporting hub has the cleanest next read.";

  return {
    generatedAt: new Date().toISOString(),
    leadAction,
    leadHref,
    leadContext,
    dueToday: dueToday.length,
    founderSends: outreach.sent,
    qualifiedReplies: outreach.qualifiedReplies,
    bookedCalls: outreach.bookedCalls,
    paidVenues,
    cashCollected,
    metrics: [
      {
        label: "cash collected",
        value: cashCollected,
        note: traction.available
          ? `${traction.goalPct}% of ${formatEur(traction.goalEur)} cash target`
          : "Studio Turso unread",
        href: "/hq/reporting",
        tone: traction.available && traction.cashCollectedEur > 0 ? "accent" : "quiet",
      },
      {
        label: "paid venues",
        value: paidVenues === null ? "unread" : String(paidVenues),
        note: "M3 gate is 10 paid venues",
        href: "/hq/reporting",
        tone: paidVenues && paidVenues > 0 ? "accent" : "quiet",
      },
      {
        label: "founder sends",
        value: String(outreach.sent),
        note: "from CRM last-contacted dates",
        href: "/hq/crm",
        tone: outreach.sent > 0 ? "accent" : "critical",
      },
      {
        label: "qualified replies",
        value: String(outreach.qualifiedReplies),
        note: "reply, demo, or pilot stages",
        href: "/hq/crm",
        tone: outreach.qualifiedReplies > 0 ? "accent" : "quiet",
      },
      {
        label: "booked calls",
        value: String(outreach.bookedCalls),
        note: "demo booked plus pilot active",
        href: "/hq/crm?stage=demo_booked",
        tone: outreach.bookedCalls > 0 ? "accent" : "quiet",
      },
      {
        label: "due/stale",
        value: String(dueToday.length),
        note: "active due or stale follow-ups",
        href: "/hq/crm",
        tone: dueToday.length > 0 ? "critical" : "quiet",
      },
    ],
  };
}

export function getHqReport(
  prospects: DbProspect[],
  traction: TractionState,
): HqReport {
  const outreach = computeOutreachSummary(prospects);
  const dueToday = getDueToday(prospects);
  const replyRate = pct(outreach.qualifiedReplies, outreach.sent);
  const bookingRate = pct(outreach.bookedCalls, outreach.sent);

  const metrics: HqReportMetric[] = [
    {
      label: "Cash collected",
      value: traction.available ? formatEur(traction.cashCollectedEur) : "unread",
      target: traction.available ? formatEur(traction.goalEur) : "Turso required",
      source: "sponsors.paid_at + annual_amount_cents",
      status: traction.available
        ? traction.cashCollectedEur > 0
          ? "moving"
          : "flat"
        : "unread",
    },
    {
      label: "Paid venues",
      value: traction.available ? String(traction.paidVenues) : "unread",
      target: "10 by M3",
      source: "sponsors.venue_plan",
      status: traction.available
        ? traction.paidVenues > 0
          ? "moving"
          : "flat"
        : "unread",
    },
    {
      label: "Founder sends",
      value: String(outreach.sent),
      target: "20",
      source: "prospects.last_contacted_at",
      status: outreach.sent > 0 ? "moving" : "blocked",
    },
    {
      label: "Reply rate",
      value: replyRate,
      target: ">=25%",
      source: "CRM stages",
      status: outreach.qualifiedReplies > 0 ? "moving" : "flat",
    },
    {
      label: "Booked-call rate",
      value: bookingRate,
      target: ">=10%",
      source: "demo booked + pilot active",
      status: outreach.bookedCalls > 0 ? "moving" : "flat",
    },
  ];

  const operationalMetrics: HqReportMetric[] = [
    {
      label: "Follow-ups due/stale",
      value: String(dueToday.length),
      target: "0 stale",
      source: "CRM next follow-up",
      status: dueToday.length > 0 ? "blocked" : "moving",
    },
  ];

  return {
    headline:
      outreach.sent === 0
        ? "The reporting layer is ready; the commercial motion has not started."
        : "The reporting layer is reading the venue engine.",
    metrics,
    operationalMetrics,
    watchlist: [
      {
        label: "Founder-time concentration",
        detail: "The CRM only moves when founder-signed outreach moves.",
        href: "/hq/crm",
      },
      {
        label: "Asset gate",
        detail: "Venue proof assets must clear review before wider sends.",
        href: "/hq/assets",
      },
      {
        label: "Cash honesty",
        detail: "Signed unpaid venues remain pipeline, not revenue.",
        href: "/hq/reporting",
      },
    ],
    sources: [
      {
        label: "CRM",
        detail: "DB-backed prospects with seed fallback.",
        href: "/hq/crm",
      },
      {
        label: "Traction",
        detail: "Sponsor ledger, license codes, redemptions, and entitlements.",
        href: "/hq",
      },
      {
        label: "Marketing",
        detail: "Typed six-month plan registry.",
        href: "/hq/marketing",
      },
      {
        label: "Assets",
        detail: "Brand kit, print exports, decks, and source docs.",
        href: "/hq/assets",
      },
    ],
  };
}

function pct(part: number, total: number): string {
  if (total <= 0) return "0%";
  return `${Math.round((part / total) * 100)}%`;
}
