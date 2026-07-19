import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { HqPageHeader } from "@/components/hq/hq-page-header";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { HqMarketing } from "@/components/hq/hq-marketing";
import { MARKETING_BUCKETS, MARKETING_TOTAL } from "@/lib/hq/marketing";
import { getPartnerStats } from "@/lib/partners/stats";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Marketing · Signal HQ",
  description: "The six-month plan, as a working hub.",
  robots: { index: false, follow: false },
};

export default async function MarketingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access");

  const engineCount = MARKETING_BUCKETS.flatMap((b) => b.approaches).filter(
    (a) => a.impact === "Engine",
  ).length;

  // Live Venue Edition funnel for the engine view, read, never fabricated.
  let engine: {
    sponsors: number;
    issued: number;
    redeemed: number;
    reachedBoard: number;
    redeemed30d: number;
    error: string | null;
  } | null = null;
  try {
    const stats = await getPartnerStats();
    engine = {
      sponsors: stats.length,
      issued: stats.reduce((n, s) => n + s.codesIssued, 0),
      redeemed: stats.reduce((n, s) => n + s.codesRedeemed, 0),
      reachedBoard: stats.reduce((n, s) => n + s.reachedBoard, 0),
      redeemed30d: stats.reduce((n, s) => n + s.redeemed30d, 0),
      error: null,
    };
  } catch (err) {
    engine = {
      sponsors: 0,
      issued: 0,
      redeemed: 0,
      reachedBoard: 0,
      redeemed30d: 0,
      error: err instanceof Error ? err.message : "partner stats unavailable",
    };
  }

  return (
    <main id="main" className="mx-auto w-full max-w-[1100px] px-6 pb-24">
      <HqPageHeader
        slug="marketing"
        standfirst="One hundred panel-cleared approaches, bucketed by strategic role and ranked by leverage on the venue engine."
      />
      <p
        className="mb-12 mt-8 max-w-[68ch] text-ink-soft"
        style={{ fontSize: 15, lineHeight: 1.6 }}
      >
        Standing dissent worth keeping in view: the portfolio is deliberately
        venue-weighted, which means it inherits the plan&rsquo;s own #1
        kill-trigger, single-buyer concentration. The{" "}
        <span style={{ color: "var(--ink)" }}>search &amp; comparison</span>{" "}
        bucket is the only structural hedge against it; treat it as
        load-bearing, not optional.
      </p>

      <Link
        href="/hq/market-entry"
        className="mkt-deck"
        aria-label="Open the Market Entry, Brand and Growth Strategy deck"
      >
        <div className="mkt-deck-body">
          <span className="mkt-deck-eyebrow">the deck · 70 slides</span>
          <span className="mkt-deck-title">
            Market Entry, Brand &amp; Growth Strategy 2026–2028
          </span>
          <span className="mkt-deck-note">
            The full go-to-market plan, companion to the business plan. Where
            every euro of marketing spend goes, and exactly how the market is
            entered.
          </span>
        </div>
        <span className="mkt-deck-action">open the deck →</span>
      </Link>

      <div className="mkt-summary">
        <Stat n={String(MARKETING_TOTAL)} label="panel-cleared approaches" />
        <Stat n={String(MARKETING_BUCKETS.length)} label="strategic buckets" />
        <Stat n={String(engineCount)} label="rated engine-impact" />
        <Stat n="3 / 3" label="director greenlight, every row" />
      </div>

      <HqMarketing buckets={MARKETING_BUCKETS} engine={engine} />

      <div
        className="mt-16 border-t border-border-soft pt-6"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--ink-quiet)",
        }}
      >
        <Link
          href="/hq"
          style={{ color: "var(--ink-soft)" }}
          className="hover:opacity-70"
        >
          ← back to Signal HQ
        </Link>
        <span className="mkt-source">
          source · docs/MARKETING_PLAN_6MO.md
        </span>
      </div>
    </main>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="mkt-stat">
      <span className="mkt-stat-n">{n}</span>
      <span className="mkt-stat-label">{label}</span>
    </div>
  );
}
