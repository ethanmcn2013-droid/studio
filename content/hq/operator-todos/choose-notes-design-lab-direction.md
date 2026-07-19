---
id: choose-notes-design-lab-direction
title: Sign in to Turso to release the Signal Notes hybrid
status: done
priority: P0
blocking: false
phase: Signal Notes redesign · Phase 2 production gate
why: The code is complete, but the receipt-backed Tasks 0015 and Notes 0007 production migrations cannot run until Ethan signs in to Turso.
href: https://app.turso.tech
date: 2026-07-18
---

## Released 2026-07-18

Done. Ethan supplied short-lived read-write Turso tokens for the Tasks and Notes
production databases; both receipt-backed migrations ran in order, each after a
verified backup and an isolated-copy dry run with matching schema fingerprint,
`integrity_check = ok`, and zero foreign-key violations.

- Tasks `0015_notes_extract_exact_identity`: applied, database reports
  `current`. Execution receipt `tasks-exec-0015-bc65600bc116`, backup sha256
  `bc65600bc11626a7c576e9ff10a6fdb2ec3cb36feb4c23d264e93379df126739`.
- Notes `0007_note_task_send_outbox`: applied, ledger row recorded, 11 notes
  preserved. Execution receipt `notes-exec-0007-cd41eff3ea63`, backup sha256
  `cd41eff3ea6301253fd61413372603054158e1a21f444fa259f858900e52027a`.

PRs merged in order: Tasks [#36](https://github.com/ethanmcn2013-droid/tasks/pull/36),
Notes [#24](https://github.com/ethanmcn2013-droid/notes/pull/24), Studio HQ
[#77](https://github.com/ethanmcn2013-droid/studio/pull/77). Production verified:
notes.signalstudio.ie, tasks.signalstudio.ie, and the strict v2 receiver all
respond. The v1 receiver stays live as the rollback seam. Receipts and the Tasks
backup are held at `audit/notes-hybrid-release-2026-07-18/`. The supplied tokens
were single-use and expire within 24 hours; revoke them in Turso if still active.

## One action required

1. Open <https://app.turso.tech> in the Codex browser.
2. Choose **Sign in with GitHub** and finish the sign-in. Do not send a password,
   code, or token in chat.
3. Leave the signed-in Turso tab open and tell Codex: `Turso is signed in.`

Do not create, delete, or change a database. Codex will use the authenticated
session to make and verify the backups and dry runs, apply Tasks migration
`0015`, release and verify Signal Tasks, apply Notes migration `0007`, then
release and verify Signal Notes. This task stays open until those production
receipts exist.

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
Phase 2 is code-complete at Notes commit
[`76399854f6461f33f29e5f05af1c86dd0921703f`](https://github.com/ethanmcn2013-droid/notes/commit/76399854f6461f33f29e5f05af1c86dd0921703f).
The exact Signal Tasks receiver is green at
[`398ddca52b9ad1c8d9cfc23fb9f928d3ac027fa1`](https://github.com/ethanmcn2013-droid/tasks/commit/398ddca52b9ad1c8d9cfc23fb9f928d3ac027fa1).
The only current founder action is the Turso sign-in above.

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
receipt. The same HQ task now carries the authenticated production gate so it
cannot be lost after the design choice was completed.
