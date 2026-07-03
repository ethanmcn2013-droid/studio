/**
 * Signal Studio Executive Leadership Team, snapshot.
 *
 * Mirrors the source of truth at
 * `signal-directors/config/directors.yaml` (v2, 2026-06-07).
 * When that file changes, mirror the change here and bump `generatedAt`.
 *
 * The chart at /hq/org reads this; the drill-down at /hq/org/<id>
 * reads the same record. Charter prose lives in
 * `signal-directors/directors/<id>.md`, link out, don't copy.
 */

export type Cadence =
  | "daily"
  | "weekly"
  | "weekly_or_biweekly"
  | "triggered"
  | "opportunity_driven"
  | "launch_driven";

export type Cluster =
  | "apex"
  | "strategy_voice"
  | "product_excellence"
  | "build_ship"
  | "growth_commercial";

export type Director = {
  id: string;
  name: string;
  shortName: string;
  persona: string;
  charterHref: string;
  slackChannel: string;
  cadence: Cadence;
  autonomyLayer: 2 | 3;
  cluster: Cluster;
  product?: "roadmap" | "tasks" | "notes" | "analytics";
  owns: string[];
  oneLine: string;
  veto?: string[];
};

export const CLUSTERS: { id: Cluster; label: string; subtitle: string }[] = [
  {
    id: "apex",
    label: "Founder",
    subtitle: "Final call on every Tier-3 gate.",
  },
  {
    id: "strategy_voice",
    label: "Strategy & Voice",
    subtitle: "Holds the four-products-one-system frame and the company's voice.",
  },
  {
    id: "product_excellence",
    label: "Product Excellence Council",
    subtitle: "Per-product taste leads + horizontal UX, Taste, Performance.",
  },
  {
    id: "build_ship",
    label: "Build & Ship",
    subtitle: "Engineering, creative, operations, the work landing on time.",
  },
  {
    id: "growth_commercial",
    label: "Growth & Commercial",
    subtitle: "Demand, revenue, runway, risk.",
  },
];

export const DIRECTORS: Director[] = [
  {
    id: "product-strategy",
    name: "Director of Product, Strategy & Prioritization",
    shortName: "Jobs",
    persona: "Steve Jobs",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/directors/product-strategy.md",
    slackChannel: "#director-product-strategy",
    cadence: "weekly",
    autonomyLayer: 2,
    cluster: "strategy_voice",
    oneLine:
      "Chief of staff. Keeps the company focused on the right things at the right time.",
    owns: [
      "roadmap sequencing",
      "launch sequencing",
      "weekly executive review",
      "monthly strategic review",
      "quarterly company-evolution review",
    ],
  },
  {
    id: "brand-narrative-positioning",
    name: "Director of Brand, Narrative & Positioning",
    shortName: "Jobs-Brand",
    persona: "Steve Jobs (brand voice)",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/directors/brand-narrative-positioning.md",
    slackChannel: "#director-brand-narrative",
    cadence: "weekly",
    autonomyLayer: 2,
    cluster: "strategy_voice",
    oneLine:
      "Ensures Signal Studio sounds and feels like one coherent company.",
    owns: [
      "brand voice",
      "customer-facing copy review",
      "positioning drift watch",
      "banned words enforcement",
    ],
  },
  {
    id: "customer-success-research-insight",
    name: "Director of Customer Success, Research & Insight",
    shortName: "Sagan",
    persona: "Carl Sagan",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/directors/customer-success-research-insight.md",
    slackChannel: "#director-customer-insight",
    cadence: "weekly",
    autonomyLayer: 2,
    cluster: "strategy_voice",
    oneLine: "Understands the real problem underneath customer feedback.",
    owns: ["feedback synthesis", "interview cadence", "real problem identification"],
  },
  {
    id: "roadmap-product-excellence",
    name: "Director of Roadmap Product Excellence",
    shortName: "Da Vinci",
    persona: "Leonardo da Vinci",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/directors/roadmap-product-excellence.md",
    slackChannel: "#director-roadmap-excellence",
    cadence: "weekly",
    autonomyLayer: 2,
    cluster: "product_excellence",
    product: "roadmap",
    oneLine: "Planning should feel clear and calm.",
    owns: ["roadmap product quality", "planning clarity", "feature excellence (roadmap)"],
  },
  {
    id: "tasks-product-excellence",
    name: "Director of Tasks Product Excellence",
    shortName: "Caravaggio",
    persona: "Caravaggio",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/directors/tasks-product-excellence.md",
    slackChannel: "#director-tasks-excellence",
    cadence: "weekly",
    autonomyLayer: 2,
    cluster: "product_excellence",
    product: "tasks",
    oneLine: "Execution should be frictionless.",
    owns: ["tasks product quality", "execution frictionlessness", "feature excellence (tasks)"],
  },
  {
    id: "notes-product-excellence",
    name: "Director of Notes Product Excellence",
    shortName: "Dalí",
    persona: "Salvador Dalí",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/directors/notes-product-excellence.md",
    slackChannel: "#director-notes-excellence",
    cadence: "weekly",
    autonomyLayer: 2,
    cluster: "product_excellence",
    product: "notes",
    oneLine: "Capture should be effortless.",
    owns: ["notes product quality", "capture effortlessness", "feature excellence (notes)"],
  },
  {
    id: "analytics-product-excellence",
    name: "Director of Analytics Product Excellence",
    shortName: "Einstein",
    persona: "Albert Einstein",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/directors/analytics-product-excellence.md",
    slackChannel: "#director-analytics-excellence",
    cadence: "weekly",
    autonomyLayer: 2,
    cluster: "product_excellence",
    product: "analytics",
    oneLine: "Surface signal without overwhelm.",
    owns: ["analytics product quality", "signal without overwhelm", "feature excellence (analytics)"],
  },
  {
    id: "product-experience-ux",
    name: "Director of Product Experience (UX)",
    shortName: "Ive",
    persona: "Jony Ive",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/directors/product-experience-ux.md",
    slackChannel: "#director-product-experience",
    cadence: "weekly",
    autonomyLayer: 2,
    cluster: "product_excellence",
    oneLine: "Makes Signal Studio feel obvious.",
    owns: ["in-product flows", "navigation and IA", "onboarding", "UX friction audit"],
  },
  {
    id: "product-taste-design-integrity",
    name: "Director of Product Taste & Design Integrity",
    shortName: "Rams",
    persona: "Dieter Rams",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/directors/product-taste-design-integrity.md",
    slackChannel: "#director-product-taste",
    cadence: "triggered",
    autonomyLayer: 2,
    cluster: "product_excellence",
    oneLine: "Protects elegance through restraint. Holds veto authority over bloat.",
    owns: ["taste review", "bloat detection", "visual coherence across suite"],
    veto: ["feature addition", "visual coherence"],
  },
  {
    id: "performance-excellence-innovation",
    name: "Director of Product Performance, Technical Excellence & Innovation",
    shortName: "Jensen",
    persona: "Jensen Huang",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/directors/performance-excellence-innovation.md",
    slackChannel: "#director-performance-excellence",
    cadence: "weekly",
    autonomyLayer: 2,
    cluster: "product_excellence",
    oneLine: "Makes Signal Studio feel world-class.",
    owns: [
      "perceived performance",
      "responsiveness budget",
      "technical polish",
      "world-class signal",
      "innovation scouting",
    ],
  },
  {
    id: "engineering-systems-architecture",
    name: "Director of Engineering, Systems & Architecture",
    shortName: "Turing",
    persona: "Alan Turing",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/directors/engineering-systems-architecture.md",
    slackChannel: "#director-engineering-systems",
    cadence: "weekly",
    autonomyLayer: 3,
    cluster: "build_ship",
    oneLine: "Keeps engineering elegant, maintainable, and coherent.",
    owns: [
      "architecture review",
      "technical debt",
      "code quality",
      "cross-repo coherence",
      "dependency health",
    ],
  },
  {
    id: "creative-motion-experience",
    name: "Director of Creative, Motion & Experience Design",
    shortName: "Pixar",
    persona: "Pixar",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/directors/creative-motion-experience.md",
    slackChannel: "#director-creative-motion",
    cadence: "launch_driven",
    autonomyLayer: 2,
    cluster: "build_ship",
    oneLine: "Premium and calm.",
    owns: [
      "motion language",
      "launch visuals",
      "animation cohesion",
      "emotional experience",
      "premium feel",
    ],
  },
  {
    id: "operations-admin-founder-support",
    name: "Director of Operations, Administration & Founder Support",
    shortName: "Cook",
    persona: "Tim Cook",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/directors/operations-admin-founder-support.md",
    slackChannel: "#director-operations",
    cadence: "daily",
    autonomyLayer: 3,
    cluster: "build_ship",
    oneLine: "Keeps Ethan organised and unblocks momentum.",
    owns: [
      "daily founder briefing",
      "follow-ups and deadlines",
      "decision log appends",
      "active initiatives register",
      "escalation routing",
    ],
  },
  {
    id: "marketing-growth-audience-insight",
    name: "Director of Marketing, Growth & Audience Insight",
    shortName: "Hormozi",
    persona: "Alex Hormozi",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/directors/marketing-growth-audience-insight.md",
    slackChannel: "#director-marketing-growth",
    cadence: "weekly",
    autonomyLayer: 2,
    cluster: "growth_commercial",
    oneLine: "Understands demand and creates momentum.",
    owns: [
      "campaign cycles",
      "content cycles",
      "audience signal",
      "competitor monitoring",
    ],
  },
  {
    id: "revenue-partnerships-business-development",
    name: "Director of Revenue, Partnerships & Business Development",
    shortName: "Cuban",
    persona: "Mark Cuban",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/directors/revenue-partnerships-business-development.md",
    slackChannel: "#director-revenue-partnerships",
    cadence: "opportunity_driven",
    autonomyLayer: 2,
    cluster: "growth_commercial",
    oneLine: "Finds revenue opportunities. Opportunity-driven cadence.",
    owns: [
      "partnership pipeline",
      "inbound partner inquiries",
      "referral tracking",
    ],
  },
  {
    id: "finance-capital-commercial-planning",
    name: "Director of Finance, Capital & Commercial Planning",
    shortName: "Buffett",
    persona: "Warren Buffett",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/directors/finance-capital-commercial-planning.md",
    slackChannel: "#director-finance",
    cadence: "weekly_or_biweekly",
    autonomyLayer: 2,
    cluster: "growth_commercial",
    oneLine: "Protects financial health and commercial viability. Quiet by default.",
    owns: [
      "runway model",
      "pricing model",
      "grant timeline",
      "unit economics watch",
    ],
  },
  {
    id: "legal-risk-corporate-affairs",
    name: "Director of Legal, Risk & Corporate Affairs",
    shortName: "Specter",
    persona: "Harvey Specter",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/directors/legal-risk-corporate-affairs.md",
    slackChannel: "#director-legal-risk",
    cadence: "triggered",
    autonomyLayer: 2,
    cluster: "growth_commercial",
    oneLine: "How do we safely do yes?",
    owns: [
      "contract review",
      "IP posture",
      "incorporation admin",
      "risk register",
      "legal structure watch",
    ],
  },
];

export const ELT_SNAPSHOT = {
  generatedAt: "2026-06-07",
  sourceVersion: 2,
  source: "signal-directors/config/directors.yaml",
  founderName: "Ethan",
  founderRole: "Founder & Final Call",
} as const;

export function getDirector(id: string): Director | undefined {
  return DIRECTORS.find((d) => d.id === id);
}

export function directorsByCluster(cluster: Cluster): Director[] {
  return DIRECTORS.filter((d) => d.cluster === cluster);
}

export function formatCadence(c: Cadence): string {
  switch (c) {
    case "weekly_or_biweekly":
      return "weekly / bi-weekly";
    case "opportunity_driven":
      return "opportunity-driven";
    case "launch_driven":
      return "launch-driven";
    default:
      return c;
  }
}
