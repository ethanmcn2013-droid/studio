/**
 * One-shot: apply the Venue Edition ledger columns to prod Turso
 * deterministically. drizzle-kit migrate reported success but the
 * columns did not land (tracking-table desync vs how 0000-0002 were
 * originally applied). This adds them idempotently and verifies.
 * Safe to re-run.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@libsql/client";

const adds = [
  ["venue_plan", "ALTER TABLE sponsors ADD venue_plan text DEFAULT 'none' NOT NULL"],
  ["annual_amount_cents", "ALTER TABLE sponsors ADD annual_amount_cents integer"],
  ["founding_locked", "ALTER TABLE sponsors ADD founding_locked integer"],
  ["term_starts_at", "ALTER TABLE sponsors ADD term_starts_at integer"],
  ["term_ends_at", "ALTER TABLE sponsors ADD term_ends_at integer"],
  ["paid_at", "ALTER TABLE sponsors ADD paid_at integer"],
  ["code_allotment", "ALTER TABLE sponsors ADD code_allotment integer"],
];
const want = adds.map(([c]) => c);

async function applyTo(label, url, authToken) {
  if (!url) {
    console.log(`\n[${label}] SKIP — url env not set`);
    return true;
  }
  const c = createClient({ url, authToken });
  const info = await c.execute("SELECT name FROM pragma_table_info('sponsors')");
  const have = new Set(info.rows.map((r) => r.name));
  console.log(`\n[${label}] existing sponsors columns:`, [...have].join(", "));
  for (const [col, sql] of adds) {
    if (have.has(col)) {
      console.log(`[${label}] skip (exists):`, col);
      continue;
    }
    await c.execute(sql);
    console.log(`[${label}] added:`, col);
  }
  try {
    await c.execute(
      "CREATE INDEX IF NOT EXISTS sponsors_venue_plan_idx ON sponsors (venue_plan)",
    );
    console.log(`[${label}] index ok`);
  } catch (e) {
    console.log(`[${label}] index:`, e.message);
  }
  const after = await c.execute("SELECT name FROM pragma_table_info('sponsors')");
  const names = after.rows.map((r) => r.name);
  const missing = want.filter((w) => !names.includes(w));
  console.log(
    missing.length === 0
      ? `[${label}] VERIFIED — all 7 ledger columns present.`
      : `[${label}] STILL MISSING: ${missing.join(", ")}`,
  );
  return missing.length === 0;
}

const okStudio = await applyTo(
  "studio",
  process.env.TURSO_STUDIO_DATABASE_URL,
  process.env.TURSO_STUDIO_AUTH_TOKEN,
);
const okShared = await applyTo(
  "signal-entitlements",
  process.env.TURSO_ENTITLEMENTS_DATABASE_URL,
  process.env.TURSO_ENTITLEMENTS_AUTH_TOKEN,
);
process.exit(okStudio && okShared ? 0 : 1);
