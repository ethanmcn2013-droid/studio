/**
 * Test-only resolver hook for the bare `server-only` specifier.
 *
 * `server-only` is not an installed package here — Next aliases it inside the
 * bundler — so a plain Node test that imports a server module dies on the
 * import line. Without this hook the only way to test `entitlements-db`
 * writers is to reimplement their SQL in the test, and a test that exercises a
 * copy of the code proves nothing about the code.
 *
 * The hook resolves the specifier to an empty module and touches nothing else.
 * It is never loaded by the app.
 *
 * Registered by `src/test/register-server-only.mjs`.
 */
export async function resolve(specifier, context, nextResolve) {
  if (specifier === "server-only" || specifier === "client-only") {
    return {
      shortCircuit: true,
      url: "data:text/javascript,export {}",
    };
  }
  return nextResolve(specifier, context);
}
