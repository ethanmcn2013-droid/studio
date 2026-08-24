import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const VIEWPORTS = [
  { width: 1440, height: 1000 },
  { width: 1280, height: 900 },
  { width: 1024, height: 900 },
  { width: 768, height: 1024 },
  { width: 430, height: 932 },
  { width: 390, height: 844 },
  { width: 375, height: 812 },
  { width: 320, height: 720 },
] as const;

test.describe("Signal Ledger pricing page", () => {
  test.describe.configure({ mode: "serial", timeout: 60_000 });

  test("opens with a concise two-line decision and the four public plans", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/pricing");

    await expect(page).toHaveTitle("Pricing · Signal Studio");
    await expect(page.locator("h1")).toHaveText(
      "One clear system.Four ways in.",
    );
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(
      page.getByRole("link", { name: "Pricing", exact: true }).first(),
    ).toHaveAttribute("aria-current", "page");
    await expect(page.getByText("No charge", { exact: true })).toBeVisible();
    await expect(page.getByText("VAT included", { exact: true })).toBeVisible();
    await expect(page.getByText("Terms repeated", { exact: true })).toBeVisible();

    for (const plan of ["free", "student", "pro", "enterprise"]) {
      await expect(page.locator(`#pricing-plan-${plan}`)).toBeVisible();
    }
    await expect(page.locator("#pricing-plan-pro")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await expect(page.locator("[data-pricing-panel]")).toContainText(
      "Unlimited workspaces",
    );

    const hero = await page.locator("h1").evaluate((heading) => {
      const style = getComputedStyle(heading);
      const lines = Math.round(
        heading.getBoundingClientRect().height / Number.parseFloat(style.lineHeight),
      );
      const lede = heading.nextElementSibling?.textContent?.trim() ?? "";
      return { lines, ledeWords: lede.split(/\s+/).length };
    });
    expect(hero.lines).toBe(2);
    expect(hero.ledeWords).toBeLessThanOrEqual(20);
  });

  test("moves through the ledger with the keyboard and keeps one plan expanded", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pricing#plans");

    const pro = page.locator("#pricing-plan-pro");
    await pro.focus();
    await pro.press("ArrowUp");
    await expect(page.locator("#pricing-plan-student")).toBeFocused();
    await expect(page.locator("#pricing-plan-student")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await expect(page.locator("[data-pricing-panel]")).toContainText(
      "student status reviewed each year",
    );

    await page.locator("#pricing-plan-student").press("Home");
    await expect(page.locator("#pricing-plan-free")).toBeFocused();
    await expect(page.locator("[data-pricing-panel]")).toContainText(
      "One workspace",
    );

    await page.locator("#pricing-plan-free").press("End");
    await expect(page.locator("#pricing-plan-enterprise")).toBeFocused();
    await expect(page.locator("[data-pricing-panel]")).toContainText(
      "Conversation with Ethan",
    );

    const closing = page.locator("section").filter({
      has: page.getByRole("heading", {
        name: "A clear agreement is part of the product.",
      }),
    });
    await expect(closing).toContainText("Enterprise selected");
    await expect(closing).toContainText(
      "There is no charge to begin the conversation.",
    );
    await expect(
      closing.getByRole("link", { name: "Discuss Enterprise" }),
    ).toBeAttached();

    await expect(
      page.locator('[aria-expanded="true"][id^="pricing-plan-"]'),
    ).toHaveCount(1);
  });

  test("keeps pointer selection stable after the ledger reflows", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pricing#plans");

    for (const plan of ["free", "student", "pro", "enterprise"] as const) {
      const button = page.locator(`#pricing-plan-${plan}`);
      await button.click({ position: { x: 24, y: 24 } });
      await page.mouse.move(24, 24);
      await page.waitForTimeout(500);
      await expect(button).toHaveAttribute("aria-expanded", "true");
      await expect(
        page.locator('[aria-expanded="true"][id^="pricing-plan-"]'),
      ).toHaveCount(1);
    }
  });

  test("keeps the activated row under the pointer while details reflow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto("/pricing#plans");
    const enterprise = page.locator("#pricing-plan-enterprise");
    await enterprise.scrollIntoViewIfNeeded();
    const before = await enterprise.evaluate(
      (element) => element.getBoundingClientRect().top,
    );
    await enterprise.click({ position: { x: 32, y: 32 } });
    await page.waitForTimeout(100);
    const after = await enterprise.evaluate(
      (element) => element.getBoundingClientRect().top,
    );
    expect(Math.abs(after - before)).toBeLessThanOrEqual(1);
  });

  test("preserves the selected plan into the waitlist and Enterprise into contact", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pricing#plans");

    await page.locator("#pricing-plan-free").click();
    const freeLink = page
      .getByRole("link", { name: "Join the Free waitlist" })
      .first();
    await expect(freeLink).toHaveAttribute("href", /artifact=pricing_free/);
    await expect(freeLink).toHaveAttribute("href", /plan=free/);
    await freeLink.click();
    await expect(page).toHaveURL(/\/waitlist\?.*plan=free/);
    await expect(page.getByText(/You came from Free/)).toBeVisible();
    await expect(page.getByText(/You can change plans before access/)).toBeVisible();
    await expect(page.getByText(/No card\. No charge\./)).toBeVisible();
    await expect(page.getByRole("textbox")).toHaveCount(1);
    await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();

    await page.goto("/pricing#plans");
    await page.locator("#pricing-plan-enterprise").click();
    const enterpriseLink = page
      .getByRole("link", { name: "Discuss Enterprise" })
      .first();
    await expect(enterpriseLink).toHaveAttribute("href", /subject=enterprise/);
    await enterpriseLink.click();
    await expect(page).toHaveURL(/\/about\?.*subject=enterprise.*#contact/);
    await expect(
      page.getByRole("heading", { name: "Write to a person, not a form." }),
    ).toBeVisible();
    const enterpriseEmail = page.getByRole("link", {
      name: "Email Ethan about Enterprise",
    });
    await expect(enterpriseEmail).toBeVisible();
    await expect(enterpriseEmail).toHaveAttribute(
      "href",
      /subject=Enterprise\+enquiry/,
    );
    await expect(enterpriseEmail).not.toHaveAttribute(
      "href",
      /campaign%3Denterprise|artifact%3Dpricing_enterprise/,
    );
    await expect(page.getByText(/Ref preserved:/)).toHaveCount(0);
    const contactTop = await page.locator("#contact").evaluate((element) =>
      Math.round(element.getBoundingClientRect().top),
    );
    expect(contactTop).toBeLessThanOrEqual(24);
  });

  test("uses first-party proof and a semantic comparison without public Event", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/pricing");

    await expect(
      page.getByRole("heading", { name: "The same work, without starting again." }),
    ).toBeVisible();
    await expect(
      page.getByRole("list", {
        name: /first-party product handoff from Notes to Tasks to Timeline/,
      }),
    ).toBeVisible();
    await expect(page.locator("figcaption")).toContainText("Mara & Finn");
    await expect(
      page.locator("figure").filter({ hasText: "Mara & Finn" }).getByRole("button"),
    ).toHaveCount(0);
    await expect(
      page.locator("figure").filter({ hasText: "Mara & Finn" }).getByRole("link"),
    ).toHaveCount(0);

    const table = page.getByRole("table", {
      name: "Signal Studio plan comparison",
    });
    await expect(table).toBeVisible();
    await expect(table.getByRole("columnheader", { name: /Free/ })).toBeVisible();
    await expect(table.getByRole("columnheader", { name: /Enterprise/ })).toBeVisible();
    await expect(page.getByText("Event", { exact: true })).toHaveCount(0);
  });

  for (const viewport of VIEWPORTS) {
    test(`reflows without clipping at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/pricing");

      const geometry = await page.evaluate(() => {
        const heading = document.querySelector("h1");
        const style = heading ? getComputedStyle(heading) : null;
        return {
          overflow:
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
          titleLines:
            heading && style
              ? Math.round(
                  heading.getBoundingClientRect().height /
                    Number.parseFloat(style.lineHeight),
                )
              : 0,
          bodySize: Number.parseFloat(getComputedStyle(document.body).fontSize),
        };
      });

      expect(geometry.overflow).toBe(0);
      expect(geometry.titleLines).toBe(2);
      expect(geometry.bodySize).toBeGreaterThanOrEqual(15);
      await expect(page.locator("#pricing-plan-pro")).toBeVisible();
      await expect(page.getByText("A clear price is part of the product.")).toBeVisible();

      if (viewport.width === 320) {
        const hierarchy = await page.evaluate(() => ({
          h1: Number.parseFloat(
            getComputedStyle(document.querySelector("h1") as HTMLElement)
              .fontSize,
          ),
          h2: Number.parseFloat(
            getComputedStyle(document.querySelector("h2") as HTMLElement)
              .fontSize,
          ),
        }));
        expect(hierarchy.h1).toBeGreaterThan(hierarchy.h2);
      }
    });
  }

  test("keeps every price and action intact at 200% text size", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 1440, height: 1000 },
      { width: 1280, height: 900 },
      { width: 1024, height: 900 },
      { width: 320, height: 800 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto("/pricing#plans");
      await page.addStyleTag({ content: "html{font-size:200%!important}" });

      const geometry = await page.evaluate(() => {
        const cta = [...document.querySelectorAll<HTMLAnchorElement>("a")].find(
          (link) => link.textContent?.includes("Join the Pro waitlist"),
        );
        const publishedLabel = [...document.querySelectorAll<HTMLElement>("span")].find(
          (element) => element.textContent === "Published after review",
        );
        const enterpriseSummary = [...document.querySelectorAll<HTMLElement>("details > summary")].find(
          (element) => element.textContent?.includes("Enterprise"),
        );
        const summaryTracks = enterpriseSummary
          ? [...enterpriseSummary.children].map(
              (element) => element.getBoundingClientRect().width,
            )
          : [];
        const mobileMenu = document.querySelector<HTMLElement>(
          '[aria-label="Open navigation"]',
        );
        const labelBounds = publishedLabel?.getBoundingClientRect();
        const menuBounds = mobileMenu?.getBoundingClientRect();
        const planCollisions = [
          ...document.querySelectorAll<HTMLElement>('[id^="pricing-plan-"]'),
        ]
          .filter((element) => element.tagName === "BUTTON")
          .map((button) => {
            const price = button.children[3]?.getBoundingClientRect();
            const action = button.children[4]?.getBoundingClientRect();
            if (!price || !action) return 0;
            const overlapX = Math.min(price.right, action.right) - Math.max(price.left, action.left);
            const overlapY = Math.min(price.bottom, action.bottom) - Math.max(price.top, action.top);
            return overlapX > 0 && overlapY > 0 ? overlapX * overlapY : 0;
          });
        return {
          overflow:
            Math.max(
              document.documentElement.scrollWidth,
              document.body.scrollWidth,
            ) - window.innerWidth,
          ctaOverflow: cta ? cta.scrollWidth - cta.clientWidth : 1,
          labelLeft: labelBounds?.left ?? -1,
          labelRight: labelBounds?.right ?? window.innerWidth + 1,
          summaryTracks,
          menuLeft: menuBounds?.left ?? 0,
          menuRight: menuBounds?.right ?? window.innerWidth,
          planCollisions,
        };
      });

      expect(geometry.overflow).toBeLessThanOrEqual(1);
      expect(geometry.ctaOverflow).toBe(0);
      expect(geometry.labelLeft).toBeGreaterThanOrEqual(0);
      expect(geometry.labelRight).toBeLessThanOrEqual(viewport.width + 1);
      expect(geometry.menuLeft).toBeGreaterThanOrEqual(0);
      expect(geometry.menuRight).toBeLessThanOrEqual(viewport.width + 1);
      expect(Math.max(...geometry.planCollisions)).toBe(0);
      if (viewport.width === 320) {
        expect(geometry.summaryTracks).toHaveLength(2);
        expect(Math.min(...geometry.summaryTracks)).toBeGreaterThanOrEqual(200);
      }
      await expect(
        page.getByRole("link", { name: "Join the Pro waitlist" }).first(),
      ).toBeVisible();
    }
  });

  test("keeps the page accessible on desktop and mobile", async ({ page }) => {
    for (const viewport of [
      { width: 1440, height: 1000 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto("/pricing");
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(results.violations).toEqual([]);
    }
  });

  test("keeps selected-plan supporting copy at AA contrast", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/pricing#plans");

    const ratios = await page.evaluate(() => {
      const parse = (value: string) =>
        value.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [0, 0, 0];
      const luminance = ([r, g, b]: number[]) => {
        const channels = [r, g, b].map((channel) => {
          const value = channel / 255;
          return value <= 0.03928
            ? value / 12.92
            : Math.pow((value + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
      };
      const ratio = (foreground: string, background: string) => {
        const a = luminance(parse(foreground));
        const b = luminance(parse(background));
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      };
      const selected = document.querySelector(
        '[data-selected="true"]',
      ) as HTMLElement;
      const background = getComputedStyle(selected.querySelector("button")!).backgroundColor;
      const button = selected.querySelector("button")!;
      return [button.children[0], button.children[3].lastElementChild!].map((element) =>
        ratio(getComputedStyle(element).color, background),
      );
    });

    for (const ratio of ratios) expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test("keeps pricing open to a signed-in reader", async ({ page }, testInfo) => {
    const baseURL = testInfo.project.use.baseURL;
    expect(typeof baseURL).toBe("string");
    await page.context().addCookies([
      {
        name: "__session",
        value: "pricing-contract-test",
        url: baseURL as string,
      },
    ]);

    await page.goto("/pricing");
    await expect(page).toHaveURL(/\/pricing$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "One clear system.Four ways in.",
    );
  });

  test("removes authored travel under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/pricing#plans");
    await page.locator("#pricing-plan-free").click();

    const state = await page.locator("[data-pricing-panel]").evaluate((panel) => {
      const style = getComputedStyle(panel);
      return {
        animation: style.animationName,
        opacity: style.opacity,
        transform: style.transform,
      };
    });
    expect(state).toEqual({ animation: "none", opacity: "1", transform: "none" });
  });

  test("keeps focus visible in forced colours", async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/pricing#plans");
    const free = page.locator("#pricing-plan-free");
    await free.focus();
    await expect(free).toBeFocused();
    expect(
      await free.evaluate((element) => getComputedStyle(element).outlineStyle),
    ).not.toBe("none");
  });

  test("keeps mobile comparison memory-light and every footer target at least 44px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto("/pricing");

    const comparison = page.locator("details").filter({
      has: page.getByText("1 workspace · 3 editing guests", { exact: true }),
    });
    const student = page.locator("details").filter({
      has: page.getByText("3 workspaces · 3 editing guests", { exact: true }),
    });
    await comparison.locator("summary").click();
    await expect(comparison).toHaveAttribute("open", "");
    await student.locator("summary").click();
    await expect(comparison).not.toHaveAttribute("open", "");
    await expect(student).toHaveAttribute("open", "");
    await expect(
      page.getByText("Unlimited workspaces · Editing limit unpublished", {
        exact: true,
      }),
    ).toBeVisible();

    const undersizedTargets = await page
      .locator("footer a")
      .evaluateAll((links) =>
        links
          .map((link) => {
            const box = link.getBoundingClientRect();
            return { label: link.textContent?.trim(), width: box.width, height: box.height };
          })
          .filter((box) => box.width < 44 || box.height < 44),
      );
    expect(undersizedTargets).toEqual([]);
  });

  test("keeps site navigation operable from pricing", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/pricing");
    const products = page.getByRole("button", { name: "Products" });
    await products.focus();
    await products.press("ArrowDown");
    await expect(products).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#products-mega-panel")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(products).toHaveAttribute("aria-expanded", "false");

    await page.setViewportSize({ width: 390, height: 844 });
    const mobile = page.getByRole("button", { name: "Open navigation" });
    await mobile.click();
    await expect(page.getByRole("region", { name: "Mobile navigation" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(mobile).toBeFocused();
  });

  test("holds visual stability after load and plan selection", async ({ page }) => {
    await page.addInitScript(() => {
      (window as typeof window & { __pricingCls?: number }).__pricingCls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & {
            value: number;
            hadRecentInput: boolean;
          };
          if (!shift.hadRecentInput) {
            (window as typeof window & { __pricingCls?: number }).__pricingCls =
              ((window as typeof window & { __pricingCls?: number })
                .__pricingCls ?? 0) + shift.value;
          }
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/pricing");
    await page.waitForTimeout(500);
    await page.locator("#pricing-plan-student").click();
    await page.waitForTimeout(500);
    const cls = await page.evaluate(
      () =>
        (window as typeof window & { __pricingCls?: number }).__pricingCls ?? 0,
    );
    expect(cls).toBeLessThanOrEqual(0.01);
  });

  test("keeps all four next steps available without JavaScript", async ({
    browser,
  }, testInfo) => {
    const context = await browser.newContext({
      baseURL: testInfo.project.use.baseURL as string,
      javaScriptEnabled: false,
    });
    const page = await context.newPage();
    await page.goto("/pricing");

    for (const name of [
      "Join the Free waitlist",
      "Join the Student waitlist",
      "Join the Pro waitlist",
      "Discuss Enterprise",
    ]) {
      await expect(
        page.getByRole("link", { name, exact: true }).first(),
      ).toBeVisible();
    }

    await context.close();
  });

  test("stays free of console, page and same-origin request errors", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const failedRequests: string[] = [];

    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("requestfailed", (request) => {
      if (new URL(request.url()).origin === new URL(page.url()).origin) {
        failedRequests.push(
          `${request.method()} ${request.url()} ${request.failure()?.errorText ?? "failed"}`,
        );
      }
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/pricing");
    await page.locator("#pricing-plan-student").click();
    await page.getByRole("heading", { name: "Straight answers." }).scrollIntoViewIfNeeded();
    await page
      .getByText("Does joining the waitlist cost anything?", { exact: true })
      .click();
    await page.waitForTimeout(400);

    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
  });
});
