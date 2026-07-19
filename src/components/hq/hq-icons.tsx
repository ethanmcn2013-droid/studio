// Compact stroke-icon set for the HQ rail and utility bar. 20×20, 1.5 stroke,
// currentColor — calm line icons in the reference's register. No dependency.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const HqIcons = {
  today: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M3 8.5 10 3l7 5.5V16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.5Z" />
      <path d="M8 17v-5h4v5" />
    </svg>
  ),
  action: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M3 5h14M3 5v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5" />
      <path d="M3 9.5h4l1.5 2.5h3L14 9.5h3" />
    </svg>
  ),
  sell: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M3 14.5 8 9.5l3 3 6-6.5" />
      <path d="M13 6h4v4" />
    </svg>
  ),
  make: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M12.5 3.5 16.5 7.5 7 17H3v-4l9.5-9.5Z" />
      <path d="M11 5l4 4" />
    </svg>
  ),
  money: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M3 16V4M3 16h14" />
      <rect x="6" y="9" width="2.6" height="5" rx="0.5" />
      <rect x="11" y="6" width="2.6" height="8" rx="0.5" />
    </svg>
  ),
  company: (p: IconProps) => (
    <svg {...base} {...p}>
      <rect x="3.5" y="4" width="7" height="13" rx="1" />
      <path d="M10.5 8h5a1 1 0 0 1 1 1v8h-6" />
      <path d="M6 7h2M6 10h2M6 13h2M13 11h1.5M13 14h1.5" />
    </svg>
  ),
  library: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M4 4h4v13H4zM9 4h3v13H9z" />
      <path d="M13 5l3.4.9L14 17.4 12.6 17" />
    </svg>
  ),
  vault: (p: IconProps) => (
    <svg {...base} {...p}>
      <rect x="3.5" y="4" width="13" height="12" rx="1.5" />
      <circle cx="11.5" cy="10" r="2.5" />
      <path d="M11.5 10h3" />
    </svg>
  ),
  atlas: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M3.5 5.5 7.5 4l5 1.5L16.5 4v10L12.5 15.5 7.5 14 3.5 15.5Z" />
      <path d="M7.5 4v10M12.5 5.5v10" />
    </svg>
  ),
  board: (p: IconProps) => (
    <svg {...base} {...p}>
      <circle cx="7" cy="7.5" r="2" />
      <circle cx="13" cy="7.5" r="2" />
      <path d="M3.5 15c0-2 1.6-3.2 3.5-3.2S10.5 13 10.5 15M9.5 15c0-2 1.6-3.2 3.5-3.2s3.5 1.2 3.5 3.2" />
    </svg>
  ),
  dataroom: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M3 6a1 1 0 0 1 1-1h3.5l1.5 2H16a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6Z" />
    </svg>
  ),
  access: (p: IconProps) => (
    <svg {...base} {...p}>
      <circle cx="7" cy="10" r="3" />
      <path d="M10 10h6M14 10v2.5M16 10v2" />
    </svg>
  ),
  quality: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M10 3 4 5.5V10c0 3.5 2.5 5.6 6 7 3.5-1.4 6-3.5 6-7V5.5L10 3Z" />
      <path d="M7.5 10l1.8 1.8L13 8" />
    </svg>
  ),
  readiness: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M4 14a6 6 0 1 1 12 0" />
      <path d="M10 14l3-3.5" />
    </svg>
  ),
  health: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M3 10.5h3l2-4 3 7 2-4.5 1.5 1.5H17" />
    </svg>
  ),
  decks: (p: IconProps) => (
    <svg {...base} {...p}>
      <rect x="3" y="4" width="14" height="9" rx="1" />
      <path d="M7 16.5h6M10 13v3.5" />
    </svg>
  ),
  search: (p: IconProps) => (
    <svg {...base} {...p}>
      <circle cx="9" cy="9" r="5" />
      <path d="m13 13 3.5 3.5" />
    </svg>
  ),
  exit: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M12 3H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h7" />
      <path d="M9 10h8M14 7l3 3-3 3" />
    </svg>
  ),
  menu: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M3.5 6h13M3.5 10h13M3.5 14h13" />
    </svg>
  ),
  close: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="m5 5 10 10M15 5 5 15" />
    </svg>
  ),
  collapse: (p: IconProps) => (
    <svg {...base} {...p}>
      <rect x="3.5" y="4" width="13" height="12" rx="1.5" />
      <path d="M8 4v12" />
    </svg>
  ),
} as const;

export type HqIconName = keyof typeof HqIcons;
