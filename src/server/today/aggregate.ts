import "server-only";
import { createClient, type Client } from "@libsql/client";
import type {
  AnalyticsCadence,
  AnalyticsSummary,
  NoteSummary,
  TimelineMilestone,
  TimelineSummary,
  TaskSummary,
  TodayRequest,
  TodayResponse,
} from "./types";

/**
 * Cross-suite Today aggregation.
 *
 * Reads the four product Tursos with **separate, dedicated read-only
 * tokens**. Each product's Turso URL + token lives under a distinct
 * env namespace inside the studio deployment so the four product
 * apps don't collide on `TURSO_DATABASE_URL`:
 *
 *   TASKS_TURSO_URL       / TASKS_TURSO_TOKEN
 *   NOTES_TURSO_URL       / NOTES_TURSO_TOKEN
 *   ROADMAP_TURSO_URL     / ROADMAP_TURSO_TOKEN
 *   ANALYTICS_TURSO_URL   / ANALYTICS_TURSO_TOKEN
 *   SUITE_API_KEY                              (route Bearer)
 *
 * Provisioning checklist for a fresh studio deployment lives at
 * `docs/ios/today-api.md` § Operator provisioning.
 *
 * When a product's env pair is missing we return `null` for that
 * slice and `"skipped_no_env"` in the `reads` health map. The
 * response is always well-formed JSON — no product outage causes the
 * whole aggregation to fail.
 *
 * Reads that throw are logged via `console.error` (Vercel's stdout
 * is the sink) and reported as `"error"` in the health map so the
 * client can surface a brief unavailable hint instead of an
 * incorrectly-empty state.
 *
 * **Known v1 limitations** (named so they're not surprises later):
 *  - Timeline member workspaces are silently omitted. Timeline's schema
 *    has no workspace_members table — only the workspace OWNER's
 *    milestones surface here. Membership-only users see empty.
 *  - The Signal email-subscription DB is not read here; cadence
 *    comes from Tasks' `user_preferences.daily_signal_cadence` which
 *    Signal treats as the source of truth at briefing time.
 *
 * **Future evolution** — when studio gains Clerk middleware, this
 * route should migrate from the `SUITE_API_KEY` Bearer to a Clerk
 * session check, and derive `clerkId` from the session rather than
 * trusting the request body. That's a one-cycle migration on top of
 * adding `@clerk/nextjs` to studio's deps.
 */

const MS_PER_DAY = 86_400_000;
const SEVEN_DAYS_MS = 7 * MS_PER_DAY;
const ONE_DAY_MS = MS_PER_DAY;

const KNOWN_CADENCES: readonly AnalyticsCadence[] = ["off", "weekdays", "daily"];

function coerceCadence(raw: unknown): AnalyticsCadence {
  return (KNOWN_CADENCES as readonly string[]).includes(String(raw))
    ? (String(raw) as AnalyticsCadence)
    : "off";
}

type ProductRead = "ok" | "skipped_no_env" | "error";

function clientForEnv(urlEnv: string, tokenEnv: string): Client | null {
  const url = process.env[urlEnv];
  const token = process.env[tokenEnv];
  if (!url || !token) return null;
  return createClient({ url, authToken: token });
}

async function readTasks(
  req: TodayRequest,
): Promise<{ data: TaskSummary[] | null; read: ProductRead }> {
  const client = clientForEnv("TASKS_TURSO_URL", "TASKS_TURSO_TOKEN");
  if (!client) return { data: null, read: "skipped_no_env" };

  try {
    // Resolve internal user id via Clerk id first, then email fallback.
    const userRow = await client.execute({
      sql: "SELECT id FROM users WHERE clerk_id = ? OR email = ? LIMIT 1",
      args: [req.clerkId, req.email],
    });
    const userId = userRow.rows[0]?.id;
    if (!userId) return { data: [], read: "ok" };

    // Workspaces the user owns OR is a member of.
    const wsRows = await client.execute({
      sql: `
        SELECT DISTINCT w.id, w.name
        FROM workspaces w
        LEFT JOIN workspace_members m ON m.workspace_id = w.id
        WHERE w.owner_user_id = ? OR m.user_id = ?
      `,
      args: [userId, userId],
    });

    const now = Date.now();
    const todayStart = Math.floor(now / ONE_DAY_MS) * ONE_DAY_MS;
    const tomorrowEnd = todayStart + ONE_DAY_MS;
    const yesterday = now - ONE_DAY_MS;

    const summaries: TaskSummary[] = [];
    for (const ws of wsRows.rows) {
      const wsId = String(ws.id);
      const wsName = String(ws.name);

      // "In your court" = unfinished tasks that are either overdue,
      // due today, OR assigned to the user. No lower bound on due_at
      // because an overdue task still belongs in your court — the
      // field name + type comment both name this as the intent.
      // The assignees JSON-LIKE pattern uses the userId surrounded by
      // double-quotes so we don't substring-match nested ids.
      const inCourtRes = await client.execute({
        sql: `
          SELECT COUNT(*) AS c FROM tasks
          WHERE workspace_id = ? AND lane != 'shipped'
            AND ((due_at IS NOT NULL AND due_at < ?)
                 OR (assignees IS NOT NULL AND assignees LIKE ?))
        `,
        args: [wsId, Math.floor(tomorrowEnd / 1000), `%"${String(userId)}"%`],
      });
      const inYourCourt = Number(inCourtRes.rows[0]?.c ?? 0);

      const blockedRes = await client.execute({
        sql: `SELECT COUNT(*) AS c FROM tasks
              WHERE workspace_id = ? AND lane != 'shipped'
                AND blocked_by IS NOT NULL
                AND blocked_by != '[]'`,
        args: [wsId],
      });
      const blocked = Number(blockedRes.rows[0]?.c ?? 0);

      // Approximate ship-rate signal. Tasks has no transition-time
      // column — `updated_at` is the closest proxy for "recently
      // shipped." A shipped-lane task that was edited (title, comment)
      // within 24h registers here even if the ship happened earlier.
      // Named in the type's JSDoc.
      const shippedRes = await client.execute({
        sql: `SELECT COUNT(*) AS c FROM tasks
              WHERE workspace_id = ? AND lane = 'shipped'
                AND updated_at >= ?`,
        args: [wsId, Math.floor(yesterday / 1000)],
      });
      const shippedLast24h = Number(shippedRes.rows[0]?.c ?? 0);

      summaries.push({
        workspaceId: wsId,
        workspaceName: wsName,
        inYourCourt,
        blocked,
        shippedLast24h,
      });
    }
    return { data: summaries, read: "ok" };
  } catch (err) {
    console.error("[today/aggregate] tasks read failed:", err);
    return { data: null, read: "error" };
  }
}

async function readNotes(
  req: TodayRequest,
): Promise<{ data: NoteSummary | null; read: ProductRead }> {
  const client = clientForEnv("NOTES_TURSO_URL", "NOTES_TURSO_TOKEN");
  if (!client) return { data: null, read: "skipped_no_env" };

  try {
    const totalRes = await client.execute({
      sql: "SELECT COUNT(*) AS c FROM notes WHERE user_id = ? AND archived_at IS NULL",
      args: [req.clerkId],
    });
    const total = Number(totalRes.rows[0]?.c ?? 0);

    const lastRes = await client.execute({
      sql: `SELECT updated_at, body FROM notes
            WHERE user_id = ? AND archived_at IS NULL
            ORDER BY updated_at DESC LIMIT 1`,
      args: [req.clerkId],
    });
    const lastRow = lastRes.rows[0];
    const lastTouchedAt = lastRow ? Number(lastRow.updated_at) : null;
    let lastExcerpt: string | null = null;
    if (lastRow?.body) {
      const firstLine = String(lastRow.body).split("\n")[0]?.trim() ?? "";
      lastExcerpt = firstLine.length > 80
        ? firstLine.slice(0, 79) + "…"
        : firstLine || null;
    }

    return { data: { total, lastTouchedAt, lastExcerpt }, read: "ok" };
  } catch (err) {
    console.error("[today/aggregate] notes read failed:", err);
    return { data: null, read: "error" };
  }
}

async function readTimeline(
  req: TodayRequest,
): Promise<{ data: TimelineSummary | null; read: ProductRead }> {
  const client = clientForEnv("ROADMAP_TURSO_URL", "ROADMAP_TURSO_TOKEN");
  if (!client) return { data: null, read: "skipped_no_env" };

  try {
    // Timeline schema has no `workspace_members` table — only owner
    // surfaces here. Membership-only users see an empty summary.
    // Named as a v1 limitation in the file header.
    const wsRows = await client.execute({
      sql: "SELECT slug, name FROM workspaces WHERE owner_user_id = ?",
      args: [req.clerkId],
    });
    const slugs = wsRows.rows.map((r) => String(r.slug));
    if (slugs.length === 0) {
      return {
        data: { upcoming: [], shippedLast7d: 0 },
        read: "ok",
      };
    }

    const inClause = slugs.map(() => "?").join(",");
    const upcomingRes = await client.execute({
      sql: `
        SELECT t.workspace_slug, t.title, t.target_date, t.status, w.name
        FROM tasks t
        JOIN workspaces w ON w.slug = t.workspace_slug
        WHERE t.workspace_slug IN (${inClause})
          AND t.kind = 'milestone'
          AND t.status IN ('next', 'in-flight')
        ORDER BY COALESCE(t.target_date, '9999-12-31') ASC
        LIMIT 5
      `,
      args: slugs,
    });

    const upcoming: TimelineMilestone[] = upcomingRes.rows.map((r) => ({
      workspaceSlug: String(r.workspace_slug),
      workspaceName: String(r.name),
      title: String(r.title),
      targetDate: r.target_date ? String(r.target_date) : null,
      status: String(r.status),
    }));

    const sevenDaysAgo = Math.floor((Date.now() - SEVEN_DAYS_MS) / 1000);
    const shippedRes = await client.execute({
      sql: `SELECT COUNT(*) AS c FROM tasks
            WHERE workspace_slug IN (${inClause})
              AND kind = 'milestone'
              AND status = 'shipped'
              AND completed_at >= ?`,
      args: [...slugs, sevenDaysAgo],
    });
    const shippedLast7d = Number(shippedRes.rows[0]?.c ?? 0);

    return { data: { upcoming, shippedLast7d }, read: "ok" };
  } catch (err) {
    console.error("[today/aggregate] roadmap read failed:", err);
    return { data: null, read: "error" };
  }
}

async function readAnalytics(
  req: TodayRequest,
): Promise<{ data: AnalyticsSummary | null; read: ProductRead }> {
  const analyticsClient = clientForEnv(
    "ANALYTICS_TURSO_URL",
    "ANALYTICS_TURSO_TOKEN",
  );
  const tasksClient = clientForEnv("TASKS_TURSO_URL", "TASKS_TURSO_TOKEN");
  // The cadence is the source of truth for whether Signal is on,
  // and it lives on the Tasks DB. If the Tasks token isn't wired we
  // can't answer the question — report `skipped_no_env` rather than
  // a confidently-wrong `"off"` cadence. The analytics-only token is
  // optional; it only fills in the timezone.
  if (!tasksClient) {
    return { data: null, read: "skipped_no_env" };
  }

  try {
    let timezone: string | null = null;
    if (analyticsClient) {
      const tzRow = await analyticsClient.execute({
        sql: "SELECT timezone FROM analytics_users WHERE clerk_id = ? LIMIT 1",
        args: [req.clerkId],
      });
      timezone = tzRow.rows[0]?.timezone
        ? String(tzRow.rows[0].timezone)
        : null;
    }

    // Cadence lives on Tasks' `user_preferences.daily_signal_cadence`
    // — the same column Signal reads at briefing time. Pulling it
    // from there (rather than the Signal email-subscription DB)
    // gives us the canonical answer with the token we already have.
    let cadence: AnalyticsCadence = "off";
    if (tasksClient) {
      // Resolve internal user id first.
      const userRow = await tasksClient.execute({
        sql: "SELECT id FROM users WHERE clerk_id = ? OR email = ? LIMIT 1",
        args: [req.clerkId, req.email],
      });
      const userId = userRow.rows[0]?.id;
      if (userId) {
        const prefRow = await tasksClient.execute({
          sql: "SELECT daily_signal_cadence FROM user_preferences WHERE user_id = ? LIMIT 1",
          args: [String(userId)],
        });
        cadence = coerceCadence(prefRow.rows[0]?.daily_signal_cadence);
      }
    }

    const enabled = cadence !== "off";
    return {
      data: { enabled, timezone, cadence },
      read: "ok",
    };
  } catch (err) {
    console.error("[today/aggregate] analytics read failed:", err);
    return { data: null, read: "error" };
  }
}

export async function aggregateToday(req: TodayRequest): Promise<TodayResponse> {
  const [tasksRes, notesRes, roadmapRes, analyticsRes] = await Promise.all([
    readTasks(req),
    readNotes(req),
    readTimeline(req),
    readAnalytics(req),
  ]);

  return {
    generatedAt: Date.now(),
    tasks: tasksRes.data,
    notes: notesRes.data,
    roadmap: roadmapRes.data,
    analytics: analyticsRes.data,
    reads: {
      tasks: tasksRes.read,
      notes: notesRes.read,
      roadmap: roadmapRes.read,
      analytics: analyticsRes.read,
    },
  };
}
