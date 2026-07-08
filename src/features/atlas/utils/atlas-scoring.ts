/**
 * Atlas scoring — pure helpers. No filesystem, no React, no `server-only`.
 *
 * These turn the repo's real markdown figures into the small set of honest
 * numbers the Atlas shows. The hard rule: unknown in ⇒ null out, never a
 * fabricated or NaN value. Callers render `null` as an explicit placeholder.
 */

import type { AtlasHealth } from "../types";

/** Coerce a frontmatter value (often a string like "84") to a number, or null. */
export function num(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") return null;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/** Mean of the finite numbers in the list, rounded. Null if none. */
export function mean(values: Array<number | null>): number | null {
  const nums = values.filter((v): v is number => typeof v === "number");
  if (nums.length === 0) return null;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

/**
 * Weighted composite over {score, weight} items, rounded to 0–100. Items with a
 * missing score or non-positive weight are ignored. Null if nothing usable.
 * This is exactly how the launch-readiness composite is computed.
 */
export function weightedComposite(
  items: Array<{ score: number | null; weight: number | null }>,
): number | null {
  let weighted = 0;
  let totalWeight = 0;
  for (const { score, weight } of items) {
    if (score === null) continue;
    const w = weight === null || weight <= 0 ? 1 : weight;
    weighted += score * w;
    totalWeight += w;
  }
  if (totalWeight === 0) return null;
  return Math.round(weighted / totalWeight);
}

/** The four health states, ranked worst → best for combination. */
const HEALTH_RANK: Record<AtlasHealth, number> = {
  blocked: 0,
  attention: 1,
  unknown: 2,
  healthy: 3,
};

/** Combine several health signals into the worst (most urgent) one. */
export function worstHealth(...healths: AtlasHealth[]): AtlasHealth {
  if (healths.length === 0) return "unknown";
  return healths.reduce((worst, h) =>
    HEALTH_RANK[h] < HEALTH_RANK[worst] ? h : worst,
  );
}

/** Human label for a health state (used for accessible names, never color-only). */
export function healthLabel(health: AtlasHealth): string {
  switch (health) {
    case "healthy":
      return "Healthy";
    case "attention":
      return "Needs attention";
    case "blocked":
      return "Blocked";
    case "unknown":
      return "Not scored";
  }
}

/**
 * Derive a health band from a 0–100 score. Deliberately conservative: a score
 * we don't have is `unknown`, not a hopeful green.
 */
export function healthFromScore(
  score: number | null,
  opts: { attentionBelow?: number; blockedBelow?: number } = {},
): AtlasHealth {
  const { attentionBelow = 55, blockedBelow = 25 } = opts;
  if (score === null) return "unknown";
  if (score < blockedBelow) return "blocked";
  if (score < attentionBelow) return "attention";
  return "healthy";
}

/** Format a 0–100 score for display, or the placeholder token when null. */
export function formatScore(score: number | null, placeholder = "—"): string {
  return score === null ? placeholder : String(score);
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Format an ISO date (YYYY-MM-DD) as "8 Jul 2026". Passes through on failure. */
export function formatDateHuman(iso: string | undefined | null): string | null {
  if (!iso) return null;
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  const year = m[1];
  const month = MONTHS[Number(m[2]) - 1];
  const day = Number(m[3]);
  if (!month) return iso;
  return `${day} ${month} ${year}`;
}

/** The most recent (max) of a set of ISO date strings, ignoring falsy values. */
export function mostRecentDate(
  dates: Array<string | undefined | null>,
): string | null {
  const valid = dates.filter(
    (d): d is string => typeof d === "string" && /^\d{4}-\d{2}-\d{2}/.test(d),
  );
  if (valid.length === 0) return null;
  return valid.reduce((max, d) => (d > max ? d : max));
}

/** Whole days between an ISO date and a reference (default today). */
export function daysUntil(iso: string, from: Date = new Date()): number | null {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const target = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const ref = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());
  return Math.round((target - ref) / 86_400_000);
}
