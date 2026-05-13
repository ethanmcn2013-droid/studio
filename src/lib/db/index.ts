import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const url = process.env.TURSO_STUDIO_DATABASE_URL;
const authToken = process.env.TURSO_STUDIO_AUTH_TOKEN;

if (!url) {
  throw new Error(
    "TURSO_STUDIO_DATABASE_URL is not set. Create a Turso database (turso db create ethanmcnamara-studio) and add the URL to .env.local. See docs/CYCLE_8_1_ENTITLEMENTS_HANDOFF.md.",
  );
}

const client = createClient({ url, authToken });
export const db = drizzle(client, { schema });
