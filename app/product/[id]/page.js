import ProductView from "@/components/pages/Product/ProductView";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const res = await fetch(`${apiUrl}/products/${productId}`, {
      next: { revalidate: 3600 }, // Cache metadata for 1 hour
    });
    
    if (!res.ok) {
      return {
        title: "Product Details | XIROO",
        description: "Explore premium custom curated fashion collections at XIROO.",
      };
    }

    const json = await res.json();
    const product = json?.data;

    if (!product) {
      return {
        title: "Product Not Found | XIROO",
      };
    }

    const stripHtml = (html) => html ? html.replace(/<[^>]*>/g, "") : "";
    const cleanDesc = stripHtml(product.description);
    
    const title = product.seoTitle || `${product.title} | XIROO`;
    const description = product.seoDescription || (cleanDesc.length > 160 ? `${cleanDesc.substring(0, 157)}...` : cleanDesc);
    const keywords = product.seoKeywords || product.title.split(" ").join(", ");

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        images: product.images?.[0] ? [{ url: product.images[0] }] : [],
        type: "website",
      },
    };
  } catch (error) {
    console.error("Error generating product metadata:", error);
    return {
      title: "Product Details | XIROO",
      description: "Explore premium custom curated fashion collections at XIROO.",
    };
  }
}

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
