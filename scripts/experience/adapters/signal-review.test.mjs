import assert from "node:assert/strict";
import test from "node:test";
import { adaptSignalReview } from "./signal-review.mjs";

const registry = {
  experiences: [
    {
      id: "tasks.page.app-board",
      product: "tasks",
      surfaceType: "page",
      route: "/app/board",
      trigger: null,
      source: "tasks/src/app/app/board/page.tsx",
      designOwner: "design",
      engineeringOwner: "engineering",
    },
  ],
};

function record(schemaVersion) {
  return {
    schemaVersion,
    session: {
      id: "mobile-board",
      createdAt: "2026-07-15T12:00:00.000Z",
      issues: [
        {
          id: "issue-1",
          number: 1,
          createdAt: "2026-07-15T12:01:00.000Z",
          pageUrl: "https://tasks-preview.vercel.app/app/board",
          routeGroup: "/app/board",
          pageTitle: "Board",
          product: "tasks",
          state: "empty",
          breakpoint: schemaVersion.endsWith("/2") ? "mobile" : undefined,
          viewport: { w: 390, h: 844, dpr: 3 },
          priority: "P1",
          type: "a11y",
          comment: "The dialog cannot be reached by keyboard.",
          target: { selector: "[role=dialog]", domPath: "main > div", computed: { display: "block" } },
          ...(schemaVersion.endsWith("/2")
            ? {
                evidence: {
                  selector: "[role=dialog]",
                  domPath: "main > div",
                  componentGuess: "TaskDialog",
                  accessibleName: null,
                  box: null,
                  computedStyles: { display: "block" },
                  annotations: { comment: "The dialog cannot be reached by keyboard." },
                  screenshot: { ref: "screens/issue-01.png", capturedAt: "2026-07-15T12:01:00.000Z" },
                },
              }
            : {}),
        },
      ],
    },
  };
}

for (const version of ["signal-review/1", "signal-review/2"]) {
  test(`adapts ${version} into canonical findings and reviews`, () => {
    const adapted = adaptSignalReview(record(version), registry);
    assert.equal(adapted.findings[0].experienceId, "tasks.page.app-board");
    assert.equal(adapted.findings[0].severity, "release-blocking");
    assert.equal(adapted.findings[0].dimension, "accessibility");
    assert.equal(adapted.reviews[0].schemaVersion, "signal-review/2");
    assert.equal(adapted.reviews[0].breakpoint, "mobile");
  });
}

test("rejects an issue that cannot resolve to the Experience Registry", () => {
  const invalid = record("signal-review/2");
  invalid.session.issues[0].product = "unknown";
  invalid.session.issues[0].routeGroup = "/missing";
  assert.throws(() => adaptSignalReview(invalid, registry), /Cannot resolve/);
});
