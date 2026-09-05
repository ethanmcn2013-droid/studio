import "server-only";
import { eq } from "drizzle-orm";
import { sponsors } from "@/lib/entitlements-db/schema";
import { listVerifiedVenueIssuances, readVerifiedVenueIssuance } from "@/lib/venue-fulfilment/canonical";
import { MAX_VENUE_CODES } from "@/lib/venue-fulfilment/protocol";
import { MAX_BODY_BYTES, signedUsageRequest, USAGE_PATHS } from "@/lib/sponsored-use/service-auth";
import { parseClaimProof, type UsageClaimProof, type UsageEventProof } from "@/lib/sponsored-use/proof";
import type { JobDependencies } from "./usage-jobs";
import type { UsageDatabase } from "./verified-ingest";
import type { UsageServiceConfig } from "./usage-handlers";

export function usageRuntimeConfig(): UsageServiceConfig {
  return { enabled:process.env.SPONSOR_USAGE_EVENTS==="1", secret:process.env.SPONSOR_USAGE_SERVICE_SECRET ?? "",
    issuanceSecret:process.env.VENUE_ISSUANCE_SECRET,
    epochs:(process.env.SPONSOR_USAGE_ACCEPTED_EPOCHS ?? "").split(",").map(s=>s.trim()).filter(s=>/^[a-f0-9]{8}$/.test(s)) };
}
type RuntimeOptions = {
  appOrigin:string; secret:string; issuanceSecret?:string; environment:"internal_test"|"production";
  now?:()=>number; send?:(request:Request)=>Promise<Response>;
};
/** Read from App through purpose-separated auth, never broad App DB credentials. */
async function boundedResponse(response:Response):Promise<unknown> {
  if(!response.ok || !response.body) throw new Error("Usage provenance unavailable");
  const reader=response.body.getReader();let size=0;const chunks:Uint8Array[]=[];
  try {
    while(true) {
      const part=await reader.read();if(part.done)break;
      size+=part.value.length;if(size>MAX_BODY_BYTES)throw new Error("Usage provenance unavailable");
      chunks.push(part.value);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
  } finally { await reader.cancel(); }
}
export function createUsageDependencies(database:UsageDatabase, options:RuntimeOptions):JobDependencies {
  async function request(payload:unknown,epoch:string):Promise<Record<string,unknown>> {
    if(options.secret.length<32 || options.secret===options.issuanceSecret) throw new Error("Usage configuration unavailable");
    const target=new URL(USAGE_PATHS.provenance,options.appOrigin);
    const signed=signedUsageRequest(target.href,payload,options.secret,epoch,options.now?.() ?? Date.now());
    const response=await (options.send ?? (request=>fetch(request,{redirect:"error",signal:AbortSignal.timeout(5000)})))(signed);
    const body=await boundedResponse(response);
    if(!body || typeof body!=="object" || Array.isArray(body))throw new Error("Usage provenance unavailable");
    return body as Record<string,unknown>;
  }
  async function canonical(proof:UsageClaimProof) {
    const row=await readVerifiedVenueIssuance(database,proof);
    if(!row || row.environment!==options.environment || !["minted","redeemed"].includes(row.state))return null;
    const [venue]=await database.select({timezone:sponsors.reportingTimezone}).from(sponsors).where(eq(sponsors.id,row.sponsorId));
    if(!venue)return null;
    return {...row,timezone:venue.timezone ?? "Europe/Dublin"};
  }
  return {
    environment:options.environment,canonical,
    async proof(eventId,epoch) {
      const body=await request({eventId},epoch);
      if(body.proof===null)return null;
      const value=body.proof as Partial<UsageEventProof>|undefined;
      const claim=parseClaimProof(value);
      if(!claim || !value || value.eventId!==eventId || typeof value.eventDigest!=="string" || !/^[a-f0-9]{64}$/.test(value.eventDigest))
        throw new Error("Usage provenance unavailable");
      return {...claim,eventId,eventDigest:value.eventDigest};
    },
    async eligible(sponsorId,epoch,start,end) {
      const claims:UsageClaimProof[]=[];const seen=new Set<string>();let afterId:string|undefined;
      // At most100 immutable manifests per venue run. Refuse partial populations.
      for(let page=0;page<5;page++) {
        const issued=await listVerifiedVenueIssuances(database,{sponsorId,environment:options.environment,afterId,limit:20});
        for(const issuanceId of issued.issuanceIds) {
          const body=await request({issuanceId,cursor:"0"},epoch);
          if(body.nextCursor!==null || !Array.isArray(body.claims) || body.claims.length>MAX_VENUE_CODES)
            throw new Error("Usage population unavailable");
          for(const raw of body.claims) {
            const proof=parseClaimProof(raw);
            if(!proof || proof.issuanceId!==issuanceId || proof.sponsorId!==sponsorId || proof.epoch!==epoch || proof.environment!==options.environment)
              throw new Error("Usage population unavailable");
            const exact=await canonical(proof);
            if(!exact)continue;
            if(exact.codeFingerprint!==proof.codeFingerprint || exact.issuedAt!==proof.issuedAt || exact.sponsorId!==proof.sponsorId)
              throw new Error("Usage population unavailable");
            if(seen.has(proof.licenseCodeId))throw new Error("Usage population unavailable");
            seen.add(proof.licenseCodeId);
            if(proof.grantStartsAt<=end && proof.grantEndsAt>start)claims.push(proof);
          }
        }
        if(issued.complete && issued.nextCursor===null)return claims;
        if(!issued.nextCursor || issued.nextCursor===afterId)throw new Error("Usage population unavailable");
        afterId=issued.nextCursor;
      }
      throw new Error("Usage population requires bounded partition");
    },
  };
}
export function runtimeUsageDependencies(database:UsageDatabase):JobDependencies {
  const environment=process.env.SPONSOR_USAGE_ENVIRONMENT;
  if(environment!=="internal_test" && environment!=="production")throw new Error("Usage configuration unavailable");
  return createUsageDependencies(database,{appOrigin:process.env.SPONSOR_USAGE_APP_ORIGIN ?? "",
    secret:process.env.SPONSOR_USAGE_SERVICE_SECRET ?? "",issuanceSecret:process.env.VENUE_ISSUANCE_SECRET,environment});
}
