---
id: revoke-unused-turso-token
title: Revoke the signal-tasks Turso token created on 2026-07-30 and delete the local .env.local
status: done
cleared: "2026-08-08 - duplicate credential action consolidated into rotate-keys-post-reset"
priority: P0
blocking: false
phase: Board truth programme
why: A live read/write credential to the production Tasks database was created for a task that turned out to be obsolete, and it is still valid.
href: https://turso.tech
date: 2026-07-30
---

# Revoke the unused `signal-tasks` Turso token

While closing out T·114 and T·115 the agent followed the end-of-cycle ritual in
`tasks/AGENTS.md`, which said to run `scripts/log-cycle.mjs`. Doing that
required Turso credentials, so a read/write token was created against
**`signal-tasks`**, the production Tasks database, and written to a local
`.env.local`.

The ritual then turned out to be legacy. It writes a `portfolio` workspace
straight into production to feed a `/roadmap` page on a personal domain that is
not part of Signal Studio. It was retired in Tasks PR #70. **The command was
never run**, so nothing was written, but the credential exists.

## What to do

1. Turso dashboard, `signal-tasks`, Tokens: delete the token created
   2026-07-30. It is not used by anything.
2. Delete `C:\Users\ethan\signal-studio-workspace\_wt-board-truth\.env.local`.

## Why P0

Nothing is broken and nothing is leaking. It is P0 because an unused
production credential is pure downside risk: it can only ever be a liability,
never an asset, and the cost of removing it is under a minute.
