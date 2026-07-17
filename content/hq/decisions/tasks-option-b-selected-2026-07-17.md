---
id: tasks-option-b-selected-2026-07-17
title: Tasks production adopts Option B, the Editorial Project Room, from the four-view design lab.
category: Product
date: 2026-07-17
status: Active
reviewDate: 2026-10-01
relatedObjects: [tasks-four-view-review-lab, Signal Tasks, DESIGN.md]
---

## Decision

Signal Tasks production adopts Option B (Editorial Project Room) from the four-view design lab: a workspace brief — purpose, date window, owner, progress receipts, milestones — sits above Board, List, Timeline, and Calendar, and each view narrates itself in the editorial register. Phase 2 ports the composition onto production machinery rather than mounting the fixture-bound lab components.

## Reason

B was both the founder's explicit selection (SELECT B) and the review panel's strongest unmodified option (9.50 vs A 9.27, C 9.18). Its project orientation answers the product's core promise — coordination that explains itself to the 80% not in tech — better than A's operational restraint or C's spatial density. Porting composition instead of components preserved custom columns, subtasks, optimistic sync, demo mode, print/share parity, and the accessibility evidence base.

## Alternatives considered

The chair's A/B/C hybrid recommendation; Option A (Quiet Command); Option C (Signal Spatial); mounting the lab components wholesale. The hybrid remains available as a refinement direction inside the shipped B shell.

## Risks

Purpose copy can turn to noise in dense workspaces — the brief clamps to one line and views show one-line excerpts only. The brief's extra height reduces above-the-fold work; the milestones column collapses below wide desktop by design.

## Amendment, 2026-07-17 (T·95): production mirrors the lab, one to one

The earlier "port composition, not components" framing under-delivered. T·94 hung the Studio Bar over a still-pre-lab shell, and the founder's review found the live product looked nothing like the Option B lab. Correction: **production now renders the Option B lab exactly** — the charcoal four-product rail, the Projects sidebar (real planning-period tree, live counts, workspace switch), the full-bleed brief band, the 52px room view bar with working search/filter/sort/fields/density/save-view, and the lab's board, list, timeline, and calendar grammar — with the **Studio Bar as the single sanctioned difference** (the lab has no top bar; production does). Production behaviours (drag, optimistic sync, custom columns, detail panel, demo mode, print/share) are unchanged underneath. The lab branch `feat/option-b-signal-shell` (b49d530) is the frozen spec; the operating standard going forward is that lab-derived work is verified by side-by-side pixel diff against the lab, not by a written requirement checklist. Shipped as Tasks dispatch T·95 with 46/46 production-build browser evidence at both breakpoints.
