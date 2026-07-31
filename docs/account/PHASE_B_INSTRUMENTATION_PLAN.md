# Phase B — Sponsored-use instrumentation plan

Status: **B0–B6 built and tested · applying the migration is the only gate left**  
Date: 2026-07-26  
Owner: founder + Studio eng  
Depends on: Account Brief HQ preview (shipped), Venue Portal Phase A contracts  
Out of scope for this plan: public Account route, sponsor membership, entitlement mutation

> Note: Historical docs call this **Phase B**. It is the next instrumentation
> cycle after Account V1 live access preview — not a new product surface.

## Goal

Turn Account Usage from honest `unavailable` into privacy-bounded aggregate
evidence that answers:

1. Did sponsored recipients reach a first useful action?
2. Are they still active recently?
3. Did use continue after ~30 days?
4. Which products were reached — without exposing private work?

Exit gate: projection + tests green; **no public portal route**; HQ Account
live preview can render real coverage states (`complete` / `partial` /
`suppressed` / `unavailable`) from aggregates.

## Non-goals

- Client-side analytics SDKs that see note/task content
- Workspace names, emails, Clerk ids, or content in any Account payload
- Guessing sponsor attribution when the redemption/activation chain is ambiguous
- Shipping Usage as zeros when coverage is incomplete
- Opening Phase C (membership / public Account) in the same PR

## Architecture

```text
Notes / Tasks / Timeline / Signal
        committed allowlisted action (server-side)
                    |
                    v
     venue-meaningful-action.v1  (pseudonymous, short-lived)
                    |
     attribute via entitlement → redemption → sponsor_activation
                    |
                    v
          sponsor_usage_daily  (signal-entitlements)
                    |
          sponsor_report_snapshots (frozen windows)
                    |
     Account live projection → AccountSnapshot.adoption / productReach
```

Control plane remains Signal HQ Access. Account stays read-mostly.

## Workstreams (execute in order)

### B0 — Contracts freeze (½ day)

Lock versions before code:

| Artifact | Version |
| --- | --- |
| Metric dictionary | `venue-metrics.v1` (existing) → map into Account `account-metrics.v2` |
| Event schema | `venue-meaningful-action.v1` |
| Instrumentation | `instrumentation.v1` |
| Calendar default | `Europe/Dublin` |

Deliverables:

- [x] `docs/account/EVENT_SCHEMA_MEANINGFUL_ACTION_V1.md` (or extend METRIC_DICTIONARY)
- [x] Explicit field allowlist + forbidden field list
- [x] Mapping table: dictionary metric → `AccountSnapshot` field

Account mapping (target):

| Dictionary metric | Account field |
| --- | --- |
| First meaningful action | `adoption.firstUsefulAction` |
| Active sponsored workspaces (window) | `adoption.activeRecently` |
| Day-30 retention band | `adoption.continuedAfter30Days` |
| Venue active days | `adoption.daysWithSponsoredUse` |
| Module adoption | `productReach[]` |
| Coverage envelope | `coverage.*` |

### B1 — Event schema + emitters (2–4 days)

Define minimal event shape (no content):

```ts
type VenueMeaningfulActionV1 = {
  eventId: string;           // idempotency key
  instrumentationVersion: "instrumentation.v1";
  product: "notes" | "tasks" | "timeline" | "signal";
  kind: string;              // allowlisted only
  occurredAt: number;        // ms UTC
  subjectIdHash: string;     // opaque, salted
  workspaceIdHash: string;   // opaque, salted
  // NO titles, bodies, emails, urls, clerk ids, code values
};
```

Allowlist (from `METRIC_DICTIONARY.md`):

| Product | Kinds |
| --- | --- |
| Notes | `note_created`, `note_materially_edited` |
| Tasks | `task_created`, `task_completed`, `task_reopened`, `task_reassigned`, `task_rescheduled`, `task_status_changed` |
| Timeline | `timeline_curated`, `timeline_visibility_changed`, `timeline_published` |
| Signal | `briefing_deliberately_opened`, `briefing_acknowledged` |

Emit **only after successful commit**, in product servers (Tasks / Notes / Timeline / Signal repos as applicable). Studio may host the ingest + rollup initially.

Deliverables:

- [x] Shared schema package or `src/lib/account/instrumentation/event-schema.ts`
- [x] Per-product emitter stubs behind feature flag `SPONSOR_USAGE_EVENTS=1` (shared emitter in Studio; product call sites still to wire)
- [x] Unit tests: allowlist accept/reject; failed transaction does not emit

### B2 — Ingest + attribution (2–3 days)

Ingest path into `signal-entitlements` (or short-lived events table):

1. Validate schema + allowlist
2. Resolve sponsor via canonical chain only:
   `subject → entitlement/redemption → sponsor_activation`
3. Ambiguous / unknown → `unattributed` bucket (excluded from venue metrics)
4. Reject pre-redemption timestamps and view-as / demo / seed origins

Deliverables:

- [x] `sponsor_usage_events` (or equivalent) short-lived table, 35-day retention
- [x] Attribution pure function + ambiguity tests
- [x] Payload privacy scan (no prohibited patterns)

### B3 — Projection tables + daily rollup (3–5 days)

Additive schema on `signal-entitlements`:

**`sponsor_usage_daily`** — PK `(sponsor_id, local_date, metric_dictionary_version)`

- active workspace counts, module action counts, coverage mask, `data_through`

**`sponsor_report_snapshots`**

- frozen period payload, coverage/suppression metadata, content hash, export ref

Rollup job:

- Idempotent by `eventId`
- Late-arrival repair within 35 days
- Coverage: `complete | partial | unavailable`
- Suppression: behavioural `<3` workspaces; rates/cohorts `<5`
- Runs after 06:00 venue-local for closed days

Deliverables:

- [x] Migration script (idempotent, like `migrate-account-requests.mjs`)
- [x] Rollup cron / HQ-triggered job with dry-run
- [x] Reconciliation fixtures: source events → daily → snapshot

### B4 — Access delivery fields (1–2 days, parallel)

Before Account Access can show `issued` / `expired` honestly:

- [x] `license_codes.delivered_at` (nullable)
- [x] `license_codes.expires_at` (nullable) if product needs it
- [x] Map minted+undelivered → available; delivered → issued

Until then, live Access keeps “minted · delivery not tracked”.

### B5 — Wire Account live Usage (1–2 days)

Extend `src/lib/account/live/`:

- [x] `loadVenueUsageProjection(sponsorId, window)` → adoption + productReach + coverage
- [x] Compose with existing access projection into full live `AccountSnapshot`
- [x] Keep fixture modes for regression
- [x] HQ preview toggle continues: Fixture · Live access · Live access+usage (when coverage exists)

Honesty:

- Missing modules → `partial`, never invent zeros
- Small cohort → `withheld` / coverage `suppressed`
- No rows → `unavailable`

### B6 — Frozen access+usage report (1–2 days)

- [x] Generate snapshot into `sponsor_report_snapshots` for closed months
- [x] HQ download prefers frozen snapshot when present
- [x] SAMPLE / LIVE labels only when not a closed production freeze

## Execution progress — 2026-07-27

All six workstreams are built and tested. The entitlements credentials are still
absent, so every SQL path is proven against a real SQLite engine held in memory
with the same DDL as `signal-entitlements`, and the migration was run twice
against a temporary database to prove it is idempotent.

**Studio.** `event-schema`, `emitter`, `attribution`, `suppression`,
`local-date`, `retention`, `ingest`, `ingest-db`, `rollup`, `daily-metrics`,
`freeze`, `project-venue-usage`, plus the delivery-state change to
`project-venue-access`. Migration at `scripts/migrate-sponsor-usage.mjs`.

**Unified app.** The emitter is duplicated under
`src/lib/account/instrumentation/`, gated by a byte-compared contract, with
call sites in Notes, Tasks, and Timeline behind `SPONSOR_USAGE_EVENTS`.

**Decisions worth keeping.**

- Attribution joins `redemptions -> license_codes -> sponsors`. It does *not*
  use `sponsor_activations.owner_subject_id`, which is an opaque suite subject
  id in a different identity space from the Clerk id the products carry. That
  join would match nothing and report the silence as low adoption.
- A missing hash salt stores nothing rather than filling the unattributed
  bucket, because a configuration fault must not read as a venue whose
  recipients stopped working.
- Per-product daily counters are nullable. Null means not instrumented; zero
  means instrumented and quiet.
- Partial coverage presents as `lower_bound` with a denominator, never a total.
- Day-30 continuation needs facts daily counts cannot hold, so a minimal
  advance-only lifecycle row carries first action, last action, and the sealed
  verdict. There is a real interlock: the sealing job must run at least every
  24 days or bands seal `indeterminate`, which is the honest failure and never
  a zero.

**Still open, and why.**

1. **Apply the migration.** Needs `ENTITLEMENTS_DATABASE_URL` and
   `ENTITLEMENTS_AUTH_TOKEN`. Tracked as the operator to-do
   `apply-sponsor-requests-migration`.
2. **Schedule the rollup and the sealing job.** Both are written; neither has a
   cron. The sealing cadence above is a hard constraint.
3. **Signal is unmapped, deliberately.** Its briefing has no deliberate-open
   commit point: every candidate is an automatic render, a system-surfaced
   record, or a redirect that writes nothing, and acknowledgement carries no
   workspace. Signal reports partial rather than borrowing a metric that means
   something else. Closing it is product work — a real "Open today's brief"
   affordance — not instrumentation work.
4. **Account Usage still renders `unavailable` in production**, because the
   flag is off and no events exist yet. Nothing the surface claims has changed.

## Test inventory (must pass before exit)

From `IMPLEMENTATION_AND_TEST_PLAN.md`, required here:

| Suite | Cases |
| --- | --- |
| Emitters | Qualifying vs excluded per module |
| Idempotency | Replay same `eventId` → no double count |
| Failed txn | Rollback → no event |
| Privacy | Payload + aggregate JSON scan |
| Attribution | Ambiguous chain excluded |
| Coverage | Missing module/day → partial |
| Suppression | `<3` / `<5` never leak hidden numbers |
| Retention | Events older than 35 days deleted |
| Account | Live Usage never shows 0 for unavailable |

## Sequencing recommendation

| Sprint | Focus | Ship criterion |
| --- | --- | --- |
| 1 | B0 + B1 Notes+Tasks emitters only | Events land, privacy tests green |
| 2 | B2 + B3 daily rollup for one pilot sponsor | Daily rows reconcile to fixtures |
| 3 | B5 HQ Account Usage live + B4 delivery fields | Founder can toggle live usage for one venue |
| 4 | Timeline+Signal emitters + B6 monthly freeze | Two consecutive closed weeks complete |

Do **not** start Phase C (public Account) until Sprint 3 exit and a named pilot venue are approved.

## Risks

| Risk | Mitigation |
| --- | --- |
| Products emit page views as “use” | Allowlist + commit-after-success only |
| Cross-repo coordination lag | Start with Notes+Tasks; others stay `missing_modules` |
| Attribution gaps look like low adoption | Coverage `partial` / `unavailable`, never zero |
| Small venues over-exposed | Hard suppression thresholds in projector, not UI |
| Retention creep | 35-day hard delete job with test |

## Operator checklist to start execution

1. Confirm Turso entitlements URL/token in the build environment
2. Open a dedicated branch `feat/account-phase-b-instrumentation`
3. Land B0 docs + schema PR first (no emitters yet)
4. Feature-flag all emitters off in production until Sprint 2 exit
5. Pick one paid/pilot venue for shadow rollup (no customer-facing UI)

## Relationship to shipped Account work

| Already shipped | Phase B adds |
| --- | --- |
| Access live from sponsors/codes | Usage live from aggregates |
| `unavailable` Usage honesty | Real coverage states |
| `sponsor_requests` | Unchanged (still HQ fulfills) |
| HQ-only preview | Still HQ-only until Phase C |

## Done definition for this planning doc

- [x] Goal, non-goals, architecture written
- [x] Workstreams sequenced with exit criteria
- [x] Metric → AccountSnapshot mapping
- [x] Test inventory and risks listed
- [x] Explicit stop before public Account route
