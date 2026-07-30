import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const PRODUCTS = ["notes", "tasks", "timeline", "signal"] as const;

function preview(page: Page, product: (typeof PRODUCTS)[number]) {
  return page.locator(`[data-relay-motion][data-product="${product}"]`);
}

test("the homepage starts each real product motion in its reading zone", async ({
  page,
}) => {
  const browserErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/");

  const previews = page.locator("[data-relay-motion]");
  await expect(previews).toHaveCount(4);
  await expect(preview(page, "notes")).toHaveAttribute(
    "data-motion-state",
    "static",
  );

  const notes = preview(page, "notes");
  await notes.evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await expect(notes).toHaveAttribute("data-motion-state", "playing");
  await expect(notes.locator(".bil-incoming-one")).toHaveCSS(
    "animation-name",
    /bil-note-type/,
  );

  const tasks = preview(page, "tasks");
  await tasks.evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await expect(tasks).toHaveAttribute("data-motion-state", "playing");
  await expect(tasks.locator("[data-cinematic-demo-playback]")).toHaveAttribute(
    "data-cinematic-demo-playback",
    "playing",
  );

  const timeline = preview(page, "timeline");
  await timeline.evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await expect(timeline).toHaveAttribute("data-motion-state", "playing");
  await expect(timeline.locator(".tlh")).toHaveAttribute("data-opened", "true");

  const signal = preview(page, "signal");
  await signal.evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await expect(signal).toHaveAttribute("data-motion-state", "playing");
  await expect(signal.locator(".rd-headline")).toHaveCSS(
    "animation-name",
    /rd-rise/,
  );

  await expect(tasks).toHaveAttribute("data-motion-state", "paused");
  await expect(tasks.locator("[data-cinematic-demo-playback]")).toHaveAttribute(
    "data-cinematic-demo-playback",
    "paused",
  );
  const pausedTasksSnapshot = await tasks
    .locator("[data-cinematic-demo-snapshot]")
    .getAttribute("data-cinematic-demo-snapshot");
  await page.waitForTimeout(1800);
  await expect(
    tasks.locator("[data-cinematic-demo-snapshot]"),
  ).toHaveAttribute("data-cinematic-demo-snapshot", pausedTasksSnapshot ?? "");
  await expect(
    timeline.locator('[class*="baseRail"]').first(),
  ).toHaveCSS("animation-play-state", "paused");
  expect(browserErrors).toEqual([]);
});

test("reduced motion keeps all four product proofs settled and contained", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.goto("/");

  for (const product of PRODUCTS) {
    const frame = preview(page, product);
    await frame.evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
    await expect(frame).toHaveAttribute("data-motion-state", "static");
    await expect(frame).toBeVisible();
  }

  await expect(
    preview(page, "tasks").locator(".tasks-compact-proof"),
  ).toBeVisible();
  await expect(preview(page, "notes").getByText("In Tasks")).toBeVisible();
  await expect(
    preview(page, "timeline").locator("[data-today-marker]"),
  ).toBeVisible();
  await expect(
    preview(page, "signal").getByText("The rest is clear"),
  ).toBeVisible();

  const metrics = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(metrics.scroll).toBeLessThanOrEqual(metrics.viewport);
});

test("the proof thread is keyboard legible and resolves into one receipt", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.addStyleTag({
    content: "html { scrollbar-gutter: stable; }",
  });

  const map = page.getByRole("navigation", {
    name: "Product proof chapters",
  });
  await expect(map).toBeVisible();

  const relayBox = await page.locator(".reveal-relay").boundingBox();
  const notesHeadingBox = await page.locator("#relay-notes-title").boundingBox();
  const notesPreviewBox = await preview(page, "notes").boundingBox();
  const railBox = await map.boundingBox();
  const threadLine = page.locator("[data-proof-thread-line]");
  const lineBox = await threadLine.boundingBox();
  expect(relayBox).not.toBeNull();
  expect(notesHeadingBox).not.toBeNull();
  expect(notesPreviewBox).not.toBeNull();
  expect(railBox).not.toBeNull();
  expect(lineBox).not.toBeNull();
  const trueClientMarginMidpoint = (relayBox?.x ?? 0) / 2;
  expect(
    Math.abs((lineBox?.x ?? 0) - trueClientMarginMidpoint),
  ).toBeLessThanOrEqual(7);
  expect(lineBox?.height ?? 0).toBeGreaterThanOrEqual(300);
  expect(
    Math.abs((notesHeadingBox?.x ?? 0) - (relayBox?.x ?? 0)),
  ).toBeLessThanOrEqual(1);
  expect((notesHeadingBox?.x ?? 0) - ((railBox?.x ?? 0) + (railBox?.width ?? 0)))
    .toBeGreaterThanOrEqual(14);
  expect(railBox?.width ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(76);
  expect(notesPreviewBox?.width ?? 0).toBeGreaterThanOrEqual(816);
  expect(notesPreviewBox?.width ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(
    818,
  );
  for (const product of ["Notes", "Tasks", "Timeline", "Signal"]) {
    const labelBox = await map.getByText(product, { exact: true }).boundingBox();
    expect(labelBox).not.toBeNull();
    expect(labelBox?.x ?? -1).toBeGreaterThanOrEqual(0);
    expect((labelBox?.x ?? 0) + (labelBox?.width ?? 0)).toBeLessThanOrEqual(
      (lineBox?.x ?? 0) - 6,
    );
  }
  const desktopWidth = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(desktopWidth.scroll).toBeLessThanOrEqual(desktopWidth.viewport);

  const washBefore = await threadLine.evaluate((element) => {
    const style = window.getComputedStyle(element, "::after");
    return {
      opacity: style.opacity,
      playState: style.animationPlayState,
    };
  });
  expect(washBefore.opacity).toBe("0");
  expect(washBefore.playState).toBe("paused");

  for (const product of PRODUCTS) {
    await expect(page.locator(`#relay-${product}`)).toHaveCount(1);
    await expect(
      map.getByRole("link", {
        name: new RegExp(product, "i"),
      }),
    ).toHaveAttribute("href", `#relay-${product}`);
  }

  const skip = page.getByRole("link", { name: "Skip product proofs" });
  await skip.focus();
  await expect(skip).toBeFocused();
  await expect(skip).toHaveCSS("opacity", "1");

  const notesChapter = page.locator("#relay-notes");
  await notesChapter.evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await expect(page.locator("[data-active-proof='notes']")).toHaveCount(1);
  const currentBox = await map.getByText("Current", { exact: true }).boundingBox();
  const activeLink = map.getByRole("link", { name: /Notes Current/i });
  const activeLinkBox = await activeLink.boundingBox();
  expect(currentBox).not.toBeNull();
  expect(activeLinkBox).not.toBeNull();
  expect(currentBox?.x ?? -1).toBeGreaterThanOrEqual(0);
  expect((currentBox?.x ?? 0) + (currentBox?.width ?? 0)).toBeLessThanOrEqual(
    (lineBox?.x ?? 0) - 6,
  );
  expect(activeLinkBox?.x ?? -1).toBeGreaterThanOrEqual(0);
  expect(
    (activeLinkBox?.x ?? 0) + (activeLinkBox?.width ?? 0),
  ).toBeLessThanOrEqual((relayBox?.x ?? 0) - 4);
  const washStart = await threadLine.evaluate((element) => {
    const style = window.getComputedStyle(element, "::after");
    return {
      animationName: style.animationName,
      duration: style.animationDuration,
      playState: style.animationPlayState,
      timing: style.animationTimingFunction,
      transform: style.transform,
    };
  });
  expect(washStart.animationName).toMatch(/proof-thread-flow$/);
  expect(washStart.duration).toBe("3.6s");
  expect(washStart.playState).toBe("running");
  expect(washStart.timing).toBe("linear");
  await page.waitForTimeout(220);
  const washTransformAfter = await threadLine.evaluate(
    (element) => window.getComputedStyle(element, "::after").transform,
  );
  expect(washTransformAfter).not.toBe(washStart.transform);

  const figures = page.locator(".reveal-relay-preview");
  await expect(figures).toHaveCount(4);
  await expect(figures.locator("[inert][aria-hidden='true']")).toHaveCount(4);

  const receipt = page.locator("#relay-receipt");
  await receipt.evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  // The first visit materialises content-visibility frames above the receipt.
  // Re-centre after that reserved geometry settles, matching a real walk down
  // the page rather than a single programmatic jump from the hero.
  await page.waitForTimeout(180);
  await receipt.evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await expect(receipt.getByText("One detail, accounted for.")).toBeVisible();
  await expect(
    receipt.getByText(
      "The source stayed private. Every handoff kept its owner and receipt.",
    ),
  ).toBeVisible();
  await expect(
    page.locator("[data-receipt-arrived='true']"),
  ).toHaveCount(1);
  await expect
    .poll(
      async () => {
        await receipt.evaluate((element) =>
          element.scrollIntoView({ block: "center", behavior: "instant" }),
        );
        return page.locator("[data-active-proof='receipt']").count();
      },
      { timeout: 6_000 },
    )
    .toBe(1);
  await expect(map.locator("ol")).toHaveCSS("visibility", "hidden");
  const washAtReceipt = await threadLine.evaluate((element) => {
    const style = window.getComputedStyle(element, "::after");
    return {
      opacity: style.opacity,
      playState: style.animationPlayState,
    };
  });
  expect(washAtReceipt.opacity).toBe("0");
  expect(washAtReceipt.playState).toBe("paused");

  const tasksChapter = page.locator("#relay-tasks");
  await tasksChapter.evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await expect(map.locator("ol")).toHaveCSS("visibility", "visible");

  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.reload();
  const reducedWash = await threadLine.evaluate((element) => {
    const style = window.getComputedStyle(element, "::after");
    return {
      animationName: style.animationName,
      opacity: style.opacity,
    };
  });
  expect(reducedWash.animationName).toBe("none");
  expect(reducedWash.opacity).toBe("0");
});

test("the wide gutter rail tracks half the outer margin at 1600", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto("/");
  await page.addStyleTag({
    content: "html { scrollbar-gutter: stable; }",
  });

  const relayBox = await page.locator(".reveal-relay").boundingBox();
  const lineBox = await page
    .locator("[data-proof-thread-line]")
    .boundingBox();
  const notesHeadingBox = await page
    .locator("#relay-notes-title")
    .boundingBox();
  const notesPreviewBox = await preview(page, "notes").boundingBox();
  expect(relayBox).not.toBeNull();
  expect(lineBox).not.toBeNull();
  expect(notesHeadingBox).not.toBeNull();
  expect(notesPreviewBox).not.toBeNull();
  const trueClientMarginMidpoint = (relayBox?.x ?? 0) / 2;
  expect(
    Math.abs((lineBox?.x ?? 0) - trueClientMarginMidpoint),
  ).toBeLessThanOrEqual(7);
  expect(
    Math.abs((notesHeadingBox?.x ?? 0) - (relayBox?.x ?? 0)),
  ).toBeLessThanOrEqual(1);
  expect(notesPreviewBox?.width ?? 0).toBeGreaterThanOrEqual(816);
  expect(notesPreviewBox?.width ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(
    818,
  );

  const map = page.getByRole("navigation", {
    name: "Product proof chapters",
  });
  for (const product of ["Notes", "Tasks", "Timeline", "Signal"]) {
    const labelBox = await map.getByText(product, { exact: true }).boundingBox();
    expect(labelBox).not.toBeNull();
    expect(labelBox?.x ?? -1).toBeGreaterThanOrEqual(0);
    expect((labelBox?.x ?? 0) + (labelBox?.width ?? 0)).toBeLessThanOrEqual(
      (lineBox?.x ?? 0) - 6,
    );
  }

  await page.locator("#relay-notes").evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await expect(page.locator("[data-active-proof='notes']")).toHaveCount(1);
  const currentBox = await map.getByText("Current", { exact: true }).boundingBox();
  const activeLink = map.getByRole("link", { name: /Notes Current/i });
  const activeLinkBox = await activeLink.boundingBox();
  expect(currentBox).not.toBeNull();
  expect(activeLinkBox).not.toBeNull();
  expect(currentBox?.x ?? -1).toBeGreaterThanOrEqual(0);
  expect((currentBox?.x ?? 0) + (currentBox?.width ?? 0)).toBeLessThanOrEqual(
    (lineBox?.x ?? 0) - 6,
  );
  expect(activeLinkBox?.x ?? -1).toBeGreaterThanOrEqual(0);
  expect(
    (activeLinkBox?.x ?? 0) + (activeLinkBox?.width ?? 0),
  ).toBeLessThanOrEqual((relayBox?.x ?? 0) - 4);
  await activeLink.focus();
  await expect(activeLink).toBeFocused();
  await expect(activeLink).toHaveCSS("outline-style", "solid");

  const metrics = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(metrics.scroll).toBeLessThanOrEqual(metrics.viewport);
});

test("the compact desktop index stays above the full-width story", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const relay = page.locator(".reveal-relay");
  const map = page.getByRole("navigation", {
    name: "Product proof chapters",
  });
  const notesChapter = page.locator("#relay-notes");
  const notesHeading = page.locator("#relay-notes-title");
  const notesPreview = preview(page, "notes");
  const relayBox = await relay.boundingBox();
  const mapBox = await map.boundingBox();
  const notesBox = await notesChapter.boundingBox();
  const headingBox = await notesHeading.boundingBox();
  const previewBox = await notesPreview.boundingBox();

  expect(relayBox).not.toBeNull();
  expect(mapBox).not.toBeNull();
  expect(notesBox).not.toBeNull();
  expect(headingBox).not.toBeNull();
  expect(previewBox).not.toBeNull();
  expect(Math.abs((notesBox?.x ?? 0) - (relayBox?.x ?? 0))).toBeLessThanOrEqual(
    1,
  );
  expect((mapBox?.y ?? 0) + (mapBox?.height ?? 0)).toBeLessThanOrEqual(
    (notesBox?.y ?? 0) + 1,
  );
  expect((previewBox?.x ?? 0) - (headingBox?.x ?? 0)).toBeGreaterThan(300);
  expect(previewBox?.width ?? 0).toBeGreaterThanOrEqual(819);
  expect(previewBox?.width ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(
    821,
  );
  await expect(page.locator("[data-proof-thread-line]")).toHaveCSS(
    "display",
    "none",
  );

  const metrics = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(metrics.scroll).toBeLessThanOrEqual(metrics.viewport);
});

test("the 1024 composition stacks Notes before the proof can squeeze", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("/");

  const relayBox = await page.locator(".reveal-relay").boundingBox();
  const notesBox = await page.locator("#relay-notes").boundingBox();
  const headingBox = await page.locator("#relay-notes-title").boundingBox();
  const previewBox = await preview(page, "notes").boundingBox();

  expect(relayBox).not.toBeNull();
  expect(notesBox).not.toBeNull();
  expect(headingBox).not.toBeNull();
  expect(previewBox).not.toBeNull();
  expect(Math.abs((notesBox?.x ?? 0) - (relayBox?.x ?? 0))).toBeLessThanOrEqual(
    1,
  );
  expect(
    Math.abs((headingBox?.x ?? 0) - (relayBox?.x ?? 0)),
  ).toBeLessThanOrEqual(1);
  expect(
    Math.abs((previewBox?.x ?? 0) - (relayBox?.x ?? 0)),
  ).toBeLessThanOrEqual(1);
  expect(previewBox?.width ?? 0).toBeGreaterThanOrEqual(800);

  const metrics = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(metrics.scroll).toBeLessThanOrEqual(metrics.viewport);
});

test("the embedded Notes capture reserves a clear two-line hint gap", async ({
  page,
}) => {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const notes = preview(page, "notes");
    await notes.evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );

    const incoming = notes.locator(".bil-incoming-two");
    await expect(notes).toHaveAttribute("data-motion-started", "true");
    await expect(incoming).not.toHaveCSS("display", "none");

    const incomingBox = await incoming.boundingBox();
    const hintBox = await notes.locator(".bil-capture-hint").boundingBox();
    expect(incomingBox).not.toBeNull();
    expect(hintBox).not.toBeNull();
    const verticalGap =
      (hintBox?.y ?? 0) -
      ((incomingBox?.y ?? 0) + (incomingBox?.height ?? 0));
    expect(verticalGap).toBeGreaterThanOrEqual(10);
  }
});

test("the phone layout uses the compact Tasks receipt without a hidden live canvas", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const tasks = preview(page, "tasks");
  await tasks.evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" }),
  );

  await expect(tasks.locator(".tasks-compact-proof")).toBeVisible();
  await expect(tasks.getByText("Commitment completed")).toBeVisible();
  await expect(tasks.locator(".tasks-full-proof")).toHaveCount(0);
  await expect(tasks.locator("[data-cinematic-demo-playback]")).toHaveCount(0);

  const metrics = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(metrics.scroll).toBeLessThanOrEqual(metrics.viewport);
});

test("the four homepage product proofs have no serious accessibility violations", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.goto("/");

  const result = await new AxeBuilder({ page })
    .include(".reveal-relay")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    result.violations.filter(
      (violation) =>
        violation.impact === "serious" || violation.impact === "critical",
    ),
  ).toEqual([]);
});
