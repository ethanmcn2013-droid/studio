import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { getPerson } from "@/lib/hq/access";
import { RevokeRow, RevokeAll } from "../PersonActions";
import { ViewAsButton, RepointForm } from "../PersonVerbs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Person · Access · Signal HQ",
  robots: { index: false, follow: false },
};

function fmt(ms: number | null | undefined): string {
  if (!ms) return "—";
  return new Date(ms).toISOString().slice(0, 16).replace("T", " ");
}

export default async function PersonPage({
  params,
  searchParams,
}: {
  params: Promise<{ lookup: string }>;
  searchParams: Promise<{ viewAs?: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access?from=/hq/entitlements");

  const { lookup } = await params;
  const sp = await searchParams;
  const readOnly = sp.viewAs === "1";
  const clerkId = decodeURIComponent(lookup);
  const person = await getPerson(clerkId);

  return (
    <main id="main" className="mx-auto w-full max-w-[920px] px-5 py-12 text-ink">
      <Link
        href="/hq/entitlements?tab=roster"
        className="text-[12px] text-ink-quiet transition hover:text-ink"
      >
        ← Roster
      </Link>

      {!person.ok ? (
        <div className="mt-6 rounded-md border border-border-soft bg-bg-elev px-4 py-6">
          <div className="text-[13px] font-medium">Can&rsquo;t reach the entitlements DB.</div>
          <p className="mt-1 text-[12px] text-ink-quiet">{person.error}</p>
        </div>
      ) : !person.data.found ? (
        <div className="mt-6">
          <h1 className="font-mono text-[15px]">{clerkId}</h1>
          <p className="mt-2 text-[13px] text-ink-soft">
            No rows for this id. On free across the suite, or never signed up.
          </p>
        </div>
      ) : (
        <PersonBody clerkId={clerkId} data={person.data} readOnly={readOnly} />
      )}
    </main>
  );
}

function PersonBody({
  clerkId,
  data,
  readOnly,
}: {
  clerkId: string;
  data: NonNullable<Awaited<ReturnType<typeof getPerson>> & { ok: true }>["data"];
  readOnly: boolean;
}) {
  const activeCount = data.rows.filter((r) => r.status === "active").length;
  return (
    <>
      {readOnly ? (
        <div className="mt-6 rounded-md border border-border-soft bg-bg-elev px-4 py-2.5 text-[12px] text-ink-soft">
          Viewing as this person, read only. No changes can be made from here.
        </div>
      ) : null}
      <header className="mt-6 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="font-mono text-[15px]">{clerkId}</h1>
          <p className="mt-1 text-[13px] text-ink-soft">
            Resolves to <span className="font-semibold text-ink">{data.resolvedTierLabel}</span>
            {data.readOnly ? " (read-only)" : ""}.
          </p>
        </div>
        {readOnly ? null : (
          <div className="flex flex-wrap items-start gap-2">
            <ViewAsButton clerkId={clerkId} />
            <RepointForm fromClerkId={clerkId} />
            <RevokeAll clerkId={clerkId} activeCount={activeCount} />
          </div>
        )}
      </header>

      <section className="mt-8">
        <h2 className="mb-3 text-[13px] font-semibold">Rows ({data.rows.length})</h2>
        <div className="grid gap-2">
          {data.rows.map((r) => (
            <div
              key={r.id}
              className="rounded-md border border-border-soft bg-bg-elev p-3"
              style={{
                borderLeftWidth: 2,
                borderLeftColor:
                  r.status === "revoked"
                    ? "var(--status-blocked)"
                    : r.status === "active"
                      ? "var(--ink)"
                      : "var(--border)",
              }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="text-[13px]">
                  <span className="font-semibold">{r.tierLabel}</span>
                  <span className="ml-2 text-ink-quiet">{r.source}</span>
                  <span className="ml-2 text-[11px] text-ink-quiet">{r.status}</span>
                  {r.billingState && r.billingState !== "none" ? (
                    <span className="ml-2 text-[11px] text-ink-quiet">{r.billingState}</span>
                  ) : null}
                </div>
                {!readOnly && r.status === "active" ? (
                  <RevokeRow
                    entitlementId={r.id}
                    lookup={clerkId}
                    tierLabel={r.tierLabel}
                    source={r.source}
                  />
                ) : null}
              </div>
              <div className="mt-1.5 flex flex-wrap gap-x-5 text-[11px] text-ink-quiet">
                <span>granted {fmt(r.grantedAt)}</span>
                <span>expires {fmt(r.expiresAt)}</span>
                {r.batchId ? <span>batch {r.batchId}</span> : null}
                {r.sourceRef ? <span className="font-mono">{r.sourceRef}</span> : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      {data.redemptions.length > 0 ? (
        <section className="mt-8">
          <h2 className="mb-3 text-[13px] font-semibold">Redemptions ({data.redemptions.length})</h2>
          <ul className="divide-y divide-border-soft rounded-md border border-border-soft bg-bg-elev">
            {data.redemptions.map((r) => (
              <li key={r.codeId} className="flex justify-between px-3 py-2 text-[11.5px]">
                <span className="font-mono">{r.codeId}</span>
                <span className="text-ink-quiet">
                  {r.entitlementId ? "linked" : "unlinked"} · {fmt(r.redeemedAt)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-8">
        <h2 className="mb-3 text-[13px] font-semibold">History ({data.timeline.length})</h2>
        {data.timeline.length === 0 ? (
          <p className="text-[12px] text-ink-quiet">No recorded events.</p>
        ) : (
          <ol className="grid gap-1.5">
            {data.timeline.map((e) => (
              <li key={e.id} className="flex flex-wrap gap-x-3 text-[11.5px] text-ink-soft">
                <span className="w-[110px] shrink-0 font-mono text-ink-quiet">{fmt(e.createdAt)}</span>
                <span className="w-[70px] shrink-0 font-medium text-ink">{e.action}</span>
                <span className="text-ink-quiet">{e.actorName ?? "—"}</span>
                {e.reason ? <span className="text-ink-soft">· {e.reason}</span> : null}
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  );
}
