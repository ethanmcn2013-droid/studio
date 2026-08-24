# ROADMAP — Venue Edition and Films (VEF-2026)

Phases, gates, dependencies and the critical path. Task-level status lives in
`BACKLOG.md`; this file is the shape of the programme.

**No per-task due dates appear here.** Effort estimates and dependencies are
not approved, and inventing 211 dates against an unapproved baseline would be
fabricated precision. Dates arrive with the approved baseline.

---

## Phases

### Phase 0 — Baseline and governance *(current)*
Import the backlog, stand up project control, put the baseline and the open
founder decisions in front of Ethan. Exit: baseline approved or amended, E01
governance tasks under way.

### Phase 1 — Decide the business
E01 governance, E02 offer and Founding 25, E03 legal, privacy and lifecycle.
Runs immediately and in parallel. Everything commercial, legal and product
downstream inherits from here. Exit: commercial and legal gates ready for
review; the offer, entitlement and Keepsake rules ratified.

### Phase 2 — Build the product
E04 architecture, E05 couple experience, E06 Shared Timeline, E07 Venue Portal,
E08 engineering, E09 measurement, demo data and copy. This is the largest phase
and the one that must not be cut short: the product is polished before outreach,
and portal and reporting edge cases are not post-sale work. Exit: product and
data gates ready; UI, copy and demo environment frozen.

### Phase 3 — Research the market
E10 Greater Limerick universe and cohorts. Runs from day one in parallel with
Phases 1 and 2. Does not wait for product completion. Exit: Cohort 1 locked with
verified coordinates and contacts; Cohorts 2–4 ranked; reserve maintained.

### Phase 4 — Make the films
E13 Limerick First, E14 Before the Day. Pre-production starts now: scripts,
storyboards, map system, motion language. Final personalised renders wait on the
verified venue data (E10). Final product capture waits on the freeze (E05–E09).
Exit: creative gate ready; both films locked and founder-approved.

### Phase 5 — Ready the commercial system
E11 sales operating system, E12 website, proposal and asset system. Templates
can begin early; final versions wait on the offer, legal and UI locks.
Exit: sales-readiness gate ready; every commercial page QA'd.

### Phase 6 — Release *(1 September 2026)*
E15.01–E15.08. Go/no-go against all six gates, production verification of
billing, invitation, portal, Timeline and Keepsake, then Cohort 1 release.
Exit: Cohort 1 live, monitoring in place.

### Phase 7 — Complete the Founding 25 *(post-release, open-ended)*
E15.09–E15.18. Onboard every signed venue, run cohorts until 25 are paid, close
the founding offer at 25, switch new commercial surfaces to €1,500, postmortem
and hand over to operations. **The project stays open through this phase.**

---

## Milestones

| ID | Milestone | Date | Exit criteria |
|---|---|---|---|
| M1 | Baseline approved | not set | BASELINE_REVIEW answered; FD-01…FD-06 resolved or deferred; estimates approved or deferred |
| M2 | Offer, legal and lifecycle locked | not set | E01–E03 done and approved; commercial + legal gates passed |
| M3 | Product, portal and data locked | not set | E04–E09 done and approved; product + data gates passed; freeze in force |
| M4 | Films locked | not set | E13.17 and E14.18 done and approved; creative gate passed |
| M5 | Release | **2026-09-01** | All six gates passed or waived; E15.01 complete |
| M6 | Founding 25 complete — project closure | not set | 25 signed, paid, configured, onboarded, able to invite; E15.17 and E15.18 approved |

M5 is a release milestone. M6 closes the project. They are deliberately
separate (E01.03).

---

## The six release gates

| Gate | Owner | Supporting epics | Exit criteria (summary) |
|---|---|---|---|
| Commercial | founder | E02 | Offer, founding rate and entitlement ratified; renewal, lapse and continuity rules ratified; founding-place mechanics defined |
| Legal | founder | E03 | Agreement, founding schedule, DPA, couple terms drafted and reviewed; documented Irish legal and accounting review obtained; Keepsake and retention ratified |
| Product | claude_code | E04, E05, E06, E07 | Couple journey, Shared Timeline and Venue Portal complete; lifecycle implemented; design-system review passed, visual baselines locked |
| Data, security and reliability | claude_code | E08, E09 | Tenant isolation, authorisation and token security verified; backups, restore and incident response verified; instrumentation and reconciled reporting verified |
| Creative | codex_motion | E13, E14 | Cohort 1 renders QA'd; Before the Day master, captions and cutdowns QA'd; product-accuracy and privacy QA passed |
| Sales readiness | founder | E10, E11, E12 | Cohort 1 locked with verified contacts and coordinates; CRM, sequences, proposal and objection library ready; commercial pages QA'd |

---

## Major dependencies

Imported verbatim from the supplied backlog. Epic-level statements are recorded
as gating context; only the four critical blocking rules produced controlling
task-level edges (20 in total). Everything else is a *proposal* in
`BASELINE_REVIEW.md` and is not controlling until Ethan approves it.

**Epic-level gating (verbatim):**

- E01 — "Start now. Blocks every other workstream."
- E02 — "Start now. Blocks contracts, portal language, films, pricing pages and outreach."
- E03 — "Start now. Blocks live sales and live couple access."
- E04 — "Begins once E02 and E03 core decisions are stable."
- E05–E08 — "Launch-blocking."
- E09 — "Blocks trustworthy portal reports, product capture and final scripts."
- E10 — "Starts immediately in parallel. Does not wait for product completion."
- E11 — "Final system depends on offer and asset lock."
- E12 — "Final versions depend on E02, E03, E09 and the product UI lock."
- E13 — "Final rendering requires E02, E09 and E10."
- E14 — "Final product capture is blocked by E05–E09."
- E15 — "Begins after all six release gates pass."

**Controlling task-level edges:**

| Task | Depends on | Rule it came from |
|---|---|---|
| E09.12 | E02.01, E02.03, E02.12, E03.09 | Do not freeze commercial copy before the founding-rate, entitlement and keepsake rules are ratified |
| E14.15 | E05.12, E06.12, E07.18, E09.09, E09.12 | Do not capture final product footage before the couple experience, Timeline, Venue Portal and demo data are visually locked |
| E13.17 | E10.06, E10.08, E10.12, E13.15, E13.16 | Do not produce final personalised films before the venue coordinates, names, links and outreach cohorts are verified |
| E15.07 | E15.01–E15.06 | Do not send the first commercial invitation before contracts, billing, reporting, privacy documentation, support and the full live journey have passed QA |

---

## Critical path

120 of 211 tasks sit on the imported critical path:

```
E01.01–E01.11   governance, scope, gates, freeze dates
      ↓
E02.01–E02.12   offer, founding promise, entitlement
      ↓
E03.01–E03.12   legal, privacy, expiry, Keepsake
      ↓
E04.01–E04.10   venue/couple architecture
      ↓
E05 · E06 · E07 couple experience, Shared Timeline, portal and reporting
      ↓
E08 · E09       billing, security, reliability, instrumentation, demo data, copy
      ↓
E14.15          final product capture (only after the freeze)
      ↓
E13.17 · E14.18 film lock
      ↓
E12.14          commercial pages cleared
      ↓
E15.01          formal go/no-go
      ↓
E15.07          Cohort 1 released
      ↓
E15.15–E15.17   controlled cohorts until 25 paid; standard €1,500 takes over
```

A 120-task critical path on a 30-day run to release is the central schedule
fact of this project. It is recorded here as imported, not softened. Its
consequences are R-001 in `RAID.md`.

---

## Milestone exit criteria

Each milestone's exit criteria are held in `PROJECT_STATE.json` and reported by
`status launch`. A milestone is met when its criteria are evidenced and Ethan
approves. No milestone is met by date arrival.

---

## Schedule assumptions

Recorded as assumptions, not facts. Each is an A-record in `RAID.md`.

1. Release means "ready for the first cohort", not "all 25 venues live".
2. Pre-production on both films can proceed against unratified commercial
   figures, because the price animation (E13.08) is parameterised.
3. E10 research can complete without any product dependency.
4. Existing Venue Portal, Timeline and access work in `studio/` and `app/`
   reduces E04–E07 effort. **Unverified** — the reduction is unknown until
   task specifications are written against the current code.
5. Legal and accounting review (E03.12) is external, and its turnaround is
   outside Signal Studio's control.
6. One founder, two agent lanes, no additional capacity.

---

## Known schedule risks

| ID | Risk |
|---|---|
| R-001 | 120 critical-path tasks against 30 days to the release milestone |
| R-002 | E03.12 external legal and accounting review is unschedulable and gates the legal gate |
| R-003 | The founding-rate change (25 at €1,000) is unratified and is upstream of contracts, portal copy, films and every commercial page |
| R-004 | Final product capture (E14.15) sits behind four whole epics; any slip in E05–E09 moves both films |
| R-005 | Cohort 1 personalised renders need verified coordinates and contacts for 25 real venues that have not been researched yet |
| R-006 | Founder capacity is the single constraint on E02, E03, E11 and E15 |

Full entries, with probability, impact, owner, trigger and mitigation, are in
`RAID.md`.
