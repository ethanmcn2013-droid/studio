# Email design exploration · five theses, three directions

Date: 2026-07-16. This records the Best-of-N process behind the three
implemented email-system directions: the five initial theses, why two were
eliminated, and the critique-and-refinement pass every survivor received
before being presented. Nothing here overrides the founder's choice; the
scorecard and recommendation live in `comparison.md`.

All five theses share the suite constants and were judged inside them:
paper `#ffffff`, ink `#111111`, one indigo `#4f46e5`, Geist with email-safe
fallbacks, no gradients, no illustration system, single column, hidden
preheader, plain-text twin, one primary action.

## Round one · five theses

### 1 · Hairline

- Core idea: the email equivalent of a well-set bank letter. One rule, one
  column, one action.
- Emotional quality: quiet competence. Infrastructure that does not perform.
- Typography: small scale, h1 20px, body 15px, mono labels for every fact.
- Spacing and density: compact, 520px column, 28px sections.
- Container: none. Content sits directly on paper.
- Header: wordmark left, mono classification and date right, one hairline.
- CTA: compact solid indigo button, 6px radius, plus a raw-link fallback.
- Product imagery: rare, hairline-framed when present.
- Founder signature: one plain line.
- Utility behaviour: its native register.
- Editorial behaviour: possible but austere.
- Primary strength: unmatched trust register for security, billing, deletion.
- Primary risk: austerity reads as indifference in warm moments.

### 2 · Broadsheet

- Core idea: a front page, not a flyer. The Brief's newsprint register
  carried into the inbox.
- Emotional quality: considered, editorial, precise.
- Typography: display h1 31px with tight tracking, 17px lead, mono kickers.
- Spacing and density: generous, 600px column, 40px sections.
- Container: none, but a masthead: 2px ink rule with a thin companion,
  mirrored in the footer.
- CTA: solid ink button, sharp 2px radius. Indigo stays in rules and accents.
- Product imagery: stills treated as photographs with mono captions.
- Founder signature: an editorial byline in the mono register.
- Utility behaviour: strong, though the masthead spends more ink than a
  security email strictly needs.
- Editorial behaviour: its native register.
- Primary strength: the Dispatch and product announcements look owned, not
  templated.
- Primary risk: masthead furniture could read as ceremony on tiny messages.

### 3 · Letterhead

- Core idea: a letter on Signal Studio paper. The collateral letterhead,
  posted.
- Emotional quality: personal, warm without decoration.
- Typography: h1 22px, body 16px/26px, the most readable long-form measure.
- Spacing and density: airy sheet, 560px, 40px edge padding.
- Container: a white sheet with hairline border and 10px radius on a soft
  paper canvas; the postal line sits outside the sheet.
- Header: wordmark alone with a right-aligned date. No rule, air instead.
- CTA: indigo pill, or no button at all when the ask is a reply.
- Product imagery: enclosed like a photograph in an envelope.
- Founder signature: full letter closing, name, role, direct address.
- Utility behaviour: capable, the sheet gives destructive mail dignity.
- Editorial behaviour: reads as a founder note rather than a publication.
- Primary strength: venue and school outreach, where the email must feel
  written, not sent.
- Primary risk: warmth drifting into softness; the sheet must never gain
  ornament.

### 4 · Ledger (eliminated)

- Core idea: receipt-register mail. Mono-first, label-driven, every message
  a stack of exact rows, the entitlement ledger made visible.
- Emotional quality: systems honesty, terminal calm.
- Typography: Geist Mono dominant, sans only for prose.
- CTA: bordered mono button.
- Primary strength: billing and data-rights mail of absolute exactness.
- Primary risk: the register is engineering-native. The audience is the 80%
  who do not work in tech.

### 5 · Showroom (eliminated)

- Core idea: image-led product presence. Every message opens on a large
  product still; copy annotates the picture.
- Emotional quality: confident, demonstrative.
- Typography: minimal, captions under imagery.
- CTA: large indigo button under the hero image.
- Primary strength: guided-product mail where orientation is visual.
- Primary risk: campaign-like; collapses with images blocked; heavy for
  security mail; closest of the five to a generic SaaS template.

## Round-one scoring

Criteria weighted for the founder's four modes (utility, guided, founder,
editorial), brand distinctiveness, and survival under email-client
constraints. 5 is best.

| Thesis | Trust | Four-mode reach | Distinctiveness | Client robustness | Total /20 |
|---|---|---|---|---|---|
| Hairline | 5 | 4 | 4 | 5 | 18 |
| Broadsheet | 4 | 5 | 5 | 4 | 18 |
| Letterhead | 4 | 4 | 5 | 4 | 17 |
| Ledger | 5 | 2 | 4 | 5 | 16 |
| Showroom | 2 | 3 | 2 | 2 | 9 |

Eliminations. **Showroom** fails the audit directly: image-dependent
meaning breaks the images-blocked requirement, and its register is the
generic newsletter collection the brief forbids. **Ledger** scores well on
trust but cannot stretch: founder outreach and editorial mail in a mono
receipt register would fight BRAND.md §2 (plain English for the 80%), and
its strengths are already carried by Hairline's mono metadata rows.

The survivors map cleanly onto the three strategic poles: Hairline to
minimal operational trust, Broadsheet to editorial product precision,
Letterhead to human founder-led warmth.

## Round three · critique of the implemented directions

Renders reviewed at desktop and mobile widths, light and dark, images on
and off (`docs/email-system/renders/`).

### Hairline

- Excellent: the sign-in and deletion emails read like infrastructure from
  a company that respects the reader. KeyValueRows under mono labels is the
  strongest single pattern in the system.
- Generic risk: at utility scale it sits closest to a default; the wordmark
  and mono classification line are carrying the brand alone.
- Noise: none observed.
- Trust reduction: none observed.
- Hierarchy break: on the editorial prototype the 20px h1 undersells a
  principal story.
- Serves best: utility. Serves least: editorial.
- What would drop it below the bar: shipping it for the Dispatch unmodified.

### Broadsheet

- Excellent: the masthead pair of rules is ownable and survives every
  client; the Dispatch prototype looks like a publication on first sight.
- Generic risk: low; the ink CTA is unusual in inboxes and stays accessible.
- Noise: on the sign-in code, header and footer rules total four
  horizontal strokes around nine lines of content. Observed, judged
  acceptable: the rules are the identity. Decision recorded rather than
  softened.
- Hierarchy break: none observed after the lead/body split.
- Serves best: editorial and guided. Serves least: founder outreach, where
  a masthead reads institutional rather than personal.
- What would drop it below the bar: adding any second decorative element; the
  direction is already at its ink budget.

### Letterhead

- Excellent: the venue outreach reads as a written letter, the poster sits
  as an enclosure, the signature block with a direct address makes the
  one-action ask credible.
- Generic risk: the sheet-on-canvas construction is common in receipts;
  the postal line outside the sheet and the salutation register keep it
  distinct.
- Noise: none observed.
- Trust reduction: none; the sheet gives the deletion email unexpected
  dignity.
- Hierarchy break: none observed.
- Serves best: founder outreach. Serves least: high-volume utility, where
  the envelope ceremony is unearned.
- What would drop it below the bar: any ornament on the sheet, or a second
  button.

### Cross-direction findings fixed in the refinement pass

1. Canvas defect: with `color-scheme: light dark` declared, the `html`
   element behind the body painted dark in dark-preferring browsers,
   producing a stray dark band. Fixed: the html element now carries the
   direction canvas colour with an explicit dark override.
2. Destructive red `#b91c1c` fell below comfortable contrast on the dark
   surface. Fixed: `em-danger` class lightens it to `#f87171` in dark mode
   only.
3. The school poster and school outreach initially used an invented line;
   both now carry the film brief's exact primary line ("Plan the classes,
   not the pupils.") and the locked venue caption and CTA phrases from
   `docs/film-system/venues.md`.
4. The venue poster's hero task no longer renders struck-through; the
   completed state keeps the text legible with the ink dot and the indigo
   provenance rail carrying the state.
5. Dispatch and access-ready copy dropped a stale "from 1 September"
   waitlist date after re-verification against `contracts/commercial-terms.v1.json`
   (access state is waitlist_first with no public date).

Accepted and deliberately not changed: Hairline and Broadsheet converge on
small utility mail (the difference lives in the masthead, scale and CTA
ink); Broadsheet's four rules on tiny messages; Letterhead's sheet staying
paper-white in dark mode (the letter metaphor outranks the inbox theme,
and the canvas around it dims).
