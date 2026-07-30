import { expect, test } from "@playwright/test";

test.describe("delight follow-through contract", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
  });

  test("Design specimens expose honest keyboard controls", async ({ page }) => {
    await page.goto("/design");

    const pauseReel = page.getByRole("button", { name: "Pause reel" });
    await pauseReel.scrollIntoViewIfNeeded();
    await pauseReel.click();
    await expect(
      page.getByRole("button", { name: "Resume reel" }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: "Replay moment" })).toBeEnabled();

    const firstCard = page.locator(".dsn-flip").first();
    await firstCard.focus();
    await page.keyboard.press("Enter");
    await expect(firstCard).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("Escape");
    await expect(firstCard).toHaveAttribute("aria-pressed", "false");

    await expect(page.getByRole("button", { name: "Poke Dot" })).toBeVisible();
  });

  test("the mobile menu contains focus and restores the page", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/notes");

    const trigger = page.getByRole("button", { name: "Open navigation" });
    await trigger.click();
    await expect(page.locator("html")).toHaveCSS("overflow", "hidden");
    await expect
      .poll(() =>
        page
          .locator("main")
          .evaluate((node) => (node as HTMLElement).inert),
      )
      .toBe(true);

    await page.keyboard.press("Shift+Tab");
    await expect(
      page
        .getByRole("navigation", { name: "All pages" })
        .getByRole("link", { name: "About" }),
    ).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("button", { name: "Close navigation" }),
    ).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
    await expect
      .poll(() =>
        page
          .locator("main")
          .evaluate((node) => (node as HTMLElement).inert),
      )
      .toBe(false);
  });

  test("Notes can pause, replay, and stop while offscreen", async ({ page }) => {
    await page.goto("/notes");

    const notes = page.locator(".bil:not(.bil-embedded)");
    await page.getByRole("button", { name: "Pause", exact: true }).click();
    await expect(notes).toHaveAttribute("data-paused", "true");
    await expect(page.getByText("Story paused", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Replay", exact: true }).click();
    await expect(page.getByText("Story playing", { exact: true })).toBeVisible();

    await page.locator("footer").last().scrollIntoViewIfNeeded();
    await expect(notes).toHaveAttribute("data-paused", "true");
  });

  test("Tasks exposes deterministic pause and remounted replay", async ({
    page,
  }) => {
    await page.goto("/tasks");

    const demo = page.locator("[data-cinematic-demo-playback]").first();
    const pause = page.getByRole("button", { name: "Pause", exact: true }).first();
    await pause.click();
    await expect(demo).toHaveAttribute("data-cinematic-demo-playback", "paused");

    const pausedSnapshot = await demo.getAttribute("data-cinematic-demo-snapshot");
    await page.waitForTimeout(700);
    await expect(demo).toHaveAttribute(
      "data-cinematic-demo-snapshot",
      pausedSnapshot ?? "",
    );

    await page.getByRole("button", { name: "Replay", exact: true }).first().click();
    await expect(demo).toHaveAttribute(
      "data-cinematic-demo-snapshot",
      /boot\|board\|/,
    );
  });

  test("Signal actions are real destinations and embedded actions are receipts", async ({
    page,
  }) => {
    await page.goto("/signal");

    await expect(page.getByRole("link", { name: "Open task" })).toHaveAttribute(
      "href",
      "https://app.signalstudio.ie/app/tasks",
    );
    await expect(
      page.getByRole("link", { name: "Open timeline" }),
    ).toHaveAttribute("href", "https://app.signalstudio.ie/app/timeline");

    await page.goto("/");
    const embedded = page.locator(".rd-embedded");
    await expect(embedded.getByText("Task receipt", { exact: true })).toBeVisible();
    await expect(
      embedded.getByText("Timeline receipt", { exact: true }),
    ).toBeVisible();
    await expect(embedded.getByRole("button")).toHaveCount(0);
  });

  test("Timeline's useful frame is present in the server response", async ({
    request,
  }) => {
    const response = await request.get("/timeline");
    expect(response.ok()).toBe(true);
    const html = await response.text();
    expect(html).toContain('class="tlh" data-opened="true"');
    expect(html).toContain("The plan, in the open");
    expect(html).toContain("timeline.signalstudio.ie/mara-and-finn");
  });
});
