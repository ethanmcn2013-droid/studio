# UX Assurance Bot

Scenario-based Playwright checks for the Signal Studio suite. The runner lives in the `studio` repo because this is the umbrella package, but it starts the sibling product apps directly:

For first-pass operating instructions, see `ux-tests/OPERATING-GUIDE.md`.

- Notes: `http://127.0.0.1:4211`
- Tasks: `http://127.0.0.1:4212`
- Timeline: `http://127.0.0.1:4213`
- Signal: `http://127.0.0.1:4214`

The local runner starts each product in demo + UX assurance mode. That keeps the suite deterministic: seeded demo reads are used, Clerk is bypassed with quiet local account chrome, and demo-safe server actions avoid local database provisioning. Unknown browser console errors still fail the run. Known non-actionable browser noise, such as the CSP report-only `upgrade-insecure-requests` warning, is recorded separately in the report.

## Run

```bash
corepack pnpm test:ux
corepack pnpm test:ux:student
corepack pnpm test:ux:wedding
corepack pnpm test:ux:full-flow
corepack pnpm test:ux:keyboard
corepack pnpm test:ux:mobile
corepack pnpm test:ux:ai
corepack pnpm test:ux:env
corepack pnpm test:ux:env:prod
corepack pnpm test:ux:env:find
corepack pnpm test:ux:first-pass
corepack pnpm test:ux:daily
corepack pnpm test:ux:ci
corepack pnpm test:ux:gallery
corepack pnpm test:ux:actions
corepack pnpm test:ux:index
corepack pnpm test:ux:strict-console
corepack pnpm test:ux:all-projects
corepack pnpm test:ux:headed
corepack pnpm test:ux:report
```

Useful overrides:

```bash
UX_SKIP_WEBSERVER=1 UX_NOTES_URL=https://notes.signalstudio.ie corepack pnpm test:ux
UX_PERSONA=event-manager corepack pnpm test:ux
UX_CONSOLE_STRICT=1 corepack pnpm test:ux
```

`test:ux` runs the desktop Chromium project by default. `test:ux:mobile`
runs the same journeys through the mobile Chromium profile. `test:ux:ai`
marks the report as an AI-change review and compares it with the previous run.
Known non-actionable browser noise remains separated in the report so the daily
loop stays useful. Use `test:ux:strict-console` when you deliberately want known
console noise to fail the suite too.

## Structure

- `personas/*.yaml`: non-technical user lenses.
- `panel/*.yaml`: the review panel used to judge product taste and founder value.
- `scenarios/*.yaml`: lightweight journey instructions for future expansion.
- `journeys/*.spec.ts`: Playwright journeys.
- `utils/`: persona/scenario loading, console capture, screenshots, reporting.
- `reports/`: generated Markdown reports.
- `screenshots/`: generated step screenshots.

## Founder Loop

For day-to-day AI-assisted coding, run:

```bash
corepack pnpm test:ux:daily
corepack pnpm test:ux:report
```

For a narrower AI-change check while you are still iterating, run:

```bash
corepack pnpm test:ux:ai
corepack pnpm test:ux:report
```

For the first serious review pass, run:

```bash
corepack pnpm test:ux:first-pass
```

That command runs a practical matrix:

- desktop AI-change review with the student persona
- mobile review with the wedding venue persona
- YAML scenario execution for the student full workflow
- YAML scenario execution for the founder AI-change review
- keyboard smoke with the event manager persona

It writes an aggregate `first-pass-brief-*.md` next to the individual reports.
It also writes an `ux-action-board-*.md` with fix-now, improve-next, and watch
buckets for the founder/operator loop.

Each report now includes:

- the UX review panel and Signal Studio principles
- passed and failed journey steps
- screenshots at major moments
- console errors and known console noise
- broken routes, controls, links, and forms
- scorecards for clarity, calm, next step, non-technical friendliness, restraint, suite continuity, AI regression safety, and commercial confidence
- comparison against the previous UX run

Generated summaries are also written as JSON next to the markdown reports and
to `reports/.history/latest.json` for trend comparison.

Environment readiness reports check presence only. They never print secret
values. `test:ux:env` checks local demo readiness; `test:ux:env:prod` checks
production-like credential presence from local `.env*` files and `process.env`.
External env files can be included with:

```bash
node ux-tests/utils/env-readiness.mjs --profile production --env-file "C:\path\to\.env"
```

To locate likely external env files without exposing values, run:

```bash
corepack pnpm test:ux:env:find
```

The finder reports file paths and matching key names only. It does not print
secret values.

## Review Panel

The panel exists to keep the bot honest about product value, not just mechanics:

- Non-technical user advocate
- Founder operator
- Brand guardian
- QA architect
- AI coding safety lead
- Commercial reality check

## UX Lens

Reports evaluate against the Signal Studio principles:

- calm coordination
- obvious next step
- low jargon
- non-technical user friendly
- elegant restraint
- no feature sprawl
- Notes -> Tasks -> Timeline -> Signal should feel connected
- the system should reduce noise, not create it
