# E08.01 · E08.02 · E08.03 — Venue Edition billing, founding-rate lock and renewal

**Written:** 2026-08-03 · **Author:** Claude Code (WP-07, Group A)
**Worktree:** `_wt-wp07s` on `claude/wp07-engineering-studio`
**Covers:** E08.01, E08.02, E08.03

**Nothing here is Done.** This is evidence submitted for Founder Review. Code
existing, documents being written and tests passing are none of the four things
Done requires.

---

## 0. What this session actually did, and to what

A previous agent with this assignment was interrupted by a session limit and
left its work committed as checkpoint `7cb50d5` with no specification, no
evidence and no verification. This session audited that checkpoint against
written acceptance criteria before building anything.

**The audit found six defects. All six are real and all six are fixed.**

| # | Defect in the checkpoint | Evidence it was real | State |
|---|---|---|---|
| 1 | `pnpm typecheck` was **RED**. Two `/s` dotAll regex flags in `venue-billing.test.ts` that this tsconfig target rejects | `tsc --noEmit` at `7cb50d5` exits **2** with `TS1501` at lines 189 and 216 | Fixed. Exit 0 |
| 2 | **Not one billing test ran in `pnpm test`.** Four new test files were written and never added to the test script | `package.json` at `7cb50d5` contains none of the four filenames | Fixed. All wired |
| 3 | One billing test was **failing**, and its assertion contradicted its own message | `venueRenewalWorklist` asserted `!slugs.includes("v-noactor")` with the message "an unpaid venue is still listed **only if** it is on a paying plan" | Fixed. The code was right, the test was wrong |
| 4 | **`recordAnnualPrepayment` had zero production callers.** The entire billing module was a library nothing called | `grep` for the writer across `src/` and `scripts/` returned only its own definition | Fixed. `mark-venue-paid.ts` records through it |
| 5 | **The founding rate was not actually immutable.** Append-only rows protect the past; nothing stopped the *next* term being recorded on a different plan | No plan-change check existed anywhere | Fixed. `planChangeRefusal()` |
| 6 | The ledger table was defined **three times** by hand, with a comment promising the copies matched | `migrate-venue-billing.mjs`, `schema.ts`, and inline in the test file | Fixed. One definition, plus a drift check |

The checkpoint's core design is good and was kept: gross-only money
construction, append-only terms, database-enforced immutability, the unratified
policy seam. This session did not restart it.

---

## 1. Verification actually run

Every command below was run in `_wt-wp07s` on 2026-08-03. These are real
results, not expectations.

### Typecheck

```
$ npx tsc --noEmit
typecheck exit=0
```

At the checkpoint commit, the same command exited **2**:

```
src/lib/venue-billing.test.ts(189,66): error TS1501: This regular expression flag is only available when targeting 'es2018' or later.
src/lib/venue-billing.test.ts(216,24): error TS1501: This regular expression flag is only available when targeting 'es2018' or later.
```

### Full test suite

```
$ npm run test
[product-marketing-contract] ok      [venue-edition-contract] ok
[suite-switcher-contract] ok         [venue-term-parity] ok (7498cee02c07)
[chrome-contract] ok                 [content-truth] ok
[loading-contract] ok

node --test group:   tests 70  · pass 70  · fail 0
tsx --test group:    tests 467 · pass 467 · fail 0
server-only group:   tests 56  · pass 56  · fail 0

=== FULL TEST EXIT: 0 ===
```

593 tests, zero failures. **The billing tests are inside that run**, which was
the point of fixing defect 2.

### Lint

```
$ npx eslint <the eleven files this task owns>
my-files lint exit=0
```

`npx eslint .` across the whole repository exits **1**, on one error:
`src/app/hq/account-review/account-review.tsx` — `react-hooks/set-state-in-effect`.
That file is not modified in this worktree, so the error is pre-existing at the
checkpoint commit and belongs to the account-review surface, not to this task.
It is reported rather than quietly fixed or quietly omitted.

### Migration script, against real SQLite

```
$ node --test scripts/migrate-venue-billing.test.mjs
✔ the migration creates the ledger table, its indexes and its triggers, and is idempotent
✔ a recorded term cannot be edited or deleted
✔ the same term cannot be recorded twice
✔ the append-only probe leaves nothing behind
✔ a dry run applies nothing
✔ the migration fails closed when sponsors is absent
tests 6 · pass 6 · fail 0
```

These execute the actual migration script against temporary database files. They
are not a re-implementation of it.

### Mutation runs — proof the tests can fail

A passing test proves nothing until it has been seen to fail.

**The founding-lock guard.** `planChangeRefusal` replaced with `return null`:

```
entitlements writer tests:  pass 17 · fail 1
pure billing tests:         pass 19 · fail 3
(restored)                  pass 22 · fail 0
```

**The schema-drift check.** `vat_rate_basis_points` renamed to `vat_rate_bps` in
the DDL:

```
✖ the drizzle table and the migration DDL declare the same columns
✖ the money columns keep the shape D-021 requires
pass 4 · fail 2
(restored)  pass 6 · fail 0
```

---

## 2. E08.01 — criterion to proof

| # | Criterion | Proof |
|---|---|---|
| 1 | One price resolver, matching the machine contract, with a drift test | `src/lib/venue-edition.ts` `venueEditionAnnualAmountCents()`. Test: "the price for a plan comes from one resolver"; `check-venue-edition-contract.mjs` requires `100000` and `cohortSize: 25` in `contracts/commercial-terms.v2.json` |
| 2 | Every venue-facing money string is VAT-inclusive in the D-021 wording | `formatVenuePrice()` has no variant that omits the wording. Tests: "the D-021 statement matches the machine contract character for character", "every venue-facing price carries the ratified basis", "refuses copy that adds VAT on top or quotes a bare price" |
| 3 | Term records start, end, paidAt and amount received, individually identifiable | `sponsor_price_agreements` columns `effective_from`, `effective_to`, `paid_at`, `amount_received_cents`, one row per term. Test: "records a founding term and assigns the founding number in the same operation" |
| 4 | Refuses the other plan's price, both directions | `prepaymentRefusal()`. Tests: "refuses the standard price against a founding agreement", "refuses the founding price against a standard agreement", "refuses the other plan's price, in both directions" |
| 5 | Exactly one live writer, carrying every guard | `scripts/mark-venue-paid.ts` now records through `recordAnnualPrepayment()` and no longer writes the ledger itself. `check-venue-edition-contract.mjs` requires the call by name so the weaker version cannot come back |
| 6 | Payment capture stated honestly | `docs/strategy/VENUE_RENEWAL_AND_LAPSE_RUNBOOK.md` §"What is automatic, and what is not" states plainly that invoicing, payment capture, sends and dunning are **not built**. The module header says the same |
| 7 | No claim of legal, accounting or Revenue approval | `venue-money.ts` header states the accountable-person question is unconfirmed and the Revenue submission unfiled. Test: "no surface built here claims a confirmed VAT position" |
| 8 | D-022 linked, not reimplemented | `lapseConsequences().invariantEnforcedBy` names `venue-lifecycle.ts`. The pure test exercises `accessAfterSponsorshipEvent` from that module rather than a local copy |
| 9 | Evidence is what was run | §1 above |

**Gross is the only input.** `vatInclusive()` accepts a gross figure and derives
net as `round(gross × 10000 ÷ (10000 + rate))`, with VAT as the remainder, so
`net + vat === gross` exactly for every input. There is no constructor that
accepts a net amount. Tests: "gross is the input and net is derived, never the
other way round", "net plus VAT equals gross exactly, for every amount and
rate", "no code path reconstructs gross from net".

**The undetermined VAT rate is null, never zero.** Null means the treatment has
not been determined; zero would mean determined to be zero-rated, which is a
claim nobody is entitled to make before the Revenue reply (R-014, R-018, R-022).
Test: "an undetermined VAT treatment records null, not zero", and at the
database level "records the VAT treatment as undetermined rather than as zero".

---

## 3. E08.02 — criterion to proof

| # | Criterion | Proof |
|---|---|---|
| 1 | The locked rate cannot be lowered or raised while the agreement renews | **`planChangeRefusal()`, added this session.** Test: "refuses to renew a held founding lock onto the standard plan" — a EUR 1,500 standard term is offered for a venue holding 01/25, refused, and nothing is written. Mutation-proven |
| 2 | Number assigned only on cleared payment, unique in the database, never reused | `founding-numbers.ts` with the partial UNIQUE index `sponsors_founding_number_idx`. `foundingNumberOnLapse()` returns `keep` / `placeReturnsToPool: false` |
| 3 | The assignment path is actually called by whatever records payment | `recordAnnualPrepayment()` calls `assignFoundingNumber()` after the term transaction commits. Test asserts `foundingNumber.label === "01/25"`. **This is the gap the checkpoint left open** |
| 4 | Historical price survives a renewal | Test: "survives a price change, per term" — three terms, the third written at a hypothetical future EUR 1,800, and `priceAgreementHistory` returns `[100000, 100000, 180000]`. The venue that joined at EUR 1,000 still reads EUR 1,000 |
| 5 | Immutability is a property of the database | `RAISE(ABORT)` triggers on UPDATE and DELETE. Test: "cannot be rewritten or deleted". The migration **probes** them with a real write, rolled back, rather than checking `sqlite_master` and assuming |
| 6 | Reversal withdraws the number with date and reason | `withdrawFoundingNumber()` in `founding-numbers.ts`, audit-writing |
| 7 | Unlimited representable, no seat count on the record | `allotment_mode` column; `sponsor_price_agreements` carries no seat or allotment column at all |
| 8 | No permanence wording | `check-venue-edition-contract.mjs` `permanencePatterns` forbids "for life", "forever", "in perpetuity", "lifetime" across the commercial sources. The runbook and both modules use "renews continuously" |
| 9 | Two venues cannot hold the same number, at index level | `founding-numbers.test.ts`: "the database refuses a duplicate number outright" |
| 10 | The queried schema and the executed DDL agree | **`scripts/venue-billing-ddl.test.mjs`, added this session.** Mutation-proven |

### The seam left open on purpose

`foundingRateOnReturn()` returns `{ settled: false, question, whatIsSettled }`.
D-009 point 3 says the lock holds while the agreement renews continuously
without lapse. It does not say what a returning venue is offered, so nothing
here decides it. `planChangeRefusal()` refuses that case rather than guessing,
with a message naming the open question. Test: "a lapsed founding venue's return
is refused and points at the open question".

---

## 4. E08.03 — criterion to proof

| # | Criterion | Proof |
|---|---|---|
| 1 | Renewal date derived, not calculated | `deriveVenueBillingState()`. Test: "the renewal date is derived, never calculated by hand" |
| 2 | Grace and lapse are named states with boundaries | Seven states. Test: "walks current, renewal due, grace, lapsed at the right boundaries" asserts the exact instants, including that the instant the term ends is **grace**, not lapse |
| 3 | A lapse cannot be declared by hand | `recordVenueLapse()` refuses when the derived state is not `lapsed`. Test: "refuses to declare a lapse the term does not support" |
| 4 | **A lapse moves no couple's access** | Test: "does not shorten one couple's access, and does not take the founding number" — a sponsored entitlement is inserted with an expiry 900 days past term end, the venue lapses, and the test asserts `expires_at` is **unchanged** and `status` is still `active`. The audit line records `entitlementsTouched: 0` |
| 5 | Branding removal is a checkable value | `BRANDING_REMOVAL_DEADLINE_MS` = 24h; `lapseConsequences().brandingRemovalDeadlineHours === 24` |
| 6 | A lapsed founding venue keeps its number, place shows closed | Test asserts `foundingNumberKept === "01/25"` after the lapse and the sponsor row's number is unchanged |
| 7 | No copy implies a couple can lose access | Runbook states it explicitly. The lapse writer does not touch `entitlements` at all, so it cannot become true by accident |
| 8 | Unratified timings cannot reach a venue | `VENUE_RENEWAL_POLICY.ratified === false`; `renewalPolicyPublicationRefusal()` returns a refusal naming agreements, order forms, renewal emails and the portal. Test: "the renewal timings are marked unratified and may not reach a venue" |
| 9 | What is not built is stated as not built | Runbook §"What is automatic, and what is not" — a table with ten rows, five of them **Not built** |

### What is honestly not built

Stated here so no reader has to infer it.

- **No invoice system.** None exists in either repository.
- **No payment provider for venues.** `app/src/server/stripe.ts` covers
  workspace, studio, wedding and event tiers. There is no venue price id, so no
  venue payment reaches the webhook.
- **No sender.** `renewal-upcoming.tsx` and `payment-failed.tsx` are finished,
  registered and render-tested. Studio has no email sender at all.
- **No dunning, no automated grace transition.** State is derived on read.

The runbook is how the manual process is run. It is not a description of
automation that exists.

---

## 5. Findings reported rather than fixed

**Baseline drift, and it is not small.** `drizzle-entitlements/0000_init.sql`
contains **zero** occurrences of `founding_number`, `allotment_mode`,
`annual_wedding_count`, `fair_use_ceiling` or `sponsor_price_agreements`. A
database built from the checked-in baseline cannot run the founding-number code
or the billing code at all. The columns exist only because
`scripts/migrate-venue-edition-terms.mjs` and `scripts/migrate-venue-billing.mjs`
are run by hand. This is a data-integrity finding that also touches E08.09, and
it is reported rather than patched because rewriting a checked-in drizzle
baseline is not a change to make quietly inside a billing task.

**The migration has not been applied to production.** This worktree has no
entitlements credentials, and applying a migration to the production database is
not an action to take on inference. `node scripts/migrate-venue-billing.mjs
--dry-run` fails closed with a clear message and exit 1. Until it is applied,
`sponsor_price_agreements` does not exist in production and
`recordAnnualPrepayment` will fail there.

**`venuePriceCopyRefusal()` has no production caller.** It is a working copy
guard exercised by tests, and nothing on a venue-facing surface calls it yet.
Wiring it into the string check (E09.10) is the obvious home and is not this
task.

---

## 6. Files

**Studio worktree `_wt-wp07s`:**

- `src/lib/venue-money.ts` · `src/lib/venue-money.test.ts`
- `src/lib/venue-billing.ts` · `src/lib/venue-billing.test.ts`
- `src/lib/entitlements-db/venue-billing.ts` · `.test.ts`
- `src/lib/entitlements-db/schema.ts` (`sponsorPriceAgreements`)
- `scripts/venue-billing-ddl.mjs` · `scripts/venue-billing-ddl.test.mjs`
- `scripts/migrate-venue-billing.mjs` · `scripts/migrate-venue-billing.test.mjs`
- `scripts/mark-venue-paid.ts`
- `scripts/check-venue-edition-contract.mjs`
- `docs/strategy/VENUE_RENEWAL_AND_LAPSE_RUNBOOK.md`
- `package.json` (test script)

**Programme docs:** `tasks/E08.01.md`, `tasks/E08.02.md`, `tasks/E08.03.md`.
