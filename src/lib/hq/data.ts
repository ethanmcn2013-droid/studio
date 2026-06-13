/**
 * Signal HQ seed data — operator surfaces + types only (HQ v2 closure, 2026-05-15).
 *
 * Most HQ state lives in `content/hq/<section>/*.md` and is loaded by
 * `src/lib/hq/markdown.ts`. This file carries only what has no
 * other source of truth:
 *
 *   focus       — operator-set strategic frame (stage/week/theme/focus).
 *                 The derived signal layer (phase.md, atlas drift, commits,
 *                 cron, log) feeds the HQ operating system and proof spine.
 *   prospects   — outbound CRM, browser-edited via /hq.
 *   feedback    — operator capture, browser-edited via /hq.
 *   weeklyRhythm — operator cadence, browser-edited via /hq.
 *   nextActions — operator todos, browser-edited via /hq.
 *
 *   metrics     — DEFERRED. 13 seed values are display-only. There is
 *                 no real source of truth wired today (no analytics
 *                 read, no repo activity counter, no Vercel metrics
 *                 ingest). Values stay manually-set in localStorage
 *                 until a real source ships. Treat as historical
 *                 scaffolding, not signal.
 *
 * Retired on 2026-05-15 (sections now markdown-only): products,
 * ecosystem-flows, collaboration-loop, shared-objects, access-roles,
 * collaborator-first-view, shareable-artifacts, features,
 * launch-readiness, segments, campaigns, content, demos, templates,
 * pilots, decisions, risks, growth-workflow, messaging. The current HQ
 * registry points to the relevant live routes and canonical sources.
 *
 * Types below stay as the transitional content contract for older HQ
 * material and seed fallback paths.
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

export interface OperatingFocus {
  stage: "Development" | "Pre-launch" | "Private Beta" | "Public Beta" | "Launch";
  weekOf: string;
  theme: string;
  focus: string;
}

export interface ProductStatus {
  id: string;
  name: "Signal Tasks" | "Signal Timeline" | "Signal" | "Signal Notes";
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
  prospects: Prospect[];
  metrics: MetricItem[];
  feedback: FeedbackItem[];
  weeklyRhythm: WeeklyRhythmItem[];
  nextActions: NextActionItem[];
}

export const seedHqData: HqData = {
  version: 1,
  updatedAt: "2026-05-16T12:00:00Z",
  focus: {
    stage: "Pre-launch",
    weekOf: "2026-05-11",
    theme: "Venue-pilot pull · three conversations by 2026-06-02, regardless of polish.",
    focus:
      "T0-T3.b polish work is closed (verified 2026-05-12 across /weddings, Tasks /welcome, Roadmap demo). The next forcing function is not another sprint - it is venues. Three real conversations by 2026-06-02. Sprint 1 (Notes 9.3 + 9.4b) and Sprint 2 (collaboration gestures) continue, but in service of the pilot, not as a prerequisite.",
  },
  prospects: [
    {
      id: "hotel-adare-manor",
      organisation: "Adare Manor",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "info@adaremanor.com",
      website: "",
      location: "Adare, Limerick",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; General inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Independent · General inbox · GENERIC INBOX — phone-first warm-up advised",
    },
    {
      id: "hotel-ashford-castle",
      organisation: "Ashford Castle",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "reservations@ashfordcastle.com",
      website: "",
      location: "Cong, Mayo",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Red Carnation group; Reservations inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Red Carnation · Reservations inbox · GENERIC INBOX — phone-first warm-up advised",
    },
    {
      id: "hotel-the-shelbourne",
      organisation: "The Shelbourne",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "sales@theshelbourne.com",
      website: "",
      location: "Dublin 2",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Marriott Autograph group; Sales/Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Marriott Autograph · Sales/Weddings inbox",
    },
    {
      id: "hotel-the-merrion",
      organisation: "The Merrion",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "weddings@merrionhotel.com",
      website: "",
      location: "Dublin 2",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Independent · Weddings inbox",
    },
    {
      id: "hotel-the-westbury",
      organisation: "The Westbury",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "westbury@doylecollection.com",
      website: "",
      location: "Dublin 2",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Doyle Collection group; General/Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Doyle Collection · General/Events inbox",
    },
    {
      id: "hotel-anantara-the-marker",
      organisation: "Anantara The Marker",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "groups.themarker@anantara-hotels.com",
      website: "",
      location: "Dublin 2",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Minor/Anantara group; Groups/Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Minor/Anantara · Groups/Events inbox",
    },
    {
      id: "hotel-dromoland-castle",
      organisation: "Dromoland Castle",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "sales@dromoland.ie",
      website: "",
      location: "Newmarket-on-Fergus, Clare",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; Sales inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Independent · Sales inbox",
    },
    {
      id: "hotel-the-k-club",
      organisation: "The K Club",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "reservations@kclub.ie",
      website: "",
      location: "Straffan, Kildare",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; Reservations inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Independent · Reservations inbox",
    },
    {
      id: "hotel-powerscourt-hotel",
      organisation: "Powerscourt Hotel",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "info@powerscourthotel.com",
      website: "",
      location: "Enniskerry, Wicklow",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "MHL/Marriott group; General inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · MHL/Marriott · General inbox · GENERIC INBOX — phone-first warm-up advised",
    },
    {
      id: "hotel-carton-house",
      organisation: "Carton House",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "cartonhouseweddings@fairmont.com",
      website: "",
      location: "Maynooth, Kildare",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Fairmont/Accor group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Fairmont/Accor · Weddings inbox",
    },
    {
      id: "hotel-mount-juliet-estate",
      organisation: "Mount Juliet Estate",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "events@mountjuliet.ie",
      website: "",
      location: "Thomastown, Kilkenny",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Marriott Autograph group; Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Marriott Autograph · Events inbox",
    },
    {
      id: "hotel-sheen-falls-lodge",
      organisation: "Sheen Falls Lodge",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "events@sheenfallslodge.ie",
      website: "",
      location: "Kenmare, Kerry",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Mayrange group; Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Mayrange · Events inbox",
    },
    {
      id: "hotel-the-europe-hotel",
      organisation: "The Europe Hotel",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "reservations@theeurope.com",
      website: "",
      location: "Killarney, Kerry",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Killarney Hotels group; Reservations inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Killarney Hotels · Reservations inbox",
    },
    {
      id: "hotel-castlemartyr-resort",
      organisation: "Castlemartyr Resort",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "weddings@castlemartyrresort.ie",
      website: "",
      location: "Castlemartyr, Cork",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Mayrange group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Mayrange · Weddings inbox",
    },
    {
      id: "hotel-lough-erne-resort",
      organisation: "Lough Erne Resort",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "events@lougherneresort.com",
      website: "",
      location: "Enniskillen, Fermanagh (NI)",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Independent · Events inbox",
    },
    {
      id: "hotel-the-g-hotel-spa",
      organisation: "The g Hotel & Spa",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "ghotel_weddingsandevents@leonardohotels.com",
      website: "",
      location: "Galway City",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Leonardo group; Weddings/Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Leonardo · Weddings/Events inbox",
    },
    {
      id: "hotel-trump-intl-doonbeg",
      organisation: "Trump Intl Doonbeg",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "doonbeg.reservations@trumphotels.com",
      website: "",
      location: "Doonbeg, Clare",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Trump Hotels group; Reservations inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Trump Hotels · Reservations inbox",
    },
    {
      id: "hotel-fota-island-resort",
      organisation: "Fota Island Resort",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "reservations@fotaisland.ie",
      website: "",
      location: "Fota Island, Cork",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Fota Collection group; Reservations inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Fota Collection · Reservations inbox",
    },
    {
      id: "hotel-the-college-green-hotel",
      organisation: "The College Green Hotel",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "weddings@thecollegegreenhotel.com",
      website: "",
      location: "Dublin 2",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Marriott Autograph group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Marriott Autograph · Weddings inbox",
    },
    {
      id: "hotel-intercontinental-dublin",
      organisation: "InterContinental Dublin",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "weddings@icdublin.com",
      website: "",
      location: "Ballsbridge, Dublin 4",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "IHG group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · IHG · Weddings inbox",
    },
    {
      id: "hotel-conrad-dublin",
      organisation: "Conrad Dublin",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "dublininfo@conradhotels.com",
      website: "",
      location: "Earlsfort Terrace, Dublin 2",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Hilton/Conrad group; General inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Hilton/Conrad · General inbox · GENERIC INBOX — phone-first warm-up advised",
    },
    {
      id: "hotel-fitzwilliam-hotel",
      organisation: "Fitzwilliam Hotel",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "events@fitzwilliamhoteldublin.com",
      website: "",
      location: "St Stephen's Green, Dublin 2",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Independent · Events inbox",
    },
    {
      id: "hotel-the-morrison",
      organisation: "The Morrison",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "events@morrisonhotel.ie",
      website: "",
      location: "Ormond Quay, Dublin 1",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Curio/Hilton group; Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Curio/Hilton · Events inbox",
    },
    {
      id: "hotel-druids-glen-resort",
      organisation: "Druids Glen Resort",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "weddings@druidsglenresort.com",
      website: "",
      location: "Newtownmountkennedy, Wicklow",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Neville Hotels group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Neville Hotels · Weddings inbox",
    },
    {
      id: "hotel-the-gibson-hotel",
      organisation: "The Gibson Hotel",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "events.gibson@thegibsonhotel.ie",
      website: "",
      location: "Point Square, Dublin 1",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Ascend group; Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Ascend · Events inbox",
    },
    {
      id: "hotel-the-croke-park-hotel",
      organisation: "The Croke Park Hotel",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "crokeparkhotelevents@doylecollection.com",
      website: "",
      location: "Jones's Road, Dublin 3",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Doyle Collection group; Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Doyle Collection · Events inbox",
    },
    {
      id: "hotel-clayton-burlington-road",
      organisation: "Clayton Burlington Road",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "events.burlingtonroad@claytonhotels.com",
      website: "",
      location: "Leeson Street, Dublin 4",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Dalata group; Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Dalata · Events inbox",
    },
    {
      id: "hotel-the-dean-dublin",
      organisation: "The Dean Dublin",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "dublinevents@deangroup.com",
      website: "",
      location: "Harcourt Street, Dublin 2",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Dean Group group; Events/Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Dean Group · Events/Weddings inbox",
    },
    {
      id: "hotel-clontarf-castle-hotel",
      organisation: "Clontarf Castle Hotel",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "weddings@clontarfcastle.ie",
      website: "",
      location: "Clontarf, Dublin 3",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Independent · Weddings inbox",
    },
    {
      id: "hotel-radisson-blu-royal",
      organisation: "Radisson Blu Royal",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "meetings.royal.dublin@radissonblu.com",
      website: "",
      location: "Golden Lane, Dublin 8",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Radisson group; Meetings/Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Radisson · Meetings/Events inbox",
    },
    {
      id: "hotel-hayfield-manor",
      organisation: "Hayfield Manor",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "enquiries@hayfieldmanor.ie",
      website: "",
      location: "Cork City",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Vertu group; General inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Vertu · General inbox · GENERIC INBOX — phone-first warm-up advised",
    },
    {
      id: "hotel-the-montenotte-hotel",
      organisation: "The Montenotte Hotel",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "events@themontenottehotel.com",
      website: "",
      location: "Cork City",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Independent · Events inbox",
    },
    {
      id: "hotel-the-river-lee",
      organisation: "The River Lee",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "Riverlee_Sales@doylecollection.com",
      website: "",
      location: "Cork City",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Doyle Collection group; Sales inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Doyle Collection · Sales inbox",
    },
    {
      id: "hotel-the-imperial-hotel",
      organisation: "The Imperial Hotel",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "Events@imperialhotelcork.ie",
      website: "",
      location: "Cork City",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; Events/Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Independent · Events/Weddings inbox",
    },
    {
      id: "hotel-the-galmont-hotel-spa",
      organisation: "The Galmont Hotel & Spa",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "weddings@thegalmont.com",
      website: "",
      location: "Galway City",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "MHL group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · MHL · Weddings inbox",
    },
    {
      id: "hotel-the-hardiman",
      organisation: "The Hardiman",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "Weddings@thehardiman.ie",
      website: "",
      location: "Galway City",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Ascend group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Ascend · Weddings inbox",
    },
    {
      id: "hotel-glenlo-abbey-hotel",
      organisation: "Glenlo Abbey Hotel",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "info@glenloabbey.ie",
      website: "",
      location: "Bushypark, Galway",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; General inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Independent · General inbox · GENERIC INBOX — phone-first warm-up advised",
    },
    {
      id: "hotel-the-killarney-park-hotel",
      organisation: "The Killarney Park Hotel",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "reservations@killarneyparkhotel.ie",
      website: "",
      location: "Killarney, Kerry",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; Reservations inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Independent · Reservations inbox · GENERIC INBOX — phone-first warm-up advised",
    },
    {
      id: "hotel-the-brehon-hotel-spa",
      organisation: "The Brehon Hotel & Spa",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "events@thebrehon.com",
      website: "",
      location: "Killarney, Kerry",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Gleneagle group; Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Gleneagle · Events inbox",
    },
    {
      id: "hotel-aghadoe-heights",
      organisation: "Aghadoe Heights",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "weddingplanner@aghadoeheights.com",
      website: "",
      location: "Killarney, Kerry",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Independent · Weddings inbox",
    },
    {
      id: "hotel-harvey-s-point",
      organisation: "Harvey's Point",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "events@harveyspoint.com",
      website: "",
      location: "Lough Eske, Donegal",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Independent · Events inbox",
    },
    {
      id: "hotel-lough-eske-castle",
      organisation: "Lough Eske Castle",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "weddings@lougheskecastlehotel.com",
      website: "",
      location: "Donegal Town",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Solis group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Solis · Weddings inbox",
    },
    {
      id: "hotel-castlecourt-hotel",
      organisation: "Castlecourt Hotel",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "mywedding@castlecourthotel.ie",
      website: "",
      location: "Westport, Mayo",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Westport Hotel Group group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Westport Hotel Group · Weddings inbox",
    },
    {
      id: "hotel-lyrath-estate",
      organisation: "Lyrath Estate",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "events@lyrath.com",
      website: "",
      location: "Kilkenny City",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Independent · Events inbox",
    },
    {
      id: "hotel-killashee-hotel-spa",
      organisation: "Killashee Hotel & Spa",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "weddings@killasheehotel.com",
      website: "",
      location: "Naas, Kildare",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "FBD Hotels group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · FBD Hotels · Weddings inbox",
    },
    {
      id: "hotel-faithlegg-hotel",
      organisation: "Faithlegg Hotel",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "weddings@faithlegg.com",
      website: "",
      location: "Faithlegg, Waterford",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "FBD Hotels group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · FBD Hotels · Weddings inbox",
    },
    {
      id: "hotel-waterford-castle",
      organisation: "Waterford Castle",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "weddings@waterfordcastleresort.com",
      website: "",
      location: "Ballinakill, Waterford",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Independent · Weddings inbox",
    },
    {
      id: "hotel-limerick-strand-hotel",
      organisation: "Limerick Strand Hotel",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "events@strandlimerick.ie",
      website: "",
      location: "Limerick City",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "MHL group; Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · MHL · Events inbox",
    },
    {
      id: "hotel-slieve-russell-hotel",
      organisation: "Slieve Russell Hotel",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "enquiries@slieverussell.ie",
      website: "",
      location: "Ballyconnell, Cavan",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Brady Hotels group; General/Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Brady Hotels · General/Events inbox",
    },
    {
      id: "hotel-culloden-estate-spa",
      organisation: "Culloden Estate & Spa",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "weddings@cull.hastingshotels.com",
      website: "",
      location: "Holywood, Belfast (NI)",
      source: "Top-50 Ireland research 2026-05-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Hastings group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Hastings · Weddings inbox",
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
      notes: "`/wedding-planning/update` routes viewers to the self-serve `/weddings` page. Venue-led proof uses `/venues/demo` and the no-CTA couple artifact at Roadmap `/the-wedding`.",
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
      relatedObject: "Signal",
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
};
