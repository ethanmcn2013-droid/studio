#!/usr/bin/env node

import assert from "node:assert/strict";
import { NextRequest } from "next/server";

import importedConfig from "../next.config";
import * as importedProxyModule from "../src/proxy";

type MatchCondition = {
  type: string;
  value?: string;
};

type RedirectRule = {
  source: string;
  destination: string;
  permanent: boolean;
  has?: MatchCondition[];
};

const legacyTimelineHosts = [
  "timeline.signalstudio.ie",
  "roadmap.signalstudio.ie",
] as const;

const expectedPrivateHeaders = new Map([
  ["Cache-Control", "private, no-store, max-age=0, must-revalidate"],
  ["CDN-Cache-Control", "no-store"],
  ["Vercel-CDN-Cache-Control", "no-store"],
  ["Referrer-Policy", "no-referrer"],
  ["X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet"],
]);

// Studio is a CommonJS package, so tsx presents the TypeScript config through
// one extra `default` layer when this contract runs directly.
const nextConfig = (
  typeof importedConfig === "object" && importedConfig !== null && "default" in importedConfig
    ? (importedConfig as { default: typeof importedConfig }).default
    : importedConfig
);
const compatProxyModule = importedProxyModule as typeof importedProxyModule & {
  default?: typeof importedProxyModule;
};
const proxy = compatProxyModule.proxy ?? compatProxyModule.default?.proxy;
assert.equal(typeof proxy, "function", "proxy.ts must expose proxy()");

function hostOf(rule: { has?: MatchCondition[] }) {
  return rule.has?.find((condition) => condition.type === "host")?.value;
}

assert.equal(typeof nextConfig.redirects, "function", "next.config must expose redirects()");
const redirects = (await nextConfig.redirects!()) as RedirectRule[];

for (const host of legacyTimelineHosts) {
  // A next.config redirect would run before proxy.ts and strip the private
  // response headers. The host catch-all must therefore leave /s untouched.
  const configShareRules = redirects.filter(
    (rule) => rule.source === "/s/:path*" && hostOf(rule) === host,
  );
  assert.equal(
    configShareRules.length,
    0,
    `${host} share links must be handled by the privacy-preserving proxy`,
  );

  const retirementRules = redirects.filter(
    (rule) => rule.destination === "https://signalstudio.ie/" && hostOf(rule) === host,
  );
  assert.equal(retirementRules.length, 1, `${host} retirement catch-all is missing`);
  assert.equal(
    retirementRules[0]?.source,
    "/:path((?!s(?:/|$)).*)",
    `${host} retirement catch-all must exclude /s`,
  );

  const request = new NextRequest(
    `https://${host}/s/TestTokenABC123?source=owner&surface=share`,
    { headers: { host } },
  );
  const response = await proxy(request);

  assert.equal(response.status, 307, `${host} share redirect must remain temporary`);
  assert.equal(
    response.headers.get("Location"),
    "https://app.signalstudio.ie/s/TestTokenABC123?source=owner&surface=share",
    `${host} must preserve the full share path and query`,
  );

  for (const [key, value] of expectedPrivateHeaders) {
    assert.equal(response.headers.get(key), value, `${host} has the wrong ${key}`);
  }
}

const unrelatedHostResponse = await proxy(
  new NextRequest("https://signalstudio.ie/s/TestTokenABC123", {
    headers: { host: "signalstudio.ie" },
  }),
);
assert.equal(
  unrelatedHostResponse.headers.get("x-middleware-next"),
  "1",
  "the compatibility handoff must remain host-scoped",
);

console.log("timeline-share-redirect-contract: ok");
