import "server-only";
import type { UsageDatabase } from "./verified-ingest";

type Transaction = Parameters<Parameters<UsageDatabase["transaction"]>[0]>[0];

/** Retry only SQLite writer contention with a fresh transaction. Unknown commit
 * outcomes surface to the durable sender/job; their logical writes are idempotent.
 * The local libSQL driver can also leave a failed BEGIN's statement busy until
 * the next connection, so a single immediate retry is insufficient. */
export async function usageTransaction<T>(database: UsageDatabase, work: (tx: Transaction) => Promise<T>): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try { return await database.transaction(work, { behavior: "immediate" }); }
    catch (error) {
      const cause = error as { code?: string; cause?: { code?: string } };
      if (attempt >= 5 || (cause.code !== "SQLITE_BUSY" && cause.cause?.code !== "SQLITE_BUSY")) throw error;
      await new Promise(resolve => setTimeout(resolve, 25 * 2 ** attempt));
    }
  }
}
