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
// Google Analytics 4 (gtag.js) — see src/components/analytics/google-tag.tsx.
const googleTag = "https://www.googletagmanager.com";
const googleAnalytics =
  "https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com";

const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com ${clerkHosts} ${turnstile} ${googleTag}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https:`,
  `font-src 'self' data:`,
  `connect-src 'self' https://va.vercel-scripts.com ${clerkHosts} ${googleTag} ${googleAnalytics}`,
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
        // /students is now a first-class route on the suite design system.
        // Forward the old static file path for any links that point at it.
        source: "/students.html",
        destination: "/students",
        permanent: true,
      },
      {
        // The brand page retired 2026-07-06; /design carries the system now.
        // Exact-path match only — /brand/* static assets (kit, collateral,
        // loader.html) keep serving from public/brand/.
        source: "/brand",
        destination: "/design",
        permanent: true,
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
      // the matching module in the unified app; everything else (marketing,
      // sign-in, api) folds into the umbrella home. The /app rule precedes
      // the catch-all so it wins for /app paths.
      {
        source: "/app/:path*",
        has: [{ type: "host", value: "notes.signalstudio.ie" }],
        destination: "https://app.signalstudio.ie/app/notes",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "notes.signalstudio.ie" }],
        destination: "https://signalstudio.ie/",
        permanent: true,
      },
      {
        source: "/app/:path*",
        has: [{ type: "host", value: "timeline.signalstudio.ie" }],
        destination: "https://app.signalstudio.ie/app/plan",
        permanent: true,
      },
      {
        // /s is handled in proxy.ts so the temporary bearer-link redirect can
        // carry privacy headers. All other retired paths still fold home.
        source: "/:path((?!s(?:/|$)).*)",
        has: [{ type: "host", value: "timeline.signalstudio.ie" }],
        destination: "https://signalstudio.ie/",
        permanent: true,
      },
      {
        source: "/app/:path*",
        has: [{ type: "host", value: "signal.signalstudio.ie" }],
        destination: "https://app.signalstudio.ie/app/brief",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "signal.signalstudio.ie" }],
        destination: "https://signalstudio.ie/",
        permanent: true,
      },
      // Legacy pre-rename domains (roadmap→timeline, analytics→signal). Same
      // treatment so old bookmarks keep resolving after their projects are gone.
      {
        source: "/app/:path*",
        has: [{ type: "host", value: "roadmap.signalstudio.ie" }],
        destination: "https://app.signalstudio.ie/app/plan",
        permanent: true,
      },
      {
        // Keep legacy roadmap share links on the same private handoff.
        source: "/:path((?!s(?:/|$)).*)",
        has: [{ type: "host", value: "roadmap.signalstudio.ie" }],
        destination: "https://signalstudio.ie/",
        permanent: true,
      },
      {
        source: "/app/:path*",
        has: [{ type: "host", value: "analytics.signalstudio.ie" }],
        destination: "https://app.signalstudio.ie/app/brief",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "analytics.signalstudio.ie" }],
        destination: "https://signalstudio.ie/",
        permanent: true,
      },
    ];
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
