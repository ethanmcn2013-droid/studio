# Signal Studio AI Org Chart — spec

_The AI-lens of the Atlas made real: an interactive chart of the standing AI
leadership org (the 17 Directors/Advisors) that runs Signal Studio. Lives at
`/hq/org`, elevating the existing cluster-band list. Inspired by AI-agent org
charts (e.g. the "Founders Table" board) but executed in the Signal Studio
design language: calm, one indigo, hairlines, real data, no theatre._

## Why this is credible, not a gimmick
The org already exists and is governed. `signal-directors/config/advisors.yaml`
defines 17 Directors, each personified after a figure whose sensibility they
embody (Jobs, Ive, Rams, Turing, Cook, Buffett, Cuban, Specter, Hormozi, Sagan,
da Vinci, Caravaggio, Dalí, Einstein, Jensen, Pixar), with real autonomy layers,
veto authority, portfolios, cadences, Slack channels, charters, and 8 founder
approval gates. Studio mirrors this in `src/lib/hq/elt.ts`. We visualize what is
real. It doubles as proof for an investor that a simple product is run by a
serious, documented system.

## Decisions (locked 2026-07-08)
- **Placement:** elevate `/hq/org` — new chart is the default; the current
  cluster-band list stays at `?view=list`; `/hq/org/[slug]` detail kept.
- **V1 scope:** hierarchy + focus + detail panel + legend + org-breakdown stats.
- **Avatars:** persona monogram in v1; bespoke symbolic SVG glyphs (per
  `signal-directors/slack/avatar-direction.md`: keystone = Engineering, balance
  beam = Finance, horizon+waypoint = Strategy…) in Phase 2.
- **Labels:** role-forward (function prominent), persona beneath.

## Data
Source: `src/lib/hq/elt.ts` (`DIRECTORS`, `CLUSTERS`, `ELT_SNAPSHOT`), a mirror
of `advisors.yaml`. Client-safe plain data — imported directly by the chart. No
fabricated fields. Phase 4 adds a build-time `advisors.yaml → elt.ts` sync to
kill the manual-mirror drift (snapshot is currently 2026-06-07).

Node model (v1): Founder (apex) → 4 director clusters (Strategy & Voice, Product
Excellence Council, Build & Ship, Growth & Commercial) → 17 advisor cards. Edges:
ownership (founder → cluster → advisor). Coordination / "information-sharing"
cross-edges are Phase 2 (from charter coordination maps).

## Layout
Columnar tree, calm hairline connectors (no boxes-and-lines soup):
- Founder banner (apex) centered, with a hairline spine to a horizontal rail.
- Rail branches to 4 cluster columns (CSS grid; wraps 4 → 2 → 1 responsively).
- Each column: cluster header + advisor cards stacked under a left hairline
  reporting bracket.
- Advisor card: monogram avatar, role (prominent), persona + cadence beneath,
  autonomy badge (L2 recommend / L3 decide-then-log), veto marker, product tag.

## Interaction
- **Focus:** select a card → detail panel (reuses `.atlas-panel`); focused card
  gets the accent ring, cluster peers highlight, the rest dims. Esc / close /
  background click clears. Keyboard operable; visible focus.
- **Detail panel:** role, persona, cluster, reports-to (Founder), autonomy +
  meaning, cadence, veto, portfolio (`owns`), Slack channel, cluster peers
  (navigate), open-charter link.
- **View toggle:** Chart ⇄ List (segmented control), `?view=list` preserved.

## Legend + stats (real)
- Legend: L2 recommend · L3 decide-then-log · veto authority · product lead ·
  cadence types.
- Stats: `1 founder · 17 directors · {clusters} clusters · {L3} at layer-3 ·
  {productLeads} product-excellence leads · {veto} with veto`, all from elt.ts.

## Design
Namespaced `.orgc-*` (no collision with the existing list's `.org-*`). Reuses DS
tokens and the Atlas `.atlas-panel` for the drawer. One indigo accent; clusters
are conveyed by grouping + headers, not a second hue. Motion 140–220ms opacity/
transform only, reduced-motion-safe. Print-friendly.

## Phasing
- **P1 (this):** the chart above.
- **P2:** 17 symbolic SVG avatars; tool/MCP-grant rows; coordination
  (information-sharing) overlay on focus; expandable portfolio tier; search.
- **P3:** advisor operating cadence + signal-directors implementation roadmap as
  a calm Gantt; recent-decisions per advisor from the decision-log.
- **P4:** build-time `advisors.yaml → elt.ts` sync; board/investor narrative.

## Bar
Calm, real, keyboard-accessible, reduced-motion-safe, responsive. Impressive at
a glance and more useful on inspection. Feels like one system with the Atlas.
