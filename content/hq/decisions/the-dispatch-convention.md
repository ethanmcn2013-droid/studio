---
id: the-dispatch-convention
title: The suite changelog is renamed "the dispatch" with a five-verb taxonomy (ships / tightens / cuts / holds / reads) replacing Added/Changed/Fixed/Removed.
category: Brand
date: 2026-05-14
status: Active
reviewDate: 2026-07-14
relatedObjects: [BRAND.md §6.5, studio/CHANGELOG.md, tasks/CHANGELOG.md, roadmap/CHANGELOG.md, analytics/CHANGELOG.md, notes/CHANGELOG.md]
---

## Decision

The suite-wide changelog convention is rewritten as "the dispatch." The reading surface becomes `signalstudio.ie/dispatch` (per-product `/changelog` and `/dispatch` routes 308-redirect to it). File paths stay `CHANGELOG.md` for tooling and muscle memory; the document inside calls itself the dispatch. Entry shape is locked to a single header line — `## YYYY-MM-DD · X·NN · verb · headline` — followed by a bold impact-lead sentence and then prose. The five verbs replace Keep-a-Changelog's Added/Changed/Fixed/Removed: **ships · tightens · cuts · holds · reads.** No retroactive rewrite of past entries; the new shape begins at the next cycle.

## Reason

Five-agent deliberation (creative-director, ux-director, tech-writer carrying the marketing-director angle, strategy, pm) converged through different doors on the same diagnosis: the existing changelog *prose* was already doing brand work (narrative voice, named bugs as headlines, refusal posture), but the *structure* around it was generic. Every entry across the five repos looked like every other indie SaaS changelog. The fix sits in the structure, not the prose.

The `holds` category is the Signal-specific bet — a first-class entry type for refusals. Every other product changelog buries refusals inside a "Changed" entry or never writes them at all. The brand brags about refusals on `/about` and `/method`; the dispatch brags about them in the same register.

## Alternatives considered

(1) **Do nothing.** Strategy's pushback: the prose is already the signature, scaffolding flattens voice. Cost: zero. Risk: leaves a brand-fingerprint opportunity unclaimed when a venue operator lands on the page during a pilot conversation.

(2) **Heavier structure (cd's first pass).** Mono sigil prefix `▍ X·NN`, hairline rules between entries, ink-faint dates at 40% opacity, audience-impact pills (`you'll notice this` / `operator` / `under the hood`). Rejected — the `▍` adds unicode debt in raw markdown and the audience-impact taxonomy decays the moment a solo author stops maintaining it.

(3) **Cut more (pm's pass).** 4-field minimum (Date / Title / bold impact lead / Body), no cycle codes in headers at all, no verb tags. Considered — but loses the `holds` category, which is the single highest-leverage move and the actual Signal fingerprint.

The committed shape is (2) and (3) integrated: keep the cycle code and one verb tag, drop the unicode sigil and the audience pills, require the bold impact lead.

## Risks

Adding a verb tag and a bold lead could flatten the prose voice that already does the brand work (strategy's dissent, preserved). Mitigation: the verb is one lowercase word at the end of a header line, invisible unless scanned for; the prose body is untouched.

If after two cycles the verb tagging feels like overhead, the fallback floor is: drop the verb, keep the name ("the dispatch"), the headline grammar rule, and the `holds` concept. That's the irreducible win.

The `holds` category goes stale if used too liberally — once per sprint, not every entry.

## Notes

`signalstudio.ie/dispatch` route to be built as a half-day slot after the next cycle ships. Not before venue calls. Per-product CHANGELOG.md files keep their current path for engineering source-of-truth; the public read-surface pulls the strongest ~30% of entries and lets the rest stay private. Silence is also brand.

Convention rewrite documented inline at BRAND.md §6.5 (supersedes the 2026-05-12 Changelog convention).
