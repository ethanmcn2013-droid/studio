---
id: tasks
title: Signal Tasks
layer: Execution
status: Private preview
currentAsOf: 2026-07-26
canonicalRoute: https://app.signalstudio.ie/app/tasks
archetype: Tasks Hybrid / Editorial Control Room
maturity: not-scored
uxPolish: not-scored
integrationScore: not-scored
launchReadiness: not-scored
qualityGate: not-certified
scoreBasis: current-route-council-evidence-required
majorFeatures: ["Canonical unified route: https://app.signalstudio.ie/app/tasks","Tasks Hybrid / Editorial Control Room: board-first execution with list, schedule, and calendar views inside the Tasks namespace","Shared project context across Notes, Tasks, Timeline, and Signal","Source lineage for approved Notes promotions and milestone-bearing task events"]
blockers: ["No current authenticated state-by-viewport council ledger proves the 50/52 release threshold for the consolidated Tasks route.","Current-route evidence for Notes provenance, project-context continuity, and milestone projection into Timeline is incomplete.","Executable Studio quality tooling still enforces the legacy general mean, not the active 50/52 per-cell product gate."]
nextActions: ["Complete the Tasks Hybrid normal, empty, loading, error, board, list, schedule, and calendar journeys without weakening the accepted editorial control-room hierarchy.","Verify Notes provenance, direct links, shared project selection, and milestone-bearing task projection into Timeline against the unified data and ownership boundaries.","Capture required states at 360px, 768px, and 1440px and repeat council review until every required cell reaches 50/52."]
---

## Role

What needs doing, who owns it, when it matters, and what is stuck.

## Notes

> **2026-07-26 consolidation note.** Current authority is the single Signal Studio app at `https://app.signalstudio.ie/app/tasks`, using the Tasks Hybrid / Editorial Control Room archetype. The dated entries below are retained as provenance from the former standalone implementation; they do not certify the current unified route, launch readiness, retired hosts, or retired interfaces.

Sprint 2 cycles 10.1 + 10.4 closed 2026-05-12. 10.1: gesture #1 one-click invite real on the live surface. 10.4: gesture #4 plain-English activity log rendered in settings → Members tab; visible to all members, not owner-gated; uses the existing activities table (no new schema), groups consecutive same-(user, kind) events within 10 min, prose covers all 8 ActivityKinds. Cycle 43 (cross-repo Notes write surface) also today. Suite Hardening Pass 2026-05-12 (commits 7e7bfbd · 0e4528c · 30793b8): workspace guards added to 5 server actions (toggleComplete/reorder/move/getTaskConversation/getSubtasks — closes a multi-tenant ID-enumeration leak); getCurrentUser() throws in prod when Clerk unconfigured (was silently returning hardcoded 'david'); getCurrentUserOrNull() wrapper added for public routes (/invite/[token] + /api/timeline.ics) to render gracefully unauth instead of 500; CRON_SECRET cron auth now timing-safe + ?user= override locked down; share + invite tokens upgraded to CSPRNG (128/256-bit); /api/health/digest endpoint added + allowed through proxy for status-page probe. Suite Review Pass 2026-05-13: TWO cross-tenant leaks closed (/api/calendar/[workspaceId] now joins workspace_members; removeCommentAction scopes on (active workspace, author === caller)); 16 hot-column indexes applied to prod Turso via CLI (drizzle/0003_hot_indexes.sql) — every read was a full table scan before; Sentry beforeSend was a literal no-op + sendDefaultPii: false missing on all 3 init points — replaced with real scrubber in src/lib/sentry-scrub.ts (user→id only, drops cookies/data/query, redacts auth/session headers, filters clerk/stripe/svix breadcrumbs); security headers landed (Plan 4.1 baseline was missing on Tasks); cross-product partner stats moved to HTTP endpoint /api/internal/partner-stats (auth via PARTNER_STATS_SECRET, replaces Studio's direct libSQL read of Tasks tables); dead better-sqlite3 path swept (deps + serverExternalPackages + outputFileTracingIncludes + 5 docstring refs); seed.ts rewritten against libSQL drizzle; duplicate package-lock.json deleted.
