---
id: notes-private-by-design
title: Treat Signal Notes as private by design.
category: Product
date: 2026-05-12
status: Active
reviewDate: 2026-05-26
relatedObjects: [Signal Notes, Signal Tasks, Workspace Briefing, Shared outputs]
---

## Decision

Treat Signal Notes as private by design.

## Reason

Notes is the private context layer. Trust depends on raw thoughts never appearing in collaborative surfaces by accident.

## Alternatives considered

Let Notes behave like another shared workspace object.

## Risks

Future extraction, briefing, or analytics work could accidentally leak raw note content unless permissions are enforced at the object boundary.

## Notes

Only creator-approved extracts can leave Notes. Raw note bodies stay out of Tasks, Roadmap, Analytics, shared updates, and briefings by default.
