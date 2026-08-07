import type { Metadata } from "next";
import { HqPageHeader } from "@/components/hq/hq-page-header";
import { AssetCurator } from "@/components/hq/asset-curator";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { CURATOR_ASSETS, CURATOR_CATEGORIES } from "@/lib/hq/asset-curator-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Asset Curator · Signal HQ",
  description: "Review, shortlist, and export Signal Studio's preferred visual directions.",
  robots: { index: false, follow: false },
};

export default async function AssetCuratorPage() {
  await requireHqAccess();

  return (
    <div className="hqx-page">
      <HqPageHeader
        slug="asset-curator"
        title="Lock the visual canon."
        standfirst="Review every retained direction once, mark what belongs to Signal Studio, and export the exact reference set for future work."
        meta={
          <span className="hq-page-head-note">
            {CURATOR_ASSETS.length} directions · {CURATOR_CATEGORIES.length} collections · saved on this device
          </span>
        }
      />
      <AssetCurator />
    </div>
  );
}
