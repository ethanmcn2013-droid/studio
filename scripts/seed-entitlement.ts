import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { randomUUID } from "node:crypto";

function fail(msg: string): never {
  console.error(msg);
  process.exit(1);
}

async function main() {
  const { db } = await import("../src/lib/db");
  const {
    ENTITLEMENT_SOURCES,
    ENTITLEMENT_TIERS,
    entitlements,
  } = await import("../src/lib/db/schema");
  type Tier = (typeof ENTITLEMENT_TIERS)[number];
  type Source = (typeof ENTITLEMENT_SOURCES)[number];

  const [, , clerkId, tierArg, sourceArg, expiresAtArg, sourceRef] =
    process.argv;

  if (!clerkId) {
    fail(
      [
        "Usage: pnpm seed:entitlement <clerkId> <tier> <source> [expiresAtMs] [sourceRef]",
        "",
        `  tier:   one of ${ENTITLEMENT_TIERS.join(" | ")}`,
        `  source: one of ${ENTITLEMENT_SOURCES.join(" | ")}`,
        "  expiresAtMs: unix ms. omit or pass 'null' for no expiry.",
        "  sourceRef: optional reference id (license code id, stripe sub id, etc.)",
      ].join("\n"),
    );
  }

  if (!ENTITLEMENT_TIERS.includes(tierArg as Tier)) {
    fail(
      `tier must be one of ${ENTITLEMENT_TIERS.join(" | ")}, got '${tierArg}'`,
    );
  }
  if (!ENTITLEMENT_SOURCES.includes(sourceArg as Source)) {
    fail(
      `source must be one of ${ENTITLEMENT_SOURCES.join(" | ")}, got '${sourceArg}'`,
    );
  }

  const expiresAt =
    !expiresAtArg || expiresAtArg === "null"
      ? null
      : Number.parseInt(expiresAtArg, 10);

  if (expiresAt !== null && Number.isNaN(expiresAt)) {
    fail(
      `expiresAtMs must be a unix-ms integer or 'null', got '${expiresAtArg}'`,
    );
  }

  const row = {
    id: randomUUID(),
    userClerkId: clerkId,
    tier: tierArg,
    source: sourceArg,
    sourceRef: sourceRef ?? null,
    expiresAt,
    status: "active" as const,
  };

  await db.insert(entitlements).values(row);
  console.log("Seeded entitlement:");
  console.log(JSON.stringify(row, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
