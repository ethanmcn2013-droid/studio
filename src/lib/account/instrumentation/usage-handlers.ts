import "server-only";
import { authenticateUsageRequest, USAGE_PATHS, usageResponse } from "@/lib/sponsored-use/service-auth";
import { ingestVerifiedUsage, strictTaskEvent, type UsageDatabase, type VerificationDependencies } from "./verified-ingest";
import { eraseUsageSubject, eraseUsageWorkspace, type UsageReportInvalidator } from "./usage-erasure";
export type UsageServiceConfig = {
  enabled:boolean;secret:string;issuanceSecret?:string;epochs:readonly string[];now?:number;
};
export function usageHandlers(database:UsageDatabase,deps:VerificationDependencies,config:UsageServiceConfig,
  invalidateReports?: UsageReportInvalidator) {
  async function handle(request:Request,erase:boolean):Promise<Response> {
    if(!config.enabled && !erase) return usageResponse(503,{ok:false});
    const epoch=request.headers.get("x-sponsored-use-epoch") ?? "";
    // Erasure can outlive salt rotation: the authenticated subject/epoch
    // tombstone needs no identity salt. Ingest only accepts explicitly known epochs.
    if(!erase && !config.epochs.includes(epoch)) return usageResponse(503,{ok:false});
    const auth=await authenticateUsageRequest(request,erase?USAGE_PATHS.erase:USAGE_PATHS.ingest,
      {secret:config.secret,issuanceSecret:config.issuanceSecret,epoch,now:config.now});
    if(!auth.ok) return usageResponse(401,{ok:false});
    const now=config.now ?? Date.now();
    try {
      if(erase) {
        const p=auth.payload as {subjectIdHash?:unknown;workspaceIdHash?:unknown;sponsorId?:unknown}|null;
        if(!p || typeof p!=="object" || Array.isArray(p))
          return usageResponse(400,{ok:false});
        if(Object.keys(p).length===1 && typeof p.subjectIdHash==="string" && /^[a-f0-9]{32}$/.test(p.subjectIdHash))
          await eraseUsageSubject(database,epoch,p.subjectIdHash,now,invalidateReports);
        else if(Object.keys(p).length===2 && typeof p.workspaceIdHash==="string" && /^[a-f0-9]{32}$/.test(p.workspaceIdHash) &&
          typeof p.sponsorId==="string" && /^[A-Za-z0-9_-]{1,96}$/.test(p.sponsorId))
          await eraseUsageWorkspace(database,epoch,p.workspaceIdHash,p.sponsorId,now,invalidateReports);
        else return usageResponse(400,{ok:false});
        return usageResponse(200,{ok:true});
      }
      const event=strictTaskEvent(auth.payload,now);
      if(!event) return usageResponse(400,{ok:false});
      const result=await ingestVerifiedUsage(database,event,epoch,deps,now);
      return usageResponse(result==="conflict"?409:200,{ok:result!=="conflict"});
    }catch{return usageResponse(503,{ok:false});}
  }
  return {ingest:(request:Request)=>handle(request,false),erase:(request:Request)=>handle(request,true)};
}
