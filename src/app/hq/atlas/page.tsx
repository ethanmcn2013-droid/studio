import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
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
  title: "atlas — signal hq",
  description: "How the loop holds — systems written down, for one operator.",
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
      <section className="mx-auto w-full max-w-[920px] px-6 pb-28 pt-14 md:pt-20">
        {freshest && (
          <div
            className="mb-10 font-mono text-[11px] uppercase tracking-wider text-ink-quiet"
            style={{ letterSpacing: "0.06em" }}
          >
            last verified · {freshest.slug} · {freshest.lastVerified}
          </div>
        )}

        <div
          className="mb-6 text-[11px] font-semibold uppercase"
          style={{ color: "var(--accent)", letterSpacing: "var(--tracking-eyebrow)" }}
        >
          hq / atlas
        </div>

        <h1 className="h-section mb-6 max-w-[640px] text-balance text-ink">
          The system, written down.
        </h1>

        <p
          className="mb-4 max-w-[58ch] leading-[1.7] text-ink-soft"
          style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
        >
          One entry per system. Each carries a last-verified date. If a
          system changes and the entry stays still, the entry flags itself
          stale. Fix the entry, then the code.
        </p>

        <p className="mb-16 max-w-[58ch] font-mono text-[12px] leading-[1.6] text-ink-quiet">
          {totalEntries} entries
          {partialCount > 0 ? ` · ${partialCount} partial` : ""}
          {stubCount > 0 ? ` · ${stubCount} stub` : ""}
          {staleCount > 0 ? ` · ${staleCount} stale` : ""}
        </p>

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
