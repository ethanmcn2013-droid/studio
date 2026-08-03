# Wave 1 handoffs — paste-ready

Four sessions, four packages, 47 tasks, no dependencies between them and no
shared files. Everything below is self-contained: open a fresh Claude Code
session in `C:\Users\ethan\signal-studio-workspace`, paste one block, walk away.

**Run all four at the same time.** The WIP exception covering Wave 1 is already
recorded, and `project-control.mjs` takes a cross-session lock so concurrent
sessions cannot destroy each other's state writes.

| Session | Package | Tasks | Lane |
|---|---|---|---|
| 1 | WP-01 — access-term fix + lifecycle architecture | 13 | engineering, `app` + `studio` |
| 2 | WP-02 — venue universe and cohorts | 14 | research |
| 3 | WP-03 — governance completion | 12 | docs |
| 4 | WP-10 — commercial record reconciliation | 8 | `studio` content + contracts |

---

## Session 1 — WP-01

```
You are running work package WP-01 on the Venue Edition and Films programme (VEF-2026).

START HERE
Read, in this order:
  studio/docs/execution/venue-edition-and-films/HANDOFF.md
  studio/docs/execution/venue-edition-and-films/PROJECT.md
  studio/docs/execution/venue-edition-and-films/WORKFLOWS.md
  studio/docs/execution/venue-edition-and-films/DECISIONS.md  (D-010, D-020, D-022, D-024)
  studio/docs/execution/venue-edition-and-films/RAID.md       (R-015, R-016)
Then run /venue-briefing.

WHAT IS ALREADY TRUE
The baseline is approved (v0.1.0). 24 decisions are ratified. Entitlement is every
booked couple, unlimited, with no number in the commercial terms (D-020). Couple access
is 18 months from redemption or 3 months past the wedding date, whichever is later
(D-010). Nothing in this project is Done — 0 of 209 tasks — because Done requires
explicit founder approval and none has been given yet.

SCOPE
E04.01 through E04.12, plus the R-015 access-term fix defined in D-022.

R-015 SHIPS FIRST. It is the highest-consequence defect in the project.
studio/src/lib/venue-edition.ts:6 pins VENUE_EDITION_COUPLE_ACCESS_DAYS = 548 and
studio/src/lib/entitlements-db/codes.ts:81-88 throws on any venue_edition mint whose
duration is not exactly that. Irish venues book 12 to 24 months out, so a couple who
books in March 2027 for a September 2028 wedding and redeems on signing loses the
product before their wedding day, in public, at the venue that gifted it.
Per D-022: capture the wedding date at redemption; compute expiry as
max(redemption + 548 days, wedding date + 90 days); recompute on wedding-date change so
access only ever moves later, never earlier; relax the mint guard to accept a computed
duration while still refusing anything under 548 days; apply no upper cap.

R-016 IS IN SCOPE TOO. "Unlimited" is currently unrepresentable: codes.ts:56-60 refuses
a null allotment by design, and src/app/hq/entitlements/OnboardVenueForm.tsx:63-67 hard-
requires a number with min=1 and defaultValue=10 — so today's real entitlement is a form
default nobody decided, against a live page promising "No seats. No per-couple maths."
Four changes: an unlimited representation the mint accepts; availableCount and the
"No remaining allotment headroom" attention item suppressed for unlimited sponsors in
src/lib/account/live/project-venue-access.ts; the HQ near-allotment list filtered; the
onboarding default replaced with a computed ceiling.

Then E04.01-E04.12: data entities, venue member roles, invitation states, workspace
ownership and recovery, branding inheritance, venue-workspace unlinking, the lifecycle
state machine, the private/public/aggregate data boundary, wedding-date metadata, the
black-rail and rail-free rules, all lifecycle edge cases, and deterministic migration
fixtures for every state.

HOW TO WORK
Work autonomously. Use subagents, /panel and iteration as you judge necessary. Resolve
your own blockers by research and iteration rather than escalating them. Where a design
choice is genuinely open, use /lab, pick nothing, and bring the options into your final
packet.

Follow the migration ledger workflow in studio/CLAUDE.md for any schema change. LESSON
already paid for twice in this workspace: the migration runner splits on
"--> statement-breakpoint", NOT semicolons, and a comment-only first segment silently
runs only the first statement.

Verify with real tests and real runs, not assertions that it should work. Record evidence
against every task with the evidence command.

Note E04.09: which wedding dates the venue may see is already ratified in D-011 — only
where the couple redeemed that venue's code, and date changes are never shown.

WHAT COMES BACK
ONE consolidated recommendation packet at the end (D-024), not thirteen separate reviews.
It states: what was done; what was verified and how, with the actual command output; the
recommendations with a clear preference on each; anything needing a founder decision; and
anything you deliberately did not do. Every item answerable with approve or push back.

Move every task to Founder Review. MARK NOTHING DONE — only Ethan can, and only
explicitly. Do not deploy, publish or touch a live public page. Close with /venue-close.
```

---

## Session 2 — WP-02

```
You are running work package WP-02 on the Venue Edition and Films programme (VEF-2026).

START HERE
Read studio/docs/execution/venue-edition-and-films/HANDOFF.md, PROJECT.md, WORKFLOWS.md
and DECISIONS.md (D-012, D-017, D-020, D-024). Then run /venue-briefing.

SCOPE
E10.01 through E10.14 — the Greater Limerick venue universe and the outreach cohorts.

RATIFIED CONSTRAINTS YOU ARE WORKING TO
Geography (D-012): a 45-minute drive-time ring from Limerick city centre, described
publicly as "Limerick and the surrounding counties". The same geometry serves the film
map in E13.03, so build it once and build it properly.
Eligibility (D-012): IN — dedicated wedding venues, country houses, castles, hotels with
a real weddings operation, barn and estate venues. OUT — restaurants, pubs, marquee hire,
town hotels doing occasional weddings, and anywhere under roughly 20 weddings a year.
Cohorts (D-017): 25 places, 25 venues contacted per cohort, released sequentially until
25 have signed and paid. Not 50 at once.
Pricing (D-020): volume does not affect price. Do NOT screen venues out by size — a
250-wedding venue and a 40-wedding venue both pay EUR 1,000 as founding venues.

DELIVERABLES
A master researched universe of at least 125 accounts, or a formal document of the market
shortfall if it does not exist. Deduplication of groups, multi-property hotels, shared
operators and renamed properties. Accurate coordinates, geographic cluster and drive-time
ring for every account — E13.17's personalised film renders depend on these being
verified, so treat coordinate accuracy as a first-class deliverable, not metadata. The
likely buyer ROLE at each venue. Each venue's wedding proposition, package structure,
likely annual volume and current couple-planning experience. A review of each venue's
website, brochure and social presence. One honest, venue-specific sentence on why each
account belongs in the founding outreach. Cohort 1 ranked and locked, then Cohorts 2, 3
and 4, plus a reserve cohort.

DATA HANDLING — NOT NEGOTIABLE
Personal contact data goes in the CRM, never in the project tree. Read
studio/docs/execution/venue-edition-and-films/private/README.md and venues.template.csv
before you write a single row: the template deliberately has NO contact_name, email,
phone, address or linkedin columns, because a second stale copy of contact data is how a
repo share becomes a data incident. Join on account_id. private/venues.csv is gitignored.
Follow the standing rule in studio/docs/strategy/VENUE_TARGET_LEDGER.md: contact details
stay blank until independently verified from a current public source or a direct
relationship. Generated reports carry counts only, never names. `validate` fails if
anything resembling an email address reaches the commercial tracker.
Existing material at studio/docs/strategy/VENUE_TARGET_LEDGER.md, VENUE_WAVE1_DOSSIERS.md
and VENUE_ATTRIBUTION_CONTACT_LEDGER.md is a candidate input, NOT a verified universe.

HOW TO WORK
This is a wide research problem — use subagents heavily and in parallel. Work
autonomously; resolve your own blockers. Where the ranking model has genuine open
choices, bring the options rather than picking silently.

WHAT COMES BACK
ONE consolidated recommendation packet (D-024), not fourteen reviews. Include the honest
shortfall position if 125 credible accounts do not exist in the ring — that is a finding,
not a failure. Move every task to Founder Review. MARK NOTHING DONE. Close with
/venue-close.
```

---

## Session 3 — WP-03

```
You are running work package WP-03 on the Venue Edition and Films programme (VEF-2026).

START HERE
Read studio/docs/execution/venue-edition-and-films/HANDOFF.md, PROJECT.md, WORKFLOWS.md,
DECISIONS.md (all of D-001 through D-024) and BASELINE_REVIEW.md. Then run
/venue-briefing.

SCOPE
E01.01 through E01.12.

THE POINT OF THIS PACKAGE
Most of it already exists — the control system itself delivers much of E01.05 (project
board), E01.08 (decision log) and E01.09 (risk register). Your job is to finish it and
evidence it HONESTLY, not to rebuild it. For each of those, write acceptance criteria
first, assess what actually exists against them, record what genuinely passes as evidence,
and say plainly what does not. Existing implementation is candidate evidence, never
founder-approved completion.

E01.01 IS THE HEADLINE and is the recommended first task in the whole project: a one-page
source-of-truth brief covering the current offer, the product model, the geography, both
films, and every superseded assumption. It must reflect D-001 through D-024 and must
supersede nothing silently — list what it replaces. Note it is a ONE-PAGE brief; the
temptation to write ten pages is the failure mode.

E01.07 (the complete dependency map and the product, legal, capture, film and outreach
critical paths) and E01.10 (the six release gates with exit criteria) need real work. The
legal gate's exit criteria were rewritten by CR-001 — use those twelve, not the original.
E01.11's freeze dates are already set in D-008: offer 15 Aug, UI 20 Aug, copy 21 Aug,
capture 22 Aug, film-lock 28 Aug, release-candidate 30 Aug.

Apply the brand-voice skill to the brief and anything else externally legible.

HOW TO WORK
Work autonomously. Use subagents and /panel as you judge necessary. Resolve your own
blockers.

WHAT COMES BACK
ONE consolidated recommendation packet (D-024). Be explicit about which E01 tasks you
believe are genuinely complete versus which are asserted-complete — this package is the
one most at risk of marking governance "done" because a file exists. Move every task to
Founder Review. MARK NOTHING DONE. Close with /venue-close.
```

---

## Session 4 — WP-10

```
You are running work package WP-10 on the Venue Edition and Films programme (VEF-2026).

START HERE
Read studio/docs/execution/venue-edition-and-films/HANDOFF.md, PROJECT.md, WORKFLOWS.md,
DECISIONS.md (D-009, D-014, D-017, D-020, D-021, D-024) and RAID.md (I-002, R-021, R-022).
Then run /venue-briefing.

SCOPE
E02.08, E02.10, E02.11 and the reconciliation of every surface that currently contradicts
the ratified commercial position. This closes I-002.

THE RATIFIED POSITION
EUR 1,500 standard and EUR 1,000 for the Founding 25, both VAT-INCLUSIVE (D-021). The
founding rate holds for as long as the agreement renews continuously without lapse —
NEVER "for life", NEVER "forever" (D-001 point 16, R-008; the same trap already caught
this price lock once). Entitlement is every booked couple, unlimited, with no number in
the commercial terms (D-020). 25 founding places, numbered 01/25 to 25/25, assigned ON
PAYMENT not on signature. Places held 14 days from proposal. Cohorts of 25 released
sequentially (D-017). Founder access is one 30-minute call per venue per year plus a
named email route (D-009). Founding requests are logged and shape the roadmap; nothing is
built for one venue (D-014).

SURFACES THAT ARE CURRENTLY WRONG — all verified, all still live
  studio/content/hq/decisions/venue-edition-fixed-price-2026-07-11.md — status Active,
    says 15 founding venues locking EUR 1,500 and explicitly argues AGAINST a founding
    discount. SUPERSEDE it with a new dated HQ decision. Do not edit it in place; the
    decision record is append-only history.
  studio/contracts/commercial-terms.v1.json — foundingCohortSize 15, no founding rate,
    activationAllowance null. Needs a new version.
  studio/src/lib/venue-edition.ts — VENUE_EDITION_ANNUAL_PRICE_EUR = 1_500, no founding
    rate.
  studio/src/app/venues/page.tsx — publishes EUR 1,500 and "the founding cohort, the
    first fifteen venues". This is a LIVE PUBLIC PAGE.
  studio/docs/strategy/VENUE_EDITION_STRATEGY.md and src/lib/hq/financial-model.ts.

ALSO DELIVER
E02.08 Founding Venue Benefits Charter, built from D-009 point 5 and D-014's boundary on
custom requests. E02.10 and E02.11 mechanics: programme terminology, when numbers are
assigned, when a place is reserved, expires, locks, and when the programme closes.

HARD STOPS
studio/src/app/venues/page.tsx is live and public. Prepare the change, show the diff and
the rendered result, and STOP. Ethan approves the page copy before anything deploys. Do
not deploy, publish or push. Apply the brand-voice skill to every externally legible word.
Nothing you write may state or imply legal approval, solicitor review or accountant
verification (D-016).

HOW TO WORK
Work autonomously. Follow the HQ rules in studio/CLAUDE.md — strategic HQ content changes
go to the source files in content/hq/, never to the rendered dashboard.

WHAT COMES BACK
ONE consolidated recommendation packet (D-024). Move every task to Founder Review. MARK
NOTHING DONE. Close with /venue-close.
```

---

## What comes back to you

Four packets. Each one is: what was done, what was verified and how, the
recommendations with a stated preference, anything needing your decision, and
anything the session deliberately left. Every item answerable with **approve** or
**push back**.

Nothing reaches Done without you saying so, and nothing touches a live page or
deploys without you seeing it first.

## When Wave 1 closes

Deactivate the WIP exception, then Wave 2: WP-05, WP-06 and WP-12 in parallel —
all three need WP-01's entity model, and WP-12 needs WP-02's coordinates.
