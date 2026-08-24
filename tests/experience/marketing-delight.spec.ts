import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const MARKETING_ROUTES = [
  "/notes",
  "/tasks",
  "/timeline",
  "/pricing",
  "/about",
] as const;

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

  test("Pricing uses finite state motion and keeps the decision legible", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/pricing");

    const ledger = page.locator("[data-pricing-ledger]");
    await ledger.scrollIntoViewIfNeeded();
    await expect(page.locator("#pricing-plan-pro")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await expect(page.locator("[data-pricing-panel]")).toContainText(
      "Unlimited workspaces",
    );

    await page.locator("#pricing-plan-free").click();
    const panel = page.locator("[data-pricing-panel]");
    await expect(panel).toContainText("One workspace");

    const motion = await panel.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        name: style.animationName,
        iterations: style.animationIterationCount,
      };
    });
    expect(motion.name).toMatch(/(?:^|__)plan-panel-arrive$/);
    expect(motion.iterations).toBe("1");

    const infinite = await ledger.locator("*").evaluateAll((elements) =>
      elements.filter((element) =>
        getComputedStyle(element).animationIterationCount.includes("infinite"),
      ).length,
    );
    expect(infinite).toBe(0);
  });

  test("About presents one semantic page, six movements, and acknowledges arrival once", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/about");

    const article = page.getByRole("article").first();
    await expect(article).toBeVisible();
    await expect(
      article.getByRole("heading", {
        level: 1,
        name: "Most productivity tools were built for the people who build them.",
      }),
    ).toBeVisible();

    const movements = [
      ["translation", "The industry has a dialect."],
      ["system", "Three products. Each owns one kind of clarity."],
      ["founder", "Built by one person."],
      ["refusals", "You can measure a company by what it refuses."],
      ["record", "Small, on purpose."],
    ] as const;
    for (const [id, heading] of movements) {
      await expect(
        article.locator(`#${id}`).getByRole("heading", { level: 2, name: heading }),
      ).toBeVisible();
    }
    await expect(article).not.toContainText("Daily briefing");

    const products = article.locator("#system li");
    await expect(products).toHaveCount(3);
    expect(
      await products
        .locator("a")
        .evaluateAll((anchors) => anchors.every((anchor) => Boolean(anchor.getAttribute("href")))),
    ).toBe(true);

    const reveal = article.locator("[data-delight-once]").first();
    await reveal.scrollIntoViewIfNeeded();
    await expect(reveal).toHaveAttribute("data-delight-visible", "true");
  });

  test("reduced motion preserves state and removes authored travel", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1280, height: 720 });

    await page.goto("/pricing");
    const ledger = page.locator("[data-pricing-ledger]");
    await ledger.scrollIntoViewIfNeeded();
    await page.locator("#pricing-plan-free").click();
    const pricingPanel = page.locator("[data-pricing-panel]");
    await expect(pricingPanel).toContainText("One workspace");
    expect(
      await pricingPanel.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          animation: style.animationName,
          opacity: style.opacity,
          transform: style.transform,
        };
      }),
    ).toEqual({ animation: "none", opacity: "1", transform: "none" });

    await page.goto("/about");
    const reveal = page.locator("[data-delight='founders-note-products']");
    await reveal.scrollIntoViewIfNeeded();
    await expect(reveal).toHaveAttribute("data-delight-visible", "true");
    const founder = page.locator("[data-delight='about-founder']");
    await founder.scrollIntoViewIfNeeded();
    await expect(founder).toHaveAttribute("data-delight-visible", "true");
    const reducedNames = await page.evaluate(() => ({
      rows: Array.from(
        document.querySelectorAll<HTMLElement>("[data-founders-note-product]"),
        (element) => getComputedStyle(element).animationName,
      ),
      rule: getComputedStyle(
        document.querySelector<HTMLElement>("[data-founder-rule]")!,
      ).animationName,
      dot: getComputedStyle(
        document.querySelector<HTMLElement>("[data-founder-dot]")!,
      ).animationName,
    }));
    expect(reducedNames).toEqual({
      rows: ["none", "none", "none"],
      rule: "none",
      dot: "none",
    });

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
