# Landing feedback verification — 8 September 2026

Final source verification completed in `worktrees/studio/fix-landing-timeline-dot-favicon`. The favicon and footer changes are included in HEAD `cdfde2e2582956b807bba190f1f9db488da723f5`; the verified timeline CSS/runtime changes were still uncommitted when these checks ran. Browser evidence is indexed in [README.md](README.md).

## Final results

| Check | Result | Evidence |
| --- | --- | --- |
| `pnpm typecheck` | Exit 0 | [typecheck-final.log](typecheck-final.log) |
| Every segment of the package `test` script, executed directly with serial Node test files | Exit 0; 464 tests passed, 0 failed, 0 skipped | [test-direct-serial.log](test-direct-serial.log) |
| Source contract scripts in that test command | Seven passed; venue-term-parity skipped because the app repository is not beside this isolated Studio worktree | [test-direct-serial.log](test-direct-serial.log) |
| `pnpm build` with one Next.js worker | Exit 0; production compile, build TypeScript and 34/34 static pages completed | [build-final.log](build-final.log) |

The 464 tests comprise four favicon regression tests, 16 migration tests, 406 main TypeScript tests and 38 entitlements tests. The suite's zero skipped **tests** does not include the separate venue-term-parity source script: that script explicitly printed `[venue-term-parity] skipped — app repo not present beside studio`. Cross-repository venue parity remains unverified by this worktree run.

The build compiled in 20.6 seconds and completed its TypeScript phase in 21.7 seconds. It reported the standard edge-runtime/static-generation warning; it did not skip type validation or omit build phases.

## Exact lower-concurrency execution

The package script was read at execution time, so its favicon regression segment and all existing test/source-contract segments were included. Each `&&` segment ran in its original order. `node` commands remained Node commands. `tsx` commands ran through Node's `--import tsx` registration, preserving their remaining arguments, including the server-only import. Every Node test invocation gained `--test-concurrency=1`. The runner stopped at the first nonzero exit.

The following PowerShell runner was used from the task worktree; each resolved invocation is also printed in the log:

```powershell
$testScript = (Get-Content -Raw -LiteralPath 'package.json' | ConvertFrom-Json).scripts.test
& {
  foreach ($segment in ($testScript -split ' && ')) {
    $parts = $segment -split ' '
    $testArgs = [System.Collections.Generic.List[string]]::new()
    if ($parts[0] -eq 'tsx') {
      $testArgs.Add('--import')
      $testArgs.Add('tsx')
    }
    foreach ($part in $parts[1..($parts.Length - 1)]) {
      $testArgs.Add($part)
      if ($part -eq '--test') {
        $testArgs.Add('--test-concurrency=1')
      }
    }
    Write-Output ('Running: node ' + ($testArgs -join ' '))
    & node @testArgs
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  }
} *> 'content/hq/design-reviews/2026-09-08-landing-feedback/test-direct-serial.log'
```

Final typecheck and build ran sequentially after the suite, using:

```powershell
pnpm typecheck *> 'content/hq/design-reviews/2026-09-08-landing-feedback/typecheck-final.log'

# Applied only to this build process and its children.
$env:CIRCLE_NODE_TOTAL = '2'
pnpm build *> 'content/hq/design-reviews/2026-09-08-landing-feedback/build-final.log'
```

The installed Next.js 16.2.5 default configuration derives its worker count as `max(1, (CIRCLE_NODE_TOTAL || cpuCount) - 1)`. This invocation therefore used one worker, confirmed by the build log. No repository configuration, dependency code, test assertions or type-error handling was changed for verification.

## Initial failures and host diagnosis

The [original default build](build-initial.log) compiled successfully and then failed to spawn its TypeScript child (`spawn UNKNOWN`). The first default test attempt was reported as 340 passes and eight failures. Its full test output was unavailable; this is not recorded as a passing run.

The retained default-command reproduction, [test-diagnostic.log](test-diagnostic.log), completed its 16 migrations, then reported 250 passes and 22 failed test children in the main suite. Those failures were process-startup/native crashes, including V8 heap/commit-allocation failures, `ERR_WORKER_INIT_FAILED`, and failed thread creation. They were not failed application assertions. At diagnosis Windows reported approximately 588 MiB of free virtual/commit memory out of 45 GiB, with approximately 1.2 GiB of free RAM.

The first attempt to serialize the command while retaining the pnpm/tsx wrappers also crashed under memory pressure: [test-serial.log](test-serial.log). This failed attempt is separate from the successful direct serial suite. Four relevant public-interface contract tests additionally passed in isolation: [test-ui-contract.log](test-ui-contract.log).

Removing wrapper-process overhead, serializing test files and stopping the task-owned preview restored sufficient resources for the full suite and build to complete. No separate clean-checkout baseline suite was run. The evidence distinguishing infrastructure failures from a source regression is the changing set of native/process failures, the measured host memory exhaustion, and the complete current-source suite subsequently passing with lower concurrency.

## Production preview handoff

After the successful build, the production preview was started with
`node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3100`
from this worktree. Process **32944** remains running at
<http://127.0.0.1:3100/>. HTTP 200 and a fresh browser render were confirmed;
the production tab contains the revised timeline and Dot, with no browser
console errors or warnings. The server warns only about absent optional
HQ/entitlements credentials, which are not required for this public route.
Start logs: `preview-final.stdout.log` and `preview-final.stderr.log`.
To stop only this preview, use `Stop-Process -Id 32944` after confirming its
command still identifies this worktree's Next server.

The browser's viewport and reduced-motion overrides were reset. All
before/after animation captures came from the same final UI source through
the dev preview; the production build received an additional render check.

## Verified source fingerprints

SHA-256 of the final UI source used by typecheck/build:

| File | SHA-256 |
| --- | --- |
| `src/components/reveal/floor-and-sheet.css` | `6808F21E156A67BA21530B364590A99D4AA60A4A9FEDB2BA00AA065384B7C54D` |
| `src/components/reveal/floor-runtime.ts` | `6ED66BF069981AD4C6645CE60EEA4381994A8E40F03B7830F6D664ED201C8238` |
| `src/components/landing/site-footer.tsx` | `7899C3F9FC9EAB16177C13664D2842596CFE8C18AEBA9A78C8FD46EC945A4CB5` |
