# UX Assurance Bot Operating Guide

This bot is designed for founder-led, AI-assisted product work. Use it after a
meaningful coding session, before a demo, and whenever a workflow feels like it
might have drifted.

## First Pass

From the `studio` repo:

```bash
corepack pnpm test:ux:first-pass
```

Open the generated `ux-tests/reports/first-pass-brief-*.md`.
For a browsable artifact list, open `ux-tests/reports/index.html`.
For a visual scan, open the linked `screenshot-gallery-*.html`.

Read in this order:

1. Overall status, hard issues, and quality gate failures.
2. Phase summary for the lowest score or any failed phase.
3. The linked phase report's executive summary and prioritized findings.
4. Screenshots for the lowest-scoring journey.
5. Craft notes only after hard issues and gates are clean.

## Decision Rules

- Any failed phase, hard issue, or gate failure means fix first.
- Scores below `7.5/10` mean the journey is not ready as product proof.
- Scores between `7.5` and `8.5` are usable but need taste refinement.
- Scores above `8.5` with clean gates are ready for human taste review.
- Known console noise is recorded separately; unknown console errors fail.

## Daily AI-Coding Loop

```bash
corepack pnpm test:ux:daily
corepack pnpm test:ux:report
```

Use this after a meaningful batch of assisted coding. It runs the first-pass
matrix, compares against previous reports, and highlights new failures, score
movement, gates, screenshots, and suggested fixes.

For a narrower check while you are still iterating:

```bash
corepack pnpm test:ux:ai
corepack pnpm test:ux:report
```

For CI, use the same matrix:

```bash
corepack pnpm test:ux:ci
```

CI must either run from the full local Signal Studio workspace so the bot can
start sibling product apps, or set `UX_SKIP_WEBSERVER=1` with deployed
`UX_NOTES_URL`, `UX_TASKS_URL`, `UX_TIMELINE_URL`, and `UX_SIGNAL_URL`.

## Focused Commands

```bash
corepack pnpm test:ux:env
corepack pnpm test:ux:env:prod
corepack pnpm test:ux
corepack pnpm test:ux:daily
corepack pnpm test:ux:mobile
corepack pnpm test:ux:keyboard
corepack pnpm test:ux:scenario
corepack pnpm test:ux:full-flow
corepack pnpm test:ux:gallery
corepack pnpm test:ux:index
```

Use focused runs while fixing a specific product or journey.
The env commands report key presence only and never print secret values.
If credentials live in a cloud-synced env file outside the repo, include it
without copying values:

```bash
node ux-tests/utils/env-readiness.mjs --profile production --env-file "C:\path\to\.env"
```

Multiple external files can also be passed with `UX_ENV_FILES`, separated by the
platform path delimiter.

To search likely workspace/cloud folders for env files by key name only:

```bash
corepack pnpm test:ux:env:find
```

The output is redacted: file paths and matching key names only, never values.

## Add A Scenario

Create a YAML file in `ux-tests/scenarios`, for example:

```yaml
persona: event-manager
goal: recover from a last-minute supplier change
starting_state: demo_user
journey:
  - scan notes capture
  - add a task
  - review timeline
  - review signal
success_criteria:
  - user understands what needs attention
  - no broken buttons
  - no console errors
  - the signal stays calm and short
```

Run it with:

```bash
node ux-tests/run-ux-tests.mjs --scenario your-file-name-without-yaml
```

If you add a new journey instruction, map it in
`ux-tests/utils/scenario-engine.ts`. Unknown instructions fail loudly by design.

## What The Bot Judges

- Route and workflow completion
- Browser console health
- Buttons, links, forms, and basic accessible names
- Layout overflow and obvious craft issues
- UX score dimensions: clarity, calm, next step, non-technical friendliness,
  restraint, suite continuity, AI regression safety, and commercial confidence
- Screenshots at evidence points
- Trend against the previous run

The bot is not a substitute for human taste. It clears the table so the human
review can focus on taste, usefulness, and the feeling of Signal Studio.
