---
id: confirm-board-truth-t114-t118
title: Eyeball the Tasks board after T·114 to T·118 and confirm the brief behaves
status: open
priority: P2
blocking: false
phase: Board truth programme
why: The board is behind sign-in, so the agent could not verify the shipped changes on the live surface.
href: https://app.signalstudio.ie/app/tasks
date: 2026-07-30
---

# Confirm the board after T·114 to T·118

Six dispatches shipped to production on 2026-07-30. Every automated gate is
green, but the signed-in board could not be checked directly because it needs
credentials, and an agent should not be entering those.

Two minutes of looking:

1. **The crumb is gone.** No `Workspace ›` above the project title.
2. **The description persists properly.** Edit it, reload, and it should hold.
   Then open the same project in a private window or another browser and
   confirm the same text appears. That is the thing that was broken: it used
   to save only to the browser that typed it.
3. **The title still renames** and the new name appears on a share link and in
   the print view, not just on your screen.
4. **The sidebar** reads `Inbox · My work · Projects · Add project`, with the
   duplicated "Signal Studio / Tasks" header gone.
5. **The board's view bar** no longer shows a greyed-out `Fields` button.

## The one worth actually testing

**Share a board that has something sitting in the Waiting column**, then open
that link signed out. Those tasks used to be invisible to whoever you sent it
to, silently, with no sign anything was missing. T·116 fixed it. This is the
change most worth confirming with your own eyes, because it is the one a
client would have hit.
