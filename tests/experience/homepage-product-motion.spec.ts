import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const PRODUCTS = ["notes", "tasks", "timeline", "signal"] as const;

function preview(page: Page, product: (typeof PRODUCTS)[number]) {
  return page.locator(`[data-relay-motion][data-product="${product}"]`);
}

test("the homepage starts each real product motion in its reading zone", async ({
  page,
}) => {
  const browserErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/");

  const previews = page.locator("[data-relay-motion]");
  await expect(previews).toHaveCount(4);
  await expect(preview(page, "notes")).toHaveAttribute(
    "data-motion-state",
    "static",
  );

  const notes = preview(page, "notes");
  await notes.evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await expect(notes).toHaveAttribute("data-motion-state", "playing");
  await expect(notes.locator(".bil-incoming-one")).toHaveCSS(
    "animation-name",
    /bil-note-type/,
  );

  const tasks = preview(page, "tasks");
  await tasks.evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await expect(tasks).toHaveAttribute("data-motion-state", "playing");
  await expect(tasks.locator("[data-cinematic-demo-playback]")).toHaveAttribute(
    "data-cinematic-demo-playback",
    "playing",
  );

  const timeline = preview(page, "timeline");
  await timeline.evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await expect(timeline).toHaveAttribute("data-motion-state", "playing");
  await expect(timeline.locator(".tlh")).toHaveAttribute("data-opened", "true");

  const signal = preview(page, "signal");
  await signal.evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await expect(signal).toHaveAttribute("data-motion-state", "playing");
  await expect(signal.locator(".rd-headline")).toHaveCSS(
    "animation-name",
    /rd-rise/,
  );

  await expect(tasks).toHaveAttribute("data-motion-state", "paused");
  await expect(tasks.locator("[data-cinematic-demo-playback]")).toHaveAttribute(
    "data-cinematic-demo-playback",
    "paused",
  );
  const pausedTasksSnapshot = await tasks
    .locator("[data-cinematic-demo-snapshot]")
    .getAttribute("data-cinematic-demo-snapshot");
  await page.waitForTimeout(1800);
  await expect(
    tasks.locator("[data-cinematic-demo-snapshot]"),
  ).toHaveAttribute("data-cinematic-demo-snapshot", pausedTasksSnapshot ?? "");
  await expect(
    timeline.locator('[class*="baseRail"]').first(),
  ).toHaveCSS("animation-play-state", "paused");
  expect(browserErrors).toEqual([]);
});

test("reduced motion keeps all four product proofs settled and contained", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.goto("/");

  for (const product of PRODUCTS) {
    const frame = preview(page, product);
    await frame.evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
    await expect(frame).toHaveAttribute("data-motion-state", "static");
    await expect(frame).toBeVisible();
  }

  await expect(
    preview(page, "tasks").locator("[data-cinematic-demo-playback]"),
  ).toHaveAttribute("data-cinematic-demo-playback", "static");
  await expect(preview(page, "notes").getByText("In Tasks")).toBeVisible();
  await expect(
    preview(page, "timeline").locator("[data-today-marker]"),
  ).toBeVisible();
  await expect(
    preview(page, "signal").getByText("The rest is clear"),
  ).toBeVisible();

  const metrics = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(metrics.scroll).toBeLessThanOrEqual(metrics.viewport);
});

test("the four homepage product proofs have no serious accessibility violations", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.goto("/");

  const result = await new AxeBuilder({ page })
    .include(".reveal-relay")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    result.violations.filter(
      (violation) =>
        violation.impact === "serious" || violation.impact === "critical",
    ),
  ).toEqual([]);
});
