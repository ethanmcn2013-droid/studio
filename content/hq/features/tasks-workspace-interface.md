---
id: tasks-workspace-interface
title: Tasks workspace interface
product: tasks
status: Built
lastVerified: 2026-10-14
---

# Tasks workspace interface

The built App candidate updates the Tasks workspace frame: approved solid/outline navigation icons show the selected destination, light mode uses white paper and dark ink, pages use the available width beside the sidebar, and Projects no longer repeats the open project's overview beneath the list.

## Source and evidence

The deployed source is App `b805c5501f8198218791491ae0a2f26efbae0657` (tree `07ea449b3f9f39724961875bd612f18f6ae34071`), on deployment `dpl_8vdnW7eRwiDzinzDQwFwrCzh1k38`. The release receipt records the candidate and reviewed three-host reconciliation of all six live aliases (receipt SHA-256 `9b7e46357c42a8c422cce5171c6785e300d18bdd42dadbeb76902945dfac2bd5`); its independent provider review passed. Existing-session authenticated live reads passed for Projects and Tasks board/list, plus bounded task-detail, Files, Timeline and Home checks. The inspected Projects view showed the full-width frame, selected icon and project markers; this does not establish every route or icon state.

Theme-qualified top-of-page captures of the real Wedding guest-list route at 1920×1080 light, 390×844 light, and 1280×800 dark are retained as the `theme-verified-screenshots.json` receipt (SHA-256 `C46E4D0C9ED0EE56B8269DA0BA3B6316F6EB8B44D31BC4B5E6DABFAE7C4FE664`). They check the App's rendered theme attribute, canvas and text tokens, guest surface colour, and scroll-container positions on the built sample. They are not live production theme checks across those viewports.

This scope does not include an activity-feed feature or Settings work. Wedding Seating and Budget remain coming soon.

## Live receiving

**DEPLOYED; bounded receiving recorded.** The production deployment and six-alias reconciliation are confirmed. Existing-session read journeys provide limited live evidence for the inspected Projects and Tasks surfaces, with additional bounded reads of task detail, Files, Timeline and Home. They do not amount to a full route/viewport acceptance sweep. Activity and Settings remain unfinished; Seating and Budget remain coming soon.
