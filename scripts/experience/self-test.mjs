#!/usr/bin/env node
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  classifyExperienceClass,
  discoverRegistry,
  hashText,
  validateRegistry,
} from "./lib.mjs";

const lfHash = hashText("first line\nsecond line\n");
const crlfHash = hashText("first line\r\nsecond line\r\n");
const crHash = hashText("first line\rsecond line\r");
if (lfHash !== crlfHash || lfHash !== crHash) {
  throw new Error("self-test failed: materiality hashes differ by line-ending style");
}
if (lfHash === hashText("first line\nchanged line\n")) {
  throw new Error("self-test failed: materiality hashing ignored a content change");
}

const classCases = [
  [{ product: "studio", route: "/" }, "company-public"],
  [{ product: "studio", route: "/hq/experience-quality" }, "founder-operator"],
  [{ product: "studio", source: "studio/src/components/hq/hq-shell.tsx", parentJourney: "founder-operations" }, "founder-operator"],
  [{ product: "signal-review", source: "signal-review/src/content/main.js" }, "founder-operator"],
  [{ product: "tasks", route: "/app" }, "customer-product"],
];
for (const [input, expected] of classCases) {
  const actual = classifyExperienceClass(input);
  if (actual !== expected) throw new Error(`self-test failed: expected ${expected}, received ${actual}`);
}

const root = mkdtempSync(path.join(tmpdir(), "signal-experience-"));
try {
  const studioRoot = path.join(root, "studio");
  const appRoot = path.join(studioRoot, "src", "app");
  mkdirSync(appRoot, { recursive: true });
  writeFileSync(path.join(appRoot, "page.tsx"), "export default function Page(){return null}\n");
  const config = {
    products: [{ id: "studio", directory: "studio", name: "Studio", baseUrl: "http://localhost" }],
    breakpoints: {
      mobile: { width: 390, height: 844 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1280, height: 900 },
      wide: { width: 1440, height: 960 },
    },
  };
  const explicit = { surfaces: [] };
  const registered = discoverRegistry({ studioRoot, config, explicit });
  writeFileSync(path.join(appRoot, "page.tsx"), "export default function Page(){return <main>changed</main>}\n");
  const changed = discoverRegistry({ studioRoot, config, explicit });
  const changedErrors = validateRegistry({
    registry: registered,
    discovered: changed,
    findings: { findings: [] },
    exceptions: { exceptions: [] },
    studioRoot,
  });
  if (!changedErrors.some((error) => error.includes("changed experience lacks complete"))) {
    throw new Error(`self-test failed: changed source without evidence was not caught\n${changedErrors.join("\n")}`);
  }

  const missingRoot = path.join(appRoot, "unregistered");
  mkdirSync(missingRoot, { recursive: true });
  writeFileSync(path.join(missingRoot, "page.tsx"), "export default function Page(){return null}\n");
  const discovered = discoverRegistry({ studioRoot, config, explicit });
  const errors = validateRegistry({
    registry: registered,
    discovered,
    findings: { findings: [] },
    exceptions: { exceptions: [] },
    studioRoot,
  });
  if (!errors.some((error) => error.includes("discovered experience is not registered"))) {
    throw new Error(`self-test failed: unregistered route was not caught\n${errors.join("\n")}`);
  }
  const withExpiredException = structuredClone(registered);
  withExpiredException.experiences[0].intentionalExceptions = [
    { id: "expired-self-test", expiresAt: "2020-01-01" },
  ];
  const exceptionErrors = validateRegistry({
    registry: withExpiredException,
    discovered: changed,
    findings: { findings: [] },
    exceptions: { exceptions: [{ id: "expired-self-test" }] },
    studioRoot,
  });
  if (!exceptionErrors.some((error) => error.includes("expired exception expired-self-test"))) {
    throw new Error(`self-test failed: expired exception was not caught\n${exceptionErrors.join("\n")}`);
  }
  console.log("experience:self-test: pass - unregistered routes, stale evidence, and expired exceptions are rejected");
} finally {
  rmSync(root, { recursive: true, force: true });
}
