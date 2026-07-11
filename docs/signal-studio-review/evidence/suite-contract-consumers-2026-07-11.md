# Shared suite contract consumers — 2026-07-11

The canonical versioned contract is maintained at
`studio/contracts/suite-contracts.v1.json`. Analytics, Tasks, Timeline, and
Notes now carry the generated fixture and consume its canonical product URLs;
Studio remains the source TypeScript registry and validator.

Receipt:

```text
corepack pnpm contracts:check
suite-contract-consumers: ok (4 products)
```

The checker compares every product fixture byte-for-byte with the Studio
source, preventing silent contract drift. Implementation commits:
Analytics `5fbbe53`, Tasks `7300862`, Timeline `f681883`, Notes `5f8bc7e`.

Preview and production journey receipts remain open.
