# DECISIONS — Venue Edition and Films (VEF-2026)

Append-only. Entries are never rewritten or deleted. A decision that changes is
superseded by a new entry that names it.

Status values: `proposed` · `approved` · `rejected` · `superseded`.

The latest **approved** entry here outranks `PROJECT.md`, task specifications
and `PROJECT_STATE.json` in the source-of-truth order. It does not outrank an
explicit founder decision recorded in a current approved project document.

---

## Index — read this before acting on any entry below

Added 2026-08-03 for E01.08. Navigation only. **No entry below has been edited;
the log is append-only and stays that way.**

### Four entries say "proposed, founder decision required" and are resolved

Their headers stand because the log is append-only. Acting on them as open
questions would put four settled matters back in front of the founder.

| Entry | Header still says | Actually resolved by |
|---|---|---|
| D-003 | proposed, founder decision required | **D-009** — 25 founding venues at €1,000, superseding the 2026-07-11 decision |
| D-004 | proposed, founder decision required | **D-010** — 18 months from redemption or 90 days past the wedding, whichever is later |
| D-005 | proposed, founder decision required | **D-020** — every booked couple, unlimited, no number in the commercial terms |
| D-006 | proposed, founder decision required | **D-015 Q4** — the Signal Studio Account *is* the Venue Portal. One surface, two names |

### By domain, as E01.08 requires

| Domain | Ratified entries | Count |
|---|---|---|
| **Commercial** | D-009, D-017, D-020, D-021 | 4 |
| **Legal** | D-010, D-016, D-022, D-023 | 4 |
| **Product** | D-011, and the product halves of D-020 and D-022 | 1 primary |
| **Design** | **none** | **0** |
| **Film** | D-014 | 1 |
| Governance and programme | D-001, D-002, D-007, D-008, D-012, D-013, D-015, D-018, D-019, D-024 | 10 |

**Zero ratified design decisions, one film decision, with UI freeze on
2026-08-20 and film lock on 2026-08-28.** A log that records every *ratified*
decision is right to hold zero design entries if none have been ratified, so
this is a gap in the programme rather than in the ledger. It is recorded as
**I-009** so it stops being invisible. D-024 says the same thing from the other
side: "Where a design direction is genuinely open it runs `/lab`."

### Change requests

| CR | Subject | Status |
|---|---|---|
| CR-001 | Rewrite the legal gate's exit criteria, defer E03.12 | Approved, D-023 |
| CR-002 | Bring E01 and E15 inside the release-gate system | **Awaiting the founder** |

---

## D-001 — Current approved project direction

- **Date:** 2026-08-02
- **Status:** approved
- **Decision-maker:** Ethan McNamara
- **Affects:** all epics

**Decision.** The twenty points of the current approved direction, supplied by
the founder on 2026-08-02, are the controlling context for this project:

1. Venue Edition is a venue-sponsored couple experience.
2. The venue purchases and gifts the experience.
3. The couple owns and controls the private planning workspace.
4. The venue sees invitation administration, activation evidence and
   privacy-safe aggregate adoption evidence. It does not see private planning
   content.
5. The Venue Portal is a trust layer, an access-administration layer, an
   aggregate adoption-evidence layer, and a reporting and renewal layer.
6. Venue Edition is not initially an internal venue-operations platform.
   Internal venue operations are outside this project.
7. The standard annual Venue Edition price is €1,500 prepaid.
8. The first 25 qualifying Greater Limerick founding venues receive a €1,000
   annual founding base rate, subject to final contractual continuity and
   eligibility conditions.
9. Exactly 25 founding venues are to be secured.
10. Outreach occurs in researched cohorts of 25. Cohort 1 is contacted first.
    Further cohorts are released until 25 venues have signed and paid.
11. Sending 25 invitations is not the project outcome. Twenty-five signed, paid
    and onboarded founding venues is the outcome.
12. The two primary films are Limerick First — Founding Invitation Film, and
    Before the Day — Venue Edition Film.
13. The Shared Timeline is the principal emotional and visual product artifact.
14. Authenticated owner experiences retain the Signal Studio black rail where
    appropriate.
15. Shared public artifacts remain rail-free and should feel owned by the
    couple rather than like public productivity-software screens.
16. The shared artifact requires a controlled privacy and Keepsake model. No
    unconditional technical promise that the service or hosted artifact will
    exist "forever".
17. The complete product, portal, reporting and account experience is polished
    before external outreach. Portal and reporting edge cases are not optional
    post-sale work.
18. Schools and students are secondary wedges and must not dilute this
    project's venue-first critical path.
19. Ethan is the sole final decision-maker.
20. No task may be marked Done without explicit founder approval.

**Rationale.** Recorded as the decision baseline so that later sessions inherit
the direction from a file rather than from chat history.

**Alternatives considered.** None. This is a founder statement, recorded.

**Downstream consequences.** Supersedes conflicting assumptions in older
business plans, lender decks, market-entry decks, prototypes and archived
documents. Specific conflicts detected during import are recorded as D-003
through D-007 below, unresolved.

---

## D-002 — Project control lives in `studio/docs/execution/venue-edition-and-films/`

- **Date:** 2026-08-02
- **Status:** approved
- **Decision-maker:** Claude Code, under the workspace operating contract
- **Affects:** all epics

**Decision.** The project-control system is created inside the `studio` repo at
`docs/execution/venue-edition-and-films/`, using the established programme
convention.

**Rationale.** `studio/` is the Signal HQ and internal-operations repo.
`docs/execution/<programme>/` is the existing convention, set by the Signal
Studio Premium Programme (`docs/execution/signal-studio/`, governed from
`studio/CLAUDE.md`). All existing Venue Edition material already lives in
`studio/docs/strategy/VENUE_*` and `studio/docs/venue-portal/`. The workspace
root is not a git repository, so a control system placed there would not be
version-controlled.

**Alternatives considered.** (a) `docs/projects/venue-edition-and-films/` — no
such convention exists in this workspace; rejected. (b) Workspace root — not a
git repo; rejected. (c) A new external repository — requires founder approval
and was not sought; rejected. (d) The `app` repo — product code, not operations;
rejected.

**Downstream consequences.** Programme work spans `studio`, `app` and
`signal-motion`. Control stays in `studio`, matching the Premium Programme
precedent. `git diff --stat` and `git status` for this project are run in
`studio/`.

---

## D-003 — Founding programme: 25 venues at €1,000 versus 15 venues at €1,500

- **Date:** 2026-08-02
- **Status:** **proposed — founder decision required**
- **Decision-maker:** Ethan McNamara
- **Affects:** E02 (all), E03.03, E07.03, E08.02, E12.04, E12.11, E13.08, E13.09, E14.13, E15.16, E15.17

**Conflict recorded, not reconciled.**

| Source | Position |
|---|---|
| D-001 point 8 (2026-08-02) | 25 founding venues at €1,000 annually prepaid |
| `studio/content/hq/decisions/venue-edition-fixed-price-2026-07-11.md` (status Active, review 2026-10-11) | "Founding venues still lock €1,500 for as long as they stay. That lock protects the founding relationship against a future offer change; it is not a lower current price." |
| `studio/contracts/commercial-terms.v1.json` | `venue.annualAmountCents: 150000`, `foundingCohortSize: 15` |
| `studio/docs/strategy/VENUE_EDITION_STRATEGY.md` | "The first fifteen venues lock €1,500 a year for as long as they stay… The asset is permanence, not a temporary markdown." |
| `studio/src/app/venues/page.tsx` (live) | "€1,500 per venue, per year · prepaid" |

Two changes are in play at once: cohort size (15 → 25) and founding rate
(€1,500 locked → €1,000). The 2026-07-11 decision explicitly argued *against* a
founding discount. D-001 introduces one.

**Downstream consequences if approved.** The HQ decision file is superseded and
must be rewritten as a new dated decision; `commercial-terms.v1.json` needs a new
version; every financial model, lender pack and pitch deck carrying founding
revenue changes; the certificate design changes (E12.11); the film price
sequence changes (E13.08); the public venues page changes (E12.04).

**Not actioned in this session.** No commercial surface, contract file or HQ
decision was edited. Ratification is E02.01.

---

## D-004 — Couple access term: 18 months versus activation-relative term plus Keepsake

- **Date:** 2026-08-02
- **Status:** **proposed — founder decision required**
- **Decision-maker:** Ethan McNamara
- **Affects:** E03.08, E03.09, E04.07, E06.11, E07.07, E09.11, E12.08

**Conflict recorded, not reconciled.**

| Source | Position |
|---|---|
| D-001 point 16 + backlog E03.08/E03.09 | An active planning term defined relative to activation date and wedding date, then a free Keepsake mode with read-only rules, storage boundary, export rights and deletion controls |
| `studio/content/hq/decisions/venue-edition-fixed-price-2026-07-11.md` | "Each sponsored couple receives 18 months of access, as confirmed by the founder on 2026-07-01" |
| `studio/contracts/commercial-terms.v1.json` | `coupleAccessMonths: 18`, `operationalAccessDays: 548` |
| `studio/docs/email-system/commercial-truth.md` | "At month 18 the account drops to Free with one quiet prompt beforehand" |
| Shipped code | `studio/scripts/migrate-venue-access-18-months.mjs`, operator-todo `migrate-venue-access-18-months` |

A fixed 548-day window and a wedding-date-relative term with a Keepsake state
are different products. The second is what D-001 and the backlog describe. The
first is implemented and migrated.

**Downstream consequences if changed.** Entitlement code, the access migration,
couple-facing copy, the drop-to-Free email, the Venue Portal term display and
the Keepsake export all change. E04.07's lifecycle state machine cannot be
designed until this is settled.

---

## D-005 — Entitlement model: 40/80 allotment versus eligible-booking or fair use

- **Date:** 2026-08-02
- **Status:** **proposed — founder decision required**
- **Decision-maker:** Ethan McNamara
- **Affects:** E02.12, E07.07, E07.11, E12.08, E15.16

**Conflict recorded, not reconciled.** The backlog (E07.07) instructs replacing
"the old 40/80 allotment language" with a final eligible-booking or fair-use
entitlement model. The current position is unresolved in the machine contract
itself: `commercial-terms.v1.json` carries `activationAllowance: null` and lists
`venue_activation_allowance` and `venue_calendar_month_semantics` in its
`unresolved` array, and `studio/content/hq/operator-todos/licensing-policy-ratification.md`
is the open founder gate. `studio/docs/venue-portal/PRODUCT_CONTRACT.md` still
describes allotment-based Overview and Access surfaces.

The entitlement model drives the unit economics of the €1,000 founding rate
(E02.12). It cannot stay open once the founding rate is ratified.

---

## D-006 — Surface naming: "Venue Portal" versus "Signal Studio Account"

- **Date:** 2026-08-02
- **Status:** **proposed — founder decision required**
- **Decision-maker:** Ethan McNamara
- **Affects:** E07 (all 18 tasks), E12.06, E14.12

**Conflict recorded, not reconciled.** D-001 and all of E07 name the buyer
surface the **Venue Portal**. The repository says otherwise:
`studio/docs/venue-portal/README.md` states "The current customer-facing model
is **Signal Studio Account**", the authenticated review route moved to
`/hq/account-review`, `/hq/venue-portal-review` redirects there, and Venue
Portal Phase A is marked "historical Phase A contract. Founder-approved on 25
July 2026."

This is either a genuine reversal of the 25 July decision or a naming
shorthand. It changes 18 task titles' meaning, the E12.06 preview and the
E14.12 film sequence, so it needs an explicit answer rather than an assumption.

---

## D-007 — Release date inheritance

- **Date:** 2026-08-02
- **Status:** approved
- **Decision-maker:** Ethan McNamara (via D-001 and the existing operator todo)
- **Affects:** E01.03, E15.01, M5

**Decision.** The 1 September 2026 working release target for this project is
the same date as the existing company launch gate recorded in
`studio/content/hq/operator-todos/open-signal-studio-2026-09-01.md`
(`LAUNCH_AT = 2026-09-01T00:00:00Z`, gating `src/lib/launch.ts` in both `studio`
and `tasks`).

**Rationale.** Two 1 September dates in one company are one date. Recording the
link now prevents a later session treating them as independent.

**Downstream consequences.** E15.01's go/no-go must account for the existing
operator todo's steps (redeploy to flip statically generated surfaces, the
marketing-CTA decision, the `/app` allowlist decision). Those are not duplicated
into this backlog; E15.06 references them.

---

## D-008 — Governance ratified

- **Date:** 2026-08-02 · **Status:** approved · **Decision-maker:** Ethan McNamara
- **Affects:** E01.04, E01.06, E01.11, E01.12

**Decision.**

1. **Scope exclusions** stand as written — internal venue operations, full-scale
   schools, full-scale students, unrelated product expansion — plus one
   addition: **no bespoke development for any individual founding venue.**
2. **Lanes** accepted, with one change: **E11 drafting moves to Claude Code**;
   Ethan keeps E11 execution. Writing fifteen sales assets is not the best use
   of the project's single constraint.
3. **Freeze dates:** offer 2026-08-15 · UI 2026-08-20 · copy 2026-08-21 ·
   capture 2026-08-22 · film-lock 2026-08-28 · release-candidate 2026-08-30.
4. **Weekly operating review:** Friday morning, folded into the existing Friday
   brief rather than a new ritual.

**Rationale.** The founder is the constraint; every governance answer here moves
work off him or bounds it.

**Downstream.** The freeze dates are aggressive and assume Round 2 lands
promptly. If they slip, the release *definition* moves through a change record
(Q1 in D-015), not the work.

---

## D-009 — Founding 25 commercial offer ratified · supersedes the 2026-07-11 decision

- **Date:** 2026-08-02 · **Status:** approved · **Decision-maker:** Ethan McNamara
- **Affects:** E02.01, E02.02, E02.03, E02.05, E02.09, E02.10, E02.11, and every commercial surface
- **Supersedes:** D-003 (conflict, now resolved) and
  `studio/content/hq/decisions/venue-edition-fixed-price-2026-07-11.md`

**Decision.**

1. **EUR 1,500 standard**, annual prepaid. **First 25 founding agreements at
   EUR 1,000**, annual prepaid.
2. **Wording:** "EUR 500 a year less, for as long as you stay."
3. **The lock** covers the base annual Venue Edition agreement only, for as long
   as it renews continuously without lapse. Never "for life", never "forever".
4. **Change of control:** the rate follows the property, not the company. It
   survives rebrand and ownership change while the agreement runs continuously.
   It does not transfer to additional properties a new owner brings.
5. **Founder access:** one 30-minute call per venue per year, plus a named email
   route. Not standing access.
6. **Programme name:** "Founding 25". A venue number is assigned **on payment**,
   not on signature.
7. **Founding places** are held 14 days from proposal, once, extendable by Ethan
   personally.

**Rationale.** A concrete euro saving beats a fraction to a venue owner doing
arithmetic in euro. Assigning the number on payment is the only event that
cannot be walked back, which is what makes 01/25 mean something. Bounding
founder access stops twenty-five unbounded relationships becoming a full-time
job.

**Alternatives considered.** Keeping the 2026-07-11 position (15 venues locking
EUR 1,500, no discount) — rejected by the founder in favour of a larger founding
cohort at a real reduction.

**Downstream — recorded, not yet actioned.**
`venue-edition-fixed-price-2026-07-11.md` must be superseded by a new dated HQ
decision; `contracts/commercial-terms.v1.json` needs a new version
(`foundingCohortSize` 15 → 25, founding rate added); `src/app/venues/page.tsx`
must carry the founding rate (E12.04); the certificate becomes 01/25–25/25 at
EUR 1,000 (E12.11); the film price sequence changes (E13.08). Each is its own
task with its own founder sign-off.

---

## D-010 — Legal, rights and lifecycle ratified

- **Date:** 2026-08-02 · **Status:** approved · **Decision-maker:** Ethan McNamara
- **Affects:** E03.07, E03.08, E03.09, E03.12, E04.07, E06.11
- **Resolves:** D-004 (couple access term conflict)

**Decision.**

1. **Rights.** Venues are asked for logo and name usage in the founding
   programme and on the map. **Couples are asked for nothing by default.** Any
   case-study use is a separate, specific, opt-in permission.
2. **Couple access term.** 18 months from redemption, **or 3 months past the
   wedding date, whichever is later.** This keeps the shipped and migrated
   18-month implementation and fixes the case that actually hurts: a couple who
   redeems early and marries at month 20.
3. **Keepsake.** Free, read-only, indefinite access *while the service exists*,
   with a one-click export the couple owns. Never the word "forever". No storage
   guarantee. The export is what makes the promise honest.
4. **External review (E03.12).** Commission against drafts in the week of
   2026-08-11. **Now in conflict with the zero budget decided in D-015. See
   I-004 — this task cannot proceed as written.**

**Rationale.** A trust story does not survive a rights grab in the terms, so the
couple is asked for nothing. Keeping 18 months preserves working, migrated code
rather than throwing it away for a cleaner-sounding rule.

**Downstream.** D-004 is resolved in favour of the shipped implementation plus a
grace rule, so `migrate-venue-access-18-months` and the entitlements work stand.
`coupleAccessMonths: 18` in `commercial-terms.v1.json` remains correct; the
grace rule is additive, not a replacement.

---

## D-011 — Product and privacy boundaries ratified

- **Date:** 2026-08-02 · **Status:** approved · **Decision-maker:** Ethan McNamara
- **Affects:** E04.09, E06.08, E07.12, E04.08, E12.07, E14.12

**Decision.**

1. **Wedding dates in the portal.** Shown only where the couple redeemed a code
   from that venue. **Date changes are never shown** — a postponement is the
   couple's news to share, not a dashboard event.
2. **Attribution on a public keepsake.** One line in the footer. No logo, no
   badge, no "powered by" in the viewport. The venue gets equal restraint. If it
   reads as marketing on someone's wedding page, the thing being sold is gone.
3. **Small-cohort suppression.** Thresholds stay at 3 eligible sponsored
   workspaces for behavioural counts and 5 for percentage cohorts, as already
   documented in the Phase A contract.

**Rationale.** Each of these is a place where a defensible product decision and
a trustworthy one diverge, and the trustworthy one was chosen.

---

## D-012 — Demo story and market definition ratified

- **Date:** 2026-08-02 · **Status:** approved · **Decision-maker:** Ethan McNamara
- **Affects:** E09.06, E09.08, E10.01, E10.02, E10.04, E13.03

**Decision.**

1. **Demo story.** Glenmara House, Mara and Finn, approved as-is. Synthetic,
   already present across the repo, and changing it would mean rebuilding
   fixtures across four products plus the portal.
2. **Demonstration imagery is AI-generated, not licensed stock** — a scope
   amendment to E09.08, logged in `CHANGELOG.md`. Budget is zero. The task's own
   requirement, that no unapproved real venue or couple material is used, is
   satisfied by generation rather than by licensing. Quality risk recorded as
   R-011.
3. **Geography.** A 45-minute drive-time ring from Limerick city centre. Public
   term: "Limerick and the surrounding counties". The same geometry serves the
   film map (E13.03), so one decision does two jobs.
4. **Eligible venue types.** In: dedicated wedding venues, country houses,
   castles, hotels with a real weddings operation, barn and estate venues.
   Out: restaurants, pubs, marquee hire, town hotels doing occasional weddings,
   and anywhere under roughly 20 weddings a year — below that, EUR 1,000 a year
   cannot be justified to them honestly, and a venue that cannot justify it will
   not renew.

**Alternatives considered.** Licensed stock photography at roughly EUR 300–600
— rejected on the zero budget.

---

## D-013 — Outreach model ratified · email only

- **Date:** 2026-08-02 · **Status:** approved · **Decision-maker:** Ethan McNamara
- **Affects:** E11.03, E11.04, E11.06, E11.13, E11.14, E13.17, E15.07

**Decision.**

1. **The channel is email.** Personalised film plus landing page. **No in-person
   visits.**
2. **Capacity: 50 venues on launch day.** The only per-venue work is changing the
   venue's details in the email and adding that venue's name to the master map
   animation dot so the film is specific to them. **This conflicts with the
   25-venue cohort rule in D-001 point 10 — see I-005.**
3. **Sending.** From `signalstudio.ie`; DKIM is pending and gates it. Track
   **film link clicks only**. No open pixels — open tracking on a cold email to
   people you want a trust relationship with is a bad trade.
4. **Stopping rule.** Film, then two follow-ups, then a final short note, then
   stop and mark `later`. Four touches.
5. **Slot mechanics.** Proposal expires with the 14-day hold; the place locks on
   payment; a referral is asked only after the venue's first couple activates,
   never at signature; publicity consent is always separate, opt-in and
   revocable.

**Rationale.** Email plus a personalised film is the only channel that scales to
50 venues against one founder's calendar, and the per-venue customisation is
genuinely cheap because it is data, not craft.

**Downstream.** E11.06 is **deferred**, not cancelled — its in-person route is
dead and one confirmation is outstanding on whether physical letters survive.
E13.17 ("Render and manually QA all 25 Cohort 1 videos") is directly affected by
I-005. R-010 records the deliverability exposure of 50 cold sends on day one
from a domain whose DKIM is still pending.

---

## D-014 — Film and founding-request boundaries ratified

- **Date:** 2026-08-02 · **Status:** approved · **Decision-maker:** Ethan McNamara
- **Affects:** E14.13, E15.13, E02.08

**Decision.**

1. **No price in "Before the Day".** The film ends on the walkthrough CTA. The
   price belongs on the proposal page where it can carry its conditions; price
   on screen invites arithmetic during the emotional beat.
2. **Founding requests** are logged and shape the roadmap. Nothing is built for
   one venue. This is stated explicitly in the Benefits Charter (E02.08) so the
   boundary is a documented benefit rather than a refusal later.

---

## D-015 — Programme operating decisions (Q1–Q6)

- **Date:** 2026-08-02 · **Status:** approved · **Decision-maker:** Ethan McNamara
- **Affects:** the whole programme
- **Resolves:** D-006 (portal naming conflict)

**Decision.**

1. **Q1 — "Release on 1 September" means ready to contact Cohort 1.** The
   Founding 25 completes over the following months. M5 and M6 stay separate.
2. **Q2 — the first pass over E04–E12 is an audit, not a build.** Existing work
   is converted into evidence against written acceptance criteria before
   anything new is built. This is the largest single lever on the 120-task
   critical path.
3. **Q3 — progressive estimation.** Effort points are set when a task
   specification is written, never from a title.
4. **Q4 — the Signal Studio Account IS the Venue Portal.** One surface, two
   names. The 25 July 2026 decision stands. E07's task titles keep their words;
   the surface they describe is the Account. **D-006 is resolved** — no task is
   renamed, and no future session should treat these as two products.
5. **Q5 — the budget is zero.** The only resources are a Claude Code Max 20x
   subscription and a Codex Max 5x subscription. **This blocks E03.12 as
   written (see I-004) and constrains E13.13 (music and sound licensing) to
   zero-cost sources.**
6. **Q6 — film lanes split.** Codex takes the creative. Claude Code takes the
   parameterised render pipeline and map data (E13.04, E13.15, E13.16), which
   are engineering wearing a film costume.

**Downstream.** Q2 changes how E04–E12 are approached but not their scope: the
audit produces evidence against acceptance criteria, and whatever the evidence
does not cover is still built. Q5 is the constraint that now shapes E03.12,
E13.13 and any future task that assumed spend.

---

## D-016 — All legal work is AI-drafted. No solicitor, no accountant.

- **Date:** 2026-08-02 · **Status:** approved · **Decision-maker:** Ethan McNamara
- **Affects:** E03 (all twelve tasks), the legal release gate, E15.06, E02.12
- **Resolves:** I-004
- **Amends:** D-010 point 4

**Decision.** The budget is zero and stays zero. There will be no solicitor and
no accountant. Claude Code and Codex draft and review every legal and commercial
document: the annual Venue Edition agreement, the founding schedule, the
data-processing agreement and security schedule, the couple terms of service,
the couple privacy notice, and the public Timeline terms.

**Decision-maker's reasoning, in his words.** "We're using Claude Code and Codex
for everything. We don't actually need a solicitor. So we can use Claude Code
and Codex and do legal reviews and get things perfect. Anything legal, we will
handle."

**Raised once, reaffirmed.** The risk was put to the founder in full on
2026-08-02 (I-004): that the legal gate depends on an external review, that
annual prepaid B2B contracts, a DPA covering third-party wedding data, a
multi-year price-lock promise and VAT on prepaid revenue are the places where
being wrong is expensive after the fact, and that a fixed-fee quote costs
nothing to obtain. The founder considered it and decided. That is his call to
make and it is recorded as made. It is not re-argued anywhere in this project.

**What this changes, and it must not be blurred.**

1. **E03.12's title cannot be satisfied.** It reads "Obtain documented Irish
   legal and accounting review of the complete offer, founding promise, VAT
   treatment, privacy model and contracts." No such review will be obtained. The
   title is not rewritten — imported titles never are. Its disposition is
   recorded in D-017 and logged as a change request.
2. **The legal release gate's exit criteria change.** They currently require
   "documented Irish legal and accounting review obtained". They are rewritten to
   claim only what is true. Recorded in CR-001.
3. **No document, page, film line or portal string may ever state or imply that
   any part of this project has been legally approved, reviewed by a solicitor,
   or verified by an accountant.** This is now a standing constraint on E09.11,
   E12.07, E12.08, E13.09 and E14.12, and it is checked at every founder review.
   The existing project rule already forbids implying legal approval where only a
   draft or internal review exists; D-016 makes that rule permanent rather than
   temporary.

**Mitigation that actually costs nothing.** Every legal document is drafted
against an established Irish or EU reference position rather than from nothing,
then put through adversarial multi-agent review with distinct lenses — GDPR,
consumer contract fairness, commercial enforceability, and a hostile reading by
an agent instructed to find the clause that hurts the founder. Each review is
recorded as evidence against the task. This raises the floor. It does not
produce a legal opinion and no evidence record will describe it as one.

---

## D-017 — Cohort cadence: 25 at a time, sequentially. Not 50 on launch day.

- **Date:** 2026-08-02 · **Status:** approved · **Decision-maker:** Ethan McNamara
- **Affects:** E10.12, E10.13, E11.03, E13.17, E13.18, E15.07, E15.15
- **Resolves:** I-005
- **Supersedes:** D-013 point 2

**Decision.** Twenty-five founding places. Outreach goes out **25 venues at a
time**: Cohort 1, then Cohort 2, then Cohort 3, and on until 25 venues have
signed and paid. Fifty on launch day is withdrawn.

**Decision-maker's words.** "Just 25 places, but I will send out 25 emails, and
then I'll send out another 25 emails and another 25 until I get to 25."

**Effect.** This restores D-001 point 10 exactly as originally approved, so the
conflict is closed rather than traded. Capacity is not the constraint — the
founder can run 50 in a day — the *cadence* is a deliberate choice.

**Downstream.** E13.17 stays at 25 Cohort 1 renders, unchanged. E10.12 and
E10.13 stand as written. R-010 (deliverability) improves materially: 25 sends
per cohort rather than 50 in one day is a far safer sending pattern, and the
gap between cohorts is natural domain warming. R-010 stays open — 25 cold sends
from a domain with pending DKIM is still a real risk, just a smaller one.

---

## D-018 — No physical letters. Venue packs stay, as digital assets.

- **Date:** 2026-08-02 · **Status:** approved · **Decision-maker:** Ethan McNamara
- **Affects:** E11.06, E12.12, E12.13
- **Resolves:** I-006

**Decision.** No physical founder letters, no envelopes, no printed
leave-behinds, no in-person visit route. **Venue packs remain in scope** and are
digital: the pre-booking venue sales kit (E12.12) and the post-booking couple
welcome kit (E12.13), delivered as files a venue can use in its own brochures,
proposals, website and coordinator conversations.

**Downstream.** E11.06 stays **deferred** — its whole content was physical and
in-person. Nothing is lost: the pack work it implied lives in E12.12 and E12.13,
which were always in scope. E12.13's "printable welcome object" is produced as a
print-ready file the venue may print at its own cost; Signal Studio prints
nothing.

---

## D-019 — Project baseline approved

- **Date:** 2026-08-02 · **Status:** approved · **Decision-maker:** Ethan McNamara
- **Affects:** the whole programme

**Decision.** The project baseline is approved: 211 tasks and their titles are
the agreed scope; the 120-task critical path and the 54 release-blocking tasks
stand as imported; the proposed priorities, executors and epic-level
dependencies are accepted as recorded in `BASELINE_REVIEW.md`.

**FD-03 deferred, not abandoned.** The entitlement model and its unit economics
at EUR 1,000 (E02.12) was the one baseline decision still open at approval. The
founder approved the baseline with it explicitly deferred and instructed that it
come back as **a choice, not a question**. It is in flight and lands in this
session.

**Standing instruction recorded.** "Everything else, proceed based on your own
recommendations. If I have not specifically flagged this, then your
recommendation is good." This authorises Claude to decide implementation
approach, sequencing, test strategy and reversible choices inside approved
scope. It does **not** authorise Done without approval, does not authorise
change to price, terms, entitlement, the Keepsake promise, geography, scope,
release date or gate passes, and does not authorise irreversible or externally
visible actions. Those still come back.

---

## D-020 — Entitlement model ratified: every booked couple, unlimited (E02.12, FD-03)

- **Date:** 2026-08-03 · **Status:** approved · **Decision-maker:** Ethan McNamara
- **Affects:** E02.12, E07.03, E07.07, E07.08, E07.09, E08.02, E12.08, E15.16
- **Closes:** FD-03, the last open baseline decision · **Resolves:** D-005

**Decision.** Model A, corrected. A venue with a current paid licence may create
a sponsored workspace for any couple with a signed booking at that venue. **No
numeric entitlement appears in the commercial terms.**

**To a venue:** *Every couple who books their wedding with you gets a workspace,
for as long as your licence is current. No seat count, no per-couple maths,
nothing for your coordinator to track.*

**Four of the five recommended corrections are adopted:**

1. **Fair use notifies, never blocks.** Issuance above the internal ceiling
   alerts Signal HQ and keeps issuing. A numeric pause must never appear in a
   document that also says unlimited.
2. **Survival sentence, stated unprompted in the outreach email and the
   agreement:** any workspace already redeemed keeps its full term plus
   Keepsake, whatever happens to the licence. Only new issuance stops.
3. **Release rule:** if a couple cancels or moves venue, the venue can release
   the workspace, the couple keeps their content in Keepsake, and venue branding
   and the venue's name come off within 24 hours.
4. The venue's annual wedding count is collected **after signature** as an
   onboarding field, never as a contract term, with the line: *this sets your
   issuance ceiling, it never sets your price, and it never changes at renewal.*

**The fifth correction is REJECTED by the founder.** The recommendation was to
route venues above roughly 120 weddings a year to the standard €1,500 rather
than the founding rate. Ethan: *"I don't care if they have forty weddings or if
they have two hundred and fifty weddings. They're locked in at a thousand."*

**Consequence, recorded once and accepted.** Corrected break-even in the heavy
usage profile is roughly 94 couples per year. The largest venues in the
45-minute ring run 150 to 250 weddings. A 250-wedding venue in the heavy profile
costs roughly €1,750 a year against €1,000 gross — **a loss of about €750 per
year on that venue, permanently, under the price lock.** The founder's position
is that a 250-wedding flagship venue is worth more to the Founding 25 as a
reference than it costs to serve, which is a commercial judgement, not an error.
Recorded as R-021. No eligibility screen by volume will be built.

**Per-wedding arithmetic is retained as the sales language, not as a rule:**
€1,000 across 20 weddings is €50 a wedding, across 40 is €25, across 80 is
€12.50. The founder computes it; the venue never supplies it.

**Blocked on code.** "Unlimited" is not representable today (R-016): mint
refuses a null allotment and the onboarding form defaults to 10. Four changes
are required before this decision is real in the product.

---

## D-021 — Pricing is VAT-inclusive

- **Date:** 2026-08-03 · **Status:** approved · **Decision-maker:** Ethan McNamara
- **Affects:** E02.01, E02.06, E02.07, E03.02, E03.03, E08.01, E12.04, E15.02
- **Amends:** D-009 · **Supersedes** the VAT-exclusive drafting rule proposed in CR-001

**Decision.** **€1,000 for the Founding 25 and €1,500 standard are both
VAT-inclusive.** Ethan: *"that is inclusive... and that is VAT included."* Every
agreement, order form, invoice and page states the price as inclusive of VAT at
the prevailing rate.

**The founding lock, restated.** €1,000 inclusive, held for as long as the
agreement renews continuously without lapse, or until the service ends. Ethan's
words were "for life"; the **published wording stays as ratified in D-009 point
3** — no "for life", no "forever" — because an unconditional technical promise is
forbidden by D-001 point 16 and the same trap already caught this price lock once
(`commercial-truth.md`). The commercial substance is a permanent lock with no
expiry clause. The wording expresses it without promising the service is eternal.

**Consequence, recorded once and accepted.** This was recommended against. The
recommendation was to state prices VAT-exclusive with VAT added at the
prevailing rate, because that is the one irreversible part of the VAT question.
Under VAT-inclusive pricing, if Signal Studio is or becomes an accountable
person:

- €1,000 inclusive at the 23% standard rate nets **€813.01**.
- Across 25 founding venues that is **€4,674.75 a year** of revenue absorbed,
  permanently, and the price lock makes it uncorrectable.
- €1,500 inclusive nets €1,219.51.
- **A future VAT rate rise is also absorbed by Signal Studio**, not passed on,
  for as long as the lock holds.

The founder's position is that one clean round number to a venue is worth more
than the margin. Recorded as R-022.

**This makes the Revenue question urgent rather than optional.** If receipt of
foreign B2B services already makes Signal Studio an accountable person (R-018),
the haircut starts on the first €1,000 rather than at a turnover threshold. The
MyEnquiries submission is drafted at
`evidence/E02.07-revenue-myenquiries-submission.md` and is free.

---

## D-022 — The couple access term is fixed in code before any venue is contacted (R-015)

- **Date:** 2026-08-03 · **Status:** approved · **Decision-maker:** Ethan McNamara, on Claude's recommendation
- **Affects:** E03.08, E04.07, E04.09, E04.12, E06.11, E08.01, E15.03

**Decision.** Ethan: *"use your best judgement and make a recommendation, and
we'll go with whatever you recommend, because I agree it would be awful if they
were to lose access before the wedding day."*

**The recommendation, adopted:**

1. **Capture the wedding date at redemption.** It is the first thing a wedding
   workspace needs, it powers the Timeline, and the couple always knows it. If
   it is genuinely unknown, fall back to 548 days and recompute the moment it is
   set.
2. **Compute expiry dynamically, do not freeze it at mint:**
   `expiry = max(redemption + 548 days, wedding date + 90 days)`.
3. **Recompute on wedding-date change.** Postponement is common and must extend
   access automatically, never shorten it. Access can move later; it never moves
   earlier.
4. **Relax the mint guard.** `codes.ts:81-88` currently throws on any duration
   other than 548. It becomes: accept a computed duration, refuse anything
   shorter than 548 days.
5. **No upper cap.** A couple booking three years out gets three years plus 90
   days. At roughly €0.10 per live workspace per month that is about €4 of cost,
   against the certainty of the worst failure the product can produce. The
   Keepsake tail is already indefinite, so the marginal exposure is negligible.

**Why not simply raise the constant.** 548 days is the ratified commercial term
and appears in the machine contract, the sales narrative and the drop-to-Free
email. Raising it would silently change the offer for every couple to fix a case
that affects only long-lead bookings. The grace rule fixes exactly the broken
case and nothing else.

**Ordering.** This lands before UI-freeze (2026-08-20) and before any venue is
contacted. A sponsored couple losing access before their wedding, in public, at
the venue that gifted it, is the single worst outcome available to this product.

---

## D-023 — CR-001 approved under the founder's standing instruction

- **Date:** 2026-08-03 · **Status:** approved · **Decision-maker:** Ethan McNamara
- **Affects:** the legal release gate, E03.12, E03.01, E03.04, E15.06

**Decision.** CR-001 is approved: the legal gate's exit criteria are replaced
with the twelve honest criteria, and **E03.12 moves to Deferred** with its
critical-path flag cleared and an un-defer trigger attached.

**Basis.** Ethan did not name CR-001 specifically. He gave a standing
instruction across two consecutive messages: *"everything else, I want you to
proceed based on your own recommendations — if I have not specifically flagged
this, then your recommendation is good"*, and in this message *"use your best
judgement"* and *"for the things you ratify, that's good work."* CR-001's
recommendation was Approve.

**Flagged plainly, because this is a launch-gate change and change control
normally requires a named founder decision.** It is recorded as approved under
the standing instruction rather than as an explicit approval, and it is
reversible: say the word and the gate criteria revert.

**One amendment applied on adoption.** CR-001 criterion 6 required prices stated
VAT-exclusive. **D-021 supersedes that** — prices are VAT-inclusive. The
criterion becomes: every agreement states the price as inclusive of VAT at the
prevailing rate, and the written VAT position paper still answers
accountable-person status, tax point and OSS, with the Revenue reply attached.

**Un-defer trigger for E03.12, as amended by the legal-plan reviewer.** Not "the
first paid founding agreement" — that fires after venues are already bound.
Instead: **the first three founding agreements are signed on a one-year initial
term with the founding rate expressed as renewable on the same terms**, so an
early drafting error is correctable at renewal; and when €3,000 of founding
revenue has cleared, a fixed-fee review is commissioned before the next cohort
is signed. That amount is earmarked in the deferred-income schedule from the
first invoice.

---

## D-024 — Work packages return one recommendation packet, not per-task reviews

- **Date:** 2026-08-03 · **Status:** approved · **Decision-maker:** Ethan McNamara
- **Affects:** every work package, WORKFLOWS.md §2 and §4

**Decision.** Ethan: *"Let's get the work done and just come to me with
recommendations and ask me to approve or push back."*

A session running a work package **runs it to completion and returns a single
consolidated recommendation packet** covering every task in the package. It does
not stop for approval task by task. Thirteen separate founder reviews for one
package is the founder-capacity problem (R-006) wearing a process costume.

**What a session does on its own.** Research, ideation, iteration, labs, panels,
subagents, drafting, engineering, verification. It resolves its own blockers
rather than escalating them. Where a design direction is genuinely open it runs
`/lab`, picks nothing, and brings the options into the packet. Where a task
needs a judgement inside approved scope, it makes the judgement and records the
reasoning.

**What comes back, once, at the end.** One packet: what was done, what was
verified and how, the recommendations with a clear preference on each, anything
that needs a founder decision, and anything the session deliberately did not do.
Every item is answerable with **approve** or **push back**.

**What does not change.**
- Every task still carries its own acceptance criteria, evidence and founder
  sign-off state. The packet is a delivery mechanism, not a merge.
- **No task reaches Done without explicit founder approval.** Sessions move
  tasks to Founder Review and stop.
- Anything on the change-control list — price, terms, entitlement, the Keepsake
  promise, geography, scope, release date, gate passes — still stops the session
  and comes back before it is actioned, not after.
- Irreversible or externally visible actions still stop: deploying, publishing,
  sending, or touching a live public page.

**Escalate mid-package only when** proceeding under any assumption would produce
work that gets thrown away, or the action is irreversible. Otherwise state the
assumption, proceed, and put it in the packet.
