# Founder review — <TASK_ID>

> One page. If it takes longer than two minutes to read, it is not ready.
> Generated shape also printed by `project-control.mjs review <TASK_ID>`.

**Task:** <TASK_ID> — <exact title>
**Executor:** <lane>
**Prepared:** <YYYY-MM-DD>
**Release-blocking:** <yes/no> · **Critical path:** <yes/no>

---

## What was asked for

One sentence, from the task objective.

## What was delivered

Two or three sentences. Plain English, no method narration.

## See it

Direct links or paths to the thing itself — the page, the document, the render,
the PR.

## Acceptance criteria

| # | Criterion | Met | Evidence |
|---|---|---|---|
| 1 | | ✅ / ❌ | |

## Verification performed

What was actually run and what it returned. Never "should work". If something
failed, it is listed here, not omitted.

## What is not covered

Known gaps, deferred edges, anything a reasonable person would assume is
included but is not.

## Risks or decisions this raises

Cross-reference `RAID.md` and `DECISIONS.md` IDs.

## Your decision

- **Approve:**

  ```bash
  node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs approve <TASK_ID> "note"
  ```

- **Reject:**

  ```bash
  node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs reject <TASK_ID> "what is wrong"
  ```

Approval moves the task to Done and regenerates every report. Nothing else can.
