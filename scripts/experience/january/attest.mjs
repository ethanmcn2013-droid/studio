import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { evidence } from './environment.mjs';
import { matrix as januaryMatrix } from './matrix.mjs';
import { venueKitMatrix } from './venue-kit-matrix.mjs';
import { coverageErrors, fileDigest, sourceDigest } from './receipt.mjs';
import { hashFile } from '../lib.mjs';

const read = file => JSON.parse(readFileSync(file, 'utf8'));
const matrix = process.argv.includes('--venue-kit') ? venueKitMatrix : januaryMatrix;
const registry = read('experience/registry.json');
const overrides = read('experience/overrides.json');
const config = read('experience/config.json');
const manifest = read(path.join(evidence, 'capture-manifest.json'));
const digest = sourceDigest();
const screenshotDigest = relative => {
  if (!relative.startsWith('screenshots/') || relative.split('/').includes('..') || path.isAbsolute(relative)) return null;
  const file = path.join(evidence, relative);
  return existsSync(file) ? fileDigest(file) : null;
};
const outcomes = [];
for (const entry of registry.experiences.filter(entry => Object.hasOwn(matrix, entry.id))) {
  const errors = coverageErrors({ entries: [entry], breakpoints: config.breakpoints, results: manifest.results, digest, screenshotDigest, requiredMatrix: matrix });
  outcomes.push({ id: entry.id, complete: errors.length === 0, errors });
  if (process.argv.includes('--write')) {
    const coverage = errors.length === 0 ? 'complete' : 'partial';
    const update = { requiredStates: matrix[entry.id], fixtureCoverage: coverage, screenshotCoverage: coverage, accessibilityCoverage: coverage, automatedTestCoverage: coverage };
    if (process.argv.includes('--venue-kit') && errors.length === 0) {
      Object.assign(update, {
        materialityHash: hashFile(entry.source.replace(/^studio\//, '')),
        primaryJob: 'Review held venue collateral against current January terms and launch decisions.',
        primaryAction: 'Read the current guidance and inspect retained local collateral specimens.',
      });
    }
    // Venue materiality is adopted only after its fresh matrix passes. Keep
    // review dates, audit status, approval references and findings unchanged.
    // Machine coverage is not human or council acceptance.
    Object.assign(entry, update);
    overrides.experiences[entry.id] = { ...overrides.experiences[entry.id], ...update };
  }
}
writeFileSync(path.join(evidence, 'coverage.json'), JSON.stringify({ sourceDigest: digest, scriptedOnly: true, humanReview: 'pending', councilReview: 'not performed', outcomes }, null, 2) + '\n');
if (process.argv.includes('--write')) {
  writeFileSync('experience/registry.json', JSON.stringify(registry, null, 2) + '\n');
  writeFileSync('experience/overrides.json', JSON.stringify(overrides, null, 2) + '\n');
}
for (const outcome of outcomes) console.log(`${outcome.id}: ${outcome.complete ? 'complete scripted coverage' : outcome.errors.join('; ')}`);
if (outcomes.some(outcome => !outcome.complete)) process.exitCode = 1;
