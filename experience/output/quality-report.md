# Signal design quality report

Generated: 2026-07-15T15:06:01.509Z
Status: **baseline-held**
Readiness: **not-certified**

## Inventory

- 243 registered experiences
- 1191 required state variants
- 972 required breakpoint variants
- 0 Studio-grade experiences
- 139 customer-product experiences across Tasks, Timeline, Signal, and Notes
- 43 company-public Studio experiences
- 61 founder-operator experiences across Signal HQ and Signal Review
- 9/1191 required state variants have rendered pilot evidence
- 36/972 required breakpoint variants have rendered pilot evidence
- 36/36 rendered pilot captures pass deterministic accessibility/runtime gates
- 6/6 governed repositories pass design-system conformance

## Experience classes

Tasks, Timeline, Signal, and Notes are the four customer products. The Studio public site is the company and brand surface. Signal HQ is the internal founder-operator control plane, and Signal Review is its manual-review instrument.

| Experience class | Experiences | Critical | Passing | Open findings | Release blocking |
|---|---:|---:|---:|---:|---:|
| customer-product | 139 | 56 | 0 | 0 | 0 |
| company-public | 43 | 9 | 0 | 0 | 0 |
| founder-operator | 61 | 9 | 0 | 0 | 0 |

## Source systems

| Product | Experiences | Critical | Passing | Open findings | Release blocking |
|---|---:|---:|---:|---:|---:|
| notes | 20 | 11 | 0 | 0 | 0 |
| signal | 31 | 14 | 0 | 0 | 0 |
| signal-review | 4 | 4 | 0 | 0 | 0 |
| studio | 100 | 14 | 0 | 0 | 0 |
| tasks | 59 | 20 | 0 | 0 | 0 |
| timeline | 29 | 11 | 0 | 0 | 0 |

## Gate

- Structural errors: 0
- Unbaselined high-risk findings: 0
- Capture regressions requiring review: 0
- Missing founder-approved visual baselines: 36
- Open findings: 0 (0 release-blocking, 0 high)
- Experiences under remediation: 0
- Experiences not yet reviewed since registration/material change: 222
- Expired exceptions: 0
- Golden set: provisional

A passing inventory count is not a launch claim. A surface is Studio grade only after all 13 scores, rendered evidence, deterministic checks, and hard blockers pass.
