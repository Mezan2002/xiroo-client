"use client";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import ProductForm from "@/components/admin/products/ProductForm";
import { useRef } from "react";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const formRef = useRef();

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: productData, isLoading: isProductLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await apiRequest(`/products/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const updateProductMutation = useMutation({
    mutationFn: (data) => apiRequest(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      toast.success("Product Registry Specification Reconfigured.");
      queryClient.invalidateQueries(["product", id]);
      queryClient.invalidateQueries(["products"]);
      router.push("/admin/products");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update registry.");
    }
  });

  const handleSave = (payload) => {
    updateProductMutation.mutate(payload);
  };

  return (
    <div className="space-y-24 font-montserrat antialiased text-zinc-900 animate-in fade-in duration-700">
      <ModuleHeader
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
          initialData={productData}
          onSubmit={handleSave}
          isPending={updateProductMutation.isPending}
        />
      )}
    </div>
  );
}
