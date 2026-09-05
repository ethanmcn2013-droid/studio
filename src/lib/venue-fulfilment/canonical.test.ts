import assert from "node:assert/strict";
import { test } from "node:test";
import { eq } from "drizzle-orm";
import { venueFixture } from "@/test/venue-fulfilment-fixture";
import { sponsors, licenseCodes, venueFulfilmentRequests } from "@/lib/entitlements-db/schema";
import { listVerifiedVenueIssuances, readVerifiedVenueIssuance } from "./canonical";
import { manifestHash, venueCodeFingerprint, type IssuanceManifest } from "./protocol";
import { applyVenueFulfilmentMigration } from "../../../scripts/migrate-venue-fulfilment.mjs";

const code="VENUE-ABCDE-FGHJK", now=Date.now();
function manifest(n=1):IssuanceManifest{return {version:1,issuanceId:"vi-"+String(n).padStart(32,"0"),sponsorId:"s-fixture",sponsorSlug:"fixture",sponsorName:"Synthetic venue",environment:"internal_test",
 issuedAt:now,eligibility:{kind:"standard",reference:"event-fixture",startsAt:now-86400000,endsAt:now+86400000},
 tier:"wedding",durationDays:548,codes:[{licenseCodeId:"vlc-"+String(n).padStart(32,"0"),codeFingerprint:venueCodeFingerprint(code)}]};}
async function seed(f:Awaited<ReturnType<typeof venueFixture>>, n=1, fulfilled=true) {
 const m=manifest(n);
 await f.shared.insert(sponsors).values({id:"s-fixture",slug:"fixture",name:"Synthetic venue",contactEmail:"fixture@example.invalid"}).onConflictDoNothing();
 await f.shared.insert(venueFulfilmentRequests).values({id:m.issuanceId,sponsorId:m.sponsorId,studioSponsorId:"local-fixture",requestJson:"{}",manifestJson:JSON.stringify(m),
 manifestHash:manifestHash(m),operatorId:"fixture",operatorName:"Synthetic operator",createdAt:now,updatedAt:now,fulfilledAt:fulfilled?now:null});
 return m;
}
test("0001 reruns as a ledger-backed no-op and immutable manifest updates fail",async()=>{
 const f=await venueFixture();try{
  const m=await seed(f);
  assert.equal((await applyVenueFulfilmentMigration(f.sharedClient)).state,"already_applied");
  assert.equal((await f.shared.select().from(venueFulfilmentRequests)).length,1);
  await assert.rejects(f.shared.update(venueFulfilmentRequests).set({manifestJson:"{}"}).where(eq(venueFulfilmentRequests.id,m.issuanceId)));
  assert.equal((await f.shared.select().from(venueFulfilmentRequests))[0].manifestHash,manifestHash(m));
 }finally{f.cleanup();}
});
test("failed additive transaction rolls back newly created tables and migration receipt",async()=>{
 const f=await venueFixture();try{
  await f.sharedClient.execute("DROP TABLE venue_fulfilment_requests");
  await f.sharedClient.execute("DROP TABLE venue_sponsor_mirrors");
  await f.sharedClient.execute("DELETE FROM signal_additive_migrations");
  await f.sharedClient.execute("CREATE TABLE venue_fulfilment_requests (wrong_column text)");
  await assert.rejects(applyVenueFulfilmentMigration(f.sharedClient));
  assert.equal((await f.sharedClient.execute("SELECT name FROM sqlite_master WHERE name='venue_sponsor_mirrors'")).rows.length,0);
  assert.equal((await f.sharedClient.execute("SELECT * FROM signal_additive_migrations")).rows.length,0);
 }finally{f.cleanup();}
});
test("canonical read verifies exact stored code/sponsor/batch and requires fulfilled readback",async()=>{
 const f=await venueFixture();try{
  const m=await seed(f,1,false), expected=m.codes[0];
  await f.shared.insert(licenseCodes).values({id:expected.licenseCodeId,sponsorId:m.sponsorId,code,sourceType:"venue_edition",tier:"wedding",durationDays:548,batchId:m.issuanceId});
  const input={issuanceId:m.issuanceId,...expected};
  await assert.rejects(readVerifiedVenueIssuance(f.shared,input),/unavailable/);
  await f.shared.update(venueFulfilmentRequests).set({fulfilledAt:now}).where(eq(venueFulfilmentRequests.id,m.issuanceId));
  const result=await readVerifiedVenueIssuance(f.shared,input);
  assert.equal(result?.sponsorId,m.sponsorId);assert.equal(JSON.stringify(result).includes(code),false);
  assert.equal(await readVerifiedVenueIssuance(f.shared,{...input,codeFingerprint:"0".repeat(64)}),null);
  await f.shared.update(licenseCodes).set({batchId:"other"}).where(eq(licenseCodes.id,expected.licenseCodeId));
  assert.equal(await readVerifiedVenueIssuance(f.shared,input),null);
 }finally{f.cleanup();}
});
test("bounded complete pagination does not silently discard pending issuance or store outage",async()=>{
 const f=await venueFixture();try{
  await seed(f,1);await seed(f,2);
  const first=await listVerifiedVenueIssuances(f.shared,{sponsorId:"s-fixture",environment:"internal_test",limit:1});
  assert.equal(first.complete,false);assert.equal(first.issuanceIds.length,1);assert.ok(first.nextCursor);
  const last=await listVerifiedVenueIssuances(f.shared,{sponsorId:"s-fixture",environment:"internal_test",afterId:first.nextCursor!,limit:1});
  assert.equal(last.complete,true);assert.equal(last.issuanceIds.length,1);
  await seed(f,3,false);
  await assert.rejects(listVerifiedVenueIssuances(f.shared,{sponsorId:"s-fixture",environment:"internal_test"}),/unavailable/);
  f.sharedClient.close();
  await assert.rejects(listVerifiedVenueIssuances(f.shared,{sponsorId:"s-fixture",environment:"internal_test"}),/unavailable/);
 }finally{f.cleanup();}
});
