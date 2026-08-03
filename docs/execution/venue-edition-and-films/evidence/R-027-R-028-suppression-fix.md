# R-027 and R-028 — the suppression fix

- **Date:** 2026-08-03
- **Work package:** WP-07 (engineering)
- **Worktree:** `C:/Users/ethan/signal-studio-workspace/_wt-wp07s` (branch `claude/wp07-engineering-studio`)
- **Status:** implemented and verified in the worktree. **Not approved.** No task
  is Done without founder sign-off.

Two verified privacy defects in shipped code. Both are closed. This document
records what the code did before, what it does now, the exact tests that hold it
there, every call site rerouted, and the two things it deliberately did not do.

---

## 1. R-027 — the suppression floor guarded the population and left the count naked

### Before

`presentBehavioural(value, eligibleWorkspaces)` tested the population and nothing
else. Once a venue had three or more sponsored workspaces, the count itself was
published unconditionally.

Run against the shipped code before the change:

```
presentBehavioural(1, 40)  = {"state":"value","value":1}
presentBehavioural(39, 40) = {"state":"value","value":39}
presentBehavioural(40, 40) = {"state":"value","value":40}
```

A venue knows exactly which couples it invited. "1 of 40" is a statement about
one identifiable couple's private use of the product. "39 of 40" names the one
who did not.

**The defect was wider than the register recorded.** `presentBehavioural` has no
production caller. The live venue-facing path is
`live/project-venue-usage.ts` → `instrumentation/daily-metrics.ts`, which
reimplemented the same one-sided shape in `present()` — and two of its paths, the
closed-historical lower bounds in `activeRecently` and `productReach`, tested no
threshold at all. Fixing only `suppression.ts` would have been cosmetic.

### After

The floor is two-sided and lives in one place. A count is withheld when the
population is too small, when the count is below the floor, or when the
complement is.

```
presentBehavioural(1, 40)  = {"state":"withheld"}
presentBehavioural(2, 40)  = {"state":"withheld"}
presentBehavioural(20, 40) = {"state":"value","value":20}
presentBehavioural(38, 40) = {"state":"withheld"}
presentBehavioural(39, 40) = {"state":"withheld"}
presentBehavioural(40, 40) = {"state":"withheld"}
presentBehavioural(0, 10)  = {"state":"withheld"}
```

The rule is `isSmallCell(value, population)` in
`src/lib/account/instrumentation/suppression.ts`. `daily-metrics.ts` now imports
it and holds no threshold of its own.

**The withheld state cannot be read backwards.** It carries one key, `state`, and
nothing distinguishes "too low" from "too high". Nothing renders "fewer than 3".
Publishing the two-sided rule is safer than publishing the one-sided one: under
the old rule a "Withheld" against 40 workspaces meant "under 3"; under this one it
means "under 3 or over 37", which is the ambiguity the floor exists to create.

### Three consequences, stated plainly

1. **A measured zero is now withheld.** The previous test asserted "a real zero is
   still reportable once the cohort is large enough". Under a two-sided rule that
   is wrong: "0 of 40" tells the venue that each of forty identifiable couples did
   nothing. The test was replaced, not deleted, and the replacement says why.
   `assertNoZeroForAbsent` still guards the separate mistake of an *absent* value
   dressed up as a zero.
2. **A young venue account will show more "Withheld" than it used to.** Until a
   venue has roughly six active workspaces, most behavioural counts sit inside one
   edge or the other. That is the correct behaviour and it is a product fact worth
   knowing before the Venue Portal copy is signed off.
3. **Day counts keep the population floor and drop the complement rule.** Days are
   not people. `presentWindowMetric` and `presentDays` exist for that, and
   `daysWithSponsoredUse` uses them. Applying a subject-level rule to a calendar
   would suppress honest reporting for no privacy gain.

---

## 2. R-028 — the rate threshold had never run in production

### Before

`presentRate()` was referenced only by its own test. The only rate that reached a
screen was built in the interface: `report-preview.tsx` took
`continuedAfter30Days`, pulled the denominator back out of it, wrapped that
denominator in a fresh metric, and handed both to `metricRateLabel(numerator,
denominator)` in `src/lib/account/format.ts`, which divided them.

`metricRateLabel` accepted any two metrics from anywhere and applied no floor at
all. Run against the shipped code before the change:

```
metricRateLabel(exact 1, exact 40) = 3%
metricRateLabel(exact 1, exact 2)  = 50%
metricRateLabel(exact 4, exact 4)  = 100%
```

A cohort of two rendered as "50%".

### After

The threshold is a property of the value.

- **`RateValue`** (`src/lib/account/types.ts`) carries `numerator` and
  `denominator` together, or it is `withheld`, or it is `unavailable`. There is no
  `exact` variant and no bare `value` field for anything to pick up and divide.
- **`presentRate(numerator, denominator, absentReason)`** in `suppression.ts` is
  the only constructor. It applies the five-workspace floor ratified in D-011,
  refuses a zero or negative denominator, and refuses a numerator its denominator
  cannot contain.
- **`metricRateLabel` is deleted.** `formatRateValue(rate: RateValue)` replaces it.
  It takes one argument. There is no longer a function in the codebase that can
  divide metric A by metric B.
- **The type closes the hole, not a convention.** The published variant carries a
  `unique symbol` brand declared in `types.ts` and never exported. Only
  `presentRate` can apply it. Verified directly:

  ```
  const forged: RateValue = { state: "rate", numerator: 1, denominator: 40 };
  → error TS2322: Property '[RATE_VALUE_BRAND]' is missing
  ```

```
presentRate(2, 4)  = {"state":"withheld","reason":"small_group"}
presentRate(2, 5)  = {"state":"rate","numerator":2,"denominator":5}
presentRate(9, 12) = {"state":"rate","numerator":9,"denominator":12}
formatRateValue(presentRate(9, 12)) = "75%"
formatRateValue(presentRate(2, 4))  = "Withheld"
```

`RetentionResult` in `retention.ts` was a second, parallel rate shape with its own
floor. It is now an alias of `RateValue` and goes through the same constructor.
Two rate types is how one of them ends up without a floor.

---

## 3. Every call site rerouted

Repo-relative to `studio/`.

### The rule and the type

| File | Change |
|---|---|
| `src/lib/account/instrumentation/suppression.ts` | Two-sided `isSmallCell`; `presentBehavioural` now applies it; new `presentWindowMetric` for day-unit counts; `presentRate` returns `RateValue` and is the only rate constructor |
| `src/lib/account/types.ts` | New `RateValue` with an unexported `unique symbol` brand; `AdoptionLifecycle.continuedAfter30Days` retyped from `MetricValue` to `RateValue` |

### The projector

| File | Change |
|---|---|
| `src/lib/account/instrumentation/daily-metrics.ts` | `present()` split into `presentWorkspaces` (two-sided) and `presentDays` (population floor only); new `lowerBoundWorkspaces` closes the two closed-historical paths that tested nothing; `continuedAfter30Days` returns `RateValue` via `presentRate`; the hard-coded `sealed.length < 5` is gone |
| `src/lib/account/instrumentation/retention.ts` | `RetentionResult` is now `RateValue`; `computeRetention` goes through `presentRate`; a withheld result no longer carries the size of the cohort it withheld |
| `src/lib/account/live/project-venue-access.ts` | `continuedAfter30Days` returns the rate-typed unavailable variant |

### The renderers and exports

| File | Change |
|---|---|
| `src/lib/account/format.ts` | `metricRateLabel` **deleted**; `formatRateValue`, `formatRateAccessibleLabel`, `rateNumericOrNull` added |
| `src/lib/account/csv.ts` | New `rateFields`/`rateRow`; the continuation row exports `value_state=rate` with both numbers, or blanks with a reason |
| `src/lib/account/pdf-html.ts` | Continuation rendered by `formatRateValue`, not folded into the count grid |
| `src/lib/account/privacy.ts` | New `assertRateHasNoHiddenValue` and `walkRateValues`, wired into `assertSnapshotPrivacy`, so a withheld rate cannot smuggle its numbers out |
| `src/lib/account/fixtures.ts` | Fixtures build rates through `presentRate`; a fixture can no longer hand-write a rate that breaks the floor |

### The interface

| File | Change |
|---|---|
| `src/app/hq/account-review/components/metric.tsx` | New `RateMetric` component. No prop accepts a denominator from elsewhere |
| `src/app/hq/account-review/components/report-preview.tsx` | **The R-028 call site.** The hand-assembled percentage is gone; uses `formatRateValue` and `RateMetric` |
| `src/app/hq/account-review/panels/usage-panel.tsx` | 30-day continuation uses `RateMetric`; the lifecycle chart plots the two counts and leaves the rate a rate |
| `src/app/hq/account-review/concepts/access-ledger.tsx` | Continuation moved out of the count list |
| `src/app/hq/account-review/concepts/account-brief.tsx` | Same |
| `src/app/hq/account-review/concepts/guided-review.tsx` | Same |
| `src/app/hq/account-review/panels/edition-proof.tsx` | Same |

### Copy and documentation that described the old rule

| File | Change |
|---|---|
| `src/lib/account/fixtures.ts` (`privacyReceipt.withheldRule`) | "withheld below three eligible sponsored workspaces" became "withheld when the group is too small to describe, and when a value would leave too few workspaces undescribed" |
| `docs/venue-portal/PRIVACY_AND_RETENTION.md` | Two-sided floor and the single-rate-value rule written into the small-group section, with R-027 and R-028 named |
| `docs/venue-portal/METRIC_DICTIONARY.md` | Three suppression cells corrected |
| `docs/venue-portal/README.md` | Two-sided floor stated |
| `private/account-samples/*.csv`, `*.pdf` | Regenerated. `adoption.continued_after_30_days` moves from `exact,9,12` to `rate,9,12` |

---

## 4. The tests that now cover it

All in `src/lib/account/instrumentation/suppression.test.ts` unless noted.

**R-027**

- `R-027: a count of one in a population of forty is withheld`
- `R-027: the complement is withheld too`
- `R-027: the floor is two-sided at every population size` (0, 1, 2 and their
  complements across populations 3, 6, 10, 40, 250)
- `R-027: a count clear of both edges is published`
- `R-027: the withheld state cannot tell you which edge it hit`
- `the small-cell test refuses an impossible input`
- `a zero is withheld like any other small cell`
- `a day count keeps the population floor and drops the complement rule`

In `daily-metrics.test.ts`, covering the paths a venue actually reaches:

- `R-027: two active workspaces in a cohort of ten are withheld`
- `R-027: nine active workspaces in a cohort of ten are withheld too`
- `R-027: a closed historical lower bound runs the same two-sided test`
- `R-027: a single first useful action in a cohort of ten is withheld`
- `R-027: a product reached by two workspaces out of ten is withheld`
- `R-027: a historical product lower bound runs the two-sided test`

**R-028**

- `a rate is withheld below five eligible workspaces`
- `R-028: a rate carries its numerator and denominator as one value`
- `R-028: a rate cannot be constructed from two loose metrics` (a
  `@ts-expect-error`, so removing the brand fails the typecheck rather than
  passing silently)
- `R-028: a withheld rate carries no numbers at all`
- `a rate with no cohort is unavailable, never zero`
- `a rate refuses a numerator its denominator cannot contain`
- `R-028: only the rate formatter may turn numbers into a percentage` (scans
  `src/lib/account/**` and `src/app/hq/account-review/**`)
- `R-028: only the projector may assert a value into the rate type`
- In `daily-metrics.test.ts`: `R-028: continuation is a rate type, so it cannot be
  read as a count`
- In `retention.test.ts`: `R-028: retention returns the one shared rate type,
  floor included`

---

## 5. Verification, with real results

Run in `_wt-wp07s` on 2026-08-03.

**Baseline before any change** — `npx tsc --noEmit` exit 0; the account suite
`ℹ pass 51 / ℹ fail 0`.

**The tests fail on the old behaviour.** Two mutation runs, both reverted.

1. Two-sided test removed from `presentBehavioural` (the shipped one-sided code
   restored verbatim): `ℹ pass 16 / ℹ fail 6`. The six failures are
   `R-027: a count of one in a population of forty is withheld`,
   `R-027: the complement is withheld too`,
   `R-027: the floor is two-sided at every population size`,
   `R-027: the withheld state cannot tell you which edge it hit`,
   `the small-cell test refuses an impossible input`,
   `a zero is withheld like any other small cell`.
2. `isSmallCell` forced to `return false` and `daily-metrics.test.ts` run:
   `ℹ pass 19 / ℹ fail 6` — the six projector-level R-027 tests.

**The source-contract test bites.** A throwaway file containing
`Math.round((a / b) * 100)` was written to `src/lib/account/` and the test failed,
naming it. File removed.

**After the change**

| Check | Command | Result |
|---|---|---|
| Full typecheck | `npx tsc --noEmit` | **exit 0, no output** |
| Full studio suite | `npm test` | **exit 0** · `16 pass / 0 fail`, `411 pass / 0 fail`, `38 pass / 0 fail` |
| Account suite alone | `npx tsx --test src/lib/account/**` (9 files) | `103 pass / 0 fail` |
| Lint, changed areas | `npx eslint src/lib/account src/app/hq/account-review` | 1 error, **pre-existing and untouched**: `account-review.tsx:86` `react-hooks/set-state-in-effect`. `git diff --stat` on that file is empty |
| Samples regenerated | `npm run account:samples` | 4 CSV + 4 PDF written |

The full typecheck passes. Nothing is broken elsewhere.

---

## 6. What this deliberately did not do

Two items, both needing a founder call rather than an engineering judgement.

**A rate of 0% or 100% is still published.** The two-sided rule was applied to
behavioural counts, which is what R-027's mitigation states. It was **not** applied
to a rate's numerator, because doing so would make D-011's ratified five-workspace
floor unreachable: at a denominator of five, no numerator satisfies both a
three-floor and a three-complement, so every rate at the ratified minimum would be
withheld. Changing a ratified threshold is change control, not a build decision.

The residual exposure is real and worth one sentence of founder attention: "5 of 5
continued" tells a venue the status of every one of five identifiable couples. The
narrow fix is to withhold only the saturated ends (numerator 0 or numerator equal
to denominator), which costs almost no statistical utility. It is a one-line change
in `presentRate`. **Recommendation: approve the saturation rule.** Recorded here
rather than applied.

**R-029 is untouched.** The attribution unit is still incoherent — the definitions
count workspaces while the join runs `redemptions.user_clerk_id`, a subject. A
suppression floor computed against the wrong population is a floor with the wrong
denominator. R-027 and R-028 are closed on their own terms; R-029 remains open and
is a separate piece of work.

---

## 7. Register updates recommended

- **R-027** — mitigation implemented in full, plus the two unguarded
  closed-historical paths the register did not record. Recommend status
  `mitigated, pending founder review`, not closed, until the founder reviews the
  three consequences in section 1.
- **R-028** — mitigation implemented in full: projector-emitted rate variant,
  numerator and denominator carried together, formatter capability removed at the
  type level. Recommend the same status, with the section 6 saturation question
  attached.
