# The Craft Ledger · v1 forensic audit

Date: 2026-07-16. Phase 1 of the v2 craft pass. No file outside this
ledger and its audit screenshots has been changed; the v1 renders in
`renders/` are untouched. Findings are numbered CL-01 onward and carry:
where, state, flaw, severity (Critical / High / Medium / Low), owner.

## Method

Walked all 24 v1 renders (8 emails × 3 directions) through the committed
evidence in `renders/html`, `renders/text`, `renders/png`, plus fresh
state captures in `renders/audit/` (dispatch, access-ready,
payment-failed, student-verified at desktop, mobile 390, forced dark, and
images blocked). Ran mechanical sweeps over all 24 HTML and 24 plain-text
files for date grammar, tracking values, rule weights, recurring phrases
and middot usage, and probed computed styles in Chromium for the dark
scheme. Because Geist is not installed on the audit machine, every
screenshot in the evidence set is already the system-font fallback: the
fallback reality is fully visible.

## A · Consistency drift

**CL-01 · Critical · Compositor.** Three date grammars occupy the same
eyebrow slot across the set: `16 JUL 2026` (sign-in, deletion, student),
`14 JUL 2026` / `1 SEP 2026` (billing, access), `16 JULY 2026` (venue and
school letters), and `NO. 1 · JULY 2026` (dispatch), while body copy
always writes the full `16 July 2026`. Counted across renders: 9
abbreviated, 12 full-month, plus the folio form. An editorial system has
exactly one date grammar per register, chosen once.

**CL-02 · High · Copy Editor.** The address line diverges undocumented:
Hairline's footer reads `Signal Studio · Dublin ·` (8 renders), the
Letterhead postal line reads `Signal Studio · Dublin, Ireland ·` (8
renders). If directions diverge here it must be by written rule, not
accident.

**CL-03 · High · Compositor.** Eleven distinct letter-spacing values live
in the system. Some are direction identity (label 0.08em vs Broadsheet
0.14em); several are drift: the Hairline footer address runs 0.06em
against its own 0.08em label register, imagery captions run 0.04em, the
ink CTA runs 0.01em. One tracked-caps value per direction, with named
exceptions, or the mono register stops reading as a register.

**CL-04 · Medium · Compositor.** Caption grammar is unstated: the
Broadsheet still caption is lowercase mono ("One workspace, seen from the
morning."), Letterhead captions are plain sentences, and neither rule is
written anywhere. Both may be right; neither is currently deliberate.

**CL-05 · Medium · Copy Editor.** The deletion email's workspace list
uses the middot as both couple-name separator and list separator:
"(Brennan · Walsh wedding · Freelance work)" reads as three workspaces.
The list separator must differ from anything a workspace name can
contain.

**CL-06 · Low · Compositor.** The raw-link fallback wraps mid-word at 390
("signalstudio.ie/acco unt/billing"). Break-all is the safe default; a
shorter display path would be the considered one.

## B · The fallback reality

**CL-07 · Critical · Client Engineer, with the Compositor.** One shared
font stack serves all three directions, and it was chosen once, not
designed per thesis. The audit screenshots prove the fallback carries the
system acceptably, but: no `font-variant-numeric: tabular-nums` anywhere,
so the sign-in code, every euro amount and every date render in
proportional figures; and no direction states what its fallback
personality is. For most recipients the fallback is the design.

**CL-08 · High · Client Engineer.** No bulletproof button. The CTA is a
padded anchor only; Outlook desktop (Word engine) collapses the padding
and renders a bare link. Either VML/mso conditional construction or a
designed, documented degrade; today it is an accident.

**CL-09 · High · Client Engineer.** Dark mode never fully arrives, in any
direction. React Email copies the canvas background and padding onto a
wrapper `<td>` that carries no class, so the dark overrides on
`.em-canvas` hit the body behind it and the visible ring around the
surface stays light. Probed computed styles under forced dark: Hairline
wrapper td `rgb(255,255,255)`, Letterhead `rgb(250,250,250)`. The dark
palette is designed; it just is not reaching the canvas.

**CL-10 · High · Client Engineer + Brand Warden.** Letterhead's hold-mode
dark is a broken half-state: the sheet correctly holds paper, but
`.em-danger` still flips to the dark-palette `#f87171`, producing pale
red on white in the deletion email. Hold mode must keep `#b91c1c`.

**CL-11 · Medium · Brand Warden.** Poster and still PNGs are paper-white
fields; on a dark surface they glow as uncontained rectangles. The
photograph metaphor allows a light image on dark stock, but the frame
treatment must be chosen, not incidental.

**CL-12 · Medium · Client Engineer.** Images blocked: structure survives
(good), but alt text renders in default link-blue at browser default
size, and the reserved frame is a large void. Alt text is copy; it should
be dressed like copy (inherited ink, caption size, a quiet panel behind
it).

**CL-13 · Low · Client Engineer.** `role="presentation"` is present on
the generated layout tables but absent from the hand-rolled header,
footer and key-value tables. `lang="en"` is set. Half the floor is in.

## C · Plain text

**CL-14 · Critical · Copy Editor + Client Engineer.** The plain-text twin
is a mechanical strip, not a designed artifact. Evidence from
`renders/text/auth_sign-in-code--hairline.txt`: the header collapses to
`signal studio.Security · 16 Jul 2026`, the key-value rows fuse into
`Foraoife.brennan@example.ieRequested09:12…`, blank lines stack three
deep, and headings arrive auto-uppercased by the converter rather than by
choice. Every one of the 24 text twins fails the same way. Plain text
needs its own composition: measure, one rule character per direction,
labelled facts, links on their own lines.

## D · Buttons and direction theses

**CL-15 · High · Brand Warden, ruled by the Arbiter.** The filled indigo
button sits on Hairline's bank-letter thesis like a sticker. Broadsheet's
ink button already looks resolved; Letterhead's pill is defensible as the
one warm move. Hairline wants something quieter, and the charter must
decide what (ruled text action, ink button, or underlined link with the
indigo reserved for the dot).

**CL-16 · Medium · Brand Warden.** Indigo rationing slips in the deletion
email: primary button, raw-link fallback and secondary export link are
all indigo, three accents in one viewport. The canon says indigo is the
action, singular.

## E · Product stills and posters

**CL-17 · High · Brand Warden.** `product-still.png` reads pale and
provisional: a large near-empty `#fafafa` field, two small windows, an
embedded wordmark that gives the dispatch render three wordmarks in one
scroll, and a micro-mono disclaimer line that is illegible at email
scale. The Broadsheet promise is "stills as captioned photographs"; this
is a screenshot of whitespace.

**CL-18 · High · Compositor.** Poster typography is scaled down from the
1072px master: the 11px mono eyebrow renders at roughly 5px inside the
480px Letterhead measure. Illegible. Posters must be set at their display
size, with an email-scale type floor.

**CL-19 · Medium · Compositor.** Crop discipline: the still carries about
forty percent dead field below its content; a front-page photograph would
be cropped to its subject.

## F · Micro-typography

**CL-20 · Medium · Compositor.** The sign-in code is the single most
important glyph run in the system and renders in proportional figures
with a breakable space. It wants tabular figures and a no-break space
between its halves.

**CL-21 · Low · Compositor.** No non-breaking spaces anywhere: `€12.00`
amounts, `10 minutes`, `60 seconds`, `18 months` can all split across
lines.

**CL-22 · Low · Copy Editor.** The Hairline footer sets the reply address
in uppercase mono: `HELLO@SIGNALSTUDIO.IE`. Case-transforming an email
address in the one place people check where mail came from is the wrong
kind of quiet.

**CL-23 · Low · Copy Editor.** The dispatch's "Also this month" items
name destinations as prose ("At signal.signalstudio.ie.") with no link.
Editorial mode should let the reader go there.

## G · Correction of the v1 record

**CL-24 · Note · Taste Arbiter.** v1's critique recorded a "canvas
defect: stray dark band" and fixed it with an html background rule. Pixel
inspection of the PNGs shows the band was a review-tool display artifact;
the files are clean `#fafafa` to the last row. The html rule stays as
correct defensive CSS, but the v1 claim of an observed rendering defect
is withdrawn. The genuinely broken thing in dark mode is CL-09, which the
v1 pass missed.

## What is already excellent · protect it

The provisional-claims banners and the Blocked flag on school outreach.
The classification, sender and tracking metadata surfaced beside every
render. The tracking policy itself (no pixels anywhere) and the honest
footer reason lines. The KeyValueRows pattern for exact facts. The
fixtures' edge cases. Zero mechanical voice violations across all 24
renders. None of this may be damaged in the elevation.

## Director verdicts

**The Compositor.** The bones are set well: one column, honest rules, a
real mono register. But the house has three clocks showing three times
(CL-01), eleven tracking values where five belong, and the most important
numerals in the building, the code and the euro amounts, are proportional.
First: one date grammar. Second: tabular figures everywhere numbers
matter. Third: the poster type floor.

**The Client Engineer.** The HTML is cleaner than most first systems, and
someone already refused open pixels, which I respect. But the design most
recipients get was never signed: no VML buttons, dark mode that stops at
a classless td, and plain text that concatenates a person's email address
into the word "For". First: CL-14, because plain text is a whole client.
Second: CL-09. Third: CL-08.

**The Brand Warden.** The dot survives email, the palette held, nothing
smells of SaaS. Three worries: the indigo button on Hairline's bank
letter (CL-15), three indigo accents in one deletion email (CL-16), and
stills that undersell the product they are supposed to prove (CL-17). The
provisional-claims banners are the most on-brand thing in the system:
honesty as furniture. Do not touch them.

**The Copy Editor.** The words are already good, which makes the
misses louder. The plain-text twins read like a fax of a fax (CL-14). A
middot doing two jobs in a deletion notice (CL-05) is the kind of
ambiguity we fire people for. And the footer whispers an address in
uppercase (CL-22). First: rebuild plain text as writing. Second: one
address line per direction, chosen. Third: link what should link.

**The Taste Arbiter.** v1 earns its "very good": the restraint is real,
the honesty apparatus is genuinely distinctive, and nothing here needs
rebuilding. The gap to the bar we were convened for is exactly the brief's 15%: one date
grammar, numerals that behave like money, a fallback that was chosen, a
plain-text voice, and each direction pushed further from the other two.
I am also striking one v1 boast from the record (CL-24): we fixed a bug
that was a reflection in the glass and missed the one behind it. That is
why this ledger exists.

## Summary

| Severity | Count | Findings |
|---|---|---|
| Critical | 3 | CL-01, CL-07, CL-14 |
| High | 8 | CL-02, CL-03, CL-08, CL-09, CL-10, CL-15, CL-17, CL-18 |
| Medium | 8 | CL-04, CL-05, CL-11, CL-12, CL-16, CL-19, CL-20, plus CL-13 floor gap |
| Low | 5 | CL-06, CL-21, CL-22, CL-23, and the CL-24 record note |

Five worst, in order: CL-14 (plain text), CL-01 (date grammar), CL-07
(undesigned fallback, no tabular figures), CL-09 (dark canvas never
arrives), CL-15 (Hairline's button fights its thesis).
