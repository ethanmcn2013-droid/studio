"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
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
type Range = "30d" | "90d" | "term";
type AccessState = "all" | "redeemed" | "delivered" | "available" | "revoked";

type AccessRow = {
  code: string;
  state: Exclude<AccessState, "all">;
  issued: string;
  redeemed: string;
  expires: string;
  note: string;
};

const DATA_STATES: Record<
  DataState,
  {
    label: string;
    detail: string;
    active: string;
    actions: string;
    rate: string;
    firstAction: string;
  }
> = {
  complete: {
    label: "Complete coverage",
    detail: "All four products. Data through 24 Jul 2026.",
    active: "11",
    actions: "73",
    rate: "75%",
    firstAction: "15",
  },
  partial: {
    label: "Partial coverage",
    detail: "27 of 30 days. Signal was unavailable for 3 days.",
    active: "9+",
    actions: "61+",
    rate: "Not available",
    firstAction: "13+",
  },
  suppressed: {
    label: "Small group",
    detail: "Behavioural values are withheld below 3 eligible workspaces.",
    active: "Withheld",
    actions: "Withheld",
    rate: "Withheld",
    firstAction: "Withheld",
  },
};

const ACCESS_ROWS: AccessRow[] = [
  {
    code: "GH-••••-21",
    state: "redeemed",
    issued: "03 Jul",
    redeemed: "05 Jul",
    expires: "No expiry",
    note: "Activated through the venue welcome link.",
  },
  {
    code: "GH-••••-22",
    state: "delivered",
    issued: "03 Jul",
    redeemed: "Not yet",
    expires: "31 Aug",
    note: "Delivered. No redemption has been recorded.",
  },
  {
    code: "GH-••••-23",
    state: "available",
    issued: "Not sent",
    redeemed: "Not yet",
    expires: "31 Aug",
    note: "Ready for an authorised venue member to send.",
  },
  {
    code: "GH-••••-24",
    state: "available",
    issued: "Not sent",
    redeemed: "Not yet",
    expires: "31 Aug",
    note: "Ready for an authorised venue member to send.",
  },
  {
    code: "GH-••••-08",
    state: "revoked",
    issued: "14 Jun",
    redeemed: "Not yet",
    expires: "Revoked",
    note: "Revoked by Signal HQ on 28 Jun.",
  },
];

const RANGE_COPY: Record<Range, string> = {
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  term: "2026/27 term",
};

function PortalIcon({
  name,
  size = 16,
}: {
  name:
    | "arrow"
    | "check"
    | "copy"
    | "download"
    | "lock"
    | "plus"
    | "report"
    | "x";
  size?: number;
}) {
  const paths = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m14 7 5 5-5 5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    copy: (
      <>
        <rect x="8" y="8" width="11" height="11" rx="2" />
        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    report: (
      <>
        <path d="M6 3h9l3 3v15H6Z" />
        <path d="M14 3v4h4" />
        <path d="M9 12h6M9 16h6" />
      </>
    ),
    x: (
      <>
        <path d="m6 6 12 12" />
        <path d="m18 6-12 12" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

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

function StateDot({
  children,
  tone = "good",
}: {
  children: React.ReactNode;
  tone?: "good" | "quiet" | "attention";
}) {
  return (
    <span className={styles.state} data-tone={tone}>
      <i aria-hidden="true" />
      {children}
    </span>
  );
}

function CoverageCard({
  dataState,
}: {
  dataState: DataState;
}) {
  const coverage = DATA_STATES[dataState];
  return (
    <div className={styles.coverage} data-state={dataState}>
      <StateDot tone={dataState === "complete" ? "good" : "attention"}>
        {coverage.label}
      </StateDot>
      <small>{coverage.detail}</small>
      <button type="button">How coverage works</button>
    </div>
  );
}

function RequestSheet({
  open,
  close,
  sent,
  send,
}: {
  open: boolean;
  close: () => void;
  sent: boolean;
  send: () => void;
}) {
  if (!open) return null;
  return (
    <div className={styles.sheetBackdrop} onMouseDown={close}>
      <section
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" className={styles.sheetClose} onClick={close} aria-label="Close request">
          <PortalIcon name="x" />
        </button>
        {sent ? (
          <div className={styles.sheetSuccess}>
            <i><PortalIcon name="check" size={20} /></i>
            <p>Request sent to Signal HQ</p>
            <h2 id="request-title">Nothing changed without approval.</h2>
            <span>
              The operator will review the quantity and reply to the venue
              owner. Your allotment remains 40 until that review is complete.
            </span>
            <button type="button" className={styles.primaryButton} onClick={close}>
              Return to the portal
            </button>
          </div>
        ) : (
          <>
            <p className={styles.eyebrow}>Controlled request</p>
            <h2 id="request-title">Request more licences.</h2>
            <p className={styles.sheetIntro}>
              This creates a review item in Signal HQ. It never changes the
              allotment or creates codes by itself.
            </p>
            <label className={styles.sheetField}>
              <span>How many licences do you need?</span>
              <select defaultValue="10">
                <option value="5">5 licences</option>
                <option value="10">10 licences</option>
                <option value="20">20 licences</option>
              </select>
            </label>
            <label className={styles.sheetField}>
              <span>What are they for?</span>
              <textarea
                rows={4}
                defaultValue="Autumn showcase couples and two venue coordinators."
              />
            </label>
            <div className={styles.sheetBoundary}>
              <PortalIcon name="lock" />
              <span>Signal HQ reviews the request before any licence is added.</span>
            </div>
            <button type="button" className={styles.primaryButton} onClick={send}>
              Send request
            </button>
          </>
        )}
      </section>
    </div>
  );
}

function ReportPreview({
  report,
  close,
  dataState,
}: {
  report: string | null;
  close: () => void;
  dataState: DataState;
}) {
  if (!report) return null;
  const coverage = DATA_STATES[dataState];
  return (
    <aside className={styles.reportPreview} aria-label={`${report} report preview`}>
      <header>
        <div>
          <p className={styles.eyebrow}>Frozen venue report</p>
          <h2>{report}</h2>
        </div>
        <button type="button" onClick={close} aria-label="Close report preview">
          <PortalIcon name="x" />
        </button>
      </header>
      <div className={styles.reportPaper}>
        <div className={styles.reportMast}>
          <span>signal studio</span>
          <strong>Glenmara House</strong>
        </div>
        <p className={styles.reportPeriod}>{report} · venue-metrics.v1</p>
        <h3>The benefit, in use.</h3>
        <div className={styles.reportNumbers}>
          <Metric value="18" label="licences redeemed" />
          <Metric value={coverage.active} label="active workspaces" />
          <Metric value={coverage.actions} label="meaningful actions" />
        </div>
        <p className={styles.reportPrivacy}>
          This report contains aggregate activity only. It contains no names,
          work titles, task text, notes, comments, files or raw identifiers.
        </p>
      </div>
      <button type="button" className={styles.secondaryButton}>
        <PortalIcon name="download" />
        Download review PDF
      </button>
    </aside>
  );
}

export function VenuePortalReview() {
  const [tab, setTab] = useState<TabId>("overview");
  const [dataState, setDataState] = useState<DataState>("complete");
  const [range, setRange] = useState<Range>("30d");
  const [accessState, setAccessState] = useState<AccessState>("all");
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("Tasks");
  const [report, setReport] = useState<string | null>(null);
  const coverage = DATA_STATES[dataState];
  const accessRows = useMemo(
    () =>
      accessState === "all"
        ? ACCESS_ROWS
        : ACCESS_ROWS.filter((row) => row.state === accessState),
    [accessState],
  );

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
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
          <strong>Not a sponsor production route</strong>
        </div>
        <label>
          Data state
          <select value={dataState} onChange={(event) => setDataState(event.target.value as DataState)}>
            <option value="complete">Complete</option>
            <option value="partial">Partial</option>
            <option value="suppressed">Suppressed</option>
          </select>
        </label>
      </aside>

      <section className={styles.portal} aria-label="Venue Portal review">
        <header className={styles.masthead}>
          <a href="#venue-main" className={styles.skip}>Skip to portal content</a>
          <div className={styles.brand}>
            <span aria-hidden="true" />
            <strong>signal studio</strong>
            <small>Venue Edition</small>
          </div>
          <div className={styles.mastTools}>
            <label className={styles.rangePicker}>
              <span>Reporting window</span>
              <select value={range} onChange={(event) => setRange(event.target.value as Range)}>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="term">2026/27 term</option>
              </select>
            </label>
            <div className={styles.account}>
              <span>Glenmara House</span>
              <small>Venue owner</small>
            </div>
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
                <p>
                  Access issued, taken up and meaningfully used. Private work
                  never enters this account.
                </p>
              </div>
              <CoverageCard dataState={dataState} />
            </div>

            <section className={styles.accountHealth} aria-label="Account standing">
              <div>
                <span>Account standing</span>
                <StateDot>Active and reconciled</StateDot>
              </div>
              <div>
                <span>Licence position</span>
                <strong>14 available of 40</strong>
              </div>
              <div>
                <span>Next useful action</span>
                <button type="button" onClick={() => setTab("access")}>
                  Send an available code <PortalIcon name="arrow" />
                </button>
              </div>
            </section>

            <div className={styles.commercialMetrics}>
              <Metric value="40" label="licences allotted" detail="Operator controlled" />
              <Metric value="26" label="codes issued" detail="65% of allotment" />
              <Metric value="18" label="codes redeemed" detail="69% of issued codes" />
              <Metric value="14" label="codes available" detail="No approval needed to send" />
            </div>

            <div className={styles.overviewSplit}>
              <section className={styles.usageSummary}>
                <div className={styles.sectionHeading}>
                  <div>
                    <p className={styles.eyebrow}>{RANGE_COPY[range]}</p>
                    <h2>Meaningful use</h2>
                  </div>
                  <span>Visits never count</span>
                </div>
                <div className={styles.usageMetrics}>
                  <Metric value={coverage.active} label="active workspaces" />
                  <Metric value={dataState === "suppressed" ? "Withheld" : "21"} label="venue active days" />
                  <Metric value={coverage.actions} label="meaningful actions" />
                  <Metric value={coverage.rate} label="day-30 continuation" />
                </div>
                <div className={styles.trend} aria-label="Twelve-week usage trend">
                  {[18, 25, 32, 38, 46, 54, 52, 67, 61, 78, 72, 88].map((height, index) => (
                    <i
                      key={index}
                      style={{ height: `${dataState === "suppressed" ? 9 : height}%` }}
                    >
                      <span>{`Week ${index + 1}`}</span>
                    </i>
                  ))}
                </div>
                <div className={styles.trendAxis}>
                  <span>Week 1</span>
                  <span>Week 12</span>
                </div>
              </section>

              <section className={styles.productUse}>
                <p className={styles.eyebrow}>Product use · {RANGE_COPY[range]}</p>
                <h2>Across Signal Studio</h2>
                {[
                  ["Notes", "8", "80%", "31 actions"],
                  ["Tasks", "10", "100%", "28 actions"],
                  ["Timeline", "6", "60%", "9 published milestones"],
                  ["Signal", "5", "50%", "5 briefings opened"],
                ].map(([name, value, width, detail]) => (
                  <button
                    type="button"
                    className={styles.productRow}
                    key={name}
                    aria-pressed={selectedProduct === name}
                    onClick={() => setSelectedProduct(name)}
                  >
                    <span>{name}</span>
                    <i><b style={{ width: dataState === "suppressed" ? "0%" : width }} /></i>
                    <strong>{dataState === "suppressed" ? "—" : value}</strong>
                    <small>{selectedProduct === name ? detail : ""}</small>
                  </button>
                ))}
              </section>
            </div>

            <div className={styles.reconciled}>
              <StateDot>Counters and canonical code rows agree</StateDot>
              <span>Reconciled 24 Jul at 06:12 · no action needed</span>
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
                <h1>14 licences are ready.</h1>
                <p>
                  Send codes without seeing sponsored work. Allotment changes
                  still require Signal HQ approval.
                </p>
              </div>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => { setRequestSent(false); setRequestOpen(true); }}
              >
                <PortalIcon name="plus" />
                Request more licences
              </button>
            </div>

            <div className={styles.accessToolbar}>
              <div aria-label="Filter codes">
                {(["all", "redeemed", "delivered", "available", "revoked"] as AccessState[]).map((state) => (
                  <button
                    key={state}
                    type="button"
                    aria-pressed={accessState === state}
                    onClick={() => setAccessState(state)}
                  >
                    {state}
                  </button>
                ))}
              </div>
              <span>{accessRows.length} fixture rows shown</span>
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
                    <th><span className={styles.srOnly}>Action</span></th>
                  </tr>
                </thead>
                <tbody>
                  {accessRows.map((row) => (
                    <tr key={row.code}>
                      <td>
                        <strong>{row.code}</strong>
                        <small>{row.note}</small>
                      </td>
                      <td><StateDot tone={row.state === "revoked" ? "quiet" : row.state === "available" ? "attention" : "good"}>{row.state}</StateDot></td>
                      <td>{row.issued}</td>
                      <td>{row.redeemed}</td>
                      <td>{row.expires}</td>
                      <td>
                        <button
                          type="button"
                          className={styles.rowAction}
                          disabled={row.state !== "available"}
                          aria-label={`Copy ${row.code}`}
                        >
                          <PortalIcon name="copy" />
                          {row.state === "available" ? "Copy" : "View"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.fixtureNote}>
              Delivery and expiry are fixture states. Production remains closed
              until the canonical access ledger records both.
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
                <p className={styles.eyebrow}>Usage · {RANGE_COPY[range]}</p>
                <h1>Use, without surveillance.</h1>
                <p>
                  Committed actions count. Visits do not. Private work never
                  enters this report.
                </p>
              </div>
              <CoverageCard dataState={dataState} />
            </div>
            <div className={styles.commercialMetrics}>
              <Metric value={coverage.active} label="active sponsored workspaces" />
              <Metric value={dataState === "suppressed" ? "Withheld" : "21"} label="venue active days" />
              <Metric value={coverage.actions} label="meaningful actions" />
              <Metric value={coverage.firstAction} label="reached first action" />
            </div>

            <section className={styles.usageJourney}>
              <div className={styles.sectionHeading}>
                <div>
                  <p className={styles.eyebrow}>Sponsored-access journey</p>
                  <h2>From code to continued use</h2>
                </div>
                <span>Aggregate counts only</span>
              </div>
              <div className={styles.funnel} aria-label="Sponsored-access funnel">
                {[
                  ["26", "Issued"],
                  ["18", "Redeemed"],
                  [coverage.firstAction, "First action"],
                  [coverage.active, "Active now"],
                ].map(([value, label], index) => (
                  <div key={label}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{value}</strong>
                    <small>{label}</small>
                  </div>
                ))}
              </div>
            </section>

            <div className={styles.usageBottom}>
              <section className={styles.activityMap}>
                <p className={styles.eyebrow}>Venue active days</p>
                <h2>Consistency, not intensity.</h2>
                <div aria-label="Twelve-week activity calendar">
                  {Array.from({ length: 60 }, (_, index) => (
                    <i
                      key={index}
                      data-level={dataState === "suppressed" ? "0" : String((index * 7 + 3) % 4)}
                      title={dataState === "suppressed" ? "Withheld" : `Aggregate day ${index + 1}`}
                    />
                  ))}
                </div>
              </section>
              <section className={styles.definition}>
                <p className={styles.eyebrow}>Metric dictionary · v1</p>
                <h2>What “meaningful” means</h2>
                <p>
                  A note created, task committed, milestone published or
                  briefing deliberately opened. Names, titles, text, comments,
                  files and workspace identities are never projected.
                </p>
                <button type="button">Read the complete metric definition <PortalIcon name="arrow" /></button>
              </section>
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
                <p>
                  Every frozen report carries its window, coverage,
                  suppression state and dictionary version.
                </p>
              </div>
              <button type="button" className={styles.secondaryButton} onClick={() => setReport("July 2026")}>
                <PortalIcon name="report" />
                Preview latest report
              </button>
            </div>

            <div className={styles.reportLayout}>
              <div className={styles.reportList}>
                {[
                  ["July 2026", "Complete", "24 Jul 2026", "PDF · CSV"],
                  ["June 2026", "Partial · 27/30 days", "02 Jul 2026", "PDF · CSV"],
                  ["May 2026", "Small group · usage withheld", "02 Jun 2026", "PDF · CSV"],
                ].map(([period, state, generated, exports]) => (
                  <button type="button" key={period} onClick={() => setReport(period)} data-active={report === period}>
                    <i><PortalIcon name="report" /></i>
                    <span>
                      <strong>{period}</strong>
                      <small>{state}</small>
                    </span>
                    <span>
                      <small>Generated</small>
                      <strong>{generated}</strong>
                    </span>
                    <span>
                      <small>Available</small>
                      <strong>{exports}</strong>
                    </span>
                    <PortalIcon name="arrow" />
                  </button>
                ))}
              </div>
              <ReportPreview report={report} close={() => setReport(null)} dataState={dataState} />
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
              <StateDot>Account active</StateDot>
            </div>
            <div className={styles.settingsGrid}>
              <section>
                <div className={styles.settingsHeading}>
                  <div>
                    <p className={styles.eyebrow}>Portal members</p>
                    <h2>Four people can see this account.</h2>
                  </div>
                  <button type="button"><PortalIcon name="plus" /> Invite member</button>
                </div>
                <dl>
                  <div><dt>Venue owner</dt><dd>1 active</dd></div>
                  <div><dt>Venue manager</dt><dd>2 active</dd></div>
                  <div><dt>Venue viewer</dt><dd>1 active</dd></div>
                </dl>
                <p className={styles.settingsNote}>
                  Portal roles control this account only. They do not grant
                  access to sponsored workspaces.
                </p>
              </section>
              <section className={styles.privacy}>
                <p className={styles.eyebrow}>Privacy boundary</p>
                <h2>Proof of use, never a window into work.</h2>
                <p>
                  The portal never shows notes, tasks, project names,
                  briefings, private timelines, comments, files, collaborators
                  or raw identifiers.
                </p>
                <div>
                  <PortalIcon name="lock" />
                  Behavioural counts under 3 workspaces are withheld.
                </div>
              </section>
            </div>

            <section className={styles.supportCard}>
              <div>
                <p className={styles.eyebrow}>Support</p>
                <h2>A real reply from Signal Studio.</h2>
                <p>Questions about access, reports or venue membership go to one place.</p>
              </div>
              <button type="button">Contact Signal Studio <PortalIcon name="arrow" /></button>
            </section>
          </section>
        </main>
      </section>

      <RequestSheet
        open={requestOpen}
        close={() => setRequestOpen(false)}
        sent={requestSent}
        send={() => setRequestSent(true)}
      />
    </div>
  );
}
