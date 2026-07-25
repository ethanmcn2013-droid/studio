import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { PRODUCT_APP_URLS, PRODUCT_MARKETING_URLS } from "./product-urls";

describe("product URL contract", () => {
  it("keeps marketing links on the umbrella and app links on the consolidated app", () => {
    for (const url of Object.values(PRODUCT_MARKETING_URLS)) {
      assert.match(url, /^https:\/\/signalstudio\.ie\/#(?:notes|tasks|timeline|signal)$/);
      assert.doesNotMatch(url, /\/app(?:\/|$)/);
    }

    for (const url of Object.values(PRODUCT_APP_URLS)) {
      assert.match(url, /^https:\/\/app\.signalstudio\.ie\/app\//);
      assert.doesNotMatch(url, /(?:tasks|timeline|signal|notes)\.signalstudio\.ie/);
    }
  });

  it("keeps homepage rows same-tab and bound to marketing destinations", () => {
    const source = readFileSync(new URL("../components/reveal/reveal-products.tsx", import.meta.url), "utf8");
    assert.match(source, /PRODUCT_MARKETING_URLS/);
    assert.doesNotMatch(source, /href=\{(?:NOTES_URL|TASKS_URL|TIMELINE_URL|SIGNAL_URL)\}/);
    assert.doesNotMatch(source, /<ProductRow[\s\S]*?external\s*\/>/);
  });
});
