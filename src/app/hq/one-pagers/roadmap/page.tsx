import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import {
  OnePager,
  OPHeadline,
  OPWhatIs,
  OPPurpose,
  OPKicker,
  OPSubstance,
} from "@/components/hq/one-pager/OnePager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Signal Timeline, one-pager",
  description: "Direction clarity. Print-ready one-pager.",
  robots: { index: false, follow: false },
};

export default async function RoadmapOnePager() {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access");

  return (
    <OnePager
      wordmark="signal timeline."
      eyebrow="Signal Timeline · Direction clarity"
      gesture="sweep"
    >
      <OPHeadline>
        Where the work is going.
        <br />
        What changed.
        <br />
        What people should expect.
      </OPHeadline>

      <OPWhatIs>
        A shareable timeline that non-technical collaborators can open and
        understand in under sixty seconds.
      </OPWhatIs>

      <OPPurpose>
        Timeline gives the work a public face. Write your plan once. Share a
        link. Anyone, a client, a venue coordinator, a course supervisor —
        sees what&rsquo;s in progress, what shipped, and what comes next,
        without being asked to understand the tool behind it. The shared
        update page is for people who don&rsquo;t work in the workspace.
      </OPPurpose>

      <OPKicker>What it does</OPKicker>
      <OPSubstance
        items={[
          "A plain-text editor that produces a structured, publicly shareable timeline. Write it; share the link; the reader sees progress, not source.",
          "Milestones as a first-class object, with countdown and per-milestone progress. The reader knows how close the work is to done.",
          "A shared update page the owner can send to anyone, with “invited by” attribution and a reply-by-email option. No account required to read.",
          "Public guest view is the architecture, not a toggle: being readable by people outside the work is how Timeline works.",
        ]}
      />
    </OnePager>
  );
}
