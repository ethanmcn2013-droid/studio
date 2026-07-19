import "server-only";
import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { prospectsTable, type NewDbProspect } from "@/lib/db/schema";
import { SEED_RESEARCH_FIELDS, seedToDb } from "@/lib/hq/crm-utils";
import { seedHqData } from "@/lib/hq/data";

/**
 * Operator migration + seed-sync endpoint for the CRM lead books
 * (2026-07-16, sync added 2026-07-17).
 *
 * Turso credentials are sensitive-only in Vercel, so `pnpm db:push`
 * cannot run from a laptop without the founder's keys. This route runs
 * the same DDL inside the deployed app, which already holds the
 * credentials at runtime — then reconciles the table with the committed
 * seed so research waves land in production without clobbering worked
 * pipeline.
 *
 *   curl -X POST https://signalstudio.ie/api/internal/prospects/migrate \
 *        -H "Authorization: Bearer $STUDIO_MIGRATE_SECRET"
 *
 * Idempotent by construction:
 *   1. DDL — CREATE TABLE/INDEX IF NOT EXISTS + guarded ADD COLUMNs.
 *   2. Insert — seed records whose id is not in the table.
 *   3. Refresh — rows never touched by the operator (updatedAt equals
 *      createdAt) take the seed's research fields wholesale.
 *   4. Fill — operator-touched rows only gain values where the DB field
 *      is empty and the seed has one. Stage, contact dates, and outcome
 *      are never written by sync in any mode (SEED_RESEARCH_FIELDS).
 *
 * The DDL below is the drizzle-kit push output for prospectsTable in
 * src/lib/db/schema.ts — change the schema there first, then mirror it
 * here, never the other way around.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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

/** Columns added after the original table shape; guarded individually. */
const ADD_COLUMNS = [
  "ALTER TABLE `prospects` ADD COLUMN `phone` text DEFAULT '' NOT NULL",
  "ALTER TABLE `prospects` ADD COLUMN `address` text DEFAULT '' NOT NULL",
  "ALTER TABLE `prospects` ADD COLUMN `county` text DEFAULT '' NOT NULL",
  "ALTER TABLE `prospects` ADD COLUMN `org_group` text DEFAULT '' NOT NULL",
  "ALTER TABLE `prospects` ADD COLUMN `inbox_type` text DEFAULT '' NOT NULL",
  "ALTER TABLE `prospects` ADD COLUMN `tier` text DEFAULT '' NOT NULL",
];

const CREATE_INDEXES = [
  "CREATE INDEX IF NOT EXISTS `prospects_stage_idx` ON `prospects` (`stage`)",
  "CREATE INDEX IF NOT EXISTS `prospects_segment_idx` ON `prospects` (`segment`)",
  "CREATE INDEX IF NOT EXISTS `prospects_next_follow_up_idx` ON `prospects` (`next_follow_up_at`)",
];

type ResearchPatch = Partial<Pick<NewDbProspect, (typeof SEED_RESEARCH_FIELDS)[number]>>;

export async function POST(req: Request) {
  if (!authOk(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    // 1. DDL
    await db.run(CREATE_TABLE);
    for (const ddl of ADD_COLUMNS) {
      try {
        await db.run(sql.raw(ddl));
      } catch {
        // duplicate column, table already carries it
      }
    }
    for (const ddl of CREATE_INDEXES) {
      await db.run(sql.raw(ddl));
    }

    // 2–4. Seed sync
    const seeds = (seedHqData.prospects ?? []).map(seedToDb);
    const existing = await db.select().from(prospectsTable);
    const byId = new Map(existing.map((row) => [row.id, row]));

    let inserted = 0;
    let refreshed = 0;
    let filled = 0;

    const toInsert = seeds.filter((s) => !byId.has(s.id));
    for (let i = 0; i < toInsert.length; i += 25) {
      const batch = toInsert.slice(i, i + 25);
      await db.insert(prospectsTable).values(batch);
      inserted += batch.length;
    }

    for (const seed of seeds) {
      const row = byId.get(seed.id);
      if (!row) continue;
      const untouched = row.updatedAt === row.createdAt;
      const patch: ResearchPatch = {};
      for (const field of SEED_RESEARCH_FIELDS) {
        // every research field is a text column; the segment union narrows
        // back at the drizzle layer
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
      .from(prospectsTable);

    return NextResponse.json({
      ok: true,
      tableRows: rows[0]?.n ?? 0,
      seedRecords: seeds.length,
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
