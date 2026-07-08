/**
 * Signal Studio Atlas — the curated graph.
 *
 * This is the authored structure of the map: the center, the eight domains,
 * their fixed positions, and the typed connections between them. It carries
 * identity, purpose, and out-links to the real product — but no fabricated
 * metrics. Every number the map shows arrives from the live snapshot
 * (`server/load-snapshot.ts`, read from `content/hq/**`).
 *
 * Positions are normalized 0..1 (x → right, y → down) on an octagonal orbit
 * around the center. They are fixed on purpose: the map has spatial memory and
 * never reflows when the lens changes.
 *
 * Copy follows BRAND voice: plain English, concrete, no em dashes, no
 * exclamation marks, no SaaS fluff.
 */

import type { AtlasGraph, AtlasObject, AtlasConnection, AtlasLensConfig } from "../types";

const center: AtlasObject = {
  id: "signal-studio",
  type: "company",
  name: "Signal Studio",
  description:
    "Four calm products that share one workspace, one design system, and one operating discipline.",
  purpose:
    "The umbrella. One account and one brand across Tasks, Timeline, Signal, and Notes.",
  why: "A suite is defensible where a single tool is not. The pieces reinforce each other.",
  owner: "Ethan",
  health: "healthy",
  maturity: null,
  documentation: "good",
  confidence: "high",
  related: ["product", "design", "engineering", "ai", "launch", "operations", "metrics", "business"],
  position: { x: 0.5, y: 0.5 },
  links: [
    { label: "signalstudio.ie", href: "https://signalstudio.ie", hint: "live" },
    { label: "Signal HQ", href: "/hq", hint: "internal" },
    { label: "Brand", href: "/hq/atlas/signal-studio-umbrella", hint: "registry" },
  ],
  evidence: ["content/atlas/signal-studio-umbrella.md", "BRAND.md"],
};

const domains: AtlasObject[] = [
  {
    id: "product",
    type: "domain",
    name: "Product System",
    description: "The four products as one system: Tasks, Timeline, Signal, and Notes.",
    purpose:
      "What the customer actually uses. Execution, direction, attention, and context, sharing one workspace.",
    why: "The product is the proof. Everything else exists to make it good and get it used.",
    owner: "Ethan",
    health: "healthy",
    maturity: null,
    launchReadiness: null,
    documentation: "good",
    confidence: "high",
    dependencies: ["design", "engineering"],
    related: ["ai", "launch"],
    position: { x: 0.5, y: 0.12 },
    lensPriority: { product: 3, founder: 2, investor: 2, launch: 2 },
    links: [
      { label: "Tasks", href: "https://tasks.signalstudio.ie", hint: "live" },
      { label: "Timeline", href: "https://timeline.signalstudio.ie", hint: "live" },
      { label: "Signal", href: "https://signal.signalstudio.ie", hint: "live" },
      { label: "Notes", href: "https://notes.signalstudio.ie", hint: "live" },
      { label: "Reporting", href: "/hq/reporting", hint: "internal" },
    ],
    evidence: ["content/hq/products/*.md", "content/hq/ecosystem-flows/*.md"],
  },
  {
    id: "design",
    type: "domain",
    name: "Design System",
    description: "One design language: ink on paper, one indigo, hairlines, Geist, calm motion.",
    purpose: "The rules that make four products feel like one, and make simple look intentional.",
    why: "Restraint is the brand. Consistency is what a serious company looks like up close.",
    owner: "Ethan",
    health: "healthy",
    maturity: null,
    documentation: "complete",
    confidence: "high",
    related: ["product", "engineering"],
    position: { x: 0.18, y: 0.26 },
    lensPriority: { design: 3, investor: 2, product: 2 },
    links: [
      { label: "Design", href: "/design", hint: "live" },
      { label: "Principles", href: "/principles", hint: "live" },
      { label: "Design system", href: "/hq/atlas/signal-studio-umbrella", hint: "registry" },
    ],
    evidence: ["DESIGN.md", "BRAND.md", "src/ds/tokens.css"],
  },
  {
    id: "engineering",
    type: "domain",
    name: "Engineering System",
    description:
      "The systems the product runs on: data, auth, deploys, cron, cross-repo writers, CI gates.",
    purpose: "The machinery under the calm surface. Written down, verified, and drift-flagged.",
    why: "Simple to use, serious to build. The registry proves the seriousness is real, not claimed.",
    owner: "Ethan",
    health: "healthy",
    maturity: null,
    documentation: "good",
    confidence: "medium",
    dependencies: ["design"],
    related: ["product", "ai"],
    position: { x: 0.82, y: 0.26 },
    lensPriority: { engineering: 3, investor: 2, ai: 2 },
    links: [
      { label: "Systems registry", href: "/hq/atlas", hint: "internal" },
      { label: "Health", href: "/hq/health", hint: "internal" },
    ],
    evidence: ["content/atlas/*.md", "CI contract checks in package.json"],
  },
  {
    id: "ai",
    type: "domain",
    name: "AI System",
    description: "How AI is used, and where it is not. Attention, drafting, and a standing directors org.",
    purpose:
      "AI directs attention and drafts, inside clear boundaries with human review and spend caps.",
    why: "AI is leverage only if it is governed. Boundaries and human review are the point.",
    owner: "Ethan",
    health: "healthy",
    maturity: null,
    documentation: "partial",
    confidence: "medium",
    dependencies: ["engineering"],
    related: ["product"],
    position: { x: 0.9, y: 0.5 },
    lensPriority: { ai: 3, engineering: 1, investor: 1 },
    links: [
      { label: "Directors", href: "/hq/org", hint: "internal" },
      { label: "Signal briefing", href: "https://signal.signalstudio.ie", hint: "live" },
    ],
    evidence: ["content/hq/operator-todos/ai-spend-budget.md", "signal-directors repo"],
  },
  {
    id: "launch",
    type: "domain",
    name: "Launch System",
    description: "What stands between here and launch: readiness gates, milestones, and the date.",
    purpose: "A weighted view of readiness across the launch gates, counting down to the date.",
    why: "Readiness you can see is readiness you can fix. Guesswork is how launches slip.",
    owner: "Ethan",
    health: "attention",
    maturity: null,
    launchReadiness: null,
    documentation: "good",
    confidence: "high",
    dependencies: ["product", "design", "engineering", "metrics"],
    related: ["business"],
    position: { x: 0.82, y: 0.74 },
    lensPriority: { launch: 3, founder: 2, investor: 2 },
    links: [
      { label: "Data room", href: "/hq/data-room", hint: "internal" },
      { label: "Reporting", href: "/hq/reporting", hint: "internal" },
    ],
    evidence: ["content/hq/launch-readiness/*.md"],
  },
  {
    id: "metrics",
    type: "domain",
    name: "Metrics System",
    description: "The small number of numbers that matter, and the honest state of tracking.",
    purpose: "One place for traction and health. Where tracking is weak, it says so.",
    why: "You cannot run what you cannot see. Metrics keep the operating map honest.",
    owner: "Ethan",
    health: "attention",
    maturity: null,
    documentation: "partial",
    confidence: "medium",
    related: ["business", "launch"],
    position: { x: 0.5, y: 0.88 },
    lensPriority: { founder: 2, investor: 2, launch: 1 },
    links: [
      { label: "Reporting", href: "/hq/reporting", hint: "internal" },
      { label: "Financial model", href: "/hq/financial-model", hint: "internal" },
    ],
    evidence: ["content/hq/launch-readiness/tracking.md"],
  },
  {
    id: "business",
    type: "domain",
    name: "Business System",
    description: "How Signal Studio earns and grows: pricing, the venue pipeline, segments, and campaigns.",
    purpose: "The commercial engine. Who pays, why, and how they find the product.",
    why: "Great product without distribution is a hobby. This is where revenue starts.",
    owner: "Ethan",
    health: "attention",
    maturity: null,
    documentation: "partial",
    confidence: "medium",
    related: ["operations", "metrics", "launch"],
    position: { x: 0.18, y: 0.74 },
    lensPriority: { investor: 3, founder: 2 },
    links: [
      { label: "CRM", href: "/hq/crm", hint: "internal" },
      { label: "Marketing", href: "/hq/marketing", hint: "internal" },
      { label: "Pricing", href: "/pricing", hint: "live" },
    ],
    evidence: ["content/hq/campaigns/*.md", "content/hq/segments/*.md"],
  },
  {
    id: "operations",
    type: "domain",
    name: "Operations System",
    description: "How the company runs: decisions written down, risks visible, operator work tracked.",
    purpose: "The discipline layer. Every decision, risk, and founder task has a home and a review date.",
    why: "Discipline is the moat a solo founder can build. It compounds.",
    owner: "Ethan",
    health: "healthy",
    maturity: null,
    documentation: "good",
    confidence: "high",
    related: ["business", "launch"],
    position: { x: 0.1, y: 0.5 },
    lensPriority: { founder: 3, investor: 2 },
    links: [
      { label: "Operator to-dos", href: "/hq", hint: "internal" },
      { label: "Vault", href: "/hq/vault", hint: "internal" },
    ],
    evidence: [
      "content/hq/decisions/*.md",
      "content/hq/risks/*.md",
      "content/hq/operator-todos/*.md",
    ],
  },
];

/** Ownership edges (center → each domain) are structural and stay subtle. */
const ownership: AtlasConnection[] = domains.map((d) => ({
  id: `own-${d.id}`,
  from: "signal-studio",
  to: d.id,
  type: "ownership",
  strength: "subtle",
}));

/** Cross-domain edges carry the meaning. Each one has a reason. */
const crossEdges: AtlasConnection[] = [
  { id: "product-engineering", from: "product", to: "engineering", type: "dependency", strength: "strong", label: "runs on" },
  { id: "design-product", from: "design", to: "product", type: "influence", strength: "normal", label: "shapes" },
  { id: "engineering-design", from: "engineering", to: "design", type: "dependency", strength: "subtle", label: "vendors tokens" },
  { id: "ai-engineering", from: "ai", to: "engineering", type: "dependency", strength: "normal", label: "runs on" },
  { id: "ai-product", from: "ai", to: "product", type: "input", strength: "normal", label: "directs attention" },
  { id: "launch-product", from: "launch", to: "product", type: "dependency", strength: "normal", label: "gated by" },
  { id: "launch-design", from: "launch", to: "design", type: "dependency", strength: "subtle", label: "gated by" },
  { id: "launch-engineering", from: "launch", to: "engineering", type: "dependency", strength: "subtle", label: "gated by" },
  { id: "launch-metrics", from: "launch", to: "metrics", type: "dependency", strength: "subtle", label: "gated by" },
  { id: "metrics-business", from: "metrics", to: "business", type: "evidence", strength: "normal", label: "substantiates" },
  { id: "operations-business", from: "operations", to: "business", type: "influence", strength: "subtle", label: "runs" },
];

const connections: AtlasConnection[] = [...ownership, ...crossEdges];

const lenses: AtlasLensConfig[] = [
  {
    id: "founder",
    label: "Founder",
    tagline: "What needs attention, what is blocked, what is ready.",
    emphasis: ["product", "launch", "operations", "metrics"],
  },
  {
    id: "product",
    label: "Product",
    tagline: "The four products, their features, and how they connect.",
    emphasis: ["product", "design", "engineering"],
  },
  {
    id: "design",
    label: "Design",
    tagline: "The principles and system that make simple look intentional.",
    emphasis: ["design", "product"],
  },
  {
    id: "engineering",
    label: "Engineering",
    tagline: "The systems under the surface, written down and verified.",
    emphasis: ["engineering", "ai", "product"],
  },
  {
    id: "ai",
    label: "AI",
    tagline: "Where AI helps, where it stops, and who reviews it.",
    emphasis: ["ai", "engineering", "product"],
  },
  {
    id: "launch",
    label: "Launch",
    tagline: "What stands between here and the launch date.",
    emphasis: ["launch", "product", "design", "engineering", "metrics"],
  },
  {
    id: "investor",
    label: "Investor",
    tagline: "Maturity, readiness, discipline, and the risks in view.",
    emphasis: ["product", "business", "launch", "operations"],
  },
];

export const ATLAS_GRAPH: AtlasGraph = { center, domains, connections, lenses };

/** All nodes (center + domains) as a flat list — handy for search and lookup. */
export const ATLAS_NODES: AtlasObject[] = [center, ...domains];

/** Fast id → node lookup. */
export const ATLAS_NODE_BY_ID: Record<string, AtlasObject> = Object.fromEntries(
  ATLAS_NODES.map((n) => [n.id, n]),
);
