import { Wordmark } from "@/components/brand/wordmark";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mx-auto w-full max-w-[760px] border-t border-border-soft px-6 py-10"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: wordmark stacked above copyright — separate terminal marks */}
        <div className="flex flex-col gap-1">
          <Wordmark size="sm" animate={false} />
          <span
            className="text-[11px] text-ink-faint"
            style={{ letterSpacing: "0.02em" }}
          >
            &copy; {year}
          </span>
        </div>

        {/* Right: product links */}
        <nav aria-label="Products" className="flex items-center gap-5">
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
      </div>
    </footer>
  );
}
