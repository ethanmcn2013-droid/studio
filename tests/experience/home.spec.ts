import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// The public home page, landing v3 (Design canvas, October 2026).
// `?theme=` settles the theme the same way the device setting does, so each
// test says which surface it is looking at instead of inheriting the runner's.
const DARK = "/?theme=dark";
const LIGHT = "/?theme=light";

const DESK = { width: 1440, height: 900 } as const;
const PHONE = { width: 390, height: 844 } as const;

// The width sweep the page is held to, with a landscape phone.
const SWEEP = [
  { width: 320, height: 720 },
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 641, height: 960 },
  { width: 768, height: 1024 },
  { width: 844, height: 390 },
  { width: 1024, height: 768 },
  { width: 1280, height: 720 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1440 },
] as const;

const SECTIONS = ["venues", "timeline", "analytics", "files", "chat", "waitlist", "pricing"] as const;

function collectPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  return errors;
}

/** The runtime marks the page root once it has hydrated. */
async function ready(page: Page) {
  await expect(page.locator(".ss[data-ready]")).toBeAttached({ timeout: 30_000 });
}

test.describe("the home page, landing v3", () => {
  test.describe.configure({ timeout: 90_000 });

  test("carries its own header, one main, every section and the footer", async ({ page }) => {
    await page.setViewportSize(DESK);
    await page.goto(LIGHT);
    await ready(page);
    await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Know what needs you today.");
    for (const id of SECTIONS) await expect(page.locator(`#${id}`), id).toBeAttached();
    await expect(page.locator("footer")).toContainText("Signal Studio Limited");
    // Every in-page link has somewhere to land.
    const orphans = await page.locator('a[href^="#"]').evaluateAll((links) =>
      links.map((link) => link.getAttribute("href")!).filter((href) => href !== "#" && !document.getElementById(href.slice(1))),
    );
    expect(orphans).toEqual([]);
    // Nothing opens a new tab or links into the app.
    await expect(page.locator('a[target="_blank"], a[href*="app.signalstudio.ie"]')).toHaveCount(0);
  });

  test("takes its theme from the address or the device, with no hydration mismatch", async ({ browser }) => {
    for (const [route, scheme, dark] of [
      [DARK, "light", true],
      [LIGHT, "dark", false],
      ["/", "dark", true],
      ["/", "light", false],
    ] as const) {
      const context = await browser.newContext({ viewport: DESK, colorScheme: scheme });
      const page = await context.newPage();
      const errors = collectPageErrors(page);
      await page.goto(route);
      await ready(page);
      await expect(page.locator(".ss"), `${route} on a ${scheme} device`).toHaveClass(dark ? /(^| )dark( |$)/ : /^(?!.*\bdark\b)/);
      expect(errors, `${route} on a ${scheme} device`).toEqual([]);
      await context.close();
    }
  });

  test("the sample board ticks, says so, and Undo puts the card back", async ({ page }) => {
    await page.setViewportSize(DESK);
    await page.goto(LIGHT);
    await ready(page);
    const tick = page.getByRole("button", { name: "Mark done: Agree the winter price list" });
    await tick.click();
    await expect(page.locator(".tdone")).toContainText("59 done");
    await expect(page.getByText("Agree the winter price list marked done.", { exact: false })).toBeAttached();
    await page.locator(".win-toast").getByRole("button", { name: /Undo/ }).click();
    await expect(page.locator(".tdone")).toContainText("58 done");
    await expect(page.getByRole("button", { name: "Mark done: Agree the winter price list" })).toBeFocused();
  });

  test("the waitlist checks the address before it sends anything", async ({ page }) => {
    await page.setViewportSize(DESK);
    await page.goto(LIGHT);
    await ready(page);
    const posts: string[] = [];
    page.on("request", (request) => {
      if (request.method() === "POST") posts.push(request.url());
    });
    await page.locator(".hero-form button[type=submit]").click();
    await expect(page.locator("#hero-email")).toBeFocused();
    await expect(page.locator("#hero-email")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#hero-msg")).toContainText("Enter your email address");
    await page.locator("#wl-email").fill("not-an-address");
    await page.locator(".wl-form button[type=submit]").click();
    await expect(page.locator("#wl-email")).toBeFocused();
    await expect(page.locator("#wl-msg")).toContainText("looks incomplete");
    expect(posts).toEqual([]);
  });

  test("the 'What do you run?' choice is one radio group with arrow keys", async ({ page }) => {
    await page.setViewportSize(DESK);
    await page.goto(LIGHT);
    await ready(page);
    const group = page.getByRole("radiogroup", { name: /What do you run\?/ });
    await expect(group.getByRole("radio")).toHaveCount(5);
    await group.getByRole("radio", { name: "Venue" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(group.getByRole("radio", { name: "Building crew" })).toBeFocused();
    await expect(group.getByRole("radio", { name: "Building crew" })).toHaveAttribute("aria-checked", "true");
    await expect(group.locator('[tabindex="0"]')).toHaveCount(1);
  });

  test("uses plain language without jargon", async ({ page }) => {
    await page.setViewportSize(DESK);
    await page.goto(LIGHT);
    const text = (await page.locator(".ss").innerText()).toLowerCase();
    for (const word of ["sprint", "stakeholder", "kanban", "synergy", "supercharge", "seamless", "milestone", "unlimited"]) {
      expect(text.includes(word), `"${word}" appears on the page`).toBe(false);
    }
    expect(text.includes("—"), "an em dash appears on the page").toBe(false);
    expect(text.includes("!"), "an exclamation mark appears on the page").toBe(false);
  });

  test("never scrolls sideways, at any width, in either theme", async ({ page }) => {
    test.setTimeout(300_000);
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of [DARK, LIGHT]) {
      for (const viewport of SWEEP) {
        await page.setViewportSize(viewport);
        await page.goto(route);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, `${route} at ${viewport.width}`).toBe(0);
      }
    }
  });

  test("has no accessibility violation, dark or light, desktop or phone", async ({ page }) => {
    test.setTimeout(180_000);
    // Reduced motion is the settled page: every section revealed, nothing mid-scene.
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of [DARK, LIGHT]) {
      for (const viewport of [DESK, PHONE]) {
        await page.setViewportSize(viewport);
        await page.goto(route);
        await ready(page);
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();
        expect(
          result.violations.map(
            (violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`,
          ),
          `${route} at ${viewport.width}`,
        ).toEqual([]);
      }
    }
  });

  test("reduced motion plays nothing by itself", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize(DESK);
    await page.goto(LIGHT);
    await ready(page);
    await page.locator("#chat").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    // The chat sample is shown finished, waiting on Apply, and nothing is typing.
    await expect(page.locator(".cp-apply")).toContainText("Apply 3 steps");
    await expect(page.locator(".cp-typing")).toHaveCount(0);
  });

  test("stays free of console, page and request errors from top to bottom", async ({ page }) => {
    const errors = collectPageErrors(page);
    await page.setViewportSize(DESK);
    for (const route of [DARK, LIGHT]) {
      await page.goto(route);
      await ready(page);
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < height; y += 700) {
        await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
        await page.waitForTimeout(120);
      }
    }
    expect(errors).toEqual([]);
  });
});
