// Read-only CI verification of a committed capture. A fresh build remains
// mandatory for capture/write; this verifies its source-bound evidence without
// pretending that an unrelated CI build is the artifact served to the browser.
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { REQUIRED_BREAKPOINTS } from './lib.mjs';
import { evidence } from './january-extension/environment.mjs';
import { matrix, variantsFor } from './january-extension/matrix.mjs';
import { coverageErrors, fileDigest, sourceDigest, buildInputsDigest, toolingDigest } from './january-extension/receipt.mjs';

const args = process.argv.slice(2);
assert.equal(args.length, 1, 'Pass the exact --manifest= path; no implicit receipt adoption');
assert.ok(args[0].startsWith('--manifest='));
const manifestPath = path.resolve(args[0].slice('--manifest='.length));
const relative = path.relative(evidence, manifestPath).replaceAll('\\', '/');
assert.match(relative, /^capture-[^/]+\/manifest\.json$/, 'Manifest must be a capture in the owning evidence directory');
const read = file => JSON.parse(readFileSync(file, 'utf8'));
const manifest = read(manifestPath);
const build = read(path.join(evidence, 'build-receipt.json'));
const registry = read('experience/registry.json');
const config = read('experience/config.json');
assert.deepEqual(Object.keys(config.breakpoints).sort(), [...REQUIRED_BREAKPOINTS].sort(), 'All four declared breakpoints are required');
const digest = sourceDigest();
const identity = { buildId: build.buildId, buildInputsDigest: buildInputsDigest(), toolingDigest: toolingDigest() };
assert.ok(identity.buildId, 'Missing observed build identity');
assert.equal(build.sourceDigest, digest, 'Build source changed');
assert.equal(build.buildInputsDigest, identity.buildInputsDigest, 'Build assets changed');
assert.notEqual(manifest.pilot, true, 'Pilot evidence cannot close the matrix');
assert.equal(manifest.inputsUnchanged, true, 'Capture inputs changed');
assert.equal(manifest.sourceDigest, digest);
assert.equal(manifest.finishedSourceDigest, digest);
assert.equal(manifest.finishedToolingDigest, identity.toolingDigest);
assert.equal(manifest.finishedBuildInputsDigest, identity.buildInputsDigest);
for (const [key, value] of Object.entries(identity)) assert.equal(manifest[key], value, `Wrong manifest ${key}`);

const entries = registry.experiences.filter(entry => Object.hasOwn(matrix, entry.id));
assert.equal(entries.length, Object.keys(matrix).length, 'Missing registered extension page');
for (const entry of entries) assert.deepEqual([...entry.requiredBreakpoints].sort(), [...REQUIRED_BREAKPOINTS].sort(), `${entry.id}: registry breakpoint requirements changed`);
const required = entries.reduce((count, entry) => count + matrix[entry.id].reduce((sum, state) => sum + variantsFor(entry.id, state).length * Object.keys(config.breakpoints).length, 0), 0);
assert.equal(required, 328, 'The accepted extension requires328 cases');
assert.equal(manifest.results.length, required, 'Capture must contain precisely the complete matrix');
const screenshotDigest = relative => {
  if (path.isAbsolute(relative) || relative.split('/').includes('..') || !/^capture-[^/]+\/screenshots\//.test(relative)) return null;
  const file = path.join(evidence, relative);
  return existsSync(file) ? fileDigest(file) : null;
};
const errors = coverageErrors({ entries, breakpoints: config.breakpoints, results: manifest.results, digest, screenshotDigest, identity });
assert.deepEqual(errors, [], 'Rendered extension evidence is incomplete or stale');
console.log(`Verified ${required} scripted cases across ${entries.length} Studio pages; no human/council approval inferred.`);
