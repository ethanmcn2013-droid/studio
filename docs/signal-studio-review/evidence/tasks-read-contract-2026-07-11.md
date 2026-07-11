# Owned Tasks read contract — 2026-07-11

The Tasks-owned read contract is now versioned (`v1`) for milestone and
briefing reads. It requires immutable subject + workspace scope, a 2-second
timeout budget, idempotent-only retries, and versioned object responses.
Timeline and Signal consume the contract fixtures and validate the subject
boundary before their existing read adapters execute.

Receipts:

- `corepack pnpm contracts:check`: suite fixtures and Tasks read consumers pass.
- Timeline sync suite: 33/33 pass, including contract identity checks.
- Signal Tasks source suite: 11/11 pass, including contract identity checks.
- Timeline and Signal typechecks pass.

HTTP producer/consumer cutover, least-privilege provider credentials, and
production latency telemetry remain open.
