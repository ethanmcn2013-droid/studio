# Signal Studio Lexicon

Canonical vocabulary for Signal Studio.

Status: proposed canon  
Scope audited: `C:\Users\ethan\signal-studio-workspace`, `C:\Users\ethan\SignalHQ`, `C:\Users\ethan\Desktop\signal-studio-design-handoff`, and `C:\Users\ethan\signal-studio-demo`  
Rule: clear first, distinctive second, clever never.

## Core Thesis

Signal Studio exists to reduce noise and reveal signal.

The language system should therefore do three things:

1. Make the four products feel like one system.
2. Remove borrowed project-management vocabulary where it makes the product feel like Jira, GitHub, Scrum, Notion, or enterprise SaaS.
3. Preserve standard engineering language where renaming would make the codebase harder to run.

The canonical product set is:

| Product | Purpose | Core object | Primary promise |
|---|---|---|---|
| Notes | Capture clarity | Note | Write it before it disappears. |
| Tasks | Execution clarity | Task | See what needs doing. |
| Timeline | Direction clarity | Timeline | Show what is happening. |
| Signal | Attention clarity | Briefing | Know what needs attention. |

Legal clearance note: `Signal Studio`, `Signal`, and `SignalHQ` should be reviewed by trademark counsel before broader public expansion. This lexicon treats `Signal` as the preferred product-language direction because it fits the system, not as a legal clearance conclusion.

Canonical suite line:

> Four products, one system.

Use it as the suite architecture line. Do not repeat it so often that it becomes wallpaper.

## Phase 1 Inventory

### Current Naming Map

| Current area | Current names found | Proposed meaning |
|---|---|---|
| Product repos | `notes`, `tasks`, `roadmap`, `analytics`, `studio` | Product code. `roadmap` should become Timeline at product surfaces. `analytics` should become Signal at product surfaces. |
| Product-adjacent repos | `analytics-demo`, `demo-film`, `signal-review`, `marketing-deck` | Marketing, review, and demo support. Keep precise placement in migration. |
| Shared foundations | `ds-foundation`, design tokens, brand handoff docs | Shared design system, voice, assets, and product rules. |
| Company surface | `studio`, `SignalHQ`, `/hq` routes, brand docs | Umbrella site plus internal company operating surface. |
| Internal agents | `signal-directors`, `directors`, `workflows`, `memory`, `governance`, Slack channels | Internal advisory and review system. Naming is too org-chart-heavy today. |
| Audit system | `audit`, `FINDINGS.md`, `CURRENT_STATE.md`, tickets, issue board | Findings, current state, risks, and migration plans. |
| Imported agent material | `.agents`, `.claude`, `agent-skills`, `banana-claude`, `ui-ux-pro-max-skill` | Imported tools and skills. Quarantine by provenance before normalizing. |

### Problem Terms

| Term | Problem | Proposed treatment |
|---|---|---|
| `Roadmap` | Startup/product-management category word; conflicts with canonical `Timeline`. | Replace in user-facing product names. Keep only where it means strategic planning or legacy repo alias. |
| `Analytics` | Implies dashboards, metrics, charts, and SaaS reporting. | Replace in product language with `Signal`. Keep as a technical analytics/metrics term when exact. |
| `Sprint` | Scrum/Jira-coded. | Avoid except when explicitly describing Scrum. Use `cycle`, `week`, or `pass`. |
| `Epic` | Agile-coded, inflated. | Avoid. Use `project`, `initiative`, or `goal` depending on scale. |
| `Backlog` | PM-tool baggage. | Avoid in public copy. Internally restrict to engineering queues. Prefer `later`, `queue`, or `candidate work`. |
| `Ticket` | Helpdesk/Jira flavor. | Avoid. Use `request`, `task`, `finding`, or `work item`. |
| `Issue` | GitHub/Jira collision. | Restrict. Keep for GitHub issues; use `problem`, `bug`, `finding`, or `risk` elsewhere. |
| `Board` | Kanban association. | Restrict. Use `workspace`, `task list`, or `view` in product language unless the UI is literally board-shaped. |
| `Kanban` | Method name and competitor association. | Avoid in customer language. |
| `Velocity` | Agile metric, wrong audience. | Avoid. Use `pace` or `work has slowed`. |
| `Platform` | Generic SaaS bloat. | Avoid in marketing. Use `Signal Studio`, `products`, or `system`. |
| `All-in-one` | Commodity productivity positioning. | Avoid. Use `Four products, one system.` |
| `Signal Directors` | Hierarchy, persona theatre, false authority. | Replace with `advisors` or `review panel` internally. |
| `Executive Directors` | Corporate org-chart language. | Replace with `core advisors` or role-based reviewers. |
| `HQ` | Can become a cute junk drawer. | Keep only as a route/surface name if already established. Prefer `operations` in structure. |

### Inconsistencies

| Inconsistency | Current state | Proposed resolution |
|---|---|---|
| Product names | Brand docs say `Signal Timeline` and `Signal`, while repos and some UI still say `roadmap` and `analytics`. | Canonical product names are `Timeline` and `Signal`; repo aliases migrate later. |
| Suite tagline | Brand docs still carry `Clarity, not configuration.` | Keep as internal principle/supporting line. Canonical suite tagline is `Four products, one system.` |
| Operating work units | `sprint`, `cycle`, `phase`, `plan`, `pass`, `ticket`, `issue` appear together. | Use a small hierarchy: `work item`, `project`, `initiative`, `cycle`, `release`, `decision`. |
| Agents | Persona names, Director titles, Slack channels, governance terms all coexist. | Use role-based names in durable docs. Keep persona names only as private inspiration or review prompts. |
| Product Signal | `Signal`, `signal`, `Signal Studio`, `SignalHQ`, and `Analytics` collide. | Reserve `Signal` for the product. Use `Signal Studio` for company. Use `signal` as metaphor sparingly. |

### Terms Worth Preserving

| Term | Why it stays |
|---|---|
| `Notes` | Plain, immediate, correct. |
| `Tasks` | Generic but clear. The product must avoid surrounding PM jargon. |
| `Timeline` | Human, visual, ordered, less PM-coded than Roadmap. |
| `Signal` | Strong and ownable if tightly reserved for the briefing product. |
| `Briefing` | Distinctive and clear for Signal. |
| `Notebook` | Clear product object for Notes. |
| `Workspace` | Generic but widely understood. Keep for the user's shared working area. |
| `Decision` | Operationally useful and plain. |
| `Risk` | Clearer than issue when something may create harm or delay. |
| `Review` | Plain, durable, works for product, code, and operating checks. |
| `Release`, `deploy`, `bug`, `test`, `schema`, `API`, `config` | Standard engineering terms. Keep where technical precision matters. |

### Terms Requiring Deeper Review

| Term | Reason |
|---|---|
| `Signal` | Product name, metaphor, and company family word. Needs strict use rules. |
| `Studio` | Elegant but ambiguous between company, app, umbrella site, and workspace. |
| `Foundation` | Useful but broad. Must be subdivided by actual ownership. |
| `Operations` | Useful but broad. Must not become a second junk drawer after `HQ`. |
| `Review` | Good word, but `signal-review` may be a specific tool. Do not flatten blindly. |
| `Memory` | Useful for AI systems, less clear for operators. Prefer `records` or `company memory` depending on audience. |

## Words We Use

| Term | Definition | Use | Do not use | Alternatives rejected | Reasoning |
|---|---|---|---|---|---|
| `Signal Studio` | The company and umbrella system. | Company, umbrella site, legal/commercial references. | As a prefix for every feature. | `SignalHQ`, `Signal Suite`, `Signal Platform`. | Clear, already established, premium. |
| `Notes` | Capture product. | Product nav, product docs, user-facing copy. | As a generic synonym for all records. | `Thoughts`, `Captures`, `Field Notes`. | Plain beats poetic. |
| `Tasks` | Execution product. | Product nav, user-facing task work. | As a generic internal unit when it could confuse with the product. | `Actions`, `To-dos`. | Users understand Tasks immediately. |
| `Timeline` | Direction product. | Product nav, public plan, ordered updates. | For generic time history unless it is the product. | `Roadmap`, `Path`, `Flow`. | Human and clear. |
| `Signal` | Attention product, subject to legal clearance before public expansion. | Briefing product, Daily Signal, attention clarity. | As a generic synonym for update, alert, metric, or AI. | `Analytics`, `Insights`, `Briefing`. | Distinctive, but must be reserved. |
| `Briefing` | A short synthesized read of what matters. | Signal product, emails, daily/weekly reads. | For dashboards, reports, or long docs. | `Dashboard`, `Digest`, `Report`. | Human, calm, anti-dashboard. |
| `Notebook` | Notes surface and collection. | Notes UI and docs. | Outside Notes. | `Vault`, `Knowledge base`. | Clear and humble. |
| `Workspace` | A user's active shared working area. | Tasks, shared work, account contexts. | As generic company workspace/folder unless needed. | `Board`, `Project space`. | Common and understandable. |
| `Task` | A committed action in Tasks. | Tasks product object. | For every internal work item unless the work is in Tasks. | `Ticket`, `Issue`, `Card`. | Plain, user knows it. |
| `Note` | A private captured thought or fact. | Notes product object. | As a decision record or task. | `Entry`, `Capture`. | Plain. |
| `Update` | New information or a meaningful change. | Timeline entries, activity, customer-facing change copy. | As a generic replacement for every log. | `Status update`, `Dispatch`. | Clear. |
| `Decision` | A committed choice with rationale. | Internal records, product docs, Timeline. | For unresolved opinions. | `Resolution`, `Call`. | Helps the founder run the company. |
| `Risk` | Something that may create harm, delay, cost, or confusion. | Reviews, migration plans, Signal briefing. | For every bug or task. | `Issue`, `Blocker`. | Clearer than issue. |
| `Focus` | A selected priority for now. | Signal block labels, operating priorities. | As a feature bucket. | `Priority`, `Recommendation`. | Useful when scoped to time. |
| `Review` | Evaluation before action or release. | Product review, code review, naming review. | As decoration or authority theatre. | `Council` everywhere. | Plain and durable. |
| `Record` | Durable memory after a decision or event. | Internal operations and AI context. | For private user notes. | `Memory` everywhere. | More operational than memory. |

## Words We Avoid

| Avoid | Use instead | Exception |
|---|---|---|
| `sprint` | `cycle`, `week`, `pass` | Only when literally using Scrum. |
| `epic` | `project`, `initiative`, `goal` | None in product language. |
| `ticket` | `request`, `task`, `finding`, `work item` | Support vendor imports may keep original term. |
| `issue` | `problem`, `bug`, `finding`, `risk` | GitHub issues stay issues. |
| `backlog` | `later`, `queue`, `candidate work` | Engineering backlog can remain internal. |
| `kanban` | `task view`, `workspace`, `list`, `timeline` | Technical comparison docs only. |
| `velocity` | `pace`, `work has slowed` | Direct critique of PM jargon only. |
| `stakeholder` | `client`, `customer`, `partner`, `collaborator` | Legal docs if necessary. |
| `platform` | `Signal Studio`, `products`, `system` | Technical platform docs only. |
| `all-in-one` | `Four products, one system.` | Directly naming what Signal Studio refuses. |
| `enterprise-grade` | `reliable`, `secure`, or no claim | None in marketing. |
| `seamless` | `smooth`, `uninterrupted`, or nothing | None. |
| `AI-powered` | Describe what happens. | Internal technical docs only. |
| `copilot`, `agent`, `assistant` | `advisor`, `reviewer`, `automation` | Technical AI docs can use `agent` precisely. |
| `dashboard` | `briefing`, `view`, `summary` | Critique/refusal: "not a dashboard." |

## Reserved Terms

| Reserved term | Meaning | Allowed use | Not allowed |
|---|---|---|---|
| `Signal Studio` | Company and umbrella. | Legal, marketing, suite nav, company docs. | Generic prefix for internal tools. |
| `Signal` | Attention product. | Product name, Daily Signal, Signal briefing. | Generic signal, alert, metric, insight, AI. |
| `signal` | The philosophy/metaphor. | Short prose where context is unmistakable. | Folder names or schemas where it creates ambiguity. |
| `Task` | Object in Tasks. | User work object. | Internal company work unless actually tracked in Tasks. |
| `Note` | Object in Notes. | Private capture. | Decision records or operating docs. |
| `Timeline` | Product and ordered public direction. | Product name and ordered visible plan. | Generic schedule unless product-related. |
| `Workspace` | Shared user work area. | Tasks and shared collaboration. | Internal repo/work folder unless conventional. |
| `Release` | A delivered version or production publish. | Engineering and launch docs. | Decorative synonym for every update. |
| `Decision` | Chosen path with rationale. | Records and reviews. | Unresolved recommendation. |

## Product Object Names

| Product | Object names | Avoid |
|---|---|---|
| Notes | `note`, `notebook`, `stream`, `extract`, `private note`, `capture field` | `knowledge base`, `wiki`, `second brain`, `graph`, `PKM`, `database`. |
| Tasks | `task`, `workspace`, `owner`, `due date`, `waiting`, `done`, `task list`, `view` | `ticket`, `issue`, `epic`, `sprint`, `kanban`, `story point`, `velocity`. |
| Timeline | `timeline`, `update`, `Now`, `Soon`, `Later`, `Done`, `Refused`, `public link`, `direction` | `roadmap` as product name, `backlog`, `stakeholder update`, `delivery board`. |
| Signal | `briefing`, `Daily Signal`, `Weekly Signal`, `Launch Signal`, `needs attention`, `moving well`, `quiet risks`, `suggested focus` | `analytics dashboard`, `metrics platform`, `AI summary`, `productivity score`, `alert feed`. |

## Workflow Terms

| Term | Definition | Use | Do not use | Alternatives rejected | Reasoning |
|---|---|---|---|---|---|
| `cycle` | A bounded time period or coherent build run. | Internal operating docs. | Customer-facing copy. | `sprint`, `iteration`. | Familiar enough, less Scrum-coded. |
| `pass` | A focused review or improvement sweep. | Design, naming, QA, audit passes. | As universal work unit. | `sprint`, `phase`. | Useful when the work is a review pass. |
| `release` | A version or production publish. | Engineering and product delivery. | As hype language. | `ship` as formal status. | Standard and precise. |
| `publish` | Make a page, update, or asset public. | Timeline, marketing, content. | Deploying backend infrastructure. | `deploy` for public copy. | Human-facing. |
| `review` | Evaluate before acting. | Code, product, brand, legal. | Persona theatre. | `council` everywhere. | Clear. |
| `finding` | A concrete audit observation. | Audits and reviews. | User-facing UI. | `issue`, `ticket`. | Removes GitHub/Jira flavor. |
| `risk` | Possible harm or delay. | Migration plans, reviews, Signal. | Every bug. | `issue`. | Forces consequence. |
| `decision record` | Durable record of a choice. | Internal operations. | Product notes. | `memory entry`. | More actionable. |

## Internal Operating Terms

| Term | Definition | Use | Do not use | Alternatives rejected | Reasoning |
|---|---|---|---|---|---|
| `advisor` | Internal AI or human role that recommends. | Former Director roles unless actual authority exists. | Public product copy. | `Director`, `Executive Director`. | Avoids false hierarchy. |
| `review panel` | A group of advisors reviewing a proposal. | Naming, product, legal, architecture review. | Durable authority structure. | `Taste Council` as formal name. | Plain and clear. |
| `decision rights` | Rules for who can decide. | Operating docs. | Vague governance. | `governance model`. | Direct. |
| `company memory` | Durable operating context. | AI and founder docs. | Every archive folder. | `memory` alone. | Explains the purpose. |
| `record` | Saved decision or event. | Logs and operations. | Notes product objects. | `memory shard`. | Operational. |
| `owner` | Person or role responsible. | Decisions, work items, reviews. | Product customer copy unless needed. | `DRI`. | Plain. |

## UX Action Verbs

Use:

| Verb | Where |
|---|---|
| `Open` | Primary CTA for entering a product surface. |
| `Write` | Notes capture. |
| `Save` | Explicit persistence when visible. |
| `Share` | Timeline links and shared Tasks outputs. |
| `Review` | Signal briefing, decisions, legal, product checks. |
| `Publish` | Timeline/public content. |
| `Send` | Email and outgoing communications. |
| `Invite` | Collaboration. |
| `Mark done` | Tasks completion. |
| `Move` | Timeline/task repositioning. |
| `Archive` | Retiring material. |

Avoid:

| Verb | Reason |
|---|---|
| `Manage` | Too broad and SaaS-like unless literal account management. |
| `Configure` | Reinforces setup tax. |
| `Leverage` | Enterprise bloat. |
| `Optimize` | Abstract unless technical. |
| `Automate` | Risky where it implies system decision-making. |
| `Prioritize automatically` | Breaks product philosophy. |

## Documentation Categories

| Category | Use | Avoid |
|---|---|---|
| `Product` | Locked product definitions and refusals. | `PRD` unless in engineering-only docs. |
| `Brand` | Voice, visual, naming, market language. | `marketing platform`. |
| `Design` | Interaction, visual, motion, accessibility. | Decorative naming. |
| `Architecture` | Technical shape and system boundaries. | User-facing language. |
| `Decisions` | Durable choices with rationale. | Mixing with notes or changelog. |
| `Reviews` | Findings and critique. | `issues` unless GitHub-bound. |
| `Operations` | Company operating docs. | `HQ` catch-all. |
| `Archive` | Retired or historical material. | `history/archive` double label. |

## Engineering Folder Names

Keep conventional names:

`src`, `app`, `api`, `components`, `lib`, `server`, `db`, `schema`, `types`, `config`, `scripts`, `tests`, `fixtures`, `migrations`, `public`, `docs`, `assets`, `styles`.

Use brand-facing names only at product and documentation boundaries:

`products/notes`, `products/tasks`, `products/timeline`, `products/signal`, `brand`, `foundation/design-system`, `operations/company`, `decisions`, `reviews`, `archive`.

## Marketing And Brand Language

| Use | Avoid |
|---|---|
| `Four products, one system.` | `all-in-one productivity platform` |
| `Everything important. Nothing distracting.` | `world-class productivity suite` |
| `A briefing, not a dashboard.` | `analytics dashboard` |
| `Project management for the 80% not in tech.` | `enterprise project management` |
| `Show what is happening.` | `roadmap visibility for stakeholders` |
| `Write it before it disappears.` | `knowledge management layer` |
| `See what needs doing.` | `kanban productivity workflow` |

## Review Panel Synthesis

The review panel converged on five rules:

1. Lock `Notes`, `Tasks`, `Timeline`, `Signal`.
2. Do not let `Signal` become a generic word for every insight, alert, metric, or AI output.
3. Retire Director/persona/org-chart language from durable architecture.
4. Replace Jira/Scrum terms in product and brand language, but keep standard engineering terms where they are exact.
5. Rename low-risk docs and UI copy before code, packages, routes, and integrations.

## Iteration Record

### Pass 1: Remove Clever-But-Unclear Terms

Changed:

- `Signal Directors` became `advisors` or `review panel`.
- `Executive Directors` became `core advisors`.
- `Taste Council` became a private review ritual, not a formal architecture term.
- `HQ` became restricted to an existing route/surface, not a top-level structure.

Clearer because:

- It removes false authority.
- It makes AI roles easier to understand.
- It prevents internal mythology from replacing product clarity.

Rejected:

- Persona names as folder names.
- `Founder Operating System`.
- `Council` as a universal term.

### Pass 2: Remove Generic SaaS/Startup Language

Changed:

- `Roadmap` becomes `Timeline` in product language.
- `Analytics` becomes `Signal` in product language.
- `platform` becomes `Signal Studio`, `products`, or `system`.
- `all-in-one` becomes `Four products, one system.`

Clearer because:

- The product set reads as outcomes, not categories.
- The suite avoids commodity productivity positioning.

Rejected:

- `productivity platform`.
- `operating layer` in customer copy.
- `enterprise-grade`, `seamless`, `robust`, `workflow automation`.

### Pass 3: Simplify For Long-Term Use

Changed:

- `history/archive` becomes `archive`.
- `foundation` gains subfolders rather than carrying everything.
- Standard engineering terms stay where they reduce coordination cost.
- Migration tiers separate UI copy, docs, code, and integrations.

Clearer because:

- Engineers can still search, build, test, deploy, and debug.
- Operators get a smaller vocabulary.
- Brand language no longer fights the machinery.

Rejected:

- Renaming `bug`, `deploy`, `release`, `test`, `schema`, or `API`.
- Replacing every `analytics` technical reference with `signal`.
- Mass-renaming repos before redirects/import plans exist.
