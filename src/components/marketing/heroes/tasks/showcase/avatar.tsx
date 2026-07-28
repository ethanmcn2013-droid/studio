import { resolveUser, USERS, type UserId } from "@/components/marketing/heroes/tasks/lib/data";
import { cn } from "@/components/marketing/heroes/tasks/lib/utils";

export function Avatar({
  user,
  name,
  size = 22,
  ring = false,
  className,
  tone = "color",
  active = false,
}: {
  user: UserId;
  /** Optional display name, passed when known from DB join (resolveUser).
   *  Omit in showcase/seeded contexts where USERS map is sufficient. */
  name?: string;
  size?: number;
  ring?: boolean;
  className?: string;
  /** "ink" renders neutral ink-tone initials on paper (marketing demo
   *  canon: ink / paper / one indigo). Default "color" keeps the
   *  per-user seed colors used across the app surfaces. */
  tone?: "color" | "ink";
  /** The single actively-working person carries the indigo. Only
   *  meaningful with tone="ink". */
  active?: boolean;
}) {
  // M1: use resolveUser so a real Clerk id with a known name gets proper
  // initials rather than "?" from the USERS proxy fallback.
  const u = name ? resolveUser(user, name) : USERS[user];
  const ink = tone === "ink" && !active;
  return (
    <span
      role="img"
      aria-label={u.name}
      title={u.name}
      className={cn(
        "inline-flex flex-shrink-0 select-none items-center justify-center rounded-full uppercase",
        className,
      )}
      style={{
        width: size,
        height: size,
        // The separating ring is drawn in the card's own paper, as a real
        // border rather than a Tailwind `ring`. A ring paints outside the
        // box and half-covers the glyph on a 20px avatar; a border keeps the
        // circle a circle and the initials centred inside it.
        border: ring ? "1.5px solid var(--paper)" : undefined,
        // Initials are two capitals at small size, which is exactly where
        // subpixel hinting smears. Grayscale smoothing plus a whole-pixel
        // font size keeps the strokes even.
        WebkitFontSmoothing: "antialiased",
        lineHeight: 1,
        // GALLERY EDIT 2026-07-27 — was white bold initials on a fully
        // saturated fill. At board scale that is a 9px glyph at maximum
        // contrast, which fringes and reads as pixelated. The product solves
        // this with a muted wash and ink text (the "muted-wash initials" the
        // room grammar calls for), so the hero now does the same: the person's
        // colour identifies them, the ink stays legible.
        backgroundColor: active
          ? "color-mix(in srgb, var(--accent) 16%, var(--paper))"
          : ink
            ? "var(--bg-sunken)"
            : `color-mix(in srgb, ${u.color} 16%, var(--paper))`,
        // Ink at full strength, not a softened grey. The wash behind it is
        // light enough that the initials clear WCAG comfortably, and full-ink
        // glyphs are what stop small type looking mushy.
        color: active ? "var(--accent)" : "var(--ink)",
        fontSize: Math.round(size * 0.375),
        fontWeight: 700,
        letterSpacing: "0.02em",
        // One hairline of the person's own colour separates the wash from the
        // card. Inset so it never enlarges the circle.
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${
          active ? "var(--accent)" : u.color
        } 30%, transparent)`,
      }}
    >
      {u.initials}
    </span>
  );
}

export function AvatarStack({
  users,
  size = 22,
  max = 4,
  tone = "color",
  activeUser = null,
}: {
  users: UserId[];
  size?: number;
  max?: number;
  tone?: "color" | "ink";
  activeUser?: UserId | null;
}) {
  const visible = users.slice(0, max);
  const overflow = users.length - visible.length;
  return (
    <div
      // The app overlaps its stack by 5px, which reads as one group rather
      // than a row of separate dots. The 2px it used before was neither.
      className="flex items-center"
      style={{ gap: -0 }}
      role="group"
      aria-label={`Assignees: ${users.length}`}
    >
      {visible.map((u, i) => (
        <span key={u} style={{ marginLeft: i === 0 ? 0 : -5, display: "inline-flex" }}>
          <Avatar
            user={u}
            size={size}
            ring
            tone={tone}
            active={activeUser !== null && u === activeUser}
          />
        </span>
      ))}
      {overflow > 0 ? (
        <span
          role="img"
          className="inline-flex items-center justify-center rounded-full bg-bg-sunken font-semibold text-ink-soft ring-2 ring-white"
          style={{ width: size, height: size, fontSize: Math.max(8, Math.round(size * 0.34)) }}
          aria-label={`${overflow} more assignees`}
          title={`${overflow} more`}
        >
          +{overflow}
        </span>
      ) : null}
    </div>
  );
}
