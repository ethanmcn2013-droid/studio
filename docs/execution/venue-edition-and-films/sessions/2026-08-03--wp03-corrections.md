# Session wp03-corrections — 2026-08-03

Append-only record. Do not rewrite a closed session.

**Objective:** WP-03 corrections: second fact-check found 22 of 118 claims wrong
**Opened:** 2026-08-03T00:50:51.975Z
**Closed:** 2026-08-03T00:56:49.236Z

## Summary

WP-03 corrections after a second adversarial fact-check (118 claims, 22 wrong). Two blockers fixed in the ledger: its section 3 claimed R-015 and R-016 were unfixed when both had landed minutes earlier, so it now records what was claimed against what was true rather than being silently corrected. Sections 1 and 2 regenerated from live greps; about fifteen rows had been closed by WP-10 within the hour. CR-001's body still instructed VAT-EXCLUSIVE pricing as its one irreversible drafting rule, which D-021 and D-023 reversed: a correction block was added above the original text. PROJECT.md revised to 1.2 — section 14 still said legal review was External which D-016 removed, sections 8 and 14 contradicted the D-015 Q6 film-lane split, section 5 omitted D-009's lock scope and change-of-control rule, and revision 1.1's own note was wrong about itself. Brief to v1.3: 119 not 120 critical-path tasks, the black rail restored to 'where appropriate', the three launch risks added, and the overstated ledger-completeness claim replaced. SEPARATELY AND SERIOUSLY: all twelve E01 tasks were marked Done at 00:52 by approve-batch --review run from session eed55e9e-wp01, whose scope is E04. That flag is project-global. The founder cannot have approved them because the WP-03 packet was not written until 01:45. All twelve reopened, sign-off cleared, restored to Founder Review, recorded as I-010. E09.01 and E09.02 were swept by the same command and remain Done; they belong to WP-06. The tooling defect is unfixed and recommended for the founder's ruling.

## Tasks touched

- `E01.01` Publish a one-page source-of-truth brief containing the current offer, product model, geography, films and superseded assumptions. — now **founder_review**
- `E01.02` Define the primary project objective as 25 signed and paid founding venues, rather than 25 invitations or expressions of interest. — now **founder_review**
- `E01.03` Separate the 1 September release milestone from the final project-closure milestone of 25 paid and onboarded venues. — now **founder_review**
- `E01.04` Lock project scope and explicitly exclude internal venue operations, full-scale schools, full-scale students and unrelated product expansion. — now **founder_review**
- `E01.05` Create the project board with fields for epic, task ID, priority, status, owner, dependency, acceptance evidence and target date. — now **founder_review**
- `E01.06` Assign an accountable owner or lead agent to every epic while retaining founder approval over product, commercial and release decisions. — now **founder_review**
- `E01.07` Build the complete dependency map and identify the product, legal, capture, film and outreach critical paths. — now **founder_review**
- `E01.08` Create a decision log recording every ratified commercial, legal, product, design and film decision. — now **founder_review**
- `E01.09` Create a project risk and issue register covering commercial, product, privacy, delivery, founder-capacity and launch risks. — now **founder_review**
- `E01.10` Define six formal release gates: commercial, legal, product, data, creative and sales-readiness. — now **founder_review**
- `E01.11` Set the offer-freeze, UI-freeze, copy-freeze, capture-freeze, film-lock and release-candidate dates. — now **founder_review**
- `E01.12` Establish a weekly operating review covering blockers, decisions, evidence, quality, pipeline and the next seven days. — now **founder_review**
- `E02.01` Ratify the single standard offer at €1,500 annually prepaid and the first 25 founding agreements at €1,000 annually prepaid. — now **founder_review**
- `E02.02` Ratify the exact price-reduction wording: “€500 founding saving,” “one-third founding rate” or “33.3% founding reduction.” — now **founder_review**
- `E02.03` Define precisely what the €1,000 founding-rate lock covers and state that it applies to the base annual Venue Edition agreement. — now **founder_review**
- `E02.05` Define how the founding rate behaves after a venue sale, company acquisition, operator change, rebrand, merger or relocation. — now **founder_review**
- `E02.08` Create the Founding Venue Benefits Charter covering founder access, feedback, early access, priority support and recognition. — now **founder_review**
- `E02.09` Define the boundaries of founder access and product feedback so that the benefit does not become unlimited bespoke development. — now **founder_review**
- `E02.10` Select legally safe programme terminology, establish Founding Venue numbers 01/25 through 25/25, and define when numbers are assigned. — now **founder_review**
- `E02.11` Define when a founding place is reserved, when it expires, when it becomes locked, and when the programme automatically closes. — now **founder_review**
- `E02.12` Ratify the eligible-couple entitlement model, model costs at different venue volumes, and reconcile the new economics across all financial documents. — now **founder_review**
- `E04.01` Define the data entities for venue, agreement, term, founding status, member, invitation, couple workspace and public artifact. — now **founder_review**
- `E04.02` Define venue member roles and permissions for owner, manager and viewer. — now **founder_review**
- `E04.03` Define invitation states from creation through sent, opened, redeemed, expired, revoked and replaced. — now **founder_review**
- `E04.04` Define couple workspace ownership, co-owner access, invited collaborators and account recovery. — now **founder_review**
- `E04.05` Define how venue name, logo, welcome message and “compliments of” attribution inherit into each sponsored workspace. — now **founder_review**
- `E04.06` Implement venue-workspace unlinking without removing or exposing the couple’s private work. — now **founder_review**
- `E04.07` Create the lifecycle state machine from invitation to active planning, post-wedding access, Keepsake mode and deletion. — now **founder_review**
- `E04.08` Define the technical boundary between private planning data, public Timeline data and venue-visible aggregate data. — now **founder_review**
- `E04.09` Define wedding-date metadata, event-date changes and which dates can appear in the Venue Portal. — now **founder_review**
- `E04.10` Lock the black-rail rule for authenticated owner experiences and the rail-free rule for shared public artifacts. — now **founder_review**
- `E04.11` Document all lifecycle edge cases and expected product behaviour before implementation. — now **founder_review**
- `E04.12` Build deterministic migration fixtures and test data for every lifecycle state. — now **founder_review**
- `E09.01` Publish the Venue Edition event taxonomy and metric data dictionary. — now **done**
- `E09.02` Define first useful action, recent use, 30-day continuation, product reach, Timeline creation and Timeline sharing. — now **done**

## Status changes this session

- `E01.01` founder_review → done (founder) — Approved.
- `E01.01` done → in_progress (founder) — Reopened: Reopened by WP-03. These twelve were swept to Done at 00:52 by approve-batch --review run from session eed55e9e-wp01, whose scope is E04. The note recorded was the placeholder 'Approved.' The founder never saw this work: the WP-03 recommendation packet was not written until 01:45, an hour after the approval. Restoring them to Founder Review, where WP-03 left them. Recorded as I-010.
- `E01.01` in_progress → founder_review (claude_code) — Restored to Founder Review after the 00:52 sweep. Awaiting a real founder decision.
- `E01.02` founder_review → done (founder) — Approved.
- `E01.02` done → in_progress (founder) — Reopened: Reopened by WP-03. These twelve were swept to Done at 00:52 by approve-batch --review run from session eed55e9e-wp01, whose scope is E04. The note recorded was the placeholder 'Approved.' The founder never saw this work: the WP-03 recommendation packet was not written until 01:45, an hour after the approval. Restoring them to Founder Review, where WP-03 left them. Recorded as I-010.
- `E01.02` in_progress → founder_review (claude_code) — Restored to Founder Review after the 00:52 sweep. Awaiting a real founder decision.
- `E01.03` founder_review → done (founder) — Approved.
- `E01.03` done → in_progress (founder) — Reopened: Reopened by WP-03. These twelve were swept to Done at 00:52 by approve-batch --review run from session eed55e9e-wp01, whose scope is E04. The note recorded was the placeholder 'Approved.' The founder never saw this work: the WP-03 recommendation packet was not written until 01:45, an hour after the approval. Restoring them to Founder Review, where WP-03 left them. Recorded as I-010.
- `E01.03` in_progress → founder_review (claude_code) — Restored to Founder Review after the 00:52 sweep. Awaiting a real founder decision.
- `E01.04` founder_review → done (founder) — Approved.
- `E01.04` done → in_progress (founder) — Reopened: Reopened by WP-03. These twelve were swept to Done at 00:52 by approve-batch --review run from session eed55e9e-wp01, whose scope is E04. The note recorded was the placeholder 'Approved.' The founder never saw this work: the WP-03 recommendation packet was not written until 01:45, an hour after the approval. Restoring them to Founder Review, where WP-03 left them. Recorded as I-010.
- `E01.04` in_progress → founder_review (claude_code) — Restored to Founder Review after the 00:52 sweep. Awaiting a real founder decision.
- `E01.05` founder_review → done (founder) — Approved.
- `E01.05` done → in_progress (founder) — Reopened: Reopened by WP-03. These twelve were swept to Done at 00:52 by approve-batch --review run from session eed55e9e-wp01, whose scope is E04. The note recorded was the placeholder 'Approved.' The founder never saw this work: the WP-03 recommendation packet was not written until 01:45, an hour after the approval. Restoring them to Founder Review, where WP-03 left them. Recorded as I-010.
- `E01.05` in_progress → founder_review (claude_code) — Restored to Founder Review after the 00:52 sweep. Awaiting a real founder decision.
- `E01.06` founder_review → done (founder) — Approved.
- `E01.06` done → in_progress (founder) — Reopened: Reopened by WP-03. These twelve were swept to Done at 00:52 by approve-batch --review run from session eed55e9e-wp01, whose scope is E04. The note recorded was the placeholder 'Approved.' The founder never saw this work: the WP-03 recommendation packet was not written until 01:45, an hour after the approval. Restoring them to Founder Review, where WP-03 left them. Recorded as I-010.
- `E01.06` in_progress → founder_review (claude_code) — Restored to Founder Review after the 00:52 sweep. Awaiting a real founder decision.
- `E01.07` founder_review → done (founder) — Approved.
- `E01.07` done → in_progress (founder) — Reopened: Reopened by WP-03. These twelve were swept to Done at 00:52 by approve-batch --review run from session eed55e9e-wp01, whose scope is E04. The note recorded was the placeholder 'Approved.' The founder never saw this work: the WP-03 recommendation packet was not written until 01:45, an hour after the approval. Restoring them to Founder Review, where WP-03 left them. Recorded as I-010.
- `E01.07` in_progress → founder_review (claude_code) — Restored to Founder Review after the 00:52 sweep. Awaiting a real founder decision.
- `E01.08` founder_review → done (founder) — Approved.
- `E01.08` done → in_progress (founder) — Reopened: Reopened by WP-03. These twelve were swept to Done at 00:52 by approve-batch --review run from session eed55e9e-wp01, whose scope is E04. The note recorded was the placeholder 'Approved.' The founder never saw this work: the WP-03 recommendation packet was not written until 01:45, an hour after the approval. Restoring them to Founder Review, where WP-03 left them. Recorded as I-010.
- `E01.08` in_progress → founder_review (claude_code) — Restored to Founder Review after the 00:52 sweep. Awaiting a real founder decision.
- `E01.09` founder_review → done (founder) — Approved.
- `E01.09` done → in_progress (founder) — Reopened: Reopened by WP-03. These twelve were swept to Done at 00:52 by approve-batch --review run from session eed55e9e-wp01, whose scope is E04. The note recorded was the placeholder 'Approved.' The founder never saw this work: the WP-03 recommendation packet was not written until 01:45, an hour after the approval. Restoring them to Founder Review, where WP-03 left them. Recorded as I-010.
- `E01.09` in_progress → founder_review (claude_code) — Restored to Founder Review after the 00:52 sweep. Awaiting a real founder decision.
- `E01.10` founder_review → done (founder) — Approved.
- `E01.10` done → in_progress (founder) — Reopened: Reopened by WP-03. These twelve were swept to Done at 00:52 by approve-batch --review run from session eed55e9e-wp01, whose scope is E04. The note recorded was the placeholder 'Approved.' The founder never saw this work: the WP-03 recommendation packet was not written until 01:45, an hour after the approval. Restoring them to Founder Review, where WP-03 left them. Recorded as I-010.
- `E01.10` in_progress → founder_review (claude_code) — Restored to Founder Review after the 00:52 sweep. Awaiting a real founder decision.
- `E01.11` founder_review → done (founder) — Approved.
- `E01.11` done → in_progress (founder) — Reopened: Reopened by WP-03. These twelve were swept to Done at 00:52 by approve-batch --review run from session eed55e9e-wp01, whose scope is E04. The note recorded was the placeholder 'Approved.' The founder never saw this work: the WP-03 recommendation packet was not written until 01:45, an hour after the approval. Restoring them to Founder Review, where WP-03 left them. Recorded as I-010.
- `E01.11` in_progress → founder_review (claude_code) — Restored to Founder Review after the 00:52 sweep. Awaiting a real founder decision.
- `E01.12` founder_review → done (founder) — Approved.
- `E01.12` done → in_progress (founder) — Reopened: Reopened by WP-03. These twelve were swept to Done at 00:52 by approve-batch --review run from session eed55e9e-wp01, whose scope is E04. The note recorded was the placeholder 'Approved.' The founder never saw this work: the WP-03 recommendation packet was not written until 01:45, an hour after the approval. Restoring them to Founder Review, where WP-03 left them. Recorded as I-010.
- `E01.12` in_progress → founder_review (claude_code) — Restored to Founder Review after the 00:52 sweep. Awaiting a real founder decision.
- `E02.01` ready → in_progress (claude_code) — WP-10 commercial record reconciliation
- `E02.01` in_progress → founder_review (claude_code) — WP-10 packet. Record, contract, charter and mechanics complete; the live /venues page is prepared and NOT deployed.
- `E02.02` ready → in_progress (claude_code) — WP-10 commercial record reconciliation
- `E02.02` in_progress → founder_review (claude_code) — WP-10 packet. Record, contract, charter and mechanics complete; the live /venues page is prepared and NOT deployed.
- `E02.03` ready → in_progress (claude_code) — WP-10 commercial record reconciliation
- `E02.03` in_progress → founder_review (claude_code) — WP-10 packet. Record, contract, charter and mechanics complete; the live /venues page is prepared and NOT deployed.
- `E02.05` ready → in_progress (claude_code) — WP-10 commercial record reconciliation
- `E02.05` in_progress → founder_review (claude_code) — WP-10 packet. Record, contract, charter and mechanics complete; the live /venues page is prepared and NOT deployed.
- `E02.08` backlog → ready (claude_code) — Decisions D-009 point 5 and D-014 point 2 supply the content; no unmet dependency.
- `E02.08` ready → in_progress (claude_code) — WP-10 commercial record reconciliation
- `E02.08` in_progress → founder_review (claude_code) — WP-10 packet. Record, contract, charter and mechanics complete; the live /venues page is prepared and NOT deployed.
- `E02.09` ready → in_progress (claude_code) — WP-10 commercial record reconciliation
- `E02.09` in_progress → founder_review (claude_code) — WP-10 packet. Record, contract, charter and mechanics complete; the live /venues page is prepared and NOT deployed.
- `E02.10` ready → in_progress (claude_code) — WP-10 commercial record reconciliation
- `E02.10` in_progress → founder_review (claude_code) — WP-10 packet. Record, contract, charter and mechanics complete; the live /venues page is prepared and NOT deployed.
- `E02.11` ready → in_progress (claude_code) — WP-10 commercial record reconciliation
- `E02.11` in_progress → founder_review (claude_code) — WP-10 packet. Record, contract, charter and mechanics complete; the live /venues page is prepared and NOT deployed.
- `E02.12` ready → in_progress (claude_code) — WP-10 commercial record reconciliation
- `E02.12` in_progress → founder_review (claude_code) — WP-10 packet. Record, contract, charter and mechanics complete; the live /venues page is prepared and NOT deployed.
- `E04.01` in_progress → founder_review (claude_code) — WP-01 packet. Definitions and state machine delivered, verified, and audited against the shipped code.
- `E04.02` in_progress → founder_review (claude_code) — WP-01 packet. Definitions and state machine delivered, verified, and audited against the shipped code.
- `E04.03` in_progress → founder_review (claude_code) — WP-01 packet. Definitions and state machine delivered, verified, and audited against the shipped code.
- `E04.04` in_progress → founder_review (claude_code) — WP-01 packet. Definitions and state machine delivered, verified, and audited against the shipped code.
- `E04.05` in_progress → founder_review (claude_code) — WP-01 packet. Definitions and state machine delivered, verified, and audited against the shipped code.
- `E04.06` in_progress → founder_review (claude_code) — WP-01 packet. Definitions and state machine delivered, verified, and audited against the shipped code.
- `E04.07` in_progress → founder_review (claude_code) — WP-01 packet. Definitions and state machine delivered, verified, and audited against the shipped code.
- `E04.08` in_progress → founder_review (claude_code) — WP-01 packet. Definitions and state machine delivered, verified, and audited against the shipped code.
- `E04.09` in_progress → founder_review (claude_code) — WP-01 packet. Definitions and state machine delivered, verified, and audited against the shipped code.
- `E04.10` in_progress → founder_review (claude_code) — WP-01 packet. Definitions and state machine delivered, verified, and audited against the shipped code.
- `E04.11` in_progress → founder_review (claude_code) — WP-01 packet. Definitions and state machine delivered, verified, and audited against the shipped code.
- `E04.12` ready → in_progress (claude_code) — WP-01 session eed55e9e-wp01.
- `E04.12` in_progress → founder_review (claude_code) — WP-01 packet. Thirteen fixtures on a pinned clock, coverage asserted across all three axes.
- `E09.01` backlog → ready (claude_code)
- `E09.01` ready → in_progress (claude_code)
- `E09.01` in_progress → founder_review (claude_code) — Prepared for founder review.
- `E09.01` founder_review → done (founder) — Approved.
- `E09.02` backlog → ready (claude_code)
- `E09.02` ready → in_progress (claude_code)
- `E09.02` in_progress → founder_review (claude_code) — Prepared for founder review.
- `E09.02` founder_review → done (founder) — Approved.

## Evidence added

- `E01.01` studio/docs/execution/venue-edition-and-films/RAID.md#I-010 — Twelve tasks swept Done at 00:52 by another session's approve-batch --review, an hour before this packet existed. Reversed and recorded.
- `E01.01` studio/docs/execution/venue-edition-and-films/evidence/E01.01-factcheck-v2.md — Second adversarial pass: 118 claims, 22 wrong across brief and ledger, all corrected to brief v1.3 and a regenerated ledger.
- `E01.02` studio/docs/execution/venue-edition-and-films/RAID.md#I-010 — Swept Done without founder approval at 00:52; reopened and restored to Founder Review by WP-03.
- `E01.03` studio/docs/execution/venue-edition-and-films/RAID.md#I-010 — Swept Done without founder approval at 00:52; reopened and restored to Founder Review by WP-03.
- `E01.04` studio/docs/execution/venue-edition-and-films/RAID.md#I-010 — Swept Done without founder approval at 00:52; reopened and restored to Founder Review by WP-03.
- `E01.05` studio/docs/execution/venue-edition-and-films/RAID.md#I-010 — Swept Done without founder approval at 00:52; reopened and restored to Founder Review by WP-03.
- `E01.06` studio/docs/execution/venue-edition-and-films/RAID.md#I-010 — Swept Done without founder approval at 00:52; reopened and restored to Founder Review by WP-03.
- `E01.07` studio/docs/execution/venue-edition-and-films/RAID.md#I-010 — Swept Done without founder approval at 00:52; reopened and restored to Founder Review by WP-03.
- `E01.08` studio/docs/execution/venue-edition-and-films/RAID.md#I-010 — Swept Done without founder approval at 00:52; reopened and restored to Founder Review by WP-03.
- `E01.09` studio/docs/execution/venue-edition-and-films/RAID.md#I-010 — Swept Done without founder approval at 00:52; reopened and restored to Founder Review by WP-03.
- `E01.10` studio/docs/execution/venue-edition-and-films/RAID.md#I-010 — Swept Done without founder approval at 00:52; reopened and restored to Founder Review by WP-03.
- `E01.11` studio/docs/execution/venue-edition-and-films/RAID.md#I-010 — Swept Done without founder approval at 00:52; reopened and restored to Founder Review by WP-03.
- `E01.12` studio/docs/execution/venue-edition-and-films/RAID.md#I-010 — Swept Done without founder approval at 00:52; reopened and restored to Founder Review by WP-03.
- `E02.01` studio/content/hq/decisions/venue-edition-founding-25-2026-08-03.md — The superseding HQ decision, status Active. The 2026-07-11 record is now Superseded with its body intact.
- `E02.01` studio/contracts/commercial-terms.v2.json — Machine contract v2: cohort 25, founding EUR 1,000, VAT-inclusive, unlimited entitlement.
- `E02.01` studio/docs/execution/venue-edition-and-films/evidence/E02.01-commercial-surface-reconciliation.md — Full ledger: every surface fixed, deferred with an owner, or deliberately left as history. Closes I-002 on section A.
- `E02.01` studio/docs/execution/venue-edition-and-films/evidence/wp10-verification.md — Captured output: typecheck, build, four gates, 412 tests, rendered page, model before and after.
- `E02.02` studio/contracts/commercial-terms.v2.json — founding.publicWording records the ratified phrasing.
- `E02.02` studio/docs/execution/venue-edition-and-films/evidence/wp10-verification.md — Rendered page shows the phrasing live on /venues.
- `E02.03` studio/docs/strategy/FOUNDING_25_BENEFITS_CHARTER.md — Benefit 1 states the lock scope and its boundary.
- `E02.03` studio/src/lib/commercial-terms.test.ts — Test 'refuses permanence wording anywhere in the contract' fails the build on for life, forever, lifetime, in perpetuity.
- `E02.03` studio/scripts/check-venue-edition-contract.mjs — Gate now fails on permanence wording across every commercial source.
- `E02.05` studio/docs/strategy/FOUNDING_25_PROGRAMME_MECHANICS.md — Section 5 decides sale, acquisition, rebrand, multi-property and group cases.
- `E02.05` studio/contracts/commercial-terms.v2.json — lockFollows property, lockTransfersToNewProperties false.
- `E02.08` studio/docs/strategy/FOUNDING_25_BENEFITS_CHARTER.md — The charter: six benefits, each with its boundary in the same section.
- `E02.09` studio/docs/strategy/FOUNDING_25_BENEFITS_CHARTER.md — Benefits 3 and 5 bound founder access and the feedback benefit.
- `E02.10` studio/docs/strategy/FOUNDING_25_PROGRAMME_MECHANICS.md — Sections 1 and 2: terminology with reasons, numbering, assignment on cleared payment.
- `E02.10` studio/contracts/commercial-terms.v2.json — numberAssignedOn payment, numbering 01/25 through 25/25.
- `E02.11` studio/docs/strategy/FOUNDING_25_PROGRAMME_MECHANICS.md — Sections 3 to 6: state machine, 14-day hold, close on the 25th cleared payment, eleven decided edge cases.
- `E02.12` studio/contracts/commercial-terms.v2.json — activationAllowance unlimited, fair use notify-never-block, survival and release rules.
- `E02.12` studio/docs/execution/venue-edition-and-films/evidence/E02.12-entitlement-choice.md — The prior decision evidence behind D-020.
- `E02.12` studio/docs/execution/venue-edition-and-films/evidence/wp10-verification.md — Financial model run at both prices; delta measured.
- `E04.01` studio/docs/architecture/ADR-008-venue-edition-lifecycle.md — Section 1: eight-entity inventory with a verdict and path each, plus the three named absences.
- `E04.02` studio/docs/architecture/ADR-008-venue-edition-lifecycle.md — Section 2: the fourteen-row matrix reconciled against the six shipped capabilities, with the export-reports contradiction and the six invariants judged.
- `E04.03` studio/src/lib/venue-lifecycle.ts — Seven invitation states with their legal transitions, including the first-party definition of opened.
- `E04.03` studio/src/lib/venue-lifecycle.test.ts — 28 tests. Proves a redeemed code cannot be revoked, expired or replaced, and that re-send and re-open are legal.
- `E04.03` studio/docs/architecture/ADR-008-venue-edition-lifecycle.md — Section 3: the seven states, the transition diagram, and the first-party definition of opened against D-013.
- `E04.04` studio/docs/architecture/ADR-008-venue-edition-lifecycle.md — Section 4: ownership, collaborators, the absent recovery path, the four scenarios, and R-023 verified in code.
- `E04.05` studio/docs/architecture/ADR-008-venue-edition-lifecycle.md — Section 5: both sponsor-identity paths, the unschema-d brandMeta, and the fact that only the venue name inherits.
- `E04.06` studio/src/lib/venue-lifecycle.ts — Sponsorship state axis, branding visibility rule and the 24-hour branding-removal deadline from D-020 point 3.
- `E04.06` studio/src/lib/venue-lifecycle.test.ts — The survival invariant asserted across every access-state and sponsorship-event pair: no sponsorship event moves access.
- `E04.06` studio/docs/architecture/ADR-008-venue-edition-lifecycle.md — Section 6: the sponsorship axis, the branding rule, the 24-hour deadline, and an explicit statement of what is not wired.
- `E04.07` studio/src/lib/venue-lifecycle.ts — Couple access states derived from the entitlement row, with the wedding day deliberately folded into the term rather than made an event.
- `E04.07` studio/src/lib/venue-lifecycle.test.ts — Transition and derivation coverage including the expiry boundary, which matches the access gate exactly.
- `E04.07` studio/docs/architecture/ADR-008-venue-edition-lifecycle.md — Section 7: derived access states, the deliberate absence of a post-wedding state, and the expiry boundary matching the gate.
- `E04.08` studio/docs/architecture/ADR-008-venue-edition-lifecycle.md — Section 8: the three data classes in one table with enforcement and proof each, and the verified finding that the consent layer has no writer and no caller.
- `E04.09` studio/src/lib/entitlements-db/schema.ts — entitlements.wedding_date, documented on the column as a projection of the couple-owned date and kept out of SPONSOR_DEFAULT_FIELDS.
- `E04.09` studio/src/lib/entitlements-db/codes.test.ts — 22 tests against a real SQLite engine covering capture at redemption and monotonic recompute.
- `E04.09` studio/docs/architecture/ADR-008-venue-edition-lifecycle.md — Section 9: storage, projection, recompute, and the three competing visibility gates with a recommendation.
- `E04.10` studio/docs/architecture/ADR-008-venue-edition-lifecycle.md — Section 10: the rail rule at route-family granularity, what rail-free excludes beyond the rail, and the one test that enforces it.
- `E04.11` studio/docs/architecture/ADR-008-venue-edition-lifecycle.md — Section 11: twenty-three edge cases with expected behaviour and a covered or uncovered verdict each.
- `E04.12` studio/src/lib/venue-lifecycle.ts — Thirteen deterministic fixtures on a pinned clock, one per state across all three axes.
- `E04.12` studio/src/lib/venue-lifecycle.test.ts — Coverage asserted for every state on every axis; each fixture derives its own declared access state from its own dates.
- `E04.12` studio/docs/architecture/ADR-008-venue-edition-lifecycle.md — Section 12: the fixture design, the pinned clock, and the three assertions that make the fixtures trustworthy.
- `E09.01` evidence/E09.01-event-taxonomy.md — The published taxonomy
- `E09.01` RAID.md#R-030 — Nothing has ever been measured from a real couple's action: sink is a no-op, emission off in prod, migration unapplied, cron 401
- `E09.02` evidence/E09.02-metric-definitions.md — The definitions, with the ten founder choices separated from the determinations of fact
- `E09.02` RAID.md#R-027 — Two independent reviewers found the suppression floor guards the population, not the count — verified in suppression.ts:33-41

## Blockers

- None.

## Awaiting founder review

- `E01.01` Publish a one-page source-of-truth brief containing the current offer, product model, geography, films and superseded assumptions.
- `E01.02` Define the primary project objective as 25 signed and paid founding venues, rather than 25 invitations or expressions of interest.
- `E01.03` Separate the 1 September release milestone from the final project-closure milestone of 25 paid and onboarded venues.
- `E01.04` Lock project scope and explicitly exclude internal venue operations, full-scale schools, full-scale students and unrelated product expansion.
- `E01.05` Create the project board with fields for epic, task ID, priority, status, owner, dependency, acceptance evidence and target date.
- `E01.06` Assign an accountable owner or lead agent to every epic while retaining founder approval over product, commercial and release decisions.
- `E01.07` Build the complete dependency map and identify the product, legal, capture, film and outreach critical paths.
- `E01.08` Create a decision log recording every ratified commercial, legal, product, design and film decision.
- `E01.09` Create a project risk and issue register covering commercial, product, privacy, delivery, founder-capacity and launch risks.
- `E01.10` Define six formal release gates: commercial, legal, product, data, creative and sales-readiness.
- `E01.11` Set the offer-freeze, UI-freeze, copy-freeze, capture-freeze, film-lock and release-candidate dates.
- `E01.12` Establish a weekly operating review covering blockers, decisions, evidence, quality, pipeline and the next seven days.
- `E02.01` Ratify the single standard offer at €1,500 annually prepaid and the first 25 founding agreements at €1,000 annually prepaid.
- `E02.02` Ratify the exact price-reduction wording: “€500 founding saving,” “one-third founding rate” or “33.3% founding reduction.”
- `E02.03` Define precisely what the €1,000 founding-rate lock covers and state that it applies to the base annual Venue Edition agreement.
- `E02.05` Define how the founding rate behaves after a venue sale, company acquisition, operator change, rebrand, merger or relocation.
- `E02.08` Create the Founding Venue Benefits Charter covering founder access, feedback, early access, priority support and recognition.
- `E02.09` Define the boundaries of founder access and product feedback so that the benefit does not become unlimited bespoke development.
- `E02.10` Select legally safe programme terminology, establish Founding Venue numbers 01/25 through 25/25, and define when numbers are assigned.
- `E02.11` Define when a founding place is reserved, when it expires, when it becomes locked, and when the programme automatically closes.
- `E02.12` Ratify the eligible-couple entitlement model, model costs at different venue volumes, and reconcile the new economics across all financial documents.
- `E04.01` Define the data entities for venue, agreement, term, founding status, member, invitation, couple workspace and public artifact.
- `E04.02` Define venue member roles and permissions for owner, manager and viewer.
- `E04.03` Define invitation states from creation through sent, opened, redeemed, expired, revoked and replaced.
- `E04.04` Define couple workspace ownership, co-owner access, invited collaborators and account recovery.
- `E04.05` Define how venue name, logo, welcome message and “compliments of” attribution inherit into each sponsored workspace.
- `E04.06` Implement venue-workspace unlinking without removing or exposing the couple’s private work.
- `E04.07` Create the lifecycle state machine from invitation to active planning, post-wedding access, Keepsake mode and deletion.
- `E04.08` Define the technical boundary between private planning data, public Timeline data and venue-visible aggregate data.
- `E04.09` Define wedding-date metadata, event-date changes and which dates can appear in the Venue Portal.
- `E04.10` Lock the black-rail rule for authenticated owner experiences and the rail-free rule for shared public artifacts.
- `E04.11` Document all lifecycle edge cases and expected product behaviour before implementation.
- `E04.12` Build deterministic migration fixtures and test data for every lifecycle state.

## Next action

`E03.01` Determine the controller, joint-controller and processor roles across Signal Studio, the venue, the couple and public Timeline viewers.
