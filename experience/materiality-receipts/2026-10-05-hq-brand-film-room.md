# HQ film room, Plain Words v1 · registry receipt

Branch `feat/hq-plain-words-film-v1` (S·188) puts the rendered brand film,
Plain Words (flagship prototype v1), at the top of the HQ film room. One
registered Studio source changed and one new source was registered. The hash
was refreshed with the registry's own `hashFile`, spliced into the committed
entry; the old hash matched the file on `main` (55e558e), so the change is this
branch's. Coverage values were not moved.

## Entry refreshed

- `studio.page.hq-demo-film` (`src/app/hq/demo-film/page.tsx`): the room's
  header becomes "Films."; a new section plays the film (native `<video>` with
  poster), links the 30 and 15 second cuts and the interactive player, and
  lists the spec, the seven beats, the nine open v1.1 review items and the
  gates. The hero-film scaffold that was the whole page stays below, unchanged,
  under its own heading. Founder-only, behind `requireHqAccess()`.
  `899f945588740b98` to `b13e4827d5bdd08d`.

## Entry added

- `studio.artifact.brand-films-plain-words-v1-plain-words-v1`
  (`public/brand/films/plain-words/v1/plain-words-v1.html`, hash
  `1abd100d6bca2c37`): the film's interactive player, a self-contained page
  with live Web Audio sound and chapters. Registered `live`, `registered`, no
  automated coverage. Role `founder`: it is internal review material reached
  from the HQ room, kept out of indexes by `X-Robots-Tag` on
  `/brand/films/:path*` and a `noindex` meta tag, not a public page.

## Changed, not registered

`src/lib/hq/brand-film.ts` (the film's data), `src/lib/hq/rooms.ts` (the
room's one-line summary), `src/app/globals.css` (the `hq-bf-*` rules),
`next.config.ts` (the `/brand/films/:path*` header rule), the media under
`public/brand/films/plain-words/v1/` and the record
`content/hq/design-reviews/2026-10-03-plain-words-film-v1/README.md`.

## Evidence

On this branch, locally: `pnpm typecheck`, `pnpm test` and `pnpm build` pass;
`experience:validate --product=studio`, `experience:self-test`,
`experience:audit --enforce` and `ux:assure --enforce` pass; `playwright test`
passes 88 of 89 in a full run, and the one failure (the brand guidelines
chapter-scroll stability wait, a 5 s timing check, run while the dev server was
still compiling) passes 9 of 9 when its spec runs alone. The room was rendered
from `pnpm start` with HQ access at 1440 and 390 wide.
