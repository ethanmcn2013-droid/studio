---
id: personal-chat-files
title: Private files in personal chat
product: tasks
status: Shipped
lastVerified: 2026-10-18
---

# Private files in personal chat

App PR #295 merged normally to `main` at `b6d1519c92ed6276a9bcdbabcb2557305438228d`; all three hosted main CI checks succeeded. The change adds optional attachments to personal chat. It allows up to three files per message, 2 MiB per file, and 50 MiB retained per account. Accepted formats are JPEG, PNG, WebP, PDF, plain text and Markdown. Access is limited to the signed-in owner; files do not inherit access from a Task, Project, channel or guest link.

## Evidence and limits

The final hosted capture passed all five browser cases and retained 20 PNGs. Two development Clerk accounts completed real private-Blob receiving: eight checks passed, and all three owned objects were confirmed absent after cleanup. Source fault tests passed 25/25, and the 53-case migration subset passed.

Production migration 0045 succeeded through the native workflow (run `39093196899`). Read-only status run `39094665249` reported migration 0045 current, no pending migrations, 32 applied ledger rows and 46 registered SQL files. Deployment `dpl_9EuCbGSNsyEoKWoB7EebwV2UKMCd` passed staged checks for 4,638 uploaded file identifiers, 13 source bodies and five runtime bindings. The guarded native promotion was acknowledged at 04:42:12 UTC; receiving at 04:42:35 UTC verified all six canonical aliases, unchanged other previews, cron and protection, and removal of the three temporary settings. Canonical read-only receiving passed at 04:46:21 UTC (receipt prefix `e4723890`). At 04:49:42 UTC, one 126-byte file was uploaded, sent, reloaded, reopened and downloaded through the authenticated UI. Independent byte receiving matched its content SHA-256 (`adcef085…`). At 04:52:40 UTC, the native signed-out check passed: the anonymous request received the App middleware's 307 `/sign-in` response while Clerk was signed out, with no authentication and no file bytes returned. Root receipt: `c21cb20676b296a68579bfd0b8db83eaf79e64c9a1f5f057caca8b8733d1b0ae`.

The unchanged existing admitted cohort has the attachment flag enabled; there is no allowlist or credential change. Independent final bounded production receiving review passed for lineage, exact bytes and anonymous middleware denial against receipt `c21cb20676b296a68579bfd0b8db83eaf79e64c9a1f5f057caca8b8733d1b0ae`. The feature is **Shipped for the existing admitted internal cohort on desktop**. This is not a public launch. The temporary-origin staged sign-in remains blocked: the origin is excluded by ordinary server policy, while the exact silent form-return cause is unknown. A small synthetic note and file remain as deliberately retained release proof; physical-phone testing is deferred. No AI activation is included.

Development receiving qualified the real private-Blob adapter for its bounded scope. Disk storage remains available for local development.

Uncertain writes remain in custody until reconciled, even if their admission deadline passes. Each upload is bound to its original disk root or credential fingerprint; a credential change, including rotation within the same store, fails closed. Cleanup is activity-driven, and custody may defer physical erasure until exact deletion is confirmed. A deployment built with the feature off stops new capability; changing the project setting affects future builds and does not erase bytes or roll back the migration. Do not blindly restore H7: it lacks the compatible attachment eraser, and global custody has not been proven empty.

## Scope and dependencies

This increment is personal chat only. Home and Projects implementation is deferred; Automations are out of scope; Ping's assistant is a separate capability. Ping owns prerequisite migration 0044. Its receipt and the exact 0045 migration, receipt and ledger prefix were reviewed separately; the production migration is recorded above. This record does not authorize widening availability beyond the existing admitted cohort.

Current delivery status, ownership and next proof remain in the existing private [Delivery Project issue 36](https://github.com/ethanmcn2013-droid/signal-studio-workspace/issues/36). The [App operator guide](https://github.com/ethanmcn2013-droid/app/blob/b6d1519c92ed6276a9bcdbabcb2557305438228d/docs/ops/PERSONAL_CHAT_FILES.md) records use, activation checks and recovery.
