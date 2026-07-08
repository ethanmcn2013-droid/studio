import type { Metadata } from "next";
import { WaitlistLab } from "./WaitlistLab";

export const metadata: Metadata = {
  title: "Waitlist lab | Signal Studio",
  description: "Review-only showroom for the public waitlist page.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function WaitlistLabPage() {
  return (
    <main id="main" tabIndex={-1}>
      <WaitlistLab />
    </main>
  );
}
