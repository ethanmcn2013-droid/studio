---
id: approve-signal-experience-standard
title: Approve the Signal Experience Standard and Studio-grade gate
status: done
priority: P0
blocking: true
phase: Experience Quality OS · Governance
why: The suite needs one founder-ratified definition of quality before automated evidence or reviewers can make a Studio-grade release claim.
href: /hq/experience-quality
date: 2026-07-15
action: "Review and approve, revise, or reject the Signal Experience Standard."
product: "Signal Studio suite"
recommended: "Approve the proposed standard: exact 13-dimension rubric, minimum 3 per dimension, 3.5 overall, hard blockers, evidence separation, expiring exceptions, and no-regression ratchet."
alternatives: ["Request specific rubric or governance changes before approval", "Keep the operating system provisional and prohibit Studio-grade claims"]
default: "The standard remains proposed; evidence may be collected, but no experience or suite scope is called Studio grade."
consequence: "Until approval, branch gates may enforce deterministic integrity but cannot represent founder-ratified experience quality."
trigger: "Before design-quality enforcement becomes a required release check or any launch-readiness claim cites Studio grade."
links: ["../../../docs/experience/SIGNAL_EXPERIENCE_STANDARD.md", "../../../docs/experience/AUDIT_RUBRIC.md", "../../../docs/experience/STUDIO_GRADE_DEFINITION_OF_DONE.md", "../../../docs/experience/DESIGN_QUALITY_CI.md", "../decisions/signal-design-quality-operating-system.md"]
---

## Steps

1. Read the [Signal Experience Standard](../../../docs/experience/SIGNAL_EXPERIENCE_STANDARD.md), [Audit Rubric](../../../docs/experience/AUDIT_RUBRIC.md), and [Studio-grade Definition of Done](../../../docs/experience/STUDIO_GRADE_DEFINITION_OF_DONE.md).
2. Confirm the division between deterministic facts and subjective/specialist judgment. Automated checks must not manufacture clarity, hierarchy, composition, voice, or craft scores.
3. Confirm the gate: all 13 dimensions are integers 0–4; every dimension is at least 3; the mean is at least 3.5; rendered evidence exists; hard blockers are clear.
4. Confirm the risk model: known debt may only shrink; new high-risk debt needs a founder-approved, time-boxed exception; expired exceptions fail.
5. Confirm the operating model in the [central-quality ADR](../../../docs/experience/ADR-CENTRAL-QUALITY-FEDERATED-ENFORCEMENT.md): Tasks, Timeline, Signal, and Notes are the four customer products; Studio is the company surface; HQ and Signal Review are private founder-operator tools; HQ owns the contract; governed repositories own fast local evidence; and humans retain reserved approvals.
6. Record one outcome: **approve as written**, **approve with named amendments**, or **reject and state the replacement rule**.
7. After approval is evidenced, update the standard status and this task to `done`; do not mark either optimistically.

## Done when

The founder decision is recorded, all named amendments are reflected in the machine-readable contract and docs, and the required release check uses the approved semantics.

## Completion evidence

- Founder decision: **approved with the evidence-integrity amendments implemented in this change**.
- Approver: Ethan McNamara, founder.
- Approval date: 2026-07-15.
- Approval source: [Founder authorization receipt](../decisions/experience-quality-founder-authorization-2026-07-15.md).
- The approved score anchors are `0 Broken or absent`, `1 Functional but materially deficient`, `2 Competent`, `3 Polished`, and `4 Studio-grade`.
- The executable gate now rejects unknown or duplicate audit cells, missing rendered artifacts, false registry passing claims, and missing, expired, unlinked, or non-founder exceptions.
