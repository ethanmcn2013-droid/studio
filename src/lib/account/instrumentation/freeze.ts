import { createHash } from "node:crypto";

import type { AccountSnapshot } from "../types";
import { isLocalDayClosed } from "./local-date";

/**
 * Freezing a closed period.
 *
 * A venue that received a report in March must be able to open the same numbers
 * in June. Recomputing on read cannot promise that: the daily rows behind it
 * can be repaired, the salt can rotate, and the thresholds can change. So a
 * closed period is computed once, stored whole, and served back verbatim.
 *
 * Two rules keep that promise honest:
 *
 * 1. Only a *closed* period may be frozen. Freezing a period still in progress
 *    would seal a partial number as if it were final.
 * 2. The stored payload carries a content hash. A later edit is then
 *    detectable rather than merely discouraged.
 */

export const FROZEN_LABEL = "FROZEN REPORT · CLOSED PERIOD." as const;

export type FreezeRefusal =
  | "period-not-closed"
  | "coverage-unavailable"
  | "already-frozen";

export type FreezeCandidate = {
  sponsorId: string;
  periodStart: string;
  periodEnd: string;
  periodLabel: string;
  snapshot: AccountSnapshot;
  hashSaltEpoch: string;
  eligibleWorkspaces: number;
  dataThrough: number;
};

export type FrozenReport = {
  id: string;
  sponsorId: string;
  periodStart: string;
  periodEnd: string;
  periodLabel: string;
  payloadJson: string;
  coverageState: string;
  suppressionApplied: boolean;
  eligibleWorkspaces: number;
  hashSaltEpoch: string;
  contentHash: string;
  dataThrough: number;
};

export type FreezeOutcome =
  | { frozen: true; report: FrozenReport }
  | { frozen: false; reason: FreezeRefusal };

/**
 * Canonical JSON: keys sorted at every level, so a hash depends on the content
 * rather than on the order a serialiser happened to choose.
 */
export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonicalJson(v)}`).join(",")}}`;
}

export function contentHashFor(payloadJson: string): string {
  return createHash("sha256").update(payloadJson).digest("hex");
}

export function isPeriodClosed(
  periodEnd: string,
  nowMs: number,
  timeZone?: string,
): boolean {
  return isLocalDayClosed(periodEnd, nowMs, timeZone);
}

/**
 * Freeze a closed period into a stored report.
 *
 * The snapshot is stored exactly as it will be served, already suppressed, so
 * nothing downstream has to remember to reapply a threshold.
 */
export function freezeReport(
  candidate: FreezeCandidate,
  nowMs: number,
  options: { existing?: boolean; timeZone?: string } = {},
): FreezeOutcome {
  if (options.existing) return { frozen: false, reason: "already-frozen" };
  if (!isPeriodClosed(candidate.periodEnd, nowMs, options.timeZone)) {
    return { frozen: false, reason: "period-not-closed" };
  }
  if (candidate.snapshot.coverage.state === "unavailable") {
    // A period with no coverage has nothing to freeze. Storing it would give
    // an empty month the same standing as a measured one.
    return { frozen: false, reason: "coverage-unavailable" };
  }

  const sealed: AccountSnapshot = {
    ...candidate.snapshot,
    sampleLabel: FROZEN_LABEL,
  };
  const payloadJson = canonicalJson(sealed);

  return {
    frozen: true,
    report: {
      id: `snap_${candidate.sponsorId}_${candidate.periodStart}_${candidate.periodEnd}`,
      sponsorId: candidate.sponsorId,
      periodStart: candidate.periodStart,
      periodEnd: candidate.periodEnd,
      periodLabel: candidate.periodLabel,
      payloadJson,
      coverageState: candidate.snapshot.coverage.state,
      suppressionApplied: candidate.snapshot.coverage.state === "suppressed",
      eligibleWorkspaces: candidate.eligibleWorkspaces,
      hashSaltEpoch: candidate.hashSaltEpoch,
      contentHash: contentHashFor(payloadJson),
      dataThrough: candidate.dataThrough,
    },
  };
}

export type VerifyResult =
  | { intact: true; snapshot: AccountSnapshot }
  | { intact: false; reason: "content-hash-mismatch" | "payload-unreadable" };

/** Read a frozen report back, refusing anything that no longer matches its hash. */
export function readFrozenReport(report: {
  payloadJson: string;
  contentHash: string;
}): VerifyResult {
  if (contentHashFor(report.payloadJson) !== report.contentHash) {
    return { intact: false, reason: "content-hash-mismatch" };
  }
  try {
    return { intact: true, snapshot: JSON.parse(report.payloadJson) as AccountSnapshot };
  } catch {
    return { intact: false, reason: "payload-unreadable" };
  }
}
