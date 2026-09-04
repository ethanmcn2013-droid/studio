import { config } from "dotenv";

/** Record verified cleared payment, never signature or plan selection.
 * See docs/guides/venue-payment.md for evidence and partial-failure recovery.
 */
async function main() {
  const [slug, plan, ...args] = process.argv.slice(2);
  const usage = "Usage: pnpm venue:paid <slug> <founding|paid> --reference <opaque-receipt-id> --paid-at <UTC-ISO-time> --amount-cents <100000|150000> --actor-id <id> --actor-name <name>";
  if (!slug || (plan !== "founding" && plan !== "paid")) throw new Error(usage);
  const allowed = new Set(["--reference", "--paid-at", "--amount-cents", "--actor-id", "--actor-name"]);
  const flags = new Map<string, string>();
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i], value = args[i + 1];
    if (!allowed.has(key) || flags.has(key) || !value || value.startsWith("--")) throw new Error(usage);
    flags.set(key, value);
  }
  if (flags.size !== allowed.size) throw new Error(usage);
  const time = flags.get("--paid-at")!;
  const paidAt = Date.parse(time);
  if (!Number.isFinite(paidAt) || new Date(paidAt).toISOString() !== time) {
    throw new Error("Use the exact UTC cleared-payment time, for example 2027-01-21T12:00:00.000Z.");
  }
  if (!/^\d+$/.test(flags.get("--amount-cents")!)) throw new Error("Amount must be integer cents.");

  config({ path: ".env.local", quiet: true });
  config({ path: ".env", quiet: true });
  const [{ db }, { entitlementsDb }, { recordVenuePayment }] = await Promise.all([
    import("../src/lib/db"), import("../src/lib/entitlements-db/client-core"),
    import("../src/lib/entitlements-db/venue-payment"),
  ]);
  const result = await recordVenuePayment({
    slug, plan, reference: flags.get("--reference")!, paidAt,
    amountCents: Number(flags.get("--amount-cents")),
    actorId: flags.get("--actor-id")!, actorName: flags.get("--actor-name")!,
  }, { studio: db, shared: entitlementsDb() });
  console.log(`[mark-venue-paid] ${slug}: ${result.replayed ? "existing evidence replayed" : "payment recorded"}; Studio mirror complete; event ${result.eventId}.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Payment recording failed.");
  console.error("If a write may have started, retry only with exactly the same evidence. No success is reported until both stores agree.");
  process.exitCode = 1;
});
