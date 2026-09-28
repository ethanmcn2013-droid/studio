---
title: App backend reliability and Signal reads
slug: app-backend-reliability-and-signal-reads
lens: Data Flows
owner: Ethan
lastVerified: 2026-09-28
links: [turso-databases-and-reads, signal-progressive-analytics]
tags: [App, Tasks, Signal, recovery, authorization, briefing, coverage]
references: [app/src/modules/signal/lib/data/source.ts, app/src/modules/signal/server/briefing/signal-build-for-user.ts, app/src/modules/signal/server/analytics/providers/tasks.ts, app/scripts/reliability/]
summary: "Source-pinned lifecycle improvement and bounded recovery evidence; broader factual quality and hosted acceptance remain open."
status: complete
pinned: false
execWhat: Home and Full Briefing read authorized task facts through different server paths. Recovery checks restore five isolated stores and verify their contents and relationships.
execMatters: Accurate lifecycle facts prevent old or finished work from being presented as a new problem. Verified recovery protects work when a dependency fails.
execRisk: Local checks do not establish hosted performance. Priority, date, critical selection and false all-clear failures still prevent intelligence acceptance.
---

## Current source and proof boundary

This entry compares unified App baseline `6bb1013a78a2ee3abefdaca58bda6dc0708ebb07` with the backend work in [draft App PR 204](https://github.com/ethanmcn2013-droid/app/pull/204). Original product candidate `7ebb502b` and test-registration revision `cd5689e8` have preserved independent results. Current follow-up revision `87d8bef7df892830000f8921ac5fefb864e31a10` adds dependency resolution and positive comment-recency evidence. None is a production release receipt. The older linked Atlas entries retain historical separate-repository architecture; use this source-pinned entry for the paths below.

The private [programme evidence](https://github.com/ethanmcn2013-droid/signal-studio-workspace/pull/39) holds source manifests, receipts and the active-path map. Current delivery claims and next proof belong to private issues [37](https://github.com/ethanmcn2013-droid/signal-studio-workspace/issues/37) and [38](https://github.com/ethanmcn2013-droid/signal-studio-workspace/issues/38), not this content record.

## Actual consumers

- Home uses the legacy briefing orchestrator with `recordReadState: false`. Reading Home must preserve dismissals, surfaced ages and rotation state.
- Full Briefing uses the legacy path with V1 disabled. An explicit planning-period request also keeps the legacy path when V1 is enabled. Ordinary legacy Full Briefing reads record state, so repeated route requests are not a read-only benchmark.
- V1-enabled Full Briefing without an explicit period uses progressive analytics for one authorized canonical project. Its Program axis is not carried; it cannot silently stand in for a multi-project period.
- The progressive analytics domain opens under V1 or the Home analytics flag. The latter does not make the mounted Home page use progressive analytics at this source revision.
- App Analytics and daily/weekly digests use separate canonical Tasks calculations. Provider-only analytics evidence does not prove those routes or digest delivery.

Authorization resolves the immutable Clerk subject to Tasks ownership or current membership. A planning period contains authorized canonical projects; tags are not permission boundaries. Public ledger fields remain allowlisted with opaque evidence identity. Source-opening actions authorize again. Approved Note extracts remain constrained to their allowed task links; raw private Note bodies are not briefing inputs.

## Confirmed intelligence limitations

Six persisted synthetic cases execute the actual source, scope, orchestrator and unchanged Home consumer. They reproduce old completion dates replaced by recent metadata edits; configured done and review state flattened incorrectly; archived and child rows counted as open top-level work; priority replaced by a constant; due instants reduced to dates; and a date-only boundary error in UTC+14. A 51-project period reads only 50 projects while its empty ledger claims healthy complete coverage. These are baseline findings, not fixed behaviour.

Priority also has a consumer coupling: restoring its canonical numeric value exposes an opposite-direction comparator in the protected Home presentation model. The backend programme does not authorize a frontend edit or false compensating value. Any coupled repair needs a concrete handoff.

The candidate preserves configured completion/review, excludes archived/child work from active legacy reads, uses durable or unambiguous latest-event completion evidence and rejects incomplete source enumeration. Progressive analytics retains archived historical completions while excluding archived open work. The declared catalog bound is 200 workspaces; exceeding it returns unavailable rather than a silently truncated healthy result.

Independent frozen development comparison covers 40 families, 41 variants and 45 reads: five lifecycle wins, 34 ties, no losses and one unchanged unscored injected outage. Public unsupported assertions fall from 135 to 114 under the final symmetric lane adjudication; useful precision rises from 85.58% to 88.33% across equally weighted contexts. Personal precision remains 6/8 (75%), four critical families fail, and overall factual acceptance remains false. The restored 51st-workspace invoice exposes two existing incorrect priority values within an already-failing family; the absence of a new failing family must not conceal those new field occurrences.

The original twenty-family blind protocol aborted after six measurement attempts. Separately frozen diagnostic continuations completed all forty distinct attempts without retries. The diagnostic lifecycle comparison records two wins, sixteen ties, no losses and two unavailable/unscored families. Unsupported claims fall from 63 to 53 under the final symmetric lane adjudication, but one new critical omission and two unsupported certainty occurrences reject acceptance. The original blind result remains inconclusive; diagnostic completion does not replace it.

The follow-up clears only confirmed completed prerequisites within the exact workspace and configured terminal policy. Archived/child prerequisites may resolve an edge without becoming visible work. Unknown open-task references yield explicit unavailability, which may reduce availability and earns no quality credit. Valid recorded comment creation can advance the existing activity proxy; it cannot certify complete history or distinguish all metadata-only edits. Eighteen independent receiving nodes pass at `87d8bef7`, including the previously failing completed edge and unchanged-store checks. Final changed-file lint and clean typecheck pass. The broader 498-test suite passed at the preceding `70c9d58c` draft; final required Linux Verify Tasks passed at `87d8bef7` ([run 36354897360](https://github.com/ethanmcn2013-droid/app/actions/runs/36354897360)). Final nonblind regression at `87d8bef7` covers all 60 families, 61 mutations and 66 reads. Against the original baseline: seven lifecycle wins, 46 ties, zero losses and seven unavailable/unscored families; only 53 families have produced pairs. There are 141 unsupported claims among 3,197 audited claims, six critical-failing families, seven critical-incomplete families and one newly critical-failing family versus baseline. Four additional families become unavailable (three venue/event and one personal), affecting four essential obligations. Missing outputs earn no improvement credit. Whole quality acceptance is false.

The final development result is 99 unsupported claims among 2,183 audited; retired regression is 42/1,014. Personal development usefulness remains 6/8 (75%). Baseline and first-candidate lane claims were re-adjudicated symmetrically; earlier factual totals remain preserved but are superseded for comparison. Ranking cannot pass because no required pair remains evaluable. Four truth-failing families and one critical-failing family become unscored through unavailability; this is not a repair.

The original held-out set is now retired to regression evidence because the product changed after feedback. A renewed blind claim requires fresh independent families after development correctness justifies it. Human relevance is not established.

## Reliability evidence and remaining gates

The representative isolated restore covered five stores, 93 tables and 35,611 rows in 843.2 seconds. It checked schema, content, foreign keys and native attachment bytes with the original unavailable. The corrected verifier rejects tampered and orphaned archives before creating a target; a smaller post-fix rehearsal passed. Authenticated local checks also exercised actual task actions, chat, file reads and same-session denial after membership removal.

A ten-session local polling run at earlier source `5e186588` completed 355 scope-checked requests with no observed failures, hidden-client requests or residual work. The 35,500 record validations include repeated messages. This is local development evidence, not a hosted capacity or rendered-browser claim.

Exact-source Linux Verify Tasks [36340055465](https://github.com/ethanmcn2013-droid/app/actions/runs/36340055465) passed full tests, migration checks, production build, recovery rehearsals, journey coverage and performance budgets. Separate design validation still fails three inherited frontend materiality hashes. Prior Windows native-process failures remain recorded.

The isolated Preview access failure is repaired with bounded credentials. Runtime attestation at `90991e61793ddcf20ec64004afe5f659e0748eff` verifies the immutable Preview source, five isolated stores, test identity configuration and two controlled actors. [Verify Tasks 36367211661](https://github.com/ethanmcn2013-droid/app/actions/runs/36367211661) passes all required backend stages; inherited design registry failures remain. The representative fixture is being seeded, so no three-run hosted performance result is claimed. Normal browser sign-in and hydrated Home have been observed; complete browser receiving and session cleanup remain outstanding. No production data or credentials changed.

Earlier hosted ordinary create/edit/complete, cross-actor observation, duplicate/replay, membership-removal and adapter-recovery checks passed at `274f9a05`. The service-adapter interruption lasted 30,014ms and fresh hosted task/chat observer proof recovered within 2,908ms after fault removal; this is not a provider outage. Those proof sessions and fixtures were cleaned with zero scoped residual rows. A separate stopped seed was reconciled and removed after a load-harness observer race was reproduced; failed attempts remain preserved. The reviewed observer correction is included in `90991e61`.

Matched local Home measurement on D: uses five warmup and thirty measured authenticated reads per revision: baseline p95 2004.71ms, original candidate 1829.28ms and follow-up `87d8bef7` 1990.42ms. Tasks/Signal contents stay unchanged and each owned session is revoked. The earlier baseline on C: was 1889.4ms and remains separately recorded. These are development-server results, not hosted acceptance.
