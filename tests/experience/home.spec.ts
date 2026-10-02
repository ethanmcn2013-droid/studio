import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// The public home page, "One Friday" (content/hq/decisions/home-page-v3-2026-10-02.md).
// `?theme=` settles the theme the same way the device setting does, so each
// test says which surface it is looking at instead of inheriting the runner's.
const DARK = "/?theme=dark";
const LIGHT = "/?theme=light";

const DESK = { width: 1440, height: 900 } as const;
const PHONE = { width: 390, height: 844 } as const;

// Round 2: the width sweep the page was reviewed across, with a landscape phone.
const SWEEP = [
  { width: 320, height: 720 },
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 641, height: 960 },
  { width: 700, height: 1000 },
  { width: 768, height: 1024 },
  { width: 844, height: 390 },
  { width: 1024, height: 768 },
  { width: 1280, height: 720 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1440 },
] as const;

const SECTIONS = ["projects", "tasks", "timeline", "files", "analytics", "whiteboard", "join"] as const;

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

/** The colour the browser would give its bar: the first theme-color tag whose media applies. */
async function browserBar(page: Page) {
  return page.evaluate(() => {
    const tag = Array.from(document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')).find(
      (meta) => !meta.media || matchMedia(meta.media).matches,
    );
    if (!tag) return null;
    const probe = document.createElement("span");
    probe.style.color = tag.content;
    document.body.appendChild(probe);
    const colour = getComputedStyle(probe).color;
    probe.remove();
    return colour;
  });
}

async function counts(page: Page) {
  return page.evaluate(() =>
    ["need", "late", "week"]
      .map((key) => document.querySelector(`#home [data-n="${key}"]`)?.textContent)
      .join("/"),
  );
}

/** The runtime marks the page once it has landed; from then on its own jumps are eased. */
async function settled(page: Page) {
  await expect(page.locator(".lp")).toHaveClass(/(^| )smooth( |$)/, { timeout: 30_000 });
}

/** How far a section's top sits below the header's bottom edge. */
async function landing(page: Page, id: string) {
  return page.evaluate((target) => {
    const section = document.getElementById(target)!.getBoundingClientRect();
    const header = document.getElementById("nav")!.getBoundingClientRect();
    return Math.round(section.top - header.bottom);
  }, id);
}

test.describe("the home page, One Friday", () => {
  test.describe.configure({ timeout: 120_000 });

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
    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor))
      .toBe("rgb(244, 243, 241)");

    await page.goto("/pricing");
    await expect(page.locator(".lp")).toHaveCount(0);
    await expect(page.locator("header.site-nav")).toBeVisible();
    expect(
      await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor),
    ).toBe("rgb(255, 255, 255)");
  });

  test("colours the browser bar like the floor, before and after the toggle", async ({ page }) => {
    const errors = collectPageErrors(page);
    const floor = () => page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);

    // No script has to run for the opening colour: the server sends it.
    const sent = await (await page.request.get("/")).text();
    expect(sent).toContain('<meta name="theme-color" content="rgb(244, 243, 241)" media="(prefers-color-scheme: light)"/>');
    expect(sent).toContain('<meta name="theme-color" content="rgb(12, 12, 13)" media="(prefers-color-scheme: dark)"/>');
    expect(await (await page.request.get(LIGHT)).text()).toContain('<meta name="theme-color" content="rgb(244, 243, 241)"/>');
    expect(await (await page.request.get(DARK)).text()).toContain('<meta name="theme-color" content="rgb(12, 12, 13)"/>');

    for (const scheme of ["dark", "light"] as const) {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto("/");
      await page.evaluate(() => localStorage.clear());
      await page.goto("/");
      await expect(page.locator(".lp")).toHaveAttribute("data-theme", scheme);
      await expect.poll(() => browserBar(page)).toBe(await floor());
      await page.locator("#theme").click();
      await expect(page.locator(".lp")).toHaveAttribute("data-theme", scheme === "dark" ? "light" : "dark");
      await expect.poll(async () => (await browserBar(page)) === (await floor())).toBe(true);
      await page.locator("#theme").click();
      await expect.poll(async () => (await browserBar(page)) === (await floor())).toBe(true);
    }

    expect(errors).toEqual([]);
  });

  test("hands the browser bar back when the page leaves, and leaves the signed-in launcher white", async ({ page, browser }) => {
    const errors = collectPageErrors(page);
    // ?theme= wins over the device, for the bar as for the page.
    await page.emulateMedia({ colorScheme: "light" });
    await page.setViewportSize(DESK);
    await page.goto(DARK);
    await expect.poll(() => browserBar(page)).toBe("rgb(12, 12, 13)");
    expect(
      await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor),
    ).toBe("rgb(12, 12, 13)");

    // Leaving by a link in the page hands the bar back to the rest of the site.
    await page.locator(".lp header").getByRole("link", { name: "Pricing" }).click();
    // A dev server builds Pricing on first request, so the arrival gets room.
    await expect(page).toHaveURL(/\/pricing$/, { timeout: 30_000 });
    await expect(page.locator(".lp")).toHaveCount(0);
    await expect.poll(() => browserBar(page)).toBe("rgb(255, 255, 255)");
    await expect(page.locator('meta[name="theme-color"]')).toHaveCount(1);
    expect(errors).toEqual([]);

    // The signed-in launcher on the same URL keeps the site's white bar.
    const signedIn = await browser.newContext({ extraHTTPHeaders: { "x-signal-authed": "1" } });
    const launcher = await signedIn.newPage();
    await launcher.goto("/");
    await expect(launcher.locator(".lp")).toHaveCount(0);
    await expect(launcher.locator('meta[name="theme-color"]')).toHaveCount(1);
    expect(await browserBar(launcher)).toBe("rgb(255, 255, 255)");
    await signedIn.close();
  });

  test("follows a light device without being asked", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.setViewportSize(DESK);
    await page.goto("/");
    await expect(page.locator(".lp")).toHaveAttribute("data-theme", "light");
    // The capture loads lazily, so bring its own frame into view and give a busy dev server time.
    await page.locator("#pl-projects").scrollIntoViewIfNeeded();
    await expect
      .poll(
        () => page.locator("#pl-projects .shot.v-desk.on img").evaluate((img: HTMLImageElement) => img.currentSrc),
        { timeout: 20_000 },
      )
      .toMatch(/projects-desk-light-\dx\.webp$/);
  });

  test("remembers the theme the visitor chose, and paints it first", async ({ page }) => {
    // The page records what its root looked like in the first frame it could draw.
    await page.addInitScript(() => {
      requestAnimationFrame(() => {
        const root = document.querySelector(".lp");
        (window as unknown as { __first: unknown }).__first = root
          ? { theme: root.getAttribute("data-theme"), floor: getComputedStyle(document.documentElement).backgroundColor }
          : null;
      });
    });
    await page.emulateMedia({ colorScheme: "dark" });
    await page.setViewportSize(DESK);
    await page.goto("/");
    await page.locator("#theme").click();
    await expect(page.locator(".lp")).toHaveAttribute("data-theme", "light");
    expect(await page.evaluate(() => localStorage.getItem("signal-home-theme"))).toBe("light");

    await page.reload();
    await expect(page.locator(".lp")).toHaveAttribute("data-theme", "light");
    expect(await page.evaluate(() => (window as unknown as { __first: unknown }).__first)).toEqual({
      theme: "light",
      floor: "rgb(244, 243, 241)",
    });
    // Nothing fades between themes on its own: the root has no colour transition to run.
    expect(
      await page.evaluate(() => getComputedStyle(document.querySelector(".lp")!).transitionDuration),
    ).toBe("0s");

    // It survives a visit elsewhere, and ?theme= still wins for one load without being stored.
    await page.goto("/about");
    await page.goto("/");
    await expect(page.locator(".lp")).toHaveAttribute("data-theme", "light");
    await page.goto(DARK);
    await expect(page.locator(".lp")).toHaveAttribute("data-theme", "dark");
    expect(await page.evaluate(() => localStorage.getItem("signal-home-theme"))).toBe("light");
  });

  test("carries its own header, one main and the shared footer", async ({ page }) => {
    await page.setViewportSize(DESK);
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
    // The page runs in the header's order, so the marker only ever moves forward.
    const order = await page.evaluate(() =>
      Array.from(document.querySelectorAll("main > section")).map((section) => section.id),
    );
    expect(order).toEqual([
      "top",
      "who",
      "projects",
      "tasks",
      "timeline",
      "files",
      "yours",
      "analytics",
      "whiteboard",
      "words",
      "venue",
      "join",
    ]);
    // Headings step down one level at a time.
    const levels = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".lp main h1, .lp main h2, .lp main h3")).map((h) => +h.tagName[1]),
    );
    levels.forEach((level, index) => {
      if (index) expect(level - levels[index - 1], `heading ${index}`).toBeLessThanOrEqual(1);
    });
  });

  test("the header is opaque enough to read, with a blur where the browser has one", async ({ page }) => {
    await page.setViewportSize(DESK);
    for (const route of [DARK, LIGHT]) {
      await page.goto(route);
      const bar = await page.locator("#nav").evaluate((nav) => {
        const style = getComputedStyle(nav);
        const alpha = style.backgroundColor.match(/rgba?\(([^)]+)\)/)![1].split(",").map(Number)[3] ?? 1;
        return { alpha, blur: style.backdropFilter || (style as unknown as Record<string, string>).webkitBackdropFilter };
      });
      expect(bar.alpha, route).toBeGreaterThanOrEqual(0.9);
      expect(bar.blur, route).toContain("blur(");
    }
  });

  test("is its final height before any script runs, so deep links and reloads land", async ({ page }) => {
    test.setTimeout(300_000);
    for (const viewport of [DESK, PHONE]) {
      await page.setViewportSize(viewport);
      // Every height the document has once it is parsed, frame by frame.
      await page.addInitScript(() => {
        const seen: number[] = [];
        (window as unknown as { __heights: number[] }).__heights = seen;
        const tick = () => {
          if (document.readyState !== "loading") {
            const height = document.documentElement.scrollHeight;
            if (seen[seen.length - 1] !== height) seen.push(height);
          }
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      // Once to put the web fonts in the cache: a font arriving late can re-wrap a line, which
      // is the layout's to settle (scroll anchoring holds the view meanwhile). This test is
      // about the page's own sizing, with the fonts in hand.
      await page.goto(DARK);
      await page.evaluate(() => document.fonts.ready);
      await page.goto(DARK);
      await settled(page);
      await page.waitForTimeout(1200);
      const heights = await page.evaluate(() => (window as unknown as { __heights: number[] }).__heights);
      expect(heights, `document heights at ${viewport.width}`).toHaveLength(1);

      // A cold deep link lands with the section's top just under the header.
      for (const id of SECTIONS) {
        await page.goto("about:blank");
        await page.goto(`/?theme=dark#${id}`);
        await settled(page);
        const gap = await landing(page, id);
        expect(gap, `/#${id} at ${viewport.width}`).toBeGreaterThanOrEqual(0);
        expect(gap, `/#${id} at ${viewport.width}`).toBeLessThanOrEqual(40);
      }

      // A reload comes back to the same place.
      await page.goto(DARK);
      await settled(page);
      for (const y of [3500, 7000]) {
        await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
        await page.waitForTimeout(250);
        await page.reload();
        await settled(page);
        expect(Math.abs((await page.evaluate(() => window.scrollY)) - y), `reload at ${y}, ${viewport.width}`).toBeLessThanOrEqual(2);
      }
    }
  });

  test("the Friday story shows the step the scroll position says, however you arrive", async ({ page }) => {
    await page.setViewportSize(DESK);
    await page.goto(DARK);
    await settled(page);
    const story = await page.evaluate(() => {
      const track = document.getElementById("story")!;
      const nav = document.getElementById("nav")!.offsetHeight;
      return { top: track.getBoundingClientRect().top + window.scrollY - nav, range: track.offsetHeight - (window.innerHeight - nav) };
    });
    const middle = (step: number) => Math.round(story.top + (story.range * (step + 0.5)) / 3);
    const showing = () => page.locator("#steps .step.on").getAttribute("data-step");

    // Jump straight to each step, out of order, with no scrolling in between.
    for (const step of [2, 0, 1, 2]) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), middle(step));
      await expect.poll(showing).toBe(String(step));
      await expect(page.locator("#steps .step.on")).toHaveCount(1);
      await expect(page.locator("#tabs button[aria-current]")).toHaveCount(1);
    }
    // From far below, straight back in: the stage is already on the last step.
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), middle(2));
    await expect.poll(showing).toBe("2");
    // A reload inside the story comes back on the same step.
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), middle(1));
    await expect.poll(showing).toBe("1");
    await page.reload();
    await settled(page);
    await expect.poll(showing).toBe("1");
    // Nothing on screen is dimmed: the steps not showing are not shown at all.
    await expect
      .poll(() =>
        page.evaluate(() =>
          Array.from(document.querySelectorAll("#steps .step")).map((step) => getComputedStyle(step).opacity),
        ),
      )
      .toEqual(["0", "1", "0"]);
    // The tabs jump to their step.
    await page.locator("#tabs button", { hasText: "Board" }).click();
    await expect.poll(showing).toBe("2");
  });

  test("the working Home counts with the visitor, and Undo says what it did", async ({ page }) => {
    await page.setViewportSize(DESK);
    await page.goto(DARK);
    await settled(page);
    const toast = page.locator("#toast");
    expect(await counts(page)).toBe("5/11/35");
    const first = page.getByRole("button", { name: "Mark done: Agree the winter price list" });
    await first.click();
    expect(await counts(page)).toBe("4/10/36");
    await expect(toast).toContainText("Marked done. That is it. You just did project management.");
    // The name stays put and the pressed state carries the change.
    await expect(first).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#live")).toContainText("Undo with Control Z.");
    await expect(page.locator("#undo")).toHaveAttribute("aria-keyshortcuts", "Control+Z");

    await page.getByRole("button", { name: "Mark done: Approve the brochure copy" }).click();
    expect(await counts(page)).toBe("3/9/37");
    // One step back, and the page says one step. The button stays while there is more to undo.
    await page.getByRole("button", { name: "Undo" }).click();
    expect(await counts(page)).toBe("4/10/36");
    await expect(toast).toHaveText(/^Undone\./);
    await expect(toast).not.toContainText("Everything is back");
    await expect(page.locator("#undo")).toBeVisible();
    // Redo, from anywhere on the page while the sample is in view.
    await page.locator("body").click({ position: { x: 5, y: 300 } });
    await page.keyboard.press("Control+Shift+Z");
    expect(await counts(page)).toBe("3/9/37");
    await expect(toast).toContainText("Redone.");
    await page.keyboard.press("Control+Z");
    await page.keyboard.press("Control+Z");
    expect(await counts(page)).toBe("5/11/35");
    await expect(toast).toContainText("Undone. Everything is back as it was.");
    await expect(page.locator("#undo")).toBeHidden();
    await expect(page.locator(".tick.hint")).toHaveCount(1);

    // Reopening says only that; the nudge says nothing was really sent.
    await page.getByRole("button", { name: "Mark done: Send the final invoice to Mara and Finn" }).click();
    await expect(toast).toHaveText(/^Reopened\.\s*Undo/);
    await page.getByRole("button", { name: "Nudge Fern and Furrow" }).click();
    await expect(page.locator("#nudge")).toHaveText("Nudged today");
    await expect(toast).toContainText("Nudged. This is a sample, so nothing was really sent.");
    // Escape puts the toast away.
    await page.keyboard.press("Escape");
    await expect(toast).not.toHaveClass(/(^| )on( |$)/);
  });

  test("a tab never shows an empty plate, and the arrow keys move between tabs", async ({ page }) => {
    await page.setViewportSize(DESK);
    // The second view arrives late.
    await page.route("**/landing/**/ledger-desk-*", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await route.continue();
    });
    await page.goto(DARK);
    await settled(page);
    await page.locator("#pl-projects").scrollIntoViewIfNeeded();
    const showing = page.locator("#pl-projects .shot.v-desk.on img");
    await expect.poll(() => showing.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0), { timeout: 20_000 }).toBe(true);

    const tabs = page.getByRole("tablist", { name: "Projects views" }).getByRole("tab");
    await expect(tabs).toHaveText(["Covers", "List", "One project"]);
    await tabs.nth(1).click();
    // Until the new capture has arrived, the plate goes on showing a whole picture.
    for (let i = 0; i < 4; i++) {
      expect(
        await showing.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
        "the plate is showing a loaded capture",
      ).toBe(true);
      await page.waitForTimeout(150);
    }
    await expect(showing).toHaveAttribute("data-shot", "ledger-desk", { timeout: 15_000 });
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(page.locator('[data-cap="pl-projects"]')).toHaveText("The same projects as rows, for when you want to compare them.");

    await tabs.nth(1).press("ArrowRight");
    await expect(tabs.nth(2)).toBeFocused();
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
    await tabs.nth(2).press("Home");
    await expect(tabs.nth(0)).toBeFocused();
    await expect(page.getByRole("tabpanel", { name: "Covers" })).toBeVisible();
    // Analytics leads with the question.
    await expect(page.getByRole("tablist", { name: "Analytics views" }).getByRole("tab")).toHaveText([
      "Ask a question",
      "Every project",
    ]);
  });

  test("the whiteboard keeps its height, moves by transform and can be paused", async ({ page }) => {
    for (const [viewport, height, count] of [
      [DESK, 688, "21 notes in 6 groups"],
      [{ width: 900, height: 1000 }, 1100, "21 notes in 6 groups"],
      [PHONE, 986, "12 notes in 3 groups"],
    ] as const) {
      await page.setViewportSize(viewport);
      await page.goto(DARK);
      await settled(page);
      const wall = page.locator("#wb");
      await wall.scrollIntoViewIfNeeded();
      const tall = () => wall.evaluate((el) => el.getBoundingClientRect().height);
      expect(await tall(), `wall at ${viewport.width}`).toBe(height);
      await expect(page.locator(".wb-count > span:visible")).toHaveText(count);
      const before = await page.locator("#n-florist").evaluate((note) => getComputedStyle(note).transform);
      await page.locator("#tidy").click();
      await expect(page.locator("#tidy")).toHaveText("Put it back");
      await expect.poll(() => page.locator("#n-florist").evaluate((note) => getComputedStyle(note).transform)).not.toBe(before);
      // Tidy changes transforms only: no note has a left or top of its own, and the wall does not move the page.
      expect(await page.locator("#n-florist").evaluate((note: HTMLElement) => note.style.left + note.style.top)).toBe("");
      expect(await tall(), `tidy wall at ${viewport.width}`).toBe(height);
      // No note sits outside the wall.
      await page.waitForTimeout(600);
      const strays = await wall.evaluate((el) => {
        const box = el.getBoundingClientRect();
        return Array.from(el.querySelectorAll<HTMLElement>(".note:not([hidden])")).filter((note) => {
          const r = note.getBoundingClientRect();
          return r.left < box.left - 1 || r.right > box.right + 1 || r.top < box.top - 1 || r.bottom > box.bottom + 1;
        }).length;
      });
      expect(strays, `notes outside the wall at ${viewport.width}`).toBe(0);
    }

    // The sample people stop when asked.
    await page.setViewportSize(DESK);
    await page.goto(DARK);
    await settled(page);
    await page.locator("#wb").scrollIntoViewIfNeeded();
    const pause = page.getByRole("button", { name: "Pause sample people" });
    await pause.click();
    await expect(page.getByRole("button", { name: "Resume sample people" })).toBeVisible();
    await page.waitForTimeout(1500);
    const still = () =>
      page.evaluate(() => Array.from(document.querySelectorAll<HTMLElement>("#wb .cursor")).map((c) => c.style.getPropertyValue("--lp-x") + c.style.getPropertyValue("--lp-y")).join("|"));
    const held = await still();
    await page.waitForTimeout(4000);
    expect(await still()).toBe(held);

    // A note can be moved without dragging: press it, then press where it should go.
    const note = page.locator("#n-florist");
    const from = await note.boundingBox();
    await note.click();
    await expect(note).toHaveClass(/picked/);
    await page.locator("#wb").click({ position: { x: 300, y: 655 } });
    await expect(note).not.toHaveClass(/picked/);
    await expect
      .poll(async () => {
        const to = await note.boundingBox();
        return Math.abs(to!.x - from!.x) + Math.abs(to!.y - from!.y);
      })
      .toBeGreaterThan(100);
    await expect(page.locator("#live")).toContainText("Chase florist deposit, put down");

    // With the keyboard: the name carries the group, and the drop says where it landed.
    await expect(note).toHaveAccessibleName(/Chase florist deposit, in Suppliers/);
    await expect(page.locator("#wb-keys")).toBeVisible();
    await page.locator("#wb .note").first().focus();
    await page.keyboard.press("End");
    // The last note on the wall: the one being typed, or the one before it while that is still to come.
    await expect(page.locator("#wb .note:focus")).toHaveAccessibleName(/^(Sparkler exit|Rings back)/);
    await page.keyboard.press("Home");
    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page.locator("#live")).toContainText(/Brief the whole team on the day, put down (in The day|between groups)\./);
  });

  test("the waitlist form checks the address before it sends anything", async ({ page }) => {
    await page.setViewportSize(DESK);
    await page.goto(DARK);
    await settled(page);
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
    // What joining gets you, in the site's own published facts.
    await expect(page.locator("#wl-note")).toHaveText(
      "Free to join. No card and no newsletter. One email when it is your turn, from January 2027. There is a free plan for one project, and Pro is €12 a month.",
    );
    await expect(page.locator("#join").getByRole("link", { name: "See pricing" })).toHaveAttribute("href", "/pricing");
    await expect(page.locator("#join").getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    await expect(page.locator("#wl-email")).toHaveAttribute("enterkeyhint", "send");
    // "What do you run?" is optional and rides along in two fields.
    await expect(page.locator('#waitlist-form input[name="audience"]')).toHaveValue("");
    await page.getByRole("radio", { name: "Trade" }).check();
    await expect(page.locator('#waitlist-form input[name="audience"]')).toHaveValue("trade");
    await expect(page.locator('#waitlist-form input[name="useCase"]')).toHaveValue("trades");
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
    // Venues have a second way in, by email, and everyone else has the list.
    await expect(page.locator("#venue").getByRole("link", { name: "Run a venue? Ask to try it now" })).toHaveAttribute(
      "href",
      "mailto:hello@signalstudio.ie?subject=Trying%20Signal%20Studio%20at%20our%20venue",
    );
    await expect(page.locator("#venue")).toContainText("Everyone else, join the waitlist.");
  });

  test("strikes only words the page itself never uses", async ({ page }) => {
    await page.setViewportSize(DESK);
    await page.goto(DARK);
    const { struck, rest } = await page.evaluate(() => {
      const list = document.querySelector(".struck")!;
      const words = Array.from(list.querySelectorAll("del")).map((del) => del.textContent!.toLowerCase());
      const clone = document.querySelector(".lp")!.cloneNode(true) as HTMLElement;
      clone.querySelector(".struck")!.remove();
      const alts = Array.from(clone.querySelectorAll("img")).map((img) => img.alt).join(" ");
      const labels = Array.from(clone.querySelectorAll("[aria-label]")).map((el) => el.getAttribute("aria-label")).join(" ");
      return { struck: words, rest: `${clone.textContent} ${alts} ${labels}`.toLowerCase() };
    });
    expect(struck).toHaveLength(14);
    for (const word of struck) expect(rest.includes(word), `"${word}" appears on the page`).toBe(false);
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

  test("gives touch every control at 44 px, on a phone", async ({ browser }) => {
    const context = await browser.newContext({ viewport: PHONE, hasTouch: true, isMobile: true, colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto(DARK);
    await settled(page);
    expect(await page.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(true);
    // Bring every state's controls out: the toast, the open menu, the header button.
    await page.locator("#win-more").click();
    await page.getByRole("button", { name: "Mark done: Agree the winter price list" }).click();
    await page.locator(".menu summary").click();
    await page.waitForTimeout(400);
    const small = await page.evaluate(() => {
      const controls = Array.from(
        document.querySelectorAll<HTMLElement>(".lp header a, .lp header button, .lp header summary, .lp main button, .lp main a.btn, .lp main a.link, .lp main .chips label, .lp .toast button, .lp .dotrun"),
      );
      return controls
        .filter((el) => el.getClientRects().length && getComputedStyle(el).visibility !== "hidden" && !el.closest(".wb .note"))
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { what: (el.getAttribute("aria-label") || el.textContent || el.className).trim().slice(0, 40), w: Math.round(r.width), h: Math.round(r.height) };
        })
        .filter((c) => c.h < 44 || c.w < 44);
    });
    expect(small).toEqual([]);
    await context.close();
  });

  test("keeps its edges and its meaning in forced colours", async ({ page }) => {
    await page.setViewportSize(DESK);
    await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
    await page.goto(DARK);
    const edges = await page.evaluate(() => {
      const edge = (selector: string) => {
        const style = getComputedStyle(document.querySelector(selector)!);
        return style.borderTopStyle === "solid" && parseFloat(style.borderTopWidth) >= 1;
      };
      return {
        input: edge("#wl-email"),
        primary: edge(".hero .btn-primary"),
        ghost: edge(".hero .btn-ghost"),
        tab: edge('.tabs [role="tab"][aria-selected="false"]'),
        chosenTab: edge('.tabs [role="tab"][aria-selected="true"]'),
        note: edge("#wb .note"),
        themeSwitch: edge("#theme"),
        struck: getComputedStyle(document.querySelector(".struck del")!).textDecorationLine,
      };
    });
    expect(edges).toEqual({
      input: true,
      primary: true,
      ghost: true,
      tab: true,
      chosenTab: true,
      note: true,
      themeSwitch: true,
      struck: "line-through",
    });
  });

  test("prints as a readable light page", async ({ page }) => {
    await page.setViewportSize(DESK);
    await page.goto(DARK);
    await settled(page);
    await page.emulateMedia({ media: "print" });
    const printed = await page.evaluate(() => {
      const style = (selector: string) => getComputedStyle(document.querySelector(selector)!);
      return {
        h1: style("h1").visibility,
        ink: style("h1").color,
        floor: style(".lp").backgroundColor,
        nav: style("#nav").position,
        toast: style("#toast").display,
        hidden: Array.from(document.querySelectorAll(".lp-reveal")).filter((el) => getComputedStyle(el).opacity !== "1").length,
        steps: Array.from(document.querySelectorAll("#steps .step")).filter((el) => getComputedStyle(el).opacity !== "1").length,
      };
    });
    expect(printed).toEqual({
      h1: "visible",
      ink: "rgb(20, 20, 20)",
      floor: "rgb(255, 255, 255)",
      nav: "static",
      toast: "none",
      hidden: 0,
      steps: 0,
    });
  });

  test("reads in full with no script: nothing dimmed, hidden or left looking live", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: DESK });
    const page = await context.newPage();
    await page.goto(DARK);
    await expect(page.locator(".noscript")).toContainText("This page reads in full without JavaScript.");
    const state = await page.evaluate(() => {
      const shown = (selector: string) => Array.from(document.querySelectorAll<HTMLElement>(selector));
      return {
        dim: shown(".lp-reveal, #steps .step, .shot").filter((el) => getComputedStyle(el).opacity !== "1" && el.getClientRects().length && !el.closest("[data-tabs]")).length,
        flat: shown(".shot.v-desk").filter((el) => el.getClientRects().length && el.getBoundingClientRect().height < 100).length,
        deadTabs: shown(".tabs").filter((el) => el.getClientRects().length).length,
        live: shown("#respond, #theme, .wb-tools").filter((el) => el.getClientRects().length).length,
      };
    });
    expect(state).toEqual({ dim: 0, flat: 0, deadTabs: 0, live: 0 });
    await context.close();
  });

  test("has no accessibility violation, dark or light, desktop or phone", async ({ page }) => {
    // Reduced motion is the settled page: every section revealed, nothing mid-scene.
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of [DARK, LIGHT]) {
      for (const viewport of [DESK, PHONE]) {
        await page.setViewportSize(viewport);
        await page.goto(route);
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
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

  test("keeps focus clear of the header and closes the phone menu behind it", async ({ page }) => {
    // A short, wide window: a laptop at 150% zoom. Reduced motion, so each focus scroll has finished when it is measured.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1280, height: 600 });
    await page.goto(DARK);
    await settled(page);
    await page.evaluate(() => window.scrollTo({ top: 1400, behavior: "instant" }));
    await page.locator("#wl-email").focus();
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press("Shift+Tab");
      const hidden = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        // The layout's skip link sits outside the page root and over the header by design.
        if (!el || el === document.body || el.closest("#nav") || !el.closest(".lp")) return null;
        const r = el.getBoundingClientRect();
        const bar = document.getElementById("nav")!.getBoundingClientRect().bottom;
        return r.top < bar - 1 ? `${el.tagName} ${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 30)} at ${Math.round(r.top)}` : null;
      });
      expect(hidden, "a focused control under the header").toBeNull();
    }

    await page.setViewportSize(PHONE);
    await page.goto(DARK);
    await settled(page);
    const menu = page.locator(".menu");
    await page.locator(".menu summary").click();
    await expect(menu).toHaveAttribute("open", "");
    for (let i = 0; i < 10; i++) await page.keyboard.press("Tab");
    await expect(menu).not.toHaveAttribute("open", "");
    // On a landscape phone the whole menu is reachable.
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto(DARK);
    await settled(page);
    await page.locator(".menu summary").click();
    const panel = await page.locator(".menu-panel").boundingBox();
    expect(panel!.y + panel!.height).toBeLessThanOrEqual(390);
  });

  test("stays free of console, page and request errors from top to bottom", async ({ page }) => {
    const errors = collectPageErrors(page);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.setViewportSize(DESK);
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
