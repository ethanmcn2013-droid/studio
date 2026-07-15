# Audit Rubric

Every audit scores exactly 13 dimensions from 0 through 4. Scores are integers. The overall score is the arithmetic mean rounded to two decimals; weighting is not permitted.

## Universal anchors

| Score | Meaning |
|---:|---|
| 0 | Absent, broken, unsafe, or impossible to evaluate |
| 1 | Materially deficient; the intended job is unreliable |
| 2 | Functional but clearly below the Signal standard; remediation required |
| 3 | Studio-grade baseline; coherent, complete, and ready in this dimension |
| 4 | Exemplary; unusually clear, refined, durable, and worth using as a reference |

A 4 is not “no automated failures.” It requires positive rendered evidence of exceptional quality. A 3 is not “mostly done.” It means the dimension can ship without a quality caveat.

## Exact 13-dimension matrix

| Dimension | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| `purpose-and-task-clarity` | No discernible job or action. | Purpose and action conflict or require guesswork. | The job is inferable, but copy, sequencing, or calls to action create hesitation. | The job, context, and primary action are clear with only minor incidental friction. | Purpose is immediate and specific; every element sharpens confident action. |
| `information-architecture` | Users cannot locate the object or next step. | Structure is unpredictable, circular, or produces dead ends. | The route works, but labels, grouping, or hierarchy impose avoidable mental load. | Navigation and grouping are predictable across the journey. | The structure makes a complex domain feel simple and remains coherent across products. |
| `visual-hierarchy` | Priority is absent or dangerously inverted. | Multiple elements compete; users cannot reliably scan or choose. | A usable hierarchy exists but emphasis and density drift. | Primary, secondary, and supporting information scan cleanly. | Emphasis is exceptionally precise; the eye lands in the right order without decoration doing the work. |
| `typography-and-content` | Text is unreadable, misleading, or missing. | Frequent legibility, tone, truncation, or terminology failures. | Readable overall, but copy is generic, verbose, inconsistent, or weakly structured. | Legible, concise, sentence-case, and on-register across required states. | Editorial precision is exceptional; type and language make the product calmer and more useful. |
| `layout-and-composition` | Overlap, clipping, or broken composition prevents use. | Layout is unstable, cramped, or incoherent in common conditions. | Functional, but rhythm, alignment, density, or empty space feels improvised. | Composition is balanced and intentional at the reviewed viewport. | Spacing, proportion, alignment, and density form a reference-quality system across viewports. |
| `interaction-quality` | The primary interaction fails or causes unsafe outcomes. | Behavior is unpredictable; feedback, keyboard, pointer, or touch paths materially break. | The flow works, but feedback, focus, transitions, recovery, or affordances are rough. | Interaction is predictable, complete, restrained, and gives timely feedback. | Interaction feels effortless and distinctive while remaining accessible and reduced-motion safe. |
| `state-completeness` | A required state is missing, deceptive, or unsafe. | Multiple critical states are absent or strand the user. | Core states exist, but one or more required edge states lack honest guidance or recovery. | Every required state is implemented, truthful, recoverable, and consistent. | Edge states actively increase trust and preserve context without adding noise. |
| `accessibility` | A blocking barrier prevents completion for a required user or modality. | Serious semantic, contrast, keyboard, focus, or assistive-technology failures remain. | Mostly operable, but material gaps require remediation. | Deterministic checks are clear and keyboard/assistive-technology review confirms the critical job. | The experience goes beyond compliance with excellent semantics, focus, copy, target sizing, and modality parity. |
| `responsive-behavior` | Unusable at a required breakpoint. | Overflow, loss of content/action, or broken ordering materially blocks use. | It fits, but hierarchy, density, controls, or content are compromised at one or more sizes. | All required breakpoints reflow intentionally with complete jobs and states. | Each viewport feels designed for its constraints, not merely resized. |
| `performance-and-perceived-speed` | The job does not complete or wait time is unbounded and unexplained. | Severe delay, instability, or jank routinely breaks confidence. | Performance is usable but has avoidable layout shift, blocking work, or dishonest feedback. | Measured behavior is within its evidence budget and loading is local, stable, and honest. | The experience feels immediate; progressive disclosure and feedback make unavoidable waits useful and calm. |
| `design-system-coherence` | Core system rules are contradicted or unsafe local forks dominate. | Widespread token, component, type, motion, or state drift. | Recognizably Signal, but several undocumented deviations or duplicate patterns remain. | Canonical tokens and patterns are used; any local extension is justified and documented. | The surface strengthens reuse and resolves drift without flattening product purpose. |
| `brand-distinction-and-craft` | Generic, off-brand, or visibly careless. | Inconsistent imitation of the brand with weak restraint or polish. | Brand assets are present, but the result feels ordinary or mechanically assembled. | Unmistakably Signal: calm, editorial, restrained, with an earned accent and product-specific purpose. | Memorable, world-class craft; every detail feels inevitable and no flourish is unearned. |
| `implementation-fidelity` | The intended design or behavior is absent or broken. | Major gaps exist between approved intent and implementation. | The main concept ships, but visible states, breakpoints, content, or behavior deviate. | Implementation matches approved design and behavior across required variants, with code and rendered evidence. | Fidelity is exact and durable: the implementation preserves intent under edge cases and is protected against regression. |

## Evidence ownership

The current specialist routing in [`specialists.json`](../../experience/specialists.json) is binding:

| Evidence class | Dimensions |
|---|---|
| Subjective review | `purpose-and-task-clarity`, `information-architecture`, `visual-hierarchy`, `typography-and-content`, `layout-and-composition`, `brand-distinction-and-craft` |
| Mixed | `interaction-quality`, `state-completeness` |
| Deterministic plus human | `accessibility`, `responsive-behavior`, `design-system-coherence`, `implementation-fidelity` |
| Deterministic | `performance-and-perceived-speed` |

“Deterministic” means the score must cite repeatable measures. It does not mean a single threshold automatically produces a 4. “Deterministic plus human” requires both evidence classes before a 3 or 4.

## Scoring procedure

1. Select one registered experience, required state, and breakpoint.
2. Capture deterministic evidence under the canonical environment.
3. Route the rendered result to the responsible specialists.
4. Record findings before assigning scores; do not lower a score merely to encode severity twice.
5. Score all 13 dimensions, cite evidence, calculate the mean, and set `pass` from the gate—not reviewer preference.
6. Repeat for every required state and breakpoint before changing the experience to `passing`.

The TypeScript helper and executable gate require every score ≥3, mean ≥3.5, rendered evidence, and no release blocker whose status is neither `resolved` nor `accepted-exception`. An accepted exception is valid only when its exception record is linked, founder-approved, unexpired, and carries a remediation plan; it does not turn the underlying finding into a resolved finding.

## Finding severity

| Severity | Meaning |
|---|---|
| `release-blocking` | Unsafe, inaccessible, broken, deceptive, or materially incomplete; release cannot proceed |
| `high` | Major quality failure in a core job; must be fixed or receive a time-boxed founder-approved exception |
| `medium` | Clear degradation that should be scheduled and cannot be ignored in the score |
| `low` | Local polish or resilience issue with limited user impact |
| `opportunity` | A credible improvement beyond the current standard, not debt disguised as aspiration |

Every finding requires evidence, violated standard, impact, recommendation, scope, confidence, owner, source, and resolution evidence when closed.

## Integrity rules

- Never back-solve dimension scores to reach 3.5.
- Never copy one breakpoint's score to another without reviewing its evidence.
- Never use a clean automated run as proof of visual or product quality.
- Never accept a 4 without positive comparative evidence.
- Never call an aggregate product score Studio grade while a required variant is unaudited or blocked.
