# AI Agent Instructions

Reusable instructions for future AI agents working on Signal Studio naming, language, architecture, and product copy.

Status: proposed canon

## Mission

You are working inside Signal Studio.

Your job is to reduce noise and reveal signal.

Every name, label, doc title, folder name, feature name, and workflow term should make the system easier to understand.

Prefer calm, plain, high-signal language.

Do not make normal things sound branded.

## Canonical Products

Use exactly:

| Product | Purpose | Core object |
|---|---|---|
| `Notes` | Capture clarity | `note`, `notebook` |
| `Tasks` | Execution clarity | `task`, `workspace` |
| `Timeline` | Direction clarity | `timeline`, `update` |
| `Signal` | Attention clarity | `briefing` |

Suite line:

> Four products, one system.

Use this as the suite architecture line. Do not overuse it.

## Reserved Vocabulary

| Term | Meaning |
|---|---|
| `Signal Studio` | Company and umbrella system. |
| `Signal` | The attention/briefing product only. |
| `signal` | Use sparingly as a metaphor. Do not use as a generic internal synonym. |
| `Notes` | Product name. |
| `note` | Captured thought or fact inside Notes. |
| `Tasks` | Product name. |
| `task` | User-facing action item inside Tasks. |
| `work item` | Internal company work unit. |
| `Timeline` | Product name for direction clarity. |
| `timeline` | Ordered product surface or chronological sequence when context is clear. |
| `briefing` | Signal artifact. |
| `decision` | Committed choice. |
| `review` | Evaluation before a decision. |
| `record` | Durable memory after a decision or event. |
| `archive` | Retired material. |

## Avoided Vocabulary

Avoid in product and brand language:

- `sprint`
- `epic`
- `backlog`
- `ticket`
- `issue`
- `kanban`
- `velocity`
- `story points`
- `stakeholder`
- `all-in-one`
- `platform`
- `enterprise-grade`
- `seamless`
- `robust`
- `turnkey`
- `AI-powered`
- `copilot`
- `smart`
- `autonomous`
- `dashboard` unless saying `not a dashboard`

Use replacements:

| Avoid | Prefer |
|---|---|
| `sprint` | `cycle`, `week`, `pass` |
| `epic` | `project`, `initiative`, `goal` |
| `backlog` | `later`, `queue`, `candidate work` |
| `ticket` | `request`, `work item`, `task`, `finding` |
| `issue` | `finding`, `problem`, `bug`, `risk` |
| `roadmap` as product | `Timeline` |
| `analytics` as product | `Signal` or legally cleared alternative |
| `dashboard` | `briefing`, `view`, `summary` |
| `platform` | `Signal Studio`, `products`, `system` |
| `governance` | `decision rules`, `decision rights` |
| `Director` | `advisor`, `reviewer`, `owner` |

## Legal Caution

Do not assume `Signal Studio`, `Signal`, or `SignalHQ` are legally cleared public marks.

Known risk signals:

- Keysight uses `Signal Studio Software`.
- Signal Technology Foundation claims registered rights in `Signal` and related marks.
- Trademark clearance requires counsel.

Agent rule:

- You may use the current project names when working in the existing codebase.
- Do not recommend broader public expansion of `Signal`, `Signal Studio`, or `SignalHQ` without noting legal clearance risk.
- Do not create new `Signal X` names.

## User-Facing Language Rules

Use labels that name what the user sees or does.

Good:

- `Open the notebook`
- `Open the workspace`
- `Open the timeline`
- `Open the briefing`
- `Write a note`
- `Add a task`
- `Share timeline`
- `Review today's Signal`
- `Needs attention`
- `Moving well`
- `Quiet risks`
- `Suggested focus`
- `Waiting on you`
- `Done`
- `Refused`

Bad:

- `Configure workflow`
- `View analytics dashboard`
- `Manage stakeholder roadmap`
- `Run AI prioritization`
- `Open issue board`
- `Groom backlog`
- `Sprint velocity`

## Product Boundaries

Never blur these:

- A note is not a task.
- A task is not a note.
- A timeline is not a board.
- A briefing is not a dashboard.
- Signal does not mean every insight.
- Timeline does not mean every roadmap.
- Notes does not mean every record.
- Tasks does not mean every internal work item.

## Engineering Language Rules

Keep standard engineering terms where they are exact:

- `src`
- `app`
- `api`
- `db`
- `schema`
- `types`
- `config`
- `scripts`
- `tests`
- `fixtures`
- `migrations`
- `public`
- `docs`
- `bug`
- `release`
- `deploy`
- `build`
- `test`
- `QA`
- `changelog`
- `status`
- `commit`
- `branch`
- `pull request`
- `issue` when it is a GitHub issue

Do not invent branded substitutes for these.

## Agent System Naming

Use typed, functional names.

Human-facing docs may say:

- `advisor`
- `reviewer`
- `review panel`
- `review session`

Machine-readable names should be explicit:

```json
{
  "id": "product_restraint_reviewer",
  "display_name": "Product Restraint",
  "role": "reviewer",
  "authority": "recommend_only"
}
```

Avoid machine IDs like:

```text
jobs
cook
grove
turing
signal_director
executive_director
```

Use role-based review names:

- `product_restraint_reviewer`
- `brand_coherence_reviewer`
- `comprehension_reviewer`
- `engineering_architecture_reviewer`
- `execution_reviewer`
- `management_reviewer`
- `business_durability_reviewer`
- `story_reviewer`
- `systems_reviewer`
- `ai_compatibility_reviewer`
- `legal_reviewer`

## Memory And Records

Do not use `memory` as a catch-all.

Use typed records:

```text
context_records
decision_records
review_records
agent_state
source_material
user_preferences
```

Meaning:

| Term | Meaning |
|---|---|
| `context_record` | Background information used by humans or agents. |
| `decision_record` | Committed choice with rationale. |
| `review_record` | Output of a review. |
| `agent_state` | Runtime or persistent state for an agent. |
| `source_material` | Original input material. |

## Review vs Decision

Agents review. Owners decide.

Do not write as if an advisor has authority unless the user explicitly granted it.

Every important recommendation should distinguish:

- Finding
- Risk
- Recommendation
- Owner
- Decision needed
- Next action

## Rename Procedure

Before recommending a rename:

1. Identify the current term.
2. Identify the proposed term.
3. State the category: product, UI, doc, folder, code, route, package, config, external integration.
4. State confidence.
5. State reason.
6. State risk.
7. State whether to rename now or later.
8. Check `DO_NOT_RENAME.md`.
9. Avoid global replacement unless each context is safe.

Migration tiers:

| Tier | Rename type |
|---|---|
| Tier 1 | Product/UI copy |
| Tier 2 | Docs and audit files |
| Tier 3 | Folders/repos/packages |
| Tier 4 | Routes/domains/env/integrations |

Never mix Tier 1 and Tier 4 casually.

## Structure Rules

Preferred structure:

```text
products/
  notes/
  tasks/
  timeline/
  signal/

studio-app/

foundation/
  design-system/
  ui/
  data/
  runtime/
  config/

brand/
  identity/
  messaging/
  decks/
  handoff/

assets/
  images/
  video/
  prototypes/
  exports/

operations/
  company/
  deployments/
  process/
  finance/
  legal/

agents/
  advisors/
  skills/
  prompts/
  evaluations/
  imported/

decisions/
reviews/
research/
archive/
```

Use `archive`, not `history/archive`.

Use `operations`, not `HQ`, for structure.

Use `agents/imported` for third-party or imported Claude/Codex materials.

## Copy Examples

Good:

```text
Notes captures. Tasks moves. Timeline shows. Signal briefs.
```

Good:

```text
This naming pass found three risks: Signal ambiguity, Roadmap drift, and Director hierarchy.
```

Good:

```text
Keep `deploy` in engineering docs. Use `publish` in customer-facing copy.
```

Bad:

```text
The Signal-native Director Council should spawn a governance workflow to optimize the platform.
```

Bad:

```text
Rename every analytics reference to signal.
```

Bad:

```text
Replace bugs with clarity breaks.
```

## Final Agent Checklist

Before you produce output:

- Did you preserve standard engineering terms?
- Did you avoid Jira/Scrum/SaaS vocabulary in product language?
- Did you reserve `Signal` for the product?
- Did you avoid creating new `Signal X` names?
- Did you avoid persona names as architecture?
- Did you separate review from decision?
- Did you include risks for renames?
- Did you flag legal clearance risk for public marks?
- Did you keep the language plain enough for a non-technical operator?
- Did you reduce nouns rather than add them?

When in doubt, use the plainer word.
