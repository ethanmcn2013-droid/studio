# January layout composition — first failed attempt

Frozen runtime: `e47507c8191a84fa3b508fd520d05c40e6efadaf`; capture setup: `4385481542d33abd75d53aca9f7ebb7b7f86f67a`. Runtime digest `2713468ad563646a469399967fe57a671ae50166d4f72ec70498f6bacffde2d4`; build `ei7Gvfak3jqnRMzteQ4ae`.

The normal production build passed. The normal January capture exited **1** after 112 passing cases when the next fixture process printed its synthetic populated result but exited with native Windows status `3221225477` (`0xC0000005`). The owning runner correctly rejected that nonzero status. Native-crash attribution is unverified. The normal attestation also exited **1**, retaining every missing required case as a gap. Do not treat this archive as a complete 188-case run.

Commands: `node scripts/experience/january/serve.mjs build`, `node scripts/experience/january/serve.mjs start`, `node scripts/experience/january/capture.mjs`, `node scripts/experience/january/attest.mjs` (no `--write`). Node 24.19.0, pinned offline dependencies, disposable synthetic file databases, port 4493. Verified-owned server PID 9724 was stopped after failure. The capture script, matrix, assertions and fixture were not changed.

This first build, capture manifest, screenshots, coverage failure and command receipts are preserved. A subsequent full attempt uses a different output directory; no cases are copied forward or marked observed without rerendering. No registry adoption, human/council approval, provider proof, Atlas action or Email Lab observation is claimed.
