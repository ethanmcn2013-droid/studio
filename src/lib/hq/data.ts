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
  | "Backlog"
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
  updatedAt: "2026-05-11T19:25:00Z",
  focus: {
    stage: "Pre-launch",
    weekOf: "2026-05-11",
    theme: "Sprint 1 · close the product-readiness gap before any marketing.",
    focus:
      "Cycle 9.1 (Next.js scaffold) and 9.2 (server persistence + auth) both shipped today. Notes now has real Turso-backed storage, suite-wide Clerk auth wired, sign-in/sign-up routes, and the locked notebook surface from PRODUCT.md. Final gating: owner adds the existing suite-wide Clerk keys to the notes Vercel project; then /app and /sign-in go live.",
    priorities: [
      "Owner: copy NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY + CLERK_SECRET_KEY from another product's Vercel env to notes' Vercel env.",
      "Cycle 9.3: visual polish on the notebook + first-sign-in onboarding empty state.",
      "Cycle 9.4: Turso FTS5 search + cross-product promote-to-tasks API.",
    ],
    risks: [
      "/app and /sign-in return 5xx until Clerk env vars are on notes Vercel — homepage + wedding-planning still serve cleanly so the public surface is unaffected.",
      "Sprint 1 still has 9.3-9.5 to land before Sprint 2 (Analytics live briefing) is the right move.",
      "Cycle 8 outreach assets remain parked in signal-growth/outbound — useful when marketing reopens, dead weight if rushed back into.",
    ],
    nextActions: [
      "Owner: drop Clerk env vars on notes Vercel → /app and /sign-in unlock.",
      "Sign in once on notes.signalstudio.ie to verify end-to-end capture flow.",
      "Then Cycle 9.3 begins.",
    ],
  },
  products: [
    {
      id: "tasks",
      name: "Signal Tasks",
      layer: "Execution",
      role: "What needs doing, who owns it, when it matters, and what is stuck.",
      maturity: 78,
      status: "Private preview",
      uxPolish: 76,
      integrationScore: 42,
      launchReadiness: 72,
      majorFeatures: ["Workspace", "task list", "views", "auth", "persistence", "audience pages"],
      blockers: ["Cross-product object links are not yet visible."],
      notes: "The execution layer is the strongest current product surface.",
      nextActions: ["Define task health states.", "Design Focus view.", "Connect decisions to tasks."],
    },
    {
      id: "roadmap",
      name: "Signal Roadmap",
      layer: "Direction",
      role: "Where the work is going, what changed, and what people should expect.",
      maturity: 66,
      status: "Private preview",
      uxPolish: 67,
      integrationScore: 34,
      launchReadiness: 62,
      majorFeatures: ["Workspace creation", "editor", "public viewer", "shared update page", "milestones"],
      blockers: ["Confidence and change history need a sharper model."],
      notes: "Roadmap now owns the first built shareable artefact in the collaboration growth loop.",
      nextActions: ["Use the shared update in the wedding demo.", "Link roadmap items to decisions.", "Add richer change history."],
    },
    {
      id: "analytics",
      name: "Signal Analytics",
      layer: "Attention",
      role: "What needs focus before it becomes a problem.",
      maturity: 62,
      status: "Private preview",
      uxPolish: 58,
      integrationScore: 48,
      launchReadiness: 52,
      majorFeatures: ["Briefing engine", "daily email path", "Tasks read model", "signal cards"],
      blockers: ["Claims must stay tied to what the private preview proves."],
      notes: "The clearest signature format is the briefing, not a conventional dashboard.",
      nextActions: ["Name the universal briefing pattern.", "Connect risk signals to HQ data.", "Audit demo-vs-reality claims."],
    },
    {
      id: "notes",
      name: "Signal Notes",
      layer: "Context",
      role: "What was said, decided, learned, captured, and turned into work.",
      maturity: 60,
      status: "Private build",
      uxPolish: 52,
      integrationScore: 32,
      launchReadiness: 52,
      majorFeatures: ["Next.js 16 scaffold", "notebook surface (capture + stream)", "Turso + Drizzle server persistence", "Clerk auth + suite-wide account", "sign-in/sign-up routes", "wordmark gesture", "anti-feature register", "homepage", "wedding planning demo"],
      blockers: ["Clerk env vars not yet set on notes Vercel (owner action) — /app and /sign-in 5xx until added.", "No search yet (FTS5 in Cycle 9.4).", "Promote-to-tasks is a UI stub (Cycle 9.4 wires the cross-product API)."],
      notes: "Sprint 1 · Cycle 9.2 shipped: Turso DB provisioned, Drizzle schema + indexes pushed, server actions (create/list/delete) with optimistic UI, Clerk middleware (proxy.ts) with graceful dev bypass, sign-in/sign-up routes, /app gated. Suite-wide Clerk decision locked. Gated on owner adding CLERK_SECRET_KEY + NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to notes Vercel project.",
      nextActions: ["Owner: add Clerk env vars from any other product's Vercel project, redeploy.", "Cycle 9.3: visual polish + empty states + first-sign-in onboarding.", "Cycle 9.4: FTS5 search + cross-product promote-to-tasks API endpoint."],
    },
  ],
  ecosystemFlows: [
    {
      id: "notes-tasks",
      from: "Signal Notes",
      to: "Signal Tasks",
      purpose: "Turn approved actions into owned work.",
      status: "Planned",
      health: "Needs attention",
      nextAction: "Design user-approved action extraction.",
    },
    {
      id: "tasks-roadmap",
      from: "Signal Tasks",
      to: "Signal Roadmap",
      purpose: "Roll execution into milestones and phases.",
      status: "Planned",
      health: "Needs attention",
      nextAction: "Define the task-to-milestone link.",
    },
    {
      id: "roadmap-analytics",
      from: "Signal Roadmap",
      to: "Signal Analytics",
      purpose: "Surface roadmap risk from movement and confidence changes.",
      status: "Not started",
      health: "At risk",
      nextAction: "Track confidence changes as events.",
    },
    {
      id: "analytics-tasks",
      from: "Signal Analytics",
      to: "Signal Tasks",
      purpose: "Turn attention signals into review tasks.",
      status: "Planned",
      health: "Needs attention",
      nextAction: "Create a manual signal-to-task approval action.",
    },
    {
      id: "decisions-roadmap",
      from: "Decisions",
      to: "Signal Roadmap",
      purpose: "Explain why direction changed.",
      status: "Not started",
      health: "Needs attention",
      nextAction: "Make decisions a shared object.",
    },
    {
      id: "workspace-briefing",
      from: "Tasks / Roadmap / Notes",
      to: "Workspace Briefing",
      purpose: "Show the state of work in under 60 seconds.",
      status: "Planned",
      health: "Needs attention",
      nextAction: "Create the first Today Signal model.",
    },
  ],
  collaborationLoop: [
    {
      id: "workspace-created",
      step: "Workspace created",
      purpose: "A workspace creator starts from a useful template, not a blank project-management shell.",
      productOwner: "Signal Studio",
      status: "Built",
      readiness: 58,
      growthSurface: "Template landing page and wedge onboarding",
      nextAction: "Connect the wedding template to Roadmap shared updates, Notes follow-ups, and Analytics briefings.",
      metric: "Workspaces created",
    },
    {
      id: "collaborators-invited",
      step: "Collaborators invited",
      purpose: "The creator brings a coordinator, couple, supplier, client, or teammate into the work.",
      productOwner: "Signal Tasks",
      status: "Planned",
      readiness: 28,
      growthSurface: "Invite email, guest access, and shared workspace preview",
      nextAction: "Use Cycle 2 role model to design the minimum safe invite path.",
      metric: "Workspaces with 2+ users",
    },
    {
      id: "work-becomes-clearer",
      step: "Work becomes clearer",
      purpose: "The invited person immediately understands ownership, dates, decisions, direction, and what needs attention.",
      productOwner: "All products",
      status: "In Progress",
      readiness: 36,
      growthSurface: "Workspace briefing, roadmap view, checklist, decision summary",
      nextAction: "Use the new product collaboration contracts to design the wedding demo scene.",
      metric: "Activated collaborative workspaces",
    },
    {
      id: "shareable-output-created",
      step: "Shareable output created",
      purpose: "The workspace produces a roadmap, update, checklist, decision summary, or briefing that travels outside the app.",
      productOwner: "Signal Roadmap",
      status: "Built",
      readiness: 58,
      growthSurface: "Public roadmap, shared update page, planning update, decision summary, template page",
      nextAction: "Use `/[workspace]/update` in the first wedding/events demo and add view-to-creator tracking.",
      metric: "Shared update views and new workspace creators",
    },
    {
      id: "new-creator-discovered",
      step: "New creator discovered",
      purpose: "A collaborator or viewer sees enough value to create their own workspace.",
      productOwner: "Signal Growth Studio",
      status: "Idea",
      readiness: 16,
      growthSurface: "Tasteful Created with Signal Studio links and duplication CTAs",
      nextAction: "Define source tracking fields for invite links and shareable artefacts.",
      metric: "New workspace creators",
    },
  ],
  sharedObjects: [
    {
      id: "workspace",
      object: "Workspace",
      definition: "The shared place where one real piece of work lives across context, execution, direction, and attention.",
      usedBy: ["Tasks", "Roadmap", "Analytics", "Notes"],
      status: "Defined",
      nextAction: "Use the product repo collaboration docs as the baseline for implementation.",
    },
    {
      id: "person",
      object: "Person",
      definition: "Someone connected to the work: owner, collaborator, sponsor, guest, supplier, client, or partner.",
      usedBy: ["Tasks", "Roadmap", "Notes", "CRM"],
      status: "Needs model",
      nextAction: "Define creator, collaborator, guest, supplier, client, and viewer permissions.",
    },
    {
      id: "decision",
      object: "Decision",
      definition: "A dated choice with reason, owner, linked work, and review point.",
      usedBy: ["Notes", "Roadmap", "Tasks", "Analytics", "HQ"],
      status: "Needs model",
      nextAction: "Add decision object schema and the first manual decision-log flow.",
    },
    {
      id: "risk",
      object: "Risk",
      definition: "Something that could affect delivery, direction, attention, or trust if ignored.",
      usedBy: ["Analytics", "Roadmap", "Tasks", "Notes", "HQ"],
      status: "Needs model",
      nextAction: "Unify task blockers and roadmap risk language.",
    },
    {
      id: "update",
      object: "Update",
      definition: "A meaningful change that can feed activity, changelog, briefing, analytics, and shared update summaries.",
      usedBy: ["Tasks", "Roadmap", "Analytics", "Notes", "HQ"],
      status: "Needs model",
      nextAction: "Define the event stream before adding more cross-product features.",
    },
    {
      id: "briefing",
      object: "Workspace briefing",
      definition: "The plain-language state of work: what changed, what is stuck, what is next, and what needs attention.",
      usedBy: ["Analytics", "Tasks", "Roadmap", "Notes"],
      status: "Partly working",
      nextAction: "Name and implement the first Today Signal proof in the wedding demo.",
    },
    {
      id: "shareable-output",
      object: "Shareable output",
      definition: "A roadmap, update, checklist, decision summary, template, or briefing that can be safely shared outside the creator account.",
      usedBy: ["Roadmap", "Notes", "Analytics", "Growth Studio"],
      status: "Partly working",
      nextAction: "Use Roadmap's shared update page as the proof path, then add owner controls and view tracking.",
    },
  ],
  accessRoles: [
    {
      id: "creator",
      role: "Creator",
      plainName: "Workspace creator",
      purpose: "Starts the workspace, invites people, controls sharing, and owns the working rhythm.",
      defaultAccess: "Full workspace control.",
      canDo: ["Create and edit work", "Invite people", "Share outputs", "Export data", "Change visibility"],
      cannotDo: ["Bypass trust controls", "Publish private notes without choosing to share"],
      status: "Draft",
      nextAction: "Confirm whether venue coordinators and planners share the same creator permissions.",
    },
    {
      id: "collaborator",
      role: "Collaborator",
      plainName: "Invited collaborator",
      purpose: "Does real work in the workspace without needing setup or admin decisions.",
      defaultAccess: "Can see the workspace and update assigned or shared work.",
      canDo: ["View the first-view summary", "Update assigned tasks", "Comment or reply", "Mark work done"],
      cannotDo: ["Change sharing settings", "Invite new people by default", "Delete the workspace"],
      status: "Draft",
      nextAction: "Decide whether collaborators can create tasks in the first wedding workspace.",
    },
    {
      id: "guest",
      role: "Guest",
      plainName: "Guest",
      purpose: "Receives a clear page, checklist, roadmap, or briefing without becoming a full user first.",
      defaultAccess: "Can view selected shared outputs.",
      canDo: ["Open shared outputs", "See what matters", "Respond through a controlled action"],
      cannotDo: ["Browse private workspace areas", "See unrelated notes", "Change work state"],
      status: "Needs design",
      nextAction: "Design guest view before exposing public/private controls.",
    },
    {
      id: "client-supplier",
      role: "Client or supplier",
      plainName: "Client / supplier",
      purpose: "Understands what is needed from them in a real-world coordination flow.",
      defaultAccess: "Focused access to relevant tasks, decisions, follow-ups, or planning updates.",
      canDo: ["View relevant follow-ups", "Confirm information", "Reply to a question"],
      cannotDo: ["See internal planning notes", "View unrelated people or projects"],
      status: "Draft",
      nextAction: "Use wedding suppliers as the first acceptance test.",
    },
    {
      id: "viewer",
      role: "Viewer",
      plainName: "Viewer",
      purpose: "Sees a public or owner-controlled artefact and can discover Signal Studio.",
      defaultAccess: "Read-only access to a specific output.",
      canDo: ["Read a public roadmap or update", "Use a template link", "Request a workspace"],
      cannotDo: ["See private workspace data", "Interact with hidden work"],
      status: "Draft",
      nextAction: "Define Created with Signal Studio placement and source tracking.",
    },
  ],
  collaboratorFirstView: [
    {
      id: "what-matters",
      section: "What matters now",
      question: "What needs my attention?",
      sourceProduct: "Signal Analytics",
      purpose: "Show the short plain-language briefing before any list or board.",
      status: "Draft",
      nextAction: "Design the first Today Signal block for a wedding workspace.",
    },
    {
      id: "my-work",
      section: "My work",
      question: "What do I own?",
      sourceProduct: "Signal Tasks",
      purpose: "Show assigned actions, due dates, and waiting-on states.",
      status: "Draft",
      nextAction: "Define the assigned-task card for invited collaborators.",
    },
    {
      id: "what-changed",
      section: "What changed",
      question: "What moved since I last looked?",
      sourceProduct: "Signal Roadmap / Updates",
      purpose: "Make plan movement visible without asking people to inspect every item.",
      status: "Needs design",
      nextAction: "Define the minimum event list needed for the first view.",
    },
    {
      id: "what-decided",
      section: "What was decided",
      question: "What did we agree?",
      sourceProduct: "Signal Notes",
      purpose: "Surface decisions and unresolved questions from meeting context.",
      status: "Draft",
      nextAction: "Use venue meeting notes as the first decision-summary scene.",
    },
    {
      id: "where-going",
      section: "Where this is going",
      question: "What happens next?",
      sourceProduct: "Signal Roadmap",
      purpose: "Show next milestone, confidence, and next visible step.",
      status: "Draft",
      nextAction: "Map wedding phases into Now / Next / Later.",
    },
  ],
  shareableArtifacts: [
    {
      id: "shared-roadmap-update",
      name: "Shared roadmap update",
      wedge: "All, starting with weddings and events",
      ownerProduct: "Signal Roadmap",
      purpose: "Give viewers a short state-of-work page before asking them to open the full roadmap.",
      defaultVisibility: "Public",
      sourceTracking: "source=roadmap_share, segment=weddings, role=viewer, artefact=shared_update",
      cta: "See Signal Studio",
      status: "Built",
      nextAction: "Use `/tasks/update` as the first proof, then shape the wedding/events version.",
    },
    {
      id: "wedding-planning-shared-update",
      name: "Wedding planning shared update",
      wedge: "Weddings and events",
      ownerProduct: "Signal Roadmap",
      purpose: "Show a venue, couple, planner, or supplier the state of a wedding plan in under 60 seconds.",
      defaultVisibility: "Public",
      sourceTracking: "source=roadmap_share, segment=weddings, role=viewer, campaign=founding_venue, artefact=shared_update",
      cta: "See Signal Studio",
      status: "Built",
      nextAction: "Use `/wedding-planning/update` in the wedding demo script and venue outreach.",
    },
    {
      id: "wedding-planning-venue-meeting-note",
      name: "Wedding venue meeting note",
      wedge: "Weddings and events",
      ownerProduct: "Signal Notes",
      purpose: "Show how a real venue meeting note becomes tasks, decisions, open questions, and a shareable follow-up — without auto-detection.",
      defaultVisibility: "Public",
      sourceTracking: "source=studio_weddings, segment=weddings, role=creator, campaign=founding_venue, artefact=notes_demo",
      cta: "See the full wedding workspace",
      status: "Built",
      nextAction: "Use the Notes demo in venue outreach as proof of the context-to-work moment.",
    },
    {
      id: "wedding-planning-daily-briefing",
      name: "Wedding planning daily briefing",
      wedge: "Weddings and events",
      ownerProduct: "Signal Analytics",
      purpose: "Show what a daily briefing for a real wedding workspace looks like four weeks out — needs attention, moving well, quiet risks, suggested focus.",
      defaultVisibility: "Public",
      sourceTracking: "source=studio_weddings, segment=weddings, role=creator, campaign=founding_venue, artefact=analytics_demo",
      cta: "See the rest of the loop",
      status: "Built",
      nextAction: "The /app live briefing product does not exist yet — note this is a static artefact, and decide whether to build the product or keep the marketing-only proof.",
    },
    {
      id: "planning-roadmap",
      name: "Planning roadmap",
      wedge: "Weddings and events",
      ownerProduct: "Signal Roadmap",
      purpose: "Give couples, venues, and planners a clear direction page.",
      defaultVisibility: "Owner controlled",
      sourceTracking: "source=roadmap_share, segment=weddings, role=viewer",
      cta: "Use this planning workspace",
      status: "Draft",
      nextAction: "Define public/private copy and Created with Signal Studio placement.",
    },
    {
      id: "venue-meeting-followup",
      name: "Venue meeting follow-up",
      wedge: "Weddings and events",
      ownerProduct: "Signal Notes",
      purpose: "Turn a meeting into actions, decisions, open questions, and a short shareable summary.",
      defaultVisibility: "Private",
      sourceTracking: "source=note_followup, segment=weddings, role=guest",
      cta: "Open the follow-up",
      status: "Draft",
      nextAction: "Write the first follow-up template from a sample venue meeting.",
    },
    {
      id: "today-signal-briefing",
      name: "Today Signal briefing",
      wedge: "Weddings and events",
      ownerProduct: "Signal Analytics",
      purpose: "Show what needs attention without sending a dashboard.",
      defaultVisibility: "Owner controlled",
      sourceTracking: "source=briefing_share, segment=weddings, role=collaborator",
      cta: "See what needs attention",
      status: "Needs design",
      nextAction: "Decide which signals are safe to share with guests.",
    },
  ],
  features: [
    {
      id: "focus-view",
      name: "Focus view",
      product: "Signal Tasks",
      type: "Core",
      status: "Planned",
      priority: "High",
      effort: "Medium",
      impact: "High",
      owner: "Ethan",
      relatedCampaign: "Founder LinkedIn Build-in-Public",
      relatedMetric: "Activated collaborative workspaces",
      principleAlignment: 95,
      notes: "Shows the few things that matter now.",
    },
    {
      id: "decision-object",
      name: "Shared decision object",
      product: "Signal Studio",
      type: "Integration",
      status: "Planned",
      priority: "High",
      effort: "Large",
      impact: "High",
      owner: "Ethan",
      relatedCampaign: "Template Library Launch",
      relatedMetric: "Workspaces with notes created",
      principleAlignment: 92,
      notes: "Connects Notes, Roadmap, Tasks, and HQ.",
    },
    {
      id: "today-signal",
      name: "Today Signal briefing",
      product: "Signal Analytics",
      type: "Integration",
      status: "Planned",
      priority: "High",
      effort: "Large",
      impact: "High",
      owner: "Ethan",
      relatedCampaign: "Public Roadmap Content Campaign",
      relatedMetric: "Weekly active workspaces",
      principleAlignment: 96,
      notes: "The ecosystem's daily state of work.",
    },
    {
      id: "roadmap-public-pages",
      name: "Shareable roadmap pages",
      product: "Signal Roadmap",
      type: "Growth",
      status: "Built",
      priority: "High",
      effort: "Medium",
      impact: "High",
      owner: "Ethan",
      relatedCampaign: "Founding Venue Programme",
      relatedMetric: "Template downloads",
      principleAlignment: 88,
      notes: "Make plans easy to share without creating accounts first.",
    },
    {
      id: "roadmap-shared-update",
      name: "Shared roadmap update page",
      product: "Signal Roadmap",
      type: "Growth",
      status: "Built",
      priority: "High",
      effort: "Medium",
      impact: "High",
      owner: "Ethan",
      relatedCampaign: "Collaboration Proof Campaign",
      relatedMetric: "New workspace creators",
      principleAlignment: 94,
      notes: "First built shareable artefact: a short read-only update at `/[workspace]/update` with source fields, Created with Signal Studio, and bundled demo fallback for preview reliability.",
    },
    {
      id: "notes-decisions",
      name: "Decision log from notes",
      product: "Signal Notes",
      type: "Core",
      status: "Idea",
      priority: "High",
      effort: "Medium",
      impact: "High",
      owner: "Ethan",
      relatedCampaign: "Wedding Planner Pilot",
      relatedMetric: "Workspaces with notes created",
      principleAlignment: 94,
      notes: "Keeps why visible after a meeting ends.",
    },
    {
      id: "hq-dashboard",
      name: "Signal HQ dashboard",
      product: "Signal Studio",
      type: "Infrastructure",
      status: "In Progress",
      priority: "High",
      effort: "Medium",
      impact: "High",
      owner: "Ethan",
      relatedCampaign: "Founder LinkedIn Build-in-Public",
      relatedMetric: "Weekly operating rhythm completion",
      principleAlignment: 90,
      notes: "Internal source of truth for product and launch operations.",
    },
    {
      id: "collaboration-invite-loop",
      name: "Collaboration invite loop",
      product: "Signal Studio",
      type: "Growth",
      status: "Planned",
      priority: "High",
      effort: "Large",
      impact: "High",
      owner: "Ethan",
      relatedCampaign: "Founding Venue Programme",
      relatedMetric: "Workspaces with 2+ users",
      principleAlignment: 97,
      notes: "Turns invitations and shared outputs into the organic outreach engine.",
    },
    {
      id: "shareable-briefing",
      name: "Shareable workspace briefing",
      product: "Signal Analytics",
      type: "Integration",
      status: "Idea",
      priority: "High",
      effort: "Medium",
      impact: "High",
      owner: "Ethan",
      relatedCampaign: "Wedding Demo Video Series",
      relatedMetric: "New workspace creators",
      principleAlignment: 96,
      notes: "Gives collaborators and anyone reading along a reason to understand Signal before signing up.",
    },
  ],
  launchReadiness: [
    {
      id: "product-stability",
      category: "Product stability",
      score: 70,
      weight: 10,
      status: "Clear",
      notes: "Core surfaces are in private preview.",
      blockers: [],
      nextAction: "Run product smoke checks across all live surfaces.",
    },
    {
      id: "core-workflows",
      category: "Core workflows",
      score: 63,
      weight: 10,
      status: "Needs attention",
      notes: "Tasks and Roadmap are strongest. Notes needs v1 depth.",
      blockers: ["Notes is not yet a full product."],
      nextAction: "Define the smallest useful Notes to Tasks flow.",
    },
    {
      id: "cross-product-integration",
      category: "Cross-product connection",
      score: 38,
      weight: 12,
      status: "At risk",
      notes: "Roadmap now has the first visible shared-output surface, but shared objects and events still need to become consistent.",
      blockers: ["Shared objects and events are not implemented."],
      nextAction: "Use the shared update page to define the first common Update and Shareable Output model.",
    },
    {
      id: "collaboration-loop",
      category: "Collaboration loop",
      score: 34,
      weight: 10,
      status: "At risk",
      notes: "The first shared output exists in Roadmap. Invitations, guest value, and tracking still need implementation depth.",
      blockers: ["No invite flow, guest path, or view-to-creator tracking yet."],
      nextAction: "Turn `/[workspace]/update` into the first wedding/events demo path.",
    },
    {
      id: "onboarding",
      category: "Onboarding",
      score: 26,
      weight: 8,
      status: "At risk",
      notes: "The first-session path needs segment-specific proof.",
      blockers: ["No wedge onboarding flow yet."],
      nextAction: "Write wedding workspace first-run path.",
    },
    {
      id: "templates",
      category: "Templates",
      score: 38,
      weight: 8,
      status: "Needs attention",
      notes: "The first wedding planning workspace template now exists in Signal Tasks and is linked from `/weddings`.",
      blockers: ["Template usage is not yet attributed back to Studio or shared-output sources."],
      nextAction: "Add source tracking and connect the template to the first Notes/Roadmap/Analytics demo scene.",
    },
    {
      id: "demo-assets",
      category: "Demo assets",
      score: 12,
      weight: 8,
      status: "At risk",
      notes: "Demos are the highest-impact missing proof.",
      blockers: ["No polished wedge demo published."],
      nextAction: "Record Signal Studio for Weddings walkthrough.",
    },
    {
      id: "landing-pages",
      category: "Website and landing pages",
      score: 58,
      weight: 7,
      status: "Needs attention",
      notes: "`/weddings` exists as the first wedge-specific conversion page.",
      blockers: ["No venue-specific offer detail or published demo yet."],
      nextAction: "Add a stronger Founding Venue Programme section after the demo script.",
    },
    {
      id: "messaging",
      category: "Messaging",
      score: 58,
      weight: 7,
      status: "Needs attention",
      notes: "The ecosystem thesis is clear. Wedge copy needs proof.",
      blockers: ["Too much abstract suite language in early GTM."],
      nextAction: "Translate the thesis into wedding venue copy.",
    },
    {
      id: "crm",
      category: "CRM and outbound",
      score: 8,
      weight: 7,
      status: "At risk",
      notes: "Founder-led CRM needs a simple weekly cadence.",
      blockers: ["No prospect list yet."],
      nextAction: "Add first 25 venue and planner prospects.",
    },
    {
      id: "pilots",
      category: "Pilot programmes",
      score: 22,
      weight: 7,
      status: "Needs attention",
      notes: "Pilot offers are clear enough to start drafting.",
      blockers: ["No active participants yet."],
      nextAction: "Write Founding Venue Programme terms.",
    },
    {
      id: "tracking",
      category: "Tracking",
      score: 20,
      weight: 6,
      status: "Needs attention",
      notes: "Manual metrics are enough for V1.",
      blockers: ["Activation metric is not yet instrumented."],
      nextAction: "Define manual activation log in HQ.",
    },
    {
      id: "pricing",
      category: "Pricing readiness",
      score: 16,
      weight: 5,
      status: "Needs attention",
      notes: "Avoid per-seat friction during collaboration validation.",
      blockers: ["No workspace creator plan yet."],
      nextAction: "Sketch creator/studio pricing principles.",
    },
    {
      id: "case-studies",
      category: "Case study readiness",
      score: 4,
      weight: 5,
      status: "At risk",
      notes: "No pilots means no proof stories yet.",
      blockers: ["Need first pilot users."],
      nextAction: "Add feedback ask to pilot offer.",
    },
  ],
  segments: [
    {
      id: "weddings-events",
      segment: "Weddings and events",
      priority: "High",
      painPoint: "Planning lives across spreadsheets, messages, calls, and memory.",
      coreMessage: "A clear workspace for the work behind a wedding.",
      offer: "Founding Venue Programme and planner private beta.",
      acquisitionChannel: "Direct outreach, demos, partner pages, local proof.",
      confidence: 74,
      status: "Validate",
      notes: "Best early wedge because it is visual, deadline-bound, and shareable.",
    },
    {
      id: "students",
      segment: "Students and societies",
      priority: "Medium",
      painPoint: "Group work disappears into chats and late-night catch-up.",
      coreMessage: "Group projects without the group chat mess.",
      offer: "Free semester access for teams and societies.",
      acquisitionChannel: "Templates, campus societies, short demos.",
      confidence: 62,
      status: "Explore",
      notes: "Useful feedback channel, less likely to be the first revenue engine.",
    },
    {
      id: "freelancers",
      segment: "Freelancers and small operators",
      priority: "Medium",
      painPoint: "Client work changes faster than notes and emails can explain.",
      coreMessage: "A client workspace that shows what is happening.",
      offer: "Free beta workspaces for client projects.",
      acquisitionChannel: "Founder content, templates, direct network.",
      confidence: 58,
      status: "Explore",
      notes: "Good expansion path after the first wedge proves activation.",
    },
    {
      id: "consultants-ops",
      segment: "Consultants and operations people",
      priority: "Low",
      painPoint: "They carry the translation layer between messy work and formal updates.",
      coreMessage: "Keep the discipline. Remove the theatre.",
      offer: "Private beta with workspace creator dashboard later.",
      acquisitionChannel: "Case studies and professional referrals.",
      confidence: 51,
      status: "Later",
      notes: "Strong commercial potential, but can pull the product toward enterprise language too early.",
    },
  ],
  campaigns: [
    {
      id: "founding-venue",
      name: "Founding Venue Programme",
      segment: "Wedding venues / hotels",
      goal: "Recruit venues that can create planning workspaces for couples.",
      offer: "Free wedding planning workspaces for every wedding running through their venue, for 12 months. Venue-branded. Founding venue status.",
      status: "Ready for Ethan",
      assetsNeeded: ["60 second demo render (script done)", "feedback form", "venue list"],
      startDate: "2026-05-13",
      endDate: "2026-06-30",
      currentBlocker: "Needs venue list and demo video render. Outreach kit is ready to send.",
      nextStep: "Ethan compiles first 10 Irish venues; sends 2/day weekdays using studio/signal-growth/outbound/wedding-venue-outreach-kit.md.",
      progress: 65,
      relatedContent: "Wedding Venue Outreach Kit (signal-growth/outbound/wedding-venue-outreach-kit.md)",
      relatedLandingPage: "/weddings",
      relatedMetric: "Pilot participants",
    },
    {
      id: "planner-pilot",
      name: "Wedding Planner Pilot",
      segment: "Wedding planners",
      goal: "Validate active planning workflows across three weddings.",
      offer: "Free access for 3 active weddings in exchange for workflow feedback.",
      status: "Backlog",
      assetsNeeded: ["planner pitch", "demo workspace", "pilot terms"],
      startDate: "2026-05-20",
      endDate: "2026-07-15",
      currentBlocker: "Needs first demo workspace and planner-specific pitch.",
      nextStep: "Use the wedding workspace template to create a planner demo and pilot terms.",
      progress: 20,
      relatedContent: "Wedding planning without spreadsheet chaos",
      relatedLandingPage: "/weddings",
      relatedMetric: "Activated collaborative workspaces",
    },
    {
      id: "collaboration-proof",
      name: "Collaboration Proof Campaign",
      segment: "Workspace creators",
      goal: "Prove that one clear workspace can invite others and create new workspace creators.",
      offer: "A polished demo workspace plus shareable planning update and invite flow.",
      status: "Selected",
      assetsNeeded: ["collaboration demo script", "shared briefing mock", "invite email", "source-tracking notes"],
      startDate: "2026-05-12",
      endDate: "2026-06-21",
      currentBlocker: "The collaborator first view is not designed yet.",
      nextStep: "Map the invite-to-activation path for venues and couples.",
      progress: 12,
      relatedContent: "How a shared workspace keeps everyone clear",
      relatedLandingPage: "/weddings",
      relatedMetric: "New workspace creators",
    },
    {
      id: "student-projects",
      name: "Student Group Project Programme",
      segment: "Students / societies",
      goal: "Collect feedback from group work and society event planning.",
      offer: "Free semester access for feedback and a short testimonial if useful.",
      status: "Backlog",
      assetsNeeded: ["student template", "campus post", "short demo"],
      startDate: "2026-06-01",
      endDate: "2026-08-31",
      currentBlocker: "Weddings wedge comes first.",
      nextStep: "Draft student group project template.",
      progress: 5,
      relatedContent: "Group projects without the group chat mess",
      relatedLandingPage: "/students",
      relatedMetric: "Workspaces with 2+ users",
    },
  ],
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
  contentItems: [
    {
      id: "wedding-demo-post",
      title: "How to plan a wedding in Signal Studio",
      pillar: "Use-case demos",
      format: "Long demo",
      channel: "YouTube",
      targetSegment: "Couples / planners / venues",
      status: "Idea",
      dueDate: "2026-05-18",
      cta: "Join the private wedding pilot.",
      relatedCampaign: "Founding Venue Programme",
      relatedMetric: "Demo requests",
      notes: "Show Notes, Tasks, Roadmap, and a briefing as one loop.",
    },
    {
      id: "spreadsheet-chaos",
      title: "Why spreadsheets fall apart for wedding planning",
      pillar: "Problem videos",
      format: "Short video",
      channel: "LinkedIn",
      targetSegment: "Wedding planners",
      status: "Idea",
      dueDate: "2026-05-16",
      cta: "Ask for a private planning workspace.",
      relatedCampaign: "Wedding Planner Pilot",
      relatedMetric: "Replies",
      notes: "Keep it practical. No dunking on people using spreadsheets.",
    },
    {
      id: "no-jira-translator",
      title: "No Jira translator required",
      pillar: "Founder/build-in-public",
      format: "LinkedIn post",
      channel: "LinkedIn",
      targetSegment: "Operators and coordinators",
      status: "Script",
      dueDate: "2026-05-12",
      cta: "Follow the build.",
      relatedCampaign: "Founder LinkedIn Build-in-Public",
      relatedMetric: "Content published",
      notes: "Founder story from PMP and Lean Six Sigma background.",
    },
  ],
  demos: [
    {
      id: "weddings-demo",
      title: "Signal Studio for Weddings",
      audience: "Venues, planners, and couples",
      objective: "Show how one meeting becomes tasks, decisions, a roadmap, and a briefing.",
      scriptStatus: "Planned",
      recordingStatus: "Idea",
      editingStatus: "Idea",
      publishedLink: "",
      cta: "Ask for the private wedding pilot.",
      keyScenes: ["Venue meeting note", "approved actions", "planning roadmap", "Today Signal"],
      voiceoverNotes: "Plain, calm, practical. Show work moving without explaining software.",
      motionNotes: "Use the product surfaces. No abstract animation.",
      relatedProduct: "Signal Studio",
      relatedCampaign: "Founding Venue Programme",
    },
    {
      id: "student-workspace",
      title: "Student group project workspace",
      audience: "Students and societies",
      objective: "Show how shared work stays visible without a noisy chat.",
      scriptStatus: "Idea",
      recordingStatus: "Idea",
      editingStatus: "Idea",
      publishedLink: "",
      cta: "Use the student template.",
      keyScenes: ["Group brief", "owned tasks", "notes from meeting", "weekly plan"],
      voiceoverNotes: "No productivity language. Keep it close to the lived problem.",
      motionNotes: "Simple screen walkthrough.",
      relatedProduct: "Signal Tasks",
      relatedCampaign: "Student Group Project Programme",
    },
  ],
  templates: [
    {
      id: "wedding-workspace",
      name: "Wedding planning workspace",
      targetSegment: "Couples / planners / venues",
      status: "Built",
      useCase: "Coordinate planning, supplier work, decisions, and final-week tasks.",
      includedProducts: ["Tasks", "Notes", "Roadmap", "Analytics"],
      landingPageUrl: "/weddings",
      relatedCampaign: "Founding Venue Programme",
      activationGoal: "Workspace has tasks, notes, roadmap items, and at least one invite.",
      notes: "The Tasks starter template now exists at `/templates/wedding-planning-workspace`; next is connecting Notes, Roadmap, and Analytics around the same scene.",
    },
    {
      id: "venue-checklist",
      name: "Venue walkthrough checklist",
      targetSegment: "Wedding venues / hotels",
      status: "Idea",
      useCase: "Turn venue walkthroughs into decisions, tasks, and follow-ups.",
      includedProducts: ["Tasks", "Notes"],
      landingPageUrl: "",
      relatedCampaign: "Founding Venue Programme",
      activationGoal: "Coordinator captures a real walkthrough and shares follow-ups.",
      notes: "Useful partner artefact.",
    },
    {
      id: "student-project",
      name: "Student group project workspace",
      targetSegment: "Students",
      status: "Idea",
      useCase: "Keep group work visible without relying on chat memory.",
      includedProducts: ["Tasks", "Notes", "Roadmap"],
      landingPageUrl: "",
      relatedCampaign: "Student Group Project Programme",
      activationGoal: "At least two students join and update work within seven days.",
      notes: "Good public template later.",
    },
  ],
  pilots: [
    {
      id: "founding-venue-pilot",
      name: "Founding Venue Programme",
      offer: "20 free wedding planning workspaces.",
      targetParticipants: "Wedding venues and hotels with active wedding coordination.",
      value: "A branded planning workspace for couples and venue coordinators.",
      ask: "Feedback from venue coordinator and participating couples.",
      successCriteria: ["5 venues contacted", "2 venue calls", "1 active venue workspace"],
      currentParticipants: 0,
      feedbackCollected: 0,
      caseStudyPotential: "High",
      status: "Selected",
      relatedProspects: [],
      relatedWorkspaces: [],
    },
    {
      id: "couples-private-beta",
      name: "Couples Private Beta",
      offer: "Free planning workspace during private beta.",
      targetParticipants: "Couples planning weddings in the next 6 to 18 months.",
      value: "A clear place for tasks, notes, decisions, and timeline.",
      ask: "Two feedback calls and permission to quote if happy.",
      successCriteria: ["3 couples onboarded", "2 return within 7 days", "1 testimonial"],
      currentParticipants: 0,
      feedbackCollected: 0,
      caseStudyPotential: "Medium",
      status: "Backlog",
      relatedProspects: [],
      relatedWorkspaces: [],
    },
  ],
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
  decisions: [
    {
      id: "four-products",
      decision: "Keep all four products as one ecosystem.",
      category: "Product",
      date: "2026-05-10",
      reason: "Each product owns one layer of clear work: context, execution, direction, and attention.",
      alternatives: "Lead with Tasks only and defer the rest.",
      risks: "The suite can feel scattered if shared objects and outputs lag behind.",
      reviewDate: "2026-06-10",
      status: "Active",
      relatedObjects: ["Signal Tasks", "Signal Roadmap", "Signal Analytics", "Signal Notes"],
      notes: "The ecosystem is the product.",
    },
    {
      id: "weddings-wedge",
      decision: "Build the initial GTM wedge around weddings and events.",
      category: "GTM",
      date: "2026-05-10",
      reason: "The work is deadline-bound, coordination-heavy, visual, and shareable.",
      alternatives: "Students, freelancers, consultants, general operators.",
      risks: "Wedge copy could make the broader product feel too narrow.",
      reviewDate: "2026-06-03",
      status: "Active",
      relatedObjects: ["Founding Venue Programme", "Wedding Planner Pilot"],
      notes: "Use Ireland for validation, not as the ceiling.",
    },
    {
      id: "build-hq",
      decision: "Build Signal HQ as the internal source of truth.",
      category: "Operations",
      date: "2026-05-10",
      reason: "The founder should manage the company with the same clarity principles the product sells.",
      alternatives: "Keep strategy in scattered docs and chat transcripts.",
      risks: "Dashboard bloat before real use.",
      reviewDate: "2026-05-24",
      status: "Active",
      relatedObjects: ["Signal HQ", "Signal Growth Studio"],
      notes: "V1 should stay local-first and editable.",
    },
    {
      id: "agent-hq-sync",
      decision: "Claude Code and Codex must keep Signal HQ current.",
      category: "Operations",
      date: "2026-05-11",
      reason: "Future coding sessions should not change product, brand, GTM, roadmap, or launch state without updating the internal source of truth.",
      alternatives: "Rely on chat history or memory between tools.",
      risks: "Agents working in sibling repos may miss Studio updates unless the rule is repeated clearly.",
      reviewDate: "2026-05-25",
      status: "Active",
      relatedObjects: ["CLAUDE.md", "CODEX.md", "AGENTS.md", "Signal HQ"],
      notes: "Root shims now point both tools back to the same HQ rule.",
    },
    {
      id: "collaboration-as-growth-loop",
      decision: "Treat collaboration as the organic outreach loop.",
      category: "GTM",
      date: "2026-05-11",
      reason: "The strongest acquisition path is clear shared work that invites collaborators, creates useful outputs, and turns some viewers into workspace creators.",
      alternatives: "Rely mainly on public content, paid ads, or founder-led outbound.",
      risks: "Poor guest experience or unclear public controls could create friction or trust risk.",
      reviewDate: "2026-06-12",
      status: "Active",
      relatedObjects: ["Collaboration Loop", "Workspace invitations", "Shareable outputs", "Founding Venue Programme"],
      notes: "Prioritise invite value, shared artefacts, and source tracking before heavier monetisation.",
    },
    {
      id: "hero-project-management-80",
      decision: "Test the homepage headline: Project Management for the 80% who don't work in tech.",
      category: "Brand",
      date: "2026-05-11",
      reason: "Sharper market language may explain the category faster than the previous poetic line.",
      alternatives: "Keep 'Cut through the noise.' or use 'Work clarity for the 80% who don't work in tech.'",
      risks: "The phrase could pull future copy toward project-management jargon unless treated as a headline test.",
      reviewDate: "2026-05-25",
      status: "Reversed",
      relatedObjects: ["Homepage", "Brand handbook", "Messaging Bank"],
      notes: "Superseded same day by hero-project-management-voice — value-based framing is more on-brand than exclusion-based.",
    },
    {
      id: "hero-project-management-voice",
      decision: "Replace homepage H1 with: Project Management without the project-manager voice.",
      category: "Brand",
      date: "2026-05-11",
      reason: "BRAND.md §2 names this verbatim as a quotable target. Value-based ('what we remove') is stronger than exclusion-based ('who it isn't for'). Same length, same scannability, sharper anti-theatre register.",
      alternatives: "Stay on 'Project management for people not in tech.' or move all the way to 'Cut through the noise.' as H1.",
      risks: "Two H1 changes in 24 hours is brand-churn — relies on this one sticking. Some readers may not have an existing mental model of 'project-manager voice' the way they do of 'tech'.",
      reviewDate: "2026-06-08",
      status: "Active",
      relatedObjects: ["Homepage", "Brand handbook §2", "Messaging Bank"],
      notes: "Ships with a typewriter sub-hero ('Four small tools. Plain English. Built for the 80%.') and a persistent blinking caret — the 'live doc' gesture.",
    },
    {
      id: "cycle-3-shared-update",
      decision: "Build Roadmap's shared update page as the first real shareable artefact.",
      category: "Product",
      date: "2026-05-11",
      reason: "The collaboration growth loop needs a useful output people can forward before invitations, templates, and analytics tracking are fully built.",
      alternatives: "Start with the wedding template, Today Signal briefing, or Notes meeting follow-up.",
      risks: "The page could stay a generic roadmap summary unless it becomes part of the wedding/events demo and carries source tracking.",
      reviewDate: "2026-05-25",
      status: "Active",
      relatedObjects: ["Signal Roadmap", "Shareable outputs", "Collaboration Proof Campaign"],
      notes: "`/[workspace]/update` is the first built artefact. It should lead into wedding-specific sharing and view-to-creator tracking.",
    },
    {
      id: "wedge-weddings-events-confirmed",
      decision: "Lead outbound, demo production, and pilots with the weddings and events wedge through 2026 Q2.",
      category: "GTM",
      date: "2026-05-11",
      reason: "The four-layer wedding loop is now walkable end-to-end (Notes venue meeting, Tasks template, Roadmap shared update, Analytics daily briefing). Wedding workspaces are the strongest workspace-creator shape we can demonstrate today. Ireland is the validation market.",
      alternatives: "Stay segment-neutral and let multiple wedges (freelancers, students, trades, small-business operators) all develop in parallel. Slower validation, weaker outbound.",
      risks: "Weddings is seasonal. Wedding planners are a niche persona. Over-committing now could trap Signal as 'the wedding planning tool' if we don't keep the brand at the umbrella level.",
      reviewDate: "2026-07-12",
      status: "Active",
      relatedObjects: ["BRAND.md", "Founding Venue Programme", "Wedding demo loop", "Outbound CRM"],
      notes: "Other §2.1 archetypes remain part of suite positioning. Reversible after 10 venue conversations. Revisit at the review date — wedge can become a wedge-and-fan or pivot.",
    },
  ],
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
  risks: [
    {
      id: "product-over-distribution",
      risk: "Too much product development, not enough distribution.",
      area: "GTM",
      likelihood: "High",
      impact: "High",
      status: "At risk",
      mitigation: "Every product improvement should connect to a demo, template, pilot, or shared output.",
      owner: "Ethan",
      reviewDate: "2026-05-17",
    },
    {
      id: "fragmented-suite",
      risk: "Four products become fragmented.",
      area: "Product",
      likelihood: "Medium",
      impact: "High",
      status: "Needs attention",
      mitigation: "Prioritise shared workspace language, shared objects, and Today Signal.",
      owner: "Ethan",
      reviewDate: "2026-05-24",
    },
    {
      id: "analytics-pipeline-silent",
      risk: "Analytics daily briefing pipeline does not actually fire in production.",
      area: "Product",
      likelihood: "High",
      impact: "High",
      status: "At risk",
      mitigation: "Set CRON_SECRET + RESEND_API_KEY on the analytics Vercel project; generate DKIM in Google Workspace; sign into Tasks once with Clerk so listForUser returns a real user. Then watch one morning briefing land end-to-end before pointing new traffic at /app.",
      owner: "Ethan",
      reviewDate: "2026-05-12",
    },
    {
      id: "collaboration-hidden",
      risk: "Collaboration stays hidden behind private workspaces.",
      area: "Growth",
      likelihood: "High",
      impact: "High",
      status: "At risk",
      mitigation: "Prioritise invitations, guest value, shareable outputs, and source tracking as product infrastructure.",
      owner: "Ethan",
      reviewDate: "2026-05-24",
    },
    {
      id: "messaging-abstract",
      risk: "Messaging stays too abstract.",
      area: "Brand",
      likelihood: "Medium",
      impact: "High",
      status: "Needs attention",
      mitigation: "Use wedge-specific demos and plain scenes.",
      owner: "Ethan",
      reviewDate: "2026-05-17",
    },
    {
      id: "crm-inconsistent",
      risk: "CRM and follow-up cadence become inconsistent.",
      area: "Outbound",
      likelihood: "High",
      impact: "Medium",
      status: "At risk",
      mitigation: "Use weekly rhythm and follow-up dates as the operating floor.",
      owner: "Ethan",
      reviewDate: "2026-05-17",
    },
  ],
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
  ],
  growthWorkflow: [
    {
      id: "growth-wedding-idea",
      title: "Wedding planning without spreadsheet chaos",
      audience: "Wedding planners and venue coordinators",
      campaign: "Wedding Planner Pilot",
      product: "Signal Studio",
      segment: "Weddings and events",
      channel: "LinkedIn / short video",
      goal: "Create recognition around the messy middle of wedding planning.",
      cta: "Ask for the private wedding pilot.",
      rationale: "Turns the first wedge into a concrete problem scene.",
      relatedMetric: "Replies",
      brandRisk: "Low",
      complianceRisk: "Low",
      repurposing: ["landing page section", "email hook", "demo intro", "FAQ"],
      status: "Selected",
      roleOwner: "Creative Director",
    },
    {
      id: "growth-venue-offer",
      title: "Founding Venue Programme pitch",
      audience: "Wedding venue coordinators",
      campaign: "Founding Venue Programme",
      product: "Signal Studio",
      segment: "Wedding venues / hotels",
      channel: "Email",
      goal: "Start a respectful pilot conversation.",
      cta: "Book a 15 minute walkthrough.",
      rationale: "Partner distribution can create repeated workspaces.",
      relatedMetric: "Demo requests",
      brandRisk: "Medium",
      complianceRisk: "Medium",
      repurposing: ["offer page", "follow-up email", "partner deck"],
      status: "Drafting",
      roleOwner: "Outbound Operator",
    },
    {
      id: "growth-collaboration-proof",
      title: "One workspace, everyone clear",
      audience: "Workspace creators and invited collaborators",
      campaign: "Collaboration Proof Campaign",
      product: "Signal Studio",
      segment: "Weddings and events",
      channel: "Demo / landing page / email",
      goal: "Show collaboration as the reason Signal spreads.",
      cta: "Ask for a private shared workspace.",
      rationale: "The organic loop needs proof that invited people receive value immediately.",
      relatedMetric: "New workspace creators",
      brandRisk: "Low",
      complianceRisk: "Medium",
      repurposing: ["wedding demo", "venue email", "planner pitch", "template intro"],
      status: "Selected",
      roleOwner: "Strategy Director",
    },
    {
      id: "growth-review-standard",
      title: "Brand and trust review checklist",
      audience: "Internal",
      campaign: "Signal Growth Studio",
      product: "Signal HQ",
      segment: "All",
      channel: "Review queue",
      goal: "Keep growth output useful, accurate, and on-brand.",
      cta: "Approve only when useful and true.",
      rationale: "The operating system should preserve trust while increasing output.",
      relatedMetric: "Review queue cycle time",
      brandRisk: "Low",
      complianceRisk: "Low",
      repurposing: ["playbook", "review template", "weekly report"],
      status: "Selected",
      roleOwner: "Compliance & Trust Reviewer",
    },
  ],
};
