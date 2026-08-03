# Wave 3 handoffs

Built 2026-08-03 from canonical state, not from the original wave plan — a lot
moved. E01, E04 and E10 are complete. E11 is 13/15. Wave 2 delivered E07, E09
and the E13 engineering half.

---

## Two things must happen before Wave 3 starts

### 1. Approve Wave 2 — 30 tasks are in your queue

Wave 3's engineering builds on E07 and E09. Approving them first means Wave 3
builds on Done work rather than on work that might come back.

```bash
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs packet --review --write
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs approve-batch "Approved." --review
```

That takes verified completion from **33.8% to roughly 48%**.

### 2. The `app` repo has to be reconciled — this one is blocking

Two of the three Wave 3 packages work in `app`, and `app` is currently unsafe to
work in:

- **94 uncommitted files**, of which roughly 24 belong to another lane
  (hybrid, detail-panel, palette, studio-bar, primitives), 6 are VEF-shaped, and
  23 are new untracked files.
- **25 commits behind `origin/main`**, with 1 unpushed local commit.
- No stashes, so nothing is hidden — but nothing is safe either.

A session starting here inherits a stale checkout carrying another lane's
unreviewed work, and any `git pull` risks conflicting into it. **Two sessions
doing E08 and E05 in that tree would be the Wave 1 file collision again, at
larger scale.**

**The pattern that avoids it — every Wave 3 session works in its own worktree
off `origin/main`, never in the shared checkout:**

```bash
cd C:/Users/ethan/signal-studio-workspace/app
git fetch origin
git worktree add ../_wt-wp07 -b claude/wp07-engineering origin/main
git worktree add ../_wt-wp08 -b claude/wp08-couple origin/main
```

The shared `app` checkout is then left exactly as it is, for whoever owns those
94 files to reconcile. Wave 3 never touches it.

*(The VEF commit already stranded there — `commercial-terms.v2` — is safe on
`origin/claude/vef-commercial-terms-v2`.)*

---

## The packages

| Session | Package | Tasks | Repo / worktree | Waits on |
|---|---|---|---|---|
| 1 | **WP-07** — billing, security, reliability, release engineering | 12 (E08) | `_wt-wp07` off app main | E09 approved |
| 2 | **WP-08** — couple planning experience | 9 of 12 (E05) | `_wt-wp08` off app main | E04 (done) |
| 3 | **WP-13** — commercial pages and assets | 9 of 13 (E12) | `studio` | E02, E09 approved |

**Parallel-safe:** all three. WP-07 and WP-08 are in separate worktrees; WP-13 is
in a different repo entirely.

**Deliberately not in Wave 3:**
- **E06 Shared Timeline** — depends on E05, and is blocked on **R-031**: whether
  a sponsored couple's artifact should sit on the search-indexable `/p` surface
  at all. That is your decision and it changes the build.
- **E03 legal drafting** — gated on the E03.01 role map, which is in internal
  review with five critical findings open, two of which are product decisions
  (R-031 again, and R-032 analytics consent).
- **E13/E14 creative and E15 release** — Ethan's lane, and release verification
  needs everything before it.

---

## Session 1 — WP-07 · Billing, security, reliability, release engineering

```
You are running work package WP-07 on the Venue Edition and Films programme (VEF-2026).

WORK IN AN ISOLATED WORKTREE. The shared app checkout has 94 uncommitted files
belonging to another lane and is 25 commits behind. Do not work in it, do not pull into
it, do not commit from it.

  cd C:/Users/ethan/signal-studio-workspace/app
  git fetch origin
  git worktree add ../_wt-wp07 -b claude/wp07-engineering origin/main
  cd ../_wt-wp07

START HERE
Read studio/docs/execution/venue-edition-and-films/HANDOFF.md, PROJECT.md, WORKFLOWS.md,
DECISIONS.md (D-009, D-020, D-021, D-022, D-024) and RAID.md (R-013, R-014, R-018, R-022,
R-026, R-027, R-028, R-029). Then run /venue-briefing and open your session with
--id=wp07-engineering.

SCOPE
E08.01 through E08.12.

R-027 AND R-028 SHIP FIRST. They are verified privacy defects in shipped code and E07
now builds on that code.
  R-027: studio/src/lib/account/instrumentation/suppression.ts:33-41 — presentBehavioural
  tests only that the POPULATION clears 3. The value is published unconditionally, so
  presentBehavioural(1, 40) returns { state: "value", value: 1 }. A venue knows exactly
  which couples it invited, so a behavioural count of 1 is a statement about one
  identifiable couple. The complement is as bad: 39 of 40 identifies the one who did not.
  Make the floor two-sided — withhold when value < 3 OR (eligible - value) < 3 — and never
  render "fewer than 3", which is itself a disclosure.
  R-028: presentRate() has no production caller anywhere. The 5-eligible floor on
  percentages, ratified in D-011, runs in a test and nowhere else. Make the threshold a
  property of the value: have the projector emit a rate variant that is withheld below 5
  and carries its numerator and denominator together, and remove any formatter's ability
  to build a percentage from two loose metrics.

THEN E08. Billing is VAT-INCLUSIVE (D-021): EUR 1,500 standard and EUR 1,000 founding are
what the venue pays, with VAT coming out of it, not added on top. E08.02's immutable
founding-rate flag and historical price record must survive a price change without
rewriting history. E08.03's lapse behaviour follows D-009's continuous-renewal condition.
E08.06 secures invitation tokens — note R-033: share_links.token is a plaintext primary
key resolved by raw equality, while the Timeline path hashes with a unique index and a
constant-time compare. The control the privacy matrix relies on belongs to a different
feature than the one exposing people.

Follow the migration ledger workflow in studio/CLAUDE.md for any schema change. The
migration runner splits on "--> statement-breakpoint", NOT semicolons, and a comment-only
first segment silently runs only the first statement. That has cost this workspace two
cycles.

WHAT COMES BACK
ONE consolidated recommendation packet (D-024). Generate it with:
  node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs packet E08 --write
Then verify your own evidence before it reaches the founder:
  node studio/docs/execution/venue-edition-and-films/tools/verify-evidence.mjs E08
Move every task to Founder Review. MARK NOTHING DONE. Push your branch; do not merge.
Close with /venue-close and --id=wp07-engineering.
```

## Session 2 — WP-08 · Couple planning experience

```
You are running work package WP-08 on the Venue Edition and Films programme (VEF-2026).

WORK IN AN ISOLATED WORKTREE — same reason as WP-07:

  cd C:/Users/ethan/signal-studio-workspace/app
  git fetch origin
  git worktree add ../_wt-wp08 -b claude/wp08-couple origin/main
  cd ../_wt-wp08

START HERE
Read HANDOFF.md, PROJECT.md, WORKFLOWS.md, DECISIONS.md (D-010, D-011, D-020, D-022,
D-024) and RAID.md (R-015, R-017). Then /venue-briefing, open with --id=wp08-couple.

SCOPE
E05.01, E05.03 through E05.10 — nine tasks. E05.02 (the venue-branded welcome), E05.11
(the motion and polish pass) and E05.12 (the design-system review and visual baselines)
are FOUNDER-CREATIVE and are not yours. Build the structure; leave the taste to Etham.

Per D-015 Q2 this is an AUDIT FIRST. Four products already ship — Notes, Tasks, Timeline
and Signal. For each task write acceptance criteria, assess what exists against them,
record what genuinely passes as evidence, and build only the gap. Existing implementation
is candidate evidence, never founder-approved completion.

WHAT THE COUPLE JOURNEY MUST HONOUR
The access term is max(redemption + 548 days, wedding date + 90 days) — D-022, now
implemented in studio/src/lib/venue-lifecycle.ts. E05.01's journey map must reflect the
real rule, not a flat eighteen months.
Entitlement is every booked couple, unlimited, no seat count anywhere (D-020).
The venue never sees private planning content. Not in Notes, not in Tasks, not in an
unpublished Timeline, not in a briefing.

R-017 IS LIVE IN YOUR SCOPE. E05.03 builds the default wedding workspace template, and
the shipped template at app/src/lib/templates.generated.ts:108 contains a "Collect final
dietary notes" task. Dietary and allergy data is Article 9 special-category data about
guests who consented to nothing, and shipping a template that instructs the couple to
collect it is a determination of an essential means. There is no structured dietary field
and no in-product venue flow — that part of the original finding was wrong and is
corrected in RAID. Do NOT design a new field. Do flag in your packet how the template
should handle it, because the role map (E03.01) has not settled it and E05.03 should not
pre-empt the answer.

WHAT COMES BACK
ONE packet (D-024). Run packet E05 --write and verify-evidence E05 before it reaches the
founder. Where a design direction is genuinely open, run /lab and bring options rather
than picking. MARK NOTHING DONE. Push your branch; do not merge. Close with /venue-close
and --id=wp08-couple.
```

## Session 3 — WP-13 · Commercial pages and asset system

```
You are running work package WP-13 on the Venue Edition and Films programme (VEF-2026).

This one works in the studio repo, in the normal checkout. Branch off the current work:
  cd C:/Users/ethan/signal-studio-workspace/studio
  git checkout -b claude/wp13-commercial

START HERE
Read HANDOFF.md, PROJECT.md, WORKFLOWS.md, DECISIONS.md (D-009, D-014, D-016, D-020,
D-021) and RAID.md (R-020, R-042, I-014). Then /venue-briefing, open with --id=wp13-commercial.

SCOPE
E12.01, E12.02, E12.03, E12.05, E12.06, E12.07, E12.08, E12.09, E12.14 — nine tasks.
E12.10 (sales deck), E12.11 (certificate), E12.12 (venue pack) and E12.13 (couple welcome
kit) are FOUNDER-CREATIVE and are not yours.
E12.04 is already Done and live — do not redo it. Read src/app/venues/page.tsx as the
reference for how the ratified position is expressed correctly.

THE RATIFIED POSITION, which every page must carry consistently
EUR 1,500 standard and EUR 1,000 for the Founding 25, both stated as INCLUSIVE of VAT at
the prevailing rate. The lock holds while the agreement renews continuously — never "for
life", never "forever", never "in perpetuity". Numbers 01/25 to 25/25 assigned on cleared
payment, not signature. Fourteen-day hold. Every couple with a booking, no seat count.
Eighteen months from redemption or three months past the wedding, whichever is later.

R-042 IS IN YOUR SCOPE AND IT IS THE INTERESTING ONE. "Founding partner" survives four
times in public/brand/market-entry-deck-2026.html, including "The founding partner variant
· presented at signing", and once on /design. "partner" is on E12.04's own banned-term
list and the ratified programme name is "Founding 25". Bring the founder a
recommendation: retire the term everywhere, or define it as a distinct thing. Do not
quietly rewrite venue-facing deck copy.

E12.07 states exactly what the venue sees and never sees. Be careful: R-031 records that
/p is deliberately search-indexable while the privacy documentation models every published
surface as token-bound. Do NOT write a privacy explanation that describes the token-bound
model as if it covered /p. If the page needs to say something about public sharing, say
what is true today and flag the gap.

TWO HARD STOPS
Nothing you write may state or imply legal approval, solicitor review, accountant
verification or unqualified GDPR compliance (D-016). E09.10's copy hierarchy has the
pre-approved answers to the four questions venues ask — use them verbatim.
Any change to a registered experience surface makes design-quality unsatisfiable (I-014).
Before touching src/app/** or public/brand/**, read I-014 and expect to hand the founder a
review rather than a capture.

Apply the brand-voice skill to every externally legible word.

WHAT COMES BACK
ONE packet (D-024). packet E12 --write, then verify-evidence E12. MARK NOTHING DONE. Push
your branch; do not merge — design-quality is red and there is no merge over it. Close with
/venue-close and --id=wp13-commercial.
```

---

## After Wave 3

**Wave 4** — E06 Shared Timeline (needs R-031 decided), E03 legal drafting (needs the
role map's five criticals closed), E14 film pre-production.
**Wave 5** — E15 release verification, once everything else is approved.

**Still only yours:** E11.04 (SPF/DKIM/DMARC on signalstudio.ie — gates every send),
the design-lab routing decision, R-031, R-032, and the two films.
