"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { formatMetricValue } from "@/lib/account/format";
import { roleCan, roleDenialReason } from "@/lib/account/roles";
import {
  canTransition,
  describeInvitationAction,
  describeInvitationState,
  invitationStaleness,
  legalActions,
  resolveInvitationState,
  staleAlertLine,
  summariseStaleness,
  transitionRule,
  type InvitationAction,
  type InvitationState,
  type ResolvedInvitation,
} from "@/lib/account/invitations/lifecycle";
import type {
  AccountRole,
  AccountSnapshot,
  AccessCodeRow,
} from "@/lib/account/types";
import { ACCOUNT_METRIC_LABELS } from "@/lib/account/vocabulary";
import { AccountIcon } from "../components/icons";
import { Metric } from "../components/metric";
import type { InvitationKit } from "../actions";
import styles from "./access-panel.module.css";
import shared from "./shared.module.css";

function accessReadyHeadline(available: AccountSnapshot["access"]["available"]) {
  // R-016. An unlimited venue has no readiness count, and printing the
  // formatted label into "N codes ready to send" would say "Unlimited codes
  // ready to send" — true, but it invites the reader to look for the number.
  if (available.state === "unlimited") {
    return "Every couple you book is covered.";
  }
  const count = formatMetricValue(available);
  if (count === "1") return "1 code ready to send.";
  if (count === "Unavailable" || count === "Withheld") {
    return `${count}. Access readiness is not shown as zero.`;
  }
  return `${count} codes ready to send.`;
}

/**
 * Can this account be offered a "request more access" control?
 *
 * Only when Account can say what the venue may issue. An unlimited venue has
 * nothing to request. A venue with no issuing record at all must not be asked
 * to request MORE of something we hold no record of: the surface would be
 * saying "we hold nothing for you" and "ask for more" in the same breath. The
 * correct next action there is `confirm-access-record`, which already renders
 * beside this.
 */
function hasIssuingRecord(available: AccountSnapshot["access"]["available"]) {
  return available.state === "exact" || available.state === "lower_bound";
}

type Filter = "all" | InvitationState;

const FILTERS: Filter[] = [
  "all",
  "not_sent",
  "sent",
  "accepted",
  "expired",
  "revoked",
];

/**
 * One row, whichever source it came from.
 *
 * Live rows arrive from `listInvitationsAction`, which resolves state from
 * both `sponsor_activations` and `license_codes` on the server. Fixture rows
 * are projected into the same shape below so the table, the actions and the
 * stale computation have exactly one code path. `codeId` is null for a
 * fixture, which is what disables every mutating control.
 */
type PanelRow = {
  key: string;
  codeId: string | null;
  maskedCode: string;
  resolved: ResolvedInvitation;
  note: string;
  redeemedOn: string | null;
  expiresOn: string | null;
};

/**
 * The five code states map onto the six invitation states.
 *
 * `declined` has no code-ledger equivalent, which is exactly why the ledger
 * alone cannot carry the lifecycle. Fixtures never produce one.
 */
const FIXTURE_STATE: Record<AccessCodeRow["state"], InvitationState> = {
  available: "not_sent",
  issued: "sent",
  redeemed: "accepted",
  revoked: "revoked",
  expired: "expired",
};

function fixtureRows(rows: AccessCodeRow[], nowMs: number): PanelRow[] {
  return rows.map((row) => {
    const state = FIXTURE_STATE[row.state];
    // Parsed, not asserted. A fixture whose date will not parse produces an
    // unknown staleness verdict rather than a silent "not stale".
    const parsed = row.issuedOn ? Date.parse(row.issuedOn) : NaN;
    const sentAt = Number.isFinite(parsed) ? parsed : null;
    return {
      key: row.maskedCode,
      codeId: null,
      maskedCode: row.maskedCode,
      note: row.note,
      redeemedOn: row.redeemedOn,
      expiresOn: row.expiresOn,
      resolved: {
        state,
        source: "record",
        sentAt,
        acceptedAt: null,
        staleness: invitationStaleness({ state, sentAt, nowMs }),
        discrepancy: null,
      },
    };
  });
}

function formatDay(ms: number | null): string {
  if (ms == null) return "Not recorded";
  return new Date(ms).toISOString().slice(0, 10);
}

export function AccessPanel({
  snapshot,
  role,
  mode = "fixture",
  sponsorId = null,
  slug = null,
}: {
  snapshot: AccountSnapshot;
  role: AccountRole;
  mode?: "fixture" | "live";
  sponsorId?: string | null;
  slug?: string | null;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [liveRows, setLiveRows] = useState<PanelRow[] | null>(null);
  const [liveMeta, setLiveMeta] = useState<{ total: number; matched: number } | null>(
    null,
  );
  const [liveError, setLiveError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<{
    row: PanelRow;
    action: InvitationAction;
  } | null>(null);
  const [kit, setKit] = useState<{ kit: InvitationKit; masked: string } | null>(
    null,
  );

  const unlimited = snapshot.access.available.state === "unlimited";
  const issuingRecordKnown = hasIssuingRecord(snapshot.access.available);
  const canRequest = issuingRecordKnown && roleCan(role, "request_access");
  const requestDenial = issuingRecordKnown
    ? roleDenialReason(role, "request_access")
    : null;
  const canManage = roleCan(role, "manage_invitations");
  const manageDenial = roleDenialReason(role, "manage_invitations");

  /**
   * The clock a fixture's staleness is measured against.
   *
   * The snapshot's own `dataThrough`, not `Date.now()`. Three reasons, in
   * order of how much they matter: a deterministic review fixture must render
   * the same numbers today and next month; `Date.now()` during render gives
   * the server and the client different answers and desynchronises hydration;
   * and a fixture is a statement about a period, so "as at its data-through
   * date" is the honest clock for it.
   *
   * Live rows do not use this at all. Their staleness is computed on the
   * server by `resolveInvitationState`, against the real clock, because there
   * the question genuinely is how long a real couple has been waiting.
   */
  const nowMs = useMemo(() => {
    const parsed = Date.parse(snapshot.coverage.dataThrough);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [snapshot.coverage.dataThrough]);
  const searchId = useId();
  const pageSize = 40;

  const reload = useCallback(async () => {
    if (mode !== "live" || !slug) return;
    // The import is awaited before any setState so that nothing in this
    // function runs synchronously when an effect calls it. A synchronous
    // setState from an effect body is a cascading render.
    const { listInvitationsAction } = await import("../actions");
    setBusy(true);
    setLiveError(null);
    const result = await listInvitationsAction({
      slug,
      search: search.trim() || undefined,
      state: filter === "all" ? "all" : filter,
      pageIndex,
    });
    setBusy(false);
    if (!result.ok) {
      // Honest failure: the rows are cleared rather than left showing the
      // previous venue's numbers as if they were this one's.
      setLiveRows(null);
      setLiveMeta(null);
      setLiveError(result.error);
      return;
    }
    setLiveRows(
      result.page.rows.map((row) => ({
        key: row.codeId,
        codeId: row.codeId,
        maskedCode: row.maskedCode,
        note: describeInvitationState(row.resolved.state).meaning,
        redeemedOn: row.resolved.acceptedAt
          ? formatDay(row.resolved.acceptedAt)
          : null,
        expiresOn: row.expiresAt ? formatDay(row.expiresAt) : null,
        resolved: row.resolved,
      })),
    );
    setLiveMeta({ total: result.page.total, matched: result.page.matched });
  }, [mode, slug, search, filter, pageIndex]);

  useEffect(() => {
    let cancelled = false;
    // reload() is async and awaits a dynamic import before its first setState,
    // so nothing here runs synchronously. The lint rule cannot see through the
    // callback, and the microtask hop makes that explicit rather than asserted.
    // The cancel flag stops a superseded query writing over a newer one.
    void Promise.resolve().then(() => (cancelled ? undefined : reload()));
    return () => {
      cancelled = true;
    };
  }, [reload]);

  const allFixtureRows = useMemo(
    () => fixtureRows(snapshot.access.codes, nowMs),
    [snapshot.access.codes, nowMs],
  );

  // In fixture mode the whole set is already in hand, so search and paging run
  // here. In live mode both ran on the server, over every row the venue has.
  const fixtureFiltered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allFixtureRows
      .filter((row) => filter === "all" || row.resolved.state === filter)
      .filter(
        (row) =>
          !q ||
          row.maskedCode.toLowerCase().includes(q) ||
          row.resolved.state.replace("_", " ").includes(q),
      );
  }, [allFixtureRows, filter, search]);

  const rows = useMemo(
    () =>
      mode === "live"
        ? (liveRows ?? [])
        : fixtureFiltered.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
    [mode, liveRows, fixtureFiltered, pageIndex, pageSize],
  );

  const matched =
    mode === "live" ? (liveMeta?.matched ?? 0) : fixtureFiltered.length;
  const total =
    mode === "live" ? (liveMeta?.total ?? 0) : allFixtureRows.length;
  const pageCount = Math.max(1, Math.ceil(matched / pageSize));

  // The stale alert is computed over the rows in hand. In live mode that is
  // the current page, so the wording says which set it counted rather than
  // implying it swept the account.
  const staleSummary = useMemo(
    () => summariseStaleness(rows.map((row) => row.resolved.staleness)),
    [rows],
  );
  const staleLine = staleAlertLine(staleSummary);

  const snapshotPage = snapshot.access.page;

  async function copyText(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied("Copy unavailable in this browser");
    }
  }

  async function runAction(
    row: PanelRow,
    action: InvitationAction,
    confirm?: string,
  ) {
    if (!slug || !row.codeId) return;
    setBusy(true);
    setNotice(null);
    const { invitationActionAction } = await import("../actions");
    const result = await invitationActionAction({
      slug,
      codeId: row.codeId,
      action,
      confirm,
    });
    setBusy(false);
    setConfirming(null);
    setNotice(result.ok ? result.detail : result.error);
    if (result.ok) void reload();
  }

  async function openKit(row: PanelRow) {
    if (!slug || !row.codeId) return;
    setBusy(true);
    setNotice(null);
    const { revealInvitationKitAction } = await import("../actions");
    const result = await revealInvitationKitAction({ slug, codeId: row.codeId });
    setBusy(false);
    if (!result.ok) {
      setNotice(result.error);
      return;
    }
    setKit({ kit: result.kit, masked: row.maskedCode });
  }

  return (
    <div className={styles.root}>
      <header className={shared.compactHead}>
        <div>
          <p className={shared.eyebrow}>Access</p>
          <h1>{accessReadyHeadline(snapshot.access.available)}</h1>
          <p>
            {unlimited
              ? "Invite the couples you book. There is no count to manage."
              : issuingRecordKnown
                ? "Invite the couples you book. Changes to what you may issue remain a request for Signal Studio review."
                : "Invite the couples you book. Signal HQ Access holds no issuing record for this account, so there is nothing here to report or request against."}
          </p>
        </div>
        <div className={styles.headActions}>
          <button
            type="button"
            className={shared.primaryButton}
            disabled={mode !== "live" || !slug || !canManage || busy}
            title={
              mode !== "live"
                ? "Deterministic review fixture. Select live access to invite a couple."
                : (manageDenial ?? undefined)
            }
            onClick={async () => {
              if (!slug) return;
              setBusy(true);
              setNotice(null);
              const { createInvitationAction } = await import("../actions");
              const result = await createInvitationAction({ slug });
              setBusy(false);
              setNotice(result.ok ? result.detail : result.error);
              if (result.ok) void reload();
            }}
          >
            <AccountIcon name="plus" />
            Invite a couple
          </button>
          {issuingRecordKnown ? (
            <button
              type="button"
              className={shared.secondaryButton}
              disabled={!canRequest}
              title={requestDenial ?? undefined}
              aria-describedby={
                !canRequest && requestDenial ? "access-request-denial" : undefined
              }
              onClick={() => {
                setRequestSent(false);
                setRequestOpen(true);
              }}
            >
              Request more access
            </button>
          ) : null}
          {!canManage && manageDenial ? (
            <p id="access-manage-denial" className={styles.denial} role="note">
              {manageDenial}
            </p>
          ) : null}
          {!canRequest && requestDenial ? (
            <p id="access-request-denial" className={styles.denial} role="note">
              {requestDenial}
            </p>
          ) : null}
        </div>
      </header>

      <div className={shared.totals}>
        <Metric
          className={shared.total}
          metric={snapshot.access.allotted}
          label={ACCOUNT_METRIC_LABELS.covered}
        />
        <Metric
          className={shared.total}
          metric={snapshot.access.available}
          label="Available"
        />
        <Metric
          className={shared.total}
          metric={snapshot.access.issued}
          label="Issued"
        />
        <Metric
          className={shared.total}
          metric={snapshot.access.redeemed}
          label="Redeemed"
        />
      </div>

      <p className={styles.kitNote}>
        Signal Studio sends no email. Choose an invitation below to get its
        link, the approved wording and a printable card, then send it yourself
        from your own address.
      </p>

      {notice ? (
        <p className={styles.copied} role="status">
          {notice}
        </p>
      ) : null}

      {staleLine ? (
        <section className={styles.attention} aria-label="Stale invitations">
          <div>
            <strong>Waiting on couples</strong>
            <span>
              {staleLine}{" "}
              {mode === "live"
                ? "Counted across the invitations shown."
                : "Counted across this review fixture."}
            </span>
          </div>
        </section>
      ) : null}

      {snapshot.access.attention.length > 0 ? (
        <section className={styles.attention} aria-label="Attention">
          {snapshot.access.attention.map((item) => (
            <div key={item.id}>
              <strong>{item.label}</strong>
              <span>{item.detail}</span>
            </div>
          ))}
        </section>
      ) : null}

      <div className={styles.toolbar}>
        <div aria-label="Filter invitations">
          {FILTERS.map((state) => (
            <button
              key={state}
              type="button"
              aria-pressed={filter === state}
              onClick={() => {
                setFilter(state);
                setPageIndex(0);
              }}
            >
              {state === "all"
                ? "all"
                : describeInvitationState(state).label.toLowerCase()}
            </button>
          ))}
        </div>
        <label className={styles.search} htmlFor={searchId}>
          <span className={shared.srOnly}>Search invitations by masked code</span>
          <input
            id={searchId}
            type="search"
            value={search}
            placeholder="Search masked codes"
            onChange={(event) => {
              setSearch(event.target.value);
              setPageIndex(0);
            }}
          />
        </label>
      </div>

      <p className={styles.kitNote}>
        {matched === total
          ? `${matched} invitation${matched === 1 ? "" : "s"}.`
          : `${matched} of ${total} invitation${total === 1 ? "" : "s"} match.`}{" "}
        Search runs over every invitation this account has, not only the rows on
        screen. It matches the masked code, which is the only handle Account
        holds: no couple name, email or identifier is ever carried here.
        {snapshotPage?.truncated
          ? ` The totals above summarise all ${snapshotPage.total} rows; the account snapshot itself carries the newest ${snapshotPage.shown}.`
          : ""}
      </p>

      {liveError ? (
        <p className={styles.denial} role="alert">
          Invitations unavailable: {liveError}
        </p>
      ) : null}

      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>State</th>
              <th>Sent</th>
              <th>Opened</th>
              <th>Expires</th>
              <th>
                <span className={shared.srOnly}>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  {busy
                    ? "Loading invitations…"
                    : search.trim() || filter !== "all"
                      ? "No invitation matches this search. Clear the search or the filter to see the rest."
                      : "No invitations yet. Invite a couple to make the first one."}
                </td>
              </tr>
            ) : null}
            {rows.map((row) => {
              const description = describeInvitationState(row.resolved.state);
              const actions = legalActions(row.resolved.state, "venue");
              return (
                <tr key={row.key}>
                  <td>
                    <strong>{row.maskedCode}</strong>
                    <small>{row.note}</small>
                    {row.resolved.discrepancy ? (
                      <small>{row.resolved.discrepancy}</small>
                    ) : null}
                  </td>
                  <td>
                    <strong>{description.label}</strong>
                    {row.resolved.staleness.state === "stale" ? (
                      <small>
                        Waiting {row.resolved.staleness.daysSinceSent} days.
                      </small>
                    ) : null}
                    {row.resolved.staleness.state === "unknown" ? (
                      <small>{row.resolved.staleness.reason}</small>
                    ) : null}
                  </td>
                  <td>{formatDay(row.resolved.sentAt)}</td>
                  <td>{row.redeemedOn ?? "Not yet"}</td>
                  <td>{row.expiresOn ?? "Not tracked"}</td>
                  <td>
                    <div className={styles.rowActions}>
                      <button
                        type="button"
                        className={styles.rowAction}
                        disabled={
                          mode !== "live" || !row.codeId || !canManage || busy
                        }
                        title={
                          mode !== "live"
                            ? "Plaintext links are only produced against live access."
                            : (manageDenial ?? undefined)
                        }
                        onClick={() => void openKit(row)}
                      >
                        <AccountIcon name="copy" />
                        Get link
                      </button>
                      {actions
                        .filter((action) => action !== "reveal_link")
                        .map((action) => {
                          const rule = transitionRule(action);
                          const meta = describeInvitationAction(action);
                          const verdict = canTransition(
                            row.resolved.state,
                            action,
                            "venue",
                          );
                          return (
                            <button
                              key={action}
                              type="button"
                              className={styles.rowAction}
                              disabled={
                                mode !== "live" ||
                                !row.codeId ||
                                !canManage ||
                                busy ||
                                !verdict.allowed
                              }
                              title={
                                verdict.allowed
                                  ? meta.detail
                                  : (verdict as { reason: string }).reason
                              }
                              onClick={() => {
                                if (rule.destructive) {
                                  setConfirming({ row, action });
                                } else {
                                  void runAction(row, action);
                                }
                              }}
                            >
                              {meta.label}
                            </button>
                          );
                        })}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pageCount > 1 ? (
        <div className={styles.pager} role="navigation" aria-label="Invitation pages">
          <button
            type="button"
            className={shared.ghostButton}
            disabled={pageIndex === 0 || busy}
            onClick={() => setPageIndex((index) => Math.max(0, index - 1))}
          >
            Previous
          </button>
          <span>
            Page {pageIndex + 1} of {pageCount}
          </span>
          <button
            type="button"
            className={shared.ghostButton}
            disabled={pageIndex + 1 >= pageCount || busy}
            onClick={() => setPageIndex((index) => index + 1)}
          >
            Next
          </button>
        </div>
      ) : null}

      {copied ? (
        <p className={styles.copied} role="status">
          {copied}
        </p>
      ) : null}

      <p className={styles.reconcile}>
        {snapshot.access.reconciliation.label}. Reconciliation uses masked code
        suffixes only. {snapshot.access.reconciliation.detail}
      </p>

      {confirming ? (
        <ConfirmSheet
          word={transitionRule(confirming.action).confirmWord ?? ""}
          action={confirming.action}
          maskedCode={confirming.row.maskedCode}
          busy={busy}
          onClose={() => setConfirming(null)}
          onConfirm={(word) =>
            void runAction(confirming.row, confirming.action, word)
          }
        />
      ) : null}

      {kit ? (
        <KitSheet
          kit={kit.kit}
          maskedCode={kit.masked}
          onCopy={copyText}
          onClose={() => setKit(null)}
        />
      ) : null}

      <RequestSheet
        open={requestOpen}
        sent={requestSent}
        error={requestError}
        mode={mode}
        sponsorId={sponsorId}
        onClose={() => {
          setRequestOpen(false);
          setRequestError(null);
        }}
        onSend={async ({ quantity, note }) => {
          setRequestError(null);
          if (mode === "live") {
            if (!sponsorId) {
              setRequestError("Select a live venue before requesting access.");
              return;
            }
            const { recordMoreAccessRequestAction } = await import("../actions");
            const result = await recordMoreAccessRequestAction({
              sponsorId,
              quantity,
              note,
            });
            if (!result.ok) {
              setRequestError(result.error);
              return;
            }
          }
          setRequestSent(true);
        }}
      />
    </div>
  );
}

/**
 * Type-to-confirm for the three destructive actions.
 *
 * The word is checked again in `store.ts` before anything is written. This
 * dialog exists so a person cannot withdraw a couple's access with one
 * mis-aimed click, not to be the gate.
 */
function ConfirmSheet({
  word,
  action,
  maskedCode,
  busy,
  onClose,
  onConfirm,
}: {
  word: string;
  action: InvitationAction;
  maskedCode: string;
  busy: boolean;
  onClose: () => void;
  onConfirm: (word: string) => void;
}) {
  const titleId = useId();
  const inputId = useId();
  const [typed, setTyped] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const meta = describeInvitationAction(action);

  useEffect(() => {
    inputRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className={styles.sheetBackdrop} onMouseDown={onClose}>
      <section
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.sheetClose}
          onClick={onClose}
          aria-label="Close"
        >
          <AccountIcon name="x" />
        </button>
        <p className={shared.eyebrow}>{maskedCode}</p>
        <h2 id={titleId}>{meta.label} this invitation.</h2>
        <p className={styles.sheetIntro}>{meta.detail}</p>
        <label className={styles.sheetField} htmlFor={inputId}>
          <span>Type {word} to confirm.</span>
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            value={typed}
            autoComplete="off"
            onChange={(event) => setTyped(event.target.value)}
          />
        </label>
        <div className={styles.sheetBoundary}>
          <AccountIcon name="lock" />
          <span>
            Checked again on the server before anything is written, and recorded
            against your operator name.
          </span>
        </div>
        <button
          type="button"
          className={shared.primaryButton}
          disabled={typed !== word || busy}
          onClick={() => onConfirm(typed)}
        >
          {meta.label}
        </button>
      </section>
    </div>
  );
}

/**
 * The distribution kit for one invitation (E07.10).
 *
 * The printable card is written into a sandboxed iframe and printed from
 * there, so it prints as a card rather than as this page. The document is
 * self-contained: no font, image or stylesheet is fetched.
 */
function KitSheet({
  kit,
  maskedCode,
  onCopy,
  onClose,
}: {
  kit: InvitationKit;
  maskedCode: string;
  onCopy: (label: string, value: string) => void;
  onClose: () => void;
}) {
  const titleId = useId();
  const frameRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className={styles.sheetBackdrop} onMouseDown={onClose}>
      <section
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.sheetClose}
          onClick={onClose}
          aria-label="Close"
        >
          <AccountIcon name="x" />
        </button>
        <p className={shared.eyebrow}>{maskedCode}</p>
        <h2 id={titleId}>Send this to the couple.</h2>
        <p className={styles.sheetIntro}>
          Signal Studio sends nothing. Copy the wording, send it from your own
          address, then mark the invitation as sent.
        </p>

        <label className={styles.sheetField}>
          <span>Welcome link</span>
          <input type="text" readOnly value={kit.link} />
        </label>
        <button
          type="button"
          className={shared.ghostButton}
          onClick={() => onCopy("Welcome link copied", kit.link)}
        >
          <AccountIcon name="copy" />
          Copy link
        </button>

        <label className={styles.sheetField}>
          <span>Subject</span>
          <input type="text" readOnly value={kit.emailSubject} />
        </label>
        <label className={styles.sheetField}>
          <span>Wording</span>
          <textarea readOnly rows={9} value={kit.emailBody} />
        </label>
        <div className={styles.kitActions}>
          <button
            type="button"
            className={shared.ghostButton}
            onClick={() =>
              onCopy(
                "Email copied",
                `Subject: ${kit.emailSubject}\n\n${kit.emailBody}`,
              )
            }
          >
            <AccountIcon name="copy" />
            Copy subject and wording
          </button>
          <button
            type="button"
            className={shared.ghostButton}
            onClick={() => onCopy("Card text copied", kit.cardText)}
          >
            <AccountIcon name="copy" />
            Copy card text
          </button>
          <button
            type="button"
            className={shared.primaryButton}
            onClick={() => {
              const frame = frameRef.current;
              if (!frame?.contentWindow) return;
              frame.contentWindow.focus();
              frame.contentWindow.print();
            }}
          >
            Print welcome card
          </button>
        </div>
        <iframe
          ref={frameRef}
          className={styles.cardFrame}
          title="Printable welcome card"
          sandbox="allow-modals allow-same-origin"
          srcDoc={kit.cardHtml}
        />
        <p className={styles.kitNote}>
          The card carries your venue name and nothing else. Logos and venue
          written messages are not part of the couple experience.
        </p>
      </section>
    </div>
  );
}

function RequestSheet({
  open,
  sent,
  error,
  mode,
  sponsorId,
  onClose,
  onSend,
}: {
  open: boolean;
  sent: boolean;
  error: string | null;
  mode: "fixture" | "live";
  sponsorId: string | null;
  onClose: () => void;
  onSend: (input: { quantity: number; note: string }) => void | Promise<void>;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key !== "Tab") return;
      const sheet = document.getElementById("account-request-sheet");
      if (!sheet) return;
      const focusable = sheet.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.sheetBackdrop} onMouseDown={onClose}>
      <section
        id="account-request-sheet"
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className={styles.sheetClose}
          onClick={onClose}
          aria-label="Close request"
        >
          <AccountIcon name="x" />
        </button>
        {sent ? (
          <div className={styles.sheetSuccess}>
            <i>
              <AccountIcon name="check" size={20} />
            </i>
            <p>Request recorded for Signal Studio review</p>
            <h2 id={titleId}>Nothing changed without approval.</h2>
            <span>
              {mode === "live"
                ? "The request is stored on sponsor_requests. Nothing about what you may issue changes until Signal HQ Access acts."
                : "This review fixture records the request only. Nothing about what you may issue changes until Signal HQ Access acts."}
            </span>
            <button
              type="button"
              className={shared.primaryButton}
              onClick={onClose}
            >
              Return to Access
            </button>
          </div>
        ) : (
          <>
            <p className={shared.eyebrow}>Request for Signal Studio review</p>
            <h2 id={titleId}>Request more access.</h2>
            <p className={styles.sheetIntro}>
              This never creates codes. Signal HQ Access remains the only
              control plane.
              {mode === "live" && !sponsorId
                ? " Select a live venue first."
                : ""}
            </p>
            <label className={styles.sheetField}>
              <span>How much access do you need?</span>
              <select id="account-request-qty" defaultValue="10">
                <option value="5">5 codes</option>
                <option value="10">10 codes</option>
                <option value="20">20 codes</option>
              </select>
            </label>
            <label className={styles.sheetField}>
              <span>What are they for?</span>
              <textarea
                id="account-request-note"
                rows={4}
                defaultValue="Autumn showcase couples and two venue coordinators."
              />
            </label>
            <div className={styles.sheetBoundary}>
              <AccountIcon name="lock" />
              <span>
                {mode === "live"
                  ? "Persisted request only. No entitlement mutation."
                  : "Deterministic review interaction. No entitlement mutation."}
              </span>
            </div>
            {error ? (
              <p className={styles.denial} role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="button"
              className={shared.primaryButton}
              onClick={() => {
                const qty = Number(
                  (
                    document.getElementById(
                      "account-request-qty",
                    ) as HTMLSelectElement | null
                  )?.value ?? "10",
                );
                const note =
                  (
                    document.getElementById(
                      "account-request-note",
                    ) as HTMLTextAreaElement | null
                  )?.value ?? "";
                void onSend({ quantity: qty, note });
              }}
            >
              Send request
            </button>
          </>
        )}
      </section>
    </div>
  );
}
