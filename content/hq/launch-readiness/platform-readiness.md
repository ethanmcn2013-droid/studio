---
id: platform-readiness
title: Platform readiness
score: 0
weight: 18
status: At risk
blockers: [The remediation ledger contains open P0 launch gates.]
nextAction: Close SS-P1-001 and SS-P1-002, then attach focused security evidence.
---

## Source of truth

The live progress source is `docs/signal-studio-review/remediation-program.yaml`.
The validator is `scripts/check-remediation-program.mjs`. This record is the HQ
summary and must not become a competing checklist.

## Launch rule

The program cannot be marked complete while any P0 or P1 item is open, while
the eight suite journeys lack evidence, or while restore, rollback, identity,
tenant-isolation, or public-output gates remain unverified.
