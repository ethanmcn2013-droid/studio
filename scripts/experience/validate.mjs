#!/usr/bin/env node
import path from "node:path";
import {
  discoverRegistry,
  readJson,
  registryMetrics,
  validateRegistry,
} from "./lib.mjs";

const studioRoot = process.cwd();
const experienceRoot = path.join(studioRoot, "experience");
const selectedProduct = process.argv.find((argument) => argument.startsWith("--product="))?.split("=")[1];
const fullConfig = readJson(path.join(experienceRoot, "config.json"));
const fullExplicit = readJson(path.join(experienceRoot, "surfaces.json"));
const fullRegistry = readJson(path.join(experienceRoot, "registry.json"));
const fullFindings = readJson(path.join(experienceRoot, "findings.json"));
const config = selectedProduct
  ? { ...fullConfig, products: fullConfig.products.filter((product) => product.id === selectedProduct) }
  : fullConfig;
const explicit = selectedProduct
  ? { ...fullExplicit, surfaces: fullExplicit.surfaces.filter((surface) => surface.product === selectedProduct) }
  : fullExplicit;
const registry = selectedProduct
  ? { ...fullRegistry, experiences: fullRegistry.experiences.filter((entry) => entry.product === selectedProduct) }
  : fullRegistry;
const findings = selectedProduct
  ? { ...fullFindings, findings: fullFindings.findings.filter((finding) => finding.product === selectedProduct) }
  : fullFindings;
const exceptions = readJson(path.join(experienceRoot, "exceptions.json"));
const discovered = discoverRegistry({ studioRoot, config, explicit });
const errors = validateRegistry({ registry, discovered, findings, exceptions, studioRoot });

if (errors.length) {
  console.error(`experience:validate: ${errors.length} failure(s)\n${errors.map((error) => `  x ${error}`).join("\n")}`);
  process.exit(1);
}
console.log(`experience:validate${selectedProduct ? `:${selectedProduct}` : ""}: clean\n${JSON.stringify(registryMetrics(registry), null, 2)}`);
