# P10 · Subdomain isolation + GDPR — findings (2026-05-16)

## Apex-actionable (done here)
- **robots.ts created**: apex marketing stays indexable (it IS the
  public site — `Disallow: /` would wrongly deindex marketing; that
  rule is for the preview subdomains). Disallows `/hq` (gated ops) and
  `/redeem` (private per-code links; belt-and-braces over the existing
  per-page noindex). Verified live: correct robots.txt + sitemap/host.
- **Consent stance noted in layout.tsx**: apex sets NO non-essential
  cookies (only the strictly-necessary, consent-exempt HQ sign-in
  cookie, path=/hq, httpOnly, sameSite=strict). No banner by design.
  In-code note documents that any future tracker needs PRIOR opt-in,
  never "by continuing".
- **/privacy reviewed — NO change needed.** Already a model policy:
  every subprocessor listed with jurisdiction (Clerk US, Turso
  Frankfurt, Vercel US/edge, Sentry US PII-scrubbed, Resend), Vercel
  Analytics correctly described as cookieless/account-blind, GDPR
  rights + retention + data controller (Ethan McNamara, Dublin).
  Editing it would be theatre.
- **Cookie audit**: only `response.cookies.set` in the codebase is the
  HQ auth session. No marketing/tracking cookies on the apex. `<Analytics/>`
  isn't even in the layout tree.

## Cross-repo (cannot be done from the apex repo — flagged)
- `tasks.` / `roadmap.` / `analytics.` / `notes.` robots.txt
  `Disallow: /` + noindex-until-public **must live in their own
  repos** (separate Vercel deployments). Out of this apex-only goal's
  reach — same class of cross-repo finding as the P5 blank-OG bug.
  Owed: a sweep adding a `robots.ts` (Disallow:/) to each of the four
  preview repos until they go public. Recommend tracking as a
  follow-up cycle.

No dispatch entry — robots/consent hygiene is invisible infra and
/privacy did not change (silence is brand).
