# Signal Studio Founder Circle — Brand System
## Phase 0 · Design System Lock
*Version 1.0 — 2026-05-30*

---

## 1. Emotional North Star

> **"You mattered before this existed."**

Every artifact is checked against this sentence. If a design decision, a word choice, a typographic decision, or a structural choice moves away from that feeling — iterate. The experience should not feel like a reward. It should feel like a recognition.

---

## 2. Naming Decisions

**Programme name:** Signal Studio Founder Circle

**Mam's designation:** Founding Member — singular, unnumbered. Her certificate carries no sequence number. The designation alone is the distinction.

**Friends' designation:** Founder Circle Member

**Certificate reference system:**
- Mam: no sequence number on certificate face; registry records her as `SS-FC-M`
- Friends: `SS-FC-001` through `SS-FC-004`

**Note:** "Founder Circle" is kept. "Circle" carries quiet warmth without implying community infrastructure. It implies chosen proximity. That is the right register.

---

## 3. Ownership Structure Reference

| Name               | Class     | Designation        | Share %  | Certificate Ref |
|--------------------|-----------|--------------------|----------|-----------------|
| Ethan McNamara     | A (Founder) | Founder            | 90%      | —               |
| [Mam]              | B          | Founding Member    | 10%      | SS-FC-M         |

*Current structure (2026-06-01): Founder Circle is a single member — Mam at 10%. The four-friend grants (SS-FC-001…004, 2.5% each) are **parked, not cancelled** — Ethan may revisit. If admitted later, Mam's 10% is restored at nil cost (agreement clause 8) and the dilution is borne by the Founder's Class A. The SS-FC-001…004 series and the friend letter/certificate drafts remain in the repo as parked assets.*

**Class B rights include:** dividend participation, enterprise value participation, acquisition/sale participation, quarterly founder updates, annual reflection.

**Class B rights exclude:** operational control, management authority, veto rights, board authority, strategic decision-making.

*Framing:* "You share in the upside while allowing Signal Studio to remain founder-led."

---

## 4. Typographic System

### Philosophy
One serif family does almost all the work. The sans exists only for functional text and metadata. The mono exists only for numbers and codes. This is not a system trying to impress — it is a system trying to last.

### Type Stack

**Display / Hero: Cormorant Display**
- Source: Google Fonts (print-safe, embeddable)
- Character: high-contrast, old-style, reminiscent of engraved stationery
- Usage: certificate title, letter salutations, large numeral moments, handbook chapter headings
- Weights used: Regular (300), Semibold (600)
- Never use in body copy — too light below 18pt

**Body / Narrative: Lora**
- Source: Google Fonts (print-safe, embeddable)
- Character: contemporary humanist serif, warm, readable at small sizes
- Usage: letter body, handbook body text, handbook captions, certificate body description
- Weights used: Regular (400), Medium (500)
- Minimum size: 10pt print / 15px screen

**Functional / UI: DM Sans**
- Source: Google Fonts (web-safe)
- Character: clean, neutral, geometric — does not compete with the serif
- Usage: metadata, portal UI labels, dates, footnotes, share percentages, envelope addressing
- Weights used: Regular (400), Medium (500)
- Track +0.04em at sizes below 12pt

**Numerical: DM Mono**
- Source: Google Fonts
- Character: clean monospaced, technical precision
- Usage: certificate numbers (SS-FC-001), share percentages (2.5%), year designations, registry table
- Weight: Regular only

### Print Sizing Scale

| Element                        | Face               | Size  | Weight    | Leading |
|--------------------------------|--------------------|-------|-----------|---------|
| Certificate title              | Cormorant Display  | 28pt  | Semibold  | 34pt    |
| Certificate recipient name     | Cormorant Display  | 22pt  | Regular   | 28pt    |
| Certificate body               | Lora               | 13pt  | Regular   | 20pt    |
| Certificate number/metadata    | DM Mono            | 9pt   | Regular   | 14pt    |
| Letter salutation              | Cormorant Display  | 20pt  | Regular   | 26pt    |
| Letter body                    | Lora               | 11.5pt| Regular   | 18pt    |
| Letter date/metadata           | DM Sans            | 9pt   | Regular   | —       |
| Handbook chapter heading       | Cormorant Display  | 24pt  | Semibold  | 30pt    |
| Handbook subheading            | DM Sans            | 12pt  | Medium    | 18pt    |
| Handbook body                  | Lora               | 11pt  | Regular   | 17pt    |
| Handbook caption               | DM Sans            | 9pt   | Regular   | 13pt    |
| Packaging label                | Cormorant Display  | 14pt  | Regular   | —       |

### Screen (Portal) Sizing Scale

| Element                  | Face              | Size  | Weight |
|--------------------------|-------------------|-------|--------|
| Page heading             | Cormorant Display | 48px  | Regular|
| Section heading          | Cormorant Display | 28px  | Regular|
| Body text                | Lora              | 17px  | Regular|
| Label / metadata         | DM Sans           | 13px  | Medium |
| Number / code            | DM Mono           | 14px  | Regular|

---

## 5. Color System

### Philosophy
No color performs. Everything is pulled from the same warm neutral family. The only moment of unexpected color is a faint presence of Signal Studio indigo — used once, in a very small detail, only on the certificate. It ties this to the parent brand without announcing it.

### Tokens

| Token      | Hex       | Print CMYK (approx)       | Usage                                              |
|------------|-----------|---------------------------|----------------------------------------------------|
| Ivory      | `#F9F7F2` | C0 M0 Y3 K2               | Primary background, certificate base, page white   |
| Parchment  | `#EDE8DC` | C0 M2 Y8 K7               | Section breaks, envelope interior, document borders|
| Stone      | `#C4BBB0` | C0 M4 Y9 K23              | Dividers, ornamental rules, table borders          |
| Graphite   | `#5A5450` | C0 M5 Y8 K65              | Secondary text, captions, metadata                 |
| Ink        | `#1C1917` | C0 M0 Y0 K90              | Primary text, names, headings                      |
| Platinum   | `#9A9590` | C0 M3 Y5 K42              | Metallic-adjacent details, monogram outlines       |
| Seal       | `#2C2A26` | C0 M2 Y6 K83              | Deep near-black, embossed simulation, wax seal ref |
| Whisper    | `#E8E7F4` | C2 M2 Y0 K3               | Single-use: one faint Signal Studio reference only |

### Application Rules

- **Certificate:** Ivory background, Ink text, Stone rules, Seal for certificate border, Platinum for ornamental detail, one Whisper element (e.g. a hairline rule at the base)
- **Letter:** Ivory paper, Ink text, no ornament — whitespace alone signals quality
- **Handbook:** Ivory pages, Ink body, Stone page rules, Parchment section covers
- **Portal:** Ivory background, Ink text, Stone borders, Graphite metadata, Whisper hover states
- **Packaging:** Ivory board, Seal debossed wordmark, Stone interior tissue, no printing on primary box face

### Prohibited color combinations
- No warm red, no warm orange — too celebratory, wrong register
- No black (#000000) — use Ink; pure black is harsh on this system
- No white (#FFFFFF) — use Ivory; pure white is clinical
- No Signal Studio indigo (#4f46e5) directly — only Whisper, only once, only on certificate

---

## 6. Voice Guidelines

### 5 Defining Words

1. **Quiet** — the experience does not announce itself. No superlatives. No drumrolls.
2. **True** — every statement is unambiguously meant. Nothing performative, nothing diplomatic.
3. **Warm** — genuine human feeling, not corporate warmth. This is a person writing, not an organisation.
4. **Still** — unhurried. No urgency, no pressure, no forward-lean. The pace of something permanent.
5. **Lasting** — written to be read in 20 years. Nothing that dates. Nothing trend-adjacent.

### 5 Banned Phrases

1. **"Excited" / "exciting"** — hollow; every startup uses it; means nothing
2. **"Journey"** — cliché without exception
3. **"Opportunity"** — transactional; the opposite of the intended register
4. **"Stakeholder"** — corporate distance; these are people, not stakeholders
5. **"Proud to announce"** — press release energy; this is a private letter, not a press release

### Extended Ban List
*If any of these appear in any artifact, remove without discussion:*

honored, thrilled, impactful, synergy, leverage, ecosystem, scale, hustle, incredible, amazing, milestone, robust, seamless, innovative, disruptive, game-changing, empowering, transparent (as a value, not a description), aligned, narrative (as corporate-speak)

### Sentence-level principles

- Short sentences earn more weight than long ones. Use them for the most important statements.
- A paragraph that ends too early is better than one that continues past the point.
- No sentence should need a comma to function.
- If a phrase sounds like it belongs in a pitch deck, cut it.
- Names are used exactly once per section — no more.

### Tone for each letter variant

**For Mam:**
Slower. More personal. The gratitude is deeper and should not be dressed up. Direct acknowledgment of what was given (trust, patience, presence) without elaborating too much. One sentence that no professional relationship could produce.

**For friends:**
Warmer than professional, quieter than intimate. The register of a founder writing privately to someone they genuinely respect. No performance of gratitude — just the actual thing.

---

## 7. Structural Notes

### Print specification direction

- **Certificate:** 300gsm minimum, soft-textured cotton or laid finish (Conqueror Laid, Fedrigoni Arcoprint, or equivalent). Portrait A4 or A3 fold-out.
- **Letter:** 120gsm premium white laid (Conqueror Laid Oyster, James McNaughton, or equivalent)
- **Handbook:** 150gsm uncoated interior, 300gsm cover, perfect or saddle-stitch binding (decide at handbook stage)
- **Envelope:** Ivory or stone kraft, printed return address only — no branding on exterior
- **Box:** Rigid board, grey interior, no exterior printing except one debossed wordmark on lid

### Finishing direction

- **Embossing:** wordmark only on certificate and box lid — blind emboss, no foil
- **Foil:** not recommended — too flashy for this register; if used, restricted to platinum foil hairline rule on certificate only
- **Wax seal:** a closing wax seal on the outer envelope is considered — deep graphite wax, no monogram, just a plain round seal

### September 1 milestone

Physical items must be at printer no later than August 1 to allow for:
- 2-week print run
- Delivery window
- Packaging assembly

Portal must be live and password-set before physical packages arrive.

---

## 8. Legal Note (to resolve before project completion)

*These documents are prepared in advance of formal legal constitution.*

The shareholders' agreement — the actual legal instrument constituting Class A and Class B share ownership — must be drafted by a qualified solicitor and executed before September 1. The physical artifacts (certificates, letters, handbook) express that agreement; they do not constitute it.

**Action required before project completion:** engage a solicitor to draft a shareholders' agreement for Signal Studio (or the entity that will formally hold the business). Certificate language should be reviewed against the executed agreement before final print.

**This is a hard gate before the September 1 send.**

---

*Phase 0 complete. Everything inherits from this document.*
*Next: Phase 1 — Founder Letter System*
