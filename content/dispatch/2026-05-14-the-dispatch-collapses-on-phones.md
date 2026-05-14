## 2026-05-14 · tightens · The dispatch collapses on phones

**The dispatch page now reads on a phone without 58,000 pixels of
narrative. Each entry shows date + verb + headline + bold-lead by
default; the body collapses behind a "Read full →" button. Desktop
is unchanged — every entry stays fully expanded.**

The bold-lead in the dispatch shape (BRAND.md §6.5) is already the
TL;DR — a leading sentence that names the impact. Hiding the body
behind it on mobile preserves the existing information architecture
rather than inventing a new one. Skim works. Decision-to-read-more is
one tap.

The collapse is mobile-only. `<sm:` hides the body and shows the
button; `sm:!block` keeps the body visible on desktop and hides the
button. State is local to each entry — opening one doesn't affect the
others. No URL hash, no transition animation past 200ms opacity.

Implementation lives in a small client island at
`src/components/dispatch/entry-block.tsx`. The server still parses
`content/dispatch/*.md`, renders the inline markdown (bold/italic/code),
and passes the resulting `ReactNode` arrays into the client component
as props. The client only owns the `expanded` boolean, so the page
stays mostly static and the body markup is in the initial HTML for
screen readers and search engines.

A separate small fix: `next.config.ts` `outputFileTracingIncludes`
now points at `./content/dispatch/*.md` instead of the stale
`./CHANGELOG.md` reference left over from when /dispatch read the
root changelog directly.
