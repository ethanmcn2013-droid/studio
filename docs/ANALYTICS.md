# Web analytics

**Signal Studio runs no analytics tag on any public page.** There is nothing
to add to a new route, nothing to paste into a new deck, and nothing to copy
into another product repo.

## What measurement exists

- **Studio (signalstudio.ie):** Vercel Analytics only. Anonymous traffic
  counts, no cookie, no account visibility. It is part of the platform, not a
  script we render.
- **App (app.signalstudio.ie):** PostHog EU cloud, server-side only.
  `src/lib/analytics/posthog.ts` in the app repo posts events over HTTP from
  the server, keyed to the Clerk user id, gated on `POSTHOG_API_KEY`. No
  PostHog script reaches the browser and no PostHog cookie is set. Client
  events go through `/api/analytics/capture` so the key stays server-side.

Both are disclosed by name in the privacy policy: Vercel under subprocessors,
PostHog under subprocessors and under "Where data lives".

## Why GA4 is gone (decision D2, 2026-08-12)

The Google tag (`G-YHBS152PJK`) rendered from the studio root layout on every
public page, in production, with no consent gate. The privacy policy said, and
still says, that we set no third-party trackers that need consent banners. Both
statements could not be true at once. That is risk R-032.

The estate consolidation resolved it toward the policy claim. Removed in the
same pass:

- `src/components/analytics/google-tag.tsx`, deleted.
- `<GoogleTag />` in `src/app/layout.tsx`, deleted.
- `www.googletagmanager.com` from `script-src` and the GA collection hosts from
  `connect-src` in `next.config.ts`, deleted. An allowlist that outlives its
  script is a re-entry point.

The property itself is untouched in the Google account. Nothing sends to it.

## If analytics is ever wanted again

The consent question comes first, not second. We are EU-based; GA4 sets
analytics cookies, so it needs a cookie-consent banner and Consent Mode v2
(default `denied`, granted on accept) before a single tag renders. The privacy
policy has to change in the same pass, not afterwards. Anything that measures
without a cookie and without a browser script, the way PostHog is wired in the
app, avoids the question entirely and is the preferred shape.
