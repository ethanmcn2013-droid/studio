import { notFound } from "next/navigation";
import { isReviewMode } from "@/lib/access-mode";
import { ProductPageLab } from "./product-page-lab";

export const metadata = {
  title: "Signal Studio product pages · local review",
  description: "Private local review lab for Signal Studio product marketing.",
  robots: { index: false, follow: false },
};

type SearchParams = {
  option?: string;
  product?: string;
};

export default async function ProductPageLabRoute({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  if (!isReviewMode()) notFound();

  const params = await searchParams;
  const option =
    params.option === "b" || params.option === "c" ? params.option : "a";
  const product =
    params.product === "tasks" ||
    params.product === "timeline" ||
    params.product === "signal"
      ? params.product
      : "notes";

  return <ProductPageLab initialOption={option} initialProduct={product} />;
}
