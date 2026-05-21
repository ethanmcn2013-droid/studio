#!/usr/bin/env node
// verify-clerk-apple.mjs
//
// Reads each product's CLERK_SECRET_KEY from the per-product .env.local
// (or process env), hits Clerk's admin API to list enabled OAuth providers,
// reports a pass/fail per product for whether Apple sign-in is enabled.
//
// Read-only. Does not mutate any Clerk state.
//
// Usage:
//   cd ~/Projects/personal/studio && node scripts/verify-clerk-apple.mjs
//
// Required envs (any of these will be read; per-product .env.local first):
//   CLERK_SECRET_KEY_TASKS
//   CLERK_SECRET_KEY_ROADMAP
//   CLERK_SECRET_KEY_ANALYTICS
//   CLERK_SECRET_KEY_NOTES
//
// Or — fallback — the script reads ~/Projects/personal/<product>/.env.local
// for the bare CLERK_SECRET_KEY in each product's own env file.

import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const PRODUCTS = ["tasks", "roadmap", "analytics", "notes"];

const HOME = homedir();

async function readSecretFromEnvFile(product) {
  const envPath = join(HOME, "Projects", "personal", product, ".env.local");
  try {
    const contents = await readFile(envPath, "utf8");
    const line = contents
      .split("\n")
      .find((l) => l.startsWith("CLERK_SECRET_KEY="));
    if (!line) return null;
    return line.split("=").slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
  } catch {
    return null;
  }
}

function readSecretFromProcessEnv(product) {
  const key = `CLERK_SECRET_KEY_${product.toUpperCase()}`;
  return process.env[key] ?? null;
}

async function getSecretFor(product) {
  const fromEnv = readSecretFromProcessEnv(product);
  if (fromEnv) return { value: fromEnv, source: `process.env.CLERK_SECRET_KEY_${product.toUpperCase()}` };
  const fromFile = await readSecretFromEnvFile(product);
  if (fromFile) return { value: fromFile, source: `~/Projects/personal/${product}/.env.local` };
  return null;
}

async function fetchEnabledProviders(secret) {
  // Clerk admin API surface for OAuth providers lives at
  // https://api.clerk.com/v1/oauth_applications — that lists the
  // instance's OAuth provider configs. For provider toggles we hit
  // /v1/instance which returns the current instance settings including
  // the social-connections object.
  //
  // Docs: https://clerk.com/docs/reference/backend-api/tag/Instance
  const url = "https://api.clerk.com/v1/instance";
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${body.slice(0, 200)}`);
  }
  const json = await res.json();
  // The instance payload's `restrictions` and `sign_in` blocks list
  // enabled connections. Variant shapes across Clerk versions; we look
  // for any field that names oauth providers.
  const providers = new Set();
  function walk(node) {
    if (!node || typeof node !== "object") return;
    for (const [k, v] of Object.entries(node)) {
      if (typeof v === "boolean" && v && /^(oauth_|enable.*apple|enable.*google)/i.test(k)) {
        providers.add(k.replace(/^enabled?_/, "").replace(/^oauth_/, ""));
      }
      if (typeof v === "object") walk(v);
    }
  }
  walk(json);
  // Empty-providers fallback. Clerk's /v1/instance shape is undocumented and
  // may change across Clerk versions — if the walk finds nothing, that's a
  // signal the regex no longer matches the live API, not necessarily that
  // Apple is disabled. Caller surfaces this in the report so an operator
  // can manually inspect `raw` before re-running dashboard config.
  return { providers: [...providers].sort(), raw: json };
}

async function main() {
  console.log("Apple sign-in verification — Clerk instance audit");
  console.log("==================================================");

  let allPass = true;

  for (const product of PRODUCTS) {
    const secret = await getSecretFor(product);
    if (!secret) {
      console.log(`\n${product.toUpperCase()} — SKIP (no CLERK_SECRET_KEY found in env or ~/.env.local)`);
      allPass = false;
      continue;
    }

    process.stdout.write(`\n${product.toUpperCase()} — `);
    try {
      const { providers } = await fetchEnabledProviders(secret.value);
      const hasApple = providers.some((p) => p.toLowerCase().includes("apple"));
      console.log(hasApple ? "PASS (apple enabled)" : "FAIL (apple not enabled)");
      console.log(`  Source: ${secret.source}`);
      console.log(`  Providers detected: ${providers.length ? providers.join(", ") : "(none detected — Clerk API shape may have changed; check manually)"}`);
      if (!hasApple) allPass = false;
    } catch (err) {
      console.log(`ERROR — ${err.message}`);
      allPass = false;
    }
  }

  console.log("\n==================================================");
  console.log(allPass ? "Overall: PASS" : "Overall: FAIL — remediate per docs/ios/apple-signin-runbook.md");
  process.exit(allPass ? 0 : 1);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(2);
});
