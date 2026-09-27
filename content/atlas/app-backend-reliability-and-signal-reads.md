---
title: App backend reliability and Signal reads
slug: app-backend-reliability-and-signal-reads
lens: Data Flows
owner: Ethan
lastVerified: 2026-09-27
links: [turso-databases-and-reads, signal-progressive-analytics]
tags: [App, Tasks, Signal, recovery, authorization, briefing, coverage]
references: [app/src/modules/signal/lib/data/source.ts, app/src/modules/signal/server/briefing/signal-build-for-user.ts, app/src/modules/signal/server/analytics/providers/tasks.ts, app/scripts/reliability/]
summary: "Current unified App read paths and bounded recovery evidence; hosted acceptance and intelligence repairs remain unaccepted."
status: complete
pinned: false
execWhat: Home and Full Briefing read authorized task facts through different server paths. Recovery checks restore five isolated stores and verify their contents and relationships.
execMatters: Accurate lifecycle facts prevent old or finished work from being presented as a new problem. Verified recovery protects work when a dependency fails.
execRisk: Local checks do not establish hosted performance. Confirmed lifecycle, priority, date and coverage losses remain in the measured intelligence baseline.
---

## Current source and proof boundary

This entry describes unified App source `6bb1013a78a2ee3abefdaca58bda6dc0708ebb07` in [draft App PR 204](https://github.com/ethanmcn2013-droid/app/pull/204). It is a reviewed development candidate, not a production release receipt. The older linked Atlas entries retain historical separate-repository architecture; use this source-pinned entry for the paths below.

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

The quality programme freezes independent scenario labels before tuning and keeps held-out answers separate from implementation. No intelligence repair or blind improvement claim has been accepted at this checkpoint.

## Reliability evidence and remaining gates

The representative isolated restore covered five stores, 93 tables and 35,611 rows in 843.2 seconds. It checked schema, content, foreign keys and native attachment bytes with the original unavailable. The corrected verifier rejects tampered and orphaned archives before creating a target; a smaller post-fix rehearsal passed. Authenticated local checks also exercised actual task actions, chat, file reads and same-session denial after membership removal.

A ten-session local polling run at earlier source `5e186588` completed 355 scope-checked requests with no observed failures, hidden-client requests or residual work. The 35,500 record validations include repeated messages. This is local development evidence, not a hosted capacity or rendered-browser claim.

Exact-source Linux Verify Tasks [36340055465](https://github.com/ethanmcn2013-droid/app/actions/runs/36340055465) passed full tests, migration checks, production build, recovery rehearsals, journey coverage and performance budgets. Separate design validation still fails three inherited frontend materiality hashes. Prior Windows native-process failures remain recorded.

The isolated hosted Tasks credential returns 401; hosted three-run performance and final receiving acceptance remain unverified. No production data or credentials changed. Local Home baseline at `6bb1013a` used five warmup and thirty measured authenticated reads with p95 1889.4ms, unchanged Tasks/Signal contents and confirmed session cleanup. It does not replace hosted acceptance.
