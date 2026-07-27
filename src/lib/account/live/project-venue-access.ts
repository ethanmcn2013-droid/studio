import type {
  AccessAttention,
  AccessCodeRow,
  AccessCodeState,
  AccountSnapshot,
  MetricValue,
} from "../types";
import { maskLicenseCode } from "./mask-code";

export const LIVE_ACCESS_DEFINITION = "account-metrics.v2";
export const LIVE_USAGE_UNAVAILABLE_REASON =
  "Sponsored-use instrumentation not yet available for this account";

/** Client-safe venue picker row (no server-only import). */
export type LiveVenueOption = {
  id: string;
  slug: string;
  name: string;
  paid: boolean;
  allotment: number | null;
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

function formatDay(ms: number | null | undefined): string {
  if (ms == null || !Number.isFinite(ms)) return "—";
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
 * Pure projection: real access + term from entitlements; behavioural metrics
 * stay unavailable. Safe to unit-test without a database.
 */
export function projectVenueAccessSnapshot(
  input: LiveVenueAccessInput,
): AccountSnapshot {
  const now = input.nowMs ?? Date.now();
  const { sponsor, codes } = input;
  const allotted = sponsor.codeAllotment ?? 0;
  const mintedCount = codes.length;
  const redeemedCount = codes.filter((c) => c.status === "redeemed").length;
  const availableCount = Math.max(0, allotted - sponsor.codesIssued);
  const drift = mintedCount !== sponsor.codesIssued;
  const { standing, standingLabel } = standingFor(input, now);

  const attention: AccessAttention[] = [];
  if (drift) {
    attention.push({
      id: "allotment-drift",
      label: "Allotment counter drift",
      detail: `Minted codes (${mintedCount}) differ from codes_issued (${sponsor.codesIssued}). Reconcile in Signal HQ Access.`,
    });
  }
  if (availableCount === 0 && allotted > 0) {
    attention.push({
      id: "no-remaining",
      label: "No remaining allotment headroom",
      detail:
        "Allotted codes are fully issued. Request more access for Signal Studio review — allotment does not change here.",
    });
  }

  // Copy wording only. A venue that records delivery gets an honest "not
  // delivered yet"; one that does not keeps the standing caveat.
  const deliveryTracked = codes.some((row) => row.deliveredAt != null);

  const codeRows: AccessCodeRow[] = codes
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 40)
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
      allotted: exact(allotted),
      available: exact(availableCount),
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
    },
    adoption: {
      allotted: exact(allotted),
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
        formats: ["pdf", "csv"],
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
    nextAction:
      availableCount > 0
        ? {
            id: "distribute-remaining",
            label: "Distribute remaining access",
            detail: `${availableCount} codes remain against allotment. Delivery still happens outside Account.`,
            target: "access",
          }
        : {
            id: "request-more",
            label: "Request more access for Signal Studio review",
            detail:
              "Allotment headroom is exhausted. Account can only record a request — HQ Access remains the control plane.",
            target: "access",
          },
    brandLines: {
      hero: "The benefit, in use.",
      usage: "Use, without surveillance.",
      privacy: "Aggregate use only. Private work is never included.",
    },
  };
}
