# Launch budget gate — 2026-07-11

Budgets are now machine-readable in `contracts/launch-budgets.v1.json` and
checked by `scripts/check-launch-budgets.mjs`. The checker intentionally fails
closed while browser Web Vitals, authenticated latency, query counts, and
accessibility measurements are absent:

```json
{"ok":false,"missing":["webVitals","authenticated","data","accessibility"],"failures":[],"budgetsVersion":1}
```

This keeps the launch gate visible rather than treating missing measurements as
a pass. The repeatable gzip chunk baseline and isolated recovery drill are
already recorded; the missing measurements are the next certification work.
