/**
 * The nightly sponsored-use maintenance run, as one ordered sequence.
 *
 * ## Why this file exists at all
 *
 * Three jobs have to happen every night and their order is load-bearing:
 *
 *   1. repair  — re-attribute events that arrived before their redemption was
 *                visible, so the rollup counts them;
 *   2. rollup  — fold closed venue-local days into `sponsor_usage_daily` and
 *                the per-workspace lifecycle;
 *   3. seal    — close day-30 continuation bands while their evidence exists;
 *   4. sweep   — delete raw events past the 35-day retention horizon.
 *
 * The sweep is destructive and unrecoverable. Running it before the rollup
 * deletes the evidence for a day nobody counted, and there is no second copy.
 * For as long as the sink was a no-op that was harmless, because the table was
 * empty; the moment a real transport lands it stops being harmless, silently,
 * and the failure shows up months later as a venue's report with a hole in it.
 *
 * So the ordering is not a comment and not a schedule. It is a function that
 * refuses to sweep unless the steps in front of it reported success, and it
 * returns the order it actually executed so a test can assert on it rather than
 * on a docstring. Independent cron schedules could interleave; one sequence
 * cannot.
 *
 * ## The sealing interlock
 *
 * Sealing has a hard cadence. A band's earliest day is 10 days old when the
 * band closes, against a 35-day retention, so there are 25 days of slack. Miss
 * it by more than `MAX_SEALING_GAP_DAYS` and bands close over days whose events
 * were already swept: those cohorts seal `indeterminate`, permanently, because
 * the evidence cannot be rebuilt. That is why the cadence assessment travels in
 * the response rather than living in a runbook — an operator reads the cron
 * output, not the document.
 *
 * No database, no clock, no environment. Everything arrives as an argument.
 */

import type { SponsoredProduct } from "./event-schema";
import {
  mergeLifecycle,
  rollupDaily,
  type DailyCounts,
  type LifecycleRow,
  type RollupEvent,
} from "./rollup";
import {
  assessCadence,
  sealCandidate,
  MAX_SEALING_GAP_DAYS,
  type CadenceHealth,
  type SealCandidate,
  type SealVerdict,
} from "./sealing";

export type PendingRollup = {
  sponsorId: string;
  hashSaltEpoch: string;
  /** Closed venue-local dates with attributed events and no stored row yet. */
  dates: readonly string[];
  /** Products instrumented for this sponsor across those dates. */
  coveredProducts: readonly SponsoredProduct[];
  expectedProducts?: readonly SponsoredProduct[];
  /** Workspaces that already acted before this window. */
  knownWorkspaces: ReadonlySet<string>;
  /** Eligible sponsored workspaces per date, taken from access, not from events. */
  eligibleByDate: Readonly<Record<string, number>>;
  events: readonly RollupEvent[];
  /** Lifecycle rows already stored for these workspaces, for advance-only merge. */
  storedLifecycle: ReadonlyMap<string, LifecycleRow>;
};

export type SweepResult = { deleted: number; cutoff: number; dryRun: boolean };

/**
 * Everything the run touches outside itself. Injected so the sequence is
 * provable against a fake, the same way `IngestDeps.insert` is.
 */
export type NightlyStore = {
  /** Retry `no-redemption` rows whose redemption has since landed. */
  repairUnattributed: () => Promise<number>;
  /** What is waiting to be rolled up, per sponsor and salt epoch. */
  pendingRollups: (nowMs: number) => Promise<readonly PendingRollup[]>;
  writeDaily: (rows: readonly DailyCounts[], dataThrough: number) => Promise<void>;
  writeLifecycle: (
    sponsorId: string,
    rows: readonly LifecycleRow[],
  ) => Promise<void>;
  /** Lifecycle rows whose day-30 band may now be judged. */
  sealCandidates: (nowMs: number) => Promise<readonly SealCandidate[]>;
  writeSealVerdicts: (verdicts: readonly SealVerdict[], sealedAtMs: number) => Promise<void>;
  lastSealedAt: () => Promise<number | null>;
  sweepExpiredEvents: (
    nowMs: number,
    options: { dryRun: boolean },
  ) => Promise<SweepResult>;
};

export type StepName = "repair" | "rollup" | "seal" | "sweep";

export type StepFailure = { step: StepName; error: string };

export type NightlyOutcome = {
  ok: boolean;
  dryRun: boolean;
  /** The steps that actually ran, in the order they ran. Asserted by tests. */
  order: StepName[];
  repaired: number | null;
  rollup: {
    sponsors: number;
    daysWritten: number;
    workspacesTouched: number;
    rejected: number;
  } | null;
  sealing: {
    sealed: number;
    indeterminate: number;
    cadence: CadenceHealth;
    maxGapDays: number;
  } | null;
  sweep: SweepResult | null;
  /** Present when the sweep was deliberately not run. */
  sweepSkipped: string | null;
  failure: StepFailure | null;
  /** One sentence an operator reads in the cron output. Null when healthy. */
  alert: string | null;
};

export type NightlyOptions = {
  now: number;
  todayLocalDate: string;
  dryRun?: boolean;
  timeZone?: string;
};

function failed(
  order: StepName[],
  step: StepName,
  error: unknown,
  partial: Partial<NightlyOutcome>,
  dryRun: boolean,
): NightlyOutcome {
  const message = error instanceof Error ? error.message : String(error);
  return {
    ok: false,
    dryRun,
    order,
    repaired: partial.repaired ?? null,
    rollup: partial.rollup ?? null,
    sealing: partial.sealing ?? null,
    sweep: null,
    sweepSkipped: `${step}-failed`,
    failure: { step, error: message },
    alert:
      `The ${step} step failed, so the retention sweep did not run. ` +
      `Events are held past retention until it succeeds, which is the safe direction. ` +
      `Fix the ${step} step before the sealing gap reaches ${MAX_SEALING_GAP_DAYS} days.`,
  };
}

/**
 * Run the four steps in order, and refuse to sweep if anything in front of the
 * sweep did not succeed.
 *
 * Holding events past retention is a recoverable fault: the rows are still
 * there and the next successful run deletes them. Sweeping unrolled-up days is
 * not recoverable at all. When those two are in tension the answer is always
 * the same, and it is encoded here rather than left to whoever is on call.
 */
export async function runNightlyMaintenance(
  store: NightlyStore,
  options: NightlyOptions,
): Promise<NightlyOutcome> {
  const dryRun = options.dryRun ?? false;
  const order: StepName[] = [];

  // 1 ── repair. Late-arriving attribution has to land before the rollup reads,
  // or an event that was unattributable last night is never counted at all.
  let repaired = 0;
  order.push("repair");
  try {
    repaired = await store.repairUnattributed();
  } catch (error) {
    return failed(order, "repair", error, {}, dryRun);
  }

  // 2 ── rollup. This is the step the sweep is waiting on.
  order.push("rollup");
  let rollupSummary: NonNullable<NightlyOutcome["rollup"]>;
  try {
    const pending = await store.pendingRollups(options.now);
    let daysWritten = 0;
    let workspacesTouched = 0;
    let rejected = 0;

    for (const batch of pending) {
      const result = rollupDaily({
        sponsorId: batch.sponsorId,
        hashSaltEpoch: batch.hashSaltEpoch,
        dates: batch.dates,
        events: batch.events,
        coveredProducts: batch.coveredProducts,
        expectedProducts: batch.expectedProducts,
        knownWorkspaces: batch.knownWorkspaces,
        eligibleByDate: batch.eligibleByDate,
      });

      // A null merge is a workspace that has acted only through kinds excluded
      // from first useful action (D-032 R10). It has no lifecycle row to write,
      // and dropping it here is what keeps the day-30 band measured from a real
      // start rather than from an unpublish.
      const merged = result.lifecycle
        .map((delta) =>
          mergeLifecycle(batch.storedLifecycle.get(delta.workspaceIdHash), delta),
        )
        .filter((row): row is LifecycleRow => row !== null);

      if (!dryRun) {
        await store.writeDaily(result.daily, options.now);
        await store.writeLifecycle(batch.sponsorId, merged);
      }
      daysWritten += result.daily.length;
      workspacesTouched += merged.length;
      rejected += result.rejected.length;
    }

    rollupSummary = {
      sponsors: pending.length,
      daysWritten,
      workspacesTouched,
      rejected,
    };
  } catch (error) {
    return failed(order, "rollup", error, { repaired }, dryRun);
  }

  // 3 ── seal. Bands can only be judged while their evidence is still inside
  // retention, which is the reason this runs before the sweep and not after.
  order.push("seal");
  let sealingSummary: NonNullable<NightlyOutcome["sealing"]>;
  let candidateCount = 0;
  try {
    const candidates = await store.sealCandidates(options.now);
    candidateCount = candidates.length;
    const lastSealedAtMs = await store.lastSealedAt();
    const cadence = assessCadence(
      lastSealedAtMs,
      options.now,
      candidates,
      options.todayLocalDate,
    );

    const verdicts: SealVerdict[] = [];
    for (const candidate of candidates) {
      const verdict = sealCandidate(
        candidate,
        options.now,
        options.todayLocalDate,
        options.timeZone,
      );
      if (verdict) verdicts.push(verdict);
    }
    if (!dryRun && verdicts.length > 0) {
      await store.writeSealVerdicts(verdicts, options.now);
    }

    sealingSummary = {
      sealed: verdicts.length,
      indeterminate: verdicts.filter((v) => v.state === "indeterminate").length,
      cadence,
      maxGapDays: MAX_SEALING_GAP_DAYS,
    };
  } catch (error) {
    return failed(order, "seal", error, { repaired, rollup: rollupSummary }, dryRun);
  }

  // 4 ── sweep. Only now, and only because the two steps above returned.
  order.push("sweep");
  let sweep: SweepResult;
  try {
    sweep = await store.sweepExpiredEvents(options.now, { dryRun });
  } catch (error) {
    return failed(
      order,
      "sweep",
      error,
      { repaired, rollup: rollupSummary, sealing: sealingSummary },
      dryRun,
    );
  }

  // A system that has never sealed and has nothing to seal is on day one, not
  // in breach. `assessCadence` reports an infinite gap in that case, which is
  // the right answer to the question it was asked; turning it into a nightly
  // 500 on an empty database would make this cron red from the day it is
  // scheduled until the first couple acts, and a cron that is always red is a
  // cron nobody reads. The alarm has to mean something on the night it fires,
  // because the thing it guards cannot be rebuilt.
  const dayOne =
    sealingSummary.cadence.gapDays < 0 &&
    candidateCount === 0 &&
    sealingSummary.sealed === 0;
  const cadenceBreached = !sealingSummary.cadence.ok && !dayOne;
  const alert = cadenceBreached ? sealingAlert(sealingSummary) : null;

  return {
    ok: !cadenceBreached,
    dryRun,
    order,
    repaired,
    rollup: rollupSummary,
    sealing: sealingSummary,
    sweep,
    sweepSkipped: null,
    failure: null,
    alert,
  };
}

/** The one sentence that has to reach a human before the evidence is gone. */
export function sealingAlert(
  sealing: NonNullable<NightlyOutcome["sealing"]>,
): string {
  const parts: string[] = [];
  if (sealing.cadence.gapDays < 0) {
    parts.push("Sealing has never run.");
  } else if (sealing.cadence.gapDays > sealing.maxGapDays) {
    parts.push(
      `Sealing last ran ${sealing.cadence.gapDays} days ago, past the ${sealing.maxGapDays}-day limit.`,
    );
  }
  if (sealing.cadence.atRisk > 0) {
    parts.push(
      `${sealing.cadence.atRisk} continuation band${sealing.cadence.atRisk === 1 ? "" : "s"} ` +
        "will seal indeterminate because the events covering them were already swept. " +
        "That cannot be rebuilt.",
    );
  }
  if (sealing.indeterminate > 0) {
    parts.push(
      `${sealing.indeterminate} band${sealing.indeterminate === 1 ? "" : "s"} sealed indeterminate in this run.`,
    );
  }
  parts.push(
    `Run the sealing job at least every ${sealing.maxGapDays} days. Raw events are deleted at 35.`,
  );
  return parts.join(" ");
}
