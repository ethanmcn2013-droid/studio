import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { DIRECTORS, ELT_SNAPSHOT } from "@/lib/hq/elt";
import { ORG_COUNTS } from "@/features/org/org-intel";
import { OrgChart } from "@/features/org/org-chart";
import { OrgListView } from "./org-list-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "org command deck, signal hq",
  description:
    "The Signal Studio operating org: one Founder, 17 Directors, five standing councils, and a real coordination layer.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

/**
 * /hq/org - the standing AI leadership org, as a dark command deck.
 *
 * Default is the interactive deck (`src/features/org`) with four modes:
 * Chart, Councils, Evidence, and Investor. `?view=list` keeps the original
 * cluster list as a print / low-JS fallback. Both read `src/lib/hq/elt.ts`
 * (mirrored from signal-directors); the deck's operating depth reads
 * `src/features/org/org-intel.ts` (same source).
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

  return (
    <main id="main" className="flex flex-1 flex-col">
      <section className="orgc-page">
        <div className="orgc-hero">
          <div className="orgc-hero-copy">
            <div className="orgc-eyebrow">hq · org command deck</div>
            <h1 className="orgc-title">
              One founder. {total} Directors. <b>One operating system.</b>
            </h1>
            <p className="orgc-strap">Simple by design. Serious underneath.</p>
            <p className="orgc-lede">
              A living map of how Signal Studio makes decisions, protects quality,
              shares context, and lets one founder run the work of a company.
            </p>
          </div>

          <div className="orgc-brief" aria-label="Investor overview">
            <div className="orgc-brief-top">
              <span>investor read</span>
              <span>live org · {ELT_SNAPSHOT.generatedAt}</span>
            </div>
            <div className="orgc-brief-line">
              {ELT_SNAPSHOT.founderName} keeps final authority. Directors hold
              named scope, cadence, autonomy, and evidence links.
            </div>
            <div className="orgc-brief-grid">
              <MiniFact value={String(ORG_COUNTS.councils)} label="standing councils" />
              <MiniFact value={String(ORG_COUNTS.autonomyLayers)} label="autonomy layers" />
              <MiniFact value={String(ORG_COUNTS.founderGates)} label="founder gates" />
              <MiniFact value={String(ORG_COUNTS.coordinationPaths)} label="coordination paths" />
              <MiniFact value={String(ORG_COUNTS.mcpLive)} label="mcp live" />
              <MiniFact value={String(ORG_COUNTS.channels)} label="slack channels" />
            </div>
          </div>
        </div>

        {isList ? <OrgListView /> : <OrgChart />}

        <div className="orgc-footer">
          <Link href="/hq">back to hq</Link>
          <span className="mx-3 opacity-50">·</span>
          <Link href="/hq/atlas-map">atlas map</Link>
          <span className="mx-3 opacity-50">·</span>
          <Link href={isList ? "/hq/org" : "/hq/org?view=list"}>
            {isList ? "command deck" : "list view"}
          </Link>
          <span className="mx-3 opacity-50">·</span>
          <span>
            source{" "}
            <a
              href="https://github.com/ethanmcn2013-droid/signal-directors"
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
