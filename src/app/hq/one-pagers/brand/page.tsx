import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import {
  OnePager,
  OPHeadline,
  OPMark,
  OPSection,
  OPPurpose,
  OPPull,
  OPDefs,
  OPEyeline,
} from "@/components/hq/one-pager/OnePager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Signal Studio — brand one-pager",
  description: "Five products, one discipline. Print-ready one-pager.",
  robots: { index: false, follow: false },
};

export default async function BrandOnePager() {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access");

  return (
    <OnePager
      wordmark="signal studio."
      eyebrow="Signal Studio · The system"
      gesture="broadcast"
    >
      <OPHeadline>
        Project management
        <br />
        for the <OPMark>80%</OPMark> not in tech.
      </OPHeadline>

      <OPSection>Everything important. Nothing distracting.</OPSection>

      <OPPurpose>
        Signal Studio is four products that read as one. Each solves one kind
        of clarity: Notes captures context before it&rsquo;s ready to share.
        Tasks organises action and ownership. Roadmap communicates direction
        to people outside the work. Analytics surfaces what needs attention
        before it becomes a problem. Together they are a system. Separately,
        each one works.
      </OPPurpose>

      <OPPull>
        The moat is not features. It is disciplined refusal sustained across
        four products over time. Every banned word, every refused dashboard,
        every plain-English error message is the same decision made again.
        Incumbents can copy a feature. They cannot copy a discipline that has
        been held for two years.
      </OPPull>

      <OPDefs
        rows={[
          { k: "Signal Notes", v: "Capture context before it's ready for the room." },
          { k: "Signal Tasks", v: "Own the work. Know what's stuck. See who's on it." },
          { k: "Signal Roadmap", v: "Share direction with people who aren't in the workspace." },
          { k: "Signal Analytics", v: "Read what matters before it becomes a problem." },
        ]}
      />

      <OPEyeline>
        signalstudio.ie · Free to start · Workspace €12/mo · Event €79
      </OPEyeline>
    </OnePager>
  );
}
