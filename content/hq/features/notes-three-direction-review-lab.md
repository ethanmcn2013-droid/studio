---
id: notes-three-direction-review-lab
title: Signal Notes three-direction review lab
product: Signal Notes
category: Core
status: Built
priority: High
effort: Medium
impact: High
owner: Ethan
principleAlignment: 98
---

## Review status

Phase 1 is complete and the founder selection is open. Production Signal Notes
routes and data remain unchanged. The lab is isolated, fixture-backed, and
deployed only as a protected Vercel preview. Phase 2 must not begin until Ethan
explicitly selects A, B, C, or names the exact components of a hybrid.

## Review surface

- Protected lab: [Open Option A capture](https://signal-notes-design-7os3l8464-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=a&scenario=capture&dataset=normal&mode=default&viewport=auto)
- Deployment inspector: [Vercel deployment](https://vercel.com/ethanmcn2013-1730s-projects/signal-notes-design-lab/D7PLHydCpJV1TtzfZ3EcGWJ9S4jd)
- Deployment: `dpl_D7PLHydCpJV1TtzfZ3EcGWJ9S4jd` · preview · READY
- Notes source branch: `feat/notes-world-class-lab-20260716`
- Immutable candidate: [`b844108f34c6a8281f873ee5739df5d6ac35fbd9`](https://github.com/ethanmcn2013-droid/notes/commit/b844108f34c6a8281f873ee5739df5d6ac35fbd9)
- Delivery record: [`a6c28677568b44f88ccef626b9423003e9ac078b`](https://github.com/ethanmcn2013-droid/notes/commit/a6c28677568b44f88ccef626b9423003e9ac078b)
- Notes review: [PR #24](https://github.com/ethanmcn2013-droid/notes/pull/24)

## Saved design set

Each direction uses the same normal dataset and default state so hierarchy,
interaction, and recovery can be compared without content drift.

- Option A — Instant Notebook: [Capture](https://signal-notes-design-7os3l8464-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=a&scenario=capture&dataset=normal&mode=default&viewport=auto) · [Stream](https://signal-notes-design-7os3l8464-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=a&scenario=stream&dataset=normal&mode=default&viewport=auto) · [Search](https://signal-notes-design-7os3l8464-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=a&scenario=search&dataset=normal&mode=default&viewport=auto) · [Detail and extraction](https://signal-notes-design-7os3l8464-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=a&scenario=detail&dataset=normal&mode=default&viewport=auto)
- Option B — Quiet Editorial Stream: [Capture](https://signal-notes-design-7os3l8464-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=b&scenario=capture&dataset=normal&mode=default&viewport=auto) · [Stream](https://signal-notes-design-7os3l8464-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=b&scenario=stream&dataset=normal&mode=default&viewport=auto) · [Search](https://signal-notes-design-7os3l8464-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=b&scenario=search&dataset=normal&mode=default&viewport=auto) · [Detail and extraction](https://signal-notes-design-7os3l8464-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=b&scenario=detail&dataset=normal&mode=default&viewport=auto)
- Option C — Capture Field: [Capture](https://signal-notes-design-7os3l8464-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=c&scenario=capture&dataset=normal&mode=default&viewport=auto) · [Stream](https://signal-notes-design-7os3l8464-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=c&scenario=stream&dataset=normal&mode=default&viewport=auto) · [Search](https://signal-notes-design-7os3l8464-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=c&scenario=search&dataset=normal&mode=default&viewport=auto) · [Detail and extraction](https://signal-notes-design-7os3l8464-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=c&scenario=detail&dataset=normal&mode=default&viewport=auto)

## Evidence

- Review archive: [Notes redesign evidence](https://github.com/ethanmcn2013-droid/notes/tree/a6c28677568b44f88ccef626b9423003e9ac078b/docs/notes-redesign)
- Comparison: [scorecard](https://github.com/ethanmcn2013-droid/notes/blob/a6c28677568b44f88ccef626b9423003e9ac078b/docs/notes-redesign/07-comparison-scorecard.md) · [council reviews](https://github.com/ethanmcn2013-droid/notes/blob/a6c28677568b44f88ccef626b9423003e9ac078b/docs/notes-redesign/08-council-reviews.md) · [selection log](https://github.com/ethanmcn2013-droid/notes/blob/a6c28677568b44f88ccef626b9423003e9ac078b/docs/notes-redesign/09-decision-log.md)
- Deployment proof: [protected preview receipt](https://github.com/ethanmcn2013-droid/notes/blob/a6c28677568b44f88ccef626b9423003e9ac078b/docs/notes-redesign/evidence/deployment-receipt.md)
- Captures: [24 screenshots and manifest](https://github.com/ethanmcn2013-droid/notes/tree/a6c28677568b44f88ccef626b9423003e9ac078b/docs/notes-redesign/evidence/screenshots) · [3 interaction videos](https://github.com/ethanmcn2013-droid/notes/tree/a6c28677568b44f88ccef626b9423003e9ac078b/docs/notes-redesign/evidence/videos) · [3 browser traces](https://github.com/ethanmcn2013-droid/notes/tree/a6c28677568b44f88ccef626b9423003e9ac078b/docs/notes-redesign/evidence/traces)
- The optimized build, TypeScript check, full `pnpm test`, and design-system check passed.
- Browser evidence passed 37 of 37 Playwright checks and 27 automated Axe scans. Interaction monitoring observed no fetch, XHR, beacon, or WebSocket traffic.
- An anonymous request received the expected 302 Vercel sign-in challenge without lab-content leakage. Authenticated verification returned 200 for all 12 saved review URLs. A production-shaped build hard-404s the lab route.

## Recommendation

The evidence supports a deliberate hybrid rather than one direction unchanged:

- Carry forward A's compact server-rendered capture, flat recency, integrated search, keyboard model, and recovery behavior.
- Carry forward B's 64–72-character reading measure, context snippets, and editorial rhythm, but not its masthead or date grouping.
- Carry forward C's desktop selected-row split, mobile full-screen detail, focused caret, and private-to-approved transition, but not its search rail.
- Keep the shared exact-selection boundary, idempotent extraction receipt, and conflict model.

Option scores are A 8.93, B 9.06, and C 8.99. B is the strongest complete
single direction, but the hybrid preserves Notes' capture speed while taking the
best reading and detail behavior from the other directions.

The constrained performance runs did not meet the prompt's focus-under-1-second,
save-under-100-millisecond, or search-under-200-millisecond thresholds. External
screen-reader validation and physical-device validation also remain outstanding.
These are explicit acceptance edges, not hidden passes.

## Review contract

The lab uses deterministic fixtures and session-only interactions. It does not
read or write production Notes data, and approved extraction is simulated behind
the exact selection and confirmation boundary. The operator gate remains open
until Ethan replies with `SELECT A`, `SELECT B`, `SELECT C`, or `SELECT HYBRID`
followed by the exact components to combine.

Saved: 2026-07-18 · protected preview from the isolated Signal Notes design-lab branch.
