import type { NextConfig } from "next";

/**
 * ── Security headers (Plan 4.1) ────────────────────────────────────
 * Suite-wide security baseline. Two policy sets:
 *   1. Standard headers (HSTS, X-Content-Type-Options, etc.) shipped
 *      in enforce mode — these don't break anything.
 *   2. Content-Security-Policy shipped in Report-Only mode — logs
 *      violations to console without enforcing. Promote to enforce
 *      mode (`Content-Security-Policy` instead of -Report-Only) once
 *      we've verified no real flows trigger violations.
 *
 * Most restrictive of the four — Studio is the umbrella marketing
 * site with no auth, no payments, no errors-to-Sentry. Only Vercel
 * Analytics adds a third-party host.
 */

const isDev = process.env.NODE_ENV === "development";

// CSP allowlists mirrored from notes/next.config.ts (suite-locked enforce model). Report-Only until cross-suite verification — see audit/ISSUES.md suite-01.
// Clerk's prod Frontend API is a CNAME under our own domain, so the
// wildcard `https://*.signalstudio.ie` covers whatever label Clerk
// uses without a deploy-time guess. Dev instances live on
// *.clerk.accounts.dev; Clerk infra/telemetry on *.clerk.com +
// clerk-telemetry.com; Turnstile bot-protection on Cloudflare.
const clerkHosts =
  "https://*.signalstudio.ie https://*.clerk.accounts.dev https://*.clerk.com https://clerk-telemetry.com";
const turnstile = "https://challenges.cloudflare.com";
// No Google Analytics hosts here. GA4 was removed on 2026-08-12 under
// decision D2, and the CSP allowlist went with it: an allowlist that
// outlives its script is a re-entry point, not documentation. See
// docs/ANALYTICS.md for the decision and what measurement remains.

const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com ${clerkHosts} ${turnstile}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https:`,
  `font-src 'self' data:`,
  `connect-src 'self' https://va.vercel-scripts.com ${clerkHosts}`,
  `frame-src 'self' ${turnstile}`,
  `worker-src 'self' blob:`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `object-src 'none'`,
  // CSP violation reporting — collected at /api/csp-report so we can verify
  // the policy is clean before promoting Report-Only → enforce.
  `report-uri /api/csp-report`,
  `report-to csp`,
  // upgrade-insecure-requests removed — the directive is ignored in
  // report-only policies and was spamming the console on every page.
  // Add it back when CSP is promoted to enforce mode.
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy-Report-Only", value: csp },
  { key: "Reporting-Endpoints", value: 'csp="/api/csp-report"' },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // The brand page retired 2026-07-06 and the design page left the
        // public estate 2026-09-08 (archived behind the design-lab gate).
        // Both land on /principles, the public statement of the system.
        // Exact-path match only — /brand/* static assets (kit, collateral,
        // loader.html) keep serving from public/brand/.
        source: "/brand",
        destination: "/principles",
        permanent: true,
      },
      {
        // Archived, not deleted: the page lives at /__design-lab/design for
        // previews. Temporary so the decision stays easy to reverse.
        source: "/design",
        destination: "/principles",
        permanent: false,
      },
      {
        // Signal Review is a private founder-operator instrument. Retire the
        // legacy public review hub into the password-gated HQ quality room.
        // Keep this temporary so the decision remains easy to reverse.
        source: "/review",
        destination: "/hq/experience-quality",
        permanent: false,
      },
      // ── Retired product domains (2026-07-22) ──────────────────────────
      // notes/timeline/signal.signalstudio.ie point at THIS project after
      // their own Vercel deployments were deleted. Host-scoped so they are
      // inert for signalstudio.ie itself. Per host: /app/* deep links go to
      // the matching module in the unified app; retired marketing paths go
      // to the matching canonical product page on the umbrella.
      {
        source: "/app/:path*",
        has: [{ type: "host", value: "notes.signalstudio.ie" }],
        destination: "https://app.signalstudio.ie/app/notes",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "notes.signalstudio.ie" }],
        destination: "https://signalstudio.ie",
        permanent: true,
      },
      {
        source: "/app/:path*",
        has: [{ type: "host", value: "timeline.signalstudio.ie" }],
        destination: "https://app.signalstudio.ie/app/timeline",
        permanent: true,
      },
      {
        // /s/* and /the-wedding are preserved by beforeFiles rewrites below.
        // _next assets must follow those proxied artifacts to the app build.
        source:
          "/:path((?!s(?:/|$)|the-wedding(?:/|$)|_next(?:/|$)).*)",
        has: [{ type: "host", value: "timeline.signalstudio.ie" }],
        destination: "https://signalstudio.ie",
        permanent: true,
      },
      {
        source: "/app/:path*",
        has: [{ type: "host", value: "signal.signalstudio.ie" }],
        destination: "https://app.signalstudio.ie/app/signal",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "signal.signalstudio.ie" }],
        destination: "https://signalstudio.ie",
        permanent: true,
      },
      // Legacy pre-rename domains (roadmap→timeline, analytics→signal). Same
      // treatment so old bookmarks keep resolving after their projects are gone.
      {
        source: "/app/:path*",
        has: [{ type: "host", value: "roadmap.signalstudio.ie" }],
        destination: "https://app.signalstudio.ie/app/timeline",
        permanent: true,
      },
      {
        source:
          "/:path((?!s(?:/|$)|the-wedding(?:/|$)|_next(?:/|$)).*)",
        has: [{ type: "host", value: "roadmap.signalstudio.ie" }],
        destination: "https://signalstudio.ie",
        permanent: true,
      },
      {
        source: "/app/:path*",
        has: [{ type: "host", value: "analytics.signalstudio.ie" }],
        destination: "https://app.signalstudio.ie/app/signal",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "analytics.signalstudio.ie" }],
        destination: "https://signalstudio.ie",
        permanent: true,
      },
      // ── Estate consolidation (2026-08-12) ─────────────────────────────
      // The public estate collapses to one domain and eighteen indexed
      // pages. These rules MUST stay below the retired-domain block above:
      // redirects are first-match-wins, so an unscoped rule placed earlier
      // would catch notes/timeline/signal hosts and chain through them.
      // Every source below is an exact path.
      //
      // ── the 2026-09-11 estate cut ──────────────────────────────────
      // Twelve route directories moved to archive/marketing-pages/ so the
      // public estate is the eight pages in sitemap.ts and nothing else.
      // Two kinds of rule come out of that, and the status code is the
      // difference that matters:
      //
      //   307 — the page is coming back. A 308 tells a crawler the URL is
      //         permanently gone, and re-launching at the same path after
      //         that is an uphill fight. Everything held back for launch
      //         is temporary, deliberately.
      //   308 — the page is genuinely retired and the URL is not returning.
      { source: "/notes", destination: "/", permanent: false },
      { source: "/tasks", destination: "/", permanent: false },
      { source: "/timeline", destination: "/", permanent: false },
      { source: "/venues", destination: "/", permanent: false },
      { source: "/venues/:path*", destination: "/", permanent: false },
      { source: "/students", destination: "/", permanent: false },
      { source: "/dispatch", destination: "/", permanent: false },
      { source: "/dispatch/:path*", destination: "/", permanent: false },
      { source: "/changelog.rss", destination: "/", permanent: false },
      { source: "/features/:path*", destination: "/", permanent: false },
      { source: "/security", destination: "/", permanent: false },
      { source: "/accessibility", destination: "/", permanent: false },

      // These two were redirect stubs inside src/app rather than rules.
      // Their destinations are archived now, so they land at the root and
      // the machinery lives in one file instead of two.
      { source: "/changelog", destination: "/", permanent: false },
      { source: "/signal", destination: "/", permanent: false },

      // ── older retired paths ────────────────────────────────────────
      // Re-pointed in the same pass: each of these used to land on a page
      // that is now archived, and a redirect into a redirect is a dead
      // link with extra steps.
      { source: "/proof", destination: "/", permanent: true },
      { source: "/work", destination: "/about", permanent: true },
      { source: "/ios", destination: "/", permanent: true },
      { source: "/teachers", destination: "/", permanent: true },
      // D5. Contact is now an anchored section on /about, machinery intact.
      { source: "/contact", destination: "/about#contact", permanent: true },
      { source: "/weddings", destination: "/", permanent: true },
      { source: "/venues/demo", destination: "/", permanent: true },
      { source: "/templates", destination: "/", permanent: true },
      { source: "/students.html", destination: "/", permanent: true },
      { source: "/compare/:path*", destination: "/", permanent: true },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        // AD-009 compatibility: keep opaque Timeline bearer links and the
        // venue example on the stable branded host while the unified app
        // serves the actual artifact. Assets are proxied from the same build
        // so the browser never needs to learn the app deployment hostname.
        {
          source: "/s/:path*",
          has: [{ type: "host", value: "timeline.signalstudio.ie" }],
          destination: "https://app.signalstudio.ie/s/:path*",
        },
        {
          source: "/the-wedding",
          has: [{ type: "host", value: "timeline.signalstudio.ie" }],
          destination: "https://app.signalstudio.ie/the-wedding",
        },
        {
          source: "/the-wedding/:path*",
          has: [{ type: "host", value: "timeline.signalstudio.ie" }],
          destination: "https://app.signalstudio.ie/the-wedding/:path*",
        },
        {
          source: "/_next/:path*",
          has: [{ type: "host", value: "timeline.signalstudio.ie" }],
          destination: "https://app.signalstudio.ie/_next/:path*",
        },
        // Pre-rename Timeline host receives the same compatibility treatment.
        {
          source: "/s/:path*",
          has: [{ type: "host", value: "roadmap.signalstudio.ie" }],
          destination: "https://app.signalstudio.ie/s/:path*",
        },
        {
          source: "/the-wedding",
          has: [{ type: "host", value: "roadmap.signalstudio.ie" }],
          destination: "https://app.signalstudio.ie/the-wedding",
        },
        {
          source: "/the-wedding/:path*",
          has: [{ type: "host", value: "roadmap.signalstudio.ie" }],
          destination: "https://app.signalstudio.ie/the-wedding/:path*",
        },
        {
          source: "/_next/:path*",
          has: [{ type: "host", value: "roadmap.signalstudio.ie" }],
          destination: "https://app.signalstudio.ie/_next/:path*",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  experimental: {
    // Tree-shake heavy barrel imports — motion is used across reveal
    // hero, manifesto, products, closing; the full barrel ships ~5× what
    // we call. The other four products carry the same shape (Phase 6.2).
    optimizePackageImports: ["motion"],
  },
  // Bundle the per-entry dispatch files into the /dispatch + RSS server
  // functions. Without this, readDispatchEntries() in src/lib/changelog.ts
  // hits ENOENT on Vercel (content/dispatch/*.md sits outside the
  // .next/standalone tracing window) and Next falls through to 404.
  outputFileTracingIncludes: {
    "/dispatch": ["./content/dispatch/*.md"],
    "/changelog.rss": ["./content/dispatch/*.md"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // The /brand page iframes loader.html same-origin. Site-wide
        // X-Frame-Options: DENY blocks that and renders a broken-doc icon
        // in the phone frame. Allow same-origin framing for this asset only.
        source: "/brand/loader.html",
        headers: securityHeaders.map((h) =>
          h.key === "X-Frame-Options" ? { ...h, value: "SAMEORIGIN" } : h,
        ),
      },
      {
        source: "/brand/business-loan-pack-2026.html",
        headers: securityHeaders.map((h) =>
          h.key === "X-Frame-Options" ? { ...h, value: "SAMEORIGIN" } : h,
        ),
      },
      {
        source: "/brand/pitch-deck-2026.html",
        headers: securityHeaders.map((h) =>
          h.key === "X-Frame-Options" ? { ...h, value: "SAMEORIGIN" } : h,
        ),
      },
      {
        // The Email Lab (/hq/email-lab) previews rendered emails in
        // same-origin iframes. The route sits behind the HQ cookie and
        // serves static email HTML with no scripts.
        source: "/hq/email-lab/render",
        headers: securityHeaders.map((h) =>
          h.key === "X-Frame-Options" ? { ...h, value: "SAMEORIGIN" } : h,
        ),
      },
    ];
  },
};

export default nextConfig;
