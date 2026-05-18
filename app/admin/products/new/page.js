"use client";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { Package, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { useProducts } from "@/hooks/api/useProducts";
import ProductForm from "@/components/admin/products/ProductForm";
import { useRef } from "react";

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const formRef = useRef();
  const { useProductMutation } = useProducts();
  const { createMutation: createProductMutation } = useProductMutation();

  const handleSave = (payload) => {
    createProductMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Product Registry Synchronized Successfully.");
        router.push("/admin/products");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to synchronize registry.");
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
          { label: "New", active: true }
        ]}
        title="New Register"
        icon={Package}
        primaryAction={{
          label: "Save Changes",
          icon: Save,
          onClick: () => formRef.current?.handleSave(),
          disabled: createProductMutation.isPending
        }}
      />

      <ProductForm 
        ref={formRef}
        onSubmit={handleSave}
        isPending={createProductMutation.isPending}
      />
    </div>
  );
}
