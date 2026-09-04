import { and, asc, eq, gt, sql } from "drizzle-orm";
import type { entitlementsDb } from "@/lib/entitlements-db/client-core";
import { licenseCodes, venueFulfilmentRequests } from "@/lib/entitlements-db/schema";
import { manifestHash, parseManifest, venueCodeFingerprint, VenueIssuanceError, type IssuanceEnvironment } from "./protocol";

export type VenueSharedReader = Pick<ReturnType<typeof entitlementsDb>, "select">;
/** Complete bounded enumeration, with no current venue-term filter. An unknown
 * first delivery in the requested scope fails rather than biasing population. */
export async function listVerifiedVenueIssuances(reader: VenueSharedReader, input: {
  sponsorId: string; environment: IssuanceEnvironment; afterId?: string; limit?: number;
}) {
  const limit = input.limit ?? 20;
  if (!Number.isInteger(limit) || limit < 1 || limit > 20 || !input.sponsorId ||
      !["internal_test", "production"].includes(input.environment) ||
      (input.afterId !== undefined && !/^vi-[a-f0-9]{32}$/.test(input.afterId))) throw new VenueIssuanceError("invalid");
  try {
    const environment = sql.join([sql.raw("json_extract("), venueFulfilmentRequests.manifestJson,
      sql.raw(", '$.environment') = "), sql.param(input.environment)]);
    const rows = await reader.select().from(venueFulfilmentRequests).where(and(
      eq(venueFulfilmentRequests.sponsorId, input.sponsorId), environment,
      input.afterId ? gt(venueFulfilmentRequests.id, input.afterId) : undefined,
    )).orderBy(asc(venueFulfilmentRequests.id)).limit(limit + 1);
    for (const row of rows) {
      const manifest = parseManifest(JSON.parse(row.manifestJson));
      if (row.manifestHash !== manifestHash(manifest) || manifest.sponsorId !== input.sponsorId ||
          manifest.issuanceId !== row.id || manifest.environment !== input.environment || !row.fulfilledAt) throw new VenueIssuanceError("unavailable");
    }
    const page = rows.slice(0, limit);
    return { issuanceIds: page.map(row => row.id), nextCursor: rows.length > limit ? page.at(-1)!.id : null, complete: rows.length <= limit };
  } catch { throw new VenueIssuanceError("unavailable"); }
}
/** Private service read. Allocated-but-unacknowledged is retryable, not success.
 * No bearer code or venue contact leaves this boundary. */
export async function readVerifiedVenueIssuance(reader: VenueSharedReader, input: {
  issuanceId: string; licenseCodeId: string; codeFingerprint: string;
}) {
  try {
    const [request] = await reader.select().from(venueFulfilmentRequests).where(eq(venueFulfilmentRequests.id, input.issuanceId));
    if (!request) return null;
    const manifest = parseManifest(JSON.parse(request.manifestJson));
    if (request.manifestHash !== manifestHash(manifest) || manifest.issuanceId !== request.id || manifest.sponsorId !== request.sponsorId) return null;
    const expected = manifest.codes.find(code => code.licenseCodeId === input.licenseCodeId && code.codeFingerprint === input.codeFingerprint);
    if (!expected) return null;
    const [row] = await reader.select().from(licenseCodes).where(and(eq(licenseCodes.id, input.licenseCodeId), eq(licenseCodes.sponsorId, request.sponsorId)));
    if (!row || row.batchId !== manifest.issuanceId || row.sourceType !== "venue_edition" || row.tier !== "wedding" ||
        row.durationDays !== 548 || venueCodeFingerprint(row.code) !== input.codeFingerprint) return null;
    if (!request.fulfilledAt) throw new VenueIssuanceError("unavailable");
    return { version: 1 as const, issuanceId: manifest.issuanceId, ...expected,
      sponsorId: manifest.sponsorId, environment: manifest.environment, eligibilityKind: manifest.eligibility.kind,
      issuedAt: manifest.issuedAt, eligibilityStartsAt: manifest.eligibility.startsAt, eligibilityEndsAt: manifest.eligibility.endsAt,
      fulfilledAt: request.fulfilledAt, state: row.status };
  } catch (error) {
    if (error instanceof SyntaxError || (error instanceof VenueIssuanceError && error.code === "invalid")) return null;
    throw new VenueIssuanceError("unavailable");
  }
}
