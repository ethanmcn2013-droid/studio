---
id: supply-delight-reference-components
title: Supply one reference component per delight family, and settle the perpetual-mark question
status: open
priority: P1
blocking: true
phase: Experience · north star priority 1
why: The delight catalog has been frozen since 2026-07-28 waiting on references; experience is priority 1 and its only instrument is parked.
href: /hq/decisions/product-north-star
date: 2026-08-01
action: "Supply nine reference components — one per family — and answer F10 yes or no."
product: "Signal Studio (all four modules)"
recommended: "Start with F1 (menus and pickers, nine sites) and F2 (overlays, includes the command palette); they carry the most traffic."
alternatives: ["Accept the internal shipped reference where one exists (F3 from SG1, F4 from SG3, F8 from T11/T12, F9 from SG4) and supply references only for F1, F2, F5, F6, F7"]
default: "The catalog stays frozen and no micro-interaction work proceeds."
consequence: "Sixty catalogued sites stay instant. Every session that notices a delight opportunity appends to the catalog instead of building."
trigger: "Nine references supplied, or families explicitly assigned their internal reference."
links: ["https://github.com/ethanmcn2013-droid/app/blob/main/docs/DELIGHT_CATALOG.md", "../decisions/product-north-star.md"]
---

## Why this is here now

The rule codified 2026-06-23 says a founder-gated task never lives in a
buried doc. This one had — since 2026-07-28 it sat only inside the app repo's
`docs/DELIGHT_CATALOG.md`, invisible to `/hq`. The north star (2026-08-01)
made experience priority 1, which makes a frozen delight catalog the single
most expensive open item in the product.

## What changed on 2026-08-01

The catalog's grouping step is done. The 66 catalogued sites resolve to nine
families, one open question, three restrained-by-default entries, and six
already-shipped internal references. **The input needed is nine decisions,
not sixty.**

## Steps

1. For each family below, either supply a reference component or write
   "use the internal reference" against it.

   | Family | Sites | Internal reference available? |
   |---|---|---|
   | F1 · Menus and pickers | 9 | No — all nine appear instantly |
   | F2 · Overlays and dialogs | 3 | Partial — P10's 120ms fade |
   | F3 · Folds and reveals | 8 | Yes — SG1 Why-this fold |
   | F4 · Item arrival/departure | 5 | Partial — SG3 covers batch, not single |
   | F5 · Drag, insertion, drop settle | 6 | No — nothing shipped anywhere |
   | F6 · Confirmations | 9 | No |
   | F7 · In-place state change | 5 | Yes — card completion settle |
   | F8 · Content swap | 7 | Two, and they disagree — T11 vs T12 |
   | F9 · Hover / rest-state reveal | 4 | Yes — SG4, decided restrained |

2. Answer F10: **does the product get one perpetual mark, or none?** The
   product is named Signal; the hero pings every ~4s; today the only
   perpetual motion in the app is on the empty state — the screen whose
   message is that nothing happened. Yes means SG12 (the lead attention mark
   in the populated briefing) is the site. No means SG12 is recorded
   restrained and the ping stays marketing-only.

3. Resolve F8's internal disagreement: T11 crossfades, T12 slides
   directionally. One of them governs content swap; say which.

Implementation order is already fixed and needs no input:
F1 → F2 → F6 → F3 → F4 → F8 → F5 → F7.
