import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, basename, sep } from 'node:path';
import test from 'node:test';
import { classifyScope } from './ci-scope.mjs';
import { baselineAvailable } from './ci-baseline.mjs';

function fixture(t, omitted = []) {
  const directory = mkdtempSync(join(tmpdir(), 'studio-ci-fixture-'));
  t.after(() => {
    if (!resolve(directory).startsWith(resolve(tmpdir()) + sep) || !basename(directory).startsWith('studio-ci-fixture-')) throw Error('Unexpected fixture cleanup target');
    rmSync(directory, { recursive: true, force: true });
  });
  const git = args => execFileSync('git', ['-C', directory, ...args], { encoding: 'utf8', windowsHide: true }).trim();
  mkdirSync(join(directory, 'empty-template'));
  git(['init', '-q', '--template', join(directory, 'empty-template')]);
  git(['config', 'core.hooksPath', join(directory, 'empty-template')]);
  git(['config', 'core.autocrlf', 'false']); git(['config', 'commit.gpgsign', 'false']);
  git(['config', 'user.name', 'Workflow Test']); git(['config', 'user.email', 'workflow@example.invalid']);
  mkdirSync(join(directory, '.agents'));
  for (const file of ['AGENTS.md', 'CLAUDE.md', '.agents/product-marketing.md', 'runtime.js'].filter(file => !omitted.includes(file))) writeFileSync(join(directory, file), 'baseline\n');
  const commit = () => { git(['add', '-A']); git(['commit', '-qm', 'fixture']); return git(['rev-parse', 'HEAD']); };
  return { directory, git, commit, base: commit() };
}

test('only existing modified instruction files can omit rendered checks', t => {
  const f = fixture(t);
  for (const file of ['AGENTS.md', 'CLAUDE.md', '.agents/product-marketing.md']) writeFileSync(join(f.directory, file), 'updated\n');
  const head = f.commit();
  for (const event of ['pull_request', 'push']) assert.deepEqual(classifyScope({ repository: f.directory, base: f.base, head, event }), { renderedRequired: false, reason: 'modified-existing-instructions-only' });
});

test('runtime, additions, deletion, rename, mode and invalid instruction bytes require rendering', async t => {
  for (const kind of ['runtime', 'new', 'new-approved-path', 'delete', 'rename', 'binary', 'invalid-utf8', 'executable']) await t.test(kind, sub => {
    const f = fixture(sub, kind === 'new-approved-path' ? ['CLAUDE.md'] : []);
    if (kind === 'runtime') writeFileSync(join(f.directory, 'runtime.js'), 'changed\n');
    if (kind === 'new') writeFileSync(join(f.directory, '.agents/new-guide.md'), 'new\n');
    if (kind === 'new-approved-path') writeFileSync(join(f.directory, 'CLAUDE.md'), 'new\n');
    if (kind === 'delete') f.git(['rm', 'AGENTS.md']);
    if (kind === 'rename') f.git(['mv', 'AGENTS.md', 'old-guide.md']);
    if (kind === 'binary') writeFileSync(join(f.directory, 'AGENTS.md'), Buffer.from([65, 0, 66]));
    if (kind === 'invalid-utf8') writeFileSync(join(f.directory, 'AGENTS.md'), Buffer.from([65, 255]));
    let head;
    if (kind === 'executable') { f.git(['update-index', '--chmod=+x', 'AGENTS.md']); f.git(['commit', '-qm', 'mode fixture']); head = f.git(['rev-parse', 'HEAD']); }
    else head = f.commit();
    assert.equal(classifyScope({ repository: f.directory, base: f.base, head, event: 'pull_request' }).renderedRequired, true);
  });
});

test('actual workflow shell uses trusted base policy and fails closed during bootstrap and manual runs', async t => {
  const quality = readFileSync(new URL('../.github/workflows/design-quality.yml', import.meta.url), 'utf8');
  const script = quality.match(/# scope-classifier:start\r?\n([\s\S]*?)\s*# scope-classifier:end/)[1].replace(/^ {10}/gm, '').trim();
  const bash = process.platform === 'win32' ? 'C:/Program Files/Git/bin/bash.exe' : 'bash';
  for (const kind of ['instructions', 'malicious-head-policy', 'missing-base-policy', 'manual']) await t.test(kind, sub => {
    const f = fixture(sub);
    mkdirSync(join(f.directory, 'scripts'));
    let base = f.base;
    if (kind !== 'missing-base-policy') { writeFileSync(join(f.directory, 'scripts/ci-scope.mjs'), readFileSync(new URL('./ci-scope.mjs', import.meta.url))); base = f.commit(); }
    writeFileSync(join(f.directory, 'AGENTS.md'), 'changed\n');
    if (kind === 'malicious-head-policy') writeFileSync(join(f.directory, 'scripts/ci-scope.mjs'), 'console.log("rendered_required=false");\n');
    const head = f.commit();
    const runner = join(f.directory, 'runner'); mkdirSync(runner);
    const output = join(runner, 'output'); writeFileSync(output, '');
    const posix = value => value.replace(/\\/g, '/');
    const result = spawnSync(bash, ['-e', '-o', 'pipefail', '-c', script], { cwd: f.directory, env: { ...process.env, BASE_SHA: base, HEAD_SHA: head, EVENT_NAME: kind === 'manual' ? 'workflow_dispatch' : 'pull_request', GITHUB_WORKSPACE: posix(f.directory), RUNNER_TEMP: posix(runner), GITHUB_OUTPUT: posix(output) }, encoding: 'utf8', windowsHide: true });
    assert.ifError(result.error); assert.equal(result.status, 0, result.stderr);
    assert.match(readFileSync(output, 'utf8'), new RegExp(`^rendered_required=${kind === 'instructions' ? 'false' : 'true'}$`, 'm'));
  });
});

test('empty, missing, malformed and manual ranges fail closed', t => {
  const f = fixture(t), known = { repository: f.directory, base: f.base, head: f.base, event: 'pull_request' };
  for (const change of [{}, { base: '' }, { base: '0'.repeat(40) }, { base: 'a'.repeat(40) }, { head: '--help' }, { event: 'workflow_dispatch' }, { event: 'unknown' }]) assert.equal(classifyScope({ ...known, ...change }).renderedRequired, true);
});

test('a different runtime in the actual checkout requires rendering even when the supplied head changes only instructions', t => {
  const f = fixture(t);
  writeFileSync(join(f.directory, 'AGENTS.md'), 'updated\n'); const head = f.commit();
  writeFileSync(join(f.directory, 'runtime.js'), 'later checkout code\n'); f.commit();
  assert.equal(classifyScope({ repository: f.directory, base: f.base, head, event: 'pull_request' }).renderedRequired, true);
});

test('only the latest exact-base native successful check qualifies a rendered baseline', async t => {
  const base = 'a'.repeat(40), good = { id: 1, name: 'design quality', head_sha: base, app: { id: 15368, slug: 'github-actions' }, status: 'completed', conclusion: 'success' };
  const cases = [
    ['success', { total_count: 1, check_runs: [good] }, true],
    ['missing', { total_count: 0, check_runs: [] }, false],
    ['failure', { total_count: 1, check_runs: [{ ...good, conclusion: 'failure' }] }, false],
    ['cancelled', { total_count: 1, check_runs: [{ ...good, conclusion: 'cancelled' }] }, false],
    ['in-progress', { total_count: 1, check_runs: [{ ...good, status: 'in_progress' }] }, false],
    ['wrong-source', { total_count: 1, check_runs: [{ ...good, head_sha: 'b'.repeat(40) }] }, false],
    ['wrong-app', { total_count: 1, check_runs: [{ ...good, app: { id: 7, slug: 'github-actions' } }] }, false],
    ['older-success-later-failure', { total_count: 2, check_runs: [good, { ...good, id: 2, conclusion: 'failure' }] }, false],
    ['ambiguous-duplicate', { total_count: 2, check_runs: [good, good] }, false],
    ['truncated-page', { total_count: 2, check_runs: [good] }, false],
    ['malformed', {}, false],
  ];
  for (const [name, payload, expected] of cases) await t.test(name, () => assert.equal(baselineAvailable(payload, base), expected));
});

test('actual baseline workflow shell falls back to rendering on transport, malformed and failed check responses', async t => {
  const quality = readFileSync(new URL('../.github/workflows/design-quality.yml', import.meta.url), 'utf8');
  const script = quality.match(/# rendered-baseline:start\r?\n([\s\S]*?)\s*# rendered-baseline:end/)[1].replace(/^ {10}/gm, '').trim();
  const mock = 'gh() { if [ "$BASELINE_TRANSPORT" = "failure" ]; then return 1; fi; printf "%s" "$BASELINE_PAYLOAD"; };\n';
  const bash = process.platform === 'win32' ? 'C:/Program Files/Git/bin/bash.exe' : 'bash';
  for (const kind of ['success', 'transport-failure', 'malformed', 'failed-check']) await t.test(kind, sub => {
    const f = fixture(sub); mkdirSync(join(f.directory, 'scripts'));
    writeFileSync(join(f.directory, 'scripts/ci-baseline.mjs'), readFileSync(new URL('./ci-baseline.mjs', import.meta.url)));
    const runner = join(f.directory, 'runner'); mkdirSync(runner);
    const output = join(runner, 'output'); writeFileSync(output, '');
    const payload = { total_count: 1, check_runs: [{ id: 1, name: 'design quality', head_sha: f.base, app: { id: 15368, slug: 'github-actions' }, status: 'completed', conclusion: kind === 'failed-check' ? 'failure' : 'success' }] };
    const posix = value => value.replace(/\\/g, '/');
    const result = spawnSync(bash, ['-e', '-o', 'pipefail', '-c', mock + script], { cwd: f.directory, env: { ...process.env, BASE_SHA: f.base, GITHUB_REPOSITORY: 'workflow-test/studio-fixture', RUNNER_TEMP: posix(runner), GITHUB_OUTPUT: posix(output), BASELINE_TRANSPORT: kind === 'transport-failure' ? 'failure' : 'success', BASELINE_PAYLOAD: kind === 'malformed' ? 'not-json' : JSON.stringify(payload) }, encoding: 'utf8', windowsHide: true });
    assert.ifError(result.error); assert.equal(result.status, 0, result.stderr);
    assert.match(readFileSync(output, 'utf8'), new RegExp(`^available=${kind === 'success' ? 'true' : 'false'}$`, 'm'));
  });
});

test('required compatibility job runs the actual fail-closed shell', t => {
  const workflow = readFileSync(new URL('../.github/workflows/verify.yml', import.meta.url), 'utf8');
  const script = workflow.match(/# compatibility-status:start\r?\n([\s\S]*?)\s*# compatibility-status:end/)[1].replace(/^ {10}/gm, '').trim();
  const bash = process.platform === 'win32' ? 'C:/Program Files/Git/bin/bash.exe' : 'bash';
  for (const status of ['success', 'failure', 'cancelled', 'skipped', '', 'unknown']) {
    const result = spawnSync(bash, ['-c', script], { env: { ...process.env, VERIFY_RESULT: status }, encoding: 'utf8', windowsHide: true });
    assert.ifError(result.error); assert.equal(result.status, status === 'success' ? 0 : 1, status);
  }
  assert.match(workflow, /needs: verify/); assert.match(workflow, /if: \$\{\{ always\(\) \}\}/);
});

test('canonical Verify retains unique gates and quality classifiers are trusted and conservative', () => {
  const verify = readFileSync(new URL('../.github/workflows/verify.yml', import.meta.url), 'utf8');
  for (const command of ['pnpm remediation:check', 'pnpm recovery:drill', 'pnpm typecheck', 'pnpm run ds:check', 'pnpm test', 'pnpm build', 'pnpm run lint']) assert.ok(verify.includes(command), command);
  const quality = readFileSync(new URL('../.github/workflows/design-quality.yml', import.meta.url), 'utf8');
  assert.ok(quality.includes('git show "${BASE_SHA}:scripts/ci-scope.mjs"'));
  assert.match(quality, /rendered_required=true/);
  assert.equal((quality.match(/if: \$\{\{ steps\.scope\.outputs\.rendered_required != 'false' \|\| steps\.baseline\.outputs\.available != 'true' \}\}/g) || []).length, 2);
  assert.ok(quality.indexOf('actions/setup-node@v4') < quality.indexOf('id: scope'));
  assert.match(quality, /checks: read/); assert.match(quality, /contents: read/);
  for (const command of ['experience:validate', 'experience:self-test', 'experience:audit', 'ux:assure']) assert.ok(quality.includes(command));
  assert.match(quality, /github\.event_name == 'workflow_dispatch'/);
  assert.match(quality, /retention-days: 14/); assert.match(quality, /retention-days: 7/);
});
