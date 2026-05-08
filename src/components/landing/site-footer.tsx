import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mx-auto w-full max-w-[760px] border-t border-border-soft px-6 py-10"
    >
      <div className="flex flex-wrap items-center justify-between gap-6">
        {/* Left: wordmark + version + copyright */}
        <div className="flex flex-col gap-1">
          <Wordmark size="sm" animate={false} />
          <span
            className="font-mono text-[10px] text-ink-faint"
            style={{ letterSpacing: "0.04em" }}
          >
            v0.1 &middot; May 2026
          </span>
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
              href="https://tasks-nu-hazel.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12.5px] text-ink-quiet transition-colors hover:text-ink"
              style={{ letterSpacing: "0.01em" }}
            >
              Tasks
            </a>
            <a
              href="https://roadmap-ebon-eight.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12.5px] text-ink-quiet transition-colors hover:text-ink"
              style={{ letterSpacing: "0.01em" }}
            >
              Roadmap
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
              href="/contact"
              className="text-[12.5px] text-ink-quiet transition-colors hover:text-ink"
              style={{ letterSpacing: "0.01em" }}
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
