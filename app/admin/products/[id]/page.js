"use client";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { useProducts } from "@/hooks/api/useProducts";
import ProductForm from "@/components/admin/products/ProductForm";
import { useRef } from "react";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const formRef = useRef();

  const { toast } = useToast();
  const { useProductDetail, useProductMutation } = useProducts();
  const { data: productData, isLoading: isProductLoading } = useProductDetail(id);
  const { updateMutation: updateProductMutation } = useProductMutation();

  const handleSave = (payload) => {
    updateProductMutation.mutate({ id, data: payload }, {
      onSuccess: () => {
        toast.success("Product Registry Specification Reconfigured.");
        router.push("/admin/products");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to update registry.");
      }
    });
  };


  return (
    <div className="space-y-24 font-montserrat antialiased text-zinc-900">
      <ModuleHeader
        sticky={true}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Products", href: "/admin/products" },
          { label: "Edit", active: true }
        ]}
        primaryAction={{
          label: "Save Changes",
          icon: Save,
          onClick: () => formRef.current?.handleSave(),
          disabled: updateProductMutation.isPending
        }}
      />

      {isProductLoading ? (
        <div className="h-[60vh] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-zinc-100 border-t-black rounded-full animate-spin"></div>
        </div>
      ) : (
        <ProductForm 
          ref={formRef}
          initialData={productData?.data}
          onSubmit={handleSave}
          isPending={updateProductMutation.isPending}
        />
      )}
    </div>
  );
}
