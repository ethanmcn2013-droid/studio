import "server-only";

/**
 * Drizzle client for the shared signal-entitlements DB.
 *
 * Connection envs:
 *   - ENTITLEMENTS_DATABASE_URL, required
 *   - ENTITLEMENTS_AUTH_TOKEN, required in prod
 *
 * On preview/dev environments where the envs are unset the client
 * throws on first use, not at import time, so build-time prerender
 * doesn't crash. Reads should always be wrapped in try/catch and
 * default to `free` on failure, entitlements should NEVER take a
 * product down.
 */
export { entitlementsDb } from "./client-core";
