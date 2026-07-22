---
id: migration-p08-006-marketing-homes
title: Long-term home for the three product marketing sites
status: done
priority: P2
blocking: false
phase: Consolidation Phase 8
why: Marketing pages for Notes/Timeline/Signal stay on their subdomains through and after cutover (out of consolidation scope). A later decision can fold them into the umbrella.
href: /hq/decisions
date: 2026-07-22
---

## DECIDED + LIVE 2026-07-22 — one marketing home (the umbrella)
Decision: all product marketing consolidates onto signalstudio.ie (the umbrella). This is already LIVE — notes/timeline/signal marketing routes (/ + info/legal/audience pages) now 308-redirect to the umbrella (Phase 1), so nobody loads the old heavy product bundles (TTFB dropped from ~2s to ~0.06s). The old product marketing deployments are being retired in the domain-rename/retirement step; their marketing content lives in git history if any product-specific page is later wanted on the umbrella.

## Steps

1. No action needed for launch. Post-launch options: keep on subdomains (default) or consolidate into signalstudio.ie marketing.
2. Revisit after the unified app has real usage.
