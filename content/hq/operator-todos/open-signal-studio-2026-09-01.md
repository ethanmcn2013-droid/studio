---
id: open-signal-studio-2026-09-01
title: Make the launch go/no-go call
status: done
priority: P0
effort: involved
blocking: true
phase: Launch decision
why: Opening account creation and paid access is a founder decision after legal, tax, reliability, and commercial gates pass; it is not an automatic calendar event.
href: /hq/action-center
date: 2026-08-08
due: 2026-09-01
cleared: 2026-08-08 — Founder chose a readiness review, not an automatic opening; launch code now defaults closed until an explicit environment override and deploy.
---

## Current position

The old instruction to redeploy five product sites is obsolete. The live
topology is `studio` plus the unified `app`. The clock may change launch copy,
but it must not silently open paid access or bypass the allowlist.

## Founder decision

Choose one release state for 1 September: readiness review (recommended),
staged invite expansion, free account opening, or paid launch. A paid launch
requires incorporation, tax, legal, commercial, billing, recovery, and
observability gates to be green. Once the state is chosen, the agent owns the
two-repository implementation, deploys, and smoke tests.
