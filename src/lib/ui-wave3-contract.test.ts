import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

function source(...parts: string[]) {
  return readFileSync(path.join(process.cwd(), ...parts), "utf8");
}

describe("Wave 3 public interface contracts", () => {
  it("uses one versioned review story across landing proof components", () => {
    const registry = source("src", "lib", "review-suite-presentation.ts");
    const relay = source("src", "components", "reveal", "reveal-product-relay.tsx");
    const tasks = source("src", "components", "marketing", "heroes", "tasks", "lib", "domains.ts");
    const timeline = source("src", "components", "marketing", "heroes", "timeline", "fixture.ts");
    assert.match(registry, /version: 3/);
    assert.match(registry, /total: 13/);
    assert.match(relay, /REVIEW_SUITE_PRESENTATION/);
    assert.match(tasks, /REVIEW_SUITE_PRESENTATION/);
    assert.match(timeline, /REVIEW_SUITE_PRESENTATION/);
    assert.doesNotMatch(tasks, /tags: \["mara-finn"\]/);
  });

  it("keeps Home subordinate to the three-product suite", () => {
    const about = source("src", "app", "about", "page.tsx");
    const footer = source("src", "components", "landing", "site-footer.tsx");
    const hero = source("src", "components", "reveal", "reveal-hero.tsx");
    const manifesto = source("src", "components", "reveal", "reveal-manifesto.tsx");
    const layout = source("src", "app", "layout.tsx");
    const manifest = source("src", "app", "manifest.ts");
    assert.match(about, /Inside Home/);
    assert.match(about, /not a fourth product/);
    assert.doesNotMatch(`${hero}\n${manifesto}\n${layout}`, /80%/);
    assert.match(manifest, /Three products read as one system/);
    assert.doesNotMatch(manifest, /Four small tools/);
    const suite = footer.slice(footer.indexOf('heading="Suite"'));
    assert.doesNotMatch(suite, /Daily briefing/);
  });

  it("arms landing proof motion only after hydration, consent and intersection", () => {
    const artifact = source("src", "components", "marketing", "heroes", "timeline", "artifact", "timeline-artifact.tsx");
    const css = source("src", "components", "marketing", "heroes", "timeline", "artifact", "timeline-artifact.module.css");
    const link = source("src", "components", "reveal", "system-proof-link.tsx");
    assert.match(artifact, /IntersectionObserver/);
    assert.match(artifact, /settledWithoutChoreography/);
    assert.match(css, /journey\[data-motion-ready="true"\]/);
    assert.match(link, /prefers-reduced-motion: reduce/);
    assert.match(link, /heading\.focus/);
  });

  it("shows plain priority names and no raw project slug in the Tasks proof", () => {
    const surface = source("src", "components", "marketing", "heroes", "tasks", "showcase", "demo-surface.tsx");
    const ghost = source("src", "components", "marketing", "heroes", "tasks", "showcase", "ghost-card.tsx");
    assert.match(surface, /PRIORITY_LABEL\[task\.priority\]\.label/);
    assert.match(ghost, /PRIORITY_LABEL\[task\.priority\]\.label/);
    assert.doesNotMatch(surface, /task\.priority\.toUpperCase/);
  });
});
