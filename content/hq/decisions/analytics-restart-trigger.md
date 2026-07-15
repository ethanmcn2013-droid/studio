---
id: analytics-restart-trigger
title: Signal product build restarts on a state-of-the-suite trigger, not a calendar date.
category: Product
date: 2026-05-12
status: Superseded
reviewDate: 2026-07-13
relatedObjects: [Signal, Sprint 2, Cycle 11.4 cinematic demo]
---

## Decision

Signal product build restarts on a state-of-the-suite trigger, not a calendar date.

## Reason

Signal's product premise is signal worth briefing. Signal requires multi-actor, multi-day workspaces. Building Signal on a single-user, three-task workspace produces signal-less briefings — BRAND.md §2.2 failure mode rendered as a product. Marketing-side cinematic demo investment also pauses until then.

## Alternatives considered

Restart immediately and hope Sprint 2 multi-user state arrives in time. Or restart on a calendar date with no usage trigger.

## Risks

Cooling-off cost on the engine architecture in canonical-state memory — picking it back up after Sprint 2 will take ramp time.

## Notes

Trigger: first real multi-user wedding workspace exists in Tasks with a second human invited AND at least one shared timeline update visible to them. Until then, no further Signal product or marketing-demo investment.

Superseded 2026-07-13 by the explicit decision in `signal-progressive-depth.md`. Progressive analytics may now proceed behind its production-off feature flag. The original trigger remains useful historical context for why the earlier build paused; it no longer blocks implementation.
