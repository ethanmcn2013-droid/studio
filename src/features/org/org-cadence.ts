/**
 * The org's operating rhythm and the AI-leadership build roadmap.
 *
 * Cadences mirror `signal-directors/config/cadences.yaml`; the roadmap mirrors
 * the seven Initiatives in `signal-directors/README.md`. Real, not invented.
 */

export type Cadence = {
  id: string;
  label: string;
  /** Director id who owns/chairs it. */
  ownerId: string;
  when: string;
  artefact: string;
  /** ISO date of the next fixed occurrence, when there is one. */
  nextDue?: string;
};

export const OPERATING_TIMEZONE = "Europe/Dublin";

export const CADENCES: Cadence[] = [
  {
    id: "daily",
    label: "Daily founder briefing",
    ownerId: "operations-admin-founder-support",
    when: "Weekdays, 06:30",
    artefact: "Five-line briefing to #advisor-operations",
  },
  {
    id: "weekly",
    label: "Weekly advisory review",
    ownerId: "product-strategy",
    when: "Fridays, 14:00",
    artefact: "Board post; every advisor contributes",
  },
  {
    id: "monthly",
    label: "Monthly strategic review",
    ownerId: "product-strategy",
    when: "First Monday",
    artefact: "One-page brief to the decision log",
  },
  {
    id: "quarterly",
    label: "Quarterly company-evolution review",
    ownerId: "product-strategy",
    when: "End of quarter",
    artefact: "Two-page brief to the principles log",
    nextDue: "2026-08-28",
  },
];

export type RoadmapStatus = "shipped" | "in-progress" | "planned";

export type RoadmapPhase = {
  n: number;
  label: string;
  detail: string;
  status: RoadmapStatus;
};

/** The seven Initiatives that build the AI-leadership operating system. */
export const ROADMAP: RoadmapPhase[] = [
  { n: 0, label: "Foundation", detail: "Charters, governance, machine-readable config", status: "shipped" },
  { n: 1, label: "Memory wiring", detail: "Decision + principles logs, charter footers", status: "shipped" },
  { n: 2, label: "Subagent wiring", detail: "One Claude Code agent per Director", status: "shipped" },
  { n: 3, label: "Cadence automation", detail: "Daily, weekly, monthly, quarterly runners", status: "shipped" },
  { n: 4, label: "Slack integration", detail: "Private channels, briefing bot, avatars", status: "shipped" },
  { n: 5, label: "MCP + tool layer", detail: "Gated tool grants; Google Calendar live", status: "in-progress" },
  { n: 6, label: "First specialist Director", detail: "Only when a written case is made", status: "planned" },
];

/** Map a roadmap status to the shared health-dot modifier (from atlas.css). */
export function roadmapDotClass(status: RoadmapStatus): string {
  const map: Record<RoadmapStatus, string> = {
    shipped: "atlas-dot--healthy",
    "in-progress": "atlas-dot--attention",
    planned: "atlas-dot--unknown",
  };
  return `atlas-dot ${map[status]}`;
}
