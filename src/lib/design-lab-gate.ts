import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getAccessMode } from "./access-mode";

/**
 * The design-lab gate. Pages under /__design-lab are review surfaces and
 * archived public pages: they render on local development, review deploys
 * and Vercel previews, and answer 404 on every production deployment and
 * on the canonical hosts. One gate, shared, so no lab page can drift open.
 */
function hostname(value: string | null): string {
  return (value ?? "")
    .split(",")[0]
    .trim()
    .split(":")[0]
    .toLowerCase();
}

export async function assertDesignLabAccess(): Promise<void> {
  const mode = getAccessMode();
  const requestHeaders = await headers();
  const host = hostname(
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host"),
  );
  const isCanonicalProductionHost =
    host === "signalstudio.ie" || host === "www.signalstudio.ie";
  const isProductionDeployment = process.env.VERCEL_ENV === "production";
  const isPreviewDeployment = process.env.VERCEL_ENV === "preview";

  if (
    isProductionDeployment ||
    isCanonicalProductionHost ||
    (!isPreviewDeployment && mode !== "development" && mode !== "review")
  ) {
    notFound();
  }
}
