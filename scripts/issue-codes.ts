import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { randomBytes, randomUUID } from "node:crypto";
import { createClient } from "@libsql/client";

function fail(msg: string): never {
  console.error(msg);
  process.exit(1);
}

// Per-couple codes: short, unambiguous, easy to read aloud. No 0/O/1/I/L.
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function generateCode(prefix: string, length = 5): string {
  const bytes = randomBytes(length);
  let suffix = "";
  for (let i = 0; i < length; i++) {
    suffix += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return `${prefix.toUpperCase()}-${suffix}`;
}

/**
 * Tier maps from Venue-Editions space → Tasks's entitlement-tier space.
 * Both schemas happen to align today; this function pins that alignment.
 */
function mapTier(studioTier: string): string {
  // Tasks: "free" | "pro" | "team" | "studio" | "wedding"
  switch (studioTier) {
    case "wedding":
      return "wedding";
    case "studio":
      return "studio";
    case "workspace":
      return "pro";
    case "event":
      return "wedding"; // one-time, like wedding
    default:
      return "free";
  }
}

/**
 * Tasks's comp_codes.duration_days is NOT NULL. Compliments ("no expiry")
 * normalize to ~10 years — well past any practical pilot horizon, and
 * Ethan can re-issue if anyone actually hits the wall.
 */
function normalizeDurationDays(studioDays: number | null): number {
  return studioDays ?? 3650;
}

async function main() {
  const { db } = await import("../src/lib/db");
  const {
    ENTITLEMENT_SOURCES,
    ENTITLEMENT_TIERS,
    sponsors,
    licenseCodes,
  } = await import("../src/lib/db/schema");
  const { eq } = await import("drizzle-orm");
  type Tier = (typeof ENTITLEMENT_TIERS)[number];
  type Source = (typeof ENTITLEMENT_SOURCES)[number];

  const [, , sponsorSlug, countArg, sourceType, tier, durationDaysArg] =
    process.argv;

  if (!sponsorSlug || !countArg) {
    fail(
      [
        "Usage: pnpm issue:codes <sponsor-slug> <count> [source-type] [tier] [duration-days]",
        "",
        "  sponsor-slug:  must match an existing sponsor.",
        "  count:         integer 1-500.",
        `  source-type:   default 'venue_edition'. one of ${ENTITLEMENT_SOURCES.join(" | ")}.`,
        `  tier:          default 'wedding'. one of ${ENTITLEMENT_TIERS.join(" | ")}.`,
        "  duration-days: default 365. pass 'null' for no expiry (compliments use null; Tasks normalizes to 10y).",
        "",
        "Writes to BOTH studio's license_codes (sponsor audit) AND Tasks's comp_codes",
        "(runtime redemption). Tasks's comp_codes.notes carries the sponsor JSON so",
        "the welcome card can name the sponsor without a cross-DB read.",
        "",
        "Prints CSV to stdout: code,sponsor_slug,tier,source_type,duration_days",
      ].join("\n"),
    );
  }

  const count = Number.parseInt(countArg, 10);
  if (Number.isNaN(count) || count < 1 || count > 500) {
    fail(`count must be an integer 1-500, got '${countArg}'`);
  }

  const resolvedSource = (sourceType ?? "venue_edition") as Source;
  const resolvedTier = (tier ?? "wedding") as Tier;
  if (!ENTITLEMENT_SOURCES.includes(resolvedSource)) {
    fail(`source-type must be one of ${ENTITLEMENT_SOURCES.join(" | ")}`);
  }
  if (!ENTITLEMENT_TIERS.includes(resolvedTier)) {
    fail(`tier must be one of ${ENTITLEMENT_TIERS.join(" | ")}`);
  }

  let durationDays: number | null = 365;
  if (durationDaysArg !== undefined) {
    if (durationDaysArg === "null") {
      durationDays = null;
    } else {
      durationDays = Number.parseInt(durationDaysArg, 10);
      if (Number.isNaN(durationDays)) {
        fail(
          `duration-days must be an integer or 'null', got '${durationDaysArg}'`,
        );
      }
    }
  }

  const sponsor = await db.query.sponsors.findFirst({
    where: eq(sponsors.slug, sponsorSlug),
  });
  if (!sponsor) {
    fail(
      `no sponsor with slug '${sponsorSlug}'. Run create:sponsor first.`,
    );
  }

  // Cross-repo write: connect to Tasks's Turso DB for comp_codes minting.
  const tasksUrl = process.env.TASKS_DATABASE_URL;
  const tasksToken = process.env.TASKS_AUTH_TOKEN;
  if (!tasksUrl || !tasksToken) {
    fail(
      "TASKS_DATABASE_URL + TASKS_AUTH_TOKEN must be set in studio's .env.local for issue-codes to mint into Tasks's comp_codes. See docs/CYCLE_8_3B_RECONCILIATION.md.",
    );
  }
  const tasksDb = createClient({ url: tasksUrl, authToken: tasksToken });

  const prefix = sponsor.slug.replace(/[^a-z0-9]/gi, "").slice(0, 8);
  const tasksTier = mapTier(resolvedTier);
  const tasksDurationDays = normalizeDurationDays(durationDays);
  const compNotes = JSON.stringify({
    sponsor_slug: sponsor.slug,
    sponsor_name: sponsor.name,
    source_type: resolvedSource,
    studio_tier: resolvedTier,
    studio_duration_days: durationDays,
  });

  const rows = Array.from({ length: count }, () => ({
    id: randomUUID(),
    sponsorId: sponsor.id,
    code: generateCode(prefix),
    sourceType: resolvedSource,
    tier: resolvedTier,
    durationDays,
  }));

  // Studio: license_codes row (sponsor audit / who-issued-what).
  await db.insert(licenseCodes).values(rows);

  // E-8 (2026-05-14): Mirror to shared signal-entitlements DB so all
  // five products can audit issuance from one source. The shared
  // schema is identical to Studio's local — the migrated rows from
  // E-2 stay in sync as new issuance lands here.
  try {
    const { entitlementsDb } = await import(
      "../src/lib/entitlements-db/client-core"
    );
    const { licenseCodes: sharedLicenseCodes } = await import(
      "../src/lib/entitlements-db/schema"
    );
    await entitlementsDb().insert(sharedLicenseCodes).values(rows);
  } catch (err) {
    console.warn(
      "[issue-codes] shared license_codes mirror failed (Studio local + Tasks still written):",
      err,
    );
  }

  // Tasks: comp_codes row (runtime redemption surface). Per-couple
  // semantics enforced by quantity=1.
  for (const row of rows) {
    await tasksDb.execute({
      sql: `INSERT INTO comp_codes (code, tier, duration_days, quantity, redeemed, notes)
            VALUES (?, ?, ?, 1, 0, ?)`,
      args: [row.code, tasksTier, tasksDurationDays, compNotes],
    });
  }

  // CSV output for the venue handoff.
  console.log("code,sponsor_slug,tier,source_type,duration_days");
  for (const row of rows) {
    console.log(
      [
        row.code,
        sponsor.slug,
        row.tier,
        row.sourceType,
        row.durationDays ?? "",
      ].join(","),
    );
  }
  console.error(
    `\nIssued ${count} codes for ${sponsor.name} (${sponsor.slug}). Studio: license_codes audit + Tasks: comp_codes runtime, both populated.`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
