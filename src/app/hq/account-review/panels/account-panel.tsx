"use client";

import { useState } from "react";
import { roleCan, roleDenialReason } from "@/lib/account/roles";
import type { AccountRole, AccountSnapshot } from "@/lib/account/types";
import { AccountIcon } from "../components/icons";
import styles from "./account-panel.module.css";
import shared from "./shared.module.css";

const SUPPORT_HISTORY = [
  {
    id: "req-1",
    label: "Request more access",
    detail: "Recorded for Signal Studio review · allotment unchanged",
    when: "24 Jul 2026",
  },
  {
    id: "req-2",
    label: "Reporting question",
    detail: "Answered · coverage definitions clarified",
    when: "12 Jul 2026",
  },
];

export function AccountPanel({
  snapshot,
  role,
}: {
  snapshot: AccountSnapshot;
  role: AccountRole;
}) {
  const canManageMembers = roleCan(role, "manage_members");
  const canEditPrefs = roleCan(role, "edit_reporting_preferences");
  const membersDenial = roleDenialReason(role, "manage_members");
  const prefsDenial = roleDenialReason(role, "edit_reporting_preferences");
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className={styles.root}>
      <header className={shared.compactHead}>
        <div>
          <p className={shared.eyebrow}>Account</p>
          <h1>{snapshot.account.name}</h1>
          <p>
            {snapshot.account.editionLabel} · {snapshot.term.label}
          </p>
        </div>
        <span className={styles.standing}>{snapshot.term.standingLabel}</span>
      </header>

      <section className={styles.identity} aria-label="Organisation identity">
        <div>
          <p className={shared.eyebrow}>Organisation</p>
          <strong>{snapshot.account.name}</strong>
          <span>{snapshot.account.editionLabel}</span>
        </div>
        <div>
          <p className={shared.eyebrow}>Term</p>
          <strong>
            {snapshot.term.start} → {snapshot.term.end}
          </strong>
          <span>Renewal {snapshot.term.renewalDate}</span>
        </div>
        <div>
          <p className={shared.eyebrow}>Recipients</p>
          <strong>{snapshot.account.recipientNounPlural}</strong>
          <span>Aggregate reporting only</span>
        </div>
      </section>

      <section aria-label="Account members">
        <div className={styles.sectionHead}>
          <div>
            <p className={shared.eyebrow}>Members</p>
            <h2>Owner, Manager, Viewer</h2>
          </div>
          <button
            type="button"
            className={shared.secondaryButton}
            disabled={!canManageMembers}
            title={membersDenial ?? undefined}
            onClick={() =>
              setNotice(
                "Invite recorded in this review fixture. No email is sent.",
              )
            }
          >
            <AccountIcon name="plus" />
            Invite member
          </button>
        </div>
        <ul className={styles.members}>
          {snapshot.members.map((member) => (
            <li key={member.memberId}>
              <strong>{member.displayName}</strong>
              <span>{member.roleLabel}</span>
              <small>{member.status}</small>
            </li>
          ))}
        </ul>
        {!canManageMembers && membersDenial ? (
          <p className={styles.note} role="note">
            {membersDenial}
          </p>
        ) : null}
      </section>

      <section className={styles.docs} aria-label="Documents and preferences">
        <article>
          <p className={shared.eyebrow}>Reporting preference</p>
          <h2>Prototype only</h2>
          <p>
            Monthly, term, and renewal packs can be preferred here. Nothing is
            scheduled or emailed from this review surface.
          </p>
          <button
            type="button"
            className={shared.ghostButton}
            disabled={!canEditPrefs}
            title={prefsDenial ?? undefined}
            onClick={() =>
              setNotice("Preference saved in the fixture session only.")
            }
          >
            Save preference
          </button>
          {!canEditPrefs && prefsDenial ? (
            <p className={styles.note} role="note">
              {prefsDenial}
            </p>
          ) : null}
        </article>
        <article>
          <p className={shared.eyebrow}>Privacy and measurement</p>
          <h2>Documents</h2>
          <ul>
            <li>Privacy receipt · aggregate use only</li>
            <li>Retention · access ledger vs behavioural aggregates</li>
            <li>How reporting works · committed actions only</li>
          </ul>
        </article>
      </section>

      <section aria-label="Support and request history">
        <div className={styles.sectionHead}>
          <div>
            <p className={shared.eyebrow}>Support</p>
            <h2>Request history</h2>
          </div>
        </div>
        <ul className={styles.history}>
          {SUPPORT_HISTORY.map((item) => (
            <li key={item.id}>
              <strong>{item.label}</strong>
              <span>{item.detail}</span>
              <small>{item.when}</small>
            </li>
          ))}
        </ul>
      </section>

      <div className={shared.lockNote}>
        <AccountIcon name="lock" />
        <span>{snapshot.brandLines.privacy}</span>
      </div>

      {notice ? (
        <p className={styles.notice} role="status">
          {notice}
        </p>
      ) : null}
    </div>
  );
}
