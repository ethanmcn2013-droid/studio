import "server-only";
import { readHqSection } from "@/lib/hq/markdown";
import { seedHqData } from "@/lib/hq/data";
import {
  finalizeInbox,
  type InboxItem,
  type InboxTier,
} from "@/lib/hq/inbox-pure";

export type { InboxItem, InboxTier };
export { finalizeInbox };

/**
 * Signal HQ Inbox — things you owe an answer to right now.
 *
 * HQ v3 (2026-05-16) made the contract exclusive: the Inbox is
 * human-decision only — items where *you choosing to act* is the
 * resolution. System-decay signals (atlas drift/stale/stub, cron
 * health, repo silence, session failures) moved to Pulse. A source
 * appears in exactly one section so the founder never reads the same
 * fact twice (the Inbox/Pulse stutter the redesign removed).
 *
 * Sources (all human-decision, all derived):
 *   - risks markdown (high if At risk/Blocked, mid if review due /
 *                     high-high / Needs attention)
 *   - decisions markdown (low if reviewDate today/past)
 *   - prospects in seedHqData (mid if status To Contact / Contacted /
 *                              Replied / Demo Booked and follow-up due)
 *   - failed Vercel deploys in the last 24h (high — you must redeploy)
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
          source: "vercel-deploy",
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
  const [risks, decisions, vercelDeploys] = await Promise.all([
    readRiskItems(),
    readDecisionReviewItems(),
    readVercelDeployItems(),
  ]);
  const prospects = readProspectItems();

  const merged = [...risks, ...decisions, ...prospects, ...vercelDeploys];
  const { items, tierCounts } = finalizeInbox(merged);

  return {
    generatedAt: new Date().toISOString(),
    items,
    tierCounts,
  };
}

