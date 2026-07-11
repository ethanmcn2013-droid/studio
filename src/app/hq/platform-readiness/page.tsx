import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { getRemediationProgram, summarizeRemediation } from "@/lib/hq/remediation-program";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Platform readiness · Signal HQ",
  description: "Evidence-backed progress through the Signal Studio remediation program.",
  robots: { index: false, follow: false },
};

export default async function PlatformReadinessPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  if (!(token && (await verifyHqToken(token)))) redirect("/hq/access");

  const program = getRemediationProgram();
  const summary = summarizeRemediation(program);

  return (
    <main id="main" className="mx-auto w-full max-w-[1100px] px-6 pb-24 pt-16 md:pt-20">
      <div className="mb-3 hq-eyebrow">Signal HQ · Platform readiness</div>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="h-title mb-4 text-ink">Remediation program</h1>
          <p className="max-w-[65ch] text-ink-soft" style={{ fontSize: 17, lineHeight: 1.6 }}>
            One ledger. Observable evidence. No launch claim without proof.
          </p>
        </div>
        <div className="border border-border-soft px-5 py-4 text-right" style={{ background: "var(--surface)" }}>
          <div className="hq-eyebrow">Completion</div>
          <div className="text-ink" style={{ fontSize: 34, fontWeight: 600 }}>{summary.calculatedCompletion}%</div>
          <div className="text-ink-quiet" style={{ fontSize: 12 }}>{summary.completed} of {summary.total} items</div>
        </div>
      </div>

      <section className="mt-10 border border-border-soft" style={{ background: "var(--surface)" }} aria-labelledby="blockers-heading">
        <div className="border-b border-border-soft px-5 py-4">
          <h2 id="blockers-heading" className="text-ink" style={{ fontSize: 15, fontWeight: 600 }}>Open P0 gates</h2>
        </div>
        {summary.openP0.length ? (
          <div className="divide-y divide-border-soft">
            {summary.openP0.map((item) => (
              <div key={item.id} className="flex flex-wrap items-baseline justify-between gap-3 px-5 py-4">
                <div><span className="mr-3 text-ink-faint" style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>{item.id}</span><span className="text-ink" style={{ fontSize: 14 }}>{item.title}</span></div>
                <span className="text-ink-quiet" style={{ fontSize: 12 }}>{item.status}</span>
              </div>
            ))}
          </div>
        ) : <div className="px-5 py-4 text-ink-soft" style={{ fontSize: 14 }}>No open P0 gates.</div>}
      </section>

      <section className="mt-8" aria-labelledby="phase-heading">
        <h2 id="phase-heading" className="mb-4 h2-title text-ink">Progress by phase</h2>
        <div className="grid gap-3 md:grid-cols-4">
          {summary.byPhase.map(([phase, stats]) => (
            <div key={phase} className="border border-border-soft p-4" style={{ background: "var(--surface)" }}>
              <div className="hq-eyebrow">Phase {phase}</div>
              <div className="mt-2 text-ink" style={{ fontSize: 22, fontWeight: 600 }}>{stats.completed}/{stats.total}</div>
              <div className="mt-1 text-ink-quiet" style={{ fontSize: 12 }}>complete</div>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-10 text-ink-faint" style={{ fontFamily: "var(--font-mono)", fontSize: 11, lineHeight: 1.6 }}>
        Source: docs/signal-studio-review/remediation-program.yaml · Updated {program.updatedAt}
      </p>
    </main>
  );
}
