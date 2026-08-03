# R-024 — the name-only copy register

**Opened:** 2026-08-03 · **Target:** copy-freeze 2026-08-21
**Position being enforced:** D-027 point 3 — venue branding at launch is the
venue's **name only**. No logo, no venue-written welcome message, no venue-
controlled colour or theme in the couple's workspace.

**What actually ships**, confirmed in code:
`app/src/components/welcome/venue-welcome-card.tsx` renders
`Compliments of {sponsorName}` and nothing else.
`studio/src/app/redeem/[code]/page.tsx` passes `brandMeta: null` on every path.

A full sweep of studio, app and signal-motion found **29 surfaces that promise
or imply more than that**. This register tracks every one to closure. Anything
still open on 21 August is a claim going to 25 businesses that the product will
not meet.

---

## Fixed in this session — internal documents

| # | File | Was | Now |
|---|---|---|---|
| 16 | `docs/strategy/VENUE_EDITION_STRATEGY.md:74` | "A co-branded workspace eyebrow" | "A workspace eyebrow carrying the venue name … no logo, no colour, nothing the venue authors (D-027 point 3)" |
| 17 | `docs/strategy/VENUE_FULFILMENT_RUNBOOK.md:111` | "the co-branded landing" | "the redemption landing carrying the venue's name" |
| 19 | `docs/MARKETING_PLAN_6MO.md:52` | "a co-branded planning workspace" | "a sponsored planning workspace carrying the venue's name" |
| 23 | `src/lib/hq/marketing.ts:108` | "The venue-branded artifact" | "The artifact … under the venue's name" |
| 24 | `content/hq/pilots/founding-venue-pilot.md:19` | "A branded planning workspace" | "A sponsored planning workspace carrying the venue's name" |
| 25 | `content/hq/decisions/venue-editions-mechanic.md:21` | "loses attribution + welcome personalization" | "loses the named sponsorship line" |
| 26 | `content/hq/pilots/founding-venue-pilot.md:15`, `content/hq/campaigns/founding-venue.md:20` | "co-branded eyebrow only" | "name-only eyebrow" |
| 27 | `docs/VENUE_EDITIONS_PLAN.md` | "co-branded eyebrow only (no venue logo)" | "name-only eyebrow (no venue logo)" |

---

## CLOSED — public surfaces · founder-approved 2026-08-03, applied

Ethan approved all seven on 2026-08-03. Applied in session `eed55e9e-wp01c`.
**Not deployed** — the files are corrected in the working tree; publishing is a
separate action.

| # | File | Was | Now |
|---|---|---|---|
| 1 | `public/brand/business-loan-pack-2026.html` | **"Branding controls" · "Venue name, mark and welcome message on couple workspaces"** | "Venue attribution" · "The venue name on couple workspaces, as one quiet line" |
| 2 | same | "a **branded** planning workspace … administers invitations **and branding**" | "a sponsored planning workspace carrying its name … administers invitations" |
| 3 | same | "venue-branded workspaces" | "workspaces under the venue name" |
| 4 | same | "Portal scope is limited to … **and venue branding**." | "…support and renewal." |
| 5 | `public/brand/pitch-deck-2026.html` | "**Venue-branded** workspaces." | "The venue name on every workspace." |
| 6 | `public/brand/market-entry-deck-2026.html` | "manages invitations, **branding**, licence status…" | "manages invitations, licence status…" |
| 7 | `src/app/venues/page.tsx` | "eighteen months of Signal Studio each, **co-branded**" — the live OpenGraph description | "…under the venue name" |

**Item 1 was the worst of the 29.** A lender pack promising a venue's *mark* and
a *welcome message* on couple workspaces, neither of which exists.

### Two more found while fixing, not in the original sweep

The audit's line numbers had drifted because a concurrent session was editing
the same decks. Checking each one by content rather than by line surfaced two
further claims in the lender pack, both now fixed:

| File | Was | Now |
|---|---|---|
| `business-loan-pack-2026.html` | "The workspace opens with **venue branding** and wedding templates." | "The workspace opens with the venue's name on it and wedding templates." |
| same | "Annual licence · every booked couple · **venue branding** · portal and onboarding included." | "…· venue attribution · portal and onboarding included." |

Also corrected: two source comments in `src/app/venues/page.tsx` that still said
"co-branded". Not user-facing, but a comment is how the phrase gets copied back
into copy.

**Verification:** `venue-edition-contract`, `content-truth` and
`product-marketing-contract` all pass, typecheck clean, 443 tests pass, build
exit 0. A browser render check was not possible — another session held the dev
server port and killing it was not mine to do.

**A grep for `venue branding`, `venue-branded`, `co-branded` and
`Branding controls` across all three decks and the live venues page now returns
nothing.**

---

## OPEN — proposal and order-form drafts · owned by other packages

These become text a venue signs or is sent. They belong to WP-04 and WP-11, and
WP-01 did not edit another package's evidence documents.

| # | File | Line | The claim | Proposed replacement |
|---|---|---|---|---|
| 8 | `evidence/E11.11-12-proposal-and-objections.md` | 232 | "Your name **and branding** come off within 24 hours" | "Your name comes off within 24 hours." |
| 9 | same | 815 | same phrasing | same fix |
| 10 | same | 945 | same phrasing | same fix |
| 11 | `evidence/E02.12-entitlement-choice.md` | 176 | "**your branding** comes off within 24 hours" | "your venue's name comes off within 24 hours" |

The same E02.12 document already contains the model answer at line 953: *"Your
name is on the couple's workspace, quietly, in one line. It is not a logo wall
and it is not a rebrand of the product."* That is the wording every other
surface should match.

---

## OPEN — owned by the running WP-02 session

Not touched, to avoid a lost update while that session is live.

| # | File | Line | The claim |
|---|---|---|---|
| 13 | `docs/strategy/VENUE_GTM_EXECUTION_PLAN.md` | 64 | "a **branded** planning layer" |
| 14 | same | 75 | "a **castle-branded** planning layer" |
| 15 | `docs/strategy/VENUE_TARGET_LEDGER.md` | 69 | "**castle-branded** planning" |
| 20 | `docs/strategy/VENUE_GTM_EXECUTION_PLAN.md` | 29 | "couple welcome copy" — authorship ambiguous; should read "(Signal Studio-authored)" |

---

## CLOSED — decided 2026-08-03, on the founder's instruction to use my recommendation

| # | Where | Decision taken |
|---|---|---|
| 12 | `docs/strategy/VENUE_EXAMPLE_ROADMAP.md:67` | **Restated, not withdrawn.** The panel's constraint was that the seed is real, not generated from nothing. That is met by *provenance*, not by who types it. It now reads: written from the venue's own facts, gathered in the setup ritual, founder-written — and states explicitly that there is no venue-authoring surface, because D-027 point 3 sets launch branding at the venue's name only. No change request needed: the commitment survives, the mechanism is named. |
| 21 | `DESIGN_DOCKET.md` | **Hosted option killed.** Struck through and marked "KILLED by D-027 point 3 (2026-08-03) … Do not mock this option." Two options survive for the name-only welcome: Restrained and Ceremonial. |
| 22 | same | **Answered.** At launch a venue gets no branding controls and the latitude is zero. E07.17's title predates the decision and is not rewritten (imported titles never are); its scope narrows instead. |
### Still open, deliberately

| # | Where | Why it stays open |
|---|---|---|
| 28 | `BACKLOG.md` E07.17, E12.05, E14.11, E15.03, E05.02 | Task titles containing "branding controls" and "venue-branded". **Imported backlog titles are never rewritten** — WORKFLOWS §1: "If the title is wrong, that is a change request, not an edit." The scope is now narrowed in DESIGN_DOCKET, which is where a designer actually reads it, so the titles seed no further copy. Worth a change request at the next natural moment, not urgent. |

---

## Confirmed clean — no action

Checked and found correct, recorded so nobody re-audits them:

- **`signal-growth/**` outbound** — actively correct. Every variant says *"puts
  your venue's name on it, as a quiet line. Not a logo wall."*
- **`src/emails/**`** — seventeen templates, zero hits.
- **`docs/venue-portal/**`** — clean. `PRODUCT_CONTRACT.md` contains no branding
  control, which is useful evidence that the decks are the drift, not the spec.
- **`app/src/components/welcome/**` and `settings/plan/**`** — clean and correct.
- **`FOUNDING_25_BENEFITS_CHARTER.md`** — its "your name and logo in the founding
  programme" lines are Signal Studio's *own* marketing, which the position
  permits. Not a hit, and flagging them would be an over-correction.
- **`signal-motion/**`** — no venue film scripts exist yet (E13 sub-tasks all
  not started). Nothing to correct, **and this is where the next violation will
  appear.** Item 21's Hosted option is the likely route in. Tell the motion lane
  the position before renders, not after.

## Also worth knowing

Four `_wt-*` worktrees carry stale duplicates of items 3, 5, 7, 16-19, 23, 24,
26 and 27. If any of them can be published, they need the same fixes.
