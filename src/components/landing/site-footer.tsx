import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { TASKS_URL, ROADMAP_URL, ANALYTICS_URL } from "@/lib/product-urls";

// Social channels. Placeholder hrefs — replace with the real handles when
// the accounts go live. Order is editorial register: X first (largest reach),
// Bluesky second (audience overlap with design/editorial register), LinkedIn
// third (professional credibility for the operator audience).
const SOCIALS = [
  {
    label: "X",
    href: "https://x.com/signalstudio_ie",
    title: "Signal Studio on X",
    svg: (
      // X (Twitter) glyph
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
        <path d="M18.244 2H21l-6.59 7.53L22 22h-6.828l-4.78-6.234L4.8 22H2l7.06-8.07L1.5 2h6.91l4.32 5.69L18.244 2Zm-2.39 18.4h1.594L7.21 3.512H5.5L15.853 20.4Z" />
      </svg>
    ),
  },
  {
    label: "Bluesky",
    href: "https://bsky.app/profile/signalstudio.ie",
    title: "Signal Studio on Bluesky",
    svg: (
      // Bluesky butterfly
      <svg viewBox="0 0 64 57" width="14" height="14" fill="currentColor" aria-hidden>
        <path d="M13.873 3.805C21.21 9.332 29.103 20.537 32 26.55v15.882c0-.338-.13.044-.41.867-1.512 4.456-7.418 21.847-20.923 7.944-7.111-7.32-3.819-14.64 9.125-16.85-7.405 1.264-15.73-.825-18.014-9.015C1.12 23.022 0 8.51 0 6.55 0-3.268 8.579-.182 13.873 3.805ZM50.127 3.805C42.79 9.332 34.897 20.537 32 26.55v15.882c0-.338.13.044.41.867 1.512 4.456 7.418 21.847 20.923 7.944 7.111-7.32 3.819-14.64-9.125-16.85 7.405 1.264 15.73-.825 18.014-9.015C62.88 23.022 64 8.51 64 6.55 64-3.268 55.421-.182 50.127 3.805Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/signal-studio-ie",
    title: "Signal Studio on LinkedIn",
    svg: (
      // LinkedIn "in" glyph
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
        <path d="M20.452 20.452h-3.554v-5.569c0-1.328-.024-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.94v5.666H9.356V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.602 0 4.268 2.37 4.268 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.117 20.452H3.555V9h3.562v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
      </svg>
    ),
  },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mx-auto mt-24 w-full max-w-[760px] border-t border-border-soft px-6 pb-10 pt-10"
    >
      <div className="flex flex-wrap items-center justify-between gap-6">
        {/* Left: wordmark + locked suite tagline + socials + copyright */}
        <div className="flex flex-col gap-1.5">
          <Wordmark size="sm" animate={false} />
          <span
            className="text-[11px] text-ink-soft"
            style={{ letterSpacing: "0.02em" }}
          >
            Clarity, not configuration.
          </span>
          <nav
            aria-label="Signal Studio on social"
            className="mt-1 flex items-center gap-3 text-ink-quiet"
          >
            {SOCIALS.map(({ label, href, title, svg }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={title}
                aria-label={title}
                className="transition-colors hover:text-ink"
              >
                {svg}
              </a>
            ))}
          </nav>
          <span
            className="text-[11px] text-ink-faint"
            style={{ letterSpacing: "0.02em" }}
          >
            &copy; {year}
          </span>
        </div>

        {/* Right: link groups */}
        <div className="flex flex-wrap gap-8">
          {/* Products */}
          <nav aria-label="Products" className="flex flex-col gap-2">
            <span
              className="text-[10px] font-semibold uppercase text-ink-faint"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              Products
            </span>
            <a
              href={TASKS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12.5px] text-ink-quiet transition-colors hover:text-ink"
              style={{ letterSpacing: "0.01em" }}
            >
              Signal Tasks
            </a>
            <a
              href={ROADMAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12.5px] text-ink-quiet transition-colors hover:text-ink"
              style={{ letterSpacing: "0.01em" }}
            >
              Signal Roadmap
            </a>
            <a
              href={ANALYTICS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12.5px] text-ink-quiet transition-colors hover:text-ink"
              style={{ letterSpacing: "0.01em" }}
            >
              Signal Analytics
            </a>
            <span
              aria-disabled="true"
              className="text-[12.5px] text-ink-faint"
              style={{ letterSpacing: "0.01em", pointerEvents: "none", cursor: "default" }}
              title="Signal Notes — coming soon"
            >
              Signal Notes
              <span
                className="ml-1.5 font-mono text-[9px] uppercase"
                style={{ letterSpacing: "0.08em", color: "var(--ink-faint)" }}
              >
                Soon
              </span>
            </span>
          </nav>

          {/* Pages */}
          <nav aria-label="Pages" className="flex flex-col gap-2">
            <span
              className="text-[10px] font-semibold uppercase text-ink-faint"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              Pages
            </span>
            <Link
              href="/work"
              className="text-[12.5px] text-ink-quiet transition-colors hover:text-ink"
              style={{ letterSpacing: "0.01em" }}
            >
              Work
            </Link>
            <Link
              href="/about"
              className="text-[12.5px] text-ink-quiet transition-colors hover:text-ink"
              style={{ letterSpacing: "0.01em" }}
            >
              About
            </Link>
            <Link
              href="/pricing"
              className="text-[12.5px] text-ink-quiet transition-colors hover:text-ink"
              style={{ letterSpacing: "0.01em" }}
            >
              Pricing
            </Link>
            <Link
              href="/brand"
              prefetch={false}
              className="text-[12.5px] text-ink-quiet transition-colors hover:text-ink"
              style={{ letterSpacing: "0.01em" }}
            >
              Brand
            </Link>
            <Link
              href="/proof"
              className="text-[12.5px] text-ink-quiet transition-colors hover:text-ink"
              style={{ letterSpacing: "0.01em" }}
            >
              Proof
            </Link>
            <Link
              href="/principles"
              className="text-[12.5px] text-ink-quiet transition-colors hover:text-ink"
              style={{ letterSpacing: "0.01em" }}
            >
              Principles
            </Link>
            <Link
              href="/press"
              className="text-[12.5px] text-ink-quiet transition-colors hover:text-ink"
              style={{ letterSpacing: "0.01em" }}
            >
              Press
            </Link>
            <Link
              href="/contact"
              className="text-[12.5px] text-ink-quiet transition-colors hover:text-ink"
              style={{ letterSpacing: "0.01em" }}
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>

      <div
        className="mt-8 flex flex-wrap gap-x-4 gap-y-2 border-t border-border-soft pt-6 font-mono text-[11px] uppercase text-ink-faint"
        style={{ letterSpacing: "0.08em" }}
      >
        <Link
          href="/privacy"
          className="transition-colors hover:text-ink-quiet"
        >
          Privacy
        </Link>
        <span aria-hidden>·</span>
        <Link
          href="/terms"
          className="transition-colors hover:text-ink-quiet"
        >
          Terms
        </Link>
        <span aria-hidden>·</span>
        <Link
          href="/security"
          className="transition-colors hover:text-ink-quiet"
        >
          Security
        </Link>
        <span aria-hidden>·</span>
        <Link
          href="/accessibility"
          className="transition-colors hover:text-ink-quiet"
        >
          Accessibility
        </Link>
      </div>
    </footer>
  );
}
