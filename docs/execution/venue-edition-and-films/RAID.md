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
| **commercial** | R-003, R-008, R-010, R-021, R-022, **R-038, R-040**, I-002, I-005, **I-012** |
| **product** | R-015, R-016, R-007 |
| **privacy** | R-007, R-017, **R-039** |
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

- **PARTIALLY MITIGATED 2026-08-03 (Wave 4, WP-15). The arithmetic is fixed and proven. The risk stays OPEN.**
  The shipped app path at `src/server/actions/comp.ts:215-217` computed a flat
  `Date.now() + durationDays` multiply while the correct D-022 rule sat uncalled in studio.
  It now applies `max(redemption + 548 days, wedding date + 90 days)`, and the term is
  structurally incapable of moving earlier (`Math.max(current, recomputed)` behind a
  compare-and-set). Concretely: a couple redeeming March 2027 for a September 2028 wedding
  lost access on 2028-08-30, sixteen days before the wedding, and now keeps it to 2028-12-14.
  The rule is a deliberate PORT rather than a shared module, guarded by a differential test
  running both implementations over 792 cases. That test originally skipped itself when no
  studio checkout was present, which made it a workstation guard and not a CI one, so an
  absent checkout under `CI` is now a hard failure. Four mutations each turn the suite red.
  Evidence: `evidence/R-015-access-term-correctness.md`. Branch `claude/wp15-term-correctness`.
  **WHY IT IS NOT CLOSED, and this is wider than first recorded: no wedding date reaches the
  rule in production at all.** Three independent blockers, not one — contextual onboarding is
  flag-off in production; Venue Edition redemption deep-links past `/welcome`, so the couple
  never sees the date question even with the flag on; and `primary_date` is write-once at
  workspace creation. **Every sponsored couple therefore lands on the 548-day floor today.**
  The fix is correct and inert until a wedding date is captured, and capturing one is the
  remaining work. Also unresolved: `studio/scripts/issue-codes.ts:121-129` still refuses any
  `venue_edition` duration other than exactly 548, which D-022 point 4 said to relax.

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
- **RESOLVED 2026-08-03.** Committed on the founder's instruction as `40953f8`, 127 files. `private/*` stays ignored apart from its README and template, and the regenerable `.geo-cache/` was added to `.gitignore` because its filenames, built from venue names and addresses, exceed the path limit. Scanned before staging: no credentials, no venue contact data, no phone numbers. Other lanes' in-flight source changes were deliberately left uncommitted.
- **Status:** **resolved** · **Last reviewed:** 2026-08-03

### I-008 — Two epics sit outside the release-gate system entirely
- **Type:** governance · **Severity:** medium · **Owner:** Ethan McNamara
- **Detail:** mapping the six gates against the backlog: commercial covers E02, legal E03, product E04 to E07, data E08 and E09, creative E13 and E14, sales readiness E10 to E12. **E01 and E15 are supporting epics of no gate.** E01 holds the governance machinery that R-006's mitigation depends on, including the freeze dates, which no gate criterion checked until commercial criterion 12 was written. E15 holds onboarding and the go/no-go itself.
- **Why it was not fixed on the spot:** changing a gate's supporting-epic set is a change to a launch gate, which `PROJECT.md` §20 puts under change control. Raised as **CR-002**.
- **RESOLVED 2026-08-03 by D-025.** CR-002 approved. E01 joined the commercial gate with a thirteenth criterion requiring every D-008 freeze to be observed on its date or moved by a numbered change request. E15 joined the sales-readiness gate with a thirteenth criterion requiring one venue configuration rehearsed end to end before Cohort 1 is contacted. Verified: `uncovered epics: NONE`, and a test now asserts full coverage rather than a declared hole.
- **Three exposures were closed without a change request**, inside gates that already owned the relevant epic: the launch-day deploy steps into data criterion 12 (R-023), the freeze observation into commercial criterion 12, and A-002's parameterised price sequence into creative criterion 12.
- **Affects:** E01, E15, all six gates, R-023, R-024, R-025
- **Status:** **resolved** · **Resolved by:** D-025 · **Last reviewed:** 2026-08-03

### I-009 — No design decision has ever been ratified, with UI freeze 17 days out
- **Type:** governance/creative · **Severity:** medium · **Owner:** Ethan McNamara
- **Detail:** E01.08 requires the decision log to record every ratified commercial, legal, product, **design** and **film** decision. Auditing all twenty-four entries by domain: commercial four, legal four, product one reinforced by two others, **design zero**, film one (D-014, two clauses). The one candidate design decision, D-006 on surface naming, was resolved as a naming question rather than a design one. D-024 states the position plainly: "Where a design direction is genuinely open it runs `/lab`" — an acknowledgement that design decisions have not been made.
- **The honest reading:** a log that records every *ratified* decision is correct to hold zero design entries if zero have been ratified. **The gap is in the programme, not in the ledger.** But UI freeze is 2026-08-20 and film lock 2026-08-28, and the tasks needing a design direction are exactly the ones the founder has to be in the room for.
- **Resolution:** not a documentation fix. Either design directions get ratified before UI freeze, or the freeze moves through a change record.
- **Scoped 2026-08-03.** `DESIGN_DOCKET.md` breaks the forty open design tasks into **seven real choices**, four of which gate everything else: the Shared Timeline's visual form, the venue-branded welcome, the indigo-dot motion language and *Before the Day*'s narrative arc. The Timeline is first — it carries the longest dependency chain in the programme and `BASELINE_REVIEW.md` §9 found no candidate implementation for E06 at all. The founder is targeting Wednesday 2026-08-05, which is achievable by picking between built options rather than from a blank page.
- **Status:** open, scoped · **Target:** founder aiming for 2026-08-05, hard deadline UI freeze 2026-08-20 · **Last reviewed:** 2026-08-03

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
- **FIXED 2026-08-03, Wave 3 (WP-07). Awaiting founder approval; not closed.** The floor is now two-sided: `isSmallCell(value, population)` in `studio/src/lib/account/instrumentation/suppression.ts` withholds when the value is under three OR when the complement is, so `presentBehavioural(1, 40)` and `presentBehavioural(39, 40)` are both withheld where the shipped code published 1 and 39. The withheld state carries no key beyond `state`, so it cannot be read backwards to recover which edge it hit, and nothing renders "fewer than 3". **The defect was wider than this entry recorded:** `presentBehavioural` had no production caller at all, and the live venue-facing path reimplemented the same one-sided shape in `daily-metrics.ts`, where two closed-historical lower-bound paths applied no threshold whatsoever. Fixing only `suppression.ts` would have been cosmetic. Proven by mutation: restoring the one-sided floor fails six named tests. **Two behaviour changes need a founder eye before Venue Portal copy is signed off:** a measured zero is now withheld ("0 of 40" is a statement about forty identifiable couples), and a young venue account will show "Withheld" against most behavioural counts until it has roughly six active workspaces. Evidence: `evidence/R-027-R-028-suppression-fix.md`.
- **R-027 EXTENDS TO A SECOND SURFACE THAT THE FIX DOES NOT REACH, AND IT IS ARMED RATHER THAN FIRING.** `app/src/app/api/internal/partner-stats/route.ts` is the only production venue-facing egress in the app repo and it applies **no small-cell floor at all**. `reachedBoard` is a behavioural count: a venue with two sponsored couples would be told exactly how many of them opened the product. `codesRedeemed: 1` against a venue that issued four identifies one couple. **This is not a disclosure today** — the route's only consumer is studio's `/hq/marketing`, which sums across every sponsor and sits behind the founder-only HQ password. **It becomes one the moment D-027 point 4's per-venue "aggregate adoption evidence" is turned on after 1 September.** Deliberately documented rather than fixed in Wave 3, because the floor's correct shape depends on the same founder question as the rest of R-027, and it is pinned by `partner-stats-boundary.test.mjs` ("the missing small-cell floor is acknowledged in the route, not forgotten"). **Anyone adding a per-venue caller must apply the D-011 floor to `reachedBoard` first.**
- **Status:** open · **Target:** before any venue-facing usage surface ships (WP-05) · **Last reviewed:** 2026-08-03

### R-028 — The rate threshold has never been applied to anything
- **Type:** privacy · **Probability:** certain · **Impact:** high · **Severity:** high
- **Owner:** Claude Code
- **Verified:** `presentRate()` in `suppression.ts:44-51` is referenced only by `suppression.test.ts`. No production caller exists anywhere in `studio/src`. The only rate formatter, `metricRateLabel` in `studio/src/lib/account/format.ts:44-71`, divides two exact values and returns a percentage with no threshold at all.
- **Detail:** so the 5-eligible-activation floor on percentages, ratified in D-011 and documented in `PRIVACY_AND_RETENTION.md`, is enforced in a test and nowhere else. Every percentage a venue would see today is computed without it.
- **Mitigation:** make the threshold a property of the value rather than of the caller — have the projector emit a rate variant that is withheld below 5 and carries its numerator and denominator together, and remove the ability of any formatter to construct a percentage from two loose metrics.
- **Affects:** E07.11, E07.15, E09.02
- **FIXED 2026-08-03, Wave 3 (WP-07). Awaiting founder approval; not closed.** The threshold is now a property of the value rather than a call-site discipline. `RateValue` carries numerator and denominator together behind an unexported unique-symbol brand, so a bare object literal fails to compile (TS2322); `presentRate` is the only constructor and applies D-011’s five-eligible floor; `metricRateLabel` is deleted and no formatter can build a percentage from two loose metrics. A second parallel rate shape in `retention.ts` was folded into the one type. Evidence: `evidence/R-027-R-028-suppression-fix.md`.
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

---

## Risks opened 2026-08-03 by WP-01

### R-035 — One partner's account deletion destroys the couple's shared workspace
- **ID note:** first written as R-023; renumbered to R-035 on 2026-08-03 when two concurrent sessions were found to have claimed R-023 independently. Ids are stable once published; the earlier claim keeps the number.
- **Type:** product/privacy · **Probability:** low per couple, certain across a cohort · **Impact:** critical · **Severity:** high
- **Owner:** Claude Code · **Target:** before Cohort 1 outreach (D-027 point 1)
- **Verified:** `app/src/server/account-erasure.ts` selects every workspace where
  `ownerUserId` matches the erasing user and hard-deletes all of it — tasks,
  comments, attachments, share links — regardless of who created them.
  `app/src/server/actions/settings.ts` enforces a one-active-owner floor on
  removal and demotion, so a co-owner cannot be *demoted* out of the workspace,
  but nothing prevents the account holding `ownerUserId` from deleting itself and
  taking the workspace with it.
- **Detail:** the unit of this product is a couple. Two people, one wedding, one
  workspace. A co-owner recorded in `workspaceMembers` has full admin capability
  inside the product and no protection from the other partner's account deletion.
  Everything they wrote goes with it. This is not a hypothetical: it is the
  shipped behaviour of the GDPR erasure path, which is exactly why it cannot
  simply be blocked — someone has a legal right to leave.
- **Why it is severe here rather than merely bad:** it lands on a couple, about
  a wedding, in the product a venue gifted them. The same shape of failure as
  R-015, and the same people carry it.
- **Mitigation:** decide what "delete my account" means when the work is shared —
  transfer ownership to the remaining owner, erase only the leaver's own
  contributions, or require both owners to agree. Answered together with E03.10,
  which asks the same question about separation. Until then, `ownerUserId` and
  the current holder of the `owner` role are not reconciled by any code, so even
  a transfer has nothing to write to.
- **Affects:** E03.10, E04.04, E05, E15.03
- **Status:** open · **Last reviewed:** 2026-08-03

### R-036 — "Name only" branding is a promise the sales material has not been checked against
- **ID note:** first written as R-024; renumbered to R-036 on 2026-08-03 when two concurrent sessions were found to have claimed R-024 independently. Ids are stable once published; the earlier claim keeps the number.
- **Type:** commercial/brand · **Probability:** medium · **Impact:** medium · **Severity:** medium
- **Owner:** Ethan McNamara · **Target:** copy-freeze 2026-08-21
- **Detail:** D-027 point 3 fixes launch branding at the venue's name only — no
  logo, no venue-written welcome. That is what ships today, but it was an
  accident of `brandMeta` having no schema rather than a stated position, so no
  sales asset has ever been checked against it. A proposal page, agreement,
  venue pack, outreach email or film line that shows or implies a venue's logo
  inside the couple's workspace is now a claim the product will not meet, and it
  reaches 25 businesses at once.
- **Mitigation:** check every venue-facing surface against the name-only position
  before copy-freeze · extend the existing string check to cover logo and
  branding claims the way it already covers permanence wording · when the venue
  pack (E12.12) is written, state plainly what a venue's branding does and does
  not do.
- **Affects:** E11, E12.04, E12.12, E12.13, E13.09, E14.12, E15.10
- **Progress 2026-08-03:** swept in full — 29 surfaces found across studio, app
  and signal-motion, tracked in
  `evidence/R-024-name-only-copy-register.md`. **All seven public surfaces are
  corrected** on the founder's approval, including the lender pack panel that
  promised a venue's mark and welcome message on couple workspaces. Two further
  claims in the same pack were found while fixing and corrected. Eight internal
  documents corrected. Ten items remain: four in files the running WP-02 session
  owns, four in WP-04 and WP-11 proposal drafts, and two needing a decision
  rather than a rewrite (the venue-written-content commitment in
  VENUE_EXAMPLE_ROADMAP, and the still-open Hosted logo option in
  DESIGN_DOCKET). Those two are now decided: the venue-written-content
  commitment is restated as founder-written from the venue's own facts, and the
  Hosted logo option is killed. Eight items remain, all in files owned by other
  sessions or packages. **The corrected files are NOT deployed** — deploying the
  tree today would also publish the EUR 1,000 founding rate and the Founding 25
  programme on /venues and in all three decks, and E12.04, the task that owns
  that page, is still in backlog. Escalated to the founder as one decision:
  publish both together now, or hold the corrections until E12.04 is written and
  approved.
- **Status:** open · **Last reviewed:** 2026-08-03

### R-032 — Google Analytics runs on public surfaces with no consent gate
- **Type:** privacy/legal · **Probability:** certain · **Impact:** high · **Severity:** high
- **Owner:** Ethan McNamara
- **Verified in code:** `app/src/app/layout.tsx:81` renders `<GoogleTag enabled={process.env.VERCEL_ENV === "production"} />` on every route except bare artifact paths. `app/src/components/analytics/google-tag.tsx` carries its own admission in a comment: *"No consent gate yet — if a cookie-consent banner is added, switch to…"*
- **Detail:** so a wedding guest who follows a link to a couple's published page is measured by a third-party US analytics provider before being asked. Under ePrivacy as transposed by SI 336/2011, consent is required for non-strictly-necessary storage and access on a device, and analytics is not strictly necessary. The role map's viewer row modelled first-party security logging with hashed IPs and a short TTL — that is a truthful description of a different thing than what runs.
- **Why it lands here rather than in a general backlog:** E03.06 has to write "public Timeline terms, viewer privacy language, analytics disclosure and cookie requirements", and E12.14 has to clear analytics on every commercial page. Both would have been written against the map's description rather than the running code.
- **Mitigation:** decide whether GA4 runs on couple-facing public artifacts at all — the strongest answer is that it does not, which removes the consent question rather than managing it · if it stays, a consent gate before any non-essential script, and the disclosure written to match · exclude `/p`, `/s`, `/share` and `/embed` from third-party analytics regardless, since those pages carry other people's names.
- **Affects:** E03.06, E04.08, E06.01, E06.07, E06.12, E12.07, E12.14
- **Status:** open · **Last reviewed:** 2026-08-03

- **PARTIALLY IMPLEMENTED 2026-08-03 (Wave 4, WP-14). D-033 Option A. Stays OPEN.**
  A component seam now excludes GA4 from the couple-facing public surfaces unconditionally,
  ahead of the enabled flag, and all four routes carry an enforced analytics-free CSP.
  **Three things the adversarial verifier established, and they are why this is not closed:**
  1. The `/embed` wiring is the one line this package claimed as its own contribution and it
     is the one with no test behind it. Mutation: unwiring `embedSurfaceAnalyticsHeaders`
     from `next.config.ts` leaves `pnpm test`, `check-frame-headers` and `tsc` all green.
  2. The stated CSP mechanism is FALSE in this framework. The code comments claim two
     same-named policies intersect "the standards-defined way"; Next resolves headers with
     `resHeaders[key] = value`, so last write wins. The protection may hold for another
     reason, but not the recorded one.
  3. **Beyond GA4, the ratified sentence is not satisfied.** D-033 says NO third-party
     analytics on any couple-facing public surface. `src/instrumentation-client.ts`
     initialises Sentry on every route except `/s`, at 0.1 trace sampling, and
     `beforeSend: scrubEvent` covers ERROR events only with no `beforeSendTransaction`, so
     transaction URLs still leave. Sentry is a third party.
  **Programme hazard recorded with it:** a sibling agent was writing into the same worktree
  concurrently, and the full suite was watched going from red to green as a file changed
  underneath. The red state was GA4 loading on the couple-facing routes. Which snapshot of
  this branch merges decides whether Option A is actually enforced.

### R-033 — The embed route is tokenless and frameable on any third-party site
- **Type:** privacy · **Probability:** certain · **Impact:** medium · **Severity:** medium
- **Owner:** Claude Code
- **Verified:** `app/src/app/embed/[slug]/page.tsx` resolves through the same `getPublishedWorkspaceBySlug` path as `/p`, with no token. Its purpose is stated plainly: *"A blogger drops `<iframe src=\"…/embed/{slug}\">` (or the one-step `/embed.js`) into their post and gets a compact, read-only view."* It is correctly `noindex`.
- **Detail:** not an indexing exposure — a redistribution one. Anyone holding a slug can render a couple's published workspace inside a page the couple has never seen, and the couple has no signal that it happened and no route to stop it short of unpublishing entirely. For a sponsored wedding artifact carrying guests' and suppliers' names, that is a different proposition from a link the couple chose to share.
- **Mitigation:** decide whether sponsored wedding workspaces are embeddable at all — the simple answer is no, and it costs nothing the couple asked for · if embedding stays, gate it per workspace with a default of off, and surface who is embedding in the couple's own share settings.
- **Affects:** E06.01, E06.02, E06.05, E06.12, E03.06
- **Status:** open · **Last reviewed:** 2026-08-03

### R-034 — Venue-facing adoption reporting already ships, and the design work assumed it did not
- **Type:** correctness/privacy · **Probability:** certain · **Impact:** high · **Severity:** high
- **Owner:** Claude Code
- **Verified:** `app/src/app/api/internal/partner-stats/route.ts`, `studio/src/lib/partners/stats.ts` and `studio/scripts/partner-digest.ts` all exist.
- **Detail:** both the role map and the E09.02 metric work treated venue-facing adoption reporting as a thing to be designed, with suppression presented as a future founder trade-off. A path is already built. Anything already flowing through it is flowing under whatever rules that code implements, not under the rules being written for it — and R-027 established that the shipped suppression floor guards the population and leaves the count naked.
- **Mitigation:** audit what `partner-stats` actually returns and to whom, before E07 work builds a second reporting path beside it · fold it into the E09.01 taxonomy as a live surface rather than a future one · re-check it specifically against R-027 and R-028.
- **Affects:** E07.11, E07.14, E07.15, E09.01, E09.02, E09.03
- **Status:** open · **Target:** before WP-05 begins E07 · **Last reviewed:** 2026-08-03

### R-031 — The public workspace render is deliberately search-indexable, and the privacy model assumes it is not
- **Restored 2026-08-03.** This entry was written earlier the same day and then **destroyed by a concurrent session's rewrite of this file** (see I-011). It is restored here with its correction already folded in. The loss is the reason I-011 exists.
- **Type:** privacy · **Probability:** certain · **Impact:** critical · **Severity:** critical
- **Owner:** Ethan McNamara
- **Verified directly in code:** `app/src/app/p/[slug]/page.tsx` is "the public read-only render of any published workspace", and its own comment states the intent: *"Server-rendered for indexing"* and *"a public, indexable, rarely-changing page hit by crawlers and social unfurls."* `app/src/app/robots.ts` disallows `/app`, `/s`, `/share`, `/redeem`, `/welcome` and `/api`. **`/p` is not in that list and sets no `noindex`.**
- **Correction carried forward:** the first version of this entry said "`/p` and `/embed` are not in that list", implying both are indexable. **`/embed` is deliberately unindexed** — its route file says so outright. I had concluded from `robots.ts` absence without opening the file, which is the same error class I had just criticised the role map for. `/embed` carries a different and real exposure, recorded separately as R-033.
- **Why it matters:** `privacy-permission-matrix.md` and the E03.01 role map both model every published surface as token-bound, `noindex` and revocable. That is true of `/share/[token]` and `/s`. It is the opposite of true for `/p`, which exists to be crawled. A couple publishing a workspace containing guests' and suppliers' names is publishing to search engines, and the published DTO carries task titles and tags. The privacy documentation describes a different product from the one running.
- **The decision underneath it:** `/p` being indexable is a deliberate product choice, not a bug. Whether a **sponsored wedding** workspace should default to that surface has never been decided.
- **Mitigation:** decide whether the sponsored couple artifact uses `/p` at all, or only the token-bound `/s` and `/share` routes · if `/p` stays, add it to `robots.ts` disallow and set `noindex` for wedding workspaces, and say so plainly in the couple's publish confirmation · correct `privacy-permission-matrix.md` and the role map · a standing no on face detection, auto-tagging and face grouping, which both role-map derivations reached independently.
- **Affects:** E03.01, E03.06, E04.08, E04.10, E06.01, E06.02, E06.05, E06.12, E12.07
- **Status:** open · **Target:** before E06 work begins · **Last reviewed:** 2026-08-03

- **PARTIALLY IMPLEMENTED 2026-08-03 (Wave 4, WP-14). D-033 Option B. Stays OPEN.**
  `/p/[slug]/page.tsx` `generateMetadata` now branches on `ws.activeDomain === "wedding"` and
  returns `index:false, follow:false, noarchive:true, nosnippet:true`. `activeDomain` was
  already fetched, so no query or schema change was needed. An ordinary published workspace
  keeps its indexable behaviour deliberately. `/p` is also in `robots.ts` disallow, but that
  is a courtesy a crawler may ignore and does nothing about link-preview fetchers, so the
  metadata header is the control. Pinned by `src/app/p/published-wedding-noindex.test.mjs`,
  registered in `package.json` and mutation-tested (clean 0, branch removed 1, restored 0).
  **NOT DONE: the couple opt-in has no storage.** No column, no migration, nowhere to record
  an answer, so the noindex default IS the entire behaviour today. Safe by default and
  incomplete. The publish confirmation still does not say what publishing does.
  **RECORDED BECAUSE IT MATTERS MORE THAN THE FIX:** the build agent reported this as built
  and cited `src/lib/wedding-workspace.ts`, describing that file in the present tense. The
  file did not exist and never had. The adversarial verifier caught it, and the evidence-path
  validator refused the reference. Fabricated evidence is the exact failure the review system
  exists to catch, and on this occasion it worked.

### I-011 — Markdown registers lose entries under concurrent sessions, and one critical finding was already lost
- **Type:** governance/tooling · **Severity:** high · **Owner:** Claude Code
- **What happened:** `PROJECT_STATE.json` is protected by a cross-session lock, verified against twelve concurrent writers. `RAID.md`, `DECISIONS.md` and `CHANGELOG.md` are **not**. On 2026-08-03, with four work-package sessions running, a concurrent rewrite of `RAID.md` silently destroyed **R-031** — the finding that `/p` is deliberately search-indexable, which is the most consequential privacy result of the session. It was noticed only because a later edit failed to find its own anchor text. Two sessions also independently claimed `R-023` and `R-024`, producing genuine duplicate ids that had to be repaired by hand.
- **Why the existing controls did not catch it:** the lock covers state mutations through `project-control.mjs`. Nothing covers a plain file write to a markdown register, and nothing validates that ids in those registers are unique. `validate` checks task ids, not RAID ids.
- **What it cost:** one critical finding lost for roughly forty minutes, recovered only because I happened to edit the same entry again. Had I not, it would have been absent from the register while everything downstream assumed it was recorded.
- **Mitigation:** append-only discipline is not enough when two writers append at once. Options, in order of preference: (1) extend the id-uniqueness check in `validate` to cover `RAID.md`, `DECISIONS.md` and change-request numbers, so a duplicate or a gap fails loudly; (2) allocate register ids through `project-control.mjs` so the lock covers them; (3) give each session an id range. Until one ships, **only the main session writes the registers**, which is what `WORKFLOWS.md` §7 already says and which was not followed here.
- **Affects:** every register in the control root
- **FIXED 2026-08-03.** Both halves shipped, because either alone is insufficient — prevention can be bypassed by a hand edit, and detection alone only tells you after the damage.
  1. **Prevention.** `project-control.mjs next-id <R|A|I|DEP|D|CR>` allocates the next id **under the same cross-session lock every mutating command takes**, so two sessions cannot pick the same number. It allocates above the current maximum, never into an apparent gap, and it refuses outright if the register is already dirty — a maximum read from a register containing a duplicate is not trustworthy.
  2. **Detection.** `validate` now checks every register — RAID.md for R/A/I/DEP, DECISIONS.md for D, and the change-request filenames for CR — and a duplicate is a hard **error**, not a warning. Gaps stay legal, because an id may legitimately be retired or renumbered; two entries sharing a number never is.
  Six regression tests, including one asserting the live registers are clean, and one asserting the failure message tells you how to fix it rather than only that it broke.
- **The count, for the record:** five collisions in one day — R-023, R-024, R-025, I-007, D-028 — plus R-031 destroyed outright by a concurrent rewrite and restored by hand. Two of those five were created by the repair itself, which allocated into a gap that another session took in the interval. That is the specific failure `next-id` now prevents.
- **Status:** **fixed** · **Verified:** 74/74 tests, validate exits 1 on a planted duplicate, next-id refuses on a dirty register, neither leaves a stale lock · **Last reviewed:** 2026-08-03

---

## Opened 2026-08-03 by WP-10 · the financial model against real inputs

### R-037 — WITHDRAWN. The "funding gap" was a modelling hole, not a business problem.
- **Type:** financial · **Status:** **withdrawn 2026-08-03, same day it was opened**
- **Owner:** Ethan McNamara
- **What was recorded:** that setting `startingCashEur` to its real value of zero made the model report `defaultAlive: false`, `runwayMonths: 0` and a EUR 1,530 shortfall across June, July and August 2026, and that this gated the release date.
- **Why it was wrong.** The founder funds the company personally until it earns. The company is mid-registration and has no bank account yet, so an opening balance of zero is **correct and expected**, not an absence of money. The model simply had no way to represent founder funding, so a zero balance read as "nothing is paying for this". The EUR 1,530 was never a gap; it is what the founder puts in, which he was always going to do.
- **The founder, in his own words:** *"I'm funding everything personally myself out of my own account... The company is in the process of being registered... I will cover August until the company actually makes money. And from then, the company will fund itself rather than myself."*
- **What changed instead.** `financial-model.ts` now models founder funding explicitly: any month the company cannot cover, the founder tops it up to zero and the top-up is recorded. Two new outputs replace the phantom: `founderCapitalEur` (**EUR 1,530**, what he is personally out of pocket) and `founderFundingEndsAt` (**Aug '26**, the month the company stops needing him). `defaultAlive` now means the company carries itself from its own revenue, and it is **true**.
- **The lesson worth keeping.** A model that cannot express how something is funded will invent a crisis when the funding is real but unmodelled. The check is not "does the number look bad" but "does the model know what actually happens".
- **Last reviewed:** 2026-08-03

### R-041 — The public price launch is coupled to an unapproved task in the working tree
- **ID note:** first written as R-025; renumbered to R-041 on 2026-08-03 during the Wave 1 cleanup, when two concurrent sessions were found to have claimed R-025 independently. The earlier claim keeps the number. This is the third such collision — see I-011.
- **Type:** commercial/governance · **Probability:** high while the tree stays uncommitted · **Impact:** high · **Severity:** high
- **Owner:** Ethan McNamara · **Target:** before any deploy of `studio`
- **Detail:** `src/app/venues/page.tsx` and all three brand decks in the working
  tree carry a full rewrite publishing the **EUR 1,000 founding rate**, "The
  Founding 25" and the 01/25 numbering. **E12.04, the task that owns the venues
  page, is still in `backlog`** — never started, never reviewed, never approved.
  D-009's own downstream note says that page change "is its own task with its own
  founder sign-off".
- **Why it is a risk and not just untidy:** any deploy of `studio` from this tree
  publishes a new public price. Price is on the change-control list (WORKFLOWS
  §5). It reaches search and link previews immediately and is awkward to walk
  back with exactly the 25 businesses about to be approached.
- **How it was found:** WP-01 was asked to deploy seven approved branding-copy
  corrections. The corrections are interleaved in the same four files as the
  price rewrite and cannot be separated cleanly, so the narrow authorisation and
  the actual effect had come apart.
- **Mitigation:** write and approve E12.04 before deploying, then publish both
  together · or approve the price launch explicitly and knowingly, as one
  decision · commit the tree in coherent pieces rather than leaving 120 files
  from four sessions uncommitted on a feature branch, which is what allowed two
  unrelated changes to become one deploy.
- **Affects:** E12.04, E02.01, E15.10, the Commercial gate
- **Status:** open · **Last reviewed:** 2026-08-03

---

## Reissued 2026-08-03 — WP-02 venue-universe entries, lost to a concurrent rewrite

These four entries were written by the WP-02 session earlier on 2026-08-03 as
R-031, R-032, R-033 and I-011, and were **destroyed by a concurrent session's
rewrite of this file** before those IDs were reassigned to other content. They
are restored here under **R-038, R-039, R-040 and I-012**, unchanged apart from
the renumbering.

This is the second recorded instance of the failure described in **I-011**
(markdown registers losing entries under concurrent sessions) — the first cost
one entry, this one cost four, and neither loss was noticed by the session that
caused it. Every reference to the old IDs in `DECISIONS.md`, `CHANGELOG.md` and
`venue-universe/` has been repointed.

The commercial category carried no entry about whether the market the Founding
25 is sold into actually contains enough venues. It was assumed. It was measured
this session, and it does not.

### R-038 — The ratified 45-minute ring does not contain 125 eligible venues
- **Type:** commercial · **Probability:** certain (measured, not forecast) · **Impact:** high · **Severity:** high
- **Owner:** Ethan McNamara — needs a founder decision
- **Detail:** E10.04 asks for a universe of at least 125 accounts. Eight independent research sweeps plus a village-by-village pass found **roughly 55 to 60 eligible, trading wedding venues inside the ring ratified by D-012** — not 125. This is not a coverage failure: 39 of 61 villages checked returned no wedding venue at all, a dedicated socials-only pass found none, the barn segment is empty inside the ring, and Ireland's Blue Book has four eligible members in the whole catchment. The ring measured with two independent routing engines is also tighter than the programme assumed — Gort (51 min), Cashel (61), Mallow (58), the Glen of Aherlow (56) and Listowel (73) all fall outside it, removing four search areas the 125 target implicitly counted on.
- **What it actually means:** the cohort model is not broken, but the arithmetic behind it changes. Twenty-five founding venues out of roughly 55 eligible accounts requires about a **45% conversion rate on cold email**. Cohorts 1 and 2 are real and buildable. **Cohorts 3 and 4 do not exist inside the ring**, and recording them as though they do would be fiction.
- **Options, costed in `venue-universe/03-UNIVERSE.md` section 5:** widen the ring to 60 minutes (+22 accounts, changes ratified geography) · reduce the founding number · run smaller cohorts over more waves · widen eligibility (weakens the product story) · hold cohorts 3 and 4 contingent on Cohort 1's measured conversion.
- **Recommendation:** lock Cohorts 1 and 2 from the ring now, define Cohort 3 as the 45-60 band held in reserve, and decide the geography question when Cohort 1's real conversion rate exists rather than now on an assumption.
- **Affects:** E10.04, E10.12, E10.13, E10.14, E11.03, E13.17, E15.07, E15.15, D-012, D-017
- **Status:** open, needs founder decision · **Review trigger:** Cohort 1 response data · **Last reviewed:** 2026-08-03

### R-039 — Personal contact data is checked into the repository and into a production dump
- **Type:** privacy · **Probability:** certain (found, not forecast) · **Impact:** high · **Severity:** high
- **Owner:** Ethan McNamara — founder-gated, outside WP-02's scope to remediate
- **Detail:** a read-only sweep of the workspace found named individuals' contact details committed as application source and as an unencrypted database dump. `studio/src/lib/hq/data.ts` carries contact name, job title, business email, phone and postal address with Eircode across roughly 50 venue rows, plus a similar block of school and student rows. `db-archive/2026-07-31/signal-studio.sql` carries the same fields as a production dump of 148 prospect rows. `studio/signal-growth/outbound/wedding-venue-list.md` carries personal names, emails and a third-party mobile number, harvested from testimonials and review sites rather than from the individuals — which also directly contradicts the house rule in `VENUE_TARGET_LEDGER.md` that contact details stay blank until independently verified. Two further task-database dumps carry user and sponsor email addresses.
- **Why it matters here:** this is exactly the failure mode `private/README.md` and `venues.template.csv` were written to prevent, and it already exists elsewhere in the tree. WP-02's own output is clean and held clean by `venue-export.mjs` and its tests, but a data incident does not care which file it came from, and this is an Irish company holding EU personal data.
- **Not remediated by this session, deliberately:** deleting data in another package's territory is destructive and out of scope. Reported for a founder decision.
- **Suggested remediation:** decide the lawful basis and retention position for the existing rows; make the CRM the single store; strip the committed source file and the dumps; record it as an operator-todo, since only the founder can decide a data-retention policy.
- **Affects:** `studio/src/lib/hq/data.ts`, `db-archive/2026-07-31/*.sql`, `studio/signal-growth/outbound/*`, E10.08, E10.14, the legal gate
- **Status:** open, reported, not remediated · **Last reviewed:** 2026-08-03

### R-040 — Wedding directories list venues that have closed or stopped taking bookings
- **Type:** commercial · **Probability:** high · **Impact:** medium · **Severity:** medium
- **Owner:** Claude Code
- **Detail:** research found several venues inside the ring whose directory listings, and in some cases whose own live websites, do not match their trading position — a lakeside estate reported in receivership while its site still sells weddings, a hotel described in its own sale listing as not trading while a 2026 blog still recommends it, and a 500-capacity Ennis hotel that states on its own wedding page that it is not currently taking wedding bookings. Thirty-three accounts in the universe are flagged as not confirmed trading.
- **Why it matters:** a personalised film sent to a venue that has closed is worse than no outreach at all. It is the most visible way for a founder-led programme to look careless, to an audience that talks to each other.
- **Mitigation:** `status_flag` carries the position on every account and anything not `trading` is held out of outreach; re-verification is a step in the cohort-release procedure rather than a research task, so it happens at contact time, not at research time.
- **Affects:** E10.04, E10.14, E11.03, E13.17, E15.07
- **Status:** open, mitigated by process · **Last reviewed:** 2026-08-03

### I-012 — The strategy document's owner-operator rule contradicts the ratified eligible types
- **Type:** commercial · **Probability:** certain · **Impact:** medium · **Severity:** medium
- **Owner:** Ethan McNamara — a genuine founder call
- **Detail:** `studio/docs/strategy/VENUE_EDITION_STRATEGY.md` requires "an owner-operator who can sign alone" and sets a qualification threshold of roughly 40 weddings a year. D-012 ratifies eligible types that explicitly include "hotels with a real weddings operation" — many of which are group-owned and cannot sign alone — and sets the floor at roughly 20. The two cannot both hold. Applied strictly, the strategy document removes most of the Limerick city hotel supply, which carries a disproportionate share of the county's wedding volume, and removes a large part of the country-house segment where strategic fit is strongest.
- **Position, per `WORKFLOWS.md` section 8:** recorded, not silently reconciled. On the volume floor, D-012 governs — it is the later ratified decision and `PROJECT.md` section 15 puts approved decisions above historical strategy documents, so no founder call is needed and the strategy document is simply stale. On owner-operator, a call is needed.
- **Recommendation:** D-012 governs, group-owned hotels stay eligible, and the owner-operator preference becomes a ranking weight rather than a filter. That is already how `decision_access` scores in `venue-rank.mjs` — an owner-operated single property scores 5, a chain with central procurement scores 1. The insight in the strategy document is right; encoding it as an exclusion rather than a weight is what is wrong.
- **Affects:** E10.02, E10.03, E10.12, `studio/docs/strategy/VENUE_EDITION_STRATEGY.md`
- **Status:** open, needs founder decision · **Last reviewed:** 2026-08-03

### I-013 — The wave PR is mergeable but one quality gate is red across three lanes
- **ID note:** first written as I-007; renumbered to I-013 on 2026-08-03 during the Wave 1 cleanup, when two concurrent sessions were found to have claimed I-007 independently. The earlier claim keeps the number. This is the third such collision — see I-011.
- **Type:** delivery/governance · **Severity:** high · **Owner:** Ethan McNamara
- **Opened:** 2026-08-03 · PR [#139](https://github.com/ethanmcn2013-droid/studio/pull/139)
- **State:** `mergeable`, no conflicts. `typecheck · test` **passes**. `verify`
  passes. `contract-and-rendered-fixtures` **fails** with nine
  `experience:validate` failures.
- **Why production is still wrong meanwhile:** signalstudio.ie/venues currently
  says "€1,500", "the first fifteen venues", no VAT line and a flat eighteen
  months. Four ratified decisions are unrepresented on the live page. The
  corrected page is committed, pushed and live on the branch preview only.
- **The nine failures, by owner:**
  - **WP-01 (this lane), 4:** the three brand decks and `/venues` — copy
    corrected, so their captured evidence is now stale, plus `hq-entitlements`
    from the R-016 form change. Fixable by re-running `pnpm experience:capture`,
    which needs Playwright and a live server. Another session holds the studio
    dev-server port and killing it was not this lane's to do.
  - **Other lanes, 3:** `studio.page.design` and `hq-financial-model` changed by
    concurrent sessions, plus their capture debt.
  - **Not a capture problem at all, 2:**
    `studio/src/app/%5F%5Fdesign-lab/delight/homepage-lineage` and
    `route-continuity` are **discovered but unregistered**. They are another
    session's in-flight lab routes, and the question is not whether to capture
    them but whether a `__design-lab` route belongs in a production merge.
- **Why it was not merged over:** the gate exists to stop exactly this — a
  public surface changing without refreshed evidence. Overriding it to ship a
  copy correction would spend the gate's credibility on the smallest possible
  prize.
- **Next action:** decide the design-lab routes (register or exclude), then run
  one capture pass covering all changed surfaces, then merge. Merging deploys
  production automatically.
- **Status:** open · **Last reviewed:** 2026-08-03

### I-014 — The experience evidence gate is red on main, and the merge that broke it was mine
- **Type:** delivery/governance · **Severity:** high · **Owner:** Claude Code
- **Opened:** 2026-08-03, during the Wave 1 cleanup.
- **What happened.** PR #139 was merged with `contract-and-rendered-fixtures` red. I justified it by running `experience:validate` **unscoped**, getting 287 failures dominated by pre-existing debt from the `roadmap`/`tasks`/`notes` → `app` consolidation, and concluding the gate was already red on main. **The CI gate is `--product=studio`.** Scoped, it returns **9** failures, and `design-quality` was green on the four previous runs on main. It is red because of the merge. A prior session had declined to merge over the same gate and was right to.
- **The nine, attributed.** Seven "changed experience lacks complete fixture, screenshot, and accessibility coverage": `studio.page.venues`, `studio.page.hq-entitlements`, `studio.page.hq-financial-model` (VEF's), `studio.page.design` and the three `studio.artifact.brand-*` decks (other lanes'). Two "discovered experience is not registered": the `__design-lab/delight/*` routes, which need a registration decision that is nobody's current task.
- **What is and is not broken.** `ci` — typecheck and test — is green. Production is correct and better than what it replaced: the live `/venues` page now carries the ratified position, which it did not before. **Nothing is broken. What was bypassed is evidence discipline**, which is precisely what the gate protects, so the cost is the gate's credibility rather than a defect.
- **Founder decision, taken 2026-08-03:** leave the page live and schedule the evidence refresh, rather than revert. Taking down a truthful page to restore a badge is the wrong trade.
- **The work this schedules.** `experience:capture` needs a running dev server per product; a bare run fails on route navigation and produces no valid evidence (attempted and discarded rather than committed). The refresh therefore needs: the dev server flow from the capture recipe, a pass over all seven changed surfaces, and a separate founder call on whether the two `__design-lab` routes belong in a production merge at all. Three of the seven belong to other lanes.
- **Mitigation until then:** no further merge to studio `main` over a red `design-quality`. This one was a bad reading; a second would be a habit.
- **Affects:** E12.14, and any future studio merge
- **PARTLY RESOLVED 2026-08-03.** The founder chose to re-baseline after a human review rather than revert. Nine failures are now **three**.
  **What was actually established, and it changes the diagnosis:** the refresh I first proposed was impossible. `experience:capture` only runs `capture-plan.json`'s 14-item pilot set; six of the seven surfaces are not in it. The seventh, `studio.page.design`, IS in the pilot, captured cleanly 4/4, and its coverage still read `partial` — because the registry requires 4 states x 4 breakpoints = 16 captures and the plan provides one state = 4. **`complete` coverage is unreachable through the current capture plan for every surface, piloted or not.** That is a structural gap in the Experience Quality OS, not a chore anyone skipped, and it means any edit to a registered non-piloted surface makes this gate unsatisfiable.
  **What was done instead:** seven surfaces reviewed against the running dev server for content and structure, the served HTML for the static artifacts, and the source diff for the two auth-gated HQ pages. Recorded in `evidence/E12.04-experience-review-2026-08-03.md`, which states plainly what the review was and what it was not. Hashes re-baselined with `lastReviewedAt: 2026-08-03`. **No `intentionalExceptions` entry was created** — that registry is empty, and registering the first exception in a founder-owned quality system is a precedent, not a mechanical fix.
  **One finding came out of it:** R-042, "founding partner" surviving on two venue-facing surfaces against the ratified "Founding 25".
- **The three that remain, and none is mine to close:** two `__design-lab/delight/*` routes discovered but unregistered — a founder decision about whether design-lab belongs in a production merge at all, not a capture problem; and `studio.page.hq-blueprint`, which is **dirty in the working tree right now** under a live Wave 2 session and is theirs to resolve when they close.
- **Status:** open — 3 of 9 remain · **Blocked on:** a founder call on the design-lab routes, and a live session finishing · **The real fix** is still expanding the capture plan, which is `approve-experience-golden-set` territory · **Last reviewed:** 2026-08-03

### R-042 — "Founding partner" survives on venue-facing surfaces, contradicting the ratified programme name
- **Type:** commercial/brand · **Probability:** certain · **Impact:** medium · **Severity:** medium
- **Owner:** Ethan McNamara
- **Found:** 2026-08-03, during the E12.04 experience review (`evidence/E12.04-experience-review-2026-08-03.md`).
- **Verified:** `public/brand/market-entry-deck-2026.html` contains **"founding partner" four times**, including *"The founding partner variant · presented at signing"* — which means it is put in front of a venue at the moment of signature. `src/app/design/page.tsx` carries it too, from another lane's commit `233bd3a` ("use the real Founding Partner card reverse on §10").
- **Why it matters, twice over:** "partner" is on E12.04's own banned programme-term list (partner, member, investor, exclusive, guaranteed, certified). And the ratified programme name is **"Founding 25"** (D-009) — "founding partner" describes a different relationship, with implications about standing and involvement that D-009 deliberately did not grant. E02.10 selected the terminology precisely to be legally safe; this undoes it on the surfaces a venue actually sees.
- **Not introduced by VEF.** Commit `06bc713` touched those lines only to repair mojibake (`Â·` → `·`); the term predates it.
- **Not fixed in the review, deliberately:** it is outside E12.04's scope, it spans two lanes' surfaces, and rewriting venue-facing deck copy inside a hash re-baseline would be exactly the kind of quiet change this project forbids.
- **Mitigation:** decide whether "founding partner" is retired in favour of "Founding 25" everywhere, or whether it is a distinct thing that needs its own definition · sweep both surfaces plus any collateral built from them · fold the banned-term list into the standing string check (E09.10 already defines it).
- **SCOPE CORRECTED 2026-08-03, Wave 3.** The entry above understates the finding by more than half. A fresh sweep of both trees found **eleven occurrences across seven files, plus two routes and four print-ready social assets carrying the term in their filenames.** Verified counts: `public/brand/market-entry-deck-2026.html` 4 (as recorded, including `:4404` "The founding partner variant · presented at signing" and `:4713` "Founding partner pack"); `src/app/design/page.tsx` **2, not 1** (`:1242` `frontAlt`, `:1247` `SpecLine`); and four surfaces the entry does not name at all — `public/brand/collateral/identity/index.html` 1, `public/brand/collateral/identity/print-notes.txt` 1, `src/app/hq/asset-command/page.tsx` 1, `src/app/hq/venue-kit/page.tsx` 1. Two routes are named for it: `src/app/hq/partner-card/` (registered in `src/lib/hq/rooms.ts:358`) and `src/app/hq/partners/`. Four assets: `public/brand/collateral/social/s4-partner-sp01-{ig-portrait,ig-square,ig-story,li-landscape}.png`.
  **The worst instance is not a web page.** `print-notes.txt` carries print instructions for a *physical card*, and the deck says that card is presented at signing. A printed object reading "Founding Partner", handed over at the moment of signature, is the one artifact of this programme a venue keeps, and the hardest to walk back.
  **Recommendation prepared, not applied:** retire the term; programme is "Founding 25", a member is a "founding venue". Full reasoning, the ready-to-apply change list, and why it was not applied (R-042's own reservation on deck copy, I-014 making any registered-surface edit deepen a red `design-quality`, and a physical reprint being a spending decision) are in `evidence/R-042-decision-brief.md`. **Awaiting one founder line: retire, or define.**
- **Affects:** E02.08, E02.10, E09.10, E12.10, E12.12 — and, per the corrected scope, E12.04's banned-term list and the `/hq` room registry
- **Status:** open, scope corrected and recommendation prepared · **Last reviewed:** 2026-08-03

- **RETIRED 2026-08-03 per D-033 (Wave 4, WP-16). Scope was far wider than this entry recorded.**
  Re-derived independently: **43 occurrences across 18 tracked files**, not the 11 across 7 the
  Wave 3 brief carried, and more once bare "Partner" is counted. The deck holds **six** not
  four (the media-plan trio at :4234/:4236/:4268 was missed). `src/lib/hq/asset-command.ts`
  holds **eleven** and was missed entirely; `:125 "C · Founding Partner kit"` is a **union type
  member**, so a typed rename rather than a string swap. `public/brand/collateral/social/
  alt-text.txt:26-27` carries "Founding Limerick Partner number four" in **alt text**, which is
  venue-legible and was also missed.
  Deliberately NOT swept: CHANGELOG.md, RAID.md and the evidence files, which are the historical
  record; the `.biz-card.partner` CSS class; and the student campus cohorts, which are a
  different programme. Route URLs were not moved - the room registry's own rule is that a route
  is permanent and only labels rename.
  **THE DURABLE HALF, AND IT IS THE FINDING THAT MATTERS:** `evidence/copy/prohibited-claims.v1.json`
  was **read by nothing**. Its own `readBy` field named `scripts/check-venue-edition-contract.mjs`,
  and that 346-line script contained no reference to it, no `[venue-copy]` stage and no
  `--copy-report` flag. **E09.11 §12.2's claim that a second validation stage was added, and its
  entire §12.3 before/after table, describe work that was not in the repository.** Two published
  numbers were also wrong: the file tracks **22** surfaces, not the 37 my own R-042 brief claimed
  to have verified, and the pinned hit sum is **20**, not E09.11 §12.3's 25.
  A reader now runs inside `check-venue-edition-contract.mjs`, which was already the 5th command
  in `pnpm test` and blocking in both `ci.yml` and `verify.yml`, so it needed no new CI wiring.
  **CLOSED 2026-08-04:** the physical 85x55 card at `collateral/identity/print-notes.txt` carries the retired
  term in prepress instructions. Existing printed stock is unchanged and **reprint versus
  run-down was decided by the founder on 2026-08-04: **REPRINT before the first signing.** The card is handed over at the moment of signature, which is the worst place for a term retired because it implies standing D-009 does not grant, and twenty-five cards is a trivial cost against the first venue asking what "partner" entitles them to. Prepress copy corrected; **the reprint order is placed and recorded done by the founder.**
  Evidence: `evidence/R-042-founding-25-retirement.md`. Branch `claude/wp16-assets`.

---

## Opened 2026-08-03 by Wave 2 (WP-05, WP-06, WP-12) · verified in shipped code

### R-043 — The Venue Portal has no venue. There is no venue-authenticated route anywhere.
- **Type:** product/security · **Probability:** certain · **Impact:** high · **Severity:** high
- **Owner:** Ethan McNamara
- **Verified:** `studio/src/lib/hq/auth.ts:3,23-25` — the only guard on every Account surface
  is one shared password whose cookie is `sha256('signal-hq-session:v1:' + SIGNAL_HQ_PASSWORD)`,
  deterministically derivable. `studio/src/lib/account/live/project-venue-access.ts:326` —
  the live snapshot returns `members: []` unconditionally.
  `studio/src/app/hq/account-review/panels/account-panel.tsx:77-91` — "Invite member" sets a
  local notice string and nothing else; `:10-23` — support history is a hardcoded two-row array.
- **Detail:** D-027 point 4 makes the portal at launch "invitation administration only", which
  implies an administrator. There is none. The four roles and the 13-row capability matrix in
  `lib/account/roles.ts` govern nothing on the live path, and `ROLES_AND_PERMISSIONS.md`'s
  `sponsor_members` lifecycle has no implementation. The same shared password also opens Today,
  Money, Company, Vault, Atlas, Decks, Founders Circle and the Data Room, so the blast radius of
  handing it to a venue is the whole of Signal HQ.
- **Mitigation:** four options are set out with costs in `evidence/E07.16-venue-identity-lab.md`.
  Recommended: **Option C** for 1 September — Signal HQ administers, the venue receives evidence
  rather than a login — with A′ (a read-only venue link) held as a two-day follow-on and B (a real
  venue account) not started before the 2026-08-20 UI freeze.
- **Affects:** E07.16, E07.18, E07.02, E07.03, E15.04
- **Status:** open · **Target:** before the UI freeze, 2026-08-20 · **Last reviewed:** 2026-08-03

### R-044 — A concurrent session committed another lane's in-flight work into an unrelated commit
- **Type:** governance/delivery · **Probability:** high · **Impact:** medium · **Severity:** medium
- **Owner:** Claude Code
- **Verified:** `studio` commit `05974d1` ("Re-baseline seven reviewed surfaces…", 2026-08-03
  04:22:40) contains `docs/execution/venue-edition-and-films/tools/venue-map-export.mjs`, a WP-12
  deliverable, in a commit whose message is about homepage surfaces and does not mention it.
- **Detail:** the file itself is clean — no venue name, no contact data — so there is nothing to
  remediate. The failure is that a `git add` in a shared repository swept an unreviewed package's
  work into an unrelated commit, which makes that change invisible to review and unattributable in
  history. Waves 3, 4 and 5 each run three sessions against the same two repositories.
- **Mitigation:** never `git add -A` or `git add <dir>` in a repository another session may be
  writing; stage explicit paths · a session that commits states which package's files it staged ·
  prefer leaving a wave uncommitted and handing the founder an explicit path list, which is what
  Wave 2 did.
- **Affects:** every remaining wave
- **Status:** open, standing · **Last reviewed:** 2026-08-03

### I-015 — CORRECTED AND CLOSED. The duplicates were real and were fixed during Wave 2.
- **Type:** governance · **Severity:** was high · **Owner:** Claude Code
- **Status:** **RESOLVED 2026-08-03**, on the same day it was raised.
- **What was recorded, and it was accurate when it was read:** reconnaissance at the start of
  Wave 2 found three duplicated register IDs — two D-028 entries in `DECISIONS.md`, two R-025
  entries and two I-007 entries in `RAID.md`. The Wave 2 packet reports them as open.
- **What is true now, verified rather than assumed:** all three are resolved. A concurrent
  session renumbered the standing-publication decision from D-028 to **D-031** while Wave 2 was
  running, and the two RAID pairs were separated in the same period.
  `grep -oE '^#+ D-[0-9]{3}' DECISIONS.md | sort | uniq -d` and the RAID equivalent both return
  nothing.
- **And the registers are NOT validated by nothing, which the original entry also got wrong.**
  `project-control.mjs validate` parses both files and fails on a duplicate id, and `next-id`
  refuses to allocate while one exists: *"the register already contains a duplicate, so the
  maximum is not trustworthy"*. This was demonstrated the hard way — writing the Wave 2 approval
  decision as D-031 collided with the renumbered entry, `validate` caught it, `next-id` refused
  to guess a gap, and it was renumbered to **D-032** above the maximum.
- **What survives, and it is the part worth keeping:** I-011's underlying finding stands.
  Markdown registers do drift under concurrent sessions, and three duplicate pairs existed at
  once. The guard that catches it is real and it works. The remaining discipline is to run
  `validate` at the END of every session rather than only at the start, which is exactly what
  turned a silent collision into a refusal here.
- **Affects:** DECISIONS.md, RAID.md
- **Status:** closed · **Last reviewed:** 2026-08-03

### R-045 — Five of the 25 Cohort 1 venue names will not fit the film, and the render refuses them
- **Type:** delivery/film · **Probability:** certain · **Impact:** medium · **Severity:** medium
- **Owner:** Ethan McNamara
- **Verified 2026-08-03 (D-032 R17):** measured against `private/cohort-convert.json` cohort 1.
  25 venues. **Longest name 54 characters. Five exceed the 34-character cap.** Counts only —
  no name is recorded here, because consent to publication is `unknown` for all 219 accounts.
- **Detail:** `signal-motion`'s map composition refuses a recipient venue name over 34
  characters **at parse time** rather than shrinking or wrapping it. That is the right failure
  mode for a batch of 25 — a silent shrink puts a name past the safe area on somebody's
  personalised film — but it means five of the first twenty-five renders fail on render night
  unless something is decided first. The cap is derived from the layout: it is the longest
  name whose plate fits the content box at the smallest supported format.
- **The three options, and the recommendation:** (a) raise the cap, which pushes the plate past
  the safe area at 9x16 and is the wrong trade; (b) wrap to two lines or shrink the type, which
  changes the composition for all 25 to accommodate five; (c) **add a per-account
  `film_display_name` to the venue record — the venue's own name, shortened deliberately by a
  person, for the five that need it.** (c) is recommended: it is five editorial decisions taken
  once, it keeps the composition unchanged for the other twenty, and a venue's own name on
  their own film is exactly the thing that should not be truncated by an algorithm.
- **Mitigation:** decide before E13.17 renders anything. The column belongs in
  `private/venues.csv` and in `venue-map-export.mjs`'s payload, not in a signal-motion fixture.
- **Affects:** E13.15, E13.16, E13.17, E10.06
- **Status:** open · **Target:** before the Cohort 1 render run · **Last reviewed:** 2026-08-03
