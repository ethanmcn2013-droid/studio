# Signal Studio Atlas — Research & UX Discovery

_Phase 0 deliverable. Author: engineering. Status: complete for v1._

> Note on sourcing. This pass was done without live web access. The references
> below are drawn from well-known, first-hand experience of these products and
> their published design languages. Where a claim is a general principle rather
> than a citable fact, it is stated as a principle. Nothing here invents Signal
> Studio business facts — those come from the repo's own `content/hq/**` source
> of truth (see `information-architecture.md`).

---

## 0. What the Atlas is (and is not)

The Atlas is a **living operating map of Signal Studio**: one calm surface that
shows how the company thinks, builds, ships, and operates — across seven lenses
(Founder, Product, Design, Engineering, AI, Launch, Investor).

It is **not** a dashboard, a sitemap, an org chart, or a documentation page. It
is the front door to the operating system, and it reads from the same source of
truth the rest of HQ reads from (`content/hq/**`), so it is always true.

Signal Studio's thesis — _simple by design, serious underneath_ — must be
legible in the first three seconds and hold up under real use.

---

## 1. Inspiration audit

Patterns worth stealing, and the specific thing to take from each.

| Reference | What to take | What to avoid |
|---|---|---|
| **Apple HIG** | Clarity, deference, depth. Content is the interface; chrome recedes. Progressive disclosure done without hiding. | Over-explaining; heavy skeuomorphism. |
| **Apple system diagrams / Maps** | Spatial memory — objects live in stable places you return to. Zoom as a first-class idea. | Literal cartography gimmicks. |
| **Stripe docs** | Information density that stays calm. One accent. Right-rail context that never blocks the main read. Trust through specificity. | Nothing — Stripe is the density benchmark. |
| **Linear** | Restraint, speed, keyboard-first, opinionated defaults, a single confident accent. Motion that is fast and meaningful. | Copying its exact palette/feel; it is recognizably Linear. |
| **Vercel dashboard/docs** | Status as a calm, glanceable signal (dots, not sirens). Monospace for machine facts. | Dark-mode-only assumption; log-soup density. |
| **Figma / FigJam** | Spatial canvas, focus on selection, connective lines with meaning. Zoom-to-fit. | Infinite-canvas chaos, sticky-note soup, cursor theatre. |
| **Notion** | IA as a graph of typed objects; every object opens to a consistent detail view. | Everything-is-a-page flatness; slow. |
| **High-end architecture diagrams** | Hierarchy, legible flow, "impressive at a glance _and_ useful on inspection." | Consulting-deck clutter; logo soup; rainbow arrows. |
| **Command palettes (Linear/Raycast/GitHub)** | One keystroke to anywhere. Search _objects_, not just pages. | Palette that only navigates and can't find things. |
| **Executive dashboards / board packs** | A single verdict line; a small number of numbers that matter; "as-of" dating. | KPI walls; vanity metrics; fake precision. |
| **Investor data rooms** | Confidence through order and evidence, not adjectives. Print-friendly. Everything has a source. | Hype; unverifiable claims; motion. |

**Synthesis.** The Atlas should feel like _Stripe's calm density × Linear's
restraint × Figma's spatial memory × Apple's deference_, expressed entirely in
Signal Studio's existing design system (one indigo, ink-on-paper, hairlines,
Geist). It should be impressive at a glance and _more_ impressive on inspection —
the opposite of a consulting diagram.

---

## 2. UX principles for the Atlas

1. **Progressive disclosure.** The overview answers "what is Signal Studio and
   is it healthy?" One click answers "what about _this_ domain?" No wall of text.
2. **Spatial memory.** Domains live in fixed positions in the orbit. You learn
   where "Launch" is and return to it. Layout does not reflow on lens change.
3. **Information scent.** Health dots, readiness bars, and counts on each node
   tell you where to look before you click.
4. **Wayfinding.** Always-visible lens, a one-line "you are here" summary, and a
   detail panel that never fully hides the map.
5. **Minimal cognitive load.** One accent. One typeface family. Four health
   states. Numbers only where they are real.
6. **Focus mode.** Selecting an object dims the unrelated and lights the
   connected. Attention is a design material.
7. **Calm motion.** 140–220ms ease-out transitions on opacity/transform only.
   No bounce, no loop, no parallax. Fully removed under `prefers-reduced-motion`.
8. **Trust through specificity.** "Launch readiness 42, as of 2026-07-08,
   weighted across 14 gates" beats "on track." Every number links to its source.
9. **Utility over decoration.** If an element does not help someone decide or
   navigate, it is cut.
10. **Beautiful defaults.** The default view (Founder lens, nothing selected) is
    already presentable to an investor.
11. **Every view answers one question. Every object has identity. Every
    connection has a reason.** (Enforced in the data model — untyped connections
    are not allowed.)

---

## 3. Anti-patterns (explicitly avoided)

- Logo soup and icon overload.
- Busy consulting org charts that impress at a glance and fail on use.
- Decorative animation, parallax, neon "AI" aesthetics, childish gradients.
- Fake complexity and invented metrics that _look_ real.
- Unreadable micro-type; low-contrast grey-on-grey.
- Generic SaaS admin-template energy.
- "AI theatre" — claiming automation that is not real.
- More than one accent color; more than four status states.
- Static diagrams with no drill-down and no source of truth.

---

## 4. Target audiences — what each needs

| Audience | Primary question | What the Atlas gives them |
|---|---|---|
| **Founder (Ethan)** | "What needs my attention?" | Founder lens + Mission Control: readiness, critical risks, open decisions, blocking operator to-dos, what's ready / not. |
| **Investor** | "Is this a serious, well-run company?" | Investor lens + Snapshot: maturity, launch readiness, discipline evidence, visible risk management, roadmap. Print-friendly. |
| **Loan officer** | "Is this a real business that can execute and repay?" | Same Investor snapshot, framed around discipline, order, and documented decisions. |
| **Future hire** | "How do these people think? Is it well-built?" | Design + Engineering lenses: principles, systems, the fact that everything is written down. |
| **Developer** | "How is this built and where do I extend it?" | Engineering lens → links into `/hq/atlas` systems registry, code references, CI gates. |
| **Designer** | "Is the craft real?" | Design lens: principles, tokens, motion vocabulary, restraint on display. |
| **Operator** | "What's blocked and who owns it?" | Operations lens: operator to-do ledger, decisions, review cadence. |
| **Strategic partner** | "What is this suite and how do the pieces connect?" | Product lens: the four products as one system, ecosystem flows. |

---

## 5. Jobs to be Done

- "Show me how Signal Studio works." → Founder lens overview.
- "Show me why this simple product is technically serious." → Engineering + AI.
- "Show me what is ready for launch." → Launch lens + readiness composite.
- "Show me the current risks." → Founder/Operations lens, critical risks.
- "Show me who/what owns this system." → detail panel `owner` + Operations.
- "Show me how AI is used responsibly." → AI lens: governance, human-in-loop,
  spend caps, the standing AI directors org.
- "Show me the product architecture." → Product lens → ecosystem flows.
- "Show me the design philosophy." → Design lens → principles → `/design`.
- "Show me the roadmap." → Launch lens → milestones + launch date countdown.

---

## 6. Final UX direction (recommendation for v1)

Build a **single gated route** (`/hq/atlas-map`, inside HQ so it can safely read
real operating data) that presents:

1. **A calm spatial canvas** — a central "Signal Studio" node with eight domain
   nodes in a stable octagonal orbit, connected by hairline lines whose meaning
   is typed. Health and readiness are shown as small dots and hairline bars.
2. **A lens switcher** (segmented control, 7 lenses) that changes _emphasis and
   copy_, never layout. One accent throughout; lenses shift language, not color.
3. **A Founder Mission Control strip** bound to **real** numbers computed from
   `content/hq/**`: launch-readiness composite, product maturity, critical
   risks, open decisions, blocking operator to-dos, "as-of" date.
4. **A focus mode + detail panel** — selecting a node dims the rest, lights its
   connections, and opens a right-side panel with purpose, why-it-exists, status,
   owner, dependencies, real risks/metrics, next actions, and links _out_ to the
   real HQ rooms and the systems registry (`/hq/atlas/[slug]`).
5. **An Investor Snapshot** — a polished, print-friendly section that states the
   thesis and backs it with the same real figures and the discipline evidence.
6. **Object search** (`/` to open) over every node and lens — the command-palette
   pattern, scoped to Atlas objects. (Global `⌘K` stays HQ's nav palette to avoid
   a double-bind; the Atlas is added to it.)

**Graph technology:** hand-built **SVG connection layer + absolutely-positioned
HTML nodes**. No React Flow, no D3 — the repo already proves this pattern
(`hq/blueprint-canvas.tsx`) and it keeps the bundle tiny, the a11y semantics real
(nodes are `<button>`s), and the motion under our control. See `technical-plan.md`
for the rejected alternatives and why.

The bar: the default state, untouched, should be something we would confidently
put on screen in front of a loan officer.
