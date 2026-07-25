"use client";

import { useState, type KeyboardEvent } from "react";
import styles from "./venue-portal-review.module.css";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "access", label: "Access" },
  { id: "usage", label: "Usage" },
  { id: "reports", label: "Reports" },
  { id: "settings", label: "Venue settings" },
] as const;

type TabId = (typeof TABS)[number]["id"];
type DataState = "complete" | "partial" | "suppressed";

const DATA_STATES: Record<
  DataState,
  { label: string; detail: string; active: string; actions: string; rate: string }
> = {
  complete: {
    label: "Complete coverage",
    detail: "All four products · data through 24 Jul 2026",
    active: "11",
    actions: "73",
    rate: "75%",
  },
  partial: {
    label: "Partial coverage",
    detail: "27 of 30 days · Signal unavailable for 3 days",
    active: "9+",
    actions: "61+",
    rate: "—",
  },
  suppressed: {
    label: "Small group",
    detail: "Behavioural values withheld below 3 eligible workspaces",
    active: "—",
    actions: "—",
    rate: "—",
  },
};

function Metric({
  value,
  label,
  detail,
}: {
  value: string;
  label: string;
  detail?: string;
}) {
  return (
    <div className={styles.metric}>
      <strong>{value}</strong>
      <span>{label}</span>
      {detail ? <small>{detail}</small> : null}
    </div>
  );
}

function StateDot({ children }: { children: React.ReactNode }) {
  return (
    <span className={styles.state}>
      <i aria-hidden="true" />
      {children}
    </span>
  );
}

export function VenuePortalReview() {
  const [tab, setTab] = useState<TabId>("overview");
  const [dataState, setDataState] = useState<DataState>("complete");
  const [requestSent, setRequestSent] = useState(false);
  const coverage = DATA_STATES[dataState];

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }
    event.preventDefault();
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? TABS.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + TABS.length) %
            TABS.length;
    const next = TABS[nextIndex];
    setTab(next.id);
    document.getElementById(`venue-tab-${next.id}`)?.focus();
  }

  return (
    <div className={styles.review}>
      <aside className={styles.reviewBar} aria-label="Review controls">
        <div>
          <span>Founder review · deterministic fixture</span>
          <strong>Not a production venue route</strong>
        </div>
        <label>
          Data state
          <select
            value={dataState}
            onChange={(event) => setDataState(event.target.value as DataState)}
          >
            <option value="complete">Complete</option>
            <option value="partial">Partial</option>
            <option value="suppressed">Suppressed</option>
          </select>
        </label>
      </aside>

      <section className={styles.portal} aria-label="Venue Portal review">
        <header className={styles.masthead}>
          <a href="#venue-main" className={styles.skip}>
            Skip to portal content
          </a>
          <div className={styles.brand}>
            <span aria-hidden="true" />
            <strong>signal studio</strong>
          </div>
          <div className={styles.account}>
            <span>Glenmara House</span>
            <small>Venue owner</small>
          </div>
        </header>

        <nav className={styles.tabs} aria-label="Venue Portal" role="tablist">
          {TABS.map((item, index) => (
            <button
              key={item.id}
              id={`venue-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              aria-controls={`venue-panel-${item.id}`}
              tabIndex={tab === item.id ? 0 : -1}
              onClick={() => setTab(item.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <main id="venue-main" className={styles.canvas}>
          <section
            id="venue-panel-overview"
            role="tabpanel"
            aria-labelledby="venue-tab-overview"
            hidden={tab !== "overview"}
          >
            <div className={styles.hero}>
              <div>
                <p className={styles.eyebrow}>Venue Edition · 2026/27</p>
                <h1>The benefit, in use.</h1>
                <p>Access issued, taken up and meaningfully used—without opening private work.</p>
              </div>
              <div className={styles.coverage}>
                <StateDot>{coverage.label}</StateDot>
                <small>{coverage.detail}</small>
              </div>
            </div>

            <div className={styles.commercialMetrics}>
              <Metric value="40" label="licences allotted" />
              <Metric value="26" label="codes issued" />
              <Metric value="18" label="codes redeemed" />
              <Metric value="14" label="codes remaining" />
            </div>

            <div className={styles.overviewSplit}>
              <section className={styles.usageSummary}>
                <div className={styles.sectionHeading}>
                  <div>
                    <p className={styles.eyebrow}>Last 30 days</p>
                    <h2>Meaningful use</h2>
                  </div>
                  <span>Visits never count</span>
                </div>
                <div className={styles.usageMetrics}>
                  <Metric value={coverage.active} label="active workspaces" />
                  <Metric
                    value={dataState === "suppressed" ? "—" : "21"}
                    label="venue active days"
                  />
                  <Metric value={coverage.actions} label="meaningful actions" />
                  <Metric value={coverage.rate} label="day-30 continuation" />
                </div>
                <div className={styles.trend} aria-label="Twelve-week usage trend">
                  {[18, 25, 32, 38, 46, 54, 52, 67, 61, 78, 72, 88].map(
                    (height, index) => (
                      <i
                        key={index}
                        style={{ height: `${dataState === "suppressed" ? 9 : height}%` }}
                      />
                    ),
                  )}
                </div>
              </section>

              <section className={styles.productUse}>
                <p className={styles.eyebrow}>Product use · 30 days</p>
                <h2>Across Signal Studio</h2>
                {[
                  ["Notes", "8", "80%"],
                  ["Tasks", "10", "100%"],
                  ["Timeline", "6", "60%"],
                  ["Signal", "5", "50%"],
                ].map(([name, value, width]) => (
                  <div className={styles.productRow} key={name}>
                    <span>{name}</span>
                    <i>
                      <b
                        style={{
                          width: dataState === "suppressed" ? "0%" : width,
                        }}
                      />
                    </i>
                    <strong>{dataState === "suppressed" ? "—" : value}</strong>
                  </div>
                ))}
              </section>
            </div>

            <div className={styles.reconciled}>
              <StateDot>Counters and canonical code rows agree</StateDot>
              <span>Reconciled 24 Jul at 06:12</span>
            </div>
          </section>

          <section
            id="venue-panel-access"
            role="tabpanel"
            aria-labelledby="venue-tab-access"
            hidden={tab !== "access"}
          >
            <div className={styles.hero}>
              <div>
                <p className={styles.eyebrow}>Access</p>
                <h1>14 licences remain.</h1>
                <p>Codes stay masked until an authorised venue member deliberately reveals them.</p>
              </div>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setRequestSent(true)}
              >
                {requestSent ? "Request queued for Signal HQ" : "Request more licences"}
              </button>
            </div>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>State</th>
                    <th>Issued</th>
                    <th>Redeemed</th>
                    <th>Expires</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>GH-••••-21</td>
                    <td><StateDot>Redeemed</StateDot></td>
                    <td>03 Jul</td>
                    <td>05 Jul</td>
                    <td>—</td>
                  </tr>
                  <tr>
                    <td>GH-••••-22</td>
                    <td><StateDot>Delivered</StateDot></td>
                    <td>03 Jul</td>
                    <td>—</td>
                    <td>31 Aug</td>
                  </tr>
                  <tr>
                    <td>GH-••••-23</td>
                    <td><StateDot>Minted</StateDot></td>
                    <td>03 Jul</td>
                    <td>—</td>
                    <td>31 Aug</td>
                  </tr>
                  <tr>
                    <td>GH-••••-08</td>
                    <td><StateDot>Revoked</StateDot></td>
                    <td>14 Jun</td>
                    <td>—</td>
                    <td>—</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.fixtureNote}>
              Delivery and expiry are fixture states. They remain unavailable
              in production until the canonical access ledger records both.
            </p>
          </section>

          <section
            id="venue-panel-usage"
            role="tabpanel"
            aria-labelledby="venue-tab-usage"
            hidden={tab !== "usage"}
          >
            <div className={styles.hero}>
              <div>
                <p className={styles.eyebrow}>Usage · last 30 days</p>
                <h1>Use, without surveillance.</h1>
                <p>Committed actions count. Visits do not. Private work never enters this report.</p>
              </div>
              <div className={styles.coverage}>
                <StateDot>{coverage.label}</StateDot>
                <small>{coverage.detail}</small>
              </div>
            </div>
            <div className={styles.commercialMetrics}>
              <Metric value={coverage.active} label="active sponsored workspaces" />
              <Metric value={dataState === "suppressed" ? "—" : "21"} label="venue active days" />
              <Metric value={coverage.actions} label="meaningful actions" />
              <Metric value={dataState === "suppressed" ? "—" : "15"} label="activated this term" />
            </div>
            <div className={styles.funnel} aria-label="Sponsored-access funnel">
              {[
                ["26", "Issued"],
                ["18", "Redeemed"],
                [dataState === "suppressed" ? "—" : "15", "First action"],
                [coverage.active, "Active in 30d"],
              ].map(([value, label], index) => (
                <div key={label}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{value}</strong>
                  <small>{label}</small>
                </div>
              ))}
            </div>
            <div className={styles.definition}>
              <strong>What “meaningful” means</strong>
              <p>
                A note created, task committed, milestone published or briefing
                deliberately opened. Names, titles, text, comments, files and
                workspace identities are never projected.
              </p>
            </div>
          </section>

          <section
            id="venue-panel-reports"
            role="tabpanel"
            aria-labelledby="venue-tab-reports"
            hidden={tab !== "reports"}
          >
            <div className={styles.hero}>
              <div>
                <p className={styles.eyebrow}>Reports</p>
                <h1>Definitions travel with the number.</h1>
                <p>Every frozen report carries its window, coverage, suppression and dictionary version.</p>
              </div>
            </div>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>Period</th>
                    <th>Coverage</th>
                    <th>Dictionary</th>
                    <th>Exports</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>July 2026</td><td>Complete</td><td>venue-metrics.v1</td><td>PDF · CSV</td></tr>
                  <tr><td>June 2026</td><td>Partial · 27/30 days</td><td>venue-metrics.v1</td><td>PDF · CSV</td></tr>
                  <tr><td>May 2026</td><td>Small group · usage withheld</td><td>venue-metrics.v1</td><td>PDF · CSV</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section
            id="venue-panel-settings"
            role="tabpanel"
            aria-labelledby="venue-tab-settings"
            hidden={tab !== "settings"}
          >
            <div className={styles.hero}>
              <div>
                <p className={styles.eyebrow}>Venue settings</p>
                <h1>Glenmara House.</h1>
                <p>Venue Edition · owner-managed portal access.</p>
              </div>
            </div>
            <div className={styles.settingsGrid}>
              <section>
                <p className={styles.eyebrow}>Portal members</p>
                <h2>Four people can see this account.</h2>
                <dl>
                  <div><dt>Venue owner</dt><dd>1 active</dd></div>
                  <div><dt>Venue manager</dt><dd>2 active</dd></div>
                  <div><dt>Venue viewer</dt><dd>1 active</dd></div>
                </dl>
              </section>
              <section className={styles.privacy}>
                <p className={styles.eyebrow}>Privacy boundary</p>
                <h2>Proof of use, never a window into work.</h2>
                <p>
                  The portal never shows notes, tasks, project names,
                  briefings, private timelines, comments, files, collaborators
                  or raw identifiers.
                </p>
              </section>
            </div>
          </section>
        </main>
      </section>
    </div>
  );
}
