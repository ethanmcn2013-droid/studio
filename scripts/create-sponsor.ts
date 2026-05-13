import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { randomUUID } from "node:crypto";

function fail(msg: string): never {
  console.error(msg);
  process.exit(1);
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function main() {
  const { db } = await import("../src/lib/db");
  const { sponsors } = await import("../src/lib/db/schema");

  const [, , slug, name, contactEmail, brandMetaJson] = process.argv;

  if (!slug || !name || !contactEmail) {
    fail(
      [
        "Usage: pnpm create:sponsor <slug> <name> <contact-email> [brand-meta-json]",
        "",
        "  slug:          kebab-case identifier (a-z, 0-9, hyphens). Used in redemption URLs.",
        "  name:          display name (e.g. \"Lamb's Hill\").",
        "  contact-email: primary venue contact.",
        "  brand-meta-json: optional JSON string for venue-specific data.",
      ].join("\n"),
    );
  }
  if (!SLUG_RE.test(slug)) {
    fail(`slug must be lowercase letters/digits/hyphens only, got '${slug}'`);
  }
  if (!contactEmail.includes("@")) {
    fail(`contact-email looks malformed: '${contactEmail}'`);
  }
  if (brandMetaJson) {
    try {
      JSON.parse(brandMetaJson);
    } catch {
      fail(`brand-meta-json is not valid JSON: ${brandMetaJson}`);
    }
  }

  const row = {
    id: randomUUID(),
    slug,
    name,
    contactEmail,
    brandMeta: brandMetaJson ?? null,
  };

  await db.insert(sponsors).values(row);
  console.log("Created sponsor:");
  console.log(JSON.stringify(row, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
