# Signal HQ — Design System (redesign layer)

_Phase 4. The reference image is the visual gate. This document records what was extracted from it and how it maps onto the existing Signal Design System (`src/ds/tokens.css`, v2.0.1)._

## Reference analysis (the gate)

The reference is a deployment console ("OpenShip"). Its finish comes from restraint, not decoration:

| Dimension | Reference | Decision for HQ |
|-----------|-----------|-----------------|
| **Layout** | Three columns: persistent left nav rail (~280px) · content canvas · contextual right rail (~360px) | Adopt. Rail + canvas always; right rail is an optional per-page slot. |
| **Page bg** | Very light warm gray (~#f5f5f7); surfaces are white | Map to `--paper-deep` canvas, `--paper` cards. |
| **Nav** | Grouped under tiny uppercase letter-spaced labels; icon + label rows; comfortable line-height; one gradient primary button; account chip pinned bottom | Adopt exactly. Section labels use `--text-label` (11px mono caps). |
| **Cards** | White, 1px hairline (~#ececec), ~12px radius, near-zero shadow | `--paper` + `--hairline` + `--radius-lg`; shadows only on float/modal. |
| **Accent** | Single purple gradient, used once (primary CTA) | Our indigo `--accent` (#4f46e5). One earned moment per view. Primary CTAs = **ink/black** (reference's Deploy button); indigo reserved for the single accent. |
| **Controls** | Segmented pill (active = white on gray track); toggles go black when on; hairline inputs | Build `.hqx-segmented`, ink-filled active states, hairline inputs. |
| **Status** | Green "live" dot only where it means live | Semantic `--status-*` only; never decorative. |
| **Type** | Clean grotesque; bold section headers (~18–20px); muted secondary; tiny labels | Geist (already loaded). Reuse the DS type scale. |
| **Density** | Comfortable, calm, grouped; generous but not empty | Match. Denser than marketing surfaces, lighter than enterprise. |
| **Motion** | Implied: subtle, quick | DS motion tokens (80–220ms), `prefers-reduced-motion` honored. |

**Proportion target:** ~90% neutral, black for primary/active/toggles, one indigo moment, semantic red/amber/green only with meaning. This is exactly the DS's stated discipline — so the redesign **extends** the DS, it does not fork it.

## What we add (and what we reuse)

The DS tokens are complete and on-target; **no token values change.** The redesign adds one HQ layer: `src/app/hq/hq-os.css`, a set of `.hqx-*` component classes (x = the DS-sanctioned product-extension prefix) built entirely from semantic DS tokens. Old `.hq-*` classes in `globals.css` remain for un-migrated pages during the transition.

### Shell tokens (HQ-local, extension-prefixed)

```css
--hqx-rail-w: 264px;        /* left nav rail */
--hqx-railcol-w: 72px;      /* collapsed rail */
--hqx-rightrail-w: 344px;   /* contextual rail */
--hqx-canvas: var(--paper-deep);
--hqx-topbar-h: 56px;
--hqx-content-max: 1120px;  /* = --container */
```

### Component inventory (`.hqx-*`)

- **Shell** — `hqx-shell` (CSS grid: rail / canvas / rail), `hqx-rail`, `hqx-rail-group`, `hqx-rail-label`, `hqx-rail-item` (icon + label, active = `--paper-deep` fill + ink), `hqx-rail-cta`, `hqx-account`.
- **Top utility bar** — `hqx-topbar` (breadcrumb left, ⌘K + status + actions right), sticky, hairline base.
- **Right rail** — `hqx-rightrail`, `hqx-rail-card` (tiny label + stacked rows), `hqx-summary-row` (icon · label · value).
- **Page primitives** — `hqx-page`, `hqx-page-header` (eyebrow / title / lede / actions), `hqx-section`, `hqx-section-head`.
- **Content** — `hqx-card`, `hqx-metric` (label / value / note, tone variants), `hqx-metric-row` (grid), `hqx-status` (dot + label, semantic tones), `hqx-action-row` (priority · title · why · owner · due · next), `hqx-asset-row` / `hqx-asset-table`, `hqx-tabs`, `hqx-segmented`, `hqx-banner` (critical/info), `hqx-empty`, `hqx-skeleton`, `hqx-error`.
- **Command palette** — restyle the existing `HqCommandPalette` to `hqx-cmdk` (modal shadow, hairline rows, grouped results, keyboard focus ring).

### States

Every list/table surface ships loading (`hqx-skeleton`), empty (`hqx-empty` — headline + one action), stale (muted timestamp + "unread" pill), and error (`hqx-error` — plain explanation + retry) states.

## Accessibility contract

- Semantic landmarks: `<nav aria-label="Signal HQ">`, `<main>`, breadcrumb `<nav aria-label="Breadcrumb">`.
- Rail items are links with `aria-current="page"` on the active route; status never by color alone (dot + word).
- Command palette: focus trap, `role="dialog"` + `aria-modal`, arrow-key list, Esc to close, focus restore.
- Contrast: body text never lighter than `--ink-faint` (#71717a on white = 4.6:1). Targets ≥ practical minimum; rail items ≥ 40px.
- `prefers-reduced-motion` collapses all motion tokens to 0 (already in `tokens.css`).

## Responsive

- **≥1440**: rail + canvas + right rail.
- **1024–1440**: rail + canvas; right rail folds into canvas as a top section.
- **768–1024**: rail collapses to icon rail (`--hqx-railcol-w`); labels on hover/focus.
- **<768**: rail becomes a top bar + slide-over drawer (hamburger); content single-column; ⌘K available as a search button. No horizontal overflow; tables scroll within their own container.
