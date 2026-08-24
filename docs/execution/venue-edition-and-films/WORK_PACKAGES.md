# WORK PACKAGES — what Claude can run without you

**161 of 211 tasks can be executed autonomously.** Research, ideation,
iteration, panels, drafting, engineering, audits — Claude works the problem and
comes back with a strong recommendation or finished work for approval.

**39 need you in the room** — the films, the visual design, the things where
your taste is the deliverable.
**10 are decisions only you can answer**, all in Round 2 of the docket.
**1 is deferred** (E11.06, physical letters).

Each package below is **paste-ready**. Open a fresh Claude Code session, paste
the prompt, and it runs start to finish. Every package ends at Founder Review —
none of them can mark anything Done.

---

## How to use this

Paste one package prompt per session. Every prompt already contains the standing
instructions, so you do not need to add anything.

### Do not run all fourteen at once

Three reasons, in order of how badly they bite:

1. **Six of them depend on WP-01.** WP-05 through WP-09 all build on the entity
   model, the lifecycle state machine and the access-term fix. Running them
   first means five sessions inventing five incompatible versions of the same
   schema.
2. **They collide in the same files.** WP-05 through WP-09 all touch `app/src`
   and the same database. Concurrent migrations against one migration ledger is
   the failure mode that has already cost this workspace a cycle.
3. **WP-14 verifies a product that does not exist yet.** It runs last, or it
   verifies nothing.

### Running sessions in parallel is now safe for project state

`project-control.mjs` takes a cross-session lock around every read-modify-write.
Verified with twelve concurrent writers: no lost updates. Before the lock,
two sessions writing at once silently destroyed one another's work — atomic
writes prevent a corrupt file, not a lost update.

What you will see if two sessions collide: the second waits up to 15 seconds,
then fails with a message naming the holding command. Re-run it. Locks left by a
crashed session are broken automatically after two minutes.

**The WIP limit needs an exception when packages run in parallel.** Three
packages of 13, 14 and 12 tasks cannot share a project-wide cap of three In
Progress. Record one exception covering the wave, and deactivate it when the
wave closes. Each task still keeps its own acceptance criteria, evidence and
Founder Review — the exception relaxes the concurrency cap, nothing else.

### The waves

| Wave | Packages | Sessions | Why together |
|---|---|---|---|
| **1 — now** | WP-01, WP-02, WP-03, WP-10 | 4 in parallel | No dependencies, no shared files. WP-01 is engineering in `app`, WP-02 is research, WP-03 is docs, WP-10 is the commercial record. |
| **2 — after WP-01** | WP-05, WP-06, WP-12 | 3 in parallel | All need the entity model. WP-12 needs WP-02's coordinates. |
| **3 — after WP-06** | WP-07, WP-08, WP-11 | 3 in parallel | Engineering, couple experience, sales drafting. |
| **4 — after WP-08** | WP-09, WP-04, WP-13 | 3 in parallel | Timeline needs the couple experience. WP-04 needs WP-01's lifecycle. |
| **5 — last** | WP-14 | 1 | Verifies everything that came before. |

Wave 1 is the one that matters. It unblocks every other wave, and WP-02 alone
is weeks of research that needs none of your time.

---

## The packages

| # | Package | Tasks | Epic(s) | Depends on | Parallel-safe | Why it is autonomous |
|---|---|---|---|---|---|---|
| **WP-01** | Access-term fix and lifecycle architecture | 13 | E04 + R-015 | — | yes | Schema, state machine and edge cases. Pure engineering against ratified decisions. |
| **WP-02** | Venue universe and cohorts | 14 | E10 | — | yes | Desk research, ranking, dedup, coordinates. The single biggest autonomous win in the project. |
| **WP-03** | Governance completion | 12 | E01 | — | yes | The brief, dependency map, gates, registers. Mostly already built; this finishes and evidences it. |
| **WP-04** | Legal document drafting | 10 | E03 | CR-001, WP-01 | no | Role map first, then six documents, cross-lane adversarial review. Highest-stakes package. |
| **WP-05** | Venue Portal audit and completion | 16 | E07 | WP-01 | no | Starts as an audit per D-015 Q2: convert existing Phase A work into evidence, then build the gap. |
| **WP-06** | Measurement, demo data and copy | 12 | E09 | WP-01 | no | Event taxonomy, metric definitions, the Glenmara fixture, copy system. |
| **WP-07** | Billing, security and release engineering | 12 | E08 | WP-01, WP-06 | no | Multi-tenant isolation, token security, backups, performance budgets, test coverage. |
| **WP-08** | Couple experience completion | 9 | E05 | WP-01 | no | Notes, Tasks, task detail, Timeline planning, Signal briefing, collaborators. Visual polish is WP-13. |
| **WP-09** | Shared Timeline and Keepsake | 10 | E06 | WP-01, WP-08 | no | Content model, visibility controls, sharing modes, Keepsake state, export, QA. |
| **WP-10** | Commercial record reconciliation | 8 | E02 | — | yes | Write the ratified decisions into the HQ decision files, the machine contract and the live page. Closes I-002. |
| **WP-11** | Sales operating system drafting | 14 | E11 | WP-10 | yes | CRM stages, sequences, discovery, objection library, follow-up. Drafting moved to Claude in D-008. |
| **WP-12** | Map system and render pipeline | 5 | E13 | WP-02 | yes | Map geometry, data-driven composition, parameterised rendering, tracked links. Engineering, per D-015 Q6. |
| **WP-13** | Commercial pages and QA | 10 | E12 | WP-10 | no | Landing page, invitation page, proposal page, FAQ, analytics and accessibility QA. Design direction is yours. |
| **WP-14** | Release verification | 17 | E15 | everything | no | Production billing, invitation, portal, Timeline and Keepsake tests. Runs last. |

**Recommended first three, in parallel:** WP-01, WP-02, WP-03. They share no
files, they unblock the most downstream work, and WP-02 alone is weeks of desk
research that needs none of your time.

---

## Paste-ready prompts

Each block below is complete. Copy it whole.

### WP-01 — Access-term fix and lifecycle architecture

```
Read studio/docs/execution/venue-edition-and-films/HANDOFF.md, PROJECT.md, DECISIONS.md
and WORKFLOWS.md first, then run /venue-briefing.

Execute WP-01: E04.01 through E04.12, plus the R-015 access-term fix defined in D-022.

R-015 is the priority and ships first: studio/src/lib/venue-edition.ts pins
VENUE_EDITION_COUPLE_ACCESS_DAYS = 548 and studio/src/lib/entitlements-db/codes.ts
throws on any other duration, so D-010's ratified grace rule cannot be minted. Per D-022:
capture the wedding date at redemption, compute expiry as max(redemption + 548 days,
wedding date + 90 days), recompute on wedding-date change so access only ever moves later,
relax the mint guard to accept a computed duration while refusing anything under 548 days,
and apply no upper cap.

Then E04.01-E04.12: entities, roles, invitation states, workspace ownership, branding
inheritance, unlinking, the lifecycle state machine, the private/public/aggregate data
boundary, wedding-date metadata, the rail rules, edge cases and migration fixtures.

Constraints: D-020 means entitlement is unlimited per booked couple, and R-016 says
"unlimited" is currently unrepresentable — mint refuses a null allotment and the HQ
onboarding form defaults to 10. Fix that as part of this package: an unlimited
representation the mint accepts, portal headroom warnings suppressed for unlimited
sponsors, the HQ near-allotment list filtered, and the form default replaced.

Use subagents, panels and iteration as you judge necessary. Follow the migration ledger
workflow in studio/CLAUDE.md for any schema change. Verify with real tests, record
evidence against each task, and move each to Founder Review. Do not mark anything Done.
Close the session with /venue-close.
```

### WP-02 — Venue universe and cohorts

```
Read studio/docs/execution/venue-edition-and-films/HANDOFF.md, PROJECT.md and DECISIONS.md,
then run /venue-briefing.

Execute WP-02: E10.01 through E10.14 — the Greater Limerick venue universe.

Ratified constraints you are working to: D-012 sets the geography as a 45-minute
drive-time ring from Limerick city centre, publicly described as "Limerick and the
surrounding counties", and sets eligibility as dedicated wedding venues, country houses,
castles, hotels with a real weddings operation, and barn and estate venues — excluding
restaurants, pubs, marquee hire, town hotels doing occasional weddings, and anywhere
under roughly 20 weddings a year. D-017 sets cohorts of 25, released sequentially.
D-020 means volume does not affect price, so do not screen venues out by size.

Build the master researched universe of at least 125 accounts, or formally document the
market shortfall if it does not exist. Deduplicate groups, multi-property hotels and
shared operators. Record accurate coordinates, cluster and drive-time ring for every
account — E13.17 depends on these being verified. Identify the likely buyer role at each
venue. Research each venue's wedding proposition and current couple-planning experience.
Write one honest, venue-specific reason each account belongs in the founding outreach.
Rank and lock Cohort 1, then Cohorts 2, 3 and 4.

CRITICAL — data handling: personal contact data goes in the CRM, never in the project
tree. studio/docs/execution/venue-edition-and-films/private/venues.csv is gitignored and
its template deliberately has no contact_name, email, phone or address columns. Follow
the rule in VENUE_TARGET_LEDGER.md: contact details stay blank until independently
verified from a current public source. Generated reports carry counts only, never names.

Use subagents heavily — this is a wide research problem. Record evidence, move tasks to
Founder Review, mark nothing Done. Close with /venue-close.
```

### WP-03 — Governance completion

```
Read studio/docs/execution/venue-edition-and-films/HANDOFF.md and PROJECT.md, then run
/venue-briefing.

Execute WP-03: E01.01 through E01.12.

Most of this exists already and the job is to finish it and evidence it honestly, not to
rebuild it. E01.05 (the project board), E01.08 (decision log) and E01.09 (risk register)
are substantially delivered by the control system itself — assess them against acceptance
criteria you write first, and record what is genuinely complete versus what is not.

E01.01 is the headline deliverable and the recommended first task in the project: a
one-page source-of-truth brief covering the current offer, the product model, the
geography, both films and every superseded assumption. It must reflect D-008 to D-023
and must supersede nothing silently — list what it replaces.

E01.07 (full dependency map and the five critical paths) and E01.10 (the six release
gates with exit criteria) need real work. Note CR-001 rewrote the legal gate's exit
criteria; use those.

Apply the brand-voice skill to the brief. Record evidence, move to Founder Review, mark
nothing Done. Close with /venue-close.
```

### WP-04 — Legal document drafting

```
Read studio/docs/execution/venue-edition-and-films/HANDOFF.md, PROJECT.md, DECISIONS.md
(especially D-009, D-010, D-016, D-020, D-021, D-023), RAID.md (R-013, R-017, R-018,
R-019, R-020) and evidence/change-requests/CR-001.md. Then run /venue-briefing.

Execute WP-04: E03.01 through E03.11. E03.12 is deferred by CR-001 — leave it.

D-016: there is no solicitor and no accountant. You draft and review everything. That
decision is made and is not to be re-argued. Your job is to make it work as well as it
possibly can and to be honest about what it does not cover.

HARD SEQUENCE, per CR-001: E03.01, the GDPR role map, is a gate on E03.04, E03.05 and
E03.06. No document is drafted until the role map is written and put to the founder.
Draft it against EDPB Guidelines 07/2020. It must explicitly cover Article 9 categories
and children's data (R-017 — dietary and allergy notes are already a first-class object
in the shipped wedding template and are advertised as flowing to the venue). Test the map
against four concrete scenarios before calling it finished: a guest requests erasure, a
supplier objects to being named, a venue asks for a couple's data, a couple separates and
both want the workspace. Reconcile it against the Active decision
studio/content/hq/decisions/gdpr-data-lifecycle-policy.md rather than inheriting it.

Do NOT pre-commit to processor SCCs for E03.04. Choose the instrument after the role map,
from processor SCCs, a controller-to-controller sharing agreement, or an Article 26 joint
controller arrangement, justified in writing.

Every document: built on a named, dated, publicly available EU or Irish source position
recorded on its face. Reviewed adversarially by a different lane than drafted it, across
four lenses — GDPR completeness, consumer contract fairness, commercial enforceability,
hostile reading — each completing a per-item checklist with an explicit verdict per item.
Every finding fixed or escalated to the founder with a recommendation. No statutory
reference appears unless verified against primary source text with a retrieval date.

Pricing is VAT-INCLUSIVE per D-021. Never write "for life" or "forever". No document may
state or imply legal approval, solicitor review or accountant verification. Include the
marketing-controls clause and prohibited-claims list per R-020.

Record evidence, move to Founder Review, mark nothing Done. Close with /venue-close.
```

### WP-10 — Commercial record reconciliation

```
Read studio/docs/execution/venue-edition-and-films/DECISIONS.md D-009, D-020, D-021 and
RAID.md I-002, then run /venue-briefing.

Execute WP-10: write the ratified commercial position into every place that currently
contradicts it. This closes I-002.

The ratified position: EUR 1,500 standard and EUR 1,000 for the Founding 25, both
VAT-INCLUSIVE (D-021). The founding rate holds for as long as the agreement renews
continuously without lapse — never "for life", never "forever". Entitlement is every
booked couple, unlimited, no number in the commercial terms (D-020). 25 founding places,
numbered on payment. Cohorts of 25 released sequentially (D-017).

Surfaces that are currently wrong, all verified:
- studio/content/hq/decisions/venue-edition-fixed-price-2026-07-11.md — Active, says 15
  founding venues locking EUR 1,500 and argues against a founding discount. Supersede it
  with a new dated HQ decision; do not edit it in place.
- studio/contracts/commercial-terms.v1.json — foundingCohortSize 15, no founding rate,
  activationAllowance null. Needs a new version.
- studio/src/lib/venue-edition.ts — VENUE_EDITION_ANNUAL_PRICE_EUR = 1_500 with no
  founding rate.
- studio/src/app/venues/page.tsx — publishes EUR 1,500 and "the first fifteen venues".
- studio/docs/strategy/VENUE_EDITION_STRATEGY.md and the financial model.

Also complete E02.08 (Founding Venue Benefits Charter) from D-009 point 5 and D-014, and
E02.10/E02.11 mechanics.

This touches a live public page, so present the diff before deploying anything and let
the founder approve the page copy. Apply the brand-voice skill. Record evidence, move to
Founder Review, mark nothing Done. Close with /venue-close.
```

### WP-05, WP-06, WP-07, WP-08, WP-09, WP-11, WP-12, WP-13, WP-14

```
Read studio/docs/execution/venue-edition-and-films/HANDOFF.md, PROJECT.md, DECISIONS.md
and WORKFLOWS.md, then run /venue-briefing.

Execute <WP-NN> as defined in studio/docs/execution/venue-edition-and-films/WORK_PACKAGES.md:
tasks <TASK RANGE>.

Per D-015 Q2, the first pass over E04-E12 is an AUDIT, not a build: for each task, write
acceptance criteria first, then assess what already exists in the repository against them,
record what genuinely passes as evidence, and only build the gap. Existing implementation
is candidate evidence, never founder-approved completion.

Use subagents, panels, labs and iteration as you judge necessary. Where a design direction
is needed, use /lab and bring the founder options rather than picking silently. Verify
with real tests and real browser checks. Record evidence against every task, move each to
Founder Review, and mark nothing Done. Close with /venue-close.
```

Substitute the package number and task range from the table above.

---

## What needs you in the room — 39 tasks

Not paste-able. These are the ones where your taste is the deliverable.

| Epic | Tasks | What it is |
|---|---|---|
| E14 | all 18 | **Before the Day.** Narrative, every captured sequence, the Timeline hero, the edit. The whole film. |
| E13 | 12 of 18 | **Limerick First.** Motion language, script, storyboard, animatic, voiceover, music, final motion, the 25 renders. |
| E12 | 4 | Sales deck, certificate design, venue pack, couple welcome kit. |
| E05 | 3 | The venue-branded welcome, the motion and polish pass, the design-system review. |
| E06 | 2 | The vertical mobile Timeline, the desktop editorial Timeline. |

**The sequencing that matters:** every one of these sits behind the freeze dates
(D-008 — UI 20 Aug, copy 21 Aug, capture 22 Aug). The autonomous packages are
what get you to the freeze. If WP-01 and WP-05 through WP-09 run now, your
creative time in the back half of August is spent on the films rather than on
finishing the product they film.

---

## Still yours to answer — 10 tasks

Round 2 of `DECISION_DOCKET.md`, plus what has opened since:

| Task | Question | Now unblocked by |
|---|---|---|
| E02.04 | Missed payment, lapse, reactivation | A contract draft — WP-04 |
| E02.06 | What sits outside the price | WP-04 + the Revenue reply |
| E02.07 | Invoice timing, refunds | WP-04 + the Revenue reply |
| E03.10 | Venue change, separation, non-renewal | WP-01's edge-case enumeration |
| E03.11 | Retention and cold-outreach basis | WP-04's role map |
| E07.04 | Ratify the adoption-funnel definitions | WP-06 proposes them |
| E13.09 | Founding-rate-lock language | WP-04 |
| E15.01 | The go/no-go | At the gate |
| E15.13 | *(answered — D-014)* | — |
| E11.06 | *(deferred — D-018)* | — |

Every one of them is now waiting on a package rather than on you. That is the
point of running the packages first.
