# STATUS — Venue Edition and Films (VEF-2026)

<!-- GENERATED FILE — DO NOT EDIT -->
> **Generated from PROJECT_STATE.json. Do not edit status data directly in this file.**
> Regenerate with `node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs render`.

**Report generated:** 2026-08-04T11:43:42.918Z (project timezone Europe/Dublin)
**State last updated:** 2026-08-04T11:43:42.918Z · session `wp22-release`
**Release date:** 2026-09-01 · **28 days remaining**
**Project completion condition:** 25 Greater Limerick founding venues are signed, paid, configured, onboarded and capable of issuing functioning couple invitations.

## Health

**AMBER** — E01, E04 and E10 are complete and founder-approved. 71 of 210 tasks Done (33.8%). R-015 and R-016 are fixed in code but INERT IN PRODUCTION until the venue-edition terms migration is applied — a P0 operator todo. The live commercial surfaces still carry the superseded position (I-002). Four verified privacy findings are open and unresolved: the suppression floor guards the population and not the count (R-027), the rate threshold has never run (R-028), /p is deliberately search-indexable while the privacy model assumes otherwise (R-031), and GA4 runs on public surfaces with no consent gate (R-032). E03 legal drafting is gated on the role map, which is in internal review with five critical findings open.

**Current phase:** Phase 1 — Decide the business (closing) / Phase 2 — Build the product (opening)
**Current release gate:** Commercial (not_started)
**Baseline:** approved (0.1.0)

## Completion

**Verified completion: 69.7%** — 147 of 211 tasks.
Basis: `provisional_task_count`. Provisional, count-based: no effort estimates are approved, so every task counts equally. This is not a measure of effort remaining.

**Delivery progress estimate:** 79.3% (estimate, not verified completion — status-credit model in REPORTING.md)

**Unestimated active tasks:** 158 of 211.

A task counts as complete only when its acceptance criteria are met, evidence is recorded, verification passed, and the founder has explicitly approved it.

## Task counts by status

| Status | Count |
|---|---|
| backlog | 35 |
| ready | 1 |
| in_progress | 0 |
| internal_review | 0 |
| founder_review | 24 |
| done | 147 |
| blocked | 4 |
| deferred | 2 |
| cancelled | 0 |
| **total** | **213** |

## Progress by epic

| Epic | Title | Done/Active | % | In flight | Blocked |
|---|---|---|---|---|---|
| E01 | Project governance and control | 12/12 | 100% | 0 | 0 |
| E02 | Commercial offer and Founding 25 programme | 10/13 | 76.9% | 3 | 0 |
| E03 | Legal, privacy and account-lifecycle rules | 4/11 | 36.4% | 7 | 0 |
| E04 | Product architecture and workspace lifecycle | 12/12 | 100% | 0 | 0 |
| E05 | Couple planning experience and product polish | 9/12 | 75% | 0 | 0 |
| E06 | Shared Timeline and Keepsake artifact | 12/12 | 100% | 0 | 0 |
| E07 | Venue Portal, trust layer and renewal evidence | 18/18 | 100% | 0 | 0 |
| E08 | Billing, security, reliability and release engineering | 12/12 | 100% | 0 | 0 |
| E09 | Measurement, demo data and copy system | 12/12 | 100% | 0 | 0 |
| E10 | Greater Limerick venue universe and outreach cohorts | 14/14 | 100% | 0 | 0 |
| E11 | Sales operating system and founder-led outreach | 13/14 | 92.9% | 0 | 0 |
| E12 | Website, proposal and commercial asset system | 14/15 | 93.3% | 0 | 0 |
| E13 | Motion system and Limerick First invitation film | 4/18 | 22.2% | 0 | 0 |
| E14 | Before the Day Venue Edition film | 1/18 | 5.6% | 0 | 0 |
| E15 | Release, venue onboarding and completion of the Founding 25 | 0/18 | 0% | 14 | 4 |

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
| Offer freeze | 2026-08-15 | 11 | Price, founding terms, entitlement and the founding-place mechanics stop changing. After this a change needs a change request. |
| UI freeze | 2026-08-20 | 16 | Couple experience, Timeline and Account surfaces stop changing visually. Bug fixes only. |
| Copy freeze | 2026-08-21 | 17 | Every venue-facing and couple-facing string is final, including the commercial pages. |
| Capture freeze | 2026-08-22 | 18 | Product footage for Before the Day is captured against a locked build. Nothing filmed after this is re-shot. |
| Film lock | 2026-08-28 | 24 | Both films are locked: no further edit, no further render, QA complete. |
| Release candidate | 2026-08-30 | 26 | The build that goes live on 1 September exists and is the one being verified. |

## Current work

**Focus task:** none — No focus task. Baseline approval comes first.

**In progress (0/3):**
- None.

**Internal review (0):**
- None.

**Awaiting founder review (24):**
- `E02.04` Define continuous-renewal requirements and what happens after a missed payment, cancellation, lapse or later reactivation. — founder
- `E02.06` Exclude VAT, taxes, optional future add-ons, third-party charges and materially separate products from the locked base price. — founder
- `E02.07` Ratify annual prepayment, invoice timing, renewal dates, renewal notices, failed payments, cancellation and refund rules. — founder
- `E03.02` Draft the annual Venue Edition agreement and commercial order form. — founder
- `E03.03` Draft the Founding Venue schedule covering the €1,000 rate, continuity conditions, benefits and founding-place status. — founder
- `E03.04` Draft the data-processing agreement, security schedule, subprocessor schedule and data-breach responsibilities. — founder
- `E03.05` Finalise the couple terms of service and couple-facing privacy notice. — founder
- `E03.06` Finalise public Timeline terms, viewer privacy language, analytics disclosure and cookie requirements. — founder
- `E03.10` Define cancellation, postponement, venue change, venue non-renewal, couple separation, account ownership and venue-workspace unlinking. — founder
- `E03.11` Ratify data retention, deletion, service-discontinuation exports, legitimate-interest outreach, opt-outs and suppression-list requirements. — founder
- `E15.01` Run the formal launch go/no-go review against commercial, legal, product, data, creative and sales gates. — founder
- `E15.04` Complete live Venue Portal, Usage, PDF, CSV and renewal-report tests. — founder
- `E15.05` Complete live shared Timeline, viewer-count, unpublish, export and Keepsake tests. — founder
- `E15.06` Confirm that contracts, privacy notices, analytics, support channels, monitoring and incident procedures are live. — founder
- `E15.08` Monitor product, email, landing-page, booking, film and portal performance during the first release window. — founder
- `E15.09` Complete signed-venue handoff from sales into onboarding. — founder
- `E15.10` Collect venue branding, configure the account, invite venue members and approve the couple experience. — founder
- `E15.11` Train the venue and support it through its first real couple invitation and redemption. — founder
- `E15.12` Run seven-day and 30-day venue reviews covering adoption, friction, support and next action. — founder
- `E15.13` Operate the direct founder channel and structured founding-request intake without creating uncontrolled custom scope. — founder
- `E15.14` Secure permissioned venue evidence, couple evidence, referrals and public map/name approval. — founder
- `E15.15` Release Cohorts 2, 3, 4 and reserve accounts as necessary until 25 venues are signed and paid. — founder
- `E15.17` Close the founding offer at 25 paid agreements, switch all new commercial surfaces to €1,500 and prepare the first renewal cycle. — founder
- `E15.18` Complete the project postmortem, archive final assets, update the business plan and market-entry documents, and transfer ongoing work into operations. — founder

**Blocked (4):**
- `E15.02` Complete a real production billing and founding-rate test.
  - Blocked by: Verifier corrected this to BLOCKED: it cannot be verified without a real venue, a cleared payment or a real couple. REFUTED. "Partial" is too generous and I would not let it stand. Everything WP-22 says it RAN, it really ran: I re-ran all of it and got the identical 742/742/0, the identical 21 integrity checks, and the identical three append-only tests, and I read the test bodies to confirm the append-only refusal is demonstrated against a real database rather than asserted. That half is CONFIRMED and it is good work. The problem is step 4, and step 4 is the hinge. It is recorded as PASS on the strength of an operator todo that says the exact opposite in the canonical tree: status open, P0, blocking, "founding_number and founding_number_assigned_at are absent from entitlements-prod", verified by direct query. WP-22 read a copy on its own branch that is thirteen hours stale and quoted from a block the file itself labels Superseded. So the one production-facing fact in the whole document is false, and i
- `E15.03` Complete a real invitation, redemption, account creation and branded workspace test.
  - Blocked by: Verifier corrected this to BLOCKED: it cannot be verified without a real venue, a cleared payment or a real couple. DOWNGRADE from 'partial' to BLOCKED, and correct the document before it is put in front of the founder. What is genuinely true and should be kept: the access-term arithmetic is correct against D-022, it is covered by nine passing tests I re-ran myself, step 1 PASS is real, and step 2 FAIL is real and is a correctly-identified release blocker. The document's section 7 ('Not run, and why') is honest. Two of the claim's own findings — the unread entitlements.wedding_date column and the second untracked implementation in the dirty app tree — are both CONFIRMED by me independently, and volunteering them was right. Why 'partial' overstates it. 'Partial' implies the remaining steps are waiting on time, an account and a deployment. They are not. Three of the ten acceptance criteria (AC3, AC4, AC5) cannot be satisfied by any human following this script, before or after the branch deploys, because
- `E15.07` Release Cohort 1 and record every personalised touch and response.
  - Blocked by: Verification procedure written and evidenced, but it cannot run: it depends on E15.02 and E15.03 (both blocked on a real cleared payment and a real couple), on E13.17 (the 25 Cohort 1 film renders, Codex motion lane), and on E11.04 (the DMARC enforcement ramp). No dependency waived - each is a genuine real-world prerequisite, not a procedural one.
- `E15.16` Maintain the authoritative founding-place counter, assign 01/25–25/25 numbers and publish only permissioned venue names.
  - Blocked by: Verifier corrected this to BLOCKED: it cannot be verified without a real venue, a cleared payment or a real couple. REFUTED — reject 'partial' and do not accept E15.16 into Founder Review. The engineering underneath is genuinely strong and I confirmed it: the assigner is idempotent, refuses before payment clears, refuses non-founding plans, never reissues a withdrawn number, and 37 tests across two suites pass on re-run. But the evidence document's step 1 reports the production schema as PASS by quoting a section of the operator todo that is explicitly headed 'Superseded', while that same todo is status: open and records founding_number as ABSENT from entitlements-prod by direct query. My own query confirms the todo, not the evidence. That makes four of the eight criteria refuted rather than untested, and turns step 6 from 'NOT RUN' into red: the integrity gate exits 127 against production today. Three fixes before this is re-submitted: (a) Ethan applies the second migration pass, then step 1 and step

## Founder decisions required

1. Approve or reject `E02.04` — Define continuous-renewal requirements and what happens after a missed payment, cancellation, lapse or later reactivation.
2. Approve or reject `E02.06` — Exclude VAT, taxes, optional future add-ons, third-party charges and materially separate products from the locked base price.
3. Approve or reject `E02.07` — Ratify annual prepayment, invoice timing, renewal dates, renewal notices, failed payments, cancellation and refund rules.
4. Approve or reject `E03.02` — Draft the annual Venue Edition agreement and commercial order form.
5. Approve or reject `E03.03` — Draft the Founding Venue schedule covering the €1,000 rate, continuity conditions, benefits and founding-place status.
6. Approve or reject `E03.04` — Draft the data-processing agreement, security schedule, subprocessor schedule and data-breach responsibilities.
7. Approve or reject `E03.05` — Finalise the couple terms of service and couple-facing privacy notice.
8. Approve or reject `E03.06` — Finalise public Timeline terms, viewer privacy language, analytics disclosure and cookie requirements.
9. Approve or reject `E03.10` — Define cancellation, postponement, venue change, venue non-renewal, couple separation, account ownership and venue-workspace unlinking.
10. Approve or reject `E03.11` — Ratify data retention, deletion, service-discontinuation exports, legitimate-interest outreach, opt-outs and suppression-list requirements.
11. Approve or reject `E15.01` — Run the formal launch go/no-go review against commercial, legal, product, data, creative and sales gates.
12. Approve or reject `E15.04` — Complete live Venue Portal, Usage, PDF, CSV and renewal-report tests.
13. Approve or reject `E15.05` — Complete live shared Timeline, viewer-count, unpublish, export and Keepsake tests.
14. Approve or reject `E15.06` — Confirm that contracts, privacy notices, analytics, support channels, monitoring and incident procedures are live.
15. Approve or reject `E15.08` — Monitor product, email, landing-page, booking, film and portal performance during the first release window.
16. Approve or reject `E15.09` — Complete signed-venue handoff from sales into onboarding.
17. Approve or reject `E15.10` — Collect venue branding, configure the account, invite venue members and approve the couple experience.
18. Approve or reject `E15.11` — Train the venue and support it through its first real couple invitation and redemption.
19. Approve or reject `E15.12` — Run seven-day and 30-day venue reviews covering adoption, friction, support and next action.
20. Approve or reject `E15.13` — Operate the direct founder channel and structured founding-request intake without creating uncontrolled custom scope.
21. Approve or reject `E15.14` — Secure permissioned venue evidence, couple evidence, referrals and public map/name approval.
22. Approve or reject `E15.15` — Release Cohorts 2, 3, 4 and reserve accounts as necessary until 25 venues are signed and paid.
23. Approve or reject `E15.17` — Close the founding offer at 25 paid agreements, switch all new commercial surfaces to €1,500 and prepare the first renewal cycle.
24. Approve or reject `E15.18` — Complete the project postmortem, archive final assets, update the business plan and market-entry documents, and transfer ongoing work into operations.

## Completed since the last report

- 2026-08-04 `E12.13` Produce the post-booking couple welcome kit, approved email wording and printable welcome object.
- 2026-08-04 `E12.12` Produce the pre-booking venue sales kit for brochures, proposals, websites and coordinator conversations.
- 2026-08-04 `E12.11` Redesign the Founding Venue certificate as 01/25 through 25/25 with the €1,000 founding rate.
- 2026-08-04 `E12.10` Produce the detailed Venue Edition sales deck.
- 2026-08-04 `E06.12` Complete unpublish, delete, broken-link, performance, accessibility, social-preview and cross-browser QA.
- 2026-08-04 `E06.11` Implement the post-wedding read-only Keepsake state and the agreed downloadable export.
- 2026-08-04 `E06.10` Refine the desktop editorial Timeline shown in the Mara and Finn concept.
- 2026-08-04 `E06.09` Design and implement the intentional vertical mobile Timeline.
- 2026-08-04 `E06.07` Implement anonymous aggregate viewer counts without exposing individual viewer behaviour.
- 2026-08-04 `E06.06` Allow couples to conceal exact wedding dates, locations and other sensitive milestone information.

## Three highest-value next actions

1. `E05.02` Design the venue-branded welcome experience with “Compliments of [Venue]” and no visible price. (p1, critical path)
2. `E05.11` Complete responsive, mobile, accessibility, loading, empty, error, permission and tasteful motion passes across the couple journey. (p1, critical path)
3. `E13.01` Write the formal creative brief for the personalised Limerick First invitation film. (p1)

## Critical-path condition

99/120 critical-path tasks complete. 2 blocked: E15.07, E15.16

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

**Open sessions:** none
**Last closed session:** wp22-release (2026-08-04T11:43:42.918Z) → `sessions/2026-08-04--wp22-release.md`

## Next recommended project-management action

Keep the focus task moving, clear anything in Founder Review, and re-run `render` before closing the session.

