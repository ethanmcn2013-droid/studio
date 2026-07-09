# Signal Studio — Licensing & Access design (buildable spec)

> **Any session start here.** This is the ratified, buildable spec for the licensing/entitlements/subscription backend and the HQ "Access" console. The one-paragraph decision lives in `content/hq/decisions/licensing-access-architecture.md`; the GDPR call in `content/hq/decisions/gdpr-data-lifecycle-policy.md`. Founder-gated items are operator-todos in `content/hq/operator-todos/` (`register-ltd-ireland`, `stripe-tax-eu-vat`, `gdpr-data-lifecycle`, `licensing-policy-ratification`). Produced by the `licensing-backend-design` workflow (28 agents, 4 architecture directions adversarially gated to a 9.9 bar) on 2026-07-09.

## Executive summary

Signal Studio already has the right spine: a separate `signal-entitlements` Turso DB that all four products read through `resolveEntitlement` (MAX-by-tier-rank, fail-open-to-free), in `src/lib/entitlements-db/`. **That core is close to 9.9 for correctness and must not be rebuilt.** The risk lives on the venue, code, batch, billing-lifecycle, and audit sides, plus two cross-cutting legal gaps (EU VAT, GDPR).

Make `signal-entitlements` the ONE store with ONE grant/revoke/extend API and a thin, safe, read-mostly HQ console over it. Graft on: an append-only, trigger-enforced `entitlement_events` audit ledger written in the SAME transaction as every mutation; a first-class `grant_batches` cohort object kept DISTINCT from venue `sponsors`; an allotment counter enforced by a race-safe conditional decrement; the Stripe lifecycle mapping (single signature-verified Tasks webhook as sole Stripe writer, one Price-ID map); and comps delivered as a grant OVERLAY (not 100%-off Stripe subscriptions).

## Recommended architecture

- Keep the two-DB split. Keep `resolveEntitlement` / `resolveEntitlementOrThrow` / `TIER_RANK` max-wins / fail-open-to-free exactly as-is (verified correct in `reads.ts`). Stripe = billing brain, Clerk = identity, the Turso table = access brain. Do NOT adopt Stripe Entitlements as the runtime authority; do NOT put the suite tier in Clerk as authority.
- Everything handed out becomes a typed row in ONE store via ONE writer:
  - **Paid access:** written ONLY by the single signature-verified Stripe webhook in Tasks, through `writeSharedEntitlement`/`expireSharedEntitlement`.
  - **Comps, cohorts, venue-couples:** written as a grant OVERLAY straight to a Clerk id (`source` in `compliments|batch_grant|venue_edition|student_edu`, `billing_state='none'`). The resolver unions paid + overlay at read time via MAX-by-rank. REJECT stripe-native 100%-off subscriptions for comps (they need a Stripe customer before grant and import resurrection/coupon-sprawl risk).
- Two distinct primitives, never collapsed: **`grant_batches`** = named cohort (press, friends, team); **`sponsors`** = venues/patrons with the paid ledger and allotment. Both feed the SAME `license_codes -> redemptions -> entitlement` chain, so analytics/attribution are one mechanism, but the operator sees two clearly different objects.
- The append-only `entitlement_events` ledger is the accountable history; the `entitlements` row stays the fast materialized projection (the resolver never folds events on the hot path). Every mutation writes its state change AND its ledger event in ONE libSQL transaction. The ledger is physically append-only via SQLite triggers + a per-row hash-chain.

## Data model

All changes are in the SHARED `signal-entitlements` DB, additive/nullable, as ordered migrations. Studio-local `entitlements`/`redemptions` copies retire after cutover.

**Migration 0001 — venue ledger + kind + counter** (closes confirmed drift: `0000_init.sql` provisioned a BARE `sponsors` table; a prior out-of-band `scripts/apply-venue-ledger.mjs` already ALTERed columns into prod, so verify before ALTER — use `ADD COLUMN IF` semantics / check existence, do not bare-ALTER):
`ALTER TABLE sponsors ADD`: `venue_plan TEXT NOT NULL DEFAULT 'none'`, `annual_amount_cents INT`, `founding_locked INT`, `term_starts_at INT`, `term_ends_at INT`, `paid_at INT`, `code_allotment INT`, `codes_issued INT NOT NULL DEFAULT 0` (maintained counter = single runtime headroom source), `kind TEXT NOT NULL DEFAULT 'venue'`. `CREATE INDEX sponsors_venue_plan_idx`. Then a validated one-time backfill from the studio-local sponsors ledger; verify row-count + per-sponsor cash parity; abort+log on mismatch. Nothing counts as revenue until parity passes.

**Migration 0002 — batches, ledger, events, indexes:**
- `entitlements ADD` (all nullable): `batch_id TEXT`, `granted_by TEXT` (operator id / `stripe-webhook` / `redeem-flow` / `reconcile-cron`), `grant_reason TEXT`, `billing_state TEXT` (`active|trialing|past_due|canceled|refunded|disputed|none`), `grace_until INT`, `current_period_end INT`, `cancel_at_period_end INT`, `stripe_price_id TEXT`, `email_hash TEXT` (verified-email hash for search + GDPR shredding; NOT plaintext), `clerk_id_dead INT`. Keep coarse `status` (`active|expired|revoked`) as the gate; `billing_state` is the WHY.
- TWO partial unique indexes: `entitlements_dedup_ref ON (user_clerk_id, source, source_ref) WHERE source_ref IS NOT NULL`; `entitlements_dedup_sub ON (user_clerk_id, stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL` (closes the Stripe null-ref race). Dedup existing duplicate rows BEFORE creating either index.
- `grant_batches`: `id, slug UNIQUE, label, kind (press|partner|friends|team|cohort|pilot), tier DEFAULT 'workspace', allotment INT (null=unlimited), reason NOT NULL, granted_by, default_expires_at INT, perpetual INT DEFAULT 0, closed_at INT, timestamps`.
- `entitlement_events` (append-only): `id, entitlement_id (nullable), user_clerk_id, sponsor_id, batch_id, actor_id, actor_name, action (grant|revoke|expire|extend|reinstate|redeem|mint|refund|dispute|repoint|export|view_as), reason, before_json, after_json, origin, prev_hash TEXT, row_hash TEXT (hash-chain over non-PII fields only), stripe_event_id, created_at`. Indexes on `(user_clerk_id, created_at)`, `(entitlement_id)`, `(batch_id)`, `(sponsor_id)`, `(action)`. SQLite triggers `RAISE(ABORT)` on any UPDATE or DELETE.
- `allotment_ledger`: `id, sponsor_id, delta INT, reason NOT NULL, actor_id, term_starts_at, term_ends_at, created_at`. Provenance for "why 25 codes"; `codes_issued` is the runtime cap; reconciled nightly against `SUM(delta)` and `COUNT(license_codes)`.
- `license_codes ADD`: `batch_id TEXT` (nullable), `recipient_email_hash TEXT` (recipient-lock for high-tier cohort codes). Shared DB becomes canonical for `license_codes`/`redemptions`.

**Vocabulary:** `ENTITLEMENT_SOURCES` gains `batch_grant`. `TIER_RANK` unchanged. New resolver output `readOnly:boolean` derived (Event-expired distinguishable from never-paid-free) WITHOUT changing the status gate. New `STRIPE_PRICE_MAP` next to `tiers.ts`: Pro EUR12/mo, Pro EUR100/yr, Student EUR9.99/yr -> `workspace`; Event EUR89 -> `event`; each with `(tier, source, cadence)`. Student is a mapping (`workspace` + `student_edu`), NOT a new tier.

## Use-case flows

**Bulk free Pro to a cohort (most not signed up yet):** Access > Give access. Paste emails/ids, pick Pro (->workspace), expiry pre-filled 12mo, one reason, name the batch. ONE submit -> ONE outcome table. Registered -> DIRECT overlay grant idempotently (`source='batch_grant'`, `source_ref='${batch.slug}:${clerkId}'`, `batch_id`, `billing_state='none'`). Unregistered -> auto-mint a recipient-locked `license_code`. NO orphan email rows. Output: "42 granted, 6 codes to send, 2 invalid" + CSV. Each row writes one `entitlement_events` line in the same transaction. Re-paste = no-op via deterministic `source_ref` + unique index.

**Venue distribution:** Access > Onboard a venue (wizard, no terminal): create `sponsor` (`kind='venue'`), record payment (mark-paid REQUIRES non-null allotment; writes `allotment_ledger +N`; `isPaidVenue` true only when cash landed), set term. Mint codes: `UPDATE sponsors SET codes_issued=codes_issued+N WHERE codes_issued+N <= code_allotment`; zero rows -> refuse ("would exceed Lamb's Hill allotment: 3 of 10 remaining"). Couple redeems at `/redeem/[code]`: reserve-then-commit `UPDATE license_codes SET status='redeemed' WHERE code=? AND status='minted'`, then ONE shared-DB transaction writes wedding entitlement + redemptions row + redeem event, keyed on an idempotent redemption key (retry re-attaches to same entitlement). Trace couple<->venue both ways.

**Subscription tracking:** every paid row written by the single Tasks Stripe webhook via the shared writer. Person view resolves current tier via `resolveEntitlement`, renders `billing_state` as one calm human line ("Active, payment retrying until 24 Jul"). `invoice.paid` pushes `current_period_end` + `expires_at` forward so annual renewals just work. Health tab: active-by-tier, in-grace, upcoming expiries (30/60/90), reconcile mismatches, shared-DB reachability dot.

**Revocation/expiry:** every mutation targets entitlement `id`, never `source_ref`. Single revoke: modal restating person/tier/effect + mandatory reason; because access = MAX over rows, surface ALL of the user's active rows and offer "revoke this row" vs "revoke ALL access for this person". Bulk: mandatory dry-run listing the frozen row-id set, acknowledged count, type-to-confirm ("type REVOKE 42"), a hard cap above which two-person approval is required, deferred commit after a 30-60s undo window; commit only against the frozen set (reject if drifted). Expiry (natural) vs revoke (for-cause, reason) are distinct verbs; nothing hard-deleted, so undo is a `reinstate` event.

**Person lookup:** one search box (email / Clerk id / code / venue slug). Email resolves via Clerk email->id AND the stored `email_hash` index (both maintained). Person view: resolved tier, every row (active/expired/revoked) with source/sponsor/batch/granted/expires + one-line billing state, redemption history, provenance, full tamper-evident timeline. Read-only banner-flagged "View as" (logged as `view_as`). Account-merge -> operator "re-point access" verb moves entitlements from dead id to live id (logs `repoint`).

## HQ console spec

ONE hub registered as **"Access"** in `operating-system.ts` under loop `run`, audience `['founder','operator']`, added to `hq-shell` operatorLinks and Cmd-K (fixes today's orphaned `/hq/entitlements`, verified absent from nav/HQ_HUBS/palette). Operator-only; kept out of shareholder Reporting/Founders-Circle. Fold the existing `/hq/partners` venue funnel INTO the Venues tab and retire the standalone route (one venue surface).

Design register held exactly: paper white, ink #111, one indigo reserved for the single primary action per screen, hairline dividers, mono uppercase eyebrows, no gradients/glow. Status by a muted dot or hairline left-rule (active=ink, grace/past_due=quiet grey, revoked/disputed=the one rose hairline). Danger signaled by copy + friction, never loud red fills.

Lead with THREE task-named entry points: **[Give access] [Onboard a venue] [Find someone]**. Five tabs:
1. **Today** — landing worklist: expired overnight, new redemptions, venues near allotment, entitlements in grace about to hard-expire, reconcile mismatches with one-click "Reconcile now", shared-DB reachability dot.
2. **Roster** — one search box; filters (tier, source, status, billing_state, venue, batch, expiry window); paid/comp tag on every row; CSV/JSON export on any filtered view (export writes an `entitlement_events` row).
3. **Person** (`/hq/access/[lookup]`) — the spine above.
4. **Batches** — cohorts (label/kind, allotment vs granted/redeemed, expiry, whole-batch revoke with dry-run). "Activated" defined per delivery mode.
5. **Venues** — per venue: plan, paid status (`isPaidVenue`; signed != revenue), term, cash, allotment vs minted vs redeemed vs remaining, couples traced back, mint-codes (cap-enforced), revoke-a-code, revoke-whole-pool, drift flag ALWAYS paired with "Reconcile now" + a "last reconciled" timestamp.

Tier pickers render MARKETING names (Free/Student/Pro/Event) mapped to DB codes with a "Pro = workspace" helper; non-purchasable tiers (`wedding`/`studio`) hidden from free-hand grant selection (structural fat-finger prevention). Every server action re-verifies per-operator HQ identity, validates against locked enums, targets entitlement id, writes an event in the same transaction, then `revalidatePath`. Copy runs through the `brand-voice` skill.

## Billing integration (Stripe) — Phase 4, gated on Ltd registration

Stripe = source of truth for PAID access; the shared table is a projected read-cache. Tasks keeps the SINGLE signature-verified webhook as the ONLY Stripe writer, via `writeSharedEntitlement`/`expireSharedEntitlement`. Never provision from the checkout success redirect. Stamp `client_reference_id` = Clerk user id + `metadata.clerk_user_id` on the Session, Customer, and Subscription.

One `STRIPE_PRICE_MAP` (Price ID -> `(tier, source, cadence)`). Two shapes: RECURRING (Pro monthly/annual, Student annual) = `mode 'subscription'`; ONE-TIME (Event EUR89) = `mode 'payment'`, self-computed `expires_at = now + 365d`.

Event set (verify `Stripe-Signature` on RAW body; dedup on `event.id` via a UNIQUE `processed_webhooks(source, event_id)`; return 2xx fast): `checkout.session.completed` (branch on `session.mode`); `invoice.paid` (extend `current_period_end` + `expires_at`); `invoice.payment_failed` (`billing_state='past_due'`, `grace_until ~16d`, and CRITICALLY hold `expires_at` forward to `grace_until` so the resolver keeps access during dunning); `customer.subscription.updated` (derive access from `subscription.status`, order-independent; UPSERT by `stripe_subscription_id`); `customer.subscription.deleted` (terminal; cancel is `cancel_at_period_end=true` so access lasts to period end, revoke only on `deleted`); `charge.refunded` (expire; Event -> read_only, but a REFUNDED Event loses read access too); `charge.dispute.created` (`status='revoked'`, `billing_state='disputed'`, operator alert, unwind the distribution graph). Everything else: logged default branch.

`writeSharedEntitlement` becomes a real UPSERT: `INSERT ... ON CONFLICT (dedup indexes) DO NOTHING RETURNING id`, so a benign duplicate returns `{created:false}` with the existing id; the backoff loop distinguishes a constraint violation (return existing) from a transient failover (retry) and NEVER re-throws a unique violation as an operator error. Every writer sets a non-null deterministic `source_ref`. An unknown-tier guard rejects any write whose tier is not in `ENTITLEMENT_TIERS` and surfaces it on Health.

## Safety & audit

- **Audit first, before any new mutation UI.** Append-only `entitlement_events` enforced by SQLite triggers (`RAISE(ABORT)` on UPDATE/DELETE) + per-row hash-chain (`prev_hash`/`row_hash`, over non-PII only). Every mutation + its event in ONE libSQL transaction.
- **Per-operator identity is a launch gate** (see `hq-per-operator-identity` to-do): move HQ off the shared cookie (or at minimum a required named-operator selection captured into `actor_id`/`actor_name`). Without it the ledger is theatre.
- **Blast-radius controls live in the writer/action/API layer**, not the React UI, so the `STUDIO_OPS_SECRET` curl routes and the reconcile cron cannot bypass them: mandatory reason on revokes, a bulk hard cap, a per-operator velocity cap, an anomaly alert. Graduated UI friction on top (dry-run, type-to-confirm, two-person approval above cap, deferred-commit undo that PREVENTS the outage). Undo refuses to reinstate a row whose backing Stripe subscription is genuinely gone.
- **Over-allotment is a hard DB invariant** (conditional decrement), not an app read. Paid venues MUST have a non-null allotment; issuing gated on an active paid term. Redemption = reserve-then-commit + single-DB transaction + idempotent redemption key; until the Tasks redemption write moves into a shared-DB writer, a reconcile job repairs code-redeemed-but-no-entitlement orphans. Public redeem is IP rate-limited with backoff; high-tier cohort codes recipient-locked.
- **Identity edge cases:** emails with no Clerk user route to CODES mode (never orphan rows). Account-merge -> `re-point access` verb + `clerk_id_dead` detection. Email change re-syncs `email_hash`; batch idempotency keys on resolved Clerk id, not mutable email.
- **Refund/chargeback graph unwind** (not just a status flip): a venue reversal flags/revokes minted-but-unredeemed codes and surfaces redeemed couples for operator decision; a disputed comp cancels any underlying Stripe object.
- **Reconcile cron** gets the same envelope as bulk operator actions (per-run cap, per-row event, alert/pause threshold) + a dead-man's-switch on the Health strip. Fail-open-to-free stays; the Health reachability dot makes an outage visible.
- **GDPR** (decided, see `gdpr-data-lifecycle-policy`): PII stored as salted hashes only; hash-chain excludes PII so crypto-shred doesn't break it; PII purged 24mo after entitlement end or on erasure; anonymized financial/audit skeleton retained 6yr; Clerk `user.deleted` triggers crypto-shred.

## Migration from today

Ordered, parity-validated, phase-shippable; never touches the resolver's fail-open contract.
1. **0001** venue ledger + kind + counter, with the studio-local -> shared backfill and cash-parity gate. Highest priority (live shared DB physically lacks/partially-has these columns; verify existence, do not bare-ALTER). Until parity passes, HQ Traction must not render any venue as revenue.
2. **0002** batches + ledger + events + indexes (additive). Dedup existing duplicates before the unique indexes. Backfill `email_hash` via a one-time Clerk lookup.
3. **Writer hardening**: UPSERT ON CONFLICT DO NOTHING RETURNING; unknown-tier guard; non-null `source_ref` on every writer; expire/revoke target id only; mutation+event in one transaction; per-operator identity. All BEFORE any new mutation UI.
4. **Codes cutover** (the only real cutover): repoint `src/lib/redeem/lookup.ts` to shared; move the redemption WRITE into a shared-DB writer Tasks calls; verify shared vs studio-local vs Tasks counts via reconcile; freeze then drop studio-local mirrors after a soak.
5. **Stripe wiring** (only after step 3).
6. **Console**: register the Access hub, fold `/hq/partners` in.

## Phased build plan

- **Phase 0** — Migration + backfill (0001, validated backfill; 0002 batches/ledger/events/indexes; `email_hash` backfill).
- **Phase 1** — Writer hardening + audit ledger + per-operator identity (launch gate).
- **Phase 2** — Grace (hold `expires_at` forward) + `readOnly` resolver output + UPSERT-by-subscription-id + same-tier tie-break.
- **Phase 3** — Codes cutover + atomic idempotent redemption + race-safe allotment + reconcile for orphans + IP rate-limit + recipient-lock.
- **Phase 4** — Stripe webhook wiring + refund/chargeback unwind + reconcile cron (GATED on `register-ltd-ireland`).
- **Phase 5** — The Access hub (five tabs, task entry points, marketing-name pickers, graduated friction, revoke-all + re-point, audited View-as/exports).
- **Phase 6** — Legal: EU VAT/Stripe Tax/OSS (GATED on registration) + GDPR crypto-shred/retention/export (decided).

## Scorecard (vs 9.9)

Correctness ~9.9 (last tenth earned only when the Tasks redemption write moves into the shared DB — until then cross-DB redemption is contract-plus-reconcile, not one transaction). Operational safety ~9.9 (sliver lost: solo-founder two-person approval + per-operator identity are partly policy; GDPR-shredding a hash-chained ledger is genuinely hard, flagged). Founder usability ~9.9 (last tenth depends on the venue wizard fully replacing the CLI scripts). The design names exactly which items must ship, in which order, for the tenths to be earned rather than asserted.

## Operator decisions (see operator-todos)

`register-ltd-ireland` (upstream gate); `stripe-tax-eu-vat` (VAT/OSS + Stripe Tax, gated, VAT-inclusive display locked); `gdpr-data-lifecycle` (DPAs + privacy policy; mechanism decided); `licensing-policy-ratification` (comp/venue/student/chargeback/Event-read-only/redemption-ownership/data-residency).

## Open engineering questions

1. Does the Tasks team move the redemption WRITE into a shared-DB writer this cycle, or ship reconcile-and-compensate first? (Biggest correctness dependency, outside the studio repo.)
2. Real per-operator HQ identity before 1 Sep, or a named-operator prompt over the shared cookie as interim?
3. Confirm `BEGIN IMMEDIATE` / driver transaction wrapper is available on the libSQL client for the multi-write transactions.
4. Confirm the hash-chain covers only non-PII so crypto-shredding does not break tamper-evidence.
5. Student verification method + fraud tolerance for the EUR 9.99 tier.
6. EU data-residency for entitlements + audit (affects Turso region).
