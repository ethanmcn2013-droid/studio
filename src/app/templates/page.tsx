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
  title: "Templates — Signal Studio",
  description:
    "Wedding planning workspaces, a monthly rhythm for a small operation, the jobsite punchlist, tax season. The work, pre-written. Apply to any workspace in one click — your existing tasks stay put.",
  openGraph: {
    title: "Templates — Signal Studio",
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
            workspace — your existing tasks stay put.
          </p>
          <p className="mt-3 max-w-[58ch] text-[13px] leading-[1.6] text-ink-faint">
            Two shapes. <strong className="font-medium text-ink-soft">Anchor</strong>{" "}
            workspaces seed a Tasks list, a Notes notebook, a Roadmap, and
            an Analytics briefing in one go.{" "}
            <strong className="font-medium text-ink-soft">Specialty</strong>{" "}
            templates drop into Tasks.
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

        {/* ── Footer link · Students ─────────────────────── */}
        <section className="mx-auto w-full max-w-[760px] px-6 pb-20 pt-12">
          <div
            className="rounded-2xl border px-6 py-5"
            style={{
              borderColor: "var(--hairline)",
              background: "var(--paper-soft)",
            }}
          >
            <p className="text-[14px] leading-[1.55] text-ink-soft">
              Studying?{" "}
              <Link
                href="/for-students"
                className="underline decoration-ink-ghost decoration-1 underline-offset-[3px] hover:decoration-ink"
              >
                Signal is free with a .edu address
              </Link>{" "}
              — and the final-paper push, midterm week, and job-application
              templates live in the{" "}
              <a
                href="https://tasks.signalstudio.ie/templates?domain=student"
                className="underline decoration-ink-ghost decoration-1 underline-offset-[3px] hover:decoration-ink"
              >
                Tasks gallery
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
