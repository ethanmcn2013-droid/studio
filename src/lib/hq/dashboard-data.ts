import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { readHqSection } from "@/lib/hq/markdown";
import { parseFrontmatter, splitH2Sections } from "@/lib/hq/markdown-parser";
import { readPhase } from "@/lib/hq/today";
import type {
  AccessRoleItem,
  Campaign,
  CollaborationLoopStep,
  CollaboratorFirstViewItem,
  ContentItem,
  DecisionItem,
  DemoAsset,
  EcosystemFlow,
  FeatureItem,
  GrowthStatus,
  GrowthWorkflowItem,
  LaunchReadinessItem,
  MessagingBank,
  PilotProgramme,
  Priority,
  ProductStatus,
  ReadinessStatus,
  RiskItem,
  SegmentPlan,
  ShareableArtifactItem,
  SharedObjectItem,
  TemplateItem,
  WorkStatus,
} from "@/lib/hq/data";

/**
 * Adapter layer: convert generic HqMarkdownEntry shapes into the
 * typed shapes the HQ dashboard already consumes (ProductStatus,
 * FeatureItem, RiskItem, EcosystemFlow).
 *
 * Each adapter is forgiving — missing fields fall back to safe
 * defaults so the dashboard renders something even when the markdown
 * is incomplete. The dashboard's existing types stay the source of
 * truth for shape; the markdown is the source of truth for content.
 */

const FALLBACK_STATUS_READINESS: ReadinessStatus = "Needs attention";
const FALLBACK_STATUS_WORK: WorkStatus = "Idea";
const FALLBACK_PRIORITY: Priority = "Medium";

function arrayField(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function numberField(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function stringField(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (value === undefined || value === null) return fallback;
  return String(value);
}

export async function readProductsAsDashboard(): Promise<ProductStatus[]> {
  const entries = await readHqSection("products");
  return entries.map((e) => {
    const fm = e.fm as Record<string, unknown>;
    return {
      id: stringField(fm.id, e.filename.replace(/\.md$/, "")),
      name: stringField(fm.title, "Signal Tasks") as ProductStatus["name"],
      layer: stringField(fm.layer, "Execution") as ProductStatus["layer"],
      role: e.sections.Role ?? stringField(fm.role, ""),
      maturity: numberField(fm.maturity),
      status: stringField(fm.status, "Private preview") as ProductStatus["status"],
      uxPolish: numberField(fm.uxPolish),
      integrationScore: numberField(fm.integrationScore),
      launchReadiness: numberField(fm.launchReadiness),
      majorFeatures: arrayField(fm.majorFeatures),
      blockers: arrayField(fm.blockers),
      notes: e.sections.Notes ?? stringField(fm.notes, ""),
      nextActions: arrayField(fm.nextActions),
    };
  });
}

export async function readEcosystemFlowsAsDashboard(): Promise<EcosystemFlow[]> {
  const entries = await readHqSection("ecosystem-flows");
  return entries.map((e) => {
    const fm = e.fm as Record<string, unknown>;
    return {
      id: stringField(fm.id),
      from: stringField(fm.title, stringField(fm.from)),
      to: stringField(fm.to),
      purpose:
        e.sections.Purpose ?? stringField(fm.purpose, ""),
      status: stringField(fm.status, "Planned") as EcosystemFlow["status"],
      health: stringField(
        fm.health,
        FALLBACK_STATUS_READINESS,
      ) as ReadinessStatus,
      nextAction:
        e.sections["Next action"] ?? stringField(fm.nextAction, ""),
    };
  });
}

export async function readFeaturesAsDashboard(): Promise<FeatureItem[]> {
  const entries = await readHqSection("features");
  return entries.map((e) => {
    const fm = e.fm as Record<string, unknown>;
    return {
      id: stringField(fm.id),
      name: stringField(fm.title),
      product: stringField(fm.product),
      type: stringField(fm.category, "Core") as FeatureItem["type"],
      status: stringField(fm.status, FALLBACK_STATUS_WORK) as WorkStatus,
      priority: stringField(fm.priority, FALLBACK_PRIORITY) as Priority,
      effort: stringField(fm.effort, "Medium") as FeatureItem["effort"],
      impact: stringField(fm.impact, "Medium") as FeatureItem["impact"],
      owner: stringField(fm.owner, "Ethan"),
      relatedCampaign: stringField(fm.relatedCampaign, ""),
      relatedMetric: stringField(fm.relatedMetric, ""),
      principleAlignment: numberField(fm.principleAlignment),
      notes:
        e.sections.Notes ?? stringField(fm.notes, ""),
    };
  });
}

export async function readRisksAsDashboard(): Promise<RiskItem[]> {
  const entries = await readHqSection("risks");
  return entries.map((e) => {
    const fm = e.fm as Record<string, unknown>;
    return {
      id: stringField(fm.id),
      risk: stringField(fm.title),
      area: stringField(fm.category, "Product"),
      likelihood: stringField(fm.likelihood, "Medium") as RiskItem["likelihood"],
      impact: stringField(fm.impact, "Medium") as RiskItem["impact"],
      status: stringField(
        fm.status,
        FALLBACK_STATUS_READINESS,
      ) as ReadinessStatus,
      mitigation:
        e.sections.Mitigation ?? stringField(fm.mitigation, ""),
      owner: stringField(fm.owner, "Ethan"),
      reviewDate: stringField(fm.reviewDate, ""),
    };
  });
}

async function readDecisionsAsDashboard(): Promise<DecisionItem[]> {
  const entries = await readHqSection("decisions");
  return entries.map((e) => {
    const fm = e.fm as Record<string, unknown>;
    return {
      id: stringField(fm.id),
      decision:
        e.sections.Decision ?? stringField(fm.decision, stringField(fm.title)),
      category: stringField(fm.category, "Product") as DecisionItem["category"],
      date: stringField(fm.date, ""),
      reason: e.sections.Reason ?? stringField(fm.reason, ""),
      alternatives:
        e.sections["Alternatives considered"] ??
        stringField(fm.alternatives, ""),
      risks: e.sections.Risks ?? stringField(fm.risks, ""),
      reviewDate: stringField(fm.reviewDate, ""),
      status: stringField(fm.status, "Active") as DecisionItem["status"],
      relatedObjects: arrayField(fm.relatedObjects),
      notes: e.sections.Notes ?? stringField(fm.notes, ""),
    };
  });
}

async function readLaunchReadinessAsDashboard(): Promise<LaunchReadinessItem[]> {
  const entries = await readHqSection("launch-readiness");
  return entries.map((e) => {
    const fm = e.fm as Record<string, unknown>;
    return {
      id: stringField(fm.id),
      category: stringField(fm.title, stringField(fm.category)),
      score: numberField(fm.score),
      weight: numberField(fm.weight),
      status: stringField(fm.status, FALLBACK_STATUS_READINESS) as ReadinessStatus,
      notes: e.sections.Notes ?? stringField(fm.notes, ""),
      blockers: arrayField(fm.blockers),
      nextAction:
        e.sections["Next action"] ?? stringField(fm.nextAction, ""),
    };
  });
}

async function readPilotsAsDashboard(): Promise<PilotProgramme[]> {
  const entries = await readHqSection("pilots");
  return entries.map((e) => {
    const fm = e.fm as Record<string, unknown>;
    return {
      id: stringField(fm.id),
      name: stringField(fm.title),
      offer: e.sections.Offer ?? stringField(fm.offer, ""),
      targetParticipants: stringField(fm.targetParticipants, ""),
      value: e.sections.Value ?? stringField(fm.value, ""),
      ask: e.sections.Ask ?? stringField(fm.ask, ""),
      successCriteria: arrayField(fm.successCriteria),
      currentParticipants: numberField(fm.currentParticipants),
      feedbackCollected: numberField(fm.feedbackCollected),
      caseStudyPotential: stringField(
        fm.caseStudyPotential,
        "Medium",
      ) as PilotProgramme["caseStudyPotential"],
      status: stringField(fm.status, "Selected") as GrowthStatus,
      relatedProspects: arrayField(fm.relatedProspects),
      relatedWorkspaces: arrayField(fm.relatedWorkspaces),
    };
  });
}

async function readCollaborationLoopAsDashboard(): Promise<CollaborationLoopStep[]> {
  const entries = await readHqSection("collaboration-loop");
  return entries.map((e) => {
    const fm = e.fm as Record<string, unknown>;
    return {
      id: stringField(fm.id),
      step: stringField(fm.title, stringField(fm.step)),
      purpose: e.sections.Purpose ?? stringField(fm.purpose, ""),
      productOwner: stringField(fm.productOwner, ""),
      status: stringField(fm.status, "Idea") as WorkStatus,
      readiness: numberField(fm.readiness),
      growthSurface: stringField(fm.growthSurface, ""),
      nextAction:
        e.sections["Next action"] ?? stringField(fm.nextAction, ""),
      metric: stringField(fm.metric, ""),
    };
  });
}

async function readSharedObjectsAsDashboard(): Promise<SharedObjectItem[]> {
  const entries = await readHqSection("shared-objects");
  return entries.map((e) => {
    const fm = e.fm as Record<string, unknown>;
    return {
      id: stringField(fm.id),
      object: stringField(fm.title, stringField(fm.object)),
      definition:
        e.sections.Definition ?? stringField(fm.definition, ""),
      usedBy: arrayField(fm.usedBy),
      status: stringField(fm.status, "Defined") as SharedObjectItem["status"],
      nextAction:
        e.sections["Next action"] ?? stringField(fm.nextAction, ""),
    };
  });
}

async function readAccessRolesAsDashboard(): Promise<AccessRoleItem[]> {
  const entries = await readHqSection("access-roles");
  return entries.map((e) => {
    const fm = e.fm as Record<string, unknown>;
    return {
      id: stringField(fm.id),
      role: stringField(fm.title, stringField(fm.role)),
      plainName: stringField(fm.plainName, ""),
      purpose: e.sections.Purpose ?? stringField(fm.purpose, ""),
      defaultAccess: stringField(fm.defaultAccess, ""),
      canDo: arrayField(fm.canDo),
      cannotDo: arrayField(fm.cannotDo),
      status: stringField(fm.status, "Draft") as AccessRoleItem["status"],
      nextAction: stringField(fm.nextAction, ""),
    };
  });
}

async function readCollaboratorFirstViewAsDashboard(): Promise<
  CollaboratorFirstViewItem[]
> {
  const entries = await readHqSection("collaborator-first-view");
  return entries.map((e) => {
    const fm = e.fm as Record<string, unknown>;
    return {
      id: stringField(fm.id),
      section: stringField(fm.title, stringField(fm.section)),
      question: e.sections.Question ?? stringField(fm.question, ""),
      sourceProduct: stringField(fm.sourceProduct, ""),
      purpose: e.sections.Purpose ?? stringField(fm.purpose, ""),
      status: stringField(
        fm.status,
        "Draft",
      ) as CollaboratorFirstViewItem["status"],
      nextAction: stringField(fm.nextAction, ""),
    };
  });
}

async function readShareableArtifactsAsDashboard(): Promise<
  ShareableArtifactItem[]
> {
  const entries = await readHqSection("shareable-artifacts");
  return entries.map((e) => {
    const fm = e.fm as Record<string, unknown>;
    return {
      id: stringField(fm.id),
      name: stringField(fm.title, stringField(fm.name)),
      wedge: stringField(fm.wedge, ""),
      ownerProduct: stringField(fm.ownerProduct, ""),
      purpose: e.sections.Purpose ?? stringField(fm.purpose, ""),
      defaultVisibility: stringField(
        fm.defaultVisibility,
        "Owner controlled",
      ) as ShareableArtifactItem["defaultVisibility"],
      sourceTracking: stringField(fm.sourceTracking, ""),
      cta: stringField(fm.cta, ""),
      status: stringField(
        fm.status,
        "Draft",
      ) as ShareableArtifactItem["status"],
      nextAction: stringField(fm.nextAction, ""),
    };
  });
}

async function readSegmentsAsDashboard(): Promise<SegmentPlan[]> {
  const entries = await readHqSection("segments");
  return entries.map((e) => {
    const fm = e.fm as Record<string, unknown>;
    return {
      id: stringField(fm.id),
      segment: stringField(fm.title, stringField(fm.segment)),
      priority: stringField(fm.priority, "Medium") as Priority,
      painPoint: e.sections["Pain point"] ?? stringField(fm.painPoint, ""),
      coreMessage:
        e.sections["Core message"] ?? stringField(fm.coreMessage, ""),
      offer: e.sections.Offer ?? stringField(fm.offer, ""),
      acquisitionChannel: stringField(fm.acquisitionChannel, ""),
      confidence: numberField(fm.confidence),
      status: stringField(fm.status, "Explore") as SegmentPlan["status"],
      notes: e.sections.Notes ?? stringField(fm.notes, ""),
    };
  });
}

async function readCampaignsAsDashboard(): Promise<Campaign[]> {
  const entries = await readHqSection("campaigns");
  return entries.map((e) => {
    const fm = e.fm as Record<string, unknown>;
    return {
      id: stringField(fm.id),
      name: stringField(fm.title, stringField(fm.name)),
      segment: stringField(fm.segment, ""),
      goal: e.sections.Goal ?? stringField(fm.goal, ""),
      offer: e.sections.Offer ?? stringField(fm.offer, ""),
      status: stringField(fm.status, "Selected") as GrowthStatus,
      assetsNeeded: arrayField(fm.assetsNeeded),
      startDate: stringField(fm.startDate, ""),
      endDate: stringField(fm.endDate, ""),
      currentBlocker:
        e.sections["Current blocker"] ?? stringField(fm.currentBlocker, ""),
      nextStep: e.sections["Next step"] ?? stringField(fm.nextStep, ""),
      progress: numberField(fm.progress),
      relatedContent:
        e.sections["Related content"] ?? stringField(fm.relatedContent, ""),
      relatedLandingPage: stringField(fm.relatedLandingPage, ""),
      relatedMetric: stringField(fm.relatedMetric, ""),
    };
  });
}

async function readContentItemsAsDashboard(): Promise<ContentItem[]> {
  const entries = await readHqSection("content");
  return entries.map((e) => {
    const fm = e.fm as Record<string, unknown>;
    return {
      id: stringField(fm.id),
      title: stringField(fm.title),
      pillar: stringField(fm.pillar, "Use-case demos") as ContentItem["pillar"],
      format: stringField(fm.format, "Short video") as ContentItem["format"],
      channel: stringField(fm.channel, "LinkedIn") as ContentItem["channel"],
      targetSegment: stringField(fm.targetSegment, ""),
      status: stringField(fm.status, "Idea") as ContentItem["status"],
      dueDate: stringField(fm.dueDate, ""),
      cta: stringField(fm.cta, ""),
      relatedCampaign: stringField(fm.relatedCampaign, ""),
      relatedMetric: stringField(fm.relatedMetric, ""),
      notes: e.sections.Notes ?? stringField(fm.notes, ""),
    };
  });
}

async function readDemosAsDashboard(): Promise<DemoAsset[]> {
  const entries = await readHqSection("demos");
  return entries.map((e) => {
    const fm = e.fm as Record<string, unknown>;
    return {
      id: stringField(fm.id),
      title: stringField(fm.title),
      audience: stringField(fm.audience, ""),
      objective: e.sections.Objective ?? stringField(fm.objective, ""),
      scriptStatus: stringField(fm.scriptStatus, "Idea") as WorkStatus,
      recordingStatus: stringField(fm.recordingStatus, "Idea") as WorkStatus,
      editingStatus: stringField(fm.editingStatus, "Idea") as WorkStatus,
      publishedLink: stringField(fm.publishedLink, ""),
      cta: stringField(fm.cta, ""),
      keyScenes: arrayField(fm.keyScenes),
      voiceoverNotes: stringField(fm.voiceoverNotes, ""),
      motionNotes: stringField(fm.motionNotes, ""),
      relatedProduct: stringField(fm.relatedProduct, ""),
      relatedCampaign: stringField(fm.relatedCampaign, ""),
    };
  });
}

async function readTemplatesAsDashboard(): Promise<TemplateItem[]> {
  const entries = await readHqSection("templates");
  return entries.map((e) => {
    const fm = e.fm as Record<string, unknown>;
    return {
      id: stringField(fm.id),
      name: stringField(fm.title, stringField(fm.name)),
      targetSegment: stringField(fm.targetSegment, ""),
      status: stringField(fm.status, "Idea") as TemplateItem["status"],
      useCase: e.sections["Use case"] ?? stringField(fm.useCase, ""),
      includedProducts: arrayField(fm.includedProducts),
      landingPageUrl: stringField(fm.landingPageUrl, ""),
      relatedCampaign: stringField(fm.relatedCampaign, ""),
      activationGoal: stringField(fm.activationGoal, ""),
      notes: e.sections.Notes ?? stringField(fm.notes, ""),
    };
  });
}

async function readMessagingAsDashboard(): Promise<MessagingBank | undefined> {
  // messaging lives as a single file (content/hq/messaging.md), not a
  // directory of entries. Parse it directly and adapt to MessagingBank.
  const messagingPath = path.join(
    process.cwd(),
    "content",
    "hq",
    "messaging.md",
  );
  let raw: string;
  try {
    raw = await fs.readFile(messagingPath, "utf-8");
  } catch {
    return undefined;
  }
  const { body } = parseFrontmatter(raw);
  const sections = splitH2Sections(body);

  const parseList = (section: string | undefined): string[] => {
    if (!section) return [];
    return section
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.startsWith("- "))
      .map((l) => l.slice(2).trim())
      .filter(Boolean);
  };

  // Pitches section uses H3 subheadings — parse manually.
  const pitchesSection = sections.Pitches ?? "";
  const parsePitches = (): MessagingBank["pitches"] => {
    const out: Record<string, string> = {};
    const blocks = pitchesSection.split(/^###\s+/m).slice(1);
    for (const block of blocks) {
      const [headLine, ...rest] = block.split("\n");
      const key = headLine.trim();
      const value = rest.join("\n").trim();
      if (key) out[key] = value;
    }
    return {
      weddingVenue: out.weddingVenue ?? "",
      weddingPlanner: out.weddingPlanner ?? "",
      student: out.student ?? "",
      freelancer: out.freelancer ?? "",
    };
  };

  return {
    positioning: (sections.Positioning ?? "").trim(),
    ecosystemLine: (sections["Ecosystem line"] ?? "").trim(),
    founderStory: (sections["Founder story"] ?? "").trim(),
    hooks: parseList(sections.Hooks),
    pitches: parsePitches(),
    objections: parseList(sections.Objections),
    ctas: parseList(sections.CTAs),
  };
}

async function readGrowthWorkflowAsDashboard(): Promise<GrowthWorkflowItem[]> {
  const entries = await readHqSection("growth-workflow");
  return entries.map((e) => {
    const fm = e.fm as Record<string, unknown>;
    return {
      id: stringField(fm.id),
      title: stringField(fm.title),
      audience: stringField(fm.audience, ""),
      campaign: stringField(fm.campaign, ""),
      product: stringField(fm.product, ""),
      segment: stringField(fm.segment, ""),
      channel: stringField(fm.channel, ""),
      goal: e.sections.Goal ?? stringField(fm.goal, ""),
      cta: stringField(fm.cta, ""),
      rationale: e.sections.Rationale ?? stringField(fm.rationale, ""),
      relatedMetric: stringField(fm.relatedMetric, ""),
      brandRisk: stringField(fm.brandRisk, "Low") as GrowthWorkflowItem["brandRisk"],
      complianceRisk: stringField(
        fm.complianceRisk,
        "Low",
      ) as GrowthWorkflowItem["complianceRisk"],
      repurposing: arrayField(fm.repurposing),
      status: stringField(fm.status, "Selected") as GrowthStatus,
      roleOwner: stringField(
        fm.roleOwner,
        "Strategy Director",
      ) as GrowthWorkflowItem["roleOwner"],
    };
  });
}

export type HqDashboardMarkdown = {
  products: ProductStatus[];
  ecosystemFlows: EcosystemFlow[];
  features: FeatureItem[];
  risks: RiskItem[];
  decisions: DecisionItem[];
  launchReadiness: LaunchReadinessItem[];
  pilots: PilotProgramme[];
  collaborationLoop: CollaborationLoopStep[];
  sharedObjects: SharedObjectItem[];
  accessRoles: AccessRoleItem[];
  collaboratorFirstView: CollaboratorFirstViewItem[];
  shareableArtifacts: ShareableArtifactItem[];
  segments: SegmentPlan[];
  campaigns: Campaign[];
  contentItems: ContentItem[];
  demos: DemoAsset[];
  templates: TemplateItem[];
  growthWorkflow: GrowthWorkflowItem[];
  messaging?: MessagingBank;
  phaseHeadline?: string;
};

export async function getHqDashboardMarkdown(): Promise<HqDashboardMarkdown> {
  const [
    products,
    ecosystemFlows,
    features,
    risks,
    decisions,
    launchReadiness,
    pilots,
    collaborationLoop,
    sharedObjects,
    accessRoles,
    collaboratorFirstView,
    shareableArtifacts,
    segments,
    campaigns,
    contentItems,
    demos,
    templates,
    growthWorkflow,
    messaging,
    phase,
  ] = await Promise.all([
    readProductsAsDashboard(),
    readEcosystemFlowsAsDashboard(),
    readFeaturesAsDashboard(),
    readRisksAsDashboard(),
    readDecisionsAsDashboard(),
    readLaunchReadinessAsDashboard(),
    readPilotsAsDashboard(),
    readCollaborationLoopAsDashboard(),
    readSharedObjectsAsDashboard(),
    readAccessRolesAsDashboard(),
    readCollaboratorFirstViewAsDashboard(),
    readShareableArtifactsAsDashboard(),
    readSegmentsAsDashboard(),
    readCampaignsAsDashboard(),
    readContentItemsAsDashboard(),
    readDemosAsDashboard(),
    readTemplatesAsDashboard(),
    readGrowthWorkflowAsDashboard(),
    readMessagingAsDashboard(),
    readPhase(),
  ]);
  return {
    products,
    ecosystemFlows,
    features,
    risks,
    decisions,
    launchReadiness,
    pilots,
    collaborationLoop,
    sharedObjects,
    accessRoles,
    collaboratorFirstView,
    shareableArtifacts,
    segments,
    campaigns,
    contentItems,
    demos,
    templates,
    growthWorkflow,
    messaging,
    phaseHeadline: phase.available ? phase.headline : undefined,
  };
}
