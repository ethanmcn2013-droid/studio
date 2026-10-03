import { verifyReportAssertion } from "./auth";
import { getReport, ReportError, type ReportDatabase } from "./storage";
import { monthWindow } from "./compute";
import { reportCsv, reportHtml } from "./export";
import { invitationAdministration, recordInvitation, type ClaimResolver } from "./administration";
export type HandlerDependencies = { db: ReportDatabase; secret: string; enabled: boolean; now?: () => number; claims?: ClaimResolver };
const headers = { "Cache-Control": "private, no-store, max-age=0", "Vary": "Authorization", "X-Content-Type-Options": "nosniff" };
function subject(request: Request, deps: HandlerDependencies, now: number) {
  if (!deps.enabled) throw new ReportError("unavailable");
  const auth = request.headers.get("authorization") ?? "";
  if (!auth.startsWith("Bearer ")) throw new ReportError("forbidden");
  return verifyReportAssertion(auth.slice(7), deps.secret, Math.floor(now / 1000));
}
export function reportFailure(error: unknown): Response {
  const code = error instanceof ReportError ? error.code : "unavailable";
  return Response.json({ state: code }, { status: { forbidden: 403, not_found: 404, not_ready: 409, restricted: 410, conflict: 409, unavailable: 503 }[code], headers });
}
export async function handleReport(request: Request, programmeId: string, month: string, deps: HandlerDependencies) {
  try {
    const now = deps.now?.() ?? Date.now();
    const actor = subject(request, deps, now);
    if (!/^[A-Za-z0-9_-]{1,96}$/.test(programmeId)) throw new ReportError("not_found");
    try { monthWindow(month); } catch { throw new ReportError("not_found"); }
    const query = new URL(request.url).searchParams;
    if ([...query.keys()].some(k => k !== "format") || query.getAll("format").length > 1 ||
      (query.has("format") && !["json", "csv", "html"].includes(query.get("format")!))) throw new ReportError("conflict");
    const csv = query.get("format") === "csv";
    const report = await getReport(deps.db, programmeId, month, actor, csv, now);
    if (query.get("format") === "html") return new Response(reportHtml(report), { headers: { ...headers, "Content-Type": "text/html; charset=utf-8", "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'; base-uri 'none'" } });
    return csv ? new Response(reportCsv(report), { headers: { ...headers, "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="sponsor-report-${month}.csv"` } }) : Response.json(report, { headers });
  } catch (error) { return reportFailure(error); }
}
export async function handleInvitations(request: Request, programmeId: string, deps: HandlerDependencies) {
  try {
    const now = deps.now?.() ?? Date.now(); const actor = subject(request, deps, now);
    if (!/^[A-Za-z0-9_-]{1,96}$/.test(programmeId) || new URL(request.url).search) throw new ReportError("conflict");
    if (request.method === "GET") return Response.json(await invitationAdministration(deps.db, programmeId, actor, now, deps.claims), { headers });
    if (request.method !== "POST") return new Response(null, { status: 405, headers });
    if (Number(request.headers.get("content-length")) > 2048) throw new ReportError("conflict");
    const reader = request.body?.getReader(); if (!reader) throw new ReportError("conflict");
    let data = ""; const decoder = new TextDecoder();
    try { let bytes = 0; while (true) { const chunk = await reader.read(); if (chunk.done) break; bytes += chunk.value.byteLength;
      if (bytes > 2048) throw new ReportError("conflict"); data += decoder.decode(chunk.value, { stream: true }); } data += decoder.decode(); }
    finally { await reader.cancel(); }
    let parsed: unknown; try { parsed = JSON.parse(data); } catch { throw new ReportError("conflict"); }
    return Response.json(await recordInvitation(deps.db, programmeId, actor, parsed, now), { headers });
  } catch (error) { return reportFailure(error); }
}
