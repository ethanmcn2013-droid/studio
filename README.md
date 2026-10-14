# Signal Studio website

The `studio` repository contains Signal Studio's public website and internal HQ and Atlas surfaces. The signed-in App's source lives in [Signal App](https://github.com/ethanmcn2013-droid/app).

The public website is [signalstudio.ie](https://signalstudio.ie).

| What you need | Where to start |
| --- | --- |
| Working rules, setup, checks and release boundaries | [AGENTS.md](AGENTS.md) |
| Claude Code's instruction adapter | [CLAUDE.md](CLAUDE.md) |
| Website pages and route handlers | [src/app](src/app) |
| Shared interface components | [src/components](src/components) |
| Brand and design guidance | [BRAND.md](BRAND.md), [DESIGN.md](DESIGN.md) |
| Package versions and available commands | [package.json](package.json) |
| Automated checks | [tests](tests) |
| Recorded changes | [CHANGELOG.md](CHANGELOG.md) |

Start an implementation from the current task record and an owned worktree. Read the repository instructions before editing, then follow the checks and integration path for that task. Changes on `main` can trigger the existing website deployment; the task's release scope determines what is authorized.

Keep source changes in their owning repository and use the maintained instruction files for behavior. Historical plans and reports remain supporting context.

Browser tests start their own loopback server and refuse an occupied port. The default is `4387`; set `SIGNAL_TEST_PORT` to an available port when another task is testing concurrently. Both the default and handoff Playwright configurations use this setting. In PowerShell: `$env:SIGNAL_TEST_PORT = '4391'; corepack pnpm exec playwright test`. Choose a separate port for each active test run; the setting does not reserve it.
