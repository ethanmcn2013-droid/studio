// ── In-process rate limiter for the /redeem/[code] lookup ─────────────
// Mirrors the proven limiter in src/app/hq/access/check/route.ts. Kept as
// a deliberate small duplicate rather than refactoring the working HQ gate
// — that path is security-load-bearing and not worth destabilising for DRY.
//
// Scope of the threat: redemption codes are sponsor-issued, finite, and a
// hit only reveals redemption *state* (claimable / used / revoked), never a
// credential. So this is enumeration friction, not a hard auth boundary.
// An in-process Map is per-serverless-instance (not shared across lambdas,
// resets on cold start) — it still raises the cost of scripted enumeration
// by an order of magnitude without new infra, which is the right trade for
// a surface of this value. Upstash/Turnstile would be disproportionate.

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_LOOKUPS = 10; // a real claimant hits this a handful of times
const hits = new Map<string, { count: number; resetAt: number }>();

/** Returns true if the lookup is allowed, false if the IP is over budget. */
export function checkRedeemRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_LOOKUPS) return false;

  entry.count += 1;
  return true;
}

export function ipFromForwardedFor(forwarded: string | null): string {
  if (forwarded) return forwarded.split(",")[0].trim();
  return "dev-fallback";
}

export const REDEEM_RATE_WINDOW_MS = WINDOW_MS;
