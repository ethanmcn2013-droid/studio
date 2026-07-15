#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const root = process.cwd();
const experience = path.join(root, "experience");
const readJson = (file) => JSON.parse(readFileSync(file, "utf8"));
const ajv = new Ajv2020({ allErrors: true, strict: true, strictRequired: false });
addFormats(ajv);

function validate(label, schemaFile, values) {
  const schema = readJson(path.join(experience, "schemas", schemaFile));
  const validator = ajv.compile(schema);
  const errors = [];
  for (const [index, value] of values.entries()) {
    if (!validator(value)) {
      errors.push(
        ...validator.errors.map((error) =>
          `${label}${values.length > 1 ? `[${index}]` : ""}${error.instancePath || "/"} ${error.message}`,
        ),
      );
    }
  }
  return errors;
}

const findings = readJson(path.join(experience, "findings.json"));
const audits = readJson(path.join(experience, "audits.json"));
const reviews = readJson(path.join(experience, "reviews.json"));
const exceptions = readJson(path.join(experience, "exceptions.json"));
const errors = [
  ...validate("registry", "registry.schema.json", [readJson(path.join(experience, "registry.json"))]),
  ...validate("finding", "finding.schema.json", findings.findings),
  ...validate("audit", "audit.schema.json", audits.audits),
  ...validate("review", "review.schema.json", reviews.reviews),
  ...validate("exception", "exception.schema.json", exceptions.exceptions),
  ...validate("conformance", "conformance.schema.json", [readJson(path.join(experience, "conformance.json"))]),
];

if (errors.length) {
  console.error(`experience:schema-validate: ${errors.length} failure(s)\n${errors.map((error) => `  x ${error}`).join("\n")}`);
  process.exit(1);
}
console.log(`experience:schema-validate: pass (${findings.findings.length} findings, ${audits.audits.length} audits, ${reviews.reviews.length} reviews, ${exceptions.exceptions.length} exceptions)`);
