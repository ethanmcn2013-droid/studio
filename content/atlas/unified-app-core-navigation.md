---
title: Core navigation in the unified app
slug: unified-app-core-navigation
lens: Products
owner: Ethan
lastVerified: 2026-09-23
links: [timeline-shareable-artifact, signal-progressive-analytics]
tags: [Home, Projects, Tasks, Timeline, Notes, More, app.signalstudio.ie, project context]
references: [content/hq/decisions/three-products-home.md, content/hq/decisions/contextual-links-are-navigation.md, app/src/lib/core-navigation.ts, app/src/components/studio-bar/studio-rail.tsx, app/src/components/app/mobile-suite-nav.tsx, app/src/components/app/sidebar.tsx, app/src/components/floor/floor-workspace.tsx]
summary: Candidate signed-in navigation puts Home, Projects, Tasks and Timeline first; the private Notes tool sits in More.
status: complete
pinned: false
execWhat: Four everyday destinations lead the signed-in app, while the private Notes tool and existing utilities remain one step away in More.
execMatters: People can find their project and the work tied to it without treating Notes as a required first step.
execRisk: A rail or contextual link that loses the active Project can show the right tool with the wrong work.
---

## WHAT

The approved signed-in navigation order is **Home, Projects, Tasks, Timeline**.
Home contains the daily signal and briefing and orients the person. Projects,
Tasks and Timeline form the core work path; Projects is an explicit context,
not another product. Notes is a private tool at `/app/notes` under More; its
content and promotion boundary do not change. Existing Inbox, account,
settings, support and enabled Messages paths remain available outside the
primary row.

## WHO

The App repository owns the rendered navigation and the Project authorization
boundary. Studio HQ owns the product decision in
`content/hq/decisions/three-products-home.md`. The App integration and release
reviewers decide when a candidate is received and released; this Atlas entry
does not grant that state.

## WHERE

- Canonical paths: `/app/home`, `/app/project`, `/app/tasks`,
  `/app/timeline`; private Notes stays at `/app/notes`.
- App source: `src/lib/core-navigation.ts` defines the four destinations.
  `studio-rail.tsx` and `mobile-suite-nav.tsx` render the shared chrome.
  `sidebar.tsx` serves Tasks runtime routes; `floor-workspace.tsx` serves the
  bare Tasks Floor. Each has its own More control.
- Review source: [App PR 183](https://github.com/ethanmcn2013-droid/app/pull/183)
  at `bd805961`; rendered demo evidence is in
  `app/experience/reviews/production-core-navigation-2026-09-23/`.

## HOW

1. Each rail uses the same ordered core destination list and marks the current
   route. The Tasks Floor has separate chrome, so it renders the same list
   itself instead of relying on the shared bar.
2. Cross-surface links carry allowlisted Project context. The destination
   still resolves and authorizes the Project. An inbound contextual link does
   not silently change the person's active Project preference; explicit
   selection is the only preference-changing action.
3. More exposes private Notes and existing utilities. The menu can be opened
   by keyboard and Escape returns focus to its trigger. On a 320 px Tasks
   phone view, Add task remains in More when the separate rail control cannot
   fit.
4. The Projects route separates no Project from an unavailable Project link.
   The first state offers setup; the second keeps the existing unavailable
   response.

## WHEN — current state

Atlas `status: complete` describes this entry's documentation sections, not
the App's release state. App commit `bd805961` passed independent review and
was received by the draft integration branch at `34d4c92a`. It is not in App
main or production. Its optimized local demo build and browser review covered
1440×900, 390×844 and 320×720, including Home to More to Notes to Projects to
Tasks and keyboard focus return. That evidence does not prove a real signed-in
no-Project account, provider behavior, production deploy or final design
acceptance. The App PR
and its receiving checks remain the release boundary.

## WHY

The old primary row made private capture look like the first step for every
person, while Projects stayed behind surrounding chrome. The new order gives
the four places used to orient and carry out work one stable position across
the shared shell and Tasks' distinct canvases. Keeping Notes in More preserves
its role without suggesting that all work must start there. Keeping Project
context explicit prevents a convenient navigation shortcut from silently
moving someone into a different project.
