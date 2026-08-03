# STATUS — Venue Edition and Films (VEF-2026)

<!-- GENERATED FILE — DO NOT EDIT -->
> **Generated from PROJECT_STATE.json. Do not edit status data directly in this file.**
> Regenerate with `node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs render`.

**Report generated:** 2026-08-03T01:06:29.800Z (project timezone Europe/Dublin)
**State last updated:** 2026-08-03T01:06:29.800Z · session `045404f1-wp02`
**Release date:** 2026-09-01 · **29 days remaining**
**Project completion condition:** 25 Greater Limerick founding venues are signed, paid, configured, onboarded and capable of issuing functioning couple invitations.

## Health

**AMBER** — Every founder decision from Rounds 1 and 2 is now answered, including FD-03. The legal gate is achievable again. Two exposures accepted by decision (R-021 no volume screen, R-022 VAT-inclusive under a permanent lock) and one live product defect: R-015, the ratified access-term grace rule is refused by shipped code, which today would cost a long-lead couple their workspace before their wedding. 161 of 211 tasks are executable without the founder.

**Current phase:** Phase 1 — Decide the business (closing) / Phase 2 — Build the product (opening)
**Current release gate:** Commercial (not_started)
**Baseline:** approved (0.1.0)

## Completion

**Verified completion: 25.8%** — 54 of 209 tasks.
Basis: `provisional_task_count`. Provisional, count-based: no effort estimates are approved, so every task counts equally. This is not a measure of effort remaining.

**Delivery progress estimate:** 27.6% (estimate, not verified completion — status-credit model in REPORTING.md)

**Unestimated active tasks:** 188 of 209.

A task counts as complete only when its acceptance criteria are met, evidence is recorded, verification passed, and the founder has explicitly approved it.

## Task counts by status

| Status | Count |
|---|---|
| backlog | 135 |
| ready | 4 |
| in_progress | 15 |
| internal_review | 0 |
| founder_review | 0 |
| done | 54 |
| blocked | 1 |
| deferred | 2 |
| cancelled | 0 |
| **total** | **211** |

## Progress by epic

| Epic | Title | Done/Active | % | In flight | Blocked |
|---|---|---|---|---|---|
| E01 | Project governance and control | 12/12 | 100% | 0 | 0 |
| E02 | Commercial offer and Founding 25 programme | 9/12 | 75% | 0 | 0 |
| E03 | Legal, privacy and account-lifecycle rules | 3/11 | 27.3% | 0 | 1 |
| E04 | Product architecture and workspace lifecycle | 11/12 | 91.7% | 1 | 0 |
| E05 | Couple planning experience and product polish | 0/12 | 0% | 0 | 0 |
| E06 | Shared Timeline and Keepsake artifact | 1/12 | 8.3% | 0 | 0 |
| E07 | Venue Portal, trust layer and renewal evidence | 0/18 | 0% | 0 | 0 |
| E08 | Billing, security, reliability and release engineering | 0/12 | 0% | 0 | 0 |
| E09 | Measurement, demo data and copy system | 4/12 | 33.3% | 0 | 0 |
| E10 | Greater Limerick venue universe and outreach cohorts | 0/14 | 0% | 14 | 0 |
| E11 | Sales operating system and founder-led outreach | 13/14 | 92.9% | 0 | 0 |
| E12 | Website, proposal and commercial asset system | 0/14 | 0% | 0 | 0 |
| E13 | Motion system and Limerick First invitation film | 0/18 | 0% | 0 | 0 |
| E14 | Before the Day Venue Edition film | 1/18 | 5.6% | 0 | 0 |
| E15 | Release, venue onboarding and completion of the Founding 25 | 0/18 | 0% | 0 | 0 |

## Release-gate readiness

A high task percentage never overrides a failed gate. The go/no-go milestone cannot pass unless every gate has passed or carries a documented founder waiver.

| Gate | Owner | Status | Exit criteria | Supporting epics | Blockers | Passed |
|---|---|---|---|---|---|---|
| Commercial | founder | **not_started** | 12 | E02 | — | — |
| Legal | founder | **not_started** | 12 | E03 | 1 | — |
| Product | claude_code | **not_started** | 12 | E04, E05, E06, E07 | — | — |
| Data, security and reliability | claude_code | **not_started** | 12 | E08, E09 | — | — |
| Creative | codex_motion | **not_started** | 13 | E13, E14 | — | — |
| Sales readiness | founder | **not_started** | 12 | E10, E11, E12 | — | — |

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

**In progress (15/3):**
- `E04.01` Define the data entities for venue, agreement, term, founding status, member, invitation, couple workspace and public artifact. — claude_code
- `E10.01` Define the public geographic term and exact boundary for the “Greater Limerick wedding market.” — claude_code
- `E10.02` Define eligible venue types and exclude businesses that are not credible annual Venue Edition buyers. — claude_code
- `E10.03` Build the venue-ranking score using wedding focus, brand quality, likely booking volume, decision accessibility and strategic fit. — claude_code
- `E10.04` Build a master researched universe of at least 125 accounts, or formally document the available market shortfall. — claude_code
- `E10.05` Deduplicate venue groups, hotels with multiple properties, shared operators and renamed properties. — claude_code
- `E10.06` Record accurate map coordinates, geographic cluster and drive-time ring for every account. — claude_code
- `E10.07` Identify the likely buyer and secondary contact at each venue: owner, general manager, wedding manager, sales lead or events lead. — claude_code
- `E10.08` Verify direct emails, phone numbers, postal addresses, LinkedIn profiles and current employment. — claude_code
- `E10.09` Research each venue’s wedding proposition, package structure, likely annual volume and current couple-planning experience. — claude_code
- `E10.10` Review each venue’s website, brochure, social presence and digital customer experience. — claude_code
- `E10.11` Write one honest, venue-specific reason each account belongs in the founding outreach. — claude_code
- `E10.12` Rank and lock Cohort 1 containing the first 25 venues. — claude_code
- `E10.13` Rank and lock Cohorts 2, 3 and 4, each containing the next 25 venues. — claude_code
- `E10.14` Maintain a reserve cohort, contact-verification dates, conflict flags and consent status for public naming or map publication. — claude_code

**Internal review (0):**
- None.

**Awaiting founder review (0):**
- None.

**Blocked (1):**
- `E03.01` Determine the controller, joint-controller and processor roles across Signal Studio, the venue, the couple and public Timeline viewers.
  - Blocked by: Two blind derivations completed and agreed on 26 substantive points, but the reconciled role-map document was never written to disk and one of two adversarial reviewers returned UNSOUND. Two of its load-bearing factual premises were verified WRONG by the main session: the dietary-notes venue flow does not exist (R-017 corrected), and /p is deliberately search-indexable while the map assumes every published surface is token-bound (R-031). The derivations are sound reasoning on partly wrong facts. Needs a second pass on corrected premises before it can gate E03.04/05/06.

## Founder decisions required

- None.

## Completed since the last report

- 2026-08-03 `E14.13` Decide the exact placement of the standard price, founding rate and final walkthrough CTA.
- 2026-08-03 `E11.15` Run a weekly conversion review covering cohort, channel, meeting quality, objections, proposals, wins and next-cohort changes.
- 2026-08-03 `E11.14` Define founding-slot holds, proposal expiry, payment-to-lock procedure, close-lost reasons, referral asks and publicity consent.
- 2026-08-03 `E11.13` Define the follow-up sequence, no-response sequence and respectful stopping rule.
- 2026-08-03 `E11.12` Build the objection library covering price, adoption, privacy, support, existing tools, implementation and product maturity.
- 2026-08-03 `E11.11` Write the post-demo proposal, commercial summary, order form and same-day follow-up.
- 2026-08-03 `E11.10` Write the live product walkthrough and demonstration sequence.
- 2026-08-03 `E11.09` Write the discovery-call structure and qualification questions.
- 2026-08-03 `E11.08` Build the booking flow and meeting-confirmation sequence.
- 2026-08-03 `E11.07` Define how each private personalised film and landing page is delivered without sending large video attachments.

## Three highest-value next actions

1. `E03.02` Draft the annual Venue Edition agreement and commercial order form. (p0, critical path)
2. `E03.03` Draft the Founding Venue schedule covering the €1,000 rate, continuity conditions, benefits and founding-place status. (p0, critical path)
3. `E03.10` Define cancellation, postponement, venue change, venue non-renewal, couple separation, account ownership and venue-workspace unlinking. (p0, critical path)

## Critical-path condition

37/119 critical-path tasks complete. 1 blocked: E03.01

Chain: E01 governance → E02 offer → E03 legal → E04 architecture → E05/E06/E07 product, Timeline, portal → E08/E09 engineering, data, copy → E14.15 product capture → E13.17/E14.18 film lock → E12.14 commercial pages → E15.01 go/no-go → E15.07 Cohort 1 → E15.15–E15.17 to 25 paid.

## Founding 25 — commercial outcome

Tracked separately from backlog completion. Sending 25 invitations is not the outcome; 25 signed, paid and onboarded venues is.

| Measure | Value |
|---|---|
| Founding target | 25 |
| Founding places available | 25 |
| Researched account universe | 0 |
| Cohorts ready | none |
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

**Open sessions:** 045404f1-wp02 (WP-02 — Greater Limerick venue universe and cohorts (E10.01-E10.14))
**Last closed session:** wp03-reapprove (2026-08-03T01:04:43.699Z) → `sessions/2026-08-03--wp03-reapprove.md`

## Next recommended project-management action

Keep the focus task moving, clear anything in Founder Review, and re-run `render` before closing the session.

