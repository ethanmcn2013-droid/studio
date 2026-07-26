import "server-only";

import { randomUUID } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { entitlementsDb } from "./client";
import {
  sponsors,
  sponsorRequests,
  type SponsorRequest,
  type SponsorRequestKind,
} from "./schema";

const NOTE_MAX = 280;

export type CreateSponsorRequestInput = {
  sponsorId: string;
  requestingMemberId: string;
  kind: SponsorRequestKind;
  requestedQuantity?: number | null;
  note: string;
};

export type CreateSponsorRequestResult =
  | { ok: true; request: SponsorRequest }
  | { ok: false; error: string };

/** Persist an Account request. Never mutates allotment or codes. */
export async function createSponsorRequest(
  input: CreateSponsorRequestInput,
): Promise<CreateSponsorRequestResult> {
  const note = input.note.trim().slice(0, NOTE_MAX);
  if (!note) return { ok: false, error: "A short note is required." };
  if (input.kind === "more_codes") {
    const qty = input.requestedQuantity ?? 0;
    if (!Number.isInteger(qty) || qty < 1 || qty > 200) {
      return { ok: false, error: "Requested quantity must be between 1 and 200." };
    }
  }

  try {
    const db = entitlementsDb();
    const [sponsor] = await db
      .select({ id: sponsors.id })
      .from(sponsors)
      .where(eq(sponsors.id, input.sponsorId))
      .limit(1);
    if (!sponsor) return { ok: false, error: "Venue not found." };

    const row = {
      id: `sreq_${randomUUID()}`,
      sponsorId: input.sponsorId,
      requestingMemberId: input.requestingMemberId,
      kind: input.kind,
      requestedQuantity:
        input.kind === "more_codes" ? (input.requestedQuantity ?? null) : null,
      note,
      state: "open" as const,
      operatorActorId: null,
      decisionReason: null,
      createdAt: Date.now(),
      decidedAt: null,
      fulfilledAt: null,
    };

    await db.insert(sponsorRequests).values(row);
    return { ok: true, request: row };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not record request.",
    };
  }
}

export async function listOpenSponsorRequests(limit = 50): Promise<
  | {
      ok: true;
      requests: Array<{
        id: string;
        sponsorId: string;
        sponsorName: string;
        sponsorSlug: string;
        kind: SponsorRequestKind;
        requestedQuantity: number | null;
        note: string;
        createdAt: number;
      }>;
    }
  | { ok: false; error: string }
> {
  try {
    const db = entitlementsDb();
    const rows = await db
      .select({
        id: sponsorRequests.id,
        sponsorId: sponsorRequests.sponsorId,
        sponsorName: sponsors.name,
        sponsorSlug: sponsors.slug,
        kind: sponsorRequests.kind,
        requestedQuantity: sponsorRequests.requestedQuantity,
        note: sponsorRequests.note,
        createdAt: sponsorRequests.createdAt,
      })
      .from(sponsorRequests)
      .innerJoin(sponsors, eq(sponsors.id, sponsorRequests.sponsorId))
      .where(eq(sponsorRequests.state, "open"))
      .orderBy(desc(sponsorRequests.createdAt))
      .limit(limit);

    return {
      ok: true,
      requests: rows.map((row) => ({
        ...row,
        kind: row.kind as SponsorRequestKind,
      })),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "unreachable",
    };
  }
}

export async function listSponsorRequestsForSponsor(
  sponsorId: string,
): Promise<{ ok: true; requests: SponsorRequest[] } | { ok: false; error: string }> {
  try {
    const db = entitlementsDb();
    const rows = await db
      .select()
      .from(sponsorRequests)
      .where(and(eq(sponsorRequests.sponsorId, sponsorId)))
      .orderBy(desc(sponsorRequests.createdAt))
      .limit(40);
    return { ok: true, requests: rows };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "unreachable",
    };
  }
}
