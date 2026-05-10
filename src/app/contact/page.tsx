import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";

export const metadata: Metadata = {
  title: "Contact — Signal Studio",
  description: "Get in touch. hello@signalstudio.ie",
};

/**
 * /contact — minimal.
 *
 * One line. One link. No form. Same restraint as the rest.
 */
export default function ContactPage() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-[760px] px-6 pb-28 pt-16 md:pt-24">
          {/* Section label */}
          <div
            className="mb-10 text-[11px] font-semibold uppercase"
            style={{ color: "var(--accent)", letterSpacing: "var(--tracking-eyebrow)" }}
          >
            Contact
          </div>

          <p
            className="leading-[1.7] text-ink-soft"
            style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
          >
            For product questions or freelance work. Response within 48 hours.
          </p>

          <p
            className="mt-5 leading-[1.7] text-ink-soft"
            style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
          >
            <a
              href="mailto:ethanmcn2013@gmail.com"
              className="text-ink underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-accent hover:decoration-accent"
            >
              ethanmcn2013@gmail.com
            </a>
          </p>

          {/* Typographic colophon — designer signal */}
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
