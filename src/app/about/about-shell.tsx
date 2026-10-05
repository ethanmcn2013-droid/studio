import type { ReactNode } from "react";
import { MarketingShell } from "@/components/home/marketing-shell";

export function AboutShell({ children }: { children: ReactNode }) {
  return <MarketingShell page="about">{children}</MarketingShell>;
}
