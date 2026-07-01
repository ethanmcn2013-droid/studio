import type { Metadata } from "next";
import TimelineOnePager from "../roadmap/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Signal Timeline - one-pager",
  description: "Direction clarity. Print-ready one-pager.",
  robots: { index: false, follow: false },
};

export default TimelineOnePager;
