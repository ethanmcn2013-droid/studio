import fs from "node:fs";
import path from "node:path";
import { parseSimpleYaml } from "./yaml";

export type Scenario = {
  persona: string;
  goal: string;
  starting_state: string;
  journey: string[];
  success_criteria: string[];
};

export function loadScenario(name: string): Scenario {
  const file = path.join(process.cwd(), "ux-tests", "scenarios", `${name}.yaml`);
  if (!fs.existsSync(file)) {
    throw new Error(`Unknown UX scenario "${name}". Expected ${file}`);
  }

  const raw = parseSimpleYaml(fs.readFileSync(file, "utf8"));
  return {
    persona: stringValue(raw.persona, "student"),
    goal: stringValue(raw.goal),
    starting_state: stringValue(raw.starting_state, "demo_user"),
    journey: listValue(raw.journey),
    success_criteria: listValue(raw.success_criteria),
  };
}

function stringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function listValue(value: unknown): string[] {
  return Array.isArray(value) ? value : [];
}
