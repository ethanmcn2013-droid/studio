// Intentionally no `import "server-only"` — this module is consumed
// by both the /hq/partners server component AND scripts/partner-digest.ts
// (run via tsx). The server-only guard would crash the CLI invocation.
import { eq } from "drizzle-orm";
import { createClient, type Client } from "@libsql/client";
import { db } from "@/lib/db";
import { sponsors, licenseCodes, type Sponsor } from "@/lib/db/schema";

export type PartnerStat = {
  sponsor: Sponsor;
  codesIssued: number;
  codesRedeemed: number;
  redeemed30d: number;
  /** Most recent redemption time across this sponsor's codes (ms epoch),
   *  or null when no couple has redeemed yet. */
  mostRecentRedemptionAt: number | null;
};

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Cross-DB read of Tasks's runtime tables. Studio's audit (license_codes)
 * is authoritative for *issued* counts; Tasks's comp_codes + entitlements
 * are authoritative for *redeemed* counts. `redeemed30d` is honest
 * about what it measures: redemptions started in the last 30 days,
 * NOT actual product engagement. The reconciliation doc explains why
 * studio's redemptions table sits empty.
 *
 * Reuses the same TASKS_DATABASE_URL + TASKS_AUTH_TOKEN that
 * scripts/issue-codes.ts already needs locally. For production reads
 * the same env vars must be set in studio's Vercel.
 */
function tasksClient(): Client {
  const url = process.env.TASKS_DATABASE_URL;
  const authToken = process.env.TASKS_AUTH_TOKEN;
  if (!url) {
    throw new Error(
      "TASKS_DATABASE_URL is not set on studio. /hq/partners needs cross-DB read access to Tasks's comp_codes + entitlements. Set TASKS_DATABASE_URL and TASKS_AUTH_TOKEN in studio's .env.local (local) and on Vercel (production).",
    );
  }
  return createClient({ url, authToken });
}

export async function getPartnerStats(): Promise<PartnerStat[]> {
  const rows = await db.select().from(sponsors).orderBy(sponsors.createdAt);
  if (rows.length === 0) return [];

  const tasksDb = tasksClient();
  try {
    return await Promise.all(
      rows.map(async (s) => {
        const codesIssued = await countIssued(s.id);
        const { codesRedeemed, redeemed30d, mostRecentRedemptionAt } =
          await readTasksForSponsor(tasksDb, s.slug);
        return {
          sponsor: s,
          codesIssued,
          codesRedeemed,
          redeemed30d,
          mostRecentRedemptionAt,
        };
      }),
    );
  } finally {
    tasksDb.close();
  }
}

async function countIssued(sponsorId: string): Promise<number> {
  const result = await db
    .select({ id: licenseCodes.id })
    .from(licenseCodes)
    .where(eq(licenseCodes.sponsorId, sponsorId));
  return result.length;
}

async function readTasksForSponsor(
  tasksDb: Client,
  sponsorSlug: string,
): Promise<{
  codesRedeemed: number;
  redeemed30d: number;
  mostRecentRedemptionAt: number | null;
}> {
  // comp_codes.notes is a JSON string containing { sponsor_slug, ... }
  // written by issue-codes.ts. SQLite json_extract reads it without
  // needing a generated column.
  const compCodesRows = await tasksDb.execute({
    sql: `
      SELECT code, redeemed
      FROM comp_codes
      WHERE notes IS NOT NULL
        AND json_extract(notes, '$.sponsor_slug') = ?
    `,
    args: [sponsorSlug],
  });

  let codesRedeemed = 0;
  const sponsorCodes: string[] = [];
  for (const row of compCodesRows.rows) {
    const code = String(row.code);
    sponsorCodes.push(code);
    const redeemed = Number(row.redeemed ?? 0);
    if (redeemed > 0) codesRedeemed += 1;
  }

  if (sponsorCodes.length === 0) {
    return { codesRedeemed: 0, redeemed30d: 0, mostRecentRedemptionAt: null };
  }

  // Tasks entitlements.notes is "comp:CODE" — match any of this
  // sponsor's codes. started_at is stored as a unix timestamp in
  // seconds (Drizzle `mode: "timestamp"`), so the cutoff is also
  // in seconds.
  const placeholders = sponsorCodes.map(() => "?").join(",");
  const notesValues = sponsorCodes.map((c) => `comp:${c}`);
  const cutoffSec = Math.floor((Date.now() - 30 * DAY_MS) / 1000);

  const entitlementsRows = await tasksDb.execute({
    sql: `
      SELECT started_at
      FROM entitlements
      WHERE source = 'comp'
        AND notes IN (${placeholders})
      ORDER BY started_at DESC
    `,
    args: notesValues,
  });

  let redeemed30d = 0;
  let mostRecentRedemptionAt: number | null = null;
  for (const row of entitlementsRows.rows) {
    const startedAtSec = Number(row.started_at ?? 0);
    if (!startedAtSec) continue;
    if (mostRecentRedemptionAt === null) {
      mostRecentRedemptionAt = startedAtSec * 1000;
    }
    if (startedAtSec >= cutoffSec) redeemed30d += 1;
  }

  return { codesRedeemed, redeemed30d, mostRecentRedemptionAt };
}
