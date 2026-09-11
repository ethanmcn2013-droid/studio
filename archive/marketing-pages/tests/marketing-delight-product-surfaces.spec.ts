/**
 * Archived with the pages they cover — 2026-09-11 estate cut.
 *
 * Both tests drive `/notes`: the first exercises the product-page switcher
 * (`.pp-dot` / `.pp-current`), the second the Products mega-panel that opened
 * the three product pages from the nav. The route is archived and the panel
 * is out of the rail, so neither surface is reachable.
 *
 * Nothing here is disabled or skipped — it is parked with its subject. Move
 * this file back to `tests/experience/` in the same change that restores
 * `archive/marketing-pages/notes/` and the Products panel, and it should pass
 * as written.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("archived: product page and Products panel", () => {
  test.describe.configure({ mode: "serial", timeout: 60_000 });

  test("product switcher begins at the active product and follows intent", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/notes");

    const dot = page.locator(".pp-dot");
    const current = page.locator(".pp-current");
    await expect(dot).toHaveClass(/pp-dot-ready/);

    await expect
      .poll(async () => {
        const [dotBox, currentBox] = await Promise.all([
          dot.boundingBox(),
          current.boundingBox(),
        ]);
        if (!dotBox || !currentBox) return Number.POSITIVE_INFINITY;
        return Math.abs(
          dotBox.x +
            dotBox.width / 2 -
            (currentBox.x + currentBox.width / 2),
        );
      })
      .toBeLessThanOrEqual(2);

    const tasks = page.locator(".pp-pill").filter({ hasText: "tasks" });
    await tasks.hover();
    await expect
      .poll(async () => {
        const [nextDot, taskBox] = await Promise.all([
          dot.boundingBox(),
          tasks.boundingBox(),
        ]);
        if (!nextDot || !taskBox) return Number.POSITIVE_INFINITY;
        return Math.abs(
          nextDot.x +
            nextDot.width / 2 -
            (taskBox.x + taskBox.width / 2),
        );
      })
      .toBeLessThanOrEqual(2);

    await expect(tasks).toHaveAttribute("href", "https://signalstudio.ie/tasks");
  });

  test("Products panel has keyboard entry, bounded gestures, and a real exit", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/notes");

    const trigger = page.getByRole("button", { name: "Products" });
    const panel = page.locator("#products-mega-panel");
    const firstCard = page.locator(".mpanel-card").first();

    await trigger.focus();
    await trigger.press("ArrowDown");
    await expect(panel).toBeVisible();
    await expect(firstCard).toBeFocused();

    const gestures = await page.locator(".mpanel-card").evaluateAll((cards) =>
      cards.map((card) => {
        const animated = card.querySelector<HTMLElement>("svg [class]");
        const style = animated ? getComputedStyle(animated) : null;
        return {
          name: style?.animationName ?? "none",
          iterations: style?.animationIterationCount ?? "1",
        };
      }),
    );
    expect(gestures.every((gesture) => gesture.name === "none")).toBe(true);
    expect(
      gestures.every((gesture) => !gesture.iterations.includes("infinite")),
    ).toBe(true);

    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await expect(panel).toBeHidden();

    await trigger.click();
    await expect(panel).toBeVisible();
    await trigger.click();
    await page.waitForTimeout(45);
    await expect(panel).toBeVisible();
    await page.waitForTimeout(260);
    await expect(panel).toBeHidden();
  });

});
