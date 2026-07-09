---
id: gdpr-data-lifecycle
title: Approve the GDPR data-lifecycle approach for entitlements and the audit ledger.
status: open
priority: P0
blocking: true
phase: Phase 6
why: An EU consumer product with an immutable audit ledger has no right-to-erasure path, which is a launch-blocking legal gap.
href: /hq
date: 2026-07-09
---

## Why

The access system stores personal data (email hash, IP hash, user agent) and an append-only, tamper-evident event ledger that by design is never deleted. A GDPR erasure request collides head-on with "append-only, never delete". The recommended reconciliation is crypto-shredding: destroy the personal data (the email/IP hashes) on erasure while keeping the non-personal audit skeleton intact, so the trail stays defensible and the person is genuinely forgotten. This needs founder approval and a retention policy, and it interacts with the tamper-evidence hash-chain (the chain must cover only non-personal fields).

## Steps

1. Approve **crypto-shredding of personal data while retaining the audit skeleton** as the erasure mechanism.
2. Set **retention windows** for `ip_hash`, `email_hash`, and the event ledger.
3. Confirm a **data-export / portability** response for data-subject requests.
4. Decide whether to handle **Clerk account-deletion webhooks** as an automatic erasure trigger.
5. Confirm the **hash-chain covers only non-personal fields** so erasure does not break tamper-evidence.

## Done when

There is an approved, written erasure + retention policy that an operator can execute, and the audit ledger design provably satisfies both tamper-evidence and the right to be forgotten.
