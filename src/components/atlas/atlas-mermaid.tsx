"use client";

import { useEffect } from "react";

/**
 * AtlasMermaid, client-side hydration of mermaid diagrams inside the
 * server-rendered atlas prose.
 *
 * The server-side markdown renderer emits placeholder divs:
 *   <div class="atlas-mermaid" data-source="<base64>">
 *     <pre class="atlas-mermaid-fallback">…raw source…</pre>
 *   </div>
 *
 * On mount, this component finds every such div on the page, decodes
 * the source, asks mermaid to render an SVG, and replaces the fallback.
 *
 * Mermaid is lazy-loaded (dynamic import) so the index page, which
 * never renders diagrams, doesn't pay the ~500KB cost. Only entry
 * pages that contain at least one mermaid fence pull mermaid into the
 * browser.
 */
export function AtlasMermaidHydrator() {
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLDivElement>(".atlas-mermaid[data-source]"),
    );
    if (targets.length === 0) return;

    let cancelled = false;

    (async () => {
      const mod = await import("mermaid");
      const mermaid = mod.default;

      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        themeVariables: {
          fontFamily:
            "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
          fontSize: "14px",
          primaryColor: "#ffffff",
          primaryTextColor: "#111111",
          primaryBorderColor: "#111111",
          lineColor: "#71717a",
          secondaryColor: "#fafafa",
          tertiaryColor: "#f4f4f5",
          background: "#ffffff",
          mainBkg: "#ffffff",
          secondBkg: "#fafafa",
          edgeLabelBackground: "#ffffff",
          clusterBkg: "#fafafa",
          clusterBorder: "#e4e4e7",
          nodeBorder: "#111111",
          nodeTextColor: "#111111",
        },
        flowchart: {
          curve: "basis",
          padding: 12,
          nodeSpacing: 48,
          rankSpacing: 56,
          useMaxWidth: true,
        },
        securityLevel: "strict",
      });

      for (let i = 0; i < targets.length; i++) {
        if (cancelled) return;
        const el = targets[i];
        const encoded = el.getAttribute("data-source") ?? "";
        let source = "";
        try {
          source = atob(encoded);
        } catch {
          continue;
        }
        if (!source.trim()) continue;

        const id = `atlas-mermaid-${i}-${Date.now()}`;
        try {
          const { svg } = await mermaid.render(id, source);
          if (cancelled) return;
          el.innerHTML = svg;
          el.setAttribute("data-rendered", "true");
        } catch (err) {
          // Leave the fallback <pre> in place, operator can still read
          // the source, which is its own kind of value.
          el.setAttribute("data-render-error", "true");
          // eslint-disable-next-line no-console
          console.warn("atlas-mermaid render failed", err);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
