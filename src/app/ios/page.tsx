import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";

export const metadata: Metadata = {
  title: "iOS app - Signal Studio",
  description:
    "Signal Studio for iPhone is in build: one native home for Notes, Tasks, Timeline, and Signal.",
};

const STATUS_ROWS = [
  {
    label: "Status",
    value: "In build",
  },
  {
    label: "Current focus",
    value: "Native home, auth, privacy review",
  },
  {
    label: "Availability",
    value: "The App Store page follows after the submission gates close.",
  },
] as const;

const RELEASE_NOTES = [
  {
    title: "Today first.",
    body:
      "The app opens to one quiet view of what needs attention, then points to the product that owns the work.",
  },
  {
    title: "Capture stays close.",
    body:
      "Notes is the fast path for thoughts that arrive away from a desk.",
  },
  {
    title: "No commerce in the app.",
    body:
      "Pricing stays on the web. The iOS app is a companion for signed-in customers.",
  },
] as const;

export default function IOSPage() {
  return (
    <>
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-[760px] px-6 pb-16 pt-16 md:pb-20 md:pt-24">
          <div
            className="mb-6 text-[11px] font-semibold uppercase"
            style={{
              color: "var(--accent)",
              letterSpacing: "var(--tracking-eyebrow)",
              fontFamily: "var(--font-mono-stack)",
            }}
          >
            iOS app
          </div>

          <h1 className="h-section mb-8 max-w-[660px] text-balance text-ink">
            Signal Studio for iPhone is in build.
          </h1>

          <p
            className="max-w-[58ch] leading-[1.7] text-ink-soft"
            style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
          >
            The first iOS release is a native companion to the web suite. One
            home for the day. Notes, Tasks, Timeline, and Signal behind it when
            the work needs detail.
          </p>

          <p className="mt-5 max-w-[58ch] text-[15.5px] leading-[1.7] text-ink-soft">
            The App Store link is not live yet. When review is complete, this
            page becomes the place it points.
          </p>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-[14px] text-ink">
            <Link
              href="/dispatch"
              className="underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-accent hover:decoration-accent"
            >
              Follow the dispatch
            </Link>
            <Link
              href="/pricing"
              className="underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-accent hover:decoration-accent"
            >
              Read pricing
            </Link>
          </div>
        </section>

        <section className="border-t border-border-soft py-16">
          <div className="mx-auto grid w-full max-w-[760px] gap-10 px-6 md:grid-cols-[0.85fr_1.15fr]">
            <div>
              <div
                className="mb-4 text-[11px] font-semibold uppercase text-ink-faint"
                style={{
                  letterSpacing: "var(--tracking-eyebrow)",
                  fontFamily: "var(--font-mono-stack)",
                }}
              >
                Build state
              </div>
              <h2 className="text-balance text-[24px] font-semibold leading-[1.2] tracking-[-0.02em] text-ink md:text-[28px]">
                Public enough to name. Not ready to download.
              </h2>
            </div>

            <dl className="border-y border-border-soft">
              {STATUS_ROWS.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-2 border-b border-border-soft py-5 last:border-b-0 sm:grid-cols-[150px_1fr]"
                >
                  <dt
                    className="font-mono text-[11px] font-semibold uppercase text-ink-faint"
                    style={{ letterSpacing: "0.12em" }}
                  >
                    {row.label}
                  </dt>
                  <dd className="text-[14.5px] leading-[1.6] text-ink-soft">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="border-t border-border-soft py-16">
          <div className="mx-auto w-full max-w-[760px] px-6">
            <div
              className="mb-4 text-[11px] font-semibold uppercase text-ink-faint"
              style={{
                letterSpacing: "var(--tracking-eyebrow)",
                fontFamily: "var(--font-mono-stack)",
              }}
            >
              First release
            </div>
            <ul className="divide-y divide-border-soft border-y border-border-soft">
              {RELEASE_NOTES.map((item) => (
                <li key={item.title} className="grid gap-3 py-6 md:grid-cols-[190px_1fr]">
                  <h2 className="text-[18px] font-semibold leading-[1.25] tracking-[-0.015em] text-ink">
                    {item.title}
                  </h2>
                  <p className="text-[15px] leading-[1.7] text-ink-soft">
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
