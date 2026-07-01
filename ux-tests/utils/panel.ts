import fs from "node:fs";
import path from "node:path";
import { parseSimpleYaml } from "./yaml";

export type PanelMember = {
  slug: string;
  name: string;
  role: string;
  primary_question: string;
  looks_for: string[];
  red_flags: string[];
  world_class_bar: string;
};

const PANEL_DIR = path.join(process.cwd(), "ux-tests", "panel");
const PANEL_ORDER = [
  "non-technical-user",
  "founder-operator",
  "brand-guardian",
  "qa-architect",
  "ai-coding-safety-lead",
  "commercial-reality-check",
];

export function loadPanel(): PanelMember[] {
  if (!fs.existsSync(PANEL_DIR)) return [];

  return fs
    .readdirSync(PANEL_DIR)
    .filter((file) => file.endsWith(".yaml"))
    .sort((a, b) => panelRank(a) - panelRank(b) || a.localeCompare(b))
    .map((file) => {
      const slug = file.replace(/\.yaml$/, "");
      const raw = parseSimpleYaml(fs.readFileSync(path.join(PANEL_DIR, file), "utf8"));
      return {
        slug,
        name: stringValue(raw.name, slug),
        role: stringValue(raw.role),
        primary_question: stringValue(raw.primary_question),
        looks_for: listValue(raw.looks_for),
        red_flags: listValue(raw.red_flags),
        world_class_bar: stringValue(raw.world_class_bar),
      };
    });
}

function panelRank(file: string) {
  const slug = file.replace(/\.yaml$/, "");
  const index = PANEL_ORDER.indexOf(slug);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function stringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function listValue(value: unknown): string[] {
  return Array.isArray(value) ? value : [];
}
