---
id: signal-progressive-analytics-trust
title: Signal presents partial, stale, or out-of-scope analytics as complete.
category: Product
likelihood: Medium
impact: High
status: Needs attention
owner: Ethan
reviewDate: 2026-08-13
---

## Mitigation

Keep the release behind the centralized production-off feature flag until three boundaries are proven with live staging data:

1. Every request revalidates workspace membership and every Evidence record is permission-safe.
2. Missing Notes, Tasks, Timeline, or history coverage renders as partial, stale, unavailable, unsupported, or **Not enough history yet**. It never becomes zero or a healthy state.
3. Every observation and project state exposes its versioned deterministic rule, comparison basis, source counts, freshness, and real source actions.

Curated wording remains the fallback. An optional narrative provider cannot calculate metrics, select observations, invent causality, or receive raw Note bodies by default. Production fixtures are forbidden. Private analytics responses do not enter a shared cache until permission-sensitive keys and event-driven invalidation are proven.

Preferences stay inside the existing account export and erasure paths. The prospective snapshot writer is bounded to eligible current members, idempotent per workspace/day/version, and globally pruned after 400 days. The configured scheduler is one Hobby-compatible daily run at 02:30 UTC; authenticated manual calls continue later batches during release proof or backfill. It must remain release-gated until the migration, secret, first scheduled receipt, manual continuation, and retention sweep are verified with live provider data.

## Notes

### Unified App evidence, 27 September 2026

The risk also applies to the mounted legacy Home path, which the progressive feature flag does not replace. At source `6bb1013a`, actual persisted cases reproduce false recent completion, flattened configured status, archived/child work counted as open, lost priority/date detail and a healthy empty period after silently reading only 50 of 51 projects. Candidate `7ebb502b` corrects all five frozen development lifecycle-failing families and adds progressive archive/child parity. Priority/date loss, false all-clear claims, four critical family failures and 75% personal useful precision still prevent acceptance. A narrower lifecycle gain does not close this risk.

The original blind protocol aborted. Its completed diagnostic matrix preserves two lifecycle corrections, 53 remaining unsupported assertions under the final symmetric lane adjudication and one newly critical-failing family. Follow-up `87d8bef7` repairs known dependency edges and recorded-comment recency, with eighteen passing independent receiving checks. Unknown open references now reduce availability instead of feeding unsupported blocker claims. The original holdout is retired, and the completed sixty-family nonblind regression retains 141 unsupported claims, six critical failures, seven incomplete families and one new critical omission versus baseline. Four additional families are unavailable; these missing outputs receive no quality credit. Neither passing implementation tests nor an unavailable result closes this risk.

Controlled Clerk test sessions now support local and isolated hosted evidence. The Preview access repair verifies five isolated stores and both controlled actors at `90991e61`. Completed bounded hosted proofs have revoked their owned sessions; the normal browser receiving fixture and sessions are also cleaned. Failed representative and ordinary-task performance attempts are preserved and their fixtures were subsequently reconciled and cleaned. The older credential-failure statements below are historical. Repaired access does not establish progressive snapshot, coverage, scheduled-run or final receiving acceptance. See [current source-pinned evidence](../../atlas/app-backend-reliability-and-signal-reads.md).

### Bounded activity-history correction, 28 September 2026

Candidate `df605cd731716e28f25975c3a5e0fb472a6b883a` keeps missing meaningful activity null and withholds the Tasks provider's unproven activity capability. Coverage is partial; the stalled-work metric cannot substitute creation time for missing history. Valid positive events remain available without certifying complete history. Twenty-six persisted provider/service tests pass, including overdue ID, deadline, count and usable action through actual capped briefing/ledger selection, durable completion, empty coverage state and unchanged stores. Independent review passes for this bounded change. Full CI and frozen development comparison are pending at this checkpoint.

This correction reduces supported capability and confidence; it is not whole quality acceptance. The frozen development benchmark scores legacy Home and ledger paths, which do not call this progressive metric/service. Legacy priority, calendar meaning and unknown-history/all-clear consumer contracts remain unresolved. No flag, frontend, public DTO, wording or ranking policy changed.

### Earlier progressive release record

Open while the built feature remains release-gated. Synthetic current-head proof now covers unauthorized scope, stale provider, failed provider, insufficient history, Evidence pagination, keyboard focus, and responsive/accessibility behavior. It does not close the risk: both Signal Preview database pairs currently return HTTP 401, all available product-provider Preview tokens are read/write, and no Clerk staging credentials exist. Close only after repaired least-privilege credentials support the additive migration, two live test identities prove allowed and denied projects, real source actions open permitted records, and manual plus scheduled snapshot receipts succeed. A green branch, synthetic fixture, or feature flag is not sufficient evidence.
