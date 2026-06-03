/**
 * Cross-suite Today aggregation — shared types.
 *
 * Powers `/api/today` and (eventually) the native iOS app's home
 * screen. The response shape is designed to be small enough to fit
 * in a single payload + render-once on the iOS home, and stable
 * enough that adding fields later doesn't break older app builds.
 *
 * Native iOS clients should be lenient parsers (treat unknown fields
 * as ignorable). Web clients (the suite-wide Today dashboard)
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

// ── iOS-native Today payload (per IOS_TODAY_DOC_IA_2026_05_21 §8b) ─────────
//
// The native iOS Today document is a server-rendered presentation layer
// on top of `TodayResponse`. The native client is dumb — it does not
// own timezone logic, greeting phrasing, or "should section X be
// visible right now" decisions. The server owns all of that so a single
// truth holds across the web suite and iOS.
//
// `TodayNativePayload` is consumed by `/api/native/today`.

export type TodayProductSlug = "tasks" | "notes" | "roadmap" | "analytics";

export type TodaySectionId = "today" | "evening" | "upcoming" | "caught";

export type TodayNativeItem = {
  /** Stable id for this row (workspace id, milestone slug, synthetic id). */
  id: string;
  /** Which product this row routes into. */
  productSlug: TodayProductSlug;
  /** Display title — workspace name, milestone title, note excerpt. */
  title: string;
  /** Secondary line — counts, target date, relative time. Optional. */
  meta?: string;
  /** Canonical product URL the iOS shell opens in the product WebView. */
  deepLink: string;
  /** Whether the leading circle on R4/R5 should be tap-to-toggle. False
   *  for workspace-summary rows; will be true once the aggregator grows
   *  task-item-level granularity. Stays false in v1. */
  canCheck?: boolean;
  /** Whether the row is already complete. Stays false in v1. */
  isComplete?: boolean;
};

export type TodayNativeSection = {
  id: TodaySectionId;
  /** Server-decides — iOS client renders if `true`, hides if `false`. */
  visible: boolean;
  items: TodayNativeItem[];
};

export type TodayNativeGreeting = {
  /** "Good morning, Anya." — full phrase, ready to render. */
  phrase: string;
  /** "Thursday, 21 May" — editorial date string in user's locale. */
  dateString: string;
};

export type TodayNativeAnchor = {
  /** Pre-formatted display string for the New York-serif numeral.
   *  E.g. "12", "0", "—" when no data. */
  numeral: string;
  /** Short label below the numeral. E.g. "tasks done this week". */
  label: string;
  /** Optional second line. E.g. "Thursday was your busiest." */
  supportingLine?: string;
  /** Which product the anchor card routes into on tap. */
  productSlug: TodayProductSlug;
  /** Canonical product URL the iOS shell opens on anchor tap. */
  deepLink: string;
};

export type TodayNativeUser = {
  /** Display name — first name preferred, falls back to email-local-part. */
  name: string;
  /** IANA timezone the user lives in. Drives §2 time-of-day logic. */
  timezone: string;
  /** BCP 47 locale, e.g. "en-IE". Drives date formatting. */
  locale: string;
};

export type TodayNativeMeta = {
  /** Unix ms when the underlying aggregator data was fetched. */
  lastUpdated: string;
  /** Unix ms when this shaped payload was generated. */
  serverGeneratedAt: string;
  /** Reads health map — surfaces partial-product outages to the client. */
  reads: TodayResponse["reads"];
};

export type TodayNativePayload = {
  user: TodayNativeUser;
  greeting: TodayNativeGreeting;
  anchor: TodayNativeAnchor;
  sections: TodayNativeSection[];
  meta: TodayNativeMeta;
};

export type TodayNativeRequest = TodayRequest & {
  /** User's display name. Client supplies — aggregator doesn't return it. */
  name?: string;
  /** IANA timezone. Optional — falls back to analytics.timezone, then UTC. */
  timezone?: string;
  /** BCP 47 locale. Optional — falls back to "en-IE". */
  locale?: string;
  /** Override "now" for deterministic testing. Server-only. */
  nowMs?: number;
};
