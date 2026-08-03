"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  getVenueFixture,
  type VenueFixtureKey,
} from "@/lib/account/fixtures";
import type { LiveVenueOption } from "@/lib/account/live/project-venue-access";
import type { AccountRole, AccountSnapshot } from "@/lib/account/types";
import { ACCOUNT_VOCABULARY } from "@/lib/account/vocabulary";
import { ROLE_OPTIONS } from "@/lib/account/roles";
import { loadLiveVenueSnapshotAction } from "./actions";
import { AccountBriefOverview } from "./concepts/account-brief";
import { AccessPanel } from "./panels/access-panel";
import { AccountPanel } from "./panels/account-panel";
import { EditionProof } from "./panels/edition-proof";
import { ReportsPanel } from "./panels/reports-panel";
import { UsagePanel } from "./panels/usage-panel";
import styles from "./account-review.module.css";

const TABS = ACCOUNT_VOCABULARY.navigation;
type TabId = (typeof TABS)[number];

const FIXTURE_OPTIONS: Array<{ value: VenueFixtureKey; label: string }> = [
  { value: "complete", label: "Complete" },
  { value: "partial", label: "Partial" },
  { value: "suppressed", label: "Suppressed" },
  { value: "unavailable", label: "Unavailable" },
  // R-016 · D-020. The branch every founding venue actually takes, and the
  // legacy branch with nothing recorded. Both had fixtures and generated
  // artefacts but were unreachable from this picker.
  { value: "unlimited", label: "Unlimited entitlement" },
  { value: "unrecorded", label: "No issuing record" },
];

type SurfaceMode = "venue" | "education" | "organisation";
type DataSource = "fixture" | "live";

/**
 * A live load, tagged with the venue slug it was requested for. Carrying the slug
 * is what lets the component tell "still loading" from "loaded, for a venue you
 * are no longer looking at" without an extra flag.
 */
type LiveResult =
  | { slug: string; snapshot: AccountSnapshot }
  | { slug: string; error: string };

type OpenRequestRow = {
  id: string;
  sponsorName: string;
  sponsorSlug: string;
  kind: string;
  requestedQuantity: number | null;
  note: string;
  createdAt: number;
};

export function AccountReview({
  liveVenues,
  liveVenuesError,
  openRequests,
}: {
  liveVenues: LiveVenueOption[];
  liveVenuesError: string | null;
  openRequests: OpenRequestRow[];
}) {
  const [fixtureKey, setFixtureKey] = useState<VenueFixtureKey>("complete");
  const [role, setRole] = useState<AccountRole>("owner");
  const [tab, setTab] = useState<TabId>("Overview");
  const [surface, setSurface] = useState<SurfaceMode>("venue");
  const [dataSource, setDataSource] = useState<DataSource>("fixture");
  const [liveSlug, setLiveSlug] = useState(liveVenues[0]?.slug ?? "");
  // One piece of state, tagged with the slug it belongs to. Loading and staleness
  // are then derived during render rather than written by the effect, so the
  // effect never calls setState synchronously and a result for the previous venue
  // can never be shown against the current one.
  const [liveResult, setLiveResult] = useState<LiveResult | null>(null);
  const [controlsOpen, setControlsOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const didMountTabs = useRef(false);
  const surfaceId = useId();
  const sourceId = useId();
  const fixtureId = useId();
  const venueId = useId();
  const roleId = useId();

  const fixtureSnapshot = getVenueFixture(fixtureKey);
  const liveActive = dataSource === "live" && Boolean(liveSlug);
  const liveForSlug =
    liveActive && liveResult?.slug === liveSlug ? liveResult : null;
  const liveSnapshot =
    liveForSlug && "snapshot" in liveForSlug ? liveForSlug.snapshot : null;
  const liveError =
    liveForSlug && "error" in liveForSlug ? liveForSlug.error : null;
  // No result yet for the venue currently selected means the request is in
  // flight. Deriving it removes the loading flag, and with it the cascading
  // render the react-hooks/set-state-in-effect rule exists to prevent.
  const liveLoading = liveActive && !liveForSlug;
  const snapshot = liveSnapshot ?? fixtureSnapshot;
  const roleLabel = ROLE_OPTIONS.find((item) => item.value === role)?.label;
  const liveSponsorId =
    liveVenues.find((venue) => venue.slug === liveSlug)?.id ?? null;

  useEffect(() => {
    if (!liveActive) return;
    let cancelled = false;
    const slug = liveSlug;
    void loadLiveVenueSnapshotAction(slug).then((result) => {
      if (cancelled) return;
      setLiveResult(
        result.ok
          ? { slug, snapshot: result.snapshot }
          : { slug, error: result.error },
      );
    });
    return () => {
      cancelled = true;
    };
  }, [liveActive, liveSlug]);

  useEffect(() => {
    if (!didMountTabs.current) {
      didMountTabs.current = true;
      return;
    }
    const selected = navRef.current?.querySelector<HTMLElement>(
      '[aria-selected="true"]',
    );
    selected?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "auto",
    });
  }, [tab, surface]);

  function handleTabKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
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
    setTab(next);
    document.getElementById(`account-tab-${next}`)?.focus();
  }

  const accountName =
    surface === "venue"
      ? snapshot.account.name
      : surface === "education"
        ? "Riverside Conservatoire"
        : "Northline Partners";

  const editionLabel =
    surface === "venue"
      ? snapshot.account.editionLabel
      : surface === "education"
        ? "Education Edition"
        : "Organisation Edition";

  const sampleChip =
    dataSource === "live" && liveSnapshot
      ? liveSnapshot.sampleLabel
      : ACCOUNT_VOCABULARY.sampleIndicator;

  return (
    <div className={styles.review}>
      <aside className={styles.reviewBar} aria-label="Review controls">
        <div className={styles.reviewSummary}>
          <strong>Account Brief review</strong>
          <span>
            {dataSource === "live"
              ? "HQ live access preview · not a sponsor route"
              : "Not a sponsor route"}
          </span>
        </div>
        <button
          type="button"
          className={styles.controlsToggle}
          aria-expanded={controlsOpen}
          onClick={() => setControlsOpen((open) => !open)}
        >
          {controlsOpen ? "Hide controls" : "Fixtures, live & role"}
        </button>
      </aside>

      {controlsOpen ? (
        <div className={styles.controlsPanel}>
          <label htmlFor={surfaceId}>
            Surface
            <select
              id={surfaceId}
              value={surface}
              onChange={(event) =>
                setSurface(event.target.value as SurfaceMode)
              }
            >
              <option value="venue">Venue Edition</option>
              <option value="education">Education proof</option>
              <option value="organisation">Organisation proof</option>
            </select>
          </label>
          <label htmlFor={sourceId}>
            Data
            <select
              id={sourceId}
              value={dataSource}
              onChange={(event) =>
                setDataSource(event.target.value as DataSource)
              }
              disabled={surface !== "venue"}
            >
              <option value="fixture">Deterministic fixture</option>
              <option value="live">Live access (HQ)</option>
            </select>
          </label>
          {dataSource === "fixture" ? (
            <label htmlFor={fixtureId}>
              Fixture
              <select
                id={fixtureId}
                value={fixtureKey}
                onChange={(event) => {
                  setFixtureKey(event.target.value as VenueFixtureKey);
                }}
                disabled={surface !== "venue"}
              >
                {FIXTURE_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label htmlFor={venueId}>
              Venue
              <select
                id={venueId}
                value={liveSlug}
                onChange={(event) => setLiveSlug(event.target.value)}
                disabled={surface !== "venue" || liveVenues.length === 0}
              >
                {liveVenues.length === 0 ? (
                  <option value="">No venues reachable</option>
                ) : (
                  liveVenues.map((venue) => (
                    // Finding F-2. The label is the venue's founding place or
                    // an opaque id, never its name and never its slug: this
                    // page is used on screen shares and consent to be named
                    // publicly is unknown for every account.
                    <option key={venue.id} value={venue.slug}>
                      {venue.displayLabel}
                    </option>
                  ))
                )}
              </select>
            </label>
          )}
          <label htmlFor={roleId}>
            Role
            <select
              id={roleId}
              value={role}
              onChange={(event) => setRole(event.target.value as AccountRole)}
              disabled={surface !== "venue"}
            >
              {ROLE_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          {liveVenuesError ? (
            // A fixed string, produced by listLiveVenueOptions. It used to be
            // the driver's own message, which for a failed sponsors SELECT is
            // the whole statement including the contact_email column.
            <p className={styles.controlsNote} role="status">
              {liveVenuesError}
            </p>
          ) : null}
          {openRequests.length > 0 ? (
            <p className={styles.controlsNote} role="status">
              {openRequests.length} open access request
              {openRequests.length === 1 ? "" : "s"} awaiting HQ Access.
            </p>
          ) : null}
        </div>
      ) : null}

      <section
        className={styles.portal}
        data-concept="account-brief"
        data-source={dataSource}
        aria-label="Signal Studio Account review"
      >
        <header className={styles.masthead}>
          <a href="#account-main" className={styles.skip}>
            Skip to account content
          </a>
          <div className={styles.brand}>
            <span aria-hidden="true" />
            <strong>signal studio</strong>
            <small>{editionLabel}</small>
          </div>
          <div className={styles.mastTools}>
            <div className={styles.sampleChip} role="status">
              {sampleChip}
            </div>
            <div className={styles.account}>
              <span>{accountName}</span>
              <small>{roleLabel}</small>
            </div>
          </div>
        </header>

        {surface === "venue" ? (
          <>
            <nav
              ref={navRef}
              className={styles.tabs}
              aria-label="Signal Studio Account"
              role="tablist"
            >
              {TABS.map((label, index) => (
                <button
                  key={label}
                  id={`account-tab-${label}`}
                  type="button"
                  role="tab"
                  aria-selected={tab === label}
                  aria-controls="account-panel"
                  tabIndex={tab === label ? 0 : -1}
                  onClick={() => setTab(label)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                >
                  {label}
                </button>
              ))}
            </nav>

            <main id="account-main" className={styles.canvas}>
              {dataSource === "live" && liveLoading ? (
                <p className={styles.liveStatus}>Loading live access…</p>
              ) : null}
              {dataSource === "live" && liveError ? (
                <p className={styles.liveStatus} role="alert">
                  Live access unavailable: {liveError}
                </p>
              ) : null}
              <div
                id="account-panel"
                role="tabpanel"
                aria-labelledby={`account-tab-${tab}`}
              >
                {tab === "Overview" ? (
                  <AccountBriefOverview
                    snapshot={snapshot}
                    onOpenReport={() => setTab("Reports")}
                  />
                ) : null}
                {tab === "Access" ? (
                  <AccessPanel
                    snapshot={snapshot}
                    role={role}
                    mode={dataSource}
                    sponsorId={dataSource === "live" ? liveSponsorId : null}
                    // The slug, not the id: every mutating action resolves the
                    // sponsor server-side so a caller cannot name one venue
                    // and change another.
                    slug={dataSource === "live" ? liveSlug : null}
                  />
                ) : null}
                {tab === "Usage" ? (
                  <UsagePanel snapshot={snapshot} role={role} />
                ) : null}
                {tab === "Reports" ? (
                  <ReportsPanel
                    snapshot={snapshot}
                    role={role}
                    fixtureKey={fixtureKey}
                    mode={dataSource}
                    liveSlug={liveSlug}
                  />
                ) : null}
                {tab === "Account" ? (
                  <AccountPanel
                    snapshot={snapshot}
                    role={role}
                    mode={dataSource}
                  />
                ) : null}
              </div>
            </main>
          </>
        ) : (
          <main id="account-main" className={styles.canvas}>
            <EditionProof edition={surface} />
          </main>
        )}
      </section>
    </div>
  );
}
