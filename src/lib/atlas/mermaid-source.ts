/** Decode the UTF-8 bytes emitted by the server's Base64 transport. */
export function decodeMermaidSource(encoded: string): string {
  const bytes = Uint8Array.from(atob(encoded), character => character.charCodeAt(0));
  // Invalid bytes should preserve the readable fallback, not silently replace
  // labels with U+FFFD and present a corrupted diagram as a successful render.
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}
