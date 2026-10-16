import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { unstable_getResponseFromNextConfig, getRedirectUrl, getRewrittenUrl } from "next/experimental/testing/server";
import config from "../../next.config";
import { proxy } from "../proxy";
import { createHqAccessToken, HQ_ACCESS_COOKIE } from "./hq/auth";
import sitemap from "../app/sitemap";
import manifest from "../app/manifest";

const origin = "https://signalstudio.ie";
async function route(path: string, host = "signalstudio.ie") {
  return unstable_getResponseFromNextConfig({ url: `https://${host}${path}`, headers: { host }, nextConfig: config });
}

test("secondary and retired marketing URLs temporarily return exactly 302 to home", async () => {
  for (const path of ["/about", "/pricing", "/privacy", "/terms", "/waitlist", "/press", "/principles", "/brand", "/design", "/launcher", "/notes", "/tasks", "/timeline", "/work", "/contact", "/venues/demo", "/dispatch/old", "/students.html", "/changelog.rss", "/not-a-public-page", "/brand/loader.html", "/brand/arbitrary.html", "/arbitrary.html", "/brand/guidelines.pdf", "/s/test", "/the-wedding", "/app", "/sign-in", "/redeem/example", "/auth/callback"]) {
    const response = await route(path);
    assert.equal(response.status, 302, path);
    assert.equal(getRedirectUrl(response), `${origin}/`, path);
  }
});

test("root, private operations and required assets escape isolation", async () => {
  for (const path of ["/", "/api/csp-report", "/hq", "/hq/access", "/_next/static/test.js", "/landing/captures/test.webp", "/share/signal-studio-card-v2.png", "/brand/business-loan-pack-2026.html", "/favicon.ico", "/icon", "/icon1", "/icon2", "/icon3", "/icon4", "/apple-icon", "/robots.txt", "/sitemap.xml"]) {
    assert.notEqual((await route(path)).status, 302, path);
  }
  assert.equal((await route("/about", "www.signalstudio.ie")).status, 302);
  assert.equal(getRedirectUrl(await route("/opengraph-image")), `${origin}/share/signal-studio-card-v2.png`);
});

test("retired product domains and public artifact rewrites retain their destinations", async () => {
  assert.equal(getRedirectUrl(await route("/app/old", "notes.signalstudio.ie")), "https://app.signalstudio.ie/app/notes");
  assert.equal(getRedirectUrl(await route("/pricing", "notes.signalstudio.ie")), origin + "/");
  assert.equal(getRewrittenUrl(await route("/s/example", "timeline.signalstudio.ie")), "https://app.signalstudio.ie/s/example");
});

test("authenticated and marker-bearing home visits and root POST stay on public landing", async () => {
  const visits: NonNullable<ConstructorParameters<typeof NextRequest>[1]>[] = [{ headers: { cookie: "__session=example" } }, { headers: { "x-signal-authed": "1" } }, { method: "POST", headers: { "next-action": "example" } }];
  for (const options of visits) {
    const response = await proxy(new NextRequest(origin, options));
    assert.equal(response.headers.get("x-middleware-next"), "1");
    assert.equal(getRedirectUrl(response), null);
    assert.equal(getRewrittenUrl(response), null);
  }
});

test("HQ and confidential brand assets still require their password cookie", async () => {
  const previous = process.env.SIGNAL_HQ_PASSWORD;
  process.env.SIGNAL_HQ_PASSWORD = "isolated-test-password";
  try {
    for (const path of ["/hq", "/brand/business-loan-pack-2026.html"]) {
      assert.equal(new URL(getRedirectUrl(await proxy(new NextRequest(origin + path)))!).pathname, "/hq/access");
      const token = await createHqAccessToken();
      assert.equal((await proxy(new NextRequest(origin + path, { headers: { cookie: `${HQ_ACCESS_COOKIE}=${token}` } }))).headers.get("x-middleware-next"), "1");
    }
  } finally {
    if (previous === undefined) delete process.env.SIGNAL_HQ_PASSWORD; else process.env.SIGNAL_HQ_PASSWORD = previous;
  }
});

test("sitemap advertises only the accessible landing page", () => {
  assert.deepEqual(sitemap().map(({ url }) => url), [origin]);
});

test("installed landing page advertises no secondary-page shortcuts", () => {
  assert.deepEqual(manifest().shortcuts, []);
});
