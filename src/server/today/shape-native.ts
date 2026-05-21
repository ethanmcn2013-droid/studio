/**
 * Pure, server-decides iOS Today payload shaper.
 *
 * Consumes a raw `TodayResponse` (from `aggregateToday()`) and a
 * `TodayNativeRequest` (carrying user-display metadata the aggregator
 * doesn't return: name, timezone, locale, optional `nowMs`).
 *
 * Returns a `TodayNativePayload` shaped per the IA spec at
 * `docs/strategy/IOS_TODAY_DOC_IA_2026_05_21.md` § 8b.
 *
 * Pure — no I/O, no Date.now() except via the injected `nowMs`. This
 * is the module the unit tests target. The route module is the thin
 * I/O wrapper.
 *
 * Responsibilities:
 *  - Time-of-day greeting (§2)
 *  - Editorial date string (§2)
 *  - Anchor card selection by data priority (§1 R3)
 *  - Section composition + server-decides visibility (§1 R4–R7, §2)
 *
 * Not responsibilities:
 *  - Auth (route handles it)
 *  - Turso reads (aggregator handles them)
 *  - Locale negotiation beyond a soft fallback
 */

import type {
  RoadmapMilestone,
  TaskSummary,
  TodayNativeAnchor,
  TodayNativeGreeting,
  TodayNativeItem,
  TodayNativePayload,
  TodayNativeRequest,
  TodayNativeSection,
  TodayResponse,
} from "./types";

// Product deep-link bases. Centralised so a domain change ripples once.
const PRODUCT_HOSTS = {
  tasks: "https://tasks.signalstudio.ie",
  notes: "https://notes.signalstudio.ie",
  roadmap: "https://roadmap.signalstudio.ie",
  analytics: "https://analytics.signalstudio.ie",
} as const;

// ── Time-of-day (§2) ──────────────────────────────────────────────────────
// Pulls the local hour using Intl.DateTimeFormat so it respects the
// user's IANA timezone properly (DST-aware, no manual offset math).

function getLocalHour(nowMs: number, timezone: string): number {
  try {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hour12: false,
      timeZone: timezone,
    });
    const parts = formatter.formatToParts(new Date(nowMs));
    const hourPart = parts.find((p) => p.type === "hour")?.value ?? "0";
    const hour = Number.parseInt(hourPart, 10);
    return Number.isFinite(hour) ? hour % 24 : 0;
  } catch {
    // Unknown timezone — fall back to UTC. Never crash the shaper.
    return new Date(nowMs).getUTCHours();
  }
}

export function pickGreetingPhrase(firstName: string, localHour: number): string {
  const safeName = firstName.trim() || "there";
  if (localHour >= 4 && localHour < 12) return `Good morning, ${safeName}.`;
  if (localHour >= 12 && localHour < 19) return `Afternoon, ${safeName}.`;
  if (localHour >= 19 || localHour < 3) return `Evening, ${safeName}.`;
  // 03:00–03:59 — the spec's "Up late" band.
  return `Up late, ${safeName}.`;
}

export function shouldShowEvening(localHour: number): boolean {
  // 15:00–02:59 visible. Otherwise hidden.
  return localHour >= 15 || localHour < 3;
}

function formatDateString(nowMs: number, timezone: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: timezone,
    }).format(new Date(nowMs));
  } catch {
    return new Intl.DateTimeFormat("en-IE", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(new Date(nowMs));
  }
}

// ── Name resolution ───────────────────────────────────────────────────────

function resolveFirstName(name: string | undefined, email: string): string {
  if (name && name.trim()) {
    return name.trim().split(/\s+/)[0] ?? name.trim();
  }
  const localPart = email.split("@")[0] ?? "";
  if (!localPart) return "there";
  // Convert "anya.smith" → "Anya". Email-local-part is a fallback, not the
  // expected source. Real apps will pass `name` from Clerk's user object.
  const stem = localPart.split(/[._+]/)[0] ?? localPart;
  return stem.charAt(0).toUpperCase() + stem.slice(1);
}

// ── Anchor card selection (§1 R3) ─────────────────────────────────────────
// Priority: shipped-this-week (positive momentum) > upcoming milestones
// (forward-look) > notes captured (lightest hook) > "welcome" fallback.

function pickAnchor(response: TodayResponse): TodayNativeAnchor {
  const tasks = response.tasks ?? [];
  const totalShipped24h = tasks.reduce((sum, t) => sum + t.shippedLast24h, 0);
  const totalInCourt = tasks.reduce((sum, t) => sum + t.inYourCourt, 0);
  const shippedLast7d = response.roadmap?.shippedLast7d ?? 0;

  if (totalShipped24h > 0) {
    return {
      numeral: String(totalShipped24h),
      label: totalShipped24h === 1 ? "task shipped in the last day" : "tasks shipped in the last day",
      supportingLine: totalInCourt > 0
        ? `${totalInCourt} still in your court.`
        : undefined,
      productSlug: "tasks",
      deepLink: `${PRODUCT_HOSTS.tasks}/app`,
    };
  }

  if (shippedLast7d > 0) {
    return {
      numeral: String(shippedLast7d),
      label: shippedLast7d === 1 ? "milestone shipped this week" : "milestones shipped this week",
      productSlug: "roadmap",
      deepLink: `${PRODUCT_HOSTS.roadmap}/app`,
    };
  }

  if (totalInCourt > 0) {
    return {
      numeral: String(totalInCourt),
      label: totalInCourt === 1 ? "item in your court today" : "items in your court today",
      productSlug: "tasks",
      deepLink: `${PRODUCT_HOSTS.tasks}/app`,
    };
  }

  const noteTotal = response.notes?.total ?? 0;
  if (noteTotal > 0) {
    return {
      numeral: String(noteTotal),
      label: noteTotal === 1 ? "note captured" : "notes captured",
      productSlug: "notes",
      deepLink: `${PRODUCT_HOSTS.notes}/app`,
    };
  }

  return {
    numeral: "—",
    label: "Your day starts here.",
    supportingLine: "Add the first thing to begin.",
    productSlug: "tasks",
    deepLink: `${PRODUCT_HOSTS.tasks}/app`,
  };
}

// ── Section composition (§1 R4–R7) ────────────────────────────────────────
// V1 returns workspace-level rows for tasks. Item-level fidelity needs an
// aggregator extension (TaskItem[] per workspace) — tracked in
// docs/ios/today-native-api.md § Known v1 limitations.

function buildTodayItems(tasks: TaskSummary[]): TodayNativeItem[] {
  return tasks
    .filter((t) => t.inYourCourt > 0 || t.blocked > 0)
    .slice(0, 5)
    .map((t) => {
      const metaParts: string[] = [];
      metaParts.push(`${t.inYourCourt} in your court`);
      if (t.blocked > 0) metaParts.push(`${t.blocked} blocked`);
      return {
        id: t.workspaceId,
        productSlug: "tasks" as const,
        title: t.workspaceName,
        meta: metaParts.join(" · "),
        deepLink: `${PRODUCT_HOSTS.tasks}/app/workspaces/${t.workspaceId}`,
        canCheck: false,
      };
    });
}

function formatMilestoneMeta(m: RoadmapMilestone, nowMs: number): string {
  if (!m.targetDate) return m.status;
  const target = new Date(`${m.targetDate}T00:00:00Z`).getTime();
  if (!Number.isFinite(target)) return m.status;
  const days = Math.round((target - nowMs) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days > 1 && days <= 7) return `In ${days} days`;
  if (days < 0 && days >= -7) return days === -1 ? "Yesterday" : `${Math.abs(days)} days ago`;
  return m.targetDate;
}

function buildUpcomingItems(
  milestones: RoadmapMilestone[],
  nowMs: number,
): TodayNativeItem[] {
  return milestones.slice(0, 4).map((m, idx) => ({
    id: `${m.workspaceSlug}-${idx}`,
    productSlug: "roadmap" as const,
    title: m.title,
    meta: `${m.workspaceName} · ${formatMilestoneMeta(m, nowMs)}`,
    deepLink: `${PRODUCT_HOSTS.roadmap}/${m.workspaceSlug}`,
    canCheck: false,
  }));
}

function buildCaughtItems(
  notes: TodayResponse["notes"],
  nowMs: number,
): TodayNativeItem[] {
  if (!notes || !notes.lastTouchedAt || !notes.lastExcerpt) return [];
  const ageHours = (nowMs - notes.lastTouchedAt) / 3_600_000;
  // Only surface in "Caught yesterday" if touched within the last 36h.
  if (ageHours > 36) return [];
  const meta = ageHours < 1
    ? "Just now"
    : ageHours < 24
      ? `${Math.floor(ageHours)}h ago`
      : "Yesterday";
  return [
    {
      id: "notes-latest",
      productSlug: "notes",
      title: notes.lastExcerpt,
      meta,
      deepLink: `${PRODUCT_HOSTS.notes}/app`,
      canCheck: false,
    },
  ];
}

function buildSections(
  response: TodayResponse,
  localHour: number,
  nowMs: number,
): TodayNativeSection[] {
  const todayItems = buildTodayItems(response.tasks ?? []);
  // Evening section in v1 mirrors today's items — until aggregator gains
  // due-time granularity. Named in the doc so it's not a surprise.
  const eveningItems = todayItems;
  const upcomingItems = buildUpcomingItems(response.roadmap?.upcoming ?? [], nowMs);
  const caughtItems = buildCaughtItems(response.notes, nowMs);

  return [
    { id: "today", visible: true, items: todayItems },
    { id: "evening", visible: shouldShowEvening(localHour), items: eveningItems },
    { id: "upcoming", visible: upcomingItems.length > 0, items: upcomingItems },
    { id: "caught", visible: caughtItems.length > 0, items: caughtItems },
  ];
}

// ── Public entry point ────────────────────────────────────────────────────

export function shapeNativePayload(
  response: TodayResponse,
  request: TodayNativeRequest,
): TodayNativePayload {
  const nowMs = request.nowMs ?? Date.now();
  const timezone = request.timezone ?? response.analytics?.timezone ?? "UTC";
  const locale = request.locale ?? "en-IE";
  const firstName = resolveFirstName(request.name, request.email);
  const localHour = getLocalHour(nowMs, timezone);

  const greeting: TodayNativeGreeting = {
    phrase: pickGreetingPhrase(firstName, localHour),
    dateString: formatDateString(nowMs, timezone, locale),
  };

  return {
    user: {
      name: firstName,
      timezone,
      locale,
    },
    greeting,
    anchor: pickAnchor(response),
    sections: buildSections(response, localHour, nowMs),
    meta: {
      lastUpdated: new Date(response.generatedAt).toISOString(),
      serverGeneratedAt: new Date(nowMs).toISOString(),
      reads: response.reads,
    },
  };
}
