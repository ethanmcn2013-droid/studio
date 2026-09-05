/* Real canonical SQLite and bounded authenticated App transport, without providers. */
const assert=require("node:assert/strict"),{test}=require("node:test"),{randomUUID}=require("node:crypto");
const {eq}=require("drizzle-orm");
const {studioUsageFixture}=require("./usage-fixture.cjs");
async function fixture(fn) {
 const f=await studioUsageFixture();
 try {
  const protocol=f.load("src/lib/venue-fulfilment/protocol.ts"),auth=f.load("src/lib/sponsored-use/service-auth.ts");
  const now=Date.now(),epoch="abcdef12",secret="synthetic-purpose-separated-usage-secret",code="VENUE-ABCDE-FGHJK";
  const manifest={version:1,issuanceId:"vi-"+"a".repeat(32),sponsorId:"synthetic-sponsor",sponsorSlug:"synthetic",sponsorName:"Synthetic venue",
   environment:"internal_test",issuedAt:now-10*86400000,eligibility:{kind:"pilot",reference:"fixture",startsAt:now-11*86400000,endsAt:now-9*86400000},
   tier:"wedding",durationDays:548,codes:[{licenseCodeId:"vlc-"+"a".repeat(32),codeFingerprint:protocol.venueCodeFingerprint(code)}]};
  await f.database.insert(f.schema.venueFulfilmentRequests).values({id:manifest.issuanceId,sponsorId:manifest.sponsorId,studioSponsorId:"local-fixture",
   requestJson:"{}",manifestJson:JSON.stringify(manifest),manifestHash:protocol.manifestHash(manifest),operatorId:"fixture",operatorName:"Synthetic",
   createdAt:manifest.issuedAt,updatedAt:now,fulfilledAt:now});
  await f.database.insert(f.schema.licenseCodes).values({id:manifest.codes[0].licenseCodeId,sponsorId:manifest.sponsorId,code,sourceType:"venue_edition",
   tier:"wedding",durationDays:548,batchId:manifest.issuanceId});
  const proof={version:1,issuanceId:manifest.issuanceId,...manifest.codes[0],sponsorId:manifest.sponsorId,environment:"internal_test",issuedAt:manifest.issuedAt,
   grantStartsAt:now-86400000,grantEndsAt:now+86400000,subjectIdHash:"b".repeat(32),workspaceIdHash:"c".repeat(32),epoch};
  const state={respond:payload=>payload.eventId?{proof:{...proof,eventId:payload.eventId,eventDigest:"d".repeat(64)}}:{claims:[proof],nextCursor:null},seen:0};
  const deps=f.load("src/lib/account/instrumentation/usage-runtime.ts").createUsageDependencies(f.database,{environment:"internal_test",secret,
   issuanceSecret:"different",appOrigin:"http://app.test",now:()=>now,send:async request=>{
    state.seen++;const checked=await auth.authenticateUsageRequest(request,auth.USAGE_PATHS.provenance,{secret,epoch,now});
    assert.equal(checked.ok,true);return Response.json(state.respond(checked.payload));
   }});
  await fn({...f,manifest,proof,now,epoch,secret,state,deps});
 }finally{f.close();}
}
test("actual canonical adapter binds exact code/project proof and preserves a later couple term after venue lapse",()=>fixture(async f=>{
 const canonical=await f.deps.canonical(f.proof);assert.equal(canonical.sponsorId,f.manifest.sponsorId);
 assert.equal((await f.deps.eligible(f.manifest.sponsorId,f.epoch,f.now-86400000,f.now)).length,1);
 assert.ok(await f.deps.proof(randomUUID(),f.epoch));
 for(const patch of [{status:"revoked"},{batchId:"other"},{code:"VENUE-ABCDE-FGHJM"}]){
  const [before]=await f.database.select().from(f.schema.licenseCodes);
  await f.database.update(f.schema.licenseCodes).set(patch);
  assert.equal(await f.deps.canonical(f.proof),null);
  await f.database.update(f.schema.licenseCodes).set({status:before.status,batchId:before.batchId,code:before.code});
 }
}));
test("pending canonical delivery blocks a complete population rather than hiding an unacknowledged issuance",()=>fixture(async f=>{
 await f.database.update(f.schema.venueFulfilmentRequests).set({fulfilledAt:null});
 await assert.rejects(()=>f.deps.eligible(f.manifest.sponsorId,f.epoch,f.now-86400000,f.now),/unavailable/);
 assert.equal(f.state.seen,0);
}));
test("bounded population rejects partial, duplicated, wrong scope and oversized authenticated App responses",()=>fixture(async f=>{
 for(const respond of [
  ()=>({claims:[f.proof],nextCursor:"20"}),()=>({claims:[f.proof,f.proof],nextCursor:null}),
  ()=>({claims:[{...f.proof,sponsorId:"different"}],nextCursor:null}),
  ()=>({claims:[{...f.proof,epoch:"00000000"}],nextCursor:null}),
  ()=>({claims:[{...f.proof,issuanceId:"vi-"+"e".repeat(32)}],nextCursor:null}),
  ()=>({claims:[f.proof],nextCursor:null,padding:"x".repeat(17000)}),
 ]) {f.state.respond=respond;await assert.rejects(()=>f.deps.eligible(f.manifest.sponsorId,f.epoch,f.now-86400000,f.now));}
}));
test("actual maintenance still expires raw data when enabled capture configuration is incomplete",()=>fixture(async f=>{
 const previous={flag:process.env.SPONSOR_USAGE_EVENTS,cron:process.env.CRON_SECRET,env:process.env.SPONSOR_USAGE_ENVIRONMENT};
 try{
  process.env.SPONSOR_USAGE_EVENTS="1";process.env.CRON_SECRET="synthetic-cron";delete process.env.SPONSOR_USAGE_ENVIRONMENT;
  await f.database.insert(f.schema.sponsorUsageEvents).values({eventId:randomUUID(),instrumentationVersion:"instrumentation.v1",product:"tasks",kind:"task_created",
   occurredAt:f.now-36*86400000,subjectIdHash:f.proof.subjectIdHash,workspaceIdHash:f.proof.workspaceIdHash,hashSaltEpoch:f.epoch,
   localDate:"2026-01-01",ingestedAt:f.now,attributionState:"unattributed"});
  const result=await f.load("src/app/api/cron/sponsored-use/route.ts").GET(new Request("http://studio.test/api/cron/sponsored-use",{headers:{authorization:"Bearer synthetic-cron"}}));
  assert.equal(result.status,503);assert.equal((await f.database.select().from(f.schema.sponsorUsageEvents)).length,0);
 }finally{for(const [key,value] of [["SPONSOR_USAGE_EVENTS",previous.flag],["CRON_SECRET",previous.cron],["SPONSOR_USAGE_ENVIRONMENT",previous.env]])
  if(value===undefined)delete process.env[key];else process.env[key]=value;}
}));
