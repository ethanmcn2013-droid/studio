import assert from 'node:assert/strict';
import test from 'node:test';
import { coverageErrors } from './receipt.mjs';
import { matrix, scenarioFor, variantsFor } from './matrix.mjs';

const entry = { id: 'studio.page.hq-waitlist', route: '/hq/waitlist' };
const viewport = { width: 390, height: 844 };
const identity = {buildId:'build',buildInputsDigest:'inputs',toolingDigest:'tooling'};
const valid = () => matrix[entry.id].map(state => {
  const count = state === 'error' ? null : state === 'empty' ? 0 : ['dense', 'long-content'].includes(state) ? 36 : 3;
  return { experienceId: entry.id, state, variant:'default', breakpoint: 'mobile', viewport, sourceDigest: 'source', ...identity, servedBuildId:identity.buildId, materialStateProved:true, url: 'http://127.0.0.1:4416/hq/waitlist', finalUrl: 'http://127.0.0.1:4416'+(state === 'restricted' ? '/hq/access' : '/hq/waitlist'), pass: true, status: 200, accessibility: { blocking: 0 }, runtime: { overflowPixels: 0, reducedMotion: state === 'reduced-motion' }, fixture: { synthetic: true, providerCalls: 0, scenario: scenarioFor(state,entry.id), expectedWaitlistCount: count }, candidateScreenshot: 'capture-a/screenshots/proof.png', candidateHash: 'png', interactions: [{ realWaitlistRead: count }] };
});
const errors = results => coverageErrors({ entries: [entry], breakpoints: { mobile: viewport }, results, digest: 'source', screenshotDigest: () => 'png', identity });
test('all eight waitlist branches require actual matching receipts', () => assert.deepEqual(errors(valid()), []));
test('missing and duplicate cases cannot close coverage', () => { const rows = valid(); assert.ok(errors(rows.slice(1)).length); assert.ok(errors([...rows, rows[0]]).length); });
test('source, viewport, route and screenshot must match', () => {
  for (const mutation of [{ sourceDigest: 'old' }, { viewport: { width: 1440, height: 900 } }, { finalUrl: 'http://127.0.0.1:4416/hq' }, { url:'https://preview.invalid/hq/waitlist' }, { candidateHash: 'different' }, {materialStateProved:false}, {variant:'invented'}, ...Object.keys(identity).map(key=>({[key]:'old'})), {servedBuildId:'another listener'}]) {
    const rows = valid(); Object.assign(rows[0], mutation); assert.ok(errors(rows).length);
  }
});
test('unobserved branch, unsafe fixture and motion failures are rejected', () => {
  const cases = [r => r[0].fixture.providerCalls++, r => r[0].fixture.expectedWaitlistCount++, r => r[0].interactions = [], r => r.find(x => x.state === 'reduced-motion').runtime.reducedMotion = false];
  for (const change of cases) { const rows = valid(); change(rows); assert.ok(errors(rows).length); }
});
test('application faults remain failures; only canceled local RSC prefetch is nonblocking', () => {
  const rows = valid(); rows[0].runtime.failedRequests = [{ url: 'http://127.0.0.1:4416/hq?_rsc=1', error: 'net::ERR_ABORTED' }]; assert.deepEqual(errors(rows), []);
  rows[0].runtime.failedRequests[0].url = 'http://127.0.0.1:4416/asset.png'; assert.ok(errors(rows).length);
  for (const field of ['consoleErrors', 'pageErrors', 'httpErrors', 'blocked']) { const r = valid(); r[0].runtime[field] = ['fault']; assert.ok(errors(r).length); }
});
test('only the 14 extension pages and all four declared widths are in scope', () => {
  assert.equal(Object.keys(matrix).length, 14);
  assert.equal(Object.entries(matrix).reduce((sum, [id,states]) => sum + states.reduce((n,s)=>n+variantsFor(id,s).length*4,0), 0), 328);
  for (const id of ['studio.page.hq', 'studio.page.students', 'studio.page.hq-blueprint']) assert.equal(matrix[id], undefined);
});
