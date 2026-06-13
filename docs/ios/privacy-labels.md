# App Privacy labels

App Store Connect → My App → App Privacy → Data Types disclosure.

Apple's taxonomy has 14 data-type categories. For each, we declare: collected? linked to user identity? used for tracking? used for the four allowed purposes (App Functionality, Signal, Product Personalization, Other)?

We don't track users across apps or websites. The "Used for Tracking" disclosure is not checked for any data type in the matrix below.

## Disclosure matrix

### Contact Info

| Data type     | Collected? | Linked to user? | Used for tracking? | Purposes               |
| ------------- | ---------- | --------------- | ------------------ | ---------------------- |
| Name          | Yes (optional, profile) | Yes             | No                 | App Functionality      |
| Email Address | Yes (auth)              | Yes             | No                 | App Functionality      |
| Phone Number  | No                      | —               | —                  | —                      |
| Physical Address | No                   | —               | —                  | —                      |
| Other User Contact Info | No            | —               | —                  | —                      |

### Health and Fitness

All categories: **No**.

### Financial Info

All categories: **No**. (Pricing is on the web; iOS app has no commerce surface per the §3.1.3(b) refusal.)

### Location

All categories: **No**. The app does not use `CLLocationManager`.

### Sensitive Info

All categories: **No**.

### Contacts

All categories: **No**. The app does not access the device address book.

### User Content

| Data type        | Collected? | Linked to user? | Used for tracking? | Purposes          |
| ---------------- | ---------- | --------------- | ------------------ | ----------------- |
| Emails or Text Messages | No  | —               | —                  | —                 |
| Photos or Videos | No                      | —               | —                  | —                 |
| Audio Data       | **Special case** — see note below | —    | —                  | —                 |
| Gameplay Content | No                      | —               | —                  | —                 |
| Customer Support | No                      | —               | —                  | —                 |
| Other User Content | Yes (Notes, Tasks, Timeline, Signal content) | Yes | No                 | App Functionality |

**Audio note.** Notes' voice capture uses `AVAudioRecorder` to write a temp `.m4a` file that is fed to `SFSpeechRecognizer`. When the active locale supports on-device recognition (most major locales on modern iOS), the audio never leaves the device — see `data-flow.md` for the exact code path. Per Apple's guidance, transient on-device processing where data is not persisted or transmitted does not require an "Audio Data" disclosure.

**Network-fallback caveat.** For locales without on-device speech support, `SpeechTranscriber` falls back to Apple's network speech endpoint, which sends the audio to Apple. This is Apple's own first-party channel (not a third-party SDK), and Apple's App Privacy guidance treats first-party platform services differently from app data collection — but operators should make the call before submission whether to (a) gate the feature off in network-only locales so the "Audio Data: No" answer remains universally true, or (b) add "Audio Data — Linked: Yes — App Functionality" for the fallback case. The first is cleaner; the second is more honest if the feature is left on. Tracked as a hardening to-do in `data-flow.md`.

### Browsing History

All categories: **No**.

### Search History

All categories: **No**. In-app search (Notes search) runs locally over user-owned content; queries are not collected as a separate data type.

### Identifiers

| Data type     | Collected? | Linked to user? | Used for tracking? | Purposes          |
| ------------- | ---------- | --------------- | ------------------ | ----------------- |
| User ID       | Yes (Clerk user ID) | Yes        | No                 | App Functionality |
| Device ID     | No (no IDFA, no IDFV custom use) | —    | —                  | —                 |

### Purchases

All categories: **No**. No IAP, no in-app purchases.

### Usage Data

All categories: **No**. No product signal SDK; no advertising metrics; no first-party event tracking.

### Diagnostics

| Data type        | Collected? | Linked to user? | Used for tracking? | Purposes          |
| ---------------- | ---------- | --------------- | ------------------ | ----------------- |
| Crash Data       | Yes (Apple's own crash reporting) | No (anonymous device UUID) | No | App Functionality |
| Performance Data | No                      | —               | —                  | —                 |
| Other Diagnostic Data | No                | —               | —                  | —                 |

### Other Data

All categories: **No**.

## Required-reason API cross-reference

Apple's Required-Reason API declarations (`UserDefaults`, `File Timestamp`, `Disk Space`) live in `privacyinfo-xcprivacy.md`. The App Privacy labels above describe **what** is collected and how. The `PrivacyInfo.xcprivacy` manifest describes **which Apple-restricted APIs** the app reaches into and why. Both must agree before submission.

## Summary line for the App Store listing

"Data Not Collected" is not technically accurate (we do collect Name, Email, User Content, User ID, Crash Data), but everything we collect is for App Functionality and none is used for tracking. The "Privacy: Data Linked to You" pill will show: **Contact Info, User Content, Identifiers, Diagnostics**.

## Reverification

| Date       | What changed                | Updater                |
| ---------- | --------------------------- | ---------------------- |
| 2026-05-20 | Initial draft from data-flow.md. | Agentic iOS prep cycle |
