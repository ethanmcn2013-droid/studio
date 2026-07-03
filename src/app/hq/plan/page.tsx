import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import MarketingDeck from "@/components/hq/marketing-deck";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Marketing plan · Signal HQ",
  description: "Private. The ratified 6-month marketing plan as a deck.",
  robots: { index: false, follow: false },
};

export default async function MarketingPlanPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access");

  return <MarketingDeck />;
}
