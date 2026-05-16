import "server-only";
import { cache } from "react";
import fs from "node:fs/promises";
import path from "node:path";
import { readHqSection } from "@/lib/hq/markdown";
import { getCronHealth } from "@/lib/cron/runs";
import { seedHqData } from "@/lib/hq/data";
import {
  readDriftSidecarCached,
  readLogJsonlCached,
} from "@/lib/hq/shared-reads";
import {
  finalizeInbox,
  type InboxItem,
  type InboxTier,
} from "@/lib/hq/inbox-pure";

export type { InboxItem, InboxTier };
export { finalizeInbox };

// Cron health duplicated between Today and Inbox — cache it.
const getCronHealthCached = cache(getCronHealth);

/**
 * Signal HQ Inbox — things you owe an answer to right now.
 *
 * Per the 2026-05-14 strategy audit, mission control is wrong-shaped when
 * it shows everything at flat priority. The inbox is the corrective: a
 * single severity-tiered queue derived from real sources. "Clear" is a
 * valid state. If the queue is empty, nothing is owed — that's the
 * surface telling the truth.
 *
 * Sources (all derived):
 *   - atlas drift sidecar (high tier — file changed, entry didn't)
 *   - cron health (high if red/never, mid if amber)
 *   - risks markdown (high if At risk/Blocked + review date passed,
 *                     mid if Needs attention)
 *   - decisions markdown (low if reviewDate today/past)
 *   - atlas entries (low if stale, low if stub)
 *   - prospects in seedHqData (mid if status To Contact / Contacted
 *                              and follow-up date overdue)
 */

export type InboxData = {
  generatedAt: string;
  items: InboxItem[];
  tierCounts: Record<InboxTier, number>;
};

const HOME = process.env.HOME ?? "";

function todayIso(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function pastOrToday(yyyymmdd: string): boolean {
  if (!yyyymmdd) return false;
  return yyyymmdd <= todayIso();
}

async function readDriftItems(): Promise<InboxItem[]> {
  const parsed = await readDriftSidecarCached();
  return Object.entries(parsed).map(([slug, payload]) => {
    const drifted = payload.drifted ?? [];
    return {
      id: `atlas-drift:${slug}`,
      tier: "high" as InboxTier,
      source: "atlas-drift" as const,
      title: `atlas/${slug} has drifted`,
      detail: drifted.length
        ? `${drifted.length} reference${drifted.length === 1 ? "" : "s"} changed since lastVerified · ${drifted[0]}`
        : "References changed since the entry was last verified.",
      href: `/hq/atlas/${slug}`,
      date: payload.updatedAt?.slice(0, 10),
    };
  });
}

async function readCronItems(): Promise<InboxItem[]> {
  try {
    const health = await getCronHealthCached("analytics_daily");
    if (health.status === "green") return [];
    const tier: InboxTier =
      health.status === "never" || health.status === "red" ? "high" : "mid";
    return [
      {
        id: `cron:analytics_daily`,
        tier,
        source: "cron",
        title: `analytics daily cron · ${health.status}`,
        detail:
          health.status === "never"
            ? "Never run in this environment. CRON_SECRET + RESEND_API_KEY may be unset on Vercel."
            : health.hoursSinceLastRun !== null
              ? `Last run ${Math.round(health.hoursSinceLastRun)}h ago · expected every ${health.expectedCadenceHours}h`
              : "Cron status amber.",
        href: `/hq/health`,
        date: todayIso(),
      },
    ];
  } catch {
    return [];
  }
}

async function readRiskItems(): Promise<InboxItem[]> {
  try {
    const entries = await readHqSection("risks");
    const items: InboxItem[] = [];
    for (const e of entries) {
      const status = String(e.fm.status ?? "");
      const reviewDate = String(e.fm.reviewDate ?? "");
      const likelihood = String(e.fm.likelihood ?? "");
      const impact = String(e.fm.impact ?? "");
      const isAtRisk = status === "At risk" || status === "Blocked";
      const reviewDue = reviewDate && pastOrToday(reviewDate);
      const isHighHigh = likelihood === "High" && impact === "High";
      if (isAtRisk || reviewDue || isHighHigh) {
        const tier: InboxTier = isAtRisk
          ? "high"
          : reviewDue
            ? "mid"
            : isHighHigh
              ? "mid"
              : "low";
        items.push({
          id: `risk:${e.fm.id}`,
          tier,
          source: "risk",
          title: e.fm.title,
          detail: `${e.fm.category ?? "Risk"} · ${status.toLowerCase()}${
            reviewDate ? ` · review ${reviewDate}` : ""
          }`,
          href: undefined,
          date: reviewDate || undefined,
        });
      } else if (status === "Needs attention") {
        items.push({
          id: `risk:${e.fm.id}`,
          tier: "mid",
          source: "risk",
          title: e.fm.title,
          detail: `${e.fm.category ?? "Risk"} · needs attention${
            reviewDate ? ` · review ${reviewDate}` : ""
          }`,
          date: reviewDate || undefined,
        });
      }
    }
    return items;
  } catch {
    return [];
  }
}

async function readDecisionReviewItems(): Promise<InboxItem[]> {
  try {
    const entries = await readHqSection("decisions");
    return entries
      .filter((e) => {
        const review = String(e.fm.reviewDate ?? "");
        const status = String(e.fm.status ?? "");
        return review && pastOrToday(review) && status !== "Reversed";
      })
      .map((e) => ({
        id: `decision-review:${e.fm.id}`,
        tier: "low" as InboxTier,
        source: "decision-review" as const,
        title: `Decision review · ${e.fm.title.slice(0, 80)}${e.fm.title.length > 80 ? "…" : ""}`,
        detail: `${e.fm.category ?? "Decision"} · ${String(e.fm.status ?? "active").toLowerCase()} · review ${e.fm.reviewDate}`,
        href: undefined,
        date: String(e.fm.reviewDate ?? ""),
      }));
  } catch {
    return [];
  }
}

async function readAtlasItems(): Promise<InboxItem[]> {
  try {
    // Atlas lives at content/atlas, not content/hq/atlas — read via direct fs.
    const dir = path.join(process.cwd(), "content", "atlas");
    const files = await fs.readdir(dir).catch(() => [] as string[]);
    const mdFiles = files.filter((f) => f.endsWith(".md") && f !== "README.md");
    const today = Date.now();
    const raws = await Promise.all(
      mdFiles.map((file) =>
        fs.readFile(path.join(dir, file), "utf-8").catch(() => ""),
      ),
    );
    const items: InboxItem[] = [];
    for (let idx = 0; idx < mdFiles.length; idx++) {
      const raw = raws[idx];
      const file = mdFiles[idx];
      const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
      if (!fmMatch) continue;
      const fm = fmMatch[1];
      const slugMatch = fm.match(/^slug:\s*(.*)$/m);
      const lastVerifiedMatch = fm.match(/^lastVerified:\s*(.*)$/m);
      const statusMatch = fm.match(/^status:\s*(.*)$/m);
      const slug = slugMatch?.[1]?.trim() ?? file.replace(/\.md$/, "");
      const lastVerified = lastVerifiedMatch?.[1]?.trim() ?? "";
      const status = statusMatch?.[1]?.trim() ?? "";
      if (status === "stub") {
        items.push({
          id: `atlas-stub:${slug}`,
          tier: "low",
          source: "atlas-stub",
          title: `atlas/${slug} is a stub`,
          detail: "Frontmatter only; body sections are placeholders.",
          href: `/hq/atlas/${slug}`,
        });
      }
      if (lastVerified) {
        const verifiedAt = new Date(`${lastVerified}T12:00:00Z`).getTime();
        if (Number.isFinite(verifiedAt)) {
          const ageDays = Math.floor((today - verifiedAt) / (1000 * 60 * 60 * 24));
          if (ageDays > 60) {
            items.push({
              id: `atlas-stale:${slug}`,
              tier: "low",
              source: "atlas-stale",
              title: `atlas/${slug} is stale`,
              detail: `Last verified ${lastVerified} · ${ageDays} days ago`,
              href: `/hq/atlas/${slug}`,
              date: lastVerified,
            });
          }
        }
      }
    }
    return items;
  } catch {
    return [];
  }
}

async function readLogErrorItems(): Promise<InboxItem[]> {
  const rows = await readLogJsonlCached();
  const failed = rows.filter((r) => r.ok === false && r.ts);
  if (failed.length === 0) return [];
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentFailures = failed.filter((r) => {
    const t = new Date(String(r.ts)).getTime();
    return Number.isFinite(t) && t >= weekAgo;
  });
  if (recentFailures.length === 0) return [];
  const tier: InboxTier = recentFailures.length >= 5 ? "high" : "mid";
  return [
    {
      id: `log-errors:${recentFailures.length}`,
      tier,
      source: "cron",
      title: `${recentFailures.length} session response${recentFailures.length === 1 ? "" : "s"} failed in the last 7 days`,
      detail: `STATUS-block validation or hook failures — check ~/.claude/state/log.jsonl`,
      date: String(recentFailures[recentFailures.length - 1].ts).slice(0, 10),
    },
  ];
}

async function readVercelDeployItems(): Promise<InboxItem[]> {
  const token = process.env.VERCEL_API_TOKEN;
  if (!token) return []; // graceful no-env fallback
  const teamId = process.env.VERCEL_TEAM_ID;
  const projects = (process.env.VERCEL_PROJECT_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (projects.length === 0) return [];

  const since = Date.now() - 24 * 60 * 60 * 1000;
  const items: InboxItem[] = [];

  for (const projectId of projects) {
    const url = new URL("https://api.vercel.com/v6/deployments");
    url.searchParams.set("projectId", projectId);
    url.searchParams.set("limit", "20");
    url.searchParams.set("since", String(since));
    if (teamId) url.searchParams.set("teamId", teamId);

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        // 5s timeout to keep inbox responsive even if Vercel is slow
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) continue;
      const data = (await res.json()) as {
        deployments?: Array<{
          uid: string;
          name: string;
          state: string;
          created: number;
          inspectorUrl?: string;
        }>;
      };
      const deployments = data.deployments ?? [];
      const failed = deployments.filter(
        (d) => d.state === "ERROR" || d.state === "CANCELED",
      );
      for (const d of failed) {
        items.push({
          id: `vercel-deploy:${d.uid}`,
          tier: "high",
          source: "cron",
          title: `Vercel deploy ${d.state.toLowerCase()} · ${d.name}`,
          detail: d.inspectorUrl
            ? `inspect: ${d.inspectorUrl}`
            : "Open the Vercel dashboard to inspect",
          href: d.inspectorUrl,
          date: new Date(d.created).toISOString().slice(0, 10),
        });
      }
    } catch {
      // Network / timeout — skip silently
    }
  }
  return items;
}

function readProspectItems(): InboxItem[] {
  try {
    const prospects = seedHqData.prospects ?? [];
    const today = todayIso();
    return prospects
      .filter((p) => {
        const next = p.nextFollowUp ?? "";
        if (!next) return false;
        return (
          next <= today &&
          (p.status === "To Contact" ||
            p.status === "Contacted" ||
            p.status === "Replied" ||
            p.status === "Demo Booked")
        );
      })
      .map((p) => ({
        id: `prospect:${p.id}`,
        tier: "mid" as InboxTier,
        source: "prospect" as const,
        title: `Follow up · ${p.organisation}`,
        detail: `${p.contactName} · ${p.status.toLowerCase()} · due ${p.nextFollowUp}`,
        date: p.nextFollowUp,
      }));
  } catch {
    return [];
  }
}

export async function getInboxData(): Promise<InboxData> {
  const [drift, cron, risks, decisions, atlas, logErrors, vercelDeploys] =
    await Promise.all([
      readDriftItems(),
      readCronItems(),
      readRiskItems(),
      readDecisionReviewItems(),
      readAtlasItems(),
      readLogErrorItems(),
      readVercelDeployItems(),
    ]);
  const prospects = readProspectItems();

  const merged = [
    ...drift,
    ...cron,
    ...risks,
    ...decisions,
    ...atlas,
    ...prospects,
    ...logErrors,
    ...vercelDeploys,
  ];
  const { items, tierCounts } = finalizeInbox(merged);

  return {
    generatedAt: new Date().toISOString(),
    items,
    tierCounts,
  };
}

