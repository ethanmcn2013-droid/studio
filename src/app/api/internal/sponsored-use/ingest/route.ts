import { entitlementsDb } from "@/lib/entitlements-db/client";
import { usageHandlers } from "@/lib/account/instrumentation/usage-handlers";
import { runtimeUsageDependencies, usageRuntimeConfig } from "@/lib/account/instrumentation/usage-runtime";
import { usageResponse } from "@/lib/sponsored-use/service-auth";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request) {
  const config=usageRuntimeConfig();
  if(!config.enabled)return usageResponse(503,{ok:false});
  try {const db=entitlementsDb();return await usageHandlers(db,runtimeUsageDependencies(db),config).ingest(request);}
  catch{return usageResponse(503,{ok:false});}
}
