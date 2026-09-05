import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { sourceDigest } from './january/receipt.mjs';

const ledger = 'docs/signal-studio-review/remediation-program.yaml';
const textInputs = new Set([ledger, 'public/brand/collateral/social/alt-text.txt', 'public/brand/collateral/social/index.html']);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

export function matchRecordedBuildInputs(source, files, expected) {
  assert.match(expected, /^[a-f0-9]{64}$/, 'Missing recorded build-input digest');
  const digest = hashes => hash(source + '\n' + files.map((file, index) => `${file.path}:${hashes[index]}`).join('\n'));
  const originalHashes = files.map(file => hash(file.bytes));
  if (digest(originalHashes) === expected) return expected;
  assert.ok(files.some(file => file.path === ledger), 'Missing supplemental ledger input');
  // Exactly three known text inputs can be reconstructed. Preserve all binary
  // hashes and every other character: no JSON/HTML reserialization, trimming,
  // string-value edits or normalization of arbitrary new text files. At most
  // 27 complete byte-digest combinations exist; only an exact match to the
  // original observed build digest is accepted.
  let combinations = [originalHashes];
  for (const [index, file] of files.entries()) {
    if (!textInputs.has(file.path)) continue;
    const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(file.bytes);
    if (file.path === ledger) JSON.parse(text);
    const lf = text.replace(/\r\n/g, '\n');
    const variants = [...new Set([originalHashes[index], hash(Buffer.from(lf)), hash(Buffer.from(lf.replaceAll('\n', '\r\n')))])];
    combinations = combinations.flatMap(previous => variants.map(value => previous.map((old, at) => at === index ? value : old)));
  }
  if (combinations.some(candidate => digest(candidate) === expected)) return expected;
  throw new Error('Build inputs changed beyond the three recorded text newline encodings');
}

export function portableBuildInputsDigest(expected) {
  const paths = execFileSync('git', ['ls-files', 'public/brand/collateral/cards', 'public/brand/collateral/social', ledger], { encoding: 'utf8', windowsHide: true }).trim().split(/\r?\n/).filter(Boolean).sort();
  return matchRecordedBuildInputs(sourceDigest(), paths.map(file => ({ path: file, bytes: readFileSync(file) })), expected);
}
