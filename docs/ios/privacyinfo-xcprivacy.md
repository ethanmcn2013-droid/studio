# PrivacyInfo.xcprivacy template

Required for all iOS app submissions from iOS 17 onwards. Declares the app's privacy posture in a machine-readable plist that Apple's review tooling parses alongside the human-readable App Privacy labels.

## Status

This file is a **template**. As of 2026-05-20 there is no `PrivacyInfo.xcprivacy` in the signal-ios repo (verify: `find ~/Projects/personal/signal-ios -name 'PrivacyInfo*'` returns empty). The XML below should be copied into a real `SignalStudio/PrivacyInfo.xcprivacy` file before any TestFlight or App Store submission, and a `sources:` entry added in `project.yml` so xcodegen wires it into the target.

## File location (when materialised)

Drop into the Xcode project as `SignalStudio/PrivacyInfo.xcprivacy` and confirm via `xcodegen generate` + Xcode's "Copy Bundle Resources" build phase that it's in the target's resources. The xcodegen `project.yml` `sources` block needs to include `PrivacyInfo.xcprivacy` in the SignalStudio target's source paths (or its `resources` if you prefer the explicit split) — verify with `xcodebuild -showBuildSettings` and a clean build before submitting.

## Template

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <!--
    Signal Studio · PrivacyInfo.xcprivacy
    Drafted 2026-05-20. Source of truth: docs/ios/data-flow.md in the studio repo.
    When data flows change, update data-flow.md FIRST, then propagate here.
  -->

  <!-- We do not track users across apps or websites. -->
  <key>NSPrivacyTracking</key>
  <false/>

  <!-- No tracking domains, since NSPrivacyTracking is false. -->
  <key>NSPrivacyTrackingDomains</key>
  <array/>

  <!--
    NSPrivacyCollectedDataTypes
    Mirrors docs/ios/privacy-labels.md disclosure matrix.
    Apple's full type list:
    https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_data_use_in_privacy_manifests
  -->
  <key>NSPrivacyCollectedDataTypes</key>
  <array>

    <!-- Email Address — Auth -->
    <dict>
      <key>NSPrivacyCollectedDataType</key>
      <string>NSPrivacyCollectedDataTypeEmailAddress</string>
      <key>NSPrivacyCollectedDataTypeLinked</key>
      <true/>
      <key>NSPrivacyCollectedDataTypeTracking</key>
      <false/>
      <key>NSPrivacyCollectedDataTypePurposes</key>
      <array>
        <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
      </array>
    </dict>

    <!-- Name — Profile -->
    <dict>
      <key>NSPrivacyCollectedDataType</key>
      <string>NSPrivacyCollectedDataTypeName</string>
      <key>NSPrivacyCollectedDataTypeLinked</key>
      <true/>
      <key>NSPrivacyCollectedDataTypeTracking</key>
      <false/>
      <key>NSPrivacyCollectedDataTypePurposes</key>
      <array>
        <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
      </array>
    </dict>

    <!-- User ID — Clerk user ID -->
    <dict>
      <key>NSPrivacyCollectedDataType</key>
      <string>NSPrivacyCollectedDataTypeUserID</string>
      <key>NSPrivacyCollectedDataTypeLinked</key>
      <true/>
      <key>NSPrivacyCollectedDataTypeTracking</key>
      <false/>
      <key>NSPrivacyCollectedDataTypePurposes</key>
      <array>
        <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
      </array>
    </dict>

    <!-- Other User Content — Notes, Tasks, Timeline, Signal content -->
    <dict>
      <key>NSPrivacyCollectedDataType</key>
      <string>NSPrivacyCollectedDataTypeOtherUserContent</string>
      <key>NSPrivacyCollectedDataTypeLinked</key>
      <true/>
      <key>NSPrivacyCollectedDataTypeTracking</key>
      <false/>
      <key>NSPrivacyCollectedDataTypePurposes</key>
      <array>
        <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
      </array>
    </dict>

    <!-- Crash Data — Apple's own crash reporting -->
    <dict>
      <key>NSPrivacyCollectedDataType</key>
      <string>NSPrivacyCollectedDataTypeCrashData</string>
      <key>NSPrivacyCollectedDataTypeLinked</key>
      <false/>
      <key>NSPrivacyCollectedDataTypeTracking</key>
      <false/>
      <key>NSPrivacyCollectedDataTypePurposes</key>
      <array>
        <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
      </array>
    </dict>

  </array>

  <!--
    NSPrivacyAccessedAPITypes — Required-Reason APIs
    Each API used must declare a reason from Apple's approved list:
    https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api
  -->
  <key>NSPrivacyAccessedAPITypes</key>
  <array>

    <!-- UserDefaults — used for app preferences (theme, motion, appearance) -->
    <dict>
      <key>NSPrivacyAccessedAPIType</key>
      <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
      <key>NSPrivacyAccessedAPITypeReasons</key>
      <array>
        <string>CA92.1</string>
      </array>
    </dict>

    <!-- File Timestamp — used for ordering notes/tasks by modification time -->
    <dict>
      <key>NSPrivacyAccessedAPIType</key>
      <string>NSPrivacyAccessedAPICategoryFileTimestamp</string>
      <key>NSPrivacyAccessedAPITypeReasons</key>
      <array>
        <string>C617.1</string>
      </array>
    </dict>

    <!--
      Disk Space — AVAudioRecorder writes a temp .m4a per Notes voice capture
      and may transitively pre-flight available storage. Code 85F4.1 is the
      right reason here ("check whether there is sufficient disk space to
      write files that the app generates as part of its functionality").
      NOT E174.1 ("Display disk space to the user") — that's a different,
      explicit-UI use case the app doesn't have.
    -->
    <dict>
      <key>NSPrivacyAccessedAPIType</key>
      <string>NSPrivacyAccessedAPICategoryDiskSpace</string>
      <key>NSPrivacyAccessedAPITypeReasons</key>
      <array>
        <string>85F4.1</string>
      </array>
    </dict>

    <!--
      System Boot Time — INTENTIONALLY OMITTED.
      As of 2026-05-20, a grep across signal-ios/SignalStudio/ shows no
      direct `mach_absolute_time`, `systemUptime`, or boot-time API
      usage. URLSession's internal cache-header logic does touch boot
      time transitively, but Apple's guidance is to declare only what
      the app's own code calls. If a future cycle introduces session-
      length telemetry or boot-time math, add an entry with code
      `35F9.1` ("measure time between events that occur within the
      app") — NOT `8FFB.1`, which is the "may be sent off-device"
      reason and contradicts our no-telemetry stance.
    -->

  </array>

</dict>
</plist>
```

## Codes used (Apple's approved reasons)

| API category    | Code     | Meaning                                                                                         |
| --------------- | -------- | ----------------------------------------------------------------------------------------------- |
| User Defaults   | `CA92.1` | Access info from the same app, per-app group, or shared with another app via same dev account.  |
| File Timestamp  | `C617.1` | Display file timestamps to the user.                                                            |
| Disk Space      | `85F4.1` | Check whether sufficient disk space is available to write files the app generates (e.g., the AVAudioRecorder temp `.m4a` in Notes voice capture). |

## SDKs to add to NSPrivacyAccessedAPITypes if added later

If a third-party SDK is added (despite the "no paid third-party services" refusal — only the Clerk-iOS SDK is currently a candidate), Apple requires its privacy manifest to be either bundled or its data-collection categories added here. Clerk-iOS SDK at writing time ships a `PrivacyInfo.xcprivacy` of its own; verify on install and rely on Xcode's privacy-report aggregation.

## Reverification

| Date       | What changed              | Updater                |
| ---------- | ------------------------- | ---------------------- |
| 2026-05-20 | Initial draft from data-flow.md. | Agentic iOS prep cycle |
| 2026-05-20 | Panel review: dropped System Boot Time entry (no direct boot-time API usage in codebase; 35F9.1 reason rationale was off-spec for our no-telemetry posture), tagged file as template-only since no `.xcprivacy` exists in repo. | Agentic iOS prep cycle |
| 2026-05-20 | Panel re-review: Disk Space reason code corrected from E174.1 ("Display disk space to the user" — wrong fit) to 85F4.1 ("Check whether sufficient disk space is available to write files the app generates"). Matches actual AVAudioRecorder use. | Agentic iOS prep cycle |
