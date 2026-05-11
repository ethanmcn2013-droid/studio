import type { Metadata } from "next";
import { HqDashboard } from "@/components/hq/hq-dashboard";

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

export default function HqPage() {
  return <HqDashboard />;
}
