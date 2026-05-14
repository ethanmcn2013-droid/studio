---
id: tasks
title: Signal Tasks
layer: Execution
maturity: 84
status: Private preview
uxPolish: 80
integrationScore: 60
launchReadiness: 76
majorFeatures: ["Workspace","task list","views","auth","persistence","audience pages","Cross-repo Notes extract endpoint (POST /api/notes-extract, Cycle 43, 2026-05-12)","Real invite flow + pending invites panel with Resend/Revoke (Sprint 2 Cycle 10.1, 2026-05-12)","Plain-English workspace activity log (Sprint 2 Cycle 10.4, 2026-05-12) — last 10 changes as human prose, grouped consecutive same-(user, kind) events within 10 min","Anatomy-of-a-card section rebuilt as motion-grade interactive surface (2026-05-12) — motion v12, 14s live loop on demo card (comment tick → lock outline draws → EM avatar joins with DV squash → idle⇄live pill morph → due countdown → typing → presence leaves), bidirectional hover spotlight (card chip ⇄ index row), card lifts on spring (scale 1.04), MotionConfig reducedMotion=user, useInView pauses loop offscreen"]
blockers: ["Cross-product object links are not yet visible.","Operator action: ALTER TABLE tasks ADD COLUMN source_note_id TEXT + NOTES_TO_TASKS_SECRET env var (cross-repo edge prerequisites)."]
nextActions: ["Sprint 2 Cycle 10.7: source attribution wired to real numbers (the only remaining cycle — 10.5 + 10.6 already killed via HQ decisions).","Cross-product object links surface so a venue can hop Notes → Tasks → Roadmap workspace without manual URL juggling.","Operator action: ALTER TABLE tasks ADD COLUMN source_note_id TEXT (Tasks Turso) + NOTES_TO_TASKS_SECRET env var on Notes + Tasks (matching).","Operator action: set PARTNER_STATS_SECRET on Tasks Vercel project (same value as Studio) — until set, /hq/partners renders Tasks-side stats as zeros with a console.warn.","Future cycle: per-subscriber-token replacement for /api/calendar/[workspaceId] so Apple Calendar / Google Calendar can actually subscribe (current shape requires a Clerk session, which calendar clients can't carry)."]
---

## Role

What needs doing, who owns it, when it matters, and what is stuck.

## Notes

Sprint 2 cycles 10.1 + 10.4 closed 2026-05-12. 10.1: gesture #1 one-click invite real on the live surface. 10.4: gesture #4 plain-English activity log rendered in settings → Members tab; visible to all members, not owner-gated; uses the existing activities table (no new schema), groups consecutive same-(user, kind) events within 10 min, prose covers all 8 ActivityKinds. Cycle 43 (cross-repo Notes write surface) also today. Suite Hardening Pass 2026-05-12 (commits 7e7bfbd · 0e4528c · 30793b8): workspace guards added to 5 server actions (toggleComplete/reorder/move/getTaskConversation/getSubtasks — closes a multi-tenant ID-enumeration leak); getCurrentUser() throws in prod when Clerk unconfigured (was silently returning hardcoded 'david'); getCurrentUserOrNull() wrapper added for public routes (/invite/[token] + /api/roadmap.ics) to render gracefully unauth instead of 500; CRON_SECRET cron auth now timing-safe + ?user= override locked down; share + invite tokens upgraded to CSPRNG (128/256-bit); /api/health/digest endpoint added + allowed through proxy for status-page probe. Suite Review Pass 2026-05-13: TWO cross-tenant leaks closed (/api/calendar/[workspaceId] now joins workspace_members; removeCommentAction scopes on (active workspace, author === caller)); 16 hot-column indexes applied to prod Turso via CLI (drizzle/0003_hot_indexes.sql) — every read was a full table scan before; Sentry beforeSend was a literal no-op + sendDefaultPii: false missing on all 3 init points — replaced with real scrubber in src/lib/sentry-scrub.ts (user→id only, drops cookies/data/query, redacts auth/session headers, filters clerk/stripe/svix breadcrumbs); security headers landed (Plan 4.1 baseline was missing on Tasks); cross-product partner stats moved to HTTP endpoint /api/internal/partner-stats (auth via PARTNER_STATS_SECRET, replaces Studio's direct libSQL read of Tasks tables); dead better-sqlite3 path swept (deps + serverExternalPackages + outputFileTracingIncludes + 5 docstring refs); seed.ts rewritten against libSQL drizzle; duplicate package-lock.json deleted.
