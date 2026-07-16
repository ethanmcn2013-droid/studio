/**
 * Signal HQ seed data, operator surfaces + types only (HQ v2 closure, 2026-05-15).
 *
 * Most HQ state lives in `content/hq/<section>/*.md` and is loaded by
 * `src/lib/hq/markdown.ts`. This file carries only what has no
 * other source of truth:
 *
 *   focus      , operator-set strategic frame (stage/week/theme/focus).
 *                 The derived signal layer (phase.md, atlas drift, commits,
 *                 cron, log) feeds the HQ operating system and proof spine.
 *   prospects  , outbound CRM, browser-edited via /hq.
 *   feedback   , operator capture, browser-edited via /hq.
 *   weeklyRhythm, operator cadence, browser-edited via /hq.
 *   nextActions, operator todos, browser-edited via /hq.
 *
 *   metrics    , DEFERRED. 13 seed values are display-only. There is
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
  /** lead book key ("venue" | "student" | "school" | "smb") or a legacy display string, normalised at seed time */
  segment: string;
  contactName: string;
  role: string;
  email: string;
  website: string;
  location: string;
  /** structured lock-down fields; legacy rows derive these from notes at seed time */
  phone?: string;
  address?: string;
  county?: string;
  orgGroup?: string;
  inboxType?: string;
  tier?: string;
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
      website: "https://www.adaremanor.com",
      location: "Adare, Limerick",
      phone: "+353 61 605 200",
      address: "Adare Manor, Adare, Co. Limerick, V94 W8WR",
      county: "Limerick",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; General inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Independent · General inbox · GENERIC INBOX, phone-first warm-up advised · no weddings@ published, weddings run through adaremanor.com/weddings/enquiry form (verified 2026-07-16)",
    },
    {
      id: "hotel-ashford-castle",
      organisation: "Ashford Castle",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "reservations@ashfordcastle.com",
      website: "https://www.ashfordcastle.com",
      location: "Cong, Mayo",
      phone: "+353 94 954 6003",
      address: "Ashford Castle, Cong, Co. Mayo, F31 CA48",
      county: "Mayo",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Red Carnation group; Reservations inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Red Carnation · Reservations inbox · GENERIC INBOX, phone-first warm-up advised · no events email published, events run through /event-enquiry form (verified 2026-07-16)",
    },
    {
      id: "hotel-the-shelbourne",
      organisation: "The Shelbourne",
      segment: "Hotels / wedding & events",
      contactName: "Cathy O'Shea",
      role: "Wedding Manager",
      email: "sales@theshelbourne.com",
      website: "https://theshelbourne.com",
      location: "Dublin 2",
      phone: "+353 1 663 4500",
      address: "27 St Stephen's Green, Dublin 2, D02 K224",
      county: "Dublin",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Marriott Autograph group; Sales/Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Marriott Autograph · Sales/Weddings inbox · Cathy O'Shea named Wedding Manager on theshelbourne.com/wedding-events (verified 2026-07-16); direct email not published, address via sales@",
    },
    {
      id: "hotel-the-merrion",
      organisation: "The Merrion",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "weddings@merrionhotel.com",
      website: "https://www.merrionhotel.com",
      location: "Dublin 2",
      phone: "+353 1 603 0600",
      address: "Upper Merrion Street, Dublin 2, D02 KF79",
      county: "Dublin",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Independent · Weddings inbox · weddings@ verified on merrionhotel.com/weddings 2026-07-16",
    },
    {
      id: "hotel-the-westbury",
      organisation: "The Westbury",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "westbury_events@doylecollection.com",
      website: "https://www.doylecollection.com/hotels/the-westbury-hotel",
      location: "Dublin 2",
      phone: "+353 1 646 3300",
      address: "The Westbury, Balfe Street, Dublin 2, D02 CH66",
      county: "Dublin",
      inboxType: "events",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Doyle Collection group; General/Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Doyle Collection · General/Events inbox · email upgraded to events inbox per official meetings/events page (direct events line +353 1 646 3387); weddings page form-only; verified 2026-07-16",
    },
    {
      id: "hotel-anantara-the-marker",
      organisation: "Anantara The Marker",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "groups.themarker@anantara-hotels.com",
      website: "https://www.anantara.com/en/the-marker-dublin",
      location: "Dublin 2",
      phone: "+353 1 687 5100",
      address: "Grand Canal Square, Docklands, Dublin 2, D02 CK38",
      county: "Dublin",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Minor/Anantara group; Groups/Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Minor/Anantara · Groups/Events inbox · PARTIAL: no email published anywhere on official site (forms only) so CRM email unconfirmed; wedding-coordinator line 01 687 5132 per Social&Personal; verified what could be 2026-07-16",
    },
    {
      id: "hotel-dromoland-castle",
      organisation: "Dromoland Castle",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "sales@dromoland.ie",
      website: "https://www.dromoland.ie",
      location: "Newmarket-on-Fergus, Clare",
      phone: "+353 61 368 144",
      address: "Dromoland Castle, Newmarket-on-Fergus, Co. Clare, V95 ATD3",
      county: "Clare",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; Sales inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Independent · Sales inbox · sales@ is the weddings route per dromoland.ie/weddings (verified 2026-07-16); 2028 weddings on waitlist",
    },
    {
      id: "hotel-the-k-club",
      organisation: "The K Club",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "reservations@kclub.ie",
      website: "https://www.kclub.ie",
      location: "Straffan, Kildare",
      phone: "+353 1 601 7200",
      address: "The K Club, Straffan, Co. Kildare, W23 YX53",
      county: "Kildare",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; Reservations inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Independent · Reservations inbox · no weddings email published (enquiry form + reservations@ confirmed; sales@ also listed); name lead: Annie Raftery, Wedding Manager, via public LinkedIn, verify on first call; verified 2026-07-16",
    },
    {
      id: "hotel-powerscourt-hotel",
      organisation: "Powerscourt Hotel",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "weddings@powerscourthotel.com",
      website: "https://www.powerscourthotel.com",
      location: "Enniskerry, Wicklow",
      phone: "+353 1 274 8888",
      address: "Powerscourt Estate, Enniskerry, Co. Wicklow, A98 DR12",
      county: "Wicklow",
      inboxType: "weddings",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "MHL/Marriott group; General inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · MHL/Marriott · General inbox · GENERIC INBOX, phone-first warm-up advised · email upgraded to weddings@ per official weddings page (info@ remains general); do not confuse with events@powerscourtestate.com (separate Estate venue); verified 2026-07-16",
    },
    {
      id: "hotel-carton-house",
      organisation: "Carton House",
      segment: "Hotels / wedding & events",
      contactName: "Orla Hogan",
      role: "Wedding Specialist",
      email: "cartonhouseweddings@fairmont.com",
      website: "https://www.cartonhouse.com",
      location: "Maynooth, Kildare",
      phone: "+353 1 505 2000",
      address: "Carton Demesne, Maynooth, Co. Kildare, W23 TD98",
      county: "Kildare",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Fairmont/Accor group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Fairmont/Accor · Weddings inbox · official weddings page publishes direct mailtos orla.hogan@fairmont.com and claire.byrne@fairmont.com (both Wedding Specialists) + weddings line +353 1 651 7707; verified 2026-07-16",
    },
    {
      id: "hotel-mount-juliet-estate",
      organisation: "Mount Juliet Estate",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "weddings@mountjuliet.ie",
      website: "https://www.mountjuliet.ie",
      location: "Thomastown, Kilkenny",
      phone: "+353 56 777 3000",
      address: "Mount Juliet Estate, Thomastown, Co. Kilkenny, R95 E096",
      county: "Kilkenny",
      inboxType: "weddings",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Marriott Autograph group; Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Marriott Autograph · Events inbox · email upgraded to weddings@ per official wedding page (events@ is the M&E address); Eircode via Virtuoso/DCB listings; verified 2026-07-16",
    },
    {
      id: "hotel-sheen-falls-lodge",
      organisation: "Sheen Falls Lodge",
      segment: "Hotels / wedding & events",
      contactName: "Clodagh Ryan",
      role: "Wedding Planner",
      email: "events@sheenfallslodge.ie",
      website: "https://www.sheenfallslodge.ie",
      location: "Kenmare, Kerry",
      phone: "+353 64 664 1600",
      address: "Sheen Falls Lodge, Kenmare, Co. Kerry, V93 HR27",
      county: "Kerry",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Mayrange group; Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Mayrange · Events inbox · Clodagh Ryan named on official Meet the Planner page; events@ confirmed on weddings page; verified 2026-07-16",
    },
    {
      id: "hotel-the-europe-hotel",
      organisation: "The Europe Hotel",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "reservations@theeurope.com",
      website: "https://www.theeurope.com",
      location: "Killarney, Kerry",
      phone: "+353 64 66 71300",
      address: "Fossa, Killarney, Co. Kerry, V93 KHN6",
      county: "Kerry",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Killarney Hotels group; Reservations inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Killarney Hotels · Reservations inbox · weddings are form-only (theeurope.com/wedding-enquiry); reservations@ confirmed general; verified 2026-07-16",
    },
    {
      id: "hotel-castlemartyr-resort",
      organisation: "Castlemartyr Resort",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "weddings@castlemartyrresort.ie",
      website: "https://www.castlemartyrresort.ie",
      location: "Castlemartyr, Cork",
      phone: "+353 21 421 9000",
      address: "Castlemartyr, Co. Cork, P25 X300",
      county: "Cork",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Mayrange group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Mayrange · Weddings inbox · weddings@ confirmed, weddings direct line 021 421 9251; name lead: Lucy Murphy, Wedding and Events Executive, via public LinkedIn, verify on first call; verified 2026-07-16",
    },
    {
      id: "hotel-lough-erne-resort",
      organisation: "Lough Erne Resort",
      segment: "Hotels / wedding & events",
      contactName: "Michelle McGarrity",
      role: "Events Manager",
      email: "events@lougherneresort.com",
      website: "https://www.lougherneresort.com",
      location: "Enniskillen, Fermanagh (NI)",
      phone: "+44 28 6632 3230",
      address: "Belleek Road, Enniskillen, Co. Fermanagh, BT93 7ED",
      county: "Fermanagh",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Independent · Events inbox · official Meet the Wedding Team page names Michelle McGarrity (mmcgarrity@lougherneresort.com) + coordinators Arlene McPartland and Aine McGirr; verified 2026-07-16",
    },
    {
      id: "hotel-the-g-hotel-spa",
      organisation: "The g Hotel & Spa",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "ghotel_weddingsandevents@leonardohotels.com",
      website: "https://www.theghotel.ie",
      location: "Galway City",
      phone: "+353 91 865200",
      address: "Wellpark, Old Dublin Road, Galway, H91 V0HR",
      county: "Galway",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Leonardo group; Weddings/Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Leonardo · Weddings/Events inbox · Leonardo email confirmed live; second alias weddingsandevents@theghotel.ie + weddings line 091 778 454 on official weddings page; verified 2026-07-16",
    },
    {
      id: "hotel-trump-intl-doonbeg",
      organisation: "Trump Intl Doonbeg",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "weddings.doonbeg@trumphotels.com",
      website: "https://www.trumphotels.com/ireland",
      location: "Doonbeg, Clare",
      phone: "+353 65 905 5644",
      address: "Doonbeg, Co. Clare, V15 KH39",
      county: "Clare",
      inboxType: "weddings",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Trump Hotels group; Reservations inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Trump Hotels · Reservations inbox · email upgraded to weddings@ per official weddings page (old address was general reservations); verified 2026-07-16",
    },
    {
      id: "hotel-fota-island-resort",
      organisation: "Fota Island Resort",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "reservations@fotaisland.ie",
      website: "https://www.fotaisland.ie",
      location: "Fota Island, Cork",
      phone: "+353 21 488 3700",
      address: "Fota Island, Co. Cork, T45 HX62",
      county: "Cork",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Fota Collection group; Reservations inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Fota Collection · Reservations inbox · weddings form-only on official site; lead: Susan Lavelle, Wedding Coordinator, SLavelle@fotaisland.ie / 021 467 3453 per venue-owned blog (undated), verify on first call; verified 2026-07-16",
    },
    {
      id: "hotel-the-college-green-hotel",
      organisation: "The College Green Hotel",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "weddings@thecollegegreenhotel.com",
      website: "https://www.thecollegegreenhotel.com",
      location: "Dublin 2",
      phone: "+353 1 645 1000",
      address: "College Green, Westmoreland Street, Dublin 2, D02 HR67",
      county: "Dublin",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Marriott Autograph group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Marriott Autograph · Weddings inbox · weddings@ confirmed on official weddings page; coordinator 'Emunah' first-name-only in testimonials; verified 2026-07-16",
    },
    {
      id: "hotel-intercontinental-dublin",
      organisation: "InterContinental Dublin",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "weddings@icdublin.com",
      website: "https://www.intercontinentaldublin.ie",
      location: "Ballsbridge, Dublin 4",
      phone: "+353 1 665 4000",
      address: "Simmonscourt Road, Ballsbridge, Dublin 4, D04 A9K8",
      county: "Dublin",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "IHG group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · IHG · Weddings inbox · weddings@ confirmed on official wedding-packages page; verified 2026-07-16",
    },
    {
      id: "hotel-conrad-dublin",
      organisation: "Conrad Dublin",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "conraddublin.events@conradhotels.com",
      website: "https://www.hilton.com/en/hotels/dubhcci-conrad-dublin/",
      location: "Earlsfort Terrace, Dublin 2",
      phone: "+353 1 602 8900",
      address: "Earlsfort Terrace, Dublin 2, D02 V562",
      county: "Dublin",
      inboxType: "events",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Hilton/Conrad group; General inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Hilton/Conrad · General inbox · GENERIC INBOX, phone-first warm-up advised · email upgraded to events inbox per hotel-owned conraddublinrestaurants.com contact page (also conraddublin.venues@); hilton.com blocked fetch, PARTIAL; verified 2026-07-16",
    },
    {
      id: "hotel-fitzwilliam-hotel",
      organisation: "Fitzwilliam Hotel",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "rdoyle@fitzwilliamhotel.com",
      website: "https://www.fitzwilliamhoteldublin.com",
      location: "St Stephen's Green, Dublin 2",
      phone: "+353 1 478 7000",
      address: "127-128 St Stephen's Green, Dublin 2, D02 HE18",
      county: "Dublin",
      inboxType: "direct",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Independent · Events inbox · OLD events@ address not on current site; published M&E contact is rdoyle@fitzwilliamhotel.com (note domain fitzwilliamhotel.com), general enq@fitzwilliamhotel.com; name lead: Bronagh Kelleher, Director of Sales and Marketing, via LinkedIn; verified 2026-07-16",
    },
    {
      id: "hotel-the-morrison",
      organisation: "The Morrison",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "events@morrisonhotel.ie",
      website: "https://www.morrisonhotel.ie",
      location: "Ormond Quay, Dublin 1",
      phone: "+353 1 887 2400",
      address: "Ormond Quay Lower, Dublin 1, D01 K5X5",
      county: "Dublin",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Curio/Hilton group; Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Curio/Hilton · Events inbox · events@ confirmed on official meetings-events page, events office 01 887 2458; name lead: Fiona Burns via Dublin Convention Bureau, verify on first call; verified 2026-07-16",
    },
    {
      id: "hotel-druids-glen-resort",
      organisation: "Druids Glen Resort",
      segment: "Hotels / wedding & events",
      contactName: "Nessa Kearney",
      role: "Wedding Expert",
      email: "weddings@druidsglenresort.com",
      website: "https://www.druidsglenresort.com",
      location: "Newtownmountkennedy, Wicklow",
      phone: "+353 1 287 0800",
      address: "Newtownmountkennedy, Co. Wicklow, A63 DW08",
      county: "Wicklow",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Neville Hotels group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Neville Hotels · Weddings inbox · Nessa Kearney named on official weddings page with direct nessa.kearney@druidsglenresort.com / +353 1 287 0811; verified 2026-07-16",
    },
    {
      id: "hotel-the-gibson-hotel",
      organisation: "The Gibson Hotel",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "events.gibson@thegibsonhotel.ie",
      website: "https://www.thegibsonhotel.ie",
      location: "Point Square, Dublin 1",
      phone: "+353 1 681 5000",
      address: "Point Square, Dublin 1, D01 X2P2",
      county: "Dublin",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Ascend group; Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Ascend · Events inbox · events.gibson@ confirmed; name lead: Aisling O'Gorman, Meetings and Events Executive, via company LinkedIn, verify on first call; verified 2026-07-16",
    },
    {
      id: "hotel-the-croke-park-hotel",
      organisation: "The Croke Park Hotel",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "crokeparkhotelevents@doylecollection.com",
      website: "https://www.doylecollection.com/hotels/the-croke-park-hotel",
      location: "Jones's Road, Dublin 3",
      phone: "+353 1 871 4444",
      address: "Jones' Road, Dublin 3, D03 E5Y8",
      county: "Dublin",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Doyle Collection group; Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Doyle Collection · Events inbox · events email confirmed on official meetings page; verified 2026-07-16",
    },
    {
      id: "hotel-clayton-burlington-road",
      organisation: "Clayton Burlington Road",
      segment: "Hotels / wedding & events",
      contactName: "Deirdre O'Sullivan",
      role: "Groups, Conferences & Events Manager",
      email: "events.burlingtonroad@claytonhotels.com",
      website: "https://www.claytonhotels.com/burlington-road/",
      location: "Leeson Street, Dublin 4",
      phone: "+353 1 618 5600",
      address: "Leeson Street Upper, Dublin 4, D04 A318",
      county: "Dublin",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Dalata group; Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Dalata · Events inbox · named on official Our Meetings Team page (Anna Michalak, Meetings Manager, also listed); verified 2026-07-16",
    },
    {
      id: "hotel-the-dean-dublin",
      organisation: "The Dean Dublin",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "dublinevents@deangroup.com",
      website: "https://thedeanhotels.com",
      location: "Harcourt Street, Dublin 2",
      phone: "+353 1 607 8110",
      address: "33 Harcourt Street, Dublin 2, D02 WC81",
      county: "Dublin",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Dean Group group; Events/Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Dean Group · Events/Weddings inbox · events email confirmed on official contact page (shared with Dean Docklands, specify property); verified 2026-07-16",
    },
    {
      id: "hotel-clontarf-castle-hotel",
      organisation: "Clontarf Castle Hotel",
      segment: "Hotels / wedding & events",
      contactName: "Monica Lopez",
      role: "Wedding Planner",
      email: "weddings@clontarfcastle.ie",
      website: "https://www.clontarfcastle.ie",
      location: "Clontarf, Dublin 3",
      phone: "+353 1 833 2321",
      address: "Castle Avenue, Clontarf, Dublin 3, D03 W5N0",
      county: "Dublin",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Independent · Weddings inbox · Monica Lopez named on the hotel's own wedding pages (Irish Hotel Awards Wedding Planner of the Year); verified 2026-07-16",
    },
    {
      id: "hotel-radisson-blu-royal",
      organisation: "Radisson Blu Royal",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "meetings.royal.dublin@radissonblu.com",
      website: "https://www.radissonhotels.com/en-us/hotels/radisson-blu-dublin",
      location: "Golden Lane, Dublin 8",
      phone: "+353 1 898 2900",
      address: "Golden Lane, Dublin 8, D08 VRR7",
      county: "Dublin",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Radisson group; Meetings/Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Radisson · Meetings/Events inbox · PARTIAL: radissonhotels.com 403s fetch, email corroborated only via search index, re-verify; name lead: Michelle Ebbs via Dublin Convention Bureau; verified what could be 2026-07-16",
    },
    {
      id: "hotel-hayfield-manor",
      organisation: "Hayfield Manor",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "enquiries@hayfieldmanor.ie",
      website: "https://www.hayfieldmanor.ie",
      location: "Cork City",
      phone: "+353 21 4845900",
      address: "Perrott Avenue, College Road, Cork, T12 HT97",
      county: "Cork",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Vertu group; General inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Vertu · General inbox · GENERIC INBOX, phone-first warm-up advised · no weddings email published, wedding enquiry form only (reservations@ also listed); verified 2026-07-16",
    },
    {
      id: "hotel-the-montenotte-hotel",
      organisation: "The Montenotte Hotel",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "events@themontenottehotel.com",
      website: "https://www.themontenottehotel.com",
      location: "Cork City",
      phone: "+353 21 4530050",
      address: "Middle Glanmire Road, Montenotte, Cork, T23 E9DX",
      county: "Cork",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Independent · Events inbox · PARTIAL: site behind Cloudflare CAPTCHA; events@ + Sonya McCarthy (Events Sales Executive) from search-indexed official pages, re-verify before send; verified what could be 2026-07-16",
    },
    {
      id: "hotel-the-river-lee",
      organisation: "The River Lee",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "Riverlee_Sales@doylecollection.com",
      website: "https://www.doylecollection.com/hotels/the-river-lee-hotel",
      location: "Cork City",
      phone: "+353 21 425 2700",
      address: "Western Road, Cork, T12 X2AH",
      county: "Cork",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Doyle Collection group; Sales inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Doyle Collection · Sales inbox · weddings form-only; sales inbox confirmed live on official meetings page (general riverlee@doylecollection.com); verified 2026-07-16",
    },
    {
      id: "hotel-the-imperial-hotel",
      organisation: "The Imperial Hotel",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "Events@imperialhotelcork.ie",
      website: "https://www.imperialhotelcork.com",
      location: "Cork City",
      phone: "+353 21 4274040",
      address: "76 South Mall, Cork, T12 A2YT",
      county: "Cork",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; Events/Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Independent · Events/Weddings inbox · events@ confirmed (obfuscated on-page, corroborated via indexed official pages; note site domain .com, email .ie); verified 2026-07-16",
    },
    {
      id: "hotel-the-galmont-hotel-spa",
      organisation: "The Galmont Hotel & Spa",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "weddings@thegalmont.com",
      website: "https://www.thegalmont.com",
      location: "Galway City",
      phone: "+353 91 538 300",
      address: "Lough Atalia Road, Galway, H91 CYN3",
      county: "Galway",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "MHL group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · MHL · Weddings inbox · weddings@ confirmed on official wedding pages; low-confidence lead: Roisin Gibbons, M&E Coordinator, via LinkedIn; verified 2026-07-16",
    },
    {
      id: "hotel-the-hardiman",
      organisation: "The Hardiman",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "weddings@thehardiman.ie",
      website: "https://www.thehardiman.ie",
      location: "Galway City",
      phone: "+353 91 564 041",
      address: "Eyre Square, Galway, H91 NFD2",
      county: "Galway",
      inboxType: "weddings",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Ascend group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Ascend · Weddings inbox · weddings@ confirmed in official weddings page source; verified 2026-07-16",
    },
    {
      id: "hotel-glenlo-abbey-hotel",
      organisation: "Glenlo Abbey Hotel",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "weddings@glenloabbey.ie",
      website: "https://www.glenloabbeyhotel.ie",
      location: "Bushypark, Galway",
      phone: "+353 91 519 600",
      address: "Bushypark, Galway, H91 XD8K",
      county: "Galway",
      inboxType: "weddings",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; General inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Independent · General inbox · GENERIC INBOX, phone-first warm-up advised · email upgraded to weddings@ per official weddings page (info@ remains general); lead: Kathryn Lavelle, Wedding and Events Sales Manager, self-described on Bridebook, verify on first call; verified 2026-07-16",
    },
    {
      id: "hotel-the-killarney-park-hotel",
      organisation: "The Killarney Park Hotel",
      segment: "Hotels / wedding & events",
      contactName: "Sheila O'Sullivan",
      role: "Director of Sales & Marketing",
      email: "info@killarneyparkhotel.ie",
      website: "https://www.killarneyparkhotel.ie",
      location: "Killarney, Kerry",
      phone: "+353 64 66 35555",
      address: "Town Centre, Killarney, Co. Kerry, V93 CF30",
      county: "Kerry",
      inboxType: "general",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; Reservations inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Independent · Reservations inbox · GENERIC INBOX, phone-first warm-up advised · OLD reservations@ not on current site (hotel reopened Apr 2025 post-renovation); info@ + concierge@ published; Sheila O'Sullivan named on official contact page; dated lead: Jennifer Mulcahy (weddings), verify; verified 2026-07-16",
    },
    {
      id: "hotel-the-brehon-hotel-spa",
      organisation: "The Brehon Hotel & Spa",
      segment: "Hotels / wedding & events",
      contactName: "Caitriona Ashe",
      role: "Wedding & Events Manager",
      email: "info@thebrehon.com",
      website: "https://www.thebrehon.com",
      location: "Killarney, Kerry",
      phone: "+353 64 663 0700",
      address: "Muckross Road, Killarney, Co. Kerry, V93 RT22",
      county: "Kerry",
      inboxType: "general",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Gleneagle group; Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Gleneagle · Events inbox · OLD events@ unconfirmed on current site; info@ is the published address, weddings@thebrehon.com per Cork Independent 2024-08-21; Caitriona Ashe named on official team page; verified 2026-07-16",
    },
    {
      id: "hotel-aghadoe-heights",
      organisation: "Aghadoe Heights",
      segment: "Hotels / wedding & events",
      contactName: "Siobhan O'Shea",
      role: "Sales and Marketing",
      email: "info@aghadoeheights.com",
      website: "https://www.aghadoeheights.com",
      location: "Killarney, Kerry",
      phone: "+353 64 663 1766",
      address: "Lakes of Killarney, Killarney, Co. Kerry, V93 DH59",
      county: "Kerry",
      inboxType: "general",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Independent · Weddings inbox · OLD weddingplanner@ not found on current site; siobhan.oshea@aghadoeheights.com published on official contact page; dated lead: Marie Janot, Wedding Planner, per Irish Examiner 2021; verified 2026-07-16",
    },
    {
      id: "hotel-harvey-s-point",
      organisation: "Harvey's Point",
      segment: "Hotels / wedding & events",
      contactName: "Samantha McNulty",
      role: "Weddings",
      email: "events@harveyspoint.com",
      website: "https://www.harveyspoint.com",
      location: "Lough Eske, Donegal",
      phone: "+353 74 972 2208",
      address: "Lough Eske, Donegal Town, Co. Donegal, F94 E771",
      county: "Donegal",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Independent · Events inbox · Samantha McNulty listed under WEDDINGS on official contact page with events@; general stay@harveyspoint.com; verified 2026-07-16",
    },
    {
      id: "hotel-lough-eske-castle",
      organisation: "Lough Eske Castle",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "weddings@lougheskecastlehotel.com",
      website: "https://www.lougheskecastlehotel.com",
      location: "Donegal Town",
      phone: "+353 74 972 5100",
      address: "Lough Eske, Donegal Town, Co. Donegal, F94 HX59",
      county: "Donegal",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Solis group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Solis · Weddings inbox · PARTIAL: site 403s fetch so weddings@ unconfirmed (still circulating); lead: Simon Petka, Wedding Sales Manager, simon.petka@lougheskecastlehotel.com per industry press, verify on first call; verified what could be 2026-07-16",
    },
    {
      id: "hotel-castlecourt-hotel",
      organisation: "Castlecourt Hotel",
      segment: "Hotels / wedding & events",
      contactName: "Vincent Nugent",
      role: "Wedding Coordinator",
      email: "mywedding@castlecourthotel.ie",
      website: "https://www.castlecourthotel.ie",
      location: "Westport, Mayo",
      phone: "+353 98 55088",
      address: "Castlebar Street, Westport, Co. Mayo, F28 NX84",
      county: "Mayo",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Westport Hotel Group group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Westport Hotel Group · Weddings inbox · Vincent Nugent named on official weddings page (weddingsonline Wedding Coordinator of the Year, Connaught); verified 2026-07-16",
    },
    {
      id: "hotel-lyrath-estate",
      organisation: "Lyrath Estate",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "weddings@lyrath.com",
      website: "https://www.lyrath.com",
      location: "Kilkenny City",
      phone: "+353 56 776 0088",
      address: "Lyrath Estate, Kilkenny, R95 F685",
      county: "Kilkenny",
      inboxType: "weddings",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Independent · Events inbox · email upgraded to weddings@ per official weddings page, weddings line +353 56 770 5845 (events@ is the M&E address); verified 2026-07-16",
    },
    {
      id: "hotel-killashee-hotel-spa",
      organisation: "Killashee Hotel & Spa",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "weddings@killasheehotel.com",
      website: "https://www.killasheehotel.com",
      location: "Naas, Kildare",
      phone: "+353 45 879277",
      address: "Killashee, Naas, Co. Kildare, W91 DC98",
      county: "Kildare",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "FBD Hotels group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · FBD Hotels · Weddings inbox · weddings@ confirmed via official site copy; name lead: Natalie Whelehan, Wedding Manager, via public LinkedIn, verify on first call; verified 2026-07-16",
    },
    {
      id: "hotel-faithlegg-hotel",
      organisation: "Faithlegg Hotel",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "reservations@faithlegg.com",
      website: "https://www.faithlegg.com",
      location: "Faithlegg, Waterford",
      phone: "+353 51 382000",
      address: "Faithlegg, Co. Waterford, X91 H008",
      county: "Waterford",
      inboxType: "reservations",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "FBD Hotels group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · FBD Hotels · Weddings inbox · OLD weddings@ no longer on current site (may still route, old FB post); published address is reservations@ + wedding enquiry form; verified 2026-07-16",
    },
    {
      id: "hotel-waterford-castle",
      organisation: "Waterford Castle",
      segment: "Hotels / wedding & events",
      contactName: "Gillian O'Dea",
      role: "Wedding & Events Coordinator",
      email: "weddings@waterfordcastleresort.com",
      website: "https://www.waterfordcastleresort.com",
      location: "Ballinakill, Waterford",
      phone: "+353 51 878 203",
      address: "The Island, Ballinakill, Co. Waterford, X91 Y722",
      county: "Waterford",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Independent group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Independent · Weddings inbox · 'Gillian' first-name-only on own site (Wedding Planner of the Year 2020, Irish Hotel Awards); surname via weddingsonline, confirm on first call; weddings@ mailto confirmed; verified 2026-07-16",
    },
    {
      id: "hotel-limerick-strand-hotel",
      organisation: "Limerick Strand Hotel",
      segment: "Hotels / wedding & events",
      contactName: "Olivia O'Connell",
      role: "Conference and Events Manager",
      email: "events@strandlimerick.ie",
      website: "https://www.strandhotellimerick.ie",
      location: "Limerick City",
      phone: "+353 61 421 800",
      address: "Ennis Road, Limerick, V94 03F2",
      county: "Limerick",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "MHL group; Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · MHL · Events inbox · official weddings page: 'email Kate or Olivia at events@strandlimerick.ie'; Olivia O'Connell titled on own weddings page; note email domain strandlimerick.ie vs site strandhotellimerick.ie; verified 2026-07-16",
    },
    {
      id: "hotel-slieve-russell-hotel",
      organisation: "Slieve Russell Hotel",
      segment: "Hotels / wedding & events",
      contactName: "",
      role: "Events / weddings manager",
      email: "sales@slieverussell.ie",
      website: "https://www.slieverussell.ie",
      location: "Ballyconnell, Cavan",
      phone: "+353 49 952 6444",
      address: "Ballyconnell, Co. Cavan, H14 FE03",
      county: "Cavan",
      inboxType: "sales",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Brady Hotels group; General/Events inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "4★ · Brady Hotels · General/Events inbox · official weddings page routes wedding enquiries to sales@ (enquiries@ remains general); verified 2026-07-16",
    },
    {
      id: "hotel-culloden-estate-spa",
      organisation: "Culloden Estate & Spa",
      segment: "Hotels / wedding & events",
      contactName: "Michelle Wells",
      role: "Senior Events Manager",
      email: "weddings@cull.hastingshotels.com",
      website: "https://www.cullodenestateandspa.com",
      location: "Holywood, Belfast (NI)",
      phone: "+44 28 9042 1066",
      address: "Bangor Road, Holywood, Belfast, BT18 0EX",
      county: "Down",
      source: "Top-50 Ireland research 2026-05-16 · enriched 2026-07-16",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "2026-05-19",
      personalisationNote: "Hastings group; Weddings inbox.",
      offerSent: "Founding Venue Programme",
      outcome: "",
      notes: "5★ · Hastings · Weddings inbox · Michelle Wells on official meet-the-team page (11 years); weddings direct line +44 28 9039 3010; weddings@ confirmed; verified 2026-07-16",
    },
    // ── Student book · Limerick campus anchors (verified on official sites 2026-07-16) ──
    {
      id: "student-ul-wolves-clubs-socs",
      organisation: "UL Wolves — Clubs & Societies Office",
      segment: "student",
      contactName: "Paul Lee",
      role: "Head of Student Engagement",
      email: "Paul.Lee@ul.ie",
      website: "https://ulwolves.ie",
      location: "Castletroy, Limerick",
      phone: "+353 61 237 762",
      address: "Students' Union Building, University of Limerick, Limerick, V94 T9PX",
      county: "Limerick",
      orgGroup: "University of Limerick",
      inboxType: "direct",
      tier: "36 clubs · 41 societies",
      source: "Campus anchor research 2026-07-16 (ulwolves.ie, ul.ie)",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "",
      personalisationNote: "Phase 1 proof campus; office is the door to every committee lead and treasurer.",
      offerSent: "Signal Student Edition",
      outcome: "",
      notes: "No general office email published (web form only); Paul Lee and Martin Ryan (General Manager, Martin.Ryan@ul.ie) named on official contact page",
    },
    {
      id: "student-tus-midwest-socs",
      organisation: "TUS Midwest — Clubs & Societies",
      segment: "student",
      contactName: "Treacy McIntyre",
      role: "Societies Officer",
      email: "socsofficer@tus.ie",
      website: "https://tus.ie/sport/clubs-socs/",
      location: "Moylish, Limerick",
      phone: "+353 61 293 000",
      address: "TUS Moylish Campus, Moylish Park, Limerick, V94 EC5T",
      county: "Limerick",
      orgGroup: "TUS Midwest",
      inboxType: "direct",
      tier: "",
      source: "Campus anchor research 2026-07-16 (tus.ie)",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "",
      personalisationNote: "Phase 1 proof campus; societies officer named with a direct inbox on the official page.",
      offerSent: "Signal Student Edition",
      outcome: "",
      notes: "Phone is campus reception; SU alternative sumidwest@su.tus.ie unverified on official page",
    },
    {
      id: "student-mic-misu",
      organisation: "MISU — Mary I Students' Union",
      segment: "student",
      contactName: "",
      role: "Clubs & Socs Coordinator (via SU office)",
      email: "StudentsUnion@mic.ul.ie",
      website: "https://misu.ie",
      location: "South Circular Road, Limerick",
      phone: "+353 61 400 013",
      address: "TARA Building, Mary Immaculate College, South Circular Rd, Limerick, V94 4D85",
      county: "Limerick",
      orgGroup: "Mary Immaculate College",
      inboxType: "general",
      tier: "",
      source: "Campus anchor research 2026-07-16 (misu.ie)",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "",
      personalisationNote: "Phase 1 proof campus; coordinator post exists but no direct email published — general SU inbox first.",
      offerSent: "Signal Student Edition",
      outcome: "",
      notes: "Society count not published; coordinator sits in MISU main office",
    },
    // ── School book · Limerick secondary anchors (verified on official sites 2026-07-16) ──
    {
      id: "school-castletroy-college",
      organisation: "Castletroy College",
      segment: "school",
      contactName: "Brian O'Donoghue",
      role: "Principal",
      email: "admin@castletroycollege.ie",
      website: "https://www.castletroycollege.ie",
      location: "Castletroy, Limerick",
      phone: "+353 61 330 785",
      address: "Newtown, Castletroy, Co. Limerick, V94 6D85",
      county: "Limerick",
      orgGroup: "LCETB",
      inboxType: "general",
      tier: "1,200+ students",
      source: "School anchor research 2026-07-16 (castletroycollege.ie)",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "",
      personalisationNote: "Large co-ed LCETB school; staff-only offer, zero pupil data leads every mention.",
      offerSent: "Signal School Edition",
      outcome: "",
      notes: "Principal named on official homepage",
    },
    {
      id: "school-ardscoil-ris",
      organisation: "Ardscoil Rís",
      segment: "school",
      contactName: "Tom Prendergast",
      role: "Principal",
      email: "asroffice@ardscoil.com",
      website: "https://www.ardscoil.com",
      location: "North Circular Road, Limerick",
      phone: "+353 61 453 828",
      address: "North Circular Road, Limerick, V94 V602",
      county: "Limerick",
      orgGroup: "Edmund Rice Schools Trust",
      inboxType: "general",
      tier: "70+ staff",
      source: "School anchor research 2026-07-16 (ardscoil.com)",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "",
      personalisationNote: "Boys' voluntary secondary; 51 teachers listed on official staff page — right at the 60-account shape.",
      offerSent: "Signal School Edition",
      outcome: "",
      notes: "Principal and staff size verified on official staff page",
    },
    {
      id: "school-laurel-hill-colaiste",
      organisation: "Laurel Hill Coláiste FCJ",
      segment: "school",
      contactName: "Úna Uí Ghríofa",
      role: "Príomhoide / Principal",
      email: "reception@laurelhillcolaistefcj.ie",
      website: "https://www.laurelhillcolaistefcj.ie",
      location: "Laurel Hill, Limerick",
      phone: "+353 61 313 636",
      address: "Cnoc na Labhras, Limerick, V94 CR26",
      county: "Limerick",
      orgGroup: "FCJ",
      inboxType: "general",
      tier: "~45–50 staff",
      source: "School anchor research 2026-07-16 (laurelhillcolaistefcj.ie)",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "",
      personalisationNote: "All-Irish girls' secondary; distinct from the English-medium Laurel Hill FCJ on the same campus.",
      offerSent: "Signal School Edition",
      outcome: "",
      notes: "Principal from official staff page; roll 64270P",
    },
    {
      id: "school-crescent-college",
      organisation: "Crescent College Comprehensive SJ",
      segment: "school",
      contactName: "Diarmuid Mullins",
      role: "Principal",
      email: "info@crescentsj.com",
      website: "https://www.crescentsj.com",
      location: "Dooradoyle, Limerick",
      phone: "+353 61 229 655",
      address: "Dooradoyle, Limerick, V94 W6W8",
      county: "Limerick",
      orgGroup: "Jesuit",
      inboxType: "general",
      tier: "",
      source: "School anchor research 2026-07-16 (crescentsj.com)",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "",
      personalisationNote: "Co-ed Jesuit comprehensive; three deputy principals named on the contact page.",
      offerSent: "Signal School Edition",
      outcome: "",
      notes: "Deputies: Sinéad Mulcahy, Hugh Flavin, Gráinne Delaney",
    },
    {
      id: "school-colaiste-chiarain",
      organisation: "Coláiste Chiaráin",
      segment: "school",
      contactName: "Gerard O'Sullivan",
      role: "Principal",
      email: "admin@cco.ie",
      website: "https://cco.ie",
      location: "Croom, Limerick",
      phone: "+353 61 397 700",
      address: "Croom, Co. Limerick, V35 XN29",
      county: "Limerick",
      orgGroup: "LCETB",
      inboxType: "general",
      tier: "",
      source: "School anchor research 2026-07-16 (cco.ie)",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "",
      personalisationNote: "Co-ed LCETB secondary; principal has a published direct inbox — rare, use it.",
      offerSent: "Signal School Edition",
      outcome: "",
      notes: "principal@cco.ie published on official contact page alongside admin@",
    },
    {
      id: "school-villiers",
      organisation: "Villiers School",
      segment: "school",
      contactName: "Jill A. Storey",
      role: "Head of School",
      email: "info@villiers-school.com",
      website: "https://www.villiers-school.com",
      location: "North Circular Road, Limerick",
      phone: "+353 61 451 447",
      address: "North Circular Road, Limerick, V94 F983",
      county: "Limerick",
      orgGroup: "Independent",
      inboxType: "general",
      tier: "",
      source: "School anchor research 2026-07-16 (partial — site blocks automated fetch)",
      status: "To Contact",
      lastContacted: "",
      nextFollowUp: "",
      personalisationNote: "Independent boarding/day school; VERIFY contact page manually before first send.",
      offerSent: "Signal School Edition",
      outcome: "",
      notes: "PARTIAL VERIFICATION — details from indexed official pages, not a live fetch; secretary@ and admissions@ also exist",
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
      relatedObject: "Cycle 8.5, Lamb's Hill send",
      notes: "Per CYCLE_8_5_HANDOFF.md §Operator action #1. Clerk dashboard → endpoint → roll secret → `vercel env rm` + `add CLERK_WEBHOOK_SIGNING_SECRET production --sensitive` → redeploy if needed. Blocks send to Sinéad. Without it, new sign-ups get a Clerk session but no users/workspaces row, fallback provisioner now covers it, but webhook is the long-term fix.",
    },
    {
      id: "pilot-block-incognito-walk",
      action: "Walk one redemption end-to-end in incognito.",
      category: "Operations",
      priority: "High",
      dueDate: "2026-05-14",
      status: "To do",
      relatedObject: "Cycle 8.5, Lamb's Hill send",
      notes: "Per CYCLE_8_5_HANDOFF.md §Operator action #2. Use one of the 3 seeded LAMBSHIL test codes (MP93X, 7U2DF, M52XX), not Sinéad's batch. Verify: /redeem/CODE → Clerk sign-up with venue strip → return to /redeem → /app/board?welcome=venue&v=lambs-hill → rose result card. Last failed walk surfaced 3 defects beneath the bridge 500, don't ship without re-walking.",
    },
    {
      id: "pilot-block-dkim-finalize",
      action: "Finalise DKIM generation in Google Workspace Admin Console.",
      category: "Operations",
      priority: "High",
      dueDate: "2026-05-14",
      status: "To do",
      relatedObject: "Cycle 8.5, Lamb's Hill send",
      notes: "Per project_email memory. Domain verified, alias added, DKIM still pending. Ethan generates the key in Admin Console; agent adds the DNS record via Vercel API. Without DKIM, hello@signalstudio.ie deliverability to Sinéad is at risk.",
    },
    {
      id: "pilot-block-operator-test-send",
      action: "Test-send Sinéad email template to operator inbox.",
      category: "Operations",
      priority: "High",
      dueDate: "2026-05-14",
      status: "To do",
      relatedObject: "Cycle 8.5, Lamb's Hill send",
      notes: "Draft staged at signal-growth/outbound/lambs-hill-pilot-send.md (uncommitted, awaiting Ethan voice rewrite). Send to operator inbox first, verify deliverability (DKIM active), CSV attachment formatting, all 10 LAMBSHIL codes correctly listed, subject line renders as intended. Only after this passes: send to Sinéad.",
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
