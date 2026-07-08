import Link from "next/link";
import {
  CLUSTERS,
  DIRECTORS,
  ELT_SNAPSHOT,
  directorsByCluster,
  formatCadence,
  type Director,
} from "@/lib/hq/elt";

/**
 * The original /hq/org cluster-band list (Tufte register: no boxes-and-lines,
 * every chip a link). Preserved verbatim as the `?view=list` alternative to the
 * interactive chart.
 */
export function OrgListView() {
  const total = DIRECTORS.length;
  const layer3 = DIRECTORS.filter((d) => d.autonomyLayer === 3).length;
  const productLeads = DIRECTORS.filter((d) => d.cluster === "product_excellence").length;

  return (
    <>
      <p className="mb-12 max-w-[60ch] font-mono text-[12px] leading-[1.6] text-ink-quiet">
        {total} directors · {productLeads} on the product excellence council ·{" "}
        {layer3} at layer-3 default ·{" "}
        <span title={`source: ${ELT_SNAPSHOT.source} v${ELT_SNAPSHOT.sourceVersion}`}>
          snapshot {ELT_SNAPSHOT.generatedAt}
        </span>
      </p>

      <section className="org-apex" aria-label="founder">
        <div className="org-apex-card">
          <span className="org-apex-eyebrow">apex</span>
          <h2 className="org-apex-name">{ELT_SNAPSHOT.founderName}</h2>
          <p className="org-apex-role">{ELT_SNAPSHOT.founderRole}</p>
          <p className="org-apex-note">
            Tier-3 founder approval gates: adding/removing a Director,
            adding/removing a product, pricing, external publication.
          </p>
        </div>
        <div className="org-apex-seam" aria-hidden />
      </section>

      {CLUSTERS.filter((c) => c.id !== "apex").map((cluster) => {
        const members = directorsByCluster(cluster.id);
        return (
          <section
            key={cluster.id}
            className="org-cluster"
            aria-labelledby={`org-cluster-${cluster.id}`}
          >
            <div className="org-cluster-head">
              <h3 id={`org-cluster-${cluster.id}`} className="org-cluster-title">
                {cluster.label}
              </h3>
              <p className="org-cluster-subtitle">{cluster.subtitle}</p>
              <p className="org-cluster-count">
                {members.length} director{members.length === 1 ? "" : "s"}
              </p>
            </div>
            <ul className="org-cluster-grid" role="list">
              {members.map((d) => (
                <DirectorCard key={d.id} director={d} />
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}

function DirectorCard({ director: d }: { director: Director }) {
  return (
    <li className="org-card-wrap">
      <Link href={`/hq/org/${d.id}`} className="org-card group">
        <div className="org-card-head">
          <span className="org-card-shortname">{d.shortName}</span>
          {d.autonomyLayer === 3 ? (
            <span className="org-card-layer" title="Layer-3 default, decides, then logs">
              L3
            </span>
          ) : null}
          {d.product ? (
            <span className="org-card-product" data-product={d.product}>
              {d.product}
            </span>
          ) : null}
        </div>
        <p className="org-card-oneline">{d.oneLine}</p>
        <p className="org-card-meta">
          {d.persona} · {formatCadence(d.cadence)}
        </p>
        {d.veto?.length ? (
          <p className="org-card-veto">veto · {d.veto.join(", ")}</p>
        ) : null}
        <span className="org-card-open">open →</span>
      </Link>
    </li>
  );
}
