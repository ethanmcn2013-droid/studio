# P9 · Deps + secrets — findings (2026-05-16)

- **npm audit**: clean (`No known vulnerabilities found`) — holds from
  the bb84733 next 16.2.6 bump + postcss override. No accepted-risk
  doc needed; nothing outstanding.
- **depcheck**: flagged `@eslint/eslintrc`, `@tailwindcss/postcss`,
  `tailwindcss`, `@types/react-dom` as unused devDeps and `server-only`
  as missing. **All false positives** — used via PostCSS / ESLint flat
  config / type-only paths depcheck can't trace; `server-only` is
  provided transitively by `next`. **Removed nothing** — removing any
  would break the build. (depcheck on a Tailwind4 + ESLint-flat +
  Next repo always shows exactly these.)
- **.nvmrc**: created → `22`. Local dev runs Node 24, but Vercel's
  default runtime is Node 22 LTS; pinning dev to the prod runtime is
  the correct reproducibility target. `engines.node` set `>=20.9.0`
  (Next 16 floor) — permissive enough not to disrupt the parallel
  workstream while documenting the minimum.
- **.github/dependabot.yml**: created — weekly npm + github-actions,
  grouped (next / react / dev-minor-patch) to keep PR noise low for a
  solo repo, `deps` commit prefix.
- **.gitignore**: already ignores `.env*`, `.vercel`, `/.next/`,
  `/node_modules` — all four P9 targets present. No change needed.
- **Secrets over history**: clean. Working-tree scan (real credential
  patterns) empty. History scan for this project's secret env names
  with literal values returned only documentation placeholders
  (`TURSO_STUDIO_AUTH_TOKEN=<token from step 1>` etc.) in a setup
  handoff doc — template text, not credentials. No rotation needed.
- No dispatch entry: dependency/CI hygiene is invisible to users and
  leadership (silence is brand).
