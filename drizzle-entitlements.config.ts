import { config } from "dotenv";
import type { Config } from "drizzle-kit";

config({ path: ".env.local" });
config({ path: ".env" });

/**
 * drizzle-kit config for the shared signal-entitlements DB.
 *
 * Distinct from drizzle.config.ts (which is wired to the Studio-only
 * DB ethanmcnamara-studio). Run drizzle-kit commands against this
 * with `pnpm drizzle-kit push --config=drizzle-entitlements.config.ts`.
 */
export default {
  schema: "./src/lib/entitlements-db/schema.ts",
  out: "./drizzle-entitlements",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_ENTITLEMENTS_DATABASE_URL ?? "",
    authToken: process.env.TURSO_ENTITLEMENTS_AUTH_TOKEN,
  },
} satisfies Config;
