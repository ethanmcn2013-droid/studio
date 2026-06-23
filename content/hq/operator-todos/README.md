# Operator to-do ledger

This folder is the standing list of every **founder/operator-gated** task
across Signal Studio. It renders on the HQ main page (`/hq`) via
`HqOperatorTodos` -> `getOperatorTodos()` -> `readHqSection("operator-todos")`.

## The rule (codified 2026-06-23)

When any cycle surfaces work that **only the founder/operator can do** —
provision an account, get an API key, set a production env var, publish a
legal doc, approve a cost limit, decide a policy — it does **not** live in a
chat message or a buried doc. It becomes a file here, so the founder has one
place to see exactly what they are blocking, and the agent has one place to
record what is still gating the work.

## File shape

```
---
id: <kebab-id>
title: <imperative one-liner>
status: open
priority: P0
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

- `status`: `open` or `done`. Mark done only when it is genuinely done — never optimistically.
- `priority`: `P0` (launch blocker) / `P1` (before scale) / `P2` (nice-to-have).
- `blocking`: `true` when engineering work is gated until this lands.
- `README.md` is ignored by the loader.
