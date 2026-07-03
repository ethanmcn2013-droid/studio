import "server-only";
import { isDemoMode } from "@/lib/access-mode";

/**
 * Boot-time environment validation for the Signal Studio umbrella.
 *
 * WARN-ONLY by deliberate exception to the suite pattern. Studio is the
 * public marketing umbrella + the internal HQ. The marketing site is mostly
 * static and must stay up even if HQ's database is misconfigured, so we do
 * NOT throw at boot here (that would take the public site down over an
 * internal-tool misconfig). Instead, missing production vars are surfaced
 * loudly in the boot logs (and Sentry), where the operator sees them, while
 * HQ/entitlement features degrade gracefully rather than 500ing the homepage.
 *
 * Enforces nothing in demo/review/dev. Dependency-free; called once from
 * instrumentation.ts `register()`.
 */

// Intentionally empty, see the warn-only rationale above.
const REQUIRED_IN_PRODUCTION: ReadonlyArray<readonly [string, string]> = [];

// HQ + entitlement enforcement need these; the public site does not.
const RECOMMENDED_IN_PRODUCTION: ReadonlyArray<readonly [string, string]> = [
  ["TURSO_STUDIO_DATABASE_URL", "Studio / HQ database"],
  ["TURSO_STUDIO_AUTH_TOKEN", "Studio / HQ database auth token"],
  ["TURSO_ENTITLEMENTS_DATABASE_URL", "shared tier entitlements"],
  ["TURSO_ENTITLEMENTS_AUTH_TOKEN", "shared tier entitlements auth token"],
];

let validated = false;

export function validateEnv(): void {
  if (validated) return;
  validated = true;

  const isProd = process.env.NODE_ENV === "production";
  if (!isProd || isDemoMode()) return; // dev / demo / review: nothing to check

  const missingRecommended = RECOMMENDED_IN_PRODUCTION.filter(
    ([key]) => !process.env[key],
  );
  if (missingRecommended.length > 0) {
    console.warn(
      "[env] missing recommended production variables (HQ / entitlements degraded):\n" +
        missingRecommended.map(([k, why]) => `  - ${k}, ${why}`).join("\n"),
    );
  }

  const missingRequired = REQUIRED_IN_PRODUCTION.filter(
    ([key]) => !process.env[key],
  );
  if (missingRequired.length > 0) {
    const detail = missingRequired
      .map(([k, why]) => `  - ${k}, ${why}`)
      .join("\n");
    throw new Error(
      `[env] FATAL: missing required production environment variables:\n${detail}`,
    );
  }
}
