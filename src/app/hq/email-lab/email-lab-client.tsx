"use client";

import { useMemo, useState } from "react";

export type LabDirection = {
  id: string;
  name: string;
  thesis: string;
  pole: string;
  maxWidth: number;
};

export type LabTemplate = {
  id: string;
  name: string;
  mode: string;
  classification: string;
  priority: string;
  sender: string;
  replyTo: string;
  unsubscribe: string;
  tracking: string;
  sourceFile: string;
  assumptions: string[];
  elevation: Record<string, { rounds: number; score: number }>;
  fixtures: { id: string; label: string; subject: string; preheader: string }[];
};

const INK = "#111111";
const INK_SOFT = "#3f3f46";
const INK_FAINT = "#71717a";
const HAIR = "#e7e7e9";
const INDIGO = "#4f46e5";
const MONO =
  "var(--font-geist-mono, ui-monospace), ui-monospace, SFMono-Regular, Menlo, monospace";

const label: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: 11,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: INK_FAINT,
};

function Chip({
  active,
  onClick,
  children,
  title,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        appearance: "none",
        border: `1px solid ${active ? INK : HAIR}`,
        background: active ? INK : "#ffffff",
        color: active ? "#ffffff" : INK_SOFT,
        borderRadius: 999,
        padding: "6px 14px",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

export function EmailLabClient({
  directions,
  templates,
}: {
  directions: LabDirection[];
  templates: LabTemplate[];
}) {
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? "");
  const [directionId, setDirectionId] = useState<string>("hairline");
  const [fixtureId, setFixtureId] = useState("default");
  const [width, setWidth] = useState<"desktop" | "mobile">("desktop");
  const [scheme, setScheme] = useState<"light" | "dark">("light");
  const [images, setImages] = useState<"on" | "off">("on");
  const [view, setView] = useState<"html" | "text">("html");
  const [rev, setRev] = useState<"v2" | "v1">("v2");

  const template = useMemo(
    () => templates.find((t) => t.id === templateId) ?? templates[0],
    [templates, templateId],
  );
  const fixture =
    template.fixtures.find((f) => f.id === fixtureId) ?? template.fixtures[0];

  const frameWidth = width === "desktop" ? 700 : 390;
  const frameHeight = width === "desktop" ? 760 : 720;

  function renderUrl(dir: string) {
    const params = new URLSearchParams({
      template: template.id,
      direction: dir,
      fixture: rev === "v1" ? "default" : fixture.id,
    });
    if (rev === "v1") params.set("rev", "v1");
    if (scheme === "dark") params.set("dark", "1");
    if (images === "off") params.set("images", "0");
    if (view === "text") params.set("view", "text");
    return `/hq/email-lab/render?${params.toString()}`;
  }

  const shownDirections =
    directionId === "compare"
      ? directions
      : directions.filter((d) => d.id === directionId);

  const blocked = template.assumptions.some((a) => a.startsWith("BLOCKED"));

  return (
    <div style={{ maxWidth: 1480, margin: "0 auto", padding: "32px 24px 80px", color: INK }}>
      {/* ── Title ── */}
      <p style={{ ...label, margin: "0 0 8px" }}>Make · Email Lab</p>
      <h1
        style={{
          fontSize: 28,
          lineHeight: "34px",
          fontWeight: 600,
          letterSpacing: "-0.02em",
          margin: "0 0 6px",
        }}
      >
        Three email systems, side by side.
      </h1>
      <p style={{ fontSize: 15, lineHeight: "24px", color: INK_SOFT, maxWidth: 720, margin: "0 0 28px" }}>
        Eight representative emails, one shared fixture set, three directions.
        Pick an email, then compare. The scorecard and the recommendation live
        in docs/email-system/comparison.md; nothing is deleted until you choose.
      </p>

      {/* ── Template picker ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
        {templates.map((t) => (
          <Chip
            key={t.id}
            active={t.id === template.id}
            onClick={() => {
              setTemplateId(t.id);
              setFixtureId("default");
            }}
            title={t.id}
          >
            {t.name}
          </Chip>
        ))}
      </div>

      {/* ── Controls ── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          alignItems: "center",
          padding: "14px 16px",
          border: `1px solid ${HAIR}`,
          borderRadius: 10,
          marginBottom: 18,
        }}
      >
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={label}>Direction</span>
          <Chip active={directionId === "compare"} onClick={() => setDirectionId("compare")}>
            Compare all
          </Chip>
          {directions.map((d) => (
            <Chip key={d.id} active={directionId === d.id} onClick={() => setDirectionId(d.id)}>
              {d.name}
            </Chip>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={label}>Revision</span>
          <Chip active={rev === "v2"} onClick={() => setRev("v2")} title="Live templates, elevated in the v2 craft pass">
            v2
          </Chip>
          <Chip active={rev === "v1"} onClick={() => setRev("v1")} title="Frozen v1 archive from docs/email-system/renders (default fixture)">
            v1 archive
          </Chip>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={label}>Width</span>
          <Chip active={width === "desktop"} onClick={() => setWidth("desktop")}>Desktop</Chip>
          <Chip active={width === "mobile"} onClick={() => setWidth("mobile")}>Mobile 390</Chip>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={label}>Scheme</span>
          <Chip active={scheme === "light"} onClick={() => setScheme("light")}>Light</Chip>
          <Chip active={scheme === "dark"} onClick={() => setScheme("dark")}>Dark</Chip>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={label}>Images</span>
          <Chip active={images === "on"} onClick={() => setImages("on")}>On</Chip>
          <Chip active={images === "off"} onClick={() => setImages("off")}>Blocked</Chip>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={label}>View</span>
          <Chip active={view === "html"} onClick={() => setView("html")}>HTML</Chip>
          <Chip active={view === "text"} onClick={() => setView("text")}>Plain text</Chip>
        </div>
        {template.fixtures.length > 1 ? (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={label}>Fixture</span>
            {template.fixtures.map((f) => (
              <Chip key={f.id} active={f.id === fixture.id} onClick={() => setFixtureId(f.id)}>
                {f.label}
              </Chip>
            ))}
          </div>
        ) : null}
      </div>

      {/* ── Message metadata ── */}
      <div
        style={{
          border: `1px solid ${HAIR}`,
          borderRadius: 10,
          padding: "16px 18px",
          marginBottom: 22,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "12px 28px",
        }}
      >
        <div>
          <p style={{ ...label, margin: "0 0 3px" }}>Subject</p>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{fixture.subject}</p>
        </div>
        <div>
          <p style={{ ...label, margin: "0 0 3px" }}>Preheader</p>
          <p style={{ margin: 0, fontSize: 14, color: INK_SOFT }}>{fixture.preheader}</p>
        </div>
        <div>
          <p style={{ ...label, margin: "0 0 3px" }}>Sender</p>
          <p style={{ margin: 0, fontSize: 14, color: INK_SOFT }}>
            {template.sender}
            <span style={{ color: INK_FAINT }}> · reply-to {template.replyTo}</span>
          </p>
        </div>
        <div>
          <p style={{ ...label, margin: "0 0 3px" }}>Classification</p>
          <p style={{ margin: 0, fontSize: 14, color: INK_SOFT }}>
            {template.classification} · {template.mode} mode · {template.priority}
          </p>
        </div>
        <div>
          <p style={{ ...label, margin: "0 0 3px" }}>Tracking</p>
          <p style={{ margin: 0, fontSize: 14, color: INK_SOFT }}>{template.tracking}</p>
        </div>
        <div>
          <p style={{ ...label, margin: "0 0 3px" }}>Unsubscribe</p>
          <p style={{ margin: 0, fontSize: 14, color: INK_SOFT }}>{template.unsubscribe}</p>
        </div>
        <div>
          <p style={{ ...label, margin: "0 0 3px" }}>Template file</p>
          <p style={{ margin: 0, fontSize: 13, fontFamily: MONO, color: INK_SOFT }}>
            {template.sourceFile}
          </p>
        </div>
      </div>

      {/* ── Assumptions ── */}
      {template.assumptions.length > 0 ? (
        <div
          style={{
            borderLeft: `2px solid ${blocked ? "#b91c1c" : INDIGO}`,
            padding: "2px 0 2px 14px",
            marginBottom: 24,
          }}
        >
          <p style={{ ...label, margin: "0 0 6px", color: blocked ? "#b91c1c" : INK_FAINT }}>
            {blocked ? "Blocked · provisional claims" : "Provisional claims and assumptions"}
          </p>
          {template.assumptions.map((a) => (
            <p key={a} style={{ margin: "0 0 4px", fontSize: 13, lineHeight: "20px", color: INK_SOFT }}>
              {a}
            </p>
          ))}
        </div>
      ) : null}

      {/* ── Previews ── */}
      <div
        style={{
          display: "flex",
          gap: 18,
          alignItems: "flex-start",
          overflowX: "auto",
          paddingBottom: 8,
        }}
      >
        {shownDirections.map((d) => (
          <div key={d.id} style={{ flex: "0 0 auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                width: frameWidth,
                marginBottom: 8,
              }}
            >
              <div>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{d.name}</span>
                <span style={{ fontSize: 12, color: INK_FAINT }}> · {d.pole}</span>
                {rev === "v2" && template.elevation[d.id] ? (
                  <span style={{ fontSize: 12, color: INK_FAINT }}>
                    {" "}· scored {template.elevation[d.id].score}/10 in{" "}
                    {template.elevation[d.id].rounds} rounds
                  </span>
                ) : null}
                {rev === "v1" ? (
                  <span style={{ fontSize: 12, color: INK_FAINT }}> · v1 archive</span>
                ) : null}
              </div>
              <a
                href={renderUrl(d.id)}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: 12, color: INDIGO, textDecoration: "underline" }}
              >
                Open full page
              </a>
            </div>
            <iframe
              key={`${renderUrl(d.id)}`}
              src={renderUrl(d.id)}
              title={`${template.name} · ${d.name}`}
              width={frameWidth}
              height={frameHeight}
              style={{
                border: `1px solid ${HAIR}`,
                borderRadius: 8,
                background: scheme === "dark" ? "#1c1c1e" : "#ffffff",
                display: "block",
              }}
            />
            <p style={{ width: frameWidth, fontSize: 12, lineHeight: "18px", color: INK_FAINT, margin: "8px 0 0" }}>
              {d.thesis}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
