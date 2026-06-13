---
title: Signal Studio — the umbrella
slug: signal-studio-umbrella
lens: Products
owner: Ethan
lastVerified: 2026-05-22
links: [five-products-as-a-system, pricing-and-entitlements, brand-enforcement, plan-cycle]
tags: [signalstudio.ie, BRAND.md, /brand, wordmark, umbrella, refusal list, four products]
references: [BRAND.md, src/app/brand/, src/app/pricing/, src/components/brand/wordmark.tsx, src/components/landing/]
summary: What the umbrella owns and what it refuses. Wordmark, /brand asset hub, unified /pricing, BRAND.md as source of truth. Strict four-product cardinality.
status: complete
pinned: false
execWhat: Signal Studio is the parent brand over four products — Tasks, Timeline, Signal, Notes. The umbrella owns the wordmark, the pricing page, the brand handbook, and the public brand asset library at signalstudio.ie/brand.
execMatters: The umbrella is what lets one operator credibly position a multi-product suite. Without it, the products would look like four unrelated apps. With it, paying customers see one company shipping a coordinated line of tools.
execRisk: The biggest risk is brand cardinality drift — adding a fifth product, or naming an internal tool as a "Signal X" sibling. Each addition dilutes the four-product story and makes the suite harder to explain in one sentence.
---

## WHAT

Signal Studio is the umbrella brand sitting above four shippable products. The umbrella owns the things that have to be consistent across the products and the things that don't naturally belong to any one of them — the wordmark and visual register, the unified pricing surface, the brand handbook, and the public asset library at `/brand`.

```mermaid
flowchart TB
  U[Signal Studio — umbrella]
  U --> B[BRAND.md]
  U --> P[/pricing]
  U --> A[/brand asset hub]
  U --> H[/hq + atlas]
  U --> T[Tasks]
  U --> R[Roadmap]
  U --> AN[Analytics]
  U --> N[Notes]
  T -.-> B
  R -.-> B
  AN -.-> B
  N -.-> B
```

The umbrella also owns the **refusal list**: features and surfaces the suite explicitly will not build. That list is brand work as much as product work — what a company refuses to do says more about it than what it builds.

## WHO

Ethan owns the umbrella outright. The studio repo (~/Projects/personal/studio) is the codebase. BRAND.md is the handbook. The umbrella has no separate employees, no separate board, no separate decisions — it's the same operator wearing a brand hat instead of a product hat.

## WHERE

- `signalstudio.ie` — the umbrella's public site. Hosts `/pricing`, `/brand`, `/about`, `/changelog`, `/press`, `/principles`, `/proof`, `/work`, `/weddings` (audience-specific landing), `/method`, `/security`, `/contact`.
- `signalstudio.ie/brand` — the public brand asset hub: wordmark anatomy, motion catalogue, palette, type scale, voice rules, 19 downloadable SVGs (house wordmark + four product wordmarks + lockups + square marks), plain-text email signatures.
- `signalstudio.ie/hq` — the private operating dashboard. Password-gated. The atlas you're reading lives here at `/hq/atlas`.
- `~/Projects/personal/studio/BRAND.md` — the handbook (see [[brand-enforcement]] for the catch-net details).
- `~/Projects/personal/studio/src/components/brand/wordmark.tsx` — the canonical `<Wordmark>` component with five variants and five gestures (signal broadcast 2.6s, tasks pulse 2.6s, timeline sweep 5.4s, signal tick 3.6s, notes caret 1.1s).
- `~/Projects/personal/studio/src/app/pricing/` — the unified pricing surface every product 308s to (see [[pricing-and-entitlements]]).

## HOW

The umbrella is mostly *editorial discipline*, not technical machinery. Three operating moves run constantly:

1. **Voice and visual rules sync into product repos via human discipline.** When a cycle in any product touches copy, the operator reads the relevant BRAND.md section before drafting. There is no linter, no shared NPM package. The handbook is the rule; the operator is the runtime (see [[brand-enforcement]]).
2. **Pricing changes happen in one place.** `/pricing` lives in the studio repo. Per-product `/pricing` paths 308 to the umbrella. A tier change is a studio-repo PR, not a five-repo coordination.
3. **Refusals get applied at decision-time, not after.** When a cycle proposes a refused feature ("let's add a team tier"; "let's allow comment threading"), the catch-net is to name the refusal and decide whether *this* cycle is the one that overturns it. Almost always: no.

### The refusal list (current as of 2026-05-16)

- **No fifth product.** Tasks, Timeline, Signal, Notes. Four. The temptation to scaffold a "Signal Chat" or "Signal Inbox" is the most common cardinality risk.
- **No team tier.** The suite is sold to individuals and small teams. Enterprise tier would require multi-seat billing, role-based access, audit logs — features that change the product shape, not just the pricing page.
- **No private workspaces in Timeline.** Timeline is public-facing by design. Adding private mode would gut the moat.
- **No comment threading.** Anywhere. Comments are a productivity-tool trap.
- **No public directory.** Of users, of workspaces, of templates. The suite refuses the "discover other users' content" surface.
- **No engineering-team-flavored language.** The audience is wedding planners, freelancers, tradespeople, students, marketing operators — not "engineering teams". Banned in copy (see [[brand-enforcement]]).

## WHEN — current state

- Suite design system v1 shipped 2026-05-13 across all four products.
- Unified pricing surface live with four tiers — Free (€0 forever), Student (€0, verified .edu), Workspace (€12/mo or €120/yr, recommended), Event (€79 one-time, 12 months) — plus the Venue Edition patronage band (€1,500–€4,000/year by venue size, first fifteen venues lock €1,500), ratified 2026-05-16.
- `/brand` asset hub public.
- BRAND.md stable at the location `studio/BRAND.md` since 2026-05-12.
- The wordmark "signal studio." (with the period) is locked. The collision risk with Signal Messenger means "Signal" alone is never used in body copy.
- The umbrella's locked H1 is **"Project management for the 80% not in tech."** — operator-ratified 2026-05-15, overriding the prior "Cut through the noise." The `80%` carries the indigo highlight. Product-specific H1s are unaffected.
- S·26 (2026-05-14) shipped a mobile UI/UX pass across the umbrella — overflow guard, nav collapse, H1 mobile leading, /redeem CTA, /pricing tier order, footer tap targets, /dispatch routing fix. All four umbrella surfaces (brand, pricing, landing, redeem) read on a phone now. No structural change to the umbrella itself (still four products, one wordmark, one indigo, one BRAND.md).

## WHY

A single-operator portfolio with five separately-named apps reads as five hobby projects. A single-operator portfolio with four apps + a clearly-articulated umbrella reads as a company. The difference is entirely brand work — same code, same operator, same products, different perception.

The four-product cardinality is deliberate. Three products is too few to look like a suite; six is too many to coordinate. Four is the sweet spot where the umbrella story is concrete ("Tasks, Timeline, Signal, Notes") and the operator can credibly ship updates across the line.

The refusal list is the umbrella's most strategic artifact. Every product wants to add features; the umbrella's job is to say no on behalf of the suite identity. Almost every refusal could be argued in the affirmative for an individual product — a team tier in Tasks alone would make sense — but adding it would change what the umbrella *is*. The refusals are the moat.

The public `/brand` hub is a quieter strategic move. It makes the brand *available* — to future hires, partners, journalists, anyone considering whether the suite is real. A locked-up internal brand book signals a small operation; a public asset hub signals confidence.

## Reverification trail

- 2026-05-16 (re-check vs S·43 /brand) — a parallel commit (`f3e784d`) tightened the `/brand` MOTIONS catalogue to canon and bumped a date in `src/app/brand/`. It did not change the umbrella structure, the 19-SVG asset set, the tier model, or the locked H1 — the four corrected facts below all still hold. No body change; entry is current.
- 2026-05-16 (atlas re-verify) — corrected four drifts against current code. (1) `references[]` pointed at a non-existent `src/components/wordmark/`; the component is `src/components/brand/wordmark.tsx`. (2) Wordmark gestures were listed as "broadcast, heartbeat, advance, tick, settle"; the component + globals.css + /brand encode broadcast/pulse/sweep/tick/caret. (3) Pricing was described as "five tiers (free / event / wedding / workspace / studio)"; the live surface is four tiers (Free / Student / Workspace €12-or-€120yr / Event €79) plus the Venue Edition €1,500–€4,000 patronage band. (4) The locked H1 was still "Cut through the noise."; BRAND.md and the rendered hero carry "Project management for the 80% not in tech." since the 2026-05-15 operator ratification. /brand SVG count corrected 18→19. Umbrella structure unchanged — still four products, one wordmark, one indigo, one BRAND.md, one refusal list.
- 2026-05-14 (S·32) — BRAND.md §6.5 update; the umbrella's `/dispatch` surface now reads from `content/dispatch/*.md` (operator-voice) instead of rendering the umbrella engineering log directly. Umbrella structure unchanged — still four products, one indigo, one shared wordmark grammar, one refusal list. The dispatch convention itself is now a structurally-separated artifact, which strengthens (rather than changes) the umbrella's brand-coherence story.
- 2026-05-14 (c044f50) — BRAND.md §6.5 cycle-code preflight rule landed for parallel-session collision catching. Umbrella structure unaffected.
