import type { Metadata } from "next";
import { HomepageLineageLab } from "@/components/design-lab/delight/delight-labs";

export const metadata: Metadata = {
  title: "Homepage lineage · Delight review · Signal Studio",
  robots: { index: false, follow: false },
};

export default async function HomepageLineagePage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const params = await searchParams;
  const requested = Number.parseInt(params.v ?? "1", 10);
  const initialVariant = Number.isFinite(requested) ? requested - 1 : 0;

  return <HomepageLineageLab initialVariant={initialVariant} />;
}
