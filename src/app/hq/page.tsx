import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HqDashboard } from "@/components/hq/hq-dashboard";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Signal HQ — Signal Studio",
  description: "Private operating dashboard for Signal Studio.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function HqPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;

  if (!valid) {
    redirect("/hq/access");
  }

  return <HqDashboard />;
}
