import type { HqData, LaunchReadinessItem, ReadinessStatus } from "@/lib/hq/data";

export interface HqSignal {
  id: string;
  title: string;
  detail: string;
  severity: ReadinessStatus;
}

export interface HqDerivedState {
  launchReadiness: number;
  productReadiness: number;
  gtmReadiness: number;
  integrationReadiness: number;
  balance: Array<{ label: string; score: number }>;
  signals: HqSignal[];
}

const severityScore: Record<ReadinessStatus, number> = {
  Clear: 90,
  "Needs attention": 58,
  "At risk": 28,
  Blocked: 10,
};

function average(values: number[]) {
  if (!values.length) {
    return 0;
  }

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function weightedScore(items: LaunchReadinessItem[]) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);

  if (!totalWeight) {
    return 0;
  }

  const total = items.reduce((sum, item) => sum + item.score * item.weight, 0);
  return Math.round(total / totalWeight);
}

function readinessByCategory(data: HqData, category: string) {
  return data.launchReadiness.find((item) => item.category === category)?.score ?? 0;
}

function daysUntil(dateValue: string, todayValue: string) {
  if (!dateValue) {
    return Number.POSITIVE_INFINITY;
  }

  const date = new Date(`${dateValue}T00:00:00Z`).getTime();
  const today = new Date(`${todayValue}T00:00:00Z`).getTime();

  return Math.ceil((date - today) / (1000 * 60 * 60 * 24));
}

export function deriveHqState(data: HqData): HqDerivedState {
  const productReadiness = average(data.products.map((product) => product.launchReadiness));
  const launchReadiness = weightedScore(data.launchReadiness);
  const gtmReadiness = average([
    readinessByCategory(data, "Demo assets"),
    readinessByCategory(data, "Website and landing pages"),
    readinessByCategory(data, "Messaging"),
    readinessByCategory(data, "CRM and outbound"),
    readinessByCategory(data, "Pilot programmes"),
    readinessByCategory(data, "Case study readiness"),
  ]);
  const integrationReadiness = average(
    data.ecosystemFlows.map((flow) => severityScore[flow.health])
  );
  const marketingReadiness = average([
    readinessByCategory(data, "Website and landing pages"),
    readinessByCategory(data, "Messaging"),
    readinessByCategory(data, "Demo assets"),
  ]);
  const contentReadiness = average([
    readinessByCategory(data, "Demo assets"),
    data.contentItems.filter((item) => item.status === "Published").length > 0 ? 55 : 10,
    data.templates.filter((item) => item.status === "Published").length > 0 ? 55 : 12,
  ]);
  const outboundReadiness = readinessByCategory(data, "CRM and outbound");
  const partnershipReadiness = readinessByCategory(data, "Pilot programmes");
  const feedbackReadiness = data.feedback.length > 0 ? 52 : 10;
  const metricsReadiness = readinessByCategory(data, "Tracking");

  const balance = [
    { label: "Product", score: productReadiness },
    { label: "Connection", score: integrationReadiness },
    { label: "Marketing", score: marketingReadiness },
    { label: "Content", score: contentReadiness },
    { label: "Outbound", score: outboundReadiness },
    { label: "Partnerships", score: partnershipReadiness },
    { label: "Feedback", score: feedbackReadiness },
    { label: "Metrics", score: metricsReadiness },
  ];

  const inProgressFeatures = data.features.filter((feature) => feature.status === "In Progress");
  const overdueFollowUps = data.prospects.filter(
    (prospect) =>
      prospect.nextFollowUp &&
      !["Not Interested", "Later"].includes(prospect.status) &&
      daysUntil(prospect.nextFollowUp, data.updatedAt) < 0
  );
  const upcomingFollowUps = data.prospects.filter(
    (prospect) =>
      prospect.nextFollowUp &&
      !["Not Interested", "Later"].includes(prospect.status) &&
      daysUntil(prospect.nextFollowUp, data.updatedAt) <= 3
  );
  const publishedDemos = data.demos.filter((demo) => demo.publishedLink).length;
  const repeatedFeedback = data.feedback.filter((feedback) => feedback.frequency >= 3);
  const readyForEthan = data.growthWorkflow.filter(
    (item) => item.status === "Ready for Ethan"
  );

  const signals: HqSignal[] = [];

  if (productReadiness > 60 && gtmReadiness < 35) {
    signals.push({
      id: "distribution-lag",
      title: "Distribution is behind product.",
      detail: "Product readiness is ahead of GTM readiness. Demos, pilots, and outreach need time this week.",
      severity: "At risk",
    });
  }

  if (integrationReadiness < 45) {
    signals.push({
      id: "ecosystem-loop-early",
      title: "The ecosystem loop is still early.",
      detail: "Shared decisions, risks, updates, and cross-product links need a common model.",
      severity: "Needs attention",
    });
  }

  if (inProgressFeatures.length > 4) {
    signals.push({
      id: "too-much-wip",
      title: "Too much work is in progress.",
      detail: `${inProgressFeatures.length} features are in progress. Finish or pause before adding more.`,
      severity: "Needs attention",
    });
  }

  if (overdueFollowUps.length > 0) {
    signals.push({
      id: "followups-overdue",
      title: "Follow-ups are overdue.",
      detail: `${overdueFollowUps.length} CRM follow-up${overdueFollowUps.length === 1 ? "" : "s"} need attention.`,
      severity: "At risk",
    });
  } else if (upcomingFollowUps.length > 0) {
    signals.push({
      id: "followups-soon",
      title: "Follow-ups are coming up.",
      detail: `${upcomingFollowUps.length} prospect follow-up${upcomingFollowUps.length === 1 ? "" : "s"} due in the next three days.`,
      severity: "Needs attention",
    });
  }

  if (publishedDemos === 0 && launchReadiness > 30) {
    signals.push({
      id: "demo-gap",
      title: "Demo proof is missing.",
      detail: "Launch readiness is moving, but no demo asset is published yet.",
      severity: "At risk",
    });
  }

  if (repeatedFeedback.length > 0) {
    signals.push({
      id: "feedback-theme",
      title: "Repeated feedback theme detected.",
      detail: `${repeatedFeedback[0].insight}`,
      severity: repeatedFeedback[0].severity === "High" ? "At risk" : "Needs attention",
    });
  }

  if (readyForEthan.length > 0) {
    signals.push({
      id: "review-queue",
      title: "Review queue is waiting.",
      detail: `${readyForEthan.length} growth item${readyForEthan.length === 1 ? "" : "s"} ready for Ethan.`,
      severity: "Needs attention",
    });
  }

  return {
    launchReadiness,
    productReadiness,
    gtmReadiness,
    integrationReadiness,
    balance,
    signals,
  };
}
