# R-032 decision brief — Google Analytics runs on public surfaces with no consent gate

**Prepared:** 2026-08-03, Wave 3 orchestration. **Decision owner:** Ethan McNamara.
**Blocks:** E03.06 (public Timeline terms, viewer privacy language, analytics disclosure,
cookie requirements), E12.14 (analytics on every commercial page), E12.07.
**Status:** open, recommendation below, not applied.

---

## The situation, stated plainly

`app/src/app/layout.tsx:81` renders `<GoogleTag enabled={process.env.VERCEL_ENV ===
"production"} />` on every route except bare artifact paths.
`app/src/components/analytics/google-tag.tsx` carries its own admission in a comment:
*"No consent gate yet — if a cookie-consent banner is added, switch to…"*

So a wedding guest who follows a link to a couple's published page is measured by a
third-party US analytics provider before being asked anything.

Under ePrivacy as transposed by SI 336/2011, consent is required for non-strictly-necessary
storage and access on a device. Analytics is not strictly necessary. This is the settled
reading, not a marginal one.

**This is not a general backlog item.** E03.06 must write the analytics disclosure and
E12.14 must clear analytics on every commercial page. Both would otherwise have been
written against the role map's description — first-party security logging with hashed IPs
and a short TTL — which is a truthful description of *a different thing than what runs*.

## Why it is worse on couple-facing pages than on marketing pages

On `/pricing` the person being measured is a prospect who came to a company's website.
That is the ordinary case a consent banner exists to handle.

On `/p`, `/s`, `/share` and `/embed` the people being measured are **wedding guests and
suppliers who followed a link from a couple**. They did not come to Signal Studio. They
have no relationship with it. Their presence on that page is itself information about the
couple's wedding. Measuring them with a third-party US provider is a different act from
measuring a prospect, and it is the act a venue's privacy question is really about.

## The three real options

**A. No third-party analytics on any couple-facing public surface. Marketing pages keep GA4
behind a consent gate.**
Removes the question on the pages where it is hardest rather than managing it. Cost: no
view data on published artifacts unless something first-party replaces it — and E06.07
("aggregate viewer counts only") wants *some* count, so a first-party, aggregate,
identifier-free counter has to exist.

**B. Consent gate everywhere, GA4 stays on all surfaces behind it.**
Conventional and defensible. Cost: a cookie banner on a couple's keepsake page is a bad
experience and a visibly commercial intrusion on a page D-011 says must carry no marketing.
It also means building and maintaining a real consent mechanism, not a dismiss button.

**C. Leave it and write the disclosure to match.**
Not recommended and I would push back if asked to implement it. It puts a known
non-compliant posture on the surfaces that carry other people's names, at the exact moment
the programme is selling a trust layer to venues.

## Recommendation

**Option A.**

1. **Exclude `/p`, `/s`, `/share` and `/embed` from third-party analytics entirely,**
   regardless of what is decided about consent elsewhere. These pages carry other people's
   names. This exclusion is worth doing whatever else happens and does not need the rest of
   the decision to be settled.
2. **Marketing and commercial surfaces**: GA4 behind a genuine consent gate, or replaced
   with a first-party aggregate measure. Given 29 days to release, the cheaper and cleaner
   move is to drop GA4 from the venue-facing commercial pages too and measure server-side
   in aggregate — there is no personalisation being driven by it, so the cost is low.
3. **E06.07's viewer count** is then served by a first-party aggregate counter with a
   suppression floor, which is the same control class as R-027/R-028 in the Venue Portal.
   Note the E05/E06 audit already found the app-side version of that defect:
   `artifact-studio.tsx:59-67` shows "Timeline views 1 · Last viewed 3 Aug 2026" side by
   side, which de-anonymises a single viewer. Whatever counter replaces GA4 must not repeat it.

Reasoning: A is the only option that makes the sentence on E12.07 easy to write and true.
It also removes an entire category of ongoing obligation rather than taking one on, which
matters for a sole founder 29 days from release.

## What is needed from Ethan

One line: **A, B or C.** If A, a second line on whether the marketing-page GA4 goes too, or
stays behind a consent gate.

**A note on scope:** step 1 (excluding the four couple-facing routes) is small, isolated,
and correct under every option including B. Say the word and it ships in Wave 4 without
waiting for the rest of the decision.

**This brief states a legal reading of ePrivacy/SI 336/2011 as background. It is not legal
advice, no solicitor has reviewed it, and nothing here should be represented to a venue as
legal approval (D-016).**
