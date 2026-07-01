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

test("Timeline workflow supports public plan review and app project navigation", async ({
  page,
}, testInfo) => {
  const persona = loadPersona();
  annotatePersona(testInfo, persona);
  annotateJourney(testInfo, "Timeline workflow");
  const consoleIssues = installConsoleCapture(page, testInfo);

  await uxStep(testInfo, "Open the public wedding plan with no login wall", async () => {
    await gotoAndReport(
      page,
      testInfo,
      productUrl("timeline", "/the-wedding"),
      "Timeline public wedding plan",
    );
    await expect(page.getByRole("heading", { name: "Your wedding plan." })).toBeVisible();
    await expect(page.getByLabel("Schedule")).toBeVisible();
    await expect(page.getByText("Waiting on you").first()).toBeVisible();
    await takeStepScreenshot(page, testInfo, "timeline-public-plan");
  });

  await uxStep(testInfo, "Demo route resolves to the canonical public plan", async () => {
    await gotoAndReport(page, testInfo, productUrl("timeline", "/demo"), "Timeline demo");
    await expect(page).toHaveURL(/\/the-wedding$/);
  });

  await uxStep(testInfo, "Open the Timeline app dashboard and project", async () => {
    await gotoAndReport(page, testInfo, productUrl("timeline", "/app"), "Timeline app");
    await expect(page.getByRole("heading", { name: /Tasks.*Product Timeline/i })).toBeVisible();
    await page.getByRole("link", { name: /Product Timeline/i }).first().click();
    await expect(page).toHaveURL(/\/app\/plan\/product/);
    await expect(page.getByText("Workspace onboarding")).toBeVisible();
    await takeStepScreenshot(page, testInfo, "timeline-app-project");
  });

  await auditInteractiveBasics(page, testInfo);
  await auditPageCraft(page, testInfo);
  await auditUxScorecard(page, testInfo, { journey: "Timeline workflow" });
  enforceUxQualityGate(testInfo);
  await expectNoConsoleErrors(consoleIssues, testInfo);
});
