import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const LAB_PATH = "/__design-lab/product-handoff";
const OPTIONS = ["a", "b", "c"] as const;
const PRODUCTS = ["notes", "tasks", "timeline", "signal"] as const;
const FRAMES = [0, 0.5, 1] as const;
const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "landscape", width: 1024, height: 768 },
  { name: "desktop", width: 1440, height: 960 },
] as const;

const PRODUCT_TEXT = {
  notes: [
    "Venue can open the side room after six",
    "Ask the venue to hold the side room",
    "Mara",
    "Fri",
  ],
  tasks: [
    "Confirm the catering tasting menu",
    "Menu confirmed",
    "30 Jul",
    "Completed task",
  ],
  timeline: [
    "Send the invitations",
    "Invitations are due 13 Aug.",
    "13 Aug",
    "Timeline",
  ],
  signal: [
    "The final dietary list is still open.",
    "Close the final dietary list",
    "Mara",
    "Today",
  ],
} as const;

const NEXT_HREF = {
  notes: "/tasks",
  tasks: "/timeline",
  timeline: "/signal",
  signal: null,
} as const;

function labUrl({
  option = "a",
  product = "notes",
  progress = 0,
  motion = "auto",
  viewport = "auto",
}: {
  option?: (typeof OPTIONS)[number];
  product?: (typeof PRODUCTS)[number] | "walk";
  progress?: number;
  motion?: "auto" | "reduce";
  viewport?: "auto" | "mobile" | "tablet" | "desktop";
}) {
  const params = new URLSearchParams({
    option,
    product,
    progress: String(progress),
    motion,
    viewport,
  });
  return `${LAB_PATH}?${params}`;
}

test("the review route is hidden from canonical production hosts", async ({
  request,
}) => {
  const directResponse = await request.get(labUrl({}), {
    headers: { host: "signalstudio.ie" },
  });
  expect(directResponse.status()).toBe(404);

  const forwardedResponse = await request.get(labUrl({}), {
    headers: {
      host: "studio-production.vercel.app",
      "x-forwarded-host": "signalstudio.ie",
    },
  });
  expect(forwardedResponse.status()).toBe(404);
});

for (const viewport of VIEWPORTS) {
  for (const product of PRODUCTS) {
    test(`${product} remains intact at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      const response = await page.goto(
        labUrl({ product, progress: 1, motion: "reduce" }),
      );
      expect(response?.status()).toBe(200);

      const metrics = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(metrics.scroll).toBeLessThanOrEqual(metrics.viewport);

      const preview = page.getByTestId("handoff-preview");
      await expect(preview).toBeVisible();
      await expect(preview).toContainText(PRODUCT_TEXT[product][0]);
      await expect(preview).toContainText(PRODUCT_TEXT[product][1]);
      await expect(preview).toContainText(PRODUCT_TEXT[product][2]);
      await expect(preview).toContainText(PRODUCT_TEXT[product][3]);
      await expect(page.getByLabel("Animation progress")).toHaveValue("1");

      if (product === "signal") {
        await expect(preview.getByText(/Open task/i)).toHaveCount(0);
        await expect(preview.getByRole("link", { name: /Next:/ })).toHaveCount(
          0,
        );
      } else {
        const next = preview.getByRole("link", { name: /Next:/ });
        await expect(next).toBeVisible();
        const box = await next.boundingBox();
        expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
        await next.focus();
        const outline = await next.evaluate((element) => {
          const style = getComputedStyle(element);
          return {
            style: style.outlineStyle,
            width: Number.parseFloat(style.outlineWidth),
          };
        });
        expect(outline.style).not.toBe("none");
        expect(outline.width).toBeGreaterThanOrEqual(2);
      }
    });
  }
}

for (const option of OPTIONS) {
  for (const product of PRODUCTS) {
    test(`${option}/${product} has deterministic, layout-stable frames`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 960 });
      await page.goto(labUrl({ option, product, progress: 0 }));
      const preview = page.getByTestId("handoff-preview");
      const initial = await preview.boundingBox();
      expect(initial).not.toBeNull();
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
      await expect(page.getByLabel("Animation progress")).toHaveValue("0");

      const activeSceneAnimations = await page
        .locator("[data-handoff-scene]")
        .evaluate((element) => element.getAnimations({ subtree: true }).length);
      expect(activeSceneAnimations).toBe(0);

      for (const frame of FRAMES) {
        const range = page.getByLabel("Animation progress");
        await range.evaluate((input, value) => {
          const element = input as HTMLInputElement;
          element.value = String(value);
          element.dispatchEvent(new Event("input", { bubbles: true }));
        }, frame);
        await expect(range).toHaveValue(String(frame));
        const current = await preview.boundingBox();
        expect(Math.abs((current?.width ?? 0) - (initial?.width ?? 0))).toBeLessThan(
          0.5,
        );
        expect(
          Math.abs((current?.height ?? 0) - (initial?.height ?? 0)),
        ).toBeLessThan(0.5);
      }
    });
  }
}

for (const viewport of VIEWPORTS) {
  test(`Living Artifact is the stable production Handoff at ${viewport.name}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);

    for (const product of PRODUCTS) {
      const response = await page.goto(`/${product}`);
      expect(response?.status()).toBe(200);
      expect(await page.evaluate(() => window.scrollY)).toBe(0);

      const handoff = page.locator("[data-product-handoff]");
      await expect(handoff).toHaveCount(1);
      const initialHeight = await handoff.evaluate(
        (element) => element.getBoundingClientRect().height,
      );
      const initialDestinationOpacity = await handoff
        .locator("[data-destination-artifact]")
        .evaluate((element) =>
          Number.parseFloat(getComputedStyle(element).opacity),
        );
      expect(initialDestinationOpacity).toBeLessThanOrEqual(0.05);

      await handoff.evaluate((element) => {
        const target =
          window.scrollY +
          element.getBoundingClientRect().bottom -
          window.innerHeight * 0.28;
        window.scrollTo({ top: target, behavior: "instant" });
      });
      await expect
        .poll(() =>
          handoff
            .locator("[data-destination-artifact]")
            .evaluate((element) =>
              Number.parseFloat(getComputedStyle(element).opacity),
            ),
        )
        .toBeGreaterThan(0.98);

      await expect(handoff).toContainText(PRODUCT_TEXT[product][0]);
      await expect(handoff).toContainText(PRODUCT_TEXT[product][1]);
      await expect(handoff).toContainText(PRODUCT_TEXT[product][2]);
      await expect(handoff).toContainText(PRODUCT_TEXT[product][3]);

      const settledHeight = await handoff.evaluate(
        (element) => element.getBoundingClientRect().height,
      );
      expect(Math.abs(settledHeight - initialHeight)).toBeLessThan(0.5);

      const metrics = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(metrics.scroll).toBeLessThanOrEqual(metrics.viewport);

      const expectedHref = NEXT_HREF[product];
      const next = handoff.getByRole("link", { name: /Next:/ });
      if (expectedHref) {
        await expect(next).toHaveAttribute("href", expectedHref);
        const box = await next.boundingBox();
        expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
        await next.focus();
        await expect(next).toBeFocused();
      } else {
        await expect(next).toHaveCount(0);
        await expect(handoff.getByText(/Open task/i)).toHaveCount(0);
      }
    }
  });
}

for (const viewport of [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 960 },
] as const) {
  test(`production reduced motion is complete at ${viewport.name}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });

    for (const product of PRODUCTS) {
      await page.goto(`/${product}`);
      const handoff = page.locator("[data-product-handoff]");
      await expect(handoff).toHaveAttribute("data-reduced", "true");
      const destination = handoff.locator("[data-destination-artifact]");
      await expect(destination).toBeAttached();
      expect(
        await destination.evaluate((element) =>
          Number.parseFloat(getComputedStyle(element).opacity),
        ),
      ).toBe(1);
      expect(
        await handoff.evaluate(
          (element) => element.getAnimations({ subtree: true }).length,
        ),
      ).toBe(0);
      await expect(handoff).toContainText(PRODUCT_TEXT[product][0]);
      await expect(handoff).toContainText(PRODUCT_TEXT[product][1]);
    }
  });
}

test("homepage emphasis and product signatures match the founder direction", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/");

  const headline = page.getByRole("heading", {
    level: 1,
    name: "Project management for the 80% not in tech.",
  });
  await expect(headline).toBeVisible();
  const accent = headline.locator(".reveal-headline-accent");
  await expect(accent).toHaveText("not");
  const colours = await headline.evaluate((element) => ({
    ink: getComputedStyle(element).color,
    accent: getComputedStyle(
      element.querySelector(".reveal-headline-accent") as Element,
    ).color,
  }));
  expect(colours.accent).not.toBe(colours.ink);

  const signatures = page.locator("[data-product-signature]");
  await expect(signatures).toHaveCount(4);
  await expect(
    signatures.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("data-product")),
    ),
  ).resolves.toEqual(["notes", "tasks", "timeline", "signal"]);
  await signatures.first().scrollIntoViewIfNeeded();
  await expect(signatures.first()).toHaveAttribute("data-active", "true");
});

test("the four production Handoffs have no serious accessibility violations", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });

  for (const product of PRODUCTS) {
    await page.goto(`/${product}`);
    const result = await new AxeBuilder({ page })
      .include("[data-product-handoff]")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations).toEqual([]);
  }
});

for (const option of OPTIONS) {
  for (const viewport of [
    { name: "mobile", width: 390, height: 844 },
    { name: "desktop", width: 1440, height: 960 },
  ] as const) {
    test(`${option} Product Walk is sequential and contained at ${viewport.name}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(
        labUrl({
          option,
          product: "walk",
          progress: 0.5,
          viewport: viewport.name,
        }),
      );

      const scenes = page.locator("[data-handoff-scene]");
      await expect(scenes).toHaveCount(4);
      const metrics = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(metrics.scroll).toBeLessThanOrEqual(metrics.viewport);

      const contained = await scenes.evaluateAll((elements) =>
        elements.every(
          (element) => element.scrollWidth <= element.clientWidth + 1,
        ),
      );
      expect(contained).toBe(true);

      const destinationOpacities = await page
        .locator("[data-destination-artifact]")
        .evaluateAll((elements) =>
          elements.map((element) =>
            Number.parseFloat(getComputedStyle(element).opacity),
          ),
        );
      expect(destinationOpacities[0]).toBeGreaterThan(
        destinationOpacities[3],
      );

      const initialHeight = await page
        .getByTestId("handoff-preview")
        .evaluate((element) => element.getBoundingClientRect().height);
      for (const frame of FRAMES) {
        const range = page.getByLabel("Animation progress");
        await range.evaluate((input, value) => {
          const element = input as HTMLInputElement;
          element.value = String(value);
          element.dispatchEvent(new Event("input", { bubbles: true }));
        }, frame);
        const height = await page
          .getByTestId("handoff-preview")
          .evaluate((element) => element.getBoundingClientRect().height);
        expect(Math.abs(height - initialHeight)).toBeLessThan(0.5);
      }
    });
  }
}

test("Notes keeps the planned private source and truthful approved-line receipt", async ({
  page,
}) => {
  await page.goto(labUrl({ option: "a", product: "notes", progress: 1 }));
  const preview = page.getByTestId("handoff-preview");
  await expect(preview).toContainText(
    "Venue can open the side room after six",
  );
  await expect(preview).toContainText("Ask the venue to hold the side room");
  await expect(preview).toContainText("Approved meaning retained");
  await expect(preview).not.toContainText("Exact wording retained");
});

test("Editorial Cause contains its longest state word on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(
    labUrl({
      option: "c",
      product: "notes",
      progress: 0,
      viewport: "mobile",
    }),
  );
  const contained = await page.getByText("Approved", { exact: true }).evaluate(
    (element) => {
      const word = element.getBoundingClientRect();
      const scene = element.closest("[data-handoff-scene]")?.getBoundingClientRect();
      return Boolean(
        scene &&
          word.left >= scene.left - 1 &&
          word.right <= scene.right + 1,
      );
    },
  );
  expect(contained).toBe(true);
});

for (const option of OPTIONS) {
  for (const product of PRODUCTS) {
    test(`${option}/${product} reduced-motion frame has no serious accessibility violations`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
      await page.goto(
        labUrl({
          option,
          product,
          progress: 0,
          motion: "reduce",
          viewport: "mobile",
        }),
      );

      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(result.violations).toEqual([]);
    });
  }
}
