# R-015 — Access term correctness · evidence

**Task:** R-015 · **Date:** 2026-08-03 · **Executor:** claude_code
**Repository:** `app` · **Branch:** `claude/wp15-term-correctness` (worktree
`_wt-wp15`, stacked on the approved-but-unmerged `claude/wp07-engineering`)
**Spec:** `tasks/R-015.md`

This record states what was verified, what was not, and what remains open. Every
command below was run in the worktree and its real output is reproduced.

**Read section 4 first if you read nothing else.** It corrects the earlier
account of the wedding-date gap, which was incomplete in a way that mattered.

---

## 1 · The defect, quoted from source before the change

`app/src/server/actions/comp.ts`, inside `redeemCompCodeImpl` — the function a
real sponsored couple runs when they redeem a real code:

```ts
const expiresAt = new Date(
  Date.now() + row.durationDays * 24 * 60 * 60 * 1000,
);
```

A flat multiply. D-022 ratified `max(redemption + 548 days, wedding date + 90
days)` on 2026-08-03. The correct implementation existed at
`studio/src/lib/venue-edition.ts:100-121`, in a repository that does not run
this path.

**The hardened studio writer had no production caller.** Verified directly:

```
$ cd studio && grep -rn "redeemLicenseCode\|setCoupleWeddingDate" src scripts
src/lib/entitlements-db/codes.test.ts   (16 matches, all tests)
src/lib/entitlements-db/codes.ts        (definitions + 3 doc references)
src/lib/entitlements-db/index.ts:101    (one re-export)
```

No `src/app/**` caller, no `scripts/**` caller. Same shape as R-028: a correct
implementation reachable only from its own test.

**The arithmetic, made concrete.** A couple signs in March 2027 for a
15 September 2028 wedding and redeems the day they sign:

| | Date |
|---|---|
| Redemption | 2027-03-01 |
| Flat 548 days (what shipped) | 2028-08-30 |
| Wedding day | 2028-09-15 |
| Ratified term (`wedding + 90`) | 2028-12-14 |

The shipped term ended **16 days before the wedding**, and the ratified term is
**106 days later** than the shipped one. Both numbers are asserted in
`src/lib/venue-access-term.test.ts` so they cannot become a claim in a comment.

---

## 2 · What changed

| File | Change |
|---|---|
| `src/lib/venue-access-term.ts` | **New.** The pure D-022 rule, ported from `studio/src/lib/venue-edition.ts`. Port-versus-share decision argued in the module header. |
| `src/server/db/couple-access-term.ts` | **New.** The single decision point for a comp redemption's expiry, the wedding-date lookup, and the extend-only writer. |
| `src/lib/comp-notes.ts` | **New, and not in the original brief.** See section 8.5: the redemption card was rendering machine metadata to the couple. |
| `src/server/actions/comp.ts` | The flat multiply is replaced by `compRedemptionExpiresAtMs`. The sponsor lookup is hoisted so it serves both the term and the template. Both `notes` paths now pass through `coupleVisibleCompNotes`. |
| `src/server/actions/planning.ts` | Both `wedding_season` write paths call `applyWeddingDateToCoupleAccess`, which recomputes the couple's term. |
| `src/app/sign-up/[[...sign-up]]/page.tsx` | Flat-year string replaced. |
| `src/components/settings/plan/plan-view.tsx` | Two flat-year strings replaced. |
| `src/components/redeem/redeem-result-card.tsx` | Removed a reachable `"for life"` fallback (banned by D-009 point 3). |
| `src/lib/venue-access-term.test.ts` | **New**, 26 tests, including a CI guard over all three couple-facing surfaces. |
| `src/server/db/couple-access-term.test.ts` | **New**, 22 tests. |
| `src/lib/comp-notes.test.ts` | **New**, 5 tests. |
| `package.json` | All three new test files registered in the `test` script. |

The redeem path now reads:

```ts
const venueSponsor = row.tier === "wedding" ? await lookupSponsorByCode(code) : null;
const expiresAt = new Date(
  compRedemptionExpiresAtMs({
    venueEdition: venueSponsor != null,
    durationDays: row.durationDays,
    redeemedAtMs: Date.now(),
    weddingDateMs: venueSponsor
      ? await weddingDateMsForWorkspace(db, ws)
      : null,
  }),
);
```

`lookupSponsorByCode` returns non-null exactly when the comp code's notes carry
`source_type: "venue_edition"` (`src/server/db/venue-welcome.ts:152-158`), so
`venueEdition` is the same predicate the sponsor banner already used. Non-Venue
Edition comp codes — the `.edu` student code and ordinary gifts — keep the flat
duration they have always had, and that is asserted.

---

## 3 · Port, not share, and why

`app` and `studio` are separate git repositories with separate Vercel projects
and separate build roots. Nothing under `studio/` exists on disk when `app`
builds, so an import is not available. The only sharing mechanism that works
between them today is a published npm package (`ds-foundation` is the one
precedent), and standing one up for a single arithmetic rule twenty-nine days
before release buys a release-blocking dependency instead of a fix. The existing
precedent for this exact situation is
`src/server/invitation-code-security.test.ts`, which holds the comp-code
alphabet identical across the two repositories by assertion rather than import.

**Two independent implementations that can drift is the thing to avoid, so the
drift is tested rather than trusted.** When a studio checkout sits beside the app
checkout, `venue-access-term.test.ts` imports
`studio/src/lib/venue-edition.ts` and runs **both** implementations over the
same case matrix, asserting identical answers. On this run:

```
▶ parity with studio/src/lib/venue-edition.ts
  ✔ answers identically on every case, or says why it could not check (12.6191ms)
  ℹ differential parity checked over 792 cases
```

The matrix is 3 redemption instants × 11 date inputs (valid, invalid, rolled
over, epoch, NaN, null) × 6 minted durations × 4 current-expiry states, plus the
two exported constants and `coupleAccessDurationDays`.

**Honest limitation.** In CI the studio checkout is absent and the differential
block prints a skip diagnostic naming the path it looked for and how to point it
elsewhere (`STUDIO_REPO_PATH`). It does not silently pass. The behaviour is
still pinned in CI by explicit vectors, so CI is weaker than a workstation on
drift detection only, not on correctness. A single published package would close
that gap and is recommended after 1 September.

---

## 4 · The wedding date, stated plainly — corrected

The rule needs a wedding date. **On the sponsored path the product does not
supply one at all.** An earlier draft of this record named one reason. There are
three, and the second is the one that matters most. All three are verified in
source.

### 4.1 The capture exists but is flag-gated off in production

- The date has a column: `workspaces.primary_date`
  (`src/server/db/schema.ts:308`).
- It has a capture UI, `required` on the wedding path:
  `src/components/welcome/contextual-onboarding.tsx:383`.
- That flow is gated by the `contextualOnboarding` flag, whose default is
  `NODE_ENV !== "production"` (`src/lib/planning/flags.ts:33`).

Whether `SIGNAL_CONTEXTUAL_ONBOARDING_ENABLED` is set in the production
environment could not be checked from this worktree: it contains no `.env`
files, and reading the deployment environment was out of scope. The code default
is off.

### 4.2 A sponsored couple is routed around that screen anyway

This is the larger finding and it was missed the first time.

Venue Edition redemption deliberately skips onboarding.
`redeemCompCodeImpl` applies the wedding template inline, and
`src/components/redeem/redeem-result-card.tsx:60-66` reads:

```ts
// Venue-edition success: deep-link past /welcome direct to the
// board with the sponsor banner.
const href = result.sponsorSlug
  ? `/app/tasks?welcome=venue&v=${encodeURIComponent(result.sponsorSlug)}`
  : "/welcome";
```

Only a **non-sponsored** redemption falls through to `/welcome`. So the one
screen that asks for the wedding date is the one screen the sponsored couple
never sees. Turning the flag on in 4.1 would not, on its own, capture a single
sponsored couple's wedding date.

### 4.3 There is no postponement path to recompute from

`workspaces.primaryDate` is written at workspace creation only, in
`bulkCreateWorkspacesAction` and `completeContextualOnboardingAction`, and
copied unchanged by workspace duplication (`planning.ts:1097`). Searching `src`
for any action that updates it afterwards returns nothing. D-022 point 3's
postponement case is implemented and tested at both the rule and the database
level, but **the product has no UI that can trigger it today**. A couple who
postpones does not get an extension. They also do not get a shortening.

### 4.4 What that means, without softening it

1. Every sponsored couple redeeming today gets
   `redemption + max(548, mintedDurationDays)` days. That is **identical to what
   shipped before this change**. No couple is worse off in any input case, and
   that is asserted directly ("never returns less than 548 days, whatever the
   wedding date says", "treats an unparseable wedding date as no wedding date,
   never as shorter").
2. The grace half of D-022 is implemented, tested and **inert on the sponsored
   path until a wedding date exists for that couple**.
3. A wedding date that arrives later does work, and that is proven at both
   levels. What is missing is a product surface that produces one.

An unparseable date is never treated as "today". `normaliseWeddingDateMs`
returns null for `""`, `"next June"`, `"15/09/2028"`, `"2028-9-15"`, an ISO
datetime, `NaN`, `Infinity`, and for rolled-over dates such as `2026-02-31`
(which `Date.parse` silently turns into 3 March). Null means the floor, and the
floor is never short.

### 4.5 The recommendation

**Ask for the wedding date on the redemption screen itself.** That is where the
couple already is, it is the one fact they certainly know, and it is what D-022
point 1 said ("capture the wedding date at redemption"). It is a contained
addition to a surface this task already touched. It was not built here because
adding a question to the sponsored redemption flow is a product decision
seventeen days before UI-freeze, not an engineering detail. See `tasks/R-015.md`
§ Decisions required, item 1.

---

## 5 · The term only ever moves later

`extendedCoupleAccessExpiryMs` is `Math.max(current, recomputed)` and there is
no branch anywhere in `couple-access-term.ts` that can write a smaller expiry.
Proven at both levels:

- Pure: postponement extends; an earlier correction changes nothing; clearing
  the date changes nothing; a null expiry stays null; and a **400-iteration
  randomised sequence of date edits** asserts the stored expiry is
  non-decreasing at every step.
- Database: the same, against a real in-memory libSQL instance built from the
  migration baseline, plus idempotency (second run writes nothing), isolation
  (another couple's row is untouched), and the long-minted-duration case (a
  900-day mint is not clawed back to 548 + 90).

The required case — **a wedding date arriving after redemption** — is proven
twice, once pure and once against the database:

```
▶ extendedCoupleAccessExpiryMs · the term only ever moves later
  ✔ A WEDDING DATE ARRIVING AFTER REDEMPTION extends the term
▶ extendCoupleAccessForWeddingDate · only ever later
  ✔ A WEDDING DATE ARRIVING AFTER REDEMPTION extends the stored term
```

The database write is additionally guarded on the expiry it was decided against,
so losing a race to a concurrent writer is a no-op rather than a shortening.

---

## 6 · Verification, with real output

All commands run in `C:/Users/ethan/signal-studio-workspace/_wt-wp15`.

### 6.1 Types

```
$ pnpm typecheck
$ tsc --noEmit --incremental false
TYPECHECK_EXIT=0
```

### 6.2 The rule, the copy guard and cross-repository parity

```
$ node --import tsx --test src/lib/venue-access-term.test.ts
  ℹ differential parity checked over 792 cases
ℹ tests 26
ℹ suites 8
ℹ pass 26
ℹ fail 0
```

### 6.3 The database seam and the source contract

```
$ node --import tsx --test src/server/db/couple-access-term.test.ts
ℹ tests 22
ℹ suites 6
ℹ pass 22
ℹ fail 0
```

### 6.4 The redemption card metadata filter

```
$ node --import tsx --test src/lib/comp-notes.test.ts
ℹ tests 5
ℹ suites 2
ℹ pass 5
ℹ fail 0
```

### 6.5 Full suite

Run three times in this session as the change grew. Every run exit 0.

```
$ pnpm test
TEST_EXIT=0
tests 1111 pass 1111 fail 0     (rule + db seam registered)
TEST_EXIT=0
tests 1116 pass 1116 fail 0     (+ comp-notes)
TEST_EXIT=0
tests 1119 pass 1119 fail 0     (+ the couple-facing copy guard)
```

**A pre-existing flake is carried forward, not fixed.** An earlier session on
this branch recorded one red run out of four in which
`src/server/premium-p1-integrity.test.ts` failed as a whole file with no failing
assertion inside it, and passed 20/20 in isolation and 81/81 on three
consecutive group re-runs. It did not recur in any of the three runs above. It is
attributed to concurrent test-runner load, it is unrelated to this change, and
it is **not** claimed to be fixed.

### 6.6 Registration in the suite

All three new files were added to `package.json`'s `test` script and were
**observed running inside `pnpm test`**, not merely present on disk:

```
$ grep -nE "R-015 SCENARIO|WEDDING DATE ARRIVING AFTER REDEMPTION|differential parity checked|drops the sponsor JSON|carries no flat-year" <pnpm test log>
666:  ✔ drops the sponsor JSON issue-codes.ts writes (1.2839ms)
774:  ✔ THE R-015 SCENARIO: signs March 2027, marries September 2028, redeems on the day
779:  ✔ A WEDDING DATE ARRIVING AFTER REDEMPTION extends the term
793:  ✔ carries no flat-year description of the term anywhere
799:  ℹ differential parity checked over 792 cases
821:  ✔ A WEDDING DATE ARRIVING AFTER REDEMPTION extends the stored term
```

This was checked because Wave 3 found three privacy tests that never ran in CI
because nobody registered them.

### 6.7 Production build

```
$ pnpm build
✓ Compiled successfully in 21.0s
BUILD_EXIT=0
```

### 6.8 Lint and voice

```
$ pnpm lint
✖ 75 problems (0 errors, 75 warnings)
LINT_EXIT=0
```

All 75 are pre-existing `no-unused-vars` and `react-hooks` warnings in other
files. Filtering the output to the files this change touches returns nothing.

```
$ node ~/.claude/skills/brand-voice/voice-check.mjs \
    "src/app/sign-up/[[...sign-up]]/page.tsx" \
    src/components/settings/plan/plan-view.tsx \
    src/components/redeem/redeem-result-card.tsx
voice-check · source: studio/BRAND.md · scanned 3 file(s)
✓ no mechanical voice violations.
```

The mechanical lint covers the HARD tier only. A SOFT-tier read against
`BRAND.md` §3 produced three changes, applied: `the wedding` → `your wedding`
for second-person consistency, `When the term ends` → `When access ends`
(`term` is contract register, not the way the 80% would say it), and the
sign-up bridge split into two declaratives instead of one 21-word sentence.

---

## 7 · Mutation proof: the tests fail on the defect

A test that passes before and after proves nothing. Each behaviour was reverted
to the shipped version and the suite re-run. Every mutation was restored and the
restoration re-verified.

### Mutation A — the flat multiply restored in `comp.ts`

```
=== MUTATION 1 - flat multiply restored in comp.ts (the shipped defect) ===
not ok 5 - source contract: src/server/actions/comp.ts
  error: '2 subtests failed'
ℹ tests 22
ℹ pass 20
ℹ fail 2
```

### Mutation B — the grace rule removed from `venue-access-term.ts`

```
=== MUTATION 2 - grace rule deleted from venue-access-term.ts ===
not ok 3 - coupleAccessExpiryMs · the grace rule
not ok 4 - extendedCoupleAccessExpiryMs · the term only ever moves later
not ok 5 - the flat multiply this replaces
not ok 7 - parity with studio/src/lib/venue-edition.ts
not ok 9 - compRedemptionExpiresAtMs · the decision the redeem path makes
not ok 11 - extendCoupleAccessForWeddingDate · only ever later
ℹ tests 45
ℹ pass 33
ℹ fail 12
```

The differential parity test is among them, which is the point: the mutant
diverges from studio and the test says so.

### Mutation C — `is covering your year` restored on the sign-up bridge

```
### MUTATION 3 - flat-year sign-up string restored
not ok 7 - couple-facing copy states the ratified term
# tests 26
# pass 24
# fail 2
```

### Mutation D — raw `row.notes` restored on the redeem result

```
### MUTATION 4 - raw comp notes back on the redeem card
not ok 2 - source contract: the redeem card filters before it renders
# tests 5
# pass 4
# fail 1
```

### Restoration verified

```
=== RESTORED - both files clean ===
ℹ tests 45 · ℹ pass 45 · ℹ fail 0

### restored
# tests 53 · # pass 53 · # fail 0
```

```
$ git diff --stat -- src/server/actions/comp.ts
 src/server/actions/comp.ts | 51 ++++++++++++++++++++++++++++++++++------
```

matching the pre-mutation state exactly.

---

## 8 · Couple-facing copy

Ratified wording (D-022): eighteen months, or three months past the wedding,
whichever is later. Brand voice applied: no em dashes, no exclamation marks,
sentence case, no banned permanence wording.

### 8.1 Sign-up bridge (`src/app/sign-up/[[...sign-up]]/page.tsx:53`)

- Before: `Almost there. {sponsor.name} is covering your year.`
- After: `Almost there. {sponsor.name} is covering it. Eighteen months, or three months past your wedding, whichever is later.`

### 8.2 Plan view, headline (`src/components/settings/plan/plan-view.tsx:76`)

- Before: `A year of Signal Studio, on {sponsorName}. Expires {date | "in a year"}.`
- After: `Signal Studio on {sponsorName}. Eighteen months from the day you redeemed, or three months past your wedding, whichever is later.` followed by ` Access ends {date}.` only when a date exists.

The `"in a year"` fallback is gone rather than reworded: it restated the defect
in prose and it fired exactly when the product did not know the answer.

### 8.3 Plan view, what happens next (`src/components/settings/plan/plan-view.tsx:81`)

- Before: `When the year is up, the workspace stays. Tasks, notes, and the timeline are yours, you'll just be moved to the Free tier, which has everything most couples need after the wedding's done.`
- After: `When access ends, the workspace stays. Tasks, notes and the timeline are yours. You move to the Free plan, which has everything most couples need once the wedding is done.`

### 8.4 The `"for life"` fallback (`src/components/redeem/redeem-result-card.tsx`)

The redeem success card rendered `You're on Wedding suite until for life.` when
the entitlement carried no expiry, reachable through the idempotent re-hit
branch of `redeemCompCodeImpl`. "For life" is banned outright by D-009 point 3
and D-021. The clause is now dropped rather than reworded, because the honest
answer when there is no end date is to say nothing about one.

### 8.5 Found during the work: the card was reading metadata to the couple

Not in the brief, and reported here so it can be approved or reverted on its own.

`RedeemResultCard` renders `result.notes` verbatim as a paragraph under the
headline. `comp.ts` populated that from `comp_codes.notes`, and on a Venue
Edition code `studio/scripts/issue-codes.ts:153-159` writes machine metadata
into that same column:

```ts
const compNotes = JSON.stringify({
  sponsor_slug: sponsor.slug,
  sponsor_name: sponsor.name,
  source_type: resolvedSource,
  studio_tier: resolvedTier,
  studio_duration_days: durationDays,
});
```

So the first screen a sponsored couple saw after redeeming carried a line of
JSON. The idempotent re-hit path was the same shape with the entitlement's own
note, `comp:<CODE>`.

Fixed by `src/lib/comp-notes.ts`: prose passes, anything that parses as JSON or
carries a known internal prefix is dropped and the card renders nothing rather
than something the couple has to ignore. Five tests, and a source contract that
fails if either call site goes back to the raw column (Mutation D above).

### 8.6 The wording is pinned, not just corrected

`COUPLE_ACCESS_TERM_SENTENCE` holds the ratified sentence next to the
arithmetic, with a test asserting it carries the term and no banned register.
Separately, a CI guard reads all three couple-facing source files and fails if
`covering your year`, `a year of signal studio`, `when the year is up`,
`for life`, `forever` or `in perpetuity` reappears, or if either surface that
states the rule stops stating all three of its parts. Mutation C proves the
guard bites.

---

## 9 · Founder questions

### 9.1 `studio/scripts/issue-codes.ts:121-129` — D-022 point 4, not done

Verified still present in the studio repository, unchanged:

```ts
if (resolvedSource === "venue_edition") {
  if (resolvedTier !== "wedding") {
    fail("venue_edition codes must use the wedding tier");
  }
  if (durationDays !== VENUE_EDITION_COUPLE_ACCESS_DAYS) {
    fail(
      `venue_edition codes must last ${VENUE_EDITION_COUPLE_ACCESS_DAYS} days (18 months)`,
    );
  }
}
```

D-022 point 4 ratified: accept a computed duration, refuse anything shorter than
548 days. **The helper already exists** at
`studio/src/lib/venue-edition.ts:180`, `venueEditionDurationRefusal`, and is
already used by `studio/src/lib/entitlements-db/codes.ts:158`. So the library
side of D-022 point 4 is done and only the script was missed. The exact change:

```ts
if (resolvedSource === "venue_edition") {
  if (resolvedTier !== "wedding") {
    fail("venue_edition codes must use the wedding tier");
  }
  const refusal = venueEditionDurationRefusal(durationDays);
  if (refusal) fail(refusal);
}
```

plus adding `venueEditionDurationRefusal` to that file's existing
`@/lib/venue-edition` import.

**Not made here.** This work package must not edit the `studio` repository. The
practical exposure is small: the redeem path now applies the grace rule whatever
the code was minted with, so this guard only blocks the optimisation of minting
a longer code when the venue already knows a long-lead date.

### 9.2 How a sponsored couple's wedding date gets captured at all

Three blockers, one answer needed. See section 4. The recommendation is to ask
for the date on the redemption screen. The alternative is to accept the 548-day
floor for Cohort 1 and record that acceptance rather than leave it implied.

### 9.3 Should the port become a shared package

Recommended after 1 September, not before. Today the differential test is the
lock and it does not run in CI.

### 9.4 The redemption card metadata fix

Approve or push back on section 8.5 on its own. It is separable from the rest of
this task.

---

## 10 · What this does not close

- **R-015 is materially reduced, not closed.** The half that said "the code
  computes the wrong term" is fixed and proven by mutation. The half that said
  "and no wedding date is stored on the entitlement" is answered structurally but
  not in practice: nothing on the sponsored path produces a date. Closing R-015
  needs 9.2.
- **D-022 point 3 is implemented but unreachable.** No product surface can change
  a wedding date, so a real postponement does not extend a real couple's term
  today. It also cannot shorten it.
- **D-022 point 4 is half done**, in the studio repository, and is 9.1.
- **No founder approval is claimed.** Tests passing, code existing and this
  document existing are none of the four things Done requires.
- The `premium-p1-integrity` flake in 6.5 is reported, not fixed.
