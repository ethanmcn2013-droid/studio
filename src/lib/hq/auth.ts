import { timingSafeEqual } from "crypto";

export const HQ_ACCESS_COOKIE = "signal_hq_access";
export const HQ_ACCESS_MAX_AGE = 60 * 60 * 12;

const encoder = new TextEncoder();

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function getHqPassword() {
  return process.env.SIGNAL_HQ_PASSWORD?.trim() ?? "";
}

export function isHqPasswordConfigured() {
  return getHqPassword().length > 0;
}

export async function createHqAccessToken(password = getHqPassword()) {
  return sha256(`signal-hq-session:v1:${password}`);
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

  // Constant-time comparison, both are hex strings of equal length (64 chars)
  const a = Buffer.from(submitted, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function verifyHqToken(token: string) {
  const expected = await createHqAccessToken();
  const a = Buffer.from(token, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
