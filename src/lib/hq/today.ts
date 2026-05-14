import "server-only";
import { exec } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { cache } from "react";
import { getCronHealth, type CronHealth } from "@/lib/cron/runs";
import { readHqSection } from "@/lib/hq/markdown";
import {
  readDriftSidecarCached,
  readLogJsonlCached,
} from "@/lib/hq/shared-reads";

// Cron health duplicated between Today and Inbox — cache it.
const getCronHealthCached = cache(getCronHealth);

/**
 * Today — the derived signal layer for Signal HQ.
 *
 * Reads from real sources of truth (phase.md, log.jsonl, git commits
 * across the 5 product repos, atlas _drift.json, cron_runs). No
 * localStorage. No seed prose. Every value here changes when the
 * underlying source changes — that's the whole point.
 *
 * Per the 2026-05-14 HQ audit: the "every session impacts HQ"
 * requirement is met by deriving state, not by enforcing an "update HQ"
 * rule on every commit. Sessions impact HQ because sessions impact the
 * source files HQ reads.
 */

const execAsync = promisify(exec);

const HOME = process.env.HOME ?? "";
const PROJECTS_ROOT = HOME ? path.join(HOME, "Projects", "personal") : "";
const PRODUCTS = ["studio", "tasks", "roadmap", "analytics", "notes"] as const;
type Product = (typeof PRODUCTS)[number];

export type RepoActivity = {
  repo: Product;
  available: boolean;
  lastCommitSha?: string;
  lastCommitDate?: string;
  lastCommitMessage?: string;
  hoursSinceLastCommit?: number;
};

export type AtlasDriftSummary = {
  hasDrift: boolean;
  driftedSlugs: string[];
  driftedRefCount: number;
};

export type SessionPulse = {
  totalLoggedResponses: number;
  loggedToday: number;
  loggedLast7Days: number;
  lastResponseAt: string | null;
};

export type PhaseSnapshot = {
  available: boolean;
  headline: string;
  source: string;
};

export type RecentDecision = {
  id: string;
  title: string;
  date: string;
  category: string;
  status: string;
};

export type ActiveRisk = {
  id: string;
  title: string;
  area: string;
  likelihood: string;
  impact: string;
  status: string;
  reviewDate: string;
};

export type FeatureSummary = {
  inFlight: number;
  byStatus: Record<string, number>;
  byProduct: Record<string, number>;
  highImpactQueued: Array<{ id: string; title: string; product: string }>;
};

export type CampaignSummary = {
  active: Array<{ id: string; title: string; status: string; progress: number }>;
};

export type ProductSummary = {
  id: string;
  title: string;
  layer: string;
  status: string;
  maturity: number;
};

export type PilotSummary = {
  id: string;
  title: string;
  status: string;
  nextStep: string;
};

export type TodayData = {
  generatedAt: string;
  phase: PhaseSnapshot;
  repos: RepoActivity[];
  cron: CronHealth[];
  atlasDrift: AtlasDriftSummary;
  sessionPulse: SessionPulse;
  recentDecisions: RecentDecision[];
  activeRisks: ActiveRisk[];
  features: FeatureSummary;
  campaigns: CampaignSummary;
  products: ProductSummary[];
  pilots: PilotSummary[];
};

/** Read phase.md and return the first non-empty line as the headline. */
async function readPhase(): Promise<PhaseSnapshot> {
  if (!HOME) {
    return { available: false, headline: "—", source: "" };
  }
  const phasePath = path.join(HOME, ".claude", "state", "phase.md");
  try {
    const raw = await fs.readFile(phasePath, "utf-8");
    const firstLine = raw
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l.length > 0);
    return {
      available: true,
      headline: firstLine ?? "—",
      source: phasePath,
    };
  } catch {
    return { available: false, headline: "—", source: phasePath };
  }
}

async function readRepoActivity(repo: Product): Promise<RepoActivity> {
  if (!PROJECTS_ROOT) {
    return { repo, available: false };
  }
  const repoPath = path.join(PROJECTS_ROOT, repo);
  try {
    const { stdout } = await execAsync(
      `git log -1 --format="%h%x09%cI%x09%s" 2>/dev/null`,
      { cwd: repoPath, timeout: 4000 },
    );
    const trimmed = stdout.trim();
    if (!trimmed) return { repo, available: true };

    const [sha, iso, ...rest] = trimmed.split("\t");
    const message = rest.join("\t");
    const commitTime = new Date(iso).getTime();
    const hoursSince = Number.isFinite(commitTime)
      ? Math.max(0, (Date.now() - commitTime) / (1000 * 60 * 60))
      : undefined;

    return {
      repo,
      available: true,
      lastCommitSha: sha,
      lastCommitDate: iso,
      lastCommitMessage: message,
      hoursSinceLastCommit: hoursSince,
    };
  } catch {
    return { repo, available: false };
  }
}

async function readAtlasDrift(): Promise<AtlasDriftSummary> {
  const parsed = await readDriftSidecarCached();
  const slugs = Object.keys(parsed);
  if (slugs.length === 0) {
    return { hasDrift: false, driftedSlugs: [], driftedRefCount: 0 };
  }
  const driftedRefCount = slugs.reduce(
    (n, slug) => n + (parsed[slug]?.drifted?.length ?? 0),
    0,
  );
  return { hasDrift: true, driftedSlugs: slugs, driftedRefCount };
}

async function readSessionPulse(): Promise<SessionPulse> {
  const objects = await readLogJsonlCached();
  const total = objects.length;
  if (total === 0) {
    return {
      totalLoggedResponses: 0,
      loggedToday: 0,
      loggedLast7Days: 0,
      lastResponseAt: null,
    };
  }
  const now = Date.now();
  const todayBoundary = now - 24 * 60 * 60 * 1000;
  const weekBoundary = now - 7 * 24 * 60 * 60 * 1000;

  let loggedToday = 0;
  let loggedLast7Days = 0;
  let lastResponseAt: string | null = null;

  for (const obj of objects) {
    if (!obj.ts) continue;
    const t = new Date(obj.ts).getTime();
    if (!Number.isFinite(t)) continue;
    if (t >= todayBoundary) loggedToday += 1;
    if (t >= weekBoundary) loggedLast7Days += 1;
    if (!lastResponseAt || t > new Date(lastResponseAt).getTime()) {
      lastResponseAt = obj.ts;
    }
  }

  return {
    totalLoggedResponses: total,
    loggedToday,
    loggedLast7Days,
    lastResponseAt,
  };
}

async function readCron(): Promise<CronHealth[]> {
  try {
    return await Promise.all([getCronHealthCached("analytics_daily")]);
  } catch {
    return [];
  }
}

async function readRecentDecisions(): Promise<RecentDecision[]> {
  try {
    const entries = await readHqSection("decisions");
    return entries.slice(0, 4).map((e) => ({
      id: e.fm.id,
      title: e.fm.title,
      date: e.fm.date ?? "",
      category: e.fm.category ?? "—",
      status: e.fm.status ?? "—",
    }));
  } catch {
    return [];
  }
}

async function readActiveRisks(): Promise<ActiveRisk[]> {
  try {
    const entries = await readHqSection("risks");
    return entries
      .filter((e) => e.fm.status !== "Closed" && e.fm.status !== "Cleared")
      .sort((a, b) => {
        // High likelihood + High impact float to the top.
        const score = (e: typeof a) =>
          (String(e.fm.likelihood) === "High" ? 2 : 1) *
          (String(e.fm.impact) === "High" ? 2 : 1);
        return score(b) - score(a);
      })
      .slice(0, 5)
      .map((e) => ({
        id: e.fm.id,
        title: e.fm.title,
        area: e.fm.category ?? "—",
        likelihood: String(e.fm.likelihood ?? "—"),
        impact: String(e.fm.impact ?? "—"),
        status: e.fm.status ?? "—",
        reviewDate: e.fm.reviewDate ?? "—",
      }));
  } catch {
    return [];
  }
}

async function readFeatureSummary(): Promise<FeatureSummary> {
  try {
    const entries = await readHqSection("features");
    const inFlight = entries.filter(
      (e) =>
        e.fm.status === "In Progress" ||
        e.fm.status === "Built" ||
        e.fm.status === "Testing" ||
        e.fm.status === "Planned",
    ).length;
    const byStatus: Record<string, number> = {};
    const byProduct: Record<string, number> = {};
    for (const e of entries) {
      const s = e.fm.status ?? "—";
      byStatus[s] = (byStatus[s] ?? 0) + 1;
      const p = String(e.fm.product ?? "—");
      byProduct[p] = (byProduct[p] ?? 0) + 1;
    }
    const highImpactQueued = entries
      .filter((e) => e.fm.status === "Idea" && String(e.fm.impact) === "High")
      .slice(0, 3)
      .map((e) => ({
        id: e.fm.id,
        title: e.fm.title,
        product: String(e.fm.product ?? "—"),
      }));
    return { inFlight, byStatus, byProduct, highImpactQueued };
  } catch {
    return { inFlight: 0, byStatus: {}, byProduct: {}, highImpactQueued: [] };
  }
}

async function readProducts(): Promise<ProductSummary[]> {
  try {
    const entries = await readHqSection("products");
    return entries.map((e) => ({
      id: e.fm.id,
      title: e.fm.title,
      layer: String(e.fm.layer ?? "—"),
      status: e.fm.status ?? "—",
      maturity:
        typeof e.fm.maturity === "number"
          ? e.fm.maturity
          : Number(e.fm.maturity) || 0,
    }));
  } catch {
    return [];
  }
}

async function readPilots(): Promise<PilotSummary[]> {
  try {
    const entries = await readHqSection("pilots");
    return entries.map((e) => ({
      id: e.fm.id,
      title: e.fm.title,
      status: String(e.fm.status ?? "—"),
      nextStep: String(e.fm.nextStep ?? ""),
    }));
  } catch {
    return [];
  }
}

async function readCampaignSummary(): Promise<CampaignSummary> {
  try {
    const entries = await readHqSection("campaigns");
    const active = entries
      .filter(
        (e) =>
          e.fm.status === "Ready for Ethan" ||
          e.fm.status === "Live" ||
          e.fm.status === "Drafting" ||
          e.fm.status === "Review",
      )
      .slice(0, 3)
      .map((e) => ({
        id: e.fm.id,
        title: e.fm.title,
        status: e.fm.status ?? "—",
        progress:
          typeof e.fm.progress === "number"
            ? e.fm.progress
            : Number(e.fm.progress) || 0,
      }));
    return { active };
  } catch {
    return { active: [] };
  }
}

export async function getTodayData(): Promise<TodayData> {
  const [
    phase,
    repos,
    atlasDrift,
    sessionPulse,
    cron,
    recentDecisions,
    activeRisks,
    features,
    campaigns,
    products,
    pilots,
  ] = await Promise.all([
    readPhase(),
    Promise.all(PRODUCTS.map(readRepoActivity)),
    readAtlasDrift(),
    readSessionPulse(),
    readCron(),
    readRecentDecisions(),
    readActiveRisks(),
    readFeatureSummary(),
    readCampaignSummary(),
    readProducts(),
    readPilots(),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    phase,
    repos,
    cron,
    atlasDrift,
    sessionPulse,
    recentDecisions,
    activeRisks,
    features,
    campaigns,
    products,
    pilots,
  };
}

export function formatHoursAgo(hours: number | undefined): string {
  if (hours === undefined || !Number.isFinite(hours)) return "—";
  if (hours < 1) {
    const minutes = Math.max(1, Math.round(hours * 60));
    return `${minutes}m ago`;
  }
  if (hours < 24) {
    return `${Math.round(hours)}h ago`;
  }
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}
