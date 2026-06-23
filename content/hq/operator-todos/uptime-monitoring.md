---
id: uptime-monitoring
title: Set up external uptime monitoring per domain
status: open
priority: P1
blocking: false
phase: Phase 2
why: Outages are currently discovered by users, not alerts.
href: /hq/health
date: 2026-06-23
---

## Steps

1. Pick a monitor (Better Stack / Pingdom / Vercel monitoring).
2. Add a check per product domain hitting a health endpoint.
3. Wire alerts to email/Slack.
