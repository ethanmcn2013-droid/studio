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

const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https:`,
  `font-src 'self' data:`,
  `connect-src 'self' https://va.vercel-scripts.com`,
  `frame-src 'self'`,
  `worker-src 'self' blob:`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `object-src 'none'`,
  // upgrade-insecure-requests removed — the directive is ignored in
  // report-only policies and was spamming the console on every page.
  // Add it back when CSP is promoted to enforce mode.
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy-Report-Only", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  // Bundle CHANGELOG.md into the /dispatch server function. Without this,
  // readDispatchEntries() in src/lib/changelog.ts hits ENOENT on Vercel
  // (the file lives at repo root, outside the .next/standalone tracing
  // window) and Next falls through to the 404 page.
  outputFileTracingIncludes: {
    "/dispatch": ["./CHANGELOG.md"],
    "/changelog.rss": ["./CHANGELOG.md"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
