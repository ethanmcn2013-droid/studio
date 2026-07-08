import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { TemplatesBrowser } from "./templates-browser";
import {
  FEATURED_TEMPLATES,
  PILL_LABELS,
  PILL_ORDER,
  featuredCount,
} from "@/lib/templates/featured";
import type { TemplateAudience } from "@/components/marketing/template-pills";

export const metadata: Metadata = {
  title: "Templates · Signal Studio",
  description:
    "Wedding planning workspaces, a monthly rhythm for a small operation, the jobsite punchlist, tax season. The work, pre-written. Apply to any workspace in one click. Your existing tasks stay put.",
  openGraph: {
    title: "Templates · Signal Studio",
    description:
      "The recurring stuff, already shaped. Wedding planning, monthly rhythms, the punchlist, tax season. Apply in one click.",
    type: "website",
  },
};

const VALID_AUDIENCES: TemplateAudience[] = [
  "wedding",
  "trades",
  "freelance",
  "marketing",
];

function parseAudience(raw: string | string[] | undefined): TemplateAudience {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v && (VALID_AUDIENCES as string[]).includes(v)) {
    return v as TemplateAudience;
  }
  return "wedding";
}

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ audience?: string }>;
}) {
  const params = await searchParams;
  const current = parseAudience(params.audience);

  const pills = PILL_ORDER.map((id) => ({
    id,
    label: PILL_LABELS[id],
    count: featuredCount(id),
  }));

  return (
    <>
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
        {/* ── Hero ───────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-[760px] px-6 pb-12 pt-16 md:pt-24">
          <div
            className="mb-6 text-[11px] font-semibold uppercase"
            style={{
              color: "var(--accent)",
              letterSpacing: "var(--tracking-eyebrow, 0.14em)",
            }}
          >
            Templates
          </div>
          <h1 className="h-section mb-6 max-w-[640px] text-balance text-ink">
            The work, pre-written.
          </h1>
          <p
            className="max-w-[58ch] leading-[1.6] text-ink-soft"
            style={{
              fontSize:
                "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)",
            }}
          >
            Wedding planning workspaces. The monthly rhythm of a small
            operation. The jobsite punchlist. Tax season. Apply to any
            workspace, and your existing tasks stay put.
          </p>
          <p className="mt-3 max-w-[58ch] text-[13px] leading-[1.6] text-ink-faint">
            Two shapes.{" "}
            <strong className="font-medium text-ink-soft">Anchor</strong>{" "}
            workspaces set up Notes, Tasks, Timeline, and Signal in one go.{" "}
            <strong className="font-medium text-ink-soft">Specialty</strong>{" "}
            templates drop straight into Tasks.
          </p>
        </section>

        {/* ── Browser (pills + grid) ─────────────────────── */}
        <section
          className="mx-auto w-full max-w-[1080px] px-6"
          aria-label="Browse templates"
        >
          <TemplatesBrowser
            templates={FEATURED_TEMPLATES}
            pills={pills}
            current={current}
          />
        </section>

        {/* ── For students ───────────────────────────────── */}
        <section className="mx-auto w-full max-w-[1080px] px-6 pb-20 pt-8">
          <div
            className="mb-6 text-[11px] font-semibold uppercase"
            style={{ color: "var(--accent)", letterSpacing: "var(--tracking-eyebrow, 0.14em)" }}
          >
            For students
          </div>
          <h2
            className="mb-4 max-w-[620px] text-balance font-semibold text-ink"
            style={{ fontSize: "clamp(1.375rem, 1.1rem + 1vw, 1.875rem)", letterSpacing: "-0.025em", lineHeight: 1.12 }}
          >
            A semester, pre-shaped.
          </h2>
          <p
            className="mb-8 max-w-[58ch] leading-[1.6] text-ink-soft"
            style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
          >
            Three templates for the work a semester actually throws at you.
            Students get the full Pro tier for €9.99 a year, verified
            with any student email.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                title: "Final paper push",
                meta: "8 tasks · thesis to submit",
                body: "Pick a thesis, gather sources, outline, draft, edit, submit. The order that beats the 4am panic.",
                href: "/waitlist?source=templates&campaign=pre_access_waitlist&artifact=template_final_paper_push&useCase=students&touch=site",
              },
              {
                title: "Midterm week",
                meta: "7 tasks · review, sleep",
                body: "Review sheets, practice problems, the study group, eight hours of sleep. The boring stuff that wins.",
                href: "/waitlist?source=templates&campaign=pre_access_waitlist&artifact=template_midterm_week&useCase=students&touch=site",
              },
              {
                title: "Job application push",
                meta: "8 tasks · apply with intent",
                body: "CV, cover letter, portfolio, the follow-up. Show up looking like you meant to.",
                href: "/waitlist?source=templates&campaign=pre_access_waitlist&artifact=template_job_application_push&useCase=students&touch=site",
              },
            ].map((t) => (
              <a
                key={t.title}
                href={t.href}
                className="group block rounded-2xl border p-5 no-underline transition-colors hover:border-ink-soft/40"
                style={{ borderColor: "var(--hairline)", background: "var(--paper-soft)" }}
              >
                <div className="text-[15px] font-semibold text-ink">{t.title}</div>
                <div className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                  {t.meta}
                </div>
                <p className="mt-3 text-[13.5px] leading-[1.55] text-ink-soft">{t.body}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-ink">
                  Join the waitlist
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </div>
              </a>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/pricing"
              className="text-[14px] font-medium transition-colors hover:text-ink"
              style={{ color: "var(--accent)" }}
            >
              See the student rate &rarr;
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
