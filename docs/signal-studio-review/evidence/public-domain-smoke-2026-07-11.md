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
## Post-merge read-only smoke

After the product remediation merges, all five canonical domains returned HTTP 200 on 2026-07-11:

| Domain | Status | HEAD latency | CSP posture |
| --- | ---: | ---: | --- |
| signalstudio.ie | 200 | 2098 ms | report-only |
| notes.signalstudio.ie | 200 | 1957 ms | enforced |
| tasks.signalstudio.ie | 200 | 1176 ms | report-only |
| timeline.signalstudio.ie | 200 | 677 ms | report-only |
| signal.signalstudio.ie | 200 | 1732 ms | report-only |

This is a public availability receipt, not authenticated journey or provider-topology proof.
