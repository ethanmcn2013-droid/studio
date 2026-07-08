import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { loadAtlasSnapshot } from "@/features/atlas/server/load-snapshot";
import { AtlasExperience } from "@/features/atlas/components/atlas-experience";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "atlas map, signal hq",
  description:
    "A living map of how Signal Studio thinks, builds, ships, and operates.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default async function AtlasMapPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access");

  const snapshot = await loadAtlasSnapshot();

  return (
    <main id="main" className="flex flex-1 flex-col">
      <AtlasExperience snapshot={snapshot} />
    </main>
  );
}
