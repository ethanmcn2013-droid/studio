import { expect, test } from "@playwright/test";
import { createClient } from "@libsql/client";
import { readFile, rm } from "node:fs/promises";
import { resolve } from "node:path";

test("landing-only routing, desktop/mobile navigation and real waitlist persistence", async ({ page, request }) => {
  test.setTimeout(120_000);
  await rm(resolve(".next/landing-waitlist-test.sqlite"), { force: true });
  const db = createClient({ url: `file:${resolve(".next/landing-waitlist-test.sqlite")}` });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  try {
    await db.executeMultiple(await readFile("drizzle/0000_init.sql", "utf8"));
    for (const path of ["/about", "/pricing", "/privacy", "/terms", "/waitlist", "/principles", "/press", "/notes", "/tasks", "/timeline", "/brand", "/launcher", "/venues/demo", "/brand/loader.html", "/brand/arbitrary.html", "/arbitrary.html", "/s/test", "/the-wedding", "/app", "/sign-in"]) {
      const response = await request.get(path, { maxRedirects: 0 });
      expect(response.status(), path).toBe(302);
      expect(response.headers().location, path).toBe("/");
    }
    for (const [path, destination] of [["/about/", "/"], ["/pricing/?utm_source=test", "/?utm_source=test"], ["/brand/loader.html/", "/"], ["/unknown/", "/"]]) {
      const response = await request.get(path, { maxRedirects: 0 });
      expect(response.status(), path).toBe(302);
      expect(response.headers().location, path).toBe(destination);
    }
    const wwwSlash = await request.get("/about/", { headers: { host: "www.signalstudio.ie" }, maxRedirects: 0 });
    expect(wwwSlash.status()).toBe(302);
    expect(wwwSlash.headers().location).toBe("/");
    expect((await request.get("/?utm_source=test", { maxRedirects: 0 })).status()).toBe(200);
    const hq = await request.get("/hq", { maxRedirects: 0 });
    expect(hq.headers().location).toContain("/hq/access");
    expect((await request.get("/share/signal-studio-card-v2.png")).status()).toBe(200);
    for (const path of ["/icon", "/icon1", "/icon2", "/icon3", "/icon4", "/apple-icon"]) {
      const response = await request.get(path, { maxRedirects: 0 });
      expect(response.status(), path).toBe(200);
      expect(response.headers()["content-type"], path).toContain("image/png");
      expect(response.headers().location, path).toBeUndefined();
      expect((await response.body()).subarray(0, 8), path).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    }
    expect((await (await request.get("/manifest.webmanifest")).json()).shortcuts).toEqual([]);
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      await page.goto("/?theme=dark");
      await expect(page.locator(".lp")).toHaveClass(/smooth/, { timeout: 30_000 });
      await expect(page.locator("#nav")).toBeVisible();
      await expect(page.locator("h1")).toHaveText("Project management for people not in tech.");
      const secondary = await page.locator('a[href^="/"]').evaluateAll(links => links.map(link => link.getAttribute("href")).filter(href => href !== "/" && !href?.startsWith("/#")));
      expect(secondary).toEqual([]);
      await expect(page.locator(".wl-hero")).toBeVisible();
      // Let the real entrance animation finish; do not disable motion for evidence.
      await page.locator(".hero .lp-rise, .hero .lp-move").evaluateAll(async elements => {
        await document.fonts.ready;
        await Promise.allSettled(elements.flatMap(element => element.getAnimations()).map(animation => animation.finished));
      });
      await expect.poll(() => page.locator(".hero .lp-rise, .hero .lp-move").evaluateAll(elements => elements.every(element => getComputedStyle(element).opacity === "1"))).toBe(true);
      await page.screenshot({ path: `experience/output/playwright-results/landing-only/home-${viewport.width}.png`, fullPage: false });
      if (viewport.width < 600) {
        await page.locator("#nav details summary").click();
        await expect(page.locator(".menu-panel")).toBeVisible();
        await page.locator('.menu-panel a[href="#projects"]').click();
        await expect(page.locator("#nav details")).not.toHaveAttribute("open");
      }
    }
    await page.locator(".lp-footer").scrollIntoViewIfNeeded();
    await page.locator(".lp-footer").evaluate(async element => {
      await document.fonts.ready;
      await Promise.allSettled(element.getAnimations({ subtree: true }).filter(animation => animation.effect?.getTiming().iterations !== Infinity).map(animation => animation.finished));
      await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    });
    await page.screenshot({ path: "experience/output/playwright-results/landing-only/footer-phone.png" });
    await page.locator("#wl-hero-email").fill("landing-review@example.invalid");
    const submission = page.waitForResponse(response => response.request().method() === "POST" && new URL(response.url()).pathname === "/");
    await page.locator("#wl-hero-submit").click();
    expect((await submission).status()).toBe(200);
    await expect(page.locator("#wl-hero-done")).toContainText("You are on the list.");
    const saved = await db.execute("SELECT email, source, path, status FROM waitlist_entries");
    expect(saved.rows).toHaveLength(1);
    expect(saved.rows[0]).toMatchObject({ email: "landing-review@example.invalid", source: "home_hero", path: "/", status: "waiting" });
    expect(errors).toEqual([]);
  } finally { db.close(); }
});
