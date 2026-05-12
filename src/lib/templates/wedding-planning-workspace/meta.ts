import type { WorkspaceTemplate } from "../types";

type TemplateMeta = Pick<
  WorkspaceTemplate,
  "id" | "name" | "description" | "icon" | "domain" | "audience" | "problem" | "seoSummary"
>;

export const meta: TemplateMeta = {
  id: "wedding-planning-workspace",
  name: "Wedding planning workspace",
  description:
    "The venue, supplier, guest, decision, and final-week work in one calm list.",
  icon: "target",
  domain: "wedding",
  audience: "wedding-planner",
  problem:
    "Wedding planning lives across email, group chats, and a venue's PDF — one place for what's done, what's blocked, and what's next.",
  seoSummary:
    "A starter workspace for wedding planning. Venue contracts, supplier timing, guest decisions, final-week walkthroughs — all in one workspace that the couple, the planner, and the venue can read in under a minute. Pairs with a private Notes notebook for venue meetings, a shared Roadmap update for the couple, and a daily Analytics briefing that catches RSVP and supplier-payment deadlines before they slip.",
};
