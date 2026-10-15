---
id: project-first-app-shell
title: Project-first app shell and tool navigation
product: Signal Studio (suite-wide)
category: Integration
status: Shipped
priority: High
effort: Large
impact: High
owner: Ethan
relatedCampaign: None assigned
relatedMetric: Not assigned
---

## What it is

The signed-in App shell gives a clear path into work: Home,
Analytics and Files lead; Projects, Tasks and Timeline sit together under
Workspace; and More groups existing tools with clearly marked future tools.
Project rows retain their existing project context and routes. This builds on
the navigation documented in the Atlas entry [Core navigation in the unified
app](../../atlas/unified-app-core-navigation.md) and the decision [Core work,
with the daily signal inside Home](../decisions/three-products-home.md).

The Wedding hub is a project finder for existing, authorized Wedding projects
and their available Guestlist. Seating and Budget remain marked as coming
soon. Development groups the existing Automations tool. Teacher and Student
entries make the planned tool paths visible without presenting unfinished
tools as working destinations. These are tools and groupings inside Signal
Studio, not new products.

More can be customized and its sections collapsed. More visibility choices
are saved in the current browser; they are not account-synced preferences.
Hiding an entry changes its navigation visibility, not its data. Hiding a
parent group preserves its child choices. Task discussions are absent from
the general chat list, but remain in their task context; nothing is deleted.

## Boundaries

- The candidate preserves existing Project membership and authorization. The
  Wedding finder uses the existing Wedding classification and member-visible
  Projects; it does not change eligibility or access rules.
- Project folders continue to follow the existing task/file model. This does
  not create a second Drive integration or alter the storage-owner contract in
  [Project files in the storage owner's Google Drive](project-files-in-drive.md).
- Self-chat remains private to its owner. Migration 43 was applied through the
  guarded encrypted-backup workflow on 15 October 2026. Live receiving
  confirmed the owner's private note and unsent-draft persistence; this
  one-account check does not requalify tenant isolation with a second user.
- Physical-device dictation is unverified. Custom reports, an AI assistant,
  uploads, a complete Whiteboard, and Teacher or Student verticals are not
  delivered by this release.

## Current status

App PR [#284](https://github.com/ethanmcn2013-droid/app/pull/284) is merged to
App main at `ed3bbf1013a11faacc750c5106511152783b6214`. Production receiving
was recorded on 15 October 2026 against deployment
`dpl_H7PR1v14SSZczDA1KEsSkCA48R4n` at
[`app.signalstudio.ie/app/files`](https://app.signalstudio.ie/app/files).
The production readback verified all six required app addresses on that
deployment; the other 55 address mappings matched the existing baseline.
The live receipt confirmed the signed-in App and five existing Projects; the
real canary tasks and files were unchanged.

Receiving verified the owner's private note saving and reload, its 146-byte
Markdown export, and an unsent personal draft surviving navigation between
Tasks and Files. Files opened a three-file folder and native file preview;
search narrowed results from three to one and clearing restored the folder.
Settings opened over Files and closed back to it. More preferences collapsed
and restored the section, survived reload, and hid then restored Whiteboard.
Project actions from both the menu and right-click exposed the same five
actions. The selected Project ring, project-channel sidebar, and 52-pixel
circular chat launcher were also received. Desktop fit without horizontal
overflow. On 390×844 phone emulation, chat and composer DOM geometry fit the
viewport; the phone screenshot attempt was inconclusive because of browser
capture artifacts.

The receipt records the personal note as synthetic founder data. It does not
establish a second-user tenant-isolation journey. Physical-device dictation
remains unverified, and live clipboard copy and its toast were not confirmed.
No claim is made that those checks passed. This release does not deliver chat
attachments, AI assistance, custom dashboards, a complete Whiteboard, or the
Teacher and Student verticals. Unfinished navigation entries remain marked as
coming soon.

## Next proof

The received release is shipped. Separately verify physical-device dictation,
live clipboard feedback, and a second-user privacy journey before making claims
about those behaviors. Keep the older core-navigation decision and the
existing Project Drive feature as their own records.
