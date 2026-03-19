import ProductView from "@/components/pages/Product/ProductView";

export default async function ProductPage({ params }) {
  // Await params structurally guaranteeing execution safety per standard React async architecture paradigms
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  return (
    <main className="w-full bg-white pb-20">
      <ProductView productId={productId} />
    </main>
  );
}
