import type { Page, TestInfo } from "@playwright/test";

export type UxScoreDimension =
  | "clarity"
  | "calm"
  | "next_step"
  | "nontechnical"
  | "brand_restraint"
  | "suite_continuity"
  | "ai_regression_safety"
  | "commercial_confidence";

export type UxScore = {
  dimension: UxScoreDimension;
  label: string;
  score: number;
  note: string;
};

const DIMENSION_LABELS: Record<UxScoreDimension, string> = {
  clarity: "Clarity",
  calm: "Calm coordination",
  next_step: "Obvious next step",
  nontechnical: "Non-technical friendliness",
  brand_restraint: "Elegant restraint",
  suite_continuity: "Suite continuity",
  ai_regression_safety: "AI regression safety",
  commercial_confidence: "Commercial confidence",
};

const JARGON_TERMS = [
  "api",
  "auth",
  "backend",
  "cache",
  "cron",
  "database",
  "debug",
  "endpoint",
  "epic",
  "hydrate",
  "json",
  "middleware",
  "mutation",
  "payload",
  "schema",
  "sprint",
  "sync",
  "token",
  "trigger",
  "webhook",
];

type ScorecardOptions = {
  expectSuiteContinuity?: boolean;
  journey?: string;
};

export async function auditUxScorecard(
  page: Page,
  testInfo: TestInfo,
  options: ScorecardOptions = {},
) {
  const snapshot = await page.evaluate((jargonTerms) => {
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

    const clean = (value: string | null | undefined) =>
      (value ?? "").replace(/\s+/g, " ").trim();

    const bodyText = clean(document.body?.innerText ?? "");
    const visibleControls = [
      ...document.querySelectorAll("a, button, input, textarea, select"),
    ].filter(visible);
    const namedControls = visibleControls
      .map((control) => {
        const element = control as HTMLElement;
        return clean(
          element.getAttribute("aria-label") ||
            element.getAttribute("placeholder") ||
            element.getAttribute("title") ||
            element.textContent,
        );
      })
      .filter(Boolean);
    const headings = [...document.querySelectorAll("h1,h2,h3")]
      .filter(visible)
      .map((heading) => clean(heading.textContent))
      .filter(Boolean);
    const words = bodyText.split(/\s+/).filter(Boolean);
    const lowerText = bodyText.toLowerCase();
    const jargonHits = jargonTerms.filter((term) =>
      new RegExp(`\\b${term}\\b`, "i").test(lowerText),
    );
    const productMentions = ["notes", "tasks", "timeline", "signal"].filter((term) =>
      new RegExp(`\\b${term}\\b`, "i").test(lowerText),
    );
    const primaryActionPattern =
      /\b(add|ask|capture|check|close|confirm|continue|create|open|plan|review|save|search|send|shape|start|useful|why)\b/i;
    const primaryActions = namedControls.filter((name) =>
      primaryActionPattern.test(name),
    );
    const shoutyLabels = namedControls.filter(
      (name) => name.length > 4 && name === name.toUpperCase(),
    );

    return {
      bodyWords: words.length,
      controlCount: visibleControls.length,
      headingCount: headings.length,
      headings,
      namedControlCount: namedControls.length,
      primaryActionCount: primaryActions.length,
      productMentions,
      jargonHits,
      shoutyLabelCount: shoutyLabels.length,
    };
  }, JARGON_TERMS);

  const consoleErrors = annotationsOf(testInfo, "ux-console-error").length;
  const brokenControls =
    annotationsOf(testInfo, "ux-broken-route").length +
    annotationsOf(testInfo, "ux-broken-interactive").length;

  addUxScore(
    testInfo,
    "clarity",
    scoreClarity(snapshot),
    snapshot.headingCount > 0
      ? `${snapshot.headingCount} visible headings and ${snapshot.namedControlCount} named controls give the screen structure.`
      : "No visible heading was detected; orientation may rely too much on layout.",
  );

  addUxScore(
    testInfo,
    "calm",
    scoreCalm(snapshot),
    snapshot.bodyWords > 1_200 || snapshot.controlCount > 70
      ? `The screen is information-heavy: ${snapshot.bodyWords} words and ${snapshot.controlCount} visible controls.`
      : `The screen stays reasonably contained with ${snapshot.bodyWords} words and ${snapshot.controlCount} visible controls.`,
  );

  addUxScore(
    testInfo,
    "next_step",
    scoreNextStep(snapshot),
    snapshot.primaryActionCount > 0
      ? `${snapshot.primaryActionCount} visible controls use action-oriented language.`
      : "No obvious action-language control was detected on the current screen.",
  );

  addUxScore(
    testInfo,
    "nontechnical",
    scoreNontechnical(snapshot),
    snapshot.jargonHits.length > 0
      ? `Potential jargon visible: ${snapshot.jargonHits.join(", ")}.`
      : "No common technical jargon terms were visible.",
  );

  addUxScore(
    testInfo,
    "brand_restraint",
    scoreBrandRestraint(snapshot),
    snapshot.shoutyLabelCount > 0
      ? `${snapshot.shoutyLabelCount} all-caps labels may add visual noise.`
      : "Controls avoid shouty labels and the page avoids obvious overload signals.",
  );

  addUxScore(
    testInfo,
    "suite_continuity",
    scoreSuiteContinuity(snapshot, options.expectSuiteContinuity),
    snapshot.productMentions.length > 1
      ? `Visible product language connects ${snapshot.productMentions.join(", ")}.`
      : "The current screen shows limited cross-product language; verify continuity through journey steps and screenshots.",
  );

  addUxScore(
    testInfo,
    "ai_regression_safety",
    scoreAiSafety(consoleErrors, brokenControls),
    consoleErrors || brokenControls
      ? `${consoleErrors} console errors and ${brokenControls} route/control issues were recorded.`
      : "No browser console errors or broken route/control annotations were recorded before scoring.",
  );

  addUxScore(
    testInfo,
    "commercial_confidence",
    scoreCommercialConfidence(snapshot, consoleErrors, brokenControls),
    snapshot.primaryActionCount > 0 && consoleErrors === 0 && brokenControls === 0
      ? "The screen has actionable controls and no recorded technical breakage."
      : "Commercial confidence is limited by weak action affordance or recorded breakage.",
  );

  if (options.journey) {
    testInfo.annotations.push({
      type: "ux-score-context",
      description: options.journey,
    });
  }
}

export function addUxScore(
  testInfo: TestInfo,
  dimension: UxScoreDimension,
  score: number,
  note: string,
) {
  const rounded = Math.round(clamp(score, 0, 10) * 10) / 10;
  const payload: UxScore = {
    dimension,
    label: DIMENSION_LABELS[dimension],
    score: rounded,
    note,
  };
  testInfo.annotations.push({
    type: "ux-score",
    description: JSON.stringify(payload),
  });

  if (rounded < 6) {
    testInfo.annotations.push({
      type: "ux-friction",
      description: `${payload.label} scored ${rounded}/10. ${note}`,
    });
  }
}

function scoreClarity(snapshot: Awaited<ReturnType<typeof pageSnapshotShape>>) {
  let score = 6;
  if (snapshot.headingCount > 0) score += 1.5;
  if (snapshot.namedControlCount >= Math.min(snapshot.controlCount, 3)) score += 1;
  if (snapshot.controlCount > 80) score -= 1.5;
  if (snapshot.bodyWords > 1_600) score -= 1;
  return score;
}

function scoreCalm(snapshot: Awaited<ReturnType<typeof pageSnapshotShape>>) {
  let score = 9;
  if (snapshot.controlCount > 45) score -= 1;
  if (snapshot.controlCount > 75) score -= 1.5;
  if (snapshot.bodyWords > 1_200) score -= 1;
  if (snapshot.bodyWords > 2_000) score -= 1;
  return score;
}

function scoreNextStep(snapshot: Awaited<ReturnType<typeof pageSnapshotShape>>) {
  if (snapshot.primaryActionCount >= 3) return 9;
  if (snapshot.primaryActionCount >= 1) return 8;
  if (snapshot.namedControlCount > 0) return 6;
  return 4;
}

function scoreNontechnical(snapshot: Awaited<ReturnType<typeof pageSnapshotShape>>) {
  return 9 - Math.min(snapshot.jargonHits.length, 5);
}

function scoreBrandRestraint(snapshot: Awaited<ReturnType<typeof pageSnapshotShape>>) {
  let score = 8.5;
  if (snapshot.shoutyLabelCount > 0) score -= 1;
  if (snapshot.controlCount > 85) score -= 1.5;
  if (snapshot.bodyWords > 2_000) score -= 1;
  return score;
}

function scoreSuiteContinuity(
  snapshot: Awaited<ReturnType<typeof pageSnapshotShape>>,
  expectSuiteContinuity = false,
) {
  if (snapshot.productMentions.length >= 3) return 9;
  if (snapshot.productMentions.length >= 2) return 8;
  return expectSuiteContinuity ? 5 : 6.5;
}

function scoreAiSafety(consoleErrors: number, brokenControls: number) {
  return 10 - consoleErrors * 2.5 - brokenControls * 2;
}

function scoreCommercialConfidence(
  snapshot: Awaited<ReturnType<typeof pageSnapshotShape>>,
  consoleErrors: number,
  brokenControls: number,
) {
  let score = 8;
  if (snapshot.primaryActionCount > 0) score += 1;
  if (consoleErrors > 0) score -= 2.5;
  if (brokenControls > 0) score -= 2;
  if (snapshot.jargonHits.length > 3) score -= 1;
  return score;
}

function annotationsOf(testInfo: TestInfo, type: string) {
  return testInfo.annotations.filter((annotation) => annotation.type === type);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function pageSnapshotShape() {
  return {
    bodyWords: 0,
    controlCount: 0,
    headingCount: 0,
    headings: [] as string[],
    namedControlCount: 0,
    primaryActionCount: 0,
    productMentions: [] as string[],
    jargonHits: [] as string[],
    shoutyLabelCount: 0,
  };
}
