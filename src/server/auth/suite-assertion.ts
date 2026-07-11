import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export type SuiteTodayAssertion = {
  v: 1;
  iss: "signal-suite-proxy";
  aud: "signal-studio.today";
  sub: string;
  email?: string;
  iat: number;
  exp: number;
  jti: string;
  traceId: string;
};

const MAX_TTL_SECONDS = 300;

export function createSuiteTodayAssertion(subject: string, secret: string, options: { email?: string; now?: number } = {}): string {
  const now = options.now ?? Math.floor(Date.now() / 1000);
  const claims: SuiteTodayAssertion = { v: 1, iss: "signal-suite-proxy", aud: "signal-studio.today", sub: subject, ...(options.email ? { email: options.email } : {}), iat: now, exp: now + MAX_TTL_SECONDS, jti: randomUUID(), traceId: randomUUID() };
  const encoded = Buffer.from(JSON.stringify(claims), "utf8").toString("base64url");
  return `${encoded}.${createHmac("sha256", secret).update(encoded).digest("base64url")}`;
}

export function verifySuiteTodayAssertion(assertion: string, secret: string, now = Math.floor(Date.now() / 1000)): SuiteTodayAssertion {
  const [encoded, presented] = assertion.split(".");
  if (!encoded || !presented || presented.length < 32) throw new Error("invalid assertion");
  const expected = createHmac("sha256", secret).update(encoded).digest();
  const received = Buffer.from(presented, "base64url");
  if (received.length !== expected.length || !timingSafeEqual(expected, received)) throw new Error("invalid assertion");
  let claims: Partial<SuiteTodayAssertion>;
  try { claims = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as Partial<SuiteTodayAssertion>; } catch { throw new Error("invalid assertion"); }
  if (claims.v !== 1 || claims.iss !== "signal-suite-proxy" || claims.aud !== "signal-studio.today" || typeof claims.sub !== "string" || !claims.sub || (claims.email !== undefined && typeof claims.email !== "string") || typeof claims.iat !== "number" || typeof claims.exp !== "number" || typeof claims.jti !== "string" || typeof claims.traceId !== "string" || claims.exp <= now || claims.iat > now + 30 || claims.exp - claims.iat > MAX_TTL_SECONDS) throw new Error("invalid assertion");
  return claims as SuiteTodayAssertion;
}
