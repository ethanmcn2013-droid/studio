"use server";

/**
 * Signal HQ Outreach CRM, DB layer (server-only).
 *
 * Only async server functions live here: DB reads, writes, seed guard.
 * All sync utilities (lead books, lock-down scoring, stage counts, due-today,
 * mailto builder, stage labels/colours) live in crm-utils.ts and are safe
 * for client import.
 *
 * MIGRATION: run `pnpm db:push` to create the `prospects` table, then let
 * `getProspects()` auto-seed from seedHqData on first page load.
 */

import { revalidatePath } from "next/cache";
import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  type DbProspect,
  type ProspectCountry,
  type ProspectSegment,
  type ProspectStage,
  prospectsTable,
} from "@/lib/db/schema";
import { seedToDb } from "@/lib/hq/crm-utils";
import { seedHqData } from "@/lib/hq/data";
import { schoolLeads } from "@/lib/hq/schools";

// NOTE: Pure utilities (SEGMENT_CONFIG, STAGE_LABELS, PIPELINE_STAGES,
// computeStageCounts, computeLockdown, computeOutreachSummary,
// buildMailtoHref, isOverdue, isDueToday, seedToDb, etc.) live in
// crm-utils.ts. Import from there, not here, for any sync function.
// Types (DbProspect, ProspectStage, ProspectSegment) are exported from
// @/lib/db/schema. This file exports ONLY async server actions and reads.

// ── In-process seed guard ───────────────────────────────────────────────────

let _seeded = false;

async function ensureSeeded(): Promise<void> {
  if (_seeded) return;
  try {
    const rows = await db
      .select({ n: sql<number>`count(*)` })
      .from(prospectsTable);
    if ((rows[0]?.n ?? 0) === 0) {
      const seeds = (seedHqData.prospects ?? []).map(seedToDb);
      if (seeds.length > 0) {
        await db.insert(prospectsTable).values(seeds);
      }
    }
    _seeded = true;
  } catch {
    // Table doesn't exist yet, skip, fall back to seed data in getProspects
  }
}

// ── Reads ───────────────────────────────────────────────────────────────────

/**
 * All prospects, alphabetical by organisation.
 * Falls back to the committed datasets (curated seed + national school JSON)
 * if the DB is unavailable, so the schools book renders in local dev and
 * survives a DB blip.
 */
export async function getProspects(): Promise<DbProspect[]> {
  try {
    await ensureSeeded();
    return await db
      .select()
      .from(prospectsTable)
      .orderBy(asc(prospectsTable.organisation));
  } catch {
    return [...(seedHqData.prospects ?? []), ...schoolLeads]
      .map(seedToDb)
      .sort((a, b) => a.organisation.localeCompare(b.organisation)) as DbProspect[];
  }
}

/**
 * Prospects in one book, optionally scoped to one nation. Keeps the schools
 * book (which can run to thousands of rows across four nations) from ever
 * loading the venue and student books into memory, and lets the country tabs
 * push their filter down to the query. Falls back to the committed datasets
 * (curated seed + national school JSON) when the DB is unavailable.
 */
export async function getProspectsBySegment(
  segment: ProspectSegment,
  country?: ProspectCountry,
): Promise<DbProspect[]> {
  try {
    await ensureSeeded();
    const where = country
      ? and(eq(prospectsTable.segment, segment), eq(prospectsTable.country, country))
      : eq(prospectsTable.segment, segment);
    return await db
      .select()
      .from(prospectsTable)
      .where(where)
      .orderBy(asc(prospectsTable.organisation));
  } catch {
    const fromSeed = (seedHqData.prospects ?? []).map(seedToDb);
    const fromSchools = segment === "school" ? schoolLeads.map(seedToDb) : [];
    return [...fromSeed, ...fromSchools]
      .filter(
        (p) =>
          p.segment === segment && (!country || (p.country ?? "IE") === country),
      )
      .sort((a, b) =>
        a.organisation.localeCompare(b.organisation),
      ) as DbProspect[];
  }
}

/**
 * Per-nation school counts for the country tabs — a single grouped count so
 * the tabs stay accurate without loading every nation's rows. Falls back to
 * the committed dataset counts when the DB is unavailable.
 */
export async function getSchoolCountryCounts(): Promise<
  { value: string; count: number }[]
> {
  try {
    await ensureSeeded();
    const rows = await db
      .select({
        country: prospectsTable.country,
        n: sql<number>`count(*)`,
      })
      .from(prospectsTable)
      .where(eq(prospectsTable.segment, "school"))
      .groupBy(prospectsTable.country);
    return rows.map((r) => ({ value: r.country, count: Number(r.n) }));
  } catch {
    const counts = new Map<string, number>();
    for (const p of schoolLeads) {
      const c = p.country ?? "IE";
      counts.set(c, (counts.get(c) ?? 0) + 1);
    }
    return [...counts.entries()].map(([value, count]) => ({ value, count }));
  }
}

export async function getProspect(id: string): Promise<DbProspect | null> {
  try {
    const rows = await db
      .select()
      .from(prospectsTable)
      .where(eq(prospectsTable.id, id))
      .limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

// ── Writes (server actions) ─────────────────────────────────────────────────

export async function updateProspectStage(
  id: string,
  stage: ProspectStage,
): Promise<void> {
  await db
    .update(prospectsTable)
    .set({ stage, updatedAt: Date.now() })
    .where(eq(prospectsTable.id, id));
  _seeded = false;
  revalidatePath("/hq/crm");
  revalidatePath("/hq");
}

export async function updateProspectContact(
  id: string,
  lastContactedAt: string,
  nextFollowUpAt?: string,
): Promise<void> {
  await db
    .update(prospectsTable)
    .set({
      lastContactedAt,
      nextFollowUpAt: nextFollowUpAt ?? null,
      stage: "contacted",
      updatedAt: Date.now(),
    })
    .where(eq(prospectsTable.id, id));
  _seeded = false;
  revalidatePath("/hq/crm");
  revalidatePath("/hq");
}

/**
 * Lock-down writer: record the facts a call or research pass surfaced —
 * the named human, the direct door, the phone, the address. Empty strings
 * are written as-is (they clear a field); undefined fields are untouched.
 */
export async function updateProspectContactInfo(
  id: string,
  patch: {
    contactName?: string;
    role?: string;
    email?: string;
    phone?: string;
    address?: string;
    inboxType?: string;
  },
): Promise<void> {
  const set: Record<string, string | number> = { updatedAt: Date.now() };
  if (patch.contactName !== undefined) set.contactName = patch.contactName.trim();
  if (patch.role !== undefined) set.role = patch.role.trim();
  if (patch.email !== undefined) set.email = patch.email.trim();
  if (patch.phone !== undefined) set.phone = patch.phone.trim();
  if (patch.address !== undefined) set.address = patch.address.trim();
  if (patch.inboxType !== undefined) set.inboxType = patch.inboxType.trim();
  await db
    .update(prospectsTable)
    .set(set)
    .where(eq(prospectsTable.id, id));
  _seeded = false;
  revalidatePath("/hq/crm");
  revalidatePath("/hq");
}

export async function updateProspectNotes(
  id: string,
  notes: string,
): Promise<void> {
  await db
    .update(prospectsTable)
    .set({ notes, updatedAt: Date.now() })
    .where(eq(prospectsTable.id, id));
  _seeded = false;
  revalidatePath("/hq/crm");
}

export async function updateProspectFollowUp(
  id: string,
  nextFollowUpAt: string | null,
): Promise<void> {
  await db
    .update(prospectsTable)
    .set({ nextFollowUpAt, updatedAt: Date.now() })
    .where(eq(prospectsTable.id, id));
  _seeded = false;
  revalidatePath("/hq/crm");
}
