# Signal Studio · PDF Export Specification
## One-pagers, Brand one-pager, Marketing deck export, Shared print system

**Written to:** `~/Desktop/SIGNAL_ONEPAGER_SPEC.md`
**Reason:** `~/Projects/personal/_wt-hq-pdf-export/docs/` does not exist yet.
**Date:** 2026-05-16
**Status:** Spec-complete. Awaiting engineer implementation.

---

## PUSHBACK BEFORE THE SPEC

Three tensions in the brief that need naming before any designer or engineer touches this:

**1. "World-class" and "single page" fight hardest on Analytics.**
The briefing engine, the six triggers, the prose rotation, the daily-vs-weekly cadence — this is a system, not a feature. A single page can carry the *promise* ("what needs focus before it becomes a problem") but cannot explain the mechanism without turning into a manual. Decision: the one-pager tells the reader what it feels like to use it. The mechanism lives nowhere on the page. This is the correct cut — the spec enforces it.

**2. Notes is the thinnest product in the suite.**
It has real shipped features (Turso persistence, Clerk auth, cross-repo send-to-Tasks, FTS5 search, email capture) but the homepage H1 has just been corrected from architecture-register language and the UX polish score is 72. The one-pager should not overclaim. What it *does* carry — private-by-default, captures before you're ready — is distinctive and honest. The spec holds to that.

**3. The marketing deck export is not a redesign.**
The deck already implements Brand Book §11 correctly (verified in `marketing-deck.tsx`). The PDF spec is purely about translation fidelity: what the four-corner chrome means on paper, what the `mdk-period` indigo dot means in CMYK/vector, what "slides cut" means in a static medium (page breaks, not transitions). Nothing in the deck's content changes.

---

## PART 1 · SHARED PRINT ART-DIRECTION SYSTEM

Everything in §§ 2–4 inherits from here. Read this first.

### 1.1 Page setup

| Property | Value |
|---|---|
| Format | A4 portrait (210 × 297mm) for all one-pagers. US Letter (8.5 × 11in) as an optional second export target for the deck only. |
| Orientation | Portrait for one-pagers. Landscape (297 × 210mm / 11 × 8.5in) for the marketing deck. |
| Bleed | None. The brand does not bleed. Hard edges are part of the register (hairlines, not bleeds). |
| Safe zone | 16mm margin all sides on one-pagers. 14mm margin all sides on deck slides. |
| Colour space | RGB for screen PDF. If going to offset print: convert to CMYK at press (indigo `#4F46E5` → Pantone 2736 C as nearest match; do not auto-convert — verify with printer). |

### 1.2 Page grid (one-pagers, portrait A4)

A single asymmetric column grid. Not a multi-column magazine grid — this is a Signal product, not a brochure.

```
Left margin:   20mm
Right margin:  20mm
Top margin:    18mm (masthead lives here)
Bottom margin: 14mm (footer lives here)
Content width: 170mm
Gutter:        none (single column)
```

One optional divider line (0.25pt, `rgba(17,17,17,0.10)`) separates the masthead from the body and the body from the footer. No borders on the page edges — that is the Behance portfolio aesthetic, not this brand.

### 1.3 Masthead / wordmark lockup for print

Every document (one-pager and deck) carries a masthead in the top-left corner of each page/slide:

```
[line 1] signal studio.          ← Geist 500, 8pt, lowercase, letter-spacing -0.01em
                                    The period is in indigo (#4F46E5). Never gold. Never omitted.
[line 2] [product eyebrow]       ← Geist Mono 500, 7pt, uppercase, letter-spacing 0.14em
                                    e.g. "SIGNAL TASKS · EXECUTION CLARITY"
                                    Color: #71717A (--ink-quiet equivalent)
```

The two lines sit flush-left, top of the safe zone. No logo file. No wordmark SVG export. Typeset only. The period is the logo.

On the deck, this is already implemented as `.mdk-c-bl` (bottom-left chrome). For print, it migrates to the top-left because print is read top-down, not projected bottom-up. The deck's bottom-left placement is a presentation convention, not a brand rule.

### 1.4 Footer (all documents)

Every page/slide carries a footer, flush bottom of the safe zone, in a single line:

```
[left]  signalstudio.ie                  ← Geist Mono 500, 7pt, uppercase, letter-spacing 0.12em
[right] [Month YYYY] · [Page N of NN]    ← same spec
Color: #71717A
Separator: 0.25pt hairline above the footer line, full content width
```

The page number format is `01 / 05` (padded, tabular figures). This matches the deck's `.mdk-c-br` convention.

The date format is `May 2026` (long month, not ISO). For the deck, the date is the plan date, not the export date.

### 1.5 Typographic scale for print (pt sizes)

Screen uses fluid clamp. Print uses fixed pt. These are derived from the screen scale, snapped to print-readable floors.

| Role | Font | Size | Weight | Tracking | Leading |
|---|---|---|---|---|---|
| Display heading | Geist 600 | 36pt | 600 | -0.045em | 38pt |
| Title heading | Geist 600 | 24pt | 600 | -0.035em | 27pt |
| Section heading | Geist 600 | 18pt | 600 | -0.030em | 21pt |
| Body | Geist 400 | 10pt | 400 | 0 | 15.5pt |
| Body marketing | Geist 400 | 10.5pt | 400 | 0 | 16pt |
| Eyebrow | Geist Mono 600 | 7pt | 600 | +0.14em | 10pt (UPPERCASE) |
| Mono label / footer | Geist Mono 500 | 7pt | 500 | +0.12em | 10pt (UPPERCASE) |
| Kicker / def key | Geist Mono 500 | 7.5pt | 500 | +0.08em | 11pt |

**Print-specific note:** Geist at 10pt on white paper has excellent legibility. Do not increase to 11pt "for safety" — that is a SaaS-brochure reflex. The restraint in the type size is part of the brand.

### 1.6 Colour (print)

Three colours only. No exceptions.

| Role | RGB hex | Print equiv |
|---|---|---|
| Paper | `#FFFFFF` | Paper white. Never cream, never warm. |
| Ink | `#111111` | Near-black. Use for all body text, headings. |
| Indigo | `#4F46E5` | Pantone 2736 C (nearest). Used only for: the wordmark period, the per-product gesture mark, inline emphasis (one instance per page maximum), and the closing/indigo slide background on the deck. |

Ink-quiet (`#71717A`) used only in the masthead, eyebrows, and footer. Never for body copy.

No tints of indigo on print (the `--accent-soft: #eef2ff` is a screen token). In print, whitespace does the work the tint did on screen.

### 1.7 The period-as-signal in print

The indigo period in the wordmark is a vector dot, not rasterized text. In any PDF export:

- The wordmark must be typeset, not placed as an image.
- The period character is styled with `color: #4F46E5` (or the CMYK equivalent at print).
- It must render as a vector object in the PDF, never as a flattened raster.
- At 7–8pt, the period is approximately 0.7–0.8pt in width. This is intentional. It should not be enlarged to "make it read better."
- On a projected deck, the dot is `.mdk-c-dot` (a `border-radius: 50%` div). In print, it becomes the actual period character in the typeface, not a circle SVG.

### 1.8 Per-product gesture in a non-animated medium

The gesture cannot animate in print. Here is how each one translates:

| Product | Animated gesture | Print translation |
|---|---|---|
| Tasks · pulse | Dot breathes, 2.6s ease-in-out | A single indigo dot, full opacity, no blur. The stillness reads as present-moment. |
| Roadmap · sweep | Dot tracks left→right | A short indigo rule (0.4pt, 12mm wide) to the left of the wordmark period. Suggests a timeline without labeling one. |
| Analytics · tick | Dot jumps between samples | Three indigo dots in a row (2pt diameter each, 3mm gap), the third at full opacity, the first two at 30% opacity. Arrested-motion. |
| Notes · caret | Dot blinks like a cursor | A vertical bar (0.4pt × 7pt) in indigo immediately after the closing letter of `notes`. The static cursor. It simply is there. |
| Studio · broadcast | Rings outward | Two concentric hairline circles (0.25pt) around the period dot on the umbrella wordmark. The rings are `#4F46E5` at 15% and 8% opacity — nearly invisible, present. |

These are not icons. They are typographic gestures. No SVG exports, no Illustrator artwork. A typesetter or CSS engineer can produce all five from the above spec.

### 1.9 The one rule that keeps all six documents one family

**Every document is white, with one indigo period.**

That is it. The indigo period anchors every page — in the masthead wordmark. Everything else (the product gesture, the eyebrow, the type scale, the restraint) is an elaboration of that one mark. A reader who sees any of the six documents in isolation should think: same family. A reader who sees all six together should notice: same mark, different product, one system.

---

## PART 2 · FOUR PRODUCT ONE-PAGERS

### 2.1 Signal Tasks

**What a tired reader must feel:** I know exactly what this holds and who owns it.

**Headline (display, 36pt):**
```
What needs doing.
Who owns it.
What's stuck.
```
Three declarative lines. No verbs except implied. The period after each line is not the brand-period — these are full sentence-ending periods, ink. The period after "stuck." happens to be the last mark on the headline block. The brand-period lives in the masthead only.

**What it is (one line, body marketing):**
A task workspace for real work — owned items, clear states, plain English throughout.

**Purpose paragraph (body, max 55 words):**
Tasks is where the work lives when it needs to be shared. One workspace holds everything: what's next, what's moving, what's blocked, and who's on it. No setup required. No vocabulary to learn. Open it with a wedding planner, a contractor, a student group — anyone who needs to see the work clearly.

**Mission line (eyebrow, uppercase mono):**
EXECUTION CLARITY

**Substance points — what it actually does (drawn from product docs):**

1. Tasks, lanes, and assignees in plain English. No sprints, no epics, no status meetings required to decode the board.
2. Invite anyone to a shared workspace. The work is visible the moment they open it — no onboarding step, no permission taxonomy.
3. A plain-English activity log. What changed, who did it, when — written as a sentence, not a database row.
4. Connects to Signal Notes for capturing work in progress, and Signal Roadmap for showing where the work is going.

**Brand treatment:**

- Gesture: **pulse** — a single indigo dot, full opacity, rendered as the period in `tasks.` in the masthead. Print: still, present, at rest. Do not add a pulse animation indicator or wave graphic.
- Accent/period: the wordmark reads `tasks·` on screen; on print it reads `signal tasks.` in the masthead (full-form, per BRAND.md §4 marketing copy convention). The period is indigo.
- Type hierarchy: headline uses the three-line display treatment at 36pt. Substance points are body 10pt with a 0.25pt indigo left rule (2mm width × 12mm tall) as the only visual list marker. No bullet glyphs, no dashes.
- Deliberately left OFF: screenshots of the UI, pricing, feature count, comparison to competitors, the word "kanban," anything resembling a feature matrix, logos of companies using it. The page is the product.

---

### 2.2 Signal Roadmap

**What a tired reader must feel:** I can send this to someone who doesn't use software and they'll understand it.

**Headline (display, 36pt):**
```
Where the work is going.
What changed.
What people should expect.
```

**What it is (one line):**
A shareable roadmap that non-technical collaborators can open and understand in under sixty seconds.

**Purpose paragraph (body, max 55 words):**
Roadmap gives the work a public face. Write your plan once. Share a link. Anyone — a client, a venue coordinator, a course supervisor — sees what's in progress, what shipped, and what comes next, without being asked to understand the tool behind it. The shared update page is for people who don't work in the workspace.

**Mission line:**
DIRECTION CLARITY

**Substance points:**

1. A markdown editor that produces a structured, publicly shareable roadmap. Write it; share the link; the reader sees progress, not source.
2. Milestones as a first-class object, with countdown and per-milestone progress. The reader knows how close the work is to done.
3. A shared update page — a page the workspace owner can send to anyone, with "invited by" attribution and a reply-by-email option. No account required to read.
4. Public guest view. The roadmap is the architecture: being public is not a feature toggle, it is how Roadmap works.

**Brand treatment:**

- Gesture: **sweep** — a short 12mm indigo rule (0.4pt) sits to the left of the masthead period, suggesting a timeline without labeling one. Left-to-right direction implied.
- Accent/period: `signal roadmap.` in masthead, period in indigo.
- Type hierarchy: headline at 36pt display. The three lines share one display block — no extra leading between them. Body 10pt. Substance points use the same left-rule treatment as Tasks.
- Deliberately left OFF: the markdown syntax, the editor UI, the word "workspace," pricing tiers, anything that requires the reader to already be a user. The page is for the person the roadmap is being *sent to*, not the person writing it. This is the editorial cut that makes Roadmap's one-pager different from the others.

---

### 2.3 Signal Analytics

**What a tired reader must feel:** This knows what I should look at. I don't have to decide.

**Headline (display, 36pt):**
```
What needs focus
before it becomes
a problem.
```
Three lines, set as one flowing sentence broken for rhythm. The line break after "focus" is deliberate — it creates a pause. "before it becomes a problem." has the period; it is ink, sentence-ending.

**What it is (one line):**
A daily briefing — not a dashboard — that names the three things in your work worth attention today.

**Purpose paragraph (body, max 55 words):**
Analytics reads your Signal Tasks workspace every morning and sends one email. Not a report. Not a chart. Three items, ranked by what matters most: what's been stuck the longest, what's due soon, what you shipped. If nothing moved, nothing arrives. The briefing is as useful as the work it describes — no more.

**Mission line:**
ATTENTION CLARITY

**Substance points (drawn from shipped feature set — do not overclaim):**

1. Six attention triggers: stuck work, due soon, just shipped, overload, crowded week, blocked too long. Each fires only when the condition is real.
2. Prose rotation — eighteen phrasings, one per (user, day) — so the briefing never reads the same way twice.
3. One-click unsubscribe, RFC 8058 compliant. The brand promise extends to the email: if you want silence, you get it immediately.
4. The briefing skips quiet days. If nothing in your workspace moved yesterday, nothing arrives. Silence is the signal.

**Brand treatment:**

- Gesture: **tick** — three indigo dots in a row (2pt diameter, 3mm gap), the third full opacity, the first two at 30%. Arrested motion. Samples, not a continuous read. Placed immediately after the masthead wordmark period.
- Accent/period: `signal analytics.` in masthead, period in indigo.
- Type hierarchy: headline three-line at 36pt, flowing sentence treatment. The substance points are the most important on any one-pager — they must be believed, not just read. Use the left-rule treatment but add the mono kicker "WHAT IT DOES" above the list block at 7pt eyebrow spec.
- Deliberately left OFF: any chart, any graph, any screenshot of the brief, the word "dashboard," pricing, the cron schedule, the word "algorithm," any implication of AI or prediction. The page must read like the briefing itself: calm, specific, earned.

**Tension named explicitly:**
"World-class" and "single page" fight here. Analytics has the deepest mechanism in the suite. The spec resolves this by making the page feel like the briefing — not a manual for it. What's dropped: the trigger system detail, the prose rotation mechanism, the Resend/Vercel cron infrastructure, the cadence switching (daily vs weekly). None of that is on the page. A reader does not need to know how the engine works to trust that it does.

---

### 2.4 Signal Notes

**What a tired reader must feel:** This is where I write before I'm ready to write.

**Headline (display, 36pt):**
```
Not everything is ready
for the room.
Write it here first.
```
This is the ratified homepage H1 (as of N·3 2026-05-15). Use it verbatim. Do not simplify or paraphrase.

**What it is (one line):**
A private notebook that sends work forward — into tasks, into decisions, into the record.

**Purpose paragraph (body, max 55 words):**
Notes is private by design. It's where the thought goes before it's a task, before it's a decision, before it's ready to share. Write a venue meeting, a supplier call, a half-formed concern — then send it to your workspace when it's ready. Nothing leaves until you say so. The notebook is yours.

**Mission line:**
CAPTURE CLARITY

**Substance points (drawn from shipped feature set):**

1. Private by default. Notes do not appear in any shared workspace, any activity log, or any briefing unless you explicitly send them forward.
2. A draft action — highlight what matters in a note, send it to your Signal Tasks workspace as an owned task. One tap. The note stays private; the task is real.
3. Search across the notebook. Command-K, type, find — including partial matches and phrases across old notes.
4. Email capture. Send a note to your notebook from any email client. The note arrives, private, ready to work from.

**Brand treatment:**

- Gesture: **caret** — a vertical bar (0.4pt × 7pt) in indigo immediately after the final letter of `notes` in the masthead. The static cursor. It simply is there, as if you could type.
- Accent/period: `signal notes.` in masthead, period in indigo.
- Type hierarchy: headline is the most personal in the suite. Set at 36pt display but with a slightly tighter leading (36pt) to let the three lines feel like one breath. Body 10pt. Substance points use the left-rule treatment.
- Deliberately left OFF: the green/mustard colour register from the in-product chrome (that is intentional within the product, but the one-pager is brand-system output, not a product screenshot). No screenshots of the notebook. No mention of the technical stack (Turso, Clerk, FTS5). No pricing on this page — Notes's value is pre-commercial; the page should feel like the product, not a sales sheet.

**Note on brand consistency:**
The in-product Notes aesthetic uses green/mustard/Inter (locked per `feedback_notes_aesthetic.md`). The one-pager is a brand document, not a product screenshot. It uses the suite's paper/ink/indigo system. This is not a contradiction — the one-pager represents the suite, not the product surface.

---

## PART 3 · BRAND ONE-PAGER (Signal Studio as whole)

**What a tired reader must feel:** Five products. One system. One discipline.

### Structure

**Masthead:**
`signal studio.` — the umbrella wordmark in full. Period in indigo. The broadcast gesture (two concentric hairline circles, 0.25pt, `#4F46E5` at 15% and 8% opacity around the period dot).

**Headline (display, 36pt):**
```
Project management
for the 80% not in tech.
```
`80%` carries a typographic emphasis treatment: Geist 600, same size, but the `80%` span is wrapped in the `.marker` style (indigo at 28% opacity, 78% height at 82% baseline) — the only instance of the marker primitive on any one-pager. This is the ratified umbrella H1. Use verbatim.

**Operating principle (section heading, 18pt):**
```
Everything important. Nothing distracting.
```
Set as a section heading. Not a display. It is a discipline, not a promise.

**What the suite is (body, max 60 words):**
Signal Studio is four products that read as one. Each solves one kind of clarity: Notes captures context before it's ready to share. Tasks organises action and ownership. Roadmap communicates direction to people outside the work. Analytics surfaces what needs attention before it becomes a problem. Together they are a system. Separately, each one works.

**The through-line (pull quote style — body 10.5pt, 2pt indigo left rule, 14mm wide):**
The moat is not features. It is disciplined refusal sustained across four products over time. Every banned word, every refused dashboard, every plain-English error message is the same decision made again. Incumbents can copy a feature. They cannot copy a discipline that has been held for two years.

**How the four products relate:**

Use a four-row definition list (Geist Mono 7.5pt kicker + body 10pt description), separated by 0.25pt hairlines:

```
SIGNAL NOTES        Capture context before it's ready for the room.
SIGNAL TASKS        Own the work. Know what's stuck. See who's on it.
SIGNAL ROADMAP      Share direction with people who aren't in the workspace.
SIGNAL ANALYTICS    Read what matters before it becomes a problem.
```

Below the list, one line in eyebrow style:
`SIGNALSTUDIO.IE · FREE TO START · WORKSPACE €12/MO · EVENT €79`

**Brand treatment:**

- This is the only one-pager with the broadcast gesture. All other one-pagers use their product gesture.
- No product screenshots. No feature list. The four-row definition list is the entire product summary.
- Deliberately left OFF: the founder story (that lives in the pitch, not the brand one-pager), pricing detail beyond the one eyebrow line, individual product benefits beyond the four-row list, the word "ecosystem," the phrase "suite of products" (use "Signal Studio"), any reference to competitors.
- The one-pager ends at the footer line. No CTA. No "learn more." No URL other than `signalstudio.ie` in the footer. Restraint is the brand.

---

## PART 4 · MARKETING PLAN DECK — PDF EXPORT ART-DIRECTION

### 4.1 What this is

The deck content is locked (`marketing-deck.tsx`, verified). This spec covers only the static PDF rendering of that deck. Nothing about the slides' content changes.

### 4.2 Page setup

| Property | Value |
|---|---|
| Format | A4 Landscape (297 × 210mm). Maps 1:1 to the 16:9 screen ratio without letterboxing. |
| Orientation | Landscape |
| Bleed | None |
| Margins | 14mm all sides (matches the deck's `--foot: 64px` equivalent scaled to print) |

### 4.3 Four-corner chrome in print

The deck renders four-corner chrome (`.mdk-c-tl`, `.mdk-c-tr`, `.mdk-c-bl`, `.mdk-c-br`) at every slide. In PDF these become:

| Corner | Content | Print spec |
|---|---|---|
| Top-left | `signal studio · plan` | Geist Mono 500, 7pt, uppercase, letter-spacing 0.14em, ink-faint |
| Top-right | `2026.05 · PRIVATE` | same spec |
| Bottom-left | `signal studio` + indigo dot | `signal studio.` — the period is a 4pt indigo circle (or the period character in indigo). See §1.7. |
| Bottom-right | `01 / 21` (page count) | Geist Mono 500, 7pt, tabular figures |

The footer bar (`.mdk-bar`) that appears on screen is the presenter UI — it does not appear in the PDF. The four corners carry all navigation information needed in print.

### 4.4 Slide palettes in print

Three palettes, exactly as on screen:

| Slide type | Background | Text |
|---|---|---|
| Default (content, metrics, statement, title) | `#FFFFFF` paper | `#111111` ink |
| Divider | `#0B0B0F` ink | `#FFFFFF` paper |
| Closing | `#4F46E5` indigo | `#FFFFFF` paper |

The divider's giant indigo numeral (`.mdk-div-num`, `30cqi`) renders as Geist Mono 500 at approximately 80pt in A4 landscape. This is correct — it should be large. Do not reduce it "for readability." It is a section marker, not a heading.

### 4.5 What motion becomes in a static medium

The deck has exactly one animation: `mdk-settle` (the cover dot scaling up on the title slide). In PDF:

- The dot is rendered fully formed (scale: 1, opacity: 1). The settled state is the print state.
- The segment progress bar (`.mdk-seg`) does not appear — it is the presenter UI.
- The tab active states (`.mdk-tab.on`) do not appear.
- The `mdk-kick-pip` indigo circle (before content kicker lines) renders as a filled circle at 4pt. It is a static bullet, which is exactly what it communicates in print.

Nothing else animates in the deck. There is nothing else to translate.

### 4.6 Typographic translation (screen `cqi` to print `pt`)

The deck uses `cqi` units (container-query inline). For A4 landscape at 297mm content width (minus 28mm margins = 269mm ≈ 763pt), the translation is approximately:

| Screen `cqi` | Print `pt` approx |
|---|---|
| 1.4cqi | ~10.5pt (chrome labels) |
| 1.6cqi | ~12pt (content body) |
| 1.9–2.1cqi | ~14–15pt (lead text) |
| 3.5cqi | ~26pt (content heading) |
| 4.4cqi | ~33pt (metrics heading) |
| 6.4cqi | ~48pt (divider heading, statement) |
| 8.2cqi | ~62pt (title heading) |
| 30cqi | ~229pt (divider numeral) |

These are reference values for the engineer. The PDF renderer should use the screen-computed values if rendering via headless browser (Playwright/Puppeteer + `page.pdf()`). If typesetting manually, use these pt values.

### 4.7 Content-slide layout in print

Content slides (`.mdk-area-content`) are top-anchored, not centred. This is correct for print — centred content slides drift awkwardly on paper. The top-anchor reads as a reading document, which is what the "read mode" already implements.

The definition list (`.mdk-def`) renders with:
- Hairline above (`0.25pt`) and between each row
- Mono key (Geist Mono, ~10pt in print)
- Body value (~12pt in print)
- A 2-column layout: key fixed at ~30% width, value at ~70%

The ledger (`.mdk-ledger`) renders with the highlighted row (`.mdk-lr-on`) in full ink weight, the last column value in indigo. This is the only instance of indigo text on a content slide — use it for the highlighted cell only.

### 4.8 Cover slide in print

The title slide (`.mdk-title`) positions the headline bottom-left. In print, this translates to:

- Headline block: Geist 500 lowercase, ~62pt, anchored to the bottom of the safe zone (above the footer chrome)
- "Six-month marketing plan." — the period is in indigo
- Sub line: ~14pt, ink-soft, max 46ch wide

The title slide is the only slide where the wordmark period dot carries the settled animation — in print it is simply the filled indigo period. Full opacity. No fill animation.

### 4.9 Fidelity bar for "world-class"

Four criteria, non-negotiable:

1. **Vector text.** All type must be embedded as vector (not rasterized). Geist must be embedded in the PDF. Test: zoom to 400% in Acrobat — type must remain crisp.
2. **No rasterized slides.** Do not screenshot slides and embed as images. Every element must be native PDF vector.
3. **Indigo as a single, consistent colour object.** All instances of `#4F46E5` must resolve to the same colour object in the PDF. Do not allow browser rendering to produce slightly different RGB values for the same hex — this is a failure mode of some headless renderers.
4. **Page count and chrome consistency.** Every slide/page carries the four corners. The bottom-left wordmark period must be the same size on every page. Inconsistency in the chrome reads as a production error, not a design choice.

### 4.10 Table of contents / divider pages in print

The five section dividers (`verdict / engine / machine / sixmonths / field`) serve as chapter breaks in the PDF. In a print reader (Acrobat, Preview), these should be bookmarked:

```
I   · The verdict
II  · The engine
III · The machine
IV  · Six months
V   · The field & the test
```

Use PDF named destinations or bookmarks for each divider slide. This is the print equivalent of the deck's contents pane — it lets the reader navigate without a presenter.

---

## QUICK-REFERENCE: WHAT NEVER APPEARS ON ANY DOCUMENT

- Competitor names or logos
- Feature comparison tables
- Pricing tier grids (the brand one-pager carries one line; that is the limit)
- Screenshots of the product UI (these are text-first documents)
- The words: AI, dashboard, streamline, leverage, seamless, robust, cutting-edge, world-class, best-in-class, stakeholder, sprint, epic, kanban, Agile
- Exclamation marks
- Emoji
- More than one accent colour
- Gradients (indigo is flat; paper is flat; ink is flat)
- Drop shadows (hairlines do the elevation work)
- Purple (`#7c5cff` or any variant)
- The word "Signal" without "Studio" or the product name following it

---

*Spec written by creative-director role. Engineer: implement the shared print system first (§1), then the one-pagers as five independent InDesign/Figma/CSS-print documents sharing the §1 tokens. The deck PDF is a headless-browser export from the existing React component — verify vector text and colour consistency in Acrobat before delivery.*
