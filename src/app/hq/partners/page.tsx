import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { getPartnerStats, type PartnerStat } from "@/lib/partners/stats";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Partners — Signal HQ",
  description: "Per-sponsor Venue Editions activation state.",
  robots: { index: false, follow: false },
};

export default async function PartnersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access");

  let stats: PartnerStat[] = [];
  let loadError: string | null = null;
  try {
    stats = await getPartnerStats();
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Unknown error";
  }

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
        Signal HQ · Partners
      </div>
      <h1 className="h-title mb-4 text-ink">Venue Editions</h1>
      <p
        className="mb-12 max-w-[60ch] text-ink-soft"
        style={{ fontSize: 17, lineHeight: 1.6 }}
      >
        Each sponsor and where their codes stand. Issued is from studio&rsquo;s
        license_codes audit. Redeemed and redeemed-30d are read live from Tasks.
        Redeemed-30d counts new redemptions in the last 30 days, NOT product
        engagement — a couple who claimed two weeks ago is in the count whether
        they&rsquo;ve opened the workspace once or live in it daily.
      </p>

      {loadError ? (
        <ErrorPanel message={loadError} />
      ) : stats.length === 0 ? (
        <EmptyState />
      ) : (
        <PartnerTable stats={stats} />
      )}

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
      </div>
    </main>
  );
}

function PartnerTable({ stats }: { stats: PartnerStat[] }) {
  const totals = stats.reduce(
    (acc, s) => ({
      issued: acc.issued + s.codesIssued,
      redeemed: acc.redeemed + s.codesRedeemed,
      redeemed30d: acc.redeemed30d + s.redeemed30d,
    }),
    { issued: 0, redeemed: 0, redeemed30d: 0 },
  );

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        background: "var(--bg-elev)",
      }}
    >
      <Row header>
        <Cell header style={{ flex: "1 1 0" }}>
          Sponsor
        </Cell>
        <Cell header align="right">
          Issued
        </Cell>
        <Cell header align="right">
          Redeemed
        </Cell>
        <Cell header align="right">
          Redeemed 30d
        </Cell>
        <Cell header align="right" style={{ flexBasis: 180 }}>
          Most recent
        </Cell>
      </Row>
      {stats.map((s) => (
        <Row key={s.sponsor.id}>
          <Cell style={{ flex: "1 1 0" }}>
            <div className="text-ink" style={{ fontWeight: 500 }}>
              {s.sponsor.name}
            </div>
            <div
              className="mt-1"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--ink-quiet)",
                letterSpacing: "0.02em",
              }}
            >
              {s.sponsor.slug} · {s.sponsor.contactEmail}
            </div>
          </Cell>
          <Cell align="right" mono>
            {s.codesIssued}
          </Cell>
          <Cell align="right" mono>
            {s.codesRedeemed}
            <span className="ml-1 text-ink-quiet">
              ({pct(s.codesRedeemed, s.codesIssued)})
            </span>
          </Cell>
          <Cell align="right" mono>
            {s.redeemed30d}
          </Cell>
          <Cell align="right" mono style={{ flexBasis: 180 }}>
            {s.mostRecentRedemptionAt
              ? formatRelative(s.mostRecentRedemptionAt)
              : "—"}
          </Cell>
        </Row>
      ))}
      <Row footer>
        <Cell footer style={{ flex: "1 1 0" }}>
          {stats.length} {stats.length === 1 ? "sponsor" : "sponsors"}
        </Cell>
        <Cell footer align="right" mono>
          {totals.issued}
        </Cell>
        <Cell footer align="right" mono>
          {totals.redeemed}
        </Cell>
        <Cell footer align="right" mono>
          {totals.redeemed30d}
        </Cell>
        <Cell footer align="right" mono style={{ flexBasis: 180 }} />
      </Row>
    </div>
  );
}

function Row({
  children,
  header,
  footer,
}: {
  children: React.ReactNode;
  header?: boolean;
  footer?: boolean;
}) {
  return (
    <div
      className="flex items-baseline"
      style={{
        padding: "14px 20px",
        borderBottom: footer ? "none" : "1px solid var(--border-soft)",
        background: header
          ? "var(--bg-deep)"
          : footer
            ? "var(--bg-deep)"
            : "transparent",
        gap: 16,
      }}
    >
      {children}
    </div>
  );
}

function Cell({
  children,
  align = "left",
  header,
  footer,
  mono,
  style,
}: {
  children?: React.ReactNode;
  align?: "left" | "right";
  header?: boolean;
  footer?: boolean;
  mono?: boolean;
  style?: React.CSSProperties;
}) {
  const baseStyle: React.CSSProperties = {
    textAlign: align,
    fontSize: header ? 11 : 14,
    fontFamily: mono || header ? "var(--font-mono)" : undefined,
    letterSpacing: header ? "var(--tracking-eyebrow)" : undefined,
    textTransform: header ? "uppercase" : undefined,
    fontWeight: header || footer ? 600 : undefined,
    color: header
      ? "var(--ink-quiet)"
      : footer
        ? "var(--ink-soft)"
        : "var(--ink)",
    flexBasis: 120,
    flexShrink: 0,
    ...style,
  };
  return <div style={baseStyle}>{children}</div>;
}

function EmptyState() {
  return (
    <div
      className="text-ink-soft"
      style={{
        padding: "32px 24px",
        border: "1px solid var(--border)",
        background: "var(--bg-elev)",
        fontSize: 15,
        lineHeight: 1.55,
      }}
    >
      No sponsors yet. Run{" "}
      <code
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          background: "var(--bg-deep)",
          padding: "1px 6px",
          borderRadius: 3,
        }}
      >
        pnpm create:sponsor
      </code>{" "}
      to add the first one.
    </div>
  );
}

function ErrorPanel({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: "20px 24px",
        border: "1px solid var(--border)",
        borderLeft: "2px solid #f43f5e",
        background: "var(--bg-elev)",
      }}
    >
      <div
        className="text-ink"
        style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}
      >
        Couldn&rsquo;t load partner stats.
      </div>
      <pre
        className="text-ink-soft"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          whiteSpace: "pre-wrap",
          lineHeight: 1.5,
          marginBottom: 0,
        }}
      >
        {message}
      </pre>
    </div>
  );
}

function pct(num: number, denom: number): string {
  if (denom === 0) return "—";
  return `${Math.round((num / denom) * 100)}%`;
}

function formatRelative(epochMs: number): string {
  const diffMs = Date.now() - epochMs;
  const day = 86_400_000;
  if (diffMs < day) {
    const hours = Math.max(1, Math.round(diffMs / 3_600_000));
    return `${hours}h ago`;
  }
  const days = Math.round(diffMs / day);
  if (days < 14) return `${days}d ago`;
  const weeks = Math.round(days / 7);
  return `${weeks}w ago`;
}
