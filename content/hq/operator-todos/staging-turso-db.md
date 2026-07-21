---
id: staging-turso-db
title: Repair Signal Preview database access and provider tokens
status: open
priority: P0
blocking: true
phase: Phase 1
why: Dedicated Preview databases exist, but Signal's saved credentials are rejected and its provider tokens are write-capable, so live verification cannot proceed safely.
href: /hq/health
date: 2026-07-16
---

## Current receipt

- Dedicated Preview database hosts already exist for Signal state, Signal email state, Tasks, Notes, and Timeline.
- Both Signal Preview database pairs reject a read-only `SELECT 1` health check with HTTP 401. Their saved tokens are stale, revoked, or paired with the wrong database.
- The Tasks, Notes, and Timeline Preview tokens that can be inspected all carry read/write access. Signal's cross-product provider boundary requires separate read-only tokens.
- The Signal analytics branch has a review-only Vercel deployment with synthetic fixtures, an enabled branch-scoped feature flag, and a fresh branch-scoped cron secret. It never queries these databases.
- No Turso account/admin credential or Clerk Preview/staging credential is available in the local environment or any of the 14 Vercel projects, so Codex cannot rotate or mint the missing credentials without one owner sign-in.

## Founder-only steps

1. Sign in at `https://app.turso.tech`.
2. Open `ethanmcnamara-analytics-preview-ethan387` and create a fresh read/write token. In the Vercel `analytics` project, replace the Preview values for `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` with that database's matched URL and token.
3. Open `signal-analytics-preview-ethan387` and create a fresh read/write token. In the same Vercel project, replace `TURSO_ANALYTICS_DATABASE_URL` and `TURSO_ANALYTICS_AUTH_TOKEN` with that matched pair.
4. Create read-only tokens for `ethanmcnamara-tasks-preview-ethan387`, `ethanmcnamara-notes-preview-ethan387`, and `ethanmcnamara-roadmap-preview-ethan387`. Add them to the `analytics` project for the `agent/signal-progressive-analytics` Preview branch as `TASKS_AUTH_TOKEN`, `NOTES_AUTH_TOKEN`, and `TIMELINE_AUTH_TOKEN`. Point the matching `*_DATABASE_URL` variables at those same three databases.
5. Sign in at `https://dashboard.clerk.com`, create or choose a non-production test instance, and add its publishable and secret keys to that same Vercel branch as `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
6. Tell Codex: `Signal analytics preview credentials are ready.` Codex can then run the health checks, additive migration, two-user tenant-isolation proof, live-provider checks, manual cron continuation, and scheduled-receipt verification without another setup step.

Do not copy production Clerk keys or read/write product tokens into project-wide Preview. Do not run the migration until both Signal database pairs pass `SELECT 1`.
