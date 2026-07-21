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

Open while the built feature remains release-gated. Synthetic current-head proof now covers unauthorized scope, stale provider, failed provider, insufficient history, Evidence pagination, keyboard focus, and responsive/accessibility behavior. It does not close the risk: both Signal Preview database pairs currently return HTTP 401, all available product-provider Preview tokens are read/write, and no Clerk staging credentials exist. Close only after repaired least-privilege credentials support the additive migration, two live test identities prove allowed and denied projects, real source actions open permitted records, and manual plus scheduled snapshot receipts succeed. A green branch, synthetic fixture, or feature flag is not sufficient evidence.
