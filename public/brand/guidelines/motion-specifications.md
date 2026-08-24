# Signal Studio motion specifications

Motion explains hierarchy, storytelling, feedback, or state. If it explains none of those, it stays still.

## Durations

- 80ms: immediate response
- 140ms: micro state change
- 220ms: entrance, exit, or reveal
- 400ms: panel or page-level transition

## Curves

- Ease out: `cubic-bezier(0.23, 1, 0.32, 1)`
- Ease in out: `cubic-bezier(0.77, 0, 0.175, 1)`

## Product gestures

- Signal Studio: broadcast
- Signal Notes: caret
- Signal Tasks: pulse
- Signal Timeline: sweep
- Signal: tick

## Rules

- Animate transform and opacity on interaction paths.
- Pause all work while the specimen is offscreen.
- Resolve the content immediately when reduced motion is requested.
- Do not add decorative perpetual motion.
