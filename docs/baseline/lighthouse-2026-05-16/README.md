# P1 Baseline — Performance & Security Hardening · 2026-05-16

Pre-change baseline for the signalstudio.ie hardening goal. Measured against
**production** (live site), not local. No code changed in P1.

## Lighthouse (mobile default, Lighthouse 12, 7 routes)

| Route     | Perf | A11y | BP  | SEO | LCP   | CLS   | TBT    |
|-----------|------|------|-----|-----|-------|-------|--------|
| /         | 94   | 96   | 100 | 100 | 2.5 s | 0.071 | 70 ms  |
| /work     | 98   | 98   | 100 | 100 | 2.2 s | 0     | 110 ms |
| /proof    | 99   | 98   | 100 | 100 | 2.1 s | 0     | 50 ms  |
| /about    | 98   | 98   | 100 | 100 | 2.1 s | 0     | 30 ms  |
| /brand    | 100  | 92   | 100 | 100 | 1.4 s | 0     | 10 ms  |
| /pricing  | 99   | 93   | 100 | 100 | 2.1 s | 0     | 50 ms  |
| /contact  | 98   | 98   | 100 | 100 | 2.2 s | 0     | 50 ms  |

Per-route `.report.html` + `.report.json` saved alongside this file.

**Read:** baseline is already strong. Against the targets (LCP ≤2.5 / CLS ≤0.1
/ TBT ≤200):
- **Homepage is the only at-risk page.** LCP 2.5 s sits exactly on the
  ceiling — zero margin on real slow-4G; CLS 0.071 is the only non-zero shift
  in the suite (passing, but the only page that moves). This is where P5/P6/P7
  pay back.
- TBT comfortably under 200 ms everywhere (worst /work 110 ms).
- INP not measurable in lab Lighthouse (field metric) — defer to WebPageTest.
- A11y dips: /brand 92, /pricing 93. Not a P1 line item; flag for a later
  accessibility pass (out of this goal's explicit scope unless folded in).

## Security headers (apex + 4 subdomains)

Raw headers captured in `security-headers-2026-05-16.txt` (substantive
equivalent of a securityheaders.com screenshot — gradeable, diffable, and
not dependent on a third-party render).

Grade read (apex, signalstudio.ie):
- HSTS `max-age=63072000; includeSubDomains; preload` — A+ shape ✓
- X-Content-Type-Options nosniff ✓ · X-Frame-Options DENY ✓
- Referrer-Policy strict-origin-when-cross-origin ✓
- Permissions-Policy present but **missing `payment=()`** (P2 adds it)
- **CSP is Report-Only on apex** — not enforced. P2's job is to verify clean
  for ≥1 deploy cycle then promote. `upgrade-insecure-requests` intentionally
  absent in report-only mode (config comment confirms) — re-add on promotion.
- No `X-Powered-By` leak ✓ · Server: Vercel.

Subdomain notes:
- **notes.** already runs **enforced** CSP and already allows Cloudflare
  Turnstile (`challenges.cloudflare.com`) — Turnstile precedent exists in the
  suite; P3 should mirror Notes' setup, not invent one.
- tasks./roadmap./analytics. CSP still Report-Only, Clerk/Stripe/Sentry
  hosts allowlisted.
- **All four subdomains return HTTP 200 publicly and are indexable** — P10
  robots/noindex work is real and needed (private preview, currently open).

## Dependency audit (`pnpm audit --prod`)

**2 vulnerabilities — 1 high, 1 moderate.** Full JSON + summary saved.

1. **HIGH — `next` 16.2.5**: Middleware/Proxy bypass in App Router via
   segment-prefetch routes (GHSA, vulnerable `>=16.0.0 <16.2.6`). **Fixed in
   16.2.6.** This repo ships `src/proxy.ts` (a real Proxy/Middleware) — the
   vulnerable surface is live, not theoretical. `eslint-config-next` is
   already on `^16.2.6`; this is a one-line `next` bump. **Single most urgent
   finding in the whole baseline.** (Belongs to P9, but flagged up here.)
2. **MODERATE — `postcss` <8.5.10**: XSS via unescaped `</style>` in
   stringify output, transitive via `next`. Patched ≥8.5.10. Resolves with
   the Next bump or a pnpm override.

## Bundle / initial JS

Turbopack production builds **omit the Size / First-Load-JS table** (this is
exactly why P1 calls for `@next/bundle-analyzer`). Rather than mutate
`next.config.ts` mid-baseline, initial JS was measured directly off the live
homepage (real gzipped transfer, the actual target metric):

- **Homepage initial JS ≈ 192.2 KB gzipped vs ≤150 KB target — ~28% over.**
- Largest single chunks: `0fuvf5~zp8e-c.js` 71.6 KB, `03~yq9q893hmn.js`
  39.8 KB, `025~3v5s7ezvq.js` 31.3 KB gzipped.
- Caveat: this counts all `/_next/static/*.js` referenced in the homepage
  document; some may be prefetch hints for other routes, so the true
  *initial* figure is ≤192 KB. P6 will get the exact split via the analyzer.
- Likely suspects given deps: `gsap` (3.13.0) + `lenis` (1.1.20) — The
  Reveal's animation stack — and `mermaid` (^11.15.0), which is large and
  should not be on the marketing critical path. P6 to confirm.

Build route map: `next-build-2026-05-16.txt`.

## P1 verdict

Site is in good shape. Three things actually move the needle:
1. **Next.js 16.2.5 → 16.2.6** — closes a live HIGH-sev proxy-bypass + the
   postcss moderate in one bump. This is urgent enough to consider pulling
   ahead of its P9 slot.
2. **Homepage JS ~28% over budget** — the one real performance gap (P5/P6).
3. **Subdomains publicly indexable** — privacy/preview hygiene (P10).

Everything else (headers, Lighthouse) is refinement, not repair.
