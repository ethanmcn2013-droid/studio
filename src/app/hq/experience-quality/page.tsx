import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { loadExperienceQualityData } from "@/lib/experience-quality/load";
import type {
  BreakpointId,
  ExperienceClass,
  ExperienceState,
} from "@/lib/experience-quality/types";
import styles from "./experience-quality.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Experience quality · Signal HQ",
  description: "The private founder-operator registry, evidence wall, findings, and design-quality gate.",
  robots: { index: false, follow: false },
};

const PRODUCT_LABELS: Record<string, string> = {
  studio: "Studio company surface",
  tasks: "Tasks",
  timeline: "Timeline",
  signal: "Signal",
  notes: "Notes",
  "signal-review": "Signal Review instrument",
};

const EXPERIENCE_CLASS_LABELS: Record<ExperienceClass, string> = {
  "customer-product": "Customer products",
  "company-public": "Company public",
  "founder-operator": "Founder-operator",
};

type QualitySearchParams = {
  product?: string;
  experienceClass?: string;
  status?: string;
  archetype?: string;
  severity?: string;
  score?: string;
  state?: string;
  breakpoint?: string;
};

function qualityHref(current: Required<QualitySearchParams>, updates: QualitySearchParams) {
  const values = { ...current, ...updates };
  const query = Object.entries(values)
    .filter(([, value]) => value && value !== "all")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
  return `/hq/experience-quality${query ? `?${query}` : ""}`;
}

function evidenceUrl(file: string | null, kind: "candidate" | "baseline" | "diff") {
  return file
    ? `/hq/experience-quality/evidence?kind=${kind}&file=${encodeURIComponent(file)}`
    : null;
}

export default async function ExperienceQualityPage({
  searchParams,
}: {
  searchParams: Promise<QualitySearchParams>;
}) {
  await requireHqAccess();
  const {
    product = "all",
    experienceClass = "all",
    status = "all",
    archetype = "all",
    severity = "all",
    score = "all",
    state = "all",
    breakpoint = "all",
  } = await searchParams;
  const currentFilters = {
    product,
    experienceClass,
    status,
    archetype,
    severity,
    score,
    state,
    breakpoint,
  };
  const { registry, findings, audits, reviews, capture, report } = loadExperienceQualityData();
  const openFindings = findings.filter(
    (finding) => finding.status !== "resolved" && finding.status !== "accepted-exception",
  );
  const filtered = registry.experiences.filter((entry) => {
    const entryFindings = findings.filter((finding) => entry.openFindingIds.includes(finding.id));
    const productMatches = product === "all" || entry.product === product;
    const experienceClassMatches =
      experienceClass === "all" || entry.experienceClass === experienceClass;
    const statusMatches =
      status === "all" ||
      (status === "findings"
        ? entry.openFindingIds.length > 0
        : status === "critical"
          ? entry.reviewTier === "critical"
          : entry.auditStatus === status);
    const archetypeMatches = archetype === "all" || entry.archetype === archetype;
    const severityMatches = severity === "all" || entryFindings.some((finding) => finding.severity === severity);
    const scoreMatches =
      score === "all" ||
      (score === "unscored" && entry.auditScore === null) ||
      (score === "below-3" && entry.auditScore !== null && entry.auditScore < 3) ||
      (score === "3-plus" && entry.auditScore !== null && entry.auditScore >= 3) ||
      (score === "3.5-plus" && entry.auditScore !== null && entry.auditScore >= 3.5);
    const stateMatches = state === "all" || entry.requiredStates.includes(state as ExperienceState);
    const breakpointMatches = breakpoint === "all" || entry.requiredBreakpoints.includes(breakpoint as BreakpointId);
    return productMatches && experienceClassMatches && statusMatches && archetypeMatches && severityMatches && scoreMatches && stateMatches && breakpointMatches;
  });
  const filteredIds = new Set(filtered.map((entry) => entry.id));
  const evidence = capture?.results.filter(
    (item) =>
      filteredIds.has(item.experienceId) &&
      (state === "all" || item.state === state) &&
      (breakpoint === "all" || item.breakpoint === breakpoint),
  ) ?? [];
  const archetypes = [...new Set(registry.experiences.map((entry) => entry.archetype))].sort();
  const states = [...new Set(registry.experiences.flatMap((entry) => entry.requiredStates))].sort();
  const breakpoints = Object.keys(registry.breakpoints);
  const passing = registry.experiences.filter((entry) => entry.auditStatus === "passing").length;
  const capturePassing = capture?.summary.passing ?? 0;
  const baselineStatus = report?.status ?? "not-generated";
  const classCounts = Object.fromEntries(
    Object.keys(EXPERIENCE_CLASS_LABELS).map((id) => [
      id,
      registry.experiences.filter((entry) => entry.experienceClass === id).length,
    ]),
  );

  return (
    <main id="main" className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.eyebrow}>Signal HQ / Founder-operator control plane</div>
        <div className={styles.heroGrid}>
          <div>
            <h1>The quality system is visible<span aria-hidden="true">.</span></h1>
            <p>
              Tasks, Timeline, Signal, and Notes are the four customer products. The Studio public site
              is the company surface. HQ and Signal Review are private operating instruments, never customer products.
            </p>
          </div>
          <div className={styles.verdict} data-state={baselineStatus}>
            <span>Current verdict</span>
            <strong>{passing ? `${passing} Studio-grade surfaces` : "Baseline registered. Quality not yet proven."}</strong>
            <small>{openFindings.length} open findings · golden set provisional · not launch approval</small>
          </div>
        </div>
      </header>

      <section className={styles.metrics} aria-label="Quality system metrics">
        <div><strong>{registry.experiences.length}</strong><span>experiences</span></div>
        <div><strong>{classCounts["customer-product"]}</strong><span>customer-product surfaces</span></div>
        <div><strong>{classCounts["company-public"]}</strong><span>company-public surfaces</span></div>
        <div><strong>{classCounts["founder-operator"]}</strong><span>founder-operator surfaces</span></div>
        <div><strong>{capturePassing}/{capture?.summary.captures ?? 0}</strong><span>pilot captures passing</span></div>
        <div><strong>{openFindings.length}</strong><span>open findings</span></div>
      </section>

      <section className={styles.section} aria-labelledby="evidence-title">
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.kicker}>01 / Rendered evidence</span>
            <h2 id="evidence-title">The screen wall</h2>
          </div>
          <p>Deterministic locale, timezone, reduced motion, viewport, console, overflow, keyboard, axe, and pixel evidence.</p>
        </div>
        {evidence.length ? (
          <div className={styles.evidenceGrid}>
            {evidence.map((item) => {
              const image = evidenceUrl(item.candidateScreenshot, "candidate");
              return (
                <article className={styles.evidenceCard} key={`${item.experienceId}-${item.breakpoint}`}>
                  <div className={styles.captureFrame}>
                    {image ? (
                      <Image
                        src={image}
                        alt={`${item.experienceId} at the ${item.breakpoint} breakpoint`}
                        width={item.viewport.width}
                        height={item.viewport.height}
                        unoptimized
                      />
                    ) : <span>Capture unavailable</span>}
                  </div>
                  <div className={styles.captureMeta}>
                    <span>{PRODUCT_LABELS[item.product] ?? item.product} / {item.breakpoint}</span>
                    <strong data-pass={item.pass}>{item.pass ? "pass" : "review"}</strong>
                  </div>
                  <h3>{item.experienceId}</h3>
                  <p>
                    {item.accessibility.blocking} blocking a11y · {item.runtime.overflowPixels ?? "?"}px overflow · {item.visual.state}
                  </p>
                </article>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyEvidence}>
            <strong>No deterministic capture manifest yet.</strong>
            <span>Run <code>pnpm experience:capture</code>; the wall reads the resulting evidence directly.</span>
          </div>
        )}
      </section>

      <section className={styles.section} aria-labelledby="registry-title">
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.kicker}>02 / Experience registry</span>
            <h2 id="registry-title">{filtered.length} governed surfaces</h2>
          </div>
          <p>Stable IDs connect code, states, findings, screenshots, audits, owners, exceptions, and approvals.</p>
        </div>
        <nav className={styles.filters} aria-label="Filter experiences by audience class">
          {["all", ...Object.keys(EXPERIENCE_CLASS_LABELS)].map((id) => (
            <Link
              key={id}
              href={qualityHref(currentFilters, { experienceClass: id })}
              aria-current={experienceClass === id ? "page" : undefined}
            >
              {id === "all" ? "All audiences" : EXPERIENCE_CLASS_LABELS[id as ExperienceClass]}
            </Link>
          ))}
        </nav>
        <nav className={styles.statusFilters} aria-label="Filter experiences by source system">
          {["all", ...Object.keys(PRODUCT_LABELS)].map((id) => (
            <Link
              key={id}
              href={qualityHref(currentFilters, { product: id })}
              aria-current={product === id ? "page" : undefined}
            >
              {id === "all" ? "All" : PRODUCT_LABELS[id]}
            </Link>
          ))}
        </nav>
        <div className={styles.statusFilters} aria-label="Filter experiences by status">
          {["all", "critical", "findings", "registered", "under-remediation", "passing"].map((id) => (
            <Link
              key={id}
              href={qualityHref(currentFilters, { status: id })}
              aria-current={status === id ? "page" : undefined}
            >
              {id.replaceAll("-", " ")}
            </Link>
          ))}
        </div>
        <form className={styles.advancedFilters} method="get" aria-label="Filter experiences by review evidence">
          <input type="hidden" name="product" value={product} />
          <input type="hidden" name="experienceClass" value={experienceClass} />
          <input type="hidden" name="status" value={status} />
          <label>
            <span>Archetype</span>
            <select name="archetype" defaultValue={archetype}>
              <option value="all">All archetypes</option>
              {archetypes.map((id) => <option key={id} value={id}>{id.replaceAll("-", " ")}</option>)}
            </select>
          </label>
          <label>
            <span>Severity</span>
            <select name="severity" defaultValue={severity}>
              <option value="all">All severities</option>
              {["release-blocking", "high", "medium", "low", "opportunity"].map((id) => (
                <option key={id} value={id}>{id.replaceAll("-", " ")}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Score</span>
            <select name="score" defaultValue={score}>
              <option value="all">All scores</option>
              <option value="unscored">Unscored</option>
              <option value="below-3">Below 3</option>
              <option value="3-plus">3 or above</option>
              <option value="3.5-plus">3.5 or above</option>
            </select>
          </label>
          <label>
            <span>State</span>
            <select name="state" defaultValue={state}>
              <option value="all">All states</option>
              {states.map((id) => <option key={id} value={id}>{id.replaceAll("-", " ")}</option>)}
            </select>
          </label>
          <label>
            <span>Breakpoint</span>
            <select name="breakpoint" defaultValue={breakpoint}>
              <option value="all">All breakpoints</option>
              {breakpoints.map((id) => <option key={id} value={id}>{id}</option>)}
            </select>
          </label>
          <div className={styles.filterActions}>
            <button type="submit">Apply filters</button>
            <Link href="/hq/experience-quality">Reset</Link>
          </div>
        </form>
        <div className={styles.registryTable} role="table" aria-label="Experience registry">
          <div className={styles.registryHeader} role="row">
            <span role="columnheader">Experience</span><span role="columnheader">Contract</span><span role="columnheader">Evidence</span><span role="columnheader">Status</span>
          </div>
          {filtered.map((entry) => (
            <article className={styles.registryRow} role="row" key={entry.id}>
              <div role="cell">
                <span className={styles.product}>{PRODUCT_LABELS[entry.product] ?? entry.product}</span>
                <strong>{entry.id}</strong>
                <code>{entry.route ?? entry.trigger}</code>
              </div>
              <div role="cell">
                <span>{entry.archetype.replaceAll("-", " ")}</span>
                <small>{EXPERIENCE_CLASS_LABELS[entry.experienceClass]} · {entry.requiredStates.length} states · {entry.requiredBreakpoints.length} widths · {entry.reviewTier}</small>
              </div>
              <div role="cell">
                <span>{entry.screenshotCoverage} screenshot</span>
                <small>{entry.accessibilityCoverage} a11y · {entry.fixtureCoverage} fixture</small>
              </div>
              <div role="cell">
                <span className={styles.status} data-status={entry.auditStatus}>{entry.auditStatus.replaceAll("-", " ")}</span>
                <small>{entry.openFindingIds.length} open · {entry.auditScore ?? "unscored"}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.footerGrid}>
        <article>
          <span className={styles.kicker}>Gate logic</span>
          <h2>Thirteen dimensions. No averaged-away failure.</h2>
          <p>A score needs rendered evidence. Every category must reach 3, overall must reach 3.5, and no release blocker may remain.</p>
        </article>
        <article>
          <span className={styles.kicker}>Review records</span>
          <h2>{audits.length} audits. {reviews.length} decisions.</h2>
          <p>Baseline, candidate, diff, finding IDs, approval history, design-system links, code references, and resolution proof stay connected.</p>
        </article>
        <article>
          <span className={styles.kicker}>Machine state</span>
          <h2>{report?.structuralErrors.length ?? 0} structural errors.</h2>
          <p>The registry self-test adds an unregistered route and proves the gate rejects it; the conformance self-test does the same with a retired token.</p>
        </article>
      </section>

      <footer className={styles.footer}>
        <Link href="/hq">Back to HQ</Link>
        <Link href="/hq/operator-todos">Founder gates</Link>
        <span>Generated {report?.generatedAt ? new Date(report.generatedAt).toLocaleString("en-GB") : "after first audit"}</span>
      </footer>
    </main>
  );
}
