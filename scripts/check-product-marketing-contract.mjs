import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const page = read("../src/components/marketing/product-marketing-page.tsx");
const experience = read(
  "../src/components/marketing/day-in-work/day-in-work-experience.tsx",
);
const artifact = read(
  "../src/components/marketing/day-in-work/timeline-artifact.tsx",
);
const artifactStyles = read(
  "../src/components/marketing/day-in-work/timeline-artifact.module.css",
);
const fixture = read(
  "../src/components/marketing/day-in-work/timeline-fixture.ts",
);
const footer = read("../src/components/landing/site-footer.tsx");

assert.match(page, /<DayInWorkExperience/);
assert.match(page, /ProductHeroGesture/);
assert.match(experience, /role="tablist"/);
assert.match(
  experience,
  /<TimelineArtifact embedded timeline=\{MARA_FINN_TIMELINE\}/,
);
assert.match(experience, /Product proof with deterministic example data/);

assert.match(artifact, /data-timeline-wordmark/);
assert.match(artifact, />\s*timeline<span/);
assert.match(artifact, /role="progressbar"/);
assert.match(artifact, /data-today-marker/);
assert.match(artifact, /event\.key === "ArrowRight"/);
assert.match(artifact, /event\.key === "ArrowLeft"/);
assert.match(artifact, /useReducedMotion/);
assert.doesNotMatch(artifact, /\bfetch\s*\(|sendBeacon|\/api\//);
assert.match(artifactStyles, /--x-timeline-hit:\s*3rem/);
assert.match(artifactStyles, /prefers-reduced-motion:\s*reduce/);

assert.match(fixture, /label: "Mara & Finn"/);
assert.match(fixture, /title: "Wedding day"/);
assert.doesNotMatch(
  fixture,
  /workspaceId|workspaceSlug|ownerEmail|sourceRelation|attachments|comments/,
);

assert.match(footer, /grid-cols-2/);
assert.match(footer, /lg:grid-cols-\[1\.35fr_repeat\(4,1fr\)\]/);

console.log(
  "[product-marketing-contract] ok (Day in the Work, signed Timeline parity, compact mobile footer)",
);
