"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import DataTable from "@/components/admin/shared/DataTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Plus, Package } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useProducts } from "@/hooks/api/useProducts";

export default function AdminInventory() {
  const router = useRouter();
  const { toast } = useToast();
  const { useAllProducts, useProductMutation } = useProducts();
  const { data: products = [], isLoading } = useAllProducts();
  const { deleteMutation } = useProductMutation();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEdit = (product) => {
    router.push(`/admin/products/${product._id}`);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProduct) {
      deleteMutation.mutate(selectedProduct._id, {
        onSuccess: () => {
          toast.success("Product Registry Deactivated.");
          setIsDeleteModalOpen(false);
        },
        onError: (err) => {
          toast.error(err.message || "Failed to terminate registry.");
        }
      });
    }
  };


  const COLUMNS = useMemo(() => [
    { 
      key: "images", 
      label: "Product", 
      type: "image", 
      titleKey: "title",
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#F7F7F5] relative shrink-0 rounded-sm overflow-hidden border border-[#EDECE9]">
            {row.images?.[0] && (
              <img src={row.images[0]} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-[#37352F] line-clamp-1">{row.title}</span>
            <span className="text-[11px] text-[#37352F80]">{row.category?.name || "Unclassified"}</span>
          </div>
        </div>
      )
    },
    { key: "sku", label: "SKU", type: "text", mono: true },
    { 
      key: "isActive", 
      label: "Status", 
      render: (row) => (
        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${
          row.inventory > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
        }`}>
          {row.inventory > 0 ? 'In Stock' : 'Out of Stock'}
        </span>
      )
    },
    { 
      key: "price", 
      label: "Price", 
      render: (row) => <span className="text-[13px] font-medium">৳{row.price?.toLocaleString()}</span>
    },
    { 
      key: "inventory", 
      label: "Registry Count", 
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[13px] font-mono">{row.inventory} Units</span>
          <span className="text-[10px] text-zinc-400 uppercase tracking-tighter">Availability</span>
        </div>
      )
    },
    { key: "actions", label: "Actions", type: "actions", align: "right" },
  ], []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <ModuleHeader 
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Products", active: true }
        ]}
        title="Inventory Registry" 
        icon={Package}
        primaryAction={{
          label: "Add Product",
          icon: Plus,
          onClick: () => router.push("/admin/products/new")
        }}
      />
      
      <DataTable 
        columns={COLUMNS}
        data={products}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteMutation.isPending}
        title="Terminate Registry?"
        message={`Are you sure you want to delete "${selectedProduct?.title}"? This protocol is permanent and will remove all associated architectural data.`}
      />
    </div>
  );
}
