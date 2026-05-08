import { Hero } from "@/components/landing/hero";
import { ProductsGrid } from "@/components/landing/products-grid";
import { Manifesto } from "@/components/landing/manifesto";
import { SiteFooter } from "@/components/landing/site-footer";

export default function Home() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <Hero />
        <ProductsGrid />
        <Manifesto />
      </main>
      <SiteFooter />
    </>
  );
}
