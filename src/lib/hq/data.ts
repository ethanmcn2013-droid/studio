/**
 * Signal HQ seed data — TRANSITIONAL FILE (HQ-6c.3, 2026-05-14).
 *
 * 18 sections have migrated to markdown at `content/hq/<section>/*.md`.
 * The dashboard reads those via `src/lib/hq/dashboard-data.ts` and
 * prefers markdown when present. The data below is legacy fallback —
 * when both sources exist, the markdown wins.
 *
 * DEAD SUBSTRATE (read-only fallback; edit the .md files instead):
 *   products, ecosystemFlows, collaborationLoop, sharedObjects,
 *   accessRoles, collaboratorFirstView, shareableArtifacts, features,
 *   launchReadiness, segments, campaigns, contentItems, demos,
 *   templates, pilots, decisions, risks, messaging, growthWorkflow.
 *
 * STILL LIVE (operator-owned, localStorage-edited via /hq):
 *   prospects (CRM), feedback, weeklyRhythm, nextActions.
 *
 * DERIVED ELSEWHERE (kept here as type-shape only):
 *   focus → read from ~/.claude/state/phase.md by the Today block.
 *   metrics → deferred (would need a real DB to honor).
 *
 * Types below stay the canonical shape; the dashboard imports them.
 * CLAUDE.md's Mandatory Signal HQ Rule was rewritten (HQ-6c.4) to point
 * at source files. When you change strategic HQ content, change the
 * markdown — not this file.
 */

export type ReadinessStatus = "Clear" | "Needs attention" | "At risk" | "Blocked";
export type WorkStatus =
  | "Idea"
  | "Planned"
  | "In Progress"
  | "Blocked"
  | "Built"
  | "Testing"
  | "Shipped";
export type Priority = "High" | "Medium" | "Low";
export type GrowthStatus =
  | "Queued"
  | "Selected"
  | "Drafting"
  | "Review"
  | "Revision"
  | "Ready for Ethan"
  | "Approved"
  | "Published"
  | "Measured"
  | "Repurposed"
  | "Archived";

export interface ScoreCard {
  label: string;
  score: number;
  detail: string;
}

export interface OperatingFocus {
  stage: "Development" | "Pre-launch" | "Private Beta" | "Public Beta" | "Launch";
  weekOf: string;
  theme: string;
  focus: string;
  priorities: string[];
  risks: string[];
  nextActions: string[];
}

export interface ProductStatus {
  id: string;
  name: "Signal Tasks" | "Signal Roadmap" | "Signal Analytics" | "Signal Notes";
  layer: "Execution" | "Direction" | "Attention" | "Context";
  role: string;
  maturity: number;
  status: "Private preview" | "Private build" | "Planned";
  uxPolish: number;
  integrationScore: number;
  launchReadiness: number;
  majorFeatures: string[];
  blockers: string[];
  notes: string;
  nextActions: string[];
}

export interface EcosystemFlow {
  id: string;
  from: string;
  to: string;
  purpose: string;
  status: "Planned" | "Partly working" | "Working" | "Not started";
  health: ReadinessStatus;
  nextAction: string;
}

export interface FeatureItem {
  id: string;
  name: string;
  product: string;
  type:
    | "Core"
    | "Integration"
    | "Growth"
    | "UX Polish"
    | "Infrastructure"
    | "Marketing Support";
  status: WorkStatus;
  priority: Priority;
  effort: "Small" | "Medium" | "Large";
  impact: "Low" | "Medium" | "High";
  owner: string;
  relatedCampaign: string;
  relatedMetric: string;
  principleAlignment: number;
  notes: string;
}

export interface LaunchReadinessItem {
  id: string;
  category: string;
  score: number;
  weight: number;
  status: ReadinessStatus;
  notes: string;
  blockers: string[];
  nextAction: string;
}

export interface SegmentPlan {
  id: string;
  segment: string;
  priority: Priority;
  painPoint: string;
  coreMessage: string;
  offer: string;
  acquisitionChannel: string;
  confidence: number;
  status: "Explore" | "Validate" | "Active" | "Later";
  notes: string;
}

export interface Campaign {
  id: string;
  name: string;
  segment: string;
  goal: string;
  offer: string;
  status: GrowthStatus;
  assetsNeeded: string[];
  startDate: string;
  endDate: string;
  currentBlocker: string;
  nextStep: string;
  progress: number;
  relatedContent: string;
  relatedLandingPage: string;
  relatedMetric: string;
}

export interface Prospect {
  id: string;
  organisation: string;
  segment: string;
  contactName: string;
  role: string;
  email: string;
  website: string;
  location: string;
  source: string;
  status:
    | "To Contact"
    | "Contacted"
    | "Replied"
    | "Demo Booked"
    | "Pilot Active"
    | "Not Interested"
    | "Later";
  lastContacted: string;
  nextFollowUp: string;
  personalisationNote: string;
  offerSent: string;
  outcome: string;
  notes: string;
}

export interface ContentItem {
  id: string;
  title: string;
  pillar:
    | "Use-case demos"
    | "Problem videos"
    | "Founder/build-in-public"
    | "Template videos"
    | "Educational posts"
    | "Partner/pilot stories";
  format: "Short video" | "Long demo" | "LinkedIn post" | "Blog" | "Email" | "Template" | "Case study";
  channel: "LinkedIn" | "YouTube" | "Instagram" | "TikTok" | "Email" | "Website";
  targetSegment: string;
  status: "Idea" | "Script" | "Recording" | "Editing" | "Published";
  dueDate: string;
  cta: string;
  relatedCampaign: string;
  relatedMetric: string;
  notes: string;
}

export interface DemoAsset {
  id: string;
  title: string;
  audience: string;
  objective: string;
  scriptStatus: WorkStatus;
  recordingStatus: WorkStatus;
  editingStatus: WorkStatus;
  publishedLink: string;
  cta: string;
  keyScenes: string[];
  voiceoverNotes: string;
  motionNotes: string;
  relatedProduct: string;
  relatedCampaign: string;
}

export interface TemplateItem {
  id: string;
  name: string;
  targetSegment: string;
  status: "Idea" | "Draft" | "Built" | "Tested" | "Published";
  useCase: string;
  includedProducts: string[];
  landingPageUrl: string;
  relatedCampaign: string;
  activationGoal: string;
  notes: string;
}

export interface PilotProgramme {
  id: string;
  name: string;
  offer: string;
  targetParticipants: string;
  value: string;
  ask: string;
  successCriteria: string[];
  currentParticipants: number;
  feedbackCollected: number;
  caseStudyPotential: "Low" | "Medium" | "High";
  status: GrowthStatus;
  relatedProspects: string[];
  relatedWorkspaces: string[];
}

export interface MetricItem {
  id: string;
  name: string;
  category: "Activation" | "Outreach" | "Content" | "Revenue" | "Product";
  value: number;
  previousValue: number;
  unit: "count" | "percent" | "eur";
  target: number;
  notes: string;
}

export interface DecisionItem {
  id: string;
  decision: string;
  category: "Product" | "Brand" | "GTM" | "Pricing" | "Architecture" | "Design" | "Operations";
  date: string;
  reason: string;
  alternatives: string;
  risks: string;
  reviewDate: string;
  status: "Active" | "Revisit" | "Reversed";
  relatedObjects: string[];
  notes: string;
}

export interface FeedbackItem {
  id: string;
  source: string;
  segment: string;
  productArea: string;
  type: "Bug" | "Confusion" | "Feature request" | "Objection" | "Praise" | "Pricing" | "Positioning";
  rawFeedback: string;
  insight: string;
  frequency: number;
  severity: "Low" | "Medium" | "High";
  status: "New" | "Triaged" | "Linked" | "Resolved";
  relatedFeature: string;
  notes: string;
}

export interface RiskItem {
  id: string;
  risk: string;
  area: string;
  likelihood: "Low" | "Medium" | "High";
  impact: "Low" | "Medium" | "High";
  status: ReadinessStatus;
  mitigation: string;
  owner: string;
  reviewDate: string;
}

export interface WeeklyRhythmItem {
  id: string;
  day: string;
  action: string;
  checked: boolean;
}

export interface MessagingBank {
  positioning: string;
  ecosystemLine: string;
  founderStory: string;
  hooks: string[];
  pitches: {
    weddingVenue: string;
    weddingPlanner: string;
    student: string;
    freelancer: string;
  };
  objections: string[];
  ctas: string[];
}

export interface NextActionItem {
  id: string;
  action: string;
  category: "Product" | "GTM" | "Content" | "Outbound" | "Partnerships" | "Metrics" | "Operations";
  priority: Priority;
  dueDate: string;
  status: "To do" | "Doing" | "Done";
  relatedObject: string;
  notes: string;
}

export interface GrowthWorkflowItem {
  id: string;
  title: string;
  audience: string;
  campaign: string;
  product: string;
  segment: string;
  channel: string;
  goal: string;
  cta: string;
  rationale: string;
  relatedMetric: string;
  brandRisk: "Low" | "Medium" | "High";
  complianceRisk: "Low" | "Medium" | "High";
  repurposing: string[];
  status: GrowthStatus;
  roleOwner:
    | "Strategy Director"
    | "Creative Director"
    | "Brand Director"
    | "Content Producer"
    | "Outbound Operator"
    | "SEO & Template Strategist"
    | "Performance Analyst"
    | "Compliance & Trust Reviewer";
}

export interface CollaborationLoopStep {
  id: string;
  step: string;
  purpose: string;
  productOwner: string;
  status: WorkStatus;
  readiness: number;
  growthSurface: string;
  nextAction: string;
  metric: string;
}

export interface SharedObjectItem {
  id: string;
  object: string;
  definition: string;
  usedBy: string[];
  status: "Defined" | "Needs model" | "Partly working" | "Working";
  nextAction: string;
}

export interface AccessRoleItem {
  id: string;
  role: string;
  plainName: string;
  purpose: string;
  defaultAccess: string;
  canDo: string[];
  cannotDo: string[];
  status: "Draft" | "Needs design" | "Ready to build" | "Built";
  nextAction: string;
}

export interface CollaboratorFirstViewItem {
  id: string;
  section: string;
  question: string;
  sourceProduct: string;
  purpose: string;
  status: "Draft" | "Needs design" | "Ready to build" | "Built";
  nextAction: string;
}

export interface ShareableArtifactItem {
  id: string;
  name: string;
  wedge: string;
  ownerProduct: string;
  purpose: string;
  defaultVisibility: "Private" | "Owner controlled" | "Public";
  sourceTracking: string;
  cta: string;
  status: "Draft" | "Needs design" | "Ready to build" | "Built";
  nextAction: string;
}

export interface HqData {
  version: 1;
  updatedAt: string;
  focus: OperatingFocus;
  products: ProductStatus[];
  ecosystemFlows: EcosystemFlow[];
  collaborationLoop: CollaborationLoopStep[];
  sharedObjects: SharedObjectItem[];
  accessRoles: AccessRoleItem[];
  collaboratorFirstView: CollaboratorFirstViewItem[];
  shareableArtifacts: ShareableArtifactItem[];
  features: FeatureItem[];
  launchReadiness: LaunchReadinessItem[];
  segments: SegmentPlan[];
  campaigns: Campaign[];
  prospects: Prospect[];
  contentItems: ContentItem[];
  demos: DemoAsset[];
  templates: TemplateItem[];
  pilots: PilotProgramme[];
  metrics: MetricItem[];
  decisions: DecisionItem[];
  feedback: FeedbackItem[];
  risks: RiskItem[];
  weeklyRhythm: WeeklyRhythmItem[];
  messaging: MessagingBank;
  nextActions: NextActionItem[];
  growthWorkflow: GrowthWorkflowItem[];
}

export const seedHqData: HqData = {
  version: 1,
  updatedAt: "2026-05-14T19:00:00Z",
  focus: {
    stage: "Pre-launch",
    weekOf: "2026-05-11",
    theme: "Venue-pilot pull · three conversations by 2026-06-02, regardless of polish.",
    focus:
      "T0-T3.b polish work is closed (verified 2026-05-12 across /weddings, Tasks /welcome, Roadmap demo). The next forcing function is not another sprint - it is venues. Three real conversations by 2026-06-02. Sprint 1 (Notes 9.3 + 9.4b) and Sprint 2 (collaboration gestures) continue, but in service of the pilot, not as a prerequisite.",
    priorities: [
      "Assemble a list of 10 named Irish wedding venues in signal-growth/outbound by 2026-05-15.",
      "Send the wedding venue outreach kit to those 10 venues by 2026-05-19.",
      "Hold three venue conversations by 2026-06-02 - regardless of remaining polish.",
    ],
    risks: [
      "Polish-cowardice - Sprint 1 + Sprint 2 cycles can absorb every available hour unless the pilot deadline holds.",
      "If the 2026-05-15 venue list gate slips, the wedge has a research/sourcing problem, not a polish problem - and shipping more product will not fix it.",
      "Three weeks is on the soft side. If 2026-06-02 is hit cleanly with no learning, the next cycle's deadline tightens to one week to test pitch sharpness honestly.",
    ],
    nextActions: [
      "Compile 10 named Irish venues by Friday 2026-05-15 - coordinator name, email, and one specific reason this venue (not 'wedding venues in Cork').",
      "Send 2 outreach kits/day, 5 weekdays, starting 2026-05-19 - use signal-growth/outbound/wedding-venue-outreach-kit.md verbatim.",
      "Book three venue conversations by 2026-06-02 - calendar invites accepted, not just replies received.",
      "Monday 2026-05-18 11:00 - design-system session with Claude Design. Working session for the new suite-wide design system; output goes in studio/docs/. Hard time-box so it doesn't absorb venue-list slippage.",
    ],
  },
  products: [],
  ecosystemFlows: [],
  collaborationLoop: [],
  sharedObjects: [],
  accessRoles: [],
  collaboratorFirstView: [],
  shareableArtifacts: [],
  features: [],
  launchReadiness: [],
  segments: [],
  campaigns: [],
  prospects: [
    {
      id: "sample-venue-1",
      organisation: "Sample country house venue",
      segment: "Wedding venues / hotels",
      contactName: "",
      role: "Wedding coordinator",
      email: "",
      website: "",
      location: "Ireland",
      source: "Starter sample",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-14",
      personalisationNote: "Replace with a real venue after list building.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "Use this row as the shape for real prospects.",
    },
  ],
  contentItems: [],
  demos: [],
  templates: [],
  pilots: [],
  metrics: [
    {
      id: "workspaces-created",
      name: "Workspaces created",
      category: "Activation",
      value: 0,
      previousValue: 0,
      unit: "count",
      target: 25,
      notes: "Manual until product tracking is added.",
    },
    {
      id: "collaborative-workspaces",
      name: "Workspaces with 2+ users",
      category: "Activation",
      value: 0,
      previousValue: 0,
      unit: "count",
      target: 10,
      notes: "Core validation metric for the collaboration loop.",
    },
    {
      id: "activated-collaborative-workspaces",
      name: "Activated collaborative workspaces",
      category: "Activation",
      value: 0,
      previousValue: 0,
      unit: "count",
      target: 6,
      notes: "Created, real work added, one person invited, return within seven days, and something moved.",
    },
    {
      id: "wedding-loop-views",
      name: "Wedding loop unique views (/weddings)",
      category: "Outreach",
      value: 0,
      previousValue: 0,
      unit: "count",
      target: 30,
      notes: "Weekly count from Vercel Analytics. Target = 30+ in the first 2 weeks of outbound.",
    },
    {
      id: "wedding-demo-clickthrough",
      name: "Wedding demo clickthrough",
      category: "Activation",
      value: 0,
      previousValue: 0,
      unit: "percent",
      target: 30,
      notes: "% of /weddings visitors who load 1+ product demo. Below 30% = page CTAs are weak.",
    },
    {
      id: "venue-outreach-reply-rate",
      name: "Venue outreach reply rate",
      category: "Outreach",
      value: 0,
      previousValue: 0,
      unit: "percent",
      target: 30,
      notes: "Manual tracking from HQ Outbound CRM. Target = 3 of 10 venues reply within 7 days.",
    },
    {
      id: "venue-pilots-active",
      name: "Active venue pilots",
      category: "Activation",
      value: 0,
      previousValue: 0,
      unit: "count",
      target: 3,
      notes: "Founding Venue Programme participants. Target = 3 within 30 days of first outreach.",
    },
    {
      id: "new-workspace-creators",
      name: "New workspace creators",
      category: "Activation",
      value: 0,
      previousValue: 0,
      unit: "count",
      target: 3,
      notes: "People who first encountered Signal through another workspace or shareable output.",
    },
    {
      id: "outreach-sent",
      name: "Outreach emails sent",
      category: "Outreach",
      value: 0,
      previousValue: 0,
      unit: "count",
      target: 100,
      notes: "Personalised only.",
    },
    {
      id: "reply-rate",
      name: "Reply rate",
      category: "Outreach",
      value: 0,
      previousValue: 0,
      unit: "percent",
      target: 10,
      notes: "Replies divided by contacted prospects.",
    },
    {
      id: "demo-requests",
      name: "Demo requests",
      category: "Outreach",
      value: 0,
      previousValue: 0,
      unit: "count",
      target: 5,
      notes: "Early proof that the wedge message lands.",
    },
    {
      id: "content-published",
      name: "Content published",
      category: "Content",
      value: 0,
      previousValue: 0,
      unit: "count",
      target: 12,
      notes: "Quality over volume.",
    },
    {
      id: "template-downloads",
      name: "Template downloads",
      category: "Content",
      value: 0,
      previousValue: 0,
      unit: "count",
      target: 50,
      notes: "Will matter once public templates exist.",
    },
    {
      id: "revenue",
      name: "Revenue",
      category: "Revenue",
      value: 0,
      previousValue: 0,
      unit: "eur",
      target: 1000,
      notes: "Not the first validation metric.",
    },
  ],
  decisions: [],
  feedback: [
    {
      id: "feedback-demo-gap",
      source: "Internal review",
      segment: "All",
      productArea: "Marketing",
      type: "Positioning",
      rawFeedback: "The strategy is strong, but proof assets are behind product polish.",
      insight: "Demo assets need to catch up with product development.",
      frequency: 3,
      severity: "High",
      status: "Triaged",
      relatedFeature: "Demo Library",
      notes: "Treat demos as activation infrastructure.",
    },
    {
      id: "feedback-abstract",
      source: "Internal review",
      segment: "Weddings and events",
      productArea: "Messaging",
      type: "Confusion",
      rawFeedback: "Work clarity can sound abstract without a concrete use case.",
      insight: "Wedge pages need real scenes, not category claims.",
      frequency: 3,
      severity: "Medium",
      status: "Triaged",
      relatedFeature: "Signal Weddings landing page",
      notes: "Lead with a venue meeting, a couple timeline, and supplier follow-up.",
    },
  ],
  risks: [],
  weeklyRhythm: [
    { id: "mon-list", day: "Monday", action: "Build prospect list.", checked: false },
    { id: "mon-post", day: "Monday", action: "Publish one founder or product post.", checked: false },
    { id: "tue-outbound", day: "Tuesday", action: "Send 20 personalised outreach emails.", checked: false },
    { id: "wed-demo", day: "Wednesday", action: "Record or edit one demo clip.", checked: false },
    { id: "thu-followup", day: "Thursday", action: "Follow up with prospects.", checked: false },
    { id: "thu-users", day: "Thursday", action: "Speak to users.", checked: false },
    { id: "fri-metrics", day: "Friday", action: "Review metrics and objections.", checked: false },
    { id: "weekend-improve", day: "Weekend", action: "Improve one landing page, template, or demo.", checked: false },
  ],
  messaging: {
    positioning:
      "Signal Studio is project management for the 80% who don't work in tech. It helps people capture context, organise action, communicate direction, and understand what needs attention without project-management overhead.",
    ecosystemLine:
      "Signal Notes captures context. Signal Tasks organises action. Signal Roadmap communicates direction. Signal Analytics finds what needs attention.",
    founderStory:
      "I am a PMP and Lean Six Sigma Black Belt, and even I think most project-management software has become unnecessarily confusing. Signal Studio keeps the discipline of good project work while removing the jargon, overhead, and translation layer.",
    hooks: [
      "No Jira translator required.",
      "Project clarity without project-management theatre.",
      "Group projects without the group chat mess.",
      "Wedding planning without spreadsheet chaos.",
      "Everything important. Nothing to decode.",
      "Built for people who have actual work to do.",
      "Clear workspaces for real-world coordination.",
      "One workspace clear enough to invite everyone in.",
      "Project Management for the 80% who don't work in tech.",
    ],
    pitches: {
      weddingVenue:
        "Give each couple a clear planning workspace for notes, decisions, tasks, and the timeline you both need to see.",
      weddingPlanner:
        "Keep each wedding's moving parts visible without asking couples or suppliers to learn planning software.",
      student:
        "A shared workspace for group projects that shows who owns what and what happens next.",
      freelancer:
        "A calm client workspace for the work, the notes, and the updates that usually get buried in email.",
    },
    objections: [
      "I already use spreadsheets. Response: keep the spreadsheet where it helps, then use Signal Studio for ownership, decisions, and follow-up.",
      "I do not want another tool. Response: Signal Studio should replace the scattered middle, not add a new layer.",
      "My clients will not use software. Response: they should be able to open a shared page and understand it in under 60 seconds.",
    ],
    ctas: [
      "Ask for a private workspace.",
      "Join the pilot.",
      "See the wedding planning demo.",
      "Use the template.",
    ],
  },
  nextActions: [
    {
      id: "build-weddings-page",
      action: "Build Signal Weddings landing page.",
      category: "GTM",
      priority: "High",
      dueDate: "2026-05-15",
      status: "Done",
      relatedObject: "Founding Venue Programme",
      notes: "`/weddings` now exists and is connected from wedding shared-update CTAs.",
    },
    {
      id: "venue-offer-page",
      action: "Create Founding Venue Programme offer page.",
      category: "Partnerships",
      priority: "High",
      dueDate: "2026-05-15",
      status: "To do",
      relatedObject: "Founding Venue Programme",
      notes: "Include what they get, what Signal Studio asks for, and the feedback cadence.",
    },
    {
      id: "demo-workspace",
      action: "Build first wedding demo workspace.",
      category: "Product",
      priority: "High",
      dueDate: "2026-05-13",
      status: "Done",
      relatedObject: "Wedding planning workspace",
      notes: "The Tasks starter template and Roadmap shared update now exist. Next cycle should add the Notes follow-up and Today Signal examples.",
    },
    {
      id: "shared-update-demo-path",
      action: "Use the Roadmap shared update page in the first collaboration demo.",
      category: "GTM",
      priority: "High",
      dueDate: "2026-05-14",
      status: "Done",
      relatedObject: "Shared roadmap update",
      notes: "`/wedding-planning/update` now routes viewers to `/weddings` through the shared-output CTA.",
    },
    {
      id: "collaboration-loop-spec",
      action: "Write collaboration loop product spec.",
      category: "Product",
      priority: "High",
      dueDate: "2026-05-14",
      status: "To do",
      relatedObject: "Collaboration Loop",
      notes: "Cover invite path, guest value, shared outputs, tracking, and public/private controls.",
    },
    {
      id: "shared-object-model",
      action: "Define shared object model across all four products.",
      category: "Product",
      priority: "High",
      dueDate: "2026-05-17",
      status: "Doing",
      relatedObject: "Workspace, Person, Decision, Risk, Update, Briefing",
      notes: "Cycle 1 has started with product-specific collaboration contracts in each repo.",
    },
    {
      id: "notes-extract-permissions",
      action: "Define Notes extract-level permission contract.",
      category: "Product",
      priority: "High",
      dueDate: "2026-05-16",
      status: "To do",
      relatedObject: "Signal Notes privacy boundary",
      notes: "Specify how approved actions, decisions, risks, and summaries can leave Notes while raw note bodies remain private.",
    },
    {
      id: "product-collab-contracts",
      action: "Add collaboration loop contracts to product repos.",
      category: "Operations",
      priority: "High",
      dueDate: "2026-05-11",
      status: "Done",
      relatedObject: "Tasks, Roadmap, Analytics, Notes",
      notes: "Each product now has a role-specific collaboration-loop doc and agent pointer.",
    },
    {
      id: "collaborator-first-view",
      action: "Design collaborator first view for a shared workspace.",
      category: "GTM",
      priority: "High",
      dueDate: "2026-05-18",
      status: "To do",
      relatedObject: "Founding Venue Programme",
      notes: "A venue, couple, or supplier should understand what matters before creating anything.",
    },
    {
      id: "demo-script",
      action: "Write 60-second Signal Weddings demo script.",
      category: "Content",
      priority: "High",
      dueDate: "2026-05-14",
      status: "To do",
      relatedObject: "Signal Studio for Weddings",
      notes: "One scene, one loop, one CTA.",
    },
    {
      id: "prospect-list",
      action: "Build list of 100 wedding venues and planners.",
      category: "Outbound",
      priority: "High",
      dueDate: "2026-05-21",
      status: "To do",
      relatedObject: "Outbound CRM",
      notes: "Start with Ireland. Capture source and personalisation notes.",
    },
    {
      id: "email-variants",
      action: "Draft first 3 outbound email variants.",
      category: "Outbound",
      priority: "High",
      dueDate: "2026-05-16",
      status: "To do",
      relatedObject: "Founding Venue Programme",
      notes: "Venue, planner, and couple-facing version.",
    },
    {
      id: "pilot-block-clerk-webhook-rotate",
      action: "Rotate CLERK_WEBHOOK_SIGNING_SECRET on Tasks (Vercel prod).",
      category: "Operations",
      priority: "High",
      dueDate: "2026-05-14",
      status: "To do",
      relatedObject: "Cycle 8.5 — Lamb's Hill send",
      notes: "Per CYCLE_8_5_HANDOFF.md §Operator action #1. Clerk dashboard → endpoint → roll secret → `vercel env rm` + `add CLERK_WEBHOOK_SIGNING_SECRET production --sensitive` → redeploy if needed. Blocks send to Sinéad. Without it, new sign-ups get a Clerk session but no users/workspaces row — fallback provisioner now covers it, but webhook is the long-term fix.",
    },
    {
      id: "pilot-block-incognito-walk",
      action: "Walk one redemption end-to-end in incognito.",
      category: "Operations",
      priority: "High",
      dueDate: "2026-05-14",
      status: "To do",
      relatedObject: "Cycle 8.5 — Lamb's Hill send",
      notes: "Per CYCLE_8_5_HANDOFF.md §Operator action #2. Use one of the 3 seeded LAMBSHIL test codes (MP93X, 7U2DF, M52XX) — not Sinéad's batch. Verify: /redeem/CODE → Clerk sign-up with venue strip → return to /redeem → /app/board?welcome=venue&v=lambs-hill → rose result card. Last failed walk surfaced 3 defects beneath the bridge 500 — don't ship without re-walking.",
    },
    {
      id: "pilot-block-dkim-finalize",
      action: "Finalise DKIM generation in Google Workspace Admin Console.",
      category: "Operations",
      priority: "High",
      dueDate: "2026-05-14",
      status: "To do",
      relatedObject: "Cycle 8.5 — Lamb's Hill send",
      notes: "Per project_email memory. Domain verified, alias added, DKIM still pending. Ethan generates the key in Admin Console; agent adds the DNS record via Vercel API. Without DKIM, hello@signalstudio.ie deliverability to Sinéad is at risk.",
    },
    {
      id: "pilot-block-operator-test-send",
      action: "Test-send Sinéad email template to operator inbox.",
      category: "Operations",
      priority: "High",
      dueDate: "2026-05-14",
      status: "To do",
      relatedObject: "Cycle 8.5 — Lamb's Hill send",
      notes: "Draft staged at signal-growth/outbound/lambs-hill-pilot-send.md (uncommitted, awaiting Ethan voice rewrite). Send to operator inbox first — verify deliverability (DKIM active), CSV attachment formatting, all 10 LAMBSHIL codes correctly listed, subject line renders as intended. Only after this passes: send to Sinéad.",
    },
    {
      id: "design-system-claude-design-monday",
      action: "Suite design-system session with Claude Design (Monday 2026-05-18 · 11:00).",
      category: "Product",
      priority: "High",
      dueDate: "2026-05-18",
      status: "To do",
      relatedObject: "Suite design system",
      notes: "Working session with Claude Design at 11:00 on Monday 2026-05-18 to design the new suite-wide design system. Holds the visual + interaction primitives that Studio, Tasks, Roadmap, Analytics, and Notes share (typographic scale, colour tokens, spacing rhythm, motion register, component primitives). Owner-led; agent prep is read BRAND.md §4 + the four product surfaces beforehand. Output target: a written spec in studio/docs/ that the four products import from, replacing the per-product token drift accumulating today.",
    },
    {
      id: "verify-analytics-cron",
      action: "Verify the Analytics daily-briefing cron is actually firing in Vercel logs.",
      category: "Operations",
      priority: "High",
      dueDate: "2026-05-14",
      status: "To do",
      relatedObject: "Signal Analytics",
      notes: "Phase C closing assumed the cron fires at 06:00 UTC daily but nobody's checked the log timestamps recently. The Suite Review pass added idempotency (lastSentAt cutoff) and concurrency, but neither matters if the cron is silently 405ing or never being dispatched. Operator opens Vercel dashboard → analytics project → Logs, filters for /api/cron/briefings, confirms a daily 06:00 UTC entry exists. If missing, the cron config in vercel.json needs investigation.",
    },
    {
      id: "set-partner-stats-secret",
      action: "Set PARTNER_STATS_SECRET on Studio + Tasks Vercel projects (same value both sides).",
      category: "Operations",
      priority: "Medium",
      dueDate: "2026-05-14",
      status: "To do",
      relatedObject: "/hq/partners cross-product roll-up",
      notes: "The Suite Review pass replaced Studio's direct libSQL read of Tasks tables with an HTTP endpoint at tasks.signalstudio.ie/api/internal/partner-stats. Both sides need PARTNER_STATS_SECRET set to the same value. Until it lands, /hq/partners stays loadable but Tasks-side stats render as zeros (with console.warn). Generate one strong secret, paste on both Vercel projects, redeploy.",
    },
  ],
  growthWorkflow: [],
};
