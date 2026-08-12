---
id: dark-mode-ships-d013-2026-08-12
title: D-013 resolved — dark mode ships for the signed-in app, honoring the device scheme with an explicit choice in Settings
category: Product
date: 2026-08-12
status: Active
reviewDate: 2026-11-12
relatedObjects: [app design-wave 6, app CHANGELOG T·138, app src/app/app/theme-runtime.tsx, signal-design-system tokens.css dark mapping]
---

## Decision

Dark mode ships for the signed-in app (app.signalstudio.ie/app) as part of
design-wave 6. The founder opened and resolved D-013 on 2026-08-12: the app
honors prefers-color-scheme using the design system's existing dark mapping,
and Settings → Appearance offers System, Light, and Dark.

The mechanism is two attributes on the document root: data-theme-mode records
what the user chose (system, light, dark) and data-theme records what that
resolves to right now. A ~230-byte inline resolver settles the theme before
first paint and re-resolves on every device-scheme change; the chosen mode
streams in behind Suspense so no database read blocks the shell. The
preference rides the existing user_preferences write path with a server-side
allow-list. Marketing, auth, and every public surface ship unchanged and stay
light — scoping is by which layout renders the resolver, not a runtime path
test.

Shipped with the resolution: forced-light roots removed from both app
layouts, the runtime shell, and the timeline artifact; hard-coded whites
across board options, notes workspace, timeline surfaces, and mobile chrome
moved to elevated-surface tokens; dark remaps for the focus ring, the
Add-task capsule, blocker chips, and the browser theme-color; and the
contrast gate extended to measure all three product surfaces in both themes.

## Reason

Dark was designed into the token system (the dark mapping has lived in
tokens.css since the DS 2.0 pass) but held behind D-013 pending founder
review. The founder lifted the hold during the 9.5 design programme; the
8-seat wave-6 panel then confirmed the dark theme composes rather than
merely inverting, and instrumented contrast now passes 0 violations across
all six surface-and-theme combinations.

## Risks

The browser-chrome theme-color follows the OS via a media query, not the
user's in-app choice — a user who explicitly picks light on a dark phone
gets a browser bar that disagrees. Closing that gap would put a database
read in front of every /app document, which the resolver exists to avoid.
Recorded in the app layout; never worse than the white bar it replaces.

## Notes

The system-theme default means most users see dark for the first time only
because their device asked for it. The wave-6 dispatch entry (T·138) is the
operator-visible record.
