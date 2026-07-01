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

test("Signal workflow supports daily brief review, explanation, and feedback", async ({
  page,
}, testInfo) => {
  const persona = loadPersona();
  annotatePersona(testInfo, persona);
  annotateJourney(testInfo, "Signal workflow");
  const consoleIssues = installConsoleCapture(page, testInfo);

  await uxStep(testInfo, "Open the Signal briefing in demo state", async () => {
    await gotoAndReport(page, testInfo, productUrl("signal", "/app"), "Signal app");
    await expect(page.getByText(/Daily Signal/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: /Needs attention/i })).toBeVisible();
    await takeStepScreenshot(page, testInfo, "signal-brief-loaded");
  });

  await uxStep(testInfo, "Reader can ask why an item surfaced", async () => {
    await page.getByRole("button", { name: /Why this/i }).first().click();
    await expect(page.getByText(/from Tasks/i).first()).toBeVisible();
    await takeStepScreenshot(page, testInfo, "signal-why-this");
  });

  await uxStep(testInfo, "Feedback is acknowledged without a modal", async () => {
    await page.getByRole("button", { name: "This was useful" }).first().click();
    await expect(page.getByText(/Thanks/i).first()).toBeVisible();
    await takeStepScreenshot(page, testInfo, "signal-feedback");
  });

  await auditInteractiveBasics(page, testInfo);
  await auditPageCraft(page, testInfo);
  await auditUxScorecard(page, testInfo, { journey: "Signal workflow" });
  enforceUxQualityGate(testInfo);
  await expectNoConsoleErrors(consoleIssues, testInfo);
});
