# HQ commercial truth correction

2026-09-04. Local candidate on `feat/january-commercial-readiness`, from
`a53135052f3014edb712cd14655c00a892fe393b`. This corrects the populated-source
gap in [the earlier handoff](COMMERCIAL_HANDOFF.md). No production data,
provider, send, deployment, schema, App source or commercial contract changed.

## Source and count truth

`getTraction()` pairs shared sponsors and `venue_payment` events in one shared
SQL read. Positive payment proof requires a version-1 receipt with the canonical
sponsor ID, slug, opaque evidence key, actor, valid row hash and chronology,
and all six current financial fields matching: plan, annual amount, Founding
lock, paid time, term start and term end. The retained price and annual-window
conventions must also match the writer. Writer and reader share the field list.

Count each matching venue once. Cash is the sum of those **current annual
amounts**, not cumulative lifetime cash, accounting revenue or provider-confirmed
settlement. A valid earlier annual receipt cannot certify a changed current
record. Replays and multiple renewals do not multiply the count. Studio is a
mirror and cannot create positive proof; unaudited or unmatched paid claims
remain visible for reconciliation, deduplicated by slug. A failed mirror update
does not erase valid shared evidence. An unread shared audit produces unread
traction, with no fallback to legacy paid claims.

The audit receipt records a named operator's attestation against privately
retained evidence. This reader verifies the matching row hash; it does not
claim a new whole-chain integrity audit, bank verification or legacy repair.
Refund/reversal handling and production reconciliation remain outside this repair.

## January and reachable displays

Today, proof, verdict, Reporting and Founders Circle agree on receipt-matched
payments and eligible live CRM records. Missing CRM stays unread, not a committed
example count. CRM contact metadata never proves an authorised send. Exact
euro formatting preserves €1,500 rather than rounding it to €2k.

The shared commercial clock remains prelaunch before 21 January 2027 and inert
on/after it. Cash, target dates and CRM rows cannot start it, pass a manual gate,
or make a milestone done/missed. Campaign start/end and the old M3 deadline stay
null because no actual authorised first-send receipt reader is connected.

The May–November live pace calculation and outreach-forcing verdict are retired.
The €250,000 reference and financial model remain explicitly historical, not a
new January cash commitment. A payment cannot turn modeled runway into evidence
of a self-funding company. Blueprint labels access/subscription estimates as
such. Existing HQ layout and historical model inputs remain in place.

## Checks

- `pnpm test`: **484 passed**, zero failures: 16 migration, 411 core and 57 writer
  tests. This includes 19 venue-commercial tests, eight new populated-source
  cases, and five proof-gate tests.
- `pnpm typecheck`, focused ESLint and `pnpm build`: passed. Build compiled in
  35.3 seconds, TypeScript in 33.4 seconds; 35 static pages generated. The existing
  edge-runtime/static-generation notice remains. Build used no provider credentials.
- New gate regressions: `node --test scripts/check-suite-contract-consumers.test.mjs`
  **4 passed**. Real CLI cases cover explicit release selection despite a drifted
  sibling, default app/tasks layout, invalid paths without fallback, missing
  payment contracts, invalid read scope and meaningful-action drift.
- `APP_REPO_PATH=C:/Users/ethan/signal-studio-workspace/worktrees/app/feat-january-core-integration`
  with `node scripts/check-suite-contract-consumers.mjs`: passed all four suite/
  commercial contracts, both Tasks read consumers and meaningful-action v1.
  App HEAD at that check: `ffa60f4e7c6089e571d6fa9eada70432cd363ec3`, with no
  dirty commercial-v2 consumer. Studio v2 is unchanged in this repair and
  `git diff f196 -- contracts/commercial-terms.v2.json` is empty.
- The separate `check-venue-term-parity.mjs` in `pnpm test` reports its existing
  absent-sibling skip. It is distinct from the explicit consumer gate above.
  Its expected `src/lib/venue-edition-term.vectors.json` is also absent from
  the selected App worktree, so a direct vector comparison could not run.
  No replacement vector source or parity repair is claimed.

Populated tests use disposable SQLite and the real payment writer. They cover
legacy/shared/mirror-only claims, selected unpaid plans, Founding plus standard
payments, replay, renewal deduplication, all six changed financial fields,
malformed/misbound/future/corrupt receipts, unavailable audit, failed Studio
mirror, and dates before January, on January 21, after January and a year later
with CRM contacts but no actual send evidence.

## Built browser evidence

Local `pnpm start --hostname 127.0.0.1 --port 3138`, Next 16.2.11, isolated Chrome,
synthetic local password/session and SQLite only. The normal production-secure
login redirect changed localhost hostnames; a valid synthetic session cookie
was installed for the exact 127.0.0.1 test origin. This is not a login-flow claim.
No code was issued and no external message or provider operation was invoked.

The fixture begins with one legacy paid claim and two selected unpaid venues:
cash €0, paid proof unmet, 1 excluded claim, 2 unpaid selections. The actual
writer then records a €1,000 Founding and €1,500 standard receipt: €2,500,
2 receipt-matched venues, 1 Founding, 1 excluded legacy claim, 0 unpaid selections.
Both states preserve the inert commercial clock and unverified useful work.

Screenshots: [legacy desktop](evidence/commercial/truth-legacy-desktop.png),
[verified desktop](evidence/commercial/truth-verified-desktop.png), and
[verified mobile](evidence/commercial/truth-verified-mobile.png). Desktop was
1440×1000; mobile was 390×844. Both paid-proof transitions were inspected in
the actual DOM: zero met payment rows before receipts, one afterward.

Reporting and Founders Circle both rendered €2,500, the shared source and the
excluded legacy claim. The financial-model current-evidence panel rendered
€2,500 without the old outreach/pace instruction; its mobile document had no
horizontal overflow. Blueprint rendered subscription estimates and active
access grants. All five routes loaded without a framework overlay or recorded
browser runtime errors. Existing cron/atlas warnings in the synthetic HQ are
not commercial proof and were not repaired. These observations do not establish
production proof, login-flow correctness or design acceptance. The isolated
browser and owned preview server were stopped after verification.

## Receiving instructions

For a non-sibling release worktree, run:

```powershell
$env:APP_REPO_PATH = 'C:/Users/ethan/signal-studio-workspace/worktrees/app/feat-january-core-integration'
pnpm contracts:check
node --test scripts/check-suite-contract-consumers.test.mjs
```

The default remains sibling `app/`, with legacy `tasks/` fallback. An explicit
path must be absolute, exist as a unified App directory and contain its expected
manifest/modules. All consumers use the same resolved path. This script reads
only; it neither checks out nor chooses a Git branch. The lead owns the matching
release branch/pin in CI and the receiving integration. No workflow or package
script was changed here. All six programme acceptance states remain open.
