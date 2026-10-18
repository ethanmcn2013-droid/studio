---
id: personal-chat-files
title: Private files in personal chat
product: tasks
status: In Progress
lastVerified: 2026-10-18
---

# Private files in personal chat

The current App candidate is `0ba4b4979d45c78de5108816b1a2a03f02ed6364`, under draft [PR #295](https://github.com/ethanmcn2013-droid/app/pull/295). It adds optional attachments to personal chat. The candidate allows up to three files per message, 2 MiB per file, and 50 MiB retained per account. Accepted formats are JPEG, PNG, WebP, PDF, plain text and Markdown. Access is limited to the signed-in owner; files do not inherit access from a Task, Project, channel or guest link. The feature is default off.

## Evidence and limits

Two-account development receiving with disk storage passed. Source fault tests passed 25/25, and the 53-case migration subset passed. An earlier hosted full Verify run and 204-case canonical capture passed. The final candidate's canonical capture and required hosted CI are still pending. These results do not establish production migration, activation or production receiving.

The candidate supports disk storage for local development. Vercel requires a separately qualified private Blob store; injected provider tests and disk receiving do not establish that qualification. No public availability or activation is claimed.

Uncertain writes remain in custody until reconciled, even if their admission deadline passes. Each upload is bound to its original disk root or credential fingerprint; a credential change, including rotation within the same store, fails closed. Cleanup is activity-driven, and custody may defer physical erasure until exact deletion is confirmed. Turning the feature off stops new capability but does not erase bytes or roll back its migration.

## Scope and dependencies

This increment is personal chat only. Home and Projects implementation is deferred; Automations are out of scope; Ping's assistant is a separate capability. Ping owns prerequisite migration 0044. Its receipt and the exact 0045 migration, receipt and ledger prefix require separate review; copying or referring to this record does not approve either migration or production activation.

Current delivery status, ownership and next proof remain in the existing private [Delivery Project issue 36](https://github.com/ethanmcn2013-droid/signal-studio-workspace/issues/36). The [App operator guide](https://github.com/ethanmcn2013-droid/app/blob/0ba4b4979d45c78de5108816b1a2a03f02ed6364/docs/ops/PERSONAL_CHAT_FILES.md) records use, activation checks and recovery.
