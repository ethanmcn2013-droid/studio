import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as sharedSchema from "@/lib/entitlements-db/schema";
import * as studioSchema from "@/lib/db/schema";
import { applyVenueFulfilmentMigration } from "../../scripts/migrate-venue-fulfilment.mjs";

export async function venueFixture() {
  const directory = mkdtempSync(join(tmpdir(), "signal-venue-fulfilment-"));
  const sharedUrl = pathToFileURL(join(directory, "shared.db")).href;
  const studioUrl = pathToFileURL(join(directory, "studio.db")).href;
  const sharedClient = createClient({ url: sharedUrl }), studioClient = createClient({ url: studioUrl });
  await sharedClient.executeMultiple(readFileSync(new URL("../../drizzle-entitlements/0000_init.sql", import.meta.url), "utf8"));
  await studioClient.executeMultiple(readFileSync(new URL("../../drizzle/0000_init.sql", import.meta.url), "utf8"));
  // Existing additive Venue terms, not part of or rewritten by migration0001.
  for (const ddl of ["allotment_mode text NOT NULL DEFAULT 'limited'", "annual_wedding_count integer", "fair_use_ceiling integer",
    "founding_number integer", "founding_number_assigned_at integer"]) await sharedClient.execute("ALTER TABLE sponsors ADD COLUMN " + ddl);
  await sharedClient.execute("ALTER TABLE entitlements ADD COLUMN wedding_date integer");
  await applyVenueFulfilmentMigration(sharedClient);
  await sharedClient.execute("PRAGMA foreign_keys=ON");
  await studioClient.execute("PRAGMA foreign_keys=ON");
  return { directory, sharedUrl, studioUrl, sharedClient, studioClient,
    shared: drizzle(sharedClient, { schema: sharedSchema }), studio: drizzle(studioClient, { schema: studioSchema }),
    cleanup() {
      sharedClient.close(); studioClient.close();
      if (resolve(directory).startsWith(resolve(tmpdir()) + "\\signal-venue-fulfilment-") ||
          resolve(directory).startsWith(resolve(tmpdir()) + "/signal-venue-fulfilment-")) {
        try { rmSync(directory, { recursive: true, force: true }); } catch { /* Windows native handles may close later. */ }
      }
    },
  };
}
