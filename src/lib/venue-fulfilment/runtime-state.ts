import { eq } from "drizzle-orm";
import { venueFulfilmentRequests } from "@/lib/entitlements-db/schema";
import { readVerifiedVenueIssuance, type VenueSharedReader } from "./canonical";
import { parseManifest, parseReadback, VenueIssuanceError } from "./protocol";
import type { VenueRuntime } from "./transport";
/** Shared code state is a mirror. A public lookup can only claim availability
 * after first delivery is acknowledged and a fresh App read agrees. */
export async function readVenueRuntimeState(reader: VenueSharedReader, runtime: VenueRuntime, input: {
  issuanceId: string; licenseCodeId: string; codeFingerprint: string;
}) {
  if (!await readVerifiedVenueIssuance(reader,input)) throw new VenueIssuanceError("unavailable");
  const [request]=await reader.select().from(venueFulfilmentRequests).where(eq(venueFulfilmentRequests.id,input.issuanceId));
  if (!request || request.deliveryState !== "fulfilled") throw new VenueIssuanceError("unavailable");
  const manifest=parseManifest(JSON.parse(request.manifestJson));
  const result=parseReadback(await runtime({operation:"read",issuanceId:input.issuanceId,manifestHash:request.manifestHash},manifest),manifest);
  if (Math.abs(Date.now()-result.checkedAt)>300_000) throw new VenueIssuanceError("unavailable");
  return result.codes.find(row=>row.licenseCodeId===input.licenseCodeId)!.state;
}
