import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Market entry deck · Signal HQ",
  description:
    "Market Entry, Brand & Growth Strategy 2026–2028, the 70-slide go-to-market plan, companion to the business plan.",
  robots: { index: false, follow: false },
};

/**
 * /hq/market-entry, the full 70-slide Market Entry, Brand & Growth Strategy
 * deck, served from the self-contained static HTML in public/brand. Same
 * iframe pattern as /hq/deck and /hq/loan-pack. Linked from the Marketing
 * hub and catalogued in the Asset library (shareholder group).
 */
export default async function MarketEntryPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access?from=/hq/market-entry");

  return (
    <div className="hq-deck-wrapper">
      <div className="hq-deck-meta">
        <span className="hq-deck-label">
          Signal Studio · Market Entry, Brand &amp; Growth Strategy 2026–2028 · 70 slides
        </span>
        <a
          href="/brand/market-entry-deck-2026.html"
          target="_blank"
          rel="noopener noreferrer"
          className="hq-deck-open"
        >
          open full screen ↗
        </a>
      </div>
      <iframe
        src="/brand/market-entry-deck-2026.html"
        title="Signal Studio, Market Entry, Brand & Growth Strategy 2026–2028"
        className="hq-deck-frame"
        loading="eager"
      />
      <style>{`
        .hq-deck-wrapper {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 72px);
          background: #111;
        }
        .hq-deck-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 24px;
          background: #1a1a1a;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }
        .hq-deck-label {
          font-family: 'Geist Mono', ui-monospace, monospace;
          font-size: 11px;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }
        .hq-deck-open {
          font-family: 'Geist Mono', ui-monospace, monospace;
          font-size: 11px;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: #818cf8;
          text-decoration: none;
        }
        .hq-deck-open:hover { color: #a5b4fc; }
        .hq-deck-frame {
          flex: 1;
          width: 100%;
          border: none;
          background: #1a1a1a;
        }
      `}</style>
    </div>
  );
}
