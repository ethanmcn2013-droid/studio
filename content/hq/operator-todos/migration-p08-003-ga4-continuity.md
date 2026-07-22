---
id: migration-p08-003-ga4-continuity
title: Choose the GA4 continuity approach before redirects converge traffic
status: done
priority: P1
blocking: false
phase: Consolidation Phase 8
why: When product traffic converges on one hostname, per-product funnels lose continuity unless a module dimension or path convention is set first.
href: /hq/decisions
date: 2026-07-21
---

## DONE 2026-07-22
Resolved by design: a single suite-wide GA4 property (G-YHBS152PJK) already tags the unified app, so convergence onto one hostname stays inside one property (no cross-property gap). The marketing + Stage C redirects preserve query strings, so UTM/referrer attribution survives the hop. Per-module funnels read off the path prefix (/app/notes|plan|brief|board). The optional 'module' custom dimension remains available as a future refinement but is not required for continuity.

## Steps

1. Recommended default: register a GA4 custom dimension 'module' and tag page_view events by module path prefix (/app/notes|plan|brief|board) - one-line layout change, prepared on request.
2. Alternative: accept the discontinuity and rebuild funnels on path prefixes post-cutover.
3. Needed by Stage C, not Stage B.
