import { randomBytes } from "node:crypto";
/** Exact fair crypto bits avoid floating inverse-CDF sampling/support errors. */
function geometricHalf(): number {
  let count = 0;
  while (true) {
    const byte = randomBytes(1)[0];
    for (let bit = 0; bit < 8; bit++) {
      if ((byte & (1 << bit)) === 0) return count;
      count++;
    }
  }
}
/** P(k)=2^-abs(k)/3. Fixed histogram substitution sensitivity2 => epsilon ln4.
 * This behavioral-vector guarantee is conditional on a fixed eligible cohort
 * and coverage; it is not a total-system membership/consent privacy claim.
 */
export function geometricNoise(): number { return geometricHalf() - geometricHalf(); }
export function privatizeHistogram(cells: ReadonlyMap<string, number>, noise: () => number = geometricNoise) {
  const result = new Map<string, number>();
  // Every cell, including zero cells, receives independent noise. No raw-data gates.
  for (let i = 0; i < 32; i++) {
    const key = i.toString(2).padStart(5, "0");
    result.set(key, (cells.get(key) ?? 0) + noise());
  }
  return result;
}
