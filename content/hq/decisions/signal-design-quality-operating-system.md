---
id: signal-design-quality-operating-system
title: Run Signal design quality as a central evidence contract with federated enforcement
category: Product
date: 2026-07-15
status: Active
reviewDate: 2026-08-15
relatedObjects: [Signal Experience Standard, /hq/experience-quality, experience/registry.json, design-quality CI, Signal Review]
---

## Decision

Signal Studio adopts one Experience Quality Operating System across three explicit audience classes. Tasks, Timeline, Signal, and Notes are the four customer products. Studio outside `/hq*` is the company and brand surface. Signal HQ is the private founder-operator control plane, and Signal Review is its manual-review instrument; neither is customer-facing. HQ owns the canonical inventory, taxonomy, schemas, 13-dimension rubric, finding and exception contracts, baseline ratchet, golden set, and aggregate report. Each governed codebase owns fast deterministic evidence and remediation close to the code it changes. Specialist and founder judgment remain explicit rather than being fabricated from automated checks.

Studio grade means every one of the 13 dimensions scores at least 3, the mean is at least 3.5, rendered evidence exists, and no hard blocker remains. A high average cannot hide a weak dimension. Registration, a green capture, a merged branch, or a provisional golden set is not a launch claim.

Known debt may only shrink. New release-blocking/high debt fails enforcement unless an approved, time-boxed exception applies. Visual changes need a review disposition; baselines are updated only after human approval. The founder retains approval of the standard, the golden set, visual baselines, capture access, and exceptions through canonical operator tasks.

## Reason

The four customer products span separate repositories but present one system to users, alongside the Studio company surface. Codebase-only checks allow language, state, accessibility, and brand gates to drift. Central-only capture is slow and brittle, while taste-only review cannot reliably prove inventory, coverage, accessibility, or regression. A central contract with federated checks keeps one bar without separating evidence from the teams and agents that can fix it.

Deterministic evidence and subjective judgment answer different questions. HTTP, overflow, Axe, page errors, timing, hashes, and diffs establish reproducible facts. Purpose, architecture, hierarchy, writing, composition, interaction, and craft require rendered review. The operating system records both without pretending either can replace the other.

## Alternatives considered

Run one central screenshot gate for every product PR (rejected: slow, credential-heavy, and detached from product ownership). Let each product define its own quality rubric (rejected: recreates the drift this system exists to stop). Treat snapshot stability as design quality (rejected: pixels do not prove purpose, interaction, state completeness, or craft). Rely on ad hoc founder review (rejected: valuable judgment without a reproducible inventory or ratchet).

## Risks

The current GitHub workflow validates Studio discovery, self-tests, audit ratchets, and the Playwright harness, but it does not run the cross-product capture command or enable strict capture-regression enforcement. Product-side required checks are also not yet complete. Until those activation gates close, HQ must describe results as current evidence—not full federated no-regression coverage.

A registry can create false confidence if coverage is empty or evidence stale. Remote capture can be flaky without controlled fixtures, identities, assets, and environments. Central schemas can become a bottleneck if product extensions are not governed. These risks are accepted only with explicit coverage reporting and narrow claims.

## Notes

Canonical documents: [Signal Experience Standard](../../../docs/experience/SIGNAL_EXPERIENCE_STANDARD.md), [Audit Rubric](../../../docs/experience/AUDIT_RUBRIC.md), [Definition of Done](../../../docs/experience/STUDIO_GRADE_DEFINITION_OF_DONE.md), [Design Quality CI](../../../docs/experience/DESIGN_QUALITY_CI.md), [Visual Baseline Process](../../../docs/experience/VISUAL_BASELINE_PROCESS.md), and [architecture decision](../../../docs/experience/ADR-CENTRAL-QUALITY-FEDERATED-ENFORCEMENT.md).

Founder gates: [approve the standard](../operator-todos/approve-signal-experience-standard.md), [approve the golden set](../operator-todos/approve-experience-golden-set.md), [approve visual baselines](../operator-todos/approve-experience-visual-baselines.md), and [provision authenticated capture access](../operator-todos/provision-authenticated-experience-capture.md). The operating machinery may continue collecting safe public and local evidence while these remain open; it may not self-award approvals or place credentials in the repository.
