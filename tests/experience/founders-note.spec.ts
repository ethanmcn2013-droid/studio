import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const ABOUT_URL = "/about";

const VIEWPORTS = [
  { width: 1600, height: 1000, titleSize: 96, titleLine: 95.04, bodySize: 19 },
  { width: 1440, height: 900, titleSize: 88, titleLine: 87.12, bodySize: 19 },
  { width: 1280, height: 800, titleSize: 78, titleLine: 77.22, bodySize: 19 },
  { width: 1024, height: 768, titleSize: 68, titleLine: 67.32, bodySize: 19 },
  { width: 768, height: 1024, titleSize: 56, titleLine: 56.56, bodySize: 19 },
  { width: 430, height: 932, titleSize: 40, titleLine: 43.2, bodySize: 17 },
  { width: 390, height: 844, titleSize: 36, titleLine: 38.88, bodySize: 17 },
  { width: 375, height: 812, titleSize: 36, titleLine: 38.88, bodySize: 17 },
  { width: 320, height: 720, titleSize: 32, titleLine: 34.56, bodySize: 17 },
] as const;

function collectPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  return errors;
}

test.describe("Founder’s Note production evidence", () => {
  test.describe.configure({ mode: "serial", timeout: 90_000 });

  for (const viewport of VIEWPORTS) {
    test(`${viewport.width}px preserves the editorial contract`, async ({ page }) => {
      const errors = collectPageErrors(page);
      await page.setViewportSize(viewport);
      await page.goto(ABOUT_URL, { waitUntil: "networkidle" });

      const title = page.getByRole("heading", {
        level: 1,
        name: "Project management software was built by tech companies, for tech companies.",
      });
      await expect(title).toBeVisible();

      const geometry = await page.evaluate(() => {
        const root = document.documentElement;
        const titleElement = document.querySelector<HTMLElement>("h1")!;
        const prose = document.querySelector<HTMLElement>("[data-founders-note-prose]")!;
        const thread = document.querySelector<HTMLElement>("[data-founder-thread]")!;
        const titleStyle = getComputedStyle(titleElement);
        const proseStyle = getComputedStyle(prose);
        return {
          overflow: root.scrollWidth - window.innerWidth,
          titleSize: Number.parseFloat(titleStyle.fontSize),
          titleLine: Number.parseFloat(titleStyle.lineHeight),
          bodySize: Number.parseFloat(proseStyle.fontSize),
          proseWidth: prose.getBoundingClientRect().width,
          proseLeft: prose.getBoundingClientRect().left,
          proseRight: prose.getBoundingClientRect().right,
          threadDisplay: getComputedStyle(thread).display,
        };
      });

      expect(geometry.overflow).toBeLessThanOrEqual(1);
      expect(geometry.titleSize).toBeCloseTo(viewport.titleSize, 1);
      expect(geometry.titleLine).toBeCloseTo(viewport.titleLine, 0);
      expect(geometry.bodySize).toBe(viewport.bodySize);
      expect(geometry.proseWidth).toBeLessThanOrEqual(681);
      expect(geometry.threadDisplay).not.toBe("none");

      if (viewport.width <= 430) {
        expect(geometry.proseLeft).toBeGreaterThanOrEqual(19.5);
        expect(geometry.proseRight).toBeLessThanOrEqual(viewport.width - 11.5);
      }

      const products = page.locator("[data-founders-note-product]");
      await expect(products).toHaveCount(3);
      await expect(products.locator("dt")).toHaveText(["Notes", "Tasks", "Timeline"]);
      await expect(page.locator("[class*='productMark']")).toHaveCount(3);
      await expect(page.getByRole("article")).not.toContainText("Daily briefing");
      await expect(page.locator("[role='group'][aria-label='Author']")).toContainText(
        "Ethan McNamara",
      );
      const articleWords = await page.getByRole("article").evaluate((article) =>
        ((article.textContent ?? "").match(/[\p{L}\p{N}]+(?:['\u2019][\p{L}\p{N}]+)*/gu) ?? [])
          .length,
      );
      expect(articleWords).toBe(907);
      expect(errors).toEqual([]);
    });
  }

  test("accessibility, reduced motion, keyboard state, and reflow hold", async ({
    page,
  }) => {
    const errors = collectPageErrors(page);
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(ABOUT_URL, { waitUntil: "networkidle" });

    await expect(
      page
        .getByRole("navigation", { name: "Site navigation" })
        .getByRole("link", { name: "About", exact: true }),
    ).toHaveAttribute("aria-current", "page");
    const desktopAudit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      desktopAudit.violations.filter(
        (violation) => violation.impact === "serious" || violation.impact === "critical",
      ),
    ).toEqual([]);

    const motion = await page.evaluate(() =>
      [
        "[class*='productMark']",
        "[data-founder-rule]",
        "[data-founder-dot]",
      ].map((selector) => {
        const style = getComputedStyle(document.querySelector<HTMLElement>(selector)!);
        return { animation: style.animationName, transform: style.transform };
      }),
    );
    expect(motion.every((item) => item.animation === "none" && item.transform === "none")).toBe(
      true,
    );

    for (const width of [640, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.reload({ waitUntil: "networkidle" });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
        `${width}px reflow equivalent introduced overflow`,
      ).toBeLessThanOrEqual(1);
    }

    await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "That became three products." }),
    ).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });

  test("navigation controls keep valid relationships in closed and open states", async ({
    page,
  }) => {
    const errors = collectPageErrors(page);

    await page.setViewportSize({ width: 1440, height: 667 });
    await page.goto(ABOUT_URL, { waitUntil: "networkidle" });
    const productsButton = page.getByRole("button", { name: "Products" });
    await expect(productsButton).not.toHaveAttribute("aria-controls");
    await productsButton.click();
    await expect(productsButton).toHaveAttribute("aria-controls", "products-mega-panel");
    await expect(page.locator("#products-mega-panel")).toBeVisible();
    const keyboardMotion = await page.evaluate(() =>
      [".mnotes-cursor", ".mtasks-dot", ".mroadmap-dot"].map(
        (selector) => getComputedStyle(document.querySelector<SVGElement>(selector)!).animationName,
      ),
    );
    expect(keyboardMotion).toEqual(["none", "none", "none"]);
    await page.keyboard.press("Escape");
    await expect(productsButton).toBeFocused();
    await expect(productsButton).not.toHaveAttribute("aria-controls");

    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload({ waitUntil: "networkidle" });
    const mobileButton = page.getByRole("button", { name: "Open navigation" });
    await expect(mobileButton).not.toHaveAttribute("aria-controls");
    await mobileButton.click();
    const mobileCloseButton = page.getByRole("button", { name: "Close navigation" });
    await expect(mobileCloseButton).toHaveAttribute("aria-controls", "mobile-nav-panel");
    await expect(page.locator("#mobile-nav-panel")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open navigation" })).toBeFocused();

    await productsButton.click();
    const productsPanel = page.locator("#products-mega-panel");
    const panelGeometry = await productsPanel.evaluate((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
        overflowY: style.overflowY,
      };
    });
    expect(panelGeometry.bottom).toBeLessThanOrEqual(667.5);
    expect(panelGeometry.clientHeight).toBeLessThanOrEqual(611);
    expect(panelGeometry.scrollHeight).toBeGreaterThan(panelGeometry.clientHeight);
    expect(panelGeometry.overflowY).toBe("auto");
    expect(errors).toEqual([]);
  });

  test("the article and primary routes remain available without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 375, height: 812 },
    });
    const page = await context.newPage();
    await page.goto(ABOUT_URL, { waitUntil: "load" });

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const fallback = page.getByRole("navigation", {
      name: "Site navigation without JavaScript",
    });
    await expect(fallback).toBeVisible();
    await expect(fallback.getByRole("link", { name: "Notes" })).toBeVisible();
    await expect(fallback.getByRole("link", { name: "Timeline" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);

    await context.close();
  });

  test("the consolidated contact fold preserves enterprise attribution", async ({ page }) => {
    const errors = collectPageErrors(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(
      "/contact?subject=founding-venue&source=founder_email&campaign=founding_venue_2026_q2&artifact=contact&touch=email_1&venue=tankardstown",
      { waitUntil: "networkidle" },
    );
    await expect(page).toHaveURL(/\/about\?.*#contact$/);
    await expect(page.locator("#contact")).toContainText("Founding Venue Programme");

    await page.goto(
      `${ABOUT_URL}?subject=enterprise&source=pricing&campaign=enterprise&artifact=pricing_enterprise&touch=site#contact`,
      { waitUntil: "networkidle" },
    );

    const contact = page.locator("#contact");
    await expect(contact).toBeVisible();
    await expect(contact).toContainText("Enterprise enquiry");
    const href = await contact.getByRole("link", { name: "hello@signalstudio.ie" }).getAttribute("href");
    expect(href).not.toBeNull();
    const mailto = new URL(href!);
    expect(mailto.protocol).toBe("mailto:");
    expect(mailto.pathname).toBe("hello@signalstudio.ie");
    expect(mailto.searchParams.get("subject")).toBe("Enterprise enquiry");
    const body = mailto.searchParams.get("body") ?? "";
    expect(body).toContain("Pricing enquiry");
    expect(body).not.toMatch(/source=|campaign=|artifact=|touch=|pricing_enterprise/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });

  test("local production navigation remains lightweight", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(ABOUT_URL, { waitUntil: "networkidle" });
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      return {
        domContentLoadedMs: Math.round(navigation.domContentLoadedEventEnd),
        loadMs: Math.round(navigation.loadEventEnd),
        resourceCount: resources.length,
        transferredKb: Math.round(
          resources.reduce((sum, resource) => sum + resource.transferSize, 0) / 1024,
        ),
      };
    });
    console.log(`founders-note-performance=${JSON.stringify(metrics)}`);
    expect(metrics.domContentLoadedMs).toBeLessThan(2_000);
    expect(metrics.loadMs).toBeLessThan(2_000);
  });
});
