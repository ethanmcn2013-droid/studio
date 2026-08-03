# R-042 decision brief — "Founding partner" against the ratified "Founding 25"

**Prepared:** 2026-08-03, Wave 3 orchestration. **Decision owner:** Ethan McNamara.
**Recommendation below. Nothing has been changed.**

---

## First: the register understates the scope by more than half

R-042 records five occurrences across two files. I swept both trees myself. The real
count is **eleven occurrences across seven files, plus two routes and four print-ready
social assets whose filenames carry the term.**

**Venue-facing — the ones that matter**

| Where | Count | Note |
|---|---|---|
| `public/brand/market-entry-deck-2026.html` | 4 | Includes *"The founding partner variant · presented at signing"* (:4404) and *"Founding partner pack"* (:4713) |
| `src/app/design/page.tsx` | 2 | Public page. `frontAlt="Founding Partner card, indigo, numbered one of twenty-five."` (:1242) |
| `public/brand/collateral/identity/index.html` | 1 | The identity page for the physical card |
| `public/brand/collateral/identity/print-notes.txt` | 1 | *"The Founding Partner variant"* — **print instructions for a physical card** |
| `public/brand/collateral/social/s4-partner-sp01-*.png` | 4 files | Instagram portrait, square, story, LinkedIn landscape |

**Internal (Signal HQ, password-gated — lower stakes, but they seed the language)**

| Where | Count |
|---|---|
| `src/app/hq/partner-card/` | a whole route, registered in `src/lib/hq/rooms.ts:358` |
| `src/app/hq/partners/` | a second route |
| `src/app/hq/asset-command/page.tsx` | 1 |
| `src/app/hq/venue-kit/page.tsx` | 1 |

**The worst instance is not on a web page.** `print-notes.txt` describes a *physical card*,
and the deck says that card is "presented at signing". A printed object that says Founding
Partner, handed to a venue at the moment of signature, is the hardest version of this to walk
back — it is the one thing in the programme the venue keeps.

## The decision

Retire the term, or define it as a distinct thing.

## Recommendation: retire it. Programme is "Founding 25"; a member is a "founding venue".

**1. "Partner" describes a relationship the contract does not create.** E02.10 selected the
programme terminology specifically to be legally safe, and "partner" is on E12.04's own
banned list alongside member, investor, exclusive, guaranteed and certified. A venue paying
€1,000 a year for a product licence is a customer. Calling it a partner implies standing,
involvement, and in the worst reading a share in the venture — none of which D-009 grants.

**2. Defining it as a distinct thing is the more expensive option, not the cheaper one.**
It means writing down what a "founding partner" *is*, which means documenting a relationship
that does not exist, which is more exposure than the term itself. It also creates a permanent
consistency burden: every future asset has to get right which of two near-identical terms
applies.

**3. "Founding 25" is simply the better brand.** It is finite, countable, and true. The
scarcity is the asset, and the number carries it. "Founding partner" is generic — it appears
in every SaaS launch — and it dilutes the one thing that makes this programme distinctive.

**4. The cost of retiring is a find-and-replace plus a reprint decision.** The cost of keeping
is a definition, a legal question, and the term sitting on a physical object at signature.

## Why I have not applied it, despite the standing brand delegation

Three reasons, each a founder call with money or a gate attached:

1. **R-042 explicitly reserves the deck copy** — "do not quietly rewrite venue-facing deck
   copy" — and that rule was written for exactly this situation.
2. **I-014**: any change to a registered experience surface makes `design-quality`
   unsatisfiable. `studio.page.design` is registered. Editing `/design` deepens a gate that
   is already red with three outstanding failures.
3. **`print-notes.txt` implies a physical reprint**, which has a real cost and possibly
   existing stock. That is a spending decision.

## The change list, ready to apply on one word from you

- `market-entry-deck-2026.html` — 4 edits. "The founding partner variant · presented at
  signing" becomes "The Founding 25 variant · presented at signing"; "Founding partner pack"
  becomes "Founding 25 pack"; the growth line "founding partners" becomes "founding venues".
- `src/app/design/page.tsx` — 2 edits, `frontAlt` and `SpecLine`, to "Founding 25 card".
- `collateral/identity/index.html` and `print-notes.txt` — 2 edits, plus your call on reprint
  versus use-existing-stock-then-change.
- The four `s4-partner-sp01-*` assets — rename, or leave the filenames and change only
  rendered copy. Filenames are not venue-legible; this is tidiness, not risk.
- `/hq/partner-card`, `/hq/partners`, `asset-command`, `venue-kit` — internal, safe to do at
  any time, but a route rename touches `src/lib/hq/rooms.ts` and the room registry.

## What is mine, and what I will do without asking

Fold the banned-term list into a **standing automated string check** so this class of drift
cannot recur. E09.10 already defines the list and `evidence/copy/prohibited-claims.v1.json`
already tracks 37 surfaces with pinned hit counts (I verified the count; the E12.08 evidence
document said twenty and has been corrected). The gap is that "partner" is not among the
checked strings on brand collateral. Adding it makes the next occurrence fail a check rather
than survive to a review nine months later.

## What is needed from Ethan

One line: **retire, or define.** If retire, a second line on the physical card: reprint now,
or run down existing stock and change at the next print.
