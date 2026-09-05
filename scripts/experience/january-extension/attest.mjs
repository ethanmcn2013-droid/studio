import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { evidence } from './environment.mjs';
import { matrix } from './matrix.mjs';
import { coverageErrors, fileDigest, sourceDigest, buildInputsDigest, toolingDigest } from './receipt.mjs';
import assert from 'node:assert/strict';

const read = file => JSON.parse(readFileSync(file, 'utf8'));
const selected = process.argv.filter(arg => arg.startsWith('--manifest=')).map(arg => arg.slice(11));
if (!selected.length) throw new Error('Pass one or more --manifest= paths; no implicit old receipt adoption');
const manifests = selected.map(read);
if (manifests.some(m => m.pilot)) throw new Error('Pilot receipts cannot close coverage');
const results = manifests.flatMap(m => m.results);
const registry = read('experience/registry.json'), overrides = read('experience/overrides.json'), config = read('experience/config.json');
const digest = sourceDigest();
const build = read(path.join(evidence,'build-receipt.json'));
const identity = {buildId:build.buildId,buildInputsDigest:buildInputsDigest(),toolingDigest:toolingDigest()};
assert.equal(build.sourceDigest,digest,'Build source changed');
assert.equal(build.buildInputsDigest,identity.buildInputsDigest,'Build assets changed');
assert.equal(build.buildId,readFileSync('.next/BUILD_ID','utf8').trim(),'Wrong build artifact');
for (const m of manifests) {
  assert.equal(m.inputsUnchanged,true,'Source or tooling changed during capture');
  assert.equal(m.finishedSourceDigest,digest);assert.equal(m.finishedToolingDigest,identity.toolingDigest);assert.equal(m.finishedBuildInputsDigest,identity.buildInputsDigest);
  assert.equal(m.sourceDigest,digest);
  for(const [key,value] of Object.entries(identity))assert.equal(m[key],value,`Wrong manifest ${key}`);
}
const screenshotDigest = relative => {
  if (path.isAbsolute(relative) || relative.split('/').includes('..') || !/^capture-[^/]+\/screenshots\//.test(relative)) return null;
  const file = path.join(evidence, relative); return existsSync(file) ? fileDigest(file) : null;
};
const outcomes = registry.experiences.filter(e => Object.hasOwn(matrix, e.id)).map(entry => {
  const errors = coverageErrors({ entries: [entry], breakpoints: config.breakpoints, results, digest, screenshotDigest, identity });
  const complete = errors.length === 0;
  if (process.argv.includes('--write')) {
    const coverage = complete ? 'complete' : 'partial';
    const update = { requiredStates: matrix[entry.id], fixtureCoverage: coverage, screenshotCoverage: coverage, accessibilityCoverage: coverage, automatedTestCoverage: coverage };
    Object.assign(entry, update);
    overrides.experiences[entry.id] = { ...overrides.experiences[entry.id], ...update };
  }
  return { id: entry.id, complete, errors };
});
writeFileSync(path.join(evidence, `coverage-${new Date().toISOString().replaceAll(/[:.]/g,'-')}.json`), JSON.stringify({ sourceDigest: digest, ...identity, selected, scriptedOnly: true, humanReview: 'pending', councilReview: 'not performed', outcomes }, null, 2) + '\n');
if (process.argv.includes('--write')) {
  writeFileSync('experience/registry.json', JSON.stringify(registry, null, 2) + '\n');
  writeFileSync('experience/overrides.json', JSON.stringify(overrides, null, 2) + '\n');
}
for (const outcome of outcomes) console.log(`${outcome.id}: ${outcome.complete ? 'complete scripted coverage' : outcome.errors.join('; ')}`);
if (outcomes.some(o => !o.complete)) process.exitCode = 1;
