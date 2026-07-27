import "server-only";

import { eq } from "drizzle-orm";
import { entitlementsDb } from "@/lib/entitlements-db/client";
import {
  isPaidVenue,
  licenseCodes,
  sponsors,
} from "@/lib/entitlements-db/schema";
import { assertSnapshotPrivacy } from "../privacy";
import type { AccountSnapshot } from "../types";
import {
  projectVenueAccessSnapshot,
  type LiveVenueAccessInput,
  type LiveVenueOption,
} from "./project-venue-access";

export type { LiveVenueOption };

export type LoadVenueAccessResult =
  | { ok: true; snapshot: AccountSnapshot }
  | { ok: false; error: string };

export async function listLiveVenueOptions(): Promise<
  | { ok: true; venues: LiveVenueOption[] }
  | { ok: false; error: string }
> {
  try {
    const db = entitlementsDb();
    const rows = await db.select().from(sponsors).orderBy(sponsors.name);
    return {
      ok: true,
      venues: rows.map((s) => ({
        id: s.id,
        slug: s.slug,
        name: s.name,
        paid: isPaidVenue(s),
        allotment: s.codeAllotment,
      })),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "unreachable",
    };
  }
}

export async function loadVenueAccessSnapshot(
  slug: string,
): Promise<LoadVenueAccessResult> {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return { ok: false, error: "Missing venue slug." };

  try {
    const db = entitlementsDb();
    const [sponsor] = await db
      .select()
      .from(sponsors)
      .where(eq(sponsors.slug, normalized))
      .limit(1);

    if (!sponsor) {
      return { ok: false, error: `Venue not found: ${normalized}` };
    }

    const codeRows = await db
      .select({
        id: licenseCodes.id,
        code: licenseCodes.code,
        status: licenseCodes.status,
        createdAt: licenseCodes.createdAt,
        redeemedAt: licenseCodes.redeemedAt,
      })
      .from(licenseCodes)
      .where(eq(licenseCodes.sponsorId, sponsor.id));

    const input: LiveVenueAccessInput = {
      sponsor: {
        id: sponsor.id,
        slug: sponsor.slug,
        name: sponsor.name,
        venuePlan: sponsor.venuePlan,
        paid: isPaidVenue(sponsor),
        termStartsAt: sponsor.termStartsAt,
        termEndsAt: sponsor.termEndsAt,
        codeAllotment: sponsor.codeAllotment,
        codesIssued: sponsor.codesIssued,
      },
      codes: codeRows,
    };

    const snapshot = projectVenueAccessSnapshot(input);
    const privacyErrors = assertSnapshotPrivacy(snapshot);
    if (privacyErrors.length > 0) {
      return {
        ok: false,
        error: `Privacy projection failed: ${privacyErrors[0]}`,
      };
    }

    return { ok: true, snapshot };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "unreachable",
    };
  }
}
