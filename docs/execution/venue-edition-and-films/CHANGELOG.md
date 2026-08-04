# CHANGELOG — Venue Edition and Films (VEF-2026)

Baseline changes, scope additions and removals, task splits and merges, title
changes, dependency changes, commercial changes, milestone changes, approved
date changes and reopened tasks.

**Nothing is ever deleted, and no imported task is ever silently renumbered.**
Entries are appended by `project-control.mjs` (baseline approval, gate changes,
reopened tasks) and by hand for scope and title changes.

---

## 2026-08-02 · Baseline imported

**211 tasks across 15 epics imported from the founder-supplied master backlog
and placed under project control.** The baseline is Draft and unapproved.

- Source of record: `backlog.source.md`, a verbatim transcription. A test
  asserts every task title in `PROJECT_STATE.json` is byte-identical to it.
- Imported: 15 epics, 211 tasks, 120 critical-path tasks, 54 release-blocking
  tasks (E05–E08, the four epics whose notes state "Launch-blocking"), 20
  controlling dependency edges derived from the four supplied critical blocking
  rules.
- 0 duplicate IDs, 0 malformed IDs, 0 ID gaps, 0 references to absent tasks,
  0 dependency cycles, 0 inconsistent epic placements.
- All 211 tasks imported at status `backlog`. Nothing imported as Done.
  Existing repository implementation was recorded as candidate evidence in
  `BASELINE_REVIEW.md` §9, not as completion.
- Priorities, executors and epic-level dependencies are **proposed**, not
  approved. They are listed in `BASELINE_REVIEW.md` §4, §5 and §7.
- Six founder decisions opened (FD-01 to FD-06), four of them recorded as
  conflicts between the current approved direction and the existing repository
  record (D-003 to D-006).
- Control system placed at `studio/docs/execution/venue-edition-and-films/`,
  following the existing programme convention (D-002).
- No product behaviour, public page, production data, film or commercial asset
  was changed. No commit, push, deploy or publish.

## 2026-08-02 · 29 founder decisions answered · two scope amendments

**Round 1 of the decision docket answered in full. 29 of the 39 founder-only
tasks now have a recorded decision and moved from Backlog to Ready.** Recorded
as D-008 through D-015.

**Resolved conflicts.** D-003 (founding rate) resolved by D-009 in favour of 25
venues at EUR 1,000, superseding `venue-edition-fixed-price-2026-07-11`.
D-004 (couple access term) resolved by D-010 in favour of keeping the shipped
18-month implementation plus a wedding-date grace rule. D-006 (portal naming)
resolved by D-015: the Signal Studio Account **is** the Venue Portal, one
surface with two names, and no task is renamed. **D-005 (entitlement model)
remains open** — it is Round 2 and needs cost modelling first.

**Scope amendments.**

1. **E09.08** — title unchanged. Scope amended from *sourcing and licensing*
   demonstration photographs to **generating them with AI**. Reason: the budget
   is zero (D-015 Q5). The task's own requirement, that no unapproved real venue
   or couple material is used, is satisfied by generation. Quality risk recorded
   as R-011.
2. **E11.06** — title unchanged. **Deferred**, not cancelled. Its in-person
   visit route is dead (D-013: the channel is email only). The physical-letter
   half is unresolved and recorded as I-006; the task returns to Backlog if
   letters are wanted.

**No task was renumbered, merged, retitled or deleted.**

**New issues.** I-004 (zero budget makes the external legal and accounting
review impossible as written, and the legal gate depends on it) · I-005 (50
venues on launch day conflicts with the founder-approved 25-venue cohort rule) ·
I-006 (physical letters, one confirmation outstanding).

**New risks.** R-010 (deliverability: 50 cold sends on launch day from a domain
with pending DKIM) · R-011 (AI-generated imagery in an emotional wedding
product) · R-012 (music and sound licensing at zero budget).

**Approach change.** D-015 Q2: the first pass over E04–E12 is an **audit** that
converts existing repository work into evidence against written acceptance
criteria, not a build. Scope is unchanged; whatever the evidence does not cover
is still built.

**Baseline remains Draft.** Five of the six baseline decisions (FD-01, FD-02,
FD-04, FD-05, FD-06) are answered. FD-03 — the entitlement model and its unit
economics at EUR 1,000 — is still open and is the last thing standing between
the baseline and approval.

## 2026-08-02 · Baseline approved

Approved 2026-08-02. 211 tasks, the 120-task critical path and the 54 release-blocking tasks stand as imported. Proposed priorities, executors and epic-level dependencies accepted. FD-03 (entitlement model and unit economics at EUR 1,000) explicitly deferred and in flight, to return as a choice rather than a question. Recorded as D-019.

## 2026-08-03 · Batch approved — 9 task(s)

`E03.07` Define rights and permissions for venue logos, venue photographs, couple photographs, film assets and public case-study material.
`E03.08` Define the active planning term relative to activation date, wedding date, postponement and post-wedding access.
`E03.09` Ratify the free Keepsake mode, read-only rules, storage boundary, export rights and deletion controls.
`E06.08` Define restrained venue attribution and Signal Studio attribution across shared artifacts.
`E09.06` Lock the canonical demo story for the venue, couple and wedding journey.
`E11.03` Define cohort-release cadence, weekly account capacity and the rule for releasing the next 25.
`E11.13` Define the follow-up sequence, no-response sequence and respectful stopping rule.
`E11.14` Define founding-slot holds, proposal expiry, payment-to-lock procedure, close-lost reasons, referral asks and publicity consent.
`E14.13` Decide the exact placement of the standard price, founding rate and final walkthrough CTA.

Founder note: Approved.

## 2026-08-03 · Release gate Commercial exit criteria rewritten

3 → 12 criteria. Source: studio/docs/execution/venue-edition-and-films/evidence/gates/commercial.json.

## 2026-08-03 · Release gate Product exit criteria rewritten

3 → 12 criteria. Source: studio/docs/execution/venue-edition-and-films/evidence/gates/product.json.

## 2026-08-03 · Release gate Data, security and reliability exit criteria rewritten

3 → 12 criteria. Source: studio/docs/execution/venue-edition-and-films/evidence/gates/data.json.

## 2026-08-03 · Release gate Creative exit criteria rewritten

3 → 13 criteria. Source: studio/docs/execution/venue-edition-and-films/evidence/gates/creative.json.

## 2026-08-03 · Release gate Sales readiness exit criteria rewritten

3 → 12 criteria. Source: studio/docs/execution/venue-edition-and-films/evidence/gates/sales_readiness.json.

## 2026-08-03 · Batch approved — 14 task(s)

`E01.01` Publish a one-page source-of-truth brief containing the current offer, product model, geography, films and superseded assumptions.
`E01.02` Define the primary project objective as 25 signed and paid founding venues, rather than 25 invitations or expressions of interest.
`E01.03` Separate the 1 September release milestone from the final project-closure milestone of 25 paid and onboarded venues.
`E01.04` Lock project scope and explicitly exclude internal venue operations, full-scale schools, full-scale students and unrelated product expansion.
`E01.05` Create the project board with fields for epic, task ID, priority, status, owner, dependency, acceptance evidence and target date.
`E01.06` Assign an accountable owner or lead agent to every epic while retaining founder approval over product, commercial and release decisions.
`E01.07` Build the complete dependency map and identify the product, legal, capture, film and outreach critical paths.
`E01.08` Create a decision log recording every ratified commercial, legal, product, design and film decision.
`E01.09` Create a project risk and issue register covering commercial, product, privacy, delivery, founder-capacity and launch risks.
`E01.10` Define six formal release gates: commercial, legal, product, data, creative and sales-readiness.
`E01.11` Set the offer-freeze, UI-freeze, copy-freeze, capture-freeze, film-lock and release-candidate dates.
`E01.12` Establish a weekly operating review covering blockers, decisions, evidence, quality, pipeline and the next seven days.
`E09.01` Publish the Venue Edition event taxonomy and metric data dictionary.
`E09.02` Define first useful action, recent use, 30-day continuation, product reach, Timeline creation and Timeline sharing.

Founder note: Approved.

## 2026-08-03 · Task reopened — E01.01

Publish a one-page source-of-truth brief containing the current offer, product model, geography, films and superseded assumptions.

Reason: Reopened by WP-03. These twelve were swept to Done at 00:52 by approve-batch --review run from session eed55e9e-wp01, whose scope is E04. The note recorded was the placeholder 'Approved.' The founder never saw this work: the WP-03 recommendation packet was not written until 01:45, an hour after the approval. Restoring them to Founder Review, where WP-03 left them. Recorded as I-010.

## 2026-08-03 · Task reopened — E01.02

Define the primary project objective as 25 signed and paid founding venues, rather than 25 invitations or expressions of interest.

Reason: Reopened by WP-03. These twelve were swept to Done at 00:52 by approve-batch --review run from session eed55e9e-wp01, whose scope is E04. The note recorded was the placeholder 'Approved.' The founder never saw this work: the WP-03 recommendation packet was not written until 01:45, an hour after the approval. Restoring them to Founder Review, where WP-03 left them. Recorded as I-010.

## 2026-08-03 · Task reopened — E01.03

Separate the 1 September release milestone from the final project-closure milestone of 25 paid and onboarded venues.

Reason: Reopened by WP-03. These twelve were swept to Done at 00:52 by approve-batch --review run from session eed55e9e-wp01, whose scope is E04. The note recorded was the placeholder 'Approved.' The founder never saw this work: the WP-03 recommendation packet was not written until 01:45, an hour after the approval. Restoring them to Founder Review, where WP-03 left them. Recorded as I-010.

## 2026-08-03 · Task reopened — E01.04

Lock project scope and explicitly exclude internal venue operations, full-scale schools, full-scale students and unrelated product expansion.

Reason: Reopened by WP-03. These twelve were swept to Done at 00:52 by approve-batch --review run from session eed55e9e-wp01, whose scope is E04. The note recorded was the placeholder 'Approved.' The founder never saw this work: the WP-03 recommendation packet was not written until 01:45, an hour after the approval. Restoring them to Founder Review, where WP-03 left them. Recorded as I-010.

## 2026-08-03 · Task reopened — E01.05

Create the project board with fields for epic, task ID, priority, status, owner, dependency, acceptance evidence and target date.

Reason: Reopened by WP-03. These twelve were swept to Done at 00:52 by approve-batch --review run from session eed55e9e-wp01, whose scope is E04. The note recorded was the placeholder 'Approved.' The founder never saw this work: the WP-03 recommendation packet was not written until 01:45, an hour after the approval. Restoring them to Founder Review, where WP-03 left them. Recorded as I-010.

## 2026-08-03 · Task reopened — E01.06

Assign an accountable owner or lead agent to every epic while retaining founder approval over product, commercial and release decisions.

Reason: Reopened by WP-03. These twelve were swept to Done at 00:52 by approve-batch --review run from session eed55e9e-wp01, whose scope is E04. The note recorded was the placeholder 'Approved.' The founder never saw this work: the WP-03 recommendation packet was not written until 01:45, an hour after the approval. Restoring them to Founder Review, where WP-03 left them. Recorded as I-010.

## 2026-08-03 · Task reopened — E01.07

Build the complete dependency map and identify the product, legal, capture, film and outreach critical paths.

Reason: Reopened by WP-03. These twelve were swept to Done at 00:52 by approve-batch --review run from session eed55e9e-wp01, whose scope is E04. The note recorded was the placeholder 'Approved.' The founder never saw this work: the WP-03 recommendation packet was not written until 01:45, an hour after the approval. Restoring them to Founder Review, where WP-03 left them. Recorded as I-010.

## 2026-08-03 · Task reopened — E01.08

Create a decision log recording every ratified commercial, legal, product, design and film decision.

Reason: Reopened by WP-03. These twelve were swept to Done at 00:52 by approve-batch --review run from session eed55e9e-wp01, whose scope is E04. The note recorded was the placeholder 'Approved.' The founder never saw this work: the WP-03 recommendation packet was not written until 01:45, an hour after the approval. Restoring them to Founder Review, where WP-03 left them. Recorded as I-010.

## 2026-08-03 · Task reopened — E01.09

Create a project risk and issue register covering commercial, product, privacy, delivery, founder-capacity and launch risks.

Reason: Reopened by WP-03. These twelve were swept to Done at 00:52 by approve-batch --review run from session eed55e9e-wp01, whose scope is E04. The note recorded was the placeholder 'Approved.' The founder never saw this work: the WP-03 recommendation packet was not written until 01:45, an hour after the approval. Restoring them to Founder Review, where WP-03 left them. Recorded as I-010.

## 2026-08-03 · Task reopened — E01.10

Define six formal release gates: commercial, legal, product, data, creative and sales-readiness.

Reason: Reopened by WP-03. These twelve were swept to Done at 00:52 by approve-batch --review run from session eed55e9e-wp01, whose scope is E04. The note recorded was the placeholder 'Approved.' The founder never saw this work: the WP-03 recommendation packet was not written until 01:45, an hour after the approval. Restoring them to Founder Review, where WP-03 left them. Recorded as I-010.

## 2026-08-03 · Task reopened — E01.11

Set the offer-freeze, UI-freeze, copy-freeze, capture-freeze, film-lock and release-candidate dates.

Reason: Reopened by WP-03. These twelve were swept to Done at 00:52 by approve-batch --review run from session eed55e9e-wp01, whose scope is E04. The note recorded was the placeholder 'Approved.' The founder never saw this work: the WP-03 recommendation packet was not written until 01:45, an hour after the approval. Restoring them to Founder Review, where WP-03 left them. Recorded as I-010.

## 2026-08-03 · Task reopened — E01.12

Establish a weekly operating review covering blockers, decisions, evidence, quality, pipeline and the next seven days.

Reason: Reopened by WP-03. These twelve were swept to Done at 00:52 by approve-batch --review run from session eed55e9e-wp01, whose scope is E04. The note recorded was the placeholder 'Approved.' The founder never saw this work: the WP-03 recommendation packet was not written until 01:45, an hour after the approval. Restoring them to Founder Review, where WP-03 left them. Recorded as I-010.

## 2026-08-03 · Batch approved — 33 task(s)

`E01.01` Publish a one-page source-of-truth brief containing the current offer, product model, geography, films and superseded assumptions.
`E01.02` Define the primary project objective as 25 signed and paid founding venues, rather than 25 invitations or expressions of interest.
`E01.03` Separate the 1 September release milestone from the final project-closure milestone of 25 paid and onboarded venues.
`E01.04` Lock project scope and explicitly exclude internal venue operations, full-scale schools, full-scale students and unrelated product expansion.
`E01.05` Create the project board with fields for epic, task ID, priority, status, owner, dependency, acceptance evidence and target date.
`E01.06` Assign an accountable owner or lead agent to every epic while retaining founder approval over product, commercial and release decisions.
`E01.07` Build the complete dependency map and identify the product, legal, capture, film and outreach critical paths.
`E01.08` Create a decision log recording every ratified commercial, legal, product, design and film decision.
`E01.09` Create a project risk and issue register covering commercial, product, privacy, delivery, founder-capacity and launch risks.
`E01.10` Define six formal release gates: commercial, legal, product, data, creative and sales-readiness.
`E01.11` Set the offer-freeze, UI-freeze, copy-freeze, capture-freeze, film-lock and release-candidate dates.
`E01.12` Establish a weekly operating review covering blockers, decisions, evidence, quality, pipeline and the next seven days.
`E02.01` Ratify the single standard offer at €1,500 annually prepaid and the first 25 founding agreements at €1,000 annually prepaid.
`E02.02` Ratify the exact price-reduction wording: “€500 founding saving,” “one-third founding rate” or “33.3% founding reduction.”
`E02.03` Define precisely what the €1,000 founding-rate lock covers and state that it applies to the base annual Venue Edition agreement.
`E02.05` Define how the founding rate behaves after a venue sale, company acquisition, operator change, rebrand, merger or relocation.
`E02.08` Create the Founding Venue Benefits Charter covering founder access, feedback, early access, priority support and recognition.
`E02.09` Define the boundaries of founder access and product feedback so that the benefit does not become unlimited bespoke development.
`E02.10` Select legally safe programme terminology, establish Founding Venue numbers 01/25 through 25/25, and define when numbers are assigned.
`E02.11` Define when a founding place is reserved, when it expires, when it becomes locked, and when the programme automatically closes.
`E02.12` Ratify the eligible-couple entitlement model, model costs at different venue volumes, and reconcile the new economics across all financial documents.
`E04.01` Define the data entities for venue, agreement, term, founding status, member, invitation, couple workspace and public artifact.
`E04.02` Define venue member roles and permissions for owner, manager and viewer.
`E04.03` Define invitation states from creation through sent, opened, redeemed, expired, revoked and replaced.
`E04.04` Define couple workspace ownership, co-owner access, invited collaborators and account recovery.
`E04.05` Define how venue name, logo, welcome message and “compliments of” attribution inherit into each sponsored workspace.
`E04.06` Implement venue-workspace unlinking without removing or exposing the couple’s private work.
`E04.07` Create the lifecycle state machine from invitation to active planning, post-wedding access, Keepsake mode and deletion.
`E04.08` Define the technical boundary between private planning data, public Timeline data and venue-visible aggregate data.
`E04.09` Define wedding-date metadata, event-date changes and which dates can appear in the Venue Portal.
`E04.10` Lock the black-rail rule for authenticated owner experiences and the rail-free rule for shared public artifacts.
`E04.11` Document all lifecycle edge cases and expected product behaviour before implementation.
`E04.12` Build deterministic migration fixtures and test data for every lifecycle state.

Founder note: your note

## 2026-08-03 · Batch approved — 11 task(s)

`E09.10` Publish the Venue Edition copy hierarchy, terminology and tone rules.
`E11.01` Build the Venue Edition CRM stages from researched through paid, onboarded and first couple activated.
`E11.02` Define objective entry and exit criteria for every sales stage.
`E11.05` Write the concise founder introduction email and its personalised venue-specific opening.
`E11.07` Define how each private personalised film and landing page is delivered without sending large video attachments.
`E11.08` Build the booking flow and meeting-confirmation sequence.
`E11.09` Write the discovery-call structure and qualification questions.
`E11.10` Write the live product walkthrough and demonstration sequence.
`E11.11` Write the post-demo proposal, commercial summary, order form and same-day follow-up.
`E11.12` Build the objection library covering price, adoption, privacy, support, existing tools, implementation and product maturity.
`E11.15` Run a weekly conversion review covering cohort, channel, meeting quality, objections, proposals, wins and next-cohort changes.

Founder note: note

## 2026-08-03 · Task reopened — E04.01

Define the data entities for venue, agreement, term, founding status, member, invitation, couple workspace and public artifact.

Reason: Approved in a bulk run with a placeholder note; no packet had been written.

## 2026-08-03 · Release gate Commercial exit criteria rewritten

12 → 13 criteria. Source: studio/docs/execution/venue-edition-and-films/evidence/gates/commercial.json.

## 2026-08-03 · Release gate Sales readiness exit criteria rewritten

12 → 13 criteria. Source: studio/docs/execution/venue-edition-and-films/evidence/gates/sales_readiness.json.

## 2026-08-03 · Release gate Commercial supporting epics changed

E02 -> E02, E01. Basis: D-025, approving CR-002. E01 holds the freeze dates and the governance machinery R-006's mitigation depends on..

## 2026-08-03 · Release gate Sales readiness supporting epics changed

E10, E11, E12 -> E10, E11, E12, E15. Basis: D-025, approving CR-002. Nothing certified that what was sold could be delivered, because onboarding lives in E15..

## 2026-08-03 · WP-02 · the Greater Limerick venue universe, and the shortfall in it

**The market the Founding 25 is sold into contains 43 contactable venues, not
125.** E10.01 to E10.14 delivered; all fourteen in Founder Review, none Done.

Eleven independent research sweeps — four by county, plus venue type, directories,
awards and press, the existing repository, a village-by-village pass, historic
houses and Section 482 properties, and the statutory planning registers —
produced 376 raw records, deduplicated to **219 accounts**. Seventy sit inside
the ratified 45-minute ring; fifty are an eligible venue type; **forty-three are
confirmed trading and therefore contactable**.

**Cohort 1 fills to 25. Cohort 2 reaches 16. Cohort 3 reaches 2. Cohort 4 does
not exist.** Twenty-five founding venues out of forty-three accounts needs roughly
a 58% conversion rate on cold email. Recorded as R-038 with five costed options;
recommendation is to lock Cohorts 1 and 2 now, hold Cohort 3 as a contingent
reserve, and decide the geography question on Cohort 1's measured conversion
rather than on an assumption.

**The ring is tighter than the programme assumed.** Measured with two independent
routing engines from a fixed anchor: Gort 51 minutes, Glen of Aherlow 56, Mallow
58, Cashel 61, Listowel 73. North Kerry, south Galway, Cashel and north Cork
beyond Charleville are all outside it — four search areas the 125 target had been
implicitly counting on.

**The shortfall is a finding, not a failed search.** Thirty-nine of sixty-one
villages checked hold no wedding venue at all. A dedicated socials-only pass found
none. The barn segment is empty inside the ring. Hidden Ireland has no member
house in Limerick or Clare. All six named Section 482 leads run no weddings.
Limerick's planning register returned zero wedding-venue applications in five
years. The last three sweeps, each aimed where venues were expected to be hiding,
added seven accounts between them.

**What the research also settled.** No venue in the ring gives a booked couple any
planning system — the one reported exception traces to a single 2019 survey
response and appears nowhere on that venue's current site. Six suspected closures
were put to verification and six were confirmed, including a lakeside estate
closed seven years whose website still sells weddings. Four operators run more
than one property and three of those ties were recorded as independent until a
second pass read the group's own site.

**Honest edges.** Cohort 3 is contingent and Cohort 4 does not exist, so E10.13
comes back partly delivered by design. Thirteen of the forty-three contactable
accounts have only a town-centroid coordinate, which decides the ring but cannot
carry an E13.17 film render. Two duplicate pairs remain for human judgement. The
IHHA member list could not be reached. Consent for public naming and map
publication is `unknown` on all 219 accounts, which is correct rather than
incomplete.

Two conflicts recorded rather than reconciled: the strategy document's
owner-operator rule against D-012's eligible types (I-012), and pre-existing
personal contact data found committed elsewhere in the workspace (R-039), reported
for a founder decision and deliberately not remediated by this package.

Verification: 25/25 tests pass · coordinate audit clean at 0 wrong across 91
points · personal-data guard clean on all eleven raw research files and every
generated artefact · `validate` clean.

## 2026-08-03 · Batch approved — 14 task(s)

`E10.01` Define the public geographic term and exact boundary for the “Greater Limerick wedding market.”
`E10.02` Define eligible venue types and exclude businesses that are not credible annual Venue Edition buyers.
`E10.03` Build the venue-ranking score using wedding focus, brand quality, likely booking volume, decision accessibility and strategic fit.
`E10.04` Build a master researched universe of at least 125 accounts, or formally document the available market shortfall.
`E10.05` Deduplicate venue groups, hotels with multiple properties, shared operators and renamed properties.
`E10.06` Record accurate map coordinates, geographic cluster and drive-time ring for every account.
`E10.07` Identify the likely buyer and secondary contact at each venue: owner, general manager, wedding manager, sales lead or events lead.
`E10.08` Verify direct emails, phone numbers, postal addresses, LinkedIn profiles and current employment.
`E10.09` Research each venue’s wedding proposition, package structure, likely annual volume and current couple-planning experience.
`E10.10` Review each venue’s website, brochure, social presence and digital customer experience.
`E10.11` Write one honest, venue-specific reason each account belongs in the founding outreach.
`E10.12` Rank and lock Cohort 1 containing the first 25 venues.
`E10.13` Rank and lock Cohorts 2, 3 and 4, each containing the next 25 venues.
`E10.14` Maintain a reserve cohort, contact-verification dates, conflict flags and consent status for public naming or map publication.

Founder note: Founder approved 2026-08-03: 'all 14 tasks are founder approved', in the same instruction that approved the Convert ranking model and deferred the geography decision until Cohort 1 conversion data exists. Approved knowing that E10.04 returns a documented market shortfall rather than 125 accounts (43 contactable, R-038), and that E10.13 is partly delivered by design because Cohorts 3 and 4 do not exist inside the ratified ring.

## 2026-08-03 · D-028 · E10 approved — Convert model, geography deferred

**Epic E10 is complete: 14 of 14 tasks founder-approved and Done.** Verified
completion moves to 33.3% (70/210).

Ethan approved the `convert` ranking model for Cohort 1, deferred the geography
decision until Cohort 1 conversion data exists, and approved all fourteen tasks
in one instruction. Recorded as **D-028**.

Approved knowing two things were reported as short: E10.04 returns a documented
market shortfall — **43 contactable accounts inside the ratified ring against a
125-account target** — rather than the universe the backlog asked for, and E10.13
is partly delivered because Cohorts 3 and 4 do not exist inside that ring.

**R-038 stays open.** Deferring buys information, it does not resolve the
shortfall. Twenty-five founding venues from forty-three accounts still needs
roughly a 58% conversion rate, and if Cohort 1 converts at an ordinary 10–15% the
geography or the founding number has to move. Five costed options stand ready.

**I-012 resolved as recommended:** D-012 governs, group-owned hotels stay
eligible, and the owner-operator preference becomes a ranking weight rather than
a filter — which is what `decision_access` already does. The 40-weddings
threshold in `VENUE_EDITION_STRATEGY.md` is superseded by D-012's 20.

**Deliberately not changed.** The `cohortReady` flags stay `false` for all four
cohorts. Cohorts 1 and 2 are ranked, locked and approved, but no contact on any
account has been verified, seven Cohort 1 accounts still need a ring
confirmation, and thirteen contactable accounts carry only a town-centroid
coordinate. "Ready" on that line reads as ready to send, and nothing is. The flag
needs its meaning settled before it is set either way; `project-control.mjs`
deliberately refuses to set structured fields through the counter command.

## 2026-08-03 · D-030 · the R-038 decision rule pre-committed, and the import tests fixed properly

**The deferral now has a trigger, a pre-agreed response and a close date**, so it
cannot quietly become drift. Recorded as **D-030**.

Measured at the end of Cohort 1's four touches, on signed-and-paid: **10 or more**
widens the ring to 60 minutes · **4 to 9** reduces the founding number to 15 and
closes the offer, pre-authorised here so it does not need a fresh decision under
time pressure · **3 or fewer** does **not** widen the ring, because at that point
the constraint is the offer rather than the supply, and widening spends the last
of a 43-account market on a pitch that has just failed.

**The founding offer closes 12 weeks after Cohort 1's first send, or 31 December
2026, whichever is earlier**, at whatever number is reached, and that number is
published as closed. An unfilled founding cohort inverts the scarcity claim it
exists to make: "fifteen founding venues, closed" is a stronger asset than
"25 places, ten still available".

Recorded once, because it reframes the target: **25 of 43 contactable accounts is
a 58% share of every eligible wedding venue in the ring.** Fifteen is roughly 35%.

**`project-control.test.mjs` fixed at the design level rather than by bumping a
number.** Five tests were failing because they asserted the import's counts — 211
tasks, 120 on the critical path, 155 execution-class — against the whole backlog,
so the first legitimate scope addition (E02.13, under CR-003 / D-027) broke all
five at once. Changing 211 to 212 would have destroyed the property being tested
and turned an integrity assertion into a rubber stamp.

Instead the two properties are now separated: the imported 211 are intact and
byte-identical with their derived totals frozen, and **anything else must name
the change request and the decision that created it**. Approved growth passes;
silent growth fails. A new test asserts exactly that. 69/69 pass, and an
adversarial run confirms all six failure modes are still caught — renaming an
imported task, deleting one, adding a task with no CR, citing an unapproved CR,
reclassifying a founder-only task, and quietly joining the critical path.

**Honest edge, and it cost real work.** WP-02's four RAID entries — the market
shortfall, the committed contact data, the closed-venue directories and the
owner-operator conflict — were **destroyed by a concurrent session's rewrite of
`RAID.md`**, and their ids were reassigned to another package's risks before
anyone noticed. They are reissued as **R-038, R-039, R-040 and I-012**, and every
reference in `DECISIONS.md`, `CHANGELOG.md`, `venue-universe/` and four tasks'
evidence has been repointed. This is the second recorded instance of the failure
in I-011 and the first one to lose four entries at once.

## 2026-08-03 · Batch approved — 18 task(s)

`E07.01` Lock the portal information architecture and the primary buyer job of administering and proving the sponsored benefit.
`E07.02` Redesign Overview so “Invite a couple” is the principal action.
`E07.03` Complete account-standing, current-term, founding-status, renewal-date and support-status presentation.
`E07.04` Ratify every adoption-funnel definition from invitation through meaningful first action and continued use.
`E07.05` Implement an evidence-backed next-action system for stale invitations, low redemption, incomplete setup and renewal preparation.
`E07.06` Replace product-centric metrics with understandable customer outcomes while retaining detailed product reach where useful.
`E07.07` Replace the old 40/80 allotment language with the final eligible-booking or fair-use entitlement model.
`E07.08` Complete invitation creation, copying, sending, resending, revoking, replacing, expiring and redemption status.
`E07.09` Complete access search, filters, pagination, stale-invitation alerts and masked-code handling.
`E07.10` Complete the distribution kit with approved email wording, welcome link and printable welcome card.
`E07.11` Complete Usage with first useful action, recent use, continued use, product reach and measurement definitions.
`E07.12` Implement the ratified small-cohort suppression rule and the “Use, without surveillance” privacy receipt.
`E07.13` Refine lifecycle visualisation and ensure it does not imply surveillance or expose private behavioural detail.
`E07.14` Complete monthly, access-term and renewal-report generation.
`E07.15` Complete reconciled PDF and CSV exports with data-through dates, completeness states and definition versions.
`E07.16` Complete Account, organisation settings, members, roles, support history and reporting preferences.
`E07.17` Add the live branded couple-experience preview, branding controls and appropriate upcoming wedding-date view.
`E07.18` Complete portal permissions, audit history, empty/loading/error states, responsive design, accessibility and end-to-end data reconciliation.

Founder note: Approved. All of Wave 2 — the E07 audit and the invitation-administration build, the E09 instrumentation, fixture, imagery and copy work, and the E13 map system and render pipeline — plus every recommendation R1-R17 and the three items in section 1 of the Wave 2 packet. Ethan McNamara, 2026-08-03: 'all are approved'.

## 2026-08-03 · Batch approved — 8 task(s)

`E09.03` Instrument invitation, activation, meaningful-use, public-sharing and Keepsake transitions.
`E09.04` Instrument personalised-film views, landing-page visits, booking actions, meetings, proposals and paid conversion.
`E09.05` Join CRM, commercial, product and reporting data into one founder operating dashboard.
`E09.07` Build a deterministic Glenmara House and Mara-and-Finn demonstration fixture across all four products and the portal.
`E09.08` Source and license all demonstration photographs and confirm that no unapproved real venue or couple material is used.
`E09.09` Reconcile every sample invitation count, adoption metric, report number, date and product-reach value.
`E09.11` Finalise offer, founding-rate, privacy, collaboration, Keepsake, CTA, objection and FAQ copy.
`E09.12` Freeze the capture copy and build a one-action demo reset that restores the canonical state.

Founder note: Approved. All of Wave 2 — the E07 audit and the invitation-administration build, the E09 instrumentation, fixture, imagery and copy work, and the E13 map system and render pipeline — plus every recommendation R1-R17 and the three items in section 1 of the Wave 2 packet. Ethan McNamara, 2026-08-03: 'all are approved'.

## 2026-08-03 · Batch approved — 4 task(s)

`E13.03` Build the stylised Greater Limerick map geometry, River Shannon path and 15-, 30- and 45-minute rings.
`E13.04` Build the data-driven map composition using verified venue coordinates and cohort metadata.
`E13.15` Build the parameterised rendering pipeline using venue name, coordinates, cohort and private CTA data.
`E13.16` Generate unique tracked links, thumbnails and landing destinations for every personalised render.

Founder note: Approved. All of Wave 2 — the E07 audit and the invitation-administration build, the E09 instrumentation, fixture, imagery and copy work, and the E13 map system and render pipeline — plus every recommendation R1-R17 and the three items in section 1 of the Wave 2 packet. Ethan McNamara, 2026-08-03: 'all are approved'.

## 2026-08-03 · Batch approved — 28 task(s)

`E05.01` Map the complete couple journey from venue invitation through first useful action, active planning, wedding day and Keepsake mode.
`E05.03` Build the default wedding workspace template with restrained milestones, decisions, tasks and example Notes.
`E05.04` Complete the wedding-specific Notes experience, including voice capture, manual capture and high-signal structured output.
`E05.05` Complete the Notes-to-Tasks promotion flow using ordinary wedding-planning language.
`E05.06` Complete the wedding Tasks experience for ownership, due dates, status, tags, priorities and clear next actions.
`E05.07` Complete the task-detail experience for comments, attachments, subtasks, decisions and private collaboration.
`E05.08` Complete the authenticated Timeline planning experience and its relationship with tasks and milestones.
`E05.09` Complete the wedding-specific Signal briefing showing only what needs the couple’s attention today.
`E05.10` Complete spouse, planner, family-member and collaborator invitations with appropriate role boundaries.
`E08.01` Implement annual prepaid billing for standard and founding agreements.
`E08.02` Implement an immutable founding-rate flag and historical price record for each qualifying venue.
`E08.03` Implement renewal invoices, renewal reminders, failed-payment handling, grace periods and lapse behaviour.
`E08.04` Complete multi-tenant data isolation for venues and couple workspaces, enforced by application-level scoping, a CI gate and a behavioural negative suite.
`E08.05` Complete role-based authentication and authorisation across venue owners, managers, viewers and couples.
`E08.06` Secure invitation tokens against guessing, reuse, unintended forwarding, replay and duplicate redemption.
`E08.07` Secure photograph and attachment uploads with file validation, malware controls, size limits and private storage.
`E08.08` Complete audit logging, operational logging, error monitoring and alert escalation.
`E08.09` Complete backups, restore testing, disaster-recovery procedures and data-integrity verification.
`E08.10` Set and test performance budgets across portal, couple workspace, Timeline images and public artifact.
`E08.11` Complete unit, integration, end-to-end, browser, responsive and device test coverage for the entire sponsored journey.
`E08.12` Complete security review, production-readiness review, release checklist, rollback process and incident-response runbook.
`E12.01` Build the public Venue Edition landing page around the sponsored couple experience.
`E12.02` Build the private Founding 25 invitation page.
`E12.03` Build a parameterised private proposal page for each venue.
`E12.06` Add the Venue Portal trust-and-renewal preview.
`E12.07` Add the privacy explanation covering exactly what the venue sees and never sees.
`E12.08` Add the complete commercial, product, support, entitlement, Keepsake and renewal FAQ.
`E12.09` Produce the concise one-page commercial proposal.

Founder note: Approved. Wave 3 approved in full, with the partial state of all 28 tasks stated plainly in the consolidated packet and understood: approving a partial task accepts the recorded gap, it does not close it. Every unmet criterion stays in the task record as scheduled work. The four open questions are decided at the recommended option in the same instruction and ratified as D-033: R-031 Option B (/p stays, wedding workspaces noindex by default with an explicit couple opt-in), R-032 Option A (no third-party analytics on any couple-facing public surface), R-042 retire (the programme is the Founding 25, a member is a founding venue), and CR-005 Option A (E08.04 amended to application-level isolation, a CI gate and a behavioural negative suite, with the honest limitation recorded).

## 2026-08-03 · Batch approved — 2 task(s)

`E12.05` Add the branded couple-experience preview.
`E12.14` Complete analytics, conversion, responsive, accessibility, performance, copy and visual QA across every commercial page.

Founder note: Approved. Founder approved all Wave 3 packet work on 2026-08-03 and waived the E05.12 dependency that held these two, E05.12 being founder-creative and outside the wave. Both are PARTIAL and the recorded gaps are accepted, not closed: E12.05 carries three unmet criteria and E12.14 six, all retained in the task records as scheduled work. Ratified with D-033.

## 2026-08-04 · Batch approved — 13 task(s)

`E06.02` Add per-milestone visibility controls for private, title-and-date, image and short-story publication states.
`E06.03` Complete milestone photograph upload, crop, compression, orientation, alt text and deletion.
`E06.04` Complete milestone navigation and the transition from a Timeline point into its photograph and story.
`E06.05` Implement private-link, password-protected and intentionally public sharing modes.
`E06.06` Allow couples to conceal exact wedding dates, locations and other sensitive milestone information.
`E06.07` Implement anonymous aggregate viewer counts without exposing individual viewer behaviour.
`E06.09` Design and implement the intentional vertical mobile Timeline.
`E06.10` Refine the desktop editorial Timeline shown in the Mara and Finn concept.
`E06.11` Implement the post-wedding read-only Keepsake state and the agreed downloadable export.
`E12.10` Produce the detailed Venue Edition sales deck.
`E12.11` Redesign the Founding Venue certificate as 01/25 through 25/25 with the €1,000 founding rate.
`E12.12` Produce the pre-booking venue sales kit for brochures, proposals, websites and coordinator conversations.
`E12.13` Produce the post-booking couple welcome kit, approved email wording and printable welcome object.

Founder note: Approved. Wave 4 approved in full at Claude's recommendation, with the partial state of all 13 tasks stated plainly in the consolidated packet and understood: approving a partial task accepts the recorded gap, it does not close it. Every unmet criterion stays in the task record as scheduled work, and the four residual risks (R-015 inert until a wedding date is captured, R-031 opt-in unstored, R-032 Sentry outstanding, R-042 printed stock) remain open in RAID rather than reading as closed.
