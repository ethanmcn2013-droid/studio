# BRIEF · Venue Edition and Films

**One page. The current position, so no session has to rebuild it from
twenty-four decision entries.**

Version 1.3 · 2026-08-03 · task E01.01

**This page goes stale faster than it reads.** Version 1.1 was accurate for about
an hour: two live defects it listed as open were fixed in code by a parallel
session while it was being written. Anything in "What is open" below is the
volatile part. Check it against the code before you quote it, and re-read
`DECISIONS.md` for anything under change control.

**This page outranks nothing.** It is a summary. The source-of-truth order in
`PROJECT.md` §15 is unchanged: founder decisions in current approved documents,
then `DECISIONS.md`, then `PROJECT.md`, then task specs, then
`PROJECT_STATE.json`, then the repository, then history. Where this page and any
of those disagree, they win and this page is wrong. Say so and it gets fixed.

> **Reading `DECISIONS.md` after this?** D-003, D-004, D-005 and D-006 still
> carry the header *proposed, founder decision required*. All four were resolved
> (by D-009, D-010, D-020 and D-015 Q4). The log is append-only so the headers
> stand. Read the index at the top of that file before acting on any of them.

---

## The offer

A wedding venue buys Venue Edition and gifts it to every couple who books with them.

| | |
|---|---|
| Standard | €1,500 a year, prepaid, **inclusive of VAT at the prevailing rate** |
| Founding 25 | €1,000 a year, prepaid, **inclusive of VAT at the prevailing rate** |
| The line to a venue | €500 a year less, for as long as you stay |
| The lock | Covers **the base annual Venue Edition agreement only**, while it renews continuously without lapse, or until the service ends. Never "for life", never "forever" |
| Places | Exactly 25, numbered 01/25 to 25/25. The number is assigned on payment, not on signature |
| Hold | 14 days from proposal, once. Ethan extends it personally or not at all |
| Change of control | The rate follows the property, not the company. It does not travel to a new owner's other properties |
| What the venue gets | A workspace for every couple who books with them, while the licence is current. No seat count. Fair use notifies Signal HQ, it never blocks issuance |
| What the couple pays | Nothing. The couple never sees a price |
| Founder access | One 30-minute call a year, plus a named email route |
| Volume | Never changes the price. A 250-wedding venue costs roughly €1,750 a year to serve against €1,000 gross, a permanent loss of about €750 on that venue under the lock. Accepted by decision, recorded as R-021 |
| Wedding count | Collected **after signature**, as an onboarding field. It sets the issuance ceiling. It never sets the price and never changes at renewal |

**Say this unprompted, in the outreach email and the agreement:** any workspace
a couple has already redeemed keeps its full term plus Keepsake whatever happens
to the venue's licence. Only new issuance stops.

## The product model

The couple owns the workspace. The venue never sees inside it.

1. The planning workspace is private and belongs to the couple.
2. The venue sees invitations, activation evidence and aggregate adoption numbers, suppressed below 3 sponsored workspaces for counts and 5 for percentages. It never sees planning content.
3. Wedding dates appear only where that venue's code was redeemed. **A date change is never shown.** A postponement is the couple's news, not a dashboard event.
4. The Venue Portal and the Signal Studio Account are one surface with two names.
5. The Shared Timeline is the main emotional artifact. Authenticated owner screens keep the Signal Studio black rail **where appropriate**. Shared public pages are rail-free and carry one line of credit in the footer, no logo and no badge.
6. Couple access runs 18 months from redemption, or **90 days** past the wedding day, whichever is later. Access can move later. It never moves earlier.
7. Then Keepsake: free, read-only, for as long as the service exists, with a one-click export the couple keeps.
8. If a couple cancels or moves venue the workspace can be released. The couple keeps their content in Keepsake and venue branding and the venue's name come off within 24 hours.
9. Venue Edition is not venue-operations software. Nothing is built for one venue.
10. **Couples are asked for no rights.** Venues are asked for logo and name usage in the founding programme and on the map. Any couple case study is separate and opt-in.

## The geography

A 45-minute drive from Limerick city centre. In public: "Limerick and the surrounding counties."

**In:** dedicated wedding venues, country houses, castles, hotels with a real weddings operation, barn and estate venues.
**Out:** restaurants, pubs, marquee hire, town hotels doing occasional weddings, anywhere under roughly 20 weddings a year.

Outreach is email from `signalstudio.ie`, gated on DKIM. Twenty-five venues per cohort, in sequence, until 25 have signed and paid. Film link clicks are tracked, opens are not. Four touches, then stop and mark `later`. No visits, no printed letters. Venue packs ship as digital files.

## The films

| Film | What it is | Who |
|---|---|---|
| Limerick First | 35 to 45 seconds. One render per Cohort 1 venue, that venue's name on the map | Codex, creative |
| Before the Day | 60 to 75 seconds of the sponsored couple experience. No price on screen | Codex, creative |

**The lanes split** (D-015 Q6). Codex owns the creative. Claude Code owns the map
data, the data-driven composition and the parameterised render pipeline: E13.04,
E13.15, E13.16. Neither film is finished because a render exists.

## The dates

Offer 15 Aug · UI 20 Aug · copy 21 Aug · capture 22 Aug · film lock 28 Aug · release candidate 30 Aug · **release 1 September 2026**.

**Release means ready to contact Cohort 1.** It is the same 1 September as the
company launch gate, which carries its own redeploy, marketing-CTA and `/app`
allowlist steps.

**The project closes** when 25 venues are signed, paid, configured, onboarded and
able to invite a couple; **and** the founding offer is closed at 25 with standard
€1,500 pricing live on all new commercial surfaces (E15.17); **and** the
postmortem, archive and handover into operations are complete (E15.18); **and**
Ethan has approved those last two.

## What needs a change request, always

Price · founding-rate terms · number of founding venues · geographic boundary ·
entitlement model · couple access term · the Keepsake promise · product scope ·
film scope · release date · any launch gate · the completion condition. Nothing
on that list moves by a session deciding it was sensible.

---

## What this replaces

The **positions** below are retired. The file-by-file list of surfaces still
carrying them is longer and lives in
[`evidence/E01.01-superseded-ledger.md`](evidence/E01.01-superseded-ledger.md).

| Retired position | Replaced by |
|---|---|
| 15 founding venues, €1,500 locked, no discount | D-009 |
| Any price stated without "inclusive of VAT at the prevailing rate" | D-021 |
| 40/80 activation allotment, and any seat count shown to a venue | D-020 |
| "18 months, then the account drops to Free" as the whole rule | D-010, extended by D-022 |
| A fixed 548-day access window with no grace | D-022 |
| Venue Portal and Signal Studio Account as two products | D-015 Q4 |
| 50 venues emailed on launch day | D-017 |
| Physical letters, leave-behinds and in-person visits | D-018 |
| "Documented Irish legal and accounting review obtained" as the legal gate | D-016, CR-001, D-023 |
| Licensed stock photography for demonstration imagery | D-012 |
| VAT-exclusive drafting (CR-001 criterion 6) | D-021 |
| An eligibility floor of roughly 40 weddings a year | D-012, which sets roughly 20 |
| Screening large venues onto the standard rate | Rejected by the founder in D-020 |
| The €1,500 to €4,000 price band | Retired 2026-07-11 |
| Both films wholly owned by the motion lane | D-015 Q6 |
| E11 drafting owned by the founder | D-008 point 2 |

**Decided is not implemented, and the gap is closing while you read this.** WP-10
superseded the HQ decision file, published `contracts/commercial-terms.v2.json`
with the ratified position, and corrected the live `/venues` page during the same
wave. A shrinking set of strategy and brand-guide documents still carries the
retired wording. **The ledger is a snapshot of a live tree and does not claim to
be complete. Re-run its greps rather than trusting its rows.** I-002 closes when
E02.01 and E12.04 are founder-approved, not when the strings change.

## What is open, and how bad

| | Why it matters |
|---|---|
| **R-017 · critical** | Dietary and allergy notes are Article 9 health data about guests who agreed to nothing. It ships in the wedding template and is advertised on a public page. Any affected guest can complain to the DPC for free. Due before E03.04 is drafted |
| **R-010 · critical** | DKIM is pending and gates all sending. Twenty-five cold sends from a domain with no history fails silently: no bounce, no signal, no replies. Due before offer freeze, 15 Aug |
| **R-001 · critical** | 119 critical-path tasks against 29 days. R-001 says 120; E03.12 left the path by D-023 and the register was not updated |
| **R-023, R-024, R-025 · high** | The launch category, empty until 2026-08-03. Release day failing on deployment configuration rather than on the product; the first venue onboarding being improvised; all six gates passing with release-blocking work still in Backlog |
| **R-015 · fixed in code, RAID not yet updated** | The mint now accepts a computed duration and refuses anything under 548 days, and there is a wedding-date recompute path. Verified 2026-08-03 in `entitlements-db/codes.ts`. The register still reads "the code refuses it"; WP-01 reconciles that at its close |
| **R-016 · fixed in code, RAID not yet updated** | `venue-allotment.ts` now carries an unlimited mode and the onboarding form no longer defaults an allotment to ten. Same reconciliation pending |
| **R-020 · high** | Twenty-five venues will describe this product in their own words. Without a marketing-controls clause from version one, a venue saying "yours forever" becomes Signal Studio's problem |
| **R-013, R-014** | No solicitor, no accountant, no professional indemnity. Chosen, reaffirmed, owned |
| **R-018** | Signal Studio may already be an accountable person for VAT by buying foreign B2B services. Free to ask Revenue. Unasked |

No document, page, film line or portal string may state or imply legal approval,
solicitor review, accountant verification or unqualified GDPR compliance.

---

*Written for E01.01 and not founder-approved. The decisions it summarises are already in force; approving the task changes the task's state, not theirs.*
