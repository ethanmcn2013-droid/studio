import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";

export const metadata: Metadata = {
  title: "Contact — studio.",
  description: "Get in touch with studio.",
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
            className="mb-10 text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--accent)" }}
          >
            Contact
          </div>

          <p
            className="max-w-[420px] leading-[1.7] text-ink-soft"
            style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
          >
            Have a question or want to work together?{" "}
            <a
              href="mailto:ethanmcn2013@gmail.com"
              className="text-ink underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-accent hover:decoration-accent"
            >
              Send a note.
            </a>
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
