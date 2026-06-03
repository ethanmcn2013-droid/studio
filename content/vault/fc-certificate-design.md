# Share Certificate — Design System
## Phase 2 · Concepts, Wording, Spec, Materials
*Version 1.0 — 2026-05-30*

---

## Certificate Wording

### Mam — Founding Member (SS-FC-M)

```
Share Certificate

This certifies that

[MAM'S FULL NAME]

is the registered holder of

Ten Percent (10.00%)
of the Class B Founder Circle Shares
in Signal Studio

Founding Member

Certificate No. SS-FC-M
Issued on the First day of September, Two Thousand and Twenty-Six

————————————————
Ethan McNamara
Founder, Signal Studio
```

### Friends — Founder Circle Member (SS-FC-001 through SS-FC-004)

```
Share Certificate

This certifies that

[RECIPIENT'S FULL NAME]

is the registered holder of

Two and One-Half Percent (2.50%)
of the Class B Founder Circle Shares
in Signal Studio

Founder Circle Member

Certificate No. SS-FC-00[N]
Issued on the First day of September, Two Thousand and Twenty-Six

————————————————
Ethan McNamara
Founder, Signal Studio
```

### Wording notes

- "Issued on the First day of September, Two Thousand and Twenty-Six" — the long-form legal date reads as gravitas and permanence. Avoid numeric dates (01/09/2026 is ambiguous, 01 Sep 2026 is too corporate).
- The percentage is stated in words first, then numerals in brackets — this is the convention in formal instruments.
- "Founding Member" and "Founder Circle Member" appear as standalone designations with no punctuation — they are titles, not descriptions.
- The signature line is a rule (not a placeholder box) — the actual handwritten signature appears above the printed name.
- No company registration number appears on the certificate until formal legal constitution is complete; it is added to final print run once the entity is registered.

---

## Three Design Concepts

### Concept A — "The Ledger"

*Character:* Classical bond/deed register aesthetic. Double-rule border (thin outer, thick inner). Centered layout. A faint watermark pattern (a single "ss." character at very low opacity) fills the center background. Feels like a share certificate from a private bank's registry, circa 1950.

*Best for:* Recipients who appreciate historical register. Formal gravitas. The kind of document you'd expect in an oak-paneled office.

*Risk:* Can read as period pastiche if not executed with restraint. The watermark is the element most likely to tip into excess — omit if in doubt.

**Layout:**
- Double rule border: 1pt outer, 8pt gap, 2pt inner, Stone (#C4BBB0)
- "SHARE CERTIFICATE" as a header, Cormorant Display, tracked +0.2em, centered
- Ornamental rule between title and name: a single 24pt "❧" or equivalent floral ornament
- Name: Cormorant Display 52pt, centered
- Body: Lora 13pt, centered
- Certificate number: bottom left, DM Mono 9pt
- Signature: bottom center, with rule
- Date: bottom right, DM Sans 9pt

---

### Concept B — "The Document"

*Character:* Architectural, asymmetric. A vertical Stone rule at 52mm from the left edge runs the full height of the certificate. All content sits to the right of this rule. The left margin is empty except for the certificate number running vertically in DM Mono, rotated 90°, in Graphite. Feels like a Dieter Rams-era document — modern, rigorous, beautiful.

*Best for:* Recipients with contemporary aesthetic sensibility. Anyone who owns Braun products.

*Risk:* Less immediately legible as a "certificate" — may require a moment of orientation. Not framable in every context.

**Layout:**
- Vertical Stone rule: 1.5pt, left margin 52mm, full height
- Certificate number rotated 90°, DM Mono 9pt, Graphite, left of the rule
- All content right of rule, left-aligned
- "Share Certificate" — DM Sans Medium 10pt, tracked +0.1em, Graphite
- Name — Cormorant Display 52pt, Ink
- Body — Lora 13pt, Ink
- Signature — bottom right, right-aligned

---

### Concept C — "The Page" *(Recommended)*

*Character:* Spare. Maximum whitespace. No border decoration — the page itself is the frame. One hairline rule (0.5pt, Stone) appears only once, horizontally, between the name and the share description. The Signal Studio wordmark sits at top center, very small, in DM Sans. Everything else is centered. Feels like an Apple product announcement crossed with a private banking correspondence slip. Passes the 20-year test without effort.

*Why recommended:* The restraint is the quality. There is nothing here that can date. No ornament to tire of. No border to look old-fashioned. The white space is generous because the content is important — it does not compete with itself. This also photographs and scans the cleanest, and prints beautifully on any premium paper.

*Risk:* Can feel underwhelming to recipients expecting a "classic" certificate aesthetic. Mitigated by paper quality and finishing — the stock does more work than the design.

**Layout:** See prototype.html in this folder.

---

## Print Specification

### Dimensions
- A4 portrait (210 × 297mm) — standard European frame size; fits Ikea Ribba, standard 8×12 frames
- Safe zone: 10mm inset from all edges
- Content area: 190 × 277mm

### Paper (Concept C)
Primary recommendation: **Conqueror Laid Natural, 300gsm**
- Subtle laid texture visible on the surface
- Warm off-white, very close to Ivory #F9F7F2
- Widely available in Ireland / UK
- Suitable for digital print (HP Indigo), litho, and laser

Alternative: **Fedrigoni Arcoprint Natural EW, 300gsm**
- Similar feel, slightly smoother surface
- More available for short print runs (1–10 copies)

Avoid: Gloss, silk, or bright white stocks — all wrong register for this experience.

### Printing
- **Preferred:** Digital litho or HP Indigo for short run
- Ink: black only (Ink #1C1917 ≈ rich black composed as C20 M15 Y10 K90 for depth)
- No CMYK colour on the certificate body — monochrome throughout
- Set as CMYK document, not RGB, before sending to print

### Finishing

**Blind emboss (strongly recommended):** The Signal Studio wordmark at top center is blind-embossed — no ink, no foil, just the tactile impression. This is what makes the certificate unmistakably premium without any visual noise. Cost: ~€8–15 per unit for short run.

**Foil (optional, with restraint):** If foil is added, restrict to a single platinum hairline rule (0.25pt) under the recipient name only. No gold. No holographic. Platinum foil only. Cost adds ~€12–20 per unit.

**No lamination.** Ever.

### Quantity
- 5 certificates (1 Mam + 4 friends)
- Print 3 extras of each as archive copies and for any reprints
- Total print run: 8 units, or 12–15 if ordering from a minimum-run supplier

### Envelope
- Ivory laid envelope, DL or C4 (A4 folded) or — preferred — A4 unfold, shipped flat inside rigid board mailer
- Certificate ships flat. Never folded. It arrives ready to frame.

---

## Framing Recommendation (to include in packaging insert)

A small card inside the package, separate from the handbook, suggests:

> "If you would like to frame this, a standard A4 frame works well. We recommend a simple white or natural wood frame with no mount. The paper and text are designed to sit directly behind the glass."

This removes friction from the desired outcome (framing it) without being prescriptive.

---

## Pre-print checklist

- [ ] Replace all name placeholders with full legal names (as they should appear on the certificate)
- [ ] Confirm percentage figures against executed shareholders' agreement
- [ ] Add company registration number once entity is formally registered
- [ ] Certificate number sequence confirmed: SS-FC-M, SS-FC-001, SS-FC-002, SS-FC-003, SS-FC-004
- [ ] Blind emboss die created for wordmark (minimum 2 weeks lead time at most Irish print suppliers)
- [ ] All copy reviewed by solicitor before final print
- [ ] Print deadline: approximately August 1 to allow delivery + packaging assembly

---

**Prototypes built:**
- `prototype.html` — Founding Member (Mam) variant, Concept C
- `prototype-friend.html` — Founder Circle Member variant, Concept C
- `certificate-preview.png` — Mam prototype screenshot
- `certificate-friend-preview.png` — Friend prototype screenshot

**One type note:** "Two and One-Half Percent" runs wider than "Ten Percent" at the display size. At 34pt in print this is fine — at screen zoom it approaches edges. Not a concern for print output; confirmed in prototype.

**Next refinement gate:** replace placeholder names with real names, review full legal wording with solicitor, submit die for blind emboss with ~2 weeks to spare before August 1 print deadline.
