# E15 — consolidated release-readiness assessment

**Written:** 2026-08-04 by Claude Code (WP-22)
**Covers:** E15.01 to E15.18
**Release date:** 2026-09-01 · **28 days remaining**
**Status of this document:** an assessment from evidence. It is not a gate pass,
it is not founder approval, and nothing in it moves a task to Done.

---

## 1. What this work package did

E15 had eighteen tasks and **zero acceptance criteria** between them. It now has
147 written criteria, eighteen executable verification scripts, and a recorded
result for every step that could be run without money, a real venue or a real
couple.

Nothing was marked verified that was not run. Where a step was not run, the
document says so and why.

## 2. What was actually run, and what it returned

| Check | Command | Result |
|---|---|---|
| Studio release candidate | `pnpm test` in `_wt-integrate-studio` @ `64b3b91` | **PASS**, exit 0, **742 tests, 0 failures** |
| App release candidate | `pnpm test` in `_wt-integrate` @ `a78f3c3` | **PASS**, exit 0, **1,263 tests, 0 failures** |
| Venue copy check | inside studio `pnpm test` | **ok** — 16 rules, 92 patterns, 29 surfaces, 6 recorded exceptions. Cross-repo surfaces not covered. |
| Live venues page | `curl https://signalstudio.ie/venues` | **200**. `Founding 25` ×8, `€1,000` ×8, `€1,500` ×2 |
| Live legal pages | `curl` | `/privacy` **200**, `/terms` **200**, `/security` **200** |
| Live venue sub-pages | `curl` | `/venues/questions` **404**, `/venues/what-you-see` **404**, `/venues/privacy` **404**, `/venues/proposal` **404** |
| Production robots.txt | `curl https://app.signalstudio.ie/robots.txt` | **`/p` NOT disallowed** |
| Health endpoint | `curl .../api/health/digest` | **200** |
| Release gates | read from `PROJECT_STATE.json` | **all six `not_started`, 0 of 75 exit criteria met** |
| Keepsake callers | `grep` in `_wt-integrate` | **zero production callers** |
| Venue members | `grep` in `_wt-wp22` | `members: []` unconditional |
| Founding-number schema | operator todo | applied to production 2026-08-03, unique index live |

## 3. The seven things a go/no-go must name

### 1. The release candidates are green and production is behind them

Both integration branches pass everything. Production is missing the R-031
noindex fix and four of the five venue commercial sub-pages. **Green branches are
not a release, and this is the single most consequential gap in the assessment.**

### 2. `/p` still publishes wedding workspaces to search engines in production

The fix is correct, tested by four passing tests, and undeployed. A published
wedding workspace carries guests' and suppliers' names in task titles and tags.
This is one deploy from fixed.

### 3. R-015 is fixed in branch, and STATUS.md is stale about it

`STATUS.md` still says R-015 and R-016 are "INERT IN PRODUCTION until the
venue-edition terms migration is applied". **The migration was applied on
2026-08-03** and the operator todo is `status: done`. The real finding underneath
is different and worth more: the production column `entitlements.wedding_date` is
read by nothing, because the shipped code derives the date from
`workspaces.primary_date`. And the dirty `app` working tree holds a **second,
untracked implementation** of the same ratified rule.

### 4. There is no venue-authenticated route, and that is now the launch design

`members: []` is returned unconditionally. The HQ gate is one shared password
that also opens Today, Money, Company, Vault, Atlas, Decks, Founders Circle and
the Data Room. D-027 point 4 already narrows the launch to invitation
administration, and `evidence/E07.16-venue-identity-lab.md` recommends Option C.
E15.04 is written against Option C. **The password is never given to a venue.**

### 5. Keepsake is a promise with no product behind it

`src/lib/keepsake/lifecycle.ts` and `export.ts` exist, are tested, and have zero
production callers. No route, no surface, no button. No sponsored couple reaches
the end of term before 2028, so this is not urgent in calendar terms. **It is
urgent in promise terms**, because the Benefits Charter is signed in September
and a venue repeats what it says.

### 6. The Blob store has never taken a production write

Provisioned in the EU on 2026-08-04 per the founder. Not verified by me, and no
evidence in the repository verifies it either. Attachment upload is on the
couple's first-run path, so it is a product-gate item, and it is one upload to
settle.

### 7. No renewal falls due before 1 September, and that is arithmetic, not readiness

No venue has paid, so no term has started. The renewal worklist passes its tests
and **has never run against a real term. It will not before 2027.**

## 4. The pool arithmetic, said out loud

From `venue-universe/counts-only.md` and `05-COHORTS.md`:

- 219 venues researched, 70 inside the 45-minute ring, **50 inside the ring and
  eligible**.
- Cohort 1 fills to 25. **Cohort 2 comes up short. Cohorts 3 and 4 do not exist
  inside the ratified ring.**

**Twenty-five signed and paid venues out of 50 eligible accounts is a 50%
conversion rate on cold, founder-led outreach.** That is not hidden anywhere; it
has simply never been stated next to the target. M6 is a conversion question, not
a scheduling one.

## 5. Where the six gates stand

All six are `not_started`. Zero of 75 exit criteria are recorded as met.

| Gate | Position |
|---|---|
| Commercial | closest to ready. Ratified terms, green tests, the live `/venues` page correct. |
| Legal | cannot be satisfied as originally written. CR-001 rewrote it under D-016. E03 is 4/11 with one blocker on the gate. |
| Product | branch green, production behind. R-031 undeployed, Keepsake unwired, Blob unexercised. |
| Data, security and reliability | strongest evidence base. R-027 and R-028 closed in branch. R-028's fix verified. R-029, R-032, R-033 open. |
| Creative | **E13 4/18, E14 1/18, 28 days out.** The most likely reason 1 September slips. |
| Sales readiness | E10, E11, E12 nearly complete. **E15 is 0/18** and is a supporting epic on this gate. |

## 6. Recommendation, in the order I would take it

1. **Deploy the app integration branch.** It carries the R-031 noindex fix and
   the R-015 term fix together. Until it ships, a real couple redeeming gets a
   flat 548 days and a published page offered to crawlers.
2. **Deploy the studio venue sub-pages.** `/venues` is live and correct and every
   page it links to is a 404. That is hours of work and the most visible possible
   failure.
3. **Settle Keepsake before signature.** Build a minimum surface, or restate the
   promise in the charter and the agreement. Restating after twenty-five
   signatures is not available.
4. **Rehearse E15.02 and E15.03 against a rehearsal venue and a rehearsal
   couple.** R-024 is right that nothing certifies that what was sold can be
   delivered.
5. **File the Revenue MyEnquiries submission.** It is drafted, it is free, and
   R-018's irreversible half turns on it.
6. **Take the film decision explicitly.** E13 and E14 will not resolve themselves
   in 28 days by being left alone.
7. **Fix R-042** ("founding partner" on the deck presented at signing) and clear
   I-002 section C.
8. **Then** run the E15.01 review and take the go/no-go.

**My honest reading: conditional go on the commercial and sales track, no-go on
product until the app integration branch is deployed.** The commercial position
is ratified, live and internally consistent, which was the hard part. The product
gap is small in engineering terms and total in trust terms.

## 7. What no agent can do here

Twelve of the eighteen tasks require a real venue, real cleared money, or a real
couple. That is not a limitation to work around; it is the shape of the epic. The
specs and scripts are written so that when the founder does have those things,
every step is a command or a click with an expected result and a stop rule, and
nothing has to be worked out on the day.

## 8. Files written by this work package

Task specifications: `tasks/E15.01.md` through `tasks/E15.18.md`.

Evidence and verification scripts:

- `evidence/E15.01-launch-go-no-go.md`
- `evidence/E15.02-billing-and-founding-rate-test.md`
- `evidence/E15.03-invitation-and-redemption-test.md`
- `evidence/E15.04-venue-portal-and-reports-test.md`
- `evidence/E15.05-shared-timeline-and-keepsake-test.md`
- `evidence/E15.06-operational-readiness-confirmation.md`
- `evidence/E15.07-cohort-1-release.md`
- `evidence/E15.08-release-window-monitoring.md`
- `evidence/E15.09-signed-venue-handoff.md`
- `evidence/E15.10-venue-configuration-and-approval.md`
- `evidence/E15.11-venue-training-and-first-couple.md`
- `evidence/E15.12-venue-seven-and-thirty-day-reviews.md`
- `evidence/E15.13-founder-channel-and-request-intake.md`
- `evidence/E15.14-permissioned-evidence-and-referrals.md`
- `evidence/E15.15-cohorts-2-3-4-release.md`
- `evidence/E15.16-founding-place-counter.md`
- `evidence/E15.17-founding-offer-close.md`
- `evidence/E15.18-postmortem-and-operations-transfer.md`
- `evidence/E15-release-readiness-assessment.md` (this document)

No `project-control.mjs` write command was run. No task was transitioned, no
gate was passed, and no state was changed.
