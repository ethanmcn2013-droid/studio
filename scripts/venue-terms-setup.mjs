/**
 * Guided setup for the Venue Edition terms migration.
 *
 * The operator-facing front door for `migrate-venue-edition-terms.mjs`. It
 * exists because the manual route asks a founder to find a dot-prefixed file
 * that Windows Explorer hides by default, type two variable names exactly
 * right, and then trust that a silent failure was a typo rather than a broken
 * migration. This asks two questions instead.
 *
 * What it will do:
 *   - append the two credentials to .env.local (never overwrites, never
 *     rewrites an existing line, takes a timestamped copy first)
 *   - run the migration in practice mode and show the target database
 *   - stop and ask before touching anything
 *
 * What it will not do: apply anything without a typed "yes".
 *
 *   node scripts/venue-terms-setup.mjs
 */
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, readFileSync, appendFileSync } from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const ROOT = path.resolve(import.meta.dirname, "..");
const ENV_FILE = path.join(ROOT, ".env.local");
const MIGRATION = path.join(ROOT, "scripts", "migrate-venue-edition-terms.mjs");

const URL_VAR = "TURSO_ENTITLEMENTS_DATABASE_URL";
const TOKEN_VAR = "TURSO_ENTITLEMENTS_AUTH_TOKEN";

const say = (...a) => console.log(...a);
const rule = () => say("─".repeat(66));

function envFileText() {
  return existsSync(ENV_FILE) ? readFileSync(ENV_FILE, "utf8") : "";
}

/** Is this variable already set, in the file or the environment? */
function alreadySet(name, modernName) {
  const text = envFileText();
  const inFile = new RegExp(`^\\s*(export\\s+)?${name}\\s*=`, "m").test(text);
  const inModern = new RegExp(`^\\s*(export\\s+)?${modernName}\\s*=`, "m").test(text);
  return inFile || inModern || Boolean(process.env[name] || process.env[modernName]);
}

function runMigration(extraArgs) {
  return spawnSync(process.execPath, [MIGRATION, ...extraArgs], {
    cwd: ROOT,
    encoding: "utf8",
  });
}

say("");
rule();
say("  Venue Edition terms migration — guided setup");
rule();
say("");
say("  This adds four empty columns to the entitlements database so the");
say("  couple access term and the unlimited entitlement have somewhere to");
say("  live. It changes no existing row and switches no venue to unlimited.");
say("");

const haveUrl = alreadySet(URL_VAR, "ENTITLEMENTS_DATABASE_URL");
const haveToken = alreadySet(TOKEN_VAR, "ENTITLEMENTS_AUTH_TOKEN");

const rl = createInterface({ input: stdin, output: stdout });

try {
  if (haveUrl && haveToken) {
    say("  Credentials are already in place. Skipping to the practice run.");
    say("");
  } else {
    say("  STEP 1 of 3 — the two credentials");
    say("");
    say("  Open https://turso.tech, sign in, and open the database called");
    say("  entitlements-prod. You need two values from it:");
    say("");
    say("    · the database URL  (starts with libsql://)");
    say("    · a token           (a long string of letters and numbers)");
    say("");
    say("  Paste them below. Nothing is shown back and nothing is sent");
    say("  anywhere except your own .env.local file.");
    say("");

    const url = (await rl.question("  Database URL: ")).trim();
    if (!url) {
      say("");
      say("  Nothing pasted. Stopped. Nothing was changed.");
      process.exit(1);
    }
    if (!/^libsql:\/\/|^https:\/\//.test(url)) {
      say("");
      say(`  That does not look like a database URL — it should start with`);
      say(`  libsql:// but you pasted "${url.slice(0, 24)}…".`);
      say("  Stopped. Nothing was changed.");
      process.exit(1);
    }

    const token = (await rl.question("  Token:        ")).trim();
    if (!token) {
      say("");
      say("  No token pasted. Stopped. Nothing was changed.");
      process.exit(1);
    }
    if (token.includes(" ")) {
      say("");
      say("  That token has a space in it, which means it was cut short or");
      say("  picked up extra text. Copy it again. Nothing was changed.");
      process.exit(1);
    }

    if (existsSync(ENV_FILE)) {
      const backup = `${ENV_FILE}.backup-${Date.now()}`;
      copyFileSync(ENV_FILE, backup);
      say("");
      say(`  Copy of your existing file saved as ${path.basename(backup)}`);
    }

    const existing = envFileText();
    const lead = existing.length && !existing.endsWith("\n") ? "\n" : "";
    appendFileSync(
      ENV_FILE,
      `${lead}\n# Shared entitlements DB — added by venue-terms-setup, ${new Date().toISOString().slice(0, 10)}\n` +
        `${URL_VAR}=${url}\n${TOKEN_VAR}=${token}\n`,
      "utf8",
    );
    say("  Saved to .env.local");
    say("");
  }

  say("  STEP 2 of 3 — practice run, changes nothing");
  say("");
  const dry = runMigration(["--dry-run"]);
  const dryOut = `${dry.stdout ?? ""}${dry.stderr ?? ""}`;
  for (const line of dryOut.trimEnd().split("\n")) say(`  │ ${line}`);
  say("");

  if (dry.status !== 0) {
    say("  The practice run did not succeed, so nothing will be applied.");
    say("  Send me the lines above and I will sort it.");
    process.exit(1);
  }

  const target = (dryOut.match(/^Database:\s+(.+)$/m) || [])[1] ?? "unknown";

  say("  STEP 3 of 3 — confirm and apply");
  say("");
  say(`  The database about to be changed is:  ${target}`);
  say("");
  say("  Check that is the production entitlements database and not a");
  say("  preview one. This is the only check that matters here.");
  say("");
  const answer = (await rl.question('  Type "yes" to apply, or press Enter to stop: ')).trim();

  if (answer.toLowerCase() !== "yes") {
    say("");
    say("  Stopped. Nothing was changed. Your credentials are saved, so");
    say("  running this again will jump straight to the practice run.");
    process.exit(0);
  }

  say("");
  const apply = runMigration([]);
  const applyOut = `${apply.stdout ?? ""}${apply.stderr ?? ""}`;
  for (const line of applyOut.trimEnd().split("\n")) say(`  │ ${line}`);
  say("");
  rule();
  if (apply.status === 0 && /VERIFIED/.test(applyOut)) {
    say("  Done. Tell Claude it is applied.");
    say("");
    say("  The next venue you onboard in Signal HQ will offer Unlimited as");
    say("  the issuance default instead of the old box that defaulted to 10.");
  } else {
    say("  It did not finish cleanly. Send me the lines above.");
    say("  The migration is additive and safe to re-run once fixed.");
  }
  rule();
  say("");
  process.exit(apply.status === 0 ? 0 : 1);
} finally {
  rl.close();
}
