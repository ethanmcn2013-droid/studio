import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// The public home page, "One Friday" (content/hq/decisions/home-page-v3-2026-10-02.md).
// `?theme=` settles the theme the same way the device setting does, so each
// test says which surface it is looking at instead of inheriting the runner's.
const DARK = "/?theme=dark";
const LIGHT = "/?theme=light";

const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 320, height: 720 },
] as const;

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

async function counts(page: Page) {
  return page.evaluate(() =>
    ["need", "late", "week"]
      .map((key) => document.querySelector(`#home [data-n="${key}"]`)?.textContent)
      .join("/"),
  );
}

test.describe("the home page, One Friday", () => {
  test.describe.configure({ timeout: 60_000 });

  test("opens dark on its own root and leaves the rest of the site light", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    const root = page.locator(".lp");
    await expect(root).toHaveAttribute("data-theme", "dark");
    await expect(page.locator("html")).not.toHaveAttribute("data-theme");
    // The floor reaches the edges of the document, so overscroll is never white.
    expect(
      await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor),
    ).toBe("rgb(12, 12, 13)");

    await page.locator("#theme").click();
    await expect(root).toHaveAttribute("data-theme", "light");
    await expect(page.locator("#theme")).toHaveAccessibleName("Switch to dark theme");
    expect(
      await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor),
    ).toBe("rgb(244, 243, 241)");

    await page.goto("/pricing");
    await expect(page.locator(".lp")).toHaveCount(0);
    await expect(page.locator("header.site-nav")).toBeVisible();
    expect(
      await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor),
    ).toBe("rgb(255, 255, 255)");
  });

  test("follows a light device without being asked", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expect(page.locator(".lp")).toHaveAttribute("data-theme", "light");
    await page.locator("#projects").scrollIntoViewIfNeeded();
    await expect
      .poll(() => page.locator("#pl-projects .shot.on img").evaluate((img: HTMLImageElement) => img.currentSrc))
      .toMatch(/projects-desk-light-\dx\.webp$/);
  });

  test("carries its own header, one main and the locked footer", async ({ page }) => {
    await page.goto(DARK);
    await expect(page.locator("header.site-nav")).toHaveCount(0);
    await expect(page.locator("header")).toHaveCount(1);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Project management for people not in tech.");
    await expect(page.locator("#navlinks > a")).toHaveText([
      "Projects",
      "Tasks",
      "Timeline",
      "Files",
      "Analytics",
      "Whiteboard",
    ]);
    await expect(page.locator('#navlinks a[href="/pricing"]')).toBeVisible();
    await expect(page.locator('#navlinks a[href="/about"]')).toBeVisible();
    await expect(page.locator(".lp-footer .site-footer")).toContainText(
      /Registered in Ireland\. CRO number: \d+\./,
    );
  });

  test("the working Home counts with the visitor and gives it back on Undo", async ({ page }) => {
    await page.goto(DARK);
    expect(await counts(page)).toBe("5/11/35");
    await page.getByRole("button", { name: "Mark done: Agree the winter price list" }).click();
    expect(await counts(page)).toBe("4/10/36");
    await expect(page.locator("#toast")).toContainText("Marked done.");
    await page.getByRole("button", { name: "Undo" }).click();
    expect(await counts(page)).toBe("5/11/35");
    await page.getByRole("button", { name: "Nudge Fern and Furrow" }).click();
    await expect(page.locator("#nudge")).toHaveText("Nudged today");
  });

  test("the waitlist form checks the address before it sends anything", async ({ page }) => {
    await page.goto(DARK);
    const requests: string[] = [];
    page.on("request", (request) => {
      if (request.method() === "POST") requests.push(request.url());
    });
    await page.locator(".hero .cta-row .btn-primary").click();
    await expect(page.locator("#wl-email")).toBeFocused();
    await page.locator("#wl-submit").click();
    await expect(page.locator("#wl-err")).toHaveText("Enter your email address.");
    await page.locator("#wl-email").fill("not-an-address");
    await expect(page.locator("#wl-err")).toHaveText("");
    await page.locator("#wl-submit").click();
    await expect(page.locator("#wl-err")).toContainText("That does not look like an email address.");
    await expect(page.locator("#join .sub")).toHaveText(
      "Access opens in stages. We will write to you when your turn comes.",
    );
    expect(requests).toEqual([]);
    for (const [name, value] of [
      ["source", "home_close"],
      ["campaign", "pre_access_waitlist"],
      ["artifact", "close_form"],
      ["touch", "site"],
      ["path", "/"],
    ] as const) {
      await expect(page.locator(`#waitlist-form input[name="${name}"]`)).toHaveValue(value);
    }
  });

  test("never scrolls sideways, at any width, in either theme", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of [DARK, LIGHT]) {
      for (const viewport of VIEWPORTS) {
        await page.setViewportSize(viewport);
        await page.goto(route);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, `${route} at ${viewport.width}`).toBe(0);
      }
    }
  });

  test("has no serious accessibility violation, dark or light, desktop or phone", async ({ page }) => {
    // Reduced motion is the settled page: every section revealed, nothing mid-scene.
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of [DARK, LIGHT]) {
      for (const viewport of [VIEWPORTS[0], VIEWPORTS[3]]) {
        await page.setViewportSize(viewport);
        await page.goto(route);
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        expect(
          result.violations
            .filter((violation) => violation.impact === "serious" || violation.impact === "critical")
            .map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`),
          `${route} at ${viewport.width}`,
        ).toEqual([]);
      }
    }
  });

  test("stays free of console, page and request errors from top to bottom", async ({ page }) => {
    const errors = collectPageErrors(page);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(DARK);
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 700) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
      await page.waitForTimeout(120);
    }
    await page.locator("#theme").click();
    await page.waitForTimeout(500);
    const broken = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLImageElement>("img[data-shot]"))
        .filter((img) => img.complete && img.currentSrc && img.naturalWidth === 0)
        .map((img) => img.currentSrc),
    );
    expect(broken).toEqual([]);
    expect(errors).toEqual([]);
  });
});
