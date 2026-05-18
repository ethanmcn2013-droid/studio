// Next.js 16 resolves edge middleware from src/middleware.ts. The actual
// logic (HQ password gate + M→suite-launcher redirect) lives in ./proxy;
// this file only registers it so the middleware-manifest is non-empty.
// Without this, proxy.ts is dead code and HQ edge enforcement never runs.
export { proxy as middleware, config } from "./proxy";
