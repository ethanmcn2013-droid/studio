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
import { auditUxScorecard } from "../utils/scorecard";

test("Tasks workflow supports board scanning, quick add, and task detail review", async ({
  page,
}, testInfo) => {
  const persona = loadPersona();
  annotatePersona(testInfo, persona);
  annotateJourney(testInfo, "Tasks workflow");
  const consoleIssues = installConsoleCapture(page, testInfo);
  const taskTitle = `UX task ${Date.now()} confirm lecturer slides`;

  await uxStep(testInfo, "Open the Tasks board in demo state", async () => {
    await gotoAndReport(page, testInfo, productUrl("tasks", "/app/board"), "Tasks board");
    await expect(page.getByRole("group", { name: "To do" })).toBeVisible();
    await expect(page.getByRole("group", { name: "Moving" })).toBeVisible();
    await expect(page.getByText("Confirm marquee sides with the hire company")).toBeVisible();
    await takeStepScreenshot(page, testInfo, "tasks-board-loaded");
  });

  await uxStep(testInfo, "Inline add accepts a plain-language task", async () => {
    await page.getByRole("button", { name: "Add task" }).first().click();
    const composer = page.getByPlaceholder(/What's next/i);
    await composer.fill(taskTitle);
    await composer.press("Enter");
    await expect(page.getByText(taskTitle)).toBeVisible();
    await takeStepScreenshot(page, testInfo, "tasks-inline-add");
  });

  await uxStep(testInfo, "Quick-added task remains after reload", async () => {
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByRole("group", { name: "To do" })).toBeVisible();
    await expect(page.getByText(taskTitle)).toBeVisible({ timeout: 10_000 });
    await takeStepScreenshot(page, testInfo, "tasks-inline-add-persisted");
  });

  await uxStep(testInfo, "Opening a task exposes detail controls", async () => {
    await page.getByText("Confirm marquee sides with the hire company").first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("button", { name: "Close task panel" })).toBeVisible();
    await takeStepScreenshot(page, testInfo, "tasks-detail-panel");
    await page.getByRole("button", { name: "Close task panel" }).click();
  });

  await auditInteractiveBasics(page, testInfo);
  await auditPageCraft(page, testInfo);
  await auditUxScorecard(page, testInfo, { journey: "Tasks workflow" });
  enforceUxQualityGate(testInfo);
  await expectNoConsoleErrors(consoleIssues, testInfo);
});
