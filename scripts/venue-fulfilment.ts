import { randomUUID } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { allocateVenueIssuance, pairVenueSponsor, fulfilVenueRequest, prepareVenuePacket, withdrawVenueCode, venueFulfilmentStatus } from "../src/lib/venue-fulfilment/store";
import { configuredVenueRuntime } from "../src/lib/venue-fulfilment/runtime-config";

/** No dotenv import, broad App DB credentials, stdout codes, or mail transport. */
async function main() {
  const [operation, file, arg] = process.argv.slice(2);
  const actor = { id: process.env.SIGNAL_OPERATOR_ID ?? "", name: process.env.SIGNAL_OPERATOR_NAME ?? "" };
  if (operation === "new") {
    const count=Number(process.argv[5]);
    if (!file || !arg || !Number.isInteger(count) || count<1 || count>25) throw Error("Usage: new <request.json> <venue-slug> <count> [pilot-reference]");
    const request={issuanceId:"vi-"+randomUUID().replaceAll("-",""),slug:arg,count,pilotReference:process.argv[6]};
    writeFileSync(file,JSON.stringify(request,null,2)+"\n",{flag:"wx",mode:0o600});
    console.log(JSON.stringify({state:"request_saved",issuanceId:request.issuanceId})); return;
  }
  const config=configuredVenueRuntime();
  const { db }=await import("../src/lib/db");
  const { entitlementsDb }=await import("../src/lib/entitlements-db/client-core");
  const stores={studio:db,shared:entitlementsDb()};
  if (operation === "pair") {
    if (!file) throw Error("Usage: pair <venue-slug>");
    console.log(JSON.stringify({state:"paired",...await pairVenueSponsor(stores,file,actor)})); return;
  }
  if (!file) throw Error("Supply the retained request file.");
  const input=JSON.parse(readFileSync(file,"utf8"));
  if (operation === "allocate") {
    const manifest=await allocateVenueIssuance(stores,{...input,actor},config.environment);
    console.log(JSON.stringify({state:"allocated_pending",issuanceId:manifest.issuanceId,count:manifest.codes.length}));
  } else if (operation === "status") {
    console.log(JSON.stringify(await venueFulfilmentStatus(stores,input.issuanceId,actor)));
  } else if (operation === "deliver") {
    console.log(JSON.stringify(await fulfilVenueRequest(stores,input.issuanceId,config.runtime,actor)));
  } else if (operation === "withdraw") {
    if (!arg) throw Error("Supply the private license-code ID from the retained request record.");
    console.log(JSON.stringify(await withdrawVenueCode(stores,input.issuanceId,arg,config.runtime,actor)));
  } else if (operation === "packet") {
    if (!arg) throw Error("Supply a new private output file for the manual packet.");
    const result=await prepareVenuePacket(stores,input.issuanceId,config.runtime,actor,config.origin);
    if (!result.ready || !result.packet) { console.log(JSON.stringify({state:"packet_pending",result:result.result})); process.exitCode=2; return; }
    writeFileSync(arg,JSON.stringify(result.packet,null,2)+"\n",{flag:"wx",mode:0o600});
    console.log(JSON.stringify({state:"packet_ready",issuanceId:input.issuanceId,count:result.packet.codeCount}));
  } else throw Error("Use new, pair, allocate, status, deliver, withdraw or packet. See docs/guides/venue-fulfilment.md.");
}
void main().catch(()=>{console.error("Venue fulfilment did not complete. Retain the request and retry the same operation after checking configuration and the operator guide. No ready packet is claimed.");process.exitCode=1;});
