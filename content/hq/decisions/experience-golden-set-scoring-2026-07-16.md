---
id: experience-golden-set-scoring-2026-07-16
title: Score the first Signal experience golden set
category: Product
date: 2026-07-16
status: Active
reviewDate: 2026-10-16
relatedObjects: [Signal Experience Standard, experience golden set, visual baselines, authenticated capture]
---

## Decision

Codex Experience Quality Review scored the five proposed golden references after deterministic rendered review at mobile, tablet, desktop, and wide breakpoints. Every required dimension is at least `3` and every breakpoint mean is at least `3.5`, so the set is eligible for the founder-authorized approval workflow.

Ethan McNamara remains the founder approver under [`experience-quality-founder-authorization-2026-07-15.md`](experience-quality-founder-authorization-2026-07-15.md). Codex Experience Quality Review is the delegated scorer and does not replace the founder role.

## Evidence

- Protected production proof run 1: <https://github.com/ethanmcn2013-droid/studio/actions/runs/29461487495>
- Protected production proof run 2: <https://github.com/ethanmcn2013-droid/studio/actions/runs/29461638860>
- Public capture manifest: [`experience/output/capture-manifest.json`](../../../experience/output/capture-manifest.json)
- Rubric: [`docs/experience/AUDIT_RUBRIC.md`](../../../docs/experience/AUDIT_RUBRIC.md)

The protected pilot covers five isolated, non-personal fixture experiences. Each run captures 20/20 authenticated breakpoint views with screenshot, runtime, accessibility, overflow, and authentication evidence. The selected public candidates likewise pass their deterministic checks.

## Dimension order

The score vectors below use this exact order:

1. purpose-and-task-clarity
2. information-architecture
3. visual-hierarchy
4. typography-and-content
5. layout-and-composition
6. interaction-quality
7. state-completeness
8. accessibility
9. responsive-behavior
10. performance-and-perceived-speed
11. design-system-coherence
12. brand-distinction-and-craft
13. implementation-fidelity

## Scores

| Reference | State | Breakpoint | Score vector | Mean |
| --- | --- | --- | --- | ---: |
| `studio.page.design` | `default` | mobile | 4, 3, 4, 4, 4, 3, 3, 3, 4, 4, 3, 4, 3 | 3.54 |
| `studio.page.design` | `default` | tablet | 4, 3, 4, 4, 4, 3, 3, 3, 4, 4, 3, 4, 3 | 3.54 |
| `studio.page.design` | `default` | desktop | 4, 3, 4, 4, 4, 3, 3, 3, 4, 4, 3, 4, 3 | 3.54 |
| `studio.page.design` | `default` | wide | 4, 3, 4, 4, 4, 3, 3, 3, 4, 4, 3, 4, 3 | 3.54 |
| `tasks.page.app-board` | `default` | mobile | 4, 4, 4, 4, 3, 3, 4, 3, 4, 3, 4, 3, 3 | 3.54 |
| `tasks.page.app-board` | `default` | tablet | 4, 4, 4, 4, 3, 3, 4, 3, 4, 3, 4, 3, 4 | 3.62 |
| `tasks.page.app-board` | `default` | desktop | 4, 4, 4, 4, 3, 3, 4, 3, 4, 3, 4, 3, 4 | 3.62 |
| `tasks.page.app-board` | `default` | wide | 4, 4, 4, 4, 3, 3, 4, 3, 4, 3, 4, 3, 4 | 3.62 |
| `timeline.page.the-wedding` | `default` | mobile | 4, 4, 4, 3, 4, 3, 3, 3, 4, 4, 3, 4, 3 | 3.54 |
| `timeline.page.the-wedding` | `default` | tablet | 4, 4, 4, 3, 3, 3, 3, 3, 4, 4, 4, 4, 3 | 3.54 |
| `timeline.page.the-wedding` | `default` | desktop | 4, 4, 4, 4, 4, 3, 3, 3, 4, 4, 4, 4, 3 | 3.69 |
| `timeline.page.the-wedding` | `default` | wide | 4, 4, 4, 4, 4, 3, 3, 3, 4, 4, 4, 4, 3 | 3.69 |
| `signal.page.demo` | `default` | mobile | 4, 4, 4, 4, 4, 3, 3, 3, 4, 4, 3, 4, 3 | 3.62 |
| `signal.page.demo` | `default` | tablet | 4, 4, 4, 4, 4, 3, 3, 3, 4, 4, 3, 4, 3 | 3.62 |
| `signal.page.demo` | `default` | desktop | 4, 4, 4, 4, 4, 3, 3, 3, 4, 4, 3, 4, 3 | 3.62 |
| `signal.page.demo` | `default` | wide | 4, 4, 4, 4, 4, 3, 3, 3, 4, 4, 3, 4, 3 | 3.62 |
| `notes.page.wedding-planning` | `default` | mobile | 4, 4, 4, 4, 4, 3, 3, 3, 4, 4, 3, 4, 3 | 3.62 |
| `notes.page.wedding-planning` | `default` | tablet | 4, 4, 4, 4, 4, 3, 3, 3, 4, 4, 3, 4, 3 | 3.62 |
| `notes.page.wedding-planning` | `default` | desktop | 4, 4, 4, 4, 4, 3, 3, 3, 4, 4, 3, 4, 3 | 3.62 |
| `notes.page.wedding-planning` | `default` | wide | 4, 4, 4, 4, 4, 3, 3, 3, 4, 4, 3, 4, 3 | 3.62 |

## Review disposition

- `studio.page.design`: approve. Clear design principles, strong responsive composition, and distinctive visual craft.
- `tasks.page.app-board`: approve. Lane-label legibility and tablet-title truncation were remediated; the final fixture contains no personal or customer data.
- `timeline.page.the-wedding`: approve. Strong narrative hierarchy and responsive behaviour across all four breakpoints.
- `signal.page.demo`: approve. The briefing/demo hierarchy, receipts, and playback presentation are coherent and production-ready.
- `notes.page.wedding-planning`: approve. The structured writing surface is legible, coherent, and stable across breakpoints.

No hard blocker or sensitive-data exposure was found in these 20 golden audits. This approval is deliberately narrow: it establishes the first evidence-complete golden set and does not certify the full 241-experience, 4,732-cell suite inventory.
