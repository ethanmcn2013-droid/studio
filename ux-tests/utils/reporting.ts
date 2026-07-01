import fs from "node:fs";
import path from "node:path";
import { expect, type Page, type TestInfo } from "@playwright/test";
import type { Persona } from "./personas";

export type CapturedConsoleIssue = {
  source: "console" | "pageerror";
  text: string;
};

const KNOWN_NON_ACTIONABLE_CONSOLE = [
  "The Content Security Policy directive 'upgrade-insecure-requests' is ignored when delivered in a report-only policy.",
];

const RUN_ID =
  process.env.UX_RUN_ID ?? new Date().toISOString().replace(/[:.]/g, "-");

export function annotatePersona(testInfo: TestInfo, persona: Persona) {
  testInfo.annotations.push({ type: "persona", description: persona.name });
  testInfo.annotations.push({ type: "persona-slug", description: persona.slug });
  testInfo.annotations.push({ type: "persona-goal", description: persona.goal });
}

export function annotateJourney(testInfo: TestInfo, journey: string) {
  testInfo.annotations.push({ type: "journey", description: journey });
}

export async function uxStep<T>(
  testInfo: TestInfo,
  label: string,
  body: () => Promise<T>,
): Promise<T> {
  try {
    const result = await body();
    testInfo.annotations.push({ type: "ux-step-pass", description: label });
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    testInfo.annotations.push({
      type: "ux-step-fail",
      description: `${label}: ${message}`,
    });
    throw error;
  }
}

export function installConsoleCapture(page: Page, testInfo: TestInfo) {
  const issues: CapturedConsoleIssue[] = [];

  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (isKnownNonActionableConsole(text)) {
      testInfo.annotations.push({
        type: "ux-console-known",
        description: text,
      });
      return;
    }
    issues.push({ source: "console", text });
    testInfo.annotations.push({
      type: "ux-console-error",
      description: text,
    });
  });

  page.on("pageerror", (error) => {
    const text = error.message;
    issues.push({ source: "pageerror", text });
    testInfo.annotations.push({
      type: "ux-console-error",
      description: text,
    });
  });

  return issues;
}

export async function expectNoConsoleErrors(
  issues: CapturedConsoleIssue[],
  testInfo: TestInfo,
) {
  if (issues.length > 0) {
    testInfo.annotations.push({
      type: "ux-severity",
      description: "high",
    });
  }
  expect(issues, "No browser console errors or page errors").toEqual([]);
}

export async function gotoAndReport(
  page: Page,
  testInfo: TestInfo,
  url: string,
  label: string,
) {
  const response = await page.goto(url, { waitUntil: "domcontentloaded" });
  const status = response?.status() ?? 0;
  if (!response || status >= 400) {
    testInfo.annotations.push({
      type: "ux-broken-route",
      description: `${label} returned ${status || "no response"}: ${url}`,
    });
  }
  expect(status, `${label} should return a usable route`).toBeGreaterThanOrEqual(200);
  expect(status, `${label} should not return an error route`).toBeLessThan(400);
  await expect(page.locator("body")).toBeVisible();
}

export async function takeStepScreenshot(
  page: Page,
  testInfo: TestInfo,
  slug: string,
) {
  await settlePageForScreenshot(page);
  const safeTitle = slugify(testInfo.title);
  const safeSlug = slugify(slug);
  const dir = path.join(process.cwd(), "ux-tests", "screenshots", RUN_ID);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${safeTitle}-${safeSlug}.png`);
  await page.screenshot({ path: file, fullPage: true });
  await testInfo.attach(`screenshot:${slug}`, {
    path: file,
    contentType: "image/png",
  });
  testInfo.annotations.push({
    type: "ux-screenshot",
    description: `../screenshots/${RUN_ID}/${path.basename(file)}`,
  });
}

export async function auditInteractiveBasics(page: Page, testInfo: TestInfo) {
  const issues = await page.evaluate(() => {
    const visible = (el: Element) => {
      const node = el as HTMLElement;
      const rect = node.getBoundingClientRect();
      const style = window.getComputedStyle(node);
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        Number(style.opacity) > 0.01 &&
        style.visibility !== "hidden" &&
        style.display !== "none" &&
        !isVisuallyHidden(node, style, rect)
      );
    };

    const isVisuallyHidden = (
      node: HTMLElement,
      style: CSSStyleDeclaration,
      rect: DOMRect,
    ) => {
      const clipped =
        style.clip !== "auto" ||
        (style.clipPath !== "none" && style.clipPath !== "");
      return (
        node.hidden ||
        node.getAttribute("aria-hidden") === "true" ||
        (rect.width <= 1 &&
          rect.height <= 1 &&
          style.position === "absolute" &&
          (clipped || style.overflow === "hidden"))
      );
    };

    const names: string[] = [];

    document.querySelectorAll("a").forEach((anchor) => {
      if (!visible(anchor)) return;
      if (!anchor.getAttribute("href")) {
        names.push(`Visible link has no href: "${anchor.textContent?.trim() ?? ""}"`);
      }
    });

    document.querySelectorAll("button").forEach((button) => {
      if (!visible(button)) return;
      const name =
        button.getAttribute("aria-label") ||
        button.getAttribute("title") ||
        button.textContent?.trim();
      if (!name) {
        names.push("Visible button has no accessible name.");
      }
    });

    return names;
  });

  for (const issue of issues) {
    testInfo.annotations.push({ type: "ux-broken-interactive", description: issue });
  }

  expect(issues, "Visible links/buttons should expose basic affordances").toEqual([]);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}

function isKnownNonActionableConsole(text: string) {
  if (process.env.UX_CONSOLE_STRICT === "1") return false;
  return KNOWN_NON_ACTIONABLE_CONSOLE.some((known) => text.includes(known));
}

async function settlePageForScreenshot(page: Page) {
  await page
    .evaluate(async () => {
      const animations = document
        .getAnimations()
        .filter((animation) => animation.playState !== "finished");
      if (animations.length === 0) return;
      await Promise.race([
        Promise.all(animations.map((animation) => animation.finished.catch(() => null))),
        new Promise((resolve) => window.setTimeout(resolve, 800)),
      ]);
    })
    .catch(() => null);
  await page.waitForTimeout(80);
}
