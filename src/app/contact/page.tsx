import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";

export const metadata: Metadata = {
  title: "Reach — Signal Studio",
  description: "A real human reads everything sent to hello@signalstudio.ie.",
};

/**
 * /contact — one screen, three honest intents.
 *
 * Names what reaches a human, names what doesn't. No form. No CRM.
 * Same restraint as the rest of the umbrella.
 */
export default function ContactPage() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-[760px] px-6 pb-28 pt-16 md:pt-24">
          <div
            className="mb-6 text-[11px] font-semibold uppercase"
            style={{ color: "var(--accent)", letterSpacing: "var(--tracking-eyebrow)" }}
          >
            Reach
          </div>

          <h1 className="h-section mb-8 max-w-[620px] text-balance text-ink">
            A real human, on the other end.
          </h1>

          <p
            className="leading-[1.7] text-ink-soft"
            style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
          >
            Everything sent to this address is read. Usually within 48 hours,
            sometimes faster, occasionally slower if I&apos;m shipping.
          </p>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div>
              <div
                className="mb-3 font-mono text-[10.5px] font-semibold uppercase text-ink-quiet"
                style={{ letterSpacing: "var(--tracking-eyebrow)" }}
              >
                Best for
              </div>
              <ul className="space-y-2 text-[14.5px] leading-[1.6] text-ink-soft">
                <li>Product questions.</li>
                <li>Private-preview access.</li>
                <li>Thoughtful critique.</li>
                <li>Partnership conversations.</li>
              </ul>
            </div>
            <div>
              <div
                className="mb-3 font-mono text-[10.5px] font-semibold uppercase text-ink-quiet"
                style={{ letterSpacing: "var(--tracking-eyebrow)" }}
              >
                Probably not for
              </div>
              <ul className="space-y-2 text-[14.5px] leading-[1.6] text-ink-faint">
                <li>Press and analyst outreach.</li>
                <li>Sales and vendor pitches.</li>
                <li>Recruiting.</li>
                <li>Anything routed through a CRM.</li>
              </ul>
            </div>
          </div>

          <p
            className="mt-12 leading-[1.7] text-ink-soft"
            style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
          >
            <a
              href="mailto:hello@signalstudio.ie"
              className="text-ink underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-accent hover:decoration-accent"
            >
              hello@signalstudio.ie
            </a>
          </p>

          <p className="mt-6 text-[13px] leading-[1.6] text-ink-faint">
            Designed and operated by Ethan McNamara. Dublin &middot; Ireland.
          </p>

          <p
            className="mt-12 font-mono text-[11px] leading-[1.8] text-ink-faint"
          >
            Set in Geist &middot; Geist Mono<br />
            Next.js 16 &middot; Vercel &middot; 2026
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
