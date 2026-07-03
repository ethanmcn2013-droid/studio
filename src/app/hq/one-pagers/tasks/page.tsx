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
  title: "Signal Tasks, one-pager",
  description: "Execution clarity. Print-ready one-pager.",
  robots: { index: false, follow: false },
};

export default async function TasksOnePager() {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access");

  return (
    <OnePager
      wordmark="signal tasks."
      eyebrow="Signal Tasks · Execution clarity"
      gesture="pulse"
    >
      <OPHeadline>
        What needs doing.
        <br />
        Who owns it.
        <br />
        What&rsquo;s stuck.
      </OPHeadline>

      <OPWhatIs>
        A task workspace for real work, owned items, clear states, plain
        English throughout.
      </OPWhatIs>

      <OPPurpose>
        Tasks is where the work lives when it needs to be shared. One
        workspace holds everything: what&rsquo;s next, what&rsquo;s moving,
        what&rsquo;s blocked, and who&rsquo;s on it. No setup required. No
        vocabulary to learn. Open it with a wedding planner, a contractor, a
        student group, anyone who needs to see the work clearly.
      </OPPurpose>

      <OPKicker>What it does</OPKicker>
      <OPSubstance
        items={[
          "Tasks, lanes, and assignees in plain English. No status meeting required to decode the board.",
          "Invite anyone to a shared workspace. The work is visible the moment they open it, no onboarding step, no permission taxonomy.",
          "A plain-English activity log. What changed, who did it, when, written as a sentence, not a database row.",
          "Connects to Signal Notes for capturing work in progress, and Signal Timeline for showing where the work is going.",
        ]}
      />
    </OnePager>
  );
}
