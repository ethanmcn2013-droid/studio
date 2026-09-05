import assert from "node:assert/strict";
import { test } from "node:test";
import { eq } from "drizzle-orm";
import { venueFixture } from "@/test/venue-fulfilment-fixture";
import { venueAppWorker } from "@/test/venue-app-worker";
import { sponsors, licenseCodes, venueFulfilmentRequests, entitlementEvents } from "@/lib/entitlements-db/schema";
import { sponsors as localSponsors, licenseCodes as localCodes } from "@/lib/db/schema";
import { recordVenuePayment } from "@/lib/entitlements-db/venue-payment";
import { allocateVenueIssuance, pairVenueSponsor, fulfilVenueRequest, prepareVenuePacket, withdrawVenueCode } from "./store";
import { VenueIssuanceError, type IssuanceReadback } from "./protocol";
import type { VenueRuntime } from "./transport";
import { readVenueRuntimeState } from "./runtime-state";

const actor = { id: "fixture", name: "Synthetic operator" };
process.env.SIGNAL_HQ_OPERATORS = "fixture:Synthetic operator";
const id = (n = 1) => "vi-" + String(n).padStart(32, "0");
type Fixture = Awaited<ReturnType<typeof venueFixture>>;
async function venue(f: Fixture, plan: "paid" | "founding" | "pilot" = "paid") {
  await f.shared.insert(sponsors).values({ id: "shared-venue", slug: "synthetic", name: "Synthetic venue", contactEmail: "fixture@example.invalid",
    kind: "venue", venuePlan: plan, allotmentMode: plan === "pilot" ? "limited" : "unlimited", codeAllotment: plan === "pilot" ? 2 : null });
  // Retain a historical local ID instead of assuming cross-store IDs coincide.
  await f.studio.insert(localSponsors).values({ id: "old-local-id", slug: "synthetic", name: "Synthetic venue", contactEmail: "fixture@example.invalid" });
  assert.equal((await pairVenueSponsor(f, "synthetic", actor)).studioSponsorId, "old-local-id");
  if (plan === "pilot") await f.shared.update(sponsors).set({ termStartsAt: Date.now()-60_000, termEndsAt: Date.now()+86400000 }).where(eq(sponsors.id, "shared-venue"));
  else await recordVenuePayment({ slug: "synthetic", plan, reference: "synthetic-payment-only", paidAt: Date.now()-60_000,
    amountCents: plan === "paid" ? 150000 : 100000, actorId: actor.id, actorName: actor.name }, f);
}
const allocate = (f: Fixture, n=1, count=2, pilotReference?: string) => allocateVenueIssuance(f, { issuanceId: id(n), slug: "synthetic", count, actor, pilotReference }, "internal_test");
const request = async (f: Fixture) => (await f.shared.select().from(venueFulfilmentRequests))[0];

for (const plan of ["paid", "founding", "pilot"] as const) test("three real stores: " + plan + " eligible issuance, exact replay and manual packet after readback", async () => {
  const f = await venueFixture(), app = await venueAppWorker();
  try {
    await venue(f, plan);
    const manifest = await allocate(f, 1, 2, plan === "pilot" ? "synthetic-explicit-pilot" : undefined);
    assert.equal(manifest.eligibility.kind, plan === "paid" ? "standard" : plan);
    assert.equal((await request(f)).fulfilledAt, null);
    const packet = await prepareVenuePacket(f, id(), app.runtime, actor, "https://app.example.invalid");
    assert.equal(packet.ready, true); if (!packet.packet) throw new Error("No packet");
    assert.equal(packet.packet.codes.length, 2);
    assert.ok((await request(f)).fulfilledAt); assert.equal((await request(f)).deliveryState, "fulfilled");
    assert.equal(JSON.stringify(packet.packet).includes("codeFingerprint"), false);
    const local = await f.studio.select().from(localCodes), shared = await f.shared.select().from(licenseCodes);
    assert.equal(local.length, 2); assert.ok(local.every(row => row.sponsorId === "old-local-id"));
    assert.ok(local.every(row => shared.some(other => other.id === row.id && other.code === row.code)));
    await allocate(f, 1, 2, plan === "pilot" ? "synthetic-explicit-pilot" : undefined);
    await fulfilVenueRequest(f, id(), app.runtime, actor);
    assert.equal((await app.call<Record<string, number>>({ operation: "counts" })).comp_codes, 2);
    assert.equal((await f.shared.select().from(sponsors))[0].codesIssued, 2);
    const events = await f.shared.select().from(entitlementEvents);
    assert.equal(events.filter(row => row.action === "mint").length, 1);
    assert.ok(shared.every(row => !JSON.stringify(events).includes(row.code)));
    await assert.rejects(allocate(f, 1, 1), /conflict/);
  } finally { await app.close(); f.cleanup(); }
});

test("selected paid plan, missing mirror, invalid receipt, expired term and implicit pilot cannot issue", async () => {
  const f = await venueFixture(); try {
    await venue(f);
    await f.studio.update(localSponsors).set({ paidAt: null });
    await assert.rejects(allocate(f), /invalid/);
    const shared = (await f.shared.select().from(sponsors))[0];
    await f.studio.update(localSponsors).set({ paidAt: shared.paidAt });
    await f.shared.update(entitlementEvents).set({ rowHash: "tampered" });
    await assert.rejects(allocate(f), /invalid/);
    await f.shared.update(sponsors).set({ venuePlan: "pilot", allotmentMode: "limited", codeAllotment: 2 });
    await assert.rejects(allocate(f), /invalid/);
    await f.shared.update(sponsors).set({ termEndsAt: Date.now()-1 });
    await assert.rejects(allocate(f, 1, 1, "explicit-pilot"), /invalid/);
    assert.equal((await f.shared.select().from(licenseCodes)).length, 0);
    assert.equal((await f.shared.select().from(sponsors))[0].codesIssued, 0);
  } finally { f.cleanup(); }
});

test("local mirror and App transaction failures keep the durable exact set pending for retry", async () => {
  const f=await venueFixture(), app=await venueAppWorker(); try {
    await venue(f); await allocate(f);
    await f.studioClient.execute("CREATE TRIGGER fail_local_code BEFORE INSERT ON license_codes BEGIN SELECT RAISE(ABORT,'synthetic failure'); END");
    assert.equal((await fulfilVenueRequest(f,id(),app.runtime,actor)).state,"pending");
    assert.equal((await app.call<Record<string,number>>({operation:"counts"})).comp_codes,0);
    await f.studioClient.execute("DROP TRIGGER fail_local_code");
    await app.call({operation:"failure",enabled:true});
    assert.equal((await fulfilVenueRequest(f,id(),app.runtime,actor)).state,"pending");
    assert.equal((await app.call<Record<string,number>>({operation:"counts"})).comp_codes,0);
    assert.equal((await f.studio.select().from(localCodes)).length,2);
    assert.equal((await request(f)).fulfilledAt,null);
    await app.call({operation:"failure",enabled:false});
    assert.equal((await fulfilVenueRequest(f,id(),app.runtime,actor)).state,"fulfilled");
    assert.equal((await app.call<Record<string,number>>({operation:"counts"})).comp_codes,2);
  } finally { await app.close(); f.cleanup(); }
});

test("lost issue acknowledgement and failed final receipt never produce a ready packet; exact retry recovers", async () => {
  const f=await venueFixture(), app=await venueAppWorker(); try {
    await venue(f); await allocate(f);
    const lostAck: VenueRuntime=async (command,manifest)=>{ await app.runtime(command,manifest); throw new VenueIssuanceError("unavailable"); };
    assert.equal((await prepareVenuePacket(f,id(),lostAck,actor,"https://app.example.invalid")).ready,false);
    assert.equal((await app.call<Record<string,number>>({operation:"counts"})).comp_codes,2);
    assert.equal((await request(f)).fulfilledAt,null);
    await f.sharedClient.execute("CREATE TRIGGER fail_fulfilled BEFORE UPDATE ON venue_fulfilment_requests WHEN NEW.delivery_state='fulfilled' BEGIN SELECT RAISE(ABORT,'synthetic failure'); END");
    assert.equal((await prepareVenuePacket(f,id(),app.runtime,actor,"https://app.example.invalid")).ready,false);
    assert.equal((await request(f)).fulfilledAt,null);
    await f.sharedClient.execute("DROP TRIGGER fail_fulfilled");
    assert.equal((await prepareVenuePacket(f,id(),app.runtime,actor,"https://app.example.invalid")).ready,true);
    assert.equal((await app.call<Record<string,number>>({operation:"counts"})).comp_codes,2);
  } finally { await app.close(); f.cleanup(); }
});

test("HTTP success without exact manifest/code acknowledgement remains unknown", async () => {
  const f=await venueFixture(), app=await venueAppWorker(); try {
    await venue(f); await allocate(f);
    for (const alter of [(row:IssuanceReadback)=>({...row,codes:[]}), (row:IssuanceReadback)=>({...row,issuanceId:id(99)}),
      (row:IssuanceReadback)=>({...row,checkedAt:1})]) {
      const runtime:VenueRuntime=async(command,manifest)=>alter(await app.runtime(command,manifest));
      assert.equal((await prepareVenuePacket(f,id(),runtime,actor,"https://app.example.invalid")).ready,false);
      assert.equal((await request(f)).fulfilledAt,null);
    }
  } finally { await app.close(); f.cleanup(); }
});

test("actual App same-code replay and withdrawal preserve claimed grant; fingerprint is not a credential", async () => {
  const f=await venueFixture(), app=await venueAppWorker(); try {
    await venue(f); const manifest=await allocate(f);
    await fulfilVenueRequest(f,id(),app.runtime,actor);
    const codes=await f.shared.select().from(licenseCodes);
    assert.equal((await app.call<{ok:boolean}>({operation:"claim",code:manifest.codes[0].codeFingerprint})).ok,false);
    const first=await app.call<{ok:boolean;id:string;expiresAt:number;project:string}>({operation:"claim",code:codes[0].code});
    const replay=await app.call<typeof first>({operation:"claim",code:codes[0].code,project:"b"});
    assert.equal(first.ok,true);assert.equal(replay.id,first.id);assert.equal(replay.project,"a");assert.equal(replay.expiresAt,first.expiresAt);
    const claimed=await withdrawVenueCode(f,id(),codes[0].id,app.runtime,actor);
    assert.equal("withdrawal" in claimed ? claimed.withdrawal : null,"already_claimed");
    const unused=await withdrawVenueCode(f,id(),codes[1].id,app.runtime,actor);
    assert.equal("withdrawal" in unused ? unused.withdrawal : null,"withdrawn");
    assert.equal((await app.call<{ok:boolean}>({operation:"claim",code:codes[1].code})).ok,false);
    assert.equal((await app.call<Record<string,number>>({operation:"counts"})).entitlements,1);
    assert.equal((await prepareVenuePacket(f,id(),app.runtime,actor,"https://app.example.invalid")).ready,false);
  } finally { await app.close(); f.cleanup(); }
});

test("withdrawal fences an older delivery response and public availability follows fresh App authority",async()=>{
 const f=await venueFixture(),app=await venueAppWorker();try{
  await venue(f);const manifest=await allocate(f,1,1);
  const input={issuanceId:id(),...manifest.codes[0]};
  await assert.rejects(readVenueRuntimeState(f.shared,app.runtime,input),/unavailable/);
  await fulfilVenueRequest(f,id(),app.runtime,actor);
  assert.equal(await readVenueRuntimeState(f.shared,app.runtime,input),"available");
  let raced=false;
  const delayed:VenueRuntime=async(command,m)=>{
    const result=await app.runtime(command,m);
    if(command.operation==="read"&&!raced){raced=true;await withdrawVenueCode(f,id(),input.licenseCodeId,app.runtime,actor);}
    return result;
  };
  assert.equal((await fulfilVenueRequest(f,id(),delayed,actor)).state,"pending");
  assert.equal((await request(f)).deliveryState,"fulfilled");
  assert.equal((await f.shared.select().from(licenseCodes))[0].status,"revoked");
  assert.equal(await readVenueRuntimeState(f.shared,app.runtime,input),"withdrawn");
 }finally{await app.close();f.cleanup();}
});

test("reservation rollback does not consume pilot allotment; expiry prevents new capacity but preserves the allocated exact retry",async()=>{
 const f=await venueFixture();try{
  await venue(f,"pilot");
  await f.sharedClient.execute("CREATE TRIGGER fail_reservation BEFORE INSERT ON license_codes BEGIN SELECT RAISE(ABORT,'synthetic failure'); END");
  await assert.rejects(allocate(f,1,2,"synthetic-pilot"));
  assert.equal((await f.shared.select().from(venueFulfilmentRequests)).length,0);
  assert.equal((await f.shared.select().from(sponsors))[0].codesIssued,0);
  await f.sharedClient.execute("DROP TRIGGER fail_reservation");
  await allocate(f,1,2,"synthetic-pilot");
  await assert.rejects(allocate(f,2,1,"synthetic-pilot"),/invalid/);
  await f.shared.update(sponsors).set({termEndsAt:Date.now()-1});
  assert.equal((await allocate(f,1,2,"synthetic-pilot")).issuanceId,id());
  await assert.rejects(allocate(f,2,1,"synthetic-pilot"),/invalid/);
 }finally{f.cleanup();}
});
