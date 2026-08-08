---
title: Founder to-do consolidation audit
status: decided
date: 2026-08-08
owner: Signal Studio
---

# Founder to-do consolidation audit

## Decision

The HQ operator ledger is only for work that genuinely requires Ethan's
judgment, account ownership, legal authority, or payment. Engineering,
migrations, smoke tests, evidence gathering, and routine provider operations
belong in the agent execution queue.

Every one of the 91 ledger entries was rescanned against the current two-repo
topology, current source, GitHub state, Vercel projects/environments, migration
receipts, and live public routes. The audit changes the ledger from **59 open / 32
done** to **28 open / 63 cleared**. The residual list is evenly split: **14 quick
wins** and **14 longer calls**.

No email was sent or test-sent during this audit.

## Cleared by current evidence or consolidation

- `apply-sponsor-requests-migration` — superseded by the reset baseline.
- `apply-tasks-parent-invariant` — both triggers are in the reset baseline and
  the production migration workflow completed.
- `closed-beta-allowlist-env` — `SIGNAL_ALLOWLIST` exists on the single app.
- `confirm-board-truth-t114-t118` — superseded by T121–T132 and consolidated QA.
- `log-cycle-t107`, `log-cycle-timeline-db-credentials` — log-cycle and the
  Timeline repo were retired.
- `migrate-attachments-blob`, `premium-blob-storage` — one active Frankfurt
  Blob store is linked to `app`; the production token and storage seam exist.
- `premium-invite-access-policy` — shipped policy notice, no action.
- `premium-task-detail-review` — accepted direction shipped; T132 completed the
  production focus-window work.
- `provide-turso-platform-token` — the reset it gated completed.
- `schedule-sponsored-use-jobs` — `CRON_SECRET` exists in Studio Production and
  the scheduled route is configured.
- `staging-turso-db` — the retired Signal preview project was replaced by the
  unified app Preview database set.
- `venues-page-founding-25-copy` — the approved Founding 25 and terms are live.
- `verify-clerk-prod-env` — production keys exist, production demo/review mode
  is absent, and canonical signed-out routes fail closed to `/sign-in`.
- `migration-p10-003-stripe-app-domain` — the task assumed a Stripe allowlist
  that does not exist; Checkout URLs are supplied per session by the app.
- `page-deletion-signoff` — the old multi-repo inventory is superseded by the
  consolidated route contract; residual route hygiene is engineering work.

## Removed from the founder ledger and retained for agent execution

- `tasks-interaction-prerequisites`
- `planning-period-production-release`
- `migrate-venue-access-18-months`
- `load-national-schools-book`
- `seed-wedding-workspace`
- `turso-backups`
- `uptime-monitoring`
- `verify-suite-assertion-key-isolation`

These are not claimed complete. Their founder obligation is cleared because
they are operational or engineering work; the exact work is retained in
`docs/execution/founder-todo-agent-queue-2026-08-08.md`.

## Duplicate decisions consolidated

- `venue-contact-data-retention` and `eu-regions-dpas` now live in
  `gdpr-data-lifecycle`.
- `licensing-policy-ratification` and `trial-retention-policy` now live in the
  current commercial policy pack.
- `revoke-unused-turso-token` and `rotate-turso-platform-token` now live in
  `rotate-keys-post-reset`.

## Remaining quick wins

AI budget; private-repo protection stance; PostHog approval; Clerk restricted
mode; auth/billing delight scope; HQ identity defaults; Supabase deferral;
in-app themes; Resend domain verification; Upstash approval; npm trusted
publishing; Project/Season vocabulary; proof order; Studio preview-bypass
revocation.

## Remaining longer calls

Ambassador, identity, press, and venue collateral reviews; GDPR/legal
paperwork; product-hero review; launch go/no-go; the consolidated commercial
policy pack; Google sign-in safety matrix; legal publication; Irish company
registration; credential rotation; VAT/OSS/Stripe Tax; and Sentry account
authorization.
