---
id: timeline-view-receipt-integrity
title: Timeline view counts overstate people or retain more viewer data than the feature needs.
category: Product
likelihood: Medium
impact: High
status: Needs attention
owner: Ethan
reviewDate: 2026-08-22
---

## Mitigation

Count a qualified view only after the shared artifact has stayed visible for the defined qualification window. Deduplicate by publication and viewing session, keep the aggregate on the publication so token rotation does not reset it, and exclude owner phone previews, metadata fetches, link prefetches, hidden tabs, reload storms, and obvious automated requests.

Persist only the publication aggregate and a short-lived hashed receipt. Do not store the raw share token, IP address, referrer, or user-agent. Keep the link-only route out of general page analytics, apply a no-referrer policy, and redact share paths from error reporting. Deleting an account or publication must delete its receipts; data export must not expose receipt hashes.

## Verification

The release gate requires tests for first qualification, early exit, duplicate session, new session, token rotation, revocation, owner preview exclusion, metadata requests, cross-origin requests, expiry, account deletion, and concurrent requests. Production evidence must show the owner count moving once for one qualified viewing session and remaining unchanged across refreshes inside the deduplication window.

## Notes

Open until the additive migration is backed up, dry-run against an isolated copy, applied to production, and verified through both owner and link-only journeys. An HTTP 200 or a raw request counter does not close this risk.
