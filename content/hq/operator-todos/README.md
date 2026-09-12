# Operator source ledger

This folder retains the source records and rationale for founder/operator gates
captured before the delivery-tracker cutover. Authenticated HQ reads the files
through `getOperatorTodos()` and reports their recorded state as historical
context.

## The rule (codified 2026-06-23)

Keep each retained record and its status intact unless direct evidence supports
a correction. An `open` value describes the last state recorded in that source
file; it does not assert that the item remains a current priority or blocker.

Current delivery priority, assignee, workflow status, and next proof live in the
delivery tracker linked from authenticated HQ. New delivery actions go there.
This folder remains useful for source context; it is not the execution queue.

## File shape

```
---
id: <kebab-id>
title: <imperative one-liner>
status: open
priority: P0
effort: quick
blocking: true
phase: Phase 1
why: <one line — the cost of leaving it undone>
href: /hq/health
date: 2026-06-23
---

## Steps

1. ...
2. ...
```

- `status`: `open` or `done`. Preserve the recorded value unless direct evidence supports changing it; never infer completion from the cutover.
- `priority`: `P0` (launch blocker) / `P1` (before scale) / `P2` (nice-to-have).
- `effort`: `quick` (short decision/dashboard action) or `involved` (considered review, external process, or purchase). Required on every open item.
- `blocking`: `true` when engineering work is gated until this lands.
- `README.md` is ignored by the loader.
