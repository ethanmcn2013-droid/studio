import type {
  AccessAttention,
  AccessCodeRow,
  AccessCodeState,
  AccountSnapshot,
  MetricValue,
} from "../types";
import { maskLicenseCode } from "./mask-code";
import { isUnlimitedSponsor, remainingAllotment } from "@/lib/venue-allotment";

export const LIVE_ACCESS_DEFINITION = "account-metrics.v2";
export const LIVE_USAGE_UNAVAILABLE_REASON =
  "Sponsored-use instrumentation not yet available for this account";

/**
 * R-016, legacy branch. A sponsor still on `limited` whose `code_allotment` was
 * never set has no issuing record at all. `remainingAllotment` returns null for
 * exactly this case so it is never rendered as a number, and this projection
 * must agree with it: a missing record is not a count of zero, and a venue that
 * has never been configured must not be told it has run out.
 */
export const LIVE_ACCESS_UNRECORDED_REASON =
  "Signal HQ Access holds no issuing record for this venue";

/** Rows the snapshot carries. Anything beyond it is declared, not dropped. */
export const LIVE_ACCESS_SNAPSHOT_ROWS = 40;

/**
 * Client-safe venue picker row (no server-only import).
 *
 * There is no `name` field, and that is the point. Finding F-2: the picker
 * rendered every live venue by name on a surface used for screen shares, and
 * `consent_public_naming` is `unknown` for all 219 accounts. The component
 * never receives a name, so it cannot render one by accident.
 */
export type LiveVenueOption = {
  id: string;
  slug: string;
  /** Non-identifying. Founding place where assigned, otherwise an opaque id. */
  displayLabel: string;
  paid: boolean;
  allotment: number | null;
  /** R-016. 'unlimited' means `allotment` carries no meaning for this venue. */
  allotmentMode?: string | null;
};

export type LiveVenueCodeRow = {
  id: string;
  code: string;
  status: "minted" | "redeemed" | "revoked" | string;
  createdAt: number;
  redeemedAt: number | null;
  /** Null when delivery was never recorded, which is not a claim it did not
   *  happen. Absent columns keep every row on its pre-delivery state. */
  deliveredAt?: number | null;
  expiresAt?: number | null;
};

export type LiveVenueAccessInput = {
  sponsor: {
    id: string;
    slug: string;
    name: string;
    venuePlan: string;
    paid: boolean;
    termStartsAt: number | null;
    termEndsAt: number | null;
    codeAllotment: number | null;
    /** R-016. 'unlimited' suppresses every headroom count and warning. */
    allotmentMode?: string | null;
    codesIssued: number;
  };
  codes: LiveVenueCodeRow[];
  nowMs?: number;
};

function exact(value: number): MetricValue {
  return { state: "exact", value };
}

function unavailable(reason: string): MetricValue {
  return { state: "unavailable", reason };
}

const UNLIMITED: MetricValue = { state: "unlimited" };

function formatDay(ms: number | null | undefined): string {
  // "Not recorded", not a dash. A dash reads as a value the surface chose not
  // to print; the honest answer is that nothing was ever recorded. It also
  // keeps the em dash off a venue-facing string.
  if (ms == null || !Number.isFinite(ms)) return "Not recorded";
  return new Date(ms).toISOString().slice(0, 10);
}

/**
 * The row-state ladder: revoked > redeemed > expired > issued > available.
 *
 * Ledger facts outrank the clock. A redeemed code past its date reads as
 * redeemed, not expired: the entitlement it produced carries its own expiry and
 * is a different object from the code.
 *
 * Both delivery columns are nullable and un-backfilled, so a venue with no
 * delivery data lands on exactly the states it landed on before they existed.
 */
function mapCodeState(
  status: string,
  deliveredAt: number | null | undefined,
  expiresAt: number | null | undefined,
  now: number,
): AccessCodeState {
  if (status === "revoked") return "revoked";
  if (status === "redeemed") return "redeemed";
  if (expiresAt != null && expiresAt <= now) return "expired";
  if (deliveredAt != null) return "issued";
  return "available";
}

/**
 * The mint date has always been shown under "Issued" for redeemed and revoked
 * rows. That fudge is kept exactly where it already ships and is deliberately
 * not extended: a delivered row shows its real delivery date, and an expired
 * row shows nothing rather than a mint date dressed as a send date.
 */
function issuedOnFor(state: AccessCodeState, row: LiveVenueCodeRow): string | null {
  if (state === "issued") return formatDay(row.deliveredAt as number);
  if (state === "redeemed" || state === "revoked") {
    return formatDay(row.deliveredAt ?? row.createdAt);
  }
  return null;
}

function noteFor(state: AccessCodeState, deliveryTracked: boolean): string {
  switch (state) {
    case "redeemed":
      return "Redeemed";
    case "revoked":
      return "Revoked";
    case "expired":
      return "Expired before redemption";
    case "issued":
      return "Delivered · not yet redeemed";
    default:
      return deliveryTracked
        ? "Minted · not delivered yet"
        : "Minted · delivery not tracked in Account";
  }
}

function standingFor(input: LiveVenueAccessInput, now: number): {
  standing: AccountSnapshot["term"]["standing"];
  standingLabel: string;
} {
  const { sponsor } = input;
  if (sponsor.termEndsAt != null && sponsor.termEndsAt < now) {
    return { standing: "ended", standingLabel: "Term ended" };
  }
  if (!sponsor.paid && sponsor.venuePlan === "none") {
    return { standing: "attention", standingLabel: "Needs attention" };
  }
  if (sponsor.paid || sponsor.venuePlan === "pilot") {
    return { standing: "account_active", standingLabel: "Account active" };
  }
  return { standing: "attention", standingLabel: "Needs attention" };
}

/**
 * An unlimited venue must never be told its headroom is exhausted, and must
 * never be pointed at a "request more codes" flow — there is nothing to
 * request. Issuing a code for the next booked couple is the whole action.
 */
function nextActionFor(input: {
  unlimited: boolean;
  availableCount: number | null;
}): AccountSnapshot["nextAction"] {
  if (input.unlimited) {
    return {
      id: "issue-next",
      label: "Issue access for your next booked couple",
      detail:
        "Every couple who books with you is covered while your licence is current. Delivery still happens outside Account.",
      target: "access",
    };
  }
  // Nothing recorded. Account cannot say what this venue may issue, and must
  // not fill the gap with a number or with an instruction that assumes one.
  if (input.availableCount === null) {
    return {
      id: "confirm-access-record",
      label: "Confirm this account's access in Signal HQ Access",
      detail:
        "Signal HQ Access holds no issuing record for this venue, so Account has nothing to report here. Missing configuration is never shown as zero.",
      target: "access",
    };
  }
  if (input.availableCount > 0) {
    return {
      id: "distribute-remaining",
      label: "Distribute remaining access",
      detail: `This account's record covers ${input.availableCount} more invitations. Delivery still happens outside Account.`,
      target: "access",
    };
  }
  // A limited venue whose issuance really is used up still needs a useful
  // answer. The constraint is the wording, not the fact: say what has
  // happened and what the venue can do, without the retired vocabulary and
  // without an em dash.
  return {
    id: "request-more",
    label: "Request more access for Signal Studio review",
    detail:
      "Every invitation on this account's record has been issued. Account can only record a request. Signal HQ Access remains the control plane.",
    target: "access",
  };
}

/**
 * Pure projection: real access + term from entitlements; behavioural metrics
 * stay unavailable. Safe to unit-test without a database.
 */
export function projectVenueAccessSnapshot(
  input: LiveVenueAccessInput,
): AccountSnapshot {
  const now = input.nowMs ?? Date.now();
  const { sponsor, codes } = input;
  const unlimited = isUnlimitedSponsor(sponsor);
  // Null in either sense — unlimited, or no cap recorded — never becomes a
  // number here. `remainingAllotment` is the one definition of that rule.
  const allotted = unlimited ? null : sponsor.codeAllotment ?? null;
  const mintedCount = codes.length;
  const redeemedCount = codes.filter((c) => c.status === "redeemed").length;
  const availableCount = remainingAllotment(sponsor);
  const drift = mintedCount !== sponsor.codesIssued;
  const { standing, standingLabel } = standingFor(input, now);

  // R-016. A venue on the ratified entitlement was sold "no seats, no
  // per-couple maths" (D-020). Every headroom number and every headroom
  // warning below is therefore suppressed for them — not zeroed. Showing a
  // seat count to a venue that was promised there are none is the specific
  // contradiction this branch exists to remove.
  //
  // The legacy limited venue with nothing recorded takes the third road:
  // unavailable. It is neither a count nor an entitlement, and saying so is
  // the only honest answer available.
  const allottedMetric = unlimited
    ? UNLIMITED
    : allotted === null
      ? unavailable(LIVE_ACCESS_UNRECORDED_REASON)
      : exact(allotted);
  const availableMetric = unlimited
    ? UNLIMITED
    : availableCount === null
      ? unavailable(LIVE_ACCESS_UNRECORDED_REASON)
      : exact(availableCount);

  const attention: AccessAttention[] = [];
  if (drift) {
    attention.push({
      id: "allotment-drift",
      label: "Issuing counter drift",
      detail: `Minted codes (${mintedCount}) differ from codes_issued (${sponsor.codesIssued}). Reconcile in Signal HQ Access.`,
    });
  }
  if (!unlimited && allotted === null) {
    attention.push({
      id: "access-record-missing",
      label: "No issuing record for this venue",
      detail:
        "Signal HQ Access has nothing recorded for this account, so Account cannot report what it may issue. Record it in Signal HQ Access.",
    });
  }
  if (!unlimited && availableCount === 0 && allotted !== null && allotted > 0) {
    attention.push({
      id: "no-remaining",
      label: "Nothing left to issue on this record",
      detail:
        "Every invitation on this account's record has been issued. Request more access for Signal Studio review. Nothing changes here until Signal HQ Access acts.",
    });
  }

  // Copy wording only. A venue that records delivery gets an honest "not
  // delivered yet"; one that does not keeps the standing caveat.
  const deliveryTracked = codes.some((row) => row.deliveredAt != null);

  // The snapshot carries a bounded window so a venue with thousands of codes
  // cannot blow the payload. What changed is that the window is now DECLARED:
  // `access.page` states the true total and whether rows were left out, so the
  // surface can say "40 of 96" instead of reporting 40 as the whole account.
  // The Access table's own paging and search run server-side through
  // `lib/account/invitations/store.ts`, over the full set.
  const codeRows: AccessCodeRow[] = codes
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, LIVE_ACCESS_SNAPSHOT_ROWS)
    .map((row) => {
      const state = mapCodeState(row.status, row.deliveredAt, row.expiresAt, now);
      return {
        maskedCode: maskLicenseCode(row.code),
        state,
        issuedOn: issuedOnFor(state, row),
        redeemedOn: row.redeemedAt ? formatDay(row.redeemedAt) : null,
        expiresOn: row.expiresAt != null ? formatDay(row.expiresAt) : null,
        note: noteFor(state, deliveryTracked),
      };
    });

  const termStart = formatDay(sponsor.termStartsAt);
  const termEnd = formatDay(sponsor.termEndsAt);
  const dataThrough = formatDay(now);
  const periodStart = formatDay(now - 30 * 24 * 60 * 60 * 1000);

  return {
    snapshotId: `live-venue-${sponsor.slug}-${dataThrough}`,
    definitionVersion: LIVE_ACCESS_DEFINITION,
    edition: "venue",
    sampleLabel: "LIVE ACCESS PREVIEW · USAGE UNAVAILABLE.",
    account: {
      accountId: `venue:${sponsor.slug}`,
      name: sponsor.name,
      edition: "venue",
      editionLabel: "Venue Edition",
      recipientNoun: "couple or client",
      recipientNounPlural: "couples or clients",
    },
    term: {
      label: "Access term",
      start: termStart,
      end: termEnd,
      renewalDate: termEnd,
      standing,
      standingLabel,
    },
    coverage: {
      state: "unavailable",
      label: "Reporting unavailable",
      detail:
        "Access totals are live from Signal HQ Access. Sponsored-use coverage is not instrumented yet.",
      dataThrough,
      periodStart,
      periodEnd: dataThrough,
      periodLabel: "Last 30 days",
      definitionVersion: LIVE_ACCESS_DEFINITION,
      modulesCovered: 0,
      modulesExpected: 4,
    },
    access: {
      allotted: allottedMetric,
      available: availableMetric,
      issued: exact(sponsor.codesIssued),
      redeemed: exact(redeemedCount),
      reconciliation: drift
        ? {
            state: "attention",
            label: "Reconciliation attention",
            detail: "codes_issued does not match minted license rows.",
          }
        : {
            state: "checked",
            label: "Reconciliation checked",
            detail: "Minted rows match the codes_issued counter.",
          },
      codes: codeRows,
      attention,
      page: {
        shown: codeRows.length,
        total: mintedCount,
        truncated: mintedCount > codeRows.length,
      },
    },
    adoption: {
      allotted: allottedMetric,
      issued: exact(sponsor.codesIssued),
      redeemed: exact(redeemedCount),
      firstUsefulAction: unavailable(LIVE_USAGE_UNAVAILABLE_REASON),
      activeRecently: unavailable(LIVE_USAGE_UNAVAILABLE_REASON),
      continuedAfter30Days: unavailable(LIVE_USAGE_UNAVAILABLE_REASON),
      daysWithSponsoredUse: unavailable(LIVE_USAGE_UNAVAILABLE_REASON),
    },
    productReach: (
      ["Notes", "Tasks", "Timeline", "Signal"] as const
    ).map((product) => ({
      product,
      workspacesReached: unavailable(LIVE_USAGE_UNAVAILABLE_REASON),
      supportingDetail: "Coverage unavailable",
    })),
    reports: [
      {
        reportId: `live-access-${sponsor.slug}`,
        title: `${sponsor.name} · access preview`,
        periodLabel: "Access term",
        coverageState: "unavailable",
        coverageLabel: "Usage unavailable · access exact",
        dataThrough,
        generatedOn: dataThrough,
        // CSV only, deliberately. The live download route refuses `pdf`
        // (there is no print engine at runtime), so advertising it here
        // offered a format the server will not serve.
        formats: ["csv"],
        filenameStem: `${sponsor.slug}-access-preview`,
      },
    ],
    members: [],
    privacyReceipt: {
      headline: "Prove the benefit without exposing the work.",
      body: "This live preview shows aggregate access totals and masked codes only. Private work is never included.",
      postureLabel: "Aggregate sponsored use",
      withheldRule:
        "Behavioural values stay unavailable until sponsored-use instrumentation ships. They are never shown as zero.",
      neverIncludes: [
        "Recipient identities",
        "Emails or Clerk ids",
        "Note, task, or Timeline content",
        "Comments and attachments",
        "Plaintext license codes",
      ],
    },
    nextAction: nextActionFor({ unlimited, availableCount }),
    brandLines: {
      hero: "The benefit, in use.",
      usage: "Use, without surveillance.",
      privacy: "Aggregate use only. Private work is never included.",
    },
  };
}
