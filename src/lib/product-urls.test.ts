import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  APP_ORIGIN,
  PRODUCT_APP_PATHS,
  PRODUCT_APP_URLS,
  PRODUCT_MARKETING_URLS,
  STUDIO_ORIGIN,
  TASKS_PUBLIC_ORIGIN,
  TIMELINE_PUBLIC_ORIGIN,
} from "./product-urls";

describe("product URL contract", () => {
  it("keeps marketing links on the umbrella and app links on the consolidated app", () => {
    assert.equal(STUDIO_ORIGIN, "https://signalstudio.ie");
    assert.equal(APP_ORIGIN, "https://app.signalstudio.ie");

    for (const [product, url] of Object.entries(PRODUCT_MARKETING_URLS)) {
      assert.equal(url, `https://signalstudio.ie/${product}`);
      assert.doesNotMatch(url, /\/app(?:\/|$)/);
      assert.doesNotMatch(url, /#/);
    }

    for (const [product, url] of Object.entries(PRODUCT_APP_URLS)) {
      assert.equal(url, `https://app.signalstudio.ie${PRODUCT_APP_PATHS[product as keyof typeof PRODUCT_APP_PATHS]}`);
      assert.doesNotMatch(url, /(?:tasks|timeline|signal|notes)\.signalstudio\.ie/);
    }
  });

  it("keeps public and service origins separate from marketing and app destinations", () => {
    assert.equal(TASKS_PUBLIC_ORIGIN, "https://tasks.signalstudio.ie");
    assert.equal(TIMELINE_PUBLIC_ORIGIN, "https://timeline.signalstudio.ie");
    assert.notEqual(TASKS_PUBLIC_ORIGIN, PRODUCT_MARKETING_URLS.tasks);
    assert.notEqual(TIMELINE_PUBLIC_ORIGIN, PRODUCT_APP_URLS.timeline);
  });

  it("keeps the exact public wedding path ahead of wildcard proxying", () => {
    const nextConfig = readFileSync(
      new URL("../../next.config.ts", import.meta.url),
      "utf8",
    );
    const exactSource = 'source: "/the-wedding"';
    const wildcardSource = 'source: "/the-wedding/:path*"';

    assert.equal(nextConfig.split(exactSource).length - 1, 2);
    assert.equal(nextConfig.split(wildcardSource).length - 1, 2);
    assert.ok(
      nextConfig.indexOf(exactSource) < nextConfig.indexOf(wildcardSource),
      "the exact path must avoid an empty wildcard that adds a trailing slash",
    );
  });

  it("keeps every homepage product link same-tab and bound to marketing destinations", () => {
    const productRelay = readFileSync(
      new URL("../components/reveal/reveal-product-relay.tsx", import.meta.url),
      "utf8",
    );
    const homepage = readFileSync(
      new URL("../app/page.tsx", import.meta.url),
      "utf8",
    );

    assert.match(homepage, /RevealProductRelay/);
    assert.doesNotMatch(homepage, /RevealProducts/);
    assert.match(productRelay, /PRODUCT_MARKETING_URLS/);
    assert.doesNotMatch(productRelay, /href="#(?:notes|tasks|timeline|signal)"/);
    assert.doesNotMatch(productRelay, /target=["']_blank["']/);
    assert.doesNotMatch(
      productRelay,
      /href=\{(?:NOTES_URL|TASKS_URL|TIMELINE_URL|SIGNAL_URL)\}/,
    );
  });
});
