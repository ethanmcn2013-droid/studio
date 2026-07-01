import { test } from "@playwright/test";
import { loadPersona } from "../utils/personas";
import {
  annotateJourney,
  annotatePersona,
  auditInteractiveBasics,
  expectNoConsoleErrors,
  installConsoleCapture,
  uxStep,
} from "../utils/reporting";
import { auditPageCraft, enforceUxQualityGate } from "../utils/quality-gates";
import { loadScenario } from "../utils/scenario";
import { runScenarioInstruction } from "../utils/scenario-engine";
import { auditUxScorecard } from "../utils/scorecard";

const scenarioName = process.env.UX_SCENARIO ?? "full-workflow.student";

test(`Scenario file: ${scenarioName}`, async ({ page }, testInfo) => {
  const scenario = loadScenario(scenarioName);
  const persona = loadPersona(process.env.UX_PERSONA ?? scenario.persona);
  annotatePersona(testInfo, persona);
  annotateJourney(testInfo, `Scenario: ${scenario.goal}`);
  testInfo.annotations.push({ type: "scenario-name", description: scenarioName });
  testInfo.annotations.push({ type: "scenario-goal", description: scenario.goal });
  testInfo.annotations.push({
    type: "scenario-starting-state",
    description: scenario.starting_state,
  });

  const consoleIssues = installConsoleCapture(page, testInfo);

  for (const instruction of scenario.journey) {
    await uxStep(testInfo, `Scenario instruction: ${instruction}`, async () => {
      await runScenarioInstruction(page, testInfo, instruction);
    });
  }

  for (const criterion of scenario.success_criteria) {
    testInfo.annotations.push({
      type: "scenario-success-criteria",
      description: criterion,
    });
  }

  await auditInteractiveBasics(page, testInfo);
  await auditPageCraft(page, testInfo);
  await auditUxScorecard(page, testInfo, {
    journey: `Scenario: ${scenario.goal}`,
    expectSuiteContinuity: true,
  });
  enforceUxQualityGate(testInfo);
  await expectNoConsoleErrors(consoleIssues, testInfo);
});
