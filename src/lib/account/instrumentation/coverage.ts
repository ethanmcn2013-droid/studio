/**
 * The coverage envelope — the ten fields that travel with every usage response.
 *
 * E09.01 §7: **no usage metric may render without this envelope.** The reason
 * is one sentence long. A number on its own is a claim about what happened. The
 * same number inside this envelope is a claim about what happened *and* about
 * how much of the period we were actually watching, and only the second one is
 * true. Missing is never zero.
 *
 * Two things this module adds that the counts alone cannot say:
 *
 * **Kind coverage, per product.** Signal has two allowlisted kinds and one call
 * site. A product-reach figure that treats Signal as covered understates Signal
 * by an unknown amount while looking complete. So the envelope reports Signal
 * as one of two kinds instrumented, and the absence shows as coverage rather
 * than as a zero. E09.01 §3.5, E09.02 §9.8.
 *
 * **Salt rotation.** `subjectIdHash` and `workspaceIdHash` are salted, so
 * rotating the salt intentionally breaks continuity: the same couple hashes to
 * a different value and counts before and after are not comparable. The ingest
 * layer stamps `hash_salt_epoch` on every row precisely so a rotation is
 * detectable, and nothing was reading it. A rotation inside a window is a
 * coverage break, never a fall in activity, and never a cliff on a chart.
 * E09.01 §3.8, E09.02 acceptance criterion 9.
 */

import {
  METRIC_DICTIONARY_VERSION,
  INSTRUMENTATION_VERSION,
  MEANINGFUL_ACTION_KINDS,
  wiredKindsFor,
  type SponsoredProduct,
} from "./event-schema";
import { ALL_PRODUCTS, PRODUCT_BITS } from "./rollup";
import { BEHAVIOURAL_MIN_WORKSPACES } from "./suppression";

/**
 * Products with at least one live call site.
 *
 * Declared, never inferred from event volume. A product that is instrumented
 * and quiet must read as instrumented and quiet; deriving this list from what
 * arrived would turn a quiet product into an uninstrumented one and lose the
 * only distinction the nullable per-product counters exist to keep.
 */
export const INSTRUMENTED_PRODUCTS: readonly SponsoredProduct[] = ALL_PRODUCTS.filter(
  (product) => wiredKindsFor(product).length > 0,
);

export type KindCoverage = {
  product: SponsoredProduct;
  kindsInstrumented: number;
  kindsAllowlisted: number;
  /** True only when every allowlisted kind for this product has a call site. */
  complete: boolean;
  /** Allowlisted kinds with no caller. Named so the gap is legible. */
  unwiredKinds: readonly string[];
};

export function kindCoverage(): KindCoverage[] {
  return ALL_PRODUCTS.map((product) => {
    const allowlisted = MEANINGFUL_ACTION_KINDS[product] as readonly string[];
    const wired = wiredKindsFor(product);
    return {
      product,
      kindsInstrumented: wired.length,
      kindsAllowlisted: allowlisted.length,
      complete: wired.length === allowlisted.length,
      unwiredKinds: allowlisted.filter((kind) => !wired.includes(kind)),
    };
  });
}

export type SaltRotation = {
  detected: boolean;
  /** Every distinct epoch seen in the window, oldest row order not implied. */
  epochs: readonly string[];
};

/**
 * Detect a rotation across a reporting window.
 *
 * More than one epoch in one window means two identity spaces were counted
 * together. Neither number is wrong on its own and the pair cannot be compared,
 * so the honest output is a break rather than a difference.
 */
export function detectSaltRotation(
  epochs: readonly (string | null | undefined)[],
): SaltRotation {
  const distinct = [...new Set(epochs.filter((e): e is string => Boolean(e)))].sort();
  return { detected: distinct.length > 1, epochs: distinct };
}

export type CoverageEnvelopeInput = {
  windowStart: string;
  windowEnd: string;
  /** Last venue-local date with a closed rollup. Null when nothing has closed. */
  dataThrough: string | null;
  coveredDays: number;
  expectedDays: number;
  /** Product bitmask actually covered / expected across the window's rows. */
  coveredMask: number;
  expectedMask: number;
  eligibleWorkspaces: number;
  /** One entry per stored daily row in the window. */
  saltEpochs: readonly (string | null | undefined)[];
  timeZone?: string;
};

export type SuppressionReason =
  | "small_group"
  | "incomplete_telemetry"
  | "not_instrumented"
  | "none";

/** The ten fields, named exactly as E09.01 §7 names them. */
export type CoverageEnvelope = {
  metric_dictionary_version: typeof METRIC_DICTIONARY_VERSION;
  instrumentation_version: typeof INSTRUMENTATION_VERSION;
  window_start: string;
  window_end: string;
  data_through: string | null;
  coverage_state: "complete" | "partial" | "suppressed" | "unavailable";
  covered_modules: readonly SponsoredProduct[];
  missing_modules: readonly SponsoredProduct[];
  covered_days: number;
  expected_days: number;
  suppression_reason: SuppressionReason;
  /** Beyond the ten. Signal's honest mask lives here. */
  kind_coverage: readonly KindCoverage[];
  /** Beyond the ten. A rotation inside the window, if there was one. */
  salt_rotation: SaltRotation;
  /** The zone the local dates were computed in. */
  timezone: string;
};

export function buildCoverageEnvelope(
  input: CoverageEnvelopeInput,
): CoverageEnvelope {
  const covered = ALL_PRODUCTS.filter(
    (p) => (input.coveredMask & PRODUCT_BITS[p]) !== 0,
  );
  const expected = ALL_PRODUCTS.filter(
    (p) => (input.expectedMask & PRODUCT_BITS[p]) !== 0,
  );
  const missing = expected.filter((p) => !covered.includes(p));
  const rotation = detectSaltRotation(input.saltEpochs);
  const kinds = kindCoverage();
  const partialKinds = kinds.some(
    (k) => covered.includes(k.product) && !k.complete,
  );

  let state: CoverageEnvelope["coverage_state"];
  let reason: SuppressionReason;

  if (input.coveredDays <= 0 || input.expectedDays <= 0) {
    state = "unavailable";
    reason = "not_instrumented";
  } else if (input.eligibleWorkspaces < BEHAVIOURAL_MIN_WORKSPACES) {
    // The small-group rule outranks everything. A number that would describe
    // fewer than three workspaces is not shown at any confidence.
    state = "suppressed";
    reason = "small_group";
  } else if (rotation.detected) {
    state = "partial";
    reason = "incomplete_telemetry";
  } else if (input.coveredDays < input.expectedDays) {
    state = "partial";
    reason = "incomplete_telemetry";
  } else if (missing.length > 0) {
    state = "partial";
    reason = "not_instrumented";
  } else if (partialKinds) {
    // Every product reported, but at least one reported through fewer kinds
    // than it allows. Complete would be a claim we cannot make.
    state = "partial";
    reason = "not_instrumented";
  } else {
    state = "complete";
    reason = "none";
  }

  return {
    metric_dictionary_version: METRIC_DICTIONARY_VERSION,
    instrumentation_version: INSTRUMENTATION_VERSION,
    window_start: input.windowStart,
    window_end: input.windowEnd,
    data_through: input.dataThrough,
    coverage_state: state,
    covered_modules: covered,
    missing_modules: missing,
    covered_days: input.coveredDays,
    expected_days: input.expectedDays,
    suppression_reason: reason,
    kind_coverage: kinds,
    salt_rotation: rotation,
    timezone: input.timeZone ?? "Europe/Dublin",
  };
}

/**
 * The one sentence a venue may be shown when a rotation broke the window.
 *
 * Never a number, never a comparison, never "usage is down". The venue is told
 * a measurement changed, which is true, rather than that their couples stopped,
 * which is not.
 */
export const SALT_ROTATION_NOTICE =
  "The way this period is measured changed part-way through, so these days are not compared with each other.";
