# R-031 decision brief — does the sponsored couple's artifact belong on `/p` at all?

**Prepared:** 2026-08-03, Wave 3 orchestration. **Decision owner:** Ethan McNamara.
**Blocks:** E06 Shared Timeline (the whole epic), E03.01 role map, E03.06, E12.07.
**Status:** open, recommendation below, not applied.

---

## The situation, stated plainly

`/p/[slug]` is the public read-only render of any published workspace. It is
**deliberately built to be crawled**. Its own source comment says so: *"Server-rendered
for indexing"*, *"a public, indexable, rarely-changing page hit by crawlers and social
unfurls."* `app/src/app/robots.ts` disallows `/app`, `/s`, `/share`, `/redeem`, `/welcome`
and `/api`. `/p` is not in that list and sets no `noindex`.

That is a legitimate product choice for a general Tasks user publishing a project.

The privacy documentation describes a different product. `privacy-permission-matrix.md`
and the E03.01 role map both model every published surface as token-bound, `noindex` and
revocable. That is true of `/share/[token]` and `/s`. It is the opposite of true for `/p`.

**What has never been decided is whether a *sponsored wedding* workspace should default
to that surface.** A couple publishing a wedding workspace is publishing task titles and
tags — which carry guests' and suppliers' names — to search engines.

## Why this is a commercial question, not only a privacy one

The venue is paying EUR 1,000 to give couples something. E12.07 has to state exactly what
the venue sees and never sees, and the trust layer is the thing being sold. A programme
whose privacy page has to say "your wedding page is indexed by Google" is selling a
different product from the one in the deck.

It also cuts the other way: the Keepsake is meant to be shareable. A link that a couple
can post, that unfurls properly on WhatsApp and Instagram, that a parent can find again in
a year, is a better keepsake than a token URL nobody can re-find. Token-bound and
findable are genuinely in tension. That tension is the decision.

## The three real options

**A. Wedding workspaces never use `/p`. Token-bound only (`/s`, `/share`).**
The strongest privacy answer and the one the existing documentation already describes, so
nothing has to be rewritten to be true. Cost: the keepsake link is unfindable and does not
unfurl to a stable public URL; a lost link is a lost keepsake unless the couple can
regenerate it from inside the product.

**B. `/p` stays available to weddings but is `noindex` by default, with an explicit opt-in.**
The couple gets a clean stable public URL that works in messages and unfurls, but search
engines are excluded unless the couple deliberately turns indexing on, with the
consequence stated in plain words at the moment they do it. Cost: one more decision put to
a couple, and an opt-in that must be honestly worded rather than nudged.

**C. Leave it as it is and correct the documentation.**
Cheapest in engineering, and the current behaviour is at least *intentional*. Cost: the
privacy page for a paid wedding product has to say that the couple's page is public and
indexable, and the venue-facing trust claim gets materially weaker.

## Recommendation

**Option B.** `/p` remains the couple's public artifact surface because a findable,
unfurlable, stable link is genuinely the better keepsake and the product promise. But
wedding workspaces ship `noindex` by default and are added to the `robots.ts` disallow
list unless the couple opts in, and the opt-in says exactly what it does in one sentence
with no persuasion attached.

Reasoning: A gives up something real that the Keepsake promise depends on, to solve a
problem that a default plus a clear choice already solves. C requires telling a paying
venue's couples that their guest list is crawlable, which is the wrong sentence to have to
write on E12.07. B is the only option where the privacy documentation, the product and the
sales page can all say the same true thing.

**Independent of which option is chosen, three things should hold:**
1. `privacy-permission-matrix.md` and the E03.01 role map are corrected to describe `/p`
   as it actually behaves. They are wrong today whichever way this goes.
2. The couple's publish confirmation states plainly what publishing does. Today it does not.
3. A standing **no** on face detection, auto-tagging and face grouping. Both role-map
   derivations reached this independently; it is not contested and should just be ratified.

## What is needed from Ethan

One line: **A, B or C.** If B, a second line on whether the opt-in ships for launch or
whether launch is `noindex` with no opt-in at all (which is B collapsed toward A, and is a
perfectly reasonable launch posture given 29 days).

Related and separate: **R-032** (Google Analytics on public surfaces with no consent gate)
has its own brief. If `/p` carries other people's names, third-party analytics on it is a
harder problem than the indexing question.
