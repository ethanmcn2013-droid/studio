# Product Language Guide

Language rules for Notes, Tasks, Timeline, and Signal.

Status: proposed canon

## Suite Coherence

The four products are not four separate apps with four separate voices. They are four parts of one working system:

| Product | Kind of clarity | What it does |
|---|---|---|
| Notes | Capture clarity | Catches work before it is work. |
| Tasks | Execution clarity | Turns work into owned action. |
| Timeline | Direction clarity | Shows what is happening and what is not. |
| Signal | Attention clarity | Surfaces what needs attention now. |

Naming caution: `Signal` is the preferred product-language direction for the briefing product, but broader public use should wait for trademark clearance. If counsel blocks the mark, the closest plain fallback is `Briefing`.

Shared suite line:

> Four products, one system.

Shared operating principle:

> Everything important. Nothing distracting.

## Shared Tone Rules

Use:

- Plain English.
- Short sentences.
- Concrete nouns.
- Active verbs.
- Product-specific examples from normal work: venues, freelancers, trades, students, teachers, small businesses.
- Calm refusals.

Avoid:

- Scrum/Jira vocabulary.
- Enterprise SaaS voice.
- AI-marketing register.
- Cute metaphors that require explanation.
- Decorative brand prefixes.
- Technical naming in user-facing areas.

## Notes

### Primary Purpose

Notes captures thoughts, facts, decisions, and meeting fragments before they become structured work.

Short definition:

> Write it before it disappears.

### Core Nouns

| Noun | Meaning |
|---|---|
| `note` | A private captured body of text. |
| `notebook` | The Notes surface and collection. |
| `stream` | Recent notes, newest first. |
| `capture field` | Always-ready writing field. |
| `extract` | A user-approved action shaped from a note. |
| `private note` | Raw note body that stays inside Notes. |

### Core Verbs

- `write`
- `save`
- `find`
- `search`
- `copy`
- `send to Tasks`
- `discard`

### User-Facing Labels

Use:

- `Open the notebook`
- `Write a note`
- `Search notes`
- `Send to Tasks`
- `Nothing here yet. Start typing.`
- `Private by default`

Avoid:

- `Create knowledge item`
- `Organize capture`
- `Promote insight`
- `AI extract`
- `Sync to workspace`

### Internal Technical Terms

Allowed:

- `note`
- `extract_body`
- `promoted_task_id`
- `capture email`
- `inbound email`
- `private body`
- `raw note body`

### Forbidden Terms

- `wiki`
- `knowledge base`
- `second brain`
- `PKM`
- `Zettelkasten`
- `graph`
- `daily note` as product scaffolding
- `AI summary`
- `AI tagging`
- `smart extraction`

### Tone Rules

- Notes is private and quiet.
- The product does not sound like a knowledge system.
- No pressure to organize.
- No claim that the system understands the user's thoughts.

### Naming Examples

Good:

- `Capture in three seconds.`
- `Find it later.`
- `Decide what becomes work.`
- `Raw notes stay private.`

Bad:

- `Build your second brain.`
- `Turn your notes into a knowledge graph.`
- `AI organizes your thinking.`
- `Manage your personal knowledge base.`

## Tasks

### Primary Purpose

Tasks turns captured context into visible action.

Short definition:

> See what needs doing.

### Core Nouns

| Noun | Meaning |
|---|---|
| `task` | A committed action. |
| `workspace` | Shared working area. |
| `owner` | Person responsible. |
| `due date` | Date the work matters. |
| `waiting` | Something depends on another person or event. |
| `done` | Completed work. |
| `task list` | Plain list of tasks. |
| `view` | A way to see the same tasks. |

### Core Verbs

- `add`
- `assign`
- `mark done`
- `move`
- `share`
- `invite`
- `reply`
- `wait`
- `reopen`

### User-Facing Labels

Use:

- `Open the workspace`
- `Add a task`
- `My work`
- `Waiting on you`
- `Due soon`
- `Done`
- `Share checklist`
- `Invite collaborator`

Use carefully:

- `workspace`
- `view`
- `status`
- `blocked`

Avoid:

- `ticket`
- `issue`
- `sprint`
- `epic`
- `story points`
- `kanban`
- `velocity`
- `backlog`

### Internal Technical Terms

Allowed:

- `task`
- `lane`
- `status`
- `workspace`
- `assignee`
- `owner`
- `blockedBy`
- `activity`
- `comments`
- `attachments`
- `template`
- `seed`

### Forbidden Terms

For user-facing product copy:

- `ticket`
- `issue`
- `epic`
- `sprint`
- `kanban`
- `velocity`
- `burndown`
- `stakeholder`
- `workflow builder`
- `project-management shell`

### Tone Rules

- Tasks is practical and direct.
- Do not over-poeticize the work.
- The user should feel capable, not managed.
- Avoid making normal tasks feel like software artifacts.

### Naming Examples

Good:

- `What needs doing, who owns it, when it matters.`
- `A workspace the client can understand.`
- `Waiting on supplier reply.`
- `Mark done.`

Bad:

- `Ticket triage for project velocity.`
- `Kanban workflows for stakeholders.`
- `Sprint-ready task orchestration.`
- `Backlog grooming made seamless.`

## Timeline

### Primary Purpose

Timeline explains direction through a public, readable sequence of updates.

Short definition:

> Show what is happening.

### Core Nouns

| Noun | Meaning |
|---|---|
| `timeline` | The public ordered plan/update surface. |
| `update` | A meaningful change or note on direction. |
| `Now` | What is moving now. |
| `Soon` | What is coming up. |
| `Later` | Written down but not active yet. |
| `Done` | Settled work. |
| `Refused` | Deliberate no. |
| `public link` | Shareable read-only timeline link. |
| `direction` | What the work is moving toward. |

### Core Verbs

- `publish`
- `share`
- `write`
- `update`
- `move`
- `refuse`
- `show`
- `explain`

### User-Facing Labels

Use:

- `Open the timeline`
- `Publish update`
- `Share timeline`
- `Now`
- `Soon`
- `Later`
- `Done`
- `Refused`
- `Waiting on you`
- `Coming up`

Avoid:

- `Roadmap` as product name.
- `Backlog`
- `Stakeholder view`
- `Delivery board`
- `Release train`
- `Project pipeline`

### Internal Technical Terms

Allowed:

- `timeline`
- `update`
- `workspace`
- `slug`
- `source`
- `public page`
- `refusal`
- `time bucket`

Allow `roadmap` only in legacy repo aliases, historical docs, or where it means strategic company planning rather than the product.

### Forbidden Terms

For user-facing product copy:

- `roadmap` as the primary product name
- `backlog`
- `sprint`
- `epic`
- `stakeholder`
- `kanban`
- `velocity`
- `delivery board`

### Tone Rules

- Timeline is public, calm, and explanatory.
- It should feel like a readable plan, not a PM artifact.
- Refusals are allowed and direct.
- Avoid apologizing for not doing something.

### Naming Examples

Good:

- `One public place to show what changed.`
- `Now, Soon, Later, Done, Refused.`
- `Share the direction without an account.`
- `What will not be picked up.`

Bad:

- `Stakeholder roadmap visibility.`
- `Backlog export for clients.`
- `Agile roadmap management.`
- `Kanban-style public board.`

## Signal

### Primary Purpose

Signal reads work state and writes a short briefing about what needs attention.

Short definition:

> A briefing, not a dashboard.

### Core Nouns

| Noun | Meaning |
|---|---|
| `briefing` | The main Signal artifact. |
| `Daily Signal` | Daily short read. |
| `Weekly Signal` | Weekly trend read. |
| `Launch Signal` | Pre-release attention read. |
| `needs attention` | Active consequences if ignored. |
| `moving well` | Quiet wins and momentum. |
| `quiet risks` | Invisible accumulation. |
| `suggested focus` | Selected next actions worth doing now. |
| `trigger` | Internal deterministic rule that qualifies a briefing item. |
| `insight` | One sentence that explains what is happening. |

### Core Verbs

- `read`
- `review`
- `surface`
- `suppress`
- `focus`
- `explain`
- `flag`

### User-Facing Labels

Use:

- `Open the briefing`
- `Review today's Signal`
- `Needs attention`
- `Moving well`
- `Quiet risks`
- `Suggested focus`
- `Daily Signal`
- `Weekly Signal`
- `Launch Signal`

Avoid:

- `Analytics`
- `Dashboard`
- `Metrics`
- `Score`
- `Productivity`
- `AI summary`
- `Insights dashboard`
- `Alert feed`

### Internal Technical Terms

Allowed:

- `trigger`
- `insight`
- `briefing`
- `read model`
- `source`
- `compression`
- `rotation`
- `analytics` when referring to telemetry or measurement
- `metrics` when technically exact

### Forbidden Terms

For user-facing product copy:

- `analytics dashboard`
- `metrics platform`
- `productivity score`
- `AI-powered insights`
- `smart recommendations`
- `automatic prioritization`
- `alert stream`
- `leaderboard`
- `velocity`

### Tone Rules

- Signal should never sound like it is judging the user.
- It names what matters, then stops.
- It does not show charts unless the sentence matters more than the chart.
- It must not imply a black-box AI decision if the mechanism is deterministic.

### Naming Examples

Good:

- `A briefing, not a dashboard.`
- `Two minutes a day. Plain English.`
- `This may need attention.`
- `Work has slowed this week.`

Bad:

- `AI analytics for project velocity.`
- `Your productivity score dropped.`
- `Smart dashboard recommendations.`
- `Enterprise insight platform.`

## Cross-Product Language

### How Objects Move

| Flow | Language |
|---|---|
| Notes -> Tasks | `Send to Tasks`, `extract`, `approved action`. |
| Tasks -> Timeline | `Share update`, `publish progress`, `show direction`. |
| Tasks -> Signal | `Signal reads Tasks`, `briefing item`, `needs attention`. |
| Timeline-> Signal | Later only if explicitly scoped. Use `direction signal` internally, not in user copy. |

### Do Not Blur Product Boundaries

- A note is not a task.
- A task is not a note.
- A timeline is not a board.
- A briefing is not a dashboard.
- Signal does not replace Tasks.
- Timeline does not become a backlog.
- Notes does not become a wiki.

## Anti-Examples Across The Suite

Avoid these patterns:

- `Signal Studio is an all-in-one productivity platform.`
- `Timeline and Signal help stakeholders understand sprint velocity.`
- `AI agents automatically prioritize your backlog.`
- `Kanban boards, epics, and tickets for non-technical teams.`
- `Enterprise-grade workflow automation for every use case.`

Use instead:

- `Signal Studio is four products, one system.`
- `Notes captures. Tasks moves. Timeline shows. Signal briefs.`
- `Everything important. Nothing distracting.`
- `Project management for the 80% not in tech.`

## Product Language Decision Rule

When choosing a label, ask:

1. Does it name what the user sees or does?
2. Does it belong to one product?
3. Is it already in the lexicon?
4. Does it avoid PM/SaaS/AI bloat?
5. Would the same word still work in a venue, classroom, freelance studio, trade job, or small shop?

If not, rewrite it.
