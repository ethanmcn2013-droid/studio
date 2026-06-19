/**
 * Next.js 16 instrumentation hook. Runs once at server boot.
 *
 * Used here to surface environment misconfiguration at boot (warn-only for
 * the umbrella — see src/env.ts for why Studio does not hard-fail).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { validateEnv } = await import("@/env");
    validateEnv();
  }
}
