import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { DIRECTORS } from "@/lib/hq/elt";
import { OrgChart } from "@/features/org/org-chart";
import { OrgListView } from "./org-list-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "org, signal hq",
  description: "The Executive Leadership Team, 17 Directors, one Founder.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

/**
 * /hq/org — the standing AI leadership org.
 *
 * Default is the interactive chart (`src/features/org`), a calm, focusable map
 * of the 17 Directors. `?view=list` keeps the original Tufte cluster-band list.
 * Both read `src/lib/hq/elt.ts`, mirrored from
 * `signal-directors/config/advisors.yaml`. Charter prose lives in that repo.
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
      <section className="mx-auto w-full max-w-[1180px] px-6 pb-28 pt-14 md:pt-20">
        <div
          className="mb-6 text-[11px] font-semibold uppercase"
          style={{ color: "var(--accent)", letterSpacing: "var(--tracking-eyebrow)" }}
        >
          hq / org
        </div>

        <h1 className="h-section mb-6 max-w-[760px] text-balance text-ink">
          One Founder. {total} Directors. One company.
        </h1>

        <p
          className="mb-8 max-w-[62ch] leading-[1.7] text-ink-soft"
          style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
        >
          The standing AI leadership team, the answer to who owns what. Each
          Director runs a portfolio at Layer <span className="font-mono">2</span>{" "}
          (recommend) or Layer <span className="font-mono">3</span> (decide, then
          log), personified after the figure whose craft it holds.
        </p>

        <div className="orgc-toolbar">
          <div className="orgc-toggle" role="group" aria-label="View">
            <Link href="/hq/org" aria-current={!isList}>
              Chart
            </Link>
            <Link href="/hq/org?view=list" aria-current={isList}>
              List
            </Link>
          </div>
        </div>

        {isList ? <OrgListView /> : <OrgChart />}

        <div className="mt-20 border-t border-border-soft pt-6 font-mono text-[12px] text-ink-quiet">
          <Link href="/hq" className="atlas-link hover:text-accent">
            ← hq
          </Link>
          <span className="mx-3 opacity-50">·</span>
          <Link href="/hq/atlas-map" className="hover:text-accent">
            atlas map
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
