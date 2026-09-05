---
id: drive-refresh-token-custody
title: Google refresh-token custody and production recovery
category: Security
likelihood: Medium
impact: High
status: Needs attention
owner: Ethan
reviewDate: 2026-09-30
---

## Current mitigation and residual risk

Reviewed 2026-09-04. The August claim that no cryptography substrate exists is superseded. App WP-2 added src/server/crypto/secret-box.ts, AES-256-GCM envelopes, key versions, ephemeral access tokens, export omission and logging/Sentry custody checks. Candidate 50f16575 passes Linux Drive lifecycle and custody gates; this is internal code evidence, not production key or provider acceptance.

Impact remains High. A compromised runtime able to access both keys and ciphertext can use the durable credential. Rotation, restore and live revocation receipts remain required before launch. App notes/calendar_connections token storage is a separate inherited issue; validate actual exposure and remediate through its own migration rather than describing it as a missing Drive primitive.

Scope is only drive.file, providing per-file authority for created or user-selected/shared files. Provider scope does not replace Signal project authorization, exact-folder guards or named-user permissions. [Google scope guidance](https://developers.google.com/workspace/drive/api/guides/api-specific-auth), retrieved 2026-09-04.

Google documents seven-day refresh-token expiry for an external OAuth application in Testing when Drive scope is requested. Record the actual test/production configuration and rehearse reauthentication; do not publish a consent screen merely to simplify internal testing. Tokens can also expire for other reasons. [Google refresh-token expiry](https://developers.google.com/identity/protocols/oauth2#expiration), retrieved 2026-09-04.

## Owners and next evidence

Validated internal finding, 2026-09-05: actual Drive services and disposable SQLite at27af50c0 produce the same fresh disconnected status after successful, failed and still-in-flight token revocation. Local credential retirement is real; Google completion is not durably recorded. A repeated no-current disconnect can report confirmation without retrying the earlier failure. This is a verified local state/recovery gap, not an observed production exposure. Named-user permission deletion has its own durable pending receipt, but that pending state is not projected after reload.

The Drive implementation owner is repairing the migration-free permission notice first. Personal disconnect needs exact credential-generation request/completion facts, preserved uncertainty and retry/reconnect lineage safeguards. Ordinary consent rotation also retires credentials, so historical retired rows must not be backfilled as confirmed or pending revocations. Automatic retries of old same-account credentials could invalidate newer consent; none are authorized by this repair recommendation. The principal owns migration sequencing and acceptance. These findings qualify the earlier code-gate passes; they do not imply missing cryptography or a need to rebuild the existing grant workers.

- Principal integrator: exact-candidate custody, deletion, negative authorization and recovery evidence; keep production/worker flags off.
- Founder/provider configuration: identify the existing isolated Google OAuth/Clerk test target, then complete the in-product two-account lifecycle using disposable files. No secret values in handoffs.
- Notes owner: separately assess calendar-token encryption and a safe versioned migration/rollback.

The original risk statement is preserved in Git 004f9c9; this record remains Needs attention until the residual release obligations have evidence.
