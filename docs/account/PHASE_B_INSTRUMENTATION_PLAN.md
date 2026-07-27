# Phase B — Sponsored-use instrumentation plan

Status: **B0 frozen and B1 built · B2–B6 gated on entitlements credentials**  
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

- [ ] `sponsor_usage_events` (or equivalent) short-lived table, 35-day retention
- [x] Attribution pure function + ambiguity tests
- [ ] Payload privacy scan (no prohibited patterns)

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

- [ ] Migration script (idempotent, like `migrate-account-requests.mjs`)
- [ ] Rollup cron / HQ-triggered job with dry-run
- [ ] Reconciliation fixtures: source events → daily → snapshot

### B4 — Access delivery fields (1–2 days, parallel)

Before Account Access can show `issued` / `expired` honestly:

- [ ] `license_codes.delivered_at` (nullable)
- [ ] `license_codes.expires_at` (nullable) if product needs it
- [ ] Map minted+undelivered → available; delivered → issued

Until then, live Access keeps “minted · delivery not tracked”.

### B5 — Wire Account live Usage (1–2 days)

Extend `src/lib/account/live/`:

- [ ] `loadVenueUsageProjection(sponsorId, window)` → adoption + productReach + coverage
- [ ] Compose with existing access projection into full live `AccountSnapshot`
- [ ] Keep fixture modes for regression
- [ ] HQ preview toggle continues: Fixture · Live access · Live access+usage (when coverage exists)

Honesty:

- Missing modules → `partial`, never invent zeros
- Small cohort → `withheld` / coverage `suppressed`
- No rows → `unavailable`

### B6 — Frozen access+usage report (1–2 days)

- [ ] Generate snapshot into `sponsor_report_snapshots` for closed months
- [ ] HQ download prefers frozen snapshot when present
- [ ] SAMPLE / LIVE labels only when not a closed production freeze

## Execution progress — 2026-07-27

Sprint 1 landed on `feat/account-phase-b-instrumentation`.

**Built and tested (40 unit tests):**

- `docs/account/EVENT_SCHEMA_MEANINGFUL_ACTION_V1.md` — the frozen contract.
- `src/lib/account/instrumentation/event-schema.ts` — exactly seven fields, a
  per-product kind allowlist, and forbidden-field rejection at every nesting
  depth. Rejects rather than strips, so a new field cannot leak by omission.
- `src/lib/account/instrumentation/emitter.ts` — commit-after-success, salted
  identity hashing, feature flag off by default.
- `src/lib/account/instrumentation/attribution.ts` — the redemption chain, with
  ambiguity, pre-redemption, ended-access, and demo/seed/view-as all excluded.
- `src/lib/account/instrumentation/suppression.ts` — the 3-workspace and
  5-workspace thresholds and the coverage state machine, enforced in the
  projector with a guard that throws if an absent metric is dressed as a value.

**Not built, and why.** Everything from B2 onward writes to or reads from
`signal-entitlements`, and the credentials for that database are not available
in this environment. The operator to-do
`apply-sponsor-requests-migration` covers the same gate. Specifically still
open: the ingest table and retention job, `sponsor_usage_daily` and
`sponsor_report_snapshots` with their migration, the rollup job, the access
delivery fields in B4, the live Usage projection in B5, and the frozen report in
B6.

**Also still open:** the product call sites. The emitter exists and is tested,
but Notes, Tasks, Timeline, and Signal do not yet call it. That work belongs in
the `tasks` repository and should land with the flag off.

Account Usage continues to render `unavailable`. Nothing in this sprint changes
what the surface claims.

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
