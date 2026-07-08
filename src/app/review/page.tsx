import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";

export const metadata: Metadata = {
  title: "Review · Signal Studio",
  description:
    "One door into all four Signal Studio products for design review, demos, and visual inspection. Demo data only, no private user data.",
  robots: { index: false, follow: false },
};

/**
 * /review, the suite review hub.
 *
 * A single, calm index that opens every product directly. Built for design
 * review cycles, collaborators, motion partners, and Claude Code / Fable
 * visual inspection. The product app links land on each product's /app
 * surface; in demo/review mode those render from in-memory seed data with no
 * sign-in wall. See docs/DEMO_REVIEW_MODE.md.
 */

type Product = {
  name: string;
  mark: string;
  line: string;
  appUrl: string;
  siteUrl: string;
  accent: string;
};

function waitlistHref(product: string): string {
  return `/waitlist?source=review&campaign=pre_access_waitlist&product=${product}&artifact=review_${product}&touch=site`;
}

const PRODUCTS: Product[] = [
  {
    name: "Notes",
    mark: "notes.",
    line: "Capture clarity. Three-second notebook, one-way extract to Tasks.",
    appUrl: waitlistHref("notes"),
    siteUrl: waitlistHref("notes"),
    accent: "var(--accent)",
  },
  {
    name: "Tasks",
    mark: "tasks·",
    line: "Execution clarity. The board for the 80% who don't work in tech.",
    appUrl: waitlistHref("tasks"),
    siteUrl: waitlistHref("tasks"),
    accent: "var(--accent)",
  },
  {
    name: "Timeline",
    mark: "timeline·",
    line: "Direction clarity. A plan in plain English, shareable by link.",
    appUrl: waitlistHref("timeline"),
    siteUrl: waitlistHref("timeline"),
    accent: "var(--accent)",
  },
  {
    name: "Signal",
    mark: "signal·",
    line: "Attention clarity. A daily briefing on what actually moved.",
    appUrl: waitlistHref("signal"),
    siteUrl: waitlistHref("signal"),
    accent: "var(--accent)",
  },
];

const STUDIO_PAGES: { label: string; href: string }[] = [
  { label: "Homepage", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Venues", href: "/venues" },
  { label: "Weddings", href: "/weddings" },
  { label: "Press", href: "/press" },
  { label: "Design", href: "/design" },
  { label: "About", href: "/about" },
  { label: "Proof", href: "/proof" },
];

export default function ReviewPage() {
  return (
    <>
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-[860px] px-6 pb-28 pt-16 md:pt-24">
          {/* Eyebrow */}
          <div
            className="mb-6 text-[11px] font-semibold uppercase"
            style={{ color: "var(--accent)", letterSpacing: "var(--tracking-eyebrow)" }}
          >
            Review
          </div>

          {/* H1 */}
          <h1 className="h-section mb-6 max-w-[640px] text-balance text-ink">
            One door into all four products.
          </h1>

          <p
            className="mb-4 max-w-[620px] text-lg leading-relaxed"
            style={{ color: "var(--ink-soft)" }}
          >
            Signal Studio is four rooms in one studio, capture, execute, plan,
            measure. Public access is staged through the waitlist while the
            product surfaces are prepared.
          </p>

          {/* Safety note */}
          <div
            className="mb-12 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px]"
            style={{
              background: "color-mix(in srgb, var(--accent) 8%, transparent)",
              color: "var(--ink-soft)",
              border: "1px solid color-mix(in srgb, var(--accent) 18%, transparent)",
            }}
          >
            <span aria-hidden>●</span>
            Demo data only, no private user data. Production auth is unchanged.
          </div>

          {/* Product grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {PRODUCTS.map((p) => (
              <div
                key={p.name}
                className="flex flex-col rounded-2xl border p-6"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--bg-elev, #fff)",
                }}
              >
                <div
                  className="mb-1.5 text-lg font-semibold tracking-tight"
                  style={{ color: p.accent }}
                >
                  {p.mark}
                </div>
                <p
                  className="mb-6 flex-1 text-[15px] leading-relaxed"
                  style={{ color: "var(--ink-soft)" }}
                >
                  {p.line}
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href={p.appUrl}
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white transition-transform hover:-translate-y-px"
                    style={{ background: p.accent }}
                  >
                    Join waitlist
                    <span aria-hidden>→</span>
                  </a>
                  <a
                    href={p.siteUrl}
                    className="text-sm font-medium underline-offset-4 hover:underline"
                    style={{ color: "var(--ink-quiet)" }}
                  >
                    Waitlist
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Studio pages */}
          <h2
            className="mb-4 mt-14 text-sm font-semibold"
            style={{ color: "var(--ink-soft)" }}
          >
            Studio pages
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {STUDIO_PAGES.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="rounded-full border px-3.5 py-1.5 text-sm transition-colors"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--ink-soft)",
                }}
              >
                {s.label}
              </Link>
            ))}
          </div>

          <p
            className="mt-14 max-w-[620px] text-sm leading-relaxed"
            style={{ color: "var(--ink-quiet)" }}
          >
            Internal review access should use the private review links in the
            operator docs. Public visitors should join the waitlist.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
