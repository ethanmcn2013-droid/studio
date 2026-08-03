# R-042 — "Founding partner" retired, and made unable to come back

**Worked:** 2026-08-03 · **Package:** WP-16 · **Worktree:** `_wt-wp16`, branch
`claude/wp16-assets`, stacked on the approved-but-unmerged `claude/wp13-commercial`.
**Decision:** D-033 ratified R-042. The programme is **the Founding 25**; a member
of it is **a founding venue**. Retire, not define.

**Nothing here is Done.** This reaches Founder Review and stops. Two founder
questions are open at §9 and neither is answered by this work.

Criteria are in `tasks/R-042.md`, written before anything was audited or edited.
Each section below is one claim with the command that produced it. Modelled on
`E12.04-venues-page-audit.md`, which is the bar.

---

## 1. The scope was larger than every published figure, in both directions

Re-derived in `_wt-wp16` rather than copied. Two commands: `git grep -I -c -iE
"founding[ -]partner"` for line counts, then a per-file `grep -oiE | wc -l` loop
for true occurrence counts, then a separate sweep of the whole of `public/` and
`src/` for the bare word.

| Figure | Published | Derived here | Where the published number came from |
|---|---|---|---|
| Occurrences of "founding partner" | **11 across 7 files** (R-042 brief §1) | **43 across 18 files** | The brief swept two trees but counted lines, not occurrences, and missed `src/lib/hq/asset-command.ts` entirely |
| In `market-entry-deck-2026.html` | **4** (brief, and the RAID entry) | **6** under the compound pattern, **25** counting every `partner` | The media-plan trio at 4234, 4236 and 4268 was missed, as was the proof ring at 4008 rendering `FOUNDING<br>PARTNERS` |
| In `collateral/identity/index.html` | **1** | **3** | The file is 32 lines of single-line HTML. A line count reads 1 |
| Surfaces tracked by `prohibited-claims.v1.json` | **37**, stated as "I verified the count" (brief §"What is mine") | **22** (2 enforced, 20 tracked) | Parsed with `node`. The sentence that cites 37 is the argument that the machinery already exists |
| Prohibited-claim hits pinned | **25** (`E09.11-copy-system.md` §12.3) | **20** pinned in the file; **30** on the first machine run | §12.3 reports a before/after table for a sweep stage that does not exist in this tree. See §5 |

**The single largest miss.** `src/lib/hq/asset-command.ts` carried **11**
occurrences of the compound term and **54** of the bare word — the heaviest
concentration in the repository, and the source of the language everything else
inherited. The brief counted only `src/app/hq/asset-command/page.tsx`, which has
one. `"C · Founding Partner kit"` at line 125 is a union type member, so it was a
typed rename and not a string swap.

**Two surfaces nobody had listed at all:**
`public/brand/collateral/social/alt-text.txt` (the rendered copy of the four S·4
images, served under `public/`) and `public/brand/pitch-deck-2026.html`
("Beta distributed to venue partners").

## 2. Classification, and what was deliberately not touched

Eighteen files carried the compound term. Every one is in exactly one class and
the three classes sum to eighteen with no residue.

**Venue-facing — 5 files, swept.** `public/brand/market-entry-deck-2026.html` ·
`src/app/design/page.tsx` (public route `/design`) ·
`public/brand/collateral/identity/index.html` ·
`public/brand/collateral/identity/print-notes.txt` ·
`public/brand/pitch-deck-2026.html`.
Plus three that the compound pattern missed and the bare sweep caught:
`collateral/social/alt-text.txt` · `collateral/social/index.html` ·
`collateral/venue/index.html`.

**Internal `/hq` and internal docs — 11 files, swept.**
`src/lib/hq/asset-command.ts` · `src/app/hq/asset-command/page.tsx` ·
`src/app/hq/venue-kit/page.tsx` · `src/app/hq/partner-card/page.tsx` ·
`src/app/hq/slide-30-review/page.tsx` · `src/lib/hq/rooms.ts` ·
`src/lib/hq/make-labs.ts` · `src/lib/hq/operating-system.ts` ·
`src/lib/hq/hq-nav.ts` · `src/components/design/flip-card.tsx` ·
`docs/strategy/VENUE_EDITION_STRATEGY.md`. Two operator-todos were added from the
bare sweep: `collateral-venue-signoff.md`, `collateral-identity-signoff.md`,
`collateral-social-signoff.md`.

**Record-only — 5 files, EXPLICITLY EXCLUDED.** `CHANGELOG.md` ·
`docs/execution/venue-edition-and-films/RAID.md` ·
`evidence/E12.04-experience-review-2026-08-03.md` · `SESSION_HANDOFF_WAVE3.md` ·
`docs/content-truth-audit.md`.

**Say this out loud so a later reader does not read the exclusion as a miss.**
RAID.md and the E12.04 review *are* the risk record. R-042's own entry quotes the
term in order to forbid it. Editing them would destroy the evidence that the
defect existed and was found, which is the only thing that makes the fix
auditable. `PROJECT_STATE.json`, `HANDOFF.md` and the session logs are excluded
for the same reason. The current grep result over those files is not a defect and
must not be "fixed" by a later sweep.

## 3. What changed, before and after

**`public/brand/market-entry-deck-2026.html` — 21 edits.**

| Line | Before | After |
|---|---|---|
| 2832 | `3,000 planned venue contacts · founding partners · campus cells` | `… · founding venues · …` |
| 3930 | `25-partner proof cohort` | `25-venue proof cohort` |
| 3993 | `30 · FOUNDING LIMERICK PARTNERS` (section comment) | `30 · THE FOUNDING 25` |
| 4008 | `FOUNDING<br>PARTNERS` (proof ring) | `FOUNDING<br>25` |
| 4234 | `a founding-partners follow-up in October` | `a founding-venue follow-up in October` |
| 4236 | `the people behind the founding partners` | `… the founding venues` |
| 4268 | `Founding-partner stories with named businesses` | `Founding-venue stories …` |
| 4371 | `Press · campus-cell · partner kits` / `partner pack 4` | `… Founding 25 kits` / `Founding 25 pack 4` |
| 4404 | `The founding partner variant · presented at signing` | `The Founding 25 variant · presented at signing` |
| 4407 | `Founding Limerick Partner` (the card face) | `Founding Limerick Venue` |
| 4451 | `Format S·4 · the partner` | `Format S·4 · the founding venue` |
| 4453 | `Glen House is Founding Limerick Partner № 04.` | `… Founding Limerick Venue № 04.` |
| 4713 | `Founding partner pack` / `Makes joining feel like membership, not purchase` | `Founding 25 pack` / `Makes joining feel earned, not bought` |
| 5107 | design id `'partner-certificate'` | `'founding-certificate'` |
| 963, 968–971, 4405 | CSS class `.biz-card.partner` | `.biz-card.founding` |

Line 4713's second half was not in any brief. "Membership" is the banned term
*member* wearing a different suffix, on the asset whose whole job is to describe
what joining feels like. It was found by the bare-word sweep, which is the case
for the bare pattern in one line.

The CSS class rename is not cosmetic bookkeeping: it removed five entries that
would otherwise have had to be justified in writing as exceptions, on a class
that names the founding card.

**`src/app/design/page.tsx` — 2 edits, public route.**
`frontAlt="Founding Partner card, indigo, numbered one of twenty-five."` →
`"Founding 25 card, …"`. `<SpecLine>the founding partner card · one of 25 ·
indigo</SpecLine>` → `the Founding 25 card · one of 25 · indigo`.

**`collateral/identity/index.html` — 3 edits.** The lede's *"The Founding Partner
variant is presented at signing"* → *"The Founding 25 variant …"*, and both PDF
and PNG link labels.

**`collateral/identity/print-notes.txt` — 1 edit.** See §6; this one has a cost
attached.

**`collateral/social/alt-text.txt` — 2 edits plus a pending note.** `S.4 The
Partner` → `S.4 The founding venue`; the sp01 alt text → *"Founding Limerick
Venue number four, venue name placeholder. Specimen, not a real venue."*

**`collateral/social/index.html` · `collateral/venue/index.html` · `pitch-deck-2026.html`
— 1 edit each.** *"the partner format stays a marked specimen"* → *"the founding
venue format …"*; *"The partner line is a marked specimen"* → *"The founding venue
line …"*; *"Beta distributed to venue partners"* → *"Beta distributed to founding
venues"*.

**Internal — 54 replacements in `asset-command.ts`, 29 across ten more files.**
Labels, names, summaries, alt text and prose. `"C · Founding Partner kit"` became
`"C · Founding 25 kit"` at all six sites including the union type. `rooms.ts`
`name: "Partner card"` → `"Founding 25 card"`, `summary:` → `"Founding 25 card;
Indigo and Numeral shortlisted."`, alias `"founding partners"` → `"founding 25"`.
`make-labs.ts`, `operating-system.ts` and `hq-nav.ts` labels follow.

**No third term was invented.** Every replacement uses "the Founding 25" for the
programme or "founding venue" for a member of it, per D-033 and D-009 §6. No em
dash, no exclamation mark, sentence case except where a proper designation on a
card requires otherwise.

**Six bare uses left alone, and why.** `asset-command.ts` lines 164, 184, 394,
520, 523 and 526 read "Venues / press / partners", "Press / partners", "handed to
partners, press, and peers", "partner correspondence". Those mean press and
peers. Changing them would be a guess dressed as a sweep. Line 4800 of the deck
("media kit and partner materials") is the least clear of them and is recorded as
an exception with that stated in the reason, rather than silently altered.

## 4. Verification of the sweep

```
$ git grep -I -n -iE "founding[ -]partner"
```
returns hits in exactly five files, all of them record-only: `CHANGELOG.md`,
`RAID.md`, `E12.04-experience-review-2026-08-03.md`, `SESSION_HANDOFF_WAVE3.md`,
`docs/content-truth-audit.md`.

```
$ grep -rniE "founding[ -]partner" src/ public/ content/ docs/strategy/
src/lib/founding-certificate.test.ts:169:  assert.doesNotMatch(text, /founding partner/i);
```
One hit, and it is an assertion that the term is absent, written by the
concurrent E12.10–E12.13 session in this worktree.

**Zero occurrences remain in any venue-facing or internal `/hq` surface.**

## 5. The durable fix — something now reads the contract

### 5.1 What was true before

`evidence/copy/prohibited-claims.v1.json` is a complete specification: 15 rules,
85 patterns, two enforcement tiers, scope semantics, a claim/copy split, and a
citation discipline with its own written rationale. Its `readBy` field named
`studio/scripts/check-venue-edition-contract.mjs`.

```
$ git grep -n "prohibited-claims"
```
Zero hits in `scripts/`. The only non-documentation hits are five source-code
comments in `src/lib/venue-invitation/copy.ts` and `src/lib/venue-proposal.ts`
that merely name the file. `check-venue-edition-contract.mjs` (346 lines, read in
full) contains no reference to it, no `[venue-copy]` stage and no `--copy-report`
flag. Its only JSON reads are `contracts/commercial-terms.v2.json`.

**The `readBy` field was false, and `E09.11` §12.2's "a second stage,
`[venue-copy]`, reading its patterns from `prohibited-claims.v1.json`" describes
work that is not in this tree.** `git log` on the script shows WP-13's `16df762`
added 53 lines and all of them are E12.14 structured-data rules. The gate reported
`ok` because it was not reading the list — the identical failure mode E09.11 §12.3
itself describes.

Independently corroborated by the citation list. **Thirteen of the seventeen
citations named lines that do not exist.** They cite a retirement banner and four
struck-through rows in `METRIC_DICTIONARY.md` and eight prohibition lines in
`VENUE_FACING_CLAIMS.md`. Neither file contains any of them. Those citations were
written against text that was intended rather than committed, and nothing ever ran
to notice. They are removed from the contract and listed in §8 so E09.03 and
E09.11 can restore them when the text is actually written.

### 5.2 What now exists

`studio/scripts/check-venue-copy.mjs`, 240 lines. It reads the contract, applies
every rule to every listed surface, and honours the contract's own semantics:
`claimOnly` skips lines ending in a question mark, `copyOnly` skips surfaces of
kind `code`, `blockquote` scope checks only blockquote lines, punctuation rules
never run on scope `file`, and `p7-bare-term` applies its grace window.

A separate file rather than a stage inside the contract check, so that its
registration is one visible line rather than a claim about what another script
does internally. That distinction is the whole of §5.1.

**One bug found in it by its own first run, recorded because it is instructive.**
The grace window for `p7-bare-term` was computed from offsets built with
`split(/\r?\n/)`, which loses one character per CRLF line. On a 500-line file the
window landed 500 characters from the match and two ratified access-term
sentences were reported as bare-term defects. Fixed by splitting on `"\n"` and
keeping the `\r` inside the part, so `part.length + 1` is the exact span. Both
false failures cleared.

### 5.3 The new rule

`d033-programme-terms`, `copyOnly: true`:

```
\bpartner(?:s|ship|ships|ed|ing)?\b
\bmember(?:s|ship|ships)?\b
\binvestors?\b
\bexclusive(?:ly|ity)?\b
\bcertified\b
\bcertification\b
\baccredited\b
```

**Deliberately bare, not compound.** R-042 survived nine months precisely because
nothing looked for the bare word, only for a phrase somebody had already thought
of.

**`guaranteed` and the permanence set are not duplicated here.** `p1-permanence`
already carries `\bfor life\b`, `\bforever\b`, `\blifetime\b`, `\bin perpetuity\b`
and `\bguaranteed\b`, verified by reading the rule. Adding a second copy would
create two lists, which is R-042 in one sentence.

### 5.4 The exception mechanism

A check that cannot say "partner meaning a spouse" is a check that gets disabled
inside a week. Exceptions are a new array alongside citations, and they are a
different thing: a citation says *the line forbids the word*, an exception says
*the word is ordinary English here*.

Every entry is per surface, per rule, names its line by a distinctive substring
rather than a line number, carries a written reason and an author, and declares an
exact `expected` count. **An exception that suppresses a different number of hits
than it declares fails the check in both directions.** Six are recorded:

| Surface | Rule | Why |
|---|---|---|
| market-entry-deck :3715 | d033 | `Ten partner cohorts averaging 100 paid students` — the student channel. A university, not a venue |
| market-entry-deck :5039 | d033 | The same channel in the economics summary |
| market-entry-deck :4707 | d033 | `podcasts, panels, and partner rooms` — industry rooms at events |
| market-entry-deck :4800 | d033 | `media kit and partner materials` — press and peers. Flagged in its own reason as the least clear of the four |
| market-entry-deck :3071 | p7 | `12-18 months · 141 guests avg` — how long a couple spends planning. Not the access term |
| A1-staged :134 | d033 | `An exclusive-use island reached by your own car ferry` — the venue's own product, in a sentence written back to that venue |

**Known limitation, recorded rather than hidden.** The three brand collateral
index pages are single-line HTML, so on those files a substring exemption is
effectively file-wide for its rule. No exception is written against one and all
three are pinned at zero.

### 5.5 Registration, proved from the files

`package.json`:
```
"test": "… && node scripts/check-venue-edition-contract.mjs && node scripts/check-venue-copy.mjs && node scripts/check-venue-term-parity.mjs && …"
"check:venue-copy": "node scripts/check-venue-copy.mjs --report"
```
`.github/workflows/ci.yml:53` — `- name: Test` / `run: pnpm test`, blocking.
`.github/workflows/verify.yml:27` — `- run: pnpm test`, blocking.
Lint at `ci.yml:55-56` is `continue-on-error: true`; this is not that.

### 5.6 Verified by mutation, in every direction

**A. Reintroduce the term.** `"The Founding 25 variant · presented at signing"` →
`"The founding partner variant · presented at signing"`:
```
[venue-copy] failed
- public/brand/market-entry-deck-2026.html has 1 prohibited-claim hit(s), pinned at 0. A new violation landed.
      public/brand/market-entry-deck-2026.html:4404 [d033-programme-terms] "partner"
exit 1
```
The same mutation through `pnpm test` fails the whole chain at the same line.
Reverted; `exit 0` restored.

**B. Ratchet down.** Removing a pinned hit (`FOREVER` on the pitch deck):
```
- public/brand/pitch-deck-2026.html has 2 prohibited-claim hit(s), pinned at 3.
  Something was fixed. Lower the pin to 2 in …/prohibited-claims.v1.json so the ratchet holds.
exit 1
```
A fix cannot be made silently either.

**C. An exception that over-claims.** `expected` changed from 1 to 2:
```
- exception for public/brand/market-entry-deck-2026.html [d033-programme-terms]
  "Ten partner cohorts averaging 100 paid students" suppressed 1 hit(s), declared 2.
  An exemption may only cover what it was reviewed against.
```

**D. An exception widened to cover a real hit.** A deliberately over-broad
exception on `contains: "pricing-line"` was caught **twice**: the count mismatch,
*and* the ratchet-down that its own suppression caused. An exemption cannot be
used to hide a violation.

**E. A dead exemption.** A citation whose line no longer exists fails by name.
That is how the thirteen stale citations in §5.1 were found.

**F. Exactness on a shared line.** `pitch-deck-2026.html:567` carries both a
`p5` citation and a `p6` hit. The citation suppresses the `per-seat` match and
the `Unlimited workspaces` hit survives, unaided, on the same line.

### 5.7 The run, verbatim

```
[venue-copy] ok — 16 rules, 92 patterns, 29 surfaces swept (0 cross-repo, not
checked here), 30 pinned hit(s), 21 citation(s), 6 recorded exception(s).
```

Full per-surface output is reproducible with `pnpm check:venue-copy`.

**Five surfaces are cross-repo (`../app/...`).** They resolve here because the
app repository sits alongside studio. In a CI job that checks out only studio they
will not, and the script skips them with a printed note and counts the skip rather
than failing. Stated plainly: **those five are not enforced in CI today.** Failing
there would get the gate deleted, which is the outcome this whole exercise exists
to prevent, but a surface that is not checked has to be loud rather than absent.

## 6. The physical card. A founder decision has not been made.

`public/brand/collateral/identity/print-notes.txt` is prepress instruction for an
85×55mm card, and the market-entry deck says that card is *"presented at
signing"*. It read:

> The Founding Partner variant - solid indigo (PMS 2726C is the closest spot
> match to #4f46e5 if offset), numbered at print or by hand, never reprinted.
> Presented at signing only.

It now reads "The Founding 25 variant". **Changing the text does not change any
card that has already been printed.** The note says "never reprinted", which means
any existing stock is by its own rule not replaceable in place.

**Reprint versus run down existing stock is a founder call and it has not been
made.** The R-042 brief asked for it as its second line and D-033 answered only the
first. It has a cost attached, so it is not Claude's to take. `fp-card-print.pdf`
is a committed binary with no generator; regenerating it is a separate job.

## 7. The four S·4 social assets

Renamed. `git grep s4-partner` returned references in exactly one file, so this
touched no manifest and no script:

```
s4-partner-sp01-{ig-portrait,ig-square,ig-story,li-landscape}.png
  -> s4-founding-sp01-{…}.png          (git mv, 4 files)
public/brand/collateral/social/index.html      8 filename references updated
```

**The pixels are unchanged and this must not be mistaken for a fix.** The four
images still render "Founding Limerick Partner No. 04" and carry "Glen House"
rather than the D-012 demonstration venue Glenmara House. There is no generator:
`scripts/render-brand-assets.mjs` renders only the product wordmark SVG to PNG and
touches nothing under `collateral/`. Re-authoring is a design job.

Because the alt text now states the ratified wording and the artwork does not, a
`PENDING RE-AUTHORING` block was added to `alt-text.txt` recording exactly that
divergence and ending "Do not publish S.4 until the images are re-authored." Its
two uses of the retired term are recorded as citations, so the surface stays pinned
at zero and the note cannot be quietly deleted without the pin noticing.

## 8. Defects found and not fixed, with owners

Every one is outside R-042's scope. Recorded so they are counted rather than
rediscovered.

| # | Where | What | Owner |
|---|---|---|---|
| 1 | `public/brand/pitch-deck-2026.html:558` | `€0 FOREVER` on the Free tier. A P1 permanence promise on a public deck, and the exact trap R-008 records | E12.10 / brand |
| 2 | `pitch-deck-2026.html:567,590` | `Unlimited workspaces`, `Unlimited couples`. P6, and E09.11 OQ-6 is the open question | E12.04 / OQ-6 |
| 3 | `docs/venue-portal/METRIC_DICTIONARY.md` | Pinned at 0 against a retirement banner and four struck-through rows that were never written. Six live hits. Re-pinned at 6 | E09.03 item 10 |
| 4 | `../app/src/server/demo/tasks-demo.ts` | E09.11 §13 defect 14 recorded one P8 site at line 87. There are two, at 89 and 99 | E05.03 / E06.01 |
| 5 | 13 citations in `prohibited-claims.v1.json` | Named lines that do not exist in this tree (see §5.1). Removed; restore them when the banners are written | E09.03 / E09.11 |
| 6 | `market-entry-deck-2026.html:4407,4453` | Mojibake: `â„–` where `№` is intended, and box-drawing mojibake in the section comment at 3993. On lines this task edited, and deliberately not fixed — it is an encoding defect, not a terminology one, and expanding scope quietly is the habit this project is trying to break | E12.10 / brand |
| 7 | `market-entry-deck-2026.html:4453` | `Glen House` where D-012 fixes the demonstration venue as `Glenmara House`. Declared a non-goal in `tasks/R-042.md` and left | E09.09 / D-012 |
| 8 | `src/app/hq/account-review/account-review.tsx:86` | The one lint error in the repository, `react-hooks/set-state-in-effect`. Pre-existing, untouched by this work, informational in CI | WP-05 / account |
| 9 | `pnpm test` | Failed twice at baseline on `founding-numbers.test.ts` at the *file* level with all 38 subtests passing, and could not be reproduced in isolation or via `pnpm exec`. It passed three consecutive times after this change. Recorded as intermittent, not as fixed | engineering |

## 9. Two questions for the founder

1. **The physical card.** Reprint `fp-card-print.pdf` now, or run down existing
   stock and change at the next print. §6. This gates nothing in code and it is the
   one place the retired term survives on an object a venue keeps.
2. **The four S·4 images.** Re-author them so the pixels match the ratified
   wording, or leave them marked specimen and unpublished. §7. Re-authoring also
   has to settle whether "Glen House" becomes "Glenmara House" at the same time.

## 10. Routes and gates

**Routes changed:** `/brand/market-entry-deck-2026` · `/brand/pitch-deck-2026` ·
`/brand/collateral/identity` · `/brand/collateral/social` · `/brand/collateral/venue`
· `/design` · `/hq/asset-command` · `/hq/venue-kit` · `/hq/partner-card` ·
`/hq/slide-30-review`. **No route was created and no URL was moved.**

**`/hq/partner-card` and `/hq/partners` keep their URLs.** `src/lib/hq/rooms.ts`
states as its first rule *"`route` is permanent. Rename `name` freely; never move
URLs"*, and `rooms.test.ts` enforces it from both sides — the directory listing
against the registry slugs, and `room.route === /hq/${room.slug}`. A rename is a
thirteen-site change and a fight with the repository's own contract, for zero
venue-visible benefit: `/hq` is behind one shared password and no venue sees the
URL. `/hq/partners` is a 13-line redirect stub to `/hq/entitlements?tab=venues`
carrying no copy at all; deleting it would break the inbound links its own comment
says exist. Recorded, per the brief, rather than half-done.

### The experience gate, stated before and after

| | Failures | Attribution |
|---|---|---|
| **Before any edit** | **8** | 5 from WP-13, the approved-but-unmerged branch this one is stacked on (`/hq/venue-proposal`, `/v/[token]`, its not-found state, `/venues/privacy`, `/venues/questions`, plus `/venues/what-you-see` un-baselined). 2 are the `__design-lab/delight` routes I-014 names as a founder decision |
| Immediately after the sweep | 22 | +10 mine, +4 from the concurrent E12.10–E12.13 session's new `/hq` routes |
| **After re-baselining** | **12** | 8 baseline + 4 the concurrent session's. **Zero attributable to R-042** |

Ten `materialityHash` values were re-baselined in the same change, with
`lastReviewedAt: 2026-08-03` and `approvedBaselineReference` pointing at this
document, following the `05974d1` precedent. **`experience:discover --write` was
not run**, deliberately: it regenerates the registry wholesale and would silently
register the two `__design-lab/delight` routes, which I-014 records as a founder
call and not a chore.

I-014 still applies. `complete` coverage is structurally unreachable through the
current 14-item capture plan, so this is a written review and a hash re-baseline,
not captured evidence, and it is described as exactly that.

### Everything else, run and reported

| Command | Result |
|---|---|
| `pnpm run typecheck` | **exit 0** |
| `pnpm test` | **exit 0**, three consecutive runs. Includes the new `[venue-copy]` stage |
| `pnpm build` | **exit 0**. Full route table produced, including `/design` and every `/hq` page this touched |
| `pnpm run lint` | **exit 1**, one pre-existing error in a file this work did not touch (§8 defect 8). Informational in CI |
| `pnpm run experience:validate -- --product=studio` | **exit 1, 12 failures**, none attributable to R-042 |
| `node scripts/check-venue-copy.mjs` | **exit 0** |

## 11. One thing this shares a boundary with

The concurrent E12.10–E12.13 session is working in this same worktree and has
added `src/lib/venue-copy-refusals.ts`, an in-memory refusal set its four new
artefact tests import. It names `prohibited-claims.v1.json` as the authority and
says plainly that if the two disagree the JSON wins. The two layers are
complementary and were built independently: theirs refuses a string before it
reaches a file, this one refuses a file that reached the repository. Neither
duplicates the other's job.

**Boundary request:** their four new `/hq` routes and their venue-facing artefact
output are not in the swept surface list. They should join `surfaces.tracked` in
the same change that registers them in the experience registry, or they ship
unswept — which is the rule `check-venue-edition-contract.mjs` already states in a
comment about its own commercial-route list, and the reason R-042 existed.
