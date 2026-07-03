import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Loading review room · Signal HQ",
  description:
    "Ten loading moments, one system. The canonical loading-system review board: tokens, motion timing, aria contracts, and the live gate checklist.",
  robots: { index: false, follow: false },
};

/**
 * /hq/loading-review, the loading-system review room.
 *
 * Embeds the panel-gated review artifact (ten loading moments, one
 * system) the suite's loading canon implements against. The artifact is
 * a self-contained HTML board: per-specimen replay, reduced-motion
 * preview, motion spec strips, and a live gate checklist (font resolved,
 * 10px boundary dot, aria contract, shimmer scoped to Timeline).
 *
 * Canonical sources this room documents:
 *   - DESIGN.md §13 (loading boundary, 10px dot authority)
 *   - signal-studio-loading-screen-pitches.md (the ten gated pitches)
 *   - SuiteLoader.tsx (boot → chrome → content, byte-identical × 5)
 *   - content/hq/decisions/loading-canon-2026-07.md
 */
export default async function LoadingReviewPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access");

  return (
    <div className="hq-deck-wrapper">
      <div className="hq-deck-meta">
        <span className="hq-deck-label">
          Signal Studio · Loading review room · ten moments, one system · 2026
        </span>
        <a
          href="/brand/loading-review-2026.html"
          target="_blank"
          rel="noopener noreferrer"
          className="hq-deck-open"
        >
          open full screen ↗
        </a>
      </div>
      <iframe
        src="/brand/loading-review-2026.html"
        title="Signal Studio, Loading review room"
        className="hq-deck-frame"
        loading="eager"
      />
      <style>{`
        .hq-deck-wrapper {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 72px);
          background: #ffffff;
        }
        .hq-deck-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 10px 24px;
          background: #fafafa;
          border-bottom: 1px solid rgba(17,17,17,0.08);
          flex-shrink: 0;
        }
        .hq-deck-label {
          font-family: 'Geist Mono', ui-monospace, monospace;
          font-size: 11px;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: #71717a;
        }
        .hq-deck-open {
          font-family: 'Geist Mono', ui-monospace, monospace;
          font-size: 11px;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: #4f46e5;
          text-decoration: none;
          white-space: nowrap;
        }
        .hq-deck-open:hover { color: #4338ca; }
        .hq-deck-frame {
          flex: 1;
          width: 100%;
          border: none;
          background: #ffffff;
        }
      `}</style>
    </div>
  );
}
