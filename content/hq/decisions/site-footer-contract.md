---
id: site-footer-contract
title: Every public page ends on one footer contract with product-specific content slots.
category: Brand
date: 2026-07-03
status: Active
reviewDate: 2026-09-01
relatedObjects: [studio/DESIGN.md, content/hq/decisions/product-header-contract.md, studio/src/components/landing/site-footer.tsx]
---

## Decision

Public marketing pages across Signal Studio end on a uniform footer contract.
The shell is shared: `mt-32`, top hairline (`border-hairline-soft` — the SDS
token, not its deprecated aliases), `pt-16 pb-10`, centered 1240px grid with
24px gutters, a `1.35fr + 4×1fr` column layout at `lg`.

The five columns are fixed in kind: brand block (wordmark, one-line product
promise, "Made by Signal Studio", social links), then Product, Company,
Resources, and Suite link columns. Below: a divider on the same hairline, a
copyright row with the product sign-off line, and the legal row — mono, 12px,
uppercase, `tracking-[0.08em]`, `text-ink-quiet`.

Products may customize the content of each slot — their own promise line,
their own Product/Resources links, their own sign-off. They may not change the
shell geometry, the column kinds, the hairline token, or the legal-row
register.

Notes keeps its controlled material exception, same as the header: its warmer
notebook palette may skin the footer's colours, but the geometry follows the
shared shell.

Low-chrome public content surfaces (e.g. Tasks' published read-only views) may
use a reduced footer as an explicit surface-level exception, not as precedent.

## Reason

The header contract already established the rule: the operating chrome holds
still while the product changes. A footer is the last thing a visitor sees on
every page; five footers that are almost-but-not-quite identical read as
carelessness precisely where care is cheapest to show.

Before this decision the five implementations had drifted to three different
border tokens (two of them deprecated aliases of the same value), two spacing
scales, and two legal-row registers — invisible one page at a time, obvious
the moment you move between products.

## Implementation Rule

Canonical reference: `studio/src/components/landing/site-footer.tsx`. Each
repo's `site-footer.tsx` mirrors it with product-specific slot content. The
suite-chrome contract check asserts the shell markers (hairline token, `mt-32`,
1240px grid, legal-row register) in every repo; drift fails CI.
