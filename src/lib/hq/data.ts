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

export interface HqData {
  version: 1;
  updatedAt: string;
  focus: OperatingFocus;
  products: ProductStatus[];
  ecosystemFlows: EcosystemFlow[];
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
  updatedAt: "2026-05-11",
  focus: {
    stage: "Pre-launch",
    weekOf: "2026-05-11",
    theme: "Turn product clarity into launch clarity.",
    focus:
      "Move the suite from polished private surfaces toward visible proof: demos, pilots, templates, and repeatable outreach.",
    priorities: [
      "Publish one wedding/events proof path.",
      "Create the first demo workspace and script.",
      "Build a small outbound list with real follow-up dates.",
    ],
    risks: [
      "Product work is ahead of distribution.",
      "The four products could read as separate tools before the shared loop is visible.",
      "Messaging may stay too abstract without wedge-specific proof.",
    ],
    nextActions: [
      "Build Signal Weddings landing page.",
      "Draft Founding Venue Programme offer.",
      "Record a 60 second wedding workspace walkthrough.",
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
      launchReadiness: 58,
      majorFeatures: ["Workspace creation", "editor", "public viewer", "milestones"],
      blockers: ["Confidence and change history need a sharper model."],
      notes: "Strong fit for shareable outputs and partner-led discovery.",
      nextActions: ["Add Now / Next / Later framing.", "Link roadmap items to decisions.", "Draft roadmap explanation pattern."],
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
      maturity: 28,
      status: "Private build",
      uxPolish: 35,
      integrationScore: 18,
      launchReadiness: 24,
      majorFeatures: ["First surface", "PRODUCT.md", "one-way Notes to Tasks principle"],
      blockers: ["Full v1 product work remains pending."],
      notes: "Notes must become the context-to-work layer, not a generic notebook.",
      nextActions: ["Build decision extraction flow.", "Design note-to-work approval pattern.", "Create decision log surface."],
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
      score: 32,
      weight: 12,
      status: "At risk",
      notes: "The suite story is strong, but the live loop is still early.",
      blockers: ["Shared objects and events are not implemented."],
      nextAction: "Model decisions, risks, and updates once.",
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
      score: 18,
      weight: 8,
      status: "At risk",
      notes: "Template list exists. Public proof does not.",
      blockers: ["No published template gallery."],
      nextAction: "Build one wedding planning workspace template.",
    },
    {
      id: "demo-assets",
      category: "Demo assets",
      score: 12,
      weight: 8,
      status: "At risk",
      notes: "Demos are the highest leverage missing proof.",
      blockers: ["No polished wedge demo published."],
      nextAction: "Record Signal Studio for Weddings walkthrough.",
    },
    {
      id: "landing-pages",
      category: "Website and landing pages",
      score: 48,
      weight: 7,
      status: "Needs attention",
      notes: "Umbrella is polished. Segment pages need the first wedge.",
      blockers: ["No Signal Weddings page yet."],
      nextAction: "Draft wedding/events landing page.",
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
      offer: "20 free wedding planning workspaces for feedback from coordinator and couples.",
      status: "Selected",
      assetsNeeded: ["Offer page", "venue pitch email", "60 second demo", "feedback form"],
      startDate: "2026-05-13",
      endDate: "2026-06-30",
      currentBlocker: "No landing page or demo yet.",
      nextStep: "Draft offer page and first email variant.",
      progress: 18,
      relatedContent: "How a hotel can give couples a planning workspace",
      relatedLandingPage: "/weddings/venues",
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
      currentBlocker: "Needs first demo workspace.",
      nextStep: "Create wedding workspace template.",
      progress: 8,
      relatedContent: "Wedding planning without spreadsheet chaos",
      relatedLandingPage: "/weddings/planners",
      relatedMetric: "Activated collaborative workspaces",
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
      status: "Idea",
      useCase: "Coordinate planning, supplier work, decisions, and final-week tasks.",
      includedProducts: ["Tasks", "Notes", "Roadmap", "Analytics"],
      landingPageUrl: "",
      relatedCampaign: "Founding Venue Programme",
      activationGoal: "Workspace has tasks, notes, roadmap items, and at least one invite.",
      notes: "First template to build because it shows the ecosystem.",
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
      "Signal Studio is plain-language software for clear work. It helps people capture context, organise action, communicate direction, and understand what needs attention without project-management overhead.",
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
      status: "To do",
      relatedObject: "Founding Venue Programme",
      notes: "Lead with venues and planners. Keep the broader suite visible.",
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
      status: "To do",
      relatedObject: "Wedding planning workspace",
      notes: "Use a believable venue meeting, supplier list, final-week tasks, and roadmap.",
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
