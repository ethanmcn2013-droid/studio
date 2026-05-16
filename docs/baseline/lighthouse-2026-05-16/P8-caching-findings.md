# P8 · Caching — findings (2026-05-16)

Verified against a local production server (real headers, not assumed).

| Surface              | Cache-Control                          | Source        |
|----------------------|----------------------------------------|---------------|
| /_next/static/* hash | public, max-age=31536000, immutable    | platform ✓    |
| /brand/*.svg         | public, max-age=31536000, immutable    | **added P8 ✓**|
| HTML document /      | s-maxage=31536000                      | Next default ✓|

- Hashed assets + static-HTML CDN caching are Vercel/Next platform
  defaults — correct already, fighting them via next.config is fragile.
- The real gap was /public/brand (default `max-age=0, must-revalidate`
  because public assets aren't content-hashed). Fixed with an explicit
  immutable rule; contract documented: a changed logo must change
  filename.
- `stale-while-revalidate` deliberately NOT forced onto HTML. These
  are fully static prerendered pages; `s-maxage=31536000` (deploy-
  busted by Vercel) is already optimal. SWR would not improve static
  pages and risks post-deploy staleness. Disciplined omission, not a
  miss.
- Vercel Image Optimization is on by default; `Vary: Accept` is auto-
  added by the image optimizer on /_next/image. The apex is near-
  imageless (1 inline SVG), so this is correct-by-default, nothing to
  toggle.
- No dispatch entry: caching headers are invisible infra hygiene, not
  user/leadership-facing (silence is brand).
