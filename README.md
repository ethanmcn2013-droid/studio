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

## Temporary landing-only mode

The pre-launch boundary is owned by [Delivery issue 153](https://github.com/ethanmcn2013-droid/signal-studio-workspace/issues/153).
`src/lib/landing-only.ts` keeps it reversible: set `LANDING_ONLY` to `false` and rebuild to restore the retained marketing routes, secondary links, sitemap entries and signed-in launcher behavior.
No secondary page source is removed. While enabled, public secondary URLs return HTTP 302 to `/`; homepage section anchors and its waitlist server action remain available. Private HQ/API operations, the password-gated lender asset, metadata, supporting media and retired-domain compatibility keep their existing boundaries.

Run `pnpm typecheck`, `pnpm test`, `pnpm ds:check`, and `pnpm build`. After installing Playwright Chromium, `pnpm exec playwright test --config=playwright.landing.config.ts` checks the production build at an isolated port, desktop/mobile navigation, and an actual root-POST waitlist save into `.next/landing-waitlist-test.sqlite`. It supplies no production database token. The SQLite test file and browser captures are local test artifacts.
