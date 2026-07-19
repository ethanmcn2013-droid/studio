// HQ rail + utility icon set. The 18 navigation icons are the custom Claude
// Design "Signal HQ Icon Set" (24×24, 1.5 stroke, currentColor, brand-dot
// accents). Utility icons (menu/close/collapse) match the same grid.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
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
      <path d="M3 17H21" />
      <path d="M7.5 20.5H16.5" />
      <path d="M7 17A5 5 0 0 1 17 17" />
      <circle cx="12" cy="14.6" r="1.3" fill="currentColor" stroke="none" data-brand-dot="true" />
    </svg>
  ),
  action: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      <circle cx="12" cy="8.4" r="1.25" fill="currentColor" stroke="none" data-brand-dot="true" />
    </svg>
  ),
  sell: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M3 16.5 9 11l4 3.5L21 7" />
      <path d="M15.5 7H21v5.5" />
    </svg>
  ),
  make: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M12 20.5 8.6 9.2A4 4 0 0 1 15.4 9.2Z" />
      <path d="M12 19V11" />
      <circle cx="12" cy="10" r="0.95" />
    </svg>
  ),
  money: (p: IconProps) => (
    <svg {...base} {...p}>
      <rect x="3" y="7" width="18" height="10" rx="2" />
      <circle cx="12" cy="12" r="2.4" />
      <path d="M6.5 14.6h.01" />
      <path d="M17.5 9.4h.01" />
    </svg>
  ),
  company: (p: IconProps) => (
    <svg {...base} {...p}>
      <rect x="9" y="3.5" width="6" height="5" rx="1.3" />
      <rect x="3.5" y="15.5" width="6" height="5" rx="1.3" />
      <rect x="14.5" y="15.5" width="6" height="5" rx="1.3" />
      <path d="M12 8.5v3.5" />
      <path d="M6.5 15.5V12h11v3.5" />
    </svg>
  ),
  library: (p: IconProps) => (
    <svg {...base} {...p}>
      <rect x="4.4" y="4.5" width="4.2" height="15.5" rx="1.2" />
      <rect x="9.9" y="4.5" width="4.2" height="15.5" rx="1.2" />
      <path d="M5.2 8h2.6" />
      <path d="M10.7 8h2.6" />
      <g transform="rotate(13 17.4 12.25)"><rect x="15.3" y="4.5" width="4.2" height="15.5" rx="1.2" /><path d="M16.1 8h2.6" /></g>
    </svg>
  ),
  vault: (p: IconProps) => (
    <svg {...base} {...p}>
      <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
      <circle cx="11.5" cy="12" r="4" />
      <circle cx="11.5" cy="12" r="1" />
      <path d="M15.5 12h2" />
      <path d="M3.5 8H5" />
      <path d="M3.5 16H5" />
    </svg>
  ),
  atlas: (p: IconProps) => (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="2" />
      <circle cx="5.8" cy="6.6" r="1.6" />
      <circle cx="19" cy="8.5" r="1.6" />
      <circle cx="11" cy="19.5" r="1.6" />
      <path d="M10.6 10.7 7.1 7.9" />
      <path d="M13.8 11.2 17.6 9.3" />
      <path d="M11.5 13.9 11.1 17.9" />
    </svg>
  ),
  decks: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M6.5 8V6.8A1.8 1.8 0 0 1 8.3 5H18.7A1.8 1.8 0 0 1 20.5 6.8V14.2A1.8 1.8 0 0 1 18.7 16H17.5" />
      <rect x="3.5" y="8" width="14" height="11" rx="1.8" />
      <path d="M6 11.3H11" />
      <path d="M6 14H14.5" />
      <path d="M6 16.3H12" />
    </svg>
  ),
  board: (p: IconProps) => (
    <svg {...base} {...p}>
      <circle cx="9" cy="9" r="2.7" />
      <path d="M4.4 18.6v-1.8a4.6 4.6 0 0 1 9.2 0v1.8" />
      <circle cx="16" cy="9.8" r="2.1" />
      <path d="M15 16.4a4 4 0 0 1 4.9 2.2" />
    </svg>
  ),
  dataroom: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M3.5 8.3A1.8 1.8 0 0 1 5.3 6.5H9.4L11.2 8.3H18.7A1.8 1.8 0 0 1 20.5 10.1V17.2A1.8 1.8 0 0 1 18.7 19H5.3A1.8 1.8 0 0 1 3.5 17.2Z" />
      <path d="M9.8 15.5 14.5 10.8" />
      <path d="M11.4 10.8H14.5V13.9" />
    </svg>
  ),
  access: (p: IconProps) => (
    <svg {...base} {...p}>
      <circle cx="7.5" cy="12" r="3.3" />
      <path d="M10.8 12H19" />
      <path d="M16.3 12v2.6" />
      <path d="M19 12v1.9" />
    </svg>
  ),
  quality: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M12 3 19 6v5.2c0 4.1-3.1 7.6-7 9.6-3.9-2-7-5.5-7-9.6V6z" />
      <path d="M8.8 11.9 11 14.1 15.3 9.6" />
    </svg>
  ),
  readiness: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M4.5 16.5a7.5 7.5 0 0 1 15 0" />
      <path d="M12 16.5 15.6 11.4" />
      <circle cx="12" cy="16.5" r="1" />
    </svg>
  ),
  health: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M3 13h5.5l2 0L12 7l2 11 1.5-5H21" />
    </svg>
  ),
  search: (p: IconProps) => (
    <svg {...base} {...p}>
      <circle cx="10.5" cy="10.5" r="6.3" />
      <path d="M15.2 15.2 20.5 20.5" />
      <path d="M8.9 8.6 10.6 10.5 8.9 12.4" />
    </svg>
  ),
  exit: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M13.5 4.5H6.4A1.9 1.9 0 0 0 4.5 6.4V17.6A1.9 1.9 0 0 0 6.4 19.5H13.5" />
      <path d="M10 12h10" />
      <path d="M16.5 8.5 20 12l-3.5 3.5" />
    </svg>
  ),
  menu: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  ),
  close: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  ),
  collapse: (p: IconProps) => (
    <svg {...base} {...p}>
      <rect x="4" y="4.5" width="16" height="15" rx="2.2" />
      <path d="M9.5 4.5v15" />
    </svg>
  ),
} as const;

export type HqIconName = keyof typeof HqIcons;
