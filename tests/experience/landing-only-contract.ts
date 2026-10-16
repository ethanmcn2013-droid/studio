import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/** The retained page contracts resume when the temporary public boundary is removed. */
export function landingOnlyPageContract(subject: string, paths: string[]) {
  test.describe(`${subject}, temporary landing-only boundary`, () => {
    test.describe.configure({ timeout: 90_000 });
    for (const path of paths) {
      for (const width of [390, 1440]) {
        test(`${path} returns 302 and receives the usable landing page at ${width}px`, async ({ page, request }) => {
          const redirect = await request.get(path, { maxRedirects: 0 });
          expect(redirect.status()).toBe(302);
          expect(redirect.headers().location).toBe("/");
          await page.setViewportSize({ width, height: 900 });
          await page.goto(path);
          expect(new URL(page.url()).pathname).toBe("/");
          await expect(page.locator(".lp")).toHaveClass(/smooth/);
          await expect(page.locator("#nav")).toBeVisible();
          await expect(page.locator("h1")).toHaveText("Project management for people not in tech.");
          await expect(page.locator("#wl-hero-form")).toBeVisible();
          await expect(page.locator("#wl-hero-email")).toBeInViewport();
          await expect(page.locator("#wl-hero-submit")).toHaveText("Join the waitlist");
          expect(await page.locator('a[href^="/"]').evaluateAll(links => links.map(link => link.getAttribute("href")).filter(href => href !== "/" && !href?.startsWith("/#")))).toEqual([]);
          for (const asset of ["/icon", "/icon1", "/icon2", "/icon3", "/icon4", "/apple-icon"]) {
            const response = await request.get(asset, { maxRedirects: 0 });
            expect(response.status(), asset).toBe(200);
            expect(response.headers()["content-type"], asset).toContain("image/png");
            expect((await response.body()).subarray(0, 8), asset).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
          }
          const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
          expect(audit.violations).toEqual([]);
        });
      }
    }
  });
}
