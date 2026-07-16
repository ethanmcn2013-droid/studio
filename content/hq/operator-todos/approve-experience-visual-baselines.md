---
id: approve-experience-visual-baselines
title: Approve the first Signal visual baselines
status: done
priority: P0
blocking: false
phase: Experience Quality OS · Baseline approval
why: The current pilot has candidate screenshots but no founder-approved comparison artifacts, so visual no-regression and Studio-grade claims remain blocked.
href: /hq/experience-quality
date: 2026-07-15
action: "Review each current candidate at every required breakpoint and approve, reject, or return it for remediation."
product: "Signal Studio quality system"
recommended: "Approve only deterministic, personal-data-free candidates that pass runtime and accessibility checks, have no unresolved hard blocker, and reflect the intended Signal quality bar."
alternatives: ["Approve a named evidence-complete subset and leave the remainder pending", "Reject named candidates and attach remediation findings", "Keep all candidates unapproved"]
default: "Candidates remain evidence only; none is copied into the approved baseline set or used to claim visual no-regression."
consequence: "Until approval, visual changes can be observed but cannot be certified against a founder-approved reference."
trigger: "After the standard is approved and before strict visual capture enforcement or any Studio-grade claim."
links: ["../../../experience/output/capture-manifest.json", "../../../docs/experience/VISUAL_BASELINE_PROCESS.md", "../../../docs/experience/STUDIO_GRADE_DEFINITION_OF_DONE.md", "approve-signal-experience-standard.md", "approve-experience-golden-set.md"]
---

## Steps

1. Approve the [Signal Experience Standard](approve-signal-experience-standard.md) first.
2. Inspect every candidate in [`capture-manifest.json`](../../../experience/output/capture-manifest.json) at mobile, tablet, desktop, and wide. Confirm the route, state, fixture, locale, time zone, reduced-motion setting, and visual content are intentional.
3. Review HTTP/runtime results, overflow, Axe output, console/page errors, open findings, and any diff together. A stable screenshot hash alone is not approval evidence.
4. Confirm no screenshot contains personal, customer, credential, or unstable production data.
5. Record an explicit disposition per candidate: **approve**, **reject with named finding**, or **not comparable until fixture repair**.
6. For approved candidates only, execute the documented approval command with `SIGNAL_EXPERIENCE_BASELINE_APPROVED_BY` set to the founder identity. Do not store that identity or any credential in source control.
7. Update review records, registry baseline references, the generated report, and this task in the same evidence change.

## Done when

Every approved baseline has an exact candidate/source reference, deterministic environment, founder approval record, corresponding review disposition, and current registry reference; every unapproved candidate remains visibly pending or linked to remediation.

## Completion evidence

- All 36 requested public candidates were approved after rendered review at mobile, tablet, desktop, and wide.
- Four authenticated Tasks board candidates were also approved to support the golden set, producing 40 approved baselines and 40 matching founder-authorized review records in total.
- The combined pilot manifest contains 56/56 passing captures, zero visual changes, zero runtime/accessibility blockers, and 16 intentionally unbaselined protected candidates outside the approved reference scope.
- Two consecutive protected production runs captured the same 20 authenticated views with zero screenshot-hash changes: [run 29461487495](https://github.com/ethanmcn2013-droid/studio/actions/runs/29461487495) and [run 29461638860](https://github.com/ethanmcn2013-droid/studio/actions/runs/29461638860).
- Candidate bytes, baseline bytes, review IDs, approvals, and golden audits are content-addressed and fail closed if they drift.
