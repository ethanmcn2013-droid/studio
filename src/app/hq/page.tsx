import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { HqDashboard } from "@/components/hq/hq-dashboard";
import { HqInbox } from "@/components/hq/hq-inbox";
import { HqToday } from "@/components/hq/hq-today";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { getHqDashboardMarkdown } from "@/lib/hq/dashboard-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Signal HQ — Signal Studio",
  description: "Private operating dashboard for Signal Studio.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function HqPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;

  if (!valid) {
    redirect("/hq/access");
  }

  const markdown = await getHqDashboardMarkdown();

  return (
    <>
      <Suspense
        fallback={
          <section className="hq-inbox hq-inbox--loading">
            <div className="hq-inbox-header">
              <span className="hq-inbox-eyebrow">inbox · loading</span>
            </div>
          </section>
        }
      >
        <HqInbox />
      </Suspense>
      <Suspense
        fallback={
          <section className="hq-today hq-today--loading">
            <div className="hq-today-header">
              <span className="hq-today-eyebrow">today · loading</span>
            </div>
          </section>
        }
      >
        <HqToday />
      </Suspense>
      <HqDashboard markdown={markdown} />
    </>
  );
}
