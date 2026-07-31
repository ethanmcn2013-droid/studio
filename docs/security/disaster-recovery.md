# Disaster recovery and restore plan

**Current state:** no measured RPO/RTO or successful restore receipt is recorded in this Phase 1 snapshot.

For each Turso database and provider export, document owner, backup frequency, retention, encryption, region, last-success timestamp, RPO target, RTO target and off-provider copy. Restore into an isolated account/network with production secrets removed. Verify schema/migrations, row counts by workspace, foreign-key integrity, entitlements, public-link revocation state, application health and audit-event continuity. Record elapsed restore time and data loss window. Run quarterly and after material migration changes. Every migration must include forward and rollback SQL plus a rehearsed rollback path.

