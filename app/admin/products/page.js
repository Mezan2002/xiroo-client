"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import DataTable from "@/components/admin/shared/DataTable";
import ConfirmModal from "@/components/admin/shared/ConfirmModal";
import { Plus, Package } from "lucide-react";

const MOCK_PRODUCTS = [
  {
    id: "1",
    title: "Xiroo™ Minimalist LED String Cap Lamp",
    sku: "XR-LMP-01",
    price: "৳350",
    stock: 42,
    category: "Lighting",
    image: "/images/image-2.jpeg",
    status: "Active"
  },
  {
    id: "2",
    title: "Xiroo™ 4-in-1 Travel Dispensing Bottles",
    sku: "XR-BTL-04",
    price: "৳2,150",
    stock: 15,
    category: "Travel",
    image: "/images/featured-product-main.png",
    status: "Active"
  },
  {
    id: "3",
    title: "Matte Black Core Base Lamp",
    sku: "XR-LMP-02",
    price: "৳490",
    stock: 0,
    category: "Lighting",
    image: "/images/product-coffee-1.png",
    status: "Out of Stock"
  }
];

const COLUMNS = [
  { key: "image", label: "Product", type: "image", titleKey: "title", subTitleKey: "category" },
  { key: "sku", label: "SKU", type: "text", mono: true },
  { key: "status", label: "Status", type: "status" },
  { key: "price", label: "Price", type: "text" },
  { key: "stock", label: "Stock", type: "text" },
  { key: "actions", label: "Actions", type: "actions", align: "right" },
];

export default function AdminInventory() {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEdit = (product) => {
    router.push(`/admin/product/${product.id}/edit`);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log("Deleting product:", selectedProduct);
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6">
      <ModuleHeader 
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Products", active: true }
        ]}
        title="Products" 
        icon={Package}
        primaryAction={{
          label: "Add Product",
          icon: Plus,
          onClick: () => router.push("/admin/product/new")
        }}
      />
      
      <DataTable 
        columns={COLUMNS}
        data={MOCK_PRODUCTS}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product?"
        message={`Are you sure you want to delete "${selectedProduct?.title}"? This action is permanent and will remove all associated data.`}
      />
    </div>
  );
}
