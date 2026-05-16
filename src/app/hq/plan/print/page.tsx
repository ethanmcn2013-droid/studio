import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { DeckPrint } from "@/components/hq/one-pager/DeckPrint";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Marketing plan — PDF export",
  description: "Print-fidelity export of the six-month marketing plan deck.",
  robots: { index: false, follow: false },
};

export default async function MarketingPlanPrintPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access");

  return <DeckPrint />;
}
