#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import path from "node:path";
import { discoverRegistry, readJson, registryMetrics, writeStableJson } from "./lib.mjs";

const studioRoot = process.cwd();
const experienceRoot = path.join(studioRoot, "experience");
const config = readJson(path.join(experienceRoot, "config.json"));
const explicit = readJson(path.join(experienceRoot, "surfaces.json"));
const overrides = readJson(path.join(experienceRoot, "overrides.json"));
const registry = discoverRegistry({ studioRoot, config, explicit, overrides });

if (process.argv.includes("--write")) {
  writeFileSync(path.join(experienceRoot, "registry.json"), writeStableJson(registry));
}

console.log(JSON.stringify(registryMetrics(registry), null, 2));
