import { handleInvitations, reportFailure } from "@/lib/sponsor-programme/handlers";
import { reportRuntime } from "@/lib/sponsor-programme/runtime";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
async function handle(request: Request, context: { params: Promise<{ programmeId: string }> }) {
  try { const { programmeId } = await context.params; return await handleInvitations(request, programmeId, reportRuntime()); }
  catch (error) { return reportFailure(error); }
}
export { handle as GET, handle as POST };
