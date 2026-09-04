---
id: project-files-in-drive
title: Project files in the board owner's Google Drive
product: tasks
status: In Progress
lastVerified: 2026-09-04
---

# Project files in the board owner's Google Drive

A board nominates a **storage owner** — a member who connects their Google
Drive. Signal Studio creates one folder per board inside a `Signal Studio`
folder in their My Drive and shares *that folder only* with that board's
members. Every upload is written with the storage owner's credential, and the
browser sends the bytes straight to Google. Members never see a consent screen.
We hold the metadata and the relationship; Google holds the bytes.

Founder decision 2026-08-27. Plan, decisions and status live in the app repo at
`docs/projects/project-drive/`.

## Where it stands

Current internal programme evidence, reviewed 2026-09-04. App PR #168 integrates the retained Drive PR #165; production remains held.

| WP | Package | Status |
|---|---|---|
| 0 | Fix the floor | Historical WP-0 implementation retained; 50 MB paid attachment ceiling remains in current code. Live regression still required. |
| 1 | Spike the Drive chain | Historical two-account sharing spike completed 2026-09-02. This does not certify the in-product lifecycle. |
| 2–3 | Secrets and schema | Encryption implemented; additive 0028/0029 migrations rehearsed on disposable local data and unapplied to production. |
| 4–6 | Connection, folder/access and upload | Backend and initial UI integrated in the candidate. Live provider acceptance and killed-browser recovery remain open. |
| 7 | Surfaces | A Custodian selected for bounded implementation under delegated authority, not a specific founder lock. Connections/access/Resources, owner-change and pending-upload surfaces exist; full design acceptance remains open. |
| 8 | Resilience and release | Linux candidate 50f16575 passes declared code, migration, lifecycle and build gates. Four repair workers remain independently disabled; release, recovery and provider acceptance remain open. |

Observed Linux run 33916021010: db:contract 62/62; Drive test stages 11/11, 20/20 and 332/332; no failures or skips in those stages. Run 33916020941 passes the critical browser attestation. Local built review subsequently passed 132/132 with Drive UI enabled. Later changes require receiving checks. Detailed receipts and remaining owners: docs/execution/january-2027/PROGRAMME.md and App docs/projects/project-drive/STATUS.md.

## WP-0 found two things worth knowing outside the repo

**Settings was telling every customer that uploads did not work.** The line
"File uploads are not yet active on this workspace" rendered unconditionally,
with no demo-mode branch, above a usage bar that was quietly counting real
files. `BLOB_READ_WRITE_TOKEN` had been provisioned for twenty-four days.
Uploads worked the whole time. Anyone who read that panel and decided not to
try attaching a file was turned away by copy, not by a limit.

**The advertised file size was unreachable, and so were the other three.**
Vercel refuses any function request body over 4.5 MB before the framework sees
it. The app's own settings said 8 MB, 50 MB, 10 MB and 50 MB in four places;
all four sat above the platform's line. A 5 MB PDF could not be attached at
all, and failed with an error the app never saw.

Both are fixed. Uploads now go from the browser straight to storage, so 50 MB
is a number we can keep, and the four numbers derive from one constant that CI
will not let drift.

## Customer promise and remaining limits

Drive-backed bytes use the named storage owner’s Google quota. Signal still incurs application, metadata and operational costs, and native fallback still uses Signal storage. There is no verified cost-saving outcome yet.

The current Drive intake enforces MAX_UPLOAD_BYTES = 50 MiB, displayed as 50 MB, in App src/lib/upload-limit.ts and src/server/connections/drive-uploads.ts. The previous prediction that the ceiling disappears is superseded; Google’s theoretical maximum is not Signal’s product limit. Signal-native free storage retains its lower per-file allowance.

The interface distinguishes Signal membership from live Google access, identifies the current storage owner and explains quota, disconnection and handover consequences. Existing provider-owned files stay where they are when a future storage owner is chosen. Failed revocation remains pending. Account erasure must preserve a user’s provider-owned files while completing exact access cleanup. These are implemented invariants under validation, not a claim that the entire product lifecycle has been observed.

Google scope remains only drive.file. It is per-file access, including files created by or explicitly shared with the app; it is not a guarantee limited solely to newly created files. [Official scope guidance](https://developers.google.com/workspace/drive/api/guides/api-specific-auth), retrieved 2026-09-04.

Live in-product Google rehearsal requires the existing isolated OAuth/Clerk test configuration and designated disposable accounts/files. Production activation, privacy wording, rollback and worker receipts remain open. No venue outreach or commercial opening before 21 January 2027.

## Related

- Decision: `content/hq/decisions/project-files-in-drive-2026-08-27.md`
- Risk: `content/hq/risks/drive-refresh-token-custody.md`
- App dispatch: T·153, 2026-08-27
