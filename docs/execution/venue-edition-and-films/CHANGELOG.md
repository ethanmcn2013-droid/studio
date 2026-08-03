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
