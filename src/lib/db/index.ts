import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * Lazy Turso/libSQL client — same convention as
 * entitlements-db/client.ts. The connection is built on first *use*,
 * not at module import. `next build` imports every route module to
 * collect page data; an eager connection would throw there whenever
 * TURSO_STUDIO_DATABASE_URL is unset (the Preview environment, which
 * has no DB by design) and fail the whole deployment, even though no
 * query runs at build. Behaviour is otherwise identical: the same
 * explicit error is thrown the first time a query is attempted
 * without the env configured.
 */
function createDb() {
  const url = process.env.TURSO_STUDIO_DATABASE_URL;
  const authToken = process.env.TURSO_STUDIO_AUTH_TOKEN;

  if (!url) {
    throw new Error(
      "TURSO_STUDIO_DATABASE_URL is not set. Create a Turso database (turso db create ethanmcnamara-studio) and add the URL to .env.local. See docs/CYCLE_8_1_ENTITLEMENTS_HANDOFF.md.",
    );
  }

  return drizzle(createClient({ url, authToken }), { schema });
}

type DB = ReturnType<typeof createDb>;

let cached: DB | null = null;

function getDb(): DB {
  if (!cached) cached = createDb();
  return cached;
}

/**
 * Drop-in replacement for the eager `db` export — same import surface
 * (`import { db } from "@/lib/db"`) and the same typed Drizzle API.
 * Property access initialises the connection on first touch.
 */
export const db: DB = new Proxy({} as DB, {
  get(_target, prop, receiver) {
    const real = getDb();
    const value = Reflect.get(real as object, prop, receiver);
    return typeof value === "function" ? value.bind(real) : value;
  },
});
