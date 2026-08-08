---
id: platform-migration-supabase-auth
title: Decide whether to defer the Supabase platform migration
status: open
priority: P2
effort: quick
blocking: false
phase: Platform foundation
why: Consolidation removed most of the vendor-fragmentation argument; a Clerk/Turso replacement now needs a real cost, scale, SSO, or data-model trigger.
href: /hq/decisions
date: 2026-08-08
---

## Recommendation

Defer. Keep Clerk, Turso, Vercel, and the unified app until one of these triggers
exists: a paying multi-seat/SSO requirement, a documented cost or limit cliff,
or a Postgres-only data requirement. Google can remain the primary provider in
Clerk without an auth migration.

If Ethan approves deferral, record a review trigger and close this task. If the
answer is proceed, the database and auth cutovers must be separate, reversible
projects with dual-write/checksum proof and an EU-region decision.
