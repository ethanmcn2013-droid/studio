import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { renderAtlasMarkdown } from './render';
import { decodeMermaidSource } from './mermaid-source';

test('the real Atlas Mermaid fence round-trips its Unicode labels exactly', () => {
  const body = readFileSync('content/atlas/brand-enforcement.md', 'utf8').replaceAll('\r\n', '\n');
  const source = body.match(/```mermaid\r?\n([\s\S]*?)\r?\n```/)![1].replaceAll('\r\n', '\n');
  const html = renderAtlasMarkdown(body);
  const encoded = html.match(/class="atlas-mermaid" data-source="([^"]+)"/)![1];
  assert.equal(decodeMermaidSource(encoded), source);
  assert.match(decodeMermaidSource(encoded), /cycle opens — copy work/);
  assert.match(decodeMermaidSource(encoded), /read BRAND\.md §/);
});

test('Unicode transport preserves accents, non-Latin text and supplementary code points', () => {
  const source = 'flowchart LR\n A[Éire € — § 漢字 🧭]';
  assert.equal(decodeMermaidSource(Buffer.from(source, 'utf8').toString('base64')), source);
});

test('malformed Base64 or UTF-8 is rejected rather than producing corrupted labels', () => {
  assert.throws(() => decodeMermaidSource('%%%'));
  assert.throws(() => decodeMermaidSource(Buffer.from([0xc3, 0x28]).toString('base64')));
});

test('nested lists and wrapped prose stay inside their owning list item', () => {
  const html = renderAtlasMarkdown('- Parent\n  - Child\n    wrapped words\n  - Second child\n- Sibling');
  assert.equal(html.replaceAll('\n', ''), '<ul class="atlas-ul"><li>Parent<ul class="atlas-ul"><li>Child wrapped words</li><li>Second child</li></ul></li><li>Sibling</li></ul>');
});

test('list type changes and following prose close the previous list correctly', () => {
  const html = renderAtlasMarkdown('1. First\n   - Nested\n2. Second\n- New list\nFollowing paragraph\n\n## Heading');
  assert.equal(html.replaceAll('\n', ''), '<ol class="atlas-ol"><li>First<ul class="atlas-ul"><li>Nested</li></ul></li><li>Second</li></ol><ul class="atlas-ul"><li>New list</li></ul><p>Following paragraph</p><h2 id="heading" class="atlas-h2">Heading</h2>');
});

test('nested list text stays escaped and fences are not interpreted as list items', () => {
  const html = renderAtlasMarkdown('- <script>alert(1)</script>\n  - [unsafe](javascript:alert)\n\n```text\n- raw <tag>\n```');
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('href="javascript:'));
  assert.match(html, /<li>&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(html, /<pre><code>- raw &lt;tag&gt;<\/code><\/pre>/);
});
