import "server-only";
import { timingSafeEqual } from "node:crypto";
import { entitlementsDb } from "@/lib/entitlements-db/client";
import { closeUsageDays } from "@/lib/account/instrumentation/usage-jobs";
import { runtimeUsageDependencies } from "@/lib/account/instrumentation/usage-runtime";
import { retainUsage } from "@/lib/account/instrumentation/usage-erasure";
import { usageResponse } from "@/lib/sponsored-use/service-auth";
export const dynamic="force-dynamic";
export const runtime="nodejs";
export async function GET(request:Request) {
  const expected=process.env.CRON_SECRET ?? "";
  const supplied=(request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i,"");
  if(!expected || Buffer.byteLength(expected)!==Buffer.byteLength(supplied) || !timingSafeEqual(Buffer.from(expected),Buffer.from(supplied)))
    return usageResponse(401,{ok:false});
  if(new URL(request.url).search)return usageResponse(400,{ok:false});
  try {
    const db=entitlementsDb();
    if(process.env.SPONSOR_USAGE_EVENTS!=="1") {
      await retainUsage(db,Date.now());
      return usageResponse(200,{ok:true,skipped:"capture-disabled",retention:true});
    }
    let deps;
    try { deps=runtimeUsageDependencies(db); }
    catch { await retainUsage(db,Date.now());throw new Error("Usage configuration unavailable"); }
    const result=await closeUsageDays(db,deps,Date.now());
    return usageResponse(200,{ok:true,...result});
  }catch{return usageResponse(503,{ok:false});}
}
