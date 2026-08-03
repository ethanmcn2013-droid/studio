# Master backlog — verbatim import source (VEF-2026)

**This file is the import record. It is a faithful transcription of the master
backlog supplied by the founder on 2026-08-02. Titles are preserved exactly.
Do not edit titles here to make them read better — a title change is a
CHANGELOG event, made through `tools/project-control.mjs`, not a silent edit.**

`tools/import-backlog.mjs` parses this file to build `PROJECT_STATE.json`.
Parse contract: epics are `## E<NN> — <title>`, epic notes are a single
`_italic_` line, tasks are `* E<NN>.<NN> <title>`.

---

## Sequencing directives (verbatim)

**Start immediately and in parallel**

1. E01–E03: project governance, offer rules, legal and lifecycle decisions.
2. E10: research and rank the venue account universe.
3. E13–E14 pre-production: scripts, storyboards and map-system development can begin, but final product capture cannot.
4. E04–E09: product, portal, reporting, engineering and demo-data completion.

**Critical blocking rules**

* Do not freeze commercial copy before the founding-rate, entitlement and keepsake rules are ratified.
* Do not capture final product footage before the couple experience, Timeline, Venue Portal and demo data are visually locked.
* Do not produce final personalised films before the venue coordinates, names, links and outreach cohorts are verified.
* Do not send the first commercial invitation before contracts, billing, reporting, privacy documentation, support and the full live journey have passed QA.
* Launch day is a release milestone. The project remains open until all 25 founding venues are paid and onboarded.

---

## E01 — Project governance and control

_Start now. Blocks every other workstream._

* E01.01 Publish a one-page source-of-truth brief containing the current offer, product model, geography, films and superseded assumptions.
* E01.02 Define the primary project objective as 25 signed and paid founding venues, rather than 25 invitations or expressions of interest.
* E01.03 Separate the 1 September release milestone from the final project-closure milestone of 25 paid and onboarded venues.
* E01.04 Lock project scope and explicitly exclude internal venue operations, full-scale schools, full-scale students and unrelated product expansion.
* E01.05 Create the project board with fields for epic, task ID, priority, status, owner, dependency, acceptance evidence and target date.
* E01.06 Assign an accountable owner or lead agent to every epic while retaining founder approval over product, commercial and release decisions.
* E01.07 Build the complete dependency map and identify the product, legal, capture, film and outreach critical paths.
* E01.08 Create a decision log recording every ratified commercial, legal, product, design and film decision.
* E01.09 Create a project risk and issue register covering commercial, product, privacy, delivery, founder-capacity and launch risks.
* E01.10 Define six formal release gates: commercial, legal, product, data, creative and sales-readiness.
* E01.11 Set the offer-freeze, UI-freeze, copy-freeze, capture-freeze, film-lock and release-candidate dates.
* E01.12 Establish a weekly operating review covering blockers, decisions, evidence, quality, pipeline and the next seven days.

## E02 — Commercial offer and Founding 25 programme

_Start now. Blocks contracts, portal language, films, pricing pages and outreach._

* E02.01 Ratify the single standard offer at €1,500 annually prepaid and the first 25 founding agreements at €1,000 annually prepaid.
* E02.02 Ratify the exact price-reduction wording: “€500 founding saving,” “one-third founding rate” or “33.3% founding reduction.”
* E02.03 Define precisely what the €1,000 founding-rate lock covers and state that it applies to the base annual Venue Edition agreement.
* E02.04 Define continuous-renewal requirements and what happens after a missed payment, cancellation, lapse or later reactivation.
* E02.05 Define how the founding rate behaves after a venue sale, company acquisition, operator change, rebrand, merger or relocation.
* E02.06 Exclude VAT, taxes, optional future add-ons, third-party charges and materially separate products from the locked base price.
* E02.07 Ratify annual prepayment, invoice timing, renewal dates, renewal notices, failed payments, cancellation and refund rules.
* E02.08 Create the Founding Venue Benefits Charter covering founder access, feedback, early access, priority support and recognition.
* E02.09 Define the boundaries of founder access and product feedback so that the benefit does not become unlimited bespoke development.
* E02.10 Select legally safe programme terminology, establish Founding Venue numbers 01/25 through 25/25, and define when numbers are assigned.
* E02.11 Define when a founding place is reserved, when it expires, when it becomes locked, and when the programme automatically closes.
* E02.12 Ratify the eligible-couple entitlement model, model costs at different venue volumes, and reconcile the new economics across all financial documents.

## E03 — Legal, privacy and account-lifecycle rules

_Start now. Blocks live sales and live couple access._

* E03.01 Determine the controller, joint-controller and processor roles across Signal Studio, the venue, the couple and public Timeline viewers.
* E03.02 Draft the annual Venue Edition agreement and commercial order form.
* E03.03 Draft the Founding Venue schedule covering the €1,000 rate, continuity conditions, benefits and founding-place status.
* E03.04 Draft the data-processing agreement, security schedule, subprocessor schedule and data-breach responsibilities.
* E03.05 Finalise the couple terms of service and couple-facing privacy notice.
* E03.06 Finalise public Timeline terms, viewer privacy language, analytics disclosure and cookie requirements.
* E03.07 Define rights and permissions for venue logos, venue photographs, couple photographs, film assets and public case-study material.
* E03.08 Define the active planning term relative to activation date, wedding date, postponement and post-wedding access.
* E03.09 Ratify the free Keepsake mode, read-only rules, storage boundary, export rights and deletion controls.
* E03.10 Define cancellation, postponement, venue change, venue non-renewal, couple separation, account ownership and venue-workspace unlinking.
* E03.11 Ratify data retention, deletion, service-discontinuation exports, legitimate-interest outreach, opt-outs and suppression-list requirements.
* E03.12 Obtain documented Irish legal and accounting review of the complete offer, founding promise, VAT treatment, privacy model and contracts.

## E04 — Product architecture and workspace lifecycle

_Begins once E02 and E03 core decisions are stable. Blocks implementation and portal accuracy._

* E04.01 Define the data entities for venue, agreement, term, founding status, member, invitation, couple workspace and public artifact.
* E04.02 Define venue member roles and permissions for owner, manager and viewer.
* E04.03 Define invitation states from creation through sent, opened, redeemed, expired, revoked and replaced.
* E04.04 Define couple workspace ownership, co-owner access, invited collaborators and account recovery.
* E04.05 Define how venue name, logo, welcome message and “compliments of” attribution inherit into each sponsored workspace.
* E04.06 Implement venue-workspace unlinking without removing or exposing the couple’s private work.
* E04.07 Create the lifecycle state machine from invitation to active planning, post-wedding access, Keepsake mode and deletion.
* E04.08 Define the technical boundary between private planning data, public Timeline data and venue-visible aggregate data.
* E04.09 Define wedding-date metadata, event-date changes and which dates can appear in the Venue Portal.
* E04.10 Lock the black-rail rule for authenticated owner experiences and the rail-free rule for shared public artifacts.
* E04.11 Document all lifecycle edge cases and expected product behaviour before implementation.
* E04.12 Build deterministic migration fixtures and test data for every lifecycle state.

## E05 — Couple planning experience and product polish

_Launch-blocking. Final film capture cannot begin until this epic passes._

* E05.01 Map the complete couple journey from venue invitation through first useful action, active planning, wedding day and Keepsake mode.
* E05.02 Design the venue-branded welcome experience with “Compliments of [Venue]” and no visible price.
* E05.03 Build the default wedding workspace template with restrained milestones, decisions, tasks and example Notes.
* E05.04 Complete the wedding-specific Notes experience, including voice capture, manual capture and high-signal structured output.
* E05.05 Complete the Notes-to-Tasks promotion flow using ordinary wedding-planning language.
* E05.06 Complete the wedding Tasks experience for ownership, due dates, status, tags, priorities and clear next actions.
* E05.07 Complete the task-detail experience for comments, attachments, subtasks, decisions and private collaboration.
* E05.08 Complete the authenticated Timeline planning experience and its relationship with tasks and milestones.
* E05.09 Complete the wedding-specific Signal briefing showing only what needs the couple’s attention today.
* E05.10 Complete spouse, planner, family-member and collaborator invitations with appropriate role boundaries.
* E05.11 Complete responsive, mobile, accessibility, loading, empty, error, permission and tasteful motion passes across the couple journey.
* E05.12 Run a world-class design-system review and lock visual regression baselines for every captured product surface.

## E06 — Shared Timeline and Keepsake artifact

_Launch-blocking and central to the main film._

* E06.01 Define the public artifact content model and what can never be published from the private workspace.
* E06.02 Add per-milestone visibility controls for private, title-and-date, image and short-story publication states.
* E06.03 Complete milestone photograph upload, crop, compression, orientation, alt text and deletion.
* E06.04 Complete milestone navigation and the transition from a Timeline point into its photograph and story.
* E06.05 Implement private-link, password-protected and intentionally public sharing modes.
* E06.06 Allow couples to conceal exact wedding dates, locations and other sensitive milestone information.
* E06.07 Implement anonymous aggregate viewer counts without exposing individual viewer behaviour.
* E06.08 Define restrained venue attribution and Signal Studio attribution across shared artifacts.
* E06.09 Design and implement the intentional vertical mobile Timeline.
* E06.10 Refine the desktop editorial Timeline shown in the Mara and Finn concept.
* E06.11 Implement the post-wedding read-only Keepsake state and the agreed downloadable export.
* E06.12 Complete unpublish, delete, broken-link, performance, accessibility, social-preview and cross-browser QA.

## E07 — Venue Portal, trust layer and renewal evidence

_Launch-blocking. This is not deferred until after sales._

* E07.01 Lock the portal information architecture and the primary buyer job of administering and proving the sponsored benefit.
* E07.02 Redesign Overview so “Invite a couple” is the principal action.
* E07.03 Complete account-standing, current-term, founding-status, renewal-date and support-status presentation.
* E07.04 Ratify every adoption-funnel definition from invitation through meaningful first action and continued use.
* E07.05 Implement an evidence-backed next-action system for stale invitations, low redemption, incomplete setup and renewal preparation.
* E07.06 Replace product-centric metrics with understandable customer outcomes while retaining detailed product reach where useful.
* E07.07 Replace the old 40/80 allotment language with the final eligible-booking or fair-use entitlement model.
* E07.08 Complete invitation creation, copying, sending, resending, revoking, replacing, expiring and redemption status.
* E07.09 Complete access search, filters, pagination, stale-invitation alerts and masked-code handling.
* E07.10 Complete the distribution kit with approved email wording, welcome link and printable welcome card.
* E07.11 Complete Usage with first useful action, recent use, continued use, product reach and measurement definitions.
* E07.12 Implement the ratified small-cohort suppression rule and the “Use, without surveillance” privacy receipt.
* E07.13 Refine lifecycle visualisation and ensure it does not imply surveillance or expose private behavioural detail.
* E07.14 Complete monthly, access-term and renewal-report generation.
* E07.15 Complete reconciled PDF and CSV exports with data-through dates, completeness states and definition versions.
* E07.16 Complete Account, organisation settings, members, roles, support history and reporting preferences.
* E07.17 Add the live branded couple-experience preview, branding controls and appropriate upcoming wedding-date view.
* E07.18 Complete portal permissions, audit history, empty/loading/error states, responsive design, accessibility and end-to-end data reconciliation.

## E08 — Billing, security, reliability and release engineering

_Launch-blocking. Runs in parallel with product completion._

* E08.01 Implement annual prepaid billing for standard and founding agreements.
* E08.02 Implement an immutable founding-rate flag and historical price record for each qualifying venue.
* E08.03 Implement renewal invoices, renewal reminders, failed-payment handling, grace periods and lapse behaviour.
* E08.04 Complete multi-tenant data isolation and database row-level security for venues and couple workspaces.
* E08.05 Complete role-based authentication and authorisation across venue owners, managers, viewers and couples.
* E08.06 Secure invitation tokens against guessing, reuse, unintended forwarding, replay and duplicate redemption.
* E08.07 Secure photograph and attachment uploads with file validation, malware controls, size limits and private storage.
* E08.08 Complete audit logging, operational logging, error monitoring and alert escalation.
* E08.09 Complete backups, restore testing, disaster-recovery procedures and data-integrity verification.
* E08.10 Set and test performance budgets across portal, couple workspace, Timeline images and public artifact.
* E08.11 Complete unit, integration, end-to-end, browser, responsive and device test coverage for the entire sponsored journey.
* E08.12 Complete security review, production-readiness review, release checklist, rollback process and incident-response runbook.

## E09 — Measurement, demo data and copy system

_Blocks trustworthy portal reports, product capture and final scripts._

* E09.01 Publish the Venue Edition event taxonomy and metric data dictionary.
* E09.02 Define first useful action, recent use, 30-day continuation, product reach, Timeline creation and Timeline sharing.
* E09.03 Instrument invitation, activation, meaningful-use, public-sharing and Keepsake transitions.
* E09.04 Instrument personalised-film views, landing-page visits, booking actions, meetings, proposals and paid conversion.
* E09.05 Join CRM, commercial, product and reporting data into one founder operating dashboard.
* E09.06 Lock the canonical demo story for the venue, couple and wedding journey.
* E09.07 Build a deterministic Glenmara House and Mara-and-Finn demonstration fixture across all four products and the portal.
* E09.08 Source and license all demonstration photographs and confirm that no unapproved real venue or couple material is used.
* E09.09 Reconcile every sample invitation count, adoption metric, report number, date and product-reach value.
* E09.10 Publish the Venue Edition copy hierarchy, terminology and tone rules.
* E09.11 Finalise offer, founding-rate, privacy, collaboration, Keepsake, CTA, objection and FAQ copy.
* E09.12 Freeze the capture copy and build a one-action demo reset that restores the canonical state.

## E10 — Greater Limerick venue universe and outreach cohorts

_Starts immediately in parallel. Does not wait for product completion._

* E10.01 Define the public geographic term and exact boundary for the “Greater Limerick wedding market.”
* E10.02 Define eligible venue types and exclude businesses that are not credible annual Venue Edition buyers.
* E10.03 Build the venue-ranking score using wedding focus, brand quality, likely booking volume, decision accessibility and strategic fit.
* E10.04 Build a master researched universe of at least 125 accounts, or formally document the available market shortfall.
* E10.05 Deduplicate venue groups, hotels with multiple properties, shared operators and renamed properties.
* E10.06 Record accurate map coordinates, geographic cluster and drive-time ring for every account.
* E10.07 Identify the likely buyer and secondary contact at each venue: owner, general manager, wedding manager, sales lead or events lead.
* E10.08 Verify direct emails, phone numbers, postal addresses, LinkedIn profiles and current employment.
* E10.09 Research each venue’s wedding proposition, package structure, likely annual volume and current couple-planning experience.
* E10.10 Review each venue’s website, brochure, social presence and digital customer experience.
* E10.11 Write one honest, venue-specific reason each account belongs in the founding outreach.
* E10.12 Rank and lock Cohort 1 containing the first 25 venues.
* E10.13 Rank and lock Cohorts 2, 3 and 4, each containing the next 25 venues.
* E10.14 Maintain a reserve cohort, contact-verification dates, conflict flags and consent status for public naming or map publication.

## E11 — Sales operating system and founder-led outreach

_Templates can begin early. Final system depends on offer and asset lock._

* E11.01 Build the Venue Edition CRM stages from researched through paid, onboarded and first couple activated.
* E11.02 Define objective entry and exit criteria for every sales stage.
* E11.03 Define cohort-release cadence, weekly account capacity and the rule for releasing the next 25.
* E11.04 Configure the outreach sending identity, SPF, DKIM, DMARC, tracking policy, unsubscribe handling and suppression list.
* E11.05 Write the concise founder introduction email and its personalised venue-specific opening.
* E11.06 Design the physical founder letter, envelope, leave-behind and in-person visit route.
* E11.07 Define how each private personalised film and landing page is delivered without sending large video attachments.
* E11.08 Build the booking flow and meeting-confirmation sequence.
* E11.09 Write the discovery-call structure and qualification questions.
* E11.10 Write the live product walkthrough and demonstration sequence.
* E11.11 Write the post-demo proposal, commercial summary, order form and same-day follow-up.
* E11.12 Build the objection library covering price, adoption, privacy, support, existing tools, implementation and product maturity.
* E11.13 Define the follow-up sequence, no-response sequence and respectful stopping rule.
* E11.14 Define founding-slot holds, proposal expiry, payment-to-lock procedure, close-lost reasons, referral asks and publicity consent.
* E11.15 Run a weekly conversion review covering cohort, channel, meeting quality, objections, proposals, wins and next-cohort changes.

## E12 — Website, proposal and commercial asset system

_Final versions depend on E02, E03, E09 and the product UI lock._

* E12.01 Build the public Venue Edition landing page around the sponsored couple experience.
* E12.02 Build the private Founding 25 invitation page.
* E12.03 Build a parameterised private proposal page for each venue.
* E12.04 Present the €1,500 standard price, €1,000 founding rate, founding conditions and annual prepayment clearly.
* E12.05 Add the branded couple-experience preview.
* E12.06 Add the Venue Portal trust-and-renewal preview.
* E12.07 Add the privacy explanation covering exactly what the venue sees and never sees.
* E12.08 Add the complete commercial, product, support, entitlement, Keepsake and renewal FAQ.
* E12.09 Produce the concise one-page commercial proposal.
* E12.10 Produce the detailed Venue Edition sales deck.
* E12.11 Redesign the Founding Venue certificate as 01/25 through 25/25 with the €1,000 founding rate.
* E12.12 Produce the pre-booking venue sales kit for brochures, proposals, websites and coordinator conversations.
* E12.13 Produce the post-booking couple welcome kit, approved email wording and printable welcome object.
* E12.14 Complete analytics, conversion, responsive, accessibility, performance, copy and visual QA across every commercial page.

## E13 — Motion system and Limerick First invitation film

_Pre-production starts now. Final rendering requires E02, E09 and E10._

* E13.01 Write the formal creative brief for the personalised Limerick First invitation film.
* E13.02 Define the indigo-dot motion language connecting the map, venue pin, Timeline milestone and Signal Studio mark.
* E13.03 Build the stylised Greater Limerick map geometry, River Shannon path and 15-, 30- and 45-minute rings.
* E13.04 Build the data-driven map composition using verified venue coordinates and cohort metadata.
* E13.05 Animate all 25 cohort pins while keeping names anonymous except the private recipient until permission is granted.
* E13.06 Build the recipient-highlight sequence showing the venue name, location and personal invitation.
* E13.07 Finalise the 35–45 second script and on-screen copy.
* E13.08 Build the €1,500-to-€1,000 price animation and test “€500 less,” “one-third less” and “33.3%” presentation.
* E13.09 Finalise legally safe founding-rate-lock language for voiceover and on-screen presentation.
* E13.10 Produce the complete storyboard and frame-level motion plan.
* E13.11 Produce an animatic with temporary voiceover and sound.
* E13.12 Record or generate the final approved voiceover.
* E13.13 Source and license the music and sound-effects palette.
* E13.14 Produce the final motion, typography, map animation, price sequence and CTA.
* E13.15 Build the parameterised rendering pipeline using venue name, coordinates, cohort and private CTA data.
* E13.16 Generate unique tracked links, thumbnails and landing destinations for every personalised render.
* E13.17 Render and manually QA all 25 Cohort 1 videos.
* E13.18 Prepare Cohort 2–4 templates, versioning, archive structure and rapid rerender procedure.

## E14 — Before the Day Venue Edition film

_Final product capture is blocked by E05–E09._

* E14.01 Write the formal creative brief for the 60–75 second Venue Edition film.
* E14.02 Finalise the narrative arc from fragmented planning to one calm sponsored experience.
* E14.03 Design the opening sequence of messages, email, phone notes, journals and disconnected decisions.
* E14.04 Lock the central insight: the wedding happens at the venue, but the couple’s experience begins months beforehand.
* E14.05 Select one wedding decision to travel through Notes, Tasks, Timeline and Signal.
* E14.06 Design and capture the Notes sequence.
* E14.07 Design and capture the Tasks sequence.
* E14.08 Design the Timeline hero sequence and the map-pin-to-milestone transition.
* E14.09 Build the “We said yes,” venue reservation, menu tasting and wedding-day photograph moments.
* E14.10 Design and capture the Signal daily-briefing sequence.
* E14.11 Show the venue-branded welcome and “Compliments of [Venue]” experience.
* E14.12 Show the privacy boundary and Venue Portal as the quiet trust-and-renewal layer.
* E14.13 Decide the exact placement of the standard price, founding rate and final walkthrough CTA.
* E14.14 Produce the complete storyboard and approved animatic.
* E14.15 Produce the product-capture plan and record only after the UI, copy and demo environment are frozen.
* E14.16 Complete voiceover, music, sound design, compositing, pacing and final edit.
* E14.17 Produce the 16:9 master, captions, transcript and approved 9:16 and 1:1 cutdowns.
* E14.18 Complete final brand, product-accuracy, privacy, audio, caption, encoding and archive QA.

## E15 — Release, venue onboarding and completion of the Founding 25

_Begins after all six release gates pass. Continues after launch until project closure._

* E15.01 Run the formal launch go/no-go review against commercial, legal, product, data, creative and sales gates.
* E15.02 Complete a real production billing and founding-rate test.
* E15.03 Complete a real invitation, redemption, account creation and branded workspace test.
* E15.04 Complete live Venue Portal, Usage, PDF, CSV and renewal-report tests.
* E15.05 Complete live shared Timeline, viewer-count, unpublish, export and Keepsake tests.
* E15.06 Confirm that contracts, privacy notices, analytics, support channels, monitoring and incident procedures are live.
* E15.07 Release Cohort 1 and record every personalised touch and response.
* E15.08 Monitor product, email, landing-page, booking, film and portal performance during the first release window.
* E15.09 Complete signed-venue handoff from sales into onboarding.
* E15.10 Collect venue branding, configure the account, invite venue members and approve the couple experience.
* E15.11 Train the venue and support it through its first real couple invitation and redemption.
* E15.12 Run seven-day and 30-day venue reviews covering adoption, friction, support and next action.
* E15.13 Operate the direct founder channel and structured founding-request intake without creating uncontrolled custom scope.
* E15.14 Secure permissioned venue evidence, couple evidence, referrals and public map/name approval.
* E15.15 Release Cohorts 2, 3, 4 and reserve accounts as necessary until 25 venues are signed and paid.
* E15.16 Maintain the authoritative founding-place counter, assign 01/25–25/25 numbers and publish only permissioned venue names.
* E15.17 Close the founding offer at 25 paid agreements, switch all new commercial surfaces to €1,500 and prepare the first renewal cycle.
* E15.18 Complete the project postmortem, archive final assets, update the business plan and market-entry documents, and transfer ongoing work into operations.

---

## Critical path (verbatim)

These are the tasks that should receive attention first because they block the largest amount of downstream work:

1. E01.01–E01.11: establish the source of truth, scope, gates and freeze dates.
2. E02.01–E02.12: lock the commercial offer, founding promise and entitlement.
3. E03.01–E03.12: lock the legal, privacy, expiry and Keepsake model.
4. E04.01–E04.10: implement the correct venue/couple architecture.
5. E05, E06 and E07: finish the couple experience, shared Timeline and every portal/reporting edge case.
6. E08 and E09: complete billing, security, reliability, instrumentation, reconciled demo data and copy.
7. E14.15: capture the final product only after the preceding surfaces are frozen.
8. E13.17 and E14.18: lock the films.
9. E12.14: clear every commercial page.
10. E15.01: run the formal go/no-go gate.
11. E15.07: open the first cohort.
12. E15.15–E15.17: continue controlled cohorts until all 25 founding places are paid and the standard €1,500 offer takes over.

The next project-planning step is to convert E01.01 into the definitive project brief, followed by individual specifications and acceptance criteria for each task ID.
