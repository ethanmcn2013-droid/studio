/* The collateral review room, the shared surface for founder decisions on
 * physical objects. Each direction shows its faces, its read, and its print
 * technique; the founder names one and the print file already exists. */

export type ReviewImage = { src: string; alt: string; caption: string };

export type ReviewDirection = {
  id: string;
  name: string;
  spec: string;
  images: ReviewImage[];
  read: string;
  links: Array<{ label: string; href: string }>;
  chosen?: string; // set when the founder has picked this direction
};

export function ReviewRoom({
  eyebrow,
  title,
  intro,
  directions,
  advice,
  wide,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
  directions: ReviewDirection[];
  advice: string;
  wide?: boolean;
}) {
  return (
    <main id="main" className="hq-page">
      <header className="hq-page-header">
        <span className="hq-page-eyebrow">{eyebrow}</span>
        <h1 className="hq-page-title">
          {title}
          <span aria-hidden="true" style={{ color: "var(--accent)" }}>.</span>
        </h1>
        <p className="hq-page-intro">{intro}</p>
      </header>

      <section aria-label="directions" style={{ display: "grid", gap: "40px", marginTop: "8px" }}>
        {directions.map((d) => (
          <article
            key={d.id}
            style={{
              border: d.chosen ? "1.5px solid var(--accent)" : "1px solid var(--hairline)",
              borderRadius: "10px",
              overflow: "hidden",
              background: "var(--paper)",
              boxShadow: d.chosen ? "0 12px 32px -12px var(--accent-glow)" : undefined,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: "16px",
                padding: "10px 18px",
                borderBottom: "1px solid var(--hairline)",
                background: "var(--paper-soft)",
                fontFamily: "var(--font-mono-stack)",
                fontSize: "11px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              <span style={{ fontWeight: 600, display: "inline-flex", alignItems: "baseline", gap: "10px" }}>
                {d.name}
                {d.chosen ? (
                  <span
                    style={{
                      background: "var(--accent)",
                      color: "#ffffff",
                      borderRadius: "999px",
                      padding: "2px 10px",
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {d.chosen}
                  </span>
                ) : null}
              </span>
              <span style={{ color: "var(--ink-faint)" }}>{d.spec}</span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: wide
                  ? "minmax(280px, 420px)"
                  : "repeat(auto-fit, minmax(280px, 1fr))",
                justifyContent: "center",
                gap: "18px",
                padding: "18px",
                background: "var(--paper-deep)",
              }}
            >
              {d.images.map((img) => (
                <figure key={img.src} style={{ margin: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={img.alt}
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      borderRadius: "6px",
                      boxShadow: "0 16px 40px rgba(10,10,11,0.12)",
                    }}
                  />
                  <figcaption style={{ fontSize: "12.5px", color: "var(--ink-faint)", marginTop: "8px", lineHeight: 1.5 }}>
                    {img.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: "24px",
                padding: "14px 18px",
                borderTop: "1px solid var(--hairline)",
              }}
            >
              <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.55, color: "var(--ink-soft)", maxWidth: "70ch" }}>{d.read}</p>
              <span
                style={{
                  whiteSpace: "nowrap",
                  fontFamily: "var(--font-mono-stack)",
                  fontSize: "11px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {d.links.map((l, i) => (
                  <span key={l.href}>
                    {i > 0 && " · "}
                    <a href={l.href} style={{ color: "var(--accent)" }}>{l.label}</a>
                  </span>
                ))}
              </span>
            </div>
          </article>
        ))}
      </section>

      <section
        aria-label="how to decide"
        style={{
          marginTop: "40px",
          background: "var(--accent-soft)",
          borderLeft: "3px solid var(--accent)",
          borderRadius: "0 6px 6px 0",
          padding: "16px 20px",
        }}
      >
        <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.6, color: "var(--accent)", fontWeight: 500 }}>{advice}</p>
      </section>
    </main>
  );
}
