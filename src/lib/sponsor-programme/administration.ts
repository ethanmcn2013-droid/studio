import type { ReportDatabase } from "./storage";
import { readProgramme, ReportError, requireCapability } from "./storage";
export type OperationalClaim = { licenseCodeId: string; grantStartsAt: number };
export type ClaimResolver = (sponsorId: string, now: number) => Promise<readonly OperationalClaim[]>;
/** Operational reference and statuses only. This query never touches activity tables. */
export async function invitationAdministration(db: ReportDatabase, programmeId: string, subject: string, now: number, resolveClaims?: ClaimResolver) {
  const tx = await db.transaction("read");
  try {
    await requireCapability(tx, programmeId, subject, "invitation_admin", now);
    const p = await readProgramme(tx, programmeId);
    const rows = await tx.execute({ sql: `SELECT c.id,c.status,c.created_at,c.redeemed_at,c.expires_at,
      i.issued_at,i.delivered_at FROM license_codes c
      LEFT JOIN sponsor_programme_invitations i ON i.license_code_id=c.id AND i.programme_id=?
      WHERE c.sponsor_id=? ORDER BY c.id LIMIT 1001`, args: [p.id, p.sponsorId] });
    if (rows.rows.length > 1000) throw new ReportError("unavailable");
    // Studio's minted-code row can lag App redemption. Missing verified App
    // evidence is unknown, never an inferred zero or local-status claim count.
    let claims: Map<string, number> | null = null;
    if (resolveClaims) try {
      const verified = await resolveClaims(p.sponsorId, now);
      const map = new Map<string, number>();
      for (const claim of verified) {
        if (map.has(claim.licenseCodeId) || !Number.isSafeInteger(claim.grantStartsAt) || claim.grantStartsAt > now) throw new Error("invalid_claim_census");
        map.set(claim.licenseCodeId, claim.grantStartsAt);
      }
      claims = map;
    } catch { /* Other operational facts remain available during provenance outage. */ }
    const invitations = rows.rows.map(r => ({ reference: String(r.id), codeStatus: String(r.status),
      generatedAt: Number(r.created_at), issuedAt: r.issued_at === null ? null : Number(r.issued_at),
      delivery: r.delivered_at === null ? { state: "unknown" as const } : { state: "evidenced" as const, source: "operator_attestation" as const, at: Number(r.delivered_at) },
      claim: claims === null ? { state: "unknown" as const } : claims.has(String(r.id)) ? { state: "verified" as const, at: claims.get(String(r.id))! } : { state: "unknown" as const }, expiresAt: r.expires_at === null ? null : Number(r.expires_at) }));
    await tx.commit();
    return { programmeId, generated: invitations.length, issued: invitations.filter(i => i.issuedAt !== null).length,
      evidencedDelivery: invitations.filter(i => i.delivery.state === "evidenced").length,
      claimed: claims === null || invitations.some(i => i.claim.state === "unknown") ? { state: "unavailable" as const } : { state: "verified" as const, value: invitations.filter(i => i.claim.state === "verified").length }, invitations };
  } catch (error) { await tx.rollback(); throw error; } finally { tx.close(); }
}
export async function recordInvitation(db: ReportDatabase, programmeId: string, subject: string, input: unknown, now: number) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new ReportError("conflict");
  const v = input as Record<string, unknown>;
  if (Object.keys(v).some(k => !["reference", "issuedAt", "issuanceEvidence", "deliveredAt", "deliveryEvidence"].includes(k)) ||
    typeof v.reference !== "string" || !/^[A-Za-z0-9_-]{1,96}$/.test(v.reference) ||
    !Number.isSafeInteger(v.issuedAt) || Number(v.issuedAt) <= 0 || Number(v.issuedAt) > now ||
    typeof v.issuanceEvidence !== "string" || !/^[A-Za-z0-9:_-]{1,128}$/.test(v.issuanceEvidence) ||
    (v.deliveredAt !== undefined && (!Number.isSafeInteger(v.deliveredAt) || Number(v.deliveredAt) < Number(v.issuedAt) || Number(v.deliveredAt) > now ||
      typeof v.deliveryEvidence !== "string" || !/^[A-Za-z0-9:_-]{1,128}$/.test(v.deliveryEvidence))) ||
    (v.deliveredAt === undefined && v.deliveryEvidence !== undefined)) throw new ReportError("conflict");
  const tx = await db.transaction("write");
  try {
    await requireCapability(tx, programmeId, subject, "invitation_admin", now);
    const programme = await readProgramme(tx, programmeId);
    const code = (await tx.execute({ sql: "SELECT created_at FROM license_codes WHERE id=? AND sponsor_id=?", args: [v.reference, programme.sponsorId] })).rows[0];
    if (!code || Number(v.issuedAt) < Number(code.created_at)) throw new ReportError("not_found");
    const args = [programmeId, v.reference, Number(v.issuedAt), v.issuanceEvidence, v.deliveredAt === undefined ? null : Number(v.deliveredAt), v.deliveryEvidence as string ?? null];
    const prior = (await tx.execute({ sql: "SELECT * FROM sponsor_programme_invitations WHERE programme_id=? AND license_code_id=?", args: [programmeId, v.reference] })).rows[0];
    if (prior && (prior.issued_at !== args[2] || prior.issuance_evidence !== args[3] ||
      (prior.delivered_at !== null && (prior.delivered_at !== args[4] || prior.delivery_evidence !== args[5])))) throw new ReportError("conflict");
    await tx.execute({ sql: `INSERT INTO sponsor_programme_invitations VALUES (?,?,?,?,?,?)
      ON CONFLICT(programme_id,license_code_id) DO UPDATE SET delivered_at=coalesce(delivered_at,excluded.delivered_at),delivery_evidence=coalesce(delivery_evidence,excluded.delivery_evidence)`, args });
    await tx.commit(); return { recorded: true };
  } catch (error) { await tx.rollback(); throw error; } finally { tx.close(); }
}
