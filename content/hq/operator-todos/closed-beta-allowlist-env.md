---
id: closed-beta-allowlist-env
title: Set SIGNAL_ALLOWLIST env on the four product Vercel projects
status: open
priority: P0
blocking: false
phase: Phase 1
why: without it, only the hardcoded founder email reaches /app — every other beta account is sent to /waitlist. This is the list you edit to grant access.
href: /hq/health
date: 2026-07-04
---

## Context

`requireAppAccess()` (live 2026-07-04 in tasks / analytics / roadmap / notes)
gates `/app` in production mode: only emails on the allowlist get in; everyone
else lands on `/waitlist`. The allowlist is the founder (hardcoded, never locked
out) plus whatever is in `SIGNAL_ALLOWLIST`. Granting a beta user access = add
their email here and redeploy. This is the code half of the belt-and-braces
gate; the Clerk Restricted mode is the sibling to-do.

## Steps

1. For each of the four product Vercel projects (tasks / signal / timeline /
   notes), set env var **`SIGNAL_ALLOWLIST`** = a comma-separated list of the
   approved beta emails, e.g. `beta1@example.com, beta2@example.com`. The
   founder email is already always-allowed in code; no need to list it.
2. Redeploy each project so the new value takes effect (env changes need a
   deploy).
3. Confirm `SIGNAL_ACCESS_MODE` is unset or `production` on the real product
   deploys — the gate is intentionally skipped in `demo`/`review` mode. If a
   product prod deploy is running in demo mode, the gate is off there.
4. To add someone later: append their email, redeploy. To revoke: remove it,
   redeploy. The change is auditable in the Vercel project history.
