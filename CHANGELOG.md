# signal studio. — changelog

Process notes for the umbrella. The four products keep their own logs;
this one tracks what coalesced across the suite.

---

## 2026-05-10

### The umbrella stopped being an old portfolio.

The `/work` page now names only the four Signal Studio products. No
client artifacts. No inherited side quests. The page says what the
company is: Signal Tasks, Signal Roadmap, Signal Analytics, Signal
Notes. The contact page now points at `hello@signalstudio.ie`, and the
handbook no longer treats Analytics as a placeholder.

### The umbrella is live.

signalstudio.ie opened today. DNS resolved to Vercel. The apex serves.
What's visible: a choreographed entrance — gold hairline, headline
rising word by word, four product rows entering from both sides on
scroll. The silence between tasks., roadmap., analytics. and the held
beat where notes. would fire — that silence is intentional. The gesture
is the story.

### Notes held in placeholder.

The Notes row dims. Its brand gesture stays quiet in the entrance
sequence. The row is present enough to show the suite is four products;
inert enough to never imply a live product. Opacity carries the honest
weight that copy would oversell.

---

## 2026-05-09

### The brand handbook became a real artifact.

BRAND.md grew §2 today — audience deep-dive and moat. The moat line
settled: *discipline sustained across the suite*. Not a feature, not
a category. A posture maintained across four products and every piece of
copy that touches them. §2.1–§2.3 locked the three reader archetypes
and the thing that makes the suite defensible: that it stays consistent
when most solo products drift.

### A gesture for Notes entered the visual register.

The notes-mark acquired an underline-writes-itself animation — the
period underlines itself on enter, then disappears, matching how capture
works: you write, then it's gone. That gesture is now in the products-grid
and named in BRAND.md §4 as the canonical visual register source-of-truth
for all four marks. Consistency is a decision made once, held everywhere.

### Favicons travel as a system.

Three products — roadmap, analytics, studio — now share a favicon
architecture derived from the same design logic. The marks read at 32px.
They read at 180px on a home screen. They're the same decision at every
size.

### Security headers closed across all four products.

HSTS, X-Frame enforcement, and CSP report-only landed on every
next.config in the suite simultaneously. The suite operates as a
coherent security boundary, not four independent decisions. Nothing
visible changed. That's the point.

### hello@signalstudio.ie

Domain verified. Google Workspace connected. The address is real.
DKIM generation still owed — the key needs to be created in the Admin
Console before the suite has a fully authenticated sending identity.

---

*Everything important. Nothing distracting.*
