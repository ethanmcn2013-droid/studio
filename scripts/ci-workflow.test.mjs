import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, basename, sep } from 'node:path';
import test from 'node:test';
import { classifyScope } from './ci-scope.mjs';

function fixture(t) {
  const directory = mkdtempSync(join(tmpdir(), 'studio-ci-fixture-'));
  t.after(() => {
    if (!resolve(directory).startsWith(resolve(tmpdir()) + sep) || !basename(directory).startsWith('studio-ci-fixture-')) throw Error('Unexpected fixture cleanup target');
    rmSync(directory, { recursive: true, force: true });
  });
  const git = args => execFileSync('git', ['-C', directory, ...args], { encoding: 'utf8', windowsHide: true }).trim();
  git(['init', '-q']); git(['config', 'user.name', 'Workflow Test']); git(['config', 'user.email', 'workflow@example.invalid']);
  mkdirSync(join(directory, '.agents'));
  for (const file of ['AGENTS.md', 'CLAUDE.md', '.agents/product-marketing.md', 'runtime.js']) writeFileSync(join(directory, file), 'baseline\n');
  const commit = () => { git(['add', '-A']); git(['commit', '-qm', 'fixture']); return git(['rev-parse', 'HEAD']); };
  return { directory, git, commit, base: commit() };
}

test('only existing modified instruction files can omit rendered checks', t => {
  const f = fixture(t);
  for (const file of ['AGENTS.md', 'CLAUDE.md', '.agents/product-marketing.md']) writeFileSync(join(f.directory, file), 'updated\n');
  const head = f.commit();
  for (const event of ['pull_request', 'push']) assert.deepEqual(classifyScope({ repository: f.directory, base: f.base, head, event }), { renderedRequired: false, reason: 'modified-existing-instructions-only' });
});

test('runtime, new files, deletion, rename and binary instruction changes require rendering', async t => {
  for (const kind of ['runtime', 'new', 'delete', 'rename', 'binary']) await t.test(kind, sub => {
    const f = fixture(sub);
    if (kind === 'runtime') writeFileSync(join(f.directory, 'runtime.js'), 'changed\n');
    if (kind === 'new') writeFileSync(join(f.directory, '.agents/new-guide.md'), 'new\n');
    if (kind === 'delete') f.git(['rm', 'AGENTS.md']);
    if (kind === 'rename') f.git(['mv', 'AGENTS.md', 'old-guide.md']);
    if (kind === 'binary') writeFileSync(join(f.directory, 'AGENTS.md'), Buffer.from([65, 0, 66]));
    assert.equal(classifyScope({ repository: f.directory, base: f.base, head: f.commit(), event: 'pull_request' }).renderedRequired, true);
  });
});

test('empty, missing, malformed and manual ranges fail closed', t => {
  const f = fixture(t), known = { repository: f.directory, base: f.base, head: f.base, event: 'pull_request' };
  for (const change of [{}, { base: '' }, { base: '0'.repeat(40) }, { base: 'a'.repeat(40) }, { head: '--help' }, { event: 'workflow_dispatch' }, { event: 'unknown' }]) assert.equal(classifyScope({ ...known, ...change }).renderedRequired, true);
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
  assert.equal((quality.match(/if: \$\{\{ steps\.scope\.outputs\.rendered_required != 'false' \}\}/g) || []).length, 2);
  for (const command of ['experience:validate', 'experience:self-test', 'experience:audit', 'ux:assure']) assert.ok(quality.includes(command));
  assert.match(quality, /github\.event_name == 'workflow_dispatch'/);
  assert.match(quality, /retention-days: 14/); assert.match(quality, /retention-days: 7/);
});
