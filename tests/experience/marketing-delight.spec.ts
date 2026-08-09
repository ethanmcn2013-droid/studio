import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const MARKETING_ROUTES = [
  "/notes",
  "/tasks",
  "/timeline",
  "/pricing",
  "/about",
] as const;

async function pricingAnimations(page: Page) {
  return page.evaluate(() =>
    Array.from(
      document.querySelectorAll<HTMLElement>(
        ".pricing-anchor-dot, .pricing-mark .dot, [data-delight='pricing-plans'] > div",
      ),
    ).map((element) => {
      const style = getComputedStyle(element);
      return {
        name: style.animationName,
        iterations: style.animationIterationCount,
      };
    }),
  );
}

test.describe("public marketing delight contract", () => {
  test.describe.configure({ mode: "serial", timeout: 60_000 });

  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
  });

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
    expect(gestures.every((gesture) => gesture.name !== "none")).toBe(true);
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

  test("Pricing uses finite, one-shot attention cues", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/pricing");

    expect(
      (await pricingAnimations(page)).every(
        (animation) => !animation.iterations.includes("infinite"),
      ),
    ).toBe(true);

    const plans = page.locator("[data-delight='pricing-plans']");
    await plans.scrollIntoViewIfNeeded();
    await expect(plans).toHaveAttribute("data-delight-visible", "true");

    const planCards = await plans.locator(":scope > div").evaluateAll((cards) =>
      cards.map((card) => {
        const style = getComputedStyle(card);
        return {
          name: style.animationName,
          iterations: style.animationIterationCount,
        };
      }),
    );
    expect(planCards.every((card) => card.name === "pricing-plan-settle")).toBe(
      true,
    );
    expect(planCards.every((card) => card.iterations === "1")).toBe(true);

    const suite = page.locator("[data-delight='pricing-suite']");
    await suite.scrollIntoViewIfNeeded();
    await expect(suite).toHaveAttribute("data-delight-visible", "true");

    const marks = await suite.locator(".pricing-mark .dot").evaluateAll((dots) =>
      dots.map((dot) => {
        const style = getComputedStyle(dot);
        return {
          name: style.animationName,
          iterations: style.animationIterationCount,
        };
      }),
    );
    expect(marks.map((mark) => mark.name)).toEqual([
      "pricing-caret",
      "pricing-pulse",
      "pricing-sweep",
    ]);
    expect(
      marks.every((mark) => !mark.iterations.includes("infinite")),
    ).toBe(true);
  });

  test("About keeps the essay still and acknowledges authorship once", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/about");

    const firstProduct = page.locator(".about-product-link").first();
    const arrow = firstProduct.locator(".about-product-arrow");
    await firstProduct.hover();
    await expect
      .poll(() =>
        arrow.evaluate((element) => getComputedStyle(element).transform),
      )
      .not.toBe("none");

    const founder = page.locator("[data-delight='about-founder']");
    await founder.scrollIntoViewIfNeeded();
    await expect(founder).toHaveAttribute("data-delight-visible", "true");

    const signature = founder.locator(".about-founder-signature");
    const names = await signature.evaluate((element) => ({
      signature: getComputedStyle(element).animationName,
      dot: getComputedStyle(
        element.querySelector<HTMLElement>(".about-founder-dot")!,
      ).animationName,
      identity: getComputedStyle(
        element.querySelector<HTMLElement>(".about-founder-identity")!,
      ).animationName,
    }));
    expect(names).toEqual({
      signature: "none",
      dot: "none",
      identity: "none",
    });
  });

  test("reduced motion preserves state and removes authored travel", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1280, height: 720 });

    await page.goto("/pricing");
    const plans = page.locator("[data-delight='pricing-plans']");
    await plans.scrollIntoViewIfNeeded();
    await expect(plans).toHaveAttribute("data-delight-visible", "true");
    expect(
      (await pricingAnimations(page)).every(
        (animation) => animation.name === "none",
      ),
    ).toBe(true);

    await page.goto("/about");
    const founder = page.locator("[data-delight='about-founder']");
    await founder.scrollIntoViewIfNeeded();
    await expect(founder).toHaveAttribute("data-delight-visible", "true");
    const reducedNames = await founder.evaluate((element) => ({
      rule: getComputedStyle(
        element.querySelector<HTMLElement>(".about-founder-signature")!,
        "::before",
      ).animationName,
      dot: getComputedStyle(
        element.querySelector<HTMLElement>(".about-founder-dot")!,
      ).animationName,
    }));
    expect(reducedNames).toEqual({ rule: "none", dot: "none" });

    await page.goto("/notes");
    await expect(page.locator(".pp-dot")).toHaveClass(/pp-dot-ready/);
    expect(
      await page
        .locator(".pp-dot")
        .evaluate((element) => getComputedStyle(element).transitionProperty),
    ).toBe("opacity");
  });

  test("all current pages remain contained at the mobile viewport", async ({
    page,
  }) => {
    test.slow();
    await page.setViewportSize({ width: 390, height: 844 });

    for (const route of MARKETING_ROUTES) {
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow, `${route} introduced horizontal overflow`).toBeLessThanOrEqual(
        1,
      );
    }

    await page.goto("/about");
    const trigger = page.getByRole("button", { name: "Open navigation" });
    await trigger.click();
    await expect(page.locator("#mobile-nav-panel")).toBeVisible();
    await page
      .getByRole("button", { name: "Close navigation" })
      .click();
    await page.waitForTimeout(240);
    await expect(page.locator("#mobile-nav-panel")).toBeHidden();
  });

  test("all current pages have no serious accessibility violations", async ({
    page,
  }) => {
    test.slow();
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });

    for (const route of MARKETING_ROUTES) {
      await page.goto(route);
      let audit = new AxeBuilder({ page }).withTags([
        "wcag2a",
        "wcag2aa",
        "wcag21aa",
      ]);
      if (
        route === "/notes" ||
        route === "/tasks" ||
        route === "/timeline"
      ) {
        // Product heroes are accepted, self-contained systems with their own
        // contract. This release changes the shell, switcher, handoff, close
        // and footer, so the regression gate owns those exact surfaces.
        audit = audit
          .include("header")
          .include("nav.pp")
          .include("[data-product-handoff]")
          .include("[aria-label='Join the waitlist']")
          .include("footer");
      }
      const result = await audit.analyze();
      expect(
        result.violations.filter(
          (violation) =>
            violation.impact === "serious" ||
            violation.impact === "critical",
        ),
        `${route} has a serious or critical accessibility violation`,
      ).toEqual([]);
    }
  });
});
