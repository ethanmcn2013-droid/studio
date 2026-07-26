---
id: timeline-view-receipt-integrity
title: Timeline view counts overstate people or retain more viewer data than the feature needs.
category: Product
likelihood: Low
impact: High
status: Monitoring
owner: Ethan
reviewDate: 2026-08-22
---

## Mitigation

Count a qualified view only after the shared artifact has stayed visible for
the defined qualification window. Deduplicate by publication and viewing
session, keep the aggregate on the publication so token rotation does not
reset it, and exclude owner phone previews, metadata fetches, link prefetches,
hidden tabs, reload storms, and obvious automated requests.

Persist only the publication aggregate and a short-lived hashed receipt. Do
not store the raw share token, IP address, referrer, or user-agent. Keep the
link-only route out of general page analytics, apply a no-referrer policy, and
redact share paths from error reporting. Deleting an account or publication
deletes its receipts; data export omits receipt hashes.

## Verification

Timeline PR #28 applied and verified the additive migration. Tasks PR #46
covered first qualification, early exit, duplicate and new sessions, token
rotation, revocation, owner preview exclusion, metadata requests, expiry,
account deletion, concurrency, privacy headers, and desktop/mobile behavior.

## Remaining watch

Keep production observability on qualification volume and failed receipts.
Reopen this risk if counts diverge from publication aggregates, if any new
analytics layer sees bearer paths, or if a future milestone-photo layer tries
to reuse this minimal receipt for content telemetry.
