import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";
import { CommitteeDisclosure } from "@/components/students/committee-disclosure";
import { TASKS_URL, tasksSignUpUrl } from "@/lib/product-urls";

export const metadata: Metadata = {
  title: "Signal Studio for Students",
  description:
    "A calm student workspace for notes, tasks, timelines, and one clear signal on what needs attention. Student rate: €9.99 a year with any student email.",
  openGraph: {
    title: "Signal Studio for Students",
    description:
      "Your semester, without the noise. Notes, Tasks, Timeline, and Signal for €9.99 a year with any student email.",
    type: "website",
  },
};

const signUpHref = tasksSignUpUrl("student");
const tasksStudentsHref = `${TASKS_URL.replace(/\/$/, "")}/for/students`;

const START_POINTS = [
  {
    name: "Assignment due Friday",
    copy: "Drop the brief into Notes. Turn the next steps into Tasks. See the week without rewriting the plan.",
  },
  {
    name: "Exam week",
    copy: "Keep readings, practice questions, study blocks, and sleep in the same view.",
  },
  {
    name: "Group project",
    copy: "Give each person an owner, a date, and one shared place to check what changed.",
  },
  {
    name: "Society handover",
    copy: "Keep decisions, event plans, and committee follow-ups intact when officers change.",
  },
] as const;

const PRODUCT_LOOP = [
  {
    name: "Notes",
    label: "Capture",
    copy: "Lecture notes, group chat decisions, rough ideas.",
  },
  {
    name: "Tasks",
    label: "Clarify",
    copy: "What needs doing, who owns it, and when it is due.",
  },
  {
    name: "Timeline",
    label: "Place",
    copy: "The semester laid out without a project-management manual.",
  },
  {
    name: "Signal",
    label: "Notice",
    copy: "One calm read on what is slipping and what is fine.",
  },
] as const;

const COMMITTEE_PERKS = [
  "One workspace for committee tasks, events, sponsors, and handover notes.",
  "Unlimited society members can read the plan without turning it into a chat thread.",
  "Event planning lives beside the decisions that shaped it.",
  "Referral credits are handled quietly when another society joins.",
] as const;

export default function StudentsPage() {
  return (
    <>
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
        <section className="mx-auto grid w-full max-w-[1180px] gap-12 px-6 pb-28 pt-16 md:grid-cols-[minmax(0,0.95fr)_minmax(420px,1fr)] md:gap-16 md:pt-24">
          <div className="md:sticky md:top-28 md:self-start">
            <div
              className="mb-6 text-[11px] font-semibold uppercase"
              style={{
                color: "var(--accent)",
                letterSpacing: "var(--tracking-eyebrow)",
              }}
            >
              Signal Studio for Students
            </div>

            <h1 className="h-title mb-5 max-w-[650px] text-balance text-ink">
              Your semester, without the noise.
            </h1>

            <p
              className="max-w-[58ch] leading-[1.7] text-ink-soft"
              style={{
                fontSize: "clamp(1rem, 0.94rem + 0.3vw, 1.125rem)",
              }}
            >
              Capture lecture notes, turn the useful parts into tasks, see the
              semester on a timeline, and get one calm signal on what needs
              attention.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={signUpHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-white no-underline transition-transform hover:-translate-y-px"
              >
                Reserve student rate
              </a>
              <a
                href={tasksStudentsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-border-soft bg-paper px-5 text-[14px] font-medium text-ink no-underline transition-colors hover:border-border"
              >
                See the student workspace
              </a>
            </div>

            <div
              className="mt-8 rounded-xl border border-border-soft p-4"
              style={{ background: "var(--paper-soft)" }}
            >
              <p className="text-[13px] leading-[1.6] text-ink-soft">
                Student access opens 1 September 2026. You can verify with any
                working student email now and keep the €9.99 yearly rate ready.
                No transcript, no ID upload, no general free tier.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <StudentWorkflowPreview />

            <div className="grid gap-3 sm:grid-cols-2">
              {START_POINTS.map((item) => (
                <article
                  key={item.name}
                  className="rounded-xl border border-border-soft p-4"
                  style={{ background: "var(--paper)" }}
                >
                  <h2 className="text-[14px] font-semibold tracking-[-0.01em] text-ink">
                    {item.name}
                  </h2>
                  <p className="mt-2 text-[13px] leading-[1.55] text-ink-soft">
                    {item.copy}
                  </p>
                </article>
              ))}
            </div>

            <div
              className="rounded-2xl border p-6 md:p-7"
              style={{
                borderColor: "var(--accent)",
                background: "var(--accent-soft)",
              }}
            >
              <div
                className="mb-2 font-mono text-[10.5px] font-semibold uppercase"
                style={{
                  color: "var(--accent-deep)",
                  letterSpacing: "var(--tracking-eyebrow)",
                }}
              >
                Student rate
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-[44px] font-semibold leading-none tracking-[-0.04em]"
                  style={{ color: "var(--accent)" }}
                >
                  €9.99
                </span>
                <span className="text-[13px] font-medium text-ink-soft">
                  per year
                </span>
              </div>
              <p className="mt-3 max-w-[54ch] text-[14px] leading-[1.6] text-ink">
                One annual membership. Notes, Tasks, Timeline, and Signal. No
                ads. No data selling. Built for current students who need less
                scattered work.
              </p>
              <a
                href={signUpHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-white no-underline transition-transform hover:-translate-y-px"
              >
                Verify student email
              </a>
            </div>

            <CommitteeDisclosure summary="Running a committee or society?">
              <div
                className="rounded-xl border p-6"
                style={{
                  borderColor:
                    "color-mix(in srgb, var(--accent) 25%, transparent)",
                  background: "var(--paper)",
                }}
              >
                <div
                  className="mb-2 font-mono text-[10.5px] font-semibold uppercase"
                  style={{
                    color: "var(--accent-deep)",
                    letterSpacing: "var(--tracking-eyebrow)",
                  }}
                >
                  Society workspace
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-[30px] font-semibold leading-none tracking-[-0.04em]"
                    style={{ color: "var(--accent)" }}
                  >
                    €49
                  </span>
                  <span className="text-[12px] font-medium text-ink-soft">
                    per year for the whole society
                  </span>
                </div>
                <p className="mt-4 max-w-[52ch] text-[13.5px] leading-[1.6] text-ink-soft">
                  For treasurers and committee leads who need one shared
                  workspace for events, handovers, members, and follow-ups.
                  Start with the student rate, then upgrade when the society
                  needs a shared home.
                </p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {COMMITTEE_PERKS.map((perk) => (
                    <li
                      key={perk}
                      className="relative pl-5 text-[12.5px] leading-[1.5] text-ink-soft"
                    >
                      <span
                        aria-hidden
                        className="absolute left-0 top-[7px] h-[5px] w-[5px] rounded-full"
                        style={{ background: "var(--accent)" }}
                      />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            </CommitteeDisclosure>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function StudentWorkflowPreview() {
  return (
    <div
      className="rounded-2xl border border-border-soft p-4 shadow-[0_24px_80px_-56px_rgba(24,24,27,0.28)] md:p-5"
      style={{ background: "var(--paper)" }}
      aria-label="Student workflow preview"
    >
      <div className="flex items-center justify-between gap-4 border-b border-border-soft pb-3">
        <div>
          <div className="text-[13px] font-semibold text-ink">
            Research methods project
          </div>
          <div className="mt-1 text-[12px] text-ink-faint">
            Due Friday. Three people. One plan.
          </div>
        </div>
        <div
          className="rounded-full px-3 py-1 font-mono text-[10px] font-semibold uppercase"
          style={{ background: "var(--accent-soft)", color: "var(--accent-deep)" }}
        >
          On track
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {PRODUCT_LOOP.map((item) => (
          <div
            key={item.name}
            className="grid gap-3 rounded-xl border border-border-soft p-3 sm:grid-cols-[92px_1fr]"
            style={{ background: "var(--paper-soft)" }}
          >
            <div>
              <div className="text-[13px] font-semibold text-ink">{item.name}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint">
                {item.label}
              </div>
            </div>
            <p className="text-[13px] leading-[1.5] text-ink-soft">
              {item.copy}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-border-soft p-4">
        <div className="text-[13px] font-semibold text-ink">
          Today&apos;s signal
        </div>
        <p className="mt-2 text-[13px] leading-[1.55] text-ink-soft">
          One source still needs a quote. Aisling owns the slides. Mark has the
          appendix. Nothing else needs attention today.
        </p>
      </div>
    </div>
  );
}
