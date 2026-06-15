import "server-only";
import { createClient, type Client } from "@libsql/client";

/**
 * Suite-wide product analytics for the Founder Operating System metrics.
 *
 * Reads the four product Tursos with the **same dedicated read-only token
 * env pairs the Today API already uses** (src/server/today/aggregate.ts) —
 * so wiring this needs no new secrets, just the tokens that are already
 * provisioned on the studio deployment:
 *
 *   TASKS_TURSO_URL     / TASKS_TURSO_TOKEN
 *   NOTES_TURSO_URL     / NOTES_TURSO_TOKEN
 *   ROADMAP_TURSO_URL   / ROADMAP_TURSO_TOKEN
 *   ANALYTICS_TURSO_URL / ANALYTICS_TURSO_TOKEN
 *
 * Provisioning checklist: docs/ios/today-api.md § Operator provisioning.
 *
 * Honesty contract (mirrors traction.ts): every figure is computed from a
 * crisp, named definition or it is `null`. A missing token or a read that
 * throws returns `null` for that slice and a health flag — never a
 * confidently-wrong number. No outage fails the whole aggregation.
 *
 * Timestamp units differ per DB and are easy to get wrong, so they are
 * named at every query:
 *   - Tasks, Roadmap  → seconds   (`unixepoch()`)
 *   - Notes, Analytics → milliseconds (`unixepoch() * 1000`)
 *
 * Metric definitions (all from product data, the founder's ask):
 *   - activation     = Tasks workspaces with ≥1 task ÷ all workspaces
 *   - onboarding     = Tasks workspaces with onboarding_completed_at ÷ all
 *   - retention (M1) = of workspaces created 30–60d ago, the share with
 *                      any activity in the last 30d
 *   - churn          = 100 − M1 retention (same cohort/window)
 *   - usage by module = how many of the readable modules had ≥1 active
 *                      user in the last 30 days, as "active / readable"
 *
 * Support sentiment (support inbox) and runway (finance model) are NOT
 * product-app analytics and are deliberately not read here — they stay
 * honest placeholders on the blueprint.
 */

export type ProductRead = "ok" | "skipped_no_env" | "error";

export type ProductAnalytics = {
  /** % of Tasks workspaces that have created at least one task. */
  activationPct: number | null;
  /** M1 workspace-activity retention %, or null when the cohort is empty. */
  retentionPct: number | null;
  /** 100 − retention over the same M1 cohort, or null when empty. */
  churnPct: number | null;
  /** % of Tasks workspaces that finished the onboarding flow. */
  onboardingPct: number | null;
  /** Modules with ≥1 active user (30d) out of the modules we could read. */
  modulesActive: { active: number; readable: number } | null;
  reads: {
    tasks: ProductRead;
    notes: ProductRead;
    roadmap: ProductRead;
    analytics: ProductRead;
  };
};

const DAY_S = 86_400;
const DAY_MS = 86_400_000;

function clientForEnv(urlEnv: string, tokenEnv: string): Client | null {
  const url = process.env[urlEnv];
  const token = process.env[tokenEnv];
  if (!url || !token) return null;
  return createClient({ url, authToken: token });
}

function pct(part: number, whole: number): number | null {
  if (whole <= 0) return null;
  return Math.min(100, Math.max(0, Math.round((part / whole) * 100)));
}

/** Tasks DB (seconds): activation, onboarding, M1 retention/churn. */
async function readTasks(): Promise<{
  activationPct: number | null;
  retentionPct: number | null;
  churnPct: number | null;
  onboardingPct: number | null;
  read: ProductRead;
}> {
  const empty = {
    activationPct: null,
    retentionPct: null,
    churnPct: null,
    onboardingPct: null,
  };
  const client = clientForEnv("TASKS_TURSO_URL", "TASKS_TURSO_TOKEN");
  if (!client) return { ...empty, read: "skipped_no_env" };

  try {
    const nowS = Math.floor(Date.now() / 1000);
    const d30 = nowS - 30 * DAY_S;
    const d60 = nowS - 60 * DAY_S;

    // Onboarding + total workspaces in one pass.
    const wsRow = await client.execute(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN onboarding_completed_at IS NOT NULL THEN 1 ELSE 0 END) AS onboarded
      FROM workspaces
    `);
    const total = Number(wsRow.rows[0]?.total ?? 0);
    const onboarded = Number(wsRow.rows[0]?.onboarded ?? 0);

    // Activation: workspaces that own at least one task.
    const actRow = await client.execute(
      "SELECT COUNT(DISTINCT workspace_id) AS n FROM tasks WHERE workspace_id IS NOT NULL",
    );
    const activated = Number(actRow.rows[0]?.n ?? 0);

    // M1 cohort: workspaces created 30–60d ago; retained = any activity ≤30d.
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
      activationPct: pct(activated, total),
      onboardingPct: pct(onboarded, total),
      retentionPct,
      churnPct: retentionPct == null ? null : 100 - retentionPct,
      read: "ok",
    };
  } catch (err) {
    console.error("[hq/product-analytics] tasks read failed:", err);
    return { ...empty, read: "error" };
  }
}

/** One module's distinct-active-user count over the last 30 days. */
async function readModuleActive(
  urlEnv: string,
  tokenEnv: string,
  sql: string,
  arg: number,
): Promise<{ active: number | null; read: ProductRead }> {
  const client = clientForEnv(urlEnv, tokenEnv);
  if (!client) return { active: null, read: "skipped_no_env" };
  try {
    const row = await client.execute({ sql, args: [arg] });
    return { active: Number(row.rows[0]?.n ?? 0), read: "ok" };
  } catch (err) {
    console.error(`[hq/product-analytics] ${urlEnv} read failed:`, err);
    return { active: null, read: "error" };
  }
}

export async function getProductAnalytics(): Promise<ProductAnalytics> {
  const nowS = Math.floor(Date.now() / 1000);
  const nowMs = Date.now();
  const d30s = nowS - 30 * DAY_S;
  const d30ms = nowMs - 30 * DAY_MS;

  const [tasks, notesMod, tasksMod, roadmapMod, signalMod] = await Promise.all([
    readTasks(),
    // Notes (ms): distinct authors who touched a live note in 30d.
    readModuleActive(
      "NOTES_TURSO_URL",
      "NOTES_TURSO_TOKEN",
      "SELECT COUNT(DISTINCT user_id) AS n FROM notes WHERE archived_at IS NULL AND updated_at >= ?",
      d30ms,
    ),
    // Tasks (s): distinct users who did anything in 30d (activity log).
    readModuleActive(
      "TASKS_TURSO_URL",
      "TASKS_TURSO_TOKEN",
      "SELECT COUNT(DISTINCT user_id) AS n FROM activities WHERE created_at >= ?",
      d30s,
    ),
    // Roadmap/Timeline (s): distinct workspaces with item edits in 30d.
    readModuleActive(
      "ROADMAP_TURSO_URL",
      "ROADMAP_TURSO_TOKEN",
      "SELECT COUNT(DISTINCT workspace_slug) AS n FROM tasks WHERE updated_at >= ?",
      d30s,
    ),
    // Signal (ms): subscribers with a live cadence who were sent in 30d.
    // last_sent_at null (never sent) doesn't count as active engagement.
    readModuleActive(
      "ANALYTICS_TURSO_URL",
      "ANALYTICS_TURSO_TOKEN",
      "SELECT COUNT(*) AS n FROM user_preferences WHERE cadence != 'off' AND last_sent_at >= ?",
      d30ms,
    ),
  ]);

  // Usage by module: count only the modules we could actually read, so a
  // missing token reads as "not measured", never as "module inactive".
  const moduleReads = [notesMod, tasksMod, roadmapMod, signalMod];
  const readable = moduleReads.filter((m) => m.read === "ok").length;
  const active = moduleReads.filter((m) => (m.active ?? 0) > 0).length;
  const modulesActive = readable > 0 ? { active, readable } : null;

  return {
    activationPct: tasks.activationPct,
    retentionPct: tasks.retentionPct,
    churnPct: tasks.churnPct,
    onboardingPct: tasks.onboardingPct,
    modulesActive,
    reads: {
      tasks: tasks.read,
      notes: notesMod.read,
      roadmap: roadmapMod.read,
      analytics: signalMod.read,
    },
  };
}
