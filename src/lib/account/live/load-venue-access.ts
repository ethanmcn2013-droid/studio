import "server-only";

import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { entitlementsDb } from "@/lib/entitlements-db/client";
import {
  isPaidVenue,
  licenseCodes,
  sponsors,
} from "@/lib/entitlements-db/schema";
import { assertSnapshotPrivacy } from "../privacy";
import type { AccountSnapshot } from "../types";
import { LIVE_ACCESS_CODE_COLUMNS } from "./code-columns";
import {
  projectVenueAccessSnapshot,
  type LiveVenueAccessInput,
  type LiveVenueOption,
} from "./project-venue-access";

export type { LiveVenueOption };

export type LoadVenueAccessResult =
  | { ok: true; snapshot: AccountSnapshot }
  | { ok: false; error: string };

/**
 * The venue picker's rows.
 *
 * `name` is deliberately NOT returned. Finding F-2 in
 * `evidence/E11.09-10-discovery-and-demo.md`: the picker listed every live
 * venue by name, so a prospect watching a screen share saw the other founding
 * venues. `consent_public_naming` is `unknown` for all 219 accounts, so there
 * is no venue whose name may be shown to a third party.
 *
 * `displayLabel` is the non-identifying substitute: the founding place where
 * one has been assigned, otherwise an opaque short id. The slug is not used
 * either, because slugs are derived from names and read as them.
 */
export async function listLiveVenueOptions(): Promise<
  | { ok: true; venues: LiveVenueOption[] }
  | { ok: false; error: string }
> {
  try {
    const db = entitlementsDb();
    // An explicit column list, not `select()`. Two reasons, both real:
    // `contact_email` and `brand_meta` must never enter a process that builds
    // an Account payload, and a `select()` over every column fails outright
    // whenever the deployed database is a migration behind the schema, which
    // takes the whole surface dark for a column nothing here reads.
    //
    // The narrowed list was not enough on its own, and this is the correction.
    // It still named `founding_number`, which E02.13 added to the schema and
    // which the second pass of the terms migration never landed on
    // `entitlements-prod` — verified by direct query on 2026-08-03, against an
    // operator todo that had already been marked done. So the surface was dark
    // for exactly the reason the comment above says it was written to prevent.
    // The mitigation is now implemented rather than described: the optional
    // columns are attempted, and a failure degrades them to null instead of
    // taking the venue list with them.
    const REQUIRED = {
      id: sponsors.id,
      slug: sponsors.slug,
      name: sponsors.name,
      venuePlan: sponsors.venuePlan,
      paidAt: sponsors.paidAt,
      codeAllotment: sponsors.codeAllotment,
      allotmentMode: sponsors.allotmentMode,
    } as const;

    type VenueRow = {
      id: string;
      slug: string;
      name: string;
      venuePlan: string;
      paidAt: number | null;
      codeAllotment: number | null;
      allotmentMode: string;
      foundingNumber: number | null;
    };

    let rows: VenueRow[];
    try {
      rows = (await db
        .select({ ...REQUIRED, foundingNumber: sponsors.foundingNumber })
        .from(sponsors)
        .orderBy(sponsors.name)) as VenueRow[];
    } catch (optionalColumnError) {
      // A founding number is a label, not a fact the Account depends on. Losing
      // it costs an operator a nicer venue name; losing the list costs them the
      // whole surface.
      console.warn(
        "[account-review listLiveVenueOptions] founding_number unavailable, degrading:",
        optionalColumnError,
      );
      const base = await db.select(REQUIRED).from(sponsors).orderBy(sponsors.name);
      rows = base.map((s) => ({ ...s, foundingNumber: null })) as VenueRow[];
    }
    return {
      ok: true,
      venues: rows.map((s) => ({
        id: s.id,
        slug: s.slug,
        displayLabel: venueDisplayLabel(s.id, s.foundingNumber),
        paid: isPaidVenue(s),
        allotment: s.codeAllotment,
        allotmentMode: s.allotmentMode,
      })),
    };
  } catch (error) {
    // The driver's message is the failing SELECT in full, which for `sponsors`
    // names the contact_email column. It was rendered verbatim on the page.
    console.warn("[account-review listLiveVenueOptions] failed:", error);
    return { ok: false, error: "Live venues could not be reached." };
  }
}

/**
 * A label that identifies a venue to an operator without naming it.
 *
 * A founding venue is known by its place, which is the number the venue itself
 * cares about. A venue without one gets a stable opaque token, so the same
 * venue is the same label between reloads.
 *
 * The token is a HASH of the row id, not a slice of it. Production ids are
 * UUIDs today, so a slice would have been safe today — but a seeded id of the
 * form `spn_rivermill` renders as "Venue ermill", which is the venue's name
 * back again. A label whose safety depends on the current id format is a leak
 * waiting for the next id format.
 */
export function venueDisplayLabel(
  id: string,
  foundingNumber: number | null,
): string {
  if (foundingNumber != null) {
    return `Venue ${String(foundingNumber).padStart(2, "0")}/25`;
  }
  const token = createHash("sha256").update(id, "utf8").digest("hex").slice(0, 6);
  return `Venue ${token}`;
}

/**
 * Resolve a slug to a sponsor id, on the server.
 *
 * Mutating actions take a slug and call this rather than accepting a sponsor
 * id from the caller, so a client cannot name one venue and change another.
 */
export async function resolveSponsorIdForSlug(
  slug: string,
): Promise<{ ok: true; sponsorId: string } | { ok: false; error: string }> {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return { ok: false, error: "Select a venue first." };
  try {
    const db = entitlementsDb();
    const [row] = await db
      .select({ id: sponsors.id })
      .from(sponsors)
      .where(eq(sponsors.slug, normalized))
      .limit(1);
    if (!row) return { ok: false, error: "That venue was not found." };
    return { ok: true, sponsorId: row.id };
  } catch (error) {
    console.warn("[account-review resolveSponsorIdForSlug] failed:", error);
    return { ok: false, error: "That venue could not be reached." };
  }
}

export async function loadVenueAccessSnapshot(
  slug: string,
): Promise<LoadVenueAccessResult> {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return { ok: false, error: "Missing venue slug." };

  try {
    const db = entitlementsDb();
    // Explicit columns, for the same two reasons as listLiveVenueOptions:
    // contact_email never enters this process, and a column this projection
    // does not read cannot take the whole snapshot down.
    const [sponsor] = await db
      .select({
        id: sponsors.id,
        slug: sponsors.slug,
        name: sponsors.name,
        venuePlan: sponsors.venuePlan,
        paidAt: sponsors.paidAt,
        termStartsAt: sponsors.termStartsAt,
        termEndsAt: sponsors.termEndsAt,
        codeAllotment: sponsors.codeAllotment,
        allotmentMode: sponsors.allotmentMode,
        codesIssued: sponsors.codesIssued,
      })
      .from(sponsors)
      .where(eq(sponsors.slug, normalized))
      .limit(1);

    if (!sponsor) {
      return { ok: false, error: `Venue not found: ${normalized}` };
    }

    // Includes deliveredAt and expiresAt. Both are nullable and un-backfilled,
    // so a venue with no delivery data reads exactly as it did before; a venue
    // with it no longer has expired codes rendered as available.
    const codeRows = await db
      .select(LIVE_ACCESS_CODE_COLUMNS)
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
        allotmentMode: sponsor.allotmentMode,
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
