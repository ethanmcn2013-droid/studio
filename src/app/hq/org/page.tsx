import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { CLUSTERS, DIRECTORS, ELT_SNAPSHOT } from "@/lib/hq/elt";
import { OrgChart } from "@/features/org/org-chart";
import { OrgOperating } from "@/features/org/org-operating";
import { COORDINATION_EDGE_COUNT } from "@/features/org/org-coordination";
import { OrgListView } from "./org-list-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "org chart, signal hq",
  description:
    "The Signal Studio operating org: one Founder, 17 Directors, and a real coordination layer.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

/**
 * /hq/org - the standing AI leadership org.
 *
 * Default is the interactive chart (`src/features/org`), now shaped as an
 * investor-ready operating map. `?view=list` keeps the original cluster list.
 * Both read `src/lib/hq/elt.ts`, mirrored from signal-directors.
 */
export default async function HqOrgPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access");

  const { view } = await searchParams;
  const isList = view === "list";
  const total = DIRECTORS.length;
  const councilCount = CLUSTERS.filter((c) => c.id !== "apex").length;
  const layer3Count = DIRECTORS.filter((d) => d.autonomyLayer === 3).length;
  const cadenceCount = new Set(DIRECTORS.map((d) => d.cadence)).size;
  const productLeadCount = DIRECTORS.filter((d) => d.product).length;

  return (
    <main id="main" className="flex flex-1 flex-col">
      <section className="orgc-page">
        <div className="orgc-hero">
          <div className="orgc-hero-copy">
            <div className="orgc-eyebrow">hq / org</div>
            <h1 className="orgc-title">
              One founder. {total} Directors. One operating system.
            </h1>
            <p className="orgc-strap">Simple by design. Serious underneath.</p>
            <p className="orgc-lede">
              A living map of how Signal Studio makes decisions, protects
              quality, shares context, and keeps one founder operating with
              company-grade leverage.
            </p>
          </div>

          <div className="orgc-brief" aria-label="Investor overview">
            <div className="orgc-brief-top">
              <span>investor read</span>
              <span>live org</span>
            </div>
            <div className="orgc-brief-line">
              {ELT_SNAPSHOT.founderName} keeps final authority. Directors hold
              named scope, cadence, autonomy, and evidence links.
            </div>
            <div className="orgc-brief-grid">
              <MiniFact value={String(councilCount)} label="councils" />
              <MiniFact value={String(layer3Count)} label="layer 3" />
              <MiniFact value={String(productLeadCount)} label="product leads" />
              <MiniFact
                value={String(COORDINATION_EDGE_COUNT)}
                label="coordination paths"
              />
              <MiniFact value={String(cadenceCount)} label="cadence types" />
            </div>
          </div>
        </div>

        <div className="orgc-toolbar">
          <div className="orgc-toggle" role="group" aria-label="View">
            <Link href="/hq/org" aria-current={!isList}>
              Chart
            </Link>
            <Link href="/hq/org?view=list" aria-current={isList}>
              List
            </Link>
          </div>
          <div className="orgc-toolbar-links">
            <Link href="/hq/atlas-map">Atlas map</Link>
            <Link href="/hq/blueprint">Blueprint</Link>
          </div>
        </div>

        {isList ? (
          <OrgListView />
        ) : (
          <>
            <OrgChart />
            <OrgOperating />
          </>
        )}

        <div className="orgc-footer">
          <Link href="/hq" className="atlas-link hover:text-accent">
            back to hq
          </Link>
          <span className="mx-3 opacity-50">/</span>
          <Link href="/hq/atlas-map" className="hover:text-accent">
            atlas map
          </Link>
          <span className="mx-3 opacity-50">/</span>
          <span>
            source{" "}
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

function MiniFact({ value, label }: { value: string; label: string }) {
  return (
    <div className="orgc-mini-fact">
      <div className="orgc-mini-value">{value}</div>
      <div className="orgc-mini-label">{label}</div>
    </div>
  );
}
