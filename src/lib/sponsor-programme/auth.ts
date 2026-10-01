import { createHmac, timingSafeEqual } from "node:crypto";
import { ReportError } from "./storage";
const AUDIENCE = "signal-studio.sponsor-report";
export function createReportAssertion(subject: string, secret: string, now = Math.floor(Date.now() / 1000)) {
  if (secret.length < 32 || !subject) throw new ReportError("unavailable");
  const payload = Buffer.from(JSON.stringify({ v: 1, aud: AUDIENCE, sub: subject, iat: now, exp: now + 300 })).toString("base64url");
  return `${payload}.${createHmac("sha256", secret).update(payload).digest("base64url")}`;
}
export function verifyReportAssertion(value: string, secret: string, now = Math.floor(Date.now() / 1000)): string {
  if (secret.length < 32) throw new ReportError("unavailable");
  if (value.length > 2048) throw new ReportError("forbidden");
  const parts = value.split(".");
  if (parts.length !== 2 || !parts.every(s => /^[A-Za-z0-9_-]+$/.test(s))) throw new ReportError("forbidden");
  const expected = createHmac("sha256", secret).update(parts[0]).digest();
  const actual = Buffer.from(parts[1], "base64url");
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) throw new ReportError("forbidden");
  let claims: Record<string, unknown>;
  try { claims = JSON.parse(Buffer.from(parts[0], "base64url").toString()); } catch { throw new ReportError("forbidden"); }
  if (!claims || Array.isArray(claims) || Object.keys(claims).sort().join() !== "aud,exp,iat,sub,v" ||
    claims.v !== 1 || claims.aud !== AUDIENCE || typeof claims.sub !== "string" || !claims.sub || claims.sub.length > 200 ||
    !Number.isSafeInteger(claims.iat) || !Number.isSafeInteger(claims.exp) || Number(claims.iat) > now + 30 ||
    Number(claims.exp) <= now || Number(claims.exp) <= Number(claims.iat) || Number(claims.exp) - Number(claims.iat) > 300) throw new ReportError("forbidden");
  return claims.sub;
}
