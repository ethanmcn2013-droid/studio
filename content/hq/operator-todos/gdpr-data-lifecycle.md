---
id: gdpr-data-lifecycle
title: Finish the GDPR operator paperwork (DPAs + privacy policy); the mechanism is decided.
status: open
priority: P1
blocking: false
phase: Phase 6
why: The erasure/retention mechanism is decided and being built; what remains is the founder-only paperwork before paid launch.
href: /hq
date: 2026-07-09
---

## Why

The founder delegated the GDPR direction and it is now DECIDED and recorded in [gdpr-data-lifecycle-policy](../decisions/gdpr-data-lifecycle-policy.md): minimize PII to salted hashes, crypto-shred on erasure while keeping an anonymized audit skeleton, purge PII 24 months after an entitlement ends, retain the anonymized financial/audit record 6 years (Irish Revenue). The engineering (hashes-only, hash-chain excludes PII, crypto-shred action, Clerk `user.deleted` handler, retention in the reconcile cron) is being built in the phases, so GDPR is no longer an engineering launch-blocker. Only founder-only paperwork remains.

## Steps

1. Accept the **standard DPAs** for the four sub-processors: Clerk, Stripe, Turso, Vercel.
2. **Publish the updated privacy policy** (`/privacy`) reflecting the decided lifecycle, the sub-processors, and the data-subject-rights contact.
3. Decide whether a **solicitor reviews** the privacy policy before the paid launch.
4. After the Ltd is registered, confirm the **registered Ltd as the data controller**.

## Done when

The four DPAs are accepted, the privacy policy is published and (optionally) reviewed, and the registered Ltd is named as controller.
