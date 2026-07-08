# Signal Studio Atlas — Product Requirements

_Phase 0 deliverable. Scope: v1 (Phase 1 build). Status: approved to build._

---

## Purpose

Give Signal Studio one calm, navigable, always-true surface that shows how the
company thinks, builds, ships, and operates. It must make a serious viewer
conclude — in seconds, then confirm on inspection — that the product is simple
by design and the operating system behind it is mature and disciplined.

It must also be genuinely useful to the founder day-to-day: what needs
attention, what's blocked, what's ready.

## Audience

Founder (primary), investor, loan officer, future hire, developer, designer,
operator, strategic partner. See `research.md` §4 for each audience's job.

## Core user journeys

1. **Founder morning check.** Open `/hq/atlas-map` → Founder lens (default) →
   read Mission Control (readiness, critical risks, open decisions, blocking
   operator to-dos) → click the domain with the worst signal → read next actions
   → jump into the real HQ room to act.
2. **Investor walk-through.** Switch to Investor lens → read the Snapshot thesis
   backed by real maturity/readiness figures → open Product and Engineering nodes
   to show depth → (optionally) print the Snapshot.
3. **New hire orientation.** Product lens → see the four products as one system →
   Design lens → see principles and restraint → Engineering lens → drill into the
   systems registry.
4. **Operator triage.** Operations lens → operator to-do ledger and open
   decisions → open the blocking item → act.
5. **Find anything.** Press `/` → type "onboarding" / "launch" / "AI" → jump to
   the object or lens.

## Functional requirements

**FR-1 Overview canvas.** A central Signal Studio node with eight domain nodes
(Product, Design, Engineering, AI, Launch, Operations, Metrics, Business) in a
stable orbit, connected by typed hairline lines. Title, positioning line, and a
one-line "as-of" summary present.

**FR-2 Lens switcher.** Seven lenses (Founder, Product, Design, Engineering, AI,
Launch, Investor). Switching updates: emphasized nodes, summary copy, Mission
Control framing, and detail-panel language priority. Layout does not move.
Keyboard-selectable; number keys `1`–`7` as accelerators.

**FR-3 Focus mode + detail panel.** Selecting a node (click, Enter, or via
search) dims unrelated nodes, highlights connected nodes and their edges, and
opens a right-side detail panel. Panel shows: name, type, summary, purpose,
why-it-exists, status, owner, health, maturity, launch readiness, dependencies,
connected objects, risks, metrics, documents, last reviewed, next actions,
evidence. Esc / close button / clicking empty canvas dismisses.

**FR-4 Mission Control strip.** A calm executive strip bound to real data:
launch-readiness composite (0–100, weighted), product maturity (avg), design/eng
posture, AI governance posture, critical-risk count, open-decision count,
blocking operator-to-do count, and an "as-of" date. No vanity metrics.

**FR-5 Investor Snapshot.** A polished section stating the thesis ("simple by
design, serious underneath") backed by the same real figures plus discipline
evidence (decisions written down, risks visible, systems registered). Toggle to
expand; print-friendly styling.

**FR-6 Object search.** `/` opens a search overlay over all nodes and lenses with
fuzzy matching; Enter focuses the object or switches lens; Esc closes.

**FR-7 Real-data binding.** All numbers and lists come from `content/hq/**` via
existing loaders (`readHqSection`, `getOperatorTodos`) — never hardcoded. Where a
value is genuinely unknown, render an honest placeholder ("not scored",
"needs review"), never a fabricated number.

**FR-8 Links out.** Detail panels link into the real HQ rooms (`/hq/reporting`,
`/hq/crm`, `/hq/org`, …) and, for Engineering, into the systems registry
(`/hq/atlas`, `/hq/atlas/[slug]`). The Atlas is the front door; the registry is
the artifact layer.

## Non-functional requirements

- **NFR-1 Performance.** Server-render the data; ship a small client island.
  No large graph libraries. Target: no layout jank, interactions < 1 frame of
  perceived delay, JS added by this feature kept minimal (hand-built SVG/CSS).
- **NFR-2 Zero new runtime dependencies.** Build on the existing stack (Next 16,
  React 19, Tailwind v4, the vendored design tokens). No React Flow / D3 / Framer.
- **NFR-3 Conventions.** Kebab-case files, PascalCase exports, `@/` imports,
  `export const dynamic = "force-dynamic"`, HQ auth gate, HqShell layout.
- **NFR-4 No console errors/warnings. No dead code. Passes typecheck + build.**

## Accessibility requirements

- Nodes are real `<button>`s in a labelled group; full keyboard operation
  (Tab/arrows to move, Enter to focus, Esc to dismiss).
- Visible focus rings using the design system's focus treatment.
- Lens switcher is a proper radio/segmented control with `aria-pressed`.
- Detail panel is a labelled complementary region; focus moves to it on open and
  returns on close; Esc closes.
- Health is never color-only — every dot has a text label / `aria-label`.
- Contrast meets WCAG AA against paper.
- Full `prefers-reduced-motion` path: no transitions, instant state changes.

## Performance requirements

- The client bundle for this route is dominated by our own small components.
- SVG connection layer is static geometry; only opacity/class changes on
  interaction (no per-frame JS animation).
- Responsive: spatial orbit ≥ 860px; single-column node flow below (no canvas
  math on small screens).

## Data model

See `information-architecture.md` for object types and the TypeScript contract
(`src/features/atlas/types.ts`). Summary: `AtlasObject` (company | domain | …) +
typed `AtlasConnection`s, a curated static graph enriched at render with a live
`AtlasSnapshot` computed from `content/hq/**`.

## Visual design principles

See `design-direction.md`. Summary: one indigo accent, ink-on-paper, hairlines
over shadows, Geist sans/mono, generous whitespace, four health states, calm
140–220ms motion, reduced-motion-safe.

## Interaction model

See `research.md` §6 and `design-direction.md`. Zoom levels are represented
_conceptually_ in v1 (overview → domain detail → links to artifacts); true
infinite-canvas zoom is deferred but the data model supports it.

## Phase plan

- **Phase 0 (this):** research, PRD, IA, technical plan, design direction, data
  model. _(done)_
- **Phase 1:** the polished static-but-live prototype — canvas, 7 lenses, focus
  mode, detail panel, Mission Control, Investor Snapshot, object search, real
  data binding, a11y, responsive, reduced-motion. _(this build)_
- **Phase 2:** richer navigation — breadcrumbs, mini-map, smooth camera focus,
  object history/timeline, dependency + readiness overlays, deeper lenses.
- **Phase 3:** operational depth — per-object health scoring, launch-checklist
  data, AI-workflow registry, decision log surfaced inline, GitHub/issue links.
- **Phase 4:** executive mode — boardroom presentation view, exportable PDF,
  readiness scorecards, risk register, roadmap visualization.
- **Phase 5:** living OS — change history, review cadence, weekly founder brief,
  alerts, AI-assisted summaries.

## Risks

- **R1 Data drift.** If `content/hq/**` shapes change, bindings could break →
  mitigate with defensive coercion + honest fallbacks, never throw on missing.
- **R2 Naming collision** with existing `/hq/atlas` systems registry → mitigated
  by a distinct route and by framing the registry as the Atlas's artifact layer.
- **R3 Over-build.** Spatial canvas can rabbit-hole → v1 uses fixed positions and
  CSS, not a physics/layout engine.
- **R4 Fake-precision temptation.** → hard rule: unknown ⇒ placeholder, not a
  number. Every number carries its source.

## Open questions (for the founder)

- Q1 Design/Engineering maturity are not currently scored numerically in
  `content/hq/**`. v1 shows them qualitatively. Do you want numeric scores added
  to the source files (they'd then appear automatically)?
- Q2 Should the Investor Snapshot ever be exposed on a **separately-gated public**
  link for diligence, or stay strictly inside HQ? (v1: strictly inside HQ.)
- Q3 Owners: most objects list "Ethan" or a placeholder. Confirm the ownership
  model as the AI directors org matures.

## Acceptance criteria

- [ ] `/hq/atlas-map` renders behind the HQ auth gate, inside HqShell.
- [ ] Central node + 8 domain nodes + typed connections render on a calm canvas.
- [ ] All 7 lenses switch emphasis + copy without moving layout.
- [ ] Selecting any node opens a detail panel with real, sourced content.
- [ ] Mission Control shows real launch readiness, maturity, risk, decision, and
      operator-to-do figures computed from `content/hq/**`, with an as-of date.
- [ ] Investor Snapshot reads well and prints cleanly.
- [ ] `/` search finds and jumps to any node or lens.
- [ ] Full keyboard operation; visible focus; reduced-motion path; AA contrast.
- [ ] Responsive from mobile to wide desktop.
- [ ] `pnpm typecheck` and `pnpm build` pass; no console errors; no fake numbers.
