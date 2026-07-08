import "server-only";

import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type {
  CopyGuidanceRule,
  CopyInventory,
  CopyInventoryItem,
  CopyReviewHeatmapCell,
  CopyReviewItem,
  CopyReviewMetric,
  CopyReviewSnapshot,
  CopyReviewState,
  CopyReviewStatus,
  CopyReviewType,
  CopyReviewExposure,
} from "@/lib/hq/copy-review-types";

const COPY_REVIEW_DIR = path.join(process.cwd(), "content", "hq", "copy-review");
const INVENTORY_FILE = path.join(COPY_REVIEW_DIR, "inventory.json");
const STATE_FILE = path.join(COPY_REVIEW_DIR, "founder-state.json");

const EMPTY_INVENTORY: CopyInventory = {
  schemaVersion: 1,
  generatedAt: new Date(0).toISOString(),
  sourceRoot: process.cwd(),
  itemCount: 0,
  items: [],
};

const EMPTY_STATE: CopyReviewState = {
  schemaVersion: 1,
  updatedAt: new Date(0).toISOString(),
  reviews: {},
  guidance: [],
};

type ReviewMutation = {
  itemId: string;
  hash: string;
  status: Exclude<CopyReviewStatus, "needs_review">;
  comment?: string;
  saveAsGuidance?: boolean;
};

type HallMutation = {
  itemId: string;
  hash: string;
  hallOfFame: boolean;
  hallCategory?: string;
};

export async function getCopyReviewSnapshot(): Promise<CopyReviewSnapshot> {
  const [inventory, state] = await Promise.all([readInventory(), readState()]);
  const items = mergeInventoryWithState(inventory.items, state);
  const needsFounderReview = items.filter((item) => item.status === "needs_review");
  const highRisk = items.filter((item) => item.riskLevel === "high");
  const approved = items.filter((item) => item.status === "approved");
  const changed = items.filter((item) => item.isChanged);
  const rejected = items.filter((item) => item.status === "rejected");
  const needsWork = items.filter((item) => item.status === "needs_work");
  const deferred = items.filter((item) => item.status === "deferred");
  const legalPricing = items.filter(
    (item) => item.copyType === "pricing" || item.copyType === "legal" || item.exposure === "legal",
  );
  const approvedPct = pct(approved.length, items.length);
  const weeklyItems = items
    .filter(
      (item) =>
        item.status === "needs_review" ||
        item.status === "rejected" ||
        item.status === "needs_work" ||
        item.riskLevel === "high" ||
        item.isChanged,
    )
    .sort(prioritySort);

  return {
    generatedAt: inventory.generatedAt,
    stateUpdatedAt: state.updatedAt,
    inventoryPath: relative(INVENTORY_FILE),
    statePath: relative(STATE_FILE),
    items: items.sort(prioritySort),
    metrics: [
      metric("total copy", String(items.length), "scanned from source files", "quiet"),
      metric("founder approved", `${approvedPct}%`, `${approved.length} exact hashes approved`, approvedPct >= 90 ? "accent" : "warn"),
      metric("needs review", String(needsFounderReview.length), `${changed.length} changed since last scan`, needsFounderReview.length ? "critical" : "accent"),
      metric("high risk", String(highRisk.length), "pricing, legal, claims, or brand drift", highRisk.length ? "critical" : "quiet"),
      metric("legal or pricing", String(legalPricing.length), "never batch-approved", legalPricing.length ? "warn" : "quiet"),
      metric("needs work", String(rejected.length + needsWork.length), `${rejected.length} rejected, ${needsWork.length} marked needs work`, rejected.length + needsWork.length ? "warn" : "quiet"),
      metric("deferred", String(deferred.length), "kept visible, not blocking shipping", deferred.length ? "quiet" : "accent"),
    ],
    heatmap: {
      product: heatmap(items, (item) => item.productArea),
      page: heatmap(items, (item) => item.route ?? item.location),
      audience: heatmap(items, (item) => item.audience ?? "unassigned"),
      type: heatmap(items, (item) => item.copyType),
      risk: heatmap(items, (item) => item.riskLevel),
      exposure: heatmap(items, (item) => item.exposure),
      change: heatmap(items, (item) => (item.isNew ? "new" : item.isChanged ? "changed" : "unchanged")),
    },
    guidance: deriveGuidance(state, items),
    hallOfFame: items
      .filter((item) => item.isHallOfFame || (item.status === "approved" && hallCandidate(item)))
      .sort((a, b) => Number(b.isHallOfFame) - Number(a.isHallOfFame) || a.copyType.localeCompare(b.copyType))
      .slice(0, 40),
    weeklyReview: {
      items: weeklyItems,
      estimatedMinutes: Math.max(1, Math.ceil(weeklyItems.length * 0.65)),
      canBatchApprove: weeklyItems.filter(canBatchApprove).length,
    },
    searchPresets: [
      { label: "Every CTA", query: "", type: "cta" },
      { label: "Pricing paragraphs", query: "", type: "pricing" },
      { label: "Empty states", query: "", type: "empty_state" },
      { label: "Onboarding", query: "", type: "onboarding" },
      { label: "Tooltips", query: "", type: "tooltip" },
      { label: "Errors", query: "", type: "error" },
      { label: "Product headlines", query: "Signal", type: "headline" },
      { label: "Student copy", query: "", audience: "student" },
      { label: "Wedding and venue copy", query: "wedding venue" },
      { label: "Public-facing", query: "", exposure: "public" },
    ],
  };
}

export async function reviewCopyItem(input: ReviewMutation): Promise<CopyReviewState> {
  const [inventory, state] = await Promise.all([readInventory(), readState()]);
  const item = inventory.items.find((candidate) => candidate.id === input.itemId);
  if (!item) throw new Error(`Copy item not found: ${input.itemId}`);
  if (item.hash !== input.hash) {
    throw new Error("The copy changed after this page loaded. Refresh before reviewing it.");
  }

  const now = new Date().toISOString();
  const comment = cleanComment(input.comment);
  const previous = state.reviews[item.id];
  const founderComments = [...(previous?.founderComments ?? [])];
  if (comment) founderComments.push(comment);

  const nextRecord = {
    itemId: item.id,
    currentStatus: input.status,
    reviewedHash: item.hash,
    approvedHash: input.status === "approved" ? item.hash : previous?.approvedHash,
    approvedText: input.status === "approved" ? item.text : previous?.approvedText,
    lastReviewedAt: now,
    founderComments,
    hallOfFame: previous?.hallOfFame ?? false,
    hallCategory: previous?.hallCategory,
    history: [
      ...(previous?.history ?? []),
      {
        hash: item.hash,
        status: input.status,
        reviewedAt: now,
        comment: comment || undefined,
        reviewer: "founder" as const,
      },
    ],
  };

  const guidance =
    input.saveAsGuidance && comment
      ? addGuidance(state.guidance, {
          id: stableId(`${item.id}:${item.hash}:${comment}`),
          text: comment,
          sourceItemId: item.id,
          sourceHash: item.hash,
          tags: guidanceTags(item, input.status),
          createdAt: now,
          sentiment:
            input.status === "approved"
              ? "approved"
              : input.status === "rejected"
                ? "rejected"
                : input.status === "needs_work"
                  ? "needs_work"
                  : "principle",
        })
      : state.guidance;

  const nextState: CopyReviewState = {
    schemaVersion: 1,
    updatedAt: now,
    reviews: { ...state.reviews, [item.id]: nextRecord },
    guidance,
  };

  await writeState(nextState);
  return nextState;
}

export async function toggleCopyHallOfFame(input: HallMutation): Promise<CopyReviewState> {
  const [inventory, state] = await Promise.all([readInventory(), readState()]);
  const item = inventory.items.find((candidate) => candidate.id === input.itemId);
  if (!item) throw new Error(`Copy item not found: ${input.itemId}`);
  if (item.hash !== input.hash) {
    throw new Error("The copy changed after this page loaded. Refresh before changing the Hall of Fame state.");
  }

  const now = new Date().toISOString();
  const previous = state.reviews[item.id];
  const record = previous ?? {
    itemId: item.id,
    currentStatus: "deferred" as const,
    reviewedHash: item.hash,
    lastReviewedAt: now,
    founderComments: [],
    history: [],
  };

  const nextState: CopyReviewState = {
    schemaVersion: 1,
    updatedAt: now,
    reviews: {
      ...state.reviews,
      [item.id]: {
        ...record,
        hallOfFame: input.hallOfFame,
        hallCategory: input.hallOfFame ? input.hallCategory || item.copyType : undefined,
      },
    },
    guidance: state.guidance,
  };
  await writeState(nextState);
  return nextState;
}

export function mergeInventoryWithState(
  items: CopyInventoryItem[],
  state: CopyReviewState,
): CopyReviewItem[] {
  return items.map((item) => {
    const review = state.reviews[item.id];
    const hashMatches = review?.reviewedHash === item.hash;
    const approvedMatches = review?.approvedHash === item.hash;
    const status: CopyReviewStatus = approvedMatches
      ? "approved"
      : hashMatches
        ? review.currentStatus
        : "needs_review";

    return {
      ...item,
      status,
      approvedHash: review?.approvedHash,
      previousApprovedText: review?.approvedText,
      lastReviewedAt: hashMatches || approvedMatches ? review?.lastReviewedAt : undefined,
      founderComments: review?.founderComments ?? [],
      reviewHistory: review?.history ?? [],
      isChanged: Boolean(
        (item.previousHash && item.previousHash !== item.hash) ||
          (review?.reviewedHash && review.reviewedHash !== item.hash),
      ),
      isNew: !item.previousHash && !review,
      isHallOfFame: Boolean(review?.hallOfFame),
      hallCategory: review?.hallCategory,
    };
  });
}

export function canBatchApprove(item: CopyReviewItem): boolean {
  return (
    item.status === "needs_review" &&
    item.riskLevel === "low" &&
    !item.isChanged &&
    item.exposure !== "legal" &&
    item.copyType !== "pricing" &&
    item.copyType !== "legal" &&
    item.aiNotes.length === 0
  );
}

export function assessCopyRisk(
  text: string,
  context: {
    location?: string;
    copyType?: CopyReviewType;
    exposure?: CopyReviewExposure;
  } = {},
): Pick<CopyInventoryItem, "riskScore" | "riskLevel" | "aiNotes" | "flags"> {
  const notes: string[] = [];
  const flags: string[] = [];
  const lower = text.toLowerCase();
  let score = 12;

  const banned = [
    "ai-powered",
    "all-in-one",
    "autonomous",
    "copilot",
    "cutting-edge",
    "delight",
    "enterprise-grade",
    "game-changer",
    "intelligent",
    "leverage",
    "powerful",
    "revolutionary",
    "seamless",
    "stakeholder",
    "streamline",
    "supercharge",
    "transform",
    "unleash",
    "world-class",
  ];
  const bannedHits = banned.filter((word) => lower.includes(word));
  if (bannedHits.length) {
    score += Math.min(34, bannedHits.length * 10);
    flags.push("off-brand-language");
    notes.push(`Contains banned or risky language: ${bannedHits.join(", ")}.`);
  }

  if (/\b(api|webhook|endpoint|oauth|repo|pull request|kanban|scrum|sprint|mvp)\b/i.test(text)) {
    score += 14;
    flags.push("jargon");
    notes.push("Contains technical or project-management jargon. Confirm the surface is exempt.");
  }

  if (/\b(best|only|guarantee|guaranteed|never fails|always|everyone)\b/i.test(text)) {
    score += 12;
    flags.push("claim-risk");
    notes.push("Makes a broad claim. Check proof before shipping.");
  }

  if (/[€$£]\s?\d|\bpricing\b|\bprice\b|\btrial\b|\bcontract\b|\blegal\b|\bterms\b/i.test(text)) {
    score += 18;
    flags.push("pricing-legal-risk");
    notes.push("Touches money, legal, or commitment language. Founder review should be explicit.");
  }

  if (text.length > 180) {
    score += 8;
    flags.push("too-long");
    notes.push("Long copy. Consider tightening before approval.");
  }

  if (context.exposure === "public" || context.exposure === "marketing") score += 8;
  if (context.exposure === "legal") score += 18;
  if (context.copyType === "pricing" || context.copyType === "legal") score += 18;
  if (context.copyType === "cta" && /learn more|click here|get started/i.test(text)) {
    score += 8;
    flags.push("weak-cta");
    notes.push("CTA may be generic. Prefer the concrete next action.");
  }

  const riskLevel = score >= 70 ? "high" : score >= 40 ? "medium" : "low";
  if (notes.length === 0) notes.push("No obvious brand, length, claim, or pricing risk found.");
  return { riskScore: Math.min(100, score), riskLevel, aiNotes: notes, flags };
}

async function readInventory(): Promise<CopyInventory> {
  return readJson<CopyInventory>(INVENTORY_FILE, EMPTY_INVENTORY);
}

async function readState(): Promise<CopyReviewState> {
  return readJson<CopyReviewState>(STATE_FILE, EMPTY_STATE);
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw err;
  }
}

async function writeState(state: CopyReviewState): Promise<void> {
  await fs.mkdir(COPY_REVIEW_DIR, { recursive: true });
  const tmp = `${STATE_FILE}.tmp`;
  await fs.writeFile(tmp, `${JSON.stringify(state, null, 2)}\n`, "utf8");
  await fs.rename(tmp, STATE_FILE);
}

function heatmap(
  items: CopyReviewItem[],
  getKey: (item: CopyReviewItem) => string,
): CopyReviewHeatmapCell[] {
  const cells = new Map<string, CopyReviewHeatmapCell>();
  for (const item of items) {
    const key = getKey(item) || "unassigned";
    const cell =
      cells.get(key) ??
      {
        key,
        label: key,
        approved: 0,
        needsReview: 0,
        rejected: 0,
        needsWork: 0,
        deferred: 0,
        total: 0,
        approvedPct: 0,
      };
    cell.total += 1;
    if (item.status === "approved") cell.approved += 1;
    if (item.status === "needs_review") cell.needsReview += 1;
    if (item.status === "rejected") cell.rejected += 1;
    if (item.status === "needs_work") cell.needsWork += 1;
    if (item.status === "deferred") cell.deferred += 1;
    cell.approvedPct = pct(cell.approved, cell.total);
    cells.set(key, cell);
  }
  return [...cells.values()]
    .sort((a, b) => b.needsReview - a.needsReview || b.total - a.total || a.label.localeCompare(b.label))
    .slice(0, 18);
}

function deriveGuidance(state: CopyReviewState, items: CopyReviewItem[]): CopyGuidanceRule[] {
  const derived = new Map<string, CopyGuidanceRule>();
  for (const rule of state.guidance) derived.set(rule.id, rule);

  for (const item of items) {
    for (const comment of item.founderComments) {
      if (comment.trim().length < 12) continue;
      const id = stableId(`comment:${item.id}:${comment}`);
      if (derived.has(id)) continue;
      derived.set(id, {
        id,
        text: comment,
        sourceItemId: item.id,
        sourceHash: item.hash,
        tags: guidanceTags(item, item.status === "needs_review" ? "needs_work" : item.status),
        createdAt: item.lastReviewedAt ?? new Date(0).toISOString(),
        sentiment:
          item.status === "approved"
            ? "approved"
            : item.status === "rejected"
              ? "rejected"
              : item.status === "needs_work"
                ? "needs_work"
                : "principle",
      });
    }
  }
  return [...derived.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function guidanceTags(
  item: CopyInventoryItem,
  status: Exclude<CopyReviewStatus, "needs_review">,
): string[] {
  return [
    status,
    item.copyType,
    item.exposure,
    item.productArea.toLowerCase().replace(/\s+/g, "-"),
    ...(item.audience ? [item.audience] : []),
  ];
}

function addGuidance(existing: CopyGuidanceRule[], next: CopyGuidanceRule): CopyGuidanceRule[] {
  if (existing.some((rule) => rule.id === next.id)) return existing;
  return [next, ...existing];
}

function cleanComment(comment?: string): string {
  return (comment ?? "").replace(/\s+/g, " ").trim();
}

function metric(
  label: string,
  value: string,
  note: string,
  tone: CopyReviewMetric["tone"],
): CopyReviewMetric {
  return { label, value, note, tone };
}

function prioritySort(a: CopyReviewItem, b: CopyReviewItem): number {
  return itemPriority(b) - itemPriority(a) || a.location.localeCompare(b.location) || a.line - b.line;
}

function itemPriority(item: CopyReviewItem): number {
  let score = item.riskScore;
  if (item.status === "needs_review") score += 80;
  if (item.status === "rejected" || item.status === "needs_work") score += 65;
  if (item.isChanged) score += 30;
  if (item.isNew) score += 20;
  if (item.copyType === "pricing" || item.copyType === "legal") score += 30;
  if (item.exposure === "public" || item.exposure === "marketing") score += 20;
  return score;
}

function hallCandidate(item: CopyReviewItem): boolean {
  return (
    item.status === "approved" &&
    ["headline", "subheading", "cta", "pricing", "onboarding", "empty_state", "body"].includes(item.copyType) &&
    item.riskLevel !== "high"
  );
}

function pct(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((part / total) * 100);
}

function stableId(input: string): string {
  return createHash("sha1").update(input).digest("hex").slice(0, 16);
}

function relative(file: string): string {
  return path.relative(process.cwd(), file).replace(/\\/g, "/");
}
