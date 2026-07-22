---
id: rotate-turso-platform-token
title: Rotate the Turso Platform API token used for the database rename
status: open
priority: P1
blocking: false
phase: Post-consolidation cleanup
why: During the 2026-07-22 Turso database rename (to the signal-* scheme), a Turso Platform API token was pasted into a chat session to create/copy/delete databases. That token grants full account-level control (create/delete any database, mint DB tokens). It has done its job and should be revoked. The live apps do NOT use it — they connect via per-database tokens stored in Vercel, which are unaffected by revoking the platform token. So rotating it cannot break anything.
href: /hq/decisions
date: 2026-07-22
---

## Steps
1. Go to app.turso.tech, sign in, open your account (ethan387) -> Settings -> API Tokens (or "Platform API Tokens").
2. Find the token created for the migration (named e.g. `rename-migration`) and Revoke / Delete it.
3. No replacement needed — it was a one-time migration credential.
4. Verify nothing broke (optional): load app.signalstudio.ie and sign in; the per-database tokens in Vercel are independent and keep working.

Note: the local copy of that token and the minted DB-token map were already deleted from the machine during the migration. This todo is only to revoke it in the Turso dashboard so the chat-exposed credential is dead.
