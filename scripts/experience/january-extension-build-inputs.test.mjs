import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { matchRecordedBuildInputs } from './january-extension-build-inputs.mjs';

const ledger = 'docs/signal-studio-review/remediation-program.yaml';
const lf = '{\n  "items": ["original  spacing"],\n  "completion": 0\n}\n';
const fixture = text => [{ path: ledger, bytes: Buffer.from(text) }, { path: 'public/brand/collateral/cards/proof.png', bytes: Buffer.from([137, 80, 78, 71, 13, 10, 0, 1]) }];
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const recorded = files => hash('source\n' + files.map(file => `${file.path}:${hash(file.bytes)}`).join('\n'));

test('identical observed input bytes remain exact', () => {
  const files = fixture(lf), expected = recorded(files);
  assert.equal(matchRecordedBuildInputs('source', files, expected), expected);
});
test('LF checkout reconstructs the original observed CRLF ledger bytes', () => {
  const expected = recorded(fixture(lf.replaceAll('\n', '\r\n')));
  assert.equal(matchRecordedBuildInputs('source', fixture(lf), expected), expected);
});
test('CRLF checkout reconstructs the original observed LF ledger bytes', () => {
  const expected = recorded(fixture(lf));
  assert.equal(matchRecordedBuildInputs('source', fixture(lf.replaceAll('\n', '\r\n')), expected), expected);
});
test('bare carriage returns remain byte-significant', () => {
  assert.throws(() => matchRecordedBuildInputs('source', fixture(lf.replaceAll('\n', '\r')), recorded(fixture(lf))));
});
test('semantic, string, formatting and missing-final-newline changes remain stale', () => {
  const expected = recorded(fixture(lf));
  for (const changed of [lf.replace(': 0', ': 1'), lf.replace('original  spacing', 'original spacing'), lf.replace('  "items"', '\t"items"'), lf.trimEnd()]) {
    assert.throws(() => matchRecordedBuildInputs('source', fixture(changed), expected));
  }
});
test('binary input, path and runtime-source changes remain stale', () => {
  const expected = recorded(fixture(lf));
  const bytes = fixture(lf); bytes[1].bytes[4] = 0;
  assert.throws(() => matchRecordedBuildInputs('source', bytes, expected));
  const renamed = fixture(lf); renamed[1].path += '.changed';
  assert.throws(() => matchRecordedBuildInputs('source', renamed, expected));
  assert.throws(() => matchRecordedBuildInputs('different-source', fixture(lf), expected));
});
test('no other input receives text normalization', () => {
  const files = fixture(lf); files[1] = { path: 'public/brand/collateral/cards/other.yaml', bytes: Buffer.from('a\nb\n') };
  const expected = recorded(files);
  files[1].bytes = Buffer.from('a\r\nb\r\n');
  assert.throws(() => matchRecordedBuildInputs('source', files, expected));
});
test('three explicit text inputs can have different observed newline encodings', () => {
  const files = fixture(lf);
  files.push({ path: 'public/brand/collateral/social/alt-text.txt', bytes: Buffer.from('Exact alternative text\nSecond line\n') });
  files.push({ path: 'public/brand/collateral/social/index.html', bytes: Buffer.from('<html>\n<body>Exact markup</body>\n</html>\n') });
  const original = files.map(file => ({ ...file, bytes: Buffer.from(file.bytes) }));
  for (const index of [0, 2]) original[index].bytes = Buffer.from(original[index].bytes.toString().replaceAll('\n', '\r\n'));
  const expected = recorded(original);
  assert.equal(matchRecordedBuildInputs('source', files, expected), expected);
  const textChanged = files.map(file => ({ ...file, bytes: Buffer.from(file.bytes) }));
  textChanged[2].bytes = Buffer.from('Different alternative text\nSecond line\n');
  assert.throws(() => matchRecordedBuildInputs('source', textChanged, expected));
  const markupChanged = files.map(file => ({ ...file, bytes: Buffer.from(file.bytes) }));
  markupChanged[3].bytes = Buffer.from('<html>\n<body>Different markup</body>\n</html>\n');
  assert.throws(() => matchRecordedBuildInputs('source', markupChanged, expected));
  for (const index of [0, 2, 3]) {
    const addedBom = files.map(file => ({ ...file, bytes: Buffer.from(file.bytes) }));
    addedBom[index].bytes = Buffer.concat([Buffer.from([239, 187, 191]), addedBom[index].bytes]);
    assert.throws(() => matchRecordedBuildInputs('source', addedBom, expected), 'A BOM is not a newline-only change');
  }
});
