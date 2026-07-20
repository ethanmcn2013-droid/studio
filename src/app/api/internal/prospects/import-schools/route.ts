import "server-only";
import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { and, eq, like, not, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { prospectsTable, type NewDbProspect } from "@/lib/db/schema";
import { SEED_RESEARCH_FIELDS, seedToDb } from "@/lib/hq/crm-utils";
import { SCHOOLS_MANIFEST, schoolCountsByCountry } from "@/lib/hq/schools";

/**
 * Operator bulk-import endpoint for the CRM schools book (2026-07-20).
 *
 * National school registers (Ireland's 721 post-primary schools first, then
 * England, Scotland and Wales) are far too large for the curated TS seed, so
 * they are JSON datasets loaded from `src/lib/hq/schools/` and upserted here.
 *
 *   curl -X POST https://signalstudio.ie/api/internal/prospects/import-schools \
 *        -H "Authorization: Bearer $STUDIO_MIGRATE_SECRET"
 *
 * Same idempotent, pipeline-safe contract as the seed-sync route:
 *   0. DDL — CREATE TABLE / guarded ADD COLUMN, so this route stands alone.
 *   1. Retire legacy anchors — the old hand-seeded Limerick school rows
 *      (ids without the `sch-` prefix) that the founder never worked are
 *      deleted, because the national IE dataset supersedes them. Worked rows
 *      (updatedAt !== createdAt) are left untouched.
 *   2. Insert — school leads whose id is new.
 *   3. Refresh — untouched rows take the dataset's research fields wholesale.
 *   4. Fill — operator-touched rows only gain values where the DB field is
 *      empty. Stage, contact dates and outcome are never written (see
 *      SEED_RESEARCH_FIELDS).
 *
 * The schema source of truth is src/lib/db/schema.ts; the DDL below mirrors
 * it, and matches the seed-sync route's DDL exactly.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

function authOk(req: Request): boolean {
  const expected = process.env.STUDIO_MIGRATE_SECRET;
  if (!expected) return false;
  const presented = (req.headers.get("authorization") ?? "").replace(
    /^Bearer\s+/i,
    "",
  );
  const a = Buffer.from(presented);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

const CREATE_TABLE = sql.raw(`CREATE TABLE IF NOT EXISTS \`prospects\` (
  \`id\` text PRIMARY KEY NOT NULL,
  \`organisation\` text NOT NULL,
  \`segment\` text DEFAULT 'venue' NOT NULL,
  \`country\` text DEFAULT 'IE' NOT NULL,
  \`category\` text DEFAULT '' NOT NULL,
  \`flags\` text DEFAULT '' NOT NULL,
  \`contact_name\` text DEFAULT '' NOT NULL,
  \`role\` text DEFAULT '' NOT NULL,
  \`email\` text DEFAULT '' NOT NULL,
  \`phone\` text DEFAULT '' NOT NULL,
  \`website\` text DEFAULT '' NOT NULL,
  \`location\` text DEFAULT '' NOT NULL,
  \`address\` text DEFAULT '' NOT NULL,
  \`county\` text DEFAULT '' NOT NULL,
  \`org_group\` text DEFAULT '' NOT NULL,
  \`inbox_type\` text DEFAULT '' NOT NULL,
  \`tier\` text DEFAULT '' NOT NULL,
  \`source\` text DEFAULT '' NOT NULL,
  \`stage\` text DEFAULT 'to_contact' NOT NULL,
  \`last_contacted_at\` text,
  \`next_follow_up_at\` text,
  \`personalisation_note\` text DEFAULT '' NOT NULL,
  \`offer_sent\` text DEFAULT '' NOT NULL,
  \`outcome\` text DEFAULT '' NOT NULL,
  \`notes\` text DEFAULT '' NOT NULL,
  \`created_at\` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  \`updated_at\` integer DEFAULT (unixepoch() * 1000) NOT NULL
)`);

const ADD_COLUMNS = [
  "ALTER TABLE `prospects` ADD COLUMN `country` text DEFAULT 'IE' NOT NULL",
  "ALTER TABLE `prospects` ADD COLUMN `category` text DEFAULT '' NOT NULL",
  "ALTER TABLE `prospects` ADD COLUMN `flags` text DEFAULT '' NOT NULL",
];

const CREATE_INDEXES = [
  "CREATE INDEX IF NOT EXISTS `prospects_segment_idx` ON `prospects` (`segment`)",
  "CREATE INDEX IF NOT EXISTS `prospects_country_idx` ON `prospects` (`segment`, `country`)",
];

type ResearchPatch = Partial<
  Pick<NewDbProspect, (typeof SEED_RESEARCH_FIELDS)[number]>
>;

export async function POST(req: Request) {
  if (!authOk(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    // 0. DDL — stand-alone safe.
    await db.run(CREATE_TABLE);
    for (const ddl of ADD_COLUMNS) {
      try {
        await db.run(sql.raw(ddl));
      } catch {
        // column already present
      }
    }
    for (const ddl of CREATE_INDEXES) {
      await db.run(sql.raw(ddl));
    }

    const seeds = SCHOOLS_MANIFEST.flatMap((m) => m.leads).map(seedToDb);

    // 1. Retire un-worked legacy anchor school rows (old id scheme, no `sch-`).
    const retired = await db
      .delete(prospectsTable)
      .where(
        and(
          eq(prospectsTable.segment, "school"),
          not(like(prospectsTable.id, "sch-%")),
          eq(prospectsTable.updatedAt, prospectsTable.createdAt),
        ),
      )
      .returning({ id: prospectsTable.id });

    // 2–4. Upsert the national datasets.
    const existing = await db
      .select()
      .from(prospectsTable)
      .where(eq(prospectsTable.segment, "school"));
    const byId = new Map(existing.map((row) => [row.id, row]));

    let inserted = 0;
    let refreshed = 0;
    let filled = 0;

    const toInsert = seeds.filter((s) => !byId.has(s.id));
    for (let i = 0; i < toInsert.length; i += 50) {
      const batch = toInsert.slice(i, i + 50);
      await db.insert(prospectsTable).values(batch);
      inserted += batch.length;
    }

    for (const seed of seeds) {
      const row = byId.get(seed.id);
      if (!row) continue;
      const untouched = row.updatedAt === row.createdAt;
      const patch: ResearchPatch = {};
      for (const field of SEED_RESEARCH_FIELDS) {
        const seedValue = (seed[field] ?? "") as string;
        const rowValue = (row[field] ?? "") as string;
        if (untouched) {
          if (seedValue !== rowValue) {
            (patch as Record<string, string>)[field] = seedValue;
          }
        } else if (!rowValue && seedValue) {
          (patch as Record<string, string>)[field] = seedValue;
        }
      }
      if (Object.keys(patch).length > 0) {
        await db
          .update(prospectsTable)
          .set(patch)
          .where(eq(prospectsTable.id, seed.id));
        if (untouched) refreshed++;
        else filled++;
      }
    }

    const rows = await db
      .select({ n: sql<number>`count(*)` })
      .from(prospectsTable)
      .where(eq(prospectsTable.segment, "school"));

    return NextResponse.json({
      ok: true,
      schoolRows: rows[0]?.n ?? 0,
      datasetRecords: seeds.length,
      byCountry: schoolCountsByCountry(),
      retiredLegacyAnchors: retired.length,
      inserted,
      refreshed,
      filled,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "unknown" },
      { status: 500 },
    );
  }
}
