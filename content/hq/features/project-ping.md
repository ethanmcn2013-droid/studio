---
id: project-ping
title: Project Ping explicit commands
product: tasks
category: Foundation
status: In Progress
priority: High
effort: Large
impact: High
owner: Ethan
lastVerified: 2026-10-06
---

## What it is

Project Ping will let someone carry out an explicit command in the Project they are visibly working in, using voice or typing. The first supported outcome is a bounded compound change to selected tasks, or creation of one to ten top-level placeholder tasks in an existing Project.

## Current state

Execution was authorized on 6 October 2026. The first isolated engineering proof has started from App source `ae9713bcb40a94f047ee92e0c1747f04e3629efc`. No Ping transport, microphone experience, deployed feature or customer acceptance is established by this record.

The proof begins with a strict inert command contract and an injected executor. It must demonstrate current authorization inside the writer transaction, exact requested effects, rollback of the whole compound command, and an atomic actor-scoped receipt. Retrying the same command recovers its prior result; changing a possibly executed request must never create an accidental second action.

The disposable first proof covers configured system statuses and a documented Europe/Dublin date projection. Existing custom-status writers disagree on lane persistence, and existing date writers choose different instants. Full custom-status and timezone support remains part of the product work and needs its own semantic and state evidence before real use.

## Acceptance

Interpretation, mutation and visible completion are separate claims. The interpreter supplies no trusted actor, authorization or final-input authority. Unsupported clauses must be refused or clarified as a whole, rather than silently dropped. Self-assignment preserves collaborators. Task identity and Project scope come from explicit captured application context.

The voice-route choice follows an actual controlled comparison after the typed floor works. Development subscriptions do not establish runtime API entitlement. Provider access, privacy, finite cost limits, authenticated receiving and speech-end-to-visible-completion measurements remain unverified.

Founder use, an independent pilot, rollout and stabilization require actual operated evidence. A passing synthetic test, calendar date or merge cannot replace those observations.

## Delivery authority

Current task claims, workflow, priorities and acceptance receipts live in the private Delivery Project. This HQ record describes product facts and risks; it is not a second editable execution queue. Recommendations are recorded under explicit founder delegation in the companion decision. Ping does not become a dependency of the January commercial launch merely because execution has begun.
