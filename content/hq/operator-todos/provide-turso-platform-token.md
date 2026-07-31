---
id: provide-turso-platform-token
title: Create a Turso Platform API token so the reset can create the new databases
status: open
priority: P0
blocking: true
phase: Stack reset
why: Phases 2–6 of the data-layer reset (create the 11 new databases, import, drop the 13 old ones) cannot run without it — no Turso CLI is installed and only per-database tokens exist on this machine.
href: /hq
date: 2026-07-31
---

The reset branches are ready in both repos and every database is dumped to
`db-archive/2026-07-31/`. The one missing credential is an account-level
Turso token: per-database tokens can read the old databases but cannot
create new ones.

## Steps

1. Open <https://app.turso.tech> → click your account (bottom left) →
   **API Tokens**.
2. Create a token named `stack-reset-2026-07-31`.
3. Hand it to the working Claude session (paste it in chat, or save it to
   `C:\Users\ethan\signal-studio-workspace\.reset-token` — the file is
   outside every repo).
4. After Phase 6 completes and the old databases are dropped, revoke the
   token in the same screen. It is listed in the rotate-keys checklist too.
