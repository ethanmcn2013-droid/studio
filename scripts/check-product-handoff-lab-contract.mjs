import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");

const lock = JSON.parse(
  read("../experience/product-handoff-hero-lock.json"),
);
const heroFiles = execFileSync(
  "git",
  ["ls-files", "src/components/marketing/heroes/**"],
  { encoding: "utf8" },
)
  .trim()
  .split(/\r?\n/)
  .filter(Boolean);
const heroAggregate = createHash("sha256");

for (const file of heroFiles) {
  heroAggregate.update(file);
  heroAggregate.update("\0");
  heroAggregate.update(readFileSync(file));
  heroAggregate.update("\0");
}

assert.equal(
  heroFiles.length,
  lock.heroFileCount,
  "The locked hero file set changed during Product Handoff review",
);
assert.equal(
  heroAggregate.digest("hex"),
  lock.heroAggregateSha256,
  "A locked hero implementation changed during Product Handoff review",
);

for (const [path, expected, label] of [
  [
    "../src/components/marketing/handoff/product-handoff.tsx",
    lock.productionHandoffSha256,
    "production ProductHandoff",
  ],
  [
    "../src/components/marketing/product-marketing-page.tsx",
    lock.productMarketingPageSha256,
    "product marketing page shell",
  ],
]) {
  assert.equal(
    sha256(read(path)),
    expected,
    `The ${label} changed before a direction was selected`,
  );
}

const route = readFileSync(
  "src/app/%5F%5Fdesign-lab/product-handoff/page.tsx",
  "utf8",
);
const lab = read(
  "../src/components/marketing/handoff-lab/product-handoff-lab.tsx",
);
const data = read("../src/components/marketing/handoff-lab/data.ts");
const living = read(
  "../src/components/marketing/handoff-lab/living-artifact.tsx",
);
const production = read(
  "../src/components/marketing/handoff/product-handoff.tsx",
);

assert.match(route, /robots:\s*\{\s*index:\s*false/);
assert.match(route, /isCanonicalProductionHost/);
assert.match(route, /mode !== "development" && mode !== "review"/);
for (const query of ["option", "product", "progress", "motion", "viewport"]) {
  assert.match(route, new RegExp(`params\\.${query}`));
}

for (const direction of [
  "Living Artifact",
  "Provenance Rail",
  "Editorial Cause",
]) {
  assert.match(data, new RegExp(direction));
}
for (const product of ["notes", "tasks", "timeline", "signal"]) {
  assert.match(data, new RegExp(`${product}: \\{`));
}
for (const progress of ["0", "0.25", "0.5", "0.75", "1"]) {
  assert.match(lab, /step="0\.01"/);
  assert.ok(Number.isFinite(Number(progress)));
}

assert.match(lab, /Product Walk/);
assert.match(lab, /Reduce motion/);
assert.match(lab, /0\.25/);
assert.match(lab, /Animation progress/);
assert.match(living, /useTransform/);
assert.match(living, /scaleX/);
assert.doesNotMatch(living, /\bleft:\s*|\btop:\s*|\bwidth:\s*|\bheight:\s*/);
assert.equal(lock.selectedDirection, "a");
assert.match(production, /LivingArtifact/);
assert.match(production, /HANDOFF_DEFINITIONS/);
assert.match(production, /useScroll/);
assert.match(production, /useReducedMotion/);
assert.match(production, /target:\s*stageRef/);
assert.match(production, /offset:\s*\["start 78%", "start 50%"\]/);
assert.match(living, /data-handoff-stage/);
assert.doesNotMatch(production, /IntersectionObserver/);

assert.match(data, /Venue can open the side room after six/);
assert.match(data, /Ask the venue to hold the side room/);
assert.match(data, /Confirm the catering tasting menu/);
assert.match(data, /Menu confirmed/);
assert.match(data, /30 Jul/);
assert.match(data, /Send the invitations/);
assert.match(data, /13 Aug/);
assert.match(data, /Close the final dietary list/);
assert.match(data, /Owner", value: "Mara"/);
assert.match(data, /Due", value: "Today"/);
assert.doesNotMatch(data, /Open task/i);
assert.match(data, /signal:\s*\{[\s\S]*?nextHref:\s*null/);

console.log(
  "[product-handoff-lab-contract] ok (heroes locked, Living Artifact selected, three review directions retained, product truth retained)",
);
