---
id: drive-refresh-token-custody
title: Holding a customer's Google refresh token, in a repository that has never had any cryptography in it.
category: Security
likelihood: Medium
impact: High
status: Monitoring
owner: Ethan
reviewDate: 2026-09-30
---

## Mitigation

Opened 2026-08-27 with the connected-storage decision. The Project Drive
implementation now includes the planned substrate on app PR #165: refresh
tokens are sealed with AES-256-GCM before database persistence, carry an
explicit key version, are never returned by account export, and are scrubbed
from logs and Sentry. Access tokens are minted only when needed and are never
persisted.

The feature requires a long-lived Google refresh token per connected account.
When the risk opened, the app repository had no cryptography helper and its one
precedent was the wrong one: `calendar_connections` in the Notes module stores
its Google refresh token in **plaintext**, relying on Turso encryption at rest.
The new Drive path does not copy that shape; the Notes retrofit remains a
separate follow-up.

The `secret-box` key comes from `PROVIDER_TOKEN_KEY`; a separate version value
and retired-key map make deliberate rotation possible without a flag day. The
hard-rule ratchet fails CI on a schema column named `access_token`, on a Drive
refresh-token column not named `_cipher`, and on scope drift, so the plaintext
shape cannot return quietly.

Three things keep the blast radius from being unbounded. The scope is
`drive.file` permanently, so a leaked token reaches only files our app created
— the rest of that person's Drive is not data we promise not to read, it is
data the token cannot address. Access tokens are minted per request and never
persisted. And the ratchet is a standing control rather than a review habit.

Honest residual: a refresh token is a durable credential to a real person's
account, and encryption at rest does not help if the key and the ciphertext are
reachable together. Likelihood remains Medium until the branch is deployed,
the production key is confirmed without exposing it, and the Notes table is
retrofitted; impact stays High regardless. Monitoring is therefore the honest
state, not Resolved.

## Notes

Two follow-ons this risk owns:

1. Retrofitting `calendar_connections` once `secret-box` exists. Small and
   obviously correct; must not be allowed to block Project Drive, and must not
   be forgotten once it stops blocking anything.
2. The consent screen was confirmed **In production** during WP-1, so Google's
   seven-day refresh-token expiry for Testing-mode apps does not apply.
