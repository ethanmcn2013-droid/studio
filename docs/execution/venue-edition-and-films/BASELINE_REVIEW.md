# BASELINE REVIEW — Venue Edition and Films (VEF-2026)

**Status: APPROVED 2026-08-02 by Ethan McNamara.** Recorded as D-019. Baseline
version 0.1.0.

Created 2026-08-02 at import as the honest separation between what was supplied,
what was inferred, what was proposed, and what needed a decision. Kept as the
record of what was approved and on what basis. **It is not rewritten** — later
changes go through `templates/CHANGE_REQUEST.md` and `CHANGELOG.md`.

**What approval covered.** The 211 tasks and their titles as the agreed scope ·
the 120-task critical path and the 54 release-blocking tasks as imported · the
proposed priorities (§5), executors (§7) and epic-level dependencies (§4).

**What was explicitly deferred.** FD-03, the entitlement model and its unit
economics at EUR 1,000, was the one open baseline decision at approval. It was
deferred with the instruction that it return as a choice rather than a question.

**Answers.** Of the six founder decisions in §11, five are answered:
FD-01 → D-009 · FD-02 → D-010 · FD-04 → D-015 Q4 · FD-05 → D-015 Q1 ·
FD-06 → D-015 Q3. The two smaller questions at the end of §11 are answered too:
the E04 start conflict stands as recorded in I-003, and the E04–E12 first pass
is an audit rather than a build (D-015 Q2).

Read `DECISIONS.md` D-008 to D-019 for what was decided. Read this document for
what the decisions were made against.

---

## 1. Confirmed facts

Supplied by the founder, recorded verbatim, not interpreted.

- Project: Venue Edition and Films, VEF-2026. Founder and final approver: Ethan McNamara.
- Working release target: 1 September 2026.
- Completion condition: 25 Greater Limerick founding venues signed, paid, configured, onboarded and capable of issuing functioning couple invitations.
- The twenty points of current approved direction (D-001).
- Standard price €1,500 prepaid; founding base rate €1,000 for the first 25 qualifying Greater Limerick venues, subject to final contractual continuity and eligibility conditions.
- Outreach in researched cohorts of 25, released until 25 are signed and paid.
- Two films: Limerick First and Before the Day.
- The Shared Timeline is the principal emotional and visual product artifact.
- Six release gates: commercial, legal, product, data, creative, sales readiness.
- No task is Done without explicit founder approval.

## 2. Imported tasks

| Measure | Count |
|---|---|
| Epics | 15 |
| Tasks | 211 |
| Duplicate IDs | 0 |
| Malformed IDs | 0 |
| Missing IDs in a run | 0 (every epic runs E*.01 upward with no gaps) |
| References to absent tasks | 0 |
| Dependency cycles | 0 |
| Inconsistent epic placement | 0 |
| Critical-path tasks (as supplied) | 120 |
| Release-blocking tasks (epics stating "Launch-blocking") | 54 (E05, E06, E07, E08) |
| Imported dependency edges | 20 |
| Proposed dependencies (not controlling) | 12 epic-level statements, listed in §4 |
| Tasks imported at status Backlog | 211 |
| Tasks imported at Done | 0 |

Per-epic: E01 12 · E02 12 · E03 12 · E04 12 · E05 12 · E06 12 · E07 18 ·
E08 12 · E09 12 · E10 14 · E11 15 · E12 14 · E13 18 · E14 18 · E15 18.

Every title is byte-identical to `backlog.source.md`, asserted by a test. No
task was merged, omitted, reworded or renumbered.

## 3. Inferred dependencies (controlling)

Twenty task-level edges, each traceable to one of the four supplied "critical
blocking rules". These are treated as controlling because the rules name
concrete, resolvable preconditions.

| Task | Depends on | Source rule |
|---|---|---|
| E09.12 | E02.01, E02.03, E02.12, E03.09 | "Do not freeze commercial copy before the founding-rate, entitlement and keepsake rules are ratified." |
| E14.15 | E05.12, E06.12, E07.18, E09.09, E09.12 | "Do not capture final product footage before the couple experience, Timeline, Venue Portal and demo data are visually locked." |
| E13.17 | E10.06, E10.08, E10.12, E13.15, E13.16 | "Do not produce final personalised films before the venue coordinates, names, links and outreach cohorts are verified." |
| E15.07 | E15.01–E15.06 | "Do not send the first commercial invitation before contracts, billing, reporting, privacy documentation, support and the full live journey have passed QA." |

**The judgement call, stated plainly:** the rules name *categories* ("the couple
experience", "demo data"), not task IDs. I resolved each category to the epic's
final QA or lock task rather than to the whole epic, so the graph stays usable.
If you want E14.15 to depend on all 54 tasks of E05–E07 rather than their three
lock tasks, say so and it changes.

## 4. Unconfirmed dependencies (proposed, not controlling)

Recorded here rather than in the graph, because the source states them at epic
level and expanding them would invent controlling edges the source did not
state.

| # | Proposed | Basis |
|---|---|---|
| 1 | E04 ← E02, E03 core decisions | "Begins once E02 and E03 core decisions are stable." Conflicts with the start-now directive — see §10, I-003. |
| 2 | E11 final system ← offer lock and asset lock | "Final system depends on offer and asset lock." |
| 3 | E12 final versions ← E02, E03, E09, product UI lock | "Final versions depend on E02, E03, E09 and the product UI lock." |
| 4 | E13 final render ← E02, E09, E10 | "Final rendering requires E02, E09 and E10." |
| 5 | E14 product capture ← E05–E09 | "Final product capture is blocked by E05-E09." Partly made controlling via E14.15. |
| 6 | E15 ← all six release gates | "Begins after all six release gates pass." Modelled as gate state, not task edges. |
| 7 | E05.05 ← E05.04 (promotion needs the Notes experience) | Implied by task order. |
| 8 | E06.11 ← E03.09 (Keepsake implementation needs the ratified Keepsake model) | Implied. |
| 9 | E07.07 ← E02.12 (portal entitlement language needs the entitlement model) | Implied. |
| 10 | E08.02 ← E02.03 (immutable founding-rate flag needs the lock definition) | Implied. |
| 11 | E13.10 ← E13.07 (storyboard after script), E13.11 ← E13.10, E13.14 ← E13.11 | Implied by production order. |
| 12 | E15.16 ← E02.10, E02.11 (founding-place counter needs the numbering and reservation rules) | Implied. |

**Decision needed:** approve these as controlling, approve some, or leave them
as guidance.

## 5. Proposed priorities

Not supplied. Derived by a stated rule, marked proposed:

| Priority | Rule | Count |
|---|---|---|
| p0 | On the critical path **and** in a start-now epic (E01, E02, E03) | 35 |
| p1 | On the critical path, or release-blocking, or in a start-now epic or start-now task | 110 |
| p2 | Everything else | 66 |

No p3 assigned. The rule is deliberately mechanical — it does not pretend to
know which of E07's 18 tasks matters most.

## 6. Proposed critical-path items

Taken exactly as supplied: the twelve-step list, expanded to 120 task IDs. No
task was added to or removed from it.

The consequence is worth stating: **120 critical-path tasks against 30 days to
1 September.** That is R-001, and it is the single most important thing on this
page. It does not mean the project fails; it means the release milestone and the
completion condition must stay separate (they do, E01.03), and that either
scope, date or the definition of "release" needs your decision.

## 7. Proposed executors

Following the workspace lanes: Claude Code owns product, infrastructure and
operations; Codex owns motion.

| Lane | Epics | Tasks |
|---|---|---|
| `claude_code` | E01, E04, E05, E06, E07, E08, E09, E10, E12 | 118 |
| `founder` | E02, E03 (except E03.12), E11, E15 | 56 |
| `codex_motion` | E13, E14 | 36 |
| `external` | E03.12 | 1 |

**Decision needed:** E10 (venue research) is assigned to `claude_code` on the
assumption that research and ranking is agent work and the founder verifies.
E11 and E15 are assigned to `founder` because they are founder-led outreach and
onboarding. Both are worth a second look.

## 8. Unestimated tasks

**211 of 211.** No effort estimate exists anywhere.

This is deliberate. Assigning points from a task title is exactly the fabricated
precision the project forbids: "E07.18 Complete portal permissions, audit
history, empty/loading/error states, responsive design, accessibility and
end-to-end data reconciliation" and "E01.02 Define the primary project
objective" are one task each and are not remotely the same work.

Consequence: verified completion is reported as a **provisional, count-based**
percentage with the basis printed next to it, and the delivery-progress estimate
is suppressed entirely.

**Decision needed:** estimate now (a session of pure estimation across 211
tasks), estimate progressively as task specifications are written
(recommended), or accept count-based reporting for the whole project.

## 9. Tasks that may already have partial implementation

Found during repository inspection. **None of this is Done.** Existing
implementation is candidate evidence, not founder-approved completion.

| Tasks | Candidate evidence found | Caveat |
|---|---|---|
| E07.01–E07.18 | `studio/docs/venue-portal/` (PRODUCT_CONTRACT, METRIC_DICTIONARY, PRIVACY_AND_RETENTION, ROLES_AND_PERMISSIONS, WIREFRAMES, phase-a-wireframes.html), `studio/docs/architecture/ADR-007-venue-portal-phase-a.md`, `/hq/account-review` | Marked "historical Phase A contract" and superseded by the Signal Studio Account model — see D-006 |
| E04.01–E04.03, E08.05, E08.06 | `studio/docs/LICENSING_ACCESS_DESIGN.md`, `signal-entitlements`, `studio/scripts/migrate-access*.mjs`, `app/src/app/{redeem,invite}` | Built against the 18-month model — see D-004 |
| E09.01, E09.02 | `studio/docs/venue-portal/METRIC_DICTIONARY.md`, `studio/docs/ANALYTICS.md` | Predates this project's funnel definitions (E07.04) |
| E10.04, E10.07, E10.08 | `studio/docs/strategy/VENUE_TARGET_LEDGER.md`, `VENUE_WAVE1_DOSSIERS.md`, `VENUE_ATTRIBUTION_CONTACT_LEDGER.md` | The ledger's own rule: contact data stays blank until independently verified. Not a researched universe of 125 |
| E11.05, E11.13 | `VENUE_BATCH_A_EMAIL_DRAFTS.md`, `VENUE_BATCH_BC_EMAIL_DRAFTS.md`, `VENUE_OUTREACH_SEQUENCE.md` | Written against the old offer |
| E12.01, E12.04 | `studio/src/app/venues/page.tsx` (live) | Publishes €1,500 with no founding rate — I-002 |
| E12.09, E12.10, E12.12 | `VENUE_SALES_PACK.md`, `VENUE_FAQ_OBJECTIONS.md`, `VENUE_CREATIVE_PRODUCTION_PACK.md`, operator-todo `venue-kit-signoff` | Old offer |
| E13.02, E14.01–E14.05 | `signal-motion/` motion system, `studio/docs/film-system/venues.md`, `VENUE_EDITION_VIDEO_BRIEF.md` | Neither named film exists as a composition |
| E09.06, E09.07 | `studio/docs/strategy/VENUE_DEMO_SYSTEM.md`, wedding template and fixtures, operator-todo `seed-wedding-workspace` | Glenmara House / Mara-and-Finn fixture not built across all four products plus portal |

**Decision needed:** should the first pass over E04–E12 be an audit that
converts this material into evidence against written acceptance criteria, rather
than a build? That is likely the largest single lever on R-001.

## 10. Inconsistencies and obsolete assumptions detected

| # | Finding | Where recorded |
|---|---|---|
| 1 | Founding programme: 25 at €1,000 versus the Active 2026-07-11 decision of 15 at €1,500 locked, which explicitly argued against a founding discount | D-003, R-003 |
| 2 | Couple access: activation-relative term plus Keepsake versus the implemented and migrated 18-month term dropping to Free | D-004 |
| 3 | Entitlement: eligible-booking or fair use versus 40/80 allotment, itself already unresolved in `commercial-terms.v1.json` | D-005 |
| 4 | Surface naming: "Venue Portal" throughout E07 versus "the current customer-facing model is Signal Studio Account", founder-approved 25 July 2026 | D-006 |
| 5 | Internal conflict in the supplied backlog: "Start immediately and in parallel … E04–E09" versus E04's own note "Begins once E02 and E03 core decisions are stable" | I-003 |
| 6 | Live public surface `studio/src/app/venues/page.tsx` contradicts the current direction | I-002 |
| 7 | `contracts/commercial-terms.v1.json` encodes `foundingCohortSize: 15` and `coupleAccessMonths: 18` | D-003, D-004 |
| 8 | Business partner review's €1,500–€4,000 band was already retired on 2026-07-11; recorded so no session revives it | D-003 |

Nothing above was edited. No commercial surface, contract file, HQ decision or
product behaviour was changed in this session.

## 11. Founder decisions required

**All answered except FD-03. Answers are recorded in `DECISIONS.md`; the table
below is kept as written so the original question is still legible next to what
was decided.**

| ID | Answered | Recorded as |
|---|---|---|
| FD-01 | 25 founding venues at EUR 1,000, superseding the 2026-07-11 decision | D-009 |
| FD-02 | 18 months from redemption, or 3 months past the wedding date, whichever is later; Keepsake free, read-only, exportable, never "forever" | D-010 |
| FD-03 | **Deferred at baseline approval. In flight, returning as a choice.** | — |
| FD-04 | The Signal Studio Account **is** the Venue Portal. One surface, two names. No task renamed | D-015 Q4 |
| FD-05 | Release on 1 September means ready to contact Cohort 1 | D-015 Q1 |
| FD-06 | Progressive estimation, set when a task specification is written | D-015 Q3 |

The original questions:

| ID | Decision | Blocks |
|---|---|---|
| **FD-01** | Ratify the founding programme: 25 venues at €1,000, and how it supersedes the 2026-07-11 decision (D-003) | E02, E03.03, E08.02, E12.04, E12.11, E13.08, all commercial copy |
| **FD-02** | Couple access term and Keepsake model versus the implemented 18-month drop-to-Free (D-004) | E03.08, E03.09, E04.07, E06.11 |
| **FD-03** | Entitlement model: eligible-booking or fair use, and its unit economics at €1,000 (D-005) | E02.12, E07.07, E07.11 |
| **FD-04** | Surface naming: Venue Portal or Signal Studio Account (D-006) | all 18 E07 tasks, E12.06, E14.12 |
| **FD-05** | What "release on 1 September" means, given a 120-task critical path (R-001, A-001) | the whole schedule |
| **FD-06** | Estimation approach: now, progressive, or count-based for the project (§8) | every percentage reported |

Two smaller ones, worth a line each: the E04 start conflict (§4 item 1, I-003),
and whether the E04–E12 first pass is an audit rather than a build (§9).

## 12. What approval means

Approving this baseline means: the 211 tasks and their titles are the agreed
scope; the critical path and release-blocking sets are agreed; the proposed
priorities, executors and dependencies are agreed or amended; and the six
founder decisions are answered or explicitly deferred with the consequence
accepted.

It does not mean any task is started, and it does not mark anything Done.
