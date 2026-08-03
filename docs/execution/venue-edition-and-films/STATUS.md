# STATUS — Venue Edition and Films (VEF-2026)

<!-- GENERATED FILE — DO NOT EDIT -->
> **Generated from PROJECT_STATE.json. Do not edit status data directly in this file.**
> Regenerate with `node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs render`.

**Report generated:** 2026-08-03T02:33:41.907Z (project timezone Europe/Dublin)
**State last updated:** 2026-08-03T02:33:41.907Z · session `eed55e9e-deploy`
**Release date:** 2026-09-01 · **29 days remaining**
**Project completion condition:** 25 Greater Limerick founding venues are signed, paid, configured, onboarded and capable of issuing functioning couple invitations.

## Health

**AMBER** — E01, E04 and E10 are complete and founder-approved. 71 of 210 tasks Done (33.8%). R-015 and R-016 are fixed in code but INERT IN PRODUCTION until the venue-edition terms migration is applied — a P0 operator todo. The live commercial surfaces still carry the superseded position (I-002). Four verified privacy findings are open and unresolved: the suppression floor guards the population and not the count (R-027), the rate threshold has never run (R-028), /p is deliberately search-indexable while the privacy model assumes otherwise (R-031), and GA4 runs on public surfaces with no consent gate (R-032). E03 legal drafting is gated on the role map, which is in internal review with five critical findings open.

**Current phase:** Phase 1 — Decide the business (closing) / Phase 2 — Build the product (opening)
**Current release gate:** Commercial (not_started)
**Baseline:** approved (0.1.0)

## Completion

**Verified completion: 33.8%** — 71 of 210 tasks.
Basis: `provisional_task_count`. Provisional, count-based: no effort estimates are approved, so every task counts equally. This is not a measure of effort remaining.

**Delivery progress estimate:** 34.1% (estimate, not verified completion — status-credit model in REPORTING.md)

**Unestimated active tasks:** 187 of 210.

A task counts as complete only when its acceptance criteria are met, evidence is recorded, verification passed, and the founder has explicitly approved it.

## Task counts by status

| Status | Count |
|---|---|
| backlog | 134 |
| ready | 4 |
| in_progress | 0 |
| internal_review | 1 |
| founder_review | 0 |
| done | 71 |
| blocked | 0 |
| deferred | 2 |
| cancelled | 0 |
| **total** | **212** |

## Progress by epic

| Epic | Title | Done/Active | % | In flight | Blocked |
|---|---|---|---|---|---|
| E01 | Project governance and control | 12/12 | 100% | 0 | 0 |
| E02 | Commercial offer and Founding 25 programme | 10/13 | 76.9% | 0 | 0 |
| E03 | Legal, privacy and account-lifecycle rules | 3/11 | 27.3% | 1 | 0 |
| E04 | Product architecture and workspace lifecycle | 12/12 | 100% | 0 | 0 |
| E05 | Couple planning experience and product polish | 0/12 | 0% | 0 | 0 |
| E06 | Shared Timeline and Keepsake artifact | 1/12 | 8.3% | 0 | 0 |
| E07 | Venue Portal, trust layer and renewal evidence | 0/18 | 0% | 0 | 0 |
| E08 | Billing, security, reliability and release engineering | 0/12 | 0% | 0 | 0 |
| E09 | Measurement, demo data and copy system | 4/12 | 33.3% | 0 | 0 |
| E10 | Greater Limerick venue universe and outreach cohorts | 14/14 | 100% | 0 | 0 |
| E11 | Sales operating system and founder-led outreach | 13/14 | 92.9% | 0 | 0 |
| E12 | Website, proposal and commercial asset system | 1/14 | 7.1% | 0 | 0 |
| E13 | Motion system and Limerick First invitation film | 0/18 | 0% | 0 | 0 |
| E14 | Before the Day Venue Edition film | 1/18 | 5.6% | 0 | 0 |
| E15 | Release, venue onboarding and completion of the Founding 25 | 0/18 | 0% | 0 | 0 |

## Release-gate readiness

A high task percentage never overrides a failed gate. The go/no-go milestone cannot pass unless every gate has passed or carries a documented founder waiver.

| Gate | Owner | Status | Exit criteria | Supporting epics | Blockers | Passed |
|---|---|---|---|---|---|---|
| Commercial | founder | **not_started** | 13 | E02, E01 | — | — |
| Legal | founder | **not_started** | 12 | E03 | 1 | — |
| Product | claude_code | **not_started** | 12 | E04, E05, E06, E07 | — | — |
| Data, security and reliability | claude_code | **not_started** | 12 | E08, E09 | — | — |
| Creative | codex_motion | **not_started** | 13 | E13, E14 | — | — |
| Sales readiness | founder | **not_started** | 13 | E10, E11, E12, E15 | — | — |

## Milestones

The release milestone and the completion condition are separate and never reported as one figure (E01.03).

| Milestone | Target | Status | Exit criteria |
|---|---|---|---|
| M1 Baseline approved | outcome-driven, undated | open | 3 |
| M2 Offer, legal and lifecycle locked | outcome-driven, undated | open | 2 |
| M3 Product, portal and data locked | outcome-driven, undated | open | 3 |
| M4 Films locked | outcome-driven, undated | open | 2 |
| M5 Release — 1 September 2026 | 2026-09-01 | open | 2 |
| M6 Founding 25 complete — project closure | outcome-driven, undated | open | 3 |

## Freeze dates

Ratified in D-008. Moving one is change control, not an edit.

| Freeze | Date | Days left | What stops changing |
|---|---|---|---|
| Offer freeze | 2026-08-15 | 12 | Price, founding terms, entitlement and the founding-place mechanics stop changing. After this a change needs a change request. |
| UI freeze | 2026-08-20 | 17 | Couple experience, Timeline and Account surfaces stop changing visually. Bug fixes only. |
| Copy freeze | 2026-08-21 | 18 | Every venue-facing and couple-facing string is final, including the commercial pages. |
| Capture freeze | 2026-08-22 | 19 | Product footage for Before the Day is captured against a locked build. Nothing filmed after this is re-shot. |
| Film lock | 2026-08-28 | 25 | Both films are locked: no further edit, no further render, QA complete. |
| Release candidate | 2026-08-30 | 27 | The build that goes live on 1 September exists and is the one being verified. |

## Current work

**Focus task:** none — No focus task. Baseline approval comes first.

**In progress (0/3):**
- None.

**Internal review (1):**
- `E03.01` Determine the controller, joint-controller and processor roles across Signal Studio, the venue, the couple and public Timeline viewers. — founder

**Awaiting founder review (0):**
- None.

**Blocked (0):**
- None.

## Founder decisions required

- None.

## Completed since the last report

- 2026-08-03 `E14.13` Decide the exact placement of the standard price, founding rate and final walkthrough CTA.
- 2026-08-03 `E12.04` Present the €1,500 standard price, €1,000 founding rate, founding conditions and annual prepayment clearly.
- 2026-08-03 `E11.15` Run a weekly conversion review covering cohort, channel, meeting quality, objections, proposals, wins and next-cohort changes.
- 2026-08-03 `E11.14` Define founding-slot holds, proposal expiry, payment-to-lock procedure, close-lost reasons, referral asks and publicity consent.
- 2026-08-03 `E11.13` Define the follow-up sequence, no-response sequence and respectful stopping rule.
- 2026-08-03 `E11.12` Build the objection library covering price, adoption, privacy, support, existing tools, implementation and product maturity.
- 2026-08-03 `E11.11` Write the post-demo proposal, commercial summary, order form and same-day follow-up.
- 2026-08-03 `E11.10` Write the live product walkthrough and demonstration sequence.
- 2026-08-03 `E11.09` Write the discovery-call structure and qualification questions.
- 2026-08-03 `E11.08` Build the booking flow and meeting-confirmation sequence.

## Three highest-value next actions

1. `E03.02` Draft the annual Venue Edition agreement and commercial order form. (p0, critical path)
2. `E03.03` Draft the Founding Venue schedule covering the €1,000 rate, continuity conditions, benefits and founding-place status. (p0, critical path)
3. `E03.10` Define cancellation, postponement, venue change, venue non-renewal, couple separation, account ownership and venue-workspace unlinking. (p0, critical path)

## Critical-path condition

39/120 critical-path tasks complete. 0 blocked.

Chain: E01 governance → E02 offer → E03 legal → E04 architecture → E05/E06/E07 product, Timeline, portal → E08/E09 engineering, data, copy → E14.15 product capture → E13.17/E14.18 film lock → E12.14 commercial pages → E15.01 go/no-go → E15.07 Cohort 1 → E15.15–E15.17 to 25 paid.

## Founding 25 — commercial outcome

Tracked separately from backlog completion. Sending 25 invitations is not the outcome; 25 signed, paid and onboarded venues is.

| Measure | Value |
|---|---|
| Founding target | 25 |
| Founding places available | 25 |
| Researched account universe | 219 |
| Cohorts ready | cohort1 |
| Invitations issued | 0 |
| Responses | 0 |
| Qualified meetings | 0 |
| Demonstrations | 0 |
| Proposals | 0 |
| Signed agreements | 0 |
| **Paid agreements** | **0 / 25** |
| Configured venue accounts | 0 |
| **Onboarded venues** | **0 / 25** |
| First couple invitations | 0 |
| First couple activations | 0 |

## Film deliverable state

### Limerick First — Founding Invitation Film (E13, lane `codex_motion`)

0/15 stages complete. A draft render is not a complete film.

`creative_brief`: not_started · `script`: not_started · `legal_copy`: not_started · `storyboard`: not_started · `map_data`: not_started · `map_system`: not_started · `animatic`: not_started · `voiceover`: not_started · `music_and_sound`: not_started · `master_composition`: not_started · `personalisation_pipeline`: not_started · `cohort_1_renders`: not_started · `qa`: not_started · `approval`: not_started · `release_readiness`: not_started

### Before the Day — Venue Edition Film (E14, lane `codex_motion`)

0/19 stages complete. A draft render is not a complete film.

`creative_brief`: not_started · `narrative`: not_started · `script`: not_started · `storyboard`: not_started · `product_ui_lock`: not_started · `demo_data_lock`: not_started · `capture_plan`: not_started · `product_capture`: not_started · `timeline_hero_sequence`: not_started · `portal_sequence`: not_started · `voiceover`: not_started · `music_and_sound`: not_started · `edit`: not_started · `captions`: not_started · `aspect_ratio_versions`: not_started · `product_accuracy_qa`: not_started · `privacy_qa`: not_started · `founder_approval`: not_started · `release_readiness`: not_started

## Session

**Open sessions:** wp03-e0506-audit (E05/E06 audit against shipped implementation, per D-015 Q2) · wp05-portal (WP-05 Venue Portal audit and completion (E07.01-E07.18)) · wp06-measurement (WP-06 instrumentation, demo fixture and copy (E09 remainder)) · wp12-mapsystem (WP-12 map system and render pipeline (E13.03,.04,.15,.16))
**Last closed session:** eed55e9e-deploy (2026-08-03T02:33:41.907Z) → `sessions/2026-08-03--eed55e9e-deploy.md`

## Next recommended project-management action

Keep the focus task moving, clear anything in Founder Review, and re-run `render` before closing the session.

