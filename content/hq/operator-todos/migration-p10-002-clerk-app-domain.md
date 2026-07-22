---
id: migration-p10-002-clerk-app-domain
title: Verify / allow app.signalstudio.ie in Clerk before the app domain goes canonical
status: open
priority: P0
blocking: true
phase: Consolidation Phase 10
why: The unified app is being renamed from tasks.signalstudio.ie to app.signalstudio.ie (founder-approved). The domain is live and serving, but authentication must work there before we point users at it. app.signalstudio.ie shares the same registrable domain as tasks.signalstudio.ie (Clerk's Frontend API is clerk.signalstudio.ie), so sign-in may already work via subdomain cookie sharing — but this must be verified, and the domain added in Clerk if not.
href: /hq/decisions
date: 2026-07-22
---

## Steps
1. Open https://app.signalstudio.ie/sign-in and sign in with your account. If it works end-to-end (you land in /app), nothing more is needed — mark done.
2. If sign-in fails: Clerk dashboard -> your production instance -> Domains (or Paths / Allowed origins) -> add `app.signalstudio.ie`. Save.
3. Re-test https://app.signalstudio.ie/sign-in.

Until this is confirmed, the canonical flip (making app.signalstudio.ie the primary user-facing domain) is held. tasks.signalstudio.ie stays fully working the whole time, so nothing is broken while this is pending.
