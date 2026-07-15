# ADR: Central quality, federated enforcement

- Status: Proposed pending founder approval of the [Signal Experience Standard](./SIGNAL_EXPERIENCE_STANDARD.md)
- Date: 2026-07-15
- Decision owner: Signal Studio HQ
- Scope: four customer products (Tasks, Timeline, Signal, Notes), the Studio company surface, and private founder-operator tooling (Signal HQ and Signal Review)

## Context

The customer suite is delivered from four product repositories, while the Studio public site supplies the company and brand surface. Signal HQ is an internal founder-operator control plane and Signal Review is its manual-review instrument; neither is a customer-facing product. Purely local quality checks miss cross-product and company-surface drift; purely central checks become slow, stale, credential-heavy, and detached from the code that introduced the change. Subjective taste cannot be reduced to lint, while subjective review without machine evidence cannot reliably prevent regression.

The current implementation already centralizes registry discovery, schemas, taxonomy, findings, audits, reviews, baselines, the provisional golden set, reporting, and a Studio CI workflow. Product-local required quality checks and strict cross-product capture enforcement are not yet fully deployed.

## Decision

Adopt a **central contract with federated enforcement**:

1. **Signal Studio HQ owns the quality language.** It is the canonical home for IDs, taxonomy, schemas, dimensions, score gates, finding severities, exception shape, golden approval, and aggregate reporting.
2. **Each governed codebase owns fast evidence close to its code.** Customer-product PRs and the Studio company surface must prove registered surfaces, deterministic fixtures, accessibility, responsive behavior, and approved visual changes for what they alter.
3. **The central pipeline integrates rather than reimplements.** It validates references and ratchets, aggregates product evidence, runs cross-suite checks, and exposes gaps without pretending an inventory count is a launch claim.
4. **Human judgment remains explicit.** Specialists score subjective/mixed dimensions from rendered evidence. Founder approval remains mandatory for the standard, golden set, baseline approval, and exceptions.
5. **Audience class is explicit.** Registry discovery assigns `customer-product`, `company-public`, or `founder-operator`; source-system names cannot silently recast an internal tool as a product.
6. **Signal Review is an instrument, not an authority or product.** It may produce findings, annotations, screenshots, and review history in the canonical schemas for HQ; it cannot self-approve or bypass the gate.

## Responsibility boundary

| Concern | Central HQ | Governed repository | Human approver |
|---|---|---|---|
| Vocabulary, schemas, taxonomy, score formula | Owns | Consumes | Approves standard |
| Route/surface discovery | Aggregates and validates | Supplies accurate source and explicit surfaces | Reviews material omissions |
| Fixtures and state reachability | Requires coverage | Owns and maintains | Reviews sensitive data/identity choices |
| Accessibility, overflow, runtime, visual capture | Defines evidence shape | Runs deterministic checks for changed scope | Interprets mixed evidence |
| Findings and remediation | Aggregates/ratchets | Owns fixes and resolution evidence | Approves exceptions |
| Subjective 13-dimension review | Routes and records | Supplies rendered evidence | Specialists score; founder approves golden references |
| Release gate | Reports suite status | Blocks local regressions | Does not override hard evidence informally |

## Evidence flow

`product change` → `local deterministic evidence` → `canonical finding/review records` → `central validation and ratchets` → `specialist judgment` → `founder approval where reserved` → `baseline-held report`

Evidence is appendable history; status is derived. A newer source materiality hash invalidates stale coverage until refreshed. A changed screenshot needs a disposition, not a threshold-based auto-approval.

## Enforcement sequence

### Implemented now

- central discovery/registry validation across the workspace;
- exact 13-dimension audit validation and score gate;
- finding, baseline, exception, review, and materiality ratchets;
- deterministic capture runner and review artifacts;
- Studio GitHub workflow with validation, fail-closed self-tests, audit enforcement, and Playwright harness; and
- Signal Review adapter tests/import path.

### Required before claiming federation complete

- required product-side checks in every product repository;
- deterministic fixtures/credentials for critical and core states;
- product evidence publishing into the central contract;
- strict capture regression enforcement in the required integration check; and
- branch protection and ownership for flaky or expired evidence.

## Consequences

### Positive

- One standard and evidence schema prevents separate codebases from inventing incompatible interpretations of “done.”
- Product teams receive fast, scoped feedback while HQ retains cross-suite coherence.
- Deterministic facts and subjective judgment remain auditable instead of being blended into a magic score.
- Known debt and exceptions become visible, expiring decisions.

### Costs and risks

- Registry and evidence maintenance is real operating and product work.
- Cross-repository IDs and references require migration discipline.
- Remote capture can become flaky without controlled fixtures and targets.
- Central schemas can become a bottleneck if product extensions are not designed deliberately.
- A dashboard can create false confidence unless claims remain tied to complete variant evidence.

## Alternatives considered

### Central end-to-end gate only

Rejected. It is too slow and environment-dependent for every product PR, and it separates failures from the owning code.

### Product-local standards only

Rejected. It recreates drift in dimensions, severity, baseline policy, and brand judgment.

### Visual snapshots as the quality system

Rejected. Pixels cannot prove purpose, information architecture, interaction, state completeness, perceived speed, or implementation intent.

### Human design review without blocking CI

Rejected. It catches taste issues but cannot make inventory, accessibility, coverage, or regression evidence repeatable.

## Revisit triggers

Revisit this ADR if the central contract routinely blocks independent product releases, if product adapters cannot preserve canonical semantics, if capture flake exceeds the team's repair capacity, or if the suite consolidates into one deployable repository.

## Related records

- [Signal Experience Standard](./SIGNAL_EXPERIENCE_STANDARD.md)
- [Design Quality CI](./DESIGN_QUALITY_CI.md)
- [Visual Baseline Process](./VISUAL_BASELINE_PROCESS.md)
- [HQ decision record](../../content/hq/decisions/signal-design-quality-operating-system.md)
