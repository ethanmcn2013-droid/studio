---
id: vercel-lab-preview-exposure
title: Revoke or retain the Studio preview-bypass secret
status: open
priority: P2
effort: quick
blocking: false
phase: Preview security
why: The roadmap and analytics projects were deleted, leaving one project-wide Studio bypass that is no longer needed for the old lab gallery.
href: /hq/design-rooms
date: 2026-08-08
---

## Decision

Revoke `UMBRELLA_PREVIEW_BYPASS` and let Studio previews require Vercel login
(recommended), or explicitly retain the project-wide bypass. The agent can
remove the environment variable and dead link plumbing after the decision.
