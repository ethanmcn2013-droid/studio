---
id: migration-p08-004-signal-email-home
title: Decide the long-term home of Signal's briefing emails
status: done
priority: P1
blocking: false
phase: Consolidation Phase 8
why: The email cron still runs on the old Signal deployment (by design). Retiring that app requires moving email; keeping it costs nothing.
href: /hq/decisions
date: 2026-07-22
---

## DECIDED 2026-07-22 — email home is the unified app
The original "keep the old Signal deployment forever for unsubscribe links" rationale is void: Signal is not live, the only emails ever sent were founder test emails, and sending is still DKIM-blocked. There are no real subscribers whose unsubscribe links must be preserved. So the old Signal deployment is being retired.

Signal's briefing BUILD + VIEW logic is already in the unified app (src/modules/signal/lib/briefing/* and server/briefing/*, ported during consolidation) — /app/brief renders live briefings today. Only the SEND pipeline is not yet ported, and it is intentionally deferred to Signal's actual launch (it is blocked on DKIM/deliverability setup anyway and will need real email design).

Launch-time task (scoped, ~5 files to port from the analytics repo into the unified app, behind the existing OFF flags, then add the cron schedules to the unified vercel.json):
- src/app/api/cron/briefings/route.ts
- src/app/api/cron/signal-analytics/route.ts
- src/app/api/unsubscribe/[token]/route.ts (+ the /u/[token] page)
- src/lib/email/{dispatch,plain-text,tokens}.ts
Gate: complete DKIM/deliverability before enabling sends.

## Steps

1. Recommended default: keep the old Signal deployment alive indefinitely as an email-only service (cron + Resend + unsubscribe). Zero migration risk; unsubscribe links in sent emails keep working forever.
2. Alternative: port cron+email into the unified app at Stage D (engineering task, needs its own verification pass).
3. Needed by Stage D only.
