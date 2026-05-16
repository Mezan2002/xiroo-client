"use client";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { Edit, Package } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useProducts } from "@/hooks/api/useProducts";
import ProductDetails from "@/components/admin/products/ProductDetails";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const { useProductDetail } = useProducts();
  const { data: productData, isLoading } = useProductDetail(id);

  return (
    <div className="space-y-24 font-montserrat antialiased text-zinc-900 animate-in fade-in duration-700">
      <ModuleHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Products", href: "/admin/products" },
          { label: "Analysis", active: true }
        ]}
        primaryAction={{
          label: "Edit Profile",
          icon: Edit,
          onClick: () => router.push(`/admin/products/${id}`),
        }}
      />

      {isLoading ? (
        <div className="h-[60vh] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-zinc-100 border-t-black rounded-full animate-spin"></div>
        </div>
      ) : (
        <ProductDetails product={productData?.data} />
      )}
    </div>
  );
}
