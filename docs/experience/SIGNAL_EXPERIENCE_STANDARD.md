# Signal Experience Standard

- Status: **approved**
- Owner: Signal Studio HQ
- Approved by: Ethan McNamara, founder
- Approved on: 2026-07-15
- Approval source: [Founder authorization receipt](../../content/hq/decisions/experience-quality-founder-authorization-2026-07-15.md)
- Approval task: [Approve the Signal Experience Standard](../../content/hq/operator-todos/approve-signal-experience-standard.md)

The Signal Experience Standard is the suite-wide quality contract for four customer products (Tasks, Timeline, Signal, and Notes), the Studio company and brand surface, and the private founder-operator tools in Signal HQ and Signal Review. Signal HQ is the internal control plane. Signal Review is its manual-review instrument. Neither is a customer-facing product. The standard governs complete experiences: a route or triggered surface, for a defined role, in a defined state, at a defined breakpoint. A component, screenshot, test, or aggregate score cannot be called Studio grade on its own.

## Authority

The machine-readable contract lives in [`experience/`](../../experience/). This document explains the operating standard; it does not replace the registry or schemas.

1. [`src/lib/experience-quality/types.ts`](../../src/lib/experience-quality/types.ts) defines the canonical vocabulary and score gate.
2. [`experience/registry.json`](../../experience/registry.json) is the generated inventory of experiences.
3. Findings, audits, reviews, exceptions, baselines, and the golden set are separate evidence ledgers under [`experience/`](../../experience/).
4. [`scripts/experience/audit.mjs`](../../scripts/experience/audit.mjs) is the current executable audit gate.
5. This standard and its companion documents define how people interpret and approve that evidence.

Generated reports are snapshots, not authority. If a report and a newer capture manifest disagree, regenerate the report; never choose the more flattering number.

## Seven laws

1. **Inventory before claims.** Every route, state surface, overlay, shared link, report, email, and extension surface must have a stable registry entry before it can pass.
2. **Evidence before scores.** Every audit names the experience, state, breakpoint, reviewer, date, and rendered evidence. Empty evidence invalidates the audit.
3. **Checks do not manufacture taste.** Deterministic checks establish facts. They cannot award purpose, hierarchy, composition, voice, or craft scores without rendered specialist or human review.
4. **The weakest dimension matters.** Studio grade requires all 13 dimensions at 3 or above and an average of at least 3.5. A high average cannot hide a broken category.
5. **Hard blockers override arithmetic.** A release blocker, invalid registry, unsafe capture, or unapproved visual regression fails the gate regardless of score.
6. **Quality only ratchets upward.** Approved baselines and known-debt lists may move forward or shrink. New high-risk debt needs an explicit, expiring exception; it is never silently absorbed.
7. **Approval is not self-awarded.** Automated evidence, specialist review, and agents may recommend approval. Only the named human approver may approve the standard, the golden set, or a new visual baseline.

## Evidence classes

| Evidence class | Establishes | Cannot establish by itself | Examples |
|---|---|---|---|
| Deterministic | Reproducible facts | Desirability, clarity, taste, or craft | HTTP result, overflow, Axe output, page errors, screenshot hash, visual diff, timing |
| Deterministic plus human | A fact plus expert interpretation | A subjective score without the human review | Keyboard traversal, assistive-technology behavior, responsive intent, implementation fidelity |
| Specialist review | Dimension-specific judgment with cited rendered evidence | Unrelated dimensions or launch approval | Product clarity, information architecture, visual design, interaction review |
| Human approval | Acceptance of a standard, golden reference, baseline, or exception | Proof that deterministic checks passed | Founder approval history and an approval source |

Specialists emit evidence and findings. A lint count, token scan, Axe run, or pixel diff may create a finding; it may not be converted mechanically into a subjective 0–4 score.

## Experience classes and audiences

Every registry entry has one machine-readable `experienceClass`. The class identifies what the surface is; `roles` names the more specific people or review roles within that class.

| Experience class | Canonical scope | Audience rule |
|---|---|---|
| `customer-product` | Tasks, Timeline, Signal, and Notes | Customer and collaborator experiences |
| `company-public` | Studio routes outside `/hq*` | Public company, brand, pricing, proof, legal, and access information |
| `founder-operator` | Every Studio `/hq*` route, HQ surface, and Signal Review surface | Private founder/operator work and manual review only |

Discovery assigns this field deterministically. A source-system label such as `studio` or `signal-review` does not make that source a customer product.

## Lifecycle

An experience moves through the canonical audit statuses:

`registered` → `baseline-captured` → `under-remediation` → `passing`

Use `blocked` when a hard blocker prevents approval. Use `exception` only when an intentional exception is approved, linked, and unexpired. Registration or a green capture is not a Studio-grade result.

## Studio-grade gate

For every required state and breakpoint in scope:

- all 13 scores are integers from 0 through 4;
- every dimension is at least 3;
- the arithmetic mean is at least 3.5, rounded to two decimals;
- rendered evidence is present;
- no unresolved release-blocking finding exists;
- deterministic capture blockers are clear;
- any visual change is approved or resolved through a review record;
- required fixture, screenshot, accessibility, and automated-test coverage is complete; and
- the experience has no expired or unlinked exception.

The complete gate is in [Studio-grade Definition of Done](./STUDIO_GRADE_DEFINITION_OF_DONE.md); the score anchors are in [Audit Rubric](./AUDIT_RUBRIC.md).

## Ownership model

Signal Studio HQ is the private founder-operator control plane and centrally owns the vocabulary, schemas, taxonomy, golden set, reporting contract, and suite-level standard. The four customer-product repositories own their fixtures, deterministic checks, remediation, and evidence freshness. Studio owns equivalent evidence for its company-public surface. Signal Review is HQ's manual-review instrument: it can contribute review records and findings, but it is not a customer product and cannot approve its own work. See [ADR: Central quality, federated enforcement](./ADR-CENTRAL-QUALITY-FEDERATED-ENFORCEMENT.md).

## No-regression rule

A change may improve the baseline, preserve it, or ship behind a time-boxed approved exception. It may not lower an approved dimension, add unbaselined high-risk debt, remove coverage, or accept an unexplained visual change. The current implementation can enforce capture regressions when `EXPERIENCE_ENFORCE_CAPTURE=1`; until that flag is enabled in the required CI check, the generated report must not be described as strict visual no-regression enforcement.

## Related documents

- [Screen Taxonomy](./SCREEN_TAXONOMY.md)
- [Audit Rubric](./AUDIT_RUBRIC.md)
- [Studio-grade Definition of Done](./STUDIO_GRADE_DEFINITION_OF_DONE.md)
- [Design Quality CI](./DESIGN_QUALITY_CI.md)
- [Visual Baseline Process](./VISUAL_BASELINE_PROCESS.md)
