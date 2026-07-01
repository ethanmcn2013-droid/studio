#!/usr/bin/env node
// responsive-audit.mjs
//
// Suite-wide iPhone-width responsive audit. Drives Playwright through
// each product surface at every iPhone width and writes one screenshot
// per (product, width, surface, mode) to a run directory.
//
// Operator runs this — the script defaults to public-only routes so it
// can run without any Clerk session. With per-product session cookies
// in env, it also captures the authed /app surfaces.
//
// Usage:
//   node scripts/responsive-audit.mjs                # public-only on prod (no session needed)
//   node scripts/responsive-audit.mjs --profile=local  # localhost dev servers
//   node scripts/responsive-audit.mjs --public-only    # explicit; same as default
//   node scripts/responsive-audit.mjs --authed         # require + use per-product session cookies
//   node scripts/responsive-audit.mjs --pwa            # extra pass in standalone (installed-PWA) context
//
// Authed mode reads per-product session cookies from env:
//   CLERK_SESSION_TASKS, CLERK_SESSION_ROADMAP, CLERK_SESSION_ANALYTICS,
//   CLERK_SESSION_NOTES. Each Clerk instance issues its own __session
//   token; one value does NOT cross-validate. Set whichever products
//   you have a session for — products without a session are skipped
//   from the authed pass.
//
// Outputs to: ~/Projects/personal/studio/.responsive-audit/<run-id>/<product>-<surface>-<width>[-pwa].png
// .responsive-audit/ is gitignored. Run-id is the ISO timestamp.
//
// Requires Playwright installed in the studio repo:
//   pnpm add -D playwright @playwright/test
//   pnpm exec playwright install chromium
//
// If Playwright isn't installed the script exits with an actionable hint.

import { mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const HOME = homedir();
const REPO = join(HOME, "Projects", "personal", "studio");

const WIDTHS = [320, 375, 390, 393, 414, 430];

const PRODUCTS_PROD = {
  studio:    "https://signalstudio.ie",
  tasks:     "https://tasks.signalstudio.ie",
  roadmap:   "https://timeline.signalstudio.ie",
  analytics: "https://signal.signalstudio.ie",
  notes:     "https://notes.signalstudio.ie",
};

const PRODUCTS_LOCAL = {
  studio:    "http://localhost:3000",
  tasks:     "http://localhost:3001",
  roadmap:   "http://localhost:3002",
  analytics: "http://localhost:3003",
  notes:     "http://localhost:3004",
};

const PUBLIC_SURFACES = {
  studio:    ["/", "/pricing", "/brand", "/the-wedding"],
  tasks:     ["/", "/pricing", "/sign-in"],
  roadmap:   ["/", "/the-wedding", "/sign-in"],
  analytics: ["/", "/pricing", "/sign-in"],
  notes:     ["/", "/sign-in"],
};

const AUTHED_SURFACES = {
  tasks:     ["/app/board", "/app/list", "/app/timeline", "/settings/profile"],
  roadmap:   ["/app", "/app/account"],
  analytics: ["/app", "/app/brief", "/app/settings/notifications", "/app/settings/account"],
  notes:     ["/app", "/app/account"],
};

const ENV_KEY_FOR_PRODUCT = {
  tasks:     "CLERK_SESSION_TASKS",
  roadmap:   "CLERK_SESSION_ROADMAP",
  analytics: "CLERK_SESSION_ANALYTICS",
  notes:     "CLERK_SESSION_NOTES",
};

function arg(name, fallback) {
  const a = process.argv.find((x) => x.startsWith(`--${name}=`));
  return a ? a.split("=")[1] : fallback;
}
function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

async function main() {
  const profile = arg("profile", "prod");
  const authed = hasFlag("authed");
  // `--public-only` is accepted but is also the default — the flag exists
  // so operators can type it explicitly without surprise no-ops. Intentional
  // discard of the return value; no code path branches on it.
  const _publicOnlyExplicit = hasFlag("public-only"); void _publicOnlyExplicit;
  const pwa = hasFlag("pwa");
  const products =
    profile === "local" ? PRODUCTS_LOCAL : PRODUCTS_PROD;

  let chromium, devices;
  try {
    ({ chromium, devices } = await import("playwright"));
  } catch {
    console.error("Playwright is not installed in studio.");
    console.error("Run: pnpm add -D playwright @playwright/test && pnpm exec playwright install chromium");
    process.exit(2);
  }

  const runId = new Date()
    .toISOString()
    .replaceAll(":", "-")
    .replaceAll(".", "-");
  const outRoot = join(REPO, ".responsive-audit", runId);
  await mkdir(outRoot, { recursive: true });

  // Resolve per-product session cookies (authed mode only).
  const sessionByProduct = {};
  if (authed) {
    let anyResolved = false;
    for (const [product, envKey] of Object.entries(ENV_KEY_FOR_PRODUCT)) {
      const val = process.env[envKey];
      if (val) {
        sessionByProduct[product] = val;
        anyResolved = true;
      }
    }
    if (!anyResolved) {
      console.error(
        "--authed requires at least one of CLERK_SESSION_TASKS, CLERK_SESSION_ROADMAP, CLERK_SESSION_ANALYTICS, CLERK_SESSION_NOTES",
      );
      process.exit(2);
    }
    console.log(
      `Authed sessions resolved for: ${Object.keys(sessionByProduct).join(", ") || "(none)"}`,
    );
  }

  console.log(`Run: ${runId}`);
  console.log(`Output: ${outRoot}`);
  console.log(`Profile: ${profile}`);
  console.log(`Authed: ${authed ? "yes" : "no (public surfaces only)"}`);
  console.log(`PWA standalone pass: ${pwa ? "yes" : "no"}`);

  const browser = await chromium.launch();

  // Build the list of contexts to run.
  // - "browser" — default Safari-style. Always present.
  // - "pwa"     — standalone-PWA pass when --pwa is set; emulates the
  //               installed-app chrome (`display-mode: standalone`).
  const contextPlans = [{ tag: "browser", standalone: false }];
  if (pwa) contextPlans.push({ tag: "pwa", standalone: true });

  let captured = 0;
  for (const plan of contextPlans) {
    for (const [product, base] of Object.entries(products)) {
      // Fresh context per product. This gives genuine multi-Clerk-instance
      // isolation: each product runs in a clean cookie jar with at most
      // one `__session` value, scoped to that product's host. The
      // alternative (one shared context with four cookies, domain-filtered
      // at send time) works in Playwright today but is a weaker
      // guarantee — and would silently fail if Clerk ever read a
      // mis-scoped cookie. A fresh context per product makes the
      // isolation invariant a code-level fact, not a network-layer
      // accident.
      const context = await browser.newContext({
        ...devices["iPhone 15 Pro"],
      });
      if (plan.standalone) {
        await context.addInitScript(() => {
          Object.defineProperty(window.navigator, "standalone", {
            configurable: true,
            get: () => true,
          });
        });
      }

      if (authed && sessionByProduct[product]) {
        const { hostname } = new URL(base);
        await context.addCookies([
          {
            name: "__session",
            value: sessionByProduct[product],
            domain: hostname,
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "Lax",
          },
        ]);
      }

      const surfaces = [
        ...(PUBLIC_SURFACES[product] ?? []),
        ...(authed && sessionByProduct[product]
          ? AUTHED_SURFACES[product] ?? []
          : []),
      ];

      for (const surface of surfaces) {
        for (const width of WIDTHS) {
          const page = await context.newPage();
          // Note on `--pwa` coverage: we override `navigator.standalone`
          // (caught by JS-feature-gated code paths) but Playwright does
          // not expose a `display-mode: standalone` media-query override.
          // CSS rules gated on `@media (display-mode: standalone)` are
          // NOT exercised by this pass — they need a real installed PWA
          // or a future Chromium override. The doc names this gap.

          await page.setViewportSize({
            width,
            height: Math.round(width * 2.16),
          });
          const url = `${base}${surface}`;
          try {
            await page.goto(url, {
              waitUntil: "networkidle",
              timeout: 25_000,
            });
            // Sanity: did we land where we intended?  If we redirected to
            // /sign-in we should know — the screenshot is otherwise a
            // silent wrong-page capture.
            const finalUrl = page.url();
            const expectedHost = new URL(url).host;
            const actualHost = new URL(finalUrl).host;
            const redirected = actualHost !== expectedHost
              || (surface !== "/sign-in" && finalUrl.includes("/sign-in"));
            const safeSurface = surface.replaceAll("/", "_") || "_root";
            const tag = plan.tag === "pwa" ? "-pwa" : "";
            const file = redirected
              ? `${product}-${safeSurface}-${width}${tag}-REDIRECT.png`
              : `${product}-${safeSurface}-${width}${tag}.png`;
            await page.screenshot({
              path: join(outRoot, file),
              fullPage: true,
            });
            captured += 1;
            process.stdout.write(redirected ? "R" : ".");
          } catch (err) {
            console.error(
              `\n[error] ${product}${surface} @ ${width}px (${plan.tag}) → ${String(err).split("\n")[0]}`,
            );
          } finally {
            await page.close();
          }
        }
      }

      await context.close();
    }
  }

  console.log(`\n\nCaptured: ${captured} screenshots`);
  console.log("Legend: '.' captured · 'R' captured but page redirected (wrong landing)");
  console.log(`Open: open ${outRoot}`);
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
