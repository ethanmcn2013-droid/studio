---
id: licensing-access-architecture
title: The licensing and access system builds on the existing entitlements spine, with one HQ "Access" hub to run it.
category: Access
date: 2026-07-09
status: Active
reviewDate: 2026-09-01
relatedObjects: [Entitlements, Licensing, Venue Editions, Batch grants, Stripe, Signal HQ, Access hub]
---

## Decision

Do not rebuild the access core. The `signal-entitlements` database that all four products already read through `resolveEntitlement` (max-by-tier-rank, fail-open-to-free) stays the source of truth for access. Stripe stays the billing brain. Clerk stays identity. We add the missing plumbing around that spine and a single, calm HQ console on top.

Everything the founder hands out becomes a typed row in one store, written through one gated path, recorded in one append-only history log:

- Paid access is written only by the single signature-verified Stripe webhook (in Tasks), through the shared writer.
- Comps, cohorts, and venue couples are written as a grant overlay straight to a Clerk id (`billing_state = 'none'`). The resolver unions paid and overlay at read time. We reject stripe-native 100%-off subscriptions for comps (they import resurrection and coupon-sprawl risk and need a Stripe customer before the gift).

Two primitives are kept deliberately separate and never collapsed:

- `sponsors` = venues/patrons (they pay, they hold a code allotment).
- `grant_batches` = named cohorts (press, friends, team) granted in bulk.

Both feed the same `license_codes -> redemptions -> entitlement` chain, so tracking and attribution are one mechanism, but on screen they are two clearly different objects.

The founder gets one registered hub, **Access**, in the run loop, with three task-named entry points (Give access, Onboard a venue, Find someone) over five tabs (Today, Roster, Person, Batches, Venues). A non-engineer never meets the primitive.

## Reason

The adversarial review (4 architecture directions, 3 skeptics each, plus a completeness critic) scored every direction 9.27-9.33 and passed none at 9.9. The gap was never the core resolver (verified correct); it was the venue, code, batch, billing-lifecycle, and audit sides, plus two cross-cutting legal gaps no direction caught: EU VAT and GDPR. The chosen synthesis is the lowest-risk framing (never touches the load-bearing resolver) and front-loads the unglamorous plumbing that every gate said must land before any new power ships.

## Scope

Build order, each phase independently shippable and reversible:

- **Phase 0 — Migration + backfill.** `0001` adds the venue-ledger columns the live shared DB physically lacks (a prior out-of-band script added them untracked, so a naive migration would error on prod); validated studio-local -> shared backfill with cash-parity check. `0002` adds batches, the append-only event ledger (trigger-enforced + hash-chained), the entitlement columns, and two partial unique indexes.
- **Phase 1 — Writer hardening + audit ledger + per-operator identity (launch gate).** UPSERT that never re-throws a duplicate; mutation and its log line in one transaction; unknown-tier guard; blast-radius controls in the writer/API layer so curl and cron cannot bypass them; per-operator identity so the log answers "who did this".
- **Phase 2 — Grace + read-only.** Grace holds `expires_at` forward so a dunning customer is not dropped; a resolver-surfaced `readOnly` signal so the Event "keeps reading forever" promise is deterministic.
- **Phase 3 — Codes cutover + atomic redemption + venue allotment.** One canonical code store; race-safe conditional-decrement cap; reserve-then-commit redemption with an idempotent key and a reconcile for orphans.
- **Phase 4 — Stripe webhooks.** Single verified writer; one Price-ID map; refund/chargeback graph unwind; a reconcile cron with a per-run cap, per-row event, and alert threshold.
- **Phase 5 — The Access hub.** The console above; fold `/hq/partners` in so there is one venue surface; fix today's orphaned `/hq/entitlements` (absent from nav and Cmd-K).
- **Phase 6 — Legal (launch-blocking).** EU VAT/Stripe Tax/OSS and GDPR data lifecycle. See operator-todos.

Honest scorecard: correctness, operational safety, and founder usability each land ~9.9 on paper. The last tenth on correctness is earned only when the Tasks redemption write moves into the shared DB (until then cross-DB redemption is a contract-plus-reconcile, not a single transaction). The last tenth on safety is partly policy for a solo founder (two-person approval, per-operator identity). This is named, not hidden.

## Notes

Founder-gated decisions that gate the build are filed as operator-todos: `stripe-tax-eu-vat`, `gdpr-data-lifecycle`, `hq-per-operator-identity`, and `licensing-policy-ratification`. Nothing is built until those are decided.

Open engineering question (biggest correctness dependency, outside the studio repo): does the Tasks team move the couple-redemption write into a shared-DB writer this cycle, or do we ship the reconcile-and-repair contract first and consolidate later.

Full design record (data model, table-level schema, the five HQ tabs, the Stripe event set, migration ordering, and the scorecard) was produced by the licensing-backend-design workflow on 2026-07-09 and this decision is its ratified summary.
