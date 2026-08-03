# RAID — Venue Edition and Films (VEF-2026)

Risks, assumptions, issues and dependencies. Stable IDs. Entries are updated in
place with a `last reviewed` date; they are not deleted.

Severity = probability × impact, judged, not calculated. Where a RAID entry is
genuinely blocking a task, it is also recorded as a task blocker in
`PROJECT_STATE.json` so it appears in `STATUS.md` — the register alone is not
enough to stop work.

Opened 2026-08-02 at baseline import.

---

## Category index — the six E01.09 categories

E01.09 names six categories this register must cover. Until 2026-08-03 nothing
checked that it did, and `Type:` was uncontrolled free text: 22 risks carried 17
distinct type strings. A category could go missing and no tool, test or report
would notice. **Launch had gone missing.** It was found by auditing the register
against the words of the task title, which is the only mechanism that existed.

| Category | Entries |
|---|---|
| **commercial** | R-003, R-008, R-010, R-021, R-022, **R-031, R-033**, I-002, I-005, **I-011** |
| **product** | R-015, R-016, R-007 |
| **privacy** | R-007, R-017, **R-032** |
| **delivery** | R-001, R-004, R-005, R-009, R-010 |
| **founder-capacity** | R-006, A-006 |
| **launch** | **R-023, R-024, R-025** — opened 2026-08-03. This row was empty |
| **governance** | I-007, I-008, I-009, **I-010** — not one of the six E01.09 categories, but the audit that populated them found four governance failures and they need somewhere to live |

An entry may sit in more than one category; `Type:` on each entry keeps its
original compound string, which is more informative than a single label. This
index is the controlled vocabulary. **A category with an empty row is a finding,
not a formatting problem.**

Two structural notes, both real and both unfixed:

1. **Nothing validates this file.** `project-control.mjs` never reads `RAID.md`
   or `DECISIONS.md`. Both are hand-maintained markdown that no test, render or
   drift check touches. Every guarantee the tooling makes is about
   `PROJECT_STATE.json` and the two generated reports, and about nothing else.
2. **The escalation rule in the header is not exercised.** It says a genuinely
   blocking entry is also recorded as a task blocker in `PROJECT_STATE.json`.
   `status blockers` returns no blocked tasks while R-015 sits at probability
   certain and severity critical. That is defensible — R-015's fix is routed into
   E04.07 scope rather than blocking anything — but nothing cross-checks the two,
   so a real breach of the rule would be invisible.

---

## Risks

### R-001 — 120 critical-path tasks against 30 days to the release milestone
- **Type:** delivery · **Probability:** high · **Impact:** high · **Severity:** critical
- **Owner:** Ethan McNamara
- **Trigger:** already live. The imported critical path is 120 of 211 tasks; the release milestone is 2026-09-01, 30 days from import.
- **Mitigation:** the release milestone and the completion condition are already separated (E01.03), so a slip in scope is not a slip in the business outcome. Options for Ethan at baseline approval: (a) accept 1 September as ready-for-Cohort-1 only, with a reduced release-blocking set; (b) move the release date through a change record; (c) reduce scope through change records. Doing nothing means the date decides for us.
- **Affects:** every epic
- **Status:** open · **Target resolution:** at baseline approval · **Last reviewed:** 2026-08-02

### R-002 — External legal and accounting review is unschedulable and gates the legal gate
- **Type:** external · **Probability:** high · **Impact:** high · **Severity:** high
- **Owner:** Ethan McNamara
- **Trigger:** E03.12 not commissioned by the time E03.02–E03.11 drafts are ready.
- **Mitigation:** commission the reviewer early against drafts rather than finals; treat their advice as evidence and a decision input, never as an invented conclusion; keep the legal gate honest — no "legal approved" claim while only a draft or internal review exists.
- **Affects:** E03.12, legal gate, E15.06
- **SUPERSEDED 2026-08-02 by D-016.** There will be no external review at all, so an unschedulable one is no longer the risk. The exposure moved, it did not shrink: see R-013.
- **Status:** **superseded by R-013** · **Last reviewed:** 2026-08-02

### R-003 — The founding-rate change is unratified and sits upstream of everything commercial
- **Type:** commercial · **Probability:** high · **Impact:** high · **Severity:** critical
- **Owner:** Ethan McNamara
- **Trigger:** live. See D-003.
- **Mitigation:** ratify in E02.01 before any commercial copy freezes (E09.12 already depends on E02.01/E02.03/E02.12/E03.09). Keep the film price sequence parameterised (E13.08) so a change is a re-render, not a rebuild.
- **Affects:** E02, E03.03, E07.03, E08.02, E12.04, E12.11, E13.08, E13.09, E14.13, E15.16, E15.17
- **Status:** open · **Last reviewed:** 2026-08-02

### R-004 — Final product capture sits behind four whole epics
- **Type:** delivery · **Probability:** high · **Impact:** high · **Severity:** high
- **Owner:** Claude Code
- **Trigger:** any slip in E05, E06, E07 or E09 moves E14.15, and both films after it.
- **Mitigation:** E14.15's dependencies are recorded as controlling edges, so the tool refuses to start capture early. Non-capture film work (E14.01–E14.14, E14.16–E14.17 planning) proceeds in parallel. Freeze dates are set in E01.11.
- **Affects:** E14.15, E14.16, E14.17, E14.18, creative gate
- **Status:** open · **Last reviewed:** 2026-08-02

### R-005 — Cohort 1 renders need verified data for 25 real venues that are not yet researched
- **Type:** delivery · **Probability:** medium · **Impact:** high · **Severity:** high
- **Owner:** Claude Code
- **Trigger:** E13.17 reached before E10.06, E10.08 and E10.12 are complete.
- **Mitigation:** already a controlling dependency. E10 runs from day one, independent of product work. `studio/docs/strategy/VENUE_TARGET_LEDGER.md` and `VENUE_WAVE1_DOSSIERS.md` are candidate inputs, not verified data — the ledger's own rule is that contact data stays blank until independently verified.
- **Affects:** E10.06, E10.08, E10.12, E13.17
- **Status:** open · **Last reviewed:** 2026-08-02

### R-006 — Founder capacity is the single constraint on the decision epics
- **Type:** capacity · **Probability:** high · **Impact:** high · **Severity:** high
- **Owner:** Ethan McNamara
- **Trigger:** E02, E03, E11 and E15 are founder-executed; E01.01–E01.11 and every gate need founder decisions; no task can reach Done without founder approval.
- **Mitigation:** batch founder decisions into the weekly operating review (E01.12); keep founder-review packets short and evidence-led; use the founder-review queue in `STATUS.md` rather than chat messages.
- **Affects:** E02, E03, E11, E15, all six gates
- **Status:** open · **Last reviewed:** 2026-08-02

### R-007 — Privacy claims outrunning the implementation
- **Type:** privacy · **Probability:** medium · **Impact:** high · **Severity:** high
- **Owner:** Claude Code
- **Trigger:** film, landing page or portal copy stating the venue "never sees" something before E04.08 and E07.12 are implemented and verified.
- **Mitigation:** privacy QA is a named task on both films (E14.18) and the portal (E07.12, E07.18); no privacy, security, contract or accounting task is marked complete without the required evidence.
- **Affects:** E04.08, E06.01, E07.12, E12.07, E14.12, E14.18
- **Status:** open · **Last reviewed:** 2026-08-02

### R-008 — The "forever" trap in Keepsake language
- **Type:** legal/commercial · **Probability:** medium · **Impact:** medium · **Severity:** medium
- **Owner:** Ethan McNamara
- **Trigger:** any copy, film line or contract clause promising the hosted artifact exists indefinitely.
- **Mitigation:** D-001 point 16 forbids it. E03.09, E03.11, E06.11, E09.11 and E12.08 each need to survive a hostile reading. Note the same trap already caught the venue price lock: `commercial-truth.md` records "Do not write 'for life'".
- **Affects:** E03.09, E03.11, E06.11, E09.11, E12.08, E13.09
- **Status:** open · **Last reviewed:** 2026-08-02

### R-009 — Two agent lanes editing the same programme
- **Type:** delivery · **Probability:** medium · **Impact:** medium · **Severity:** medium
- **Owner:** Claude Code
- **Trigger:** Codex works E13/E14 in `signal-motion` while Claude works E05–E09 in `app`/`studio`; both need project-state updates.
- **Mitigation:** only the main Claude session writes `PROJECT_STATE.json`. Codex's film work is reconciled through `/venue-sync`. Neither lane rewrites the other's in-flight work.
- **Affects:** E13, E14
- **Status:** open · **Last reviewed:** 2026-08-02

---

## Assumptions

### A-001 — "Release" means ready for Cohort 1, not 25 venues live
- **Owner:** Ethan McNamara · **Status:** **confirmed 2026-08-02 by D-015 Q1.** No longer an assumption.
- M5 (release) and M6 (Founding 25 complete) stay separate, which is what keeps R-001 survivable.

### A-002 — Film pre-production can proceed against unratified commercial figures
- **Owner:** Claude Code · **Status:** open
- Depends on E13.08 being genuinely parameterised. If the price is baked into the composition, D-003 blocks all E13 finishing work, not just E13.17.

### A-003 — E10 research has no product dependency
- **Owner:** Claude Code · **Status:** open
- Stated verbatim in the backlog. Recorded so that any later coupling is visible.

### A-004 — Existing repository work reduces E04–E07 effort
- **Owner:** Claude Code · **Status:** **unverified**
- Candidate assets found at import: `studio/docs/venue-portal/*` (Phase A contract, metric dictionary, privacy and retention, roles, wireframes), `studio/docs/architecture/ADR-007-venue-portal-phase-a.md`, `studio/docs/account/`, `app/src/app/{redeem,invite,share,settings}`, `studio/scripts/check-venue-edition-contract.mjs`, entitlements and access migrations. None of it is founder-approved against this project's acceptance criteria, so none of it is Done. The size of the reduction is unknown until task specifications are written against the current code.

### A-005 — Legal and accounting review turnaround is outside our control
- **Owner:** Ethan McNamara · **Status:** open

### A-006 — Capacity is one founder plus two agent lanes
- **Owner:** Ethan McNamara · **Status:** open
- No additional capacity is assumed anywhere in the plan.

### A-007 — Glenmara House and Mara-and-Finn are synthetic
- **Owner:** Claude Code · **Status:** open
- E09.07 and E09.08 depend on the demonstration venue and couple being invented, licensed and free of any unapproved real venue or couple material.

---

## Issues

### I-001 — The baseline is Draft and nothing downstream can be committed to
- **Type:** governance · **Severity:** high · **Owner:** Ethan McNamara
- **Detail:** 211 tasks imported, 0 estimated, priorities proposed, executors proposed, six founder decisions open. Every percentage in `STATUS.md` is provisional until this closes.
- **Resolution:** answer `BASELINE_REVIEW.md`, then `baseline approve`.
- **Status:** open · **Target:** next founder session · **Last reviewed:** 2026-08-02

### I-002 — Live commercial surfaces contradict the current approved direction
- **Type:** commercial · **Severity:** high · **Owner:** Ethan McNamara
- **Detail:** `studio/src/app/venues/page.tsx` publishes "€1,500 per venue, per year · prepaid" with no founding rate; `contracts/commercial-terms.v1.json` encodes a 15-venue founding cohort. Both were left untouched in this setup session by instruction.
- **Resolution:** E02.01 ratification, then E12.04 and a new commercial-terms version.
- **WORKED 2026-08-03 by WP-10.** The record, the machine contract, the code, the
  strategy documents and the send-ready outreach now state the ratified position:
  `commercial-terms.v2.json` (cohort 25, €1,000 founding, VAT-inclusive, unlimited
  entitlement), a new Active HQ decision with the 2026-07-11 record marked
  Superseded, and roughly thirty files corrected. Full ledger:
  `evidence/E02.01-commercial-surface-reconciliation.md`.
- **The scale was larger than this entry recorded.** A full-workspace inventory
  found **roughly 140 files** carrying the retired position, not two. The July
  change reached sixteen gated files and stopped.
- **Two things keep this open rather than closed.** (1) `src/app/venues/page.tsx`
  is prepared but **not deployed** — it awaits founder approval of the page copy,
  which is the point of the hard stop. (2) Section C of the ledger lists what was
  deliberately not fixed and who owns it: the three public decks and the
  lender-facing loan pack, the film and demo scripts, the atlas entries, and the
  P0 operator-todo `planning-period-commercial-ratification` which still states
  "the founding 15" as evidenced fact while gating checkout.
- **Also found and fixed:** `scripts/mark-venue-paid.ts` wrote the standard price
  for both plans, so every founding venue would have been recorded in the cash
  ledger at €1,500 against €1,000 actually received.
- **Status:** open, materially reduced · **Closes when:** the page is approved and
  deployed, and ledger section C1 is cleared · **Last reviewed:** 2026-08-03

### I-003 — Internal source conflict in the supplied backlog: when E04 starts
- **Type:** governance · **Severity:** low · **Owner:** Ethan McNamara
- **Detail:** the sequencing directive says "Start immediately and in parallel … 4. E04–E09". The E04 epic note says "Begins once E02 and E03 core decisions are stable." Both are in the same supplied document.
- **Resolution:** recorded, not reconciled. Practical reading: E04 architecture *definition* work can start now; E04 *decisions* that depend on entitlement and lifecycle rules cannot. Needs one line from Ethan at baseline approval.
- **Status:** open · **Last reviewed:** 2026-08-02

---

## Dependencies

### DEP-001 — External Irish legal and accounting review (E03.12)
- **Type:** external professional · **Owner:** Ethan McNamara · **Status:** not started
- Gates the legal gate and E15.06. Not schedulable by Claude.

### DEP-002 — Verified venue coordinates and contacts (E10.06, E10.08)
- **Type:** internal research · **Owner:** Claude Code · **Status:** not started
- Controlling dependency for E13.17. `VENUE_TARGET_LEDGER.md` is an input, not a source of verified contacts.

### DEP-003 — Product, copy and demo freeze (E05.12, E06.12, E07.18, E09.09, E09.12)
- **Type:** internal · **Owner:** Claude Code · **Status:** not started
- Controlling dependency for E14.15. Freeze dates themselves are set in E01.11.

### DEP-004 — Live production verification before the first invitation (E15.01–E15.06)
- **Type:** internal · **Owner:** Ethan McNamara · **Status:** not started
- Controlling dependency for E15.07.

### DEP-005 — Company launch gate, 1 September 2026
- **Type:** internal, cross-programme · **Owner:** Ethan McNamara · **Status:** open
- `studio/content/hq/operator-todos/open-signal-studio-2026-09-01.md`. Redeploy to flip statically generated surfaces; marketing-CTA decision; `/app` allowlist decision. See D-007.

### DEP-006 — Licensing policy ratification
- **Type:** internal, cross-programme · **Owner:** Ethan McNamara · **Status:** open
- `studio/content/hq/operator-todos/licensing-policy-ratification.md`. Holds the unresolved activation allowance and calendar-month semantics that D-005 depends on.

### DEP-007 — Motion lane (Codex, `signal-motion`)
- **Type:** internal lane · **Owner:** Codex · **Status:** available
- E13 and E14 execution. Reconciled into project state through `/venue-sync`.

---

## Opened 2026-08-02 by the founder answers (D-008 to D-015)

### R-010 — Fifty cold sends on launch day from a domain with pending DKIM
- **Type:** delivery/commercial · **Probability:** high · **Impact:** high · **Severity:** critical
- **Owner:** Ethan McNamara
- **Trigger:** D-013 sets the outreach model as 50 personalised emails on launch day. `signalstudio.ie` DKIM is still pending (`studio/docs/DKIM_SETUP.md`) and gates all sending.
- **Why it matters:** fifty cold, near-identical, link-carrying emails sent in one day from a domain with no sending history is the textbook shape of a spam filter's bad day. If they land in Promotions or Junk, the entire founding cohort is burned silently — no bounce, no signal, just no replies. The films would be blamed for a deliverability failure.
- **Mitigation:** DKIM, SPF and DMARC complete first (E11.04) · warm the domain with real sends for two weeks before launch · stagger the 50 across three to five days rather than one · link to the film, never attach it · plain, short HTML with a real signature · no open pixels (already decided in D-013) · check inbox placement against a seed set before the first real send.
- **Affects:** E11.04, E15.07, E15.08, E13.17
- **Status:** open · **Target resolution:** before offer-freeze 2026-08-15 · **Last reviewed:** 2026-08-02

### R-011 — AI-generated imagery in an emotional wedding product
- **Type:** creative/brand · **Probability:** medium · **Impact:** high · **Severity:** high
- **Owner:** Claude Code
- **Trigger:** D-012 sets demonstration imagery as AI-generated on the zero budget.
- **Why it matters:** the rights position is clean and the cost is right, but AI-looking faces in a wedding film are the fastest available route to "cheap", which the design register forbids outright. The Shared Timeline is the principal emotional artifact; if its photographs read as synthetic, the film's central claim reads as synthetic too.
- **Mitigation:** prefer environments, details, hands, tables, flowers, light over faces · no close-up generated faces in either film or on the public Timeline demo · treat generated imagery as a first-class QA item at E05.12, E09.08 and E14.18, not a background asset · if a shot cannot be made to feel real, cut the shot rather than ship it.
- **Affects:** E05.12, E06.03, E09.07, E09.08, E12.05, E14.06, E14.09, E14.18
- **Status:** open · **Last reviewed:** 2026-08-02

### R-012 — Music and sound licensing on a zero budget
- **Type:** legal/creative · **Probability:** medium · **Impact:** medium · **Severity:** medium
- **Owner:** Codex (motion lane)
- **Trigger:** D-015 Q5 sets the budget at zero. E13.13 reads "Source and license the music and sound-effects palette."
- **Mitigation:** zero-cost sources with clear commercial terms only, and the licence recorded as evidence per track. A track used commercially without a written licence is a real exposure on a film sent to 50 businesses, and "it was free on the internet" is not a licence.
- **Affects:** E13.13, E14.16, E13.17, E14.18
- **Status:** open · **Last reviewed:** 2026-08-02

---

## Issues opened 2026-08-02

### I-004 — Zero budget makes the external legal and accounting review impossible as written
- **Type:** legal/commercial · **Severity:** **critical** · **Owner:** Ethan McNamara
- **Detail:** D-015 Q5 sets the budget at zero. E03.12 requires "documented Irish legal and accounting review of the complete offer, founding promise, VAT treatment, privacy model and contracts", and the **legal release gate's exit criteria require exactly that document**. A solicitor does not work for a Claude subscription. As things stand the legal gate cannot pass, which means E15.01 cannot pass, which means Cohort 1 cannot be contacted.
- **What is genuinely at stake:** annual prepaid contracts with 25 businesses, a DPA, a privacy model covering third-party wedding data, a multi-year price-lock promise, and VAT treatment on prepaid annual revenue. This is the one place in the project where getting it wrong is expensive after the fact rather than before.
- **Options for the founder:**
  1. **Quote first, decide second.** Fixed-fee quotes are free. Get two, then choose knowingly. Recommended regardless of which option follows.
  2. **Fund it from the first paid founding agreement.** The first venue at EUR 1,000 covers a basic review. Requires contacting Cohort 1 on unreviewed contracts, which is the exposure being avoided.
  3. **Local Enterprise Office Limerick.** Mentoring and business-advice supports are subsidised or free and can cover commercial-terms review, though not a solicitor's sign-off.
  4. **Change the legal gate's exit criteria** to "internal review complete, external review scheduled, gap documented" and pass it knowingly with the risk on record. Honest, and clearly worse than option 1 or 2.
  5. **Defer E03.12 past the release milestone**, contact Cohort 1 on reviewed-by-Claude drafts, accept the exposure.
- **RESOLVED 2026-08-02 by D-016.** The founder chose none of the five options: the budget stays zero, there is no solicitor and no accountant, and Claude Code and Codex draft and adversarially review every legal document. The risk was put to him in full and he reaffirmed. The legal gate's exit criteria are rewritten to claim only what is true (CR-001), E03.12's disposition is recorded, and a standing constraint now forbids any document, page, film line or portal string from stating or implying legal approval. The residual exposure does not disappear — it moves from I-004 to R-013, owned and accepted.
- **Status:** **resolved** · **Resolved by:** D-016 · **Last reviewed:** 2026-08-02

### I-005 — Fifty venues on launch day conflicts with the 25-venue cohort rule
- **Type:** governance/commercial · **Severity:** high · **Owner:** Ethan McNamara
- **Detail:** D-001 point 10 (founder-approved) says outreach runs in researched cohorts of 25, Cohort 1 first, with further cohorts released until 25 venues have signed and paid. D-013 (founder-approved) says 50 venues are emailed on launch day. Both are current approved decisions and they disagree. Recorded rather than reconciled.
- **Downstream if 50 is the intent:** E13.17 becomes "render and QA 50 videos", not 25 · E10.12 and E10.13 change shape (Cohort 1 is 50, or Cohorts 1 and 2 release together) · E10.04's universe of 125 still holds · the founding-place counter is unaffected, since 25 is still the number of places · R-010 gets materially worse at 50 than at 25.
- **The substantive question underneath it:** with 25 places and a 45-minute ring, contacting 50 venues on day one means roughly half of the responders cannot be given a place. That is a good problem if the scarcity is handled honestly and a bad one if two venues discover they were both told they were founding.
- **Options:** (a) Cohort 1 is 50, places still 25, first-to-pay takes the place, stated plainly in the email; (b) Cohorts 1 and 2 release together as two ranked waves 48 hours apart; (c) keep 25 on day one and release the second 25 on response data.
- **Recommendation:** (a) with the scarcity stated explicitly — it matches how Ethan actually wants to work, and honest scarcity is stronger than manufactured scarcity.
- **RESOLVED 2026-08-02 by D-017**, and not by any of the three options offered. The founder chose option (c) in substance: 25 places, 25 emails per cohort, sent sequentially until 25 venues sign. D-001 point 10 is restored intact rather than traded away, E13.17 stays at 25 renders, and R-010 improves because 25 sends per cohort with natural gaps is a far safer sending pattern than 50 in one day.
- **Status:** **resolved** · **Resolved by:** D-017 · **Last reviewed:** 2026-08-02

### I-006 — Physical letters: one confirmation outstanding
- **Type:** governance · **Severity:** low · **Owner:** Ethan McNamara
- **Detail:** D-013 kills in-person visits and sets the channel as email. E11.06 covers "the physical founder letter, envelope, leave-behind and in-person visit route" as one task, and the letter was not separately ruled on. E11.06 is deferred, not cancelled, until it is.
- **Question:** physical letters to Cohort 1, yes or no? At zero budget, 50 letters is a real print and postage cost, which points to no.
- **RESOLVED 2026-08-02 by D-018.** No physical letters, envelopes, leave-behinds or visit route. **Venue packs stay in scope as digital assets** — the pre-booking sales kit (E12.12) and the post-booking couple welcome kit (E12.13). E12.13's printable welcome object ships as a print-ready file the venue may print at its own cost. E11.06 stays deferred; nothing was lost with it.
- **Status:** **resolved** · **Resolved by:** D-018 · **Last reviewed:** 2026-08-02

---

## Risks opened 2026-08-02 by D-016 (no solicitor)

### R-013 — Legal documents drafted and reviewed without a solicitor
- **Type:** legal · **Probability:** certain (it is the chosen approach) · **Impact:** high · **Severity:** high
- **Owner:** Ethan McNamara — **accepted, not mitigated away**
- **Origin:** D-016. Replaces I-004, which is closed. This entry exists so the exposure stays visible for the life of the project instead of disappearing into a resolved issue.
- **What is actually exposed:**
  1. **The DPA and controller/processor position.** Couples enter personal data about third parties — family, suppliers, guests — who never agreed to anything. Getting the controller/processor split wrong between Signal Studio, the venue and the couple is the highest-consequence error available here, and it is not obvious from first principles.
  2. **Consumer contract fairness.** Couples are consumers. Irish and EU unfair-terms rules apply to the couple terms, and an unfair term is simply void — the clause a founder most wants is often the one that does not survive.
  3. **The multi-year price lock.** A promise made to 25 businesses in writing, intended to bind for years, drafted without review.
  4. **VAT on prepaid annual supply.** Timing, registration threshold and revenue recognition on money taken up front for a service delivered over twelve months.
  5. **No professional indemnity.** If a document is wrong, there is no one to carry it.
- **Mitigation, all zero-cost and all real:** draft from established Irish and EU reference positions rather than from nothing · adversarial multi-agent review per document with distinct lenses (GDPR, consumer fairness, commercial enforceability, hostile reading) · each review recorded as evidence, never described as a legal opinion · no surface anywhere claims legal approval · re-open the question the moment there is revenue, because the first EUR 1,000 changes what is affordable.
- **Affects:** E03.02–E03.11, E09.11, E12.07, E12.08, E13.09, E14.12, E15.06, legal gate
- **Status:** open, accepted · **Review trigger:** first paid founding agreement · **Last reviewed:** 2026-08-02

### R-014 — VAT and revenue recognition on prepaid annual contracts, unadvised
- **Type:** financial · **Probability:** medium · **Impact:** medium · **Severity:** medium
- **Owner:** Ethan McNamara
- **Trigger:** the first prepaid EUR 1,000 lands, or cumulative turnover approaches the Irish VAT registration threshold.
- **Detail:** separated from R-013 because it has a different owner, a different trigger and a different fix. Twenty-five venues at EUR 1,000 is EUR 25,000 of prepaid revenue in a compressed window. Whether VAT registration is required, when the supply is treated as made, and how prepayment is recognised are factual questions with documented Revenue guidance — findable and recordable without an accountant, but they are decisions, not lookups.
- **Mitigation:** document the position with its source before the first invoice is issued (E02.07, E08.01) · keep every prepayment identifiable so the treatment can be corrected retrospectively if wrong · revisit at the VAT threshold rather than at year end.
- **Affects:** E02.06, E02.07, E08.01, E08.03, E15.02
- **Status:** open · **Last reviewed:** 2026-08-02

---

## Risks opened 2026-08-03 · verified against shipped code

Each entry below was found by the entitlement-and-legal workflow and then
**verified directly against the repository by the main session** before being
recorded. File paths and line numbers are the verification, not the claim.

### R-015 — The ratified couple access term cannot be minted. The code refuses it.
- **Type:** product/commercial · **Probability:** certain · **Impact:** critical · **Severity:** critical
- **Owner:** Claude Code
- **Verified:** `studio/src/lib/venue-edition.ts:6` sets `VENUE_EDITION_COUPLE_ACCESS_DAYS = 548`. `studio/src/lib/entitlements-db/codes.ts:81-88` throws on any `venue_edition` mint whose `durationDays` is not exactly that constant: *"Venue Edition codes must use wedding access for 548 days"*.
- **Detail:** D-010 ratified "18 months from redemption, **or 3 months past the wedding date, whichever is later**". The second half is unimplementable today — the mint path hard-refuses any other duration, and no wedding date is stored on the entitlement. Irish venues book 12 to 24 months out. **A couple who books in March 2027 for a September 2028 wedding and redeems the day they sign loses Signal Studio before their wedding.** That failure lands on the couple, in public, at the venue that sponsored it — the single worst outcome the product can produce.
- **Why it is a risk and not just a task:** the decision is right and the code is wrong, but until the code changes, every venue-facing promise about the term is one the product cannot keep. The grace rule was ratified on 2026-08-02; nothing has told the code.
- **Mitigation:** store the wedding date on the sponsored entitlement at redemption and set expiry to `max(redemption + 548 days, wedding date + 90 days)` · until that ships, do not describe entitlement as attaching at signature; describe it as redeemable any time up to the wedding, and keep issuance close to the couple's planning start · add the fix to E04.07 and E08 scope explicitly.
- **Affects:** E03.08, E04.07, E04.09, E04.12, E06.11, E08.01, E15.03
- **Status:** open · **Target:** before UI-freeze 2026-08-20 · **Last reviewed:** 2026-08-03

### R-016 — "Unlimited" is unrepresentable, and today's real entitlement is a form default
- **Type:** product/commercial · **Probability:** certain · **Impact:** high · **Severity:** high
- **Owner:** Claude Code
- **Verified:** `studio/src/lib/entitlements-db/codes.ts:56-60` — mint enforces a hard allotment invariant and refuses on *"a null allotment"*. `studio/src/app/hq/entitlements/OnboardVenueForm.tsx:63-67` — the allotment field is required, `min={1}`, **`defaultValue={10}`**.
- **Detail:** the live `/venues` page promises "No seats. No per-couple maths." The shipped system cannot express that, and the number a venue actually gets is whatever the onboarding form defaulted to. **Ten.** Nobody decided ten. Meanwhile `project-venue-access.ts` computes a remaining count and raises a "No remaining allotment headroom" attention item in the venue's own portal, so a venue sold "no seats" is shown a seat count.
- **Mitigation:** four changes, all required before any unlimited entitlement is real — an explicit unlimited representation the mint accepts; suppression of `availableCount` and the headroom attention item for unlimited sponsors; the HQ near-allotment list filtered; the onboarding default replaced with a computed ceiling. Renaming the field is not one of them.
- **Affects:** E02.12, E07.03, E07.07, E07.08, E07.09, E08.02
- **Status:** open · **Target:** with the E02.12 decision · **Last reviewed:** 2026-08-03

### R-017 — Article 9 special-category data about guests who consented to nothing
- **Type:** privacy/legal · **Probability:** high · **Impact:** critical · **Severity:** critical
- **Owner:** Ethan McNamara
- **Verified, and CORRECTED 2026-08-03:** `app/src/lib/templates.generated.ts:108` ships a **"Collect final dietary notes"** task in the wedding template — that part stands. **The second half of the original claim was wrong.** `app/src/app/the-wedding/page.tsx:26` is demo copy on a marketing page describing a task the couple performs ("Send the final menu choices — one reply to Glenmara House, including dietary notes"). It describes the couple emailing the venue themselves. It is **not** a product flow routing guest health data to the venue, and there is **no structured dietary field anywhere in the schema**. The original entry read the string without reading its context. An adversarial reviewer caught it and the main session verified the correction directly.
- **Detail:** dietary and allergy information reveals health, and routinely reveals religious belief. Accessibility requirements reveal disability. These are Article 9 categories. They are entered by the couple **about guests who have never agreed to anything**, and the marketing page says they flow onward to the venue. There is no realistic Article 9(2) condition available — explicit consent is the only candidate and the guest is never asked. Guest lists also routinely contain children's data. This was found by the adversarial reviewer of the legal plan, not by the legal plan itself, which treated Article 9 as a secondary edge case about church settings.
- **The real shape of the exposure, restated honestly:** the private workspace is an **unstructured store that will foreseeably contain special-category data about third parties**, and Signal Studio ships a template that instructs the couple to collect it. Shipping that template is a determination of an essential means — the category of data collected — which points at controllership on its own. That is a genuine Article 9 problem. It is not the stronger claim originally recorded, and the difference matters: the fix is not "remove the field" (there is no field) but a decision about what an unstructured planning store may hold and what Signal Studio owes the people named in it.
- **Mitigation — architectural, not contractual, and it is a better product either way:** move dietary and accessibility capture to a **guest-facing RSVP step where the guest supplies their own data**. That converts an unanswerable Article 14 plus Article 9 problem into ordinary Article 13 notice plus the guest's own explicit consent. If capture stays couple-entered: keep the fields structured rather than free text, exclude them from the public Timeline by hard rule rather than by clause, set a short retention tied to the wedding date, name Article 9 explicitly in the role map with the condition relied on, and add an under-16 rule.
- **Affects:** E03.01, E03.04, E03.05, E04.08, E05.03, E06.01, E09.07
- **Status:** open · **Target:** before E03.04 is drafted · **Last reviewed:** 2026-08-03

### R-018 — Signal Studio may already be required to register for VAT
- **Type:** financial/legal · **Probability:** medium · **Impact:** high · **Severity:** high
- **Owner:** Ethan McNamara
- **Detail:** Irish registration thresholds apply to supplies *made*. A business that *receives* services from suppliers established outside Ireland, where the place of supply is Ireland under the general B2B rule, can become an accountable person and must self-account under the reverse charge **with no turnover threshold**. Signal Studio already buys exactly those services — Vercel, Clerk, Turso, Resend, Stripe, Upstash, Sentry, Anthropic. If that is the position, VAT applies from the first €1,000, and the "we are under €42,500" framing in the first legal pass is irrelevant.
- **The irreversible part:** if the founding schedule says "€1,000" and is silent on VAT, and registration later proves required, arguing the price was always exclusive is weak against 25 signed documents that say nothing. €1,000 becomes about €813 net — a permanent 19% cut, roughly €4,675 a year across the founding 25, which D-009's price lock makes uncorrectable.
- **Mitigation:** **state the price VAT-exclusive with VAT added at the prevailing rate, in every agreement, from the first draft** — one sentence, zero cost, and the entire fix for the irreversible half · file a **Revenue MyEnquiries** submission asking, in order, whether receipt of foreign B2B services already makes Signal Studio an accountable person, the tax point on annual prepayment, and the OSS position, and attach the written reply as evidence · keep every prepayment individually identifiable so treatment can be corrected retrospectively.
- **Affects:** E02.06, E02.07, E03.02, E03.03, E08.01, E15.02
- **Status:** open · **Target:** before the first agreement is drafted · **Last reviewed:** 2026-08-03

### R-019 — Zero budget was treated as zero external authority. It is not.
- **Type:** governance · **Probability:** n/a (correction) · **Impact:** medium · **Severity:** medium
- **Owner:** Claude Code
- **Detail:** recorded as a standing correction to how D-016 gets interpreted, including by Claude. **Revenue's MyEnquiries returns a written answer from the tax authority on a stated set of facts, for free.** The Data Protection Commission publishes guidance and answers business queries. Local Enterprise Office Limerick mentoring is subsidised to near-free. "No solicitor" is a real constraint; "no external input of any kind" is not, and treating them as the same thing gives up free authority on the two questions D-016 leaves most exposed.
- **Mitigation:** every task that hits a legal, tax or regulatory unknown asks first whether a free authoritative route exists before recording the unknown as accepted risk. R-013 and R-014's mitigations updated accordingly.
- **Affects:** E03 (all), R-013, R-014
- **Status:** open, standing · **Last reviewed:** 2026-08-03

### R-020 — Twenty-five untrained resellers describing the product
- **Type:** legal/brand · **Probability:** high · **Impact:** medium · **Severity:** high
- **Owner:** Ethan McNamara
- **Detail:** enormous care is being taken over Signal Studio's own words — never "forever", never implied legal approval, D-001 point 16, R-008. Then the story is handed to 25 venues with no obligation attached. A venue telling couples "we give you a free wedding planner, yours forever" is a commercial practice under the Consumer Protection Act 2007, enforceable by the CCPC, and it folds into the venue's own contract with the couple — so a Signal Studio discontinuation becomes the venue's consumer problem and then the venue's claim against Signal Studio. The planned automated string check polices only Signal Studio's strings. It does not reach a venue's website, brochure, or what a coordinator says at a show-around.
- **Mitigation:** a marketing-controls clause in the master agreement from version one — the venue describes the product only using the supplied approved copy pack; a named prohibited-claims list (no "forever", no "guaranteed", no permanence or storage promise, no "GDPR compliant", no claim that legal review was obtained); a right to require correction within a stated period · ship the approved copy pack and a one-page prohibited-claims sheet inside the venue pack (E12.12), not as an afterthought · extend the string check to the copy pack.
- **Affects:** E03.02, E09.11, E12.12, E15.10, E15.11
- **Status:** open · **Last reviewed:** 2026-08-03

### R-021 — No volume screen on the founding rate
- **Type:** commercial · **Probability:** medium · **Impact:** medium · **Severity:** medium
- **Owner:** Ethan McNamara — **accepted by decision (D-020)**
- **Detail:** the recommendation was to route venues above roughly 120 weddings a year to the standard rate. Rejected: all 25 founding venues get EUR 1,000 regardless of volume. Corrected heavy-profile break-even is about 94 couples a year, so a 250-wedding venue running the heavy usage profile costs roughly EUR 1,750 against EUR 1,000 gross — a loss of about EUR 750 a year on that venue, permanently, under the price lock.
- **Founder's position:** a 250-wedding flagship is worth more to the Founding 25 as a reference than it costs to serve. That is a commercial judgement, not an error.
- **Mitigation:** the fair-use notification (D-020) makes the cost visible when it starts rather than at renewal · the heavy profile requires milestone photographs, which are not built yet (E06.03), so this is a forecast rather than a running cost · revisit at the first renewal cycle with real usage data rather than modelled.
- **Affects:** E02.12, E07.11, E15.12, E15.17
- **Status:** open, accepted · **Review trigger:** first renewal cycle · **Last reviewed:** 2026-08-03

### R-022 — VAT-inclusive pricing under a permanent price lock
- **Type:** financial · **Probability:** medium · **Impact:** high · **Severity:** high
- **Owner:** Ethan McNamara — **accepted by decision (D-021)**
- **Detail:** the recommendation was VAT-exclusive drafting, because it is the one irreversible part of the VAT question. Rejected: EUR 1,000 and EUR 1,500 are both VAT-inclusive. If Signal Studio is or becomes an accountable person, EUR 1,000 inclusive nets EUR 813.01 at the 23% standard rate — about EUR 4,675 a year absorbed across the founding 25, permanently, and uncorrectable under the lock. A future rate rise is also absorbed rather than passed on.
- **Founder's position:** one clean round number to a venue is worth more than the margin.
- **Mitigation:** file the Revenue MyEnquiries submission at `evidence/E02.07-revenue-myenquiries-submission.md` before any agreement is signed — free, and it converts this from a guess into a written position · state the price as "inclusive of VAT at the prevailing rate" so a rate change is at least disclosed · keep every prepayment individually identifiable so treatment can be corrected retrospectively · rebuild the financial model on EUR 813 net if the Revenue answer to Question 1 is yes.
- **Affects:** E02.01, E02.06, E02.07, E03.02, E03.03, E08.01, E12.04, E15.02
- **Status:** open, accepted · **Review trigger:** the Revenue reply · **Last reviewed:** 2026-08-03

---

## Risks opened 2026-08-03 by the E01 governance audit (WP-03)

The launch category was empty. Launch exposure was being carried by the six
release gates, and a gate records the state required to pass, not what could go
wrong on the day. These three are the difference.

### R-023 — Release day fails on deployment configuration, not on the product
- **Type:** launch · **Probability:** medium · **Impact:** high · **Severity:** high
- **Owner:** Claude Code
- **Trigger:** 1 September arrives with all six gates passed and the statically generated surfaces never redeployed.
- **Detail:** `studio/content/hq/operator-todos/open-signal-studio-2026-09-01.md` carries three steps that nothing in the gate system owned until now: the redeploy that flips statically generated surfaces, the marketing-CTA decision, and the `/app` allowlist decision. D-007 records that E15.01 must account for them and E15.06 references them, but **E15 is a supporting epic of no gate** (I-008). Every gate could pass on 30 August and a Cohort 1 venue clicking its film link on 1 September could land on a pre-launch page. The films would be blamed for a deploy.
- **Mitigation:** now covered by data-gate exit criterion 12, which requires the three operator-todo steps individually ticked, every venue-reachable URL re-fetched after the deploy, and the rollback procedure executed once against staging. Left as a risk as well as a criterion because the criterion only fires if someone reads it.
- **Affects:** E08.12, E15.01, E15.06, DEP-005
- **Status:** open · **Target:** release candidate, 2026-08-30 · **Last reviewed:** 2026-08-03

### R-024 — The first venue onboarding is improvised
- **Type:** launch · **Probability:** high · **Impact:** medium · **Severity:** high
- **Owner:** Ethan McNamara
- **Trigger:** the first venue pays and there is no rehearsed configuration path.
- **Detail:** `PROJECT.md` §4 and §22 close the project on venues being "configured, onboarded and capable of issuing functioning couple invitations". E15.10 and E15.11 define onboarding. No gate has E15 as a supporting epic, so the six gates certify that the product works and that the sale can be made, and **nothing certifies that what was sold can be delivered** by one founder with no support team.
- **Mitigation:** rehearse one venue configuration end to end before Cohort 1 is contacted, against a rehearsal account, and write down what broke. Whether that becomes a sales-readiness criterion or an E15.01 precondition is a gate change and therefore change control: raised as CR-002.
- **Affects:** E15.09, E15.10, E15.11, E15.12, project completion condition
- **Status:** open · **Target:** before the first invitation · **Last reviewed:** 2026-08-03

### R-025 — All six gates pass with release-blocking work still in Backlog
- **Type:** launch · **Probability:** medium · **Impact:** high · **Severity:** high
- **Owner:** Claude Code
- **Trigger:** E15.01 evaluated against gate state alone.
- **Detail:** `PROJECT.md` §12 lists "every release-blocking task Done" as a success measure. There are 54 release-blocking tasks. The six gates measure quality dimensions; E15.01 measures the six gates. **Nothing in that loop asserts the work itself finished.** As written, all six gates could pass with a substantial number of release-blocking tasks untouched, because a gate criterion asks whether a thing is true, not whether every task that was supposed to make it true was done.
- **Mitigation:** make "zero release-blocking tasks outside Done, or each exception waived by name" an explicit E15.01 precondition rather than folding it into any single gate. Not actioned here: E15.01 is the go/no-go and its preconditions are the founder's.
- **Affects:** E15.01, all six gates, PROJECT.md §12
- **Status:** open · **Last reviewed:** 2026-08-03

---

## Issues opened 2026-08-03 by the E01 governance audit (WP-03)

### I-007 — The entire control root is untracked in git
- **Type:** governance · **Severity:** **high** · **Owner:** Ethan McNamara
- **Verified:** `git status` in `studio/` returns `?? docs/execution/venue-edition-and-films/`. The whole directory is untracked.
- **Detail:** `PROJECT_STATE.json` is canonical for a 211-task programme. `DECISIONS.md` holds twenty-four ratified decisions that exist nowhere else. `BRIEF.md`, `RAID.md`, every session record and every piece of evidence sit in the same untracked directory. **There is no revert path for any of it, and one `git clean -fd` removes the project's entire memory.** D-002 chose this location specifically because "the workspace root is not a git repository, so a control system placed there would not be version-controlled" — and then the directory was never added.
- **Why it is an issue and not a risk:** it is not a probability. It is the current state.
- **Resolution:** commit the control root. It contains no credentials by rule, and `private/venues.csv` is already gitignored. This is a founder action because it puts programme state into a repository's history permanently.
- **Status:** open · **Target:** immediately · **Last reviewed:** 2026-08-03

### I-008 — Two epics sit outside the release-gate system entirely
- **Type:** governance · **Severity:** medium · **Owner:** Ethan McNamara
- **Detail:** mapping the six gates against the backlog: commercial covers E02, legal E03, product E04 to E07, data E08 and E09, creative E13 and E14, sales readiness E10 to E12. **E01 and E15 are supporting epics of no gate.** E01 holds the governance machinery that R-006's mitigation depends on, including the freeze dates, which no gate criterion checked until commercial criterion 12 was written. E15 holds onboarding and the go/no-go itself.
- **Why it was not fixed here:** changing a gate's supporting-epic set is a change to a launch gate, which `PROJECT.md` §20 puts under change control. Recorded as **CR-002**, awaiting the founder.
- **Interim cover:** the freeze check is now in commercial criterion 12, the deploy steps in data criterion 12, and a test asserts the coverage hole stays exactly two epics wide and fails if it grows, or if CR-002 is actioned without emptying the declared list.
- **Affects:** E01, E15, all six gates, R-023, R-024, R-025
- **Status:** open · **Resolution:** CR-002 · **Last reviewed:** 2026-08-03

### I-009 — No design decision has ever been ratified, with UI freeze 17 days out
- **Type:** governance/creative · **Severity:** medium · **Owner:** Ethan McNamara
- **Detail:** E01.08 requires the decision log to record every ratified commercial, legal, product, **design** and **film** decision. Auditing all twenty-four entries by domain: commercial four, legal four, product one reinforced by two others, **design zero**, film one (D-014, two clauses). The one candidate design decision, D-006 on surface naming, was resolved as a naming question rather than a design one. D-024 states the position plainly: "Where a design direction is genuinely open it runs `/lab`" — an acknowledgement that design decisions have not been made.
- **The honest reading:** a log that records every *ratified* decision is correct to hold zero design entries if zero have been ratified. **The gap is in the programme, not in the ledger.** But UI freeze is 2026-08-20 and film lock 2026-08-28, and the tasks needing a design direction are exactly the ones the founder has to be in the room for.
- **Resolution:** not a documentation fix. Either design directions get ratified before UI freeze, or the freeze moves through a change record.
- **Status:** open · **Target:** before UI freeze, 2026-08-20 · **Last reviewed:** 2026-08-03

---

## Risks opened 2026-08-03 by the E09.01/E09.02 measurement work · verified in shipped code

**ID note:** these were first written as R-023 to R-026 and renumbered to
R-027 to R-030 on discovery that a concurrent work-package session had already
claimed R-023 to R-025. IDs are stable once published; the earlier claim wins.

Found by two independent adversarial reviewers (privacy lens and reconciliation
lens) who reached the same conclusion separately, then verified directly against
the repository by the main session before being recorded.

### R-027 — The suppression floor guards the population and leaves the count naked
- **Type:** privacy · **Probability:** certain (it is the shipped behaviour) · **Impact:** critical · **Severity:** critical
- **Owner:** Claude Code
- **Verified:** `studio/src/lib/account/instrumentation/suppression.ts:33-41`. `presentBehavioural(value, eligibleWorkspaces)` tests `eligibleWorkspaces < 3` and nothing else. The value itself is published unconditionally once the population clears the floor. `presentBehavioural(1, 40)` returns `{ state: "value", value: 1 }`. The same shape is implemented again at `daily-metrics.ts:87-102`.
- **Why this is the most serious finding on this register:** the venue knows exactly which couples it invited. A behavioural count of **1** shown to a venue with 40 sponsored workspaces is a statement about one identifiable couple's private use of the product. The complement is as bad: 39 of 40 identifies the one who did not. This is precisely the thing the privacy contract exists to prevent, it passes every existing test, and D-011 ratified the thresholds believing they covered it.
- **Mitigation:** make the floor two-sided and put it in the definition, not only the projector. Withhold when `value < 3` **or** `(eligible - value) < 3`, with reason `small_cell`, independent of population size. Change the signature to carry the population so the complement can be computed. Never render "fewer than 3" — that is itself a disclosure.
- **Affects:** E07.11, E07.12, E07.15, E07.18, E09.02, E15.04
- **Status:** open · **Target:** before any venue-facing usage surface ships (WP-05) · **Last reviewed:** 2026-08-03

### R-028 — The rate threshold has never been applied to anything
- **Type:** privacy · **Probability:** certain · **Impact:** high · **Severity:** high
- **Owner:** Claude Code
- **Verified:** `presentRate()` in `suppression.ts:44-51` is referenced only by `suppression.test.ts`. No production caller exists anywhere in `studio/src`. The only rate formatter, `metricRateLabel` in `studio/src/lib/account/format.ts:44-71`, divides two exact values and returns a percentage with no threshold at all.
- **Detail:** so the 5-eligible-activation floor on percentages, ratified in D-011 and documented in `PRIVACY_AND_RETENTION.md`, is enforced in a test and nowhere else. Every percentage a venue would see today is computed without it.
- **Mitigation:** make the threshold a property of the value rather than of the caller — have the projector emit a rate variant that is withheld below 5 and carries its numerator and denominator together, and remove the ability of any formatter to construct a percentage from two loose metrics.
- **Affects:** E07.11, E07.15, E09.02
- **Status:** open · **Last reviewed:** 2026-08-03

### R-029 — The attribution unit is incoherent: definitions count workspaces, the mechanism attributes subjects
- **Type:** correctness · **Probability:** high · **Impact:** high · **Severity:** high
- **Owner:** Claude Code
- **Detail:** every adoption definition counts **workspaces**, but the attribution join runs `redemptions.user_clerk_id` — a **subject**. Nothing in the path checks that a workspace belongs to the venue. One person with two workspaces, or one workspace with two owners, breaks the count in opposite directions. Compounding it, Tasks passes an internal user id at the call site while Notes, Timeline and Signal pass the raw Clerk id the join closes on, so one person can split into two subjects.
- **The table to use already exists:** `workspace_sponsorships (workspaceId, sponsorId, status)` at `app/src/server/db/schema.ts:334`, indexed both ways.
- **Mitigation:** attribute on the workspace, hashed with the live salt at read time; normalise the Tasks call site to the same subject id as the other three products; add a test that a workspace with two owners counts once and a person with two workspaces counts twice.
- **Affects:** E09.02, E09.03, E07.11, E04.08
- **Status:** open · **Last reviewed:** 2026-08-03

### R-030 — Nothing has ever been measured from a real couple's action
- **Type:** delivery · **Probability:** certain · **Impact:** high · **Severity:** high
- **Owner:** Claude Code
- **Detail:** 209 tests pass across the instrumentation layer and all four products have live emitter call sites, but the transport does not exist. `app/src/lib/account/instrumentation/sink.ts` is a deliberate no-op; emission is gated behind `SPONSOR_USAGE_EVENTS=1`, which is off in production; the `sponsor_usage_daily` migration is unapplied; and the nightly sealing job at `/api/cron/sponsored-use` answers 401 until `CRON_SECRET` is set. Every number in the system is proven against fixtures and an in-memory engine.
- **Why it matters here:** E07.04 would ratify **definitions**, not measurements. No venue-facing adoption figure can be trusted until the transport runs end to end against real events, and the first venue report is not the place to discover that.
- **Mitigation:** E09.03 wires the sink and applies the migration; the two operator to-dos (`apply-sponsor-requests-migration`, `schedule-sponsored-use-jobs`) are founder-gated and already filed. E15.04's live portal test is the proof, and it must run against real emitted events rather than fixtures.
- **Affects:** E09.03, E09.04, E09.05, E09.09, E07.11, E15.04
- **Status:** open · **Last reviewed:** 2026-08-03

### I-010 — WP-03 reversed a genuine founder approval on a wrong inference
- **Type:** governance · **Severity:** medium · **Owner:** Claude Code
- **Opened, reversed and corrected:** 2026-08-03.

**What actually happened.** At `2026-08-03T00:52:53Z` the founder approved
fourteen tasks with `approve-batch "Approved." --review`: all twelve of E01
(WP-03) and E09.01 and E09.02 (WP-06). **That was Ethan's own action.** He
confirmed it in his own words when this entry first claimed otherwise: *"THIS WAS
ME — PLEASE REAPPROVE THEM."*

**What WP-03 got wrong.** This session found the twelve Done, reasoned that the
recommendation packet was not written until 01:45 and therefore no founder could
have approved the work, and reopened all twelve. The reasoning was internally
tidy and factually wrong. **The founder does not have to read a packet to approve
work.** He had the task records, the criteria, the evidence and the generated
review packet from `packet E01`, all of which existed before 00:52. The packet
document was a convenience, not the gate.

**Consequence.** Twelve approved governance tasks were reopened and had their
sign-off cleared for roughly eight minutes, and the founder had to re-approve
them. Verified completion briefly reported 5.3% instead of 9.1%. No work was
lost, and the reopen direction is the safe one — it can only ever move work away
from completion.

**The rule that should have applied.** `PROJECT.md` §16 gives Ethan the decision
on "every move to Done". A session finding work already approved should treat
that as the founder's decision and ask, not reverse. **Reversing a founder
approval is itself a founder decision, and this session made it unilaterally.**
The conservative direction is not automatically the correct one.

**What stands from the original entry.** The tooling observation is still real
and is now the only open part of this: `approve-batch --review` is
project-global, so one session's approval reaches every other session's queue.
That is what the founder wanted here. It is also how an unintended approval would
happen, and it would leave the same trace as an intended one — which is precisely
why this session could not tell them apart from the record alone. Recommendation,
for the founder to take or leave: have `--review` print the epics it is about to
sweep and require confirmation when it spans more than one.

- **Affects:** E01 (all twelve, resolved), E09.01, E09.02, parallel-wave operating practice
- **Status:** **closed on the facts.** The approvals were genuine and stand. The `--review` scope recommendation is open · **Last reviewed:** 2026-08-03
