---
id: drive-refresh-token-custody
title: Holding a customer's Google refresh token, in a repository that has never had any cryptography in it.
category: Security
likelihood: Medium
impact: High
status: Open
owner: Ethan
reviewDate: 2026-09-30
---

## Mitigation

Opened 2026-08-27 with the Project Drive decision. Not yet mitigated — the
substrate does not exist. Recorded now because the point at which it becomes
urgent is the point at which it is cheapest to get wrong.

The feature requires a long-lived Google refresh token per connected account.
There is no `createCipheriv` anywhere in the app repository today, and the one
precedent is the wrong one: `calendar_connections` in the Notes module stores
its Google refresh token in **plaintext**, relying on Turso encryption at rest,
and its own comment flags this as a follow-up nobody has come back to. Copying
that shape for Drive would take a known shortcut and multiply it.

The plan's WP-2 builds `secret-box` (AES-256-GCM, key from `PROVIDER_TOKEN_KEY`,
explicit `keyVersion` so rotation is possible) before any token exists to store,
along with scrubbing at the Sentry boundary and omission from account export.
WP-0's hard-rule ratchet already fails CI on a schema column named
`access_token`, and on a refresh-token column not named `_cipher`, so the
plaintext shape cannot land quietly even before WP-2 ships.

Three things keep the blast radius from being unbounded. The scope is
`drive.file` permanently, so a leaked token reaches only files our app created
— the rest of that person's Drive is not data we promise not to read, it is
data the token cannot address. Access tokens are minted per request and never
persisted. And the ratchet is a standing control rather than a review habit.

Honest residual: a refresh token is a durable credential to a real person's
account, and encryption at rest does not help if the key and the ciphertext are
reachable together. Likelihood Medium until WP-2 lands and the Notes table is
retrofitted; impact stays High regardless.

## Notes

Two follow-ons this risk owns:

1. Retrofitting `calendar_connections` once `secret-box` exists. Small and
   obviously correct; must not be allowed to block Project Drive, and must not
   be forgotten once it stops blocking anything.
2. The consent screen must be published out of Testing on day one of WP-1.
   While it is in Testing, Google expires refresh tokens after seven days —
   which will look exactly like a bug in our own token handling for a week, at
   the moment the team is least able to tell the difference.
