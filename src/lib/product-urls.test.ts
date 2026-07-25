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

  it("keeps every homepage product link same-tab and bound to marketing destinations", () => {
    const productRows = readFileSync(
      new URL("../components/reveal/reveal-products.tsx", import.meta.url),
      "utf8",
    );
    const heroStack = readFileSync(
      new URL("../components/reveal/reveal-hero.tsx", import.meta.url),
      "utf8",
    );

    for (const source of [productRows, heroStack]) {
      assert.match(source, /PRODUCT_MARKETING_URLS/);
      assert.doesNotMatch(source, /href="#(?:notes|tasks|timeline|signal)"/);
      assert.doesNotMatch(source, /target=["']_blank["']/);
      assert.doesNotMatch(
        source,
        /href=\{(?:NOTES_URL|TASKS_URL|TIMELINE_URL|SIGNAL_URL)\}/,
      );
    }
  });
});
