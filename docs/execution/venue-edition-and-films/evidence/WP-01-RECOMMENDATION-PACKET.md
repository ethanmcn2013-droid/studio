# WP-01 — recommendation packet

**Package:** Access-term fix and lifecycle architecture
**Session:** `eed55e9e-wp01` · 2026-08-03
**Scope:** R-015, R-016, E04.01 through E04.12, plus the `venue-edition.ts`
handover from WP-10
**Contract:** D-024 — one packet, not thirteen reviews. Every item below is
answerable with **approve** or **push back**.

---

## The headline

**A couple who books eighteen months out can no longer lose Signal Studio
before their wedding.** That was true of the shipped code this morning and it is
not true now. It is fixed in both repositories, proved by tests against real
databases, and it is the thing in this packet that mattered most.

Twelve E04 tasks are at Founder Review. Nothing is marked Done. Nothing was
deployed, published, or pointed at a live page.

---

## 1. What was done

### R-015 — the couple access term (D-022)

The defect: `VENUE_EDITION_COUPLE_ACCESS_DAYS = 548` was a hard floor *and* a
hard ceiling. The mint threw on any other duration, no wedding date was stored
anywhere, and D-010's ratified grace rule was unmintable.

What shipped, all five points of D-022:

1. **The wedding date is captured** — and not by asking the couple twice. It is
   `workspaces.primary_date`, which the couple already owns and which the
   wedding onboarding flow already requires. A projection is written to
   `entitlements.wedding_date` in the shared store so the term can be evaluated
   without reaching into product content.
2. **Expiry is computed, not frozen**: `max(redemption + 548 days, wedding + 90
   days)`.
3. **Recompute on change, later only.** A postponement extends access
   automatically. A correction that would pull the date back leaves the expiry
   where it is.
4. **The mint guard is relaxed**: any duration at or above 548 days is accepted;
   anything below is refused. Null is refused too, because on the redeem path a
   null duration means *no expiry* — silently accepting it would hand out a
   perpetual wedding entitlement under an 18-month banner.
5. **No upper cap.** A couple booking three years out gets three years plus 90
   days.

**The part that matters most, and which the package brief did not anticipate:**
the production redemption write is not in `studio`. It is
`app/src/server/actions/comp.ts`, against the Tasks database. A studio-only fix
would have passed every test and changed nothing a couple would ever experience.
The fix is therefore in **both** repositories, with the rule duplicated
deliberately and a golden-vector file plus a parity check that fails the build if
the two copies drift apart.

### R-016 — "unlimited" made representable (D-020)

The live `/venues` page promises *no seats, no per-couple maths*. The shipped
system could not express that, and the number a venue actually got was the
onboarding form's `defaultValue={10}`. Nobody decided ten.

Four changes, all four required:

1. **An explicit `allotment_mode` column**, `limited` or `unlimited`. The mint's
   race-safe conditional bump now carries the mode test inside the same atomic
   statement, so an unlimited venue mints freely while a limited venue's cap
   stays as unbreakable as it was.
2. **Headroom suppressed, not zeroed**, in the venue-facing projection.
   `MetricValue` gained an `unlimited` variant, which made the TypeScript
   compiler find every consumer for me. The "No remaining allotment headroom"
   item is gone for these venues, and the next action is now *issue access for
   your next booked couple* rather than *allotment headroom is exhausted*.
3. **The HQ near-allotment list filters on the mode**, so an unlimited venue can
   never appear on a chase list about a cap it does not have.
4. **The onboarding default is gone.** The form now asks for the venue's own
   annual wedding count — D-020 point 4, collected after signature — and
   computes a fair-use ceiling from it. Crossing the ceiling **alerts Signal HQ
   and keeps issuing**. There is no refusal path in that code and it must never
   grow one.

**One deliberate design choice worth your attention.** I did *not* make
`code_allotment IS NULL` mean unlimited, even though two other places in the
codebase already use null that way. In the entitlements mint, null currently
means *not mint-eligible*. Reusing it would have silently converted every
existing null-cap sponsor into an unlimited one, and there is no way to check
from here how many of those exist in production. The explicit column backfills
every existing row to `limited`, so behaviour before and after the migration is
identical until a venue is deliberately switched. A test asserts exactly that.

### The `venue-edition.ts` handover from WP-10

Per `WAVE1_CORRECTION.md`, WP-01 took ownership of the file. Added:
`VENUE_EDITION_FOUNDING_ANNUAL_PRICE_EUR = 1_000`, VAT-inclusive per D-021, and
`venueEditionAnnualAmountCents("founding")` now returns it. Standard stays
€1,500; pilot stays null.

**No public surface changes.** I checked all eight importers.
`src/app/layout.tsx` and `src/app/weddings/page.tsx` read the standard price and
the access months, neither of which moved. `/redeem/[code]` reads the access
days, which did not move. Nothing to stop for.

### E04.01–E04.12

Audit-first per D-015 Q2. One architecture document,
`studio/docs/architecture/ADR-008-venue-edition-lifecycle.md`, covers all twelve
with a shipped/partial/absent verdict per claim and a file path behind each one.
Twelve task specifications with 56 acceptance criteria are recorded in project
state.

The engineering spine is `studio/src/lib/venue-lifecycle.ts` — the lifecycle as
executable code rather than prose, with thirteen deterministic fixtures on a
pinned clock.

**Its central claim: there are two axes, not one.** Access and sponsorship are
orthogonal, and no sponsorship transition may ever change the access state. That
is D-020 point 2 — the survival sentence you commit to in writing to every
founding venue — and it is now asserted across every state-and-event pair. A
future change that breaks the promise fails a test rather than reaching a venue.

---

## 2. What was verified, with the actual output

Full capture: `evidence/WP-01-verification.txt`.

| | studio | app |
|---|---|---|
| Typecheck | clean | clean |
| Contract checks | 7 ok | 7 ok |
| Tests | **412 pass, 0 fail** | **799 pass, 0 fail** |
| Build | exit 0 | exit 0 |

The tests that matter, all against **real SQLite engines**, not mocks:

```
--- migration (real temp SQLite) ---
✔ the migration adds every column and index, and is idempotent
✔ no existing venue silently becomes unlimited
✔ existing data survives untouched
✔ a dry run applies nothing
✔ the migration fails closed when the base tables are absent

--- entitlements writers (real temp SQLite) ---
✔ R-016: an unlimited venue mints past any cap, repeatedly
✔ D-020: crossing the fair-use ceiling alerts and still issues
✔ still refuses a limited venue with no headroom
✔ D-022: accepts a computed duration longer than the floor
✔ refuses anything shorter than the ratified 548 days
✔ R-015: a long-lead wedding survives to 90 days past the day
✔ extends on postponement
✔ never shortens when the date moves earlier
✔ writes an extend event that carries no wedding date
   ... 22 pass, 0 fail

--- app, sponsored access term (real migrated SQLite) ---
✔ R-015: redeeming with the wedding date already known outlasts the wedding
✔ a postponement extends further, without anyone asking
✔ bringing the wedding forward never shortens access
   ... 11 pass, 0 fail
```

**What is not verified, and I am not going to pretend otherwise.** The migration
has never been run against the production database. I have no credentials for it
and would not have used them. It is proved idempotent, fail-closed and
non-destructive against a real engine; applying it to production is your call and
needs an operator-todo.

### Two traps found the hard way, recorded so nobody pays twice

- **The migration-ledger instruction in the package brief points at nothing.**
  It says to follow "the migration ledger workflow in `studio/CLAUDE.md`". That
  section does not exist. The `--> statement-breakpoint` trap it describes is
  real but lives in the `app` runner, not studio. Studio's actual convention is
  hand-written idempotent existence-checked scripts, which is what I followed.
- **A libsql connection caches column metadata.** A client opened before an
  `ALTER TABLE ADD COLUMN` keeps returning the old column list, and `SELECT *`
  hands the new column back under the literal key `"undefined"`. `PRAGMA
  table_info` bypasses the cache — so a test that only PRAGMAs looks green while
  one that selects looks broken, and neither is telling you about the migration.
  Documented at the top of the migration test.

---

## 3. Recommendations, each with a preference

### R1 — Apply the migration to production before UI-freeze (2026-08-20)

**Preference: approve.** It is additive, idempotent and proved not to change any
existing row's behaviour. Until it runs, none of the R-015 or R-016 code has
anything to write to. I cannot run it — an operator-todo is the right vehicle.

### R2 — Accept the fair-use multiplier of 2× the venue's annual count, floor 40

**Preference: approve.** D-020 ratified that fair use notifies and never blocks;
it did not set the number, and the number is internal — it never appears in a
document and cannot refuse anything. Doubling covers reissues, cancellations and
a year of growth without firing on ordinary use, and an alert that cries wolf is
an alert nobody reads. Easy to change later; it is one constant.

### R3 — Wedding-date visibility: redemption triggers it, the grant is automatic and disclosed, the couple can revoke

**Preference: approve, but this is genuinely yours.** Three gates currently
exist in the codebase and they disagree — D-011's literal words say redemption
linkage, the studio schema says explicit per-field consent, the app says implicit
consent at creation. **All three are unwired, so nothing is wrong today**, but
the first one built decides the answer by accident unless you decide it on
purpose. My recommendation satisfies D-011's text, keeps the consent
infrastructure that is already built and fail-closed, and sits closest to D-010
point 1 — *couples are asked for nothing by default*. A second consent form on an
already-gifted product asks the couple for something; a disclosed, revocable
default does not.

### R4 — Accept the `opened` invitation state as a first-party page load

**Preference: approve.** D-013 point 3 bans open pixels and that ban stands. A
page the couple deliberately opened is a different fact from a pixel fired
without their knowledge. This gives the venue the state its administration
surface needs without touching what you ruled out. Flagged rather than assumed
because it is adjacent to your decision.

### R5 — Accept that E04.06 delivers the mechanism and the proof, not the wiring

**Preference: approve, and push back if you disagree — this one is a judgement I
made.** The task says "implement". I delivered the sponsorship state axis, the
branding-visibility rule, the 24-hour removal deadline and the survival
invariant proved across every combination. I did **not** build the release
writer or a control for it, because `workspaceSponsorships` is insert-only today
and a release button needs the venue portal surface that E07 builds. Half-wiring
it now would create a code path nothing calls and everything has to maintain.

### R6 — Do not reuse `code_allotment IS NULL` as the unlimited signal

**Preference: approve.** Covered above. The alternative is cheaper by one column
and risks silently making an unknown number of existing sponsors unlimited.

---

## 4. Founder decisions required

### D1 — R-023, new and verified: one partner's account deletion destroys the shared workspace

`app/src/server/account-erasure.ts` selects every workspace where
`ownerUserId` matches the erasing user and hard-deletes the whole thing — tasks,
comments, attachments — regardless of who created them. The one-owner floor
stops a co-owner being *demoted*; nothing stops the account holding
`ownerUserId` from calling account deletion and taking the shared workspace with
it.

**The unit of this product is a couple.** Two people, one wedding, one
workspace. This is a live, currently shippable failure mode, and it is not in the
RAID register. I verified it in code rather than taking the finding on trust.

**Decision:** triage now, or log as accepted risk with a target. My preference is
to log it now and fix it before Cohort 1 rather than before release — it needs a
product answer about what "delete my account" means for shared work, and that
answer belongs with E03.10's separation question, not bolted on.

### D2 — The founding number has no field

D-009 point 6 ratifies that a venue number is assigned **on payment**. The only
place `01/25` exists in the codebase is marketing copy on `/venues`. Nothing
computes or stores which number a venue holds. **It is due before the first
payment clears**, which is before release. It sits in E02, not E04, so I recorded
it rather than building it.

### D3 — Which venue-identity path is canonical

There are three representations of a venue: `sponsors` in the shared store, a
transitional mirror in studio, and an untyped JSON blob in `comp_codes.notes` in
Tasks with no foreign key to either. **The third is the one the couple's product
actually reads.** `brandMeta` — the column that would hold a logo and a welcome
message — has no schema, no type and no consumer anywhere.

Consequence, stated plainly: **a venue is buying a gift with its name on it, and
only the name inherits.** No logo, no venue-authored welcome message. The
welcome sentence is hardcoded with the name substituted in. That is a gap
between what E04.05 describes and what a venue would receive.

### D4 — The consent layer is designed, tested and idle

`projectSponsorActivation` has no caller outside its own test.
`sponsorConsentGrants` has no writer anywhere. `listSponsorActivationDTOs` has no
caller. The live venue snapshot never reads a consented field.

Nothing is leaking — Classes 1 and 2 of the data boundary are enforced by real
code on real routes. But **a privacy claim resting on an unwired module is R-007
exactly**, and the Venue Portal cannot show a venue anything until this is
connected. It is E07 scope; recorded here because E04.08 is where it became
visible.

---

## 5. What I deliberately did not do

- **Did not run the migration against production.** No credentials, and it is an
  irreversible external action.
- **Did not touch a live public page.** `/redeem/[code]` still tells a
  venue-sponsored couple the product is *free to you for the next year*, which
  contradicts the 18-month term and now contradicts the grace rule too. It is a
  one-line copy fix and it is a live page, so it stops here. Diff on request.
- **Did not edit `RAID.md` or `DECISIONS.md`.** Three other Wave 1 sessions are
  running against the same tree, `project-control.mjs` locks project state but
  source files have no such lock, and a lost update on the decision log is the
  exact failure `WAVE1_CORRECTION.md` was written about. R-023 and the R-015 and
  R-016 status changes are proposed here for the main session to write.
- **Did not build the release writer, the branding-removal job, Keepsake mode,
  the export, the deletion flow, or `sponsor_members`.** All named in the ADR as
  gaps with owners.
- **Did not mark anything Done.** Twelve tasks sit at Founder Review.

One incidental note: `app/src/lib/entitlements-shared/schema.ts` is now one
column behind studio's canonical schema. Harmless — drizzle only writes the
columns you name, and the app never reads `wedding_date` — but worth knowing.

---

## 6. Cross-session note

The studio contract check failed mid-session on three strategy documents that
belong to WP-10. I did not touch them; that session finished its edits and the
check passes now. Recording it because it is the shape of collision the wave
should expect: shared *checks* are as coupled as shared files.

---

## Approve or push back

| # | Item | My preference |
|---|---|---|
| R1 | Apply the migration to production before 2026-08-20 | approve |
| R2 | Fair-use ceiling at 2× annual count, floor 40 | approve |
| R3 | Wedding-date visibility: redemption triggers, revocable | approve — but yours |
| R4 | `opened` as a first-party page load | approve |
| R5 | E04.06 delivers mechanism and proof, not wiring | approve, or push back |
| R6 | Explicit `allotment_mode` rather than reusing null | approve |
| D1 | R-023 — account deletion destroys shared work | **decide** |
| D2 | Founding number has no field | **decide** |
| D3 | Canonical venue-identity path | **decide** |
| D4 | Unwired consent layer | **decide** |
| — | The twelve E04 tasks | approve individually, or as a block |
