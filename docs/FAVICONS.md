# Signal favicon contract

The browser favicon is an indigo dot (`#4f46e5`) surrounded by an indigo
ring, with **no background**, as clarified by the user on 8 September 2026.
Both the area outside the ring and the gap around the dot are transparent.
`src/lib/brand/suite-mark.tsx` owns the unchanged dot/ring proportions from
Studio `839fd493`. `src/lib/brand/browser-icons.ts` owns the browser treatment
and the explicit icon selection. Apple and maskable install icons retain
their existing opaque white tile.

The September 2026 repair replaced the legacy black tile with a white
triangle still present in `src/app/favicon.ico`. That stale file had SHA256
`2b8ad2d33455a8f736fc3a8ebf8f0bdea8848ad4c0db48a2833bd0f9cd775932`.
Next adds this file to page metadata independently of `/icon`, so correcting
only the generated routes leaves competing artwork in the browser. The
earlier repair put the branded mark on white; that also fails the clarified
request and is replaced by a transparent ICO.

The root layout explicitly selects the versioned transparent `/icon` and
the Apple tile. This prevents Next's automatically discovered 512px `/icon1`
maskable tile from becoming another browser favicon candidate. Next still
adds the regenerated `/favicon.ico` fallback with its content fingerprint.
The explicit PNG URL and static ICO filename have fresh versions so cached
icons cannot keep selecting the previous white tile.

Run `pnpm brand:icons` after an intentional artwork change. It renders
`SuiteMark` with the browser's transparent background through the same Next
ImageResponse implementation as `/icon`, then packs 16, 32, 48 and 256 pixel
PNG frames into the ICO. The generator contains no duplicated brand colours
or proportions.

`pnpm test` verifies the committed artwork seal, every generated ICO frame,
and actual image responses from `/icon`, `/apple-icon` and `/icon1`. Pixel
checks require transparent corners and ring gap, the exact indigo center,
and a visible ring. The guard rejects both the old triangle and an opaque
white fallback. Update the artwork seal only after reviewing an intentional
mark change; change the browser URL and static filename version at the same
time. This Studio correction does not change the held App PR #173.

Studio's active standalone brand pages use
`assets/signal-favicon-transparent-v1.ico`, an identical generated copy.
The documents publisher already copies relative
`assets/` references into the `growth.` and `plan.` mirrors; absolute site
paths would break those independent hosts. The default test checks the copy
and each page's favicon reference. Archived design prototypes remain dated
evidence. Signal Design System is a package and has no favicon route.

The external `ceo1.html` file is unavailable in this workspace. The user's
subsequent description supplies the required transparent indigo dot/ring
treatment; the current committed shape supplies its proportions.
