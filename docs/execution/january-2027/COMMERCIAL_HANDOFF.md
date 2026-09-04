# January commercial implementation handoff

Updated 2026-09-04. Worktree: `feat-january-commercial-readiness`.
Branch: `feat/january-commercial-readiness`. Starting revision: `efe2ed6`.
This is a local implementation receipt for the lead's receiving candidate,
not programme acceptance or production readiness.

## Populated-source correction after lead review

The earlier statement below that the old outreach-forcing view no longer
rendered on Today was incomplete. Its database-unavailable browser fixture
did not exercise `getTraction()`: legacy Studio `paidAt` still counted as cash,
paid proof could pass, and May burndown/verdict claims remained reachable.
The later bounded repair from `a53135052f3014edb712cd14655c00a892fe393b`
supersedes that claim. See [HQ truth repair receipt](HQ_TRUTH_REPAIR.md) for
the receipt-matched source, populated tests, browser evidence, historical-target
limits and explicit App consumer gate. The original writer receipt remains
valid; it did not retrospectively audit legacy rows.

## Commits

| Commit | Change |
|---|---|
| `4de29aa` | Canonical January decision, programme, source authority/contradiction ledger, manual machine-contract gates and retained commercial terms. |
| `0993913` | User-accepted planning allocations, S1–S6 workstreams, delegated review/no-build authority and lead integration receipts. |
| `9b6e4c6` | Full A–F instrument comparison without fabricated scores or research claims. |
| `f59709a` | Payment/onboarding/proof implementation, executable regressions, truthful launch state and CRM-source provenance. |
| `003a863` | Final venue agreement/payment labels and removal of the immediate mint prompt after onboarding. |

The final documentation/evidence commit follows these code commits. No push
or merge was performed by this commercial agent. The lead remains authorised
to push/merge internal candidates; production is held.

## Behaviour delivered

- `onboardVenue` records an intended plan, never manufactures `paidAt`.
  Re-onboarding preserves existing payment, amount, lock and paid term;
  changing the plan of an already-paid venue is refused in this path.
- `mark-venue-paid` requires an opaque retained-receipt reference, actual
  clearing time, exact VAT-inclusive amount and named operator. Shared sponsor
  state and hash-chained audit evidence commit atomically. Studio is then
  repaired as a mirror. Missing rows, conflicting evidence, stale receipts,
  unsupported early renewals and mirror failures do not report success.
  The same evidence retries without a new payment or shifted term.
- Existing schema is reused. `venue_payment` is an additive audit-action value;
  no production migration or provider verification ran. The command records
  an operator attestation against privately retained evidence, not provider
  settlement verification. [Payment guide](../../guides/venue-payment.md).
- HQ reports code redemptions as all-source access distribution. It never
  converts the entitlement count into useful activation. Useful actions and
  actual sharing remain unverified here. Missing CRM reads retain provenance
  rather than passing committed examples to the proof gate as live data.
- January date/clock and launch panels consume the contract. A passed date or
  paid count never marks launch complete. Manual launch/outreach decisions
  remain pending. The old outreach-forcing view is no longer rendered on Today.
- Standard/Founding remain €1,500/€1,000 annually, VAT-inclusive. The Student
  page no longer contradicts the January target with “no launch date”; actual
  Student availability still depends on eligibility enforcement.

## Local verification

| Check | Result / limit |
|---|---|
| `pnpm install --frozen-lockfile` | Passed with the pinned lockfile. Dependency versions and lockfile unchanged by this work. |
| `pnpm test` | Passed: 476 tests (16 migration, 411 core, 49 writer tests). The later two-line presentation correction does not change tested writer behaviour. |
| Venue-term parity script | Explicitly skipped: no sibling App checkout beside this worktree. Receiving integrator must run it in the assembled workspace. |
| `pnpm typecheck` | Passed after the payment, launch and CRM-source changes. Final build also runs TypeScript. |
| Focused ESLint | Passed for the payment/audit/onboarding/proof modules and the launch/CRM/readiness changes. |
| Final `pnpm build` | Passed, exit 0, at `003a863`, including the final agreement/payment labels. Provider/database credentials removed from the build process environment. |
| Rendered HQ | Desktop and mobile inspected on the built local candidate with synthetic credentials. Missing database/CRM sources remain unavailable; January target and two manual gates visible; no console errors or framework overlay in those checks. |
| Real form submission against local SQLite | Standard agreement created `synthetic-january-venue`, amount `150000`, `paid_at = null`; final built UI shows “Standard agreement · no payment recorded”. No code issued and no message sent. |

Payment regressions exercise the real writers and actual SQLite engine:
new/updated unpaid plans, prior-payment preservation, allotment deltas, exact
prices, audit rollback, partial mirror failure and repair, missing rows,
reference conflicts, actor validation, chronology/renewal refusal, stale
replay, the real CLI's nonzero exit and retry, and concurrent identical receipts
through independent database connections. All inputs are synthetic/local.

Screenshots retained with this record:
[desktop proof](evidence/commercial/hq-desktop.png),
[mobile proof](evidence/commercial/hq-mobile.png),
[synthetic venue onboarding](evidence/commercial/onboarding-desktop.png).
Command receipts and scope are summarised in
[checks.txt](evidence/commercial/checks.txt).
They document local behaviour, not production evidence or a closed design gate.

## Receiving checks and unverified external state

All six acceptance states remain open. The latest component receipts,
accepted September–January schedule, Monday maintenance heartbeat, S1–S6
status and A–F no-build decision are retained in [PROGRAMME.md](PROGRAMME.md)
and [INSTRUMENT_OPPORTUNITIES.md](INSTRUMENT_OPPORTUNITIES.md).

The lead owns `feat/january-core-integration` receiving checks. `package.json`
changed only to include `proofgate.test.ts` and `venue-commercial.test.ts` in
the existing test command. No conflict was encountered locally; retain those
test additions when combining any lead-owned script changes. Workflows,
`vercel.json`, `scripts/january-*`, dependency versions and the lockfile were
not edited. Existing security fixes and disabled Git deployment configuration
remain in the branch.

App files were not edited. App-owned follow-up remains explicit:

- Reconcile Clerk `.edu` / `EDU_PRO_DAYS` grants and billing “Got a code” claims
  with the v2 €9.99 verified-eligibility Student policy. `3d5b8ee8` does not
  change that business logic.
- Recurring Stripe renewal, cancellation and refund still need observed
  test-mode evidence; no test-mode Stripe account provisioning is claimed.
  Billing security review and receiving integration remain with the lead.
- Template generation reproducibility is reported separately from application
  behaviour: generation does not duplicate, application still appends. The
  reviewed template counts are fixtures, not users or useful actions.
- Verify the assembled App/Studio contract and shared-audit readers, and supply
  attributed committed-use evidence before any actual-use proof count is lit.
  No new App instrument or duplicate billing work was undertaken here.

Legacy `paidAt` rows have not been audited against receipts or repaired. The
new writer does not retrospectively certify them. Production mirror health,
provider state, real useful-action coverage, actual required legal/tax final
readiness and manual launch/outreach decisions remain unverified here.
Accountable-person status remains unconfirmed in the retained contract; no
blanket legal-approval gate was added for ordinary commercial statements.
Production 0028/0029 remains held per the lead. No live Google, council,
email, deployment, migration, production data mutation or outreach is claimed.

## Exact changed files

The list below is generated from the local commit range and the final evidence
record. It excludes inherited security/deployment changes.

- `CHANGELOG.md`
- `content/hq/campaigns/founding-venue.md`
- `content/hq/decisions/business-strategy-frame-2026-05.md`
- `content/hq/decisions/january-2027-launch.md`
- `content/hq/decisions/strategy-review-2026-05-18.md`
- `content/hq/operator-todos/january-2027-go-no-go.md`
- `contracts/commercial-terms.v2.json`
- `docs/execution/january-2027/COMMERCIAL_HANDOFF.md`
- `docs/execution/january-2027/evidence/commercial/checks.txt`
- `docs/execution/january-2027/evidence/commercial/hq-desktop.png`
- `docs/execution/january-2027/evidence/commercial/hq-mobile.png`
- `docs/execution/january-2027/evidence/commercial/onboarding-desktop.png`
- `docs/execution/january-2027/INSTRUMENT_OPPORTUNITIES.md`
- `docs/execution/january-2027/PROGRAMME.md`
- `docs/guides/venue-payment.md`
- `docs/SIGNAL_HQ.md`
- `docs/strategy/BUSINESS_PARTNER_REVIEW_2026_05.md`
- `docs/strategy/STRATEGY_REVIEW_2026_05_18.md`
- `docs/strategy/VENUE_EDITION_STRATEGY.md`
- `docs/strategy/VENUE_FULFILMENT_RUNBOOK.md`
- `docs/strategy/VENUE_GTM_EXECUTION_PLAN.md`
- `docs/VISION.md`
- `package.json`
- `scripts/check-content-truth.mjs`
- `scripts/check-venue-edition-contract.mjs`
- `scripts/mark-venue-paid.ts`
- `src/app/hq/entitlements/OnboardVenueForm.tsx`
- `src/app/hq/entitlements/page.tsx`
- `src/app/hq/page.tsx`
- `src/app/students/page.tsx`
- `src/components/hq/hq-launch-readiness.tsx`
- `src/components/hq/hq-proof-gate.tsx`
- `src/components/hq/hq-traction.tsx`
- `src/lib/commercial-terms.test.ts`
- `src/lib/entitlements-db/audit-core.ts`
- `src/lib/entitlements-db/audit.ts`
- `src/lib/entitlements-db/schema.ts`
- `src/lib/entitlements-db/venue-commercial.test.ts`
- `src/lib/entitlements-db/venue-payment.ts`
- `src/lib/entitlements-db/venues.ts`
- `src/lib/hq/blueprint.ts`
- `src/lib/hq/crm-db.ts`
- `src/lib/hq/launch.ts`
- `src/lib/hq/proofgate.test.ts`
- `src/lib/hq/proofgate.ts`
- `src/lib/hq/traction.ts`
