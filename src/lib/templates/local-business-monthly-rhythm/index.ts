import type { WorkspaceTemplate } from "../types";
import { meta } from "./meta";
import { tasks } from "./tasks";
import { notes } from "./notes";
import { roadmap } from "./roadmap";
import { analytics } from "./analytics";

export const localBusinessMonthlyRhythm: WorkspaceTemplate = {
  ...meta,
  tasks,
  notes,
  roadmap,
  analytics,
};
