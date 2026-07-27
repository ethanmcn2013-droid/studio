/**
 * Cohort retention for sponsored activations.
 *
 * The metric dictionary is the authority here, and it is deliberately strict:
 *
 *   Day-7  — a meaningful action on any day 5 through 9 after the first action.
 *   Day-30 — any day 25 through 35.
 *   Day-90 — any day 80 through 100.
 *
 * Three rules follow from it, and each one exists to stop a flattering number:
 *
 * 1. A cohort is not eligible until its window has *closed*. Measuring day-30
 *    retention on activations that are twenty days old would divide by people
 *    who have not had the chance to return yet, which reads as a collapse in
 *    retention when it is only impatience.
 * 2. Retention is a rate, so it is withheld below five eligible activations,
 *    not three. A rate over four people describes four people.
 * 3. The denominator travels with the value. A share without its base invites
 *    the reader to imagine a bigger one.
 *
 * The unit is the activation, not the workspace hash: `sponsor_activations`
 * already carries one row per sponsored recipient, and counting anything else
 * would let one recipient with two workspaces read as two.
 */

import { RATE_MIN_WORKSPACES } from "./suppression";

export const RETENTION_WINDOWS = {
  day7: { earliest: 5, latest: 9 },
  day30: { earliest: 25, latest: 35 },
  day90: { earliest: 80, latest: 100 },
} as const;

export type RetentionHorizon = keyof typeof RETENTION_WINDOWS;

const DAY_MS = 86_400_000;

export type ActivationUsage = {
  activationId: string;
  /** Day of the first meaningful action, as ms UTC. */
  firstActionAt: number;
  /** Days on which this activation acted, as ms UTC. Order is irrelevant. */
  actionDays: readonly number[];
};

export type RetentionResult =
  | { state: "value"; returned: number; eligible: number; rate: number }
  | { state: "withheld"; eligible: number }
  | { state: "unavailable"; reason: string };

function wholeDaysBetween(from: number, to: number): number {
  return Math.floor((to - from) / DAY_MS);
}

/** An activation counts once its window has fully closed, never before. */
export function isCohortClosed(
  activation: ActivationUsage,
  horizon: RetentionHorizon,
  nowMs: number,
): boolean {
  return wholeDaysBetween(activation.firstActionAt, nowMs) >= RETENTION_WINDOWS[horizon].latest;
}

export function didReturnInWindow(
  activation: ActivationUsage,
  horizon: RetentionHorizon,
): boolean {
  const { earliest, latest } = RETENTION_WINDOWS[horizon];
  return activation.actionDays.some((day) => {
    const offset = wholeDaysBetween(activation.firstActionAt, day);
    return offset >= earliest && offset <= latest;
  });
}

/**
 * Retention across the closed part of a cohort.
 *
 * `unavailable` when nothing has closed yet, `withheld` when the closed cohort
 * is too small to describe as a rate. Neither is ever a zero.
 */
export function computeRetention(
  activations: readonly ActivationUsage[],
  horizon: RetentionHorizon,
  nowMs: number,
): RetentionResult {
  const closed = activations.filter((a) => isCohortClosed(a, horizon, nowMs));
  if (closed.length === 0) {
    const { latest } = RETENTION_WINDOWS[horizon];
    return {
      state: "unavailable",
      reason: `No sponsored recipient has reached day ${latest} yet`,
    };
  }
  if (closed.length < RATE_MIN_WORKSPACES) {
    return { state: "withheld", eligible: closed.length };
  }
  const returned = closed.filter((a) => didReturnInWindow(a, horizon)).length;
  return {
    state: "value",
    returned,
    eligible: closed.length,
    rate: returned / closed.length,
  };
}
