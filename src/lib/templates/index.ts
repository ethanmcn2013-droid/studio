import type { WorkspaceTemplate } from "./types";
import { weddingPlanningWorkspace } from "./wedding-planning-workspace";

/**
 * Canonical workspace templates — source-of-truth for the suite.
 *
 * Strategy: docs/TEMPLATES_STRATEGY.md (locked 2026-05-12).
 *
 * T-1 lifts wedding-planning-workspace only. T-3 through T-6 add the
 * four remaining anchor templates (trades, final-paper-sprint,
 * freelance-client-engagement, local-business-monthly-rhythm).
 */
export const WORKSPACE_TEMPLATES: WorkspaceTemplate[] = [
  weddingPlanningWorkspace,
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
  type RoadmapMilestone,
  type RoadmapStatus,
  type AnalyticsHint,
  type TasksTemplateSlice,
} from "./types";
