---
id: provision-upstash
title: Approve one EU Upstash Redis store for the unified app
status: open
priority: P0
effort: quick
blocking: true
phase: Abuse protection
why: The consolidated app ships rate-limit seams but has no Upstash environment, so distributed limits are not enforced across instances.
href: /hq/health
date: 2026-08-08
---

## Founder decision

Approve one least-cost EU store attached to `app` (Frankfurt recommended), with
an alert before any paid overage. The old instruction to provision separate
Notes, Tasks, and Timeline stores is retired. Once approved, the agent owns
provisioning, environment injection, limiter verification, and documentation.
