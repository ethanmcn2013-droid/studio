// eslint.config.js — flat config for Next.js 16 + TypeScript
const nextConfig = require("eslint-config-next");

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  // archive/ holds marketing pages pulled from the route tree ahead of
  // launch (see archive/marketing-pages/README.md). They are not built,
  // not typechecked, and not linted until they are moved back.
  { ignores: ["archive/**"] },
  ...nextConfig,
];
