import Link from "next/link";

/**
 * Signal HQ Layout — the environment wrapper for all /hq/* pages.
 *
 * Provides two persistent signals that make this surface unambiguously
 * internal at a glance:
 *
 *   1. Environment strip — a 28px bar reading "● SIGNAL HQ · INTERNAL"
 *      in the paper-deep (#f4f4f5) register. Never appears on external
 *      surfaces. Sticky so it stays in frame as you scroll.
 *
 *   2. Persistent nav — a 44px bar below the strip with the full HQ
 *      section list and an "exit → signalstudio.ie" escape. Background
 *      --paper-soft (#fafafa) to shift the internal surface temperature
 *      visibly from the external pure-white.
 *
 * The exit link is intentional: any employee seeing "← signalstudio.ie"
 * knows immediately which side of the product they're on.
 *
 * NOTE: The /hq/access page (password gate) intentionally inherits this
 * layout — showing INTERNAL before the user is logged in is correct and
 * safe (the content behind the gate is still protected).
 */
export default function HqLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="hq-env">
      {/* ── Environment strip ────────────────────────────────────────── */}
      <div className="hq-env-strip" aria-hidden="true">
        <div className="hq-env-strip-inner">
          <span className="hq-env-pip" />
          <span className="hq-env-label">Signal HQ · Internal</span>
        </div>
      </div>

      {/* ── Persistent HQ nav ─────────────────────────────────────────── */}
      <nav className="hq-env-nav" aria-label="Signal HQ navigation">
        <div className="hq-env-nav-inner">
          <Link href="/hq" className="hq-env-nav-home" aria-label="Signal HQ home">
            signal hq<span className="hq-env-nav-dot" aria-hidden="true">.</span>
          </Link>
          <div className="hq-env-nav-links" role="list">
            <Link href="/hq/crm" className="hq-env-nav-link" role="listitem">outreach</Link>
            <Link href="/hq/atlas" className="hq-env-nav-link" role="listitem">atlas</Link>
            <Link href="/hq/health" className="hq-env-nav-link" role="listitem">health</Link>
            <Link href="/hq/partners" className="hq-env-nav-link" role="listitem">partners</Link>
            <Link href="/hq/entitlements" className="hq-env-nav-link" role="listitem">entitlements</Link>
            <Link href="/hq/marketing" className="hq-env-nav-link" role="listitem">marketing</Link>
            <Link href="/hq/plan" className="hq-env-nav-link" role="listitem">plan</Link>
            <Link href="/hq/deck" className="hq-env-nav-link" role="listitem">deck</Link>
          </div>
          <Link href="/" className="hq-env-nav-exit">
            ← signalstudio.ie
          </Link>
        </div>
      </nav>

      {/* ── Page body ─────────────────────────────────────────────────── */}
      <div className="hq-env-body">{children}</div>
    </div>
  );
}
