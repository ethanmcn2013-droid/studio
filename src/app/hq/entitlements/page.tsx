import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HqPageHeader } from "@/components/hq/hq-page-header";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import {
  getAccessToday,
  getBatches,
  getRoster,
  getVenues,
  formatCents,
} from "@/lib/hq/access";
import type { RosterFilters } from "@/lib/hq/access";
import { GiveAccessForm } from "./GiveAccessForm";
import { FindSomeone } from "./FindSomeone";
import { ReconcileButton } from "./ReconcileButton";
import { MintCodesForm } from "./MintCodesForm";
import { OnboardVenueForm } from "./OnboardVenueForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Access · Signal HQ",
  robots: { index: false, follow: false },
};

const TABS = [
  { key: "today", label: "Today" },
  { key: "roster", label: "Roster" },
  { key: "batches", label: "Batches" },
  { key: "venues", label: "Venues" },
] as const;

function fmt(ms: number | null | undefined): string {
  if (!ms) return "—";
  return new Date(ms).toISOString().slice(0, 10);
}

export default async function AccessConsolePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access?from=/hq/entitlements");

  const sp = await searchParams;
  const tab = TABS.some((t) => t.key === sp.tab) ? (sp.tab as string) : "today";

  return (
    <main id="main" className="mx-auto w-full max-w-[1080px] px-5 pb-12 text-ink">
      <HqPageHeader
        slug="entitlements"
        standfirst="Every grant, code, venue, and subscription in one place, each change recorded in an append-only ledger."
      />

      {/* Entry points */}
      <section className="mb-10 mt-8 grid gap-4 md:grid-cols-2">
        <div>
          <h2 className="mb-2 text-[13px] font-semibold">Give access</h2>
          <GiveAccessForm />
        </div>
        <div className="grid content-start gap-4">
          <div>
            <h2 className="mb-2 text-[13px] font-semibold">Find someone</h2>
            <FindSomeone />
          </div>
          <div>
            <h2 className="mb-2 text-[13px] font-semibold">Onboard a venue</h2>
            <Link
              href="/hq/entitlements?tab=venues"
              className="inline-flex h-9 items-center rounded-md border border-border-soft bg-bg-elev px-3 text-[12.5px] text-ink-soft transition hover:text-ink"
            >
              Go to Venues →
            </Link>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <nav className="mb-6 flex gap-1 border-b border-border-soft" aria-label="Access tabs">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/hq/entitlements?tab=${t.key}`}
            className={`-mb-px border-b-2 px-3 py-2 text-[12.5px] font-medium transition ${
              tab === t.key
                ? "border-[color:var(--accent)] text-ink"
                : "border-transparent text-ink-quiet hover:text-ink-soft"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {tab === "today" ? <TodayTab /> : null}
      {tab === "roster" ? <RosterTab sp={sp} /> : null}
      {tab === "batches" ? <BatchesTab /> : null}
      {tab === "venues" ? <VenuesTab /> : null}
    </main>
  );
}

function Unreachable({ error }: { error?: string }) {
  return (
    <div className="rounded-md border border-border-soft bg-bg-elev px-4 py-6">
      <div className="text-[13px] font-medium">Can&rsquo;t reach the entitlements DB.</div>
      <p className="mt-1 text-[12px] text-ink-quiet">
        Reads fail open to free across the suite, so products stay up. {error ?? ""}
      </p>
    </div>
  );
}

async function TodayTab() {
  const today = await getAccessToday();
  if (!today.reachable) return <Unreachable error={today.error} />;

  const stat = (n: number, label: string) => (
    <div className="rounded-md border border-border-soft bg-bg-elev px-4 py-3">
      <div className="text-[22px] font-semibold tabular-nums">{n}</div>
      <div className="text-[11.5px] text-ink-quiet">{label}</div>
    </div>
  );

  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-ink-quiet">
          {today.driftSponsors > 0
            ? `${today.driftSponsors} venue counter${today.driftSponsors === 1 ? "" : "s"} drifted from their code rows.`
            : "Counters and code rows agree."}
        </span>
        <ReconcileButton />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stat(today.expiredOvernight, "expired in last 24h")}
        {stat(today.newRedemptions, "new redemptions")}
        {stat(today.inGraceExpiringSoon, "in grace, expiring soon")}
        {stat(today.driftSponsors, "venues with drift")}
      </div>
      {today.venuesNearAllotment.length > 0 ? (
        <div>
          <h3 className="mb-2 text-[12px] font-semibold">Venues near their allotment</h3>
          <ul className="divide-y divide-border-soft rounded-md border border-border-soft bg-bg-elev">
            {today.venuesNearAllotment.map((v) => (
              <li key={v.slug} className="flex items-center justify-between px-4 py-2.5 text-[12.5px]">
                <span>{v.name}</span>
                <span className="text-ink-quiet">
                  {v.remaining} of {v.allotment} left
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

const ROSTER_FILTER_FIELDS = [
  { key: "tier", label: "Tier", options: ["free", "event", "wedding", "workspace", "studio"] },
  {
    key: "source",
    label: "Source",
    options: [
      "workspace_subscription",
      "event_pass",
      "student_edu",
      "venue_edition",
      "compliments",
      "review_access",
      "batch_grant",
    ],
  },
  { key: "status", label: "Status", options: ["active", "expired", "revoked"] },
  {
    key: "billingState",
    label: "Billing",
    options: ["active", "trialing", "past_due", "canceled", "refunded", "disputed", "none"],
  },
] as const;

async function RosterTab({ sp }: { sp: Record<string, string | undefined> }) {
  const filters: RosterFilters = { limit: 200 };
  for (const f of ROSTER_FILTER_FIELDS) {
    const v = sp[f.key];
    if (v) (filters as Record<string, string>)[f.key] = v;
  }
  const roster = await getRoster(filters);
  if (!roster.ok) return <Unreachable error={roster.error} />;
  const rows = roster.data;

  const exportQs = new URLSearchParams();
  for (const f of ROSTER_FILTER_FIELDS) {
    if (sp[f.key]) exportQs.set(f.key, sp[f.key] as string);
  }
  const exportBase = `/hq/entitlements/export?${exportQs.toString()}`;

  return (
    <div>
      {/* Filters (server-rendered GET form) */}
      <form method="get" className="mb-4 flex flex-wrap items-end gap-2">
        <input type="hidden" name="tab" value="roster" />
        {ROSTER_FILTER_FIELDS.map((f) => (
          <label key={f.key} className="grid gap-1 text-[10.5px] text-ink-quiet">
            <span>{f.label}</span>
            <select
              name={f.key}
              defaultValue={sp[f.key] ?? ""}
              className="h-8 rounded border border-border-soft bg-bg px-2 text-[12px] outline-none focus:border-accent"
            >
              <option value="">any</option>
              {f.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
        ))}
        <button
          type="submit"
          className="h-8 rounded border border-border-soft bg-bg px-3 text-[12px] font-medium text-ink transition hover:border-accent"
        >
          Apply
        </button>
        <Link
          href="/hq/entitlements?tab=roster"
          className="h-8 rounded px-2 text-[11.5px] leading-8 text-ink-quiet transition hover:text-ink"
        >
          Clear
        </Link>
        <span className="ml-auto flex gap-2 text-[11.5px]">
          <a href={`${exportBase}&format=csv`} className="text-ink underline decoration-1 underline-offset-2 hover:opacity-70">
            Export CSV
          </a>
          <a href={`${exportBase}&format=json`} className="text-ink underline decoration-1 underline-offset-2 hover:opacity-70">
            JSON
          </a>
        </span>
      </form>

      <h3 className="mb-3 text-[13px] font-semibold">Roster ({rows.length})</h3>
      {rows.length === 0 ? (
        <p className="rounded-md border border-border-soft bg-bg-elev px-4 py-6 text-[12.5px] text-ink-quiet">
          No entitlement rows yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border-soft bg-bg-elev">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border-soft text-left text-[10.5px] uppercase tracking-[0.08em] text-ink-quiet">
                <th className="px-3 py-2">Person</th>
                <th className="px-3 py-2">Plan</th>
                <th className="px-3 py-2">Source</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Billing</th>
                <th className="px-3 py-2">Expires</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border-soft">
                  <td className="px-3 py-2 font-mono text-[11px]">
                    <Link
                      href={`/hq/entitlements/${encodeURIComponent(r.userClerkId)}`}
                      className="text-ink underline decoration-1 underline-offset-2 hover:opacity-70"
                    >
                      {r.userClerkId}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{r.tierLabel}</td>
                  <td className="px-3 py-2 text-ink-soft">
                    {r.source}
                    <span className="ml-1 text-[10px] text-ink-quiet">{r.paid ? "paid" : "comp"}</span>
                  </td>
                  <td className="px-3 py-2">{r.status}</td>
                  <td className="px-3 py-2 text-ink-soft">{r.billingState ?? "—"}</td>
                  <td className="px-3 py-2 text-ink-soft">{fmt(r.expiresAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

async function BatchesTab() {
  const batches = await getBatches();
  if (!batches.ok) return <Unreachable error={batches.error} />;
  const rows = batches.data;

  return (
    <div>
      <h3 className="mb-3 text-[13px] font-semibold">Batches ({rows.length})</h3>
      {rows.length === 0 ? (
        <p className="rounded-md border border-border-soft bg-bg-elev px-4 py-6 text-[12.5px] text-ink-quiet">
          No cohorts yet. Name a batch when you give access to a group.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border-soft bg-bg-elev">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border-soft text-left text-[10.5px] uppercase tracking-[0.08em] text-ink-quiet">
                <th className="px-3 py-2">Batch</th>
                <th className="px-3 py-2">Kind</th>
                <th className="px-3 py-2">Plan</th>
                <th className="px-3 py-2">Granted</th>
                <th className="px-3 py-2">Allotment</th>
                <th className="px-3 py-2">Reason</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id} className="border-t border-border-soft">
                  <td className="px-3 py-2">{b.label}</td>
                  <td className="px-3 py-2 text-ink-soft">{b.kind}</td>
                  <td className="px-3 py-2">{b.tierLabel}</td>
                  <td className="px-3 py-2 tabular-nums">{b.granted}</td>
                  <td className="px-3 py-2 text-ink-soft">{b.allotment ?? "unlimited"}</td>
                  <td className="px-3 py-2 text-ink-quiet">{b.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

async function VenuesTab() {
  const venues = await getVenues();
  if (!venues.ok) return <Unreachable error={venues.error} />;
  const rows = venues.data;

  return (
    <div className="grid gap-4">
      <div>
        <h3 className="mb-2 text-[13px] font-semibold">Onboard a venue</h3>
        <OnboardVenueForm />
      </div>
      <h3 className="text-[13px] font-semibold">Venues ({rows.length})</h3>
      {rows.length === 0 ? (
        <p className="rounded-md border border-border-soft bg-bg-elev px-4 py-6 text-[12.5px] text-ink-quiet">
          No venues yet.
        </p>
      ) : (
        rows.map((v) => (
          <div key={v.id} className="rounded-md border border-border-soft bg-bg-elev p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <span className="text-[14px] font-semibold">{v.name}</span>
                <span className="ml-2 text-[11.5px] text-ink-quiet">
                  {v.venuePlan} · {v.paid ? "paid" : "not paid"}
                  {v.drift ? " · counter drift" : ""}
                </span>
              </div>
              <span className="text-[12px] text-ink-soft">
                {formatCents(v.annualAmountCents)} · term ends {fmt(v.termEndsAt)}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-[12px] text-ink-soft">
              <span>allotment {v.allotment ?? "—"}</span>
              <span>minted {v.minted}</span>
              <span>redeemed {v.redeemed}</span>
              <span>remaining {v.remaining ?? "—"}</span>
            </div>
            <div className="mt-3 border-t border-border-soft pt-3">
              <MintCodesForm sponsorId={v.id} sponsorName={v.name} remaining={v.remaining} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
