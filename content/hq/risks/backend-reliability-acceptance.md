---
id: backend-reliability-acceptance
title: Local recovery proof does not establish hosted reliability.
category: Product
likelihood: Medium
impact: High
status: Needs attention
owner: Ethan
reviewDate: 2026-09-29
---

## Mitigation

Keep hosted performance, authenticated browser behaviour and exact receiving acceptance as separate gates. Verify isolated target identity before any hosted workload. Preserve all failed attempts, operation reconciliation and owned-session cleanup. A local success or green CI run cannot close a gate that did not run.

## Evidence at 27 September 2026

Draft App PR 204 preserves a representative five-store restore (93 tables, 35,611 rows, 843.2 seconds), authenticated local task/chat/file and membership-removal checks, and a 355-request local polling run. The corrected recovery verifier rejects tampered and orphaned archives. Linux Verify Tasks passed at `6bb1013a`; inherited frontend design gates remain unresolved.

The saved isolated hosted Tasks credential returns 401, so hosted three-run performance has not been exercised. Production has not been changed. The remaining execution claim is recorded in private delivery issue 37, with intelligence issue 38 active meanwhile. This record states product risk; the delivery tracker owns work status and reentry.

See [source-pinned architecture and evidence](../../atlas/app-backend-reliability-and-signal-reads.md) and [private receipts](https://github.com/ethanmcn2013-droid/signal-studio-workspace/pull/39). Close only after required hosted and receiving proofs pass at the accepted revision, with review and session cleanup recorded.
