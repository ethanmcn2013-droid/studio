import Image from "next/image";
import manifest from "../../../public/brand/guidelines/manifest.json";
import type {
  BrandAsset,
  BrandAssetCategory,
} from "@/lib/brand-guidelines/types";

const CATEGORY_ORDER: readonly BrandAssetCategory[] = [
  "Wordmarks",
  "Marks",
  "App icons",
  "Product marks",
  "Tokens",
  "Motion",
  "Imagery",
  "Templates",
  "Print",
];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function isImage(asset: BrandAsset) {
  return ["SVG", "PNG", "WEBP", "JPG"].includes(asset.format);
}

export function AssetLedger() {
  const assets = manifest.assets as BrandAsset[];

  return (
    <div className="guidelines-assets">
      <div className="guidelines-assets-head">
        <div>
          <p>Signal Studio brand kit</p>
          <span>Version {manifest.version}. Approved paper, ink, and indigo assets.</span>
        </div>
        <a href={manifest.archive} download>
          Download everything
        </a>
      </div>

      <div className="guidelines-asset-groups">
        {CATEGORY_ORDER.map((category) => {
          const categoryAssets = assets.filter((asset) => asset.category === category);
          if (categoryAssets.length === 0) return null;
          return (
            <section key={category} className="guidelines-asset-group" aria-labelledby={`assets-${category.replaceAll(" ", "-").toLowerCase()}`}>
              <h3 id={`assets-${category.replaceAll(" ", "-").toLowerCase()}`}>
                {category}
                <span>{String(categoryAssets.length).padStart(2, "0")}</span>
              </h3>
              <div>
                {categoryAssets.map((asset) => (
                  <article key={asset.id} className="guidelines-asset-row">
                    <div className="guidelines-asset-preview">
                      {isImage(asset) ? (
                        <Image
                          src={asset.preview}
                          alt=""
                          fill
                          sizes="72px"
                        />
                      ) : (
                        <span>{asset.format}</span>
                      )}
                    </div>
                    <div>
                      <strong>{asset.title}</strong>
                      <p>{asset.filename}</p>
                    </div>
                    <dl>
                      <div>
                        <dt>Format</dt>
                        <dd>{asset.format}</dd>
                      </div>
                      <div>
                        <dt>Size</dt>
                        <dd>{asset.dimensions}</dd>
                      </div>
                      <div>
                        <dt>File</dt>
                        <dd>{asset.external ? "Source" : formatBytes(asset.bytes)}</dd>
                      </div>
                    </dl>
                    <a
                      href={asset.downloadUrl}
                      download={!asset.external}
                      rel={asset.external ? "noreferrer" : undefined}
                      target={asset.external ? "_blank" : undefined}
                    >
                      {asset.external ? "Open source" : "Download"}
                    </a>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="guidelines-assets-foot">
        <a href={manifest.terms}>Usage terms</a>
        <a href={manifest.checksumManifest}>Checksum manifest</a>
        <span>Updated {manifest.updated}</span>
      </div>
    </div>
  );
}
