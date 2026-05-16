---
title: Pricing and entitlements — one DB, every product
slug: pricing-and-entitlements
lens: Processes
owner: Ethan
lastVerified: 2026-05-16
links: [signal-studio-umbrella, five-products-as-a-system, turso-databases-and-reads, log-cycle-cross-repo-writer]
tags: [pricing, entitlements, Stripe, free, event, wedding, workspace, studio, Venue Edition, sponsors-ledger, entitlementsDb, signal-entitlements DB, entitlements-shared, resolveEntitlement, /api/checkout, STRIPE_SETUP, STUDIO_OPS_SECRET, ENTITLEMENTS_OPS]
references: [signalstudio.ie/pricing, src/app/pricing/, src/app/hq/entitlements/, src/app/api/internal/entitlements/grant/, src/app/api/internal/entitlements/expire/, src/lib/entitlements/, src/lib/entitlements-db/, src/lib/entitlements-db/client.ts, src/lib/entitlements-db/schema.ts, src/lib/entitlements-db/reads.ts, src/lib/entitlements-db/writes.ts, drizzle-entitlements/, drizzle-entitlements.config.ts, ~/Projects/personal/tasks/src/app/api/checkout/, ~/Projects/personal/tasks/src/app/api/webhooks/stripe/, ~/Projects/personal/tasks/src/lib/entitlements-shared/, ~/Projects/personal/roadmap/src/lib/entitlements-shared/, ~/Projects/personal/analytics/src/lib/entitlements-shared/, ~/Projects/personal/notes/src/lib/entitlements-shared/, docs/ENTITLEMENTS_OPS.md, ~/Projects/personal/tasks/docs/STRIPE_SETUP.md]
summary: One pricing surface at signalstudio.ie/pricing. Five tiers, one shared signal-entitlements DB, copy-pasted resolver in every product. Tasks owns Stripe; Studio owns admin grants.
status: complete
pinned: false
execWhat: One pricing page for the whole suite, one shared record of who has paid for what, five products that all read from the same source of truth.
execMatters: Pricing honesty is the lever between the suite being a hobby and a business. Until 2026-05-14, only Tasks enforced the paywall — every other product was effectively free. Now every product gates against the same record, so paying customers get access everywhere within seconds, and non-paying readers hit the same gates everywhere.
execRisk: If the shared payments record goes wrong, customers either lose access they paid for (refund risk, churn risk) or get access they didn't pay for (revenue leak). A daily reconciliation job is the safety net; reading these atlas pages is how the operator stays oriented when things drift.
---

## WHAT

Pricing across the five products is unified at `signalstudio.ie/pricing`. Five tiers — `free`, `event`, `wedding`, `workspace`, `studio` — ranked 0–4. One shared `signal-entitlements` Turso DB carries every active grant. Every product reads from it via a copy-pasted `entitlements-shared` module — no monorepo, no shared package, just identical code in each repo. Tasks owns the Stripe wiring (webhook + checkout). Studio owns the admin surfaces (operator grants, HQ list, reconcile) and the writer-side library.

The entitlements sprint E-1 → E-8 closed this gap on 2026-05-14. Before the sprint, only Tasks enforced tiers; Roadmap, Analytics, and Notes were paid-tier-blind; Studio's `getEntitlement` was dead code. After the sprint, every product gates against the same DB.

```mermaid
flowchart LR
  U[user on /pricing] --> CTA[Buy CTA]
  CTA --> TC[tasks.signalstudio.ie/api/checkout]
  TC --> ST[Stripe Checkout]
  ST -->|webhook| TW[tasks /api/webhooks/stripe]
  TW -->|dual-write| TL[(tasks local DB)]
  TW -->|dual-write| SE[(signal-entitlements DB)]
  SH[studio /hq/entitlements] -->|grant| SE
  SO[studio /api/internal/entitlements/grant] -->|curl| SE
  SE --> R1[tasks read]
  SE --> R2[roadmap read]
  SE --> R3[analytics read]
  SE --> R4[notes read]
  SE --> R5[studio read]
```

## WHO

Ethan owns the pricing surface, the shared DB, the admin surfaces, and the tier vocabulary. Stripe handles payments; Vercel hosts the Webhook receiver. No third-party operators have grant authority.

## WHERE

- **`signalstudio.ie/pricing`** (studio repo, `src/app/pricing/`) — the unified pricing surface. Per-product `/pricing` paths 308 to this one.
- **Shared store** — `libsql://signal-entitlements-ethan387.aws-eu-west-1.turso.io`. Migrations in `drizzle-entitlements/`. Connection envs: `TURSO_ENTITLEMENTS_DATABASE_URL` (required), `TURSO_ENTITLEMENTS_AUTH_TOKEN` (required in prod). Tables: `entitlements`, `sponsors`, `license_codes`, `redemptions`, `processed_webhooks`.
- **Copy-pasted resolver** — `src/lib/entitlements-shared/` in `tasks`, `roadmap`, `analytics`, `notes`. Exports `resolveEntitlement`, `resolveHighestTier`, `tierAtLeast`. The tier ranking (`free: 0` … `studio: 4`) lives in `tiers.ts` inside every repo's copy.
- **Studio's writer side** — `src/lib/entitlements-db/`: `client.ts` (the lazy `entitlementsDb()` singleton — throws on first use, not at import, so Preview builds with no Turso envs don't crash; cached after first call), `schema.ts` (canonical Drizzle schema for all five tables + tier/source/status enums + `sponsors` paid-ledger + `isPaidVenue()`), `reads.ts` (`resolveEntitlement`/`resolveEntitlementOrThrow`/`listEntitlements`, free-default on any DB error), `writes.ts` (`writeSharedEntitlement` idempotent on `(userClerkId, source, sourceRef)` with 3-attempt backoff, `expireSharedEntitlement`), `tiers.ts` (`TIER_RANK` 0–4 + `tierAtLeast`). The older `src/lib/entitlements/index.ts` (`getEntitlement` against Studio's *local* `@/lib/db`) survives but is legacy — the `entitlements-db/` reader is the live path.
- **Tasks Stripe wiring** — `~/Projects/personal/tasks/src/app/api/checkout/` and `~/Projects/personal/tasks/src/app/api/webhooks/stripe/`. The webhook dual-writes to Tasks's local DB and to the shared store, idempotently via `processed_webhooks`.
- **Studio admin** — `src/app/hq/entitlements/` (UI, cookie-gated), `src/app/api/internal/entitlements/grant/` and `.../expire/` (curl path, Bearer `STUDIO_OPS_SECRET`). Off-Stripe grants carry `origin: studio-ops` or `origin: studio-hq` in metadata for audit grep.
- **Operator runbooks** — `docs/ENTITLEMENTS_OPS.md` (grant, expire, reconcile, audit, troubleshooting), `~/Projects/personal/tasks/docs/STRIPE_SETUP.md` (price IDs + webhook + envs).

## HOW

The resolve path (read side) is simple. The grant path (write side) is the part with invariants.

### Reading (every product, every request)

1. Server-side code calls `resolveEntitlement(userId)` from its local `entitlements-shared/reads.ts` (Studio uses `src/lib/entitlements-db/reads.ts`).
2. The resolver queries the shared Turso DB for active entitlements (status `active`, not expired).
3. If multiple entitlements exist, the highest by `TIER_RANK` wins.
4. The gate uses `tierAtLeast(currentTier, "workspace")` (or similar) to decide whether to allow the action. Any DB error returns `free` — entitlements never take a product down. Callers needing to distinguish "user is free" from "DB unreachable" call `resolveEntitlementOrThrow`.

### Granting via Stripe (the happy path)

1. User clicks CTA on `signalstudio.ie/pricing`. The CTA deep-links to `tasks.signalstudio.ie/api/checkout?tier=workspace` (or `&interval=annual`, or `tier=event`).
2. Tasks's checkout route mints a Stripe Checkout session and redirects.
3. User pays. Stripe POSTs a webhook to Tasks's `/api/webhooks/stripe`.
4. The webhook validates the signature, looks up the price → tier mapping, and **dual-writes** the entitlement: one row in Tasks's local DB (for Tasks's own historical reasons) and one in the shared `signal-entitlements` DB (the canonical store every product reads).
5. The webhook records the Stripe event id in `processed_webhooks` so retries are idempotent.
6. Within seconds, every product's next `resolveEntitlement` call sees the new tier.

### Granting off-Stripe (operator path)

Two surfaces for support, pilot ops, and comp issuance:

- **HQ UI** at `/hq/entitlements` — cookie-gated; list, grant, expire from a form.
- **Internal API** at `/api/internal/entitlements/grant` and `/expire` — Bearer `STUDIO_OPS_SECRET`, timing-safe compared, curl-friendly, scriptable. Grant validates `tier` against `ENTITLEMENT_TIERS` and `source` against `ENTITLEMENT_SOURCES`, computes `expiresAt` from `durationDays`, and writes via `writeSharedEntitlement` (idempotent on `(userClerkId, source, sourceRef)` — re-running the same curl returns `created: false`). Off-Stripe grants carry `origin: studio-ops` (or `studio-hq`) plus an ISO `grantedAt` in metadata so audit grep can tell paid-Stripe from operator-issued. Expire matches by `stripeSubscriptionId` first, then `sourceRef`.

### The sponsors paid-ledger (Venue Edition)

The `sponsors` table carries the paid Venue Edition ledger, ratified 2026-05-16 (`venue-editions-paid-tier` — the venue pays, not the couple). Additive, nullable columns: `venuePlan` (`none`/`pilot`/`founding`/`paid`), `annualAmountCents`, `foundingLocked`, `termStartsAt`, `termEndsAt`, `paidAt`, `codeAllotment`. `isPaidVenue()` returns true only when `venuePlan` is `founding` or `paid` **and** `paidAt` is set — cash landing is the gate, not the plan label. Shape is kept identical to Studio's local `src/lib/db/schema.ts` so the stack can dual-write sponsor rows the same way it dual-writes entitlements. The public surface is `/pricing` §6.5 "For venues": €1,500–€4,000 a year by venue size, with the first fifteen venues locking €1,500 for as long as they stay (`foundingLocked`). The Workspace tier also gained an annual prepay link — `€120 a year` → `tasks.signalstudio.ie/api/checkout?tier=workspace&interval=annual`.

### Reconcile sweep (the safety net)

A daily reconcile sweep piggybacks on Tasks's existing digest cron. It walks Tasks's local entitlements and asks the shared writer to mirror anything missing, idempotently. `writeSharedEntitlement` retries transient errors with backoff (3 attempts, exponential). Drift between local and shared should be impossible in steady state; the sweep makes recovery from an outage automatic.

## WHY

The cheapest version of "five products, one paywall" is a monorepo. Rejected: each product would have to coordinate releases, and a bad migration anywhere would break entitlement checks everywhere. The expensive version is a separate billing service. Rejected: too much weight, too much SPOF.

The shape that earned the build is the middle path — separate repos, separate local DBs, *one* shared store, copy-pasted resolver code. The duplication is the feature, not the cost: each repo can change its read shape without coordinating, and the resolver code is small enough (~80 lines) that drift between copies is rare and visible.

The dual-write from Stripe webhook is the load-bearing detail. Without it, Tasks would be a special citizen — the one product whose local DB is canonical — and the other four would be downstream readers. With it, the shared DB is canonical, Tasks is just the writer (because Stripe needs *some* product to host the webhook), and any product could host the writer if Tasks ever stops being the right host.

The five-tier vocabulary (free / event / wedding / workspace / studio) was chosen to match the audience archetypes in BRAND.md §2.1. Tiers that don't map to a real audience archetype don't get a name. The temptation to add a "team" tier was deliberately refused — see [[signal-studio-umbrella]] for the v1 refusal list. The paid Venue Edition is deliberately *not* a sixth tier — a venue's couples redeem to `wedding`-tier entitlements; "Venue Edition" lives in the `sponsors` ledger, not in `ENTITLEMENT_TIERS`, so the gate vocabulary stays at five.

## WHEN — current state

- E-1 through E-8 shipped 2026-05-14. All five products enforce tiers against the shared DB.
- Stripe is sandbox-wired end-to-end. Live mode promotion is an operator action (see entitlements sprint operator action #1 in phase.md).
- A `?status=checkout-offline` banner renders on `/pricing` if Stripe envs aren't yet set in production, so the umbrella never silently grants free upgrades during the configuration window.
- 5 changelogs backfilled across the suite. 3 runbooks committed.
- The tier vocabulary is canonical — any new tier requires editing `TIER_RANK` in every repo's `entitlements-shared/tiers.ts`. The copy-paste cost is the deliberate price for not having a monorepo.
- S·26 (2026-05-14) made /pricing mobile-correct: Workspace promoted to top of stack ≤640px via `order-first md:order-none`, tier CTAs swap from inline-link to solid pill on mobile via a new `.pricing-tier-cta` class, comparison table `hidden md:block` (was 760w in 340w scroll parent). Tier model, prices, Stripe wiring, and entitlements DB all unchanged.
- A·5 (2026-05-15, Analytics code-review remediation) closed a gate bypass without touching the shared resolver or tier model: Analytics's `sendTestBriefingAction` (the "send a test now" button) had no entitlement check, so a free user could spam test sends every 60s and bypass the `workspace`-tier gate the cron enforces. It now calls the same `resolveEntitlement` + `tierAtLeast("workspace")` path. `tiers.ts` also gained regression-test coverage (`tiers.test.ts`) — the ranking that decides who pays was previously untested. Contract, vocabulary, and DB shape unchanged.
- T·50 (2026-05-15, code-review hardening) touched the Tasks read + webhook paths without changing the tier model, prices, or DB shape: (a) Tasks's `getEffectiveTier` now returns the **rank-max of the shared resolver and the local entitlements table**, not shared-first. The old shared-first short-circuit could silently downgrade a customer whose paid grant still lives only in Tasks's local DB during the E-3.2 writer cutover — rank-max is downgrade-proof and collapses back to a plain shared read once the local table empties. (b) The Stripe webhook's `processed_webhooks` dedup guard was repaired — `alreadyProcessed()` cast `db.run()` (a libSQL ResultSet) as a row array, so it always returned false and the dedup table never actually deduped; idempotency had been resting entirely on the `notes`-field compensator. The dual-write contract in the HOW section above is unchanged; this only fixed the guard that was supposed to make retries cheap.
- S·37 (2026-05-16) shipped the paid Venue Edition: `/pricing` §6.5 surface, `sponsors` paid-ledger columns (`venuePlan`/`annualAmountCents`/`foundingLocked`/`termStartsAt`/`termEndsAt`/`paidAt`/`codeAllotment`), `isPaidVenue()`, and the Workspace `€120/yr` annual checkout link. The entitlement tier vocab (`free`/`event`/`wedding`/`workspace`/`studio`, `TIER_RANK` 0–4) is unchanged — a paid venue resolves to a `wedding`-tier entitlement per redeemed couple; "Venue Edition" is a sponsor-ledger plan, not a new entitlement tier.
- S·42 (2026-05-16) made the shared-DB client lazy: `entitlementsDb()` throws on first use rather than at import, so Preview builds with no Turso envs no longer fail. Reader contract, tier model, and DB shape unchanged.
