/**
 * Deterministic masking for Account surfaces.
 * Never put plaintext license codes into snapshots, exports, or UI.
 */
export function maskLicenseCode(code: string): string {
  const normalized = code.trim().toUpperCase();
  const alnum = normalized.replace(/[^A-Z0-9]/g, "");
  const prefix = (alnum.slice(0, 2) || "XX").padEnd(2, "X");
  const suffix = (alnum.slice(-2) || "00").padStart(2, "0");
  return `${prefix}-••••-${suffix}`;
}
