import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const LAB_PATH = "/__design-lab/brand-guidelines";
const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "landscape", width: 1024, height: 768 },
  { name: "desktop", width: 1440, height: 900 },
] as const;

test("the review route is hidden from canonical production hosts", async ({
  request,
}) => {
  const directResponse = await request.get(LAB_PATH, {
    headers: { host: "signalstudio.ie" },
  });
  expect(directResponse.status()).toBe(404);

  const forwardedResponse = await request.get(LAB_PATH, {
    headers: {
      host: "studio-production.vercel.app",
      "x-forwarded-host": "signalstudio.ie",
    },
  });
  expect(forwardedResponse.status()).toBe(404);
});

test("the review lab owns its shell while public design keeps site navigation", async ({
  page,
}) => {
  await page.goto(LAB_PATH);
  await expect(
    page.getByRole("navigation", { name: "Site navigation" }),
  ).toHaveCount(0);

  await page.goto("/design");
  await expect(
    page.getByRole("navigation", { name: "Site navigation" }),
  ).toBeVisible();
});

test("all nine chapters navigate in both directions and preserve hash history", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const response = await page.goto(LAB_PATH);
  expect(response?.status()).toBe(200);

  await expect(page.locator("[data-guideline-section]")).toHaveCount(9);
  const rail = page.getByRole("complementary", {
    name: "Brand guideline chapters",
  });
  await expect(rail.getByRole("link")).toHaveCount(10);

  await rail.getByRole("link", { name: /07 Moodboard/ }).click();
  await expect(page).toHaveURL(/#moodboard$/);
  await expect(
    rail.getByRole("link", { name: /07 Moodboard/ }),
  ).toHaveAttribute("aria-current", "location");

  await rail.getByRole("link", { name: /01 Introduction/ }).click();
  await expect(page).toHaveURL(/#introduction$/);
  await expect(
    rail.getByRole("link", { name: /01 Introduction/ }),
  ).toHaveAttribute("aria-current", "location");
});

test("interactive specimens work with explicit state and keyboard controls", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${LAB_PATH}#color`);

  const proportions = page.getByRole("button", { name: "Proportions" });
  await proportions.click();
  await expect(proportions).toHaveAttribute("aria-pressed", "true");

  const colorSection = page.locator("#color");
  await colorSection.getByRole("button", { name: "System" }).click();
  await colorSection
    .getByRole("button", { name: "Ink #111111 --ink" })
    .click();
  await expect(colorSection.getByRole("status")).toContainText("Copied");

  await page.goto(`${LAB_PATH}#motion`);
  const motionSection = page.locator("#motion");
  const freeze = motionSection
    .locator(".guidelines-motion-demo-controls")
    .first()
    .locator("button")
    .nth(1);
  await expect(freeze).toHaveText("Freeze");
  await freeze.click();
  await expect(freeze).toHaveAttribute("aria-pressed", "true");
  await expect(freeze).toHaveText("Resume");

  await page.goto(`${LAB_PATH}#moodboard`);
  const moodboard = page.locator("#moodboard");
  const cloud = moodboard.getByRole("button", { name: "Cloud" });
  const columns = moodboard.getByRole("button", { name: "Columns" });
  await cloud.focus();
  await cloud.press("ArrowRight");
  await expect(columns).toHaveAttribute("aria-pressed", "true");

  await moodboard.getByRole("button", { name: /Open image:/ }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  await page.goto(`${LAB_PATH}#assets`);
  const download = page.getByRole("link", { name: "Download everything" });
  await expect(download).toHaveAttribute(
    "href",
    "/brand/signal-studio-brand-kit-v2.zip",
  );
});

for (const viewport of VIEWPORTS) {
  test(`${viewport.name} renders without horizontal overflow`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize(viewport);
    const response = await page.goto(LAB_PATH);
    expect(response?.status()).toBe(200);

    const metrics = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(metrics.scroll).toBeLessThanOrEqual(metrics.viewport);

    if (viewport.width <= 900) {
      await expect(page.locator(".guidelines-mobile-index")).toBeVisible();
      await expect(page.locator(".guidelines-rail")).toBeHidden();
    } else {
      await expect(page.locator(".guidelines-mobile-index")).toBeHidden();
      await expect(page.locator(".guidelines-rail")).toBeVisible();
    }

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("#assets")).toContainText("Download everything");
  });
}

test("reduced motion resolves content and the page has no serious accessibility violations", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(LAB_PATH);

  const hiddenChapterCopy = await page
    .locator(".guidelines-chapter-head > *")
    .evaluateAll((nodes) =>
      nodes.filter((node) => Number.parseFloat(getComputedStyle(node).opacity) < 0.99)
        .length,
    );
  expect(hiddenChapterCopy).toBe(0);

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
