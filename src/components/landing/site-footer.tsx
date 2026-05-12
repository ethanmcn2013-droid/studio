import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { TASKS_URL, ROADMAP_URL, ANALYTICS_URL } from "@/lib/product-urls";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mx-auto mt-24 w-full max-w-[760px] border-t border-border-soft px-6 pb-10 pt-10"
    >
      <div className="flex flex-wrap items-center justify-between gap-6">
        {/* Left: wordmark + version + copyright */}
        <div className="flex flex-col gap-1">
          <Wordmark size="sm" animate={false} />
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
