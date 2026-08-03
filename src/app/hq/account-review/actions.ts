"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSponsorRequest } from "@/lib/entitlements-db/requests";
import {
  loadVenueAccessSnapshot,
  resolveSponsorIdForSlug,
} from "@/lib/account/live/load-venue-access";
import {
  applyInvitationAction,
  createInvitation,
  listInvitations,
  revealInvitationLink,
  type InvitationPage,
} from "@/lib/account/invitations/store";
import {
  invitationEmail,
  welcomeCardHtml,
  welcomeCardText,
  welcomeLinkFor,
} from "@/lib/account/invitations/copy";
import type { InvitationAction, InvitationState } from "@/lib/account/invitations/lifecycle";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { resolveHqOperatorActor } from "@/lib/hq/operator-identity";
import type { MutationActor } from "@/lib/entitlements-db/guard";
import type { AccountSnapshot } from "@/lib/account/types";

async function requireHqAccountReview(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access?from=/hq/account-review");
}

/**
 * Every invitation mutation runs through here, and it fails closed.
 *
 * `resolveHqOperatorActor` throws when no named operator is configured, the
 * way `lib/hq/operator-identity.ts:40-50` intends: the ledger is theatre if a
 * mutation can be recorded against nobody. The pre-existing
 * `recordMoreAccessRequestAction` swallows that throw and falls back to a
 * literal "hq-account-preview" actor. That is deliberately NOT repeated here:
 * a request for review is a note, while withdrawing a couple's access is a
 * change, and a change with no name against it is worse than a refused one.
 */
async function requireNamedOperator(): Promise<
  { ok: true; actor: MutationActor } | { ok: false; error: string }
> {
  try {
    return { ok: true, actor: await resolveHqOperatorActor() };
  } catch {
    return {
      ok: false,
      error:
        "No named operator is set for this session, so this change cannot be recorded against anyone. Set the operator before changing an invitation.",
    };
  }
}

/**
 * Resolve the slug the caller asked for into a sponsor id, on the server.
 *
 * The caller never supplies a sponsor id to a mutating action. The existing
 * `recordMoreAccessRequestAction` takes one straight off the client, which
 * means the id it writes against is whatever the caller sent. Every action
 * below takes a slug instead and looks the id up here, so a caller cannot
 * name one venue on screen and mutate another.
 */
async function sponsorIdFor(
  slug: string,
): Promise<{ ok: true; sponsorId: string } | { ok: false; error: string }> {
  const resolved = await resolveSponsorIdForSlug(slug);
  if (!resolved.ok) return resolved;
  return { ok: true, sponsorId: resolved.sponsorId };
}

export type LoadLiveSnapshotResult =
  | { ok: true; snapshot: AccountSnapshot }
  | { ok: false; error: string };

export async function loadLiveVenueSnapshotAction(
  slug: string,
): Promise<LoadLiveSnapshotResult> {
  await requireHqAccountReview();
  return loadVenueAccessSnapshot(slug);
}

// ── Invitation administration (E07.08, E07.09) ──────────────────────────

export type ListInvitationsResult =
  | { ok: true; page: InvitationPage }
  | { ok: false; error: string };

/**
 * Read a page of invitations.
 *
 * Search and state filtering run over the venue's whole set on the server,
 * before paging. That is the fix for the truncation defect: the panel used to
 * filter the 40 rows it had been handed and report the result as the total.
 */
export async function listInvitationsAction(input: {
  slug: string;
  search?: string;
  state?: InvitationState | "all";
  pageIndex?: number;
}): Promise<ListInvitationsResult> {
  await requireHqAccountReview();
  const sponsor = await sponsorIdFor(input.slug);
  if (!sponsor.ok) return sponsor;
  return listInvitations({
    sponsorId: sponsor.sponsorId,
    search: input.search,
    state: input.state,
    pageIndex: input.pageIndex,
  });
}

export type InvitationActionResult =
  | { ok: true; state: InvitationState | null; detail: string }
  | { ok: false; error: string };

/**
 * Take one lifecycle action on one invitation.
 *
 * `confirm` carries the type-to-confirm word for destructive actions. It is
 * checked in `store.ts` on the server, exactly as
 * `hq/entitlements/actions.ts:163` checks its own. The dialog on the surface
 * is a second layer; removing it from the DOM changes nothing.
 *
 * No action here sends a message. `mark_sent` and `resend` record that a
 * person handed a link over.
 */
export async function invitationActionAction(input: {
  slug: string;
  codeId: string;
  action: InvitationAction;
  confirm?: string;
  reason?: string;
}): Promise<InvitationActionResult> {
  await requireHqAccountReview();
  const operator = await requireNamedOperator();
  if (!operator.ok) return operator;
  const sponsor = await sponsorIdFor(input.slug);
  if (!sponsor.ok) return sponsor;

  const result = await applyInvitationAction({
    sponsorId: sponsor.sponsorId,
    codeId: input.codeId,
    action: input.action,
    actor: operator.actor,
    confirm: input.confirm,
    reason: input.reason,
  });
  if (!result.ok) return result;
  return { ok: true, state: result.state, detail: result.detail };
}

export async function createInvitationAction(input: {
  slug: string;
}): Promise<InvitationActionResult> {
  await requireHqAccountReview();
  const operator = await requireNamedOperator();
  if (!operator.ok) return operator;
  const sponsor = await sponsorIdFor(input.slug);
  if (!sponsor.ok) return sponsor;

  const result = await createInvitation({
    sponsorId: sponsor.sponsorId,
    actor: operator.actor,
  });
  if (!result.ok) return result;
  return { ok: true, state: result.state, detail: result.detail };
}

export type InvitationKit = {
  link: string;
  emailSubject: string;
  emailBody: string;
  cardText: string;
  cardHtml: string;
};

export type RevealInvitationResult =
  | { ok: true; kit: InvitationKit }
  | { ok: false; error: string };

/**
 * Produce the distribution kit for one invitation (E07.10).
 *
 * This is the only path on which a plaintext code exists outside the
 * database. It is read here, composed into the wording immediately, and
 * returned once. It never enters an `AccountSnapshot`, which `privacy.ts`
 * would reject, and it is written to the audit ledger as an export because
 * that is what it is.
 */
export async function revealInvitationKitAction(input: {
  slug: string;
  codeId: string;
}): Promise<RevealInvitationResult> {
  await requireHqAccountReview();
  const operator = await requireNamedOperator();
  if (!operator.ok) return operator;
  const sponsor = await sponsorIdFor(input.slug);
  if (!sponsor.ok) return sponsor;

  const revealed = await revealInvitationLink({
    sponsorId: sponsor.sponsorId,
    codeId: input.codeId,
    actor: operator.actor,
  });
  if (!revealed.ok) return revealed;

  const copyInput = { venueName: revealed.venueName, code: revealed.code };
  const email = invitationEmail(copyInput);
  return {
    ok: true,
    kit: {
      link: welcomeLinkFor(revealed.code),
      emailSubject: email.subject,
      emailBody: email.body,
      cardText: welcomeCardText(copyInput),
      cardHtml: welcomeCardHtml(copyInput),
    },
  };
}

// ── Existing: record a request for Signal HQ Access review ──────────────

export type RecordAccessRequestResult =
  | { ok: true; requestId: string }
  | { ok: false; error: string };

export async function recordMoreAccessRequestAction(input: {
  sponsorId: string;
  quantity: number;
  note: string;
}): Promise<RecordAccessRequestResult> {
  await requireHqAccountReview();
  let requestingMemberId = "hq-account-preview";
  try {
    const actor = await resolveHqOperatorActor();
    requestingMemberId = actor.actorId;
  } catch {
    // Preview may run without a named operator cookie; still record the request.
  }
  const result = await createSponsorRequest({
    sponsorId: input.sponsorId,
    requestingMemberId,
    kind: "more_codes",
    requestedQuantity: input.quantity,
    note: input.note,
  });
  if (!result.ok) return result;
  return { ok: true, requestId: result.request.id };
}
