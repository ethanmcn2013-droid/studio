---
id: choose-analytics-tool
title: Choose a product-analytics tool (PostHog recommended)
status: open
priority: P1
blocking: false
phase: Phase 4
why: Launching blind on activation/retention/segment data — eng needs a sink before wiring events.
href: /hq/reporting
date: 2026-06-23
---

## Steps

1. Pick the tool (PostHog self-host or cloud recommended).
2. Approve the consent-gated tracking plan.
3. Provision the project + keys so eng can wire emit points from `recordActivity` / `emitTasksChanged`.
