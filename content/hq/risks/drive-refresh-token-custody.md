---
id: drive-refresh-token-custody
title: Google refresh-token custody and recovery
category: Security
likelihood: Medium
impact: High
status: Needs attention
owner: Ethan
reviewDate: 2026-10-15
---

## Mitigation and remaining risk

The August 2026 claim that the App has no cryptography is historical. At App
source `380ab1c7c999dc014a8101b8a466a610712d1f92`,
[`secret-box.ts`](https://github.com/ethanmcn2013-droid/app/blob/380ab1c7c999dc014a8101b8a466a610712d1f92/src/server/crypto/secret-box.ts)
implements AES-256-GCM envelopes, key versions and context-bound encryption.
Drive seals refresh tokens and mints request-local access tokens. Its requested
scope is exactly `drive.file`; Signal's Project authorization and folder/grant
checks remain separate controls. See the [Drive system record](/hq/atlas/project-files-in-drive).

A runtime that can reach both the key and ciphertext can still use the durable
credential. Versioned encryption supports rotation; source support alone does
not prove deployed keys, a completed rotation, restore or provider recovery.
Likelihood remains Medium and impact High.

## Disconnect uncertainty: historical finding and current source

PR178 recorded a validated local finding at App `27af50c0`: successful, failed
and in-flight revocations produced the same fresh disconnected status, and a
repeat disconnect could imply confirmation without retrying. Preserve that
finding at its original scope; it was not observed production exposure.

Current [`drive-connections.ts`](https://github.com/ethanmcn2013-droid/app/blob/380ab1c7c999dc014a8101b8a466a610712d1f92/src/server/connections/drive-connections.ts)
addresses that gap in source. It persists requested/confirmed timestamps and
attempt identity, exposes pending revocation after reload, fences OAuth entry
and completion while pending, and retries the same credential generation. A
disconnect with no current or pending request returns no confirmation. Missing
keys and failed provider calls leave the request unconfirmed. Existing tests
cover reload/retry, interruption, missing keys, overlapping consent and
migration `0038` preserving old ciphertext without inventing confirmation.
Those tests were inspected, not rerun for this documentation repair.

The [feature record](/hq/features/project-files-in-drive) preserves accepted
Preview lifecycle evidence and later bounded founder-controlled production
observations. Its historical receipts do not establish today's live provider
state or a complete customer lifecycle. Retired consent rows must not be
relabelled as confirmed revocations, and old same-account credentials must not
be retried against a newer current grant.

## Remaining evidence and ownership

Notes is a separate inherited exposure: at the same App pin,
`src/modules/notes/server/db/notes-schema.ts` retains
`calendar_connections.refresh_token` without application-layer encryption;
its comment says live population is unverified. Do not infer active customer
credentials or a completed remediation. Any change needs its own scoped
assessment and safe migration/rollback.

The owning Delivery task must retain the exact deployment/provider evidence,
key rotation and restore proof, and actual OAuth configuration/reauthentication
limits relevant to its release. This context correction neither changes that
configuration nor authorizes publication of a consent screen. Wider-user,
physical-phone and real elapsed-use acceptance are not established here.
This risk remains **Needs attention**. Old PR175/178 branches and their other
work remain preserved; this record does not close their entire scopes.
