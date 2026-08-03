import { EDITION_VOCABULARY } from "./vocabulary";
import type {
  AccountSnapshot,
  CoverageState,
  MetricValue,
} from "./types";

const DEFINITION_VERSION = "account-metrics.v2";
const SAMPLE_LABEL = "SAMPLE · DETERMINISTIC REVIEW DATA." as const;

const exact = (value: number, denominator?: number): MetricValue =>
  denominator === undefined
    ? { state: "exact", value }
    : { state: "exact", value, denominator };

const lowerBound = (value: number, denominator?: number): MetricValue =>
  denominator === undefined
    ? { state: "lower_bound", value }
    : { state: "lower_bound", value, denominator };

const withheld: MetricValue = { state: "withheld", reason: "small_group" };

const unavailable = (reason: string): MetricValue => ({
  state: "unavailable",
  reason,
});

const venueBase = EDITION_VOCABULARY.venue;

const sharedBrand = {
  hero: "The benefit, in use.",
  usage: "Use, without surveillance.",
  privacy: "Aggregate use only. Private work is never included.",
} as const;

const sharedMembers = [
  {
    memberId: "m-owner",
    displayName: "Venue owner",
    role: "owner" as const,
    roleLabel: "Owner",
    status: "active" as const,
  },
  {
    memberId: "m-manager-1",
    displayName: "Venue manager",
    role: "manager" as const,
    roleLabel: "Manager",
    status: "active" as const,
  },
  {
    memberId: "m-manager-2",
    displayName: "Events manager",
    role: "manager" as const,
    roleLabel: "Manager",
    status: "active" as const,
  },
  {
    memberId: "m-viewer",
    displayName: "Finance viewer",
    role: "viewer" as const,
    roleLabel: "Viewer",
    status: "active" as const,
  },
];

const completeCodes = [
  {
    maskedCode: "GH-••••-21",
    state: "redeemed" as const,
    issuedOn: "2026-07-03",
    redeemedOn: "2026-07-05",
    expiresOn: null,
    note: "Activated through the venue welcome link.",
  },
  {
    maskedCode: "GH-••••-22",
    state: "issued" as const,
    issuedOn: "2026-07-03",
    redeemedOn: null,
    expiresOn: "2026-08-31",
    note: "Sent more than 14 days ago and not yet redeemed.",
  },
  {
    maskedCode: "GH-••••-23",
    state: "available" as const,
    issuedOn: null,
    redeemedOn: null,
    expiresOn: "2026-08-31",
    note: "Ready for an authorised account member to send.",
  },
  {
    maskedCode: "GH-••••-24",
    state: "available" as const,
    issuedOn: null,
    redeemedOn: null,
    expiresOn: "2026-08-31",
    note: "Ready for an authorised account member to send.",
  },
  {
    maskedCode: "GH-••••-08",
    state: "revoked" as const,
    issuedOn: "2026-06-14",
    redeemedOn: null,
    expiresOn: null,
    note: "Revoked by Signal HQ Access on 28 Jun.",
  },
];

/** Complete: full access, adoption, continuation, product reach, comparisons. */
export const VENUE_COMPLETE: AccountSnapshot = {
  snapshotId: "venue-complete-2026-07-24",
  definitionVersion: DEFINITION_VERSION,
  edition: "venue",
  sampleLabel: SAMPLE_LABEL,
  account: {
    accountId: "acct-glenmara-house",
    name: "Glenmara House",
    edition: venueBase.edition,
    editionLabel: venueBase.editionLabel,
    recipientNoun: venueBase.recipientNoun,
    recipientNounPlural: venueBase.recipientNounPlural,
  },
  term: {
    label: "2026/27 access term",
    start: "2026-04-01",
    end: "2027-03-31",
    renewalDate: "2027-03-31",
    standing: "account_active",
    standingLabel: "Account active",
  },
  coverage: {
    state: "complete",
    label: "Reporting complete",
    detail: "All four products. Data through 24 Jul 2026.",
    dataThrough: "2026-07-24",
    periodStart: "2026-06-25",
    periodEnd: "2026-07-24",
    periodLabel: "Last 30 days",
    definitionVersion: DEFINITION_VERSION,
    modulesCovered: 4,
    modulesExpected: 4,
    daysCovered: 30,
    daysExpected: 30,
  },
  access: {
    allotted: exact(40),
    available: exact(14),
    issued: exact(26),
    redeemed: exact(18),
    reconciliation: {
      state: "checked",
      label: "Access totals checked",
      detail: "Reconciled 24 Jul at 06:12 · no action needed",
    },
    codes: completeCodes,
    attention: [
      {
        id: "attn-unredeemed",
        label: "Sent more than 14 days ago and not yet redeemed",
        detail: "1 masked code awaits redemption.",
      },
    ],
  },
  adoption: {
    allotted: exact(40),
    issued: exact(26),
    redeemed: exact(18),
    firstUsefulAction: exact(15),
    activeRecently: exact(11),
    continuedAfter30Days: exact(9, 12),
    daysWithSponsoredUse: exact(21),
  },
  productReach: [
    {
      product: "Notes",
      workspacesReached: exact(8),
      supportingDetail: "Reached through committed note work",
    },
    {
      product: "Tasks",
      workspacesReached: exact(10),
      supportingDetail: "Reached through committed task work",
    },
    {
      product: "Timeline",
      workspacesReached: exact(6),
      supportingDetail: "Reached through curated timeline work",
    },
    {
      product: "Signal",
      workspacesReached: exact(5),
      supportingDetail: "Reached through deliberately opened briefings",
    },
  ],
  reports: [
    {
      reportId: "rpt-2026-07",
      title: "July 2026 account review",
      periodLabel: "July 2026",
      coverageState: "complete",
      coverageLabel: "Reporting complete",
      dataThrough: "2026-07-24",
      generatedOn: "2026-07-24",
      formats: ["pdf", "csv"],
      filenameStem: "glenmara-house-account-review-2026-07",
    },
    {
      reportId: "rpt-2026-06",
      title: "June 2026 account review",
      periodLabel: "June 2026",
      coverageState: "partial",
      coverageLabel: "Reporting incomplete",
      dataThrough: "2026-07-02",
      generatedOn: "2026-07-02",
      formats: ["pdf", "csv"],
      filenameStem: "glenmara-house-account-review-2026-06",
    },
  ],
  members: sharedMembers,
  privacyReceipt: {
    headline: "Prove the benefit without exposing the work.",
    body: "This account shows aggregate sponsored use only. Private work is never included.",
    postureLabel: venueBase.privacyPosture,
    withheldRule:
      "Behavioural values are withheld below three eligible sponsored workspaces.",
    neverIncludes: [
      "names or emails of recipients",
      "notes, task text, or comments",
      "Timeline content or attachments",
      "private membership lists",
      "raw identifiers",
    ],
  },
  nextAction: {
    id: "send-available",
    label: "Send an available access code",
    detail: "14 codes are ready. One issued code has waited more than 14 days.",
    target: "access",
  },
  brandLines: sharedBrand,
};

/** Partial: access exact; behavioural lower bounds; rates/comparisons withheld. */
export const VENUE_PARTIAL: AccountSnapshot = {
  ...VENUE_COMPLETE,
  snapshotId: "venue-partial-2026-07-24",
  coverage: {
    state: "partial",
    label: "Reporting incomplete",
    detail: "27 of 30 days. Signal was unavailable for 3 days.",
    dataThrough: "2026-07-24",
    periodStart: "2026-06-25",
    periodEnd: "2026-07-24",
    periodLabel: "Last 30 days",
    definitionVersion: DEFINITION_VERSION,
    modulesCovered: 3,
    modulesExpected: 4,
    daysCovered: 27,
    daysExpected: 30,
  },
  adoption: {
    allotted: exact(40),
    issued: exact(26),
    redeemed: exact(18),
    firstUsefulAction: lowerBound(13),
    activeRecently: lowerBound(9),
    continuedAfter30Days: withheld,
    daysWithSponsoredUse: lowerBound(18),
  },
  productReach: [
    {
      product: "Notes",
      workspacesReached: lowerBound(7),
      supportingDetail: "Lower bound while Signal coverage is incomplete",
    },
    {
      product: "Tasks",
      workspacesReached: lowerBound(9),
      supportingDetail: "Lower bound while Signal coverage is incomplete",
    },
    {
      product: "Timeline",
      workspacesReached: lowerBound(5),
      supportingDetail: "Lower bound while Signal coverage is incomplete",
    },
    {
      product: "Signal",
      workspacesReached: unavailable(
        "Signal module coverage missing for 3 days in this window",
      ),
      supportingDetail: "Module coverage incomplete",
    },
  ],
  nextAction: {
    id: "review-coverage",
    label: "Review reporting coverage before renewal",
    detail:
      "Access totals remain exact. Behavioural rates stay unavailable until coverage closes.",
    target: "reports",
  },
};

/**
 * Suppressed: fewer than three eligible workspaces.
 * Access counts stay coherent with a small redeemed population —
 * never a large redeemed total with a tiny eligible cohort.
 */
export const VENUE_SUPPRESSED: AccountSnapshot = {
  snapshotId: "venue-suppressed-2026-07-24",
  definitionVersion: DEFINITION_VERSION,
  edition: "venue",
  sampleLabel: SAMPLE_LABEL,
  account: {
    accountId: "acct-ashford-barn",
    name: "Ashford Barn",
    edition: venueBase.edition,
    editionLabel: venueBase.editionLabel,
    recipientNoun: venueBase.recipientNoun,
    recipientNounPlural: venueBase.recipientNounPlural,
  },
  term: {
    label: "2026/27 access term",
    start: "2026-05-01",
    end: "2027-04-30",
    renewalDate: "2027-04-30",
    standing: "account_active",
    standingLabel: "Account active",
  },
  coverage: {
    state: "suppressed",
    label: "Small-group privacy protection",
    detail:
      "Two eligible sponsored workspaces. Behavioural values are withheld.",
    dataThrough: "2026-07-24",
    periodStart: "2026-06-25",
    periodEnd: "2026-07-24",
    periodLabel: "Last 30 days",
    definitionVersion: DEFINITION_VERSION,
    modulesCovered: 4,
    modulesExpected: 4,
    daysCovered: 30,
    daysExpected: 30,
  },
  access: {
    allotted: exact(8),
    available: exact(4),
    issued: exact(4),
    redeemed: exact(2),
    reconciliation: {
      state: "checked",
      label: "Access totals checked",
      detail: "Reconciled 24 Jul at 06:12 · no action needed",
    },
    codes: [
      {
        maskedCode: "AB-••••-11",
        state: "redeemed",
        issuedOn: "2026-07-01",
        redeemedOn: "2026-07-02",
        expiresOn: null,
        note: "Activated through the venue welcome link.",
      },
      {
        maskedCode: "AB-••••-12",
        state: "redeemed",
        issuedOn: "2026-07-08",
        redeemedOn: "2026-07-10",
        expiresOn: null,
        note: "Activated through the venue welcome link.",
      },
      {
        maskedCode: "AB-••••-13",
        state: "issued",
        issuedOn: "2026-07-08",
        redeemedOn: null,
        expiresOn: "2026-09-30",
        note: "Sent more than 14 days ago and not yet redeemed.",
      },
      {
        maskedCode: "AB-••••-14",
        state: "available",
        issuedOn: null,
        redeemedOn: null,
        expiresOn: "2026-09-30",
        note: "Ready for an authorised account member to send.",
      },
      {
        maskedCode: "AB-••••-15",
        state: "available",
        issuedOn: null,
        redeemedOn: null,
        expiresOn: "2026-09-30",
        note: "Ready for an authorised account member to send.",
      },
    ],
    attention: [
      {
        id: "attn-unredeemed-small",
        label: "Sent more than 14 days ago and not yet redeemed",
        detail: "1 masked code awaits redemption.",
      },
    ],
  },
  adoption: {
    allotted: exact(8),
    issued: exact(4),
    redeemed: exact(2),
    firstUsefulAction: withheld,
    activeRecently: withheld,
    continuedAfter30Days: withheld,
    daysWithSponsoredUse: withheld,
  },
  productReach: [
    {
      product: "Notes",
      workspacesReached: withheld,
      supportingDetail: "Withheld under small-group privacy protection",
    },
    {
      product: "Tasks",
      workspacesReached: withheld,
      supportingDetail: "Withheld under small-group privacy protection",
    },
    {
      product: "Timeline",
      workspacesReached: withheld,
      supportingDetail: "Withheld under small-group privacy protection",
    },
    {
      product: "Signal",
      workspacesReached: withheld,
      supportingDetail: "Withheld under small-group privacy protection",
    },
  ],
  reports: [
    {
      reportId: "rpt-ashford-2026-07",
      title: "July 2026 account review",
      periodLabel: "July 2026",
      coverageState: "suppressed",
      coverageLabel: "Small-group privacy protection",
      dataThrough: "2026-07-24",
      generatedOn: "2026-07-24",
      formats: ["pdf", "csv"],
      filenameStem: "ashford-barn-account-review-2026-07",
    },
  ],
  members: sharedMembers.slice(0, 2),
  privacyReceipt: {
    headline: "Prove the benefit without exposing the work.",
    body: "Access totals remain visible. Behavioural use is withheld while fewer than three eligible sponsored workspaces exist.",
    postureLabel: venueBase.privacyPosture,
    withheldRule:
      "Behavioural values are withheld below three eligible sponsored workspaces.",
    neverIncludes: [
      "names or emails of recipients",
      "notes, task text, or comments",
      "Timeline content or attachments",
      "private membership lists",
      "raw identifiers",
    ],
  },
  nextAction: {
    id: "send-remaining",
    label: "Send the remaining available access",
    detail:
      "Four codes remain available. Behavioural reporting unlocks once three eligible workspaces exist.",
    target: "access",
  },
  brandLines: sharedBrand,
};

/** Unavailable: access visible; all behavioural reporting unavailable. */
export const VENUE_UNAVAILABLE: AccountSnapshot = {
  ...VENUE_COMPLETE,
  snapshotId: "venue-unavailable-2026-07-24",
  coverage: {
    state: "unavailable",
    label: "Reporting unavailable",
    detail:
      "No reliable sponsored-use coverage for this window. Access totals remain exact.",
    dataThrough: "2026-07-24",
    periodStart: "2026-06-25",
    periodEnd: "2026-07-24",
    periodLabel: "Last 30 days",
    definitionVersion: DEFINITION_VERSION,
    modulesCovered: 0,
    modulesExpected: 4,
  },
  adoption: {
    allotted: exact(40),
    issued: exact(26),
    redeemed: exact(18),
    firstUsefulAction: unavailable(
      "Sponsored-use instrumentation not yet available for this account",
    ),
    activeRecently: unavailable(
      "Sponsored-use instrumentation not yet available for this account",
    ),
    continuedAfter30Days: unavailable(
      "Sponsored-use instrumentation not yet available for this account",
    ),
    daysWithSponsoredUse: unavailable(
      "Sponsored-use instrumentation not yet available for this account",
    ),
  },
  productReach: [
    {
      product: "Notes",
      workspacesReached: unavailable(
        "Sponsored-use instrumentation not yet available for this account",
      ),
      supportingDetail: "Coverage unavailable",
    },
    {
      product: "Tasks",
      workspacesReached: unavailable(
        "Sponsored-use instrumentation not yet available for this account",
      ),
      supportingDetail: "Coverage unavailable",
    },
    {
      product: "Timeline",
      workspacesReached: unavailable(
        "Sponsored-use instrumentation not yet available for this account",
      ),
      supportingDetail: "Coverage unavailable",
    },
    {
      product: "Signal",
      workspacesReached: unavailable(
        "Sponsored-use instrumentation not yet available for this account",
      ),
      supportingDetail: "Coverage unavailable",
    },
  ],
  nextAction: {
    id: "confirm-access",
    label: "Confirm access distribution while reporting catches up",
    detail:
      "Access totals are exact. Behavioural evidence is unavailable for this window.",
    target: "access",
  },
};

const unlimited: MetricValue = { state: "unlimited" };

/**
 * Unlimited: the D-020 entitlement, which is what every founding venue is sold.
 *
 * Until this fixture existed, all four review samples carried an exact cap, so
 * no deterministic artefact anywhere exercised the branch a real founding venue
 * takes. The reviewable consequences are all here: no count in the two
 * headroom positions, an empty attention list, and a next action that is to
 * issue rather than to ask for more.
 */
export const VENUE_UNLIMITED: AccountSnapshot = {
  snapshotId: "venue-unlimited-2026-07-24",
  definitionVersion: DEFINITION_VERSION,
  edition: "venue",
  sampleLabel: SAMPLE_LABEL,
  account: {
    accountId: "acct-glenmara-house-unlimited",
    name: "Glenmara House",
    edition: venueBase.edition,
    editionLabel: venueBase.editionLabel,
    recipientNoun: venueBase.recipientNoun,
    recipientNounPlural: venueBase.recipientNounPlural,
  },
  term: {
    label: "Founding access term",
    start: "2026-04-01",
    end: "2027-09-30",
    renewalDate: "2027-09-30",
    standing: "account_active",
    standingLabel: "Account active",
  },
  coverage: {
    state: "complete",
    label: "Reporting complete",
    detail: "All four products. Data through 24 Jul 2026.",
    dataThrough: "2026-07-24",
    periodStart: "2026-06-25",
    periodEnd: "2026-07-24",
    periodLabel: "Last 30 days",
    definitionVersion: DEFINITION_VERSION,
    modulesCovered: 4,
    modulesExpected: 4,
    daysCovered: 30,
    daysExpected: 30,
  },
  access: {
    allotted: unlimited,
    available: unlimited,
    issued: exact(9),
    redeemed: exact(6),
    reconciliation: {
      state: "checked",
      label: "Access totals checked",
      detail: "Reconciled 24 Jul at 06:12 · no action needed",
    },
    codes: [
      {
        maskedCode: "GH-••••-41",
        state: "redeemed",
        issuedOn: "2026-07-02",
        redeemedOn: "2026-07-03",
        expiresOn: null,
        note: "Activated through the venue welcome link.",
      },
      {
        maskedCode: "GH-••••-42",
        state: "redeemed",
        issuedOn: "2026-07-06",
        redeemedOn: "2026-07-09",
        expiresOn: null,
        note: "Activated through the venue welcome link.",
      },
      {
        maskedCode: "GH-••••-43",
        state: "issued",
        issuedOn: "2026-07-18",
        redeemedOn: null,
        expiresOn: "2026-10-31",
        note: "Delivered · not yet redeemed",
      },
      {
        maskedCode: "GH-••••-44",
        state: "available",
        issuedOn: null,
        redeemedOn: null,
        expiresOn: "2026-10-31",
        note: "Ready for an authorised account member to send.",
      },
    ],
    // Nothing to warn about. A venue that was promised no per-couple maths
    // cannot be short of anything, so this list stays empty by construction.
    attention: [],
  },
  adoption: {
    allotted: unlimited,
    issued: exact(9),
    redeemed: exact(6),
    firstUsefulAction: exact(5),
    activeRecently: exact(4),
    continuedAfter30Days: exact(4, 6),
    daysWithSponsoredUse: exact(18),
  },
  productReach: [
    {
      product: "Notes",
      workspacesReached: exact(4),
      supportingDetail: "Reached through committed note work",
    },
    {
      product: "Tasks",
      workspacesReached: exact(5),
      supportingDetail: "Reached through committed task work",
    },
    {
      product: "Timeline",
      workspacesReached: exact(3),
      supportingDetail: "Reached through curated timeline work",
    },
    {
      product: "Signal",
      workspacesReached: exact(2),
      supportingDetail: "Reached through deliberately opened briefings",
    },
  ],
  reports: [
    {
      reportId: "rpt-unlimited-2026-07",
      title: "July 2026 account review",
      periodLabel: "July 2026",
      coverageState: "complete",
      coverageLabel: "Reporting complete",
      dataThrough: "2026-07-24",
      generatedOn: "2026-07-24",
      formats: ["pdf", "csv"],
      filenameStem: "glenmara-house-account-review-unlimited-2026-07",
    },
  ],
  members: sharedMembers,
  privacyReceipt: {
    headline: "Prove the benefit without exposing the work.",
    body: "This account shows aggregate sponsored use only. Private work is never included.",
    postureLabel: venueBase.privacyPosture,
    withheldRule:
      "Behavioural values are withheld below three eligible sponsored workspaces.",
    neverIncludes: [
      "names or emails of recipients",
      "notes, task text, or comments",
      "Timeline content or attachments",
      "private membership lists",
      "raw identifiers",
    ],
  },
  nextAction: {
    id: "issue-next",
    label: "Issue access for your next booked couple",
    detail:
      "Every couple who books with you is covered while your licence is current. Delivery still happens outside Account.",
    target: "access",
  },
  brandLines: sharedBrand,
};

/**
 * Unrecorded: a legacy venue still on the capped mode whose cap was never set.
 *
 * R-016's residual case. It is neither unlimited nor exhausted, and the whole
 * point of the fixture is that the two positions where a number would go read
 * as unavailable rather than as a zero. The reason string is the one the live
 * projection emits (`LIVE_ACCESS_UNRECORDED_REASON`), kept literal here so the
 * fixtures stay free-standing and clock-free.
 */
const UNRECORDED_REASON = "Signal HQ Access holds no issuing record for this venue";

export const VENUE_UNRECORDED: AccountSnapshot = {
  snapshotId: "venue-unrecorded-2026-07-24",
  definitionVersion: DEFINITION_VERSION,
  edition: "venue",
  sampleLabel: SAMPLE_LABEL,
  account: {
    accountId: "acct-rivermill-hall",
    name: "Rivermill Hall",
    edition: venueBase.edition,
    editionLabel: venueBase.editionLabel,
    recipientNoun: venueBase.recipientNoun,
    recipientNounPlural: venueBase.recipientNounPlural,
  },
  term: {
    label: "2026/27 access term",
    start: "2026-05-01",
    end: "2027-04-30",
    renewalDate: "2027-04-30",
    standing: "account_active",
    standingLabel: "Account active",
  },
  coverage: {
    state: "unavailable",
    label: "Reporting unavailable",
    detail:
      "No reliable sponsored-use coverage for this window. Issued and redeemed totals remain exact.",
    dataThrough: "2026-07-24",
    periodStart: "2026-06-25",
    periodEnd: "2026-07-24",
    periodLabel: "Last 30 days",
    definitionVersion: DEFINITION_VERSION,
    modulesCovered: 0,
    modulesExpected: 4,
  },
  access: {
    allotted: unavailable(UNRECORDED_REASON),
    available: unavailable(UNRECORDED_REASON),
    // What was issued and redeemed is still a fact about what happened.
    issued: exact(3),
    redeemed: exact(1),
    reconciliation: {
      state: "checked",
      label: "Access totals checked",
      detail: "Minted rows match the issued counter.",
    },
    codes: [
      {
        maskedCode: "RM-••••-01",
        state: "redeemed",
        issuedOn: "2026-06-11",
        redeemedOn: "2026-06-14",
        expiresOn: null,
        note: "Activated through the venue welcome link.",
      },
      {
        maskedCode: "RM-••••-02",
        state: "available",
        issuedOn: null,
        redeemedOn: null,
        expiresOn: null,
        note: "Minted · delivery not tracked in Account",
      },
      {
        maskedCode: "RM-••••-03",
        state: "available",
        issuedOn: null,
        redeemedOn: null,
        expiresOn: null,
        note: "Minted · delivery not tracked in Account",
      },
    ],
    attention: [
      {
        id: "access-record-missing",
        label: "No issuing record for this venue",
        detail:
          "Signal HQ Access has nothing recorded for this account, so Account cannot report what it may issue. Record it in Signal HQ Access.",
      },
    ],
  },
  adoption: {
    allotted: unavailable(UNRECORDED_REASON),
    issued: exact(3),
    redeemed: exact(1),
    firstUsefulAction: unavailable(
      "Sponsored-use instrumentation not yet available for this account",
    ),
    activeRecently: unavailable(
      "Sponsored-use instrumentation not yet available for this account",
    ),
    continuedAfter30Days: unavailable(
      "Sponsored-use instrumentation not yet available for this account",
    ),
    daysWithSponsoredUse: unavailable(
      "Sponsored-use instrumentation not yet available for this account",
    ),
  },
  productReach: [
    {
      product: "Notes",
      workspacesReached: unavailable("Coverage unavailable"),
      supportingDetail: "Coverage unavailable",
    },
    {
      product: "Tasks",
      workspacesReached: unavailable("Coverage unavailable"),
      supportingDetail: "Coverage unavailable",
    },
    {
      product: "Timeline",
      workspacesReached: unavailable("Coverage unavailable"),
      supportingDetail: "Coverage unavailable",
    },
    {
      product: "Signal",
      workspacesReached: unavailable("Coverage unavailable"),
      supportingDetail: "Coverage unavailable",
    },
  ],
  reports: [
    {
      reportId: "rpt-unrecorded-2026-07",
      title: "July 2026 account review",
      periodLabel: "July 2026",
      coverageState: "unavailable",
      coverageLabel: "Reporting unavailable",
      dataThrough: "2026-07-24",
      generatedOn: "2026-07-24",
      formats: ["pdf", "csv"],
      filenameStem: "rivermill-hall-account-review-2026-07",
    },
  ],
  members: sharedMembers.slice(0, 2),
  privacyReceipt: {
    headline: "Prove the benefit without exposing the work.",
    body: "Issued and redeemed totals remain visible. Everything Account cannot measure is shown as unavailable.",
    postureLabel: venueBase.privacyPosture,
    withheldRule:
      "A value Account does not hold is shown as unavailable. It is never shown as zero.",
    neverIncludes: [
      "names or emails of recipients",
      "notes, task text, or comments",
      "Timeline content or attachments",
      "private membership lists",
      "raw identifiers",
    ],
  },
  nextAction: {
    id: "confirm-access-record",
    label: "Confirm this account's access in Signal HQ Access",
    detail:
      "Signal HQ Access holds no issuing record for this venue, so Account has nothing to report here. Missing configuration is never shown as zero.",
    target: "access",
  },
  brandLines: sharedBrand,
};

export const VENUE_FIXTURES = {
  complete: VENUE_COMPLETE,
  partial: VENUE_PARTIAL,
  suppressed: VENUE_SUPPRESSED,
  unavailable: VENUE_UNAVAILABLE,
  unlimited: VENUE_UNLIMITED,
  unrecorded: VENUE_UNRECORDED,
} as const;

export type VenueFixtureKey = keyof typeof VENUE_FIXTURES;

export function getVenueFixture(key: VenueFixtureKey): AccountSnapshot {
  return VENUE_FIXTURES[key];
}

export function getVenueFixtureByCoverage(
  state: CoverageState,
): AccountSnapshot {
  return VENUE_FIXTURES[state];
}

/** Concise edition proofs — masthead + journey language only. */
export function getEditionProof(
  edition: "education" | "organisation",
): Pick<
  AccountSnapshot,
  | "edition"
  | "account"
  | "coverage"
  | "adoption"
  | "privacyReceipt"
  | "reports"
  | "brandLines"
  | "sampleLabel"
> {
  const vocab = EDITION_VOCABULARY[edition];
  const base = VENUE_COMPLETE;
  const name =
    edition === "education" ? "Riverside Conservatoire" : "Northline Partners";
  const stem =
    edition === "education"
      ? "riverside-conservatoire-account-review-2026"
      : "northline-partners-account-review-2026";

  return {
    edition,
    sampleLabel: SAMPLE_LABEL,
    account: {
      accountId: `acct-${edition}-proof`,
      name,
      edition: vocab.edition,
      editionLabel: vocab.editionLabel,
      recipientNoun: vocab.recipientNoun,
      recipientNounPlural: vocab.recipientNounPlural,
    },
    coverage: {
      ...base.coverage,
      periodLabel: vocab.defaultPeriodLabel,
    },
    adoption: base.adoption,
    privacyReceipt: {
      ...base.privacyReceipt,
      postureLabel: vocab.privacyPosture,
      body:
        edition === "education"
          ? "Institution and programme aggregates only. No student drill-down."
          : "Organisation aggregates only. Private work is never included.",
    },
    reports: [
      {
        reportId: `rpt-${edition}-proof`,
        title: `${vocab.defaultPeriodLabel} account review`,
        periodLabel: vocab.defaultPeriodLabel,
        coverageState: "complete",
        coverageLabel: "Reporting complete",
        dataThrough: "2026-07-24",
        generatedOn: "2026-07-24",
        formats: ["pdf", "csv"],
        filenameStem: stem,
      },
    ],
    brandLines: sharedBrand,
  };
}
