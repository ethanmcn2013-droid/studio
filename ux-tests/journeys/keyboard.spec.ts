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

test("Keyboard smoke keeps primary controls reachable without a mouse", async ({
  page,
}, testInfo) => {
  const persona = loadPersona();
  annotatePersona(testInfo, persona);
  annotateJourney(testInfo, "Keyboard and accessibility smoke");
  const consoleIssues = installConsoleCapture(page, testInfo);

  await uxStep(testInfo, "Notes capture can be used from keyboard focus", async () => {
    await gotoAndReport(page, testInfo, productUrl("notes", "/app"), "Notes app");
    const capture = page.getByLabel("Capture a private note");
    await capture.focus();
    await expect(capture).toBeFocused();
    await page.keyboard.type("Keyboard smoke: ask the team what needs attention today.");
    await expect(capture).toHaveValue(/Keyboard smoke/);
    await page.keyboard.press("Escape");
    await expect(capture).toHaveValue("");
    await takeStepScreenshot(page, testInfo, "keyboard-notes-capture");
  });

  await uxStep(testInfo, "Tasks add flow opens from keyboard activation", async () => {
    await gotoAndReport(page, testInfo, productUrl("tasks", "/app/board"), "Tasks board");
    const addTask = page.getByRole("button", { name: "Add task to To do" });
    await addTask.focus();
    await expect(addTask).toBeFocused();
    await page.keyboard.press("Enter");
    const composer = page.getByPlaceholder(/What's next/i);
    await expect(composer).toBeFocused();
    await composer.fill("Keyboard review: confirm the next handoff");
    await composer.press("Enter");
    await expect(page.getByText("Keyboard review")).toBeVisible();
    await takeStepScreenshot(page, testInfo, "keyboard-tasks-add");
  });

  await uxStep(testInfo, "Signal explanation can be reached after tabbing", async () => {
    await gotoAndReport(page, testInfo, productUrl("signal", "/app"), "Signal app");
    await page.keyboard.press("Tab");
    const whyThis = page.getByRole("button", { name: /Why this/i }).first();
    await whyThis.focus();
    await expect(whyThis).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByText(/from Tasks/i).first()).toBeVisible();
    await takeStepScreenshot(page, testInfo, "keyboard-signal-why-this");
  });

  await auditInteractiveBasics(page, testInfo);
  await auditPageCraft(page, testInfo);
  await auditUxScorecard(page, testInfo, {
    journey: "Keyboard and accessibility smoke",
  });
  enforceUxQualityGate(testInfo);
  await expectNoConsoleErrors(consoleIssues, testInfo);
});
