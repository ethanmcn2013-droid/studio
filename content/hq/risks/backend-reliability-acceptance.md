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

## Evidence at 28 September 2026

Draft App PR 204 preserves a representative five-store restore (93 tables, 35,611 rows, 843.2 seconds), authenticated local task/chat/file and membership-removal checks, and a 355-request local polling run. The corrected recovery verifier rejects tampered and orphaned archives. Linux Verify Tasks passed at `6bb1013a`; inherited frontend design gates remain unresolved.

The isolated Preview access failure is repaired. Exact-source attestation at `90991e61` verifies five isolated stores and two controlled test actors; full Linux Verify Tasks run `36367211661` passes. Earlier hosted lifecycle, duplicate/replay, membership-removal and service-adapter recovery checks passed at `274f9a05`, with owned sessions revoked and scoped fixtures removed. Those checks do not establish provider-outage recovery or representative hosted latency.

The bounded persisted-activity follow-up at `df605cd731716e28f25975c3a5e0fb472a6b883a` passed full Verify Tasks CI ([run 36380440106](https://github.com/ethanmcn2013-droid/app/actions/runs/36380440106)); this does not establish hosted reliability or acceptance.

The representative workload at `90991e61` failed at its first finalization, with no saved measurement window or latency verdict. Ten owned sessions were revoked. Later read-only reconciliation verified 100 sends and 100 promotions with single expected durable effects; it does not recover the original HTTP outcomes. A separate ordinary-task performance attempt failed on completion action 43, before the planned 200 measured samples per class; its two sessions were revoked. Both fixtures were snapshotted and atomically cleaned with zero residual scoped rows, preserving original failures. Candidate `6daed4e3` repairs repetition timing and failed-flush diagnostics and passes full backend CI `36377593796`; its Preview passed exact-source attestation. The three complete measured workloads and final-candidate receiving remain outstanding.

Normal Chrome create/edit/complete/delete and persistence after navigation passed separately at `90991e61`, with independent actor reads and SQL checks. Its fixture and owned sessions are cleaned. That bounded browser gate does not establish representative load or later-candidate acceptance. Access provisioning and measurements are now serialized after deployment cookies were observed to become rejected following another deployment's access provisioning; the observation does not prove the original workload failure cause. Production has not been changed. Private delivery issue 37 owns the execution claim and next proof; this record states the product risk.

See [source-pinned architecture and evidence](../../atlas/app-backend-reliability-and-signal-reads.md) and [private receipts](https://github.com/ethanmcn2013-droid/signal-studio-workspace/pull/39). Close only after required hosted and receiving proofs pass at the accepted revision, with review and session cleanup recorded.
