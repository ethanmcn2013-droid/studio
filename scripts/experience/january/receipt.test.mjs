import assert from 'node:assert/strict';
import { test } from 'node:test';
import { coverageErrors } from './receipt.mjs';
import { fixtureEnvironment, localDatabase } from './environment.mjs';
import { matrix, scenarioFor } from './matrix.mjs';

const entry = { id: 'studio.page.students' };
const breakpoints = { mobile: { width: 390, height: 844 }, tablet: { width: 768, height: 1024 }, desktop: { width: 1280, height: 900 }, wide: { width: 1440, height: 960 } };
const valid = () => matrix[entry.id].flatMap(state => Object.entries(breakpoints).map(([breakpoint, viewport]) => ({
  experienceId: entry.id, state, breakpoint, viewport, sourceDigest: 'source', pass: true, status: 200,
  fixture: { scenario: scenarioFor(state), synthetic: true, providerCalls: 0 },
  accessibility: { blocking: 0 }, runtime: { overflowPixels: 0, reducedMotion: state === 'reduced-motion' },
  candidateScreenshot: 'screenshots/example.png', candidateHash: 'image', interactions: ['real assertion receipt'],
})));
const check = results => coverageErrors({ entries: [entry], breakpoints, results, digest: 'source', screenshotDigest: () => 'image' });

test('complete requires all four states at all four exact breakpoints', () => assert.deepEqual(check(valid()), []));
test('a missing mobile keyboard render cannot be certified by other captures', () => assert.match(check(valid().slice(0, -1)).join('\n'), /expected exactly one/));
test('duplicate copies cannot stand in for a required state', () => { const rows = valid(); rows[1] = structuredClone(rows[0]); assert.match(check(rows).join('\n'), /found 2|found 0/); });
test('changed source and changed PNG each invalidate coverage', () => { const rows = valid(); rows[0].sourceDigest = 'other'; rows[1].candidateHash = 'changed'; assert.match(check(rows).join('\n'), /source changed/); assert.match(check(rows).join('\n'), /changed screenshot/); });
test('an invented data state, wrong width, or missing interaction is rejected', () => { const rows = valid(); rows[0].fixture.scenario = 'error'; rows[1].viewport = { width: 390, height: 844 }; rows.at(-1).interactions = []; const errors = check(rows).join('\n'); assert.match(errors, /wrong or unsafe fixture/); assert.match(errors, /wrong viewport/); assert.match(errors, /no interaction evidence/); });
test('runtime and accessibility faults cannot be hidden by pass:true', () => { const rows = valid(); rows[0].runtime.consoleErrors = ['app failure']; rows[1].accessibility.blocking = 1; assert.match(check(rows).join('\n'), /console errors/); assert.match(check(rows).join('\n'), /blocking accessibility/); });
test('only canceled local RSC requests are classified as prefetch cancellation', () => {
  const rows = valid(); rows[0].url = 'http://127.0.0.1:4396/students';
  rows[0].runtime.failedRequests = [{ url: 'http://127.0.0.1:4396/pricing?_rsc=fixture', error: 'net::ERR_ABORTED' }];
  assert.deepEqual(check(rows), []);
  for (const request of [
    { url: 'http://127.0.0.1:4396/_next/font.woff', error: 'net::ERR_ABORTED' },
    { url: 'http://127.0.0.1:4396/pricing?_rsc=fixture', error: 'net::ERR_CONNECTION_RESET' },
    { url: 'https://external.invalid/?_rsc=fixture', error: 'net::ERR_ABORTED' },
  ]) { rows[0].runtime.failedRequests = [request]; assert.match(check(rows).join('\n'), /failed asset or non-prefetch/); }
});
test('reduced motion requires the actual browser preference', () => { const rows = valid(); rows.find(row => row.state === 'reduced-motion').runtime.reducedMotion = false; assert.match(check(rows).join('\n'), /reduced motion not active/); });
test('server environment never inherits operator, DB, payment or mail settings', () => {
  const env = fixtureEnvironment({ PATH: 'runtime', HOME: 'personal', DATABASE_URL: 'libsql://private', STUDIO_DATABASE_URL: 'libsql://private', STRIPE_SECRET_KEY: 'private', VERCEL_API_TOKEN: 'private', RESEND_API_KEY: 'private', SIGNAL_HQ_PASSWORD: 'private' });
  assert.equal(env.PATH, 'runtime');
  assert.equal(env.HOME, undefined);
  assert.equal(env.DATABASE_URL, undefined);
  assert.equal(env.STRIPE_SECRET_KEY, undefined);
  assert.equal(env.RESEND_API_KEY, undefined);
  assert.equal(env.VERCEL_API_TOKEN, undefined);
  assert.match(env.STUDIO_DATABASE_URL, /^file:.*playwright-results\/january-commercial\/studio\.db$/);
  assert.notEqual(env.SIGNAL_HQ_PASSWORD, 'private');
  assert.throws(() => localDatabase('../private'), /Unknown/);
  assert.throws(() => localDatabase('https://provider'), /Unknown/);
});
