import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";
import { CommitteeDisclosure } from "@/components/students/committee-disclosure";
import { tasksSignUpUrl } from "@/lib/product-urls";

export const metadata: Metadata = {
  title: "Student Edition — Signal Studio",
  description:
    "Premium coordination, accessible for students. €9.99 a year, verified college email. Notes, Tasks, Timeline, and Signal — the same calm system venues use, without the enterprise price tag.",
  openGraph: {
    title: "Student Edition — Signal Studio",
    description:
      "Run your committee without the WhatsApp chaos. €9.99 a year, verified college email. The same calm system venues use.",
    type: "website",
  },
};

const signUpHref = tasksSignUpUrl("student");

const FEATURES = [
  {
    name: "Notes",
    copy: "Meeting notes and decisions in one place — not scattered across group chats.",
  },
  {
    name: "Tasks",
    copy: "Who owns what, and when. Plain language — no sprint boards or story points.",
  },
  {
    name: "Timeline",
    copy: "Semester planning and event timelines your whole committee can see.",
  },
  {
    name: "Signal",
    copy: "A short briefing on what is on track and what is slipping — without building a spreadsheet.",
  },
] as const;

const COMMITTEE_PERKS = [
  "Unlimited society members on one workspace.",
  "Committee handover kit — institutional memory survives officer turnover.",
  "Event planning without WhatsApp, Google Forms, and three spreadsheets.",
  "Refer another society and you both get three months free.",
] as const;

export default function StudentsPage() {
  return (
    <>
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-[760px] px-6 pb-28 pt-16 md:pt-24">
          {/* Eyebrow */}
          <div
            className="mb-6 text-[11px] font-semibold uppercase"
            style={{ color: "var(--accent)", letterSpacing: "var(--tracking-eyebrow)" }}
          >
            Student Edition · Launching 1 September 2026
          </div>

          <h1 className="h-section mb-5 max-w-[600px] text-balance text-ink">
            Premium coordination, accessible for students.
          </h1>

          <p
            className="max-w-[56ch] leading-[1.7] text-ink-soft"
            style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
          >
            Run your committee without the WhatsApp chaos. Notes, Tasks,
            Timeline, and Signal — the same calm system venues use, without the
            enterprise price tag.
          </p>

          {/* Price card */}
          <div
            className="mt-10 rounded-2xl border p-7 md:p-8"
            style={{ borderColor: "var(--accent)", background: "var(--accent-soft)" }}
          >
            <div
              className="mb-2 font-mono text-[10.5px] font-semibold uppercase"
              style={{ color: "var(--accent-deep)", letterSpacing: "var(--tracking-eyebrow)" }}
            >
              Student Edition
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
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">
              Verified college email
            </p>
            <p className="mt-4 max-w-[48ch] text-[14px] leading-[1.6] text-ink">
              One annual membership. All four products. No ads. No data selling.
              Premium software made accessible — not free software made cheap.
            </p>
            <a
              href={signUpHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-white no-underline transition-opacity hover:opacity-90"
            >
              Verify with college email{" "}
              <span className="ml-1.5" aria-hidden>
                →
              </span>
            </a>
          </div>

          {/* Features */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div
                key={f.name}
                className="rounded-xl border border-border-soft p-4"
                style={{ background: "var(--paper-soft)" }}
              >
                <div className="mb-1 text-[13px] font-semibold text-ink">
                  {f.name}
                </div>
                <p className="text-[13px] leading-[1.5] text-ink-soft">{f.copy}</p>
              </div>
            ))}
          </div>

          {/* Committee disclosure */}
          <div className="mt-6">
            <CommitteeDisclosure summary="Running a committee or society?">
              <div
                className="rounded-xl border p-6"
                style={{ borderColor: "color-mix(in srgb, var(--accent) 25%, transparent)", background: "var(--paper)" }}
              >
                <div
                  className="mb-2 font-mono text-[10.5px] font-semibold uppercase"
                  style={{ color: "var(--accent-deep)", letterSpacing: "var(--tracking-eyebrow)" }}
                >
                  Committee workspace · within Student Edition
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-[30px] font-semibold leading-none tracking-[-0.04em]"
                    style={{ color: "var(--accent)" }}
                  >
                    €49
                  </span>
                  <span className="text-[12px] font-medium text-ink-soft">
                    per year · whole society
                  </span>
                </div>
                <p className="mt-4 max-w-[52ch] text-[13.5px] leading-[1.6] text-ink-soft">
                  For treasurers and committee leads who need one shared
                  workspace for the entire society — event planning, handovers,
                  member onboarding. Not a separate product. Available when you
                  upgrade from Student Edition.
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
                <a
                  href={signUpHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[13px] font-medium text-white no-underline transition-opacity hover:opacity-90"
                >
                  Start with Student Edition{" "}
                  <span className="ml-1.5" aria-hidden>
                    →
                  </span>
                </a>
              </div>
            </CommitteeDisclosure>
          </div>

          {/* Verification */}
          <div
            className="mt-10 rounded-xl border border-border-soft p-5"
            style={{ background: "var(--paper-soft)" }}
          >
            <div
              className="mb-2 font-mono text-[10px] font-semibold uppercase text-ink-faint"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              Verification
            </div>
            <p className="text-[13px] leading-[1.6] text-ink-soft">
              Sign up with your college email — <code>.ie</code>,{" "}
              <code>.ac.uk</code>, or your institution&rsquo;s domain. Re-verified
              once a year. Student Edition is for currently enrolled students,
              not a general free tier.
            </p>
          </div>

          {/* Campus note */}
          <p className="mt-8 font-mono text-[11px] leading-[1.8] tracking-[0.04em] text-ink-faint">
            Phase 1 campuses · Sep 2026
            <br />
            University of Limerick · TUS · Mary Immaculate College
          </p>

          {/* Disclaimer */}
          <p className="mt-12 max-w-[58ch] border-t border-border-soft pt-8 text-[12.5px] leading-[1.7] text-ink-faint">
            Student Edition is an acquisition programme, not Signal Studio&rsquo;s
            commercial model. Venue prepaid licensing funds the business. This
            page exists because committees deserve calm coordination too.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
