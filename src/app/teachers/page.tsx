import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";

export const metadata: Metadata = {
  title: "Signal Studio for teachers",
  description:
    "One class per Workspace, grouped into a school year. Private Notes and Tasks, deliberately shared Class Timelines, and Signal across all classes.",
};

const waitlistHref =
  "/waitlist?source=teachers&campaign=school_design_partner&audience=teacher&artifact=teacher_page&touch=site&useCase=teachers";

const PRINCIPLES = [
  {
    title: "One class per Workspace",
    copy: "Add six class names in one step and group them inside the school year. Shape one class first; the rest can wait.",
  },
  {
    title: "Private work stays private",
    copy: "Your Notes and Tasks are working material. A school entitlement does not give an administrator access to them.",
  },
  {
    title: "Share only the Class Timeline",
    copy: "Choose the milestone title, date and completion state in a preview. Private descriptions, attachments and Notes never appear.",
  },
  {
    title: "Signal across every class",
    copy: "Switch from one class to the school year. Signal returns no more than three explainable matters that need attention.",
  },
] as const;

export default function TeachersPage() {
  return (
    <>
      <main id="main" tabIndex={-1}>
        <section className="border-b border-border-soft px-6 pb-20 pt-16 md:pt-24">
          <div className="mx-auto w-full max-w-[1040px]">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-ink-quiet">
              School design-partner pilot
            </p>
            <h1 className="max-w-4xl text-[clamp(2.4rem,1.6rem+3.4vw,5.6rem)] font-semibold leading-[1.01] tracking-[-0.045em] text-ink">
              Six classes. One school year. No pupil database.
            </h1>
            <p className="mt-7 max-w-2xl text-[17px] leading-[1.7] text-ink-soft">
              Keep each class clear, then step back and see the year. Notes and
              Tasks remain private. A Class Timeline is shared only when you
              choose it, through a revocable link that needs no pupil account.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href={waitlistHref}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Join the school pilot waitlist
              </Link>
              <span className="text-[13px] leading-[1.5] text-ink-quiet">
                No pupil names, emails, accounts, grades or attendance.
              </span>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <div className="grid gap-3 md:grid-cols-2">
              {PRINCIPLES.map((item) => (
                <article
                  key={item.title}
                  className="rounded-xl border border-border-soft bg-bg-elev p-6"
                >
                  <h2 className="text-[17px] font-semibold text-ink">
                    {item.title}
                  </h2>
                  <p className="mt-3 max-w-[54ch] text-[14px] leading-[1.65] text-ink-soft">
                    {item.copy}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border-soft bg-bg-deep px-6 py-16 md:py-20">
          <div className="mx-auto grid w-full max-w-[1040px] gap-10 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-ink-quiet">
                What a class sees
              </p>
              <h2 className="mt-3 text-[32px] font-semibold leading-[1.08] tracking-[-0.035em] text-ink">
                Direction, without surveillance.
              </h2>
            </div>
            <div className="border-t border-border-soft">
              {[
                ["Covered", "Completed milestones chosen by the teacher."],
                ["Now", "The current published part of the plan."],
                ["Next", "The next milestone and days to a teacher-entered date."],
                ["Later", "Upcoming published milestones, in clear order."],
              ].map(([label, copy]) => (
                <div
                  key={label}
                  className="grid gap-2 border-b border-border-soft py-5 sm:grid-cols-[120px_1fr]"
                >
                  <h3 className="text-[14px] font-semibold text-ink">{label}</h3>
                  <p className="text-[14px] leading-[1.6] text-ink-soft">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
