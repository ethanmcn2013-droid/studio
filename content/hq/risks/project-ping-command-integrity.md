---
id: project-ping-command-integrity
title: Ping could make the wrong change or report an uncertain command as complete
category: Product
likelihood: Medium
impact: High
status: Needs attention
owner: Ethan
reviewDate: 2026-10-20
---

## Risk

A fluent interpretation can select the wrong Project, omit part of a compound request or report completion before durable effects are known. Retrying after a lost response can duplicate placeholder tasks. A stale permission check or receipt can disclose or mutate work after access is revoked.

## Mitigation

The first isolated proof uses a strict versioned contract, explicit Project and task identities, trusted final-input and actor boundaries, semantic preconditions and capability checks inside the writer transaction. All effects and the exact actor-scoped receipt commit together. A reused identity with changed content conflicts, and current access gates receipt retrieval.

Independent synthetic oracles will verify literal before/after state, preserved collaborators and unrelated fields, atomic fault rollback, no-op accounting, replay, response loss and revocation. Local proof is not hosted receiving or user acceptance.

## Known semantic dependencies

App source `ae9713bcb40a94f047ee92e0c1747f04e3629efc` contains divergent custom-column lane persistence and date-to-instant conventions. The initial disposable proof uses configured system columns and a documented Europe/Dublin projection. Wider custom-status and timezone support needs a reviewed persistence policy and exact projection tests before real use.

The existing local conversation transaction adapter documents native-driver contention problems and provides queued explicit transactions. The Ping proof must attest its chosen adapter and test a second client; that result cannot establish hosted-driver behavior or user capacity.

## Current state

Open on 6 October 2026. The implementation claim has started; no passing persistence, provider, browser, pilot or operating evidence is recorded here yet. Current work and the next proof live in the private Delivery Project.
