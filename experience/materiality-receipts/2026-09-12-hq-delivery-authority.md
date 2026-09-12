# HQ delivery authority · registry receipt

The HQ delivery-authority change refreshed two registered Studio sources with
the deterministic materiality hashes reported by `experience:discover`:

- `studio.page.hq`: `67d4aa07aae68ca5` → `e015c6df3fc582c5`
- `studio.page.hq-action-center`: `cf235b45a29c3fc4` → `e64f1bf4ddbae875`

The authenticated capture harness ran each route from a temporary local
protected plan at mobile, tablet, desktop and wide breakpoints against a local
review server. All eight captures returned HTTP 200 with zero blocking Axe
findings, zero horizontal overflow, zero console errors and zero page errors.
The capture review also corrected the HQ shell's faint-text token so it meets
AA contrast on the shell's muted background.

The protected routes are deliberately absent from the shared capture plan
because its artifacts may be published by the public repository workflow. The
protected screenshots and manifest remain local and outside Git. This receipt
contains no operator records or customer data.

## What this receipt does not claim

The registry and override coverage values are `partial`. The captures have no
approved visual baselines, so this receipt records review evidence without
claiming design approval, baseline approval, production deployment or complete
automated coverage.
