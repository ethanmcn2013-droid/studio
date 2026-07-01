import fs from "node:fs";
import path from "node:path";
import { parseSimpleYaml } from "./yaml";

export type Persona = {
  slug: string;
  name: string;
  context: string;
  goal: string;
  likely_language: string[];
  workflow_expectations: string[];
  friction_risks: string[];
  success_criteria: string[];
};

const PERSONA_DIR = path.join(process.cwd(), "ux-tests", "personas");

export function loadPersona(slug = process.env.UX_PERSONA ?? "student"): Persona {
  const file = path.join(PERSONA_DIR, `${slug}.yaml`);
  if (!fs.existsSync(file)) {
    throw new Error(`Unknown UX persona "${slug}". Expected ${file}`);
  }
  const raw = parseSimpleYaml(fs.readFileSync(file, "utf8"));
  return {
    slug,
    name: stringValue(raw.name, slug),
    context: stringValue(raw.context),
    goal: stringValue(raw.goal),
    likely_language: listValue(raw.likely_language),
    workflow_expectations: listValue(raw.workflow_expectations),
    friction_risks: listValue(raw.friction_risks),
    success_criteria: listValue(raw.success_criteria),
  };
}

function stringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function listValue(value: unknown): string[] {
  return Array.isArray(value) ? value : [];
}
