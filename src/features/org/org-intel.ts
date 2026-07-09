/**
 * Org intelligence — the operating machinery behind the 17-Director chart.
 *
 * The org chart shows who owns what. This file surfaces *how the company runs*:
 * the standing councils, the autonomy ladder, the permission tiers, the
 * founder-gated actions, the tool + MCP layer, the operating cadences, the
 * workflows, the principles, and the decision log.
 *
 * Every value here mirrors a real source in `signal-directors`:
 *   - councils          → config/advisors.yaml (panels)
 *   - autonomy ladder   → docs/governance-model.md
 *   - permission tiers  → config/permissions.yaml + docs/permissions-model.md
 *   - founder gates     → config/permissions.yaml (tier-3)
 *   - MCP layer         → config/mcp.yaml + docs/mcp-layer.md
 *   - workflows         → workflows/*.md
 *   - principles        → memory/principles-log.md
 *   - decisions         → memory/decision-log.md
 *   - functional grants → config/permissions.yaml (tier-2, per charter)
 *
 * Nothing here is decorative. When the source changes, mirror it and bump
 * ELT_SNAPSHOT.generatedAt in elt.ts.
 */

import { DIRECTORS, type Director } from "@/lib/hq/elt";
import { COORDINATION_EDGE_COUNT } from "./org-coordination";

const REPO = "https://github.com/ethanmcn2013-droid/signal-directors";

// ── Standing councils (config/advisors.yaml → panels) ───────────────────────

export type Council = {
  id: string;
  label: string;
  channel: string;
  chairId: string;
  /** Director ids, or "all" for the whole board. */
  members: string[] | "all";
  cadence: string;
  purpose: string;
  /** Optional note on who may write, when it isn't "everyone". */
  writeNote?: string;
};

export const COUNCILS: Council[] = [
  {
    id: "advisory-board",
    label: "Advisory Board",
    channel: "#advisory-board",
    chairId: "product-strategy",
    members: "all",
    cadence: "Weekly",
    purpose:
      "The full standing board. Every Director contributes to the weekly read on where the company is and what moves next.",
  },
  {
    id: "product-excellence-council",
    label: "Product Excellence Council",
    channel: "#product-excellence-council",
    chairId: "product-strategy",
    members: [
      "roadmap-product-excellence",
      "tasks-product-excellence",
      "notes-product-excellence",
      "analytics-product-excellence",
      "product-experience-ux",
      "product-taste-design-integrity",
      "performance-excellence-innovation",
    ],
    cadence: "Weekly",
    purpose:
      "Per-product taste leads plus the horizontal UX, Taste, and Performance Directors. Holds the quality bar across all four products.",
  },
  {
    id: "launch-council",
    label: "Launch Council",
    channel: "#launch-council",
    chairId: "product-strategy",
    members: [
      "brand-narrative-positioning",
      "marketing-growth-audience-insight",
      "engineering-systems-architecture",
      "operations-admin-founder-support",
      "creative-motion-experience",
      "performance-excellence-innovation",
    ],
    cadence: "Launch-driven",
    purpose:
      "Convenes only around a launch. Brand, growth, engineering, ops, creative, and performance align the moment before anything ships.",
  },
  {
    id: "weekly-strategy-review",
    label: "Weekly Strategy Review",
    channel: "#weekly-strategy-review",
    chairId: "product-strategy",
    members: "all",
    cadence: "Weekly",
    purpose:
      "The focus check. Are we still working on the right things, in the right order, for the right reasons.",
  },
  {
    id: "decision-log",
    label: "Decision Log",
    channel: "#decision-log",
    chairId: "operations-admin-founder-support",
    members: "all",
    cadence: "Continuous",
    purpose:
      "The append-only record. Every material decision lands here with who surfaced it, who was consulted, and why.",
    writeNote: "Read-only for all but the chair. The log is a record, not a chat.",
  },
];

// ── Autonomy ladder (docs/governance-model.md) ──────────────────────────────

export type AutonomyLayer = {
  n: number;
  name: string;
  authority: string;
  gate: string;
};

export const AUTONOMY_LADDER: AutonomyLayer[] = [
  {
    n: 1,
    name: "Observe",
    authority: "Monitor channels and read docs. Nothing visible.",
    gate: "None. Passive.",
  },
  {
    n: 2,
    name: "Recommend",
    authority: "Propose actions in writing. Do not act.",
    gate: "None. Output is advisory.",
  },
  {
    n: 3,
    name: "Execute within guardrails",
    authority:
      "Create drafts, briefs, issues, research packs, review notes inside a defined scope.",
    gate: "Founder gates still apply to external actions.",
  },
  {
    n: 4,
    name: "Spawn specialists",
    authority: "Propose and run task-scoped agents under their charter.",
    gate: "Founder approves each spawn.",
  },
  {
    n: 5,
    name: "Controlled self-improvement",
    authority: "Request new tools, MCP servers, workflows, context upgrades.",
    gate: "Founder approves. No self-modification.",
  },
];

// ── Permission tiers (config/permissions.yaml) ──────────────────────────────

export type PermissionTier = {
  tier: number;
  label: string;
  scope: string;
  detail: string;
};

export const PERMISSION_TIERS: PermissionTier[] = [
  {
    tier: 1,
    label: "Universal",
    scope: "Every Director",
    detail:
      "Read the docs, memory, and member Slack transcripts. Write to their own channel and their own initiative entries. Web and internal research.",
  },
  {
    tier: 2,
    label: "Functional",
    scope: "Role-specific per charter",
    detail:
      "The tools a role actually needs. Engineering reads the repos and CI; Finance reads the runway sheet; Marketing reads the analytics and competitor feeds.",
  },
  {
    tier: 3,
    label: "Founder-gated",
    scope: "Always requires logged approval",
    detail:
      "Eight actions no Director takes alone, regardless of autonomy layer. Publishing, spending, pricing, merges, deploys, contracts, legal or finance structure, and any outbound contact as the company.",
  },
];

/** The eight tier-3 actions that always require founder approval. */
export const FOUNDER_GATES: string[] = [
  "Publish externally",
  "Spend money",
  "Change pricing publicly",
  "Merge a major architecture change",
  "Deploy to a customer-facing surface",
  "Sign a contract or letter of intent",
  "Change legal or finance structure",
  "Contact a customer or partner as the company",
];

// ── MCP + tool layer (config/mcp.yaml, docs/mcp-layer.md) ────────────────────

export type McpServer = {
  id: string;
  label: string;
  transport: string;
  scope: string;
  grantedTo: string[];
  status: "live" | "requested" | "retired";
  provisioned: string;
  trialUntil: string;
  decisionId: string;
};

export const MCP_SERVERS: McpServer[] = [
  {
    id: "google-calendar",
    label: "Google Calendar",
    transport: "stdio · @cocal/google-calendar-mcp",
    scope:
      "Read and write the founder's calendar. List, search, create, and update events; free-busy queries.",
    grantedTo: ["operations-admin-founder-support", "product-strategy"],
    status: "live",
    provisioned: "2026-06-07",
    trialUntil: "2026-09-05",
    decisionId: "D-2026-06-07-mcp-google-calendar-trial",
  },
];

/** The MCP request lifecycle, from docs/mcp-layer.md. */
export const MCP_LIFECYCLE: { step: string; detail: string }[] = [
  { step: "Request", detail: "Any Director files the case. 48h pre-circulation." },
  { step: "Decide", detail: "Founder decides within seven days. Logged." },
  { step: "Provision", detail: "Entry added to mcp.yaml. Operator wires credentials." },
  { step: "Trial", detail: "90 days by default. One subtraction required per grant." },
  { step: "Review", detail: "Kept or retired within 14 days of trial end." },
];

// ── Workflows (workflows/*.md) ───────────────────────────────────────────────

export const WORKFLOWS: { label: string; ownerId: string; detail: string }[] = [
  {
    label: "Daily founder briefing",
    ownerId: "operations-admin-founder-support",
    detail: "Five lines every weekday morning: calendar, initiatives, decisions.",
  },
  {
    label: "Weekly advisory review",
    ownerId: "product-strategy",
    detail: "The board's weekly read. Every Director contributes.",
  },
  {
    label: "Monthly strategic review",
    ownerId: "product-strategy",
    detail: "One-page brief to the decision log.",
  },
  {
    label: "Quarterly company-evolution review",
    ownerId: "product-strategy",
    detail: "Two-page brief to the principles log.",
  },
  {
    label: "Tool and MCP request",
    ownerId: "engineering-systems-architecture",
    detail: "How a new capability enters the system, with a subtraction.",
  },
  {
    label: "Temporary agent spawn",
    ownerId: "product-strategy",
    detail: "Stand up a task-scoped specialist, then shut it down.",
  },
  {
    label: "Decision escalation",
    ownerId: "operations-admin-founder-support",
    detail: "Cross-Director conflict written up within 24 hours.",
  },
];

// ── Operating principles (memory/principles-log.md) ──────────────────────────

export const PRINCIPLES: string[] = [
  "Stay absurdly focused. Four products, one umbrella.",
  "Elegance is restraint. Default to subtraction.",
  "Calm coordination, not enterprise bloat.",
  "Avoid feature sprawl. Taste holds the veto.",
  "Four products, one system. Share state where it helps.",
  "Meetings happen because visibility is poor. Write first.",
  "Build for normal people, not just technical teams.",
  "Humans judge. Systems keep consistency.",
];

// ── Decision log (memory/decision-log.md) ────────────────────────────────────

export type DecisionRecord = {
  id: string;
  title: string;
  klass: string;
  date: string;
  surfacedBy: string;
  why: string;
};

export const DECISIONS: DecisionRecord[] = [
  {
    id: "D-2026-06-07-director-system-v2-expansion",
    title: "Expand the Director system from 10 to 17",
    klass: "charter-revision",
    date: "2026-06-07",
    surfacedBy: "product-strategy",
    why: "The 10-Director floor left three gaps: perceived performance, legal and risk, and creative motion. Four Product Excellence Directors give each shipped product one obsessive guardian.",
  },
  {
    id: "D-2026-06-07-mcp-google-calendar-trial",
    title: "Provision the Google Calendar MCP on a 90-day trial",
    klass: "tool-grant",
    date: "2026-06-07",
    surfacedBy: "operations-admin-founder-support",
    why: "Operations cannot deliver the daily briefing without the founder's calendar. The most maintained community server, read-and-write, on a bounded trial.",
  },
];

// ── Functional grants (config/permissions.yaml, tier-2 per charter) ──────────

/** The tier-2 tools a role actually holds. Directors not listed run on tier-1. */
export const FUNCTIONAL_GRANTS: Record<string, string[]> = {
  "engineering-systems-architecture": [
    "All six product repos",
    "GitHub issues + PRs",
    "CI status",
    "Sentry dashboards",
    "PR comments (no merge)",
  ],
  "operations-admin-founder-support": [
    "Founder calendar (MCP)",
    "Task tracker",
    "Escalation queue",
  ],
  "product-strategy": [
    "Cross-visibility across all Director channels",
    "Decision-log write",
    "Principles-log write",
  ],
  "marketing-growth-audience-insight": [
    "In-product analytics",
    "Competitor monitoring feeds",
    "Content + social research",
  ],
  "finance-capital-commercial-planning": [
    "Runway model (read-only)",
    "Pricing models",
    "Grant timelines",
  ],
  "customer-success-research-insight": [
    "Support transcripts",
    "Interview recordings",
  ],
  "brand-narrative-positioning": ["Customer-facing copy review", "External partner channels"],
  "creative-motion-experience": ["Motion + launch asset channels", "External creative feedback"],
};

// ── Derived helpers ──────────────────────────────────────────────────────────

/** Councils this Director sits on (chair or member). */
export function councilsForDirector(id: string): { council: Council; isChair: boolean }[] {
  return COUNCILS.filter(
    (c) => c.chairId === id || c.members === "all" || (Array.isArray(c.members) && c.members.includes(id)),
  ).map((council) => ({ council, isChair: council.chairId === id }));
}

/** Tier-2 functional tools for a Director (empty when tier-1 only). */
export function functionalTools(id: string): string[] {
  return FUNCTIONAL_GRANTS[id] ?? [];
}

export function directorName(id: string): string {
  return DIRECTORS.find((d: Director) => d.id === id)?.shortName ?? id;
}

// ── Chart columns (presentation grouping of the 17 + discovery roles) ────────

/**
 * The chart splits the org into finer columns than the 4 elt clusters so the
 * 17 Directors breathe horizontally. Peers/coordination still read from the
 * real cluster + coordination graph; this is layout only.
 */
export type ChartColumn = {
  id: string;
  label: string;
  subtitle: string;
  /** Director ids (real from elt) or discovery ids, top to bottom. */
  members: string[];
};

export const CHART_COLUMNS: ChartColumn[] = [
  {
    id: "strategy-voice",
    label: "Strategy & Voice",
    subtitle: "Holds the frame and the company's voice.",
    members: [
      "product-strategy",
      "brand-narrative-positioning",
      "customer-success-research-insight",
    ],
  },
  {
    id: "product-excellence",
    label: "Product Excellence",
    subtitle: "One obsessive guardian per shipped product.",
    members: [
      "roadmap-product-excellence",
      "tasks-product-excellence",
      "notes-product-excellence",
      "analytics-product-excellence",
    ],
  },
  {
    id: "experience-craft",
    label: "Experience & Craft",
    subtitle: "UX, taste, and perceived performance across the suite.",
    members: [
      "product-experience-ux",
      "product-taste-design-integrity",
      "performance-excellence-innovation",
    ],
  },
  {
    id: "build-ship",
    label: "Build & Ship",
    subtitle: "Engineering, creative, and operations landing the work.",
    members: [
      "engineering-systems-architecture",
      "creative-motion-experience",
      "operations-admin-founder-support",
      "data-infrastructure",
    ],
  },
  {
    id: "growth-market",
    label: "Growth & Market",
    subtitle: "Demand, revenue, and the audience.",
    members: [
      "marketing-growth-audience-insight",
      "revenue-partnerships-business-development",
      "community-advocacy",
    ],
  },
  {
    id: "risk-capital",
    label: "Risk & Capital",
    subtitle: "Runway, pricing, legal, and trust.",
    members: [
      "finance-capital-commercial-planning",
      "legal-risk-corporate-affairs",
      "security-trust",
    ],
  },
];

// ── Discovery roles (candidate Directors, not yet instantiated) ──────────────

/**
 * Roles under active consideration. Per signal-directors Initiative 6, a new
 * Director is only instantiated once a written case is made. These render in
 * the chart flagged "in discovery" so the shape of the next hires is visible.
 * Placeholders — confirm or rename before treating as real.
 */
export type DiscoveryRole = {
  id: string;
  name: string;
  shortName: string;
  oneLine: string;
};

export const DISCOVERY_DIRECTORS: DiscoveryRole[] = [
  {
    id: "data-infrastructure",
    name: "Director of Data & Infrastructure",
    shortName: "In discovery",
    oneLine: "Owns the data platform and the plumbing under the four products.",
  },
  {
    id: "community-advocacy",
    name: "Director of Community & Advocacy",
    shortName: "In discovery",
    oneLine: "Turns the audience into a community that carries the message.",
  },
  {
    id: "security-trust",
    name: "Director of Security & Trust",
    shortName: "In discovery",
    oneLine: "Owns security posture, privacy, and customer trust.",
  },
];

const DISCOVERY_IDS = new Set(DISCOVERY_DIRECTORS.map((d) => d.id));

export function isDiscovery(id: string): boolean {
  return DISCOVERY_IDS.has(id);
}

export function getDiscovery(id: string): DiscoveryRole | undefined {
  return DISCOVERY_DIRECTORS.find((d) => d.id === id);
}

/** Real (non-discovery) column peers for a Director, excluding self. */
export function columnPeers(id: string): string[] {
  const col = CHART_COLUMNS.find((c) => c.members.includes(id));
  if (!col) return [];
  return col.members.filter((m) => m !== id && !isDiscovery(m));
}

// ── Tools inventory (the stack + the grants + the MCP layer) ─────────────────

export type ToolGroup = {
  category: string;
  items: { name: string; note: string; tag?: "mcp" | "skill" | "core" }[];
};

export const TOOLS: ToolGroup[] = [
  {
    category: "Build & ship",
    items: [
      { name: "GitHub", note: "Source, pull requests, CI status" },
      { name: "Vercel", note: "Hosting and preview deploys" },
      { name: "Next.js", note: "App framework across every surface" },
      { name: "TypeScript", note: "One typed language, front to back" },
      { name: "pnpm", note: "Workspaces across the product repos" },
      { name: "Drizzle", note: "Typed schema and migrations" },
    ],
  },
  {
    category: "Quality & monitoring",
    items: [
      { name: "Sentry", note: "Runtime errors and traces" },
      { name: "Playwright", note: "End-to-end and visual checks" },
      { name: "ds-check", note: "Design-system drift gate" },
      { name: "Vercel Analytics", note: "Real-user performance" },
    ],
  },
  {
    category: "Plan & coordinate",
    items: [
      { name: "Linear", note: "Issues and cycles" },
      { name: "Slack", note: "25 channels, one per director and panel" },
      { name: "Atlas map", note: "Living map of every system" },
      { name: "Decision log", note: "Append-only record of calls" },
    ],
  },
  {
    category: "AI leadership",
    items: [
      { name: "Claude Code", note: "One subagent per Director", tag: "core" },
      { name: "Claude Design", note: "Brand and design-system sync" },
      { name: "Google Calendar", note: "Founder calendar, live grant", tag: "mcp" },
      { name: "Brand-voice", note: "Voice enforcement on all copy", tag: "skill" },
    ],
  },
  {
    category: "Research & signal",
    items: [
      { name: "In-product analytics", note: "What users actually do" },
      { name: "Competitor monitoring", note: "Market moves worth knowing" },
      { name: "Web research", note: "Open research, every Director" },
      { name: "Customer interviews", note: "The real problem underneath" },
    ],
  },
  {
    category: "Finance & legal",
    items: [
      { name: "Runway model", note: "Cash and burn" },
      { name: "Pricing models", note: "Unit economics" },
      { name: "Grant timelines", note: "Non-dilutive funding" },
      { name: "Risk register", note: "What could go wrong, tracked" },
    ],
  },
];

export const TOOLS_COUNT = TOOLS.reduce((n, g) => n + g.items.length, 0);

// ── Headline counts (all real, all derived) ─────────────────────────────────

const layer3Count = DIRECTORS.filter((d) => d.autonomyLayer === 3).length;
const vetoCount = DIRECTORS.filter((d) => d.veto?.length).length;
const productLeadCount = DIRECTORS.filter((d) => d.cluster === "product_excellence").length;

export const ORG_COUNTS = {
  founder: 1,
  directors: DIRECTORS.length,
  divisions: CHART_COLUMNS.length,
  discovery: DISCOVERY_DIRECTORS.length,
  tools: TOOLS_COUNT,
  councils: COUNCILS.length,
  autonomyLayers: AUTONOMY_LADDER.length,
  permissionTiers: PERMISSION_TIERS.length,
  founderGates: FOUNDER_GATES.length,
  mcpLive: MCP_SERVERS.filter((s) => s.status === "live").length,
  channels: 25,
  cadences: 4,
  workflows: WORKFLOWS.length,
  principles: PRINCIPLES.length,
  coordinationPaths: COORDINATION_EDGE_COUNT,
  layer3: layer3Count,
  veto: vetoCount,
  productLeads: productLeadCount,
} as const;

export type DeckStat = { value: string; label: string; accent?: boolean };

/** The command-deck readout strip. Legible left to right, all sourced. */
export function deckStats(): DeckStat[] {
  return [
    { value: `1 + ${ORG_COUNTS.directors}`, label: "founder + directors", accent: true },
    { value: String(ORG_COUNTS.divisions), label: "divisions" },
    { value: String(ORG_COUNTS.councils), label: "standing councils" },
    { value: String(ORG_COUNTS.coordinationPaths), label: "coordination paths" },
    { value: String(ORG_COUNTS.tools), label: "tools + platforms" },
    { value: String(ORG_COUNTS.mcpLive), label: "mcp live" },
    { value: String(ORG_COUNTS.channels), label: "slack channels" },
    { value: String(ORG_COUNTS.discovery), label: "in discovery" },
  ];
}
