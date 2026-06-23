---
id: verify-sentry-dsns
title: Verify Sentry DSNs are set and capturing per app
status: open
priority: P0
blocking: true
phase: Phase 2
why: "@sentry/nextjs is a dependency but error capture is unverified — prod errors may be invisible."
href: /hq/health
date: 2026-06-23
---

## Steps

1. Sentry -> each project -> copy the DSN.
2. Vercel -> each app -> set `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` (+ auth token for source maps) in Production.
3. Trigger a test error on a deployed preview and confirm it lands in Sentry.
