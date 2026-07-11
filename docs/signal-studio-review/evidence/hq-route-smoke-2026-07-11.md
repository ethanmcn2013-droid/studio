# HQ platform-readiness route smoke · 2026-07-11

- Command: `corepack pnpm build`, then `next start -H 127.0.0.1 -p 4187`
- Request: `GET /hq/platform-readiness`
- Result: HTTP `307` to `/hq/access`
- Interpretation: route is included in the production build and protected by
  the existing HQ access boundary. Authenticated rendering still requires a
  real session and remains a production verification gate.
