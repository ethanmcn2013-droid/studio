# Signal Studio · Brand Assets

A SVG-first kit of the Signal Studio logo, mark, and product wordmarks, with PNG renders where exported.

Drop this folder straight into Google Drive — every file previews correctly without needing Geist installed.

---

## What's inside

```
brand-assets/
├── README.md                ← you are here
├── index.html               ← visual gallery (open in a browser)
│
├── svg/                     ← scalable vector masters (text is outlined to paths,
│   │                          no font dependency — opens cleanly anywhere)
│   ├── wordmark/            signal studio · indigo / ink / paper
│   ├── lockup/              signal studio on cream / ink / indigo backgrounds
│   ├── mark/                the dot — indigo / ink / paper
│   ├── app-icon/            squircle tiles — cream / ink / indigo / paper
│   └── product-wordmarks/   tasks · timeline · signal · notes
│
└── png/                     ← rendered raster versions
    ├── wordmark/            128, 256, 512 height
    ├── lockup/              800 and 1600 wide (16 : 9 social cards)
    ├── mark/                16, 32, 64, 128, 256, 512, 1024 px
    ├── app-icon/            16 → 1024 px (same sizes)
    └── product-wordmarks/   128, 256, 512 height
```

---

## When to use which file

| Need | Use |
|---|---|
| Logo in a slide / doc / Notion page | `svg/wordmark/signal-studio-indigo.svg` |
| Logo on a dark slide background | `svg/wordmark/signal-studio-paper.svg` |
| Hero / share card (16 : 9) | `svg/lockup/on-cream.svg` (or ink / indigo) |
| Favicon | `svg/mark/dot-ring-indigo.svg` (or any size PNG from `png/mark/`) |
| App / launcher icon | `svg/app-icon/cream.svg` |
| Product-specific lockup | `svg/product-wordmarks/tasks.svg` etc. |

### SVGs are the master format
The SVG masters are the source of truth. House marks are outlined where already exported; the current Timeline and Signal product wordmarks use rendered text in canonical SVG masters until the next path-outline export pass. They must still read `timeline` and `signal` in the asset itself, the aria-label, and the filename.

### PNGs are for places that can't take SVG
Slack avatars, GitHub README badges, email signatures, anywhere SVG isn't supported.

**PNG export TODO:** regenerate `png/product-wordmarks/timeline-{128,256,512}.png` and `png/product-wordmarks/signal-{128,256,512}.png` from the canonical SVG masters. Do not rename legacy rasters; render fresh files.

---

## Brand rules (the short version)

- **The dot is the brand.** Same shape from favicon to billboard.
- **One indigo:** `#4f46e5`. Don't recolour the dot.
- **Geist 500, lowercase, kerning −0.025em.** Never uppercase. Never italic. Never tracked-out.
- **The dot is 0.16 × cap-height** with a 0.06em gap from the wordmark.

For the full design system, see `Signal Studio Design System.html` and the brand book pages alongside it.

---

## Re-exporting

If you ever need a size that isn't here, open the SVG in Chrome, then **File → Print → Save as PDF** (or **Save Page As → png** in DevTools). The SVG is the source of truth.

Run `node scripts/check-brand-assets.mjs` from the Studio worktree before handing off brand assets. It validates canonical Timeline/Signal SVG filenames, labels, and visible text, and reminds the operator about the pending PNG export.
