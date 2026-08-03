/**
 * Signal HQ access gate.
 *
 * This is NOT Clerk. It is one shared password in front of the whole
 * operator-only /hq surface: Today, Money, Company, Vault, Atlas, Decks,
 * Founders Circle, the Data Room, Access and Account Review. The gate
 * runs at the edge in `src/proxy.ts` for `/hq/:path*` and is re-checked
 * per page.
 *
 * ── What changed on 2026-08-03, and why (E08.05, R-043) ────────────────
 *
 * The v1 session cookie was `sha256("signal-hq-session:v1:" + password)`.
 * Three things were wrong with that, and only the first is obvious:
 *
 *   1. It was DERIVABLE. Anyone holding the password could compute the
 *      cookie offline without ever hitting the login route.
 *   2. It was an OFFLINE ORACLE FOR THE PASSWORD. A single unsalted
 *      SHA-256 over a short human-chosen secret is recovered in seconds
 *      on commodity hardware. The cookie is written to a browser jar,
 *      shows up in screenshots, in shared devices, in support threads —
 *      and a leaked cookie therefore leaked the password itself, which
 *      is the credential for every HQ room at once.
 *   3. It CARRIED NO EXPIRY. The only expiry was the cookie's own
 *      max-age, which the client controls. A copied cookie value stayed
 *      valid until the password was rotated.
 *
 * v2 fixes all three. The token is `v2.<issuedAtMs>.<hmac>`:
 *
 *   - the signing key is PBKDF2-SHA256 over the password, so recovering
 *     the password from a leaked cookie costs the full iteration count
 *     per guess instead of one hash;
 *   - the signature is an HMAC the holder cannot forge without the key;
 *   - the issue time is inside the signed token, so expiry is a server
 *     fact, not a client courtesy.
 *
 * ── What this still is NOT, stated plainly ─────────────────────────────
 *
 * It is a shared password. There is no per-person identity, no venue
 * account, no revocation of one holder without rotating for everyone,
 * and no audit trail that can attribute an action to a named person.
 * R-043 records this and E07.16 holds the options. **A venue must not be
 * given this password**: it opens every HQ room, not a venue's own view.
 * Nothing in this file changes that, and no surface may describe it as
 * venue authentication.
 *
 * ── Runtime ────────────────────────────────────────────────────────────
 *
 * Web Crypto only (`crypto.subtle`), and a pure-JS constant-time compare.
 * `src/proxy.ts` imports this module, so it must run unchanged on the
 * Edge runtime as well as on Node; `node:crypto`'s `timingSafeEqual` is
 * deliberately not used.
 */

export const HQ_ACCESS_COOKIE = "signal_hq_access";
export const HQ_ACCESS_MAX_AGE = 60 * 60 * 12;

/** Session token format version. Bumping it invalidates every session. */
export const HQ_SESSION_VERSION = "v2";

/** A token is refused this far past its issue time, regardless of cookie age. */
const SESSION_TTL_MS = HQ_ACCESS_MAX_AGE * 1000;

/**
 * A token issued more than this far in the future is refused outright, so
 * a forged future date cannot buy an unbounded session. Generous enough
 * to absorb ordinary clock skew between a serverless region and a laptop.
 */
const MAX_CLOCK_SKEW_MS = 5 * 60 * 1000;

/**
 * PBKDF2 iterations for the session-signing key. The cost is paid once
 * per process (see `keyCache`), not once per request; the attacker pays
 * it once per password guess.
 */
const KEY_ITERATIONS = 150_000;
const KEY_SALT = "signal-hq-session-key:v2";

const encoder = new TextEncoder();

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return toHex(digest);
}

/**
 * Constant-time string comparison. Compares every character of the longer
 * input so neither the length nor the position of the first difference is
 * observable in the timing.
 */
function constantTimeEqual(a: string, b: string): boolean {
  const length = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < length; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

export function getHqPassword() {
  return process.env.SIGNAL_HQ_PASSWORD?.trim() ?? "";
}

export function isHqPasswordConfigured() {
  return getHqPassword().length > 0;
}

/**
 * Memoised per process. Recomputed only when the password changes, which
 * in practice means a redeploy after a rotation.
 */
let keyCache: { password: string; key: CryptoKey } | null = null;

async function sessionSigningKey(password: string): Promise<CryptoKey> {
  if (keyCache && keyCache.password === password) return keyCache.key;

  const material = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(KEY_SALT),
      iterations: KEY_ITERATIONS,
      hash: "SHA-256",
    },
    material,
    { name: "HMAC", hash: "SHA-256", length: 256 },
    false,
    ["sign"],
  );

  keyCache = { password, key };
  return key;
}

async function signSession(password: string, issuedAtMs: number) {
  const key = await sessionSigningKey(password);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`signal-hq-session:${HQ_SESSION_VERSION}:${issuedAtMs}`),
  );
  return toHex(signature);
}

/**
 * Mint a session token. `issuedAtMs` is injectable for tests only; every
 * production caller takes the default.
 */
export async function createHqAccessToken(
  password = getHqPassword(),
  issuedAtMs: number = Date.now(),
) {
  const issuedAt = Math.floor(issuedAtMs);
  const signature = await signSession(password, issuedAt);
  return `${HQ_SESSION_VERSION}.${issuedAt}.${signature}`;
}

export async function verifyHqPassword(submittedPassword: string) {
  const password = getHqPassword();

  if (!password) {
    return false;
  }

  const [submitted, expected] = await Promise.all([
    sha256(`signal-hq-password:v1:${submittedPassword}`),
    sha256(`signal-hq-password:v1:${password}`),
  ]);

  return constantTimeEqual(submitted, expected);
}

/**
 * Verify a session token.
 *
 * Fails closed on every path: no password configured, wrong shape, wrong
 * version, unparseable or non-finite issue time, expired, future-dated
 * beyond tolerated skew, or a signature that does not match.
 *
 * v1 tokens (`sha256(...)`, 64 hex characters, no dots) do not verify.
 * That is deliberate: the whole point is that a v1 value is derivable
 * from the password, so honouring one would keep the defect alive. The
 * cost is that everyone signs in again once after this deploys.
 */
export async function verifyHqToken(token: string, nowMs: number = Date.now()) {
  const password = getHqPassword();
  if (!password) return false;
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [version, issuedAtRaw, signature] = parts;
  if (version !== HQ_SESSION_VERSION) return false;

  // Reject anything that is not a plain run of digits before trusting
  // Number(): "1e20", " 12", "0x10" and "" all parse to something.
  if (!/^\d{1,15}$/.test(issuedAtRaw)) return false;
  const issuedAt = Number(issuedAtRaw);
  if (!Number.isSafeInteger(issuedAt) || issuedAt <= 0) return false;

  if (nowMs - issuedAt > SESSION_TTL_MS) return false;
  if (issuedAt - nowMs > MAX_CLOCK_SKEW_MS) return false;

  const expected = await signSession(password, issuedAt);
  return constantTimeEqual(signature, expected);
}
