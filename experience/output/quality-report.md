# Signal design quality report

Generated: 2026-08-13T01:14:35.090Z
Status: **baseline-held**
Readiness: **not-certified**

## Inventory

- 245 registered experiences
- 1196 required state variants
- 980 required breakpoint variants
- 4784 required state/breakpoint audit cells
- 0 evidence-proven Studio-grade experiences (0 registry assertions)
- 139 customer-product experiences across Tasks, Timeline, Signal, and Notes
- 38 company-public Studio experiences
- 68 founder-operator experiences across Signal HQ and Signal Review
- 16/1196 required state variants have rendered pilot evidence
- 64/980 required breakpoint variants have rendered pilot evidence
- 64/64 rendered pilot captures pass deterministic accessibility/runtime gates
- 6/6 governed repositories pass design-system conformance

## Experience classes

Tasks, Timeline, Signal, and Notes are the four customer products. The Studio public site is the company and brand surface. Signal HQ is the internal founder-operator control plane, and Signal Review is its manual-review instrument.

| Experience class | Experiences | Critical | Passing | Open findings | Release blocking |
|---|---:|---:|---:|---:|---:|
| customer-product | 139 | 56 | 0 | 0 | 0 |
| company-public | 38 | 9 | 0 | 0 | 0 |
| founder-operator | 68 | 9 | 0 | 0 | 0 |

## Source systems

| Product | Experiences | Critical | Passing | Open findings | Release blocking |
|---|---:|---:|---:|---:|---:|
| notes | 20 | 11 | 0 | 0 | 0 |
| signal | 31 | 14 | 0 | 0 | 0 |
| signal-review | 4 | 4 | 0 | 0 | 0 |
| studio | 102 | 14 | 0 | 0 | 0 |
| tasks | 59 | 20 | 0 | 0 | 0 |
| timeline | 29 | 11 | 0 | 0 | 0 |

## Gate

- Structural errors: 0
- Passing audit cells: 20/4784
- Missing audit cells: 4764
- Duplicate audit cells: 0
- False passing assertions: 0
- Unbaselined high-risk findings: 0
- Capture regressions requiring review: 0
- Missing founder-approved visual baselines: 24
- Open findings: 0 (0 release-blocking, 0 high)
- Experiences under remediation: 0
- Experiences not yet reviewed since registration/material change: 214
- Expired exceptions: 0
- Golden set: approved
- Certification blocker: 20/4784 required state/breakpoint audit cells pass
- Certification blocker: 24 visual baselines await approval

A passing inventory count is not a launch claim. A surface is Studio grade only after all 13 scores, rendered evidence, deterministic checks, and hard blockers pass.
