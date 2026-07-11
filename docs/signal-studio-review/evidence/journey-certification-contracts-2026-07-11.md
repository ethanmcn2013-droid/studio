# Eight suite journey contract certification — 2026-07-11

The repository now has an executable contract harness for all eight mandatory
journeys. It covers workspace/product entry, explicit Notes→Tasks destination,
Timeline milestone reads, authorized Signal briefing, context-preserving
switching, protected deep-link return, entitlement loss, and full lifecycle
store coverage.

Receipt:

```text
corepack pnpm exec tsx --test src/lib/suite/journey-certification.test.ts
all eight suite journey contracts pass
```

These are policy/contract receipts, not browser/provider production evidence;
authenticated cross-domain and production-like journey runs remain open.
