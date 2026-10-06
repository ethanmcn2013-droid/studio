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

Independent synthetic checks have verified literal before/after state, preserved collaborators and unrelated fields, atomic fault rollback, no-op accounting, replay, response loss and revocation against source `c48c8d621b5b3352ebd5dab3e53bec80191560ae` in [App PR 214](https://github.com/ethanmcn2013-droid/app/pull/214). Validation in a separate local checkout and all four remote repository checks passed at that source. Authenticated operation and live receiving remain open.

Input finality introduces further failure paths: Finish can omit buffered tail input, acknowledgements can arrive after local commits, completed text can arrive out of order, and conflicting finals can invalidate a request already being interpreted. The bounded inert proof at source `e2b3be9d591d08dc59378ccac3f425d28fdcaf54` now passes independent review, 44 input tests and separate receiving checks. It establishes complete-manifest, stale-result, duplicate and payload-retention rules as pure descriptors. The actual provider and mutation transport must still receive those rules. An interpreter may return a schema-valid partial compound request; independent whole-request labels are needed to detect that semantic error.

After mutation dispatch, an absent receipt or failed lookup does not prove zero effects: a transaction may still be running or access may have changed. Reconciliation must retain the original identity and payload. A local pure state machine cannot by itself establish browser reload recovery, all-tab coordination, real provider protocol compliance or visible refreshed completion.

## Known semantic dependencies

App source `ae9713bcb40a94f047ee92e0c1747f04e3629efc` contains divergent custom-column lane persistence and date-to-instant conventions. The initial disposable proof uses configured system columns and a documented Europe/Dublin projection. Wider custom-status and timezone support needs a reviewed persistence policy and exact projection tests before real use.

The existing local conversation transaction adapter provides queued explicit transactions. An independent second file connection exposed installed Windows libSQL 0.17.3 contention: the losing connection failed closed, and new writes in the same process could remain blocked even after reopening handles. Authorized read-only receipt recovery worked on a reopened handle; a fresh worker process recovered the original identity and resumed writes. Tests must accept safe recovery on other platforms rather than require this driver defect. Production adapter retirement and remote concurrency remain unresolved; this observation does not establish hosted behavior or capacity.

The canonical task-count projection also had a reproduced outer-correlation defect under the installed query builder. The narrow source fix at `853c1102bc352335f0f421cda6cf477a9a67d564` has independent review and separate local receiving, including a maintained literal persistence oracle. Until the draft change is integrated and operated, that local result does not establish deployed count accuracy.

The reviewed local bridge at `e307eef9b88c9625cb6e7662bfae0dde0c98a67a` exercises actual injected invocation, currently authorized plan-bound recovery and local readback. Separate receiving passes 25 owning state/fault tests and full types, focused lint, module and logging checks; six independent literal source cases also pass. Cancellation paths clear raw input and stale projected rows without falsifying historical commit knowledge. This reduces the isolated construction risk. Strict real-session binding, canonical browser hydration, account-wide custody, live provider behavior and operated use remain open.

The opt-in typed panel and request transport are in draft [App PR 220](https://github.com/ethanmcn2013-droid/app/pull/220) at source `b3f984bf470f64ba5149172b9e1c511ebb002218`. At unchanged application source `2a0ab1972607e719ad93c4072a38bbe45d66b60c`, a browser run completed four synthetic cases, recorded three receipts and reported no accessibility violations. The recipient fixture was corrected after that run; 12 recipient and four exact-source browser cases are running. The core typed-client, executor, input, bridge and rollup tests pass, but the corrected full typecheck, exact-source receiving and both hosted repository checks remain pending. This is bounded local interaction evidence, not proof of authenticated production execution, real-user provider behavior or reconciliation in operation.

## Current state

Open on 6 October 2026. Independent isolated contract and persistence checks pass. A prior-source browser run covered four synthetic cases and three receipts with no reported accessibility violations. Recipient and exact-source browser receiving are running; the corrected full typecheck is pending. Full provider, maintained-operation, pilot and operating evidence remains unverified. Current work and the next proof live in the private Delivery Project.
