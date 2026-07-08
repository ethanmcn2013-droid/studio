/**
 * Signal Studio Atlas — type contract.
 *
 * Two layers, deliberately separated (see docs/atlas/information-architecture.md):
 *
 *   1. Curated graph  — identity, purpose, positions, typed connections, lens
 *      config. Authored by hand in `data/atlas-graph.ts`. No fabricated numbers.
 *   2. Live snapshot  — real figures computed from `content/hq/**` at render time
 *      in `server/load-snapshot.ts`. This is what makes the map true.
 *
 * The client island receives `{ graph, snapshot }` as plain serializable data.
 */

export type AtlasObjectType =
  | "company"
  | "domain"
  | "product"
  | "feature"
  | "workflow"
  | "design_principle"
  | "engineering_system"
  | "ai_director"
  | "ai_workflow"
  | "integration"
  | "metric"
  | "risk"
  | "decision"
  | "milestone"
  | "document";

export type AtlasHealth = "healthy" | "attention" | "blocked" | "unknown";

export type AtlasLens =
  | "founder"
  | "product"
  | "design"
  | "engineering"
  | "ai"
  | "launch"
  | "investor";

export type AtlasDocumentation = "none" | "partial" | "good" | "complete";
export type AtlasConfidence = "low" | "medium" | "high";

/** A link out of the Atlas into a real HQ room, product site, or artifact. */
export type AtlasLink = {
  label: string;
  href: string;
  /** Machine-fact hint shown in mono, e.g. "internal" or "external". */
  hint?: string;
};

/**
 * A node in the curated graph. Numbers here are only ever structural or `null` —
 * real metrics arrive via the live snapshot and are merged in the server module.
 */
export type AtlasObject = {
  id: string;
  type: AtlasObjectType;
  name: string;
  /** One-line identity. */
  description: string;
  /** What this is, in plain terms. */
  purpose?: string;
  /** Why it exists / why it matters to the business. */
  why?: string;
  owner?: string;
  health: AtlasHealth;
  /** 0–100 when genuinely known, else null (rendered as an honest placeholder). */
  maturity: number | null;
  launchReadiness?: number | null;
  documentation?: AtlasDocumentation;
  confidence?: AtlasConfidence;
  /** ids of graph nodes this depends on. */
  dependencies?: string[];
  /** ids of related graph nodes. */
  related?: string[];
  risks?: string[];
  metrics?: AtlasMetric[];
  nextActions?: string[];
  /** Proof points — real files/rooms that substantiate the object. */
  evidence?: string[];
  lastReviewed?: string;
  /** Out-links into the real product. */
  links?: AtlasLink[];
  /** Spatial position on the orbit, normalized 0..1 (x right, y down). */
  position?: { x: number; y: number };
  /** Per-lens emphasis weight; higher = more prominent under that lens. */
  lensPriority?: Partial<Record<AtlasLens, number>>;
};

export type AtlasMetric = {
  label: string;
  value: string | number;
  note?: string;
};

export type AtlasConnectionType =
  | "dependency"
  | "input"
  | "output"
  | "ownership"
  | "influence"
  | "evidence";

export type AtlasConnection = {
  id: string;
  from: string;
  to: string;
  label?: string;
  /** Every connection is typed — untyped edges are disallowed by design. */
  type: AtlasConnectionType;
  strength?: "subtle" | "normal" | "strong";
};

/** Configuration for a single lens: what it emphasizes and how it speaks. */
export type AtlasLensConfig = {
  id: AtlasLens;
  label: string;
  /** One calm line describing what this lens answers. */
  tagline: string;
  /** Node ids this lens brings forward. Empty = emphasize all equally. */
  emphasis: string[];
};

/** The whole curated graph, authored by hand. */
export type AtlasGraph = {
  center: AtlasObject;
  domains: AtlasObject[];
  connections: AtlasConnection[];
  lenses: AtlasLensConfig[];
};

// ─── Live snapshot (computed server-side from content/hq/**) ────────────────

/** A single headline figure for the Mission Control strip. */
export type AtlasSummaryStat = {
  key: string;
  label: string;
  /** Pre-formatted display value, or the placeholder token. */
  value: string;
  /** Optional sub-note (units, denominator, "as of"). */
  note?: string;
  health?: AtlasHealth;
  href?: string;
};

/** Per-domain live enrichment, keyed by domain id. */
export type AtlasDomainSignal = {
  health: AtlasHealth;
  maturity: number | null;
  launchReadiness: number | null;
  metrics: AtlasMetric[];
  risks: string[];
  nextActions: string[];
  lastReviewed?: string;
};

export type AtlasInvestorFigure = {
  label: string;
  value: string;
  note?: string;
};

export type AtlasSnapshot = {
  /** Human "as of" date for the whole snapshot. */
  asOf: string;
  /** Mission Control headline stats (order matters). */
  stats: AtlasSummaryStat[];
  /** Live enrichment merged into each domain node by id. */
  domainSignals: Record<string, AtlasDomainSignal>;
  /** Figures + proof for the Investor Snapshot. */
  investor: {
    thesis: string;
    figures: AtlasInvestorFigure[];
    discipline: string[];
  };
  /** Placeholders still needing real data — surfaced to the founder. */
  placeholders: string[];
};

/** The placeholder token used everywhere a real value is not yet known. */
export const UNKNOWN = "Needs review" as const;
