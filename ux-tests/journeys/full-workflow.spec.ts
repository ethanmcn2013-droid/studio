import { expect, test } from "@playwright/test";
import { loadPersona } from "../utils/personas";
import { productUrl } from "../utils/products";
import {
  annotateJourney,
  annotatePersona,
  auditInteractiveBasics,
  expectNoConsoleErrors,
  gotoAndReport,
  installConsoleCapture,
  takeStepScreenshot,
  uxStep,
} from "../utils/reporting";
import { auditPageCraft, enforceUxQualityGate } from "../utils/quality-gates";
import { loadScenario } from "../utils/scenario";
import { auditUxScorecard } from "../utils/scorecard";
import { addUxFriction } from "../utils/ux-lens";

test("Full workflow connects Notes -> Tasks -> Timeline -> Signal", async ({
  page,
}, testInfo) => {
  const scenario = loadScenario("full-workflow.student");
  const persona = loadPersona(process.env.UX_PERSONA ?? scenario.persona);
  annotatePersona(testInfo, persona);
  annotateJourney(testInfo, "Full workflow: Notes -> Tasks -> Timeline -> Signal");
  testInfo.annotations.push({ type: "scenario-goal", description: scenario.goal });
  const consoleIssues = installConsoleCapture(page, testInfo);
  const handoffTitle = `UX handoff ${Date.now()} confirm group presentation owner`;

  await uxStep(testInfo, "Create a note and send it into Tasks", async () => {
    await gotoAndReport(page, testInfo, productUrl("notes", "/app"), "Notes app");
    const capture = page.getByLabel("Capture a private note");
    await capture.fill(handoffTitle);
    await capture.press("Enter");
    await expect(capture).toHaveValue("");
    await expect(noteRow(page, handoffTitle)).toBeVisible();
    await noteRow(page, handoffTitle).click();
    await expect(page.getByRole("article", { name: "Open note" })).toBeVisible();
    await page.getByRole("button", { name: "Send note to Tasks as written" }).click();
    await expect(
      page
        .getByRole("article", { name: "Open note" })
        .getByText("Added to your Tasks workspace."),
    ).toBeVisible({ timeout: 10_000 });
    await takeStepScreenshot(page, testInfo, "workflow-notes-created-and-sent");
  });

  await uxStep(testInfo, "Tasks shows the action created from that note", async () => {
    await gotoAndReport(page, testInfo, productUrl("tasks", "/app/board"), "Tasks board");
    await expect(page.getByText(handoffTitle)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("group", { name: "To do" })).toBeVisible();
    await takeStepScreenshot(page, testInfo, "workflow-tasks");
  });

  await uxStep(testInfo, "Timeline translates work into a readable plan", async () => {
    await gotoAndReport(
      page,
      testInfo,
      productUrl("timeline", "/the-wedding"),
      "Timeline public plan",
    );
    await expect(page.getByRole("heading", { name: "Your wedding plan." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Final numbers" })).toBeVisible();
    await takeStepScreenshot(page, testInfo, "workflow-timeline");
  });

  await uxStep(testInfo, "Signal reduces the work into a short daily review", async () => {
    await gotoAndReport(page, testInfo, productUrl("signal", "/app"), "Signal app");
    await expect(page.getByText(/Daily Signal/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: /Needs attention/i })).toBeVisible();
    await takeStepScreenshot(page, testInfo, "workflow-signal");
  });

  addUxFriction(
    testInfo,
    "low",
    "The bot now exercises a live demo-mode Notes -> Tasks handoff, while Timeline and Signal still validate seeded continuity rather than consuming that newly created task.",
    "Add demo-safe Timeline and Signal adapters so the exact created task can flow through every downstream surface in one run.",
  );

  await auditInteractiveBasics(page, testInfo);
  await auditPageCraft(page, testInfo);
  await auditUxScorecard(page, testInfo, {
    journey: "Full workflow: Notes -> Tasks -> Timeline -> Signal",
    expectSuiteContinuity: true,
  });
  enforceUxQualityGate(testInfo);
  await expectNoConsoleErrors(consoleIssues, testInfo);
});

function noteRow(page: import("@playwright/test").Page, text: string) {
  return page.locator("[data-note-row]").filter({ hasText: text }).first();
}
