# CSP enforcement contract — 2026-07-11

Tasks, Timeline, and Signal now support an explicit `SIGNAL_ENFORCE_CSP=true`
switch that promotes their existing report-only policy to enforced
`Content-Security-Policy`; unset keeps the reversible report-only posture while
browser reports are reviewed. Notes already enforces CSP. All four retain the
`/api/csp-report` collector.

Receipt: `corepack pnpm csp:check` → `csp-contract: ok (4 products)`.

Tasks, Timeline, and Signal production builds pass after the configuration
change. Provider browser-report review and production enablement remain an
operator gate.
