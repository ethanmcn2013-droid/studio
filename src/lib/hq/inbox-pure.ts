/**
 * Pure types + sort/count helper for the HQ inbox.
 *
 * Extracted from `inbox.ts` so they're testable without the
 * `import "server-only"` guard. The runtime aggregator at `inbox.ts`
 * merges items from fs/cron sources, then calls finalizeInbox.
 */

export type InboxTier = "high" | "mid" | "low";

export type InboxItem = {
  id: string;
  tier: InboxTier;
  source:
    | "atlas-drift"
    | "atlas-stale"
    | "atlas-stub"
    | "cron"
    | "risk"
    | "decision-review"
    | "prospect";
  title: string;
  detail: string;
  href?: string;
  date?: string;
};

export const TIER_RANK: Record<InboxTier, number> = {
  high: 0,
  mid: 1,
  low: 2,
};

export function finalizeInbox(items: InboxItem[]): {
  items: InboxItem[];
  tierCounts: Record<InboxTier, number>;
} {
  const sorted = [...items].sort((a, b) => {
    if (a.tier !== b.tier) return TIER_RANK[a.tier] - TIER_RANK[b.tier];
    const da = a.date ?? "9999-99-99";
    const db = b.date ?? "9999-99-99";
    if (da !== db) return da.localeCompare(db);
    return a.title.localeCompare(b.title);
  });
  const tierCounts: Record<InboxTier, number> = { high: 0, mid: 0, low: 0 };
  for (const item of sorted) tierCounts[item.tier] += 1;
  return { items: sorted, tierCounts };
}
