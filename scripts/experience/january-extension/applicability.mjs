import {readFileSync,writeFileSync} from 'node:fs';
import {matrix} from './matrix.mjs';

// Source-backed applicability only. This never approves source hashes, audits,
// screenshots or council review. Coverage is written separately by attest.mjs.
const registry=JSON.parse(readFileSync('experience/registry.json','utf8'));
const overrides=JSON.parse(readFileSync('experience/overrides.json','utf8'));
for(const entry of registry.experiences.filter(e=>Object.hasOwn(matrix,e.id))) {
  const update={requiredStates:matrix[entry.id]};
  if(entry.id==='studio.page.hq-org-by-slug')Object.assign(update,{
    archetype:'detail-or-record-view',primaryJob:'Read a Director profile, responsibilities and operating remit.',
    primaryAction:'Read the profile and follow its related HQ links.',
  });
  if(entry.id==='studio.page.hq-waitlist')Object.assign(update,{
    primaryJob:'Read recorded waitlist entries and their source context.',
    primaryAction:'Inspect the entries returned by the single awaited waitlist read.',
  });
  Object.assign(entry,update);
  overrides.experiences[entry.id]={...overrides.experiences[entry.id],...update};
}
writeFileSync('experience/registry.json',JSON.stringify(registry,null,2)+'\n');
writeFileSync('experience/overrides.json',JSON.stringify(overrides,null,2)+'\n');
console.log('Updated applicability for the 14 owned surfaces; approval fields untouched.');
