import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import {
  CLUSTERS,
  DIRECTORS,
  formatCadence,
  getDirector,
} from "@/lib/hq/elt";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = getDirector(slug);
  return {
    title: d ? `${d.shortName} · ${d.name} — org` : "org — signal hq",
    description: d?.oneLine ?? "Advisor profile.",
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
  };
}

/**
 * /hq/org/[slug] — Advisor drill-down.
 * Profile + portfolio + neighbours in the same cluster + link to full charter.
 */
export default async function AdvisorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access");

  const { slug } = await params;
  const d = getDirector(slug);
  if (!d) notFound();

  const cluster = CLUSTERS.find((c) => c.id === d.cluster);
  const neighbours = DIRECTORS.filter(
    (other) => other.cluster === d.cluster && other.id !== d.id,
  );

  return (
    <main id="main" className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-[920px] px-6 pb-28 pt-14 md:pt-20">
        <div className="mb-10 font-mono text-[11px] uppercase tracking-wider text-ink-quiet">
          <Link href="/hq/org" className="hover:text-accent">
            ← org
          </Link>
          <span className="mx-2 opacity-50">/</span>
          <span>{cluster?.label.toLowerCase()}</span>
        </div>

        <div
          className="mb-3 text-[11px] font-semibold uppercase"
          style={{ color: "var(--accent)", letterSpacing: "var(--tracking-eyebrow)" }}
        >
          {d.shortName}
          {d.autonomyLayer === 3 ? <span className="ml-3 opacity-70">· layer 3</span> : null}
          {d.product ? <span className="ml-3 opacity-70">· {d.product}</span> : null}
        </div>

        <h1 className="h-section mb-4 max-w-[720px] text-balance text-ink">
          {d.name}
        </h1>

        <p
          className="mb-3 max-w-[58ch] leading-[1.7] text-ink-soft"
          style={{ fontSize: "clamp(1rem, 0.95rem + 0.3vw, 1.125rem)" }}
        >
          {d.oneLine}
        </p>

        <p className="mb-12 font-mono text-[12px] leading-[1.6] text-ink-quiet">
          persona · {d.persona} · cadence {formatCadence(d.cadence)} · autonomy layer{" "}
          {d.autonomyLayer}
        </p>

        <section className="mb-14" aria-labelledby="org-owns-title">
          <h2
            id="org-owns-title"
            className="mb-4 text-[11px] font-semibold uppercase"
            style={{ color: "var(--ink-quiet)", letterSpacing: "var(--tracking-eyebrow)" }}
          >
            Portfolio
          </h2>
          <ul className="org-portfolio" role="list">
            {d.owns.map((item) => (
              <li key={item} className="org-portfolio-row">
                <span className="org-portfolio-dot" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {d.veto?.length ? (
          <section className="mb-14" aria-labelledby="org-veto-title">
            <h2
              id="org-veto-title"
              className="mb-4 text-[11px] font-semibold uppercase"
              style={{ color: "var(--ink-quiet)", letterSpacing: "var(--tracking-eyebrow)" }}
            >
              Veto authority
            </h2>
            <p className="max-w-[58ch] leading-[1.7] text-ink-soft">
              {d.veto.join(" · ")}
            </p>
          </section>
        ) : null}

        <section className="mb-14" aria-labelledby="org-channels-title">
          <h2
            id="org-channels-title"
            className="mb-4 text-[11px] font-semibold uppercase"
            style={{ color: "var(--ink-quiet)", letterSpacing: "var(--tracking-eyebrow)" }}
          >
            Channels
          </h2>
          <p className="font-mono text-[13px] leading-[1.7] text-ink-soft">
            {d.slackChannel}
            <span className="mx-3 opacity-50">·</span>
            <a
              href={d.charterHref}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-2 hover:text-accent hover:underline"
            >
              full charter →
            </a>
          </p>
        </section>

        {neighbours.length > 0 ? (
          <section className="border-t border-border-soft pt-8" aria-labelledby="org-neighbours-title">
            <h2
              id="org-neighbours-title"
              className="mb-4 text-[11px] font-semibold uppercase"
              style={{ color: "var(--ink-quiet)", letterSpacing: "var(--tracking-eyebrow)" }}
            >
              Also on {cluster?.label}
            </h2>
            <ul className="org-neighbours" role="list">
              {neighbours.map((n) => (
                <li key={n.id}>
                  <Link href={`/hq/org/${n.id}`} className="org-neighbour-row group">
                    <span className="org-neighbour-name">{n.shortName}</span>
                    <span className="org-neighbour-line">{n.oneLine}</span>
                    <span className="org-neighbour-arrow">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </section>
    </main>
  );
}
