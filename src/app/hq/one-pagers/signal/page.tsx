import type { Metadata } from "next";
import SignalOnePager from "../analytics/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Signal - one-pager",
  description: "Attention clarity. Print-ready one-pager.",
  robots: { index: false, follow: false },
};

export default SignalOnePager;
