---
id: planning-period-production-release
title: Complete the Planning Period production release gates
status: open
priority: P0
blocking: true
phase: Planning Period release
why: The architecture is merged and preview-verified, but production data, secrets, identities, and rollout flags are not yet evidenced safely.
href: /hq/platform-readiness
date: 2026-07-13
---

## Context

Planning Period work is merged across Studio, Tasks, Timeline, Signal, and Notes. The signed Tasks catalog and Notes-to-Timeline receiver are implemented and fail closed. Local isolated-fixture checks are evidenced in the implementation report, but no production migration, provider-backed identity receipt, or flag enablement has been performed.

## Steps

1. Take current backups of the Studio, Tasks, and Timeline databases and prove each restore against an isolated copy.
2. Run the Planning Period migration dry runs against realistic snapshots. Reconcile invalid parent rows, duplicate entitlements, and ownership conflicts before any production write.
3. Configure and verify the shared preview secrets for the Tasks catalog and Notes-to-Timeline receiver. Do not place secrets in source or screenshots.
4. Run provider-backed preview journeys with owner, collaborator, sponsor, removed-member, and anonymous identities. Retain receipts for catalog reads, safe promotion, duplicate rejection, public-link rotation, and revocation.
5. Apply the production migrations through the repository-supported workflow and attach backup, restore, preflight, migration, and post-check receipts.
6. Enable the smallest internal pilot first. Keep Planning Period, contextual onboarding, scoped Signal, and audience publication flags off for general users until the pilot is clean.
7. Record rollback commands and promote flags gradually. Mark this item done only after production health and rollback paths are verified.

## Done when

Production migration, secret configuration, authenticated smoke journeys, pilot enablement, and rollback evidence are attached to this HQ item; every migration receipt names the snapshot, operator, timestamp, and result; and no unresolved data-owner or entitlement conflict remains.
