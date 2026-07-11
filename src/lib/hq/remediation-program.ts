import fs from "node:fs";
import path from "node:path";

export type RemediationStatus = "planned" | "active" | "blocked" | "verifying" | "complete";
export type RemediationPriority = "P0" | "P1" | "P2" | "P3";

export type RemediationItem = {
  id: string;
  phase: number;
  title: string;
  products: string[];
  priority: RemediationPriority;
  status: RemediationStatus;
  owner: string;
  dependencies: string[];
  evidence: Record<string, string[]>;
  founder_gate: boolean;
};

export type RemediationProgram = {
  version: number;
  program: string;
  updatedAt: string;
  reportedCompletion: number;
  requiredEvidenceClasses: string[];
  items: RemediationItem[];
};

const ledgerPath = path.join(process.cwd(), "docs", "signal-studio-review", "remediation-program.yaml");

export function getRemediationProgram(): RemediationProgram {
  const source = fs.readFileSync(ledgerPath, "utf8");
  return JSON.parse(source) as RemediationProgram;
}

export function summarizeRemediation(program: RemediationProgram) {
  const total = program.items.length;
  const completed = program.items.filter((item) => item.status === "complete").length;
  const openP0 = program.items.filter((item) => item.priority === "P0" && item.status !== "complete");
  const byPhase = new Map<number, { total: number; completed: number }>();
  for (const item of program.items) {
    const phase = byPhase.get(item.phase) ?? { total: 0, completed: 0 };
    phase.total += 1;
    if (item.status === "complete") phase.completed += 1;
    byPhase.set(item.phase, phase);
  }
  return {
    calculatedCompletion: total ? Math.round((completed / total) * 100) : 0,
    completed,
    total,
    openP0,
    byPhase: [...byPhase.entries()].sort(([a], [b]) => a - b),
  };
}
