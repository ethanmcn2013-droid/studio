import assert from 'node:assert/strict';
import test from 'node:test';
import { venueKitMatrix } from './venue-kit-matrix.mjs';
import { coverageErrors } from './receipt.mjs';
import { scenarioFor } from './matrix.mjs';

const entry = { id: 'studio.page.hq-venue-kit' };
const breakpoints = { mobile: {width:390,height:844},tablet:{width:768,height:1024},desktop:{width:1280,height:900},wide:{width:1440,height:960} };
const valid = () => venueKitMatrix[entry.id].flatMap(state => Object.entries(breakpoints).map(([breakpoint,viewport]) => ({
  experienceId:entry.id,state,breakpoint,viewport,sourceDigest:'current',url:'http://127.0.0.1:4466/hq/venue-kit',
  pass:true,status:200,accessibility:{blocking:0},runtime:{overflowPixels:0,reducedMotion:state==='reduced-motion'},
  fixture:{scenario:scenarioFor(state),synthetic:true,providerCalls:0},candidateScreenshot:'screenshots/proof.png',candidateHash:'bytes',interactions:['actual state proof'],
})));
const check=results=>coverageErrors({entries:[entry],breakpoints,results,digest:'current',screenshotDigest:()=> 'bytes',requiredMatrix:venueKitMatrix});
test('Venue kit requires real authored, motion, keyboard and access states at all four widths',()=>{
  assert.deepEqual(venueKitMatrix[entry.id],['default','long-content','reduced-motion','keyboard-only','restricted']);
  assert.equal(valid().length,20);assert.deepEqual(check(valid()),[]);
});
test('a missing access or keyboard case cannot be replaced by another screenshot',()=>{
  for(const state of ['restricted','keyboard-only']){const rows=valid().filter(r=>r.state!==state);assert.ok(check(rows).length);}
  const rows=valid();rows[0]=structuredClone(rows[1]);assert.ok(check(rows).length);
});
test('stale copy, changed evidence, missing interaction and accessibility failures prevent adoption',()=>{
  for(const mutate of [r=>r.sourceDigest='old',r=>r.candidateHash='old',r=>r.interactions=[],r=>r.accessibility.blocking=1,r=>r.fixture.providerCalls=1]){
    const rows=valid();mutate(rows.find(r=>r.state==='keyboard-only'));assert.ok(check(rows).length);
  }
});
