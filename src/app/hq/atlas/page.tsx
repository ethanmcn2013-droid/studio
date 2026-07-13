import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { HqPageHeader } from "@/components/hq/hq-page-header";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import {
  LENS_ORDER,
  findMostRecentlyVerified,
  findPinned,
  groupByLens,
  readAtlasEntries,
} from "@/lib/atlas/loader";
import { AtlasFilter } from "@/components/atlas/atlas-filter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "atlas, signal hq",
  description: "How the loop holds, systems written down, for one operator.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default async function AtlasIndexPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access");

  const entries = await readAtlasEntries();
  const groups = groupByLens(entries);
  const pinned = findPinned(entries);
  const freshest = findMostRecentlyVerified(entries);
  const totalEntries = entries.length;
  const staleCount = entries.filter((e) => e.isStale).length;
  const stubCount = entries.filter((e) => e.status === "stub").length;
  const partialCount = entries.filter((e) => e.status === "partial").length;

  return (
    <main id="main" className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-[920px] px-6 pb-28">
        <HqPageHeader
          slug="atlas"
          title="The system, written down."
          standfirst="One entry per system, each with a last-verified date; entries flag themselves stale when the system moves on."
          meta={
            <span className="hq-page-head-note">
              {totalEntries} entries
              {partialCount > 0 ? ` · ${partialCount} partial` : ""}
              {stubCount > 0 ? ` · ${stubCount} stub` : ""}
              {staleCount > 0 ? ` · ${staleCount} stale` : ""}
              {freshest
                ? ` · last verified ${freshest.slug} ${freshest.lastVerified}`
                : ""}
            </span>
          }
        />

        <div className="mt-12" />

        {pinned && (
          <div className="atlas-start-here mb-16">
            <div className="atlas-start-here-label">
              <span className="atlas-start-here-dot" aria-hidden="true" />
              start here
            </div>
            <Link
              href={`/hq/atlas/${pinned.slug}`}
              className="atlas-start-here-link group block"
            >
              <h2 className="mb-2 text-[22px] font-medium leading-snug text-ink transition-colors group-hover:text-accent">
                {pinned.title}
              </h2>
              <p className="max-w-[60ch] text-[15px] leading-[1.6] text-ink-soft">
                {pinned.summary}
              </p>
              <p
                className="mt-3 font-mono text-[11px] uppercase tracking-wider text-ink-quiet"
                style={{ letterSpacing: "0.06em" }}
              >
                {pinned.lens} · verified {pinned.lastVerified}
              </p>
            </Link>
          </div>
        )}

        <AtlasFilter
          groups={LENS_ORDER.map((lens) => ({
            lens,
            entries: groups[lens]
              .filter((e) => !pinned || e.slug !== pinned.slug)
              .map((e) => ({
                slug: e.slug,
                title: e.title,
                summary: e.summary,
                lens: e.lens,
                status: e.status,
                isStale: e.isStale,
                isDrifted: e.isDrifted,
                ageDays: Number.isFinite(e.ageDays) ? e.ageDays : null,
                lastVerified: e.lastVerified,
                tags: e.tags,
              })),
          }))}
        />

        <div className="mt-20 border-t border-border-soft pt-6 font-mono text-[12px] text-ink-quiet">
          <Link href="/hq" className="atlas-link hover:text-accent">
            ← hq
          </Link>
        </div>
      </section>
    </main>
  );
}
