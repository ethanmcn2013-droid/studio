import { entitlementsDb } from "@/lib/entitlements-db/client";
import { usageHandlers } from "@/lib/account/instrumentation/usage-handlers";
import { usageRuntimeConfig } from "@/lib/account/instrumentation/usage-runtime";
import { usageResponse } from "@/lib/sponsored-use/service-auth";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request) {
  const config=usageRuntimeConfig();
  try {
    // Erasure needs neither a live App nor canonical issuance availability.
    const deps={environment:"internal_test" as const,proof:async()=>null,canonical:async()=>null};
    return await usageHandlers(entitlementsDb(),deps,config).erase(request);
  }catch{return usageResponse(503,{ok:false});}
}
