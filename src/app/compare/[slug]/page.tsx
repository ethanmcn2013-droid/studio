import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/landing/site-footer";
import { COMPARISON_PAGES, getComparisonPage } from "@/lib/comparison-pages";
import { withTracking } from "@/lib/tracking";

type Params = {
  slug: string;
};

export function generateStaticParams(): Params[] {
  return COMPARISON_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getComparisonPage(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      type: "article",
    },
  };
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const page = getComparisonPage(slug);
  if (!page) notFound();

  const primaryHref = withTracking(page.primaryCta.href, {
    source: "comparison_page",
    campaign: "organic_comparison",
    audience: page.eyebrow.toLowerCase().replaceAll(" ", "_"),
    artifact: page.slug,
    touch: "site",
    venue: "unknown",
  });
  const secondaryHref = page.secondaryCta
    ? withTracking(page.secondaryCta.href, {
        source: "comparison_page",
        campaign: "organic_comparison",
        audience: page.eyebrow.toLowerCase().replaceAll(" ", "_"),
        artifact: `${page.slug}_secondary`,
        touch: "site",
        venue: "unknown",
      })
    : null;

  return (
    <>
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
        <section className="border-b border-border-soft px-6 pb-16 pt-14 md:pb-20 md:pt-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <p
              className="mb-5 text-[11px] font-semibold uppercase text-ink-quiet"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              Compare · {page.eyebrow}
            </p>
            <h1 className="max-w-4xl text-[clamp(2rem,1.4rem+3.2vw,5.4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink">
              {page.h1}
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-[1.65] text-ink-soft">
              {page.intro}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <TrackedLink
                href={primaryHref}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
              >
                {page.primaryCta.label}
              </TrackedLink>
              {page.secondaryCta && secondaryHref ? (
                <TrackedLink
                  href={secondaryHref}
                  className="text-[14px] text-ink-soft underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-ink hover:decoration-accent"
                >
                  {page.secondaryCta.label} <span aria-hidden>→</span>
                </TrackedLink>
              ) : null}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <div className="border-t border-border-soft">
              {page.sections.map((section) => (
                <section
                  key={section.title}
                  className="grid gap-3 border-b border-border-soft py-7 md:grid-cols-[0.8fr_1.2fr] md:gap-12"
                >
                  <h2 className="text-[20px] font-semibold leading-[1.2] tracking-[-0.02em] text-ink">
                    {section.title}
                  </h2>
                  <p className="max-w-2xl text-[15px] leading-[1.7] text-ink-soft">
                    {section.copy}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border-soft bg-bg-deep px-6 py-16">
          <div className="mx-auto grid w-full max-w-[1040px] gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p
                className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
                style={{ letterSpacing: "var(--tracking-eyebrow)" }}
              >
                Signal Studio
              </p>
              <h2 className="max-w-2xl text-[32px] font-semibold leading-[1.08] tracking-[-0.035em] text-ink">
                Project management for the 80% not in tech.
              </h2>
            </div>
            <Link
              href="/proof"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
            >
              See the proof
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function TrackedLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
