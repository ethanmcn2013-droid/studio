import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("the accessibility gate catches a deliberate violation and clears after repair", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.setContent('<main><button id="target"></button></main>');
  const broken = await new AxeBuilder({ page }).analyze();
  expect(broken.violations.map((violation) => violation.id)).toContain("button-name");

  await page.locator("#target").evaluate((element) => element.setAttribute("aria-label", "Create task"));
  const repaired = await new AxeBuilder({ page }).analyze();
  expect(repaired.violations.map((violation) => violation.id)).not.toContain("button-name");
});

test("the visual harness produces a deterministic review card", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.setContent(`
    <style>
      :root { color-scheme: light; font-family: Arial, sans-serif; }
      * { box-sizing: border-box; }
      body { margin: 0; padding: 24px; background: rgb(247, 247, 245); color: rgb(20, 20, 21); }
      article { border: 1px solid rgb(215, 215, 211); border-radius: 12px; background: white; padding: 20px; }
      p { color: rgb(92, 92, 88); line-height: 1.5; }
      strong { color: rgb(79, 70, 229); }
    </style>
    <article aria-label="Experience review">
      <small>SIGNAL EXPERIENCE / MOBILE</small>
      <h1>Task detail</h1>
      <p>One stable surface, four required breakpoints, and evidence before approval.</p>
      <strong>3 findings resolved</strong>
    </article>
  `);
  await expect(page).toHaveScreenshot("deterministic-review-card.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0,
  });
});
