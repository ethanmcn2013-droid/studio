/**
 * Minimal markdown renderer for atlas entry bodies. Deliberately tiny —
 * entries are a constrained shape (H2/H3 + paragraphs + lists + links +
 * inline code + fenced code), so a full markdown library is overkill.
 *
 * Supports:
 *   ## Heading 2          → <h2>
 *   ### Heading 3         → <h3>
 *   - item / * item       → <ul><li>
 *   1. item               → <ol><li>
 *   ```lang ... ```       → <pre><code>
 *   `code`                → <code>
 *   **bold**              → <strong>
 *   _italic_              → <em>
 *   [text](url)           → <a>
 *   blank line            → paragraph break
 *
 * Mermaid fences (```mermaid) render as a labeled code block in v1. A
 * future cycle can swap in a client-side renderer without changing the
 * source format.
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
  // Order matters — code first, then links, then emphasis.
  let out = escapeHtml(text);

  // Inline code
  out = out.replace(/`([^`]+)`/g, '<code class="atlas-code">$1</code>');

  // Links — keep restrictive: only http(s), mailto, or root-relative paths.
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_m, label: string, href: string) => {
      const safe = /^(https?:\/\/|mailto:|\/)/.test(href) ? href : "#";
      const external = /^https?:\/\//.test(safe);
      const attrs = external ? ' target="_blank" rel="noreferrer"' : "";
      return `<a class="atlas-link" href="${safe}"${attrs}>${label}</a>`;
    },
  );

  // Bold then italic.
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^_])_([^_]+)_($|[^_])/g, "$1<em>$2</em>$3");

  return out;
}

export function renderAtlasMarkdown(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];

  let i = 0;
  let inList: "ul" | "ol" | null = null;
  let paragraph: string[] = [];

  function flushParagraph() {
    if (paragraph.length === 0) return;
    out.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  }

  function closeList() {
    if (inList) {
      out.push(`</${inList}>`);
      inList = null;
    }
  }

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code
    const fence = line.match(/^```([a-zA-Z0-9_-]*)\s*$/);
    if (fence) {
      flushParagraph();
      closeList();
      const lang = fence[1] || "";
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1; // skip closing fence
      const label =
        lang === "mermaid"
          ? '<div class="atlas-code-label">diagram source · mermaid</div>'
          : lang
            ? `<div class="atlas-code-label">${escapeHtml(lang)}</div>`
            : "";
      out.push(
        `<div class="atlas-codeblock">${label}<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre></div>`,
      );
      continue;
    }

    // Headings
    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) {
      flushParagraph();
      closeList();
      const text = h2[1].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      out.push(`<h2 id="${id}" class="atlas-h2">${renderInline(text)}</h2>`);
      i += 1;
      continue;
    }
    const h3 = line.match(/^###\s+(.+)$/);
    if (h3) {
      flushParagraph();
      closeList();
      out.push(`<h3 class="atlas-h3">${renderInline(h3[1].trim())}</h3>`);
      i += 1;
      continue;
    }

    // Lists
    const ul = line.match(/^[-*]\s+(.+)$/);
    const ol = line.match(/^\d+\.\s+(.+)$/);
    if (ul) {
      flushParagraph();
      if (inList !== "ul") {
        closeList();
        out.push('<ul class="atlas-ul">');
        inList = "ul";
      }
      out.push(`<li>${renderInline(ul[1].trim())}</li>`);
      i += 1;
      continue;
    }
    if (ol) {
      flushParagraph();
      if (inList !== "ol") {
        closeList();
        out.push('<ol class="atlas-ol">');
        inList = "ol";
      }
      out.push(`<li>${renderInline(ol[1].trim())}</li>`);
      i += 1;
      continue;
    }

    // Blank line — paragraph break
    if (/^\s*$/.test(line)) {
      flushParagraph();
      closeList();
      i += 1;
      continue;
    }

    // Paragraph accumulation
    paragraph.push(line.trim());
    i += 1;
  }

  flushParagraph();
  closeList();

  return out.join("\n");
}
