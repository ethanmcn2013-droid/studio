---
id: notes
title: Signal Notes
layer: Context
maturity: 78
status: Private preview
uxPolish: 72
integrationScore: 58
launchReadiness: 72
majorFeatures: ["Next.js 16 scaffold","Turso + Drizzle server persistence","suite-wide Clerk auth (live)","auth-gated /app","sign-in / sign-up routes","notebook surface with optimistic UI","private empty-state copy","private-by-default product treatment","collapsible search rail with ⌘K","wordmark gesture","anti-feature register","homepage","wedding planning demo","Draft action gesture (Cycle 9.4b extraction-half, 2026-05-12)","Cross-repo send to Tasks (Cycle 9.4b second half, 2026-05-12) — POST /api/notes-extract on Tasks, shared bearer auth, idempotent on (userId, noteId)"]
blockers: ["Production env + migrations pending: ALTER TABLE notes ADD COLUMN extract_body TEXT (Notes Turso), ALTER TABLE tasks ADD COLUMN source_note_id TEXT (Tasks Turso), NOTES_TO_TASKS_SECRET env var on both Notes and Tasks (Vercel) — same secret value. Until those land, Send to Tasks will SQL-error or 401.","First-sign-in onboarding empty state could be sharper (Cycle 9.3).","FTS5 server-side search is a later polish — client-side filter is fast for corpora < 1000 notes."]
nextActions: ["Walk Send to Tasks end-to-end on the live deploys once env + migrations land.","Cycle 9.3: first-sign-in onboarding empty state.","Future cycle: reintroduce extract-to-Tasks beat in the marketing demo using the shipped Draft-action → Send pattern (current demo is search-only — honest but less compelling than the previous one).","Add Sentry (memory had claimed Notes was covered by Plan 4.2 PII scrubbing; verified 2026-05-13 that no @sentry/nextjs is installed)."]
---

## Role

What was said, decided, learned, captured, and turned into work.

## Notes

Cycle 9.4b shipped end-to-end 2026-05-12 — extraction-half (Draft action gesture in /app) plus second half (cross-repo write to Tasks). The note → task edge is real: drafted extract → Send to Tasks → POST /api/notes-extract → task created in user's first workspace → promoted_task_id stored → 'Sent to [workspace]' state with deep link back. Privacy guardrail held: only extract_body crosses; raw note bodies stay private. Idempotency via source_note_id keyed as {userId}:{noteId}. Suite Review Pass 2026-05-13: marketing demo brought back in line with PRODUCT.md — four offending showcase components deleted (view-toggle, tags-view, promote-menu, tasks-edge); demo is now capture × 3 → search → reset (was morphing to a Tags view §4 forbids and running a long-press → 'Promote to Tasks' menu §11 forbids); CaptureEntry.tags field removed from the type (§7 'no taxonomy'); `startup` audience pack retired and replaced with `freelance` (the previous pack — investor moat, SOC 2 auditor, fintech founder Y — was exactly the tech-bro register §2 says Notes isn't for); public/wedding-planning/index.html + public/styles.css deleted (static 366-line page was overriding the React route at src/app/wedding-planning/page.tsx; styles.css was drifting from globals.css); duplicate package-lock.json removed. The extract-to-Tasks beat that the deleted PromoteMenu represented will return when designed deliberately against the shipped Draft-action → Send pattern.
