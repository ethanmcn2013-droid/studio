---
id: project-ping-execution
title: Execute Ping through a strict command and recovery proof
category: Product
date: 2026-10-06
status: Active
reviewDate: 2026-10-20
relatedObjects: [Project Ping, Signal Tasks]
---

## Decision

The founder authorized autonomous execution of the approved Project Ping plan on 6 October 2026, including agent recommendations recorded approved under that delegation. The choices below are delegated agent decisions, not attributed founder design picks.

Start with a disposable isolated proof of a versioned application-owned command contract and an injected transaction executor. The first operation targets exact selected tasks in one active Project, or one to ten top-level placeholders there. Supported shared effects are adding or removing self, an explicit resolved date and a permitted configured status. Other capabilities remain tracked through their discovery and scope gates.

Bind actor identity at a trusted authentication boundary. Reauthorize all effects in the transaction and atomically store the exact outcome with an actor-scoped command identity and immutable payload hash. Receipt retrieval checks current access. Before dispatch, cancellation writes nothing; after dispatch, reconciliation determines the outcome.

Recover an existing committed receipt through a currently authorized read. An absent read does not authorize a write: repeat receipt lookup, payload comparison and all write checks inside the transaction. This avoids requiring a new writer lock merely to report an already committed result while preserving concurrent first-write protection.

Use synthetic local data for the first proof, with no ambient production database import or provider call. The initial status and date scope is deliberately narrower than final V1: system columns and Europe/Dublin projection until custom persistence and timezone semantics are resolved. This is a proof boundary, not deletion of the broader requirements.

Continue with an inert lifecycle before adding transport. Capture immutable application context, serialize unacknowledged input commits, drain the accepted-frame boundary at Finish and freeze a complete ordered manifest before interpretation. Provider deltas are never executable input. Bind the resulting operation-only proposal to application-owned actor, target, finality and command identity; schema validity alone does not prove that every requested clause was understood.

Before dispatch, cancellation produces no mutation descriptor. After dispatch, a missing response, denied recovery or absent receipt leaves the outcome unresolved until original-identity reconciliation establishes it. Do not substitute a new command identity or claim cancellation for a possibly committed command. A pure reducer can establish these descriptor rules; actual request, transaction, refresh and account-wide coordination boundaries still need separate receiving evidence.

Predeclare independent synthetic text labels and retain a reserved screening split outside candidate development until the interface is frozen. Preparing the corpus or passing mocked interpretation tests establishes neither model accuracy nor speech quality. Choose the simplest voice route that survives measured real comparisons; no route is selected by this construction decision.

The next finite enabler connects synthetic typed input to the existing isolated executor, authorized receipt recovery and a verified readback. Record actual calls and resulting state independently of requested descriptors. This delegated recommendation is approved for disposable construction; a local bridge cannot substitute for the authenticated browser and current-control comparison required by the typed floor.

Fix the canonical task-count correlation defect as a finite necessary enabler. Share the existing projection with one literal persistence regression, preserve current query predicates, and keep the change separate from the disposable bridge. This recommendation is recorded approved under founder delegation. The sprint uses six agents in total, one source writer per worktree and one combined HQ update; further abstractions and extra test matrices are deferred unless a material failure requires them.

The local bridge now has immutable reviewed source in App PR 217. Keep committed receipt knowledge separate from current projection: cancellation clears raw input and stale displayed rows, while retaining the original identity and any already known historical outcome. Manual receipt lookup and readback have finite local budgets; they never authorize another executor call. Those disposable limits are not product availability promises. The next meaningful floor proof requires a strict real session actor, an explicitly isolated runtime target and canonical browser hydration.

The bounded typed panel and request transport are in draft [App PR 220](https://github.com/ethanmcn2013-droid/app/pull/220) at source `b3f984bf470f64ba5149172b9e1c511ebb002218`. The application source is unchanged from `2a0ab1972607e719ad93c4072a38bbe45d66b60c`, where the browser receiver completed four synthetic cases, recorded three receipts and reported no accessibility violations. The isolated recipient fixture was then corrected; 12 recipient and four exact-source browser cases are running, and both hosted repository checks remain pending. This delegated implementation step does not select a voice route or close authentication, production, pilot or release gates.

## Reason

Generic task actions and bulk UI fan-out do not establish compound atomicity or truthful completion. Interpretation can be wrong, responses can be lost and access can change. Exact state and durable recovery need to work before selecting a speech architecture or polishing its completion experience.

## Risks

Local database-driver behavior differs from hosted transaction behavior. Existing custom-column writers disagree on persistence, date conventions differ across surfaces, and development authentication has a fallback unsuitable for a shipped command boundary. The companion risk remains open until the relevant exact-state and receiving evidence exists.

## Programme boundary

The existing 21 January 2027 programme policy is retained: preparation before that date is internal with isolated data. Actual receiving, provider, real-use and release evidence still governs the next environment. Ping is not added to the January commercial launch dependency set by this decision. No publication, third-party outreach, paid runtime entitlement or customer-data access is inferred from a synthetic proof.
