# Web analytics — the Google tag

**Every Signal Studio web page carries the Google tag (gtag.js), measurement
ID `G-YHBS152PJK`.** New pages must not need any per-page work — it rides the
root layout.

## How it is wired (studio / this repo)

- `src/components/analytics/google-tag.tsx` renders the tag. It is **production
  only** (`process.env.VERCEL_ENV === "production"`) so preview and local builds
  never pollute the property.
- Rendered once in `src/app/layout.tsx` `<head>` via `<GoogleTag />`, so it lands
  on every route automatically. **Do not** paste the snippet into individual
  pages — one tag per page, in the layout only.
- CSP: `www.googletagmanager.com` is in `script-src`, and the
  `google-analytics.com` / `analytics.google.com` collection hosts are in
  `connect-src` (`next.config.ts`). Keep these when the CSP flips
  Report-Only → enforce.

## Adding it to a new page

Nothing to do — a new route under `src/app/**` inherits `<GoogleTag />` from the
root layout.

## Adding it to a new Next.js app (another product repo)

1. Copy `src/components/analytics/google-tag.tsx` into the repo.
2. Render `<GoogleTag />` in that app's root `layout.tsx` `<head>`.
3. Add `www.googletagmanager.com` to `script-src` and the GA collection hosts to
   `connect-src` in its `next.config.ts` (the suite CSP is kept in lockstep).

## Adding it to a standalone HTML page (e.g. a deck under `public/brand/`)

Paste this immediately after `<head>` — once, never twice:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YHBS152PJK"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-YHBS152PJK');
</script>
```

## Open follow-ups

- **Consent (GDPR / ePrivacy).** We are EU-based; GA4 sets analytics cookies.
  The tag currently runs with no consent gate. Before scaling traffic, add a
  cookie-consent banner and switch `google-tag.tsx` to Consent Mode v2
  (default `denied`, granted on accept).
- **Suite-wide rollout.** Only studio (signalstudio.ie) is wired so far. Repeat
  the "new Next.js app" steps in tasks, notes, timeline, and signal when we want
  cross-property measurement, and decide whether the investor decks
  (documents.signalstudio.ie) should be tracked.
