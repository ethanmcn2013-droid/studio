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
  title: "Signal Analytics — one-pager",
  description: "Attention clarity. Print-ready one-pager.",
  robots: { index: false, follow: false },
};

export default async function AnalyticsOnePager() {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access");

  return (
    <OnePager
      wordmark="signal analytics."
      eyebrow="Signal Analytics · Attention clarity"
      gesture="tick"
    >
      <OPHeadline>
        What needs focus
        <br />
        before it becomes
        <br />
        a problem.
      </OPHeadline>

      <OPWhatIs>
        A daily briefing — not a dashboard — that names the three things in
        your work worth attention today.
      </OPWhatIs>

      <OPPurpose>
        Analytics reads your Signal Tasks workspace every morning and sends
        one email. Not a report. Not a chart. Three items, ranked by what
        matters most: what&rsquo;s been stuck the longest, what&rsquo;s due
        soon, what you shipped. If nothing moved, nothing arrives. The
        briefing is as useful as the work it describes — no more.
      </OPPurpose>

      <OPKicker>What it does</OPKicker>
      <OPSubstance
        items={[
          "Six attention triggers: stuck work, due soon, just shipped, overload, crowded week, blocked too long. Each fires only when the condition is real.",
          "Prose rotation — eighteen phrasings, one per reader per day — so the briefing never reads the same way twice.",
          "One-click unsubscribe, RFC 8058 compliant. The brand promise extends to the email: if you want silence, you get it immediately.",
          "The briefing skips quiet days. If nothing in your workspace moved yesterday, nothing arrives. Silence is the signal.",
        ]}
      />
    </OnePager>
  );
}
