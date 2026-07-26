"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { formatMetricValue } from "@/lib/account/format";
import { roleCan, roleDenialReason } from "@/lib/account/roles";
import type {
  AccessCodeState,
  AccountRole,
  AccountSnapshot,
} from "@/lib/account/types";
import { AccountIcon } from "../components/icons";
import { Metric } from "../components/metric";
import styles from "./access-panel.module.css";
import shared from "./shared.module.css";

function accessReadyHeadline(available: number | string) {
  const count = String(available);
  if (count === "1") return "1 code ready to send.";
  if (count === "Unavailable" || count === "Withheld") {
    return `${count} — access readiness not shown as zero.`;
  }
  return `${count} codes ready to send.`;
}

type Filter = "all" | AccessCodeState;

const WELCOME_LINK = "https://signalstudio.ie/redeem/venue-welcome";
const EMAIL_COPY = `You're invited to Signal Studio through our Venue Edition access.

Open your welcome link to redeem access. Your planning work stays private — we only see that the benefit was taken up, never what you write or plan.

${WELCOME_LINK}`;

export function AccessPanel({
  snapshot,
  role,
}: {
  snapshot: AccountSnapshot;
  role: AccountRole;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [copied, setCopied] = useState<string | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const canRequest = roleCan(role, "request_access");
  const requestDenial = roleDenialReason(role, "request_access");
  const availableLabel = formatMetricValue(snapshot.access.available);

  const rows = useMemo(
    () =>
      filter === "all"
        ? snapshot.access.codes
        : snapshot.access.codes.filter((row) => row.state === filter),
    [filter, snapshot.access.codes],
  );

  async function copyText(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied("Copy unavailable in this browser");
    }
  }

  return (
    <div className={styles.root}>
      <header className={shared.compactHead}>
        <div>
          <p className={shared.eyebrow}>Access</p>
          <h1>{accessReadyHeadline(availableLabel)}</h1>
          <p>
            Distribute access without seeing recipient work. Allotment changes
            remain a request for Signal Studio review.
          </p>
        </div>
        <div className={styles.headActions}>
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
            <AccountIcon name="plus" />
            Request more access
          </button>
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
          label="Allotted"
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

      <section className={styles.kit} aria-label="Distribution kit">
        <div>
          <p className={shared.eyebrow}>Distribution kit</p>
          <h2>Welcome materials</h2>
        </div>
        <div className={styles.kitActions}>
          <button
            type="button"
            className={shared.ghostButton}
            onClick={() => copyText("Welcome link copied", WELCOME_LINK)}
          >
            <AccountIcon name="copy" />
            Copy welcome link
          </button>
          <button
            type="button"
            className={shared.ghostButton}
            onClick={() =>
              copyText(
                "Welcome card text copied",
                `${snapshot.account.name} · Signal Studio welcome\n${WELCOME_LINK}`,
              )
            }
          >
            <AccountIcon name="copy" />
            Printable welcome card
          </button>
          <button
            type="button"
            className={shared.ghostButton}
            onClick={() => copyText("Email wording copied", EMAIL_COPY)}
          >
            <AccountIcon name="copy" />
            Approved email wording
          </button>
        </div>
        {copied ? <p className={styles.copied} role="status">{copied}</p> : null}
        <p className={styles.kitNote}>
          Deterministic review only. No email is sent and no QR is generated.
        </p>
      </section>

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
        <div aria-label="Filter codes">
          {(
            [
              "all",
              "available",
              "issued",
              "redeemed",
              "revoked",
              "expired",
            ] as Filter[]
          ).map((state) => (
            <button
              key={state}
              type="button"
              aria-pressed={filter === state}
              onClick={() => setFilter(state)}
            >
              {state}
            </button>
          ))}
        </div>
        <span>{rows.length} masked rows</span>
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
              <th>
                <span className={shared.srOnly}>Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.maskedCode}>
                <td>
                  <strong>{row.maskedCode}</strong>
                  <small>{row.note}</small>
                </td>
                <td>{row.state}</td>
                <td>{row.issuedOn ?? "Not sent"}</td>
                <td>{row.redeemedOn ?? "Not yet"}</td>
                <td>{row.expiresOn ?? "—"}</td>
                <td>
                  <button
                    type="button"
                    className={styles.rowAction}
                    disabled={row.state !== "available"}
                    onClick={() =>
                      copyText(
                        `${row.maskedCode} copied`,
                        `${WELCOME_LINK}?code=${row.maskedCode}`,
                      )
                    }
                  >
                    <AccountIcon name="copy" />
                    {row.state === "available" ? "Copy" : "View"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className={styles.reconcile}>
        {snapshot.access.reconciliation.label}. Reconciliation uses masked code
        suffixes only. {snapshot.access.reconciliation.detail}
      </p>

      <RequestSheet
        open={requestOpen}
        sent={requestSent}
        onClose={() => setRequestOpen(false)}
        onSend={() => setRequestSent(true)}
      />
    </div>
  );
}

function RequestSheet({
  open,
  sent,
  onClose,
  onSend,
}: {
  open: boolean;
  sent: boolean;
  onClose: () => void;
  onSend: () => void;
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
              This review prototype records the request only. Allotment and
              codes stay unchanged until Signal HQ Access acts.
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
              This never changes allotment or creates codes. Signal HQ Access
              remains the only control plane.
            </p>
            <label className={styles.sheetField}>
              <span>How much access do you need?</span>
              <select defaultValue="10">
                <option value="5">5 codes</option>
                <option value="10">10 codes</option>
                <option value="20">20 codes</option>
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
              <AccountIcon name="lock" />
              <span>
                Deterministic review interaction. No entitlement mutation.
              </span>
            </div>
            <button
              type="button"
              className={shared.primaryButton}
              onClick={onSend}
            >
              Send request
            </button>
          </>
        )}
      </section>
    </div>
  );
}
