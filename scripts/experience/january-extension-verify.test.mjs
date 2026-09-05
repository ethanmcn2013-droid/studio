import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import test from 'node:test';
import { REQUIRED_BREAKPOINTS } from './lib.mjs';
import { matrix, variantsFor, scenarioFor, routeFor } from './january-extension/matrix.mjs';
import { coverageErrors } from './january-extension/receipt.mjs';

// Execute the actual CLI validation body with synthetic filesystem/digest
// adapters. No browser, screenshot capture or database proof is claimed.
const file = fileURLToPath(new URL('./january-extension-verify.mjs', import.meta.url));
const source = readFileSync(file, 'utf8').replace(/^import .*;\r?\n/gm, '');
const registry = JSON.parse(readFileSync(new URL('../../experience/registry.json', import.meta.url)));
const config = JSON.parse(readFileSync(new URL('../../experience/config.json', import.meta.url)));
const evidence = path.resolve('synthetic-wrapper-evidence');
const manifestPath = path.join(evidence, 'capture-synthetic', 'manifest.json');
const digest = 'synthetic-runtime-source';
const identity = { buildId: 'synthetic-build', buildInputsDigest: 'synthetic-inputs', toolingDigest: 'synthetic-tooling' };

function baseline() {
  const results = [];
  for (const entry of registry.experiences.filter(e => matrix[e.id])) for (const state of matrix[entry.id]) for (const variant of variantsFor(entry.id, state)) for (const [breakpoint, viewport] of Object.entries(config.breakpoints)) {
    const origin = entry.id === 'studio.page.hq-access' && state === 'disabled' ? 'http://127.0.0.1:4417' : 'http://127.0.0.1:4416';
    const url = new URL(routeFor(entry.id, state, entry.route), origin).href;
    const count = state === 'error' ? null : state === 'empty' ? 0 : ['long-content', 'dense'].includes(state) ? 36 : 3;
    results.push({ experienceId: entry.id, state, variant, breakpoint, viewport, sourceDigest: digest, ...identity, servedBuildId: identity.buildId,
      materialStateProved: true, url, finalUrl: state === 'restricted' ? origin + '/hq/access' : url,
      pass: true, status: 200, accessibility: { blocking: 0 }, runtime: { overflowPixels: 0, reducedMotion: state === 'reduced-motion' },
      fixture: { synthetic: true, providerCalls: 0, scenario: scenarioFor(state, entry.id, variant), expectedWaitlistCount: count },
      candidateScreenshot: 'capture-synthetic/screenshots/proof.png', candidateHash: 'synthetic-png-hash', interactions: [{ realWaitlistRead: count }] });
  }
  assert.equal(results.length, 328);
  return structuredClone({ registry, config, build: { sourceDigest: digest, ...identity }, manifest: { pilot: false, inputsUnchanged: true, sourceDigest: digest, finishedSourceDigest: digest, finishedBuildInputsDigest: identity.buildInputsDigest, finishedToolingDigest: identity.toolingDigest, ...identity, results }, args: ['--manifest=' + manifestPath], screenshotExists: true, screenshotHash: 'synthetic-png-hash' });
}

function execute(fixture) {
  const documents = new Map([[manifestPath, fixture.manifest], [path.join(evidence, 'build-receipt.json'), fixture.build], ['experience/registry.json', fixture.registry], ['experience/config.json', fixture.config]]);
  try {
    vm.runInNewContext(source, {
      // Only normalize VM realm prototypes at this test boundary. The real
      // wrapper still uses ordinary strict equality with no transformation.
      assert: { ...assert, deepEqual: (a, b, message) => assert.deepEqual(JSON.parse(JSON.stringify(a)), JSON.parse(JSON.stringify(b)), message) },
      path, evidence, matrix, variantsFor, coverageErrors, REQUIRED_BREAKPOINTS,
      process: { argv: ['node', file, ...fixture.args] },
      readFileSync: p => { assert.ok(documents.has(p), `Unexpected read: ${p}`); return JSON.stringify(documents.get(p)); },
      existsSync: () => fixture.screenshotExists,
      fileDigest: () => fixture.screenshotHash,
      sourceDigest: () => digest, buildInputsDigest: () => identity.buildInputsDigest, toolingDigest: () => identity.toolingDigest,
      console: { log: () => {} },
    }, { filename: file });
    return { accepted: true };
  } catch (error) { return { accepted: false, error: error.message }; }
}

function check(name, expectedAccepted, mutate = () => {}, expectedError) {
  test(name, () => {
    const fixture = baseline(); mutate(fixture);
    const result = execute(fixture);
    assert.equal(result.accepted, expectedAccepted, result.error);
    if (expectedError) assert.match(result.error, expectedError);
  });
}

check('complete328-case synthetic verifier fixture', true);
check('missing explicit manifest', false, x => x.args = []);
check('multiple manifests', false, x => x.args.push(x.args[0]));
check('manifest outside owning capture directory', false, x => x.args = ['--manifest=' + path.resolve('unrelated/manifest.json')]);
check('pilot run', false, x => x.manifest.pilot = true);
check('source mismatch', false, x => x.manifest.sourceDigest = 'old');
check('finished source mismatch', false, x => x.manifest.finishedSourceDigest = 'old');
check('build receipt source mismatch', false, x => x.build.sourceDigest = 'old');
check('build input mismatch', false, x => x.build.buildInputsDigest = 'old');
check('tooling mismatch', false, x => x.manifest.toolingDigest = 'old');
check('inputs changed during capture', false, x => x.manifest.inputsUnchanged = false);
check('missing row', false, x => x.manifest.results.pop());
check('duplicate replacing required row', false, x => x.manifest.results[0] = structuredClone(x.manifest.results[1]));
check('wrong served build', false, x => x.manifest.results[0].servedBuildId = 'other-listener');
check('wrong viewport', false, x => x.manifest.results[0].viewport = { width: 1, height: 844 });
check('wrong material state', false, x => x.manifest.results[0].materialStateProved = false);
check('wrong route', false, x => x.manifest.results[0].finalUrl = 'http://127.0.0.1:4416/hq');
check('missing screenshot', false, x => x.screenshotExists = false);
check('changed screenshot bytes/hash', false, x => x.screenshotHash = 'other');
check('provider activity', false, x => x.manifest.results[0].fixture.providerCalls = 1);
check('wrong populated waitlist count', false, x => x.manifest.results.find(r => r.experienceId === 'studio.page.hq-waitlist' && r.state === 'populated').fixture.expectedWaitlistCount = 0);
check('application exception', false, x => x.manifest.results[0].runtime.pageErrors = ['synthetic exception']);
check('reduced-motion filtering state absent', false, x => x.manifest.results.find(r => r.state === 'reduced-motion').runtime.reducedMotion = false);
check('configuration loses wide while registry still requires it', false, x => { delete x.config.breakpoints.wide; x.manifest.results = x.manifest.results.filter(r => r.breakpoint !== 'wide'); }, /All four declared breakpoints are required/);
check('one registered page loses a required width', false, x => x.registry.experiences.find(e => matrix[e.id]).requiredBreakpoints.pop(), /registry breakpoint requirements changed/);
