/* Test-only real SQLite service harness. */
const assert=require("node:assert/strict"),{test}=require("node:test"),{randomUUID}=require("node:crypto");
const {studioUsageFixture}=require("./usage-fixture.cjs");
const {eq}=require("drizzle-orm");
const now=Date.parse("2026-09-10T07:00:00Z"),occurredAt=Date.parse("2026-09-09T12:00:00Z");
const secret="synthetic-usage-secret-at-least-thirty-two",epoch="abcdef12";
async function fixture(fn){
 const f=await studioUsageFixture();
 try{
  const transport=f.load("src/lib/sponsored-use/service-auth.ts");
  const event={eventId:randomUUID(),instrumentationVersion:"instrumentation.v1",product:"tasks",kind:"task_created",occurredAt,
   subjectIdHash:"a".repeat(32),workspaceIdHash:"b".repeat(32)};
  const proof={version:1,issuanceId:"vi-"+"c".repeat(32),licenseCodeId:"vlc-"+"d".repeat(32),codeFingerprint:"e".repeat(64),
   sponsorId:"synthetic-sponsor",environment:"internal_test",issuedAt:occurredAt-2*86400000,
   grantStartsAt:occurredAt-86400000,grantEndsAt:occurredAt+86400000,subjectIdHash:event.subjectIdHash,workspaceIdHash:event.workspaceIdHash,
   epoch,eventId:event.eventId,eventDigest:transport.digest(JSON.stringify(event))};
  const state={proof:()=>proof,canonical:()=>({...proof,timezone:"Europe/Dublin"}),eligible:3};
  const deps={environment:"internal_test",proof:async(...args)=>state.proof(...args),canonical:async(...args)=>state.canonical(...args),
   eligible:async()=>Array.from({length:state.eligible},(_,i)=>({...proof,workspaceIdHash:i===0?proof.workspaceIdHash:String(i).padStart(32,"0")}))};
  const handlers=f.load("src/lib/account/instrumentation/usage-handlers.ts").usageHandlers(f.database,deps,{enabled:true,secret,epochs:[epoch],now});
  const request=(payload=event,path=transport.USAGE_PATHS.ingest)=>transport.signedUsageRequest("http://studio.test"+path,payload,secret,epoch,now);
  await fn({...f,event,proof,state,deps,handlers,transport,request,job:()=>f.load("src/lib/account/instrumentation/usage-jobs.ts").closeUsageDays(f.database,deps,now)});
 }finally{f.close();}
}
test("signed ingest dedupes exact replay and conflicts on another body sharing its event id",()=>fixture(async f=>{
 assert.equal((await f.handlers.ingest(f.request())).status,200);
 assert.equal((await f.handlers.ingest(f.request())).status,200);
 assert.equal((await f.handlers.ingest(f.request({...f.event,workspaceIdHash:"f".repeat(32)}))).status,409);
 const rows=await f.database.select().from(f.schema.sponsorUsageEvents);assert.equal(rows.length,1);assert.equal(rows[0].sponsorId,"synthetic-sponsor");
}));
test("parallel signed deliveries converge after retry without holding a writer during provenance",()=>fixture(async f=>{
 const results=await Promise.all([f.handlers.ingest(f.request()),f.handlers.ingest(f.request())]);
 assert.ok(results.some(r=>r.status===200));
 assert.equal((await f.handlers.ingest(f.request())).status,200);
 assert.equal((await f.database.select().from(f.schema.sponsorUsageEvents)).length,1);
}));
test("initial and repair enforce the same actor/project/digest/epoch/issuance/interval rules",()=>fixture(async f=>{
 const variations=[
  {subjectIdHash:"1".repeat(32)},{workspaceIdHash:"2".repeat(32)},{eventDigest:"3".repeat(64)},
  {epoch:"00000000"},{environment:"production"},{grantStartsAt:f.event.occurredAt+60000},
  {grantEndsAt:f.event.occurredAt},{issuanceId:"vi-"+"9".repeat(32)},
 ];
 for(const patch of variations){
  f.state.proof=()=>({...f.proof,...patch});
  assert.equal((await f.handlers.ingest(f.request())).status,200);
  await f.load("src/lib/account/instrumentation/verified-ingest.ts").repairVerifiedUsage(f.database,f.deps,now);
  assert.equal((await f.database.select().from(f.schema.sponsorUsageEvents))[0].sponsorId,null);
 }
 f.state.proof=()=>f.proof;
 await f.load("src/lib/account/instrumentation/verified-ingest.ts").repairVerifiedUsage(f.database,f.deps,now);
 assert.equal((await f.database.select().from(f.schema.sponsorUsageEvents))[0].sponsorId,"synthetic-sponsor");
}));
test("App or canonical mirror outage returns generic503 without falsely acknowledging an event",()=>fixture(async f=>{
 for(const key of ["proof","canonical"]){
  const prior=f.state[key];f.state[key]=()=>{throw Error("SQL PRIVATE CODE OWNER");};
  const response=await f.handlers.ingest(f.request());assert.equal(response.status,503);assert.deepEqual(await response.json(),{ok:false});
  assert.equal((await f.database.select().from(f.schema.sponsorUsageEvents)).length,0);f.state[key]=prior;
 }
}));
test("only valid minute-rounded Tasks creation within35days is accepted by transport",()=>fixture(async f=>{
 for(const patch of [{product:"notes",kind:"note_created"},{kind:"task_completed"},{occurredAt:occurredAt+1},
  {occurredAt:now-36*86400000},{occurredAt:now+3600000},{rawCode:"PRIVATE"},{eventId:"private-task-id"}]){
  assert.equal((await f.handlers.ingest(f.request({...f.event,...patch}))).status,400);
 }
 assert.equal((await f.database.select().from(f.schema.sponsorUsageEvents)).length,0);
}));
test("closed-day aggregate/lifecycle persistence is atomic and retryable after partial DB failure",()=>fixture(async f=>{
 await f.handlers.ingest(f.request());
 await f.client.execute("CREATE TRIGGER fail_rollup BEFORE INSERT ON sponsor_workspace_lifecycle BEGIN SELECT RAISE(ABORT,'fixture'); END");
 await assert.rejects(f.job);assert.equal((await f.database.select().from(f.schema.sponsorUsageDaily)).length,0);
 await f.client.execute("DROP TRIGGER fail_rollup");await f.job();await f.job();
 const [daily]=await f.database.select().from(f.schema.sponsorUsageDaily);
 assert.equal(daily.meaningfulActions,1);assert.equal(daily.eligibleWorkspaces,3);
 assert.equal(daily.coverageMask,2);assert.equal(daily.expectedMask,15);assert.equal(daily.notesActions,null);
 assert.equal((await f.database.select().from(f.schema.sponsorWorkspaceLifecycle)).length,1);
}));
test("erasure defeats a delivery already waiting on provenance and removes pseudonymous facts",()=>fixture(async f=>{
 let release,started;const ready=new Promise(r=>started=r);
 f.state.proof=async()=>{started();await new Promise(r=>release=r);return f.proof;};
 const flight=f.handlers.ingest(f.request());await ready;
 assert.equal((await f.handlers.erase(f.request({subjectIdHash:f.event.subjectIdHash},f.transport.USAGE_PATHS.erase))).status,200);
 release();assert.equal((await flight).status,200);
 assert.equal((await f.database.select().from(f.schema.sponsorUsageEvents)).length,0);
 f.state.proof=()=>f.proof;await f.handlers.ingest(f.request());
 assert.equal((await f.database.select().from(f.schema.sponsorUsageEvents)).length,0);
}));
test("real erasure removes raw events/lifecycle/index, keeps anonymous aggregates, and is idempotent",()=>fixture(async f=>{
 await f.handlers.ingest(f.request());await f.job();
 for(let i=0;i<2;i++)await f.handlers.erase(f.request({subjectIdHash:f.event.subjectIdHash},f.transport.USAGE_PATHS.erase));
 assert.equal((await f.database.select().from(f.schema.sponsorUsageEvents)).length,0);
 assert.equal((await f.database.select().from(f.schema.sponsorWorkspaceLifecycle)).length,0);
 const storage=f.load("src/lib/account/instrumentation/storage-schema.ts");
 assert.equal((await f.database.select().from(storage.usageSubjectWorkspaces)).length,0);
 assert.equal((await f.database.select().from(f.schema.sponsorUsageDaily)).length,1);
}));
test("raw35day and aggregate24month retention runs even if provenance repair is down",()=>fixture(async f=>{
 await f.handlers.ingest(f.request());await f.job();
 await f.database.update(f.schema.sponsorUsageEvents).set({occurredAt:now-36*86400000,sponsorId:null,attributionState:"unattributed"});
 await f.database.update(f.schema.sponsorUsageDaily).set({localDate:"2023-01-01"});
 await f.database.update(f.schema.sponsorWorkspaceLifecycle).set({updatedAt:Date.parse("2023-01-01")});
 await f.database.insert(f.schema.sponsorUsageEvents).values({...f.event,eventId:randomUUID(),hashSaltEpoch:epoch,ingestedAt:now,
  localDate:"2026-09-09",attributionState:"unattributed",attributionReason:"canonical-proof-unavailable"});
 f.state.proof=()=>{throw Error("unavailable");};
 await assert.rejects(f.job,/unavailable/);
 assert.equal((await f.database.select().from(f.schema.sponsorUsageEvents)).length,1); // fresh pending evidence remains
 assert.equal((await f.database.select().from(f.schema.sponsorUsageDaily)).length,0);
 assert.equal((await f.database.select().from(f.schema.sponsorWorkspaceLifecycle)).length,0);
}));

test("erasure between population lookup and commit removes its contribution and cannot recreate lifecycle",()=>fixture(async f=>{
 await f.handlers.ingest(f.request());
 f.deps.eligible=async()=>{
  await f.handlers.erase(f.request({subjectIdHash:f.event.subjectIdHash},f.transport.USAGE_PATHS.erase));
  return [f.proof];
 };
 await f.job();
 assert.equal((await f.database.select().from(f.schema.sponsorUsageDaily)).length,0);
 assert.equal((await f.database.select().from(f.schema.sponsorWorkspaceLifecycle)).length,0);
}));

test("exact historical replay does not rewrite verified sponsor facts after current claim revocation",()=>fixture(async f=>{
 await f.handlers.ingest(f.request());
 f.state.proof=()=>null;
 assert.equal((await f.handlers.ingest(f.request())).status,200);
 assert.equal((await f.database.select().from(f.schema.sponsorUsageEvents))[0].sponsorId,"synthetic-sponsor");
}));

test("mixed salt epochs and unobserved closed days cannot become complete or fabricated quiet days",()=>fixture(async f=>{
 await f.handlers.ingest(f.request());await f.job();
 await f.database.insert(f.schema.sponsorUsageEvents).values({...f.event,eventId:randomUUID(),hashSaltEpoch:"12345678",ingestedAt:now,
  localDate:"2026-09-09",sponsorId:"synthetic-sponsor",attributionState:"attributed"});
 await f.job();
 assert.equal((await f.database.select().from(f.schema.sponsorUsageDaily)).length,0);
}));

test("a silent Tasks-only cohort closes as indeterminate without needing a later raw event",()=>fixture(async f=>{
 await f.handlers.ingest(f.request());await f.job();
 await f.database.delete(f.schema.sponsorUsageEvents);
 const later=now+40*86400000;
 await f.load("src/lib/account/instrumentation/usage-jobs.ts").closeUsageDays(f.database,f.deps,later);
 const [life]=await f.database.select().from(f.schema.sponsorWorkspaceLifecycle);
 assert.equal(life.day30State,"indeterminate");assert.equal(life.day30SealedAt,later);
}));

test("late delivery and rollup retries cannot outlive App's24-month erasure link",()=>fixture(async f=>{
 await f.handlers.ingest(f.request());await f.job();
 const storage=f.load("src/lib/account/instrumentation/storage-schema.ts");
 const later=now+20*86400000;
 await f.load("src/lib/account/instrumentation/usage-jobs.ts").closeUsageDays(f.database,f.deps,later);
 const deadline=new Date(f.event.occurredAt);deadline.setUTCMonth(deadline.getUTCMonth()+24);
 await f.load("src/lib/account/instrumentation/usage-erasure.ts").retainUsage(f.database,deadline.getTime()+60000);
 assert.equal((await f.database.select().from(storage.usageSubjectWorkspaces)).length,0);
 assert.equal((await f.database.select().from(f.schema.sponsorWorkspaceLifecycle)).length,0);
}));
test("private projection/export suppresses2 and measures3 with Tasks-only lower bounds; rates4/5",()=>fixture(async f=>{
 await f.handlers.ingest(f.request());
 const access=(await f.load("src/lib/account/live/load-venue-access.ts").loadVenueAccessSnapshot("synthetic")).snapshot;
 for(const population of [2,3]){
  f.state.eligible=population;await f.job();
  const snap=await f.load("src/lib/account/live/load-venue-usage.ts").overlayStoredUsage(f.database,"synthetic",access,now);
  assert.equal(snap.adoption.activeRecently.state,population===2?"withheld":"lower_bound");
  if(population===2)assert.ok(!("value" in snap.adoption.activeRecently));
  assert.equal(snap.productReach.find(r=>r.product==="Notes").workspacesReached.state,"unavailable");
  const csv=f.load("src/lib/account/csv.ts").snapshotToCsv(snap);
  const html=f.load("src/lib/account/pdf-html.ts").snapshotToReportHtml(snap);
  for(const text of [JSON.stringify(snap),csv,html])for(const sensitive of [f.event.subjectIdHash,f.event.workspaceIdHash,f.proof.codeFingerprint])assert.ok(!text.includes(sensitive));
 }
 const metric=f.load("src/lib/account/instrumentation/daily-metrics.ts").continuedAfter30Days;
 for(const n of [4,5]){
  const result=metric({window:{start:"2026-01-01",end:"2026-01-31",trailing:false},rows:[],lifecycle:Array.from({length:n},(_,i)=>({
   workspaceIdHash:String(i),firstActionLocalDate:"2026-01-01",lastActionLocalDate:"2026-01-30",productLastActionLocalDate:{tasks:"2026-01-30"},day30State:"returned",day30SealedAt:now}))});
  assert.equal(result.state,n===4?"withheld":"exact");
  if(n===4)assert.ok(!("value" in result));
 }
}));
