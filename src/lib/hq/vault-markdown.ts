/**
 * Vault markdown renderer — a compact, dependency-free markdown→HTML pass
 * sized for the founder-circle source documents (legal agreements, memos,
 * letters, brand systems). Unlike the atlas renderer, this one supports
 * GFM tables and the full H1–H4 heading range, because these documents
 * lean on both heavily.
 *
 * Output is wrapped by the caller in `.vault-prose`, which carries the
 * dark/ink typographic system. All text is HTML-escaped before emission;
 * no raw HTML from source is trusted.
 *
 * Supported:
 *   # / ## / ### / ####    → h1..h4
 *   --- / *** (own line)    → <hr>
 *   > quote                 → <blockquote>
 *   | a | b |  + |---|---|   → <table>
 *   - / * / + item          → <ul>
 *   1. item                 → <ol>
 *   ```lang ... ```         → <pre><code>
 *   blank line              → block break
 *   **bold** _italic_ `code` [text](url)
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInline(text: string): string {
  let out = escapeHtml(text);

  // Inline code first so its contents are not re-processed.
  out = out.replace(/`([^`]+)`/g, '<code class="vault-code">$1</code>');

  // Links — http(s), mailto, or root-relative only.
  out = out.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|\/[^\s)]*)\)/g,
    '<a href="$2" rel="noreferrer">$1</a>',
  );

  // Bold then italic. Bold uses ** / __, italic uses * / _.
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*\s][^*]*?)\*/g, "$1<em>$2</em>");
  out = out.replace(/(^|[^_\w])_([^_\s][^_]*?)_/g, "$1<em>$2</em>");

  return out;
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

function isTableDelimiter(line: string): boolean {
  return /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(line);
}

export function renderVaultMarkdown(src: string): string {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank line
    if (line.trim() === "") {
      i += 1;
      continue;
    }

    // Fenced code
    if (/^```/.test(line.trim())) {
      const lang = line.trim().replace(/^```/, "").trim();
      const buf: string[] = [];
      i += 1;
      while (i < lines.length && !/^```/.test(lines[i].trim())) {
        buf.push(lines[i]);
        i += 1;
      }
      i += 1; // closing fence
      const cls = lang ? ` data-lang="${escapeHtml(lang)}"` : "";
      out.push(
        `<pre class="vault-pre"${cls}><code>${escapeHtml(buf.join("\n"))}</code></pre>`,
      );
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      out.push("<hr />");
      i += 1;
      continue;
    }

    // Heading
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = Math.min(heading[1].length, 4);
      out.push(`<h${level}>${renderInline(heading[2].trim())}</h${level}>`);
      i += 1;
      continue;
    }

    // Table — header row followed by a delimiter row
    if (line.includes("|") && i + 1 < lines.length && isTableDelimiter(lines[i + 1])) {
      const header = splitRow(line);
      i += 2; // skip header + delimiter
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim() !== "") {
        rows.push(splitRow(lines[i]));
        i += 1;
      }
      const thead = `<thead><tr>${header
        .map((c) => `<th>${renderInline(c)}</th>`)
        .join("")}</tr></thead>`;
      const tbody = `<tbody>${rows
        .map(
          (r) =>
            `<tr>${header
              .map((_, ci) => `<td>${renderInline(r[ci] ?? "")}</td>`)
              .join("")}</tr>`,
        )
        .join("")}</tbody>`;
      out.push(`<div class="vault-table-wrap"><table class="vault-table">${thead}${tbody}</table></div>`);
      continue;
    }

    // Blockquote
    if (/^>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i += 1;
      }
      out.push(`<blockquote>${renderInline(buf.join(" "))}</blockquote>`);
      continue;
    }

    // Ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i += 1;
      }
      out.push(
        `<ol>${buf.map((b) => `<li>${renderInline(b)}</li>`).join("")}</ol>`,
      );
      continue;
    }

    // Unordered list
    if (/^\s*[-*+]\s+/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s*[-*+]\s+/, ""));
        i += 1;
      }
      out.push(
        `<ul>${buf.map((b) => `<li>${renderInline(b)}</li>`).join("")}</ul>`,
      );
      continue;
    }

    // Paragraph — gather until blank line or block-starting token
    const buf: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,6})\s+/.test(lines[i]) &&
      !/^```/.test(lines[i].trim()) &&
      !/^\s*[-*+]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      !/^(-{3,}|\*{3,}|_{3,})$/.test(lines[i].trim())
    ) {
      buf.push(lines[i]);
      i += 1;
    }
    if (buf.length > 0) {
      out.push(`<p>${renderInline(buf.join(" "))}</p>`);
    }
  }

  return out.join("\n");
}
