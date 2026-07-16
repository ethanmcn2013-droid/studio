# Elevation critique log · the three rounds

Date: 2026-07-16. The council's written record for the v2 loop. Each
round critiques the renders in `renders/v2/`, never the code.

## Round one · the charters land

Implemented: per-direction stacks and date grammars, the three button
constructions with VML twins, monochrome Hairline, the Broadsheet folio
and numbered stories, the Letterhead written date, enclosure line and
signature scale, the dark canvas fix, hold-mode red fix, tabular
numerals, styled alt text, composed plain text, poster and still re-sets.

**The Compositor.** The deletion email in Hairline is now the best page
in the system: engraved button, aligned facts, one rule weight. Two
misses on the poster: the eyebrow at 22px wraps "60 / SECONDS" mid
phrase inside the image, and that is a typesetting error in a
photograph, unforgivable. Fix: eyebrow carries the film name only, the
duration moves to the film-id line.

**The Client Engineer.** VML twins render, the wrapper cell finally
darkens (probed, all three), the held sheet keeps print-red. Plain text
is now a client I would sign. One defect: the numbered wire stories set
their continuation lines flush left, so "02" hangs off a ragged block.
Hanging indent required.

**The Brand Warden.** Hairline monochrome reads instantly as ours: the
dot is the only colour on the page and it lands. Letterhead's postal
line without the duplicate address is cleaner. No violations found.

**The Copy Editor.** The plain-text twins now read as written things.
The facts blocks align, links sit on their own lines. Signed, pending
the hanging indent.

**The Taste Arbiter.** Round verdict: not passing, two named defects
(poster wrap, hanging indent). One thing removed this round: the
duration from the poster eyebrow, which was doing a second job badly.

## Round two · the fixes prove

Re-rendered. Poster eyebrow holds one line, the film-id line reads
`FILM-VEN · 60 SECONDS`, wire stories hang correctly under their
numbers.

**The Compositor.** The Geist samples against the fallback samples show
the stacks doing their work: Hairline is barely distinguishable between
ideal and fallback, which is exactly its charter. Remaining unease: the
product still keeps a band of empty field under the windows; a picture
desk would crop it.

**The Client Engineer.** Forced-dark probes green in all three
directions. Blocked-images letter reads as copy in a quiet panel, not a
broken icon. Signed.

**The Brand Warden.** The still no longer carries a wordmark inside the
photograph; the page signs itself once. The honesty line ("a designed
view, not a recording") is now legible, which is the point of having
it. Signed.

**The Copy Editor.** Recurring phrases audited across all 24: the
fallback line is character-identical in its fifteen appearances; the two
address lines are the codified Hairline/Letterhead divergence. Signed.

**The Taste Arbiter.** One defect left (the still's dead field). One
thing removed this round: nothing qualified; restraint held.

## Round three · the details pass

Still recropped to 1072×480 and the display ratio updated. Cross-set
sweeps run over all 24 renders and 24 twins: one date grammar per
direction in the header slot (prose dates written out everywhere by
rule), no double middots, no double spaces, VML present in every
buttoned render, `role="presentation"` on 10 of 10 tables in the sample,
tabular numerals present. Edge fixtures re-run: the long headline wraps
to four lines in Broadsheet and stays balanced, the long venue name
holds the letter measure, the missing first name degrades to the plain
salutation, the four-workspace list reads unambiguously with comma
separation.

**Verdicts, in voice.**

The Compositor: "Three clocks, one time each. The numerals behave like
money. I sign."

The Client Engineer: "The fallback is the design now, on purpose. The
dark arrives everywhere I probed. The text twin is a client. I sign."

The Brand Warden: "One dot in Hairline, a folio in Broadsheet, a name
in Letterhead. Further apart than v1, each more ours. I sign."

The Copy Editor: "Every recurring sentence is the same sentence. The
deletion list can no longer miscount someone's wedding. I sign."

The Taste Arbiter: "Scores in the tracker, floor held at 9.5, and the
distance test passes structurally: monochrome versus folio versus
letter. The one thing I removed in the final round: the caption under
the Letterhead poster, because the enclosure line already says it
better. Signed."
