# /api/today — Today cross-suite aggregation

Per-user "today" digest that aggregates state across the four products (Tasks / Notes / Roadmap / Analytics). Powers the native iOS app's Today home screen and the web seamless-ecosystem widget.

Type contract: `~/Projects/personal/studio/src/server/today/types.ts`.
Aggregator: `~/Projects/personal/studio/src/server/today/aggregate.ts`.
Route: `~/Projects/personal/studio/src/app/api/today/route.ts`.

## Request

```http
POST /api/today
Authorization: Bearer $SUITE_API_KEY
Content-Type: application/json

{ "clerkId": "user_2abc…", "email": "anya@example.ie" }
```

`SUITE_API_KEY` is a shared server-to-server secret. The caller (iOS-app proxy or web BFF) authenticates the user with Clerk first, then forwards to this endpoint with the resolved `clerkId` and `email`. The endpoint trusts the caller's identification — it does not re-verify a Clerk JWT.

## Response

`200` with a `TodayResponse` JSON body. The shape is lenient-parse-friendly: additive fields are safe, the `reads` health map names which product reads were OK / skipped / errored so the client can render partial-data states.

`401` if the Bearer is missing or wrong (timing-safe compare).
`400` if the body is malformed.
`503` if `SUITE_API_KEY` is not set in the deployment.
`500` if aggregation itself throws (per-product errors are caught and reported via the `reads` map, so 500 means the wrapper itself failed — rare).

`Cache-Control: no-store, private` — never cached, per-user.

## Known v1 limitations

- **Roadmap member workspaces are silently omitted.** Roadmap's schema has no `workspace_members` table — only the workspace OWNER's milestones surface here. Membership-only users see empty Roadmap summary. Tracked in the aggregator file header.
- **`shippedLast24h` is approximate.** Tasks' schema has no transition-time column; `updated_at` is the proxy. A shipped-lane task that was edited (title, comment) within 24h registers here even if the actual ship was earlier. Named in the type's JSDoc and the aggregator comment.
- **Cadence comes from Tasks' `user_preferences.daily_signal_cadence`,** not the Analytics email-subscription DB. This is the same column Analytics reads at briefing time, so it's the canonical source — but it does mean the Analytics email-subscription DB is not consulted by this endpoint.

## Operator provisioning

Five environment variables on the studio Vercel deployment (production AND preview). All are sensitive — set via the Vercel dashboard (not via `vercel env pull`; sensitive vars come back empty from pull per the Clerk-prod-outage gotcha).

| Env var                  | Source                                                                                  |
| ------------------------ | --------------------------------------------------------------------------------------- |
| `SUITE_API_KEY`          | Generate a 32-byte random hex (`openssl rand -hex 32`). Share with the iOS app proxy / web BFF callers only. Rotate quarterly. |
| `TASKS_TURSO_URL`        | Tasks production Turso URL (e.g. `libsql://signal-tasks-…`).                              |
| `TASKS_TURSO_TOKEN`      | **Read-only** Tasks Turso token. Mint via `turso db tokens create --read-only signal-tasks`. |
| `NOTES_TURSO_URL`        | Notes production Turso URL.                                                              |
| `NOTES_TURSO_TOKEN`      | **Read-only** Notes Turso token.                                                          |
| `ROADMAP_TURSO_URL`      | Roadmap production Turso URL.                                                            |
| `ROADMAP_TURSO_TOKEN`    | **Read-only** Roadmap Turso token.                                                        |
| `ANALYTICS_TURSO_URL`    | Analytics prefs DB URL (the `analytics_users` / `phrasing_rotations` instance).           |
| `ANALYTICS_TURSO_TOKEN`  | **Read-only** Analytics prefs DB token.                                                  |

When any pair is missing the endpoint gracefully degrades — `reads.<product> = "skipped_no_env"` and the corresponding slice is null. Apple's reviewer hitting the endpoint with `SUITE_API_KEY` only and no Turso tokens will see an empty-but-well-formed response (the iOS client renders the "set up" state).

## Smoke test

Local — start studio with the envs set:

```bash
curl -X POST http://localhost:3000/api/today \
  -H "Authorization: Bearer $SUITE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"clerkId":"user_xxx","email":"you@example.com"}'
```

Production — same with `https://signalstudio.ie/api/today`. The response includes a `generatedAt` ms timestamp and a `reads` map you can grep for `"error"` entries.

## Future migration to Clerk-JWT direct

When studio gets `@clerk/nextjs` as a dependency, this route should migrate from the shared `SUITE_API_KEY` Bearer to a Clerk middleware check. The caller's `Authorization: Bearer <clerk-session-jwt>` is verified server-side, `clerkId` is derived from the session, and the request body shrinks to nothing (or to optional filters like `?since=…`). The `SUITE_API_KEY` env can then be retired.

That migration is a one-cycle follow-up on top of adding `@clerk/nextjs` to studio's deps. Until then, the shared-key pattern is the iOS-friendly seam with the smallest blast radius.

## Reverification

| Date       | What changed                                                            | Updater                |
| ---------- | ----------------------------------------------------------------------- | ---------------------- |
| 2026-05-20 | Initial draft. Shipped alongside `aggregateToday` + the POST route.     | Agentic iOS prep cycle |
