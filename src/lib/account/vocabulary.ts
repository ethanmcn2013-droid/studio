/**
 * Customer-facing vocabulary for Signal Studio Account.
 * Internal control-plane wording stays in Signal HQ Access.
 */

export const ACCOUNT_VOCABULARY = {
  productName: "Signal Studio Account",
  companyName: "Signal Studio",
  controlPlane: "Signal HQ Access",
  navigation: ["Overview", "Access", "Usage", "Reports", "Account"] as const,
  brandLines: {
    hero: "The benefit, in use.",
    usage: "Use, without surveillance.",
    privacy: "Aggregate use only. Private work is never included.",
  },
  sampleIndicator: "Deterministic sample · not sponsor data",
  samplePageMark: "SAMPLE · DETERMINISTIC REVIEW DATA.",
} as const;

/** Internal or legacy wording → customer-facing Account wording */
export const VOCABULARY_MAP = {
  "Signal HQ": "Signal Studio",
  "Active and reconciled": "Account active",
  "Canonical code rows": "Access totals checked",
  "Partial coverage": "Reporting incomplete",
  "Suppression state": "Small-group privacy protection",
  "Metric dictionary": "How reporting works",
  "Venue settings": "Account",
  "Venue active days": "Days with sponsored use",
  "Venue Portal": "Signal Studio Account",
  Allotted: "Covered",
  licences: "access",
} as const;

/**
 * The metric labels the venue-facing Account surfaces render. One source.
 *
 * The retired label was a literal on six components, in the CSV and in the
 * printed report. D-020 sold this entitlement as every couple the venue books,
 * with no per-couple maths, and the retired word was that maths in a single
 * word: a quantity handed down and counted off. On an unlimited venue the tile
 * read "Unlimited" above it, contradicting itself on the same tile.
 *
 * "Covered" is true in all three states a venue can be in. Unlimited: every
 * couple the venue books is covered. Limited with a record: this many are
 * covered. No record at all: coverage is unavailable, and never zero.
 *
 * VOCABULARY_MAP above keeps the retired word as a key, so the mapping from
 * legacy wording to current wording stays readable.
 */
export const ACCOUNT_METRIC_LABELS = {
  covered: "Covered",
  available: "Available",
  issued: "Issued",
  redeemed: "Redeemed",
  firstUsefulAction: "First useful action",
  activeRecently: "Active recently",
  continuedAfter30Days: "Continued after 30 days",
} as const;

/**
 * The adoption journey in order, as [label, `AdoptionLifecycle` key].
 *
 * Four surfaces render exactly this list and each carried its own copy of it,
 * which is how one retired word survived in six places. The second element is
 * a field name on the snapshot contract, not copy, so it does not change.
 */
export const ADOPTION_JOURNEY = [
  [ACCOUNT_METRIC_LABELS.covered, "allotted"],
  [ACCOUNT_METRIC_LABELS.issued, "issued"],
  [ACCOUNT_METRIC_LABELS.redeemed, "redeemed"],
  [ACCOUNT_METRIC_LABELS.firstUsefulAction, "firstUsefulAction"],
  [ACCOUNT_METRIC_LABELS.activeRecently, "activeRecently"],
  [ACCOUNT_METRIC_LABELS.continuedAfter30Days, "continuedAfter30Days"],
] as const;

export const EDITION_VOCABULARY = {
  venue: {
    edition: "venue" as const,
    editionLabel: "Venue Edition",
    recipientNoun: "couple or client",
    recipientNounPlural: "couples or clients",
    defaultPeriodLabel: "Access term",
    privacyPosture: "Aggregate sponsored use",
  },
  education: {
    edition: "education" as const,
    editionLabel: "Education Edition",
    recipientNoun: "student",
    recipientNounPlural: "students",
    defaultPeriodLabel: "Academic year or programme term",
    privacyPosture: "Institution/programme aggregates only",
  },
  organisation: {
    edition: "organisation" as const,
    editionLabel: "Organisation Edition",
    recipientNoun: "person",
    recipientNounPlural: "people",
    defaultPeriodLabel: "Contract year",
    privacyPosture: "Organisation aggregates only",
  },
} as const;

export const DESIGN_CONCEPTS = [
  {
    id: "account-brief" as const,
    name: "Account Brief",
    thesis:
      "Editorial, calm and renewal-oriented. A clear verdict followed by a concise adoption story.",
    tests: "Executive confidence, narrative quality and report coherence.",
  },
  {
    id: "access-ledger" as const,
    name: "Access Ledger",
    thesis:
      "Compact, operational and information-dense. Distribution and lifecycle progression are prominent.",
    tests: "Repeat utility, scanning speed and access management.",
  },
  {
    id: "guided-review" as const,
    name: "Guided Review",
    thesis:
      "Next-action-first. One account verdict, one recommended action, then progressive detail.",
    tests: "Clarity, mobile experience and decision support.",
  },
] as const;
