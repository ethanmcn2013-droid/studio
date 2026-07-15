import type { Metadata } from "next";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { DIRECTIONS, DIRECTION_IDS } from "@/emails/directions";
import { TEMPLATES } from "@/emails/registry";
import { EmailLabClient, type LabDirection, type LabTemplate } from "./email-lab-client";

export const metadata: Metadata = {
  title: "Email Lab · Signal HQ",
  robots: { index: false, follow: false },
};

/**
 * The Email Lab · /hq/email-lab
 *
 * Internal review room for the email design system: three directions,
 * eight representative emails, one shared fixture set. The founder can
 * compare everything here without reading source code. Documentation
 * lives in docs/email-system/, starting with README.md.
 */
export default async function EmailLabPage() {
  await requireHqAccess();

  const directions: LabDirection[] = DIRECTION_IDS.map((id) => {
    const d = DIRECTIONS[id];
    return { id, name: d.name, thesis: d.thesis, pole: d.pole, maxWidth: d.maxWidth };
  });

  const templates: LabTemplate[] = TEMPLATES.map((t) => ({
    id: t.id,
    name: t.name,
    mode: t.mode,
    classification: t.classification,
    priority: t.priority,
    sender: `${t.sender.name} <${t.sender.address}>${t.sender.proposed ? " · proposed" : ""}`,
    replyTo: t.replyTo,
    unsubscribe: t.unsubscribe,
    tracking: t.tracking,
    sourceFile: t.sourceFile,
    assumptions: t.assumptions,
    fixtures: Object.entries(t.fixtures).map(([fixtureId, f]) => ({
      id: fixtureId,
      label: f.label,
      subject: t.subject(f.data),
      preheader: t.preheader(f.data),
    })),
  }));

  return <EmailLabClient directions={directions} templates={templates} />;
}
