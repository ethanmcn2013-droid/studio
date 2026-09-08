import type { Metadata } from "next";
import { DotStudio } from "@/components/dot/dot-studio";
import "@/components/dot/dot-studio.css";

export const metadata: Metadata = {
  title: "Dot Studio — Signal Studio",
  description:
    "One circle. A world of expression. Meet Dot, the Signal Studio mascot.",
  robots: { index: false, follow: false },
};

export default function DotStudioPage() {
  return <DotStudio authoring={process.env.NODE_ENV === "development"} />;
}
