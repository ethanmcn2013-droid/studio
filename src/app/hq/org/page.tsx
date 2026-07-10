import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { ELT_SNAPSHOT } from "@/lib/hq/elt";
import { ORG_COUNTS } from "@/features/org/org-intel";
import { OrgChart, type Mode } from "@/features/org/org-chart";
import { OrgListView } from "./org-list-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Org · Signal Studio",
  description:
    "The Signal Studio operating org: one founder, seventeen directors, five standing councils, and a real coordination layer.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

const MODES: Mode[] = ["chart", "councils", "tools", "routines", "evidence", "investor"];

/** The snapshot's age, phrased as honest relative time. Never "live". */
function syncedLabel(iso: string): string {
  const then = Date.parse(`${iso}T00:00:00Z`);
  const days = Math.max(0, Math.floor((Date.now() - then) / 86400000));
  if (days === 0) return "synced today";
  if (days === 1) return "synced yesterday";
  if (days < 60) return `synced ${days} days ago`;
  const months = Math.round(days / 30);
  return `synced ${months} months ago`;
}

/**
 * /hq/org - the standing AI leadership org.
 *
 * Simple on top, serious underneath: the first screen is the founder and the
 * chart; the depth (councils, tools, routines, evidence, the investor read)
 * lives behind the mode switch. `?mode=` and `?d=` restore any shared state;
 * `?view=list` keeps the original cluster list as a print / low-JS fallback.
 * Data mirrors `src/lib/hq/elt.ts`; operating depth reads
 * `src/features/org/org-intel.ts` (both mirror signal-directors).
 */
export default async function HqOrgPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; mode?: string; d?: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access");

  const { view, mode, d } = await searchParams;
  const isList = view === "list";
  const initialMode = MODES.includes(mode as Mode) ? (mode as Mode) : "chart";
  const synced = syncedLabel(ELT_SNAPSHOT.generatedAt);

  return (
    <main id="main" className="flex flex-1 flex-col">
      <section className="orgc-page">
        <div className="orgc-hero">
          <div className="orgc-eyebrow">hq · org</div>
          <h1 className="orgc-title">
            One founder. Seventeen directors. <b>One operating system.</b>
          </h1>
          <p className="orgc-lede">
            A working map of how Signal Studio decides, protects quality, and
            lets one person run the work of a company.
          </p>
          <p className="orgc-readout">
            {ORG_COUNTS.divisions} divisions · {ORG_COUNTS.councils} councils ·{" "}
            {ORG_COUNTS.coordinationPaths} coordination paths ·{" "}
            <span title={`snapshot ${ELT_SNAPSHOT.generatedAt} · ${ELT_SNAPSHOT.source}`}>
              {synced}
            </span>
          </p>
        </div>

        {isList ? (
          <OrgListView />
        ) : (
          <OrgChart
            initialMode={initialMode}
            initialDirectorId={d ?? null}
            syncedLabel={synced}
          />
        )}

        <div className="orgc-footer">
          <Link href="/hq">back to hq</Link>
          <span className="orgc-footer-sep">·</span>
          <Link href="/hq/atlas-map">atlas map</Link>
          <span className="orgc-footer-sep">·</span>
          <Link href={isList ? "/hq/org" : "/hq/org?view=list"}>
            {isList ? "command deck" : "list view"}
          </Link>
          <span className="orgc-footer-sep">·</span>
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
