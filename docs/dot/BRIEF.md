# Dot Studio — implementation contract

User request: recreate the supplied mascot film for Signal Studio's Dot, preserving a circular mascot throughout; build Dot Studio as the home of Dot's animations and facial expressions. After the extraction and detailed plan, the user directed: “Please now execute this at a world-class level.”

Mode: Experience for the public gallery, Operate for local authoring. Expand the existing Signal Studio world: Geist, indigo #4f46e5, calm paper, minimal borders, authored geometric motion. No separate product identity. The character leads; controls recede.

First viewport: the name, a direct film action, a large interactive circular Dot, and ten named static mood specimens beside a single moving stage. Mobile stacks the stage above a two-column mood library. Signature interaction: Dot notices the pointer, reacts to a poke, yields to a short drag, then settles through a damped release while retaining a perfect circle.

Accepted implementation direction: two eyes, no mouth; one native SVG body circle; no nonuniform scale or skew. Eyes articulate independently. Secondary circular beads and depth-sorted orbit threads replace reference triangle/egg/square morphs. Silent 30.75 s / 60 fps film. Ten mood loops, eight reactions, six short performances, deterministic seed, exact frame seeking, pause and reduced-motion stills. One evaluator drives browser and export.

Quality bar: all frames finite and contained; loop endpoints continuous; all mood transitions preserve the interrupted pose; pause and offscreen clocks stop; keyboard and touch controls work; no layout overflow at 390 and 1440 px. SVG/PNG exports preserve transparency, source film metadata and generated output manifests distinguish reference from recreation. No unsupported performance, aesthetic-approval, accessibility-certification or production-release claims.

Scope: `/design/dot`, `src/components/dot`, `src/lib/dot`, `scripts/dot`, plus a link from `/design`. Keep the prior character and its history intact. Local development exposes authoring tools; production builds expose the exhibit. Gallery is noindex until a release decision. No production deployment is part of this implementation.

Evidence lineage: original character introduced in commit 41696699 (Claude coauthored); source baseline 517cabb874e52c0152b9ea490de02bfa5683e7e2. Reference is 1458-square, 60 fps, 1845 frames, silent. Reference SHA256 94332b488f68ef32470aad6b5e4401c6fc432757343bc6c5f8eff2498d81fe65. Detailed analysis and source media stay in the user's local delivery packet and are not published into this public repository.

The execution approval adopts the plan's recommended direction. It does not constitute the user's final art-direction approval of the newly rendered work. A founder review remains a human judgment, not a test this implementation can self-certify.
