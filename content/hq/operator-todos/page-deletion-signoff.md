---
id: page-deletion-signoff
title: Sign off the page-deletion audit (orphaned routes across the suite)
status: open
priority: P2
blocking: false
phase: P1 punch-list
why: dead routes dilute the sitemap and the "everything important, nothing distracting" promise; deletions ship only on your call.
href: /hq
date: 2026-07-06
---

## Context

Punch-list #15. Full route inventory done. Deletions are operator-gated; each
ships only on your sign-off, with a 301 where inbound links may exist. Full memo:
`audit/P6_DELETION_AUDIT_2026_07_06.md`.

## Recommended (high-confidence)

- tasks `/for/weddings` — already a redirect, delete the stub.
- tasks `/for/{community,freelancers,small-business,students,trades}` — 5 orphaned, unlinked.
- tasks `/roadmap` — meta page; 301 to the Timeline domain.
- analytics `/wedding-planning` — orphaned demo.
- analytics `/app/preview-email` — internal test util; move under /hq or delete.
- studio `/review` — internal tool; move under /hq or retire.

## Medium (needs a usage check first)

- studio `/compare/[slug]`, studio `/venues/demo` (superseded by /proof?),
  tasks `/status` (→ /hq), timeline `/[workspaceSlug]/refusals`.

## Semi-orphaned by today's chrome cleanup

- studio `/work`, `/contact` (left the nav today — keep in footer, or fold).
- Product `/about`, signal `/method` `/refusals` `/demo` (left the product
  headers today — still footer/body-reachable; decide keep-or-fold).

## Steps

1. Read the memo; mark each route keep / 301 / delete.
2. Eng executes only the approved set, adds 301s, re-checks sitemaps.
