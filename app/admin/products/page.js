"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import DataTable from "@/components/admin/shared/DataTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Select } from "@/components/ui/Select";
import { Plus, Package, Search } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useProducts } from "@/hooks/api/useProducts";
import { useCategories } from "@/hooks/api/useCategories";
import Image from "next/image";

const PAGE_LIMIT = 10;

export default function AdminInventory() {
  const router = useRouter();
  const { toast } = useToast();
  const { useAllProducts, useProductMutation } = useProducts();
  const { useCategoryTree } = useCategories();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");

  const { data: categories = [] } = useCategoryTree();

  const queryParams = useMemo(() => {
    const params = { page: currentPage, limit: PAGE_LIMIT };
    if (searchTerm) params.searchTerm = searchTerm;
    if (categoryFilter) params.category = categoryFilter;
    if (subCategoryFilter) params.subCategory = subCategoryFilter;
    if (stockFilter) params.inStock = stockFilter;
    return params;
  }, [currentPage, searchTerm, categoryFilter, subCategoryFilter, stockFilter]);

  const { data: response, isLoading } = useAllProducts(queryParams);
  const products = response?.data || [];
  const meta = response?.meta || {};
  const totalPages = meta.totalPage || 1;

  const { deleteMutation } = useProductMutation();

  const subCategoryOptions = useMemo(() => {
    if (!categoryFilter) return [];
    return categories.filter(
      (c) => c.parentId && c.parentId.toString() === categoryFilter
    );
  }, [categories, categoryFilter]);

  const categorySelectOptions = useMemo(() => {
    return categories
      .filter((c) => !c.parentId)
      .map((c) => ({ value: c._id, label: c.name }));
  }, [categories]);

  const subCategorySelectOptions = useMemo(() => {
    return subCategoryOptions.map((c) => ({ value: c._id, label: c.name }));
  }, [subCategoryOptions]);

  const stockSelectOptions = [
    { value: "", label: "All Stock" },
    { value: "true", label: "In Stock" },
    { value: "false", label: "Out of Stock" },
  ];

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEdit = (product) => {
    router.push(`/admin/products/${product._id}`);
  };

  const handleView = (product) => {
    router.push(`/admin/products/${product._id}/details`);
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
          // If we deleted the last item on a page > 1, go back one page
          if (products.length === 1 && currentPage > 1) {
            setCurrentPage((p) => p - 1);
          }
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
      width: "300px",
      render: (row) => (
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="w-10 h-10 bg-[#F7F7F5] relative shrink-0 rounded-sm overflow-hidden border border-[#EDECE9]">
            {row.images?.[0] && (
              <Image src={row.images[0]} alt="" fill className="object-cover" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-medium text-[#37352F] line-clamp-1 truncate" title={row.title}>{row.title}</span>
            <span className="text-[11px] text-[#37352F80] truncate">{row.category?.name || "Unclassified"}</span>
          </div>
        </div>
      )
    },
    { key: "sku", label: "SKU", type: "text", mono: true, width: "140px" },
    { 
      key: "isActive", 
      label: "Status", 
      width: "120px",
      render: (row) => {
        const stock = Number(row.inventory) || 0;
        const isOut = stock <= 0 || row.stockStage === "out-of-stock";
        return (
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${
            isOut ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
          }`}>
            {isOut ? 'Out of Stock' : 'In Stock'}
          </span>
        );
      }
    },
    { 
      key: "price", 
      label: "Price", 
      width: "120px",
      render: (row) => {
        const now = new Date();
        const hasActiveSale = row.salePrice && row.salePrice > 0 && (!row.saleEndDate || new Date(row.saleEndDate) > now);
        return (
          <div className="flex flex-col">
            {hasActiveSale ? (
              <>
                <span className="text-[13px] font-medium text-zinc-400 line-through">৳{row.price?.toLocaleString()}</span>
                <span className="text-[13px] font-bold text-emerald-600">৳{row.salePrice?.toLocaleString()}</span>
              </>
            ) : (
              <span className="text-[13px] font-medium">৳{row.price?.toLocaleString()}</span>
            )}
          </div>
        );
      }
    },
    { 
      key: "inventory", 
      label: "Stock Quantity", 
      width: "140px",
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
        title="Product Inventory" 
        icon={Package}
        primaryAction={{
          label: "Add Product",
          icon: Plus,
          onClick: () => router.push("/admin/products/new")
        }}
      />

      {/* Filter Bar */}
      <div className="bg-white border border-zinc-200 p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full h-10 pl-10 pr-4 bg-white border border-zinc-200 focus:border-zinc-400 outline-none text-[12px] font-medium rounded-md transition-colors"
          />
        </div>
        <div className="flex gap-3">
          <div className="w-44">
            <Select
              options={[{ value: "", label: "All Categories" }, ...categorySelectOptions]}
              value={categoryFilter}
              onChange={(val) => {
                setCategoryFilter(val);
                setSubCategoryFilter("");
                setCurrentPage(1);
              }}
              placeholder="All Categories"
            />
          </div>
          {subCategorySelectOptions.length > 0 && (
            <div className="w-44">
              <Select
                options={[{ value: "", label: "All Sub-Categories" }, ...subCategorySelectOptions]}
                value={subCategoryFilter}
                onChange={(val) => { setSubCategoryFilter(val); setCurrentPage(1); }}
                placeholder="All Sub-Categories"
              />
            </div>
          )}
          <div className="w-36">
            <Select
              options={stockSelectOptions}
              value={stockFilter}
              onChange={(val) => { setStockFilter(val); setCurrentPage(1); }}
              placeholder="All Stock"
            />
          </div>
        </div>
      </div>

      <DataTable 
        columns={COLUMNS}
        data={products}
        loading={isLoading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        pagination={{
          currentPage,
          totalPages,
          total: meta.total || 0,
          limit: PAGE_LIMIT,
          onPageChange: setCurrentPage,
        }}
      />

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteMutation.isPending}
        title="Delete Product?"
        message={`Are you sure you want to delete "${selectedProduct?.title}"? This action is permanent and cannot be undone.`}
      />
    </div>
  );
}
