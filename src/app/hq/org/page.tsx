import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import {
  CLUSTERS,
  DIRECTORS,
  ELT_SNAPSHOT,
  directorsByCluster,
  formatCadence,
  type Director,
} from "@/lib/hq/elt";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "org — signal hq",
  description: "The Executive Leadership Team — 17 Directors, one Founder.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

/**
 * /hq/org — Live ELT org chart.
 *
 * Data lives in `src/lib/hq/elt.ts`, mirrored from
 * `signal-directors/config/directors.yaml`. Tufte register:
 * cluster bands, no boxes-and-lines, every chip is a link.
 */
export default async function HqOrgPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access");

  const total = DIRECTORS.length;
  const layer3 = DIRECTORS.filter((d) => d.autonomyLayer === 3).length;
  const productLeads = DIRECTORS.filter((d) => d.cluster === "product_excellence").length;

  return (
    <main id="main" className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-[1040px] px-6 pb-28 pt-14 md:pt-20">
        <div
          className="mb-6 text-[11px] font-semibold uppercase"
          style={{ color: "var(--accent)", letterSpacing: "var(--tracking-eyebrow)" }}
        >
          hq / org
        </div>

        <h1 className="h-section mb-6 max-w-[720px] text-balance text-ink">
          One Founder. {total} Directors. One company.
        </h1>

        <p
          className="mb-4 max-w-[60ch] leading-[1.7] text-ink-soft"
          style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
        >
          The Executive Leadership Team — the standing answer to who owns
          what. Each Director runs a portfolio at Layer{" "}
          <span className="font-mono">2</span> (recommend) or Layer{" "}
          <span className="font-mono">3</span> (decide, then log).
        </p>

        <p className="mb-12 max-w-[60ch] font-mono text-[12px] leading-[1.6] text-ink-quiet">
          {total} directors · {productLeads} on the product excellence
          council · {layer3} at layer-3 default ·{" "}
          <span title={`source: ${ELT_SNAPSHOT.source} v${ELT_SNAPSHOT.sourceVersion}`}>
            snapshot {ELT_SNAPSHOT.generatedAt}
          </span>
        </p>

        {/* Apex — Founder */}
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

        {/* Director clusters */}
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

        <div className="mt-20 border-t border-border-soft pt-6 font-mono text-[12px] text-ink-quiet">
          <Link href="/hq" className="atlas-link hover:text-accent">
            ← hq
          </Link>
          <span className="mx-3 opacity-50">·</span>
          <span>
            source ·{" "}
            <a
              href="https://github.com/ethanmcn2013-droid/signal-directors"
              className="hover:text-accent"
              target="_blank"
              rel="noreferrer"
            >
              signal-directors
            </a>
          </span>
        </div>
      </section>
    </main>
  );
}

function DirectorCard({ director: d }: { director: Director }) {
  return (
    <li className="org-card-wrap">
      <Link href={`/hq/org/${d.id}`} className="org-card group">
        <div className="org-card-head">
          <span className="org-card-shortname">{d.shortName}</span>
          {d.autonomyLayer === 3 ? (
            <span className="org-card-layer" title="Layer-3 default — decides, then logs">
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
