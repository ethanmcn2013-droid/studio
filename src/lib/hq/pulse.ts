import "server-only";
import type { TodayData } from "@/lib/hq/today";
import { readDriftSidecarCached } from "@/lib/hq/shared-reads";

/**
 * Pulse, the "is anything on fire or quietly rotting?" layer.
 *
 * A sole-founder CEO opens HQ to triage, not to browse. After "what
 * needs an answer" (Inbox) the next question is "is anything broken or
 * going stale while I wasn't looking?". Pulse answers exactly that and
 * nothing else. It derives entirely from sources HQ already reads
 * (git activity, cron_runs, risks markdown, atlas drift sidecar), no
 * new wiring, no manual upkeep.
 *
 * Severity is the product, not the data. Every signal collapses to one
 * of three states and the section headline is the worst of them:
 *
 *   clear    , nothing to act on. Quiet is a valid state.
 *   watch    , drifting; not yet costing anything.
 *   critical , costing you something now (a dead cron, a stuck
 *               high-impact risk, a repo gone silent for a week).
 */

export type PulseLevel = "clear" | "watch" | "critical";

export type PulseSignal = {
  id: string;
  level: PulseLevel;
  label: string;
  detail: string;
  href?: string;
};

export type PulseState = {
  level: PulseLevel;
  counts: { critical: number; watch: number };
  signals: PulseSignal[];
};

/** Repo silent past this many hours → watch. */
const REPO_QUIET_HOURS = 72;
/** Repo silent past this many hours → critical (a week dark). */
const REPO_DARK_HOURS = 168;
/** Atlas drift older than this many days → the map is going stale. */
const DRIFT_STALE_DAYS = 7;

function worst(a: PulseLevel, b: PulseLevel): PulseLevel {
  const rank: Record<PulseLevel, number> = { clear: 0, watch: 1, critical: 2 };
  return rank[a] >= rank[b] ? a : b;
}

function daysAgo(iso: string | undefined): number | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return null;
  return Math.max(0, (Date.now() - t) / (1000 * 60 * 60 * 24));
}

export async function getPulseState(today: TodayData): Promise<PulseState> {
  const signals: PulseSignal[] = [];

  // ── Repos gone quiet ────────────────────────────────────────────────
  for (const r of today.repos) {
    if (!r.available || r.hoursSinceLastCommit === undefined) continue;
    const h = r.hoursSinceLastCommit;
    if (h < REPO_QUIET_HOURS) continue;
    const days = Math.round(h / 24);
    const dark = h >= REPO_DARK_HOURS;
    signals.push({
      id: `repo-${r.repo}`,
      level: dark ? "critical" : "watch",
      label: `${r.repo} has gone quiet`,
      detail: `no commit in ${days}d · a product rots silently before it fails loudly`,
    });
  }

  // ── Cron health ─────────────────────────────────────────────────────
  for (const c of today.cron) {
    if (c.status === "green") continue;
    const level: PulseLevel =
      c.status === "red" || c.status === "never" ? "critical" : "watch";
    const detail =
      c.status === "never"
        ? "never recorded a run · the daily loop may never have fired"
        : c.status === "red"
          ? "last run failed or is >26h stale · the daily loop is down"
          : "last run >12h stale · watch the next window";
    signals.push({
      id: `cron-${c.source}`,
      level,
      label: `${c.source.replace(/_/g, " ")} cron`,
      detail,
      href: "/hq/health",
    });
  }
  // The Tasks 09:00 UTC digest is no longer a structural blind spot:
  // it pings Studio's cron_runs as `tasks_digest`, so the data-driven
  // loop above now monitors it like analytics_daily. Until the Tasks
  // side's STUDIO_CRON_PING env is set it reads honestly as `never`,
  // not a hardcoded nag, and self-heals to green on the first ping.

  // Risks deliberately do NOT appear here. HQ v3 (2026-05-16) made the
  // Inbox/Pulse contract exclusive: a risk needs a *human decision*
  // (review, mitigate, accept) so it lives in the Inbox only. Pulse is
  // system-decay, things degrading whether or not you act. Keeping
  // risks out of Pulse is what removes the back-to-back duplicate-list
  // stutter the redesign set out to kill.

  // ── Atlas drift age, is the map going stale? ───────────────────────
  try {
    const sidecar = await readDriftSidecarCached();
    const slugs = Object.keys(sidecar);
    if (slugs.length > 0) {
      let oldest = 0;
      let oldestSlug = "";
      for (const slug of slugs) {
        const d = daysAgo(sidecar[slug]?.updatedAt);
        if (d !== null && d > oldest) {
          oldest = d;
          oldestSlug = slug;
        }
      }
      const stale = oldest >= DRIFT_STALE_DAYS;
      signals.push({
        id: "atlas-drift-age",
        level: stale ? "critical" : "watch",
        label: `${slugs.length} atlas ${slugs.length === 1 ? "entry" : "entries"} drifted`,
        detail: stale
          ? `oldest unverified ${Math.round(oldest)}d (${oldestSlug}) · the map no longer matches the code`
          : `oldest ${Math.round(oldest)}d · re-verify before it compounds`,
        href: "/hq/atlas",
      });
    }
  } catch {
    // sidecar absent → no drift signal, not an error
  }

  const counts = {
    critical: signals.filter((s) => s.level === "critical").length,
    watch: signals.filter((s) => s.level === "watch").length,
  };
  const level = signals.reduce<PulseLevel>(
    (acc, s) => worst(acc, s.level),
    "clear",
  );

  // Sort: critical first, then watch; stable within tier.
  const order: Record<PulseLevel, number> = { critical: 0, watch: 1, clear: 2 };
  signals.sort((a, b) => order[a.level] - order[b.level]);

  return { level, counts, signals };
}
