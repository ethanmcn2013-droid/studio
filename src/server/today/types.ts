/**
 * Cross-suite Today aggregation — shared types.
 *
 * Powers `/api/today` and (eventually) the native iOS app's home
 * screen. The response shape is designed to be small enough to fit
 * in a single payload + render-once on the iOS home, and stable
 * enough that adding fields later doesn't break older app builds.
 *
 * Native iOS clients should be lenient parsers (treat unknown fields
 * as ignorable). Web clients (the seamless-ecosystem dashboard)
 * consume the same shape.
 */

export type TaskSummary = {
  /** Tasks workspace id this slice came from. */
  workspaceId: string;
  /** Human-readable workspace name (e.g. "Hartwell Wedding · 6.14.26"). */
  workspaceName: string;
  /** Count of items in your court — unfinished tasks that are either overdue,
   *  due today, or have you in `assignees`. Open-ended on the past because
   *  "still due, still yours" is the iOS-home signal; an "overdue" badge can
   *  read this number too. */
  inYourCourt: number;
  /** Count of items explicitly blocked. */
  blocked: number;
  /** Count of items in the shipped lane touched in the last 24h. Approximate
   *  ship-rate signal — Tasks' schema has no transition-time column, so this
   *  uses `updated_at` as a proxy. A shipped-lane task edited (title change,
   *  comment) within 24h will register here even if it shipped earlier. */
  shippedLast24h: number;
};

export type NoteSummary = {
  /** Total notes the user has in the stream (not archived). */
  total: number;
  /** Unix ms of the most-recent note created or edited. Null when none. */
  lastTouchedAt: number | null;
  /** Excerpt (first line, ≤80 chars) of the most-recent note. Null when none. */
  lastExcerpt: string | null;
};

export type RoadmapMilestone = {
  workspaceSlug: string;
  workspaceName: string;
  /** Milestone title. */
  title: string;
  /** ISO date string (YYYY-MM-DD). Null when no target date set. */
  targetDate: string | null;
  /** Status: "in-flight" | "next" | "shipped" | "refused" | "blocked". */
  status: string;
};

export type RoadmapSummary = {
  /** Up to 5 upcoming milestones across the user's workspaces. */
  upcoming: RoadmapMilestone[];
  /** Count of milestones shipped in the last 7 days. */
  shippedLast7d: number;
};

/** Closed enum of Analytics briefing cadences, mirroring the Tasks
 *  `user_preferences.daily_signal_cadence` column (which Analytics
 *  reads at briefing time). iOS / web clients can pattern-match this
 *  enum closed. */
export type AnalyticsCadence = "off" | "weekdays" | "daily";

export type AnalyticsSummary = {
  /** Whether the user has the Analytics product set up at all (has a
   *  user_preferences row in Tasks with a known cadence). */
  enabled: boolean;
  /** IANA timezone the user's briefing fires in. Null if not set. */
  timezone: string | null;
  /** Cadence — one of `off | weekdays | daily`. Closed enum. */
  cadence: AnalyticsCadence;
};

export type TodayResponse = {
  /** Unix ms the response was generated. */
  generatedAt: number;
  /** Per-product slices. Each is null if the user has no data in that product
   *  OR the suite has no read-token configured for that product. */
  tasks: TaskSummary[] | null;
  notes: NoteSummary | null;
  roadmap: RoadmapSummary | null;
  analytics: AnalyticsSummary | null;
  /** Health flags — names which product reads failed so the client can
   *  show "(briefing unavailable)" rather than a confidently-empty state. */
  reads: {
    tasks: "ok" | "skipped_no_env" | "error";
    notes: "ok" | "skipped_no_env" | "error";
    roadmap: "ok" | "skipped_no_env" | "error";
    analytics: "ok" | "skipped_no_env" | "error";
  };
};

export type TodayRequest = {
  /** Clerk user id (`user_xxx…`). Resolves user via Tasks' `users` table
   *  by clerkId, then by email if clerkId-row is absent. */
  clerkId: string;
  /** Email of record. Used as the cross-product join key when clerkId-by-row
   *  isn't available (some product DBs key by email only). */
  email: string;
};
