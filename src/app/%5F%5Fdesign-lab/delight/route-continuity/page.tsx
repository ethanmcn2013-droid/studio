import type { Metadata } from "next";
import { RouteContinuityLab } from "@/components/design-lab/delight/delight-labs";

export const metadata: Metadata = {
  title: "Route continuity · Delight review · Signal Studio",
  robots: { index: false, follow: false },
};

export default async function RouteContinuityPage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const params = await searchParams;
  const requested = Number.parseInt(params.v ?? "1", 10);
  const initialVariant = Number.isFinite(requested) ? requested - 1 : 0;

  return <RouteContinuityLab initialVariant={initialVariant} />;
}
