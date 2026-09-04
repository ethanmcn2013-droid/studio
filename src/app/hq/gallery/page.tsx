import type { Metadata } from "next";
import { HqPageHeader } from "@/components/hq/hq-page-header";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { formatBytes, readGallery, type GalleryAsset } from "@/lib/hq/gallery";
import styles from "@/components/hq/hq-gallery.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Gallery · Signal HQ",
  description: "Every graphic asset Signal Studio has produced, in one place.",
  robots: { index: false, follow: false },
};

export default async function GalleryPage() {
  await requireHqAccess();
  const { sets, total, bytes } = await readGallery();

  return (
    <main id="main" className="hq-page">
      <HqPageHeader
        slug="gallery"
        title="Every asset, in one place."
        standfirst="The whole graphic bank — launch set, social system, venue kit, identity, cards, ambassador kit and retained explorations. Read from the files themselves, so nothing here can drift from what actually exists."
        meta={
          <span className="hq-page-head-note">
            {total} assets across {sets.length} sets · {formatBytes(bytes)} ·
            every file links to its full-size original
          </span>
        }
      />

      <div className={styles.gallery}>
        <nav className={styles.index} aria-label="Asset sets">
          {sets.map((set) => (
            <a key={set.key} href={`#${set.key}`} className={styles.indexLink}>
              <b>{set.name}</b>
              <span>{set.assets.length}</span>
            </a>
          ))}
        </nav>

        {sets.map((set) => {
          const setBytes = set.assets.reduce((n, a) => n + a.bytes, 0);
          return (
            <section key={set.key} id={set.key} className={styles.set}>
              <div className={styles.setHead}>
                <h2 className={styles.setName}>{set.name}</h2>
                <span className={styles.setCount}>{set.assets.length}</span>
                <span className={styles.setBytes}>{formatBytes(setBytes)}</span>
              </div>
              <p className={styles.setNote}>{set.note}</p>
              <div className={styles.grid}>
                {set.assets.map((asset) => (
                  <Tile key={asset.href} asset={asset} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}

function Tile({ asset }: { asset: GalleryAsset }) {
  const label = asset.code ?? asset.file.replace(/\.[a-z]+$/, "");
  return (
    <a
      className={styles.tile}
      href={asset.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open ${asset.file}`}
    >
      <div className={styles.frame}>
        {asset.ext === "pdf" ? (
          <span className={styles.doc}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
            pdf
          </span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset.href} alt={asset.alt ?? label} loading="lazy" decoding="async" />
        )}
      </div>
      <div className={styles.meta}>
        <span className={styles.metaTop}>
          <span className={styles.code}>{label}</span>
          {asset.size ? <span className={styles.size}>{asset.size}</span> : null}
        </span>
        <span className={styles.file}>{asset.file}</span>
        {asset.alt ? <p className={styles.alt}>{asset.alt}</p> : null}
      </div>
    </a>
  );
}
