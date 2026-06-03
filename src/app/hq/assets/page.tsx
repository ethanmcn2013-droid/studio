import type { Metadata } from "next";
import Link from "next/link";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { HQ_ASSETS, type HqAsset } from "@/lib/hq/operating-system";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Asset Hub — Signal HQ",
  description: "Brand, sales, proof, export, and shareholder assets.",
  robots: { index: false, follow: false },
};

const GROUPS: Array<{ key: HqAsset["group"]; label: string; note: string }> = [
  {
    key: "shareholder",
    label: "Shareholder",
    note: "Board-safe narrative, plan, and deck material.",
  },
  {
    key: "brand",
    label: "Brand",
    note: "The source kit and live brand system.",
  },
  {
    key: "sales",
    label: "Sales",
    note: "Founder-signed venue material and outreach.",
  },
  {
    key: "proof",
    label: "Proof",
    note: "Video, demo, and review-gate material.",
  },
  {
    key: "export",
    label: "Export",
    note: "Print and PDF-ready documents.",
  },
];

export default async function AssetsPage() {
  await requireHqAccess();

  return (
    <main id="main" className="hq-page">
      <header className="hq-page-header">
        <span className="hq-page-eyebrow">Signal HQ · Asset Hub</span>
        <h1 className="hq-page-title">The material library<span aria-hidden="true">.</span></h1>
        <p className="hq-page-intro">
          Brand kit, one-pagers, investor material, venue proof, and founder
          outreach sit in one inventory. Ready assets link to the rendered
          surface; working assets show the canonical source.
        </p>
      </header>

      <section className="hq-asset-index" aria-label="asset groups">
        {GROUPS.map((group) => {
          const assets = HQ_ASSETS.filter((asset) => asset.group === group.key);
          return (
            <div key={group.key} className="hq-asset-group">
              <div className="hq-asset-group-head">
                <span className="hq-asset-group-label">{group.label}</span>
                <span className="hq-asset-group-count">{assets.length}</span>
              </div>
              <p className="hq-asset-group-note">{group.note}</p>
              <div className="hq-asset-ledger">
                {assets.map((asset) => (
                  <AssetRow key={asset.id} asset={asset} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}

function AssetRow({ asset }: { asset: HqAsset }) {
  const body = (
    <>
      <span className="hq-asset-state" data-state={asset.state}>
        {asset.state}
      </span>
      <span className="hq-asset-title">{asset.title}</span>
      <span className="hq-asset-note">{asset.note}</span>
      <span className="hq-asset-source">{asset.source}</span>
      <span className="hq-asset-action">
        {asset.href ? `${asset.action} →` : asset.action}
      </span>
    </>
  );

  if (asset.href) {
    return (
      <Link href={asset.href} className="hq-asset-row">
        {body}
      </Link>
    );
  }

  return <div className="hq-asset-row hq-asset-row--static">{body}</div>;
}
