import type { Metadata } from "next";
import { HqActionCenter } from "@/components/hq/hq-action-center";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { buildActionCenter } from "@/lib/hq/action-center";
import { getInboxData } from "@/lib/hq/inbox";
import { getOperatorTodos } from "@/lib/hq/operator-todos";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Action Center · Signal HQ",
  description: "Everything that needs the founder, prioritized.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default async function ActionCenterPage() {
  await requireHqAccess();

  const [inbox, todos] = await Promise.all([getInboxData(), getOperatorTodos()]);
  const data = buildActionCenter(inbox, todos);

  return <HqActionCenter data={data} />;
}
