import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";
import { CommitteeDisclosure } from "@/components/students/committee-disclosure";
import { formatEuroCents, requireVerifiedAmount } from "@/lib/commercial-terms";

const STUDENT_PRICE = formatEuroCents(requireVerifiedAmount("student"));

export const metadata: Metadata = {
  title: "Student Edition · Signal Studio",
  description: `Keep each module clear and see the whole semester at once. Private Notes, Tasks and deadlines, a semester Timeline, and Signal across the complete workload. ${STUDENT_PRICE} a year; payment and verification are confirmed before access opens.`,
  openGraph: {
    title: "Student Edition · Signal Studio",
    description:
      "One module per Workspace, grouped into a semester. Private academic Notes, Tasks and deadlines, a semester Timeline, and Signal across the complete workload.",
    type: "website",
  },
};

const waitlistHref =
  "/waitlist?source=students&campaign=pre_access_waitlist&audience=student&artifact=student_page&touch=site&useCase=students";

const FEATURES = [
  {
    name: "One module, one Workspace",
    copy: "Psychology, Law, Marketing and Statistics stay distinct, while the semester keeps them in one calm structure.",
  },
  {
    name: "Private academic Notes",
    copy: "Capture lectures, reading and questions privately. Only an extract you choose can become a Task or Timeline milestone.",
  },
  {
    name: "Tasks and deadlines",
    copy: "See the next piece of work inside each module without flattening the whole semester into one crowded board.",
  },
  {
    name: "Signal across the semester",
    copy: "Switch from one module to the complete workload. Signal returns at most three explainable matters that need attention.",
  },
] as const;

const COMMITTEE_NOTES = [
  "A society or event remains separate from academic Module Workspaces.",
  "Officer handover and long-term ownership need an explicit policy.",
  "Editing-member limits and viewer access will be stated separately.",
  "No committee price or referral incentive is currently promised.",
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
            Student Edition · Staged access
          </div>

          <h1 className="h-section mb-5 max-w-[600px] text-balance text-ink">
            Every module clear. The whole semester in view.
          </h1>

          <p
            className="max-w-[56ch] leading-[1.7] text-ink-soft"
            style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
          >
            Create a semester, add your modules in one go, and work inside the
            one that needs attention now. Notes stay private. Tasks and fixed
            dates stay connected. Signal can look across the complete workload.
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
                {STUDENT_PRICE}
              </span>
              <span className="text-[13px] font-medium text-ink-soft">
                per year
              </span>
            </div>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">
              Verification terms confirmed before paid access
            </p>
            <p className="mt-4 max-w-[48ch] text-[14px] leading-[1.6] text-ink">
              One annual membership. All four products. One Workspace per
              module, with modules grouped into a semester. No ads. No data
              selling.
            </p>
            <a
              href={waitlistHref}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-white no-underline transition-opacity hover:opacity-90"
            >
              Join the student waitlist{" "}
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

          {/* Committee disclosure, deliberately secondary to academic work. */}
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
                    Not yet priced
                  </span>
                  <span className="text-[12px] font-medium text-ink-soft">
                    separate society offer
                  </span>
                </div>
                <p className="mt-4 max-w-[52ch] text-[13.5px] leading-[1.6] text-ink-soft">
                  A society Workspace is not part of the current four-tier
                  offer. Ownership, renewal, member scope and price need a
                  separate decision before it can open.
                </p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {COMMITTEE_NOTES.map((perk) => (
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
                  href={waitlistHref}
                  className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[13px] font-medium text-white no-underline transition-opacity hover:opacity-90"
                >
                  Join the general waitlist{" "}
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
              Joining the waitlist does not activate or charge an account.
              Before paid access opens, Signal Studio will state the student
              verification standard, payment step and renewal terms plainly.
            </p>
          </div>

          {/* Campus note */}
          <p className="mt-8 font-mono text-[11px] leading-[1.8] tracking-[0.04em] text-ink-faint">
            Design-partner access · dates and participating institutions are
            confirmed before invitations are sent
          </p>

          {/* Product boundary */}
          <p className="mt-12 max-w-[58ch] border-t border-border-soft pt-8 text-[12.5px] leading-[1.7] text-ink-faint">
            Modules are the principal Student Edition path. Societies, balls,
            trips and campaigns can use a separate general or event Workspace;
            they do not replace the academic semester.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
