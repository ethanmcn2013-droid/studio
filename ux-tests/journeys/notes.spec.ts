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

test("Notes workflow supports capture, search, shaping, and Tasks handoff affordances", async ({
  page,
}, testInfo) => {
  const persona = loadPersona();
  annotatePersona(testInfo, persona);
  annotateJourney(testInfo, "Notes workflow");
  const consoleIssues = installConsoleCapture(page, testInfo);
  const noteTitle = `UX note ${Date.now()} ask Sarah for slides`;
  const actionTitle = `UX action ${Date.now()} confirm slides owner`;

  await uxStep(testInfo, "Open the Notes app in demo state", async () => {
    await gotoAndReport(page, testInfo, productUrl("notes", "/app"), "Notes app");
    await expect(page.getByRole("region", { name: "Signal Notes notebook" })).toBeVisible();
    await expect(page.getByLabel("Capture a private note")).toBeVisible();
    await takeStepScreenshot(page, testInfo, "notes-app-loaded");
  });

  await uxStep(testInfo, "Capture saves realistic user language", async () => {
    const capture = page.getByLabel("Capture a private note");
    await capture.fill(noteTitle);
    await expect(capture).toHaveValue(noteTitle);
    await capture.press("Enter");
    await expect(capture).toHaveValue("");
    await expect(noteRow(page, noteTitle)).toBeVisible();
    await takeStepScreenshot(page, testInfo, "notes-captured-note");
  });

  await uxStep(testInfo, "Search filters existing notes without losing context", async () => {
    await page.getByLabel("Search").fill("florist");
    await expect(noteRow(page, "Florist can do the arch")).toBeVisible();
    await takeStepScreenshot(page, testInfo, "notes-search");
  });

  await uxStep(testInfo, "A note can be opened, shaped, and sent to Tasks", async () => {
    await page.getByLabel("Search").fill("");
    await expect(noteRow(page, noteTitle)).toBeVisible();
    await noteRow(page, noteTitle).click();
    await expect(page.getByRole("article", { name: "Open note" })).toBeVisible();
    await page.getByRole("button", { name: "Shape the wording before sending to Tasks" }).click();
    const actionInput = page.getByPlaceholder(/Type the action wording/i);
    await actionInput.fill(actionTitle);
    await expect(page.getByRole("button", { name: "Save" })).toBeEnabled();
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Saved. Ready to send to Signal Tasks.")).toBeVisible();
    await page
      .getByRole("article", { name: "Open note" })
      .getByRole("button", { name: "Send to Tasks", exact: true })
      .click();
    await expect(
      page
        .getByRole("article", { name: "Open note" })
        .getByText("Added to your Tasks workspace."),
    ).toBeVisible({ timeout: 10_000 });
    await takeStepScreenshot(page, testInfo, "notes-shaped-and-sent");
  });

  await uxStep(testInfo, "Tasks receives the shaped action from Notes", async () => {
    await gotoAndReport(page, testInfo, productUrl("tasks", "/app/board"), "Tasks board");
    await expect(page.getByText(actionTitle)).toBeVisible({ timeout: 10_000 });
    await takeStepScreenshot(page, testInfo, "notes-handoff-visible-in-tasks");
  });

  await auditInteractiveBasics(page, testInfo);
  await auditPageCraft(page, testInfo);
  await auditUxScorecard(page, testInfo, { journey: "Notes workflow" });
  enforceUxQualityGate(testInfo);
  await expectNoConsoleErrors(consoleIssues, testInfo);
});

function noteRow(page: import("@playwright/test").Page, text: string) {
  return page.locator("[data-note-row]").filter({ hasText: text }).first();
}
