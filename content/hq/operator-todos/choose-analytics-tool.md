---
id: choose-analytics-tool
title: Approve PostHog and create the production project
status: done
priority: P1
effort: quick
blocking: false
phase: Product analytics
why: PostHog is already the coded and disclosed sink, but the consolidated app has no production project key.
href: /hq/reporting
date: 2026-08-08
cleared: 2026-08-08 — Founder approved PostHog Cloud EU, cookieless and consent-gated, with session replay disabled; provisioning moved to the agent queue.
---

## Decision and action

Approve PostHog Cloud EU with cookieless, consent-gated events and no session
replay (recommended), or explicitly choose a different sink. If approved,
create the project; the agent can then wire the project key, verify the narrow
activation/retention event contract, and keep replay disabled.
