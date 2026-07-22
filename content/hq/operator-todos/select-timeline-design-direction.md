---
id: select-timeline-design-direction
title: Select the Signal Timeline design direction
status: done
priority: P1
blocking: false
phase: Timeline redesign · Phase 1
why: The production direction had to be explicit before the design lab could move into real publication, privacy, analytics, and release work.
href: ../decisions/timeline-option-d-selected-2026-07-22.md
date: 2026-07-22
action: "No founder action remains. Option D is selected."
product: "Signal Timeline"
selected: "Option D — horizontal, date-scaled shareable artifact"
consequence: "Phase 2 may implement the selected artifact without blending the dashboard structures from Options A, B, or C."
links: ["../decisions/timeline-option-d-selected-2026-07-22.md", "../features/timeline-shareable-artifact.md", "../features/timeline-four-surface-review-lab.md"]
---

## Done

Ethan selected Option D on 2026-07-22 and refined the decision in the review session. The production contract is now unambiguous:

- one horizontal, date-scaled milestone line;
- progress understood at a glance;
- a precise Today dash between milestones;
- **Our next milestone** for the next unfinished point;
- completion and days-remaining lenses with restrained motion;
- a lowercase `timeline` wordmark;
- an owner-only studio with the real artifact shown inside a phone frame;
- a standalone link-only view with no app rail;
- a qualified, privacy-minimised view count;
- milestone photos recorded as a future story layer, not added silently to this release.

The implementation and production evidence are tracked in `timeline-shareable-artifact`. This selection task stays done even if the release itself is held by a migration or verification gate.
