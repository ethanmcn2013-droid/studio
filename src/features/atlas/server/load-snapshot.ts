import "server-only";

/**
 * Atlas live snapshot — reads the repo's real operating source of truth
 * (`content/hq/**` + the systems registry) and computes the honest figures the
 * map shows. Nothing here is invented: every number traces to a markdown file
 * the founder edits.
 *
 * Fail-open by design. A missing or renamed section yields an empty list and an
 * honest placeholder, never a thrown render. The founder's map must not 500
 * because a file moved.
 */

import { readHqSection, type HqMarkdownEntry } from "@/lib/hq/markdown";
import { getOperatorTodos } from "@/lib/hq/operator-todos";
import { readAtlasEntries } from "@/lib/atlas/loader";
import {
  num,
  mean,
  weightedComposite,
  healthFromScore,
  worstHealth,
  formatDateHuman,
  mostRecentDate,
  daysUntil,
} from "../utils/atlas-scoring";
import type {
  AtlasSnapshot,
  AtlasDomainSignal,
  AtlasHealth,
  AtlasMetric,
  AtlasSummaryStat,
} from "../types";

/** Launch date, mirrors src/lib/hq/launch.ts LAUNCH_DATE. */
const LAUNCH_DATE = "2026-09-01";

/** Which domain each tracked risk belongs to. Unmapped risks fall to operations. */
const RISK_DOMAIN: Record<string, string> = {
  "analytics-pipeline-silent": "product",
  "collaboration-hidden": "product",
  "fragmented-suite": "product",
  "cross-repo-migration-discipline": "engineering",
  "roadmap-rate-limit-bricked": "engineering",
  "crm-inconsistent": "business",
  "messaging-abstract": "business",
  "product-over-distribution": "business",
};

async function safeSection(section: string): Promise<HqMarkdownEntry[]> {
  try {
    return await readHqSection(section);
  } catch {
    return [];
  }
}

function fmStr(e: HqMarkdownEntry, key: string): string | undefined {
  const v = e.fm[key];
  return v === undefined || v === null ? undefined : String(v);
}

export async function loadAtlasSnapshot(): Promise<AtlasSnapshot> {
  const [
    products,
    risks,
    decisions,
    launchReadiness,
    campaigns,
    segments,
    todoBoard,
    atlasEntries,
  ] = await Promise.all([
    safeSection("products"),
    safeSection("risks"),
    safeSection("decisions"),
    safeSection("launch-readiness"),
    safeSection("campaigns"),
    safeSection("segments"),
    getOperatorTodos().catch(() => ({
      todos: [],
      openCount: 0,
      doneCount: 0,
      blockingCount: 0,
      total: 0,
    })),
    readAtlasEntries().catch(() => []),
  ]);

  // ── Composites ──────────────────────────────────────────────────────────
  const productMaturity = mean(products.map((p) => num(p.fm.maturity)));
  const productReadiness = mean(products.map((p) => num(p.fm.launchReadiness)));

  const launchComposite = weightedComposite(
    launchReadiness.map((l) => ({
      score: num(l.fm.score),
      weight: num(l.fm.weight),
    })),
  );
  const launchGateCount = launchReadiness.length;

  const criticalRisks = risks.filter((r) => {
    const impact = (fmStr(r, "impact") ?? "").toLowerCase();
    const status = (fmStr(r, "status") ?? "").toLowerCase();
    return impact === "high" && (status.includes("attention") || status.includes("blocked"));
  });
  const activeRisks = risks.filter((r) =>
    !(fmStr(r, "status") ?? "").toLowerCase().includes("clear"),
  );

  const openDecisions = decisions.filter((d) =>
    (fmStr(d, "status") ?? "").toLowerCase() === "active",
  );

  const daysToLaunch = daysUntil(LAUNCH_DATE);

  // "As of" = the most recent date something was logged, using activity dates
  // only (not future-scheduled review dates, which would push this ahead of now).
  const asOfIso = mostRecentDate([
    ...decisions.map((d) => fmStr(d, "date")),
    ...todoBoard.todos.map((t) => t.date),
  ]);
  const asOf = formatDateHuman(asOfIso) ?? "recently";

  // ── Per-domain risk buckets ─────────────────────────────────────────────
  const risksByDomain: Record<string, string[]> = {};
  for (const r of risks) {
    if ((fmStr(r, "status") ?? "").toLowerCase().includes("clear")) continue;
    const domain = RISK_DOMAIN[r.fm.id] ?? "operations";
    (risksByDomain[domain] ??= []).push(r.fm.title);
  }

  // ── Domain signals ──────────────────────────────────────────────────────
  const domainSignals: Record<string, AtlasDomainSignal> = {};

  // Product
  {
    const health = healthFromScore(productMaturity);
    const metrics: AtlasMetric[] = [
      { label: "Product maturity", value: fmt(productMaturity), note: "average across 4 products" },
      { label: "Launch readiness", value: fmt(productReadiness), note: "product average" },
      { label: "Products", value: String(products.length), note: "in private preview" },
    ];
    const nextActions = products
      .flatMap((p) => asArray(p.fm.nextActions))
      .slice(0, 3);
    domainSignals.product = {
      health: worstHealth(health, risksByDomain.product?.length ? "attention" : "healthy"),
      maturity: productMaturity,
      launchReadiness: productReadiness,
      metrics,
      risks: risksByDomain.product ?? [],
      nextActions,
    };
  }

  // Design — documented, not scored numerically (honest).
  domainSignals.design = {
    health: "healthy",
    maturity: null,
    launchReadiness: null,
    metrics: [
      { label: "Documentation", value: "Complete", note: "BRAND.md, DESIGN.md, /design" },
      { label: "Maturity", value: "Not scored", note: "qualitative for now" },
    ],
    risks: risksByDomain.design ?? [],
    nextActions: [],
  };

  // Engineering — count of registered systems is real.
  domainSignals.engineering = {
    health: worstHealth("healthy", risksByDomain.engineering?.length ? "attention" : "healthy"),
    maturity: null,
    launchReadiness: null,
    metrics: [
      { label: "Systems registered", value: String(atlasEntries.length), note: "in the drift-flagged registry" },
      {
        label: "Stale entries",
        value: String(atlasEntries.filter((e) => e.isStale).length),
        note: "past their verify-by",
      },
    ],
    risks: risksByDomain.engineering ?? [],
    nextActions: [],
  };

  // AI — governance posture from the operator ledger.
  {
    const aiTodos = todoBoard.todos.filter((t) =>
      /\bai\b|anthropic|gateway|token|spend|llm/i.test(`${t.id} ${t.title} ${t.why}`),
    );
    const spendCapDone = aiTodos.some((t) => /spend|budget/i.test(t.title) && t.status === "done");
    domainSignals.ai = {
      health: "healthy",
      maturity: null,
      launchReadiness: null,
      metrics: [
        { label: "Spend cap", value: spendCapDone ? "Set" : "Tracked", note: "operator ledger" },
        { label: "AI operator items", value: String(aiTodos.length), note: "governance to-dos" },
        { label: "Human review", value: "Required", note: "no unattended writes" },
      ],
      risks: risksByDomain.ai ?? [],
      nextActions: aiTodos.filter((t) => t.status === "open").map((t) => t.title).slice(0, 2),
    };
  }

  // Launch — the strongest live binding.
  {
    const health = healthFromScore(launchComposite, { attentionBelow: 60, blockedBelow: 30 });
    const weakest = [...launchReadiness]
      .map((l) => ({ title: l.fm.title, score: num(l.fm.score), next: fmStr(l, "nextAction") }))
      .filter((l) => l.score !== null)
      .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
      .slice(0, 3);
    domainSignals.launch = {
      health,
      maturity: null,
      launchReadiness: launchComposite,
      metrics: [
        { label: "Readiness", value: fmt(launchComposite), note: `weighted across ${launchGateCount} gates` },
        {
          label: "Launch date",
          value: formatDateHuman(LAUNCH_DATE) ?? LAUNCH_DATE,
          note: daysToLaunch !== null ? `${daysToLaunch} days out` : undefined,
        },
      ],
      risks: weakest.map((w) => `${w.title} at ${w.score}. ${w.next ?? ""}`.trim()),
      nextActions: weakest.map((w) => w.next).filter((n): n is string => Boolean(n)),
    };
  }

  // Metrics — tracking is real and currently weak; say so.
  {
    const tracking = launchReadiness.find((l) => l.fm.id === "tracking");
    const trackingScore = tracking ? num(tracking.fm.score) : null;
    domainSignals.metrics = {
      health: healthFromScore(trackingScore, { attentionBelow: 55, blockedBelow: 25 }),
      maturity: null,
      launchReadiness: null,
      metrics: [
        { label: "Tracking readiness", value: fmt(trackingScore), note: "instrumentation coverage" },
      ],
      risks: risksByDomain.metrics ?? [],
      nextActions: tracking ? [fmStr(tracking, "nextAction") ?? ""].filter(Boolean) : [],
    };
  }

  // Business — pricing / CRM readiness + reach.
  {
    const pricing = launchReadiness.find((l) => l.fm.id === "pricing");
    const crm = launchReadiness.find((l) => l.fm.id === "crm");
    const pricingScore = pricing ? num(pricing.fm.score) : null;
    const crmScore = crm ? num(crm.fm.score) : null;
    domainSignals.business = {
      health: worstHealth(
        healthFromScore(pricingScore),
        healthFromScore(crmScore),
        risksByDomain.business?.length ? "attention" : "healthy",
      ),
      maturity: null,
      launchReadiness: null,
      metrics: [
        { label: "Pricing", value: fmt(pricingScore), note: "readiness" },
        { label: "CRM", value: fmt(crmScore), note: "pipeline readiness" },
        { label: "Campaigns", value: String(campaigns.length), note: "in flight" },
        { label: "Segments", value: String(segments.length), note: "defined" },
      ],
      risks: risksByDomain.business ?? [],
      nextActions: crm ? [fmStr(crm, "nextAction") ?? ""].filter(Boolean) : [],
    };
  }

  // Operations — the discipline layer.
  {
    const opsHealth: AtlasHealth = todoBoard.blockingCount > 0 ? "attention" : "healthy";
    domainSignals.operations = {
      health: opsHealth,
      maturity: null,
      launchReadiness: null,
      metrics: [
        { label: "Decisions on file", value: String(decisions.length), note: `${openDecisions.length} active` },
        { label: "Risks tracked", value: String(risks.length), note: `${criticalRisks.length} critical` },
        {
          label: "Operator to-dos",
          value: String(todoBoard.openCount),
          note: `${todoBoard.blockingCount} blocking`,
        },
      ],
      risks: risksByDomain.operations ?? [],
      nextActions: todoBoard.todos
        .filter((t) => t.status === "open" && t.blocking)
        .map((t) => t.title)
        .slice(0, 3),
    };
  }

  // ── Mission Control stats ────────────────────────────────────────────────
  const stats: AtlasSummaryStat[] = [
    {
      key: "launch-readiness",
      label: "Launch readiness",
      value: fmt(launchComposite),
      note: `weighted across ${launchGateCount} gates`,
      health: healthFromScore(launchComposite, { attentionBelow: 60, blockedBelow: 30 }),
      href: "/hq/data-room",
    },
    {
      key: "product-maturity",
      label: "Product maturity",
      value: fmt(productMaturity),
      note: "average across 4 products",
      health: healthFromScore(productMaturity),
      href: "/hq/reporting",
    },
    {
      key: "launch-date",
      label: "Launch",
      value: daysToLaunch !== null ? `${daysToLaunch} days` : (formatDateHuman(LAUNCH_DATE) ?? LAUNCH_DATE),
      note: `to ${formatDateHuman(LAUNCH_DATE) ?? LAUNCH_DATE}`,
    },
    {
      key: "critical-risks",
      label: "Critical risks",
      value: String(criticalRisks.length),
      note: "high impact, need attention",
      health: criticalRisks.length > 0 ? "attention" : "healthy",
      href: "/hq",
    },
    {
      key: "open-decisions",
      label: "Open decisions",
      value: String(openDecisions.length),
      note: "active, with review dates",
      health: "healthy",
      href: "/hq",
    },
    {
      key: "operator-todos",
      label: "Operator to-dos",
      value: `${todoBoard.blockingCount} blocking`,
      note: `${todoBoard.openCount} open`,
      health: todoBoard.blockingCount > 0 ? "attention" : "healthy",
      href: "/hq",
    },
  ];

  // ── Investor snapshot ────────────────────────────────────────────────────
  const attentionRisks = risks.filter((r) =>
    (fmStr(r, "status") ?? "").toLowerCase().includes("attention"),
  ).length;

  const investor = {
    thesis: "Simple by design. Serious underneath.",
    figures: [
      { label: "Products", value: `${products.length} in private preview`, note: "one workspace, one brand" },
      { label: "Product maturity", value: `${fmt(productMaturity)} / 100`, note: "average across the suite" },
      { label: "Launch readiness", value: `${fmt(launchComposite)} / 100`, note: `weighted across ${launchGateCount} gates` },
      {
        label: "Launch",
        value: formatDateHuman(LAUNCH_DATE) ?? LAUNCH_DATE,
        note: daysToLaunch !== null ? `${daysToLaunch} days out` : undefined,
      },
      { label: "Decisions on file", value: String(decisions.length), note: `${openDecisions.length} active, each with a review date` },
      { label: "Systems registered", value: String(atlasEntries.length), note: "in a registry that flags its own drift" },
    ] as AtlasSnapshot["investor"]["figures"],
    discipline: [
      `Every strategic decision is written down with a review date. ${decisions.length} on file, ${openDecisions.length} active.`,
      `Risks are visible and owned, not hidden. ${risks.length} tracked, ${attentionRisks} flagged for attention.`,
      `${atlasEntries.length} systems are documented in a registry that marks itself stale when the code moves ahead of the doc.`,
      `Founder-gated work lives in one ledger. ${todoBoard.openCount} open, ${todoBoard.blockingCount} currently blocking engineering.`,
      "One design system is vendored into every product, so four apps read as one.",
    ],
  };

  // ── Placeholders still needing real data ─────────────────────────────────
  const placeholders: string[] = [];
  if (productMaturity === null) placeholders.push("Product maturity: no numeric scores found in content/hq/products.");
  placeholders.push("Design and Engineering maturity are not scored numerically in content/hq (see PRD open question Q1).");
  if (launchComposite === null) placeholders.push("Launch readiness: no gates found in content/hq/launch-readiness.");
  placeholders.push("AI directors count is read from a separate repo; not yet wired into HQ.");

  return { asOf, stats, domainSignals, investor, placeholders };
}

// ── local helpers ──────────────────────────────────────────────────────────

function fmt(n: number | null): string {
  return n === null ? "Not scored" : String(n);
}

function asArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String) : [];
}
