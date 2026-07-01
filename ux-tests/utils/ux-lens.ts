import type { TestInfo } from "@playwright/test";

export const SIGNAL_STUDIO_PRINCIPLES = [
  "calm coordination",
  "obvious next step",
  "low jargon",
  "non-technical user friendly",
  "elegant restraint",
  "no feature sprawl",
  "Notes -> Tasks -> Timeline -> Signal should feel connected",
  "the system should reduce noise, not create it",
] as const;

export type Severity = "blocker" | "high" | "medium" | "low";

export function addUxFriction(
  testInfo: TestInfo,
  severity: Severity,
  note: string,
  suggestedFix?: string,
) {
  testInfo.annotations.push({ type: "ux-severity", description: severity });
  testInfo.annotations.push({ type: "ux-friction", description: note });
  if (suggestedFix) {
    testInfo.annotations.push({ type: "ux-fix", description: suggestedFix });
  }
}
