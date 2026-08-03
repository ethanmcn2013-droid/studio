import { createRequire, register } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

/**
 * Test-only. Makes the bare `server-only` / `client-only` specifiers resolvable
 * so a plain Node test can import a real server module.
 *
 * Neither package is installed here — Next aliases them inside the bundler — so
 * without this, testing `entitlements-db` writers would mean reimplementing
 * their SQL in the test, and a test that exercises a copy of the code proves
 * nothing about the code.
 *
 * Both module systems need covering: the ESM hook handles `import`, and the
 * CJS `_resolveFilename` patch handles the `require` that tsx emits when it
 * transpiles TypeScript in a CommonJS package.
 *
 *   npx tsx --import ./src/test/register-server-only.mjs --test <file>
 */
register("./server-only-hook.mjs", pathToFileURL(import.meta.filename));

const STUBBED = new Set(["server-only", "client-only"]);
const stub = path.join(import.meta.dirname, "empty-module.cjs");

const require = createRequire(import.meta.url);
const Module = require("node:module");
const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function patched(request, ...rest) {
  if (STUBBED.has(request)) return stub;
  return resolveFilename.call(this, request, ...rest);
};
