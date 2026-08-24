import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const ABOUT_URL = "/about";
const TITLE = "Most productivity tools were built for the people who build them.";

const MOVEMENT_SECTIONS = [
  { id: "translation", heading: "The industry has a dialect." },
  { id: "system", heading: "Three products. Each owns one kind of clarity." },
  { id: "founder", heading: "Built by one person." },
  { id: "refusals", heading: "You can measure a company by what it refuses." },
  { id: "record", heading: "Small, on purpose." },
] as const;

const VIEWPORTS = [
  { width: 1600, height: 1000 },
  { width: 1440, height: 900 },
  { width: 1280, height: 800 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 430, height: 932 },
  { width: 390, height: 844 },
  { width: 375, height: 812 },
  { width: 320, height: 720 },
] as const;

function collectPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  return errors;
}

test.describe("About six-movement production evidence", () => {
  test.describe.configure({ mode: "serial", timeout: 90_000 });

  for (const viewport of VIEWPORTS) {
    test(`${viewport.width}px preserves the editorial contract`, async ({ page }) => {
      const errors = collectPageErrors(page);
      await page.setViewportSize(viewport);
      await page.goto(ABOUT_URL, { waitUntil: "networkidle" });

      await expect(page.getByRole("heading", { level: 1, name: TITLE })).toBeVisible();

      const geometry = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        missingSections: MOVEMENT_SECTIONS.map((section) => section.id).filter(
          (id) => !document.getElementById(id),
        ),
      }));
      expect(geometry.overflow).toBeLessThanOrEqual(1);
      expect(geometry.missingSections).toEqual([]);

      for (const section of MOVEMENT_SECTIONS) {
        await expect(
          page
            .locator(`#${section.id}`)
            .getByRole("heading", { level: 2, name: section.heading }),
        ).toBeVisible();
      }

      const products = page.locator("#system li");
      await expect(products).toHaveCount(3);
      const productLinks = products.locator("a");
      await expect(productLinks).toHaveCount(3);
      expect(
        await productLinks.evaluateAll((anchors) =>
          anchors.every((anchor) => Boolean(anchor.getAttribute("href"))),
        ),
      ).toBe(true);

      const refusals = page.locator("#refusals li");
      expect(await refusals.count()).toBeGreaterThanOrEqual(5);

      const author = page.locator("[role='group'][aria-label='Author']");
      await expect(author).toContainText("Ethan McNamara");

      await expect(page.getByRole("article")).not.toContainText("Daily briefing");
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
      Array.from(
        document.querySelectorAll<HTMLElement>("#system .about-r, #founder .about-r"),
      )
        .slice(0, 6)
        .map((element) => {
          const style = getComputedStyle(element);
          return { animation: style.animationName, transform: style.transform };
        }),
    );
    expect(motion.length).toBeGreaterThan(0);
    expect(motion.every((item) => item.animation === "none")).toBe(true);

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
      page.getByRole("heading", { level: 2, name: "Built by one person." }),
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
    await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).overflow)).toBe("hidden");
    await page.keyboard.press("Escape");
    await expect(productsButton).toBeFocused();
    await expect(productsButton).not.toHaveAttribute("aria-controls");
    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.body).overflow))
      .not.toBe("hidden");

    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload({ waitUntil: "networkidle" });
    const mobileButton = page.getByRole("button", { name: "Open navigation" });
    await expect(mobileButton).not.toHaveAttribute("aria-controls");
    await mobileButton.click();
    const mobileCloseButton = page.getByRole("button", { name: "Close navigation" });
    await expect(mobileCloseButton).toHaveAttribute("aria-controls", "mobile-nav-panel");
    await expect(page.locator("#mobile-nav-panel")).toBeVisible();
    await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).overflow)).toBe("hidden");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open navigation" })).toBeFocused();
    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.body).overflow))
      .not.toBe("hidden");

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

  test("the page and primary routes remain available without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 375, height: 812 },
    });
    const page = await context.newPage();
    await page.goto(ABOUT_URL, { waitUntil: "load" });

    await expect(page.getByRole("heading", { level: 1, name: TITLE })).toBeVisible();
    for (const section of MOVEMENT_SECTIONS) {
      await expect(page.locator(`#${section.id}`)).toBeVisible();
    }
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
    console.log(`about-page-performance=${JSON.stringify(metrics)}`);
    expect(metrics.domContentLoadedMs).toBeLessThan(2_000);
    expect(metrics.loadMs).toBeLessThan(2_000);
  });
});
