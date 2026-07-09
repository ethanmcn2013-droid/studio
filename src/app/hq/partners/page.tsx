import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * The venue funnel is folded into the Access console's Venues tab — one venue
 * surface (per LICENSING_ACCESS_DESIGN.md). This route is retired to a
 * redirect so existing links keep working. The old per-sponsor stats now
 * render from lib/hq/access.getVenues.
 */
export default function PartnersPage() {
  redirect("/hq/entitlements?tab=venues");
}
