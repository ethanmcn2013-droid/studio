/**
 * Access-system backfill (idempotent, parity-gated). Run AFTER
 * migrate-access.mjs. Copies the venue ledger from the studio-local
 * sponsors table into the shared signal-entitlements sponsors columns
 * (the venue revenue data lives studio-local today), sets codes_issued
 * from the real code count, and validates parity before anything is
 * trusted as revenue.
 *
 * Run: node scripts/backfill-access.mjs            (apply)
 *      node scripts/backfill-access.mjs --dry-run   (report only)
 *
 * Nothing counts as revenue in HQ until this reports PARITY OK.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@libsql/client";

const DRY = process.argv.includes("--dry-run");
const LEDGER = [
  "venue_plan",
  "annual_amount_cents",
  "founding_locked",
  "term_starts_at",
  "term_ends_at",
  "paid_at",
  "code_allotment",
];

function need(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing env ${name}`);
    process.exit(1);
  }
  return v;
}

const studio = createClient({
  url: need("TURSO_STUDIO_DATABASE_URL"),
  authToken: process.env.TURSO_STUDIO_AUTH_TOKEN,
});
const shared = createClient({
  url: need("TURSO_ENTITLEMENTS_DATABASE_URL"),
  authToken: process.env.TURSO_ENTITLEMENTS_AUTH_TOKEN,
});

console.log(DRY ? "=== backfill DRY RUN ===" : "=== backfill APPLY ===");

// 1. Read the studio-local ledger keyed by slug (the source of truth today).
const srcRows = (
  await studio.execute(`SELECT slug, ${LEDGER.join(", ")} FROM sponsors`)
).rows;
const src = new Map(srcRows.map((r) => [r.slug, r]));
console.log(`studio sponsors: ${src.size}`);

// 2. For each shared sponsor, copy the ledger + set codes_issued = COUNT(codes).
const sharedRows = (await shared.execute("SELECT id, slug FROM sponsors")).rows;
let copied = 0;
for (const s of sharedRows) {
  const l = src.get(s.slug);
  const cnt = (
    await shared.execute({
      sql: "SELECT COUNT(*) n FROM license_codes WHERE sponsor_id = ? AND status != 'revoked'",
      args: [s.id],
    })
  ).rows[0].n;
  if (!l) {
    console.log(`  no studio ledger for shared sponsor '${s.slug}' — codes_issued=${cnt} only`);
    if (!DRY)
      await shared.execute({
        sql: "UPDATE sponsors SET codes_issued = ? WHERE id = ?",
        args: [cnt, s.id],
      });
    continue;
  }
  const sets = LEDGER.map((c) => `${c} = ?`).join(", ") + ", codes_issued = ?";
  const args = [...LEDGER.map((c) => l[c]), cnt, s.id];
  if (DRY) console.log(`  DRY copy '${s.slug}' (codes_issued=${cnt})`);
  else
    await shared.execute({
      sql: `UPDATE sponsors SET ${sets} WHERE id = ?`,
      args,
    });
  copied++;
}
console.log(`copied ledger into ${copied} shared sponsor(s)`);

// 3. PARITY GATE: paid-venue count + sum(annual_amount_cents) must match.
const paidSql = `SELECT COUNT(*) n, COALESCE(SUM(annual_amount_cents),0) cash
  FROM sponsors WHERE (venue_plan='founding' OR venue_plan='paid') AND paid_at IS NOT NULL`;
const a = (await studio.execute(paidSql)).rows[0];
const b = (await shared.execute(paidSql)).rows[0];
console.log(`studio paid venues: ${a.n}, cash ${a.cash}`);
console.log(`shared paid venues: ${b.n}, cash ${b.cash}`);
const ok = String(a.n) === String(b.n) && String(a.cash) === String(b.cash);
console.log(ok ? "PARITY OK — shared venue revenue matches studio." : "PARITY MISMATCH — do NOT trust shared venue revenue yet.");

// 4. email_hash backfill: DEFERRED. Requires the Clerk backend SDK
//    (clerkClient is imported nowhere in studio today — see the
//    hq-per-operator-identity / identity build). Once Clerk lookup
//    exists, hash each entitlement's verified email into email_hash.
console.log("email_hash backfill: DEFERRED until Clerk backend integration lands.");

process.exit(DRY || ok ? 0 : 1);
