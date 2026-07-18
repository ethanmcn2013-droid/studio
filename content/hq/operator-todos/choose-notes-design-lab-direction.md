---
id: choose-notes-design-lab-direction
title: Choose the Signal Notes design lab direction
status: done
priority: P1
blocking: false
phase: Signal Notes redesign · Phase 1 selection complete
why: This gate kept production Notes unchanged until the founder defined an exact direction. Ethan selected the exact hybrid on 2026-07-18.
href: https://signal-notes-design-ho4ai9mm4-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=a&scenario=capture&dataset=normal&mode=default&viewport=auto
date: 2026-07-18
---

## Completed selection

Done 2026-07-18: Ethan selected `SELECT HYBRID` and authorized implementation
and production release.

- A: compact server-rendered capture, flat recency, integrated search, keyboard
  flow, and recovery behavior.
- B: 64–72-character reading measure, context snippets, and editorial rhythm;
  exclude the masthead and date grouping.
- C: desktop selected-row split, mobile full-screen detail, focused caret, and
  private-to-approved extraction; exclude the search rail.
- Shared: exact-selection extraction, editable approval, idempotent receipts,
  and conflict handling.

The canonical rationale and reversible release contract are recorded in
[`notes-hybrid-selected-2026-07-18.md`](../decisions/notes-hybrid-selected-2026-07-18.md).
The production receipt remains pending; that is a shipping proof requirement,
not a founder-selection blocker.

## Original gate

1. Open the protected lab from this task and review A, B, and C across Capture, Stream, Search, and Detail plus extraction.
2. Read the evidence-backed comparison at https://github.com/ethanmcn2013-droid/notes/blob/5b9f2c088c8e36633c3981756f7bf744a258accd/docs/notes-redesign/07-comparison-scorecard.md.
3. Use the recommendation as a starting point: A for compact capture, recency, integrated search, keyboard and recovery; B for reading measure, snippets and rhythm; C for the responsive detail split and private-to-approved transition; keep the shared extraction and conflict safeguards.
4. Reply with exactly one of the following:

SELECT A — Instant Notebook
SELECT B — Quiet Editorial Stream
SELECT C — Capture Field
SELECT HYBRID — followed by the exact components to combine

5. Leave this gate open until the selection and rationale are recorded. Do not begin Phase 2 or change production Signal Notes routes or data before that selection.

Satisfied on 2026-07-18 by the exact hybrid selection above. The protected lab,
comparison, and original selection language remain here as the durable gate
receipt.
