# Full Briefing retirement · registry receipt

Branch `docs/hq-home-bento` retires the Full Briefing / daily briefing from
public copy (founder decision, 20 October 2026), alongside app PR
ethanmcn2013-droid/app#300 which removes it from the product. Three
registered Studio sources changed, copy only. Each hash was refreshed to the
value the registry's own discovery computes for the file on this branch; each
old hash matched the file on `main` (04eaff3a), so the change is this
branch's. Coverage values were not moved. This is a record of a copy change,
not a design approval.

## Entries refreshed

- `studio.page.press` (`src/app/press/page.tsx`): the one-line, 50-, 150- and
  400-word boilerplates no longer mention the briefing, and the paragraph
  linking the retired `/features/daily-briefing` page is removed.
  `5a33d032bd77a1f8` to `473464636db2ba0c`.
- `studio.page.privacy` (`src/app/privacy/page.tsx`): briefing preferences are
  described as data set before the briefing was retired (it still exists and
  stays covered by export and erasure); the Resend line lists account and
  access emails, task digests and notifications, and operator notifications;
  updated date 2026-10-20. `5e5bb3cc402e76e3` to `1d4bd99e547478f4`.
- `studio.page.redeem-by-code` (`src/app/redeem/[code]/page.tsx`): the "Daily
  briefing" item and two briefing phrases are removed from what is included;
  terms unchanged. `205fa4ca258cfd64` to `a20e28b96336e1ad`.

## No rendered evidence

All three pages sit behind `LANDING_ONLY` (`src/lib/landing-only.ts`), which
302s them to `/`, so they are not publicly reachable and the capture tools
cannot render them. A local render with the flag lifted was attempted and
stopped by the agent permission system before building. Ethan McNamara
approved recording these copy changes without a render, in chat on
2026-10-20.

## Evidence

On this branch, locally: `pnpm typecheck`, `pnpm build` and `pnpm ds:check`
pass; `pnpm test` passes every stage except the known Windows-only EBUSY
failure in `waitlist saves and updates one normalized address in isolated
SQLite`, which this change does not touch. CI on Linux is the check of
record.
