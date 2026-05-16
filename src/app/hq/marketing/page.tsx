import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { HqMarketing } from "@/components/hq/hq-marketing";
import { MARKETING_BUCKETS, MARKETING_TOTAL } from "@/lib/hq/marketing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Marketing — Signal HQ",
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

  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 pb-24 pt-16 md:pt-20">
      <div
        className="mb-3"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--ink-quiet)",
          letterSpacing: "var(--tracking-eyebrow)",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        Signal HQ · Marketing
      </div>
      <h1 className="h-title mb-4 text-ink">Marketing</h1>
      <p
        className="mb-6 max-w-[68ch] text-ink-soft"
        style={{ fontSize: 17, lineHeight: 1.6 }}
      >
        The six-month plan, as a working hub — not a deck. One hundred
        approaches, each one cleared by the three-director panel with no
        reservation: Brand (logo-swap test, zero non-goals), Marketing
        (measurably moves the venue engine against the M1–M6 sequence), and
        Feasibility (solo founder, the agent factory, ~3.5 deliberate hours a
        week, €0, six months). Bucketed by strategic role and ranked within
        each by leverage on the negative-CAC engine.
      </p>
      <p
        className="mb-12 max-w-[68ch] text-ink-soft"
        style={{ fontSize: 15, lineHeight: 1.6 }}
      >
        Standing dissent worth keeping in view: the portfolio is deliberately
        venue-weighted, which means it inherits the plan&rsquo;s own #1
        kill-trigger — single-buyer concentration. The{" "}
        <span style={{ color: "var(--ink)" }}>search &amp; comparison</span>{" "}
        bucket is the only structural hedge against it; treat it as
        load-bearing, not optional.
      </p>

      <div className="mkt-summary">
        <Stat n={String(MARKETING_TOTAL)} label="panel-cleared approaches" />
        <Stat n={String(MARKETING_BUCKETS.length)} label="strategic buckets" />
        <Stat n={String(engineCount)} label="rated engine-impact" />
        <Stat n="3 / 3" label="director greenlight, every row" />
      </div>

      <HqMarketing buckets={MARKETING_BUCKETS} />

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
