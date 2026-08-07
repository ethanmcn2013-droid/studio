"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CURATOR_ASSETS,
  CURATOR_CATEGORIES,
  DEFAULT_PREFERRED_ASSET_IDS,
  type CuratorAsset,
  type CuratorCategory,
} from "@/lib/hq/asset-curator-data";
import styles from "./asset-curator.module.css";

type Verdict = "preferred" | "rejected";
type StoredReview = { verdict?: Verdict; note?: string };
type ReviewMap = Record<string, StoredReview>;
type StatusFilter = "all" | "unreviewed" | Verdict;
type CollectionView = "preferred" | "remaining";

const STORAGE_KEY = "signal-hq.asset-curator.v2";
const DEFAULT_REVIEWS: ReviewMap = Object.fromEntries(
  DEFAULT_PREFERRED_ASSET_IDS.map((id) => [id, { verdict: "preferred" as const }]),
);

function readReviews(): ReviewMap {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ReviewMap) : DEFAULT_REVIEWS;
  } catch {
    return DEFAULT_REVIEWS;
  }
}

function useReviews() {
  const [reviews, setReviews] = useState<ReviewMap>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setReviews(readReviews());
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  }, [ready, reviews]);

  return { reviews, setReviews, ready };
}

export function AssetCurator() {
  const { reviews, setReviews, ready } = useReviews();
  const [collectionView, setCollectionView] = useState<CollectionView>("preferred");
  const [category, setCategory] = useState<CuratorCategory | "all">("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showShortlist, setShowShortlist] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const reviewedCount = useMemo(
    () => CURATOR_ASSETS.filter((asset) => reviews[asset.id]?.verdict).length,
    [reviews],
  );
  const preferred = useMemo(
    () => CURATOR_ASSETS.filter((asset) => reviews[asset.id]?.verdict === "preferred"),
    [reviews],
  );
  const rejectedCount = reviewedCount - preferred.length;
  const remainingCount = CURATOR_ASSETS.length - preferred.length;

  const selectCollectionView = (next: CollectionView) => {
    setCollectionView(next);
    setStatus("all");
    setActiveId(null);
  };

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return CURATOR_ASSETS.filter((asset) => {
      if (category !== "all" && asset.category !== category) return false;
      const verdict = reviews[asset.id]?.verdict;
      if (collectionView === "preferred" && verdict !== "preferred") return false;
      if (collectionView === "remaining" && verdict === "preferred") return false;
      if (status === "unreviewed" && verdict) return false;
      if (status === "preferred" && verdict !== "preferred") return false;
      if (status === "rejected" && verdict !== "rejected") return false;
      if (needle && !`${asset.id} ${asset.title} ${asset.source}`.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [category, collectionView, query, reviews, status]);

  const activeIndex = activeId ? visible.findIndex((asset) => asset.id === activeId) : -1;
  const activeAsset = activeIndex >= 0 ? visible[activeIndex] : null;

  const updateReview = useCallback(
    (id: string, patch: StoredReview | null) => {
      setReviews((current) => {
        if (patch === null) {
          const next = { ...current };
          delete next[id];
          return next;
        }
        return { ...current, [id]: { ...current[id], ...patch } };
      });
    },
    [setReviews],
  );

  const moveLightbox = useCallback(
    (offset: number) => {
      if (activeIndex < 0 || visible.length === 0) return;
      const next = (activeIndex + offset + visible.length) % visible.length;
      setActiveId(visible[next].id);
    },
    [activeIndex, visible],
  );

  useEffect(() => {
    if (!activeAsset) return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, [contenteditable='true']")) return;
      if (event.key === "Escape") setActiveId(null);
      if (event.key === "ArrowRight") moveLightbox(1);
      if (event.key === "ArrowLeft") moveLightbox(-1);
      if (event.key.toLowerCase() === "p") updateReview(activeAsset.id, { verdict: "preferred" });
      if (event.key.toLowerCase() === "x") updateReview(activeAsset.id, { verdict: "rejected" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeAsset, moveLightbox, updateReview]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const shortlistText = useMemo(() => buildShortlistText(preferred, reviews), [preferred, reviews]);

  const copyShortlist = async () => {
    await navigator.clipboard.writeText(shortlistText);
    setToast("Preferred list copied");
  };

  const downloadShortlist = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      purpose: "Signal Studio preferred visual reference set",
      preferred: preferred.map((asset) => ({
        id: asset.id,
        title: asset.title,
        category: asset.category,
        source: asset.source,
        note: reviews[asset.id]?.note?.trim() || undefined,
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "signal-studio-preferred-assets.json";
    link.click();
    URL.revokeObjectURL(url);
    setToast("Reference file downloaded");
  };

  if (!ready) return <div className={styles.loading}>Loading your review…</div>;

  return (
    <div className={styles.curator}>
      <section className={styles.dashboard} aria-label="Review progress">
        <div className={styles.progressCopy}>
          <span className={styles.kicker}>Canon review</span>
          <strong>{reviewedCount} of {CURATOR_ASSETS.length}</strong>
          <span>{CURATOR_ASSETS.length - reviewedCount} still to decide</span>
        </div>
        <div className={styles.progressTrack} aria-hidden="true">
          <span style={{ width: `${(reviewedCount / CURATOR_ASSETS.length) * 100}%` }} />
        </div>
        <div className={styles.metrics}>
          <button type="button" onClick={() => selectCollectionView("preferred")}>
            <strong>{preferred.length}</strong><span>preferred</span>
          </button>
          <button type="button" onClick={() => { selectCollectionView("remaining"); setStatus("rejected"); }}>
            <strong>{rejectedCount}</strong><span>not for us</span>
          </button>
          <button type="button" onClick={() => { selectCollectionView("remaining"); setStatus("unreviewed"); }}>
            <strong>{CURATOR_ASSETS.length - reviewedCount}</strong><span>unreviewed</span>
          </button>
        </div>
        <button
          type="button"
          className={styles.shortlistButton}
          onClick={() => setShowShortlist(true)}
          disabled={preferred.length === 0}
        >
          Open preferred list <span>{preferred.length}</span>
        </button>
      </section>

      <section className={styles.collectionSwitch} aria-label="Preferred or still to review">
        <button
          type="button"
          data-active={collectionView === "preferred" || undefined}
          onClick={() => selectCollectionView("preferred")}
        >
          <span>Brand canon</span>
          <strong>Preferred</strong>
          <em>{preferred.length} selected references</em>
        </button>
        <button
          type="button"
          data-active={collectionView === "remaining" || undefined}
          onClick={() => selectCollectionView("remaining")}
        >
          <span>Review queue</span>
          <strong>Still to review</strong>
          <em>{remainingCount} assets not chosen</em>
        </button>
      </section>

      <section className={styles.controls} aria-label="Asset filters">
        <div className={styles.categoryTabs} role="group" aria-label="Collection">
          <FilterButton active={category === "all"} onClick={() => setCategory("all")}>
            All <span>{CURATOR_ASSETS.length}</span>
          </FilterButton>
          {CURATOR_CATEGORIES.map((item) => (
            <FilterButton key={item.key} active={category === item.key} onClick={() => setCategory(item.key)}>
              {item.shortLabel} <span>{CURATOR_ASSETS.filter((asset) => asset.category === item.key).length}</span>
            </FilterButton>
          ))}
        </div>
        <div className={styles.toolRow}>
          <label className={styles.search}>
            <span className="sr-only">Search assets</span>
            <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"/><path d="m13 13 4 4"/></svg>
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by ID, title, or file"
            />
            {query ? <button type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button> : null}
          </label>
          {collectionView === "remaining" ? (
            <select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)} aria-label="Review state">
              <option value="all">All not chosen</option>
              <option value="unreviewed">Still to decide</option>
              <option value="rejected">Not for us</option>
            </select>
          ) : <span className={styles.lockedFilter}>Preferred references only</span>}
        </div>
      </section>

      <div className={styles.resultLine}>
        <span>{visible.length} {visible.length === 1 ? "direction" : "directions"} · {collectionView === "preferred" ? "preferred" : "not chosen"}</span>
        {(category !== "all" || status !== "all" || query) ? (
          <button type="button" onClick={() => { setCategory("all"); setStatus("all"); setQuery(""); }}>Clear filters</button>
        ) : null}
      </div>

      {visible.length ? (
        <section className={styles.grid} aria-label="Asset directions">
          {visible.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              review={reviews[asset.id]}
              onOpen={() => setActiveId(asset.id)}
              onVerdict={(verdict) => updateReview(asset.id, reviews[asset.id]?.verdict === verdict ? null : { verdict })}
            />
          ))}
        </section>
      ) : (
        <div className={styles.empty}>
          <strong>No directions match.</strong>
          <span>Clear a filter or search a different ID.</span>
        </div>
      )}

      {activeAsset ? (
        <Lightbox
          asset={activeAsset}
          review={reviews[activeAsset.id]}
          index={activeIndex}
          total={visible.length}
          onClose={() => setActiveId(null)}
          onMove={moveLightbox}
          onReview={(patch) => updateReview(activeAsset.id, patch)}
        />
      ) : null}

      {showShortlist ? (
        <Shortlist
          assets={preferred}
          reviews={reviews}
          text={shortlistText}
          onClose={() => setShowShortlist(false)}
          onCopy={copyShortlist}
          onDownload={downloadShortlist}
          onRemove={(id) => updateReview(id, null)}
        />
      ) : null}

      {toast ? <div className={styles.toast} role="status">{toast}</div> : null}
    </div>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" data-active={active || undefined} onClick={onClick}>{children}</button>;
}

function AssetCard({ asset, review, onOpen, onVerdict }: {
  asset: CuratorAsset;
  review?: StoredReview;
  onOpen: () => void;
  onVerdict: (verdict: Verdict) => void;
}) {
  return (
    <article className={styles.card} data-verdict={review?.verdict}>
      <button type="button" className={styles.imageButton} onClick={onOpen} aria-label={`Open ${asset.id}, ${asset.title}`}>
        <AssetVisual asset={asset} compact />
        <span className={styles.expand} aria-hidden="true">↗</span>
      </button>
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <strong>{asset.id}</strong>
          <span>{asset.title}</span>
        </div>
        <div className={styles.verdicts}>
          <button type="button" data-selected={review?.verdict === "preferred" || undefined} onClick={() => onVerdict("preferred")} aria-label={`Mark ${asset.id} preferred`}>
            <HeartIcon /> <span>Preferred</span>
          </button>
          <button type="button" data-selected={review?.verdict === "rejected" || undefined} onClick={() => onVerdict("rejected")} aria-label={`Mark ${asset.id} not for us`}>
            <CloseIcon /> <span>Not for us</span>
          </button>
        </div>
      </div>
    </article>
  );
}

function Lightbox({ asset, review, index, total, onClose, onMove, onReview }: {
  asset: CuratorAsset;
  review?: StoredReview;
  index: number;
  total: number;
  onClose: () => void;
  onMove: (offset: number) => void;
  onReview: (patch: StoredReview | null) => void;
}) {
  return (
    <div className={styles.modalBackdrop} role="presentation" onMouseDown={onClose}>
      <section className={styles.lightbox} role="dialog" aria-modal="true" aria-label={`${asset.id}, ${asset.title}`} onMouseDown={(event) => event.stopPropagation()}>
        <header className={styles.modalHeader}>
          <div><strong>{asset.id}</strong><span>{asset.title}</span></div>
          <span>{index + 1} / {total}</span>
          <button type="button" onClick={onClose} aria-label="Close preview">×</button>
        </header>
        <div className={styles.lightboxStage}>
          <button type="button" className={styles.previous} onClick={() => onMove(-1)} aria-label="Previous direction">←</button>
          <AssetVisual asset={asset} />
          <button type="button" className={styles.next} onClick={() => onMove(1)} aria-label="Next direction">→</button>
        </div>
        <footer className={styles.lightboxFooter}>
          <div className={styles.modalVerdicts}>
            <button type="button" data-selected={review?.verdict === "preferred" || undefined} onClick={() => onReview(review?.verdict === "preferred" ? null : { verdict: "preferred" })}>
              <HeartIcon /> Preferred <kbd>P</kbd>
            </button>
            <button type="button" data-selected={review?.verdict === "rejected" || undefined} onClick={() => onReview(review?.verdict === "rejected" ? null : { verdict: "rejected" })}>
              <CloseIcon /> Not for us <kbd>X</kbd>
            </button>
          </div>
          <label className={styles.noteField}>
            <span>Reference note <em>optional</em></span>
            <input
              value={review?.note ?? ""}
              onChange={(event) => onReview({ ...review, note: event.target.value })}
              placeholder="What should future work borrow from this direction?"
            />
          </label>
          <div className={styles.sourceLine}>
            <span>{asset.source}</span>
            {asset.sourceHref || asset.src ? <a href={asset.sourceHref ?? asset.src} target="_blank" rel="noreferrer">Open source ↗</a> : null}
          </div>
        </footer>
      </section>
    </div>
  );
}

function Shortlist({ assets, reviews, text, onClose, onCopy, onDownload, onRemove }: {
  assets: CuratorAsset[];
  reviews: ReviewMap;
  text: string;
  onClose: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className={styles.modalBackdrop} role="presentation" onMouseDown={onClose}>
      <aside className={styles.shortlist} role="dialog" aria-modal="true" aria-label="Preferred reference list" onMouseDown={(event) => event.stopPropagation()}>
        <header className={styles.shortlistHeader}>
          <div><span>Visual canon</span><h2>Preferred reference set</h2><p>{assets.length} directions selected for future Signal Studio work.</p></div>
          <button type="button" onClick={onClose} aria-label="Close preferred list">×</button>
        </header>
        <div className={styles.shortlistActions}>
          <button type="button" onClick={onCopy}>Copy list</button>
          <button type="button" onClick={onDownload}>Download JSON</button>
        </div>
        <div className={styles.shortlistBody}>
          {assets.map((asset) => (
            <article key={asset.id} className={styles.shortlistRow}>
              <AssetVisual asset={asset} compact />
              <div><strong>{asset.id}</strong><span>{asset.title}</span>{reviews[asset.id]?.note ? <p>{reviews[asset.id].note}</p> : null}</div>
              <button type="button" onClick={() => onRemove(asset.id)} aria-label={`Remove ${asset.id} from preferred list`}>×</button>
            </article>
          ))}
        </div>
        <label className={styles.exportPreview}>
          <span>Copy-ready handoff</span>
          <textarea readOnly value={text} />
        </label>
      </aside>
    </div>
  );
}

function AssetVisual({ asset, compact = false }: { asset: CuratorAsset; compact?: boolean }) {
  if (asset.motionPreview) {
    return (
      <div className={styles.motionPreview} data-compact={compact || undefined}>
        <div className={styles.motionTopline}>
          <span>Remotion hook</span>
          <span>{asset.motionPreview.number} / 60</span>
        </div>
        <div className={styles.motionField} aria-hidden="true">
          <i /><i /><i /><i />
          <b />
        </div>
        <div className={styles.motionCopy}>
          <strong>{asset.title}</strong>
          <span>{asset.motionPreview.closing}</span>
        </div>
        <small>Collection {asset.motionPreview.collection} · 4:5</small>
      </div>
    );
  }
  return asset.src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={asset.src} alt={asset.title} loading={compact ? "lazy" : undefined} />
  ) : null;
}

function buildShortlistText(assets: CuratorAsset[], reviews: ReviewMap) {
  if (!assets.length) return "No preferred assets selected yet.";
  return [
    "SIGNAL STUDIO — PREFERRED VISUAL REFERENCE SET",
    "Use these assets as the design and brand reference for future creation. Borrow the visual principles; do not blindly duplicate layouts.",
    "",
    ...assets.map((asset) => {
      const note = reviews[asset.id]?.note?.trim();
      return `- ${asset.id} — ${asset.title} — ${asset.source}${note ? ` — Note: ${note}` : ""}`;
    }),
  ].join("\n");
}

function HeartIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 16.4S3.5 12.7 3.5 7.7A3.1 3.1 0 0 1 9 5.8L10 7l1-1.2a3.1 3.1 0 0 1 5.5 1.9c0 5-6.5 8.7-6.5 8.7Z" /></svg>;
}

function CloseIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 6 8 8M14 6l-8 8" /></svg>;
}
