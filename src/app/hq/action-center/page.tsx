import type { Metadata } from "next";
import { HqActionCenter } from "@/components/hq/hq-action-center";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { buildActionCenter } from "@/lib/hq/action-center";
import { getInboxData } from "@/lib/hq/inbox";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Source ledger · Signal HQ",
  description: "Source-derived risks, reviews, follow-ups, and operational signals.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default async function ActionCenterPage() {
  await requireHqAccess();

  const data = buildActionCenter(await getInboxData());

  return (
    <HqActionCenter
      data={data}
      trackerHref="https://github.com/users/ethanmcn2013-droid/projects/1"
    />
  );
}
