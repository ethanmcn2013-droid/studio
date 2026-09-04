import { randomUUID } from "node:crypto";
import { and, count, eq, gte, or, sql } from "drizzle-orm";
import type { entitlementsDb } from "@/lib/entitlements-db/client-core";
import type { db } from "@/lib/db";
import { sponsors, licenseCodes, entitlementEvents, venueSponsorMirrors, venueFulfilmentRequests } from "@/lib/entitlements-db/schema";
import { sponsors as localSponsors, licenseCodes as localCodes } from "@/lib/db/schema";
import { appendEvent } from "@/lib/entitlements-db/audit-core";
import { matchesCurrentVenuePayment, VENUE_PAYMENT_FIELDS } from "@/lib/entitlements-db/venue-payment-proof";
import { parseRoster, resolveOperator } from "@/lib/entitlements-db/pure";
import { fairUseBreach } from "@/lib/venue-allotment";
import { generateCompCode } from "./secure-code";
import { MAX_VENUE_CODES, manifestHash, parseManifest, parseReadback, venueCodeFingerprint, VenueIssuanceError,
  type IssuanceEnvironment, type IssuanceManifest, type IssuanceReadback } from "./protocol";
import type { VenueRuntime } from "./transport";

export type VenueStores = { shared: ReturnType<typeof entitlementsDb>; studio: typeof db };
export type VenueOperator = { id: string; name: string };
const fail = (code: ConstructorParameters<typeof VenueIssuanceError>[0]): never => { throw new VenueIssuanceError(code); };
function operator(input: VenueOperator) {
  const roster = parseRoster(process.env.SIGNAL_HQ_OPERATORS);
  if (!roster.length) throw new Error("Configure the authorised operator roster before Venue fulfilment.");
  const actor = resolveOperator(input, roster);
  if (!actor.ok) throw new Error("An identified authorised operator is required.");
  return actor;
}
/** Repeats by slug, retaining historical IDs. No second sponsor or payment. */
export async function pairVenueSponsor(stores: VenueStores, slug: string, actor: VenueOperator) {
  operator(actor);
  const [shared] = await stores.shared.select().from(sponsors).where(eq(sponsors.slug, slug));
  if (!shared || shared.kind !== "venue") return fail("not_found");
  const localId = await stores.studio.transaction(async tx => {
    const [existing] = await tx.select().from(localSponsors).where(eq(localSponsors.slug, slug));
    if (existing) return existing.id;
    // Only the payment writer mirrors financial evidence. Repair any old payment
    // using its original reference after this paired row exists.
    await tx.insert(localSponsors).values({ id: shared.id, slug, name: shared.name, contactEmail: shared.contactEmail, brandMeta: shared.brandMeta }).onConflictDoNothing();
    const [created] = await tx.select().from(localSponsors).where(eq(localSponsors.slug, slug));
    if (!created) return fail("conflict");
    return created.id;
  }, { behavior: "immediate" });
  await stores.shared.transaction(async tx => {
    const [existing] = await tx.select().from(venueSponsorMirrors).where(eq(venueSponsorMirrors.sponsorId, shared.id));
    if (existing) {
      if (existing.studioSponsorId !== localId || existing.sponsorSlug !== slug) return fail("conflict");
      return;
    }
    await tx.insert(venueSponsorMirrors).values({ sponsorId: shared.id, studioSponsorId: localId, sponsorSlug: slug, createdAt: Date.now() });
  }, { behavior: "immediate" });
  return { sponsorId: shared.id, studioSponsorId: localId };
}
export type IssueVenueInput = { issuanceId: string; slug: string; count: number; actor: VenueOperator; pilotReference?: string };
export async function allocateVenueIssuance(stores: VenueStores, input: IssueVenueInput, environment: IssuanceEnvironment, now = Date.now()) {
  const actor = operator(input.actor);
  if (!/^vi-[a-f0-9]{32}$/.test(input.issuanceId) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug) ||
      !Number.isInteger(input.count) || input.count < 1 || input.count > MAX_VENUE_CODES) return fail("invalid");
  const requestJson = JSON.stringify({ slug: input.slug, count: input.count, environment, pilotReference: input.pilotReference ?? null });
  const pair = await pairVenueSponsor(stores, input.slug, input.actor);
  return stores.shared.transaction(async tx => {
    const [prior] = await tx.select().from(venueFulfilmentRequests).where(eq(venueFulfilmentRequests.id, input.issuanceId));
    if (prior) {
      if (prior.requestJson !== requestJson || prior.sponsorId !== pair.sponsorId || prior.studioSponsorId !== pair.studioSponsorId) return fail("conflict");
      return parseManifest(JSON.parse(prior.manifestJson));
    }
    const [venue] = await tx.select().from(sponsors).where(eq(sponsors.id, pair.sponsorId));
    if (!venue || venue.termStartsAt === null || venue.termEndsAt === null || venue.termStartsAt > now || venue.termEndsAt <= now) return fail("invalid");
    let eligibility: IssuanceManifest["eligibility"];
    if (venue.venuePlan === "pilot") {
      if (venue.allotmentMode !== "limited" || !venue.codeAllotment || !/^[A-Za-z0-9][A-Za-z0-9._:/-]{2,159}$/.test(input.pilotReference ?? "")) return fail("invalid");
      eligibility = { kind: "pilot", reference: input.pilotReference!, startsAt: venue.termStartsAt, endsAt: venue.termEndsAt };
    } else {
      if (input.pilotReference) return fail("invalid");
      const events = await tx.select().from(entitlementEvents).where(and(eq(entitlementEvents.sponsorId, venue.id), eq(entitlementEvents.action, "venue_payment")));
      const evidence = events.filter(event => matchesCurrentVenuePayment(venue, event, now));
      const [local] = await stores.studio.select().from(localSponsors).where(eq(localSponsors.id, pair.studioSponsorId));
      if (evidence.length !== 1 || !local || local.slug !== input.slug ||
          !VENUE_PAYMENT_FIELDS.every(key => local[key] === venue[key])) return fail("invalid");
      eligibility = { kind: venue.venuePlan === "founding" ? "founding" : "standard", reference: evidence[0].id,
        startsAt: venue.termStartsAt, endsAt: venue.termEndsAt };
    }
    const [issued] = await tx.select({ n: count() }).from(licenseCodes).where(and(eq(licenseCodes.sponsorId, venue.id), gte(licenseCodes.createdAt, venue.termStartsAt)));
    const increased = sql.join([sponsors.codesIssued, sql.raw(" + "), sql.param(input.count)]);
    const changed = await tx.update(sponsors).set({ codesIssued: increased, updatedAt: now })
      .where(and(eq(sponsors.id, venue.id), or(eq(sponsors.allotmentMode, "unlimited"), sql.join([increased, sql.raw(" <= "), sponsors.codeAllotment]))))
      .returning({ id: sponsors.id });
    if (changed.length !== 1) return fail("invalid");
    if (venue.allotmentMode === "unlimited" && venue.fairUseCeiling != null &&
        fairUseBreach({ fairUseCeiling: venue.fairUseCeiling, issuedInTerm: issued?.n ?? 0, requested: input.count })?.breached) {
      console.warn("[venue-fulfilment] Fair-use monitoring threshold crossed; authorised unlimited issuance continues.");
    }
    const codes = Array.from({ length: input.count }, () => ({
      licenseCodeId: "vlc-" + randomUUID().replaceAll("-", ""), code: generateCompCode("VENUE"),
    }));
    const manifest = parseManifest({ version: 1, issuanceId: input.issuanceId, sponsorId: venue.id,
      sponsorSlug: venue.slug, sponsorName: venue.name, environment, issuedAt: now, eligibility, tier: "wedding", durationDays: 548,
      codes: codes.map(code => ({ licenseCodeId: code.licenseCodeId, codeFingerprint: venueCodeFingerprint(code.code) })) });
    await tx.insert(venueFulfilmentRequests).values({ id: input.issuanceId, sponsorId: venue.id, studioSponsorId: pair.studioSponsorId,
      requestJson, manifestJson: JSON.stringify(manifest), manifestHash: manifestHash(manifest), operatorId: actor.id, operatorName: actor.name,
      createdAt: now, updatedAt: now });
    for (const code of codes) await tx.insert(licenseCodes).values({ id: code.licenseCodeId, sponsorId: venue.id, code: code.code,
      status: "minted", sourceType: "venue_edition", tier: "wedding", durationDays: 548, batchId: input.issuanceId, createdAt: now, updatedAt: now });
    await appendEvent(tx, { action: "mint", sponsorId: venue.id, batchId: input.issuanceId, actorId: actor.id, actorName: actor.name,
      reason: eligibility.kind === "pilot" ? "Explicit pilot issuance reservation" : "Verified paid licence issuance reservation",
      after: { issuanceId: input.issuanceId, count: input.count }, origin: "venue-fulfilment" });
    return manifest;
  }, { behavior: "immediate" });
}
async function allocation(stores: VenueStores, issuanceId: string) {
  const [request] = await stores.shared.select().from(venueFulfilmentRequests).where(eq(venueFulfilmentRequests.id, issuanceId));
  if (!request) return fail("not_found");
  const manifest = parseManifest(JSON.parse(request.manifestJson));
  if (manifestHash(manifest) !== request.manifestHash || manifest.issuanceId !== issuanceId || manifest.sponsorId !== request.sponsorId) return fail("conflict");
  const rows = await stores.shared.select().from(licenseCodes).where(eq(licenseCodes.batchId, issuanceId));
  if (rows.length !== manifest.codes.length) return fail("conflict");
  const codes = manifest.codes.map(expected => {
    const row = rows.find(code => code.id === expected.licenseCodeId);
    if (!row || row.sponsorId !== request.sponsorId || row.tier !== "wedding" || row.sourceType !== "venue_edition" ||
        row.durationDays !== 548 || venueCodeFingerprint(row.code) !== expected.codeFingerprint) return fail("conflict");
    return { licenseCodeId: row.id, code: row.code };
  });
  return { request, manifest, codes };
}
async function mirrorCodes(stores: VenueStores, allocated: Awaited<ReturnType<typeof allocation>>, result?: IssuanceReadback) {
  await stores.studio.transaction(async tx => {
    const [sponsor] = await tx.select().from(localSponsors).where(eq(localSponsors.id, allocated.request.studioSponsorId));
    if (!sponsor || sponsor.slug !== allocated.manifest.sponsorSlug) return fail("conflict");
    for (let i = 0; i < allocated.codes.length; i++) {
      const code = allocated.codes[i];
      const existing = await tx.select().from(localCodes).where(or(eq(localCodes.id, code.licenseCodeId), eq(localCodes.code, code.code)));
      const fields = { id: code.licenseCodeId, sponsorId: sponsor.id, code: code.code, sourceType: "venue_edition", tier: "wedding", durationDays: 548 };
      if (existing.length) {
        if (existing.length !== 1 || Object.entries(fields).some(([key, value]) => existing[0][key as keyof typeof existing[0]] !== value)) return fail("conflict");
      } else await tx.insert(localCodes).values(fields);
      if (result) {
        const state = result.codes[i].state;
        await tx.update(localCodes).set({ status: state === "available" ? "minted" : state === "claimed" ? "redeemed" : "revoked", updatedAt: result.checkedAt })
          .where(eq(localCodes.id, code.licenseCodeId));
      }
    }
  }, { behavior: "immediate" });
}
export type FulfilmentResult = { state: "fulfilled"; issuanceId: string; available: number; claimed: number; withdrawn: number }
  | { state: "pending"; issuanceId: string; reason: "conflict" | "unavailable" };
/** Network work is outside DB transactions. Every attempt reuses the exact set;
 * a revision fence rejects stale responses racing withdrawal. */
export async function fulfilVenueRequest(stores: VenueStores, issuanceId: string, runtime: VenueRuntime, actor: VenueOperator): Promise<FulfilmentResult> {
  operator(actor);
  const allocated = await allocation(stores, issuanceId);
  const revision = await stores.shared.transaction(async tx => {
    const [updated] = await tx.update(venueFulfilmentRequests)
      .set({ revision: sql.join([venueFulfilmentRequests.revision, sql.raw(" + 1")]), deliveryState: "pending", readbackJson: null, updatedAt: Date.now() })
      .where(eq(venueFulfilmentRequests.id, issuanceId)).returning({ revision: venueFulfilmentRequests.revision, withdrawalsJson: venueFulfilmentRequests.withdrawalsJson });
    return updated;
  }, { behavior: "immediate" });
  try {
    await mirrorCodes(stores, allocated);
    parseReadback(await runtime({ operation: "issue", manifest: allocated.manifest, codes: allocated.codes }, allocated.manifest), allocated.manifest);
    const withdrawals: string[] = JSON.parse(revision.withdrawalsJson);
    for (const licenseCodeId of withdrawals) {
      try { parseReadback(await runtime({ operation: "withdraw", issuanceId, manifestHash: allocated.request.manifestHash, licenseCodeId }, allocated.manifest), allocated.manifest); }
      catch (error) { if (!(error instanceof VenueIssuanceError) || error.code !== "already_claimed") throw error; }
    }
    const result = parseReadback(await runtime({ operation: "read", issuanceId, manifestHash: allocated.request.manifestHash }, allocated.manifest), allocated.manifest);
    if (Math.abs(Date.now() - result.checkedAt) > 300_000 || withdrawals.some(id => result.codes.find(code => code.licenseCodeId === id)?.state === "available")) return fail("conflict");
    await stores.shared.transaction(async tx => {
      const [current] = await tx.select().from(venueFulfilmentRequests).where(eq(venueFulfilmentRequests.id, issuanceId));
      if (!current || current.revision !== revision.revision) return fail("conflict");
      await mirrorCodes(stores, allocated, result);
      for (const code of result.codes) await tx.update(licenseCodes)
        .set({ status: code.state === "available" ? "minted" : code.state === "claimed" ? "redeemed" : "revoked", updatedAt: result.checkedAt })
        .where(and(eq(licenseCodes.id, code.licenseCodeId), eq(licenseCodes.batchId, issuanceId)));
      await tx.update(venueFulfilmentRequests).set({ deliveryState: "fulfilled", fulfilledAt: current.fulfilledAt ?? result.checkedAt,
        readbackJson: JSON.stringify(result), lastError: null, updatedAt: Date.now() }).where(eq(venueFulfilmentRequests.id, issuanceId));
    }, { behavior: "immediate" });
    return { state: "fulfilled", issuanceId, available: result.codes.filter(code => code.state === "available").length,
      claimed: result.codes.filter(code => code.state === "claimed").length, withdrawn: result.codes.filter(code => code.state === "withdrawn").length };
  } catch (error) {
    const reason = error instanceof VenueIssuanceError && error.code === "conflict" ? "conflict" : "unavailable";
    await stores.shared.update(venueFulfilmentRequests).set({ lastError: reason, updatedAt: Date.now() })
      .where(and(eq(venueFulfilmentRequests.id, issuanceId), eq(venueFulfilmentRequests.revision, revision.revision))).catch(() => undefined);
    return { state: "pending", issuanceId, reason };
  }
}
export async function withdrawVenueCode(stores: VenueStores, issuanceId: string, licenseCodeId: string, runtime: VenueRuntime, actor: VenueOperator) {
  const resolvedActor=operator(actor);
  await stores.shared.transaction(async tx => {
    const [row] = await tx.select().from(venueFulfilmentRequests).where(eq(venueFulfilmentRequests.id, issuanceId));
    if (!row || !parseManifest(JSON.parse(row.manifestJson)).codes.some(code => code.licenseCodeId === licenseCodeId)) return fail("not_found");
    const withdrawals = new Set<string>(JSON.parse(row.withdrawalsJson));
    const isNew=!withdrawals.has(licenseCodeId); withdrawals.add(licenseCodeId);
    await tx.update(venueFulfilmentRequests).set({ withdrawalsJson: JSON.stringify([...withdrawals].sort()),
      revision: sql.join([venueFulfilmentRequests.revision, sql.raw(" + 1")]), deliveryState: "pending", readbackJson: null, updatedAt: Date.now() })
      .where(eq(venueFulfilmentRequests.id, issuanceId));
    if(isNew)await appendEvent(tx,{action:"revoke",sponsorId:row.sponsorId,batchId:issuanceId,
      actorId:resolvedActor.id,actorName:resolvedActor.name,reason:"Unused code withdrawal requested; App readback determines the result",
      after:{issuanceId,licenseCodeId,state:"pending"},origin:"venue-fulfilment"});
  }, { behavior: "immediate" });
  const result = await fulfilVenueRequest(stores, issuanceId, runtime, actor);
  if (result.state === "pending") return result;
  const [row] = await stores.shared.select().from(venueFulfilmentRequests).where(eq(venueFulfilmentRequests.id, issuanceId));
  const code = parseReadback(JSON.parse(row.readbackJson!), parseManifest(JSON.parse(row.manifestJson))).codes.find(code => code.licenseCodeId === licenseCodeId)!;
  return { ...result, withdrawal: code.state === "claimed" ? "already_claimed" as const : "withdrawn" as const };
}
/** Private operator packet: fulfilled readback is committed BEFORE any bearer is
 * returned for manual delivery. Never expose this as a public route or log. */
export async function prepareVenuePacket(stores: VenueStores, issuanceId: string, runtime: VenueRuntime, actor: VenueOperator, appOrigin: string) {
  const result = await fulfilVenueRequest(stores, issuanceId, runtime, actor);
  if (result.state !== "fulfilled") return { ready: false as const, result };
  const allocated = await allocation(stores, issuanceId);
  if (allocated.request.deliveryState !== "fulfilled" || !allocated.request.fulfilledAt || !allocated.request.readbackJson) return { ready: false as const, result: { state: "pending" as const, issuanceId, reason: "unavailable" as const } };
  const readback = parseReadback(JSON.parse(allocated.request.readbackJson), allocated.manifest);
  const available = allocated.codes.filter(code => readback.codes.find(row => row.licenseCodeId === code.licenseCodeId)?.state === "available");
  return { ready: available.length > 0, result, packet: { version: 1, issuanceId, environment: allocated.manifest.environment,
    sponsor: allocated.manifest.sponsorName, codeCount: available.length, fulfilledReadbackAt: readback.checkedAt,
    codes: available.map(row => ({ licenseCodeId: row.licenseCodeId, code: row.code, redeemUrl: new URL("/redeem/" + encodeURIComponent(row.code), appOrigin).href })),
    support: "Try the same code and account after an uncertain claim. Do not replace a code or reapply starter work without checking the original request." } };
}

/** Operator support snapshot, deliberately not a fresh runtime assertion. */
export async function venueFulfilmentStatus(stores:VenueStores,issuanceId:string,actor:VenueOperator){
  operator(actor);const {request,manifest}=await allocation(stores,issuanceId);
  const ack=request.readbackJson ? parseReadback(JSON.parse(request.readbackJson),manifest) : null;
  return {issuanceId,state:request.deliveryState,revision:request.revision,lastError:request.lastError,
    firstFulfilledAt:request.fulfilledAt,lastCheckedAt:ack?.checkedAt??null,
    codes:manifest.codes.map(code=>({licenseCodeId:code.licenseCodeId,lastObservedState:ack?.codes.find(row=>row.licenseCodeId===code.licenseCodeId)?.state??"unknown"}))};
}
