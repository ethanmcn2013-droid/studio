---
id: migration-p08-006-marketing-homes
title: Long-term home for the three product marketing sites
status: done
priority: P2
blocking: false
phase: Consolidation Phase 8
why: Product marketing is consolidated into canonical product-name paths on the umbrella. Legacy hosts remain redirect entry points, not marketing homes.
href: /hq/decisions
date: 2026-07-22
---

## SUPERSEDED 2026-07-25 — one marketing origin, four product pages

The 2026-07-22 root-only consolidation was incomplete: it made the old hosts
fast, but erased the product destination by sending Notes, Timeline, and Signal
to the umbrella homepage.

The accepted map is now:

- `signalstudio.ie/notes`
- `signalstudio.ie/tasks`
- `signalstudio.ie/timeline`
- `signalstudio.ie/signal`

Legacy roots redirect to the matching product page. The four signed-in products
remain modules of the one app at `app.signalstudio.ie`.

## Steps

1. Keep product navigation bound to the four canonical umbrella paths.
2. Keep authenticated launchers bound to the four `app.signalstudio.ie/app/*`
   entries.
3. Preserve Tasks service routes and Timeline public artifacts separately.
