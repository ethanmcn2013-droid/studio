# Authenticated Capture Fixture

The protected experience runner uses one isolated, non-customer Clerk identity across Tasks, Timeline, Signal, and Notes. Signal HQ uses its separate founder-operator password. Signal Review remains a local review instrument and receives no customer credentials.

## Controlled identity

- Fixture label: `signal-experience-capture`
- Account: `ethanmcn2013+signal-experience-capture@gmail.com`
- Data rule: test-only data; never connect a customer workspace, invitation, payment method, or production customer record.
- Entitlement: ordinary allowlisted member only; no founder or administrative role.
- Production allowlist: the same exact fixture identity is present in `SIGNAL_ALLOWLIST` for the Tasks, Timeline, Signal, and Notes Vercel projects.

The fixture password is stored only as the break-glass GitHub Actions secret `EXPERIENCE_CAPTURE_PASSWORD`; routine automation does not submit it. The protected job uses Clerk's official server-side test session helper with `CLERK_SECRET_KEY` and `CLERK_PUBLISHABLE_KEY`, which bypasses verification and MFA without disabling either control for normal users. The address is the repository variable `EXPERIENCE_CAPTURE_EMAIL`. No credential value is committed. Studio HQ's separate credential is held as `SIGNAL_HQ_PASSWORD`.

## Targets

The protected job receives canonical targets from these repository variables:

- `EXPERIENCE_BASE_URL_TASKS`
- `EXPERIENCE_BASE_URL_TIMELINE`
- `EXPERIENCE_BASE_URL_SIGNAL`
- `EXPERIENCE_BASE_URL_NOTES`
- `EXPERIENCE_BASE_URL_STUDIO`
- `EXPERIENCE_HQ_URL`

The protected pilot covers `tasks.page.app-board`, `timeline.page.app`, `signal.page.app-onboarding`, `notes.page.app`, and `studio.page.hq-experience-quality` at all four canonical breakpoints. These are rendered destinations, not redirect-only aliases. The four customer-product captures use the isolated Clerk fixture; HQ uses its separate founder-operator password and cookie. The runner clears authentication-page diagnostics, enforces the exact final route, and then records the same runtime, accessibility, overflow, screenshot, and hash evidence as a public capture.

## Seed and reset contract

1. Keep the fixture account isolated from customer data.
2. The `first-use` pilot starts from the dedicated account's empty product state; do not create durable customer-like records before the pilot.
3. If a later fixture creates test records, prefix them `EXPERIENCE CAPTURE` and delete them through the product's own controls during teardown.
4. If the account becomes non-deterministic or receives an unexpected entitlement, rotate the fixture identity and password, update the four allowlists, and replace the GitHub secret before recapturing.
5. Never solve an interactive verification prompt in CI. A verification prompt fails the job and requires credential/session remediation outside the evidence artifact.

## Operating command

Run the `design-quality` workflow manually. Its `protected-authenticated-pilot` job uses only protected secrets, runs `pnpm experience:capture -- --protected-only`, and publishes a seven-day evidence artifact. A successful pilot proves access for the five named routes and states; it does not imply that every protected state across the suite is already captured or Studio-grade.
