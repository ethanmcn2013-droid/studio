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
  licences: "access",
} as const;

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
