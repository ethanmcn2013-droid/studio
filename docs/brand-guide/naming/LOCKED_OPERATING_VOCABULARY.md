# Locked Operating Vocabulary

This document locks the exact Signal Studio operating names.

Status: locked proposal for implementation  
Purpose: replace Jira, Scrum, GitHub, and generic SaaS vocabulary with calm, exact Signal Studio language.

## Core Hierarchy

Use this hierarchy for company and product work:

| Level | Locked term | Replaces | Meaning |
|---|---|---|---|
| 1 | `Initiative` | phase, program, campaign, epic group | A named phased build, release, or deployment effort. |
| 2 | `Project` | epic, workstream | A bounded body of work inside an Initiative. |
| 3 | `Cycle` | sprint, iteration | A time-bounded working rhythm. |
| 4 | `Task` | ticket, card, action item | A specific piece of work someone can do. |
| 5 | `Step` | subtask, checklist item | A small ordered action inside a Task. |

Default grammar:

```text
Initiative 01 - Language Lock
Project - Product Copy Sweep
Cycle 01 - Audit Docs
Task - Rename SPRINT_STATE to CURRENT_STATE
Step - Update links
```

Use title case for named Initiatives and Projects. Use sentence case for task labels.

## Locked Replacements

| Avoid | Locked replacement | Rule |
|---|---|---|
| `sprint` | `cycle` | Always replace unless literally describing Scrum. |
| `epic` | `project` | Always replace. |
| `ticket` | `task` | Always replace for work execution. |
| `bug` | `problem` | Use `problem` in product/customer/internal planning language. Keep `bug` only in engineering tools when conventional. |
| `backlog` | `queue` | Use `queue` for ordered future work. |
| `issue` | `finding` | Use for audits and reviews. Use `problem` for user-facing defects. Keep `GitHub issue` only when referring to GitHub. |
| `phase` | `initiative` | Use Initiative for phased build/deployment efforts. |
| `milestone` | `target` | Use `checkpoint` only for review gates. |
| `roadmap` | `plan` or `Timeline` | Use `Timeline` for the product. Use `plan` for company strategy. |
| `kanban` | `task view` | Avoid method language. |
| `board` | `workspace` or `task view` | Keep only where a route/UI is literally board-shaped and not yet migrated. |
| `velocity` | `pace` | Use human language: `work has slowed`, `pace is improving`. |
| `story point` | `estimate` | Prefer concrete dates or effort notes. |
| `standup` | `daily check-in` | Use sparingly. Prefer written updates. |
| `retrospective` | `look-back` | Use only for review after a Cycle or Initiative. |
| `stakeholder` | `client`, `partner`, `customer`, or `collaborator` | Choose the actual relationship. |
| `owner` | `owner` | Keep. Clear and useful. |
| `assignee` | `owner` | Use owner in product/internal language. Keep assignee in code if schema uses it. |
| `status` | `status` | Keep. Clear and useful. |
| `blocked` | `waiting` | Use `waiting` for users. Use `blocked` only in code/status triggers. |
| `blocker` | `what is in the way` or `risk` | Use `risk` when consequence matters. |
| `launch` | `release` or `publish` | Use `release` for product delivery, `publish` for content/pages. |
| `ship` | `release` | Keep `ship` only as informal changelog voice if already part of house style. |
| `deploy` | `deploy` internally, `release` publicly | Keep technical. |
| `QA` | `quality review` | Use `test pass` for technical checks. |
| `changelog` | `changelog` | Keep. Standard and useful. |
| `dashboard` | `briefing` or `view` | Use `briefing` for Signal. |
| `analytics` | `Signal` or `metrics` | Use `Signal` for the product, `metrics` for actual measurement. |
| `workflow` | `process` or `steps` | Use `workflow` only in technical automation docs. |
| `governance` | `decision rules` | Use `decision rights` when naming who can decide. |
| `director` | `advisor` or `reviewer` | Use role-based names. |
| `council` | `review panel` | Use `review session` for one-time panels. |
| `memory` | `records` or `company memory` | Use typed records in AI systems. |
| `history` | `archive` | Use `records` for active history, `archive` for retired material. |
| `platform` | `system` or `Signal Studio` | Avoid generic SaaS language. |
| `all-in-one` | `Four products, one system.` | Canonical suite line. |

## Work Naming Rules

### Initiative

Use `Initiative` for a phased build, release, or deployment effort that may span multiple Projects and Cycles.

Format:

```text
Initiative 01 - Language Lock
Initiative 02 - Visible Copy
Initiative 03 - Product Rename
Initiative 04 - Repository Alignment
```

Rules:

- Every Initiative has an owner.
- Every Initiative has a target outcome.
- Every Initiative has Projects.
- Every Initiative ends with a release, decision, or archived record.
- Do not use `phase` once the Initiative is named.

### Project

Use `Project` for a bounded body of work inside an Initiative.

Examples:

```text
Project - Audit Vocabulary Sweep
Project - Timeline Product Copy
Project - Advisor Language Rewrite
Project - Legal Naming Review
```

Rules:

- `Project` replaces `epic`.
- Projects should be small enough to explain in one paragraph.
- Projects contain Tasks.

### Cycle

Use `Cycle` for a time-bounded working rhythm.

Examples:

```text
Cycle 01 - Audit Docs
Cycle 02 - Product Docs
Cycle 03 - UI Copy
```

Rules:

- `Cycle` replaces `sprint`.
- A Cycle may be one day, one week, or another agreed length.
- A Cycle has a current state, not a sprint state.

### Task

Use `Task` for specific executable work.

Examples:

```text
Task - Rename audit issue board to findings list
Task - Replace Roadmap in footer copy
Task - Add legal clearance note to brand docs
```

Rules:

- `Task` replaces `ticket`.
- A Task should have an owner or be clearly unassigned.
- A Task should be concrete enough to finish.

### Queue

Use `Queue` for future or candidate work.

Examples:

```text
Naming Queue
Release Queue
Review Queue
Legal Queue
```

Rules:

- `Queue` replaces `backlog`.
- The Queue is ordered but not promised.
- Do not call something a queue if it is actually committed work.

### Finding

Use `Finding` for audit or review observations.

Examples:

```text
Finding - Analytics still appears in product footer
Finding - Signal Directors language implies authority
Finding - CURRENT_STATE.md carries Scrum language
```

Rules:

- `Finding` replaces `issue` in audits.
- A Finding can create a Task.
- A Finding can become a Risk if consequence is material.

### Problem

Use `Problem` for something broken, confusing, or harmful.

Examples:

```text
Problem - Timeline sign-in route returns 404
Problem - Signal name creates legal ambiguity
Problem - Footer links mix Roadmap and Timeline
```

Rules:

- `Problem` replaces `bug` in product, brand, and planning language.
- Keep `bug` only in engineering tools if needed.

### Risk

Use `Risk` for something that may cause harm, delay, cost, legal exposure, or brand drift.

Examples:

```text
Risk - Signal Studio mark may collide with existing software marks
Risk - Renaming analytics package may break imports
Risk - Board route cannot be renamed without redirects
```

Rules:

- Risk is about consequence.
- A Problem exists now. A Risk may happen.

### Decision

Use `Decision` for a committed choice.

Format:

```text
Decision - Timeline replaces Roadmap in product language
Decision - Queue replaces Backlog
Decision - Advisors replace Directors in durable docs
```

Rules:

- A Decision has a rationale.
- A Decision creates a record.
- A recommendation is not a Decision.

## Document Names

Use these exact document names going forward:

| Current / old | Locked name |
|---|---|
| `CURRENT_STATE.md` | `CURRENT_STATE.md` |
| `FINDINGS.md` | `FINDINGS.md` |
| `phase-plan.md` | `INITIATIVE_PLAN.md` |
| `backlog.md` | `queue.md` |
| `decision-log.md` | `DECISION_RECORDS.md` or `decisions/` |
| `event-log.md` | `EVENT_RECORDS.md` |
| `risk-register.md` | `RISKS.md` |
| `governance-model.md` | `DECISION_RULES.md` |
| `temporary-agent-spawn-flow.md` | `TEMPORARY_REVIEWER_PROCESS.md` |
| `weekly-executive-review.md` | `WEEKLY_REVIEW.md` |
| `monthly-strategic-review.md` | `MONTHLY_REVIEW.md` |
| `quarterly-company-evolution-review.md` | `QUARTERLY_REVIEW.md` |

Keep these standard names:

- `README.md`
- `CHANGELOG.md`
- `PRODUCT.md`
- `BRAND.md`
- `CODEX.md`
- `CLAUDE.md`
- `AGENTS.md`
- `package.json`
- `tsconfig.json`

## Product Names

Locked product-language names:

| Current drift | Locked product-language name |
|---|---|
| `Roadmap` | `Timeline` |
| `Analytics` | `Signal`, pending legal clearance |
| `Daily Signal` | Keep if legal clearance passes; fallback `Daily Briefing` |
| `Signal Directors` | `Advisors` or `Reviewers` |
| `SignalHQ` | `Operations`, except existing route/domain references |

Legal note: `Signal Studio`, `Signal`, and `SignalHQ` need counsel review before broader public expansion.

## Review Role Names

Use role-based names:

| Old shorthand | Locked role name |
|---|---|
| Jobs | Product Restraint Review |
| Cook | Brand Coherence Review |
| Norman | Comprehension Review |
| Jensen | Engineering Review |
| Grove | Execution Review |
| Drucker | Management Review |
| Buffett | Business Durability Review |
| Pixar | Story Review |
| Sagan | Systems Review |
| Turing | AI Compatibility Review |
| Specter | Legal Review |

Machine IDs should be functional:

```text
product_restraint_reviewer
brand_coherence_reviewer
comprehension_reviewer
engineering_reviewer
execution_reviewer
management_reviewer
business_durability_reviewer
story_reviewer
systems_reviewer
ai_compatibility_reviewer
legal_reviewer
```

## Initiative Names For This Pivot

Use these Initiative names for the language migration:

| Initiative | Name | Outcome |
|---|---|---|
| Initiative 01 | Language Lock | Canonical terms approved and documented. |
| Initiative 02 | Visible Copy | User-facing product and marketing language updated. |
| Initiative 03 | Operating Records | Audit, review, decision, and advisor docs renamed. |
| Initiative 04 | Product Alignment | Timeline and Signal language reconciled. |
| Initiative 05 | Repository Alignment | Folder, package, and route naming planned and staged. |
| Initiative 06 | Agent Alignment | Future AI agents use the locked vocabulary. |
| Initiative 07 | Legal Clearance | Public mark risks reviewed before expansion. |

## Final Rule

Use fewer words. Use each word consistently.

The locked operating spine is:

```text
Initiative -> Project -> Cycle -> Task -> Step
Queue
Finding
Problem
Risk
Decision
Record
Release
Review
Owner
Status
```

If a new term does not clearly improve this set, do not add it.
