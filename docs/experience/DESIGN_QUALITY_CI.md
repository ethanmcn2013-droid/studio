# Design Quality CI

Design Quality CI is a fail-closed evidence pipeline. It protects the registry and known-debt ratchet today; rendered product capture and strict visual no-regression require explicit execution and enforcement.

Sources: [`package.json`](../../package.json), [`design-quality.yml`](../../.github/workflows/design-quality.yml), [`playwright.config.ts`](../../playwright.config.ts), [`experience/conformance.json`](../../experience/conformance.json), and [`scripts/experience/`](../../scripts/experience/).

## Implemented commands

Run commands from the `studio` repository root.

| Command | Implemented behavior | Writes files? |
|---|---|---|
| `pnpm run experience:discover` | Discovers inventory and prints metrics | No |
| `pnpm run experience:discover -- --write` | Rebuilds the generated registry from config, explicit surfaces, and overrides | Yes: `experience/registry.json` |
| `pnpm run experience:validate` | Compares the full registry with discovery and validates references/coverage | No |
| `pnpm run experience:validate -- --product=studio` | Runs the same discovery validation for Studio entries only | No |
| `pnpm run experience:self-test` | Validates JSON schemas, proves an unregistered route and retired token are rejected, and tests the Signal Review adapter | Temporary fixtures only |
| `pnpm run experience:capture` | Captures the pilot set at four breakpoints with Axe/runtime evidence and visual comparison | Yes: candidates, diffs, manifest |
| `pnpm run experience:capture -- --experience=<id> --breakpoint=<id>` | Re-captures a selected pilot experience and/or breakpoint | Yes |
| `pnpm run experience:audit -- --enforce` | Validates audit/finding/review structure and fails new unbaselined high-risk debt | Yes: report and gallery |
| `pnpm run experience:report` | Regenerates the report/gallery without `--enforce` | Yes |
| `pnpm run experience:ingest-review -- <export.json> [--write]` | Previews or imports Signal Review findings/reviews | With `--write` |
| `pnpm run experience:verify-hq` | Verifies the authenticated local HQ quality room; requires `SIGNAL_HQ_PASSWORD` | No |
| `pnpm run ux:assure` | Converts deterministic capture failures into specialist-routed observations and a human-review queue | Yes: UX assurance report |
| `pnpm run test:accessibility` | Runs Playwright tests tagged `accessibility` | Test artifacts |
| `pnpm run test:visual` | Runs Playwright tests tagged `visual` | Test artifacts |
| `pnpm run design:quality` | Runs validation, schema/fail-closed self-tests, enforced audit, enforced UX assurance, and the Playwright harness | Report/test artifacts |

Baseline approval is intentionally separate:

```powershell
$env:SIGNAL_EXPERIENCE_BASELINE_APPROVED_BY = "<founder identity>"
pnpm run experience:capture -- --approve
```

`--approve` exits unless the approver environment variable is present.

## Current GitHub workflow

The checked-in `design-quality` workflow currently:

1. installs the frozen pnpm lockfile on Node 22;
2. runs `experience:validate -- --product=studio`;
3. runs `experience:self-test`;
4. runs `experience:audit -- --enforce`;
5. runs `ux:assure -- --enforce`;
6. installs deterministic Chromium;
7. runs the Playwright accessibility/visual harness; and
8. uploads the quality report and Playwright evidence for 14 days.

The workflow does **not** currently run `experience:capture`, and it does not set `EXPERIENCE_ENFORCE_CAPTURE=1`. Therefore it must not be described as strict cross-product screenshot no-regression CI yet.

## Strict no-regression mode

The audit implementation can fail capture regressions when the manifest exists and the enforcement flag is set:

```powershell
$env:EXPERIENCE_ENFORCE_CAPTURE = "1"
pnpm run experience:audit -- --enforce
```

Strict mode fails a capture result that does not pass, and a changed visual without a matching review whose status is `approved` or `resolved`. Activating this in required CI also requires deterministic target environments, fixtures, credentials, and a fresh capture manifest; setting the flag without those prerequisites creates noise rather than assurance.

## Failure matrix

| Gate | Blocks on |
|---|---|
| Discovery validation | Unregistered/obsolete surfaces, broken sources, invalid IDs/metadata, missing breakpoints, unknown or expired references, uncovered material changes |
| Conformance self-test | A deliberate unregistered route or retired design token is not rejected |
| Audit structure | Duplicate/unknown records, invalid dimensions/scores, incorrect pass/mean, missing evidence, stale baseline references, malformed exceptions/reviews |
| Enforced finding ratchet | New open `release-blocking` or `high` finding outside the allowed baseline |
| Capture pass | Navigation/HTTP failure, overflow, serious/critical Axe issue, or page error |
| Strict capture ratchet | Failed capture or unapproved visual change |
| UX assurance | Deterministic release-blocking/high observations, including runtime/console errors, blocking Axe issues, route failures, or overflow |
| Playwright harness | Accessibility repair proof or deterministic visual fixture regresses |

Console errors and missing baselines are not capture-pass conditions. Enforced UX assurance promotes console errors to high observations; missing baselines remain Definition-of-Done gaps until reviewed and approved.

## Central contract, federated checks

Signal HQ owns the schemas, taxonomy, registry assembly, reports, and cross-suite gate as a private founder-operator control plane. Tasks, Timeline, Signal, and Notes are the four customer products; their repositories own deterministic fixtures and fast PR checks close to the code they change. Studio owns equivalent checks for its public company surface. Signal Review supplies manual-review evidence as an internal instrument. The target required-check shape is:

1. product PR: local discovery/fixture/accessibility/visual checks;
2. central Studio integration: schema, registry, finding/baseline ratchets, and evidence aggregation;
3. human review: subjective dimensions, golden approval, and exceptions.

Studio, Tasks, Timeline, Signal, and Notes now have codebase-local design-quality workflows for their registry and available fixture/design-system ratchets. The shared design-system package has its own package/ESM/component CI. [`experience/conformance.json`](../../experience/conformance.json) records the latest reproducible command result for the six governed repositories; the aggregate report exposes that rate, while the local workflows prevent the recorded legacy value counts from growing.

Those product checks do not yet provide complete state-by-breakpoint rendered capture. Central green CI is therefore evidence about inventory, ratchets, and the current pilot harness—not proof that every product experience is Studio grade.

## Branch protection

Once stable, the `design-quality` job should be required on protected branches. Do not make a flaky remote capture required; first pin target environments, fixture identities, fonts/assets, credentials, and retry ownership. Exceptions to CI must use the same expiring exception ledger as experience findings.

The founder/operator work needed to cross that boundary is canonical in [Provision authenticated experience capture access](../../content/hq/operator-todos/provision-authenticated-experience-capture.md) and [Approve the first Signal visual baselines](../../content/hq/operator-todos/approve-experience-visual-baselines.md). Until those tasks close, CI must report incomplete authenticated/visual coverage rather than implying it.
