"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { seedHqData } from "@/lib/hq/data";
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
  HqData,
  LaunchReadinessItem,
  MetricItem,
  NextActionItem,
  PilotProgramme,
  ProductStatus,
  Prospect,
  RiskItem,
  SegmentPlan,
  ShareableArtifactItem,
  SharedObjectItem,
  TemplateItem,
  WeeklyRhythmItem,
} from "@/lib/hq/data";
import { deriveHqState } from "@/lib/hq/signals";

const STORAGE_KEY = "signal-hq-data-v1";

type TabId =
  | "overview"
  | "products"
  | "loop"
  | "pipeline"
  | "proof"
  | "operations";

type HqArrayKey =
  | "features"
  | "campaigns"
  | "collaborationLoop"
  | "sharedObjects"
  | "accessRoles"
  | "collaboratorFirstView"
  | "shareableArtifacts"
  | "prospects"
  | "contentItems"
  | "demos"
  | "templates"
  | "metrics"
  | "decisions"
  | "feedback"
  | "risks"
  | "weeklyRhythm"
  | "nextActions"
  | "growthWorkflow";

const tabs: Array<{ id: TabId; label: string }> = [
  { id: "overview", label: "Today" },
  { id: "products", label: "Products" },
  { id: "loop", label: "The loop" },
  { id: "pipeline", label: "Pipeline" },
  { id: "proof", label: "Proof" },
  { id: "operations", label: "Operations" },
];

const workStatuses: FeatureItem["status"][] = [
  "Idea",
  "Planned",
  "In Progress",
  "Blocked",
  "Built",
  "Testing",
  "Shipped",
];

const growthStatuses: GrowthStatus[] = [
  "Queued",
  "Selected",
  "Drafting",
  "Review",
  "Revision",
  "Ready for Ethan",
  "Approved",
  "Published",
  "Measured",
  "Repurposed",
  "Archived",
];

const prospectStatuses: Prospect["status"][] = [
  "To Contact",
  "Contacted",
  "Replied",
  "Demo Booked",
  "Pilot Active",
  "Not Interested",
  "Later",
];

const actionStatuses: NextActionItem["status"][] = ["To do", "Doing", "Done"];

function safeCloneData() {
  return JSON.parse(JSON.stringify(seedHqData)) as HqData;
}

function normalizeData(imported: Partial<HqData>): HqData {
  const seed = safeCloneData();

  return {
    ...seed,
    ...imported,
    collaborationLoop: imported.collaborationLoop ?? seed.collaborationLoop,
    sharedObjects: imported.sharedObjects ?? seed.sharedObjects,
    accessRoles: imported.accessRoles ?? seed.accessRoles,
    collaboratorFirstView: imported.collaboratorFirstView ?? seed.collaboratorFirstView,
    shareableArtifacts: imported.shareableArtifacts ?? seed.shareableArtifacts,
  } as HqData;
}

function repoDataIsNewer(storedData: HqData) {
  return new Date(seedHqData.updatedAt).getTime() > new Date(storedData.updatedAt).getTime();
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function formatUpdatedAt(value: string) {
  const dateOnly = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0];

  return dateOnly ?? value;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreTone(score: number) {
  if (score >= 70) {
    return "var(--accent)";
  }

  if (score >= 40) {
    return "#d97706";
  }

  return "#dc2626";
}

function StatusBadge({ value }: { value: string }) {
  const tone =
    value === "Clear" ||
    value === "Shipped" ||
    value === "Published" ||
    value === "Done" ||
    value === "Approved" ||
    value === "Working"
      ? "#047857"
      : value === "At risk" || value === "Blocked"
        ? "#b91c1c"
        : value === "In Progress" || value === "Drafting" || value === "Doing"
          ? "#b45309"
          : "var(--ink-quiet)";

  return (
    <span
      className="inline-flex items-center rounded-[999px] border px-2 py-1 font-mono text-[10px] uppercase"
      style={{
        borderColor: "color-mix(in srgb, currentColor 20%, transparent)",
        color: tone,
        letterSpacing: "0.08em",
      }}
    >
      {value}
    </span>
  );
}

function ScoreBar({ score, label }: { score: number; label?: string }) {
  const safeScore = clampScore(score);

  return (
    <div className="space-y-2">
      {label ? (
        <div className="flex items-center justify-between gap-4 text-[12px]">
          <span className="text-ink-quiet">{label}</span>
          <span className="font-mono text-ink">{safeScore}%</span>
        </div>
      ) : null}
      <div className="h-2 overflow-hidden rounded-[999px] bg-ink-100">
        <div
          className="h-full rounded-[999px]"
          style={{
            width: `${safeScore}%`,
            background: scoreTone(safeScore),
          }}
        />
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="mb-6">
      <div
        className="mb-2 font-mono text-[11px] font-semibold uppercase text-ink-faint"
        style={{ letterSpacing: "0.14em" }}
      >
        {eyebrow}
      </div>
      <h2 className="text-[24px] font-semibold leading-tight tracking-[-0.03em] text-ink">
        {title}
      </h2>
      {body ? <p className="mt-2 max-w-3xl text-[14px] leading-6 text-ink-quiet">{body}</p> : null}
    </div>
  );
}

function FileBackedNotice({ section }: { section: string }) {
  return (
    <div
      className="mb-5 flex items-center gap-3 border-t border-b border-border-soft px-0 py-2.5"
      role="note"
    >
      <span
        aria-hidden="true"
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: "var(--accent)" }}
      />
      <span
        className="font-mono text-[10.5px] uppercase tracking-wider"
        style={{ color: "var(--accent)", letterSpacing: "0.08em" }}
      >
        file-backed · edit at content/hq/{section}/
      </span>
      <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-quiet">
        operator-edit affordances hidden here
      </span>
    </div>
  );
}

function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cx("hq-panel rounded-[8px] border border-border-soft bg-bg-elev p-5 shadow-1", className)}
    >
      {children}
    </section>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-1.5 text-[12px] font-medium text-ink-quiet">
      {label}
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-[6px] border border-border-soft bg-bg px-3 text-[13px] text-ink outline-none transition focus:border-accent"
      />
    </label>
  );
}

function SelectInput<T extends string>({
  value,
  values,
  onChange,
  label,
}: {
  value: T;
  values: T[];
  onChange: (value: T) => void;
  label?: string;
}) {
  return (
    <label className="grid gap-1.5 text-[12px] font-medium text-ink-quiet">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="h-10 rounded-[6px] border border-border-soft bg-bg px-3 text-[13px] text-ink outline-none transition focus:border-accent"
      >
        {values.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function formatMetric(metric: MetricItem) {
  if (metric.unit === "percent") {
    return `${metric.value}%`;
  }

  if (metric.unit === "eur") {
    return `€${metric.value.toLocaleString("en-IE")}`;
  }

  return metric.value.toLocaleString("en-IE");
}

function makeProspect(): Prospect {
  const now = Date.now();

  return {
    id: `prospect-${now}`,
    organisation: "",
    segment: "Wedding venues / hotels",
    contactName: "",
    role: "",
    email: "",
    website: "",
    location: "",
    source: "",
    status: "To Contact",
    lastContacted: "",
    nextFollowUp: "",
    personalisationNote: "",
    offerSent: "",
    outcome: "",
    notes: "",
  };
}

type HqDashboardMarkdown = {
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
};

export function HqDashboard({ markdown }: { markdown?: HqDashboardMarkdown }) {
  const [data, setData] = useState<HqData>(() => safeCloneData());
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [featureFilter, setFeatureFilter] = useState("All");
  const [prospectDraft, setProspectDraft] = useState<Prospect>(() => makeProspect());
  const [importError, setImportError] = useState("");
  const [repoUpdateAvailable, setRepoUpdateAvailable] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as HqData;
      if (parsed.version === 1) {
        setData(normalizeData(parsed));
        setRepoUpdateAvailable(repoDataIsNewer(parsed));
      }
    } catch {
      setImportError("Saved HQ data could not be read. Seed data is showing.");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const derived = useMemo(() => deriveHqState(data), [data]);

  function updateData(updater: (current: HqData) => HqData) {
    setData((current) => ({ ...updater(current), updatedAt: getToday() }));
  }

  function updateItem<T extends { id: string }>(
    key: HqArrayKey,
    id: string,
    patch: Partial<T>
  ) {
    updateData((current) => ({
      ...current,
      [key]: (current[key] as unknown as T[]).map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    }));
  }

  function deleteItem<T extends { id: string }>(key: HqArrayKey, id: string) {
    updateData((current) => ({
      ...current,
      [key]: (current[key] as unknown as T[]).filter((item) => item.id !== id),
    }));
  }

  function addProspect() {
    if (!prospectDraft.organisation.trim()) {
      return;
    }

    updateData((current) => ({
      ...current,
      prospects: [{ ...prospectDraft, id: `prospect-${Date.now()}` }, ...current.prospects],
    }));
    setProspectDraft(makeProspect());
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `signal-hq-${data.updatedAt.replace(/[^0-9a-z-]/gi, "-")}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function importData(file: File | undefined) {
    if (!file) {
      return;
    }

    try {
      const imported = JSON.parse(await file.text()) as HqData;
      if (imported.version !== 1) {
        setImportError("That file is not a Signal HQ v1 export.");
        return;
      }

      setData({ ...normalizeData(imported), updatedAt: getToday() });
      setRepoUpdateAvailable(false);
      setImportError("");
    } catch {
      setImportError("That file could not be imported.");
    }
  }

  function resetData() {
    const confirmed = window.confirm("Reset Signal HQ to seed data?");

    if (confirmed) {
      setData(safeCloneData());
      setRepoUpdateAvailable(false);
      setImportError("");
    }
  }

  function loadRepoVersion() {
    const confirmed = window.confirm(
      "Load the repo-backed Signal HQ version? Export your current browser data first if you need to keep it."
    );

    if (confirmed) {
      setData(safeCloneData());
      setRepoUpdateAvailable(false);
    }
  }

  const filteredFeatures = data.features.filter((feature) => {
    if (featureFilter === "All") {
      return true;
    }

    return feature.product === featureFilter || feature.status === featureFilter || feature.type === featureFilter;
  });

  return (
    <main className="min-h-screen bg-bg pb-12 text-ink">
      <div className="border-b border-border-soft bg-bg-elev">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-5 px-5 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-baseline gap-2">
              <span className="text-[22px] font-semibold tracking-[-0.045em]">
                signal hq<span style={{ color: "var(--accent)" }}>.</span>
              </span>
              <span className="font-mono text-[11px] uppercase text-ink-faint">Private</span>
            </div>
            <p className="max-w-2xl text-[14px] leading-6 text-ink-quiet">
              What needs attention today. Everything else stays out of the way.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 font-mono text-[11px] text-ink-faint">Updated {formatUpdatedAt(data.updatedAt)}</span>
            <button
              type="button"
              onClick={exportData}
              className="rounded-[6px] border border-border-soft bg-bg px-3 py-2 text-[12px] font-medium text-ink transition hover:border-accent"
            >
              Export
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-[6px] border border-border-soft bg-bg px-3 py-2 text-[12px] font-medium text-ink transition hover:border-accent"
            >
              Import
            </button>
            <button
              type="button"
              onClick={resetData}
              className="rounded-[6px] border border-border-soft bg-bg px-3 py-2 text-[12px] font-medium text-ink transition hover:border-accent"
            >
              Reset
            </button>
            <a
              href="/hq/atlas"
              className="rounded-[6px] border border-border-soft bg-bg px-3 py-2 font-mono text-[12px] lowercase text-ink no-underline transition hover:border-accent"
              style={{ letterSpacing: "0.04em" }}
            >
              atlas
            </a>
            <a
              href="/hq/entitlements"
              className="rounded-[6px] border border-border-soft bg-bg px-3 py-2 text-[12px] font-medium text-ink no-underline transition hover:border-accent"
            >
              Entitlements →
            </a>
            <a
              href="/hq/partners"
              className="rounded-[6px] border border-border-soft bg-bg px-3 py-2 text-[12px] font-medium text-ink no-underline transition hover:border-accent"
            >
              Partners →
            </a>
            <form action="/hq/logout" method="post">
              <button
                type="submit"
                className="rounded-[6px] border border-border-soft bg-bg px-3 py-2 text-[12px] font-medium text-ink transition hover:border-accent"
              >
                Lock
              </button>
            </form>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(event) => void importData(event.target.files?.[0])}
            />
          </div>
        </div>
        {importError ? (
          <div className="mx-auto w-full max-w-[1180px] px-5 pb-4 text-[13px] text-red-700">
            {importError}
          </div>
        ) : null}
        {repoUpdateAvailable ? (
          <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-3 px-5 pb-4 text-[13px] text-ink-quiet md:flex-row md:items-center md:justify-between">
            <span>
              Repo-backed HQ data is newer than this browser copy. Export first if you need to keep local edits.
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={loadRepoVersion}
                className="rounded-[6px] border border-accent bg-accent-soft px-3 py-2 text-[12px] font-medium text-ink"
              >
                Load repo version
              </button>
              <button
                type="button"
                onClick={() => setRepoUpdateAvailable(false)}
                className="rounded-[6px] border border-border-soft bg-bg px-3 py-2 text-[12px] font-medium text-ink"
              >
                Not now
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mx-auto grid w-full max-w-[1180px] gap-6 px-5 py-6 lg:grid-cols-[210px_1fr]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <nav className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                data-active={activeTab === tab.id ? "true" : "false"}
                className={cx(
                  "hq-tab rounded-[6px] border px-3 py-2 text-left text-[13px] font-medium transition",
                  activeTab === tab.id
                    ? "border-accent bg-accent-soft text-ink"
                    : "border-border-soft bg-bg-elev text-ink-quiet hover:text-ink"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <div>
          {activeTab === "overview" ? (
            <OverviewTab data={data} derived={derived} />
          ) : null}
          {activeTab === "products" ? <ProductsTab data={data} markdown={markdown} /> : null}
          {activeTab === "loop" ? (
            <CollaborationLoopTab data={data} updateItem={updateItem} markdown={markdown} />
          ) : null}
          {activeTab === "pipeline" ? (
            <div className="grid gap-8">
              <FeaturesTab
                data={data}
                filteredFeatures={filteredFeatures}
                featureFilter={featureFilter}
                setFeatureFilter={setFeatureFilter}
                updateItem={updateItem}
                markdown={markdown}
              />
              <LaunchTab data={data} derived={derived} markdown={markdown} />
              <CrmTab
                data={data}
                prospectDraft={prospectDraft}
                setProspectDraft={setProspectDraft}
                addProspect={addProspect}
                updateItem={updateItem}
                deleteItem={deleteItem}
              />
            </div>
          ) : null}
          {activeTab === "proof" ? (
            <div className="grid gap-8">
              <ContentTab data={data} updateItem={updateItem} markdown={markdown} />
              <GrowthTab data={data} updateItem={updateItem} markdown={markdown} />
            </div>
          ) : null}
          {activeTab === "operations" ? (
            <div className="grid gap-8">
              <MetricsTab data={data} updateItem={updateItem} />
              <DecisionsTab data={data} updateItem={updateItem} markdown={markdown} />
              <RhythmTab data={data} updateItem={updateItem} />
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}

function OverviewTab({
  data,
  derived,
}: {
  data: HqData;
  derived: ReturnType<typeof deriveHqState>;
}) {
  const scoreCards = [
    { label: "Launch readiness", score: derived.launchReadiness, detail: "Weighted across product, GTM, demos, pilots, and tracking." },
    { label: "Product readiness", score: derived.productReadiness, detail: "Average readiness across the four products." },
    { label: "GTM readiness", score: derived.gtmReadiness, detail: "Marketing, pilots, CRM, proof, and case study readiness." },
    { label: "Connection readiness", score: derived.integrationReadiness, detail: "How close the ecosystem loop is to being visible." },
  ];

  return (
    <div>
      <SectionHeader
        eyebrow="Command overview"
        title="Understand the state of the work in under 60 seconds."
        body="The purpose of Signal HQ is not to show everything. It is to show what needs attention."
      />

      <div className="mb-5 grid gap-4 md:grid-cols-4">
        {scoreCards.map((card) => (
          <Panel key={card.label}>
            <div className="font-mono text-[11px] uppercase text-ink-faint">{card.label}</div>
            <div className="hq-score-number mt-3 text-[34px] font-semibold tracking-[-0.04em]">{card.score}%</div>
            <p className="mt-2 min-h-[42px] text-[12.5px] leading-5 text-ink-quiet">{card.detail}</p>
            <div className="mt-4">
              <ScoreBar score={card.score} />
            </div>
          </Panel>
        ))}
      </div>

      <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_0.85fr]">
        <Panel>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] uppercase text-ink-faint">Current stage</div>
              <h3 className="mt-2 text-[22px] font-semibold tracking-[-0.03em]">{data.focus.stage}</h3>
            </div>
            <StatusBadge value={data.focus.weekOf} />
          </div>
          <p className="mt-5 text-[16px] leading-7 text-ink">{data.focus.theme}</p>
          <p className="mt-2 text-[14px] leading-6 text-ink-quiet">{data.focus.focus}</p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <ListBlock title="Top priorities" items={data.focus.priorities} />
            <ListBlock title="Top risks" items={data.focus.risks} />
            <ListBlock title="Next actions" items={data.focus.nextActions} />
          </div>
        </Panel>

        <Panel>
          <div className="font-mono text-[11px] uppercase text-ink-faint">Active signals</div>
          <div className="mt-4 grid gap-3">
            {derived.signals.map((signal) => (
              <div key={signal.id} className="border-b border-border-soft pb-3 last:border-b-0 last:pb-0">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="text-[14px] font-semibold text-ink">{signal.title}</h3>
                  <StatusBadge value={signal.severity} />
                </div>
                <p className="text-[13px] leading-5 text-ink-quiet">{signal.detail}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-mono text-[11px] uppercase text-ink-faint">Balance snapshot</div>
            <h3 className="mt-2 text-[18px] font-semibold tracking-[-0.02em]">Where the operating system is uneven.</h3>
          </div>
          <span className="text-[13px] text-ink-quiet">Product should not outrun proof forever.</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {derived.balance.map((item) => (
            <ScoreBar key={item.label} label={item.label} score={item.score} />
          ))}
        </div>
      </Panel>
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="mb-2 font-mono text-[11px] uppercase text-ink-faint">{title}</div>
      <ul className="grid gap-2">
        {items.map((item) => (
          <li key={item} className="text-[13px] leading-5 text-ink-quiet">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductsTab({
  data,
  markdown,
}: {
  data: HqData;
  markdown?: HqDashboardMarkdown;
}) {
  const products = markdown?.products && markdown.products.length > 0
    ? markdown.products
    : data.products;
  const ecosystemFlows =
    markdown?.ecosystemFlows && markdown.ecosystemFlows.length > 0
      ? markdown.ecosystemFlows
      : data.ecosystemFlows;
  const isFileBacked = Boolean(markdown?.products?.length);
  return (
    <div>
      <SectionHeader
        eyebrow="Product ecosystem"
        title="Four products. Four layers of clear work."
        body="The strongest version is not four disconnected tools. It is one workspace seen through context, execution, direction, and attention."
      />

      {isFileBacked && <FileBackedNotice section="products" />}

      <div className="mb-5 grid gap-4 md:grid-cols-2">
        {products.map((product) => (
          <Panel key={product.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-mono text-[11px] uppercase text-ink-faint">{product.layer}</div>
                <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.03em]">{product.name}</h3>
              </div>
              <StatusBadge value={product.status} />
            </div>
            <p className="mt-3 text-[14px] leading-6 text-ink-quiet">{product.role}</p>
            <div className="mt-5 grid gap-3">
              <ScoreBar label="Maturity" score={product.maturity} />
              <ScoreBar label="UX polish" score={product.uxPolish} />
              <ScoreBar label="Connection" score={product.integrationScore} />
              <ScoreBar label="Launch readiness" score={product.launchReadiness} />
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <ListBlock title="Major features" items={product.majorFeatures} />
              <ListBlock title="Next actions" items={product.nextActions} />
            </div>
            {product.blockers.length ? (
              <p className="mt-4 rounded-[6px] border border-red-100 bg-red-50 px-3 py-2 text-[13px] text-red-800">
                {product.blockers.join(" ")}
              </p>
            ) : null}
          </Panel>
        ))}
      </div>

      <Panel>
        <div className="mb-4 font-mono text-[11px] uppercase text-ink-faint">Ecosystem flows</div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-border-soft text-[11px] uppercase text-ink-faint">
                <th className="py-3 pr-4 font-medium">Flow</th>
                <th className="py-3 pr-4 font-medium">Purpose</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-4 font-medium">Next action</th>
              </tr>
            </thead>
            <tbody>
              {ecosystemFlows.map((flow) => (
                <tr key={flow.id} className="border-b border-border-soft last:border-b-0">
                  <td className="py-3 pr-4 font-medium text-ink">
                    {flow.from} → {flow.to}
                  </td>
                  <td className="py-3 pr-4 text-ink-quiet">{flow.purpose}</td>
                  <td className="py-3 pr-4">
                    <StatusBadge value={flow.status} />
                  </td>
                  <td className="py-3 pr-4 text-ink-quiet">{flow.nextAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function CollaborationLoopTab({
  data,
  updateItem,
  markdown,
}: {
  data: HqData;
  updateItem: <T extends { id: string }>(key: HqArrayKey, id: string, patch: Partial<T>) => void;
  markdown?: HqDashboardMarkdown;
}) {
  const collaborationLoop =
    markdown?.collaborationLoop && markdown.collaborationLoop.length > 0
      ? markdown.collaborationLoop
      : data.collaborationLoop;
  const accessRoles =
    markdown?.accessRoles && markdown.accessRoles.length > 0
      ? markdown.accessRoles
      : data.accessRoles;
  const sharedObjects =
    markdown?.sharedObjects && markdown.sharedObjects.length > 0
      ? markdown.sharedObjects
      : data.sharedObjects;
  const collaboratorFirstView =
    markdown?.collaboratorFirstView && markdown.collaboratorFirstView.length > 0
      ? markdown.collaboratorFirstView
      : data.collaboratorFirstView;
  const shareableArtifacts =
    markdown?.shareableArtifacts && markdown.shareableArtifacts.length > 0
      ? markdown.shareableArtifacts
      : data.shareableArtifacts;
  const isFileBacked = Boolean(
    markdown?.collaborationLoop?.length ||
    markdown?.accessRoles?.length ||
    markdown?.sharedObjects?.length ||
    markdown?.collaboratorFirstView?.length ||
    markdown?.shareableArtifacts?.length,
  );
  const loopReadiness = clampScore(
    collaborationLoop.reduce((sum, item) => sum + item.readiness, 0) /
      Math.max(collaborationLoop.length, 1)
  );

  return (
    <div>
      <SectionHeader
        eyebrow="Collaboration loop"
        title="Make collaboration the organic outreach engine."
        body="The loop is simple: a creator starts a useful workspace, invites people into clear work, shares an artefact, and some of those people become future workspace creators."
      />

      {isFileBacked && <FileBackedNotice section="collaboration-loop" />}

      <Panel className="mb-5">
        <div className="grid gap-5 md:grid-cols-[1fr_220px] md:items-center">
          <div>
            <div className="font-mono text-[11px] uppercase text-ink-faint">Core loop</div>
            <p className="mt-3 text-[18px] font-semibold leading-7 tracking-[-0.02em] text-ink">
              {"Workspace created -> collaborators invited -> work becomes clearer -> shareable output created -> new creator discovered."}
            </p>
            <p className="mt-2 max-w-3xl text-[13px] leading-6 text-ink-quiet">
              This keeps the product from becoming a private productivity tool. Collaboration, shareable outputs, templates, and source tracking become the growth infrastructure.
            </p>
          </div>
          <div>
            <div className="mb-3 text-right font-mono text-[11px] uppercase text-ink-faint">Loop readiness</div>
            <div className="hq-score-number text-right text-[34px] font-semibold tracking-[-0.04em]">{loopReadiness}%</div>
            <div className="mt-4">
              <ScoreBar score={loopReadiness} />
            </div>
          </div>
        </div>
      </Panel>

      <Panel className="mb-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-mono text-[11px] uppercase text-ink-faint">Cycle 2</div>
            <h3 className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-ink">Invite and access model.</h3>
          </div>
          <span className="text-[13px] text-ink-quiet">People should see value before they configure anything.</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {accessRoles.map((role: AccessRoleItem) => (
            <div key={role.id} className="rounded-[6px] border border-border-soft bg-bg p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-[11px] uppercase text-ink-faint">{role.role}</div>
                  <h4 className="mt-1 font-semibold text-ink">{role.plainName}</h4>
                </div>
                <StatusBadge value={role.status} />
              </div>
              <p className="text-[13px] leading-5 text-ink-quiet">{role.purpose}</p>
              <p className="mt-3 text-[12px] leading-5 text-ink-quiet">
                Access: <span className="text-ink">{role.defaultAccess}</span>
              </p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <ListBlock title="Can do" items={role.canDo} />
                <ListBlock title="Cannot do" items={role.cannotDo} />
              </div>
              <p className="mt-3 text-[12px] leading-5 text-ink-quiet">
                Next: <span className="text-ink">{role.nextAction}</span>
              </p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="mb-5 grid gap-4 md:grid-cols-2">
        {collaborationLoop.map((step: CollaborationLoopStep) => (
          <Panel key={step.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-mono text-[11px] uppercase text-ink-faint">{step.productOwner}</div>
                <h3 className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-ink">{step.step}</h3>
              </div>
              <StatusBadge value={step.status} />
            </div>
            <p className="mt-3 min-h-[64px] text-[13px] leading-5 text-ink-quiet">{step.purpose}</p>
            <div className="mt-4 grid gap-3">
              <ScoreBar label="Readiness" score={step.readiness} />
              <div className="text-[12px] leading-5 text-ink-quiet">
                Surface: <span className="text-ink">{step.growthSurface}</span>
              </div>
              <div className="text-[12px] leading-5 text-ink-quiet">
                Metric: <span className="text-ink">{step.metric}</span>
              </div>
              <div className="text-[12px] leading-5 text-ink-quiet">
                Next: <span className="text-ink">{step.nextAction}</span>
              </div>
              <SelectInput
                label="Status"
                value={step.status}
                values={workStatuses}
                onChange={(status) => updateItem<CollaborationLoopStep>("collaborationLoop", step.id, { status })}
              />
            </div>
          </Panel>
        ))}
      </div>

      <div className="mb-5 grid gap-4 lg:grid-cols-2">
        <Panel>
          <div className="mb-4 font-mono text-[11px] uppercase text-ink-faint">Collaborator first view</div>
          <div className="grid gap-4">
            {collaboratorFirstView.map((item: CollaboratorFirstViewItem) => (
              <div key={item.id} className="border-b border-border-soft pb-4 last:border-b-0 last:pb-0">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-ink">{item.section}</h3>
                    <p className="mt-1 text-[13px] leading-5 text-ink-quiet">{item.question}</p>
                  </div>
                  <StatusBadge value={item.status} />
                </div>
                <p className="text-[13px] leading-5 text-ink-quiet">{item.purpose}</p>
                <div className="mt-3 text-[12px] leading-5 text-ink-quiet">
                  Source: <span className="text-ink">{item.sourceProduct}</span>
                </div>
                <div className="text-[12px] leading-5 text-ink-quiet">
                  Next: <span className="text-ink">{item.nextAction}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <div className="mb-4 font-mono text-[11px] uppercase text-ink-faint">First shareable artefacts</div>
          <div className="grid gap-4">
            {shareableArtifacts.map((artifact: ShareableArtifactItem) => (
              <div key={artifact.id} className="border-b border-border-soft pb-4 last:border-b-0 last:pb-0">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-ink">{artifact.name}</h3>
                    <p className="mt-1 text-[13px] leading-5 text-ink-quiet">{artifact.purpose}</p>
                  </div>
                  <StatusBadge value={artifact.status} />
                </div>
                <div className="grid gap-2 text-[12px] text-ink-quiet">
                  <div>Owner: <span className="text-ink">{artifact.ownerProduct}</span></div>
                  <div>Visibility: <span className="text-ink">{artifact.defaultVisibility}</span></div>
                  <div>Tracking: <span className="text-ink">{artifact.sourceTracking}</span></div>
                  <div>CTA: <span className="text-ink">{artifact.cta}</span></div>
                  <div>Next: <span className="text-ink">{artifact.nextAction}</span></div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-mono text-[11px] uppercase text-ink-faint">Shared object model</div>
            <h3 className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-ink">The objects that make four products feel like one system.</h3>
          </div>
          <span className="text-[13px] text-ink-quiet">Define once. Use everywhere.</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-border-soft text-[11px] uppercase text-ink-faint">
                <th className="py-3 pr-4 font-medium">Object</th>
                <th className="py-3 pr-4 font-medium">Definition</th>
                <th className="py-3 pr-4 font-medium">Used by</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-4 font-medium">Next action</th>
              </tr>
            </thead>
            <tbody>
              {sharedObjects.map((object: SharedObjectItem) => (
                <tr key={object.id} className="border-b border-border-soft last:border-b-0">
                  <td className="py-3 pr-4 font-medium text-ink">{object.object}</td>
                  <td className="py-3 pr-4 text-ink-quiet">{object.definition}</td>
                  <td className="py-3 pr-4 text-ink-quiet">{object.usedBy.join(", ")}</td>
                  <td className="py-3 pr-4">
                    <StatusBadge value={object.status} />
                  </td>
                  <td className="py-3 pr-4 text-ink-quiet">{object.nextAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function FeaturesTab({
  data,
  filteredFeatures,
  featureFilter,
  setFeatureFilter,
  updateItem,
  markdown,
}: {
  data: HqData;
  filteredFeatures: FeatureItem[];
  featureFilter: string;
  setFeatureFilter: (value: string) => void;
  updateItem: <T extends { id: string }>(key: HqArrayKey, id: string, patch: Partial<T>) => void;
  markdown?: HqDashboardMarkdown;
}) {
  const features = markdown?.features && markdown.features.length > 0
    ? markdown.features
    : data.features;
  const isFileBacked = Boolean(markdown?.features?.length);
  const renderFeatures = isFileBacked
    ? features.filter((f) =>
        featureFilter === "All"
          ? true
          : f.product === featureFilter ||
            f.status === featureFilter ||
            f.type === featureFilter,
      )
    : filteredFeatures;
  const filters = [
    "All",
    ...Array.from(new Set(features.flatMap((feature) => [feature.product, feature.status, feature.type]))),
  ];
  const inProgressCount = features.filter((feature) => feature.status === "In Progress").length;

  return (
    <div>
      <SectionHeader
        eyebrow="Feature tracker"
        title="Build only what sharpens clarity."
        body="Feature work should support the ecosystem loop, launch proof, or a real activation path."
      />

      {isFileBacked && <FileBackedNotice section="features" />}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <select
          value={featureFilter}
          onChange={(event) => setFeatureFilter(event.target.value)}
          className="h-10 rounded-[6px] border border-border-soft bg-bg-elev px-3 text-[13px] text-ink outline-none"
        >
          {filters.map((filter) => (
            <option key={filter} value={filter}>
              {filter}
            </option>
          ))}
        </select>
        <div className="text-[13px] text-ink-quiet">
          {inProgressCount > 4 ? "Work in progress is high." : "Work in progress is under control."}
        </div>
      </div>

      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-border-soft text-[11px] uppercase text-ink-faint">
                <th className="py-3 pr-4 font-medium">Feature</th>
                <th className="py-3 pr-4 font-medium">Product</th>
                <th className="py-3 pr-4 font-medium">Type</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-4 font-medium">Priority</th>
                <th className="py-3 pr-4 font-medium">Alignment</th>
                <th className="py-3 pr-4 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {renderFeatures.map((feature) => (
                <tr key={feature.id} className="border-b border-border-soft last:border-b-0">
                  <td className="py-3 pr-4 font-medium text-ink">{feature.name}</td>
                  <td className="py-3 pr-4 text-ink-quiet">{feature.product}</td>
                  <td className="py-3 pr-4 text-ink-quiet">{feature.type}</td>
                  <td className="py-3 pr-4">
                    {isFileBacked ? (
                      <span className="font-mono text-[12px] text-ink-quiet">
                        {feature.status.toLowerCase()}
                      </span>
                    ) : (
                      <select
                        value={feature.status}
                        onChange={(event) =>
                          updateItem<FeatureItem>("features", feature.id, {
                            status: event.target.value as FeatureItem["status"],
                          })
                        }
                        className="h-9 rounded-[6px] border border-border-soft bg-bg px-2 text-[12px]"
                      >
                        {workStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="py-3 pr-4">{feature.priority}</td>
                  <td className="py-3 pr-4">
                    <ScoreBar score={feature.principleAlignment} />
                  </td>
                  <td className="py-3 pr-4 text-ink-quiet">{feature.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function LaunchTab({
  data,
  derived,
  markdown,
}: {
  data: HqData;
  derived: ReturnType<typeof deriveHqState>;
  markdown?: HqDashboardMarkdown;
}) {
  const launchReadiness =
    markdown?.launchReadiness && markdown.launchReadiness.length > 0
      ? markdown.launchReadiness
      : data.launchReadiness;
  const isFileBacked = Boolean(markdown?.launchReadiness?.length);
  return (
    <div>
      <SectionHeader
        eyebrow="Launch readiness"
        title={`${derived.launchReadiness}% ready. Proof work is the gap.`}
        body="The weighted model keeps launch pressure honest. Product stability matters, but activation, demos, pilots, and tracking matter too."
      />
      {isFileBacked && <FileBackedNotice section="launch-readiness" />}
      <div className="grid gap-4">
        {launchReadiness.map((item) => (
          <Panel key={item.id}>
            <div className="grid gap-4 md:grid-cols-[220px_1fr_130px] md:items-start">
              <div>
                <div className="font-semibold text-ink">{item.category}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <StatusBadge value={item.status} />
                  <span className="font-mono text-[11px] text-ink-faint">Weight {item.weight}</span>
                </div>
              </div>
              <div>
                <p className="text-[13px] leading-5 text-ink-quiet">{item.notes}</p>
                {item.blockers.length ? (
                  <p className="mt-2 text-[13px] leading-5 text-red-700">{item.blockers.join(" ")}</p>
                ) : null}
                <p className="mt-2 text-[13px] leading-5 text-ink">
                  Next: <span className="text-ink-quiet">{item.nextAction}</span>
                </p>
              </div>
              <ScoreBar score={item.score} />
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

function GrowthTab({
  data,
  updateItem,
  markdown,
}: {
  data: HqData;
  updateItem: <T extends { id: string }>(key: HqArrayKey, id: string, patch: Partial<T>) => void;
  markdown?: HqDashboardMarkdown;
}) {
  const segments = markdown?.segments?.length ? markdown.segments : data.segments;
  const campaigns = markdown?.campaigns?.length ? markdown.campaigns : data.campaigns;
  const growthWorkflow = markdown?.growthWorkflow?.length
    ? markdown.growthWorkflow
    : data.growthWorkflow;
  const isFileBacked = Boolean(
    markdown?.segments?.length ||
    markdown?.campaigns?.length ||
    markdown?.growthWorkflow?.length,
  );
  const workflowFileBacked = Boolean(markdown?.growthWorkflow?.length);
  return (
    <div>
      <SectionHeader
        eyebrow="Growth"
        title="Growth work, reviewed before it ships."
        body="Structured output, not volume. Every useful asset carries a status, a review path, and a reason to exist."
      />

      {isFileBacked && <FileBackedNotice section="growth" />}

      <div className="mb-5 grid gap-4 md:grid-cols-2">
        <Panel>
          <div className="mb-4 font-mono text-[11px] uppercase text-ink-faint">Segments</div>
          <div className="grid gap-4">
            {segments.map((segment: SegmentPlan) => (
              <div key={segment.id} className="border-b border-border-soft pb-4 last:border-b-0 last:pb-0">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-ink">{segment.segment}</h3>
                    <p className="mt-1 text-[13px] leading-5 text-ink-quiet">{segment.coreMessage}</p>
                  </div>
                  <StatusBadge value={segment.status} />
                </div>
                <ScoreBar label="Confidence" score={segment.confidence} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <div className="mb-4 font-mono text-[11px] uppercase text-ink-faint">Campaigns</div>
          <div className="grid gap-4">
            {campaigns.map((campaign: Campaign) => (
              <div key={campaign.id} className="border-b border-border-soft pb-4 last:border-b-0 last:pb-0">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-ink">{campaign.name}</h3>
                    <p className="mt-1 text-[13px] leading-5 text-ink-quiet">{campaign.goal}</p>
                  </div>
                  <StatusBadge value={campaign.status} />
                </div>
                <ScoreBar label={campaign.nextStep} score={campaign.progress} />
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel>
        <div className="mb-4 font-mono text-[11px] uppercase text-ink-faint">Review queue and metadata</div>
        <div className="grid gap-4">
          {growthWorkflow.map((item: GrowthWorkflowItem) => (
            <div key={item.id} className="grid gap-4 border-b border-border-soft pb-4 last:border-b-0 last:pb-0 md:grid-cols-[1fr_190px]">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-ink">{item.title}</h3>
                  <StatusBadge value={item.roleOwner} />
                </div>
                <p className="text-[13px] leading-5 text-ink-quiet">{item.rationale}</p>
                <div className="mt-3 grid gap-2 text-[12px] text-ink-quiet md:grid-cols-2">
                  <div>Audience: {item.audience}</div>
                  <div>Campaign: {item.campaign}</div>
                  <div>Goal: {item.goal}</div>
                  <div>CTA: {item.cta}</div>
                </div>
              </div>
              <div>
                {workflowFileBacked ? (
                  <span className="font-mono text-[12px] text-ink-quiet">
                    {item.status.toLowerCase()}
                  </span>
                ) : (
                  <SelectInput
                    value={item.status}
                    values={growthStatuses}
                    onChange={(status) => updateItem<GrowthWorkflowItem>("growthWorkflow", item.id, { status })}
                  />
                )}
                <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
                  <StatusBadge value={`Brand ${item.brandRisk}`} />
                  <StatusBadge value={`Trust ${item.complianceRisk}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function CrmTab({
  data,
  prospectDraft,
  setProspectDraft,
  addProspect,
  updateItem,
  deleteItem,
}: {
  data: HqData;
  prospectDraft: Prospect;
  setProspectDraft: (value: Prospect) => void;
  addProspect: () => void;
  updateItem: <T extends { id: string }>(key: HqArrayKey, id: string, patch: Partial<T>) => void;
  deleteItem: <T extends { id: string }>(key: HqArrayKey, id: string) => void;
}) {
  const contacted = data.prospects.filter((prospect) => prospect.status !== "To Contact").length;
  const replies = data.prospects.filter((prospect) =>
    ["Replied", "Demo Booked", "Pilot Active"].includes(prospect.status)
  ).length;
  const pilots = data.prospects.filter((prospect) => prospect.status === "Pilot Active").length;
  const replyRate = contacted ? Math.round((replies / contacted) * 100) : 0;

  return (
    <div>
      <SectionHeader
        eyebrow="Outbound CRM"
        title="Follow-up is part of the product loop."
        body="This is founder-led and personal. No spam engine, no mass scraping, no fake urgency."
      />

      <div className="mb-5 grid gap-4 md:grid-cols-4">
        <MiniStat label="Prospects" value={data.prospects.length} />
        <MiniStat label="Contacted" value={contacted} />
        <MiniStat label="Reply rate" value={`${replyRate}%`} />
        <MiniStat label="Pilots active" value={pilots} />
      </div>

      <Panel className="mb-5">
        <div className="mb-4 font-mono text-[11px] uppercase text-ink-faint">Add prospect</div>
        <div className="grid gap-3 md:grid-cols-3">
          <TextInput
            label="Organisation"
            value={prospectDraft.organisation}
            onChange={(organisation) => setProspectDraft({ ...prospectDraft, organisation })}
          />
          <TextInput
            label="Contact"
            value={prospectDraft.contactName}
            onChange={(contactName) => setProspectDraft({ ...prospectDraft, contactName })}
          />
          <TextInput
            label="Email"
            value={prospectDraft.email}
            onChange={(email) => setProspectDraft({ ...prospectDraft, email })}
          />
          <TextInput
            label="Segment"
            value={prospectDraft.segment}
            onChange={(segment) => setProspectDraft({ ...prospectDraft, segment })}
          />
          <TextInput
            label="Next follow-up"
            value={prospectDraft.nextFollowUp}
            placeholder="YYYY-MM-DD"
            onChange={(nextFollowUp) => setProspectDraft({ ...prospectDraft, nextFollowUp })}
          />
          <div className="flex items-end">
            <button
              type="button"
              onClick={addProspect}
              className="h-10 w-full rounded-[6px] bg-ink px-4 text-[13px] font-medium text-white transition hover:bg-ink-soft"
            >
              Add prospect
            </button>
          </div>
        </div>
      </Panel>

      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-border-soft text-[11px] uppercase text-ink-faint">
                <th className="py-3 pr-4 font-medium">Organisation</th>
                <th className="py-3 pr-4 font-medium">Segment</th>
                <th className="py-3 pr-4 font-medium">Contact</th>
                <th className="py-3 pr-4 font-medium">Email</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-4 font-medium">Next follow-up</th>
                <th className="py-3 pr-4 font-medium">Note</th>
                <th className="py-3 pr-4 font-medium" />
              </tr>
            </thead>
            <tbody>
              {data.prospects.map((prospect) => (
                <tr key={prospect.id} className="border-b border-border-soft last:border-b-0">
                  <td className="py-3 pr-4">
                    <input
                      value={prospect.organisation}
                      onChange={(event) =>
                        updateItem<Prospect>("prospects", prospect.id, {
                          organisation: event.target.value,
                        })
                      }
                      className="w-full min-w-[180px] rounded-[6px] border border-border-soft bg-bg px-2 py-2"
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <input
                      value={prospect.segment}
                      onChange={(event) =>
                        updateItem<Prospect>("prospects", prospect.id, {
                          segment: event.target.value,
                        })
                      }
                      className="w-full min-w-[160px] rounded-[6px] border border-border-soft bg-bg px-2 py-2"
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <input
                      value={prospect.contactName}
                      onChange={(event) =>
                        updateItem<Prospect>("prospects", prospect.id, {
                          contactName: event.target.value,
                        })
                      }
                      className="w-full min-w-[150px] rounded-[6px] border border-border-soft bg-bg px-2 py-2"
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <input
                      value={prospect.email}
                      onChange={(event) =>
                        updateItem<Prospect>("prospects", prospect.id, {
                          email: event.target.value,
                        })
                      }
                      className="w-full min-w-[190px] rounded-[6px] border border-border-soft bg-bg px-2 py-2"
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <SelectInput
                      value={prospect.status}
                      values={prospectStatuses}
                      onChange={(status) => updateItem<Prospect>("prospects", prospect.id, { status })}
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <input
                      value={prospect.nextFollowUp}
                      onChange={(event) =>
                        updateItem<Prospect>("prospects", prospect.id, {
                          nextFollowUp: event.target.value,
                        })
                      }
                      className="w-full min-w-[130px] rounded-[6px] border border-border-soft bg-bg px-2 py-2"
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <input
                      value={prospect.personalisationNote}
                      onChange={(event) =>
                        updateItem<Prospect>("prospects", prospect.id, {
                          personalisationNote: event.target.value,
                        })
                      }
                      className="w-full min-w-[220px] rounded-[6px] border border-border-soft bg-bg px-2 py-2"
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <button
                      type="button"
                      onClick={() => deleteItem<Prospect>("prospects", prospect.id)}
                      className="rounded-[6px] border border-border-soft px-3 py-2 text-[12px] text-ink-quiet transition hover:border-red-200 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <Panel>
      <div className="font-mono text-[11px] uppercase text-ink-faint">{label}</div>
      <div className="hq-score-number mt-2 text-[28px] font-semibold tracking-[-0.04em]">{value}</div>
    </Panel>
  );
}

function ContentTab({
  data,
  updateItem,
  markdown,
}: {
  data: HqData;
  updateItem: <T extends { id: string }>(key: HqArrayKey, id: string, patch: Partial<T>) => void;
  markdown?: HqDashboardMarkdown;
}) {
  const contentItems = markdown?.contentItems?.length
    ? markdown.contentItems
    : data.contentItems;
  const demos = markdown?.demos?.length ? markdown.demos : data.demos;
  const templates = markdown?.templates?.length ? markdown.templates : data.templates;
  const pilots = markdown?.pilots?.length ? markdown.pilots : data.pilots;
  const isFileBacked = Boolean(
    markdown?.contentItems?.length ||
    markdown?.demos?.length ||
    markdown?.templates?.length ||
    markdown?.pilots?.length,
  );
  const contentFileBacked = Boolean(markdown?.contentItems?.length);
  const demosFileBacked = Boolean(markdown?.demos?.length);
  const templatesFileBacked = Boolean(markdown?.templates?.length);
  return (
    <div>
      <SectionHeader
        eyebrow="Content, demos, templates, pilots"
        title="Shared proof beats private polish."
        body="Each asset should make the product easier to understand, easier to share, or easier to try."
      />

      {isFileBacked && <FileBackedNotice section="content" />}

      <div className="mb-5 grid gap-4 lg:grid-cols-2">
        <Panel>
          <div className="mb-4 font-mono text-[11px] uppercase text-ink-faint">Content Studio</div>
          <div className="grid gap-4">
            {contentItems.map((item: ContentItem) => (
              <AssetRow
                key={item.id}
                title={item.title}
                detail={`${item.format} · ${item.channel} · ${item.targetSegment}`}
                status={item.status}
                select={
                  contentFileBacked ? (
                    <span className="font-mono text-[12px] text-ink-quiet">
                      {item.status.toLowerCase()}
                    </span>
                  ) : (
                    <SelectInput
                      value={item.status}
                      values={["Idea", "Script", "Recording", "Editing", "Published"]}
                      onChange={(status) => updateItem<ContentItem>("contentItems", item.id, { status })}
                    />
                  )
                }
              />
            ))}
          </div>
        </Panel>

        <Panel>
          <div className="mb-4 font-mono text-[11px] uppercase text-ink-faint">Demo Library</div>
          <div className="grid gap-4">
            {demos.map((demo: DemoAsset) => (
              <AssetRow
                key={demo.id}
                title={demo.title}
                detail={`${demo.audience} · ${demo.objective}`}
                status={demo.scriptStatus}
                select={
                  demosFileBacked ? (
                    <span className="font-mono text-[12px] text-ink-quiet">
                      {demo.scriptStatus.toLowerCase()}
                    </span>
                  ) : (
                    <SelectInput
                      value={demo.scriptStatus}
                      values={workStatuses}
                      onChange={(scriptStatus) => updateItem<DemoAsset>("demos", demo.id, { scriptStatus })}
                    />
                  )
                }
              />
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <div className="mb-4 font-mono text-[11px] uppercase text-ink-faint">Templates</div>
          <div className="grid gap-4">
            {templates.map((template: TemplateItem) => (
              <AssetRow
                key={template.id}
                title={template.name}
                detail={`${template.targetSegment} · ${template.useCase}`}
                status={template.status}
                select={
                  templatesFileBacked ? (
                    <span className="font-mono text-[12px] text-ink-quiet">
                      {template.status.toLowerCase()}
                    </span>
                  ) : (
                    <SelectInput
                      value={template.status}
                      values={["Idea", "Draft", "Built", "Tested", "Published"]}
                      onChange={(status) => updateItem<TemplateItem>("templates", template.id, { status })}
                    />
                  )
                }
              />
            ))}
          </div>
        </Panel>

        <Panel>
          <div className="mb-4 font-mono text-[11px] uppercase text-ink-faint">Pilot programmes</div>
          <div className="grid gap-4">
            {pilots.map((pilot) => (
              <div key={pilot.id} className="border-b border-border-soft pb-4 last:border-b-0 last:pb-0">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-ink">{pilot.name}</h3>
                    <p className="mt-1 text-[13px] leading-5 text-ink-quiet">{pilot.offer}</p>
                  </div>
                  <StatusBadge value={pilot.status} />
                </div>
                <p className="text-[13px] leading-5 text-ink-quiet">{pilot.ask}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function AssetRow({
  title,
  detail,
  status,
  select,
}: {
  title: string;
  detail: string;
  status: string;
  select: React.ReactNode;
}) {
  return (
    <div className="grid gap-3 border-b border-border-soft pb-4 last:border-b-0 last:pb-0 md:grid-cols-[1fr_180px]">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-ink">{title}</h3>
          <StatusBadge value={status} />
        </div>
        <p className="text-[13px] leading-5 text-ink-quiet">{detail}</p>
      </div>
      {select}
    </div>
  );
}

function MetricsTab({
  data,
  updateItem,
}: {
  data: HqData;
  updateItem: <T extends { id: string }>(key: HqArrayKey, id: string, patch: Partial<T>) => void;
}) {
  return (
    <div>
      <SectionHeader
        eyebrow="Manual metrics"
        title="Measure activation before scale."
        body="A workspace is activated when real work is added, someone is invited, the user returns, and something moves."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {data.metrics.map((metric) => (
          <Panel key={metric.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-mono text-[11px] uppercase text-ink-faint">{metric.category}</div>
                <h3 className="mt-2 font-semibold text-ink">{metric.name}</h3>
              </div>
              <div className="text-right">
                <div className="text-[24px] font-semibold tracking-[-0.03em]">{formatMetric(metric)}</div>
                <div className="font-mono text-[11px] text-ink-faint">Target {metric.target}</div>
              </div>
            </div>
            <div className="mt-4">
              <ScoreBar score={metric.target ? (metric.value / metric.target) * 100 : 0} />
            </div>
            <div className="mt-4 grid grid-cols-[1fr_auto] gap-3">
              <input
                type="number"
                value={metric.value}
                onChange={(event) =>
                  updateItem<MetricItem>("metrics", metric.id, {
                    value: Number(event.target.value),
                  })
                }
                className="h-10 rounded-[6px] border border-border-soft bg-bg px-3 text-[13px] text-ink outline-none"
              />
              <StatusBadge value={metric.unit} />
            </div>
            <p className="mt-3 text-[13px] leading-5 text-ink-quiet">{metric.notes}</p>
          </Panel>
        ))}
      </div>
    </div>
  );
}

function DecisionsTab({
  data,
  updateItem,
  markdown,
}: {
  data: HqData;
  updateItem: <T extends { id: string }>(key: HqArrayKey, id: string, patch: Partial<T>) => void;
  markdown?: HqDashboardMarkdown;
}) {
  const decisions = markdown?.decisions && markdown.decisions.length > 0
    ? markdown.decisions
    : data.decisions;
  const risks = markdown?.risks && markdown.risks.length > 0
    ? markdown.risks
    : data.risks;
  const decisionsFileBacked = Boolean(markdown?.decisions?.length);
  const isFileBacked = Boolean(markdown?.risks?.length);
  return (
    <div>
      <SectionHeader
        eyebrow="Decisions, feedback, risks"
        title="Keep why visible."
        body="Decisions prevent re-litigation. Feedback prevents guessing. Risks keep the work honest."
      />

      {decisionsFileBacked && <FileBackedNotice section="decisions" />}

      <div className="mb-5 grid gap-4">
        {decisions.map((decision: DecisionItem) => (
          <Panel key={decision.id}>
            <div className="grid gap-4 md:grid-cols-[1fr_160px]">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-ink">{decision.decision}</h3>
                  <StatusBadge value={decision.category} />
                </div>
                <p className="text-[13px] leading-5 text-ink-quiet">{decision.reason}</p>
                <p className="mt-2 text-[13px] leading-5 text-ink-quiet">Risk: {decision.risks}</p>
              </div>
              {decisionsFileBacked ? (
                <span className="font-mono text-[12px] text-ink-quiet">
                  {decision.status.toLowerCase()}
                </span>
              ) : (
                <SelectInput
                  value={decision.status}
                  values={["Active", "Revisit", "Reversed"]}
                  onChange={(status) => updateItem<DecisionItem>("decisions", decision.id, { status })}
                />
              )}
            </div>
          </Panel>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <div className="mb-4 font-mono text-[11px] uppercase text-ink-faint">Feedback and insights</div>
          <div className="grid gap-4">
            {data.feedback.map((item) => (
              <div key={item.id} className="border-b border-border-soft pb-4 last:border-b-0 last:pb-0">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-ink">{item.insight}</h3>
                  <StatusBadge value={item.severity} />
                </div>
                <p className="text-[13px] leading-5 text-ink-quiet">{item.rawFeedback}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <div className="mb-4 flex items-center justify-between font-mono text-[11px] uppercase text-ink-faint">
            <span>Risks and signals</span>
            {isFileBacked && <span className="text-accent">file-backed</span>}
          </div>
          <div className="grid gap-4">
            {risks.map((risk: RiskItem) => (
              <div key={risk.id} className="border-b border-border-soft pb-4 last:border-b-0 last:pb-0">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-ink">{risk.risk}</h3>
                  <StatusBadge value={risk.status} />
                </div>
                <p className="text-[13px] leading-5 text-ink-quiet">{risk.mitigation}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function RhythmTab({
  data,
  updateItem,
}: {
  data: HqData;
  updateItem: <T extends { id: string }>(key: HqArrayKey, id: string, patch: Partial<T>) => void;
}) {
  return (
    <div>
      <SectionHeader
        eyebrow="Weekly rhythm and messaging"
        title="Keep the operating cadence visible."
        body="The rhythm is intentionally small. It gives distribution a place in the week without taking over the company."
      />

      <div className="mb-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel>
          <div className="mb-4 font-mono text-[11px] uppercase text-ink-faint">This week</div>
          <div className="grid gap-3">
            {data.weeklyRhythm.map((item: WeeklyRhythmItem) => (
              <label
                key={item.id}
                className="flex items-start gap-3 border-b border-border-soft pb-3 last:border-b-0 last:pb-0"
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(event) =>
                    updateItem<WeeklyRhythmItem>("weeklyRhythm", item.id, {
                      checked: event.target.checked,
                    })
                  }
                  className="mt-1 size-4 accent-[var(--accent)]"
                />
                <span>
                  <span className="block font-mono text-[11px] uppercase text-ink-faint">{item.day}</span>
                  <span className="text-[13px] leading-5 text-ink">{item.action}</span>
                </span>
              </label>
            ))}
          </div>
        </Panel>

        <Panel>
          <div className="mb-4 font-mono text-[11px] uppercase text-ink-faint">Messaging bank</div>
          <div className="grid gap-4">
            <MessageBlock title="Core positioning" value={data.messaging.positioning} />
            <MessageBlock title="Ecosystem line" value={data.messaging.ecosystemLine} />
            <MessageBlock title="Founder story" value={data.messaging.founderStory} />
            <ListBlock title="Hooks" items={data.messaging.hooks} />
          </div>
        </Panel>
      </div>

      <Panel>
        <div className="mb-4 font-mono text-[11px] uppercase text-ink-faint">Next actions</div>
        <div className="grid gap-4">
          {data.nextActions.map((action: NextActionItem) => (
            <div key={action.id} className="grid gap-4 border-b border-border-soft pb-4 last:border-b-0 last:pb-0 md:grid-cols-[1fr_150px_130px] md:items-start">
              <div>
                <h3 className="font-semibold text-ink">{action.action}</h3>
                <p className="mt-1 text-[13px] leading-5 text-ink-quiet">{action.notes}</p>
              </div>
              <StatusBadge value={`${action.priority} priority`} />
              <SelectInput
                value={action.status}
                values={actionStatuses}
                onChange={(status) => updateItem<NextActionItem>("nextActions", action.id, { status })}
              />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function MessageBlock({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <div className="mb-1 font-mono text-[11px] uppercase text-ink-faint">{title}</div>
      <p className="text-[13px] leading-6 text-ink-quiet">{value}</p>
    </div>
  );
}
