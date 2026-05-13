import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

function fail(msg: string): never {
  console.error(msg);
  process.exit(1);
}

async function main() {
  const [, , sponsorSlug] = process.argv;
  if (!sponsorSlug) {
    fail(
      [
        "Usage: pnpm partner:digest <sponsor-slug>",
        "",
        "Prints a one-paragraph activation summary for the sponsor,",
        "suitable for forwarding to the venue contact. Reads sponsors",
        "from studio's DB and joins live to Tasks's comp_codes +",
        "entitlements via TASKS_DATABASE_URL.",
      ].join("\n"),
    );
  }

  const { getPartnerStats } = await import("../src/lib/partners/stats");
  const stats = await getPartnerStats();
  const match = stats.find((s) => s.sponsor.slug === sponsorSlug);
  if (!match) {
    fail(
      `No sponsor with slug "${sponsorSlug}". Known slugs: ${
        stats.map((s) => s.sponsor.slug).join(", ") || "(none)"
      }`,
    );
  }

  console.log(buildDigest(match));
  process.exit(0);
}

type Stat = Awaited<
  ReturnType<typeof import("../src/lib/partners/stats").getPartnerStats>
>[number];

function buildDigest(s: Stat): string {
  const { sponsor, codesIssued, codesRedeemed, active30d, mostRecentRedemptionAt } = s;
  const date = new Date().toLocaleDateString("en-IE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const lines: string[] = [];
  lines.push(`${sponsor.name} update — ${date}.`);

  if (codesIssued === 0) {
    lines.push(
      `No codes have been issued yet. Run pnpm issue:codes ${sponsor.slug} <count> to mint the first batch.`,
    );
    return lines.join(" ");
  }

  const codeWord = codesIssued === 1 ? "code has" : "codes have";

  if (codesRedeemed === 0) {
    lines.push(
      `${codesIssued} ${codeWord} been issued; no couples have redeemed yet.`,
    );
    lines.push(
      `Codes are live and ready — every couple lands directly in a populated wedding workspace with ${sponsor.name}'s name on the welcome card.`,
    );
  } else {
    const redemptionPct = Math.round((codesRedeemed / codesIssued) * 100);
    const coupleWord = codesRedeemed === 1 ? "couple has" : "couples have";
    lines.push(
      `${codesIssued} ${codeWord} been issued; ${codesRedeemed} ${coupleWord} redeemed so far (${redemptionPct}%).`,
    );
    if (active30d > 0 && active30d !== codesRedeemed) {
      lines.push(
        `${active30d} of those ${
          active30d === 1 ? "redemption was" : "redemptions were"
        } in the last 30 days.`,
      );
    }
    if (mostRecentRedemptionAt) {
      lines.push(
        `Most recent: ${relativePhrase(mostRecentRedemptionAt)}.`,
      );
    }
    lines.push(
      `Each couple lands directly in a populated wedding workspace with ${sponsor.name}'s name on the welcome card.`,
    );
  }

  lines.push(`Reply if you'd like another batch of codes.`);

  return lines.join(" ");
}

function relativePhrase(epochMs: number): string {
  const diffMs = Date.now() - epochMs;
  const day = 86_400_000;
  if (diffMs < day) {
    const hours = Math.max(1, Math.round(diffMs / 3_600_000));
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }
  const days = Math.round(diffMs / day);
  if (days < 14) return `${days} ${days === 1 ? "day" : "days"} ago`;
  const weeks = Math.round(days / 7);
  return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
