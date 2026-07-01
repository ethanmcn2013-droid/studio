export type Product = "notes" | "tasks" | "timeline" | "signal";

const DEFAULT_PORTS: Record<Product, number> = {
  notes: 4211,
  tasks: 4212,
  timeline: 4213,
  signal: 4214,
};

const ENV_KEYS: Record<Product, string> = {
  notes: "UX_NOTES_URL",
  tasks: "UX_TASKS_URL",
  timeline: "UX_TIMELINE_URL",
  signal: "UX_SIGNAL_URL",
};

export function productUrl(product: Product, pathname = "/"): string {
  const base =
    process.env[ENV_KEYS[product]] ?? `http://localhost:${DEFAULT_PORTS[product]}`;
  return `${base.replace(/\/$/, "")}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}
