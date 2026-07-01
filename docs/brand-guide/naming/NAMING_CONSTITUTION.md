# Naming Constitution

Principles and rules for naming Signal Studio products, files, folders, docs, UI labels, internal workflows, agents, and future features.

Status: proposed canon

## Naming Standard

A Signal Studio name must pass four tests:

1. A normal person understands it without training.
2. It reduces ambiguity rather than adding brand decoration.
3. It fits with `Notes`, `Tasks`, `Timeline`, and `Signal`.
4. It will still make sense when the company has more code, more people, more customers, and more legal obligations.

If a name is distinctive but unclear, reject it.

If a name is generic but clear, consider keeping it.

If a name is standard engineering language and changing it would make maintenance harder, keep it.

## The Prime Rule

Brand the product experience. Do not brand the machinery of execution.

Examples:

| Layer | Brand language | Standard language |
|---|---|---|
| Product UI | `briefing`, `notebook`, `timeline`, `workspace` | `API`, `schema`, `deploy` should not appear here. |
| Internal operations | `decision`, `review`, `record`, `owner`, `cycle` | Avoid `sprint`, `ticket`, `epic` unless literal. |
| Engineering | `api`, `schema`, `test`, `migration`, `release`, `deploy`, `bug` | Do not invent branded substitutes. |
| Marketing | `Four products, one system.` | Avoid `all-in-one platform`. |

## Product Naming Rules

### Canonical Product Names

Use exactly:

- `Notes`
- `Tasks`
- `Timeline`
- `Signal`

Commercial caution: `Signal` is the preferred product-language name for the briefing product, but public use and expansion require legal clearance because `Signal` and `Signal Studio` are collision-prone software marks.

Use full forms in marketing, footer suite links, legal references, and cross-product nav:

- `Signal Notes`
- `Signal Tasks`
- `Signal Timeline`
- `Signal`

Inside the product, conversational form may drop `Signal`:

- `Open the notebook`
- `Open the workspace`
- `Open the timeline`
- `Open the briefing`

### Product Name Boundaries

| Name | Boundary |
|---|---|
| `Signal Studio` | Company and umbrella system. |
| `Signal` | Attention product only. |
| `Notes` | Capture product only. |
| `Tasks` | Execution product only. |
| `Timeline` | Direction product only. |

Do not create new `Signal X` names unless the name refers to one of the four products or a deliberate suite-level asset.

### Product Names To Retire

| Retire | Replace with | Scope |
|---|---|---|
| `Roadmap` | `Timeline` | User-facing product language. |
| `Analytics` | `Signal` | User-facing product language. |
| `Signal Directors` | `Advisors`, `review panel`, or role-based names | Durable internal architecture. |
| `SignalHQ` | `Operations` or `company operations` | Structure and docs, except existing domain/route references. |

## File And Folder Naming Rules

### General Rules

- Prefer lowercase kebab-case for folders and markdown files.
- Use product names only for product-owned material.
- Use standard engineering folder names inside code repos.
- Do not make a folder name poetic if it holds executable code.
- Do not pair two synonyms, such as `history/archive`.
- Do not use branded terms as catch-all bins.

### Good Folder Names

| Folder | Use |
|---|---|
| `products/notes` | Notes product code and product docs. |
| `products/tasks` | Tasks product code and product docs. |
| `products/timeline` | Timeline product code and product docs. |
| `products/signal` | Signal product code and product docs. |
| `studio-app` | Runnable umbrella site/app if separated from company docs. |
| `foundation/design-system` | Shared tokens, components, motion, typography. |
| `foundation/data` | Shared schemas, event contracts, read models. |
| `operations/company` | Founder/company operating records. |
| `operations/deployments` | Deployment records and runbooks. |
| `agents/advisors` | Internal advisor role definitions. |
| `agents/imported` | Imported Claude/Codex/third-party agent material. |
| `decisions` | Decision records. |
| `reviews` | Audit findings, critiques, review outputs. |
| `archive` | Retired material. |

### Risky Folder Names

| Folder | Risk | Rule |
|---|---|---|
| `foundation` | Too broad. | Must have specific subfolders. |
| `systems` | Elastic and vague. | Name the actual system. |
| `knowledge` | Can become a junk drawer. | Prefer `docs`, `research`, `records`, or `decisions`. |
| `hq` | Cute, vague. | Keep only for existing route/surface. |
| `agents` | Can mix prompts, roles, tools, skills. | Require provenance subfolders. |
| `studio` | Ambiguous. | If executable, prefer `studio-app`; if docs, use `brand` or `operations`. |

## Documentation Naming Rules

### Canonical Doc Categories

| Category | Purpose |
|---|---|
| `PRODUCT.md` | Product definition, purpose, refusals, object model. |
| `BRAND.md` | Voice, visual language, naming, market rules. |
| `DECISIONS.md` or `decisions/` | Durable choices with rationale. |
| `CURRENT_STATE.md` | Current state of an operating pass or migration. |
| `FINDINGS.md` | Audit findings. |
| `RENAME_MIGRATION_PLAN.md` | Rename plan and staged risk. |
| `RUNBOOK.md` | Operator steps for a repeatable process. |
| `CHANGELOG.md` | Engineering/product change history. Keep standard. |

### Rename Existing Audit Docs

| Current | Proposed | Reason |
|---|---|---|
| `CURRENT_STATE.md` | `CURRENT_STATE.md` | Removes Scrum language. |
| `FINDINGS.md` | `FINDINGS.md` | Removes GitHub/Jira flavor. |
| `issue board` | `findings list` | More precise for audits. |
| `tickets` | `findings`, `requests`, `tasks`, or `risks` | Depends on meaning. |

## UI Label Rules

### Good Labels

Use labels that name what the user sees or does:

- `Open the notebook`
- `Open the workspace`
- `Open the timeline`
- `Open the briefing`
- `Write a note`
- `Share the timeline`
- `Review today's briefing`
- `Mark done`
- `Waiting on you`
- `Not now`
- `Refused`

### Bad Labels

Avoid:

- `View analytics`
- `Manage workflow`
- `Configure project`
- `Open dashboard`
- `Backlog`
- `Sprint`
- `Issue`
- `Ticket`
- `Stakeholder view`
- `AI summary`
- `Smart prioritization`

### Label Decision Rule

If the label describes a software mechanism, rewrite it around the user's action.

Example:

| Mechanism label | User label |
|---|---|
| `Create workspace schema` | `Create workspace` |
| `Run analytics briefing` | `Review briefing` |
| `Configure timeline source` | `Write your timeline` |
| `Promote extract` | `Send to Tasks` |

## Internal Workflow Naming Rules

### Work Unit Hierarchy

| Unit | Meaning | Use |
|---|---|---|
| `work item` | Internal thing to do. | Company operations. |
| `task` | A committed action in the Tasks product. | Product object or internal work only when tracked in Tasks. |
| `project` | Bounded body of work. | Product, operations, engineering. |
| `initiative` | Larger strategic body of work. | Founder/company planning. |
| `cycle` | Time-bounded operating period. | Internal operating docs. |
| `pass` | Focused review or improvement sweep. | Naming pass, QA pass, design pass. |
| `release` | Delivered version or publish. | Engineering and product delivery. |
| `decision` | Chosen path with rationale. | Records and management. |

### Keep / Replace / Restrict / Avoid

| Term | Rule | Replacement |
|---|---|---|
| `sprint` | Replace unless literal Scrum. | `cycle`, `week`, `pass`. |
| `epic` | Avoid. | `project`, `initiative`, `goal`. |
| `backlog` | Restrict. | `queue`, `later`, `candidate work`. |
| `issue` | Restrict. | `finding`, `problem`, `bug`, `risk`. |
| `ticket` | Avoid. | `request`, `work item`, `task`. |
| `roadmap` | Restrict. | `timeline`, `plan`, `direction`. |
| `release` | Keep. | None. |
| `ship` | Restrict. | `release`, `publish`, `send`. |
| `milestone` | Restrict. | `target`, `checkpoint`, `date`. |
| `status` | Keep. | None. |
| `changelog` | Keep. | None. |
| `QA` | Restrict. | `quality review`, `test pass`. |
| `bug` | Keep internally. | `problem` for users. |
| `deploy` | Keep internally. | `publish` or `release` for users. |

## Agent Naming Rules

### Durable Names

Use function names:

- `Product Restraint`
- `Brand Coherence`
- `Comprehension`
- `Engineering Architecture`
- `Execution`
- `Management`
- `Business Durability`
- `Story`
- `Systems`
- `AI Compatibility`
- `Legal Review`

### Private Inspiration Names

Names like Jobs, Cook, Norman, Jensen, Grove, Drucker, Buffett, Pixar, Sagan, Turing, and Specter may appear in temporary prompts or private review exercises.

They should not be durable architecture, folder names, Slack channel names, or customer-facing labels.

### Agent Object Names

| Use | Definition |
|---|---|
| `advisor` | Recommends. Does not decide unless explicit decision rights exist. |
| `reviewer` | Checks a scoped artifact. |
| `worker` | Executes bounded work. |
| `agent` | Technical term for an automated actor in AI/automation docs. |
| `tool` | External capability or integration. |
| `skill` | Reusable instruction package. |
| `prompt` | Input template. |
| `evaluation` | Repeatable quality check. |

Avoid using `Director` unless the role has actual authority and legal/operating clarity.

## Future Feature Naming Rules

Before naming a future feature, answer:

1. Which product owns it?
2. What object does the user see?
3. What verb does the user perform?
4. What existing term does it reuse?
5. What term does it retire?
6. Could a wedding planner, tradesperson, freelancer, student, or venue operator understand it in 15 seconds?

Good feature names:

- `Email capture`
- `Shared timeline`
- `Daily briefing`
- `Task extract`
- `Public update`
- `Quiet risks`

Weak feature names:

- `AI insight layer`
- `Workflow engine`
- `Productivity dashboard`
- `Automated prioritization`
- `Stakeholder portal`
- `Project operating system`

## Reserved Word Governance

Changing the meaning of a reserved term requires a decision record.

Reserved terms:

- `Signal Studio`
- `Signal`
- `Notes`
- `Tasks`
- `Timeline`
- `Workspace`
- `Task`
- `Note`
- `Briefing`
- `Decision`
- `Release`
- `Review`

Decision record must include:

- Date
- Owner
- Term changed
- Old meaning
- New meaning
- Reason
- Alternatives rejected
- Surfaces affected
- Migration plan
- Revisit date

## Review Checklist

Before approving any new name:

- Does it sound like Jira, GitHub, Scrum, Notion, or enterprise SaaS?
- Is it more clever than clear?
- Is it trying to make a normal thing feel branded?
- Does it collide with a product name?
- Does it make search/imports/routes harder?
- Would a non-technical operator understand it?
- Is there already a good word in the lexicon?
- Does it belong in UI, docs, engineering, or operations?

If two names are close, choose the one that lowers future explanation.
