/**
 * Signal Studio — Founder Operating System Blueprint (data model).
 *
 * This is the single typed source for the zoomable operating map at
 * `/hq/blueprint`. It is intentionally a hand-curated, founder-grade
 * document — not a live feed. The map's job is to explain how the
 * company works, grows, ships, thinks, and stays focused, in one place
 * the founder actually opens weekly.
 *
 * ── HOW TO UPDATE ───────────────────────────────────────────────────
 * Edit the exported constants below. The page re-renders from them.
 * Keep product language plain; keep internal-operating language sharp.
 * Don't grow this into a CRM/PM tool — it is a *map*, not a system of
 * record. The systems of record already exist (CRM at /hq/crm,
 * directors at /hq/org, atlas at /hq/atlas, numbers at /hq/reporting).
 *
 * ── LIVE DATA ───────────────────────────────────────────────────────
 * Everything marked `// LIVE DATA:` is a placeholder the founder can
 * later wire to a real source. The connect-points are deliberately
 * thin so wiring one never forces a redesign:
 *   - Metrics  → src/lib/hq/traction.ts + getHqSnapshot (Turso ledger)
 *   - Pipeline → src/lib/hq/crm-db.ts (prospects)
 *   - Risks/decisions → content/hq/risks/*.md, content/hq/decisions/*.md
 *   - Directors → src/lib/hq/elt.ts (already live in this file's render)
 * Until wired, placeholders are clearly marked and honest (no vanity
 * numbers presented as real).
 * ────────────────────────────────────────────────────────────────────
 */

export const BLUEPRINT_META = {
  title: "Founder Operating System",
  subtitle: "How Signal Studio works, grows, ships, thinks, and stays focused.",
  // LIVE DATA: set to the real freeze date when this map is reviewed.
  revisedOn: "2026-06-15",
  hardLaunch: "2026-09-01",
  initialWedge: "Wedding venues — Ireland, starting in Limerick",
  secondaryWedge: "Students — academic-year planning",
  expansion: "Ireland → UK → English-speaking → localized markets",
} as const;

/* ════════════════════════════════════════════════════════════════════
   1 · NORTH STAR
   ════════════════════════════════════════════════════════════════════ */

export type Principle = { title: string; body: string };

export type FlywheelStep = {
  step: string;
  detail: string;
};

export const NORTH_STAR = {
  mission:
    "Give the 80% of people who don't work in tech a calm way to coordinate work — clarity without the enterprise tax.",
  positioning: [
    "Four products, one system.",
    "Meetings happen because visibility is poor.",
    "Signal, not noise.",
    "Calm coordination, not enterprise complexity.",
  ],
  principles: [
    {
      title: "Elegance is restraint",
      body: "Every feature must earn its place. The default answer to a new feature is no.",
    },
    {
      title: "Reduce noise",
      body: "The product wins by removing things from the user's day, not adding to it.",
    },
    {
      title: "Plain language",
      body: "If a non-technical person can't understand it in one read, it isn't done.",
    },
    {
      title: "Stay absurdly focused",
      body: "One wedge, one system, one quality bar. We win narrow before we go wide.",
    },
    {
      title: "Visibility kills meetings",
      body: "When the right people can see the right thing, the meeting was never needed.",
    },
  ] satisfies Principle[],
  brandPhilosophy:
    "Apple-like restraint. White, ink, indigo, hairlines, and one dot. The product should feel quiet and certain — the opposite of a busy enterprise dashboard. What we leave out is the brand.",
  flywheel: [
    { step: "Capture clarity", detail: "Notes turns scattered thinking into one calm place." },
    { step: "Turn into action", detail: "Tasks converts thinking into owned, dated work." },
    { step: "Show direction", detail: "Timeline makes where things are going visible to all." },
    { step: "Surface attention", detail: "Signal shows the one thing that needs a human now." },
    { step: "Better decisions", detail: "Visible work means fewer meetings and faster calls." },
    { step: "Less chaos → trust", detail: "Calm teams invite collaborators, who become new creators." },
  ] satisfies FlywheelStep[],
} as const;

/* ════════════════════════════════════════════════════════════════════
   2 · PRODUCT SYSTEM BLUEPRINT
   Notes → Tasks → Timeline → Signal → better decisions → less chaos
   ════════════════════════════════════════════════════════════════════ */

export type ProductBlueprint = {
  key: "notes" | "tasks" | "timeline" | "signal";
  name: string;
  role: string;          // plain-language one-liner
  href: string;          // live product subdomain
  purpose: string;
  inputs: string[];
  outputs: string[];
  keyActions: string[];
  neverBecome: string;
  successMetrics: string[];
};

export const PRODUCT_FLOW = [
  "Notes",
  "Tasks",
  "Timeline",
  "Signal",
  "Better decisions",
  "Less chaos",
] as const;

export const PRODUCTS: ProductBlueprint[] = [
  {
    key: "notes",
    name: "Notes",
    role: "Capture thinking",
    href: "https://notes.signalstudio.ie",
    purpose: "Get a thought out of your head in three seconds, before it's lost.",
    inputs: ["Quick captures", "Meeting jottings", "Pasted text", "Forwarded email (capture@)"],
    outputs: ["A clean notebook", "One-way extract → Tasks"],
    keyActions: ["Capture", "Tidy later", "Send one line to Tasks"],
    neverBecome: "A document editor, a wiki, or a second inbox to manage.",
    // LIVE DATA: notes activation + capture counts (notes app analytics).
    successMetrics: ["Time-to-first-capture < 3s", "Captures → tasks conversion %"],
  },
  {
    key: "tasks",
    name: "Tasks",
    role: "Turn thinking into action",
    href: "https://taskshq.com",
    purpose: "Make a clear, owned, dated list of what actually has to happen.",
    inputs: ["Extracts from Notes", "Quick adds", "Templates", "Shared assignments"],
    outputs: ["Owned tasks", "Status the team can see", "Feeds Timeline + Signal"],
    keyActions: ["Add", "Assign", "Set a date", "Mark done"],
    neverBecome: "Jira. No sprints, story points, custom workflows, or burndown.",
    // LIVE DATA: tasks created / completed, WAU (tasks app analytics).
    successMetrics: ["Weekly active users", "Tasks completed / created ratio"],
  },
  {
    key: "timeline",
    name: "Timeline",
    role: "Show where things are going",
    href: "https://timeline.signalstudio.ie",
    purpose: "Make direction visible so nobody has to ask 'where are we?'.",
    inputs: ["Dated tasks", "Milestones", "Public-by-default shares"],
    outputs: ["A shareable timeline", "A read-only public view"],
    keyActions: ["Place a milestone", "Share a link", "Watch it move"],
    neverBecome: "A Gantt chart, a resource planner, or a dependency engine.",
    // LIVE DATA: timeline shares created, public-view opens (timeline app).
    successMetrics: ["Shared timelines created", "Public-view open rate"],
  },
  {
    key: "signal",
    name: "Signal",
    role: "Show what needs attention",
    href: "https://signal.signalstudio.ie",
    purpose: "Surface the one thing a human needs to look at — and nothing else.",
    inputs: ["Task + timeline state", "Deterministic rules", "Curated prose"],
    outputs: ["A daily briefing", "A short attention list"],
    keyActions: ["Read the daily signal", "Act on the top item", "Close the loop"],
    neverBecome: "A notification firehose, an analytics suite, or an LLM chatbot.",
    // LIVE DATA: daily-signal opens, top-item action rate (signal app).
    successMetrics: ["Daily briefing open rate", "Top-item action rate"],
  },
];

/* ════════════════════════════════════════════════════════════════════
   3 · CUSTOMER BLUEPRINT
   ════════════════════════════════════════════════════════════════════ */

export type CustomerSegment = {
  key: string;
  name: string;
  primary?: boolean;     // the wedge
  painPoints: string[];
  workflow: string[];
  templates: string[];
  activationMoment: string;
  retentionDriver: string;
};

export const CUSTOMER_SEGMENTS: CustomerSegment[] = [
  {
    key: "venues",
    name: "Wedding venues",
    primary: true,
    painPoints: [
      "Every couple's plan lives in a different inbox thread",
      "Coordinators repeat the same status to five people a day",
      "Nothing is visible to the couple without a phone call",
    ],
    workflow: [
      "Note the enquiry",
      "Build the couple's task list from a template",
      "Share a calm timeline with the couple",
      "Signal flags the next thing due",
    ],
    templates: ["Wedding-day run sheet", "Couple onboarding", "Supplier checklist"],
    activationMoment: "First couple's timeline shared and opened by the couple.",
    retentionDriver: "Coordinators stop fielding 'where are we?' calls.",
  },
  {
    key: "students",
    name: "Students",
    painPoints: [
      "Deadlines scattered across modules and emails",
      "No single view of the academic year",
      "Group projects with no visible owner",
    ],
    workflow: [
      "Capture the brief in Notes",
      "Break it into dated tasks",
      "See the term on a timeline",
      "Signal nudges what's due this week",
    ],
    templates: ["Semester planner", "Dissertation plan", "Group-project board"],
    activationMoment: "First full term laid out on a timeline.",
    retentionDriver: "Walking into exam season already organised.",
  },
  {
    key: "smb",
    name: "Small businesses",
    painPoints: [
      "Owner is the single point of coordination",
      "Work lives in heads and WhatsApp",
      "Meetings exist only to sync status",
    ],
    workflow: [
      "Capture jobs in Notes",
      "Assign owned tasks",
      "Timeline shows the week",
      "Signal surfaces what's slipping",
    ],
    templates: ["Client onboarding", "Weekly ops", "Service delivery checklist"],
    activationMoment: "First week where the team self-serves status without a meeting.",
    retentionDriver: "The Monday meeting gets shorter every week.",
  },
  {
    key: "personal",
    name: "Personal projects",
    painPoints: [
      "Ideas outpace follow-through",
      "No calm home for a side project",
      "Motivation dies in scattered tools",
    ],
    workflow: [
      "Capture the idea in Notes",
      "Make the next three tasks",
      "See the arc on a timeline",
      "Signal keeps it warm",
    ],
    templates: ["Side-project starter", "Move-house plan", "Trip planner"],
    activationMoment: "First project taken from idea to a visible plan in one sitting.",
    retentionDriver: "Progress you can see keeps the project alive.",
  },
];

/* ════════════════════════════════════════════════════════════════════
   4 · GROWTH MACHINE
   ════════════════════════════════════════════════════════════════════ */

export type GrowthStage = {
  phase: string;         // sequencing label
  title: string;
  detail: string;
  status: "live" | "building" | "queued";
  // LIVE DATA: replace with a real number from CRM / analytics.
  metric: string;
};

export const GROWTH_MACHINE: GrowthStage[] = [
  {
    phase: "Wedge",
    title: "Limerick local launch",
    detail: "Win one city before the country. Founder-signed, hand-delivered, local.",
    status: "building",
    metric: "1 paid premium venue (Gate 0)",
  },
  {
    phase: "Wedge",
    title: "Venue outreach",
    detail: "Founder-signed sequence to named venues. Quality over volume.",
    status: "building",
    metric: "founder sends → qualified replies", // LIVE DATA: /hq/crm
  },
  {
    phase: "Adjacent",
    title: "College / student launch",
    detail: "Academic-year planning as the second wedge, timed to term start.",
    status: "queued",
    metric: "student signups", // LIVE DATA: notes/tasks signups by source
  },
  {
    phase: "Demand",
    title: "Founder content",
    detail: "Build-in-public narrative — the calm-coordination point of view.",
    status: "building",
    metric: "reach → site visits",
  },
  {
    phase: "Demand",
    title: "Motion-graphics content",
    detail: "The Film System — 30 motion-graphic films carrying the brand.",
    status: "building",
    metric: "films shipped / planned", // LIVE DATA: /brand/motion-brief
  },
  {
    phase: "Demand",
    title: "Paid ads",
    detail: "Switched on only after organic proves the message. Not before.",
    status: "queued",
    metric: "CAC vs. licence value",
  },
  {
    phase: "Compounding",
    title: "Referral loops",
    detail: "Shared timelines invite collaborators, who become new creators.",
    status: "queued",
    metric: "invites → activated workspaces",
  },
  {
    phase: "Expansion",
    title: "Geographic expansion",
    detail: "Ireland → UK → English-speaking → localized. One market at a time.",
    status: "queued",
    metric: "markets live",
  },
];

/* ════════════════════════════════════════════════════════════════════
   5 · SIGNAL HQ — INTERNAL OPERATING SYSTEM (business functions)
   ════════════════════════════════════════════════════════════════════ */

export type OperatingFunction = {
  key: string;
  name: string;
  owner: string;
  director: string;      // links to the AI director layer
  tools: string[];
  cadence: string;
  outputs: string[];
  metrics: string[];
  risk: string;
};

export const OPERATING_FUNCTIONS: OperatingFunction[] = [
  {
    key: "founder-office",
    name: "Founder Office",
    owner: "Founder",
    director: "Drucker · management",
    tools: ["Signal HQ", "Atlas", "Reporting"],
    cadence: "Daily review",
    outputs: ["The one decision of the day", "Direction held"],
    metrics: ["Focus: one wedge live"],
    risk: "Founder-time is the bottleneck for every other function.",
  },
  {
    key: "product",
    name: "Product",
    owner: "Founder + product directors",
    director: "Jobs · product & strategy",
    tools: ["The four apps", "PRODUCT.md specs", "GSD planning"],
    cadence: "Weekly product review",
    outputs: ["Locked specs", "Shipped scope", "What we said no to"],
    metrics: ["Scope shipped / planned", "Features rejected"],
    risk: "Scope creep dilutes the restraint that is the brand.",
  },
  {
    key: "engineering",
    name: "Engineering",
    owner: "Founder",
    director: "Jensen · engineering · Turing · architecture",
    tools: ["Next.js 16", "Turso", "Vercel", "Drizzle"],
    cadence: "Continuous",
    outputs: ["Shipped features", "Green typecheck + build"],
    metrics: ["Build health", "Lighthouse / CWV"],
    risk: "Solo-maintainer load; CSP still in report-only.",
  },
  {
    key: "ux",
    name: "UX / UI",
    owner: "Founder",
    director: "Norman / Ive · UX · Rams · taste",
    tools: ["DESIGN.md", "BRAND.md", "design-audit"],
    cadence: "Per-surface review",
    outputs: ["Consistent surfaces", "Quiet, certain interactions"],
    metrics: ["Design-debt items open", "Audit pass rate"],
    risk: "Inconsistency across five repos breaks the one-system feel.",
  },
  {
    key: "brand",
    name: "Brand & Creative",
    owner: "Founder",
    director: "Cook · brand · Pixar · creative",
    tools: ["BRAND.md", "Motion brief", "Remotion"],
    cadence: "Launch-driven",
    outputs: ["Wordmarks", "Motion films", "Voice canon"],
    metrics: ["Films shipped / planned"],
    risk: "Motion-graphics throughput depends on a mac/iOS pipeline.",
  },
  {
    key: "marketing",
    name: "Marketing & Growth",
    owner: "Founder",
    director: "Cuban · growth · Hormozi · demand",
    tools: ["Six-month plan", "/hq/marketing", "CRM"],
    cadence: "Weekly growth review",
    outputs: ["Shipped assets", "Outreach sent", "Demand created"],
    metrics: ["Reply rate", "Booked-call rate"],
    risk: "Channel before message — switching on paid too early.",
  },
  {
    key: "finance",
    name: "Finance",
    owner: "Founder",
    director: "Buffett · finance",
    tools: ["Reporting", "Loan pack", "Sponsor ledger"],
    cadence: "Monthly finance review",
    outputs: ["Runway read", "Cash collected", "Use-of-funds"],
    metrics: ["Runway (months)", "Cash collected"],
    risk: "€50k facility pending CRO number; €0 founder salary.",
  },
  {
    key: "legal",
    name: "Legal",
    owner: "Founder",
    director: "Specter · legal & risk",
    tools: ["Vault", "Terms / Privacy", "DPA"],
    cadence: "Triggered",
    outputs: ["Incorporation", "Contracts", "GDPR posture"],
    metrics: ["Open legal items"],
    risk: "Incorporation pending; data-processing terms for venue data.",
  },
  {
    key: "operations",
    name: "Operations",
    owner: "Founder",
    director: "Grove / Cook · operations",
    tools: ["Atlas", "Operator actions", "Cron jobs"],
    cadence: "Weekly",
    outputs: ["Systems documented", "Operator blockers cleared"],
    metrics: ["Operator-blocked items open"],
    risk: "Provisioning blockers (Upstash, DKIM, secrets) stall prod.",
  },
  {
    key: "customer-success",
    name: "Customer Success",
    owner: "Founder",
    director: "Sagan · research & insight",
    tools: ["Support inbox", "Feedback", "Pilot notes"],
    cadence: "Triggered + weekly",
    outputs: ["Resolved tickets", "Insight back to product"],
    metrics: ["Support sentiment", "Time-to-first-response"],
    risk: "No support coverage outside founder hours pre-launch.",
  },
];

/* ════════════════════════════════════════════════════════════════════
   6 · AI DIRECTOR LAYER
   Rendered from the live org (src/lib/hq/elt.ts). This section only
   maps *which business function each director answers to* and the
   review cycle the founder runs them on. The directors themselves are
   the source of truth at /hq/org.
   ════════════════════════════════════════════════════════════════════ */

export type DirectorReviewCycle = {
  cycle: string;
  question: string;
  // director shortNames present in this review
  seats: string[];
};

export const DIRECTOR_REVIEW_CYCLES: DirectorReviewCycle[] = [
  {
    cycle: "Daily — Founder review",
    question: "What is the one thing today?",
    seats: ["Jobs", "Cook"],
  },
  {
    cycle: "Weekly — Product review",
    question: "Did we ship the right scope, and say no enough?",
    seats: ["Jobs", "Da Vinci", "Caravaggio", "Dalí", "Einstein", "Ive", "Rams"],
  },
  {
    cycle: "Weekly — Growth review",
    question: "Did demand move, and is the message proven before the channel?",
    seats: ["Cuban", "Hormozi", "Pixar"],
  },
  {
    cycle: "Monthly — Finance review",
    question: "What's the runway, and where did the money go?",
    seats: ["Buffett", "Specter"],
  },
  {
    cycle: "Monthly — Strategy review",
    question: "Are we still absurdly focused on the one wedge?",
    seats: ["Jobs", "Sagan", "Turing"],
  },
];

/* ════════════════════════════════════════════════════════════════════
   7 · AUTOMATION LAYER — "Absorbed by the System"
   ════════════════════════════════════════════════════════════════════ */

export type AbsorbedWork = {
  area: string;
  what: string;
  mode: "automated" | "ai-assisted" | "human-gate";
  // LIVE DATA: where this is (or will be) wired.
  surface: string;
};

export const ABSORBED_BY_SYSTEM: AbsorbedWork[] = [
  { area: "Product research", what: "Scan for gaps + pull comparable patterns.", mode: "ai-assisted", surface: "GSD research agents" },
  { area: "UX review", what: "Audit surfaces against DESIGN.md before ship.", mode: "ai-assisted", surface: "design-audit skill" },
  { area: "Competitor scanning", what: "Watch the category, summarise what changed.", mode: "automated", surface: "scheduled scan → digest" },
  { area: "Weekly reporting", what: "Assemble the five numbers + watchlist.", mode: "automated", surface: "/hq/reporting" },
  { area: "Launch planning", what: "Sequence beats and dependencies.", mode: "ai-assisted", surface: "GSD roadmap" },
  { area: "Content ideation", what: "Draft founder + motion content angles.", mode: "ai-assisted", surface: "/hq/marketing" },
  { area: "Support triage", what: "Classify + route incoming, draft replies.", mode: "human-gate", surface: "support inbox" },
  { area: "Metrics summaries", what: "Turn raw ledger into a plain read.", mode: "automated", surface: "getHqSnapshot" },
  { area: "Decision logs", what: "Capture decisions + review dates.", mode: "human-gate", surface: "content/hq/decisions" },
  { area: "Roadmap hygiene", what: "Flag drift between source + shipped.", mode: "automated", surface: ".githooks pre-commit" },
];

/* ════════════════════════════════════════════════════════════════════
   8 · METRICS DASHBOARD — only the critical numbers
   ════════════════════════════════════════════════════════════════════ */

export type BlueprintMetric = {
  label: string;
  // LIVE DATA: every `value` here is a placeholder until wired to source.
  value: string;
  target: string;
  source: string;
  tone: "accent" | "critical" | "quiet";
};

export const BLUEPRINT_METRICS: BlueprintMetric[] = [
  { label: "MRR", value: "—", target: "first paid licence", source: "traction.ts", tone: "critical" },
  { label: "Active users", value: "—", target: "growing WoW", source: "app analytics", tone: "quiet" },
  { label: "Activation rate", value: "—", target: ">40%", source: "onboarding funnel", tone: "quiet" },
  { label: "Retention", value: "—", target: ">60% M1", source: "app analytics", tone: "quiet" },
  { label: "Churn", value: "—", target: "<5% / mo", source: "app analytics", tone: "quiet" },
  { label: "Onboarding completion", value: "—", target: ">70%", source: "onboarding funnel", tone: "quiet" },
  { label: "Usage by module", value: "—", target: "all four touched", source: "per-app analytics", tone: "quiet" },
  { label: "Venue pipeline", value: "—", target: "10 by M3", source: "/hq/crm", tone: "accent" },
  { label: "Student signups", value: "—", target: "term-start cohort", source: "signups by source", tone: "quiet" },
  { label: "Support sentiment", value: "—", target: "positive", source: "support inbox", tone: "quiet" },
  { label: "Runway", value: "—", target: ">12 months", source: "finance model", tone: "critical" },
];

/* ════════════════════════════════════════════════════════════════════
   9 · RISK & DECISION LOG
   ════════════════════════════════════════════════════════════════════ */

export type LogItem = {
  label: string;
  detail: string;
  // optional source-of-truth pointer
  ref?: string;
};

export const RISK_LOG = {
  // LIVE DATA: mirror from content/hq/risks/*.md when those are the source.
  currentRisks: [
    { label: "Founder-time concentration", detail: "Every function moves only when the founder moves." },
    { label: "iOS / MacBook dependency", detail: "Motion + native build pipeline needs Apple hardware." },
    { label: "Provisioning blockers", detail: "Upstash, DKIM, and secrets gate production behaviour." },
    { label: "Single wedge risk", detail: "Venue wedge must convert before the student wedge opens." },
  ] satisfies LogItem[],
  openDecisions: [
    { label: "Paid-ads trigger", detail: "What organic proof switches paid on?" },
    { label: "Incorporation timing", detail: "Pending CRO number; gates the lender facility." },
    { label: "Public 'Roadmap' view label", detail: "Timeline app still shows a board labelled 'Roadmap'." },
  ] satisfies LogItem[],
  decisionsMade: [
    { label: "Indigo dot, retire gold", detail: "Suite-locked accent #4f46e5 since 2026-05-11." },
    { label: "Venue-first wedge", detail: "Limerick venues before any other segment." },
    { label: "Founder stays at Verizon, €0 salary", detail: "Criteria-based transition, not date-based." },
    { label: "Roadmap → Timeline, Analytics → Signal", detail: "Renamed across the suite 2026-06-13." },
  ] satisfies LogItem[],
  launchBlockers: [
    { label: "First paid venue (Gate 0)", detail: "The single headline metric the plan depends on." },
    { label: "CSP enforce-mode", detail: "Promote from report-only across all four products." },
    { label: "Inbound capture DNS", detail: "capture@notes needs secret + DNS to go live." },
  ] satisfies LogItem[],
  dependencies: [
    { label: "Funding", detail: "€50k MFI facility pending incorporation." },
    { label: "iOS / MacBook", detail: "Native + motion work blocked without Apple hardware." },
    { label: "Motion graphics", detail: "Brand films gate the demand engine." },
  ] satisfies LogItem[],
} as const;

/* ════════════════════════════════════════════════════════════════════
   10 · OPERATING CADENCE
   ════════════════════════════════════════════════════════════════════ */

export type CadenceBeat = {
  rhythm: string;
  name: string;
  owner: string;
  question: string;
  output: string;
};

export const OPERATING_CADENCE: CadenceBeat[] = [
  { rhythm: "Daily", name: "Founder review", owner: "Founder", question: "What is the one thing today?", output: "One decision, logged." },
  { rhythm: "Weekly", name: "Product review", owner: "Jobs + product council", question: "Right scope, enough no's?", output: "Shipped scope + rejections." },
  { rhythm: "Weekly", name: "Growth review", owner: "Cuban + Hormozi", question: "Did demand move?", output: "Reply + booked-call read." },
  { rhythm: "Monthly", name: "Finance review", owner: "Buffett", question: "What's the runway?", output: "Cash + runway read." },
  { rhythm: "Monthly", name: "Strategy review", owner: "Jobs + Sagan", question: "Still absurdly focused?", output: "Wedge confirmed or changed." },
  { rhythm: "Quarterly", name: "Reset", owner: "Founder", question: "What do we stop doing?", output: "Cut list + next bet." },
];

/* ── Section registry — drives the zoom map legend + anchors ─────────── */

export type BlueprintSection = {
  id: string;
  index: number;
  label: string;
  title: string;
  blurb: string;
};

export const BLUEPRINT_SECTIONS: BlueprintSection[] = [
  { id: "north-star", index: 1, label: "North Star", title: "Why we exist", blurb: "Mission, positioning, principles, flywheel." },
  { id: "product-system", index: 2, label: "Product System", title: "How the product works", blurb: "Notes → Tasks → Timeline → Signal." },
  { id: "customers", index: 3, label: "Customers", title: "Who it's for", blurb: "Venues, students, small business, personal." },
  { id: "growth", index: 4, label: "Growth Machine", title: "How it grows", blurb: "Wedge → demand → compounding → expansion." },
  { id: "functions", index: 5, label: "Signal HQ", title: "How it operates", blurb: "Ten functions, owners, cadence, risk." },
  { id: "directors", index: 6, label: "AI Directors", title: "How it decides", blurb: "The standing org and review cycles." },
  { id: "automation", index: 7, label: "Automation", title: "Absorbed by the system", blurb: "What the system does so the founder doesn't." },
  { id: "metrics", index: 8, label: "Metrics", title: "How we measure", blurb: "Only the numbers that matter." },
  { id: "risk", index: 9, label: "Risk & Decisions", title: "How we stay honest", blurb: "Risks, decisions, blockers, dependencies." },
  { id: "cadence", index: 10, label: "Cadence", title: "How we stay in rhythm", blurb: "Daily to quarterly operating beats." },
];
