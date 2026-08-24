---
id: gdpr-data-lifecycle
title: Finish the GDPR and data-controller paperwork
status: open
priority: P0
effort: involved
blocking: true
phase: Legal release
why: The lifecycle mechanism is settled, but the controller record, processor paperwork, venue-contact basis, and public policy still require founder or legal sign-off.
href: /hq
date: 2026-08-08
---

## Already settled

The lifecycle decision minimizes PII, crypto-shreds erased identity data,
purges personal data 24 months after entitlement end, and retains an
anonymized financial/audit skeleton for six years. Engineering implementation
and retention jobs are not founder tasks.

## Founder-only steps

1. Accept or download the current DPAs for Clerk, Stripe, Turso, and Vercel.
   Add Upstash, Sentry, and PostHog only if those providers are enabled.
2. Record the lawful basis and retention period for named venue contacts. Do
   not keep an unencrypted production dump or personal contact data in source.
3. Decide whether a solicitor reviews the policy before paid launch.
4. Approve and publish the final privacy policy, subprocessors, rights contact,
   cookie/consent position, and retention table.
5. Once incorporated, name the registered Irish company as controller and
   record its contact details.

## Done when

The processor records are retained, venue-contact handling is documented, the
public policy matches production, and the correct legal controller is named.
