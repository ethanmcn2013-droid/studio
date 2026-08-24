/**
 * Versioned public presentation of the authenticated review fixture.
 *
 * IDs, names, dates, counts and the one featured journey mirror
 * app/src/lib/review-suite-fixture.ts and app/src/server/demo/tasks-demo.ts.
 * Marketing components import this registry instead of restating those facts.
 * The cross-repo release check compares this versioned object before deploy.
 */
export const REVIEW_SUITE_PRESENTATION = Object.freeze({
  version: 3,
  workspace: Object.freeze({
    id: "demo-ws",
    name: "The Orchard, events",
  }),
  project: Object.freeze({
    id: "demo-project-mara-finn",
    slug: "mara-finn",
    name: "Mara & Finn",
  }),
  reviewToday: "2026-07-16",
  lastUpdatedAt: "2026-07-15T18:30:00.000Z",
  taskCounts: Object.freeze({
    total: 13,
    queued: 3,
    inProgress: 3,
    review: 2,
    waiting: 0,
    done: 5,
  }),
  journey: Object.freeze({
    note: "The menu tasting is booked for 1 August. Confirm the final dietary list before service notes are locked.",
    task: "Menu tasting at The Orchard",
    taskState: "In progress",
    taskPriority: "High",
    milestoneDate: "2026-08-01",
    openRisk: "The final dietary list still needs confirmation.",
  }),
});
