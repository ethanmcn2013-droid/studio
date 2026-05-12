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
  updatedAt: "2026-05-15T03:30:00Z",
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
    ],
  },
  products: [
    {
      id: "tasks",
      name: "Signal Tasks",
      layer: "Execution",
      role: "What needs doing, who owns it, when it matters, and what is stuck.",
      maturity: 84,
      status: "Private preview",
      uxPolish: 80,
      integrationScore: 60,
      launchReadiness: 76,
      majorFeatures: ["Workspace", "task list", "views", "auth", "persistence", "audience pages", "Cross-repo Notes extract endpoint (POST /api/notes-extract, Cycle 43, 2026-05-12)", "Real invite flow + pending invites panel with Resend/Revoke (Sprint 2 Cycle 10.1, 2026-05-12)", "Plain-English workspace activity log (Sprint 2 Cycle 10.4, 2026-05-12) — last 10 changes as human prose, grouped consecutive same-(user, kind) events within 10 min", "Anatomy-of-a-card section rebuilt as motion-grade interactive surface (2026-05-12) — motion v12, 14s live loop on demo card (comment tick → lock outline draws → EM avatar joins with DV squash → idle⇄live pill morph → due countdown → typing → presence leaves), bidirectional hover spotlight (card chip ⇄ index row), card lifts on spring (scale 1.04), MotionConfig reducedMotion=user, useInView pauses loop offscreen"],
      blockers: ["Cross-product object links are not yet visible.", "Operator action: ALTER TABLE tasks ADD COLUMN source_note_id TEXT + NOTES_TO_TASKS_SECRET env var (cross-repo edge prerequisites)."],
      notes: "Sprint 2 cycles 10.1 + 10.4 closed 2026-05-12. 10.1: gesture #1 one-click invite real on the live surface. 10.4: gesture #4 plain-English activity log rendered in settings → Members tab; visible to all members, not owner-gated; uses the existing activities table (no new schema), groups consecutive same-(user, kind) events within 10 min, prose covers all 8 ActivityKinds. Cycle 43 (cross-repo Notes write surface) also today. Suite Hardening Pass 2026-05-12 (commits 7e7bfbd · 0e4528c · 30793b8): workspace guards added to 5 server actions (toggleComplete/reorder/move/getTaskConversation/getSubtasks — closes a multi-tenant ID-enumeration leak); getCurrentUser() throws in prod when Clerk unconfigured (was silently returning hardcoded 'david'); getCurrentUserOrNull() wrapper added for public routes (/invite/[token] + /api/roadmap.ics) to render gracefully unauth instead of 500; CRON_SECRET cron auth now timing-safe + ?user= override locked down; share + invite tokens upgraded to CSPRNG (128/256-bit); /api/health/digest endpoint added + allowed through proxy for status-page probe.",
      nextActions: ["Sprint 2 Cycle 10.7: source attribution wired to real numbers (the only remaining cycle — 10.5 + 10.6 already killed via HQ decisions).", "Cross-product object links surface so a venue can hop Notes → Tasks → Roadmap workspace without manual URL juggling.", "Operator action: ALTER TABLE tasks ADD COLUMN source_note_id TEXT (Tasks Turso) + NOTES_TO_TASKS_SECRET env var on Notes + Tasks (matching)."],
    },
    {
      id: "roadmap",
      name: "Signal Roadmap",
      layer: "Direction",
      role: "Where the work is going, what changed, and what people should expect.",
      maturity: 74,
      status: "Private preview",
      uxPolish: 78,
      integrationScore: 42,
      launchReadiness: 66,
      majorFeatures: ["Workspace creation", "editor", "public viewer (Cycle 8 — GTM-beat redesign)", "shared update page", "milestones as first-class section with per-milestone progress + T-N countdown", "bold-in-markdown promotes items to milestones (parser)", "item→milestone soft linkage in list view (Cycle 9 — '→ for <milestone>' line, deduped per contiguous group)", "hero dial gated on hasMomentum (Cycle 10 — ≥5 items or ≥1 milestone earns the dial; below threshold, single understated 'N of M shipped' line)", "meta-strip brand primitive carries the uppercase identity/timeline/count rhythm across workspace, project-detail, and refusals heroes (Cycle 11)", "BigStat brand primitive — values-first tabular stat treatment, shared across workspace + project-detail heroes (Cycle 12)", "cinematic homepage demo (cycle 11.3)", "Public guest-view attribution + last-updated (Sprint 2 cycle 10.2, 2026-05-12)", "Invited-by bar + mailto reply on /update (Sprint 2 cycle 10.3, 2026-05-12)"],
      blockers: ["Confidence and change history need a sharper model.", "Optional: backfill owner_name + owner_email for pre-Sprint-2 workspaces (columns applied to prod Turso 2026-05-12; existing workspaces fall back gracefully when null)."],
      notes: "Sprint 2 cycle 10.3 closed 2026-05-12 — /[workspaceSlug]/update gained InvitedByBar component: '{Name} shared this with you' eyebrow + description + last-updated + Reply by email button (mailto). Reply is mailto-only — locked refusal on comment-thread infrastructure holds. Schema added ownerEmail alongside ownerName, both captured from Clerk on workspace creation. Demo data: hello@signalstudio.ie + aoife@harbourhouse.example. Existing workspaces fall back gracefully when fields are null. Cycle 10.2 (slim attribution on /[workspaceSlug] hero) also closed earlier in the day. Suite Hardening Pass 2026-05-12 (commits d82e4f6 · a9c9eec): security headers added to next.config.ts (was empty — Plan 4 had missed Roadmap); CSP Report-Only with Clerk hosts allowlisted; getActivityForTask() now requires workspaceSlug (closes cross-tenant enumeration); requireUser() redirects to /sign-in in prod when Clerk unconfigured (was returning 'dev-user'); rate-limiter fails closed in prod on Upstash outage; isPublic + shareToken columns dropped from projects schema (locked refusal: 'public IS the architecture' — migration 0001_drop_isPublic_shareToken.sql applied to Turso prod 2026-05-12, 5 projects preserved); workspaces.owner_name + owner_email columns applied to prod Turso same day (closed pre-existing migration debt from cycles 10.2/10.3 that was 500ing /[workspaceSlug] in prod). Phase 10.2 (activity-table deletion) was REVERSED before any migration ran — cross-repo writer log-cycle.ts had 30 rows in prod that the in-repo grep missed; table preserved, getActivityForTask hardened in place instead. 30 rows of cycle history intact.",
      nextActions: ["Confidence + change-history model — the deepest backlog item, still untouched.", "Optional: backfill owner_name + owner_email for pre-Sprint-2 workspaces via UPDATE statement (columns now exist in prod Turso).", "CSP enforce-mode promotion across suite (still Report-Only across all four products)."],
    },
    {
      id: "analytics",
      name: "Signal Analytics",
      layer: "Attention",
      role: "What needs focus before it becomes a problem.",
      maturity: 90,
      status: "Private preview",
      uxPolish: 84,
      integrationScore: 78,
      launchReadiness: 84,
      majorFeatures: ["cinematic homepage demo (cycle 11.4)", "Phase A · Settings + opt-out (2026-05-13) — Clerk auth, /app/* middleware, Turso/libSQL user_preferences, /app/settings/notifications (daily/weekly default/off), public /u/[token] landing, RFC 8058 /api/unsubscribe/[token] one-click POST + GET, token rotation on every unsubscribe", "Phase B.1 · Briefing engine + /app/brief on mock data (2026-05-13) — 4 triggers (stuck-work · due-soon · just-shipped · overload), 3 prose phrasings each rotating per (user, day), Suggested Focus ranking, hard 3-cap per bucket, shared <BriefingView/> render tree, BriefingSource interface", "Phase C · Email + cron + List-Unsubscribe (2026-05-13) — <BriefingEmail/> via @react-email/components matching <BriefingView/> hierarchy, dispatchBriefing() refuses on empty briefing + no-key, rotates unsubscribeToken on every send, RFC 8058 List-Unsubscribe + List-Unsubscribe-Post:One-Click headers, /api/cron/briefings Bearer auth, vercel.json cron 0 6 * * *, /app/preview-email sandboxed iframe", "Phase C polish · Email v2 (2026-05-13) — calm Daily Signal · Tue 12 May subject (kills 'overdue' spam trigger + 'Signal' brand violation), plain-text multipart alternative, Reply-To header, wordmark header strip, per-bucket accent dots + 2px left borders (attention amber-orange · moving-well green · risks brand violet), shape-of-the-day summary line under greeting, italic grace-note sign-off, mono provenance line, explicit brand-promise footer", "Phase D · /app shell + Send-test (2026-05-13) — /app/app/layout.tsx chrome (suite-launcher + analytics wordmark + Clerk avatar with suite-jump dropdown), Send a test now button on settings (sendTestBriefingAction runs through the same dispatch pipeline as cron, status pill reports outcome)", "Phase B.2 · Real Tasks DB read (2026-05-13) — tasksDbSource joins Tasks Turso DB by EMAIL (Tasks + Analytics live in separate Clerk apps), maps lane todo/doing/review/done → next/in-flight/in-flight/shipped, priority P0..P3 → 0..3, 'from Tasks · {workspace.name}' provenance; get-source.ts runtime factory selects real or mock based on TASKS_DATABASE_URL presence; verified end-to-end against owner's Personal workspace (14 live tasks)", "Phase E.1 · Personalised greeting + middleware→proxy (2026-05-13) — 'Good morning, Ethan.' when Clerk firstName available, graceful fallback to impersonal; clerkClient.users.getUser() per fanout iteration with try/catch null; src/middleware.ts → src/proxy.ts kills Next 16 deprecation warning", "Phase E.2 · /app/brief cinematic polish (2026-05-13) — motion v12 entry stagger (greeting → summary → bucket headers → items at 60-80ms intervals, ~800ms reveal budget), reader-cursor hover (2px brand-violet left border on hovered item, 45% opacity dim on siblings, lifted from marketing demo's cursor pattern), motion accordion replacing browser <details> for why-this (90° arrow rotation, outExpo height ease, 60ms internal reason stagger), live indicator chip (green pulse 2.4s) + ambient focus mark (violet pulse 3.2s); MotionConfig reducedMotion='user' wraps the whole view", "Phase E.3 · Engine unit tests (2026-05-13) — 35 tests across triggers.test.ts (21) + build.test.ts (14) via Node built-in test runner + tsx; covers boundary conditions on all 4 detectors, severity ordering, bucket caps, dedup, focus ranking, prose rotation determinism, Wedding 2026 regression shape; 531ms runtime; engine math now defended for future trigger expansion", "Phase B.3 · Real movedToShippedAt from activities (2026-05-13) — replaced v1 heuristic with subquery into Tasks activities table (MAX(created_at)*1000 where kind IN ('toggleComplete', 'move')); just-shipped trigger now fires from honest data instead of guessing. Real-world finding: owner's current Tasks DB has only 18 taskAdd activities and no toggleComplete/move records — trigger fires correctly but rarely; brand promise (never claim what data doesn't prove) favours strict correctness over false-positive frequency. Tasks-side audit complete: toggleCompleteAction writes activities correctly — seed scripts bypass and create tasks pre-done, which explains the gap (no bug)", "Phase F.1 · Trigger library 4 → 6 (2026-05-14) — crowded-week (≥3 open tasks due in 7 days → synthetic signal in Needs attention, the cluster IS the signal; lands earlier than due-soon's per-task ≤2-day window) + blocked-too-long (blocked + idle≥5 → Quiet risks, closes the gap left by stuck-work which deliberately excludes blocked tasks). Focus weights locked: due-soon 1000 / crowded-week 800 / stuck-work 700 / blocked-too-long 600 / overload 500 / just-shipped 100. prose.test.ts NEW (29 tests) every trigger × every rotation slot exercised + no-chart-language voice guard", "Phase F.2 · Name-the-blocker + buildBriefing orchestration tests (2026-05-14) — blocked-too-long brief items now read 'Florist deposit has been blocked by Music supplier for 9 days'; build.ts constructs {taskId→title} map once and threads resolved titles to prose via context; graceful fallback when title isn't resolvable; +7 orchestration tests through buildBriefing locking crowded-week + blocked-too-long routing and name-the-blocker resolution", "Phase F.3 · Dispatch error-branch tests via DI + multi-blocker phrasing (2026-05-14) — dispatchBriefing accepts optional sender:EmailSender for lightweight DI; default path constructs Resend client from RESEND_API_KEY unchanged; 13 dispatch tests cover empty/no-key refusals + error branch + wire contract (Reply-To, List-Unsubscribe + List-Unsubscribe-Post:One-Click, cadence prefix subject, multipart html+text). Email contract now load-bearing test code", "Phase F.4 · Multi-blocker voice tune + plain-text coverage + CONTRIBUTING (2026-05-14) — phrasing now reads naturally by blocker count: 1→'blocked by X', 2→'blocked by X and Y' (both named), 3+→'blocked by X and N more'. plain-text.ts branch coverage 72.73 → 88.00 via SUGGESTED FOCUS + weekly-cadence footer tests. CONTRIBUTING.md documents the server-only/Node-test trap + the stray pnpm-lock.yaml trap + architecture quick map"],
      blockers: ["Claims must stay tied to what the private preview proves — cycle 11.4 demo dramatizes 'Why this?' rule-chain + 'Mark done' acknowledge gesture; production briefing exposes them on web only (Phase B.1 BriefingView), email skips them by locked v1 contract.", "First-send-was-spam reputation on owner's Gmail — one manual 'Not spam' click rebuilds. Sender reputation on a freshly-verified domain needs warm-up; future sends should land inbox once Gmail sees the user engage with one email.", "Send-time still single global 06:00 UTC slot — fine for EU audiences, acknowledged limitation for US users. Revisit on first US-user complaint."],
      notes: "Live end-to-end on analytics:main as of 2026-05-14. Six-trigger engine (stuck-work · due-soon · just-shipped · overload · crowded-week · blocked-too-long), per-(user, day) prose rotation across 18 phrasings, real Tasks DB read by email-key, real React Email render with calm Daily Signal subject + plain-text alt + Reply-To + RFC 8058 List-Unsubscribe + List-Unsubscribe-Post:One-Click, per-send token rotation only on Resend success, Vercel cron at 06:00 UTC daily + Mondays weekly. Full kill-switch wired through (footer link + Gmail native unsubscribe button + brand-faithful 'You're off.' landing). /app shell + Send-test button + cinematic motion-graphic /app/brief. Personalised greeting (Clerk firstName with graceful fallback). 119/119 tests passing in ~1s, 96.92% line / 86.72% branch / 98.65% function coverage. Email contract is now load-bearing test code (Reply-To, List-Unsubscribe headers, subject prefix, multipart all asserted). CONTRIBUTING.md documents the server-only/Node-test trap + pnpm-lock trap. Cycle 11.4 cinematic demo still live on marketing. Outstanding owner items: 'Not spam' click on owner Gmail to rebuild sender reputation, rotate CRON_SECRET (current one in chat history), toggle Sensitive flag on 5 encrypted Vercel vars via dashboard, delete test_owner-self user_preferences row after signing in via Clerk.",
      nextActions: ["Owner: 'Not spam' click on owner Gmail (rebuilds sender reputation); rotate CRON_SECRET (current one burned in chat history); toggle Sensitive flag on 5 encrypted Vercel vars (TURSO_ANALYTICS_AUTH_TOKEN · TASKS_AUTH_TOKEN · CLERK_SECRET_KEY · RESEND_API_KEY · CRON_SECRET) via dashboard; delete 'test-owner-self' user_preferences row after signing in via Clerk.", "First non-owner beta user — highest-leverage move left; deliverability and brief-utility data only become real once a second inbox is in the loop.", "Audit demo-vs-reality: 'Why this?' web view exposes per-item reasons[]; cycle 11.4 marketing demo still dramatizes more than the engine produces. Either ship the additional reasoning surfaces or temper the demo.", "Optional polish: vary multi-blocker prose by named blocker count (currently 1/2/3+ shapes are good but voice could ladder further)."],
    },
    {
      id: "notes",
      name: "Signal Notes",
      layer: "Context",
      role: "What was said, decided, learned, captured, and turned into work.",
      maturity: 78,
      status: "Private preview",
      uxPolish: 72,
      integrationScore: 58,
      launchReadiness: 72,
      majorFeatures: ["Next.js 16 scaffold", "Turso + Drizzle server persistence", "suite-wide Clerk auth (live)", "auth-gated /app", "sign-in / sign-up routes", "notebook surface with optimistic UI", "private empty-state copy", "private-by-default product treatment", "collapsible search rail with ⌘K", "wordmark gesture", "anti-feature register", "homepage", "wedding planning demo", "Draft action gesture (Cycle 9.4b extraction-half, 2026-05-12)", "Cross-repo send to Tasks (Cycle 9.4b second half, 2026-05-12) — POST /api/notes-extract on Tasks, shared bearer auth, idempotent on (userId, noteId)"],
      blockers: ["Production env + migrations pending: ALTER TABLE notes ADD COLUMN extract_body TEXT (Notes Turso), ALTER TABLE tasks ADD COLUMN source_note_id TEXT (Tasks Turso), NOTES_TO_TASKS_SECRET env var on both Notes and Tasks (Vercel) — same secret value. Until those land, Send to Tasks will SQL-error or 401.", "First-sign-in onboarding empty state could be sharper (Cycle 9.3).", "FTS5 server-side search is a later polish — client-side filter is fast for corpora < 1000 notes."],
      notes: "Cycle 9.4b shipped end-to-end 2026-05-12 — extraction-half (Draft action gesture in /app) plus second half (cross-repo write to Tasks). The note → task edge is real: drafted extract → Send to Tasks → POST /api/notes-extract → task created in user's first workspace → promoted_task_id stored → 'Sent to [workspace]' state with deep link back. Privacy guardrail held: only extract_body crosses; raw note bodies stay private. Idempotency via source_note_id keyed as {userId}:{noteId}. Cycle 11.5 cinematic demo previously dramatized this gesture; product now matches marketing.",
      nextActions: ["Run prod migrations: ALTER TABLE notes ADD COLUMN extract_body TEXT and ALTER TABLE tasks ADD COLUMN source_note_id TEXT via Turso CLI.", "Set NOTES_TO_TASKS_SECRET on Notes + Tasks Vercel projects (same value, server-only).", "Walk Send to Tasks end-to-end on the live deploys once env + migrations land.", "Cycle 9.3: first-sign-in onboarding empty state."],
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
      status: "Partly working",
      health: "Clear",
      nextAction: "Verify the live four-layer wedge demo end-to-end (remix wedding → toast → roadmap onboarding → seeded workspace). Then design the non-template task-to-milestone link.",
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
      status: "Idea",
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
      status: "Idea",
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
      status: "Idea",
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
      status: "Idea",
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
      status: "Idea",
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
      score: 78,
      weight: 5,
      status: "Needs attention",
      notes: "Unified Signal Studio pricing shipped 2026-05-12: signalstudio.ie/pricing (Free / Workspace €12mo / Event €79 one-time / Student .edu-free). Per-product /pricing routes on Tasks + Roadmap + Analytics all retired and 308-redirect to umbrella; in-product Pricing links across all three repos repointed to umbrella URL. In-app Tasks upsell renamed Team → Workspace. The umbrella is now the single canonical pricing surface in the suite.",
      blockers: ["Shared entitlements layer across Tasks + Roadmap not yet built — single Stripe price ID + shared Turso entitlements table needed so one umbrella checkout unlocks both apps. Until then, new Workspace-tier signups effectively pause (acceptable: private preview, no live conversion to disrupt)."],
      nextAction: "Architect the shared entitlements layer; design grandfather migration for existing Tasks subscribers (price-lock at current rate, no forced upgrade); wire one Stripe product/price that both Tasks + Roadmap entitlement gates check.",
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
      assetsNeeded: ["60 second demo render (script locked at docs/CYCLE_8_WEDDING_DEMO_SCRIPT.md)"],
      startDate: "2026-05-13",
      endDate: "2026-06-30",
      currentBlocker: "Two hard gates set 2026-05-12: (1) 10-venue list assembled by 2026-05-15; (2) three venue conversations booked by 2026-06-02. If gate 1 slips, polish work stops and the cycle becomes a venue-sourcing cycle - that is the more honest problem. Outreach kit, venue-list scaffold, and conversation guide all live in signal-growth/outbound/; the 10 venue names are Ethan-input.",
      nextStep: "By Fri 2026-05-15: 10 named venues into signal-growth/outbound/wedding-venue-list.md (coordinator + email + reason-this-venue must pass the sendable-to-any-other-venue test). By Mon 2026-05-19: first outreach batch sent (2/day, 5 weekdays) via wedding-venue-outreach-kit.md. By Tue 2026-06-02: three venue conversations on calendar (accepted, not just replied). Conversation guide in venue-conversation-guide.md is the shape for the call.",
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
      notes: "Four-layer walkable end-to-end as of 2026-05-12. Canonical source at `studio/src/lib/templates/wedding-planning-workspace/` (five-file artefact). Tasks remix creates workspace with template_id + 18 seeded tasks; remix toast carries Create-a-Roadmap link → /onboarding/from-template/wedding-planning-workspace → seeded Roadmap workspace with one Planning Roadmap project + 8 items. T-2.2 (Notes lazy expression) + T-2.3 (Analytics, dormant) still owed. Full session report at `studio/docs/TEMPLATES_HANDOFF.md`.",
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
      notes: "Now framed as the `final-paper-sprint` anchor template — lift the existing Tasks-only template to four-layer in Cycle T-4.",
    },
    {
      id: "trades-job-pipeline",
      name: "Trades job pipeline workspace",
      targetSegment: "Tradespeople / installers / small contractors",
      status: "Idea",
      useCase: "Quote, job, invoice, follow-up — without losing the next job in the inbox.",
      includedProducts: ["Tasks", "Notes", "Roadmap", "Analytics"],
      landingPageUrl: "",
      relatedCampaign: "TBD",
      activationGoal: "Tradesperson runs one real job through quote → invoice in the workspace.",
      notes: "Anchor template #2 in the five-archetype lineup locked 2026-05-12. Build target: Cycle T-3.",
    },
    {
      id: "freelance-client-engagement",
      name: "Freelance client engagement workspace",
      targetSegment: "Freelancers / solo consultants",
      status: "Idea",
      useCase: "Onboarding, milestones, deliverables, invoicing — for one client at a time.",
      includedProducts: ["Tasks", "Notes", "Roadmap", "Analytics"],
      landingPageUrl: "",
      relatedCampaign: "TBD",
      activationGoal: "Freelancer onboards one real client through the workspace.",
      notes: "Anchor template #4. Seed from existing `new-client-onboarding` Tasks template. Build target: Cycle T-5.",
    },
    {
      id: "local-business-monthly-rhythm",
      name: "Local business monthly rhythm workspace",
      targetSegment: "Small-business operators (café, dental practice, local florist, salon)",
      status: "Idea",
      useCase: "Four lanes — invoices, orders, admin, marketing — the actual monthly job of a small operator.",
      includedProducts: ["Tasks", "Notes", "Roadmap", "Analytics"],
      landingPageUrl: "",
      relatedCampaign: "TBD",
      activationGoal: "Operator runs one real month through the workspace.",
      notes: "Anchor template #5. Swapped from `small-business-marketing-month` 2026-05-12 — marketing-month is project-manager voice (category claim); monthly-rhythm is operator-real. Build target: Cycle T-6.",
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
      successCriteria: [
        "10 named venues compiled by 2026-05-15 (input gate)",
        "First outreach batch sent by 2026-05-19",
        "Three venue conversations on calendar by 2026-06-02 (output gate)",
        "One active venue workspace by 2026-06-30",
      ],
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
      id: "unified-pricing",
      decision: "Converge on a single Signal Studio price covering all four products.",
      category: "Pricing",
      date: "2026-05-12",
      reason: "Per-product pricing pages contradict the one-ecosystem-four-layers brand position. The 80% audience does not want to translate between products at checkout. Bundle pricing IS the disciplined refusal; per-product pricing is the incumbent move.",
      alternatives: "Keep per-product tiers under one brand; cross-product credit at depth; two-product bundle (Tasks + Roadmap only) until Notes and Analytics ship.",
      risks: "Notion-trap perceived overpay if users only use one of the four. Vapor risk if marketing copy overclaims pre-ship — answered by the shipping-truth pane and never listing unshipped features. Tier ceiling lower than a per-product power-user model.",
      reviewDate: "2026-08-12",
      status: "Active",
      relatedObjects: ["Signal Studio", "Signal Tasks", "Signal Roadmap", "Signal Analytics", "Signal Notes"],
      notes: "Four tiers by relationship to work, not product: Free / Workspace €12mo / Event €79 one-time / Student .edu-free. Existing Tasks subscribers grandfather forever. Single pricing surface live at signalstudio.ie/pricing as of 2026-05-12; tasks/roadmap/analytics /pricing routes 308-redirect to umbrella; all in-product Pricing links across the suite repoint to the umbrella URL. Notes has no pricing surface yet (was never built).",
    },
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
      id: "brand-guide-d01-committed",
      decision: "Brand guide D01 (Refined Indigo Dot) locked. Per-product gestures update: tasks=pulse, roadmap=slide, analytics=tick, notes=caret, umbrella=pulse-slow. Mark grammar: Geist 500, dot 0.16em indigo at baseline. Same construction from 16px favicon to billboard.",
      category: "Brand",
      date: "2026-05-11",
      reason: "Brand guide handoff from Claude Design canvas committed D01 as the direction. Two gesture changes from prior BRAND.md §4: analytics (static→tick) and notes (underline-writes→caret). The caret choice aligns Notes's wordmark with its own capture caret — same blinking-cursor language brand-to-product.",
      alternatives: "Stay on prior BRAND.md §4 mappings (analytics=static, notes=underline-writes). Or commit to one of the three rejected directions (D02 quadrant, D03 mono wordmark, D04 serif Fraunces monogram).",
      risks: "Wordmark refactor touches four product repos plus studio. If gestures aren't applied consistently, the four-temporality framework breaks. Notes was just rebuilt (Cycle 9.4a.2) — re-touching the wordmark same-day risks visual churn.",
      reviewDate: "2026-06-25",
      status: "Active",
      relatedObjects: ["studio/docs/brand-guide/BRAND_GUIDE_HANDOFF.md", "BRAND.md §4", "Wordmark components across 5 repos"],
      notes: "Rollout sequence in BRAND_GUIDE_HANDOFF.md: 11.1 Notes (closed) → 11.2 Studio umbrella → 11.3 Analytics → 11.4 Tasks+Roadmap verification → 11.5 universal dot vocabulary → 11.6 favicons.",
    },
    {
      id: "sprint-2-collaboration-locked",
      decision: "Sprint 2 = Collaboration moat. Five gestures, seven cycles, Tasks + Roadmap only.",
      category: "Product",
      date: "2026-05-11",
      reason: "Collaboration is the brand's structural moat: 'the invited person feels nothing.' The five gestures (one-click invite, no-signup guest view, 'invited by X' context, plain-English activity, one-tap reply) load-bear the 'wow intuitive' feeling. Plan locked in studio/docs/SPRINT_2_COLLABORATION.md.",
      alternatives: "Generic 'add collab everywhere' (would break Notes locked single-user and Analytics private positioning). Or defer collaboration until after Analytics ships (loses the moat-building window).",
      risks: "Sprint 2 is multi-cycle and cross-repo. Pacing matters. Don't half-start it before Sprint 1 (Notes 9.3+9.4+9.5) is closed. Cycle 9.4 promote-to-tasks is the first collab edge — finish it before 10.1.",
      reviewDate: "2026-06-15",
      status: "Active",
      relatedObjects: ["studio/docs/SPRINT_2_COLLABORATION.md", "Tasks workspace_members", "Roadmap shared update", "Collaboration Loop"],
      notes: "Notes stays single-user, Analytics stays private. Sprint 2 changes only Tasks + Roadmap.",
    },
    {
      id: "notes-private-by-design",
      decision: "Treat Signal Notes as private by design.",
      category: "Product",
      date: "2026-05-12",
      reason: "Notes is the private context layer. Trust depends on raw thoughts never appearing in collaborative surfaces by accident.",
      alternatives: "Let Notes behave like another shared workspace object.",
      risks: "Future extraction, briefing, or analytics work could accidentally leak raw note content unless permissions are enforced at the object boundary.",
      reviewDate: "2026-05-26",
      status: "Active",
      relatedObjects: ["Signal Notes", "Signal Tasks", "Workspace Briefing", "Shared outputs"],
      notes: "Only creator-approved extracts can leave Notes. Raw note bodies stay out of Tasks, Roadmap, Analytics, shared updates, and briefings by default.",
    },
    {
      id: "templates-cross-suite-canonical",
      decision: "Templates are a cross-suite primitive owned by the studio repo. Tasks is the only product with a template gallery; Notes, Roadmap, and Analytics consume template metadata via lazy expression on first visit.",
      category: "Product",
      date: "2026-05-12",
      reason: "The workspace creator persona searches for the artefact ('wedding planning checklist'), not the tool. Templates are the front door to the suite, not a setup shortcut. One canonical template definition rippling through four layers preserves the 'discipline sustained across the suite' moat; four parallel template galleries would destroy it.",
      alternatives: "Per-product template galleries (each of Tasks, Roadmap, Notes maintains its own list). Faster to ship in any one product; corrodes the cross-suite discipline that is the moat.",
      risks: "Sync mechanism (build-time copy of slices into each product) adds coordination cost on template change. Five anchor templates instead of one means more upfront work before validating the apply-and-watch loop. Marketing-month anchor has the highest BRAND-voice risk and may need a name + scope swap.",
      reviewDate: "2026-07-12",
      status: "Active",
      relatedObjects: ["docs/TEMPLATES_STRATEGY.md", "tasks/lib/templates.ts", "signal-growth/seo/template-strategy.md", "BRAND.md §2.1"],
      notes: "Locked 2026-05-12. Five anchor templates (one per §2.1 archetype): wedding-planning-workspace (lift to 4-layer), trades-job-pipeline, final-paper-sprint (lift from Tasks-only), freelance-client-engagement, local-business-monthly-rhythm. Existing 13 Tasks-only specialty templates stay as Tasks-only. Sequenced as Cycles T-1 through T-7 in TEMPLATES_STRATEGY.md. Four sub-decisions resolved same-day per Ethan's brand-aligned proceed: (a) sync script not workspace package, (b) all five anchors committed not one-then-watch, (c) marketing-month swapped for monthly-rhythm to honour BRAND.md §2 operator-real voice, (d) lazy expression not eager seed — each product's brand gesture (pulse/slide/tick/caret) is itself a reveal.",
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
    {
      id: "sprint2-cross-product-invite-defer",
      decision: "Defer Sprint 2 Cycle 10.5 (cross-product invite) until Analytics product exists.",
      category: "Product",
      date: "2026-05-12",
      reason: "The pitch 'one invite spans Tasks + Roadmap + Analytics' lands on a suite where Analytics /app is a 404. Shipping a marquee gesture that 404s on contact reproduces BRAND.md §2.2 demo-vs-reality gap. Two products invited cleanly beats three products invited where one is broken.",
      alternatives: "Ship the three-product gesture as the Sprint 2 headline now and hope the Analytics product gets built before pilots see it.",
      risks: "The three-product gesture is the most quotable part of Sprint 2's plan; cutting it weakens the sprint narrative. Counter risk is small — the same gesture can land later as additive.",
      reviewDate: "2026-07-12",
      status: "Active",
      relatedObjects: ["Sprint 2", "Collaboration Loop", "Signal Analytics"],
      notes: "Sprint 2 ships cross-product invite for Tasks + Roadmap only. Analytics joins the gesture in a later cycle once /app renders for at least one signed-in user.",
    },
    {
      id: "sprint2-branded-workspaces-kill",
      decision: "Kill Sprint 2 Cycle 10.6 (branded workspaces — venue logo + accent on shared view).",
      category: "Brand",
      date: "2026-05-12",
      reason: "BRAND.md §5 locks 'one accent across the suite, differentiation comes from gesture not colour.' Venue logo + custom accent on the shared Roadmap view is white-labeling — turns Signal Roadmap from a clarity product into a CMS competing with Webflow. The discipline moat is sustained refusal; this is the most reasonable-sounding violation worth refusing.",
      alternatives: "Ship as a delight feature in Sprint 2. Or move to a paid-tier gesture later.",
      risks: "Venues sell to couples partly on aesthetic continuity. Losing pilots over missing custom branding is a real-but-not-imminent risk.",
      reviewDate: "2026-08-01",
      status: "Active",
      relatedObjects: ["Sprint 2", "BRAND.md §5", "Signal Roadmap", "Founding Venue Programme"],
      notes: "Hold the line through ten pilots. If five of them ask for custom branding, revisit as a paid-tier decision, not a sprint gesture.",
    },
    {
      id: "analytics-restart-trigger",
      decision: "Analytics product build restarts on a state-of-the-suite trigger, not a calendar date.",
      category: "Product",
      date: "2026-05-12",
      reason: "Analytics's product premise is signal worth briefing. Signal requires multi-actor, multi-day workspaces. Building Analytics on a single-user, three-task workspace produces signal-less briefings — BRAND.md §2.2 failure mode rendered as a product. Marketing-side cinematic demo investment also pauses until then.",
      alternatives: "Restart immediately and hope Sprint 2 multi-user state arrives in time. Or restart on a calendar date with no usage trigger.",
      risks: "Cooling-off cost on the engine architecture in canonical-state memory — picking it back up after Sprint 2 will take ramp time.",
      reviewDate: "2026-07-12",
      status: "Active",
      relatedObjects: ["Signal Analytics", "Sprint 2", "Cycle 11.4 cinematic demo"],
      notes: "Trigger: first real multi-user wedding workspace exists in Tasks with a second human invited AND at least one shared roadmap update visible to them. Until then, no further Analytics product or marketing-demo investment.",
    },
    {
      id: "venue-pilot-forcing-function",
      decision: "Hard venue-pilot dates: 10-venue list by 2026-05-15; first outreach batch by 2026-05-19; three venue conversations on calendar by 2026-06-02. Polish work stops if the 2026-05-15 input gate slips.",
      category: "GTM",
      date: "2026-05-12",
      reason: "T0–T3.b suite-review polish closed today (verified live: /weddings amber countdown, Tasks /welcome leading card, Roadmap demo no-comment-thread). Without a hard pilot date, Sprint 1 (Notes 9.3 + 9.4b) and Sprint 2 (collaboration gestures) will absorb every available hour. The brand mission is 'cut through the noise' — that mission betrays itself if refusal discipline becomes product cowardice. Three real venue conversations are the only thing that validates the wedge.",
      alternatives: "Tighter one-week deadline (would test pitch sharpness more honestly but doesn't account for venue response latency of 3-5 business days). Looser open-ended 'when polish is done' framing (the failure mode this decision exists to prevent). Per-venue conversion target instead of conversation count (premature — we need to know if the offer lands at all before optimising the funnel).",
      risks: "Three weeks is on the soft side; if 2026-06-02 is hit cleanly with no learning, the next cycle's deadline tightens. The 2026-05-15 input gate is the more load-bearing one — if 10 named venues with coordinator + email + reason-this-venue can't be assembled in three working days, the wedge has a research problem disguised as a polish problem and shipping more product won't fix it.",
      reviewDate: "2026-06-02",
      status: "Active",
      relatedObjects: ["Founding Venue Programme", "founding-venue-pilot", "signal-growth/outbound/wedding-venue-outreach-kit.md", "BRAND.md mission", "/weddings"],
      notes: "Counter-argument named inside the decision: a one-week deadline would test pitch sharpness more honestly than a three-week one. Reason for picking three: the campaign already lives in a 2026-05-13 → 2026-06-30 window; forcing five days inside a six-week plan is theatre. If three weeks lands with three conversations and no learning, the failure mode is that the deadline was too generous — that's what the 2026-06-02 review date exists to surface. Status check at the review date: did three conversations happen? If yes and learning was thin, next cycle tightens to one week. If no, the wedge needs a different offer or a different list, not more polish.",
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
      likelihood: "Medium",
      impact: "High",
      status: "Needs attention",
      mitigation: "Dispatch correctness bug fixed 2026-05-12 (token rotation moved into Resend success branch, cron auth timing-safe, mock fallback removed). Remaining operator work: set CRON_SECRET + RESEND_API_KEY on the analytics Vercel project; generate DKIM in Google Workspace; sign into Tasks once with Clerk so listForUser returns a real user. Then watch one morning briefing land end-to-end before pointing new traffic at /app.",
      owner: "Ethan",
      reviewDate: "2026-05-19",
    },
    {
      id: "cross-repo-migration-discipline",
      risk: "A future 'dead code' audit drops a table or column that has cross-repo writers the in-repo grep misses.",
      area: "Infrastructure",
      likelihood: "Medium",
      impact: "High",
      status: "Needs attention",
      mitigation: "Memory entry feedback_cross_repo_grep.md added 2026-05-12. Rule: any 'is this code unused' check that touches Roadmap, Analytics, Notes, or shared Turso schemas must grep across ~/Projects/personal/ not just one repo. Before any destructive prod migration, snapshot affected tables and verify row counts match the in-repo writer audit — if prod has rows but in-repo greps show zero writers, find the cross-repo writer before dropping. Caught 2026-05-12 only because activity table had 30 unexpected rows in prod (written by tasks/scripts/log-cycle.ts).",
      owner: "Ethan",
      reviewDate: "2026-05-26",
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
