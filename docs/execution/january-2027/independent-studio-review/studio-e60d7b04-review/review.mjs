import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { hashFile } from './source/scripts/experience/lib.mjs';
import { coverageErrors, fileDigest } from './source/scripts/experience/january/receipt.mjs';
import { captureRunFailures } from './source/scripts/experience/capture-approval.mjs';
import { matrix } from './source/scripts/experience/january/matrix.mjs';

const gitRepo = 'C:/Users/ethan/signal-studio-workspace/studio';
const head = 'e60d7b04e1d80a0f84f0bb56fcc36c230aee4f64';
const base = '2a191a3479aa4cb3ce551e6e3ae629e39132e64e';
const root = path.resolve(import.meta.dirname, 'source');
const read = relative => JSON.parse(readFileSync(path.join(root, relative), 'utf8'));
const git = args => execFileSync('git', ['-C', gitRepo, ...args], {encoding:'utf8', maxBuffer:32*1024*1024});
const paths = git(['ls-tree','-r','--name-only',head,'--','src','content','contracts','package.json','pnpm-lock.yaml','pnpm-workspace.yaml','next.config.ts']).trim().split('\n').sort();
const digest = createHash('sha256').update(paths.map(file => `${file}:${hashFile(path.join(root,file))}`).join('\n')).digest('hex');
const registry = read('experience/registry.json');
for (const file of ['experience/registry.json','experience/overrides.json','scripts/experience/january/matrix.mjs']) {
  assert.equal(git(['show',`${head}:${file}`]),git(['show',`${base}:${file}`]),`${file} changed`);
}
const config = read('experience/config.json');
const commercialDir = 'experience/reviews/january-commercial-2026-09-04';
const atlasDir = 'experience/reviews/january-atlas-render-2026-09-04';
const build = read(`${commercialDir}/build-receipt.json`);
assert.equal(build.sourceDigest,digest);
assert.deepEqual(build, read(`${atlasDir}/build-receipt.json`));
const manifest = read(`${commercialDir}/capture-manifest.json`);
const atlas = read(`${atlasDir}/atlas-manifest.json`);
const entries = registry.experiences.filter(e => Object.hasOwn(matrix,e.id));
const safeImage = dir => relative => {
  assert.ok(relative.startsWith('screenshots/') && !relative.split('/').includes('..'));
  return fileDigest(path.join(root,dir,relative));
};
assert.deepEqual(coverageErrors({entries,breakpoints:config.breakpoints,results:manifest.results,digest,screenshotDigest:safeImage(commercialDir)}),[]);
assert.equal(manifest.results.length,188);
assert.equal(atlas.results.length,4);
let images=0, canceled=0, incomplete=0;
const sourceRows=[];
for(const [data,dir] of [[manifest,commercialDir],[atlas,atlasDir]]) {
  assert.equal(data.buildId,build.buildId);
  assert.equal(data.approvedBy,null);
  assert.ok(Date.parse(data.capturedAt)>Date.parse(build.builtAt));
  assert.deepEqual(captureRunFailures(data.results),[]);
  for(const row of data.results) {
    assert.equal(row.sourceDigest,digest);
    const entry=registry.experiences.find(e=>e.id===row.experienceId);
    assert.equal(row.materialityHash,hashFile(path.join(root,entry.source.replace(/^studio\//,''))));
    assert.deepEqual(row.viewport,config.breakpoints[row.breakpoint]);
    assert.equal(safeImage(dir)(row.candidateScreenshot),row.candidateHash);
    const bytes=readFileSync(path.join(root,dir,row.candidateScreenshot));
    assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
    assert.equal(bytes.readUInt32BE(16),row.viewport.width);
    assert.equal(bytes.readUInt32BE(20),row.viewport.height);
    images++;
    for(const image of row.additionalScreenshots??[]){assert.equal(safeImage(dir)(image.path),image.hash);images++;}
    assert.equal(row.runtime.blocked.length,0);
    assert.equal(row.runtime.httpErrors.length,0);
    for(const request of row.runtime.failedRequests??[]) {
      assert.equal(request.error,'net::ERR_ABORTED');
      const url=new URL(request.url);assert.equal(url.origin,new URL(row.url).origin);assert.ok(url.searchParams.has('_rsc'));canceled++;
    }
    incomplete += row.accessibility.incomplete.length;
    if(row.state==='restricted') {assert.equal(new URL(row.finalUrl).pathname,'/hq/access');assert.ok(row.interactions.some(i=>i.includes('no HQ content')));}
    if(dir===atlasDir){
      assert.equal(row.state,'default');
      assert.ok(row.interactions.some(i=>i.includes('14.0')));
      assert.ok(row.interactions.some(i=>i.includes('ArrowRight')));
      if(row.breakpoint==='mobile') assert.ok(row.interactions.some(i=>i.includes('Native Chromium touch swipe')));
      sourceRows.push({breakpoint:row.breakpoint,interactions:row.interactions,incomplete:row.accessibility.incomplete});
    }
  }
}
assert.equal(new Set(atlas.results.map(r=>r.breakpoint)).size,4);
console.log(JSON.stringify({head,base,digest,sourceFiles:paths.length,buildId:build.buildId,builtAt:build.builtAt,commercialCapturedAt:manifest.capturedAt,atlasCapturedAt:atlas.capturedAt,commercialCases:188,atlasCases:4,verifiedImageReferences:images,retainedCanceledRscRequests:canceled,incompleteAxeEntries:incomplete,registryOverridesAndStateMatrixUnchanged:true,atlas:sourceRows},null,2));
