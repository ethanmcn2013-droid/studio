import Link from "next/link";
import { formatHoursAgo, getTodayData } from "@/lib/hq/today";

/**
 * HQ Today — the derived, read-only signal block above the dashboard.
 * Renders five sections:
 *
 *   - phase line (from ~/.claude/state/phase.md)
 *   - repo activity (last commit per product repo, with hours-ago)
 *   - atlas drift (any entries flagged in content/atlas/_drift.json)
 *   - analytics cron health (from studio Turso `cron_runs`)
 *   - session pulse (count of Stop-hook responses logged today / 7d)
 *
 * Everything is derived from real sources. No localStorage, no seed
 * prose, no manual updates. Sessions impact HQ because sessions impact
 * the source files HQ reads.
 *
 * Visual register matches the atlas: paper white, ink #111, indigo on
 * the active accent only, hairlines instead of card chrome.
 */
export async function HqToday() {
  const data = await getTodayData();
  const repos = data.repos
    .filter((r) => r.available)
    .sort((a, b) => {
      const ha = a.hoursSinceLastCommit ?? Number.POSITIVE_INFINITY;
      const hb = b.hoursSinceLastCommit ?? Number.POSITIVE_INFINITY;
      return ha - hb;
    });
  const freshestRepo = repos[0];

  return (
    <section className="hq-today" aria-label="today">
      <div className="hq-today-header">
        <span className="hq-today-eyebrow">today · derived from source</span>
        <span className="hq-today-stamp">
          generated {new Date(data.generatedAt).toLocaleTimeString("en-IE", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      <h2 className="hq-today-headline">
        {data.phase.headline === "—" ? "No phase recorded yet." : data.phase.headline}
      </h2>

      {data.products.length > 0 && (
        <div className="hq-today-products" aria-label="four products">
          {data.products.map((p) => (
            <div key={p.id} className="hq-today-product">
              <div className="hq-today-product-name">{p.title}</div>
              <div className="hq-today-product-layer">{p.layer.toLowerCase()}</div>
              <div className="hq-today-product-meta">
                {p.status.toLowerCase()}
                {p.maturity > 0 ? ` · ${p.maturity}%` : ""}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="hq-today-grid">
        <article className="hq-today-block">
          <div className="hq-today-label">repo activity</div>
          {repos.length === 0 ? (
            <p className="hq-today-empty">No repos resolved on this host.</p>
          ) : (
            <ul className="hq-today-list">
              {repos.map((r) => (
                <li key={r.repo} className="hq-today-row">
                  <span className="hq-today-row-name">{r.repo}</span>
                  <span className="hq-today-row-meta">
                    {formatHoursAgo(r.hoursSinceLastCommit)}
                  </span>
                  <span className="hq-today-row-detail">
                    {r.lastCommitSha
                      ? `${r.lastCommitSha} · ${truncate(r.lastCommitMessage ?? "", 64)}`
                      : "—"}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {freshestRepo?.hoursSinceLastCommit !== undefined && (
            <p className="hq-today-footnote">
              Freshest commit{" "}
              <strong className="hq-today-strong">{freshestRepo.repo}</strong>
              {" "}
              · {formatHoursAgo(freshestRepo.hoursSinceLastCommit)}
            </p>
          )}
        </article>

        <article className="hq-today-block">
          <div className="hq-today-label">atlas drift</div>
          {data.atlasDrift.hasDrift ? (
            <>
              <p className="hq-today-strong-line">
                {data.atlasDrift.driftedSlugs.length}{" "}
                {data.atlasDrift.driftedSlugs.length === 1 ? "entry" : "entries"}{" "}
                drifted · {data.atlasDrift.driftedRefCount} reference
                {data.atlasDrift.driftedRefCount === 1 ? "" : "s"} changed
              </p>
              <ul className="hq-today-list">
                {data.atlasDrift.driftedSlugs.map((slug) => (
                  <li key={slug} className="hq-today-row">
                    <Link
                      href={`/hq/atlas/${slug}`}
                      className="hq-today-row-name hq-today-link"
                    >
                      {slug}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="hq-today-clear">All entries current.</p>
          )}
        </article>

        <article className="hq-today-block">
          <div className="hq-today-label">signal cron</div>
          {data.cron.length === 0 ? (
            <p className="hq-today-empty">No cron source resolved.</p>
          ) : (
            <ul className="hq-today-list">
              {data.cron.map((c) => (
                <li key={c.source} className="hq-today-row">
                  <span className="hq-today-row-name">{c.source}</span>
                  <span
                    className="hq-today-row-meta"
                    data-status={c.status}
                  >
                    {c.status === "never"
                      ? "never run"
                      : c.hoursSinceLastRun !== null
                        ? formatHoursAgo(c.hoursSinceLastRun)
                        : "—"}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="hq-today-footnote">
            <Link href="/hq/health" className="hq-today-link">
              full cron log →
            </Link>
          </p>
        </article>

        <article className="hq-today-block">
          <div className="hq-today-label">session pulse</div>
          <p className="hq-today-strong-line">
            {data.sessionPulse.loggedLast7Days}{" "}
            {data.sessionPulse.loggedLast7Days === 1 ? "response" : "responses"}{" "}
            in the last 7 days
          </p>
          <p className="hq-today-row-detail">
            {data.sessionPulse.loggedToday} today ·{" "}
            {data.sessionPulse.totalLoggedResponses} total ·{" "}
            {data.sessionPulse.lastResponseAt
              ? `last ${formatHoursAgo(
                  (Date.now() -
                    new Date(data.sessionPulse.lastResponseAt).getTime()) /
                    (1000 * 60 * 60),
                )}`
              : "never"}
          </p>
        </article>
      </div>

      {data.activeRisks.length > 0 && (
        <div className="hq-today-risks">
          <div className="hq-today-label">
            active risks · {data.activeRisks.length} open
          </div>
          <ul className="hq-today-risks-list">
            {data.activeRisks.map((r) => (
              <li key={r.id} className="hq-today-risk-row">
                <span
                  className="hq-today-risk-tier"
                  data-tier={
                    r.likelihood === "High" && r.impact === "High"
                      ? "high"
                      : r.likelihood === "High" || r.impact === "High"
                        ? "mid"
                        : "low"
                  }
                />
                <span className="hq-today-risk-title">{r.title}</span>
                <span className="hq-today-risk-meta">
                  {r.area} · {r.status.toLowerCase()} · review {r.reviewDate}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(data.features.inFlight > 0 || data.campaigns.active.length > 0) && (
        <div className="hq-today-fproduct">
          <div className="hq-today-fproduct-col">
            <div className="hq-today-label">features in flight</div>
            <p className="hq-today-strong-line">
              {data.features.inFlight} active{" "}
              {data.features.inFlight === 1 ? "feature" : "features"}
            </p>
            {Object.keys(data.features.byStatus).length > 0 && (
              <p className="hq-today-row-detail">
                {Object.entries(data.features.byStatus)
                  .map(([s, n]) => `${n} ${s.toLowerCase()}`)
                  .join(" · ")}
              </p>
            )}
            {data.features.highImpactQueued.length > 0 && (
              <ul className="hq-today-feature-list">
                {data.features.highImpactQueued.map((f) => (
                  <li key={f.id} className="hq-today-feature-row">
                    <span className="hq-today-feature-bullet">queued ·</span>
                    <span>{f.title}</span>
                    <span className="hq-today-feature-meta">{f.product}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="hq-today-fproduct-col">
            <div className="hq-today-label">campaigns in motion</div>
            {data.campaigns.active.length === 0 ? (
              <p className="hq-today-clear">No campaigns live.</p>
            ) : (
              <ul className="hq-today-campaign-list">
                {data.campaigns.active.map((c) => (
                  <li key={c.id} className="hq-today-campaign-row">
                    <span className="hq-today-campaign-title">{c.title}</span>
                    <span className="hq-today-campaign-meta">
                      {c.status.toLowerCase()} · {c.progress}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {data.pilots.length > 0 && (
        <div className="hq-today-pilots">
          <div className="hq-today-label">live pilots · {data.pilots.length}</div>
          <ul className="hq-today-pilot-list">
            {data.pilots.map((p) => (
              <li key={p.id} className="hq-today-pilot-row">
                <span className="hq-today-pilot-title">{p.title}</span>
                <span className="hq-today-pilot-meta">{p.status.toLowerCase()}</span>
                {p.nextStep && (
                  <span className="hq-today-pilot-next">
                    next · {truncate(p.nextStep, 90)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.recentDecisions.length > 0 && (
        <div className="hq-today-decisions">
          <div className="hq-today-label">recent decisions</div>
          <ul className="hq-today-decisions-list">
            {data.recentDecisions.map((d) => (
              <li key={d.id} className="hq-today-decision-row">
                <span className="hq-today-decision-date">{d.date}</span>
                <span className="hq-today-decision-title">{d.title}</span>
                <span className="hq-today-decision-meta">
                  {d.category} · {d.status.toLowerCase()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="hq-today-foot">
        <Link href="/hq/atlas" className="hq-today-link">
          atlas →
        </Link>
        <Link href="/hq/health" className="hq-today-link">
          health →
        </Link>
        <Link href="/hq/entitlements" className="hq-today-link">
          entitlements →
        </Link>
        <Link href="/hq/partners" className="hq-today-link">
          partners →
        </Link>
        <Link href="/hq/plan" className="hq-today-link">
          marketing plan →
        </Link>
      </div>
    </section>
  );
}

function truncate(s: string, n: number): string {
  if (!s) return "";
  if (s.length <= n) return s;
  return `${s.slice(0, n - 1).trim()}…`;
}
