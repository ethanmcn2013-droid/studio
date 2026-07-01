/**
 * Signal Studio Advisors — snapshot.
 *
 * Mirrors the source of truth at
 * `signal-directors/config/advisors.yaml` (v2, 2026-06-07).
 * When that file changes, mirror the change here and bump `generatedAt`.
 *
 * The chart at /hq/org reads this; the drill-down at /hq/org/<id>
 * reads the same record. Charter prose lives in
 * `signal-directors/advisors/<id>.md` — link out, don't copy.
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

export type Advisor = {
  id: string;
  name: string;
  shortName: string;
  persona: string;
  charterHref: string;
  slackChannel: string;
  cadence: Cadence;
  autonomyLayer: 2 | 3;
  cluster: Cluster;
  product?: "timeline" | "tasks" | "notes" | "signal";
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
    subtitle: "Engineering, creative, operations — the work landing on time.",
  },
  {
    id: "growth_commercial",
    label: "Growth & Commercial",
    subtitle: "Demand, revenue, runway, risk.",
  },
];

export const DIRECTORS: Advisor[] = [
  {
    id: "product-strategy",
    name: "Advisor for Product, Strategy & Prioritization",
    shortName: "Jobs",
    persona: "Steve Jobs",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/advisors/product-strategy.md",
    slackChannel: "#advisor-product-strategy",
    cadence: "weekly",
    autonomyLayer: 2,
    cluster: "strategy_voice",
    oneLine:
      "Chief of staff. Keeps the company focused on the right things at the right time.",
    owns: [
      "timeline sequencing",
      "launch sequencing",
      "weekly advisory review",
      "monthly strategy review",
      "quarterly company-evolution review",
    ],
  },
  {
    id: "brand-narrative-positioning",
    name: "Advisor for Brand, Narrative & Positioning",
    shortName: "Jobs-Brand",
    persona: "Steve Jobs (brand voice)",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/advisors/brand-narrative-positioning.md",
    slackChannel: "#advisor-brand-narrative",
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
    name: "Advisor for Customer Success, Research & Insight",
    shortName: "Sagan",
    persona: "Carl Sagan",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/advisors/customer-success-research-insight.md",
    slackChannel: "#advisor-customer-insight",
    cadence: "weekly",
    autonomyLayer: 2,
    cluster: "strategy_voice",
    oneLine: "Understands the real problem underneath customer feedback.",
    owns: ["feedback synthesis", "interview cadence", "real problem identification"],
  },
  {
    id: "timeline-product-excellence",
    name: "Advisor for Timeline Product Excellence",
    shortName: "Da Vinci",
    persona: "Leonardo da Vinci",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/advisors/timeline-product-excellence.md",
    slackChannel: "#advisor-timeline-excellence",
    cadence: "weekly",
    autonomyLayer: 2,
    cluster: "product_excellence",
    product: "timeline",
    oneLine: "Planning should feel clear and calm.",
    owns: ["timeline product quality", "planning clarity", "feature excellence (timeline)"],
  },
  {
    id: "tasks-product-excellence",
    name: "Advisor for Tasks Product Excellence",
    shortName: "Caravaggio",
    persona: "Caravaggio",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/advisors/tasks-product-excellence.md",
    slackChannel: "#advisor-tasks-excellence",
    cadence: "weekly",
    autonomyLayer: 2,
    cluster: "product_excellence",
    product: "tasks",
    oneLine: "Execution should be frictionless.",
    owns: ["tasks product quality", "execution frictionlessness", "feature excellence (tasks)"],
  },
  {
    id: "notes-product-excellence",
    name: "Advisor for Notes Product Excellence",
    shortName: "Dalí",
    persona: "Salvador Dalí",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/advisors/notes-product-excellence.md",
    slackChannel: "#advisor-notes-excellence",
    cadence: "weekly",
    autonomyLayer: 2,
    cluster: "product_excellence",
    product: "notes",
    oneLine: "Capture should be effortless.",
    owns: ["notes product quality", "capture effortlessness", "feature excellence (notes)"],
  },
  {
    id: "signal-product-excellence",
    name: "Advisor for Signal Product Excellence",
    shortName: "Einstein",
    persona: "Albert Einstein",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/advisors/signal-product-excellence.md",
    slackChannel: "#advisor-signal-excellence",
    cadence: "weekly",
    autonomyLayer: 2,
    cluster: "product_excellence",
    product: "signal",
    oneLine: "Surface signal without overwhelm.",
    owns: ["Signal product quality", "signal without overwhelm", "feature excellence (Signal)"],
  },
  {
    id: "product-experience-ux",
    name: "Advisor for Product Experience (UX)",
    shortName: "Ive",
    persona: "Jony Ive",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/advisors/product-experience-ux.md",
    slackChannel: "#advisor-product-experience",
    cadence: "weekly",
    autonomyLayer: 2,
    cluster: "product_excellence",
    oneLine: "Makes Signal Studio feel obvious.",
    owns: ["in-product flows", "navigation and IA", "onboarding", "UX friction audit"],
  },
  {
    id: "product-taste-design-integrity",
    name: "Advisor for Product Taste & Design Integrity",
    shortName: "Rams",
    persona: "Dieter Rams",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/advisors/product-taste-design-integrity.md",
    slackChannel: "#advisor-product-taste",
    cadence: "triggered",
    autonomyLayer: 2,
    cluster: "product_excellence",
    oneLine: "Protects elegance through restraint. Holds veto authority over bloat.",
    owns: ["taste review", "bloat detection", "visual coherence across suite"],
    veto: ["feature addition", "visual coherence"],
  },
  {
    id: "performance-excellence-innovation",
    name: "Advisor for Product Performance, Technical Excellence & Innovation",
    shortName: "Jensen",
    persona: "Jensen Huang",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/advisors/performance-excellence-innovation.md",
    slackChannel: "#advisor-performance-excellence",
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
    name: "Advisor for Engineering, Systems & Architecture",
    shortName: "Turing",
    persona: "Alan Turing",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/advisors/engineering-systems-architecture.md",
    slackChannel: "#advisor-engineering-systems",
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
    name: "Advisor for Creative, Motion & Experience Design",
    shortName: "Pixar",
    persona: "Pixar",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/advisors/creative-motion-experience.md",
    slackChannel: "#advisor-creative-motion",
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
    name: "Advisor for Operations, Administration & Founder Support",
    shortName: "Cook",
    persona: "Tim Cook",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/advisors/operations-admin-founder-support.md",
    slackChannel: "#advisor-operations",
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
    name: "Advisor for Marketing, Growth & Audience Insight",
    shortName: "Hormozi",
    persona: "Alex Hormozi",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/advisors/marketing-growth-audience-insight.md",
    slackChannel: "#advisor-marketing-growth",
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
    name: "Advisor for Revenue, Partnerships & Business Development",
    shortName: "Cuban",
    persona: "Mark Cuban",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/advisors/revenue-partnerships-business-development.md",
    slackChannel: "#advisor-revenue-partnerships",
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
    name: "Advisor for Finance, Capital & Commercial Planning",
    shortName: "Buffett",
    persona: "Warren Buffett",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/advisors/finance-capital-commercial-planning.md",
    slackChannel: "#advisor-finance",
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
    name: "Advisor for Legal, Risk & Corporate Affairs",
    shortName: "Specter",
    persona: "Harvey Specter",
    charterHref:
      "https://github.com/ethanmcn2013-droid/signal-directors/blob/main/advisors/legal-risk-corporate-affairs.md",
    slackChannel: "#advisor-legal-risk",
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
  source: "signal-directors/config/advisors.yaml",
  founderName: "Ethan",
  founderRole: "Founder & Final Call",
} as const;

export function getDirector(id: string): Advisor | undefined {
  return DIRECTORS.find((d) => d.id === id);
}

export function directorsByCluster(cluster: Cluster): Advisor[] {
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
