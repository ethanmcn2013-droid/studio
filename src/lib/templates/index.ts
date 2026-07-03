import type { WorkspaceTemplate } from "./types";
import { weddingPlanningWorkspace } from "./wedding-planning-workspace";
import { localBusinessMonthlyRhythm } from "./local-business-monthly-rhythm";

/**
 * Canonical workspace templates, source-of-truth for the suite.
 *
 * Strategy: docs/TEMPLATES_STRATEGY.md (locked 2026-05-12).
 *
 * T-1 lifted wedding-planning-workspace. T-6 (2026-05-12) added
 * local-business-monthly-rhythm. T-3 through T-5, lifting the
 * trades / students / freelance archetype templates into the canonical
 * four-layer shape, are infrastructure work, NOT urgent gap-filling:
 * the existing Tasks audience pages (/for/trades, /for/students,
 * /for/freelancers) already work today against Tasks's specialty
 * template registry (jobsite-punchlist, new-client-onboarding,
 * final-paper-sprint, midterm-week, tax-season). Lifting those
 * specialty templates to canonical shape only matters once the lazy
 * Notes/Roadmap/Analytics expansion path is being exercised for those
 * archetypes, and that signal will come from pilot demand, not a
 * pre-emptive build.
 */
export const WORKSPACE_TEMPLATES: WorkspaceTemplate[] = [
  weddingPlanningWorkspace,
  localBusinessMonthlyRhythm,
];

export type { WorkspaceTemplate } from "./types";
export {
  type Lane,
  type Priority,
  type Domain,
  type AudienceArchetype,
  type TaskSeed,
  type NoteSeed,
  type RoadmapSeed,
  type RoadmapProjectSeed,
  type RoadmapItemSeed,
  type RoadmapStatus,
  type AnalyticsHint,
  type TasksTemplateSlice,
} from "./types";
