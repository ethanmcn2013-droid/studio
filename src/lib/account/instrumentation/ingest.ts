import { createHash } from "node:crypto";

import { attributeAction, type RedemptionLink } from "./attribution";
import { hashIdentity } from "./emitter";
import { validateMeaningfulAction } from "./event-schema";
import { DEFAULT_ACCOUNT_TIME_ZONE, toLocalDate } from "./local-date";

/**
 * Ingest for `venue-meaningful-action.v1`.
 *
 * Attribution runs through `redemptions -> license_codes -> sponsors`, and
 * deliberately not through `sponsor_activations.owner_subject_id`: that column
 * holds an opaque *suite* subject id, a different identity space from the
 * Clerk id the products actually carry, with nothing in the schema mapping one
 * to the other. Joining on it would match nothing and report the silence as low
 * adoption.
 *
 * The consequence binds every product call site: the `subjectId` handed to the
 * emitter must be the Clerk user id. It is the only value that closes the join.
 */

/** Events carry a salted hash; `redemptions.user_clerk_id` is raw. Hash at read
 *  time rather than storing a derived identity column that goes stale the
 *  moment the salt rotates. */
export function saltEpoch(salt: string): string {
  return createHash("sha256")
    .update(`venue-usage-salt:${salt}`)
    .digest("hex")
    .slice(0, 8);
}

export type RawRedemptionRow = {
  userClerkId: string;
  sponsorId: string;
  redeemedAt: number;
  endedAt?: number | null;
  origin?: RedemptionLink["origin"];
};

export function toRedemptionLinks(
  rows: readonly RawRedemptionRow[],
  salt: string,
): RedemptionLink[] {
  return rows.map((row) => ({
    subjectIdHash: hashIdentity(row.userClerkId, salt),
    sponsorId: row.sponsorId,
    redeemedAt: row.redeemedAt,
    endedAt: row.endedAt ?? null,
    origin: row.origin ?? "production",
  }));
}

export type IngestOutcome =
  | { stored: true; attribution: "attributed" | "unattributed"; sponsorId: string | null }
  | { stored: false; reason: string };

export type IngestDeps = {
  /** Injected so the whole path is testable against an in-memory database. */
  insert: (row: {
    eventId: string;
    instrumentationVersion: string;
    product: string;
    kind: string;
    occurredAt: number;
    subjectIdHash: string;
    workspaceIdHash: string;
    sponsorId: string | null;
    attributionState: "attributed" | "unattributed";
    attributionReason: string | null;
    hashSaltEpoch: string;
    localDate: string;
  }) => Promise<void>;
  links: readonly RedemptionLink[];
  salt: string | null;
  timeZone?: string;
};

/**
 * Validate, attribute, and store one event.
 *
 * A missing salt stores nothing at all rather than filling the unattributed
 * bucket. Events that are only unattributable because of a configuration fault
 * would otherwise read downstream as a venue whose recipients stopped working,
 * which is the opposite of the truth. A salt gap is a coverage break.
 */
export async function ingestMeaningfulAction(
  candidate: unknown,
  deps: IngestDeps,
): Promise<IngestOutcome> {
  const checked = validateMeaningfulAction(candidate);
  if (!checked.ok) return { stored: false, reason: checked.reason };
  if (!deps.salt) return { stored: false, reason: "salt-unavailable" };

  const event = checked.event;
  const attribution = attributeAction(
    { subjectIdHash: event.subjectIdHash, occurredAt: event.occurredAt },
    deps.links,
  );

  const attributed = attribution.attributed;
  await deps.insert({
    eventId: event.eventId,
    instrumentationVersion: event.instrumentationVersion,
    product: event.product,
    kind: event.kind,
    occurredAt: event.occurredAt,
    subjectIdHash: event.subjectIdHash,
    workspaceIdHash: event.workspaceIdHash,
    sponsorId: attributed ? attribution.sponsorId : null,
    attributionState: attributed ? "attributed" : "unattributed",
    attributionReason: attributed ? null : attribution.reason,
    hashSaltEpoch: saltEpoch(deps.salt),
    localDate: toLocalDate(event.occurredAt, deps.timeZone ?? DEFAULT_ACCOUNT_TIME_ZONE),
  });

  return {
    stored: true,
    attribution: attributed ? "attributed" : "unattributed",
    sponsorId: attributed ? attribution.sponsorId : null,
  };
}
