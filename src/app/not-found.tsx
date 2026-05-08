import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { SiteFooter } from "@/components/landing/site-footer";

/**
 * 404 — on-brand. No drama.
 *
 * The wordmark centers the frame. "this page doesn't exist yet" is
 * honest without being cute about it. The home link is the only action.
 */
export default function NotFound() {
  return (
    <>
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
        <div className="flex flex-col items-center gap-6 text-center">
          <Wordmark size="md" />

          <p
            className="text-ink-quiet"
            style={{ fontSize: "clamp(0.875rem, 0.82rem + 0.25vw, 1rem)" }}
          >
            this page doesn&rsquo;t exist yet.
          </p>

          <Link
            href="/"
            className="text-[13px] text-ink-faint underline decoration-border underline-offset-[3px] transition-colors hover:text-ink hover:decoration-ink-quiet"
          >
            back home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
