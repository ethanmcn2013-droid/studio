import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, gt, isNull, or } from "drizzle-orm";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { entitlementsDb } from "@/lib/entitlements-db/client";
import {
  entitlements,
  ENTITLEMENT_SOURCES,
  ENTITLEMENT_TIERS,
} from "@/lib/entitlements-db/schema";
import { GrantForm } from "./GrantForm";
import { ExpireButton } from "./ExpireButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "HQ · Entitlements — Signal Studio",
  robots: { index: false, follow: false },
};

export default async function HqEntitlementsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access?from=/hq/entitlements");

  const now = Date.now();
  const db = entitlementsDb();
  const rows = await db
    .select()
    .from(entitlements)
    .where(
      and(
        eq(entitlements.status, "active"),
        or(isNull(entitlements.expiresAt), gt(entitlements.expiresAt, now)),
      ),
    )
    .orderBy(entitlements.createdAt);
  // newest first
  rows.reverse();

  return (
    <main id="main" className="mx-auto w-full max-w-[1080px] px-5 py-12 text-ink">
      <header className="mb-8">
        <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-quiet">
          Signal HQ
        </div>
        <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.04em]">
          Entitlements
        </h1>
        <p className="mt-2 max-w-[60ch] text-[13.5px] leading-[1.55] text-ink-soft">
          Active entitlements across the suite. Grants flow into the shared
          signal-entitlements DB and are visible to all five products
          (Tasks, Roadmap, Analytics, Notes, Studio). Use this surface for
          off-Stripe support grants, pilot users, and revokes. Origin
          `studio-hq` in metadata marks rows created from here.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="mb-3 text-[14px] font-semibold tracking-[-0.01em]">
          Active grants ({rows.length})
        </h2>
        {rows.length === 0 ? (
          <p className="rounded-md border border-border-soft bg-bg-elev px-4 py-6 text-[13px] text-ink-quiet">
            No active entitlements. Grant one below or wait for a Stripe
            checkout to land.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-border-soft bg-bg-elev">
            <table className="w-full text-[12.5px]">
              <thead>
                <tr className="border-b border-border-soft text-left text-[11px] uppercase tracking-[0.08em] text-ink-quiet">
                  <th className="px-3 py-2">User</th>
                  <th className="px-3 py-2">Tier</th>
                  <th className="px-3 py-2">Source</th>
                  <th className="px-3 py-2">Ref</th>
                  <th className="px-3 py-2">Granted</th>
                  <th className="px-3 py-2">Expires</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-border-soft">
                    <td className="px-3 py-2 font-mono text-[11px]">{r.userClerkId}</td>
                    <td className="px-3 py-2">{r.tier}</td>
                    <td className="px-3 py-2">{r.source}</td>
                    <td className="px-3 py-2 font-mono text-[11px] text-ink-soft">
                      {r.sourceRef ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-ink-soft">{fmt(r.grantedAt)}</td>
                    <td className="px-3 py-2 text-ink-soft">
                      {r.expiresAt ? fmt(r.expiresAt) : "—"}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {r.sourceRef ? (
                        <ExpireButton sourceRef={r.sourceRef} />
                      ) : (
                        <span className="text-[11px] text-ink-quiet">no-ref</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-[14px] font-semibold tracking-[-0.01em]">
          Grant a new entitlement
        </h2>
        <GrantForm tiers={ENTITLEMENT_TIERS} sources={ENTITLEMENT_SOURCES} />
        <p className="mt-3 max-w-[60ch] text-[11.5px] leading-[1.6] text-ink-quiet">
          Use a unique `Ref` (e.g. `hq-2026-05-14-jane`) so the row can be
          expired later by ref. Leave duration blank for a perpetual grant.
        </p>
      </section>
    </main>
  );
}

function fmt(ms: number | null | undefined): string {
  if (!ms) return "—";
  return new Date(ms).toISOString().slice(0, 16).replace("T", " ");
}
