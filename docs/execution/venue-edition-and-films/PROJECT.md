# PROJECT — Venue Edition and Films

**Project ID:** VEF-2026
**Founder and final approver:** Ethan McNamara
**Company:** Signal Studio
**Control root:** `studio/docs/execution/venue-edition-and-films/`
**Reporting timezone:** Europe/Dublin
**Working release target:** 1 September 2026
**Charter version:** 1.2 · created 2026-08-02 · revised 2026-08-03
**Baseline:** **approved** 0.1.0, 2026-08-02, D-019

> **Revision 1.1** (2026-08-03, E01.04) brought §5, §10 and §13 into line with
> decisions that already outrank this file: **D-008, D-009, D-012, D-014, D-016,
> D-018, D-021 and CR-001 as approved by D-023**. §5 had still read "This offer
> is not yet ratified in the project record" a day after D-009 ratified it.
>
> **Revision 1.2**, same day, after an adversarial review of 1.1: §14 still said
> legal and accounting review was "External, recorded as evidence", which D-016
> reversed, and still assigned both films wholly to the motion lane, which
> D-015 Q6 split. Revision 1.1's own note was also wrong about itself — it cited
> D-019, which is baseline approval and irrelevant to the sections it changed,
> and pointed at an evidence file that does not exist.
>
> **Neither revision settles anything new.** Both only make this file stop
> contradicting decisions that already outrank it. The record of what changed is
> `tasks/E01.04.md` and `evidence/E01-governance-assessment.md`.

This is the durable charter. It survives fresh sessions and does not depend on
chat history. It does not contain the backlog: the backlog lives in
`PROJECT_STATE.json` and is rendered into `BACKLOG.md`.

---

## 1. Purpose

Sell, deliver and prove Venue Edition to 25 founding wedding venues in Greater
Limerick, supported by two films, on a product that is finished before the
first venue is contacted.

## 2. Business outcome

25 Greater Limerick founding venues signed, paid, configured, onboarded and
capable of issuing functioning couple invitations.

## 3. Release milestone

1 September 2026 is a **release milestone**, not the end of the project. It is
the date the product, portal, legal position, films and commercial system are
ready for the first cohort.

## 4. Final completion condition

The project closes when all 25 founding venues are signed, paid, configured,
onboarded and capable of issuing functioning couple invitations — and E15.17
and E15.18 are founder-approved.

Twenty-five invitations sent is not completion. Twenty-five signed is not
completion. Twenty-five paid is not completion until each account is
configured, onboarded and able to invite a couple.

## 5. Current approved commercial offer

| Item | Position |
|---|---|
| Standard annual price | €1,500, prepaid annually, **inclusive of VAT** at the prevailing rate (D-021) |
| Founding base rate | €1,000 annually prepaid, **inclusive of VAT**, first 25 qualifying Greater Limerick venues (D-009, D-021) |
| Founding places | Exactly 25, numbered 01/25 to 25/25. The number is assigned on payment, not on signature (D-009) |
| Entitlement | A workspace for every couple with a signed booking, while the licence is current. No numeric entitlement appears in the commercial terms (D-020) |
| **The lock** | Covers **the base annual Venue Edition agreement only**, while it renews continuously without lapse, or until the service ends. Never "for life", never "forever" (D-009 point 3, D-021) |
| **Change of control** | The rate follows the property, not the company. It survives rebrand and ownership change while the agreement runs continuously. It does not transfer to additional properties a new owner brings (D-009 point 4) |
| Conditions | Subject to final contractual continuity and eligibility conditions (E02.03, E02.04, E02.05) |
| Couple-visible price | None. The couple never sees a price |
| Geography | A 45-minute drive-time ring from Limerick city centre. Public term: "Limerick and the surrounding counties" (D-012) |

**This offer is ratified.** D-009 (2026-08-02) approved it and supersedes both the
2026-07-11 decision (`studio/content/hq/decisions/venue-edition-fixed-price-2026-07-11.md`:
15 founding venues locking €1,500, no discount) and the conflict recorded as
D-003. D-021 then fixed both prices as VAT-inclusive.

**Ratified is not the same as implemented, and the gap is closing as this is
written.** WP-10 superseded the HQ decision file, published
`contracts/commercial-terms.v2.json` carrying the ratified position, and
corrected the live `/venues` page during the Wave 1 session. A shrinking set of
strategy and brand-guide documents still carries the retired wording, listed and
regenerable at `evidence/E01.01-superseded-ledger.md`. **Re-run that file's greps
rather than trusting either it or this paragraph.** I-002 closes when E02.01 and
E12.04 are founder-approved, not when the strings change.

## 6. Founding 25 model

Outreach runs in researched cohorts of 25. Cohort 1 goes first; further
cohorts are released until 25 venues have signed and paid. A researched venue
is not a founding venue; an invited venue is not a signed venue; a signed
venue is not paid until payment is confirmed; a paid venue is not onboarded
until its account and first operating flow pass the onboarding definition.

## 7. Product model

1. Venue Edition is a venue-sponsored couple experience.
2. The venue purchases and gifts the experience.
3. The couple owns and controls the private planning workspace.
4. The venue sees invitation administration, activation evidence and
   privacy-safe aggregate adoption evidence. It never sees private planning
   content.
5. The Venue Portal is a trust layer, an access-administration layer, an
   aggregate adoption-evidence layer, and a reporting and renewal layer.
6. Venue Edition is not an internal venue-operations platform. Internal venue
   operations are out of scope.
7. The Shared Timeline is the principal emotional and visual product artifact.
8. Authenticated owner experiences retain the Signal Studio black rail where
   appropriate. Shared public artifacts stay rail-free and should feel owned by
   the couple, not like public productivity-software screens.
9. The shared artifact requires a controlled privacy and Keepsake model. No
   unconditional technical promise that the service or hosted artifact will
   exist "forever" may be made anywhere.

## 8. The two-film system

| Film | Epic | Lane | Role |
|---|---|---|---|
| Limerick First — Founding Invitation Film | E13 | Codex (signal-motion), creative | Personalised 35–45s invitation, one render per Cohort 1 venue |
| Before the Day — Venue Edition Film | E14 | Codex (signal-motion), creative | 60–75s product film, the sponsored couple experience |

**The lane is split (D-015 Q6).** Codex owns the creative on both films. Claude
Code owns the map data, the data-driven composition and the parameterised render
pipeline: **E13.04, E13.15 and E13.16.** Those are engineering wearing a film
costume, and the task executors in `PROJECT_STATE.json` reflect it.

Neither film is complete because a draft render exists. Both carry explicit
stage trackers in `PROJECT_STATE.json`.

## 9. Scope

In scope: project governance; the commercial offer and Founding 25 programme;
legal, privacy and account-lifecycle rules; product architecture and workspace
lifecycle; the couple planning experience; the Shared Timeline and Keepsake
artifact; the Venue Portal and its reporting; billing, security, reliability and
release engineering; measurement, demo data and copy; the Greater Limerick venue
universe and cohorts; the sales operating system; commercial web and asset
system; both films; release, onboarding and completion of the Founding 25.

## 10. Explicit exclusions

- Internal venue-operations software.
- Full-scale schools and full-scale students programmes. They are secondary
  wedges and must not dilute the venue-first critical path.
- Unrelated product expansion.
- **No bespoke development for any individual founding venue** (D-008 point 1).
  Founding requests are logged and shape the roadmap. Nothing is built for one
  venue, and the Benefits Charter states that boundary as a benefit rather than
  leaving it to surface later as a refusal (D-014 point 2, E02.08).
- Anything not traceable to an epic in `BACKLOG.md`. New scope enters through a
  change request (`templates/CHANGE_REQUEST.md`), never by accretion.
- No physical letters, envelopes, printed leave-behinds or in-person visits
  (D-018). Venue packs stay in scope as digital assets.

## 11. Project principles

1. The product is polished before external outreach. Portal and reporting edge
   cases are not optional post-sale work.
2. Nothing is Done without explicit founder approval.
3. Evidence beats assertion. "It should work" is not a status.
4. Conflicts are recorded, not reconciled by guesswork.
5. Privacy language must survive a hostile reading: the venue sees adoption,
   never content.
6. No fabricated precision — in percentages, in dates, or in claims about the
   product.
7. One primary focus at a time.

## 12. Success measures

| Measure | Target |
|---|---|
| Founding venues paid | 25 |
| Founding venues onboarded and able to invite a couple | 25 |
| Release gates passed by 1 September 2026 | 6 of 6, or documented founder waiver |
| Films locked | 2 of 2, founder-approved |
| Verified completion at release | Every release-blocking task Done |
| Privacy commitments broken | 0 |

## 13. Release gates

Six independent gates. Each has an owner, exit criteria, supporting epics,
blockers, evidence, a founder decision and a pass date. They live in
`PROJECT_STATE.json` and render into `STATUS.md`.

1. **Commercial** — founder — offer, founding rate, entitlement, renewal rules.
2. **Legal** — founder — agreements, DPA, couple terms, Keepsake, the GDPR role
   map and the written VAT position. **No solicitor and no accountant** (D-016).
   The gate's twelve exit criteria were rewritten by CR-001 and approved as
   D-023; a pass is recorded as "founder-accepted without professional review",
   never as legal approval.
3. **Product** — Claude Code — couple experience, Timeline, portal, lifecycle.
4. **Data, security and reliability** — Claude Code — isolation, auth, backups, instrumentation.
5. **Creative** — Codex (motion) — both films through QA and approval.
6. **Sales readiness** — founder — cohorts, CRM, sequences, commercial pages.

The launch go/no-go (E15.01) cannot pass unless every gate has passed or Ethan
has documented an explicit waiver. A high task-completion percentage never
overrides a failed gate.

## 14. Governance

| Role | Who |
|---|---|
| Final decision-maker and approver | Ethan McNamara |
| Product, infrastructure, operations lane | Claude Code |
| Motion lane, both films, creative | Codex, in `signal-motion` |
| Map data, data-driven composition and the parameterised render pipeline (E13.04, E13.15, E13.16) | Claude Code, per D-015 Q6. Engineering wearing a film costume |
| Legal, accounting, professional review | **None. D-016 ratified no solicitor and no accountant.** Claude Code and Codex draft and adversarially review every legal document. No record may describe that as a legal opinion, and no surface may state or imply legal approval |

Only the main Claude session writes `PROJECT_STATE.json`, `DECISIONS.md`,
`RAID.md`, `HANDOFF.md` and session logs. Subagents research and report back;
they never mutate project-control files.

## 15. Source-of-truth order

1. Explicit founder decisions recorded in the current approved project documents.
2. The latest approved entry in `DECISIONS.md`.
3. `PROJECT.md` (this file).
4. Approved task specifications in `tasks/`.
5. `PROJECT_STATE.json`.
6. Current repository implementation and verified evidence.
7. Historical business plans, market-entry documents, prototypes and archived material.

Historical material may inform work. It must never silently override a current
decision. When sources conflict: record the conflict in `DECISIONS.md` or
`RAID.md`, identify the downstream impact, and put it to Ethan as a founder
decision when one is genuinely required. Do not guess which source was intended.

## 16. Decision authority

Claude may decide: implementation approach, task sequencing within an approved
plan, test strategy, evidence format, and anything reversible inside an
approved task scope.

Ethan decides: price, terms, entitlement, the Keepsake promise, geography,
scope, release date, gate passes and waivers, film approval, public claims,
anything irreversible or externally visible, and every move to Done.

## 17. Task-state model

`Backlog → Ready → In Progress → Internal Review → Founder Review → Done`,
plus `Blocked`, `Deferred`, `Cancelled`.

Claude may move a task into Ready, In Progress, Internal Review or Blocked when
evidence supports it, and may prepare a task for Founder Review. Claude may
never infer founder approval. Only an explicit statement from Ethan, or the
`approve` command run on his instruction, moves a task to Done.

Detailed rules — splits, reopening, WIP, batches — are in `WORKFLOWS.md`.

## 18. Founder sign-off rule

Done requires all four:

1. agreed acceptance criteria;
2. recorded evidence;
3. required verification passed;
4. explicit founder approval.

"The code exists", "the document was written" and "tests passed" do not by
themselves mean Done. Work that looks finished but lacks approval sits in
Founder Review. `project-control.mjs` enforces this: `transition` cannot set
`done`, and `approve` refuses without criteria and evidence.

## 19. Reporting cadence

- **Every session:** briefing at open, `render` and session record at close.
- **Weekly:** operating review against `STATUS.md` — blockers, decisions,
  evidence, quality, pipeline, next seven days (E01.12).
- **On demand:** any scope via `status <scope>`.

Methodology, including exactly what a percentage means, is in `REPORTING.md`.

## 20. Change control

Any change to price, founding-rate terms, number of founding venues,
geographic boundary, entitlement model, couple access term, Keepsake promise,
product scope, film scope, release date, launch gates or the project completion
condition requires a formal change record (`templates/CHANGE_REQUEST.md`),
logged in `CHANGELOG.md` and decided in `DECISIONS.md`. The baseline is never
silently edited.

## 21. Data handling

- No credentials, tokens or secrets in project files, ever.
- No private couple information in this project tree.
- No personal recipient data in generated status reports. The generated reports
  are count-only by design and `validate` fails if contact data appears in the
  commercial tracker.
- Venue names are not published as participants without approval (E10.14, E15.16).
- Signal HQ and the CRM stay the source of truth for venue contacts. Project
  files reference stable account IDs, never duplicated contact records.
- `private/` holds a template and handling guidance only. The live
  `private/venues.csv` is gitignored.
- Never imply legal approval where only a draft or internal review exists.

## 22. Definition of project completion

The project is complete when, and only when:

1. 25 Greater Limerick founding venues are signed;
2. all 25 have paid;
3. all 25 accounts are configured;
4. all 25 are onboarded per the onboarding definition;
5. all 25 are capable of issuing functioning couple invitations;
6. the founding offer is closed at 25 and standard €1,500 pricing is live on
   all new commercial surfaces (E15.17);
7. the postmortem, archive and handover into operations are complete (E15.18);
8. Ethan has approved 6 and 7.
