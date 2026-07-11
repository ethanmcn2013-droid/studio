# Public-domain smoke receipt — 2026-07-11

Read-only `HEAD` and `GET` checks from the Windows operator environment:

| Domain | Status | HEAD ms | CSP state |
| --- | ---: | ---: | --- |
| signalstudio.ie | 200 | 2,099 | report-only |
| notes.signalstudio.ie | 200 | 2,002 | enforced |
| tasks.signalstudio.ie | 200 | 2,200 | report-only |
| timeline.signalstudio.ie | 200 | 846 | report-only |
| signal.signalstudio.ie | 200 | 1,909 | report-only |

All five canonical domains resolve and serve through Vercel. The three
report-only product policies are intentionally left behind the reversible
`SIGNAL_ENFORCE_CSP` switch until browser-report review is complete.
