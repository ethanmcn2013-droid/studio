# Verification workflow rollout · 2026-07-11

Committed workflows:

- `studio/.github/workflows/verify.yml`
- `notes/.github/workflows/verify.yml`
- `tasks/.github/workflows/verify.yml`
- `roadmap/.github/workflows/verify.yml`
- `analytics/.github/workflows/verify.yml`

Each workflow performs a clean dependency install, typecheck, repository test
suite, and production build. GitHub-hosted execution is still required before
this item can be marked complete; local Windows execution cannot prove the
remote workflow result.
