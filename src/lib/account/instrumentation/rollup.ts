/**
 * The pure daily rollup: attributed events in, one aggregate row per venue-local
 * day out, plus the lifecycle facts that must outlive the 35-day event sweep.
 *
 * No database, no clock, no environment. Everything arrives as an argument, so
 * every rule below is provable in a unit test rather than inferred from a
 * staging run.
 *
 * The distinction this module exists to preserve: a day with a row and zero
 * activity was *measured* and was quiet. A day with no row was never measured.
 * Those are different sentences, and only the first one may ever be shown as a
 * number.
 */

import type { SponsoredProduct } from "./event-schema";

export const PRODUCT_BITS: Record<SponsoredProduct, number> = {
  notes: 1,
  tasks: 2,
  timeline: 4,
  signal: 8,
};

export const ALL_PRODUCTS: SponsoredProduct[] = ["notes", "tasks", "timeline", "signal"];

export type RollupEvent = {
  eventId: string;
  sponsorId: string;
  product: SponsoredProduct;
  kind: string;
  occurredAt: number;
  subjectIdHash: string;
  workspaceIdHash: string;
  hashSaltEpoch: string;
  localDate: string;
};

export type RollupRejection =
  | "duplicate-event-id"
  | "sponsor-mismatch"
  | "salt-epoch-mismatch"
  | "outside-window";

export type DailyCounts = {
  sponsorId: string;
  localDate: string;
  hashSaltEpoch: string;
  activeWorkspaces: number;
  activeSubjects: number;
  firstActionWorkspaces: number;
  meaningfulActions: number;
  /** Null for a product with no coverage that day: not instrumented is not zero. */
  perProduct: Record<SponsoredProduct, { actions: number; workspaces: number } | null>;
  coverageMask: number;
  expectedMask: number;
};

export type LifecycleDelta = {
  workspaceIdHash: string;
  hashSaltEpoch: string;
  /** Merged toward the earliest known. */
  firstActionLocalDate: string;
  /** Merged toward the latest known. */
  lastActionLocalDate: string;
  productLastActionLocalDate: Partial<Record<SponsoredProduct, string>>;
};

export type RollupInput = {
  sponsorId: string;
  hashSaltEpoch: string;
  /** Local dates being rolled up, oldest first. */
  dates: readonly string[];
  events: readonly RollupEvent[];
  /** Products instrumented for this sponsor in this run. */
  coveredProducts: readonly SponsoredProduct[];
  /** Products expected to be instrumented, stored so a later product cannot
   *  retroactively downgrade a closed day. */
  expectedProducts?: readonly SponsoredProduct[];
  /** Workspaces already known to have acted before this window, so a returning
   *  workspace is not miscounted as a first action. */
  knownWorkspaces?: ReadonlySet<string>;
  /** Eligible sponsored workspaces per local date, taken from access. */
  eligibleByDate: Readonly<Record<string, number>>;
};

export type RollupOutput = {
  daily: DailyCounts[];
  lifecycle: LifecycleDelta[];
  rejected: Array<{ eventId: string; reason: RollupRejection }>;
  eligibleByDate: Readonly<Record<string, number>>;
};

export function maskFor(products: readonly SponsoredProduct[]): number {
  return products.reduce((mask, product) => mask | PRODUCT_BITS[product], 0);
}

/**
 * Roll a window of attributed events into daily rows.
 *
 * Duplicate event ids are dropped rather than summed — the emitter guarantees
 * the id is stable across replays, so a repeat is the same action arriving
 * twice, not two actions.
 */
export function rollupDaily(input: RollupInput): RollupOutput {
  const covered = [...input.coveredProducts];
  const expected = input.expectedProducts ? [...input.expectedProducts] : covered;
  const coverageMask = maskFor(covered);
  const expectedMask = maskFor(expected);
  const dateSet = new Set(input.dates);

  const rejected: RollupOutput["rejected"] = [];
  const seen = new Set<string>();
  const known = new Set(input.knownWorkspaces ?? []);

  type DayBucket = {
    workspaces: Set<string>;
    subjects: Set<string>;
    firstAction: Set<string>;
    actions: number;
    perProduct: Map<SponsoredProduct, { actions: number; workspaces: Set<string> }>;
  };
  const byDate = new Map<string, DayBucket>();
  const bucketFor = (date: string): DayBucket => {
    const found = byDate.get(date);
    if (found) return found;
    const created: DayBucket = {
      workspaces: new Set(),
      subjects: new Set(),
      firstAction: new Set(),
      actions: 0,
      perProduct: new Map(),
    };
    byDate.set(date, created);
    return created;
  };

  const lifecycle = new Map<string, LifecycleDelta>();

  // Oldest first, so "first action" means what it says.
  const ordered = [...input.events].sort((a, b) => a.occurredAt - b.occurredAt);

  for (const event of ordered) {
    if (seen.has(event.eventId)) {
      rejected.push({ eventId: event.eventId, reason: "duplicate-event-id" });
      continue;
    }
    if (event.sponsorId !== input.sponsorId) {
      rejected.push({ eventId: event.eventId, reason: "sponsor-mismatch" });
      continue;
    }
    if (event.hashSaltEpoch !== input.hashSaltEpoch) {
      // Hashes from a different salt are a different identity space. Counting
      // them together would double one workspace or merge two.
      rejected.push({ eventId: event.eventId, reason: "salt-epoch-mismatch" });
      continue;
    }
    if (!dateSet.has(event.localDate)) {
      rejected.push({ eventId: event.eventId, reason: "outside-window" });
      continue;
    }
    seen.add(event.eventId);

    const bucket = bucketFor(event.localDate);
    bucket.actions += 1;
    bucket.workspaces.add(event.workspaceIdHash);
    bucket.subjects.add(event.subjectIdHash);
    if (!known.has(event.workspaceIdHash)) {
      known.add(event.workspaceIdHash);
      bucket.firstAction.add(event.workspaceIdHash);
    }

    const perProduct = bucket.perProduct.get(event.product) ?? {
      actions: 0,
      workspaces: new Set<string>(),
    };
    perProduct.actions += 1;
    perProduct.workspaces.add(event.workspaceIdHash);
    bucket.perProduct.set(event.product, perProduct);

    const existing = lifecycle.get(event.workspaceIdHash);
    if (!existing) {
      lifecycle.set(event.workspaceIdHash, {
        workspaceIdHash: event.workspaceIdHash,
        hashSaltEpoch: event.hashSaltEpoch,
        firstActionLocalDate: event.localDate,
        lastActionLocalDate: event.localDate,
        productLastActionLocalDate: { [event.product]: event.localDate },
      });
    } else {
      if (event.localDate < existing.firstActionLocalDate) {
        existing.firstActionLocalDate = event.localDate;
      }
      if (event.localDate > existing.lastActionLocalDate) {
        existing.lastActionLocalDate = event.localDate;
      }
      const prior = existing.productLastActionLocalDate[event.product];
      if (!prior || event.localDate > prior) {
        existing.productLastActionLocalDate[event.product] = event.localDate;
      }
    }
  }

  // Every date in the window gets a row, including quiet ones. A measured quiet
  // day is a fact worth keeping; its absence would later read as unknown.
  const daily: DailyCounts[] = input.dates.map((localDate) => {
    const bucket = byDate.get(localDate);
    const perProduct = Object.fromEntries(
      ALL_PRODUCTS.map((product) => {
        if (!covered.includes(product)) return [product, null];
        const found = bucket?.perProduct.get(product);
        return [
          product,
          { actions: found?.actions ?? 0, workspaces: found?.workspaces.size ?? 0 },
        ];
      }),
    ) as DailyCounts["perProduct"];

    return {
      sponsorId: input.sponsorId,
      localDate,
      hashSaltEpoch: input.hashSaltEpoch,
      activeWorkspaces: bucket?.workspaces.size ?? 0,
      activeSubjects: bucket?.subjects.size ?? 0,
      firstActionWorkspaces: bucket?.firstAction.size ?? 0,
      meaningfulActions: bucket?.actions ?? 0,
      perProduct,
      coverageMask,
      expectedMask,
    };
  });

  return {
    daily,
    lifecycle: [...lifecycle.values()],
    rejected,
    eligibleByDate: input.eligibleByDate,
  };
}

/** Merge a delta into a stored lifecycle row. Advance-only in both directions. */
export function mergeLifecycle(
  stored: LifecycleDelta | undefined,
  delta: LifecycleDelta,
): LifecycleDelta {
  if (!stored) return { ...delta, productLastActionLocalDate: { ...delta.productLastActionLocalDate } };
  const merged: LifecycleDelta = {
    workspaceIdHash: delta.workspaceIdHash,
    hashSaltEpoch: delta.hashSaltEpoch,
    firstActionLocalDate:
      delta.firstActionLocalDate < stored.firstActionLocalDate
        ? delta.firstActionLocalDate
        : stored.firstActionLocalDate,
    lastActionLocalDate:
      delta.lastActionLocalDate > stored.lastActionLocalDate
        ? delta.lastActionLocalDate
        : stored.lastActionLocalDate,
    productLastActionLocalDate: { ...stored.productLastActionLocalDate },
  };
  for (const product of ALL_PRODUCTS) {
    const next = delta.productLastActionLocalDate[product];
    if (!next) continue;
    const prior = merged.productLastActionLocalDate[product];
    if (!prior || next > prior) merged.productLastActionLocalDate[product] = next;
  }
  return merged;
}
