import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { TASKS_URL, ROADMAP_URL, ANALYTICS_URL, NOTES_URL } from "@/lib/product-urls";

// Social channels. Placeholder hrefs — replace with the real handles when
// the accounts go live. Order is text → video → professional: X first
// (broadest editorial reach), YouTube (long-form video), TikTok (short-form,
// strong audience overlap with the wedding GTM wedge), LinkedIn (professional
// credibility for the operator audience).
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
    label: "YouTube",
    href: "https://www.youtube.com/@signalstudio_ie",
    title: "Signal Studio on YouTube",
    svg: (
      // YouTube play-in-rounded-rect glyph
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@signalstudio_ie",
    title: "Signal Studio on TikTok",
    svg: (
      // TikTok musical-note glyph
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z" />
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
      className="mx-auto mt-24 w-full max-w-[760px] border-t border-border-soft px-6 pt-10"
      style={{ paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))" }}
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
            className="-ml-2.5 mt-1 flex items-center text-ink-quiet"
          >
            {SOCIALS.map(({ label, href, title, svg }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={title}
                aria-label={title}
                className="inline-flex h-11 w-11 items-center justify-center transition-colors hover:text-ink"
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
              href={NOTES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12.5px] text-ink-quiet transition-colors hover:text-ink"
              style={{ letterSpacing: "0.01em" }}
            >
              Signal Notes
            </a>
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
              href="/dispatch"
              className="text-[12.5px] text-ink-quiet transition-colors hover:text-ink"
              style={{ letterSpacing: "0.01em" }}
            >
              Dispatch
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
        className="mt-8 flex flex-wrap items-center gap-x-1 gap-y-1 border-t border-border-soft pt-4 font-mono text-[12px] uppercase text-ink-faint"
        style={{ letterSpacing: "0.08em" }}
      >
        <Link
          href="/privacy"
          className="inline-flex min-h-[32px] items-center px-2 py-1 transition-colors hover:text-ink-quiet"
        >
          Privacy
        </Link>
        <span aria-hidden className="opacity-50">·</span>
        <Link
          href="/terms"
          className="inline-flex min-h-[32px] items-center px-2 py-1 transition-colors hover:text-ink-quiet"
        >
          Terms
        </Link>
        <span aria-hidden className="opacity-50">·</span>
        <Link
          href="/security"
          className="inline-flex min-h-[32px] items-center px-2 py-1 transition-colors hover:text-ink-quiet"
        >
          Security
        </Link>
        <span aria-hidden className="opacity-50">·</span>
        <Link
          href="/accessibility"
          className="inline-flex min-h-[32px] items-center px-2 py-1 transition-colors hover:text-ink-quiet"
        >
          Accessibility
        </Link>
      </div>
    </footer>
  );
}
