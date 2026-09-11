---
id: public-estate-cut-2026-09-11
title: The public estate cuts to eight pages until launch
category: GTM
date: 2026-09-11
status: Active
reviewDate: 2027-01-11
relatedObjects: [src/app/sitemap.ts, next.config.ts, src/components/layout/site-nav.tsx, src/components/landing/site-footer.tsx, archive/marketing-pages/README.md, scripts/check-chrome-contract.mjs, CHANGELOG.md S·177]
---

## Decision

Twelve route directories leave the public estate. What a stranger can reach
on signalstudio.ie is now eight pages: the home page, Waitlist, Pricing,
About, Principles, Press, Privacy and Terms.

Archived to `archive/marketing-pages/`, code unchanged:

| Route | Why |
| --- | --- |
| `/notes` `/tasks` `/timeline` | Three product pages for a product that has not launched. Held until it does. |
| `/venues` | The Founding 25 wedge. Returns when the founding-venue campaign runs. |
| `/students` | Its campaign window (1 June – 31 August) closed without the campaign running, and `/pricing` already carries the student offer. |
| `/dispatch` `/changelog.rss` | Fifty-two entries of shipping notes, published ahead of anyone to read them. |
| `/features/daily-briefing` | The only page under `/features`. A directory with one item in it. |
| `/security` `/accessibility` | Trust pages held back with the rest. |
| `/changelog` `/signal` | Redirect stubs. Their rules moved into `next.config.ts`. |

## Why

The estate was built for a launch that has not happened. Seventeen indexed
pages, three of them describing products nobody can sign up to and two of
them fronting campaigns that were queued rather than running, is a wide
surface to keep true — and every page on it is a page that has to stay
accurate while the product underneath it moves.

The narrower reason is that the argument was competing with itself. A
visitor who lands on the home page and wants in has one thing to do. Nine
other doors, most of them describing things they cannot have yet, is not
lean; it is noise wearing the shape of depth.

## What this is not

It is not a claim that those pages were wrong. `/students` and `/venues` are
good pages attached to real campaigns, and the three product pages are the
launch story. They are early, not bad. The archive exists so restoring one
is a `git mv` and a sitemap line, not a rebuild.

## Status codes

Everything held for launch redirects **307, temporary**. A 308 tells a
crawler the URL is permanently gone, and re-launching `/tasks` at `/tasks`
after saying that is an uphill fight. Only the genuinely retired paths keep
their 308s.

## Reversing it

`archive/marketing-pages/README.md` carries the restore path. The rule that
should survive this decision: a page belongs in the sitemap only if the nav
or the footer links to it. The old estate broke that rule eleven times.
