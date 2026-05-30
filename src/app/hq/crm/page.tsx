import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HqCrmList } from "@/components/hq/hq-crm-list";
import { HqCrmPipeline } from "@/components/hq/hq-crm-pipeline";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { getProspects } from "@/lib/hq/crm-db";
import {
  computeStageCounts,
  getDueToday,
  PIPELINE_STAGES,
} from "@/lib/hq/crm-utils";
import type { ProspectStage } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Outreach CRM — Signal HQ",
  robots: { index: false, follow: false },
};

/**
 * Signal HQ Outreach CRM — venue pipeline view.
 *
 * Two panels:
 *   1. Pipeline rail — stage counts + due-today count. Visual at a glance.
 *   2. Prospect list — filterable by ?stage=, shows overdue in red.
 *
 * Server component: auth-checked, data fetched at render time, no client
 * state except the stage-select and contact-log interactions (scoped to
 * the child client components).
 */
export default async function HqCrmPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access");

  const params = await searchParams;
  const rawStage = params.stage;
  const activeStage: ProspectStage | "all" = (
    rawStage && [...PIPELINE_STAGES, "not_interested", "later", "all"].includes(rawStage)
      ? rawStage
      : "all"
  ) as ProspectStage | "all";

  const prospects = await getProspects();
  const stageCounts = computeStageCounts(prospects);
  const dueToday = getDueToday(prospects);

  const filtered =
    activeStage === "all"
      ? prospects
      : prospects.filter((p) => p.stage === activeStage);

  return (
    <div className="hq-crm-page">
      <header className="hq-crm-header">
        <div className="hq-crm-header-top">
          <span className="hq-crm-eyebrow">signal hq · outreach crm</span>
          <span className="hq-crm-stamp">
            {prospects.length} total · {dueToday.length} due today
          </span>
        </div>
        <h1 className="hq-crm-title">venue pipeline</h1>
        {dueToday.length > 0 && (
          <p className="hq-crm-due-banner">
            <span className="hq-crm-due-pip" aria-hidden="true" />
            {dueToday.length} follow-up{dueToday.length === 1 ? "" : "s"} due today
          </p>
        )}
      </header>

      <HqCrmPipeline
        stageCounts={stageCounts}
        dueCount={dueToday.length}
        activeStage={activeStage}
      />

      <HqCrmList
        prospects={filtered}
        activeStage={activeStage}
      />
    </div>
  );
}
