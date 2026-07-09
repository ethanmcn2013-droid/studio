---
id: gdpr-data-lifecycle-policy
title: GDPR data lifecycle — minimize PII, crypto-shred on erasure, keep an anonymized audit skeleton, 6-year financial retention.
category: Access
date: 2026-07-09
status: Active
reviewDate: 2026-09-01
relatedObjects: [Entitlements, Audit ledger, GDPR, Privacy, Signal HQ, Clerk, Stripe]
---

## Decision

The founder delegated this call ("approve any direction you think is best for the company; note the decision and why"). Decided:

1. **Minimize PII at rest.** The entitlements and audit stores keep salted **hashes** (`email_hash`, `ip_hash`), never plaintext, wherever a value is only needed for lookup or rate-limiting. Plaintext email is read live from Clerk at render time and never persisted into the entitlements/audit store.
2. **Erasure = crypto-shredding.** On a valid erasure request, or on a Clerk `user.deleted` webhook, destroy that person's PII (`email_hash`, `ip_hash`, any denormalized identifiers) and null the user linkage, while **retaining the anonymized audit-event skeleton** (action, timestamp, tier, sponsor/batch ids). The tamper-evidence hash-chain is computed over **non-PII fields only**, so shredding the PII never breaks the chain.
3. **Retention.** PII hashes are purged **24 months after the related entitlement ends**, or immediately on erasure request, whichever comes first (reconcile cron enforces it). The **anonymized audit skeleton and transaction/financial records are retained 6 years** to meet Irish Revenue record-keeping obligations, then purged.
4. **Lawful bases.** Performance of contract (providing access); legal obligation (tax/financial records); legitimate interest (fraud prevention and dispute defense) for the anonymized audit trail.
5. **Data-subject rights.** Access/portability and erasure are executed by the operator through HQ actions; Clerk `user.deleted` triggers automatic crypto-shred while keeping the financial/audit skeleton.
6. **Processors.** Clerk (identity), Stripe (billing), Turso (database), Vercel (hosting) are sub-processors under their standard DPAs; listed in the privacy policy.

## Reason

The system has two requirements that pull in opposite directions: an **immutable, tamper-evident audit ledger** (needed to defend chargebacks, disputes, and fraud, and to keep financial records) versus the **right to erasure**. Crypto-shredding resolves both: by keeping PII in shreddable hashes that sit **outside** the hash-chained payload, a person can be fully forgotten without touching the ledger's integrity. Storing hashes rather than plaintext shrinks the erasure surface and the breach blast-radius. Retaining only the 6-year financial minimum, anonymized, keeps us compliant with Revenue without hoarding personal data. The bases are the standard, defensible set for an EU consumer + B2B product. This is the lowest-risk, most defensible posture and it is buildable now (the crypto-shred function and the hash-chain-excludes-PII rule are Phase 1/6 code), so GDPR is no longer a launch blocker on the engineering side — only the operator paperwork (DPAs, privacy policy) remains.

## Scope

Engineering (built in the phases): PII stored as hashes only; hash-chain excludes PII; a crypto-shred operator action + Clerk `user.deleted` handler; retention enforced by the reconcile cron; an audited data-export action.

Founder-gated remainder (tracked in `gdpr-data-lifecycle` to-do): accept the four processor DPAs, publish the updated privacy policy reflecting this, decide whether a solicitor reviews it before launch, and confirm the registered Ltd as the data controller once incorporated.

## Notes

This decision is referenced by [licensing-access-architecture](./licensing-access-architecture.md) and the full design lives at `docs/LICENSING_ACCESS_DESIGN.md`. If a future session changes retention windows or the erasure mechanism, update this doc first — it is the source.
