import { expect, type Page, type TestInfo } from "@playwright/test";
import type { UxScore } from "./scorecard";

type CraftAuditOptions = {
  allowHorizontalOverflow?: boolean;
};

type QualityGateOptions = {
  minimumAverageScore?: number;
  minimumDimensionScore?: number;
};

const DEFAULT_MINIMUM_AVERAGE_SCORE = 7.5;
const DEFAULT_MINIMUM_DIMENSION_SCORE = 6;

export async function auditPageCraft(
  page: Page,
  testInfo: TestInfo,
  options: CraftAuditOptions = {},
) {
  const audit = await page.evaluate(() => {
    const clean = (value: string | null | undefined) =>
      (value ?? "").replace(/\s+/g, " ").trim();

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

    const nameOf = (el: Element) => {
      const node = el as HTMLElement;
      const id = node.getAttribute("id");
      const labelledBy = node.getAttribute("aria-labelledby");
      const labelFromId = id
        ? clean(document.querySelector(`label[for="${CSS.escape(id)}"]`)?.textContent)
        : "";
      const labelFromLabelledBy = labelledBy
        ? labelledBy
            .split(/\s+/)
            .map((labelId) =>
              clean(document.getElementById(labelId)?.textContent ?? ""),
            )
            .filter(Boolean)
            .join(" ")
        : "";

      return clean(
        node.getAttribute("aria-label") ||
          labelFromLabelledBy ||
          labelFromId ||
          node.getAttribute("placeholder") ||
          node.getAttribute("title") ||
          node.textContent,
      );
    };

    const viewportWidth = window.innerWidth;
    const scrollWidth = Math.max(
      document.documentElement.scrollWidth,
      document.body?.scrollWidth ?? 0,
    );
    const horizontalOverflow = Math.max(0, scrollWidth - viewportWidth);

    const ids = new Map<string, number>();
    document.querySelectorAll("[id]").forEach((el) => {
      const id = el.id;
      ids.set(id, (ids.get(id) ?? 0) + 1);
    });
    const duplicateIds = [...ids.entries()]
      .filter(([, count]) => count > 1)
      .map(([id, count]) => `${id} (${count} times)`)
      .slice(0, 12);

    const unlabeledFields = [
      ...document.querySelectorAll("input, textarea, select"),
    ]
      .filter(visible)
      .filter((field) => {
        const input = field as HTMLInputElement;
        return !["hidden", "submit", "button", "reset"].includes(input.type);
      })
      .filter((field) => !nameOf(field))
      .map((field) => {
        const input = field as HTMLInputElement;
        return `${field.tagName.toLowerCase()}${input.type ? `[type=${input.type}]` : ""}`;
      })
      .slice(0, 12);

    const suspiciousLinks = [...document.querySelectorAll("a")]
      .filter(visible)
      .map((anchor) => ({
        href: anchor.getAttribute("href") ?? "",
        text: nameOf(anchor),
      }))
      .filter(
        (anchor) =>
          anchor.href === "#" ||
          anchor.href.toLowerCase().startsWith("javascript:") ||
          anchor.href.trim() === "",
      )
      .map((anchor) => `${anchor.text || "Unnamed link"} -> ${anchor.href || "missing href"}`)
      .slice(0, 12);

    const clippedControls = [
      ...document.querySelectorAll("button, a, input, textarea, select"),
    ]
      .filter(visible)
      .filter((el) => {
        const node = el as HTMLElement;
        const style = window.getComputedStyle(node);
        const clipsOverflow = [style.overflowX, style.overflowY, style.overflow].some(
          (value) => value === "hidden" || value === "clip",
        );
        if (!clipsOverflow) return false;
        return (
          node.scrollWidth > node.clientWidth + 2 ||
          node.scrollHeight > node.clientHeight + 2
        );
      })
      .map((el) => nameOf(el) || el.tagName.toLowerCase())
      .filter(Boolean)
      .slice(0, 12);

    const tinyTargets = [...document.querySelectorAll("button, a")]
      .filter(visible)
      .filter((el) => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        const name = nameOf(el);
        return name && rect.width < 28 && rect.height < 28;
      })
      .map((el) => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        return `${nameOf(el)} (${Math.round(rect.width)}x${Math.round(rect.height)})`;
      })
      .slice(0, 12);

    const navigation = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    const loadMs = navigation
      ? Math.round(navigation.loadEventEnd || navigation.domContentLoadedEventEnd)
      : null;
    const domContentLoadedMs = navigation
      ? Math.round(navigation.domContentLoadedEventEnd)
      : null;

    return {
      horizontalOverflow,
      duplicateIds,
      unlabeledFields,
      suspiciousLinks,
      clippedControls,
      tinyTargets,
      loadMs,
      domContentLoadedMs,
    };
  });

  if (audit.horizontalOverflow > 4 && !options.allowHorizontalOverflow) {
    testInfo.annotations.push({
      type: "ux-layout-blocker",
      description: `Document has ${audit.horizontalOverflow}px horizontal overflow.`,
    });
  } else if (audit.horizontalOverflow > 4) {
    testInfo.annotations.push({
      type: "ux-layout-note",
      description: `Document has ${audit.horizontalOverflow}px horizontal overflow; allowed for this journey.`,
    });
  }

  for (const duplicate of audit.duplicateIds) {
    testInfo.annotations.push({
      type: "ux-accessibility-blocker",
      description: `Duplicate id detected: ${duplicate}.`,
    });
  }

  for (const field of audit.unlabeledFields) {
    testInfo.annotations.push({
      type: "ux-accessibility-blocker",
      description: `Visible form field has no accessible name: ${field}.`,
    });
  }

  for (const link of audit.suspiciousLinks) {
    testInfo.annotations.push({
      type: "ux-craft-issue",
      description: `Suspicious visible link: ${link}.`,
    });
  }

  for (const control of audit.clippedControls) {
    testInfo.annotations.push({
      type: "ux-craft-issue",
      description: `Potentially clipped control text: ${control}.`,
    });
  }

  for (const target of audit.tinyTargets) {
    testInfo.annotations.push({
      type: "ux-craft-note",
      description: `Small pointer target: ${target}.`,
    });
  }

  if (audit.domContentLoadedMs !== null || audit.loadMs !== null) {
    testInfo.annotations.push({
      type: "ux-performance",
      description: `DOM ready ${audit.domContentLoadedMs ?? "n/a"}ms; load ${audit.loadMs ?? "n/a"}ms.`,
    });
  }
}

export function enforceUxQualityGate(
  testInfo: TestInfo,
  options: QualityGateOptions = {},
) {
  const minimumAverageScore =
    options.minimumAverageScore ?? DEFAULT_MINIMUM_AVERAGE_SCORE;
  const minimumDimensionScore =
    options.minimumDimensionScore ?? DEFAULT_MINIMUM_DIMENSION_SCORE;
  const scores = annotationsOf(testInfo, "ux-score")
    .map(parseScore)
    .filter((score): score is UxScore => Boolean(score));

  const failures: string[] = [];
  const average =
    scores.length > 0
      ? scores.reduce((total, score) => total + score.score, 0) / scores.length
      : null;

  if (scores.length === 0) {
    failures.push("No UX scorecard annotations were recorded.");
  }

  if (average !== null && average < minimumAverageScore) {
    failures.push(
      `Average UX score ${average.toFixed(1)} is below ${minimumAverageScore}.`,
    );
  }

  const weakDimensions = scores.filter((score) => score.score < minimumDimensionScore);
  for (const score of weakDimensions) {
    failures.push(
      `${score.label} scored ${score.score.toFixed(1)}, below ${minimumDimensionScore}.`,
    );
  }

  const hardAnnotationTypes = [
    "ux-console-error",
    "ux-broken-route",
    "ux-broken-interactive",
    "ux-layout-blocker",
    "ux-accessibility-blocker",
  ];
  for (const type of hardAnnotationTypes) {
    for (const annotation of annotationsOf(testInfo, type)) {
      failures.push(`${type}: ${annotation.description ?? "No detail"}`);
    }
  }

  if (failures.length === 0) {
    testInfo.annotations.push({
      type: "ux-gate-pass",
      description: `Quality gate passed: average score >= ${minimumAverageScore}, dimensions >= ${minimumDimensionScore}, no hard blockers.`,
    });
  } else {
    for (const failure of failures) {
      testInfo.annotations.push({ type: "ux-gate-fail", description: failure });
    }
  }

  expect(failures, "UX quality gate").toEqual([]);
}

function annotationsOf(testInfo: TestInfo, type: string) {
  return testInfo.annotations.filter((annotation) => annotation.type === type);
}

function parseScore(annotation: { description?: string }): UxScore | null {
  if (!annotation.description) return null;
  try {
    const parsed = JSON.parse(annotation.description) as Partial<UxScore>;
    if (
      typeof parsed.dimension !== "string" ||
      typeof parsed.label !== "string" ||
      typeof parsed.score !== "number" ||
      typeof parsed.note !== "string"
    ) {
      return null;
    }
    return parsed as UxScore;
  } catch {
    return null;
  }
}
