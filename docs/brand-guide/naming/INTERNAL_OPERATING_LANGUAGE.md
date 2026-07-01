# Internal Operating Language

How Signal Studio talks about work internally.

Status: proposed canon

## Core Rule

The internal operating language should help the founder and future team make decisions, assign ownership, remember context, and release work.

It should not sound like Jira.

It should not invent a private dialect.

Use plain words with stable meanings.

## Operating Vocabulary

| Need | Use | Definition |
|---|---|---|
| Work to be done | `work item` | Internal company work that may or may not live in Tasks. |
| Product object | `task` | A committed action inside the Tasks product. |
| Larger body of work | `project` | Bounded work with an outcome. |
| Strategic body of work | `initiative` | Larger effort spanning projects or products. |
| Current company priority | `priority` | A thing that should receive attention before others. |
| Time-bounded work period | `cycle` | A bounded period of work. |
| Focused improvement sweep | `pass` | Review, naming, QA, design, performance, or polish sweep. |
| Delivered version | `release` | A production or packaged delivery. |
| Public content delivery | `publish` | Making a page, update, or asset public. |
| Engineering production action | `deploy` | Technical deployment. Keep internally. |
| Review before action | `review` | Evaluation before a decision or release. |
| Found problem | `finding` | A concrete observation from an audit or review. |
| Product/code defect | `bug` | A technical or product defect. |
| Possible harm or delay | `risk` | Something that may create cost, delay, confusion, or damage. |
| Committed choice | `decision` | A chosen path. |
| Why it was chosen | `rationale` | Reason behind a decision. |
| Responsible person/role | `owner` | The person or role accountable. |
| Durable memory | `record` | Saved context, decision, or event. |
| Decision artifact | `decision record` | Date, owner, decision, rationale, alternatives, impact, revisit date. |
| Ongoing context | `company memory` | Durable context that future humans and agents can read. |
| Rule for who decides | `decision right` | Who can decide what. |
| Repeated operating schedule | `cadence` | A recurring rhythm such as daily, weekly, monthly. |

## Terms Review

| Term | Decision | Replacement | Reason |
|---|---|---|---|
| `sprint` | Replace / restrict | `cycle`, `week`, `pass` | Scrum-coded. Use only if actually doing Scrum. |
| `epic` | Avoid | `project`, `initiative`, `goal` | Agile-coded and inflated. |
| `backlog` | Restrict | `queue`, `later`, `candidate work` | Useful internally, poor product language. |
| `issue` | Restrict | `finding`, `problem`, `bug`, `risk` | Keep for GitHub issues and vendor tools. |
| `ticket` | Avoid | `request`, `work item`, `task`, `finding` | Helpdesk/Jira flavor. |
| `roadmap` | Restrict | `Timeline`, `plan`, `direction` | Keep when it means strategy, not the product. |
| `release` | Keep | None | Standard, clear, durable. |
| `ship` | Restrict | `release`, `publish`, `send` | Fine casually, weak as formal status. |
| `milestone` | Restrict | `target`, `checkpoint`, `date` | Keep where integrations use it. |
| `status` | Keep | None | Clear and useful. |
| `changelog` | Keep | None | Standard engineering artifact. |
| `QA` | Restrict | `quality review`, `test pass` | Fine internally; use clearer words elsewhere. |
| `bug` | Keep internally | `problem` for users | Universal engineering word. |
| `deploy` | Keep internally | `publish`, `release` for users | Technical precision matters. |
| `governance` | Replace in most docs | `decision rules`, `decision rights` | Less heavy and more direct. |
| `memory` | Restrict | `records`, `company memory`, `agent state` | Too broad unless scoped. |
| `Director` | Replace / restrict | `advisor`, `reviewer`, `owner` | Implies authority. |
| `Council` | Restrict | `review panel`, `review session` | Good as a ritual, poor as architecture. |

## Product vs Company Work

The word `task` is already a product object. Use it carefully.

| Situation | Correct term |
|---|---|
| A user action inside Signal Tasks | `task` |
| Internal company work not necessarily in the product | `work item` |
| A larger bounded effort | `project` |
| A strategic arc across work | `initiative` |
| A product planning artifact | `plan`, `direction`, or `Timeline` if product-specific |

Example:

Good:

> The naming migration has three work items. One of them is tracked as a Task in the internal workspace.

Bad:

> The Signal naming task creates new Tasks tasks.

## Decision Records

Use decision records instead of loose memory when the company commits to a path.

Required fields:

```text
Date:
Owner:
Decision:
Rationale:
Alternatives considered:
Impact:
Risks:
Revisit date:
Related records:
```

Decision records belong in `decisions/`.

Use a decision record for:

- Product name changes.
- Reserved term changes.
- Folder/repo moves.
- Public positioning changes.
- Pricing changes.
- Legal/commercial naming risks.
- Agent authority changes.
- Major architecture decisions.

## Review Language

Use `review` for evaluation before action.

Use role-based review names:

| Review name | Former persona shorthand | Scope |
|---|---|---|
| `Product Restraint Review` | Jobs | Taste, simplicity, subtraction. |
| `Brand Coherence Review` | Cook | Premium consistency and brand system fit. |
| `Comprehension Review` | Norman | User understanding and human language. |
| `Engineering Review` | Jensen | Architecture, scalability, searchability, integrations. |
| `Execution Review` | Grove | Operational practicality and migration discipline. |
| `Management Review` | Drucker | Owners, decisions, records, usefulness. |
| `Business Durability Review` | Buffett | Long-term simplicity and commercial trust. |
| `Story Review` | Pixar | Emotional arc and narrative coherence. |
| `Systems Review` | Sagan | Coherence across layers and lifecycle. |
| `AI Compatibility Review` | Turing | Agent instructions, schemas, stable IDs. |
| `Legal Review` | Specter | Commercial ambiguity and clearance risk. |

Persona names may remain in temporary prompts. Durable docs should use the review names above.

## Agent And Advisor Language

Use:

| Term | Meaning |
|---|---|
| `advisor` | Recommends. Does not decide. |
| `reviewer` | Evaluates a scoped artifact. |
| `review panel` | Temporary set of reviewers for a review session. |
| `owner` | Has accountability or decision rights. |
| `agent` | Technical automated actor. Use in AI/automation docs. |
| `worker` | Bounded execution agent. |
| `tool` | External capability. |
| `skill` | Reusable instruction package. |

Avoid:

- `Executive Director`
- `Associate Director`
- `AI leadership operating system`
- `org chart`
- `board panel`
- `spawn flow` in user-readable docs
- Persona names as IDs

Machine-readable names should use function:

```json
{
  "id": "ai_compatibility_reviewer",
  "display_name": "Turing",
  "role": "reviewer",
  "authority": "recommend_only"
}
```

## Audit Language

Replace audit/Jira language:

| Current | Proposed |
|---|---|
| `FINDINGS.md` | `FINDINGS.md` |
| `CURRENT_STATE.md` | `CURRENT_STATE.md` |
| `issue board` | `findings list` |
| `ticket` | `finding`, `risk`, `request`, or `work item` |
| `P0/P1/P2/P3/P4` | Keep only if severity scale is defined; otherwise use `Critical`, `High`, `Medium`, `Low`. |
| `blocked` | `waiting`, `operator pending`, or `blocked` when technically exact. |

Severity can stay if useful, but it must be explained.

## Engineering Language

Keep these terms in engineering contexts:

- `bug`
- `release`
- `deploy`
- `build`
- `test`
- `QA`
- `schema`
- `API`
- `config`
- `migration`
- `fixture`
- `package`
- `branch`
- `commit`
- `pull request`
- `issue` when it means a GitHub issue
- `changelog`
- `status`

Do not rename them for style.

## Customer-Support Language

If the user sees it, use plain human language:

| Internal | User-facing |
|---|---|
| `bug` | `problem` |
| `deploy` | `release` or `publish` |
| `schema` | `data` or omit |
| `API` | `connection` or omit |
| `blocked` | `waiting on...` |
| `issue` | `problem` |
| `config` | `settings` |
| `permissions model` | `who can see or change this` |

## Internal Cadence Names

Use:

- `daily briefing`
- `weekly review`
- `monthly review`
- `quarterly review`
- `naming pass`
- `quality review`
- `release review`
- `legal review`

Avoid:

- `standup`
- `sprint planning`
- `backlog grooming`
- `retro`
- `velocity review`
- `executive board panel`

## Operating Examples

Good:

> The Timeline rename is a naming pass with three work items: product copy, docs, and route aliases. The owner is Product. Legal Review is required before public copy changes.

Good:

> Current state: Signal product language is approved. Technical analytics references stay until the code migration has an import plan.

Bad:

> Sprint goal: close all roadmap rename tickets in the issue board and improve velocity.

Bad:

> The Executive Director Council escalates the governance decision through a spawn flow.

## The Smallest Useful Operating Set

For daily company work, prefer this set:

- `owner`
- `priority`
- `work item`
- `project`
- `initiative`
- `cycle`
- `review`
- `finding`
- `risk`
- `decision`
- `record`
- `release`
- `status`

If a new operating term is not clearly better than one of these, do not add it.
