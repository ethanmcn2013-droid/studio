---
id: notes-hybrid-selected-2026-07-18
title: Signal Notes production adopts the selected capture, reading, and detail hybrid.
category: Product
date: 2026-07-18
status: Active
reviewDate: 2026-10-18
relatedObjects: [Signal Notes, notes-three-direction-review-lab, choose-notes-design-lab-direction, NOTES_HYBRID_NOTEBOOK_ENABLED]
---

## Decision

Ethan selected `SELECT HYBRID` on 2026-07-18 and authorized implementation and
production release. Signal Notes production will combine:

- Option A's compact server-rendered capture, flat recency, integrated search,
  keyboard flow, and recovery behavior.
- Option B's 64–72-character reading measure, context snippets, and editorial
  rhythm, excluding its masthead and date grouping.
- Option C's desktop selected-row split, mobile full-screen detail, focused
  caret, and private-to-approved extraction, excluding its search rail.
- The shared exact-selection extraction boundary, editable approval,
  idempotent receipt, and conflict model.

Phase 2 ports this composition onto production Notes machinery. The fixture
corpus and lab-only runtime remain isolated evidence and must not become a
second data path.

## Reason

No complete lab direction earned the release bar unchanged. A best preserves
the immediacy of capture and recovery; B gives saved notes a quiet, readable
editorial rhythm; C provides the strongest responsive detail and approval
journey. The named hybrid takes those strengths without importing B's extra
chrome or C's competing search rail. It preserves Notes' role as the private
capture layer in the suite while making retrieval, reading, and approved
extraction materially clearer.

## Alternatives considered

Ship A, B, or C unchanged; keep the current production notebook; or continue
the design lab without a founder selection. B was the strongest single option,
but it would trade away capture directness. The current notebook remains a
rollback implementation, not the selected destination.

## Reversible release contract

- Release flag: `NOTES_HYBRID_NOTEBOOK_ENABLED=1`.
- Retain the legacy notebook until the production release is verified.
- Known-good production rollback deployment: `dpl_4AHTSVtR65ozDzwfVn8xNnzLSQQa`.
- Current live alias: `notes.signalstudio.ie`.
- Production deployment and verification receipt: pending.

If the new notebook causes a material capture, persistence, search, extraction,
accessibility, or authenticated-journey regression, disable the flag or restore
the known-good deployment, then preserve the failed deployment evidence for
diagnosis.

## Risks

Combining three directions can drift into a composite with no hierarchy. The
exclusions are therefore part of the decision, not optional polish. Production
data and auth may expose states absent from the deterministic lab; rollout must
verify existing-note compatibility, mobile detail navigation, keyboard capture,
offline/conflict recovery, and exact-selection approval against real machinery.

## Evidence

- Protected Phase 1 lab: <https://signal-notes-design-ho4ai9mm4-ethanmcn2013-1730s-projects.vercel.app/__design-lab/notes?option=a&scenario=capture&dataset=normal&mode=default&viewport=auto>
- Notes evidence ledger: <https://github.com/ethanmcn2013-droid/notes/tree/5b9f2c088c8e36633c3981756f7bf744a258accd/docs/notes-redesign>
- Comparison scorecard: <https://github.com/ethanmcn2013-droid/notes/blob/5b9f2c088c8e36633c3981756f7bf744a258accd/docs/notes-redesign/07-comparison-scorecard.md>
- Council reviews: <https://github.com/ethanmcn2013-droid/notes/blob/5b9f2c088c8e36633c3981756f7bf744a258accd/docs/notes-redesign/08-council-reviews.md>
- Phase 1 review: <https://github.com/ethanmcn2013-droid/notes/pull/24>

## Notes

The founder selection closes the Phase 1 operator gate and authorizes Phase 2.
It does not itself prove the production release shipped. Keep the feature at
`Shipping` until the live alias, release flag, authenticated journeys, rollback
path, and production telemetry are verified and linked from the HQ feature.
