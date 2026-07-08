import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";

/**
 * 404, on-brand, calm. Waitlist first while access is staged.
 * Voice: direct without drama. No "error", no "oops".
 */
export default function NotFound() {
  return (
    <>
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col items-center justify-center px-6 py-24">
        <div className="w-full max-w-[520px] text-center">
          {/* Eyebrow */}
          <div
            className="text-[10.5px] font-semibold uppercase"
            style={{ color: "var(--ink-quiet)", letterSpacing: "var(--tracking-eyebrow)" }}
          >
            404
          </div>

          {/* H1 */}
          <h1
            className="mt-3 text-balance font-semibold leading-[1.06] tracking-[-0.03em] text-ink"
            style={{ fontSize: "clamp(1.75rem, 1.3rem + 2vw, 2.75rem)" }}
          >
            That page doesn&rsquo;t exist.
          </h1>

          {/* Sub */}
          <p
            className="mx-auto mt-4 max-w-[40ch] leading-[1.6] text-ink-quiet"
            style={{ fontSize: "clamp(0.9rem, 0.85rem + 0.25vw, 1rem)" }}
          >
            You might be looking for the waitlist.
          </p>

          {/* Waitlist CTA */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/waitlist?source=not_found&campaign=pre_access_waitlist&artifact=404_primary&touch=site"
              className="inline-flex items-center rounded-full px-4 py-2 text-[13px] font-medium text-white transition-transform hover:-translate-y-px"
              style={{
                background: "var(--ink)",
                boxShadow: "0 8px 20px -8px rgba(20,21,26,0.4)",
              }}
            >
              Join the waitlist &rarr;
            </Link>
            <Link
              href="/"
              className="inline-flex items-center rounded-full border px-4 py-2 text-[13px] font-medium transition-colors"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg-elev)",
                color: "var(--ink-soft)",
              }}
            >
              Back home
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
