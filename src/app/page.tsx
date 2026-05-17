import { RevealEngine } from "@/components/reveal/reveal-engine";
import { RevealHero } from "@/components/reveal/reveal-hero";
import { RevealManifesto } from "@/components/reveal/reveal-manifesto";
import { RevealProof } from "@/components/reveal/reveal-proof";
import { RevealProducts } from "@/components/reveal/reveal-products";
import { RevealClosing } from "@/components/reveal/reveal-closing";

export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <RevealHero />
      <RevealManifesto />
      <RevealProof />
      <RevealProducts />
      <RevealClosing />
      <RevealEngine />
    </main>
  );
}
