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
  title: "Signal Notes, one-pager",
  description: "Capture clarity. Print-ready one-pager.",
  robots: { index: false, follow: false },
};

export default async function NotesOnePager() {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access");

  return (
    <OnePager
      wordmark="signal notes."
      eyebrow="Signal Notes · Capture clarity"
      gesture="caret"
    >
      <OPHeadline>
        Not everything is ready
        <br />
        for the room.
        <br />
        Write it here first.
      </OPHeadline>

      <OPWhatIs>
        A private notebook that sends work forward, into tasks, into
        decisions, into the record.
      </OPWhatIs>

      <OPPurpose>
        Notes is private by design. It&rsquo;s where the thought goes before
        it&rsquo;s a task, before it&rsquo;s a decision, before it&rsquo;s
        ready to share. Write a venue meeting, a supplier call, a half-formed
        concern, then send it to your workspace when it&rsquo;s ready.
        Nothing leaves until you say so. The notebook is yours.
      </OPPurpose>

      <OPKicker>What it does</OPKicker>
      <OPSubstance
        items={[
          "Private by default. Notes do not appear in any shared workspace, any activity log, or any briefing unless you explicitly send them forward.",
          "A draft action, highlight what matters in a note, send it to your Signal Tasks workspace as an owned task. The note stays private; the task is real.",
          "Search across the notebook. Command-K, type, find, including partial matches and phrases across old notes.",
          "Email capture. Send a note to your notebook from any email client. It arrives private, ready to work from.",
        ]}
      />
    </OnePager>
  );
}
