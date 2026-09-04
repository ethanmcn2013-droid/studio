import { MAX_ISSUANCE_BODY_BYTES, VENUE_ISSUANCE_PATH, parseReadback, VenueIssuanceError,
  type IssuanceCommand, type IssuanceManifest, type IssuanceReadback } from "./protocol";
import { signIssuanceRequest, type IssuanceAuth } from "./service-auth";
export type VenueRuntime = (command: IssuanceCommand, manifest: IssuanceManifest) => Promise<IssuanceReadback>;
async function boundedResponse(response: Response): Promise<unknown> {
  if (response.headers.get("content-type")?.split(";")[0] !== "application/json" || !response.body) throw new VenueIssuanceError("unavailable");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = []; let length = 0;
  while (true) {
    const next = await reader.read(); if (next.done) break;
    length += next.value.byteLength;
    if (length > MAX_ISSUANCE_BODY_BYTES) { await reader.cancel(); throw new VenueIssuanceError("unavailable"); }
    chunks.push(next.value);
  }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks)));
}
export function createVenueRuntime(input: {
  origin: string; auth: IssuanceAuth; allowLocalTest?: boolean; fetcher?: typeof fetch; now?: () => number;
}): VenueRuntime {
  const url = new URL(input.origin);
  const local = input.allowLocalTest && url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if ((!local && url.protocol !== "https:") || url.username || url.password || url.search || url.hash || url.pathname !== "/") throw new Error("Use the exact configured App origin.");
  return async (command, manifest) => {
    const body = JSON.stringify(command);
    try {
      const response = await (input.fetcher ?? fetch)(new URL(VENUE_ISSUANCE_PATH, url), {
        method: "POST", body, headers: signIssuanceRequest(body, input.auth, input.now?.() ?? Date.now()),
        cache: "no-store", redirect: "error", signal: AbortSignal.timeout(10_000),
      });
      const payload = await boundedResponse(response);
      if (response.status !== 200) {
        const error = payload as { error?: unknown } | null;
        if (response.status === 409 && error?.error === "already_claimed") throw new VenueIssuanceError("already_claimed");
        if (response.status === 409) throw new VenueIssuanceError("conflict");
        throw new VenueIssuanceError("unavailable");
      }
      return parseReadback(payload, manifest);
    } catch (error) {
      if (error instanceof VenueIssuanceError) throw error;
      throw new VenueIssuanceError("unavailable");
    }
  };
}
