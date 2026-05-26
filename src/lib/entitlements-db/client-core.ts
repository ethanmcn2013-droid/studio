import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * Drizzle client for the shared signal-entitlements DB.
 *
 * This core module is intentionally importable from both Next server
 * code and tsx operator scripts. The server-only wrapper lives in
 * `client.ts`.
 */
const url = process.env.TURSO_ENTITLEMENTS_DATABASE_URL;
const authToken = process.env.TURSO_ENTITLEMENTS_AUTH_TOKEN;

let cached: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function entitlementsDb() {
  if (cached) return cached;
  if (!url) {
    throw new Error(
      "TURSO_ENTITLEMENTS_DATABASE_URL is not set. Add it to .env.local " +
        "(see signal-entitlements Turso DB; provisioned 2026-05-14 in E-1).",
    );
  }
  const client = createClient({ url, authToken });
  cached = drizzle(client, { schema });
  return cached;
}
