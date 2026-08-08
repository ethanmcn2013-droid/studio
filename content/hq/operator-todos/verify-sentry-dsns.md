---
id: verify-sentry-dsns
title: Create or authorize Sentry projects for app and studio
status: open
priority: P1
effort: involved
blocking: false
phase: Production observability
why: Neither production repository has a Sentry DSN; app has the SDK and privacy scrubber, while studio still needs the SDK integration.
href: /hq/health
date: 2026-08-08
---

## Founder boundary

Create or authorize two Sentry projects, `app` and `studio`, with EU data-region
and least-privilege source-map credentials where available. The agent then owns
the Studio SDK integration, Vercel environment setup, scrub verification, and a
preview-only captured error. The retired five-product checklist no longer
applies.
