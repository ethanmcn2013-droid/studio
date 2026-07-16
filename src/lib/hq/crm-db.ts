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
import { asc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  type DbProspect,
  type NewDbProspect,
  type ProspectStage,
  prospectsTable,
} from "@/lib/db/schema";
import { normalizeSegment } from "@/lib/hq/crm-utils";
import { seedHqData } from "@/lib/hq/data";
import type { Prospect } from "@/lib/hq/data";

// NOTE: Pure utilities (SEGMENT_CONFIG, STAGE_LABELS, PIPELINE_STAGES,
// computeStageCounts, computeLockdown, computeOutreachSummary,
// buildMailtoHref, isOverdue, isDueToday, etc.) live in crm-utils.ts.
// Import from there, not here, for any sync function.
// Types (DbProspect, ProspectStage, ProspectSegment) are exported from
// @/lib/db/schema. This file exports ONLY async server actions and reads.

// ── Seed conversion ─────────────────────────────────────────────────────────

function seedStatusToStage(status: Prospect["status"]): ProspectStage {
  const map: Record<Prospect["status"], ProspectStage> = {
    "To Contact":     "to_contact",
    "Contacted":      "contacted",
    "Replied":        "replied",
    "Demo Booked":    "demo_booked",
    "Pilot Active":   "pilot_active",
    "Not Interested": "not_interested",
    "Later":          "later",
  };
  return map[status] ?? "to_contact";
}

/**
 * The Top-50 venue seed carried its intelligence as prose:
 *   notes:               "5★ · Red Carnation · Reservations inbox · …"
 *   personalisationNote: "Red Carnation group; Reservations inbox."
 * These parsers lift those facts into queryable fields at seed time, so
 * legacy records join the lock-down model without rewriting fifty rows.
 */
function parseTier(notes: string): string {
  const m = notes.match(/([45]★)/);
  return m ? m[1] : "";
}

function parseOrgGroup(personalisationNote: string): string {
  const m = personalisationNote.match(/^(.+?) group;/i);
  return m ? m[1].trim() : "";
}

function parseInboxType(personalisationNote: string): string {
  const m = personalisationNote.match(/;\s*([^;.]+?)\s+inbox\.?/i);
  if (!m) return "";
  const raw = m[1].toLowerCase();
  if (raw.includes("wedding")) return "weddings";
  if (raw.includes("event")) return "events";
  if (raw.includes("reservation")) return "reservations";
  if (raw.includes("group")) return "groups";
  if (raw.includes("sales")) return "sales";
  if (raw.includes("general")) return "general";
  return "";
}

function parseCounty(location: string): string {
  const last = location.split(",").pop()?.trim() ?? "";
  const cleaned = last.replace(/^Co\.\s*/i, "").replace(/\s*\d+$/, "").trim();
  return cleaned;
}

function seedToDb(p: Prospect): NewDbProspect {
  return {
    id: p.id,
    organisation: p.organisation,
    segment: normalizeSegment(p.segment),
    contactName: p.contactName,
    role: p.role,
    email: p.email,
    phone: p.phone ?? "",
    website: p.website,
    location: p.location,
    address: p.address ?? "",
    county: p.county ?? parseCounty(p.location),
    orgGroup: p.orgGroup ?? parseOrgGroup(p.personalisationNote),
    inboxType: p.inboxType ?? parseInboxType(p.personalisationNote),
    tier: p.tier ?? parseTier(p.notes),
    source: p.source,
    stage: seedStatusToStage(p.status),
    lastContactedAt: p.lastContacted || null,
    nextFollowUpAt: p.nextFollowUp || null,
    personalisationNote: p.personalisationNote,
    offerSent: p.offerSent,
    outcome: p.outcome,
    notes: p.notes,
  };
}

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
 * Falls back to seedHqData if the DB table doesn't exist yet.
 */
export async function getProspects(): Promise<DbProspect[]> {
  try {
    await ensureSeeded();
    return await db
      .select()
      .from(prospectsTable)
      .orderBy(asc(prospectsTable.organisation));
  } catch {
    return (seedHqData.prospects ?? [])
      .map(seedToDb)
      .sort((a, b) => a.organisation.localeCompare(b.organisation)) as DbProspect[];
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
