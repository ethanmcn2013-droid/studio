# Lint baseline — 2026-07-11

The Studio lint command now uses the supported flat-config invocation (`eslint .`) rather than the removed Next.js `next lint` command. The command executes on Windows and reports the existing repository baseline: 33 errors and 6 warnings across legacy surfaces. This is intentionally not a completion receipt for SS-P4-001; the P4 gate remains open until the full suite lint baseline is remediated or an explicit exception is approved.

Verification command:

```text
corepack pnpm lint
```

Result: command runs, expected non-zero exit while the known baseline remains.
