# Language Update Phased Plan

Plan for updating Signal Studio around the locked operating vocabulary.

Status: implementation proposal  
Basis: `LOCKED_OPERATING_VOCABULARY.md`

## Goal

Move the whole Signal Studio system from mixed Jira/Scrum/GitHub/SaaS language into the locked vocabulary:

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

Do this without breaking routes, deploys, imports, domains, package names, scripts, agent config, or historical context.

## Safety Rules

1. Do not mass rename.
2. Do not change source repos until the current Initiative is scoped.
3. Rename active docs before code.
4. Rename visible UI before package/folder paths.
5. Keep standard engineering terms where they are exact.
6. Keep old aliases until redirects/import plans exist.
7. Create a Decision Record for each high-risk rename.
8. Treat `Signal Studio`, `Signal`, and `SignalHQ` as legal-clearance items before broader public expansion.

## Initiative 01 - Language Lock

Purpose: freeze the naming system before touching the codebase.

### Projects

| Project | Tasks |
|---|---|
| Project - Canonical Vocabulary | Approve `LOCKED_OPERATING_VOCABULARY.md`; add it beside the lexicon; mark older recommendations as superseded where needed. |
| Project - Decision Records | Create a first Decision Record: `Decision - Locked Operating Vocabulary`. |
| Project - Agent Instruction Update | Point future agents to `AI_AGENT_INSTRUCTIONS.md` and the locked vocabulary. |
| Project - Do Not Rename Boundary | Confirm `DO_NOT_RENAME.md` so the system does not overcorrect. |

### Output

- Locked terms accepted.
- Exact replacements agreed.
- No source changes yet.

### Exit Criteria

- Every new work item uses Initiative, Project, Cycle, Task.
- No new docs use sprint, epic, ticket, backlog, or issue board.

## Initiative 02 - Visible Copy

Purpose: update user-facing and brand-facing language first.

### Scope

Prioritize:

- Product homepages.
- Footer suite links.
- Navigation.
- CTA labels.
- Marketing decks.
- Brand handbook.
- Product docs that users or partners may read.

### Projects

| Project | Tasks |
|---|---|
| Project - Product Name Sweep | Replace user-facing `Roadmap` with `Timeline`; replace user-facing `Analytics` with legally cleared `Signal` or temporary `Briefing`. |
| Project - PM Jargon Sweep | Replace sprint, epic, backlog, ticket, issue, kanban, velocity in visible copy. |
| Project - CTA Sweep | Standardize `Open the notebook`, `Open the workspace`, `Open the timeline`, `Open the briefing`. |
| Project - Footer Sweep | Ensure all product footers show Notes, Tasks, Timeline, Signal and `Four products, one system.` |
| Project - Brand Handbook Update | Update tagline, product names, reserved vocabulary, and legal caution. |

### Replacement Rules

| Current | Replacement |
|---|---|
| Timeline | Timeline |
| Signal | Signal or Briefing pending legal clearance |
| sprint | cycle |
| epic | project |
| ticket | task |
| issue | problem or finding |
| backlog | queue |
| kanban | task view |
| velocity | pace |
| stakeholder | client, partner, customer, collaborator |

### Output

- Brand and product language align before structural renames begin.

### Exit Criteria

- No active customer-facing copy uses the avoided PM/SaaS vocabulary except in explicit refusal lists.
- Product language consistently uses Notes, Tasks, Timeline, Signal.

## Initiative 03 - Operating Records

Purpose: rename internal docs and operating artifacts.

### Scope

Start with low-risk markdown docs in:

- `signal-studio-workspace/audit`
- `signal-studio-workspace/signal-directors/docs`
- `signal-studio-workspace/signal-directors/workflows`
- `signal-studio-workspace/signal-directors/memory`
- Product `docs/` folders

### Projects

| Project | Tasks |
|---|---|
| Project - Audit Doc Rename | `FINDINGS.md` -> `FINDINGS.md`; `CURRENT_STATE.md` -> `CURRENT_STATE.md`; update links. |
| Project - Queue Doc Rename | `backlog.md` -> `queue.md` where present. |
| Project - Initiative Plan Rename | `phase-plan.md` -> `INITIATIVE_PLAN.md`. |
| Project - Decision Docs | `decision-log.md` -> `DECISION_RECORDS.md` or move to `decisions/`. |
| Project - Event Docs | `event-log.md` -> `EVENT_RECORDS.md`. |
| Project - Decision Rules | `governance-model.md` -> `DECISION_RULES.md`. |
| Project - Review Docs | Rename executive/strategic reviews to `WEEKLY_REVIEW.md`, `MONTHLY_REVIEW.md`, `QUARTERLY_REVIEW.md`. |

### Output

- Active internal docs use the locked operating vocabulary.
- Historical docs can stay as-is if marked archive.

### Exit Criteria

- New operating docs no longer use sprint/epic/ticket/backlog/issue board.
- Current state, findings, queue, decisions, and risks have stable homes.

## Initiative 04 - Product Alignment

Purpose: reconcile current repo/product drift.

### Scope

- `roadmap` repo product language -> Timeline.
- `analytics` repo product language -> Signal or fallback.
- Product docs and changelogs get notes explaining old names.

### Projects

| Project | Tasks |
|---|---|
| Project - Timeline Product Canon | Update product docs, README, nav, footer, metadata from Roadmap to Timeline where user-facing. |
| Project - Signal Product Canon | Update product docs, README, nav, footer, metadata from Analytics to Signal or fallback after legal review. |
| Project - Legacy Alias Notes | Add repo-level notes: `roadmap` is legacy repo alias for Timeline; `analytics` is legacy repo alias for Signal/Briefing. |
| Project - Technical Term Guard | Preserve `roadmap` where it means strategy and `analytics` where it means metrics. |

### Output

- Users see the canonical product system.
- Engineers still have safe legacy repo paths until structural migration.

### Exit Criteria

- Product docs define the current product name at the top.
- Footer/nav mismatch is removed.
- Legacy repo aliases are documented.

## Initiative 05 - Repository Alignment

Purpose: plan structural moves after language stabilizes.

### Scope

Proposed target:

```text
products/
  notes/
  tasks/
  timeline/
  signal/
studio-app/
foundation/
brand/
assets/
operations/
agents/
decisions/
reviews/
research/
archive/
```

### Projects

| Project | Tasks |
|---|---|
| Project - Dependency Map | List imports, package names, Vercel project roots, env vars, CI scripts, domains, webhooks. |
| Project - Move Plan | Draft one move plan per repo/folder. |
| Project - Alias Plan | Decide redirects, symlinks, package aliases, route aliases. |
| Project - Dry Run | Test moves in a branch or copy before touching primary repos. |
| Project - Gradual Move | Move lowest-risk folders first: docs, brand decks, imported agent material. |

### Do Not Move Yet

- Product code repos.
- Vercel project roots.
- Domains.
- Package names.
- DB schema names.
- Env vars.
- Agent config IDs.

### Output

- Safe structural migration plan with rollback.

### Exit Criteria

- Every move has owner, risk, rollback, and verification command.
- No hidden deployment assumptions remain.

## Initiative 06 - Agent Alignment

Purpose: make future AI agents follow the locked vocabulary.

### Projects

| Project | Tasks |
|---|---|
| Project - Advisor Rename | Rewrite durable `Signal Directors` prose to advisor/reviewer language. |
| Project - Machine ID Plan | Keep stable IDs now; plan later migration to functional IDs. |
| Project - Prompt Update | Add locked vocabulary to agent prompts and root instructions. |
| Project - Memory Split | Separate context records, decision records, review records, agent state, and source material. |
| Project - Imported Material Quarantine | Move imported Claude/Codex/skills only under `agents/imported` after provenance map. |

### Output

- Agents stop producing Jira/Scrum/SaaS language.
- Advisor authority is explicit: recommend, review, or execute.

### Exit Criteria

- New agent outputs use Initiative, Project, Cycle, Task.
- Reviewers are role-based, not persona-based.
- Decision and review are clearly separated.

## Initiative 07 - Legal Clearance

Purpose: prevent a beautiful naming system from creating commercial risk.

### Projects

| Project | Tasks |
|---|---|
| Project - House Mark Review | Ask counsel to evaluate `Signal Studio` against existing software marks. |
| Project - Product Mark Review | Ask counsel to evaluate `Signal`, `Daily Signal`, and `SignalHQ`. |
| Project - Fallback Naming | Prepare fallback for the fourth product: `Briefing`, `Daily Briefing`, or another cleared name. |
| Project - Disclaimer Review | Decide whether any disclaimers are needed. |
| Project - Public Expansion Gate | Do not expand public mark use until counsel signs off. |

### Output

- Legal decision record for house mark and product marks.

### Exit Criteria

- Counsel-reviewed mark decision exists.
- Public copy knows whether to use `Signal` or fallback.

## Initiative 08 - Release And Enforcement

Purpose: make the naming system stick.

### Projects

| Project | Tasks |
|---|---|
| Project - Naming Check | Add a lightweight script or checklist for avoided terms in active docs. |
| Project - PR Template | Add language checklist to PR/review templates. |
| Project - Release Review | Every release gets a naming review task. |
| Project - Archive Old Language | Move superseded docs into `archive/` with notes. |
| Project - Quarterly Review | Review the vocabulary every quarter, but do not add terms unless necessary. |

### Output

- New drift is caught early.

### Exit Criteria

- Naming review becomes part of release review.
- Avoided terms are either absent or explicitly justified.

## Suggested First Working Cycle

Use this as the first execution slice:

```text
Initiative 01 - Language Lock
Project - Canonical Vocabulary
Cycle 01 - Lock Docs

Tasks:
- Approve LOCKED_OPERATING_VOCABULARY.md
- Add a Decision Record for the vocabulary lock
- Link AI_AGENT_INSTRUCTIONS.md to the locked vocabulary
- Mark older recommendation docs as superseded by the locked vocabulary
- Create Queue.md for future naming work
```

Then:

```text
Initiative 02 - Visible Copy
Project - Product Name Sweep
Cycle 01 - Brand And Footer Copy

Tasks:
- Replace Roadmap with Timeline in active brand docs
- Replace Analytics with Signal or temporary Briefing in active brand docs
- Update CTA language
- Update footer suite line to Four products, one system.
- Record legal clearance risk for Signal terms
```

## Verification Checklist

For each Initiative:

- Did we avoid mass rename?
- Did we update links?
- Did we preserve standard engineering terms?
- Did we keep old aliases where needed?
- Did we add a Decision Record?
- Did we update AI agent instructions?
- Did we run tests/builds for touched repos?
- Did we note legal risk where relevant?

## Final Migration Order

1. Lock vocabulary.
2. Update brand/product docs.
3. Update visible product copy.
4. Rename low-risk docs.
5. Rewrite advisor/director language.
6. Document legacy repo aliases.
7. Prepare legal clearance.
8. Map dependencies.
9. Move folders/repos only after dependency maps exist.
10. Add enforcement checks.

This order keeps the brand sharp without breaking the machine underneath it.
