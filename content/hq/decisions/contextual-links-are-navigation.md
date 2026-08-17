---
id: contextual-links-are-navigation
title: A contextual link is navigation, not selection — inbound suite links stop moving your project
category: Product
date: 2026-08-17
status: Active
reviewDate: 2027-02-17
relatedObjects: [app docs/wave/DECISIONS.md D-028, app docs/wave/DECISIONS.md D-021, app ADR 0001 §4, app src/app/api/suite-context/route.ts, app PR #151, active-project-control]
---

## Decision

Following an inbound suite link no longer writes the last-active Project preference.
The Project travels in the URL instead.

## The problem it closes

The inbound contextual-link handler wrote the active-workspace cookie once it had proved
membership. That made someone else's link decide where your next bare entry landed. A
digest email, a shared URL, a cross-product jump — each of those is a decision somebody
else made about where you should look. Glance at a notification about a project that is
not yours, close the tab, open the app tomorrow, and you were in their project with no
memory of choosing it and nothing on screen saying it had moved.

ADR 0001 §4 has always said only an explicit Project selection may move that preference.
This was the last writer contradicting it, and it was recorded as a founder question
rather than patched, because whether an inbound link counts as explicit selection is a
product judgement rather than an engineering one.

## Why it was takeable now and not in July

The cookie write was the only thing making a contextual link feel sticky. Withdrawing it
before there was a visible way to say "actually, keep me here" would have traded one
confusing behaviour for another.

WP6 shipped that affordance: the Active Project control now sits in the permanent top bar
on every surface, on Notes and Tasks and Timeline alike. Someone who lands in a shared
project and wants to stay has a one-click way to choose it — which is exactly the explicit
selection the ADR asks for. The affordance had to exist before the implicit behaviour
could go.

## The half that would have been the worse bug

Removing the write alone would have sent the link back to the ambient project — the same
wrong-project substitution two waves were spent removing, reintroduced by a fix intended
to remove it. Carrying the Project in the URL is not a detail of the change; it is half
of it.

## Consequence

Five legacy cookie writers become four. The app's ratchet test fails if this one returns,
and the ordering guard was renegotiated rather than deleted: it now pins that nothing
authorized reaches the caller before membership and period are both proved, and that the
route writes no cookie at all.
