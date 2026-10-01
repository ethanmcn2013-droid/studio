import { handleReport, reportFailure } from "@/lib/sponsor-programme/handlers";
import { reportRuntime } from "@/lib/sponsor-programme/runtime";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request, context: { params: Promise<{ programmeId: string; month: string }> }) {
  try { const { programmeId, month } = await context.params; return await handleReport(request, programmeId, month, reportRuntime()); }
  catch (error) { return reportFailure(error); }
}
