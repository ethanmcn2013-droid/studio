---
id: notes-three-direction-review-lab
title: Signal Notes three-direction review lab
product: Signal Notes
category: Core
status: Shipping
priority: High
effort: Medium
impact: High
owner: Ethan
principleAlignment: 98
---

## Review status

Phase 1 is complete. On 2026-07-18 Ethan selected the recommended hybrid and
authorized Phase 2 implementation plus production release. The isolated,
fixture-backed lab and its evidence remain the design record. Production rollout
is now in progress; this feature remains `Shipping`, not `Shipped`, until a live
deployment receipt and production verification are recorded.

## Review surface

- Protected lab: [Open Option A capture](https://signal-notes-design-ho4ai9mm4-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=a&scenario=capture&dataset=normal&mode=default&viewport=auto)
- Deployment inspector: [Vercel deployment](https://vercel.com/ethanmcn2013-1730s-projects/signal-notes-design-lab/6jaK1j5a82ZaxUQbtahy68MYubjK)
- Deployment: `dpl_6jaK1j5a82ZaxUQbtahy68MYubjK` · preview · READY · the only retained READY Preview in the isolated project
- Notes source branch: `feat/notes-world-class-lab-20260716`
- Immutable deployed source: [`9769f28c96871abae23ee9c3e674db195a54c5f4`](https://github.com/ethanmcn2013-droid/notes/commit/9769f28c96871abae23ee9c3e674db195a54c5f4)
- Final evidence ledger: [`5b9f2c088c8e36633c3981756f7bf744a258accd`](https://github.com/ethanmcn2013-droid/notes/commit/5b9f2c088c8e36633c3981756f7bf744a258accd)
- Notes review: [PR #24](https://github.com/ethanmcn2013-droid/notes/pull/24)

## Saved design set

Each direction uses the same normal dataset and default state so hierarchy,
interaction, and recovery can be compared without content drift.

- Option A — Instant Notebook: [Capture](https://signal-notes-design-ho4ai9mm4-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=a&scenario=capture&dataset=normal&mode=default&viewport=auto) · [Stream](https://signal-notes-design-ho4ai9mm4-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=a&scenario=stream&dataset=normal&mode=default&viewport=auto) · [Search](https://signal-notes-design-ho4ai9mm4-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=a&scenario=search&dataset=normal&mode=default&viewport=auto) · [Detail and extraction](https://signal-notes-design-ho4ai9mm4-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=a&scenario=detail&dataset=normal&mode=default&viewport=auto)
- Option B — Quiet Editorial Stream: [Capture](https://signal-notes-design-ho4ai9mm4-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=b&scenario=capture&dataset=normal&mode=default&viewport=auto) · [Stream](https://signal-notes-design-ho4ai9mm4-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=b&scenario=stream&dataset=normal&mode=default&viewport=auto) · [Search](https://signal-notes-design-ho4ai9mm4-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=b&scenario=search&dataset=normal&mode=default&viewport=auto) · [Detail and extraction](https://signal-notes-design-ho4ai9mm4-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=b&scenario=detail&dataset=normal&mode=default&viewport=auto)
- Option C — Capture Field: [Capture](https://signal-notes-design-ho4ai9mm4-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=c&scenario=capture&dataset=normal&mode=default&viewport=auto) · [Stream](https://signal-notes-design-ho4ai9mm4-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=c&scenario=stream&dataset=normal&mode=default&viewport=auto) · [Search](https://signal-notes-design-ho4ai9mm4-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=c&scenario=search&dataset=normal&mode=default&viewport=auto) · [Detail and extraction](https://signal-notes-design-ho4ai9mm4-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=c&scenario=detail&dataset=normal&mode=default&viewport=auto)

## Evidence

- Review archive: [Notes redesign evidence](https://github.com/ethanmcn2013-droid/notes/tree/5b9f2c088c8e36633c3981756f7bf744a258accd/docs/notes-redesign)
- Comparison: [scorecard](https://github.com/ethanmcn2013-droid/notes/blob/5b9f2c088c8e36633c3981756f7bf744a258accd/docs/notes-redesign/07-comparison-scorecard.md) · [council reviews](https://github.com/ethanmcn2013-droid/notes/blob/5b9f2c088c8e36633c3981756f7bf744a258accd/docs/notes-redesign/08-council-reviews.md) · [selection log](https://github.com/ethanmcn2013-droid/notes/blob/5b9f2c088c8e36633c3981756f7bf744a258accd/docs/notes-redesign/09-decision-log.md)
- Deployment proof: [protected preview and hard-404 receipt](https://github.com/ethanmcn2013-droid/notes/blob/5b9f2c088c8e36633c3981756f7bf744a258accd/docs/notes-redesign/evidence/deployment-receipt.md)
- Captures: [24 screenshots and manifest](https://github.com/ethanmcn2013-droid/notes/tree/5b9f2c088c8e36633c3981756f7bf744a258accd/docs/notes-redesign/evidence/screenshots) · [3 interaction videos](https://github.com/ethanmcn2013-droid/notes/tree/5b9f2c088c8e36633c3981756f7bf744a258accd/docs/notes-redesign/evidence/videos) · [3 browser traces](https://github.com/ethanmcn2013-droid/notes/tree/5b9f2c088c8e36633c3981756f7bf744a258accd/docs/notes-redesign/evidence/traces)
- The optimized build, TypeScript check, full `pnpm test`, and design-system check passed.
- Model and access checks passed 46 of 46. Browser evidence passed 37 of 37 Playwright checks and 27 automated Axe scans. Interaction monitoring observed no fetch, XHR, beacon, or WebSocket traffic.
- The protected deployment challenges anonymous requests with Vercel SSO without leaking lab content; authenticated verification returned 200 for all 12 saved review URLs.
- The ordinary Notes preview [`dpl_6541G26eVBYc9jFKbbovi36j1ao3`](https://notes-2gyfkyu96-ethanmcn2013-1730s-projects.vercel.app), built from the same immutable source, returns literal `404 Not Found` before authentication with `private, no-store`, `noindex, nofollow, noarchive`, and zero lab content.

## Selected hybrid

Founder selection recorded on 2026-07-18: `SELECT HYBRID`.

- From A: compact server-rendered capture, flat recency, integrated search,
  keyboard flow, and recovery behavior.
- From B: 64–72-character reading measure, context snippets, and editorial
  rhythm. Exclude B's masthead and date grouping.
- From C: desktop selected-row split, mobile full-screen detail, focused caret,
  and private-to-approved extraction. Exclude C's search rail.
- Shared contract: exact-selection extraction, editable approval, idempotent
  receipts, and conflict handling.

Option scores are A 8.93, B 9.06, and C 8.99. B is the strongest complete
single direction, but the hybrid preserves Notes' capture speed while taking the
best reading and detail behavior from the other directions.

The constrained performance runs did not meet the prompt's focus-under-1-second,
save-under-100-millisecond, or search-under-200-millisecond thresholds. External
screen-reader validation and physical-device validation also remain outstanding.
These are explicit acceptance edges, not hidden passes.

## Phase 2 release contract

The lab uses deterministic fixtures and session-only interactions. It does not
read or write production Notes data, and approved extraction is simulated behind
the exact selection and confirmation boundary. Phase 2 must port the selected
composition onto the real Notes data, auth, persistence, search, and extraction
machinery without importing lab fixtures or lab-only runtime code.

- Reversible release flag: `NOTES_HYBRID_NOTEBOOK_ENABLED=1`.
- Retain the legacy notebook implementation through production verification.
- Known-good production rollback deployment: `dpl_4AHTSVtR65ozDzwfVn8xNnzLSQQa`.
- Current live alias: `notes.signalstudio.ie`.
- Production deployment and verification receipt: pending.

The original Phase 1 founder gate is preserved in
[`choose-notes-design-lab-direction.md`](../operator-todos/choose-notes-design-lab-direction.md)
and is now satisfied by the exact hybrid selection above.

Saved: 2026-07-18 · hybrid selected; production receipt pending.
