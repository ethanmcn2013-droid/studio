# Locked Operating Vocabulary

Status: locked. Companion to `NAMING_CONSTITUTION.md`.

`CODEX.md` and the `$signal-brand-review` skill have routed here since the
contract was written. The file did not exist until 2026-07-30, which is part of
why the rule below went unenforced for nine days after it was ratified.

## The spine

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

Use `Problem` instead of bug. Use `Finding` for audit observations. Use `Queue`
instead of backlog. Use `Cycle` instead of sprint. Use `Timeline` for the
product and `plan` for strategy.

Normal engineering language stays where it helps maintenance: API, schema,
test, migration, deploy, branch, commit, PR.

## Code names and brand names

Some entities carry a different name in the codebase than the one a user reads.
That is allowed, and renaming the code is usually the wrong trade. What is not
allowed is a component deciding the user-facing word for itself.

> **The rule.** When a code name and a brand name differ, the entity has
> exactly one translation point. No component may author the word itself.

### The register

| Entity | Code name | User-facing name | Translation point |
|---|---|---|---|
| Tasks workspace | `workspace`, `workspaces`, `workspaceId` | **Project** | `tasks/src/lib/planning/context.ts` (`CONTEXT_TERMINOLOGY`) |
| Planning period | `planningPeriod`, `planning_periods` | **Season** (generic); School year, Semester, Wedding season by context | same |

Ratified by **D-011** (2026-07-21): "Projects = Tasks workspaces. Programs =
planning periods."

**Amendment, 2026-07-30.** The generic planning-period noun ships as **Season**,
not Program. To the wedding and venue audience a programme is the running order
on the day, and the surface renders a date range, not a strategic thrust.
`Initiative` stays reserved and unused; a date window should not consume a spine
word that the real strategic layer will need.

The context-specific names were already correct before D-011 and are unchanged:
a school year holds Classes, a semester holds Modules, a wedding season holds
Weddings. Only the generic default leaked.

## Enforcement

`tasks/src/lib/planning/vocabulary.test.ts` fails the build when any file under
`tasks/src/` contains the user-facing entity noun in:

- JSX text
- `aria-label`, `title`, `placeholder`, `alt`

Comments are out of scope, because in a comment `workspace` is the correct name
for the thing. The allowlist is the translation point itself, the test, and two
justified exceptions: the `Workspace plan` billing name owned by pricing, and a
frozen marketing capture that is re-recorded rather than edited.

Adding to that allowlist should be argued, not assumed. Every entry is a place
the word can still reach a user.

## Why the enforcement exists

D-011 was ratified on 2026-07-21 and had not landed by 2026-07-30. The board
brief still rendered a hardcoded `<span>Workspace</span>` above a title, in a
column whose sidebar three inches to the left already said "Projects". It
survived a ratified decision, a shipped release, and a founder review, because
nothing checked.

When the contract test was first run it found **fifteen further instances** that
a careful manual search had missed, across Notes, Timeline, Signal, the share
email and the onboarding picker. A rule that is written down and not executed is
a rule that drifts. This one now executes.

## Related

- `NAMING_CONSTITUTION.md`
- `docs/BRAND.md` §3 (banned language), §6.5 (dispatch shape and CTAs)
- `docs/execution/signal-studio/DECISIONS.md` (D-011)
