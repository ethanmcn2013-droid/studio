# evidence/

Small evidence and evidence indexes. This is a pointer store, not an archive.

## What belongs here

- Short evidence notes and indexes that point at the real artifact.
- Test output and check receipts (trimmed to what proves the point).
- Change requests, in `change-requests/CR-NNN.md`.
- Founder-review packets worth keeping.
- Small screenshots where a screenshot is the proof.

## What does not belong here

- Large videos or film renders. Point at the path in `signal-motion/out/`.
- Private contracts, signed agreements or unredacted legal or financial records.
- Credentials, tokens or secrets. Ever.
- Private couple data.
- Venue contact records. Signal HQ and the CRM own those; reference the account
  ID.
- Anything binary that git will carry forever for no benefit.

## Evidence can point at

Repository paths · screenshots · test output · reports · approved copy · design
artifacts · film renders · external-review receipts.

## Recording evidence

```bash
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs evidence E01.01 docs/execution/venue-edition-and-films/evidence/E01.01-brief.md "The published brief"
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs evidence E08.11 "pnpm test — 74/74 pass, run 2026-08-14" "Full suite green"
```

The reference can be a path, a URL or a plain note. What matters is that a later
session can find the thing and check it.

## The standard

Evidence must let someone else verify the claim without asking you. "Done" with
evidence that only says "done" is not evidence. No privacy, security, contract
or accounting task is complete without the specific evidence its acceptance
criteria name, and a draft or internal review is never recorded as legal
approval.
