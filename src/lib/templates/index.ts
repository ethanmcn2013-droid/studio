import type { WorkspaceTemplate } from "./types";
import { weddingPlanningWorkspace } from "./wedding-planning-workspace";
import { localBusinessMonthlyRhythm } from "./local-business-monthly-rhythm";

/**
 * Canonical workspace templates — source-of-truth for the suite.
 *
 * Strategy: docs/TEMPLATES_STRATEGY.md (locked 2026-05-12).
 *
 * T-1 lifted wedding-planning-workspace. T-6 (2026-05-12) adds
 * local-business-monthly-rhythm. T-3 through T-5 still owed
 * (trades-job-pipeline, final-paper-sprint, freelance-client-engagement).
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
