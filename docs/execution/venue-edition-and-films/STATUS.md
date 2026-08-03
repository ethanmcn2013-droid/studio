# STATUS — Venue Edition and Films (VEF-2026)

<!-- GENERATED FILE — DO NOT EDIT -->
> **Generated from PROJECT_STATE.json. Do not edit status data directly in this file.**
> Regenerate with `node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs render`.

**Report generated:** 2026-08-03T21:58:27.803Z (project timezone Europe/Dublin)
**State last updated:** 2026-08-03T21:58:27.803Z · session `wp14-timeline`
**Release date:** 2026-09-01 · **29 days remaining**
**Project completion condition:** 25 Greater Limerick founding venues are signed, paid, configured, onboarded and capable of issuing functioning couple invitations.

## Health

**AMBER** — E01, E04 and E10 are complete and founder-approved. 71 of 210 tasks Done (33.8%). R-015 and R-016 are fixed in code but INERT IN PRODUCTION until the venue-edition terms migration is applied — a P0 operator todo. The live commercial surfaces still carry the superseded position (I-002). Four verified privacy findings are open and unresolved: the suppression floor guards the population and not the count (R-027), the rate threshold has never run (R-028), /p is deliberately search-indexable while the privacy model assumes otherwise (R-031), and GA4 runs on public surfaces with no consent gate (R-032). E03 legal drafting is gated on the role map, which is in internal review with five critical findings open.

**Current phase:** Phase 1 — Decide the business (closing) / Phase 2 — Build the product (opening)
**Current release gate:** Commercial (not_started)
**Baseline:** approved (0.1.0)

## Completion

**Verified completion: 62.4%** — 131 of 210 tasks.
Basis: `provisional_task_count`. Provisional, count-based: no effort estimates are approved, so every task counts equally. This is not a measure of effort remaining.

**Delivery progress estimate:** 66.3% (estimate, not verified completion — status-credit model in REPORTING.md)

**Unestimated active tasks:** 157 of 210.

A task counts as complete only when its acceptance criteria are met, evidence is recorded, verification passed, and the founder has explicitly approved it.

## Task counts by status

| Status | Count |
|---|---|
| backlog | 65 |
| ready | 2 |
| in_progress | 0 |
| internal_review | 1 |
| founder_review | 9 |
| done | 131 |
| blocked | 2 |
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
| E05 | Couple planning experience and product polish | 9/12 | 75% | 0 | 0 |
| E06 | Shared Timeline and Keepsake artifact | 1/12 | 8.3% | 9 | 2 |
| E07 | Venue Portal, trust layer and renewal evidence | 18/18 | 100% | 0 | 0 |
| E08 | Billing, security, reliability and release engineering | 12/12 | 100% | 0 | 0 |
| E09 | Measurement, demo data and copy system | 12/12 | 100% | 0 | 0 |
| E10 | Greater Limerick venue universe and outreach cohorts | 14/14 | 100% | 0 | 0 |
| E11 | Sales operating system and founder-led outreach | 13/14 | 92.9% | 0 | 0 |
| E12 | Website, proposal and commercial asset system | 10/14 | 71.4% | 0 | 0 |
| E13 | Motion system and Limerick First invitation film | 4/18 | 22.2% | 0 | 0 |
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

**Awaiting founder review (9):**
- `E06.02` Add per-milestone visibility controls for private, title-and-date, image and short-story publication states. — claude_code
- `E06.03` Complete milestone photograph upload, crop, compression, orientation, alt text and deletion. — claude_code
- `E06.04` Complete milestone navigation and the transition from a Timeline point into its photograph and story. — claude_code
- `E06.05` Implement private-link, password-protected and intentionally public sharing modes. — claude_code
- `E06.06` Allow couples to conceal exact wedding dates, locations and other sensitive milestone information. — claude_code
- `E06.07` Implement anonymous aggregate viewer counts without exposing individual viewer behaviour. — claude_code
- `E06.09` Design and implement the intentional vertical mobile Timeline. — claude_code
- `E06.10` Refine the desktop editorial Timeline shown in the Mara and Finn concept. — claude_code
- `E06.11` Implement the post-wedding read-only Keepsake state and the agreed downloadable export. — claude_code

**Blocked (2):**
- `E06.01` Define the public artifact content model and what can never be published from the private workspace.
  - Blocked by: Built, verified and evidenced in Wave 4 (the Timeline allowlist boundary is the best-built privacy control in the programme), but it cannot enter Founder Review: it depends on E03.01 (the role map, still in internal review with critical findings) and E03.06 (public Timeline terms and analytics disclosure, backlog). Both are founder-lane legal and privacy tasks, and 'what can never be published' is exactly the question the role map answers. No dependency was waived because a waiver is the founder's to give and this one is substantive, not procedural.
- `E06.12` Complete unpublish, delete, broken-link, performance, accessibility, social-preview and cross-browser QA.
  - Blocked by: Built and evidenced, blocked behind E06.01 in the same chain: E06.12 depends on E06.01, which depends on E03.01 and E03.06. Unblock by settling the role map.

## Founder decisions required

1. Approve or reject `E06.02` — Add per-milestone visibility controls for private, title-and-date, image and short-story publication states.
2. Approve or reject `E06.03` — Complete milestone photograph upload, crop, compression, orientation, alt text and deletion.
3. Approve or reject `E06.04` — Complete milestone navigation and the transition from a Timeline point into its photograph and story.
4. Approve or reject `E06.05` — Implement private-link, password-protected and intentionally public sharing modes.
5. Approve or reject `E06.06` — Allow couples to conceal exact wedding dates, locations and other sensitive milestone information.
6. Approve or reject `E06.07` — Implement anonymous aggregate viewer counts without exposing individual viewer behaviour.
7. Approve or reject `E06.09` — Design and implement the intentional vertical mobile Timeline.
8. Approve or reject `E06.10` — Refine the desktop editorial Timeline shown in the Mara and Finn concept.
9. Approve or reject `E06.11` — Implement the post-wedding read-only Keepsake state and the agreed downloadable export.

## Completed since the last report

- 2026-08-03 `E14.13` Decide the exact placement of the standard price, founding rate and final walkthrough CTA.
- 2026-08-03 `E13.16` Generate unique tracked links, thumbnails and landing destinations for every personalised render.
- 2026-08-03 `E13.15` Build the parameterised rendering pipeline using venue name, coordinates, cohort and private CTA data.
- 2026-08-03 `E13.04` Build the data-driven map composition using verified venue coordinates and cohort metadata.
- 2026-08-03 `E13.03` Build the stylised Greater Limerick map geometry, River Shannon path and 15-, 30- and 45-minute rings.
- 2026-08-03 `E12.14` Complete analytics, conversion, responsive, accessibility, performance, copy and visual QA across every commercial page.
- 2026-08-03 `E12.09` Produce the concise one-page commercial proposal.
- 2026-08-03 `E12.08` Add the complete commercial, product, support, entitlement, Keepsake and renewal FAQ.
- 2026-08-03 `E12.07` Add the privacy explanation covering exactly what the venue sees and never sees.
- 2026-08-03 `E12.06` Add the Venue Portal trust-and-renewal preview.

## Three highest-value next actions

1. `E03.02` Draft the annual Venue Edition agreement and commercial order form. (p0, critical path)
2. `E03.03` Draft the Founding Venue schedule covering the €1,000 rate, continuity conditions, benefits and founding-place status. (p0, critical path)
3. `E03.10` Define cancellation, postponement, venue change, venue non-renewal, couple separation, account ownership and venue-workspace unlinking. (p0, critical path)

## Critical-path condition

87/120 critical-path tasks complete. 2 blocked: E06.01, E06.12

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

**Open sessions:** wp14-timeline (WP-14 · E06 Shared Timeline and Keepsake, plus R-031 and R-032 implementation and the Timeline workspace blocker) · wp15-term (WP-15 · R-015 access-term correctness in the app redemption path) · wp16-assets (WP-16 · R-042 sweep, standing banned-term check, and E12.10-E12.13 commercial assets)
**Last closed session:** wp13-commercial (2026-08-03T15:29:44.570Z) → `sessions/2026-08-03--wp13-commercial.md`

## Next recommended project-management action

Keep the focus task moving, clear anything in Founder Review, and re-run `render` before closing the session.

