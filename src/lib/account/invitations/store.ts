import "server-only";

import { randomUUID, createHash } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { entitlementsDb } from "@/lib/entitlements-db/client";
import { appendEvent } from "@/lib/entitlements-db/audit";
import type { MutationActor } from "@/lib/entitlements-db/guard";
import {
  licenseCodes,
  sponsorActivations,
  sponsors,
  type EntitlementEventAction,
} from "@/lib/entitlements-db/schema";
import { maskLicenseCode } from "../live/mask-code";
import {
  canTransition,
  resolveInvitationState,
  transitionRule,
  type InvitationAction,
  type InvitationState,
  type ResolvedInvitation,
} from "./lifecycle";

/**
 * The invitation store — the only place that reads or writes
 * `sponsor_activations`.
 *
 * ## What was here before
 *
 * Nothing. `sponsor_activations` was defined in `schema.ts`, created by
 * `migrate-access.mjs`, exported from `index.ts` and then referenced by no
 * production code at all. This module is its first reader and its first
 * writer, which is why every function below states the shape it assumes
 * rather than trusting the table to already be sane.
 *
 * ## How the two tables are joined
 *
 * `sponsor_activations.entitlement_source_ref_hash` is documented in the
 * schema as "SHA-256 of a source reference. Never store a raw license code
 * here." That is the join key: `sha256(code)`. It lets an activation point at
 * exactly one code without the code ever being stored twice, so revoking the
 * ledger row and revoking the invitation cannot drift into two different
 * facts about the same couple.
 *
 * ## Two things this module deliberately does not do
 *
 * 1. **It never mints.** `mintLicenseCodes` lives in
 *    `entitlements-db/codes.ts`, outside this work package's column, and
 *    minting is an entitlement mutation with its own blast-radius envelope.
 *    So `createInvitation` pairs the next unpaired code the venue already
 *    holds; if it has none it refuses and says so, rather than inventing one.
 * 2. **It never sends.** Nothing here opens a mail transport. `mark_sent`
 *    records that a person handed a link over.
 *
 * ## The audit-verb gap, stated rather than papered over
 *
 * `ENTITLEMENT_EVENT_ACTIONS` in `schema.ts` has no `invitation_created`,
 * `invitation_sent` or `invitation_replaced` verb, and `schema.ts` is outside
 * this package's column so the enum cannot be extended here. Every write
 * below therefore records the nearest true existing verb AND the exact
 * invitation verb in `reason` and `after_json`, so a reader of the ledger can
 * always recover what happened. The mapping is one constant, immediately
 * below, so the compromise is visible in one place instead of scattered
 * across seven call sites. Extending the enum is a returned boundary request.
 */
const AUDIT_VERB: Record<InvitationAction, EntitlementEventAction> = {
  // A new issuable invitation came into existence against a minted code.
  create: "mint",
  // The venue granted the benefit to a couple. No entitlement row is written,
  // which is what distinguishes this from writes.ts's grant: entitlement_id
  // is null and sponsor_id is set.
  mark_sent: "grant",
  resend: "grant",
  // Bytes left the server: a plaintext code was shown to a person.
  reveal_link: "export",
  revoke: "revoke",
  replace: "revoke",
  expire: "expire",
  // Only ever written by reconciliation from the code ledger.
  accept: "redeem",
  decline: "revoke",
};

/** Opaque, non-PII placeholder owner for an invitation nobody has opened. */
function pendingSubjectId(invitationId: string): string {
  return `pending:${invitationId}`;
}

export function codeRefHash(code: string): string {
  return createHash("sha256")
    .update(code.trim().toUpperCase(), "utf8")
    .digest("hex");
}

/**
 * One invitation as the surface sees it.
 *
 * `maskedCode` is the only form of the code that may travel: `privacy.ts`
 * rejects any snapshot carrying an unmasked one. The plaintext is returned
 * exactly once, by `revealInvitationLink`, and is never stored on this shape.
 */
export type InvitationRow = {
  invitationId: string | null;
  codeId: string;
  maskedCode: string;
  resolved: ResolvedInvitation;
  createdAt: number;
  expiresAt: number | null;
};

export type InvitationPage = {
  rows: InvitationRow[];
  /** Every invitation this venue has, not just this page. */
  total: number;
  pageIndex: number;
  pageSize: number;
  /** Rows matching the search, before paging. Equals total when no search. */
  matched: number;
};

export type ListInvitationsInput = {
  sponsorId: string;
  /** Matches the masked form only. See `matchesSearch`. */
  search?: string;
  state?: InvitationState | "all";
  pageIndex?: number;
  pageSize?: number;
  nowMs?: number;
};

export const INVITATION_PAGE_SIZE = 40;

/**
 * Search matches the MASKED code, never the plaintext.
 *
 * A venue has no other handle on an invitation: the payload carries no couple
 * name, no email and no identifier, by privacy contract. So the masked form is
 * not a degraded search key, it is the only one that exists, and the surface
 * says so. Matching plaintext would turn this box into an oracle that confirms
 * whether a guessed code is real.
 */
function matchesSearch(row: InvitationRow, needle: string): boolean {
  const q = needle.trim().toLowerCase();
  if (!q) return true;
  const alnum = q.replace(/[^a-z0-9]/g, "");
  const masked = row.maskedCode.toLowerCase();
  return (
    masked.includes(q) ||
    (alnum.length > 0 && masked.replace(/[^a-z0-9]/g, "").includes(alnum)) ||
    row.resolved.state.replace("_", " ").includes(q)
  );
}

/**
 * Read every code the venue holds, pair each with its activation row if one
 * exists, resolve the invitation state from both, then filter and page.
 *
 * Filtering and paging happen after resolution and over the full set, which is
 * the point: `project-venue-access.ts` used to `.slice(0, 40)` before anything
 * else, so a venue with 60 codes had 20 of them silently disappear while the
 * toolbar said "40 masked rows".
 */
export async function listInvitations(
  input: ListInvitationsInput,
): Promise<
  { ok: true; page: InvitationPage } | { ok: false; error: string }
> {
  const now = input.nowMs ?? Date.now();
  const pageSize = Math.max(1, input.pageSize ?? INVITATION_PAGE_SIZE);
  const pageIndex = Math.max(0, input.pageIndex ?? 0);

  try {
    const db = entitlementsDb();

    const codes = await db
      .select({
        id: licenseCodes.id,
        code: licenseCodes.code,
        status: licenseCodes.status,
        createdAt: licenseCodes.createdAt,
        redeemedAt: licenseCodes.redeemedAt,
        deliveredAt: licenseCodes.deliveredAt,
        expiresAt: licenseCodes.expiresAt,
      })
      .from(licenseCodes)
      .where(eq(licenseCodes.sponsorId, input.sponsorId));

    const activations = await db
      .select({
        id: sponsorActivations.id,
        refHash: sponsorActivations.entitlementSourceRefHash,
        invitationState: sponsorActivations.invitationState,
        invitationSentAt: sponsorActivations.invitationSentAt,
        invitationAcceptedAt: sponsorActivations.invitationAcceptedAt,
        invitationDeclinedAt: sponsorActivations.invitationDeclinedAt,
        revokedAt: sponsorActivations.revokedAt,
      })
      .from(sponsorActivations)
      .where(eq(sponsorActivations.sponsorId, input.sponsorId));

    const byHash = new Map(
      activations.filter((a) => a.refHash).map((a) => [a.refHash as string, a]),
    );

    const all: InvitationRow[] = codes
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((code) => {
        const activation = byHash.get(codeRefHash(code.code));
        return {
          invitationId: activation?.id ?? null,
          codeId: code.id,
          maskedCode: maskLicenseCode(code.code),
          createdAt: code.createdAt,
          expiresAt: code.expiresAt ?? null,
          resolved: resolveInvitationState({
            recorded: activation
              ? {
                  state: activation.invitationState,
                  sentAt: activation.invitationSentAt,
                  acceptedAt: activation.invitationAcceptedAt,
                  declinedAt: activation.invitationDeclinedAt,
                  revokedAt: activation.revokedAt,
                }
              : null,
            ledger: {
              codeStatus: code.status,
              redeemedAt: code.redeemedAt,
              deliveredAt: code.deliveredAt,
              expiresAt: code.expiresAt,
            },
            nowMs: now,
          }),
        };
      });

    const stateFiltered =
      !input.state || input.state === "all"
        ? all
        : all.filter((row) => row.resolved.state === input.state);
    const searched = input.search
      ? stateFiltered.filter((row) => matchesSearch(row, input.search as string))
      : stateFiltered;

    const start = pageIndex * pageSize;
    return {
      ok: true,
      page: {
        rows: searched.slice(start, start + pageSize),
        total: all.length,
        matched: searched.length,
        pageIndex,
        pageSize,
      },
    };
  } catch (error) {
    // The driver's message is the full SELECT, which for `sponsors` carries
    // the contact_email column name. Log it, return a fixed string.
    console.warn("[invitations listInvitations] failed:", error);
    return { ok: false, error: "Invitations could not be read." };
  }
}

export type InvitationMutationResult =
  | { ok: true; state: InvitationState | null; invitationId: string; detail: string }
  | { ok: false; error: string };

export type ApplyInvitationActionInput = {
  sponsorId: string;
  /** Which code the invitation is against. The join key, not the invitation id. */
  codeId: string;
  action: InvitationAction;
  actor: MutationActor;
  /** Required for destructive actions, checked against the rule's word. */
  confirm?: string;
  reason?: string;
  nowMs?: number;
};

/**
 * Apply one venue action to one invitation.
 *
 * Fails closed at four gates, in order, before anything is written:
 *   1. the action must be a venue action, not a system one;
 *   2. the code must belong to THIS sponsor (the caller supplies a sponsor id
 *      and a code id; neither is trusted to agree with the other);
 *   3. destructive actions must carry the exact confirm word, checked here on
 *      the server, the way `hq/entitlements/actions.ts:163` checks its own —
 *      the UI friction is a second layer, never the gate;
 *   4. the transition must be legal from the state resolved from both tables.
 *
 * The state write and its audit row share one transaction, so a state change
 * can never commit without its signed line.
 */
export async function applyInvitationAction(
  input: ApplyInvitationActionInput,
): Promise<InvitationMutationResult> {
  const now = input.nowMs ?? Date.now();
  const rule = transitionRule(input.action);

  if (rule.actor !== "venue") {
    return {
      ok: false,
      error:
        "This state is set by a couple's own redemption. It is never set by hand.",
    };
  }

  if (rule.confirmWord && input.confirm !== rule.confirmWord) {
    return {
      ok: false,
      error: `Type ${rule.confirmWord} to confirm this action.`,
    };
  }

  try {
    const db = entitlementsDb();

    const [code] = await db
      .select({
        id: licenseCodes.id,
        code: licenseCodes.code,
        sponsorId: licenseCodes.sponsorId,
        status: licenseCodes.status,
        redeemedAt: licenseCodes.redeemedAt,
        deliveredAt: licenseCodes.deliveredAt,
        expiresAt: licenseCodes.expiresAt,
      })
      .from(licenseCodes)
      .where(
        and(
          eq(licenseCodes.id, input.codeId),
          eq(licenseCodes.sponsorId, input.sponsorId),
        ),
      )
      .limit(1);

    // Cross-tenant refusal. The AND above is the whole check: a code id that
    // belongs to another venue simply does not come back.
    if (!code) {
      return { ok: false, error: "That invitation does not belong to this account." };
    }

    const refHash = codeRefHash(code.code);
    const [activation] = await db
      .select()
      .from(sponsorActivations)
      .where(
        and(
          eq(sponsorActivations.sponsorId, input.sponsorId),
          eq(sponsorActivations.entitlementSourceRefHash, refHash),
        ),
      )
      .limit(1);

    const resolved = resolveInvitationState({
      recorded: activation
        ? {
            state: activation.invitationState,
            sentAt: activation.invitationSentAt,
            acceptedAt: activation.invitationAcceptedAt,
            declinedAt: activation.invitationDeclinedAt,
            revokedAt: activation.revokedAt,
          }
        : null,
      ledger: {
        codeStatus: code.status,
        redeemedAt: code.redeemedAt,
        deliveredAt: code.deliveredAt,
        expiresAt: code.expiresAt,
      },
      nowMs: now,
    });

    const verdict = canTransition(resolved.state, input.action, "venue");
    if (!verdict.allowed) return { ok: false, error: verdict.reason };

    const nextState = rule.to;
    const invitationId = activation?.id ?? `sact_${randomUUID()}`;

    await db.transaction(async (tx) => {
      if (!activation) {
        // The first action on a code that had no activation row creates one
        // already in its resulting state. `revokedAt` and the activation's own
        // `state` must be set on THIS path too: withdrawing an invitation that
        // had never been marked sent takes the insert branch, and leaving them
        // unset wrote a row saying revoked with no revocation time on it.
        const revoked = nextState === "revoked";
        await tx.insert(sponsorActivations).values({
          id: invitationId,
          sponsorId: input.sponsorId,
          entitlementId: null,
          entitlementSource: "venue_edition",
          entitlementSourceRefHash: refHash,
          ownerSubjectId: pendingSubjectId(invitationId),
          state: revoked ? "revoked" : "pending",
          invitationState: nextState ?? "not_sent",
          invitationSentAt: sentStampFor(input.action, now, null),
          revokedAt: revoked ? now : null,
          createdAt: now,
          updatedAt: now,
        });
      } else if (nextState) {
        await tx
          .update(sponsorActivations)
          .set({
            invitationState: nextState,
            invitationSentAt: sentStampFor(
              input.action,
              now,
              activation.invitationSentAt,
            ),
            revokedAt:
              nextState === "revoked" ? now : activation.revokedAt ?? null,
            state: nextState === "revoked" ? "revoked" : activation.state,
            updatedAt: now,
          })
          .where(eq(sponsorActivations.id, invitationId));
      }

      await appendEvent(tx, {
        action: AUDIT_VERB[input.action],
        sponsorId: input.sponsorId,
        actorId: input.actor.actorId,
        actorName: input.actor.actorName,
        // The exact verb, so the enum compromise above is always recoverable.
        reason: input.reason
          ? `invitation.${input.action}: ${input.reason}`
          : `invitation.${input.action}`,
        before: { invitationState: resolved.state, source: resolved.source },
        after: {
          kind: `invitation.${input.action}`,
          invitationId,
          // Masked. The plaintext code never enters the ledger.
          maskedCode: maskLicenseCode(code.code),
          invitationState: nextState ?? resolved.state,
        },
        origin: "hq-account-review",
      });
    });

    return {
      ok: true,
      state: nextState,
      invitationId,
      detail: detailFor(input.action),
    };
  } catch (error) {
    console.warn("[invitations applyInvitationAction] failed:", error);
    return { ok: false, error: "That change could not be recorded." };
  }
}

function sentStampFor(
  action: InvitationAction,
  now: number,
  existing: number | null,
): number | null {
  if (action === "mark_sent" || action === "resend") return now;
  return existing;
}

function detailFor(action: InvitationAction): string {
  switch (action) {
    case "mark_sent":
      return "Recorded as sent. Signal Studio sent nothing; this is your note that you passed it on.";
    case "resend":
      return "Recorded as sent again. The link is unchanged.";
    case "revoke":
      return "Withdrawn. This link no longer works.";
    case "expire":
      return "Closed off. This link no longer works.";
    case "replace":
      return "Withdrawn. Create a fresh invitation for the same couple.";
    default:
      return "Recorded.";
  }
}

/**
 * Show a plaintext link once, and write the fact down.
 *
 * The plaintext code is read here, on the server, and returned to exactly one
 * caller. It is never put on the snapshot: `privacy.ts` rejects any snapshot
 * carrying an unmasked code, and the Access panel's old fixture-mode row
 * action built `?code=${row.maskedCode}` — a masked code inside a redeem URL,
 * which cannot redeem. This function is the correct replacement for it.
 *
 * Audited as `export`, because that is what it is: bytes that identify a
 * grant left the server at a named operator's request.
 */
export async function revealInvitationLink(input: {
  sponsorId: string;
  codeId: string;
  actor: MutationActor;
}): Promise<{ ok: true; code: string; venueName: string } | { ok: false; error: string }> {
  try {
    const db = entitlementsDb();
    const [row] = await db
      .select({
        code: licenseCodes.code,
        status: licenseCodes.status,
        venueName: sponsors.name,
      })
      .from(licenseCodes)
      .innerJoin(sponsors, eq(sponsors.id, licenseCodes.sponsorId))
      .where(
        and(
          eq(licenseCodes.id, input.codeId),
          eq(licenseCodes.sponsorId, input.sponsorId),
        ),
      )
      .limit(1);

    if (!row) {
      return { ok: false, error: "That invitation does not belong to this account." };
    }
    if (row.status === "revoked") {
      return { ok: false, error: "This invitation was withdrawn. Its link no longer works." };
    }

    await db.transaction(async (tx) => {
      await appendEvent(tx, {
        action: AUDIT_VERB.reveal_link,
        sponsorId: input.sponsorId,
        actorId: input.actor.actorId,
        actorName: input.actor.actorName,
        reason: "invitation.reveal_link",
        after: {
          kind: "invitation.reveal_link",
          maskedCode: maskLicenseCode(row.code),
        },
        origin: "hq-account-review",
      });
    });

    return { ok: true, code: row.code, venueName: row.venueName };
  } catch (error) {
    console.warn("[invitations revealInvitationLink] failed:", error);
    return { ok: false, error: "That link could not be shown." };
  }
}

/**
 * Create an invitation by pairing the venue's oldest unpaired code with a new
 * activation row.
 *
 * It does not mint. If the venue holds no unpaired code it refuses and names
 * the reason, which is the honest answer: Signal HQ Access is the only place
 * codes come into existence, and inventing one here would put the mint's
 * blast-radius envelope (`entitlements-db/guard.ts`) behind a review surface.
 */
export async function createInvitation(input: {
  sponsorId: string;
  actor: MutationActor;
  nowMs?: number;
}): Promise<InvitationMutationResult> {
  const now = input.nowMs ?? Date.now();
  try {
    const db = entitlementsDb();

    const codes = await db
      .select({
        id: licenseCodes.id,
        code: licenseCodes.code,
        status: licenseCodes.status,
        createdAt: licenseCodes.createdAt,
      })
      .from(licenseCodes)
      .where(eq(licenseCodes.sponsorId, input.sponsorId));

    const paired = new Set(
      (
        await db
          .select({ refHash: sponsorActivations.entitlementSourceRefHash })
          .from(sponsorActivations)
          .where(eq(sponsorActivations.sponsorId, input.sponsorId))
      )
        .map((row) => row.refHash)
        .filter((hash): hash is string => Boolean(hash)),
    );

    const candidate = codes
      .filter((row) => row.status === "minted")
      .filter((row) => !paired.has(codeRefHash(row.code)))
      .sort((a, b) => a.createdAt - b.createdAt)[0];

    if (!candidate) {
      return {
        ok: false,
        error:
          "This account has no unused access to invite a couple with. Signal HQ Access is the only place new access is created.",
      };
    }

    const invitationId = `sact_${randomUUID()}`;
    const refHash = codeRefHash(candidate.code);

    await db.transaction(async (tx) => {
      await tx.insert(sponsorActivations).values({
        id: invitationId,
        sponsorId: input.sponsorId,
        entitlementId: null,
        entitlementSource: "venue_edition",
        entitlementSourceRefHash: refHash,
        ownerSubjectId: pendingSubjectId(invitationId),
        state: "pending",
        invitationState: "not_sent",
        createdAt: now,
        updatedAt: now,
      });
      await appendEvent(tx, {
        action: AUDIT_VERB.create,
        sponsorId: input.sponsorId,
        actorId: input.actor.actorId,
        actorName: input.actor.actorName,
        reason: "invitation.create",
        after: {
          kind: "invitation.create",
          invitationId,
          maskedCode: maskLicenseCode(candidate.code),
          invitationState: "not_sent",
        },
        origin: "hq-account-review",
      });
    });

    return {
      ok: true,
      state: "not_sent",
      invitationId,
      detail: "Invitation ready. Nothing goes to the couple until you pass it on.",
    };
  } catch (error) {
    console.warn("[invitations createInvitation] failed:", error);
    return { ok: false, error: "That invitation could not be recorded." };
  }
}
