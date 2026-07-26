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
import type { AccountRole } from "@/lib/account/types";
import { ACCOUNT_VOCABULARY } from "@/lib/account/vocabulary";
import { ROLE_OPTIONS } from "@/lib/account/roles";
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
];

type SurfaceMode = "venue" | "education" | "organisation";

export function AccountReview() {
  const [fixtureKey, setFixtureKey] = useState<VenueFixtureKey>("complete");
  const [role, setRole] = useState<AccountRole>("owner");
  const [tab, setTab] = useState<TabId>("Overview");
  const [surface, setSurface] = useState<SurfaceMode>("venue");
  const [controlsOpen, setControlsOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const didMountTabs = useRef(false);
  const surfaceId = useId();
  const fixtureId = useId();
  const roleId = useId();
  const snapshot = getVenueFixture(fixtureKey);
  const roleLabel = ROLE_OPTIONS.find((item) => item.value === role)?.label;

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

  return (
    <div className={styles.review}>
      <aside className={styles.reviewBar} aria-label="Review controls">
        <div className={styles.reviewSummary}>
          <strong>Account Brief review</strong>
          <span>Not a sponsor route</span>
        </div>
        <button
          type="button"
          className={styles.controlsToggle}
          aria-expanded={controlsOpen}
          onClick={() => setControlsOpen((open) => !open)}
        >
          {controlsOpen ? "Hide fixtures" : "Fixtures & role"}
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
        </div>
      ) : null}

      <section
        className={styles.portal}
        data-concept="account-brief"
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
              {ACCOUNT_VOCABULARY.sampleIndicator}
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
                  <AccessPanel snapshot={snapshot} role={role} />
                ) : null}
                {tab === "Usage" ? (
                  <UsagePanel snapshot={snapshot} role={role} />
                ) : null}
                {tab === "Reports" ? (
                  <ReportsPanel
                    snapshot={snapshot}
                    role={role}
                    fixtureKey={fixtureKey}
                  />
                ) : null}
                {tab === "Account" ? (
                  <AccountPanel snapshot={snapshot} role={role} />
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
