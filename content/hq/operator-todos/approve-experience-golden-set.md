---
id: approve-experience-golden-set
title: Approve the first Signal experience golden set
status: open
priority: P0
blocking: true
phase: Experience Quality OS · Golden approval
why: Baselines need founder-approved reference experiences or the system can preserve mediocrity with perfect pixel consistency.
href: /hq/experience-quality
date: 2026-07-15
action: "Review, revise, and approve the provisional five-experience golden set."
product: "Signal Studio suite"
recommended: "Approve one exemplary Studio company-surface reference plus one from each of the four customer products only after every required breakpoint has deterministic evidence, complete 13-dimension review, and no hard blocker."
alternatives: ["Revise one or more reference IDs before approval", "Approve a smaller evidence-complete set and expand later", "Leave the set provisional"]
default: "The golden set remains provisional and cannot justify a score of 4, a baseline approval, or a suite-quality claim."
consequence: "Without approval, visual comparisons can detect change but there is no founder-ratified reference bar for exceptional Signal quality."
trigger: "After the standard is approved and before golden references are used to approve baselines or certify critical/core experiences."
links: ["../../../experience/golden-set.json", "../../../experience/capture-plan.json", "../../../docs/experience/VISUAL_BASELINE_PROCESS.md", "../../../docs/experience/AUDIT_RUBRIC.md", "approve-signal-experience-standard.md"]
---

## Steps

1. Approve the [Signal Experience Standard](approve-signal-experience-standard.md) first.
2. Review the exact IDs in [`golden-set.json`](../../../experience/golden-set.json). Confirm the Studio item is a company-surface reference and the other four represent Tasks, Timeline, Signal, and Notes. Each must be a meaningful archetype, not merely an attractive screenshot.
3. Reconcile the golden IDs/states with [`capture-plan.json`](../../../experience/capture-plan.json). Every approved golden reference must be directly and reproducibly captured.
4. Review mobile, tablet, desktop, and wide evidence for each reference, including candidate/baseline/diff, Axe/runtime results, states, and open findings.
5. Review all 13 dimension scores against the [rubric](../../../docs/experience/AUDIT_RUBRIC.md). A golden reference should earn the bar; it is not simply the first passing screen.
6. Choose one outcome: **approve the set**, **approve a named subset**, **replace named references**, or **keep provisional with the missing evidence listed**.
7. Once evidence and founder approval exist, update the golden-set status/approval history and this task to `done` in the same change.

## Done when

Every approved reference is reproducible, fully reviewed, baseline-linked, free of hard blockers, and explicitly approved as a coherent suite set by the founder.
