import assert from "node:assert/strict";
import { test } from "node:test";
import { createVenueRuntime } from "./transport";
import { generateCompCode, CODE_ALPHABET, CODE_BODY_LENGTH, codeEntropyBits, MINIMUM_CODE_ENTROPY_BITS } from "./secure-code";
import { manifestHash, venueCodeFingerprint, type IssuanceManifest } from "./protocol";
import { verifyIssuanceRequest } from "./service-auth";
const now=Date.now(),auth={secret:"synthetic-issuance-".repeat(3),keyEpoch:"test-1",usageSecret:"synthetic-usage-".repeat(3)};
const manifest:IssuanceManifest={version:1,issuanceId:"vi-"+"1".repeat(32),sponsorId:"synthetic",sponsorSlug:"synthetic",sponsorName:"Synthetic venue",environment:"internal_test",
 issuedAt:now,eligibility:{kind:"pilot",reference:"synthetic-pilot",startsAt:now-1000,endsAt:now+1000},tier:"wedding",durationDays:548,
 codes:[{licenseCodeId:"vlc-"+"1".repeat(32),codeFingerprint:venueCodeFingerprint("VENUE-ABCDE-FGHJK")}]};
const ack={version:1,issuanceId:manifest.issuanceId,manifestHash:manifestHash(manifest),checkedAt:now,codes:manifest.codes.map(row=>({...row,state:"available"}))};
const command={operation:"read" as const,issuanceId:manifest.issuanceId,manifestHash:manifestHash(manifest)};
test("transport signs exact body and purpose/path and accepts only an exact bounded 200 acknowledgement",async()=>{
 const good=createVenueRuntime({origin:"https://app.example.invalid",auth,now:()=>now,fetcher:async(url,init)=>{
  assert.equal(String(url),"https://app.example.invalid/api/internal/venue-issuance");
  assert.equal(verifyIssuanceRequest(new Request(url,init),String(init?.body),auth,now),true);
  return Response.json(ack);
 }});
 assert.equal((await good(command,manifest)).issuanceId,manifest.issuanceId);
 for(const response of [Response.json(ack,{status:201}),Response.json({...ack,codes:[]}),Response.json({...ack,extra:true}),
  new Response(JSON.stringify(ack)),Response.json({payload:"x".repeat(25_000)}),Response.json({error:"unavailable"},{status:503})]) {
  const runtime=createVenueRuntime({origin:"https://app.example.invalid",auth,fetcher:async()=>response});
  await assert.rejects(runtime(command,manifest));
 }
 assert.throws(()=>createVenueRuntime({origin:"https://app.example.invalid/other",auth}));
 assert.throws(()=>createVenueRuntime({origin:"http://app.example.invalid",auth,allowLocalTest:true}));
});
test("approved generator discards the modulo tail and refuses missing cryptographic randomness",t=>{
 assert.ok(codeEntropyBits()>=MINIMUM_CODE_ENTROPY_BITS);
 const limit=256-(256%CODE_ALPHABET.length);
 let draws=0;
 t.mock.method(globalThis.crypto,"getRandomValues",(array:Uint8Array)=>{
  draws++; array.fill(draws===1 ? 255 : 0); if(draws===1)array[0]=limit-1;return array;
 });
 const code=generateCompCode("VENUE");
 assert.equal(draws,2);
 assert.equal(code.replaceAll("-","").slice(5).length,CODE_BODY_LENGTH);
 assert.equal(code.startsWith("VENUE-"+CODE_ALPHABET[(limit-1)%CODE_ALPHABET.length]),true);
 t.mock.restoreAll();
 const original=Object.getOwnPropertyDescriptor(globalThis,"crypto")!;
 try {Object.defineProperty(globalThis,"crypto",{configurable:true,value:undefined});assert.throws(()=>generateCompCode("VENUE"),/cryptographic/);}
 finally {Object.defineProperty(globalThis,"crypto",original);}
});
