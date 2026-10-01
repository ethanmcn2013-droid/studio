"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSponsorRequest } from "@/lib/entitlements-db/requests";
import { loadVenueUsageSnapshot as loadVenueAccessSnapshot } from "@/lib/account/live/load-venue-usage";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { resolveHqOperatorActor } from "@/lib/hq/operator-identity";
import type { AccountSnapshot } from "@/lib/account/types";

async function requireHqAccountReview(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access?from=/hq/account-review");
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
