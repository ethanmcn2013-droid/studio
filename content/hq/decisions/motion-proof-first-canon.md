---
id: motion-proof-first-canon
title: Make every product hero prove the product before the wordmark pays off
category: Brand
date: 2026-07-02
status: Active
reviewDate: 2026-08-02
relatedObjects: [Signal Studio, Signal Notes, Signal Tasks, Signal Timeline, Signal, /brand asset hub]
---

## Decision
Make the suite motion canon proof-first: every product hero must show a useful artifact before the wordmark or dot gesture becomes the payoff. Studio coordinates Notes, Tasks, Timeline, and Signal once, then rests. Product heroes keep distinct gestures but share one restraint rule: motion should clarify the job, not perform around it.

## Reason
The earlier wordmark animations were built during early development and had started to read as logo theatre. The better Signal Studio posture is quieter and more useful: Notes shows capture, Tasks shows accountable work, Timeline shows a public plan, Signal shows the three items worth reading, and Studio shows the suite order. This makes the first two seconds explain the product instead of asking the viewer to admire the mark.

## Alternatives considered
Keep the old dot gestures and polish timing only. Add a larger shared animation system. Give each product its own color or visual language. All three were rejected because they would preserve drift, add surface area, or weaken the one-indigo suite rule.

## Risks
The suite now relies on motion being maintained across five repositories. Future changes can drift if a product edits its hero without updating the canon. The legacy `roadmap` and `analytics` internal names still exist in repo paths and compatibility aliases, so agents must distinguish public language from historical code names.

## Notes
Shipped 2026-07-02 across Foundation, Studio, Notes, Signal, Timeline, and Tasks. Foundation now supports canonical wordmark `kind` values while preserving legacy `variant` aliases. Studio regenerated public Timeline and Signal assets, added deterministic brand asset render/check scripts, and rebuilt the reveal hero as a four-product conductor. Product hero exports stayed stable. Verification covered package-native checks, 80 local screenshots, 80 production screenshots, desktop and mobile, normal and reduced motion, no console errors, and no horizontal overflow. Tasks required an explicit production deploy because its alias was still pinned to an older deployment after merge-triggered deploys completed for the other four sites.
