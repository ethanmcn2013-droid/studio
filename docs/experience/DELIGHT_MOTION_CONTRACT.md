# Signal Studio delight motion contract

Status: local review candidate
Scope: public Studio landing, Design, Notes, Tasks, Timeline, and Signal pages
Last reviewed: 2026-07-29

## Thesis

Motion in Signal Studio should settle the user, prove continuity, and acknowledge
intent. It must never withhold the first useful read, disguise a static label as
an action, or continue merely to keep the page busy.

## Shared grammar

| Token | Duration | Job |
| --- | ---: | --- |
| Instant | 80ms | Immediate status acknowledgment |
| Fast | 140ms | Hover, focus, small state change |
| Base | 220ms | Local transition or short handoff |
| Slow | 400ms | One composed arrival or receiver state |

Use `cubic-bezier(0.23, 1, 0.32, 1)` for entrances and state changes. Use
`cubic-bezier(0.77, 0, 0.175, 1)` only when an illustrative object visibly
travels between two known states.

## Page budget

- One dominant motion idea per page.
- Reading and primary actions are available on first paint.
- Marketing films may exceed 400ms only when they explain a product workflow.
- Every film has Pause/Resume and Replay controls, stops offscreen and in a
  background tab, and has a deterministic end or deterministic loop.
- Ambient motion is reserved for a wordmark or a short-lived status signal. It
  is not permitted on generic chrome, presence indicators, or decorative dots.

## Interaction contract

- Press acknowledgment: `scale(0.98)` for 140ms with the shared ease-out curve.
- Hover movement only runs on fine pointers. Focus is visible without moving
  content.
- A control that looks actionable must be a real button or link. Illustrative
  controls use static receipt language.
- Product-to-product navigation may wait at most 120ms on the source page.
  Destination continuity remains a selection-gated pattern until the local
  route-continuity lab is approved.
- `prefers-reduced-motion: reduce` renders the meaningful settled state
  immediately and removes transform-based movement and looping effects.

## Approved long-form exceptions

| Surface | Exception | Boundary |
| --- | --- | --- |
| Notes | 6.6s capture film | Finite; pause, replay, visibility and reduced-motion aware |
| Tasks | Scripted collaboration demo | Deterministic; no idle cursor drift; pause, replay, visibility and reduced-motion aware |
| Product handoff | Cross-product receipt | Plays once in view; receiver settles within the shared token system |

## Selection gates

Two choices remain intentionally outside production routes:

1. Product route continuity: Immediate, Travelled, or Shared geometry.
2. Homepage artefact lineage: Static receipt, One-shot handoff, or Continuous
   relay.

They live only under `/__design-lab/delight/*`. A production route must not
adopt either pattern until a single variant has been explicitly selected and
verified on desktop, mobile, reduced motion, and a physical iOS device.
