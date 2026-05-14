import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { readAtlasEntries, readAtlasEntry } from "@/lib/atlas/loader";
import { renderAtlasMarkdown } from "@/lib/atlas/render";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await readAtlasEntry(slug);
  return {
    title: entry ? `${entry.title} — atlas` : "atlas — signal hq",
    description: entry?.summary ?? "atlas entry.",
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
  };
}

function stateNote(status: "stub" | "partial" | "complete", isStale: boolean): string | null {
  if (isStale) return "stale";
  if (status === "stub") return "stub";
  if (status === "partial") return "partial";
  return null;
}

export default async function AtlasEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access");

  const { slug } = await params;
  const entry = await readAtlasEntry(slug);
  if (!entry) notFound();

  const all = await readAtlasEntries();
  const neighbors = entry.links
    .map((s) => all.find((e) => e.slug === s))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));
  const html = renderAtlasMarkdown(entry.body);
  const note = stateNote(entry.status, entry.isStale);

  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-[760px] px-6 pb-28 pt-14 md:pt-20">
        <div className="mb-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider">
          <Link
            href="/hq/atlas"
            className="hover:text-accent"
            style={{ color: "var(--accent)", letterSpacing: "0.06em" }}
          >
            ← atlas
          </Link>
          <span className="text-ink-quiet">/</span>
          <span className="text-ink-quiet" style={{ letterSpacing: "0.06em" }}>
            {entry.lens.toLowerCase()}
          </span>
        </div>

        <h1 className="h-section mb-5 max-w-[640px] text-balance text-ink">
          {entry.title}
          {note && (
            <span
              className="ml-3 align-middle font-mono text-[13px] font-normal lowercase text-ink-quiet"
              style={{ letterSpacing: "0.04em" }}
            >
              — {note}
            </span>
          )}
        </h1>

        <p
          className="mb-3 max-w-[58ch] leading-[1.7] text-ink-soft"
          style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
        >
          {entry.summary}
        </p>

        <p
          className="mb-8 max-w-[58ch] font-mono text-[11.5px] uppercase tracking-wider text-ink-quiet"
          style={{ letterSpacing: "0.06em" }}
        >
          verified {entry.lastVerified || "—"} · {entry.owner}
          {Number.isFinite(entry.ageDays) && entry.ageDays > 0
            ? ` · ${entry.ageDays}d ago`
            : ""}
        </p>

        {neighbors.length > 0 && (
          <div className="mb-12 border-t border-b border-border-soft py-5">
            <div
              className="mb-2 font-mono text-[10.5px] uppercase tracking-wider text-ink-quiet"
              style={{ letterSpacing: "0.06em" }}
            >
              related
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
              {neighbors.map((n) => (
                <li key={n.slug}>
                  <Link
                    href={`/hq/atlas/${n.slug}`}
                    className="text-[13.5px] text-ink-soft underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-accent hover:decoration-accent"
                  >
                    {n.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <article
          className="atlas-prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {(entry.tags.length > 0 || entry.references.length > 0) && (
          <div className="mt-20 grid grid-cols-1 gap-10 border-t border-border-soft pt-10 sm:grid-cols-2">
            {entry.tags.length > 0 && (
              <div>
                <div
                  className="mb-3 font-mono text-[10.5px] uppercase tracking-wider text-ink-quiet"
                  style={{ letterSpacing: "0.06em" }}
                >
                  tags
                </div>
                <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
                  {entry.tags.map((t) => (
                    <li
                      key={t}
                      className="font-mono text-[12px] text-ink-soft"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {entry.references.length > 0 && (
              <div>
                <div
                  className="mb-3 font-mono text-[10.5px] uppercase tracking-wider text-ink-quiet"
                  style={{ letterSpacing: "0.06em" }}
                >
                  references
                </div>
                <ul className="space-y-1.5">
                  {entry.references.map((r) => (
                    <li
                      key={r}
                      className="font-mono text-[12px] leading-snug text-ink-soft"
                    >
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
