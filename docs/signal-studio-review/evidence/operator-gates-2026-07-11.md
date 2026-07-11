# Operator/provider gates — 2026-07-11

Engineering work has been merged and verified. These gates intentionally remain last because they require provider-console authority or live production credentials; no secret values belong in the repository.

- [ ] Verify Clerk production application/custom-domain/session topology and revoke legacy service credentials.
- [ ] Verify Turso database regions, least-privilege tokens, backups, restore receipts, and retention/crypto-shred behavior.
- [ ] Verify Vercel environment names, preview protections, production deployment assertions, rollback, and deployment aliases.
- [ ] Verify Stripe billing writer, workspace entitlement projection, webhook idempotency, and entitlement-loss propagation.
- [ ] Verify Sentry projects, privacy scrubbing, alerts, dead-man cron monitoring, and integration latency dashboards.
- [ ] Review CSP reports and enable enforced CSP per domain behind the documented rollback switches.
- [ ] Execute authenticated production-like suite journeys 1–8 with real membership and entitlement transitions.
- [ ] Run production restore/rollback drills and record demonstrated RPO/RTO.
- [ ] Run performance/accessibility/browser certification and obtain independent P0/P1 re-review.

Until every box has a dated receipt, the remediation validator must continue to report the program below 100% and launch remains blocked.
