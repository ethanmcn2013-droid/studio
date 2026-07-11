# Canonical identity and capability adapter — 2026-07-11

Studio now has a fail-closed identity adapter that resolves an immutable suite
subject, workspace membership role, explicit capabilities, and product
entitlement status. It rejects suspended identities, removed/revoked access,
expired entitlements, and guest writes. Product-specific adapters can consume
the same contract while provider consolidation remains staged.

Receipts:

- `corepack pnpm exec tsx --test src/lib/suite/identity-adapter.test.ts src/lib/suite/contracts.test.ts`: 7/7 pass.
- `corepack pnpm typecheck`: pass.
- Source: `src/lib/suite/identity-adapter.ts`.

Four-domain provider/session and production receipts remain open.
