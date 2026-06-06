/**
 * Canonical workspace template types — Signal Studio source-of-truth.
 *
 * One template seeds all four layers (Tasks, Notes, Roadmap, Analytics).
 * Each consuming product runs `pnpm sync:templates` at build time to copy
 * the slices it needs into its own repo as a generated file. The
 * studio repo never ships its templates module to runtime — these types
 * exist for authoring discipline, not for runtime cross-product imports.
 *
 * Strategy: docs/TEMPLATES_STRATEGY.md (locked 2026-05-12).
 */

export type Lane = "todo" | "doing" | "review" | "done";
export type Priority = "p0" | "p1" | "p2" | "p3";

/**
 * Domain ids match the four DomainPacks in `tasks/src/lib/domains.ts`.
 * The fifth archetype (small-business operator) maps onto `marketing`
 * for the existing Tasks domain vocabulary; revisit if Tasks adds a
 * dedicated operator domain.
 */
export type Domain = "wedding" | "trades" | "student" | "freelance" | "marketing";

/** BRAND.md §2.1 audience archetypes. */
export type AudienceArchetype =
  | "wedding-planner"
  | "tradesperson"
  | "student"
  | "freelancer"
  | "small-business-operator";

export type TaskSeed = {
  title: string;
  lane: Lane;
  priority: Priority;
  /** Human due label — same shape as `Task.due` ("Today", "Fri", "Mar 12"). */
  due?: string;
  tags?: string[];
};

/**
 * Notes seed — 0 to 3 named-note prompts. Single capture surface preserved
 * (Notes PRODUCT.md §7 refuses "today template" / date-scaffolding).
 */
export type NoteSeed = {
  title: string;
  body: string;
};

/**
 * Roadmap-product status vocabulary — matches Roadmap's `tasks.status` enum
 * (see roadmap/src/server/db/schema.ts). Authoring against the product
 * model directly avoids a translation layer.
 */
export type RoadmapStatus = "shipped" | "in-flight" | "next" | "waiting" | "refused";

/**
 * A seeded project inside a workspace. Roadmap supports many projects
 * per workspace; most templates ship with one.
 */
export type RoadmapProjectSeed = {
  slug: string;
  name: string;
  oneLiner: string;
  /** Optional hex accent for the project card. */
  accent?: string;
};

/**
 * A seeded item inside a project. "Item" here intentionally differs from
 * `TaskSeed` (which seeds Tasks-product tasks). The Roadmap product
 * stores these in its `tasks` table; the rename avoids name collision.
 */
export type RoadmapItemSeed = {
  projectSlug: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  /** Plain-English when label or YYYY-MM-DD. Optional. */
  targetDate?: string;
};

export type RoadmapSeed = {
  projects: RoadmapProjectSeed[];
  items: RoadmapItemSeed[];
};

/**
 * Analytics hint — detector ids the briefing engine should weight up
 * for workspaces created from this template. Consumed lazily at
 * briefing-build time; not a user-pickable surface.
 */
export type AnalyticsHint = {
  detectors: string[];
  /** Optional per-detector weight multiplier. */
  weights?: Record<string, number>;
};

export type WorkspaceTemplate = {
  id: string;
  name: string;
  /** Card description — shown in Tasks gallery. */
  description: string;
  /** Glyph slug — points at a stroke-SVG in tasks's template-glyph registry. */
  icon: string;
  domain: Domain;
  audience: AudienceArchetype;
  /** Outcome-first, one sentence. */
  problem: string;
  /** Long-form landing-page copy (template detail / SEO surface). */
  seoSummary: string;

  // Layer seeds
  tasks: TaskSeed[];
  notes: NoteSeed[];
  roadmap: RoadmapSeed;
  analytics: AnalyticsHint;
};

/** Slice picked out for Tasks's existing Template shape. */
export type TasksTemplateSlice = Pick<
  WorkspaceTemplate,
  "id" | "name" | "description" | "icon" | "domain" | "tasks"
>;
