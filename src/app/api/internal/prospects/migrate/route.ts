import "server-only";
import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { prospectsTable } from "@/lib/db/schema";
import { getProspects } from "@/lib/hq/crm-db";

/**
 * Operator migration endpoint for the CRM lead books (2026-07-16).
 *
 * Turso credentials are sensitive-only in Vercel, so `pnpm db:push`
 * cannot run from a laptop without the founder's keys. This route runs
 * the same DDL inside the deployed app, which already holds the
 * credentials at runtime.
 *
 *   curl -X POST https://signalstudio.ie/api/internal/prospects/migrate \
 *        -H "Authorization: Bearer $STUDIO_MIGRATE_SECRET"
 *
 * Idempotent by construction: CREATE TABLE IF NOT EXISTS, CREATE INDEX
 * IF NOT EXISTS, and per-column ADD COLUMN guards that swallow
 * duplicate-column errors for a table created before the lead-book
 * columns existed. After the DDL it calls getProspects(), whose seed
 * guard inserts the committed 59-lead baseline only when the table is
 * empty. Re-running is a no-op that reports current counts.
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

export async function POST(req: Request) {
  if (!authOk(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const addedColumns: string[] = [];
  try {
    await db.run(CREATE_TABLE);
    for (const ddl of ADD_COLUMNS) {
      try {
        await db.run(sql.raw(ddl));
        addedColumns.push(ddl.match(/`prospects` ADD COLUMN `(\w+)`/)?.[1] ?? ddl);
      } catch {
        // duplicate column, table already carries it
      }
    }
    for (const ddl of CREATE_INDEXES) {
      await db.run(sql.raw(ddl));
    }

    // Triggers the seed guard: inserts the committed baseline iff empty.
    const prospects = await getProspects();
    const rows = await db
      .select({ n: sql<number>`count(*)` })
      .from(prospectsTable);

    return NextResponse.json({
      ok: true,
      tableRows: rows[0]?.n ?? 0,
      served: prospects.length,
      addedColumns,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "unknown" },
      { status: 500 },
    );
  }
}
