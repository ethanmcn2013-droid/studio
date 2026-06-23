---
id: verify-sentry-dsns
title: Verify Sentry DSNs are set and capturing per app
status: open
priority: P0
blocking: true
phase: Phase 2
why: "tasks/notes/analytics ship @sentry/nextjs but DSNs are unverified; roadmap & studio have NO Sentry dependency at all — prod errors in two products are invisible."
href: /hq/health
date: 2026-06-23
---

## Steps

1. Sentry -> each project -> copy the DSN.
2. Vercel -> each app -> set `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` (+ auth token for source maps) in Production.
3. Trigger a test error on a deployed preview and confirm it lands in Sentry.

## Coverage gap (eng, surfaced 2026-06-23 council)

- **tasks, notes, analytics**: `@sentry/nextjs` + `instrumentation*.ts` +
  `sentry-scrub` already wired (PII scrub, `sendDefaultPii:false`). Only DSN
  verification is owed (steps above).
- **roadmap, studio**: NO `@sentry/nextjs` dependency — no error monitoring at
  all. Eng must add the SDK + instrumentation (reuse the `sentry-scrub` module)
  before a DSN can be set. Adds a dependency, so it lands in its own cycle.
