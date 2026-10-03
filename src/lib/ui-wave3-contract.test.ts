import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

function source(...parts: string[]) {
  return readFileSync(path.join(process.cwd(), ...parts), "utf8");
}

// Home page v3 (2026-10-02, content/hq/decisions/home-page-v3-2026-10-02.md)
// replaced the hero, relay and closing components with these.
function homeSource() {
  return [
    "home-header.tsx",
    "home-hero.tsx",
    "home-tasks.tsx",
    "home-sections.tsx",
    "home-whiteboard.tsx",
    "home-closing.tsx",
  ]
    .map((file) => source("src", "components", "home", file))
    .join("\n");
}

describe("Wave 3 public interface contracts", () => {
  it("uses one versioned review story across landing proof components", () => {
    const registry = source("src", "lib", "review-suite-presentation.ts");
    const home = homeSource();
    const tasks = source("src", "components", "marketing", "heroes", "tasks", "lib", "domains.ts");
    const timeline = source("src", "components", "marketing", "heroes", "timeline", "fixture.ts");
    assert.match(registry, /version: 3/);
    assert.match(registry, /total: 13/);
    assert.match(tasks, /REVIEW_SUITE_PRESENTATION/);
    assert.match(timeline, /REVIEW_SUITE_PRESENTATION/);
    // The home page shows captures of the product's own sample, so it cannot
    // import the registry. It still has to tell the registry's story: the
    // same project, on the same wedding day as the timeline fixture.
    assert.match(registry, /name: "Mara & Finn"/);
    assert.match(timeline, /2026-10-03/);
    assert.match(home, /Mara &amp; Finn/);
    assert.match(home, /Saturday 3 October/);
    assert.doesNotMatch(home, /\b(?:Bloom|Weir)\b/);
    assert.doesNotMatch(tasks, /tags: \["mara-finn"\]/);
  });

  it("keeps the public story to the three-product suite", () => {
    const about = source("src", "app", "about", "page.tsx");
    const footer = source("src", "components", "landing", "site-footer.tsx");
    const home = homeSource();
    const header = source("src", "components", "home", "home-header.tsx");
    const layout = source("src", "app", "layout.tsx");
    const manifest = source("src", "app", "manifest.ts");
    assert.doesNotMatch(`${about}\n${home}\n${layout}`, /daily briefing|daily signal|Inside Home/i);
    // The header names what the product does, in the founder's order, and
    // never presents Home or the briefing as a product (lock, 2026-10-01).
    const sectionLinks = [...header.matchAll(/href="#([a-z]+)">([^<]+)</g)].map((match) => match[2]);
    assert.deepEqual(sectionLinks.slice(0, 6), [
      "Projects",
      "Tasks",
      "Timeline",
      "Files",
      "Analytics",
      "Whiteboard",
    ]);
    assert.doesNotMatch(header, />(?:Home|Notes|Daily briefing)</);
    // This is a copy contract: presentational tags must not change the words.
    // "Built for the 80%" left with the floor-and-sheet closing; this is the
    // line that carries the same claim on the v3 page.
    assert.match(home.replace(/<[^>]+>/g, ""), /The person the work runs through\./);
    // The manifest describes the product in the home page's own words
    // (2026-10-02 follow-up); it used to pin "Three products read as one system".
    assert.match(manifest, /Signal Studio tells you what needs you today/);
    assert.doesNotMatch(manifest, /Three products|daily briefing/i);
    assert.doesNotMatch(manifest, /Four small tools/);
    const suite = footer.slice(footer.indexOf('heading="Suite"'));
    assert.doesNotMatch(suite, /Daily briefing/);
  });

  it("prints the home page in exactly its light palette", () => {
    // A media query cannot borrow a rule, so home.css repeats the light
    // palette inside @media print. The two must not drift.
    const css = source("src", "components", "home", "home.css");
    const between = (start: string, end: string) => {
      const block = css.slice(css.indexOf(start) + start.length, css.indexOf(end));
      return block
        .slice(block.indexOf("{") + 1, block.lastIndexOf("}"))
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
    };
    const light = between("/* light-palette:start */", "/* light-palette:end */");
    const print = between("/* print-palette:start */", "/* print-palette:end */");
    assert.ok(light.length > 20, "the light palette was found");
    assert.deepEqual(print, light);
    // Round 3: with no script the page follows a light device in CSS, with the same palette.
    const noscript = between("/* noscript-palette:start */", "/* noscript-palette:end */");
    assert.deepEqual(noscript, light);
  });

  it("serves the public home page from cache: nothing in it reads the request", () => {
    // Round 3 (2026-10-02, content/hq/decisions/home-page-v3-2026-10-02.md):
    // `/` is prerendered. A header, a cookie or the query string read in the
    // root layout or the home route makes every visit a fresh render again.
    // The signed-in launcher is the proxy's rewrite to its own route.
    const layout = source("src", "app", "layout.tsx");
    const page = source("src", "app", "page.tsx");
    for (const [name, file] of [["layout", layout], ["page", page]] as const) {
      assert.doesNotMatch(file, /from "next\/headers"/, `${name} reads no request header or cookie`);
      assert.doesNotMatch(file, /searchParams|generateViewport|export const dynamic/, `${name} reads no query string`);
    }
    const proxy = source("src", "proxy.ts");
    assert.match(proxy, /LAUNCHER_PATH = "\/launcher"/);
    assert.match(source("src", "app", "launcher", "page.tsx"), /<SuiteLauncher \/>/);
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
