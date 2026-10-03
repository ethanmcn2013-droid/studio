import "server-only";
import { entitlementsDb } from "../entitlements-db/client";
import { runtimeUsageDependencies } from "../account/instrumentation/usage-runtime";
import type { HandlerDependencies } from "./handlers";
export function reportRuntime(): HandlerDependencies {
  const enabled = process.env.SPONSOR_REPORTS_ENABLED === "1" && process.env.SPONSOR_USAGE_ENVIRONMENT === "internal_test";
  const secret = process.env.SPONSOR_REPORT_ASSERTION_SECRET ?? "";
  if (!enabled || secret.length < 32 || secret === process.env.SPONSOR_USAGE_SERVICE_SECRET || secret === process.env.VENUE_ISSUANCE_SECRET) throw new Error("Sponsor reporting unavailable");
  const db = entitlementsDb();
  return { db: db.$client, secret, enabled, claims: async (sponsorId, now) => {
    const epochs = (process.env.SPONSOR_USAGE_ACCEPTED_EPOCHS ?? "").split(",").map(s => s.trim()).filter(Boolean);
    if (epochs.length !== 1 || !/^[a-f0-9]{8}$/.test(epochs[0])) throw new Error("Claim census unavailable");
    return runtimeUsageDependencies(db).eligible(sponsorId, epochs[0], 0, now);
  } };

}
