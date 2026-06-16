/**
 * Smoke-check for the product-analytics Blueprint metrics.
 *
 * The five product-app metrics on /hq/blueprint (activation, retention,
 * churn, onboarding, usage-by-module) are computed by reading the four
 * product Tursos. That SQL can't run on a dev host without the read-only
 * tokens, so this script lets the operator verify it against real data
 * before trusting the deployed map.
 *
 * It mirrors the queries + per-DB timestamp units in
 *   src/lib/hq/product-analytics.ts
 * If you change the SQL there, change it here too (they are intentionally
 * kept in lockstep — same definitions, same unit handling).
 *
 * Usage:
 *   1) vercel env pull .env.local      # gets the read-only product tokens
 *   2) node scripts/blueprint-metrics-smoke.mjs
 *
 * Reads the same env pairs the Today API uses:
 *   TASKS_/NOTES_/ROADMAP_/ANALYTICS_TURSO_URL + _TOKEN
 * Read-only. Never writes.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@libsql/client";

const DAY_S = 86_400;
const DAY_MS = 86_400_000;

function clientFor(urlEnv, tokenEnv) {
  const url = process.env[urlEnv];
  const token = process.env[tokenEnv];
  if (!url || !token) return null;
  return createClient({ url, authToken: token });
}

function pct(part, whole) {
  if (whole <= 0) return null;
  return Math.min(100, Math.max(0, Math.round((part / whole) * 100)));
}

const fmtPct = (n) => (n == null ? "—  (no data / no cohort)" : `${n}%`);

async function readTasks() {
  const client = clientFor("TASKS_TURSO_URL", "TASKS_TURSO_TOKEN");
  if (!client) return { read: "skipped_no_env" };
  try {
    const nowS = Math.floor(Date.now() / 1000);
    const d30 = nowS - 30 * DAY_S;
    const d60 = nowS - 60 * DAY_S;

    const ws = await client.execute(`
      SELECT COUNT(*) AS total,
             SUM(CASE WHEN onboarding_completed_at IS NOT NULL THEN 1 ELSE 0 END) AS onboarded
      FROM workspaces
    `);
    const total = Number(ws.rows[0]?.total ?? 0);
    const onboarded = Number(ws.rows[0]?.onboarded ?? 0);

    const act = await client.execute(
      "SELECT COUNT(DISTINCT workspace_id) AS n FROM tasks WHERE workspace_id IS NOT NULL",
    );
    const activated = Number(act.rows[0]?.n ?? 0);

    const cohortRow = await client.execute({
      sql: `
        SELECT
          (SELECT COUNT(*) FROM workspaces
             WHERE created_at >= ? AND created_at < ?) AS cohort,
          (SELECT COUNT(*) FROM workspaces w
             WHERE w.created_at >= ? AND w.created_at < ?
               AND EXISTS (SELECT 1 FROM activities a
                           WHERE a.workspace_id = w.id AND a.created_at >= ?)) AS retained
      `,
      args: [d60, d30, d60, d30, d30],
    });
    const cohort = Number(cohortRow.rows[0]?.cohort ?? 0);
    const retained = Number(cohortRow.rows[0]?.retained ?? 0);
    const retentionPct = pct(retained, cohort);

    return {
      read: "ok",
      total,
      onboarded,
      activated,
      cohort,
      retained,
      activationPct: pct(activated, total),
      onboardingPct: pct(onboarded, total),
      retentionPct,
      churnPct: retentionPct == null ? null : 100 - retentionPct,
    };
  } catch (err) {
    return { read: "error", err: String(err) };
  }
}

async function readModule(label, urlEnv, tokenEnv, sql, arg) {
  const client = clientFor(urlEnv, tokenEnv);
  if (!client) return { label, read: "skipped_no_env", active: null };
  try {
    const row = await client.execute({ sql, args: [arg] });
    return { label, read: "ok", active: Number(row.rows[0]?.n ?? 0) };
  } catch (err) {
    return { label, read: "error", active: null, err: String(err) };
  }
}

async function main() {
  const nowS = Math.floor(Date.now() / 1000);
  const nowMs = Date.now();
  const d30s = nowS - 30 * DAY_S;
  const d30ms = nowMs - 30 * DAY_MS;

  const [tasks, notesMod, tasksMod, roadmapMod, signalMod] = await Promise.all([
    readTasks(),
    readModule(
      "Notes",
      "NOTES_TURSO_URL",
      "NOTES_TURSO_TOKEN",
      "SELECT COUNT(DISTINCT user_id) AS n FROM notes WHERE archived_at IS NULL AND updated_at >= ?",
      d30ms,
    ),
    readModule(
      "Tasks",
      "TASKS_TURSO_URL",
      "TASKS_TURSO_TOKEN",
      "SELECT COUNT(DISTINCT user_id) AS n FROM activities WHERE created_at >= ?",
      d30s,
    ),
    readModule(
      "Timeline",
      "ROADMAP_TURSO_URL",
      "ROADMAP_TURSO_TOKEN",
      "SELECT COUNT(DISTINCT workspace_slug) AS n FROM tasks WHERE updated_at >= ?",
      d30s,
    ),
    readModule(
      "Signal",
      "ANALYTICS_TURSO_URL",
      "ANALYTICS_TURSO_TOKEN",
      "SELECT COUNT(*) AS n FROM user_preferences WHERE cadence != 'off' AND last_sent_at >= ?",
      d30ms,
    ),
  ]);

  const moduleReads = [notesMod, tasksMod, roadmapMod, signalMod];
  const readable = moduleReads.filter((m) => m.read === "ok").length;
  const active = moduleReads.filter((m) => (m.active ?? 0) > 0).length;

  console.log("\n  Blueprint product-analytics smoke-check");
  console.log("  ────────────────────────────────────────────");
  console.log(`  Tasks DB read:        ${tasks.read}`);
  if (tasks.read === "ok") {
    console.log(`    workspaces total:   ${tasks.total}  (onboarded ${tasks.onboarded}, with-a-task ${tasks.activated})`);
    console.log(`    M1 cohort (30–60d): ${tasks.cohort}  (retained ${tasks.retained})`);
    console.log("");
    console.log(`    Activation rate     ${fmtPct(tasks.activationPct)}`);
    console.log(`    Onboarding compl.   ${fmtPct(tasks.onboardingPct)}`);
    console.log(`    Retention (M1)      ${fmtPct(tasks.retentionPct)}`);
    console.log(`    Churn               ${fmtPct(tasks.churnPct)}`);
  } else if (tasks.read === "error") {
    console.log(`    error: ${tasks.err}`);
  }
  console.log("");
  console.log("  Usage by module (active users, 30d):");
  for (const m of moduleReads) {
    const v = m.read === "ok" ? `${m.active} active` : m.read;
    console.log(`    ${m.label.padEnd(9)} ${v}${m.err ? `  (${m.err})` : ""}`);
  }
  console.log("");
  console.log(`    Usage by module     ${readable > 0 ? `${active}/${readable}` : "—  (no module readable)"}`);
  console.log("  ────────────────────────────────────────────");
  console.log("  Note: '—' is honest — empty cohort or unread source falls back");
  console.log("  to the placeholder on /hq/blueprint, never a fabricated number.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
